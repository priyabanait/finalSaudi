

import axios from 'axios';
import Agent from '../models/Agent.js';

export const syncAgentsFromKWPeople = async (req, res) => {
  try {
    // 1. Input: Org ID and filters
    const org_id = req.params.org_id;
    console.log('Requested org_id:', org_id);
    const activeFilter = req.query.active;
    const page = Number(req.query.page ?? 1);
    const perPage = req.query.limit ? Number(req.query.limit) : 50;

    if (!org_id) {
      return res.status(400).json({ success: false, message: 'Missing route param: org_id' });
    }

    // 2. Headers and base URL
    const headers = {
      Authorization: 'Basic b2FoNkRibjE2dHFvOE52M0RaVXk0NHFVUXAyRjNHYjI6eHRscnJmNUlqYVZpckl3Mg==',
      Accept: 'application/json',
    };
    const baseURL = `https://partners.api.kw.com/v2/listings/orgs/${org_id}/people`;

    // 3. Fetch all pages (if API supports offset-based pagination)
    let allPeople = [];
    let offset = 0;
    const apiLimit = req.query.limit ? Number(req.query.limit) : undefined;
    let first = true;
    let totalCount = 0;

    do {
      let url = `${baseURL}?page[offset]=${offset}`;
      if (apiLimit !== undefined) url += `&page[limit]=${apiLimit}`;
      console.log('Calling KW API URL:', url);
      const response = await axios.get(url, { headers });
       console.log('KW People API Response:', JSON.stringify(response.data, null, 2));

      // Try to get people from different possible keys
      let peoplePage = [];
      if (Array.isArray(response.data?.people)) {
        peoplePage = response.data.people;
      } else if (Array.isArray(response.data?.results)) {
        peoplePage = response.data.results;
      } else if (Array.isArray(response.data?.data)) {
        peoplePage = response.data.data;
      } else {
        console.warn('KW API returned no recognizable people array.');
      }

      if (first) {
        totalCount = response.data?.pagination?.total ?? peoplePage.length;
        first = false;
      }

      if (!Array.isArray(peoplePage)) break;
      if (peoplePage.length === 0) {
        console.warn('KW API returned an empty people array for this page.');
      }
      allPeople = allPeople.concat(peoplePage);
      console.log("Total people received from KW so far:", allPeople.length);
      if (allPeople.length > 0) {
        console.log("First person sample:", allPeople[0]);
      }

      offset += apiLimit;
    } while (offset < totalCount);

    // 4. Filter by `active` if present
    if (activeFilter !== undefined) {
  const isActive = activeFilter === 'true';
  allPeople = allPeople.filter(p => (p.active !== false) === isActive);
  console.log(`After active filter (${isActive}):`, allPeople.length);
}

    // 5. If no people found, return early
    if (allPeople.length === 0) {
      console.warn('No agents found in KW API for org_id:', org_id);
      return res.status(200).json({
        success: true,
        message: 'No agents found in KW API for this org_id.',
        org_id,
        data: [],
        total: 0,
      });
    }

    // 6. Sync to DB
    const syncedAgents = [];
    for (const person of allPeople) {
      const {
        kw_uid,
         // <-- use this
        first_name,
        last_name,
        photo,
        email,
        phone,
        market_center_number,
        city,
        active,
        slug,
      } = person;

      if (!kw_uid || !first_name) {
        console.warn('Skipping person due to missing kw_uid or first_name:', person);
        continue;
      }

      const generatedSlug = slug || kw_uid.toString().toLowerCase();

      const agentData = {
        slug: generatedSlug,
        kwId: kw_uid,
        fullName: `${first_name} ${last_name || ''}`.trim(),
        lastName: last_name || '',
        email: email || '',
        phone: phone || '',
        marketCenter: market_center_number || '',
        city: city || '',
        active: active !== false,
        photo: photo || '',
      };

      try {
      const updatedAgent = await Agent.findOneAndUpdate(
        { slug: generatedSlug },
        agentData,
        { new: true, upsert: true, runValidators: true }
      );
      syncedAgents.push(updatedAgent);
      } catch (dbErr) {
        console.error('Error syncing agent to DB:', dbErr.message, agentData);
      }
    }

    // 7. Paginate response
    const paginated = syncedAgents.slice((page - 1) * perPage, page * perPage);

    // 8. Send response
    if (syncedAgents.length === 0) {
      console.warn('No agents were saved to the database for org_id:', org_id);
      return res.status(200).json({
        success: true,
        message: 'No agents were saved to the database for this org_id.',
        org_id,
        total: 0,
        page,
        per_page: perPage,
        count: 0,
        data: [],
      });
    }
    res.status(200).json({
      success: true,
     org_id,
      total: syncedAgents.length,
      page,
      per_page: perPage,
      count: paginated.length,
      data: paginated,
    });

  } catch (error) {
    console.error('KW People Sync Error:', error?.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to sync agents',
      error: error.message,
    });
  }
};

export const syncAgentsFromMultipleKWPeople = async (req, res) => {
  try {
    const orgIds = ['50449', '2414288'];
    const activeFilter = req.query.active;
    const page = Number(req.query.page ?? 1);
    const perPage = req.query.limit ? Number(req.query.limit) : 50;
    let allPeople = [];

    for (const org_id of orgIds) {
      const headers = {
        Authorization: 'Basic b2FoNkRibjE2dHFvOE52M0RaVXk0NHFVUXAyRjNHYjI6eHRscnJmNUlqYVZpckl3Mg==',
        Accept: 'application/json',
      };
      const baseURL = `https://partners.api.kw.com/v2/listings/orgs/${org_id}/people`;
      let offset = 0;
      const apiLimit = req.query.limit ? Number(req.query.limit) : undefined;
      let first = true;
      let totalCount = 0;
      do {
        let url = `${baseURL}?page[offset]=${offset}`;
        if (apiLimit !== undefined) url += `&page[limit]=${apiLimit}`;
        const response = await axios.get(url, { headers });
        let peoplePage = [];
        if (Array.isArray(response.data?.people)) {
          peoplePage = response.data.people;
        } else if (Array.isArray(response.data?.results)) {
          peoplePage = response.data.results;
        } else if (Array.isArray(response.data?.data)) {
          peoplePage = response.data.data;
        }
        if (first) {
          totalCount = response.data?.pagination?.total ?? peoplePage.length;
          first = false;
        }
        if (!Array.isArray(peoplePage)) break;
        allPeople = allPeople.concat(peoplePage);
        offset += apiLimit;
      } while (offset < totalCount);
    }

    // Filter by active if present
    if (activeFilter !== undefined) {
      const isActive = activeFilter === 'true';
      allPeople = allPeople.filter(p => (p.active !== false) === isActive);
    }

    // Remove duplicates by slug (or kw_uid if slug missing)
    const seen = new Set();
    const uniquePeople = [];
    for (const person of allPeople) {
      const slug = person.slug || (person.kw_uid ? person.kw_uid.toString().toLowerCase() : undefined);
      if (slug && !seen.has(slug)) {
        seen.add(slug);
        uniquePeople.push(person);
      }
    }

    // Sync to DB
    const syncedAgents = [];
    for (const person of uniquePeople) {
      const {
        kw_uid,
        first_name,
        last_name,
        photo,
        email,
        phone,
        market_center_number,
        city,
        active,
        slug,
      } = person;
      if (!kw_uid || !first_name) continue;
      const generatedSlug = slug || kw_uid.toString().toLowerCase();
      const agentData = {
        slug: generatedSlug,
        kwId: kw_uid,
        fullName: `${first_name} ${last_name || ''}`.trim(),
        lastName: last_name || '',
        email: email || '',
        phone: phone || '',
        marketCenter: market_center_number || '',
        city: city || '',
        active: active !== false,
        photo: photo || '',
      };
      try {
        const updatedAgent = await Agent.findOneAndUpdate(
          { slug: generatedSlug },
          agentData,
          { new: true, upsert: true, runValidators: true }
        );
        syncedAgents.push(updatedAgent);
      } catch (dbErr) {
        // skip DB errors for now
      }
    }

    // Paginate response
    const paginated = syncedAgents.slice((page - 1) * perPage, page * perPage);
    res.status(200).json({
      success: true,
      org_ids: orgIds,
      total: syncedAgents.length,
      page,
      per_page: perPage,
      count: paginated.length,
      data: paginated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to sync agents from multiple orgs',
      error: error.message,
    });
  }
};

// Get filtered agents with pagination
export const getFilteredAgents = async (req, res) => {
  try {
    const { name, marketCenter, city, page = 1, limit = 10 } = req.query;
    const filter = { isAgent: true }; // Only return actual agents, not form submissions

    if (name) {
      filter.fullName = { $regex: name, $options: 'i' };
    }
    if (marketCenter && marketCenter !== "MARKET CENTER") {
      filter.marketCenter = { $regex: `^${marketCenter}$`, $options: 'i' };
    }
    if (city && city !== "CITY" && city !== "RESET_ALL") {
      filter.city = { $regex: `^${city}$`, $options: 'i' };
    }

    console.log('Agent filter:', filter); // Debug log

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Agent.countDocuments(filter);
    const agents = await Agent.find(filter)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      total,
      page: parseInt(page),
      count: agents.length,
      data: agents,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get leads data from agents for the frontend
export const getLeadsFromAgents = async (req, res) => {
  try {
    console.log('getLeadsFromAgents called');
    
    // Get all agents and form submissions from database
    const allData = await Agent.find({}).sort({ createdAt: -1 });
    console.log(`Found ${allData.length} total records`);
    
    // Transform data into leads format with error handling
    const leads = allData.map(item => {
      try {
        if (item.isAgent) {
          // This is an agent
          let formType = ''; // default
          
          if (item.marketCenter && item.marketCenter.includes('Jasmin')) {
            formType = 'jasmin';
          } else if (item.marketCenter && item.marketCenter.includes('Jeddah')) {
            formType = 'jeddah';
          } 
          
          return {
            _id: item._id,
            fullName: item.fullName || '',
            email: item.email || '',
            mobileNumber: item.phone || '',
            city: item.city || '',
            formType: formType,
            message: `Agent from ${item.marketCenter || 'KW Saudi Arabia'}`,
            createdAt: item.createdAt,
            isAgent: true
          };
        } else {
          // This is a form submission
          return {
            _id: item._id,
            formType: item.formType || '',
            createdAt: item.createdAt,
            isAgent: false,
            // Include form-specific fields with null checks
            ...(item.fullName && { fullName: item.fullName }),
            ...(item.fullname && { fullname: item.fullname }),
            ...(item.email && { email: item.email }),
            ...(item.mobileNumber && { mobileNumber: item.mobileNumber }),
            ...(item.city && { city: item.city }),
            ...(item.message && { message: item.message }),
            ...(item.address && { address: item.address }),
            ...(item.bedrooms && { bedrooms: item.bedrooms }),
            ...(item.property_type && { property_type: item.property_type }),
            ...(item.valuation_type && { valuation_type: item.valuation_type }),
            ...(item.dob && { dob: item.dob }),
            ...(item.educationStatus && { educationStatus: item.educationStatus }),
            ...(item.promotionalConsent !== undefined && { promotionalConsent: item.promotionalConsent }),
            ...(item.personalDataConsent !== undefined && { personalDataConsent: item.personalDataConsent }),
            ...(item.enquiryType && { enquiryType: item.enquiryType })
          };
        }
      } catch (itemError) {
        console.error('Error processing item:', item._id, itemError);
        // Return a minimal safe object for this item
        return {
          _id: item._id,
          formType: 'unknown',
          createdAt: item.createdAt || new Date(),
          isAgent: false,
          error: 'Failed to process this record'
        };
      }
    });
    
    console.log(`Transformed ${leads.length} records to leads`);
    
    res.json(leads);
  } catch (err) {
    console.error('Error fetching leads from agents:', err);
    res.status(500).json({ 
      error: 'Failed to fetch leads',
      message: err.message 
    });
  }
};

export const fetchPropertiesWithAgents = async (req, res) => {
  try {
    // 1. Input: org_id, single agent and pagination
    const orgId = req.body.org_id || req.query.org_id; // Dynamic org_id from request
    const singleAgent = req.body.singleAgent || req.query.singleAgent; // kw_uid for single agent
    const page = Number(req.body.page ?? req.query.page ?? 1);
    const perPage = Number(req.body.limit ?? req.query.limit ?? 50);
    
    console.log('Org ID requested:', orgId);
    console.log('Single agent requested:', singleAgent);
    console.log('Page:', page, 'Per page:', perPage);

    // Validate pagination parameters
    if (page < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page number must be greater than 0',
        error: 'Invalid page parameter'
      });
    }
    
    if (perPage < 1 || perPage > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Per page limit must be between 1 and 1000',
        error: 'Invalid per_page parameter'
      });
    }

    // 2. Define org_ids based on request or use default
    let orgIds = [];
    if (orgId && orgId !== '' && orgId !== null && orgId !== undefined) {
      // If specific org_id provided, use only that
      orgIds = [Number(orgId)];
    } else {
      // If no org_id provided, use default market centers
      orgIds = [2414288, 50449]; // Jeddah and Jasmin
    }
    
    console.log('Using org_ids:', orgIds);

    // 3. Headers for API calls
    const headers = {
      Authorization: 'Basic b2FoNkRibjE2dHFvOE52M0RaVXk0NHFVUXAyRjNHYjI6eHRscnJmNUlqYVZpckl3Mg==',
      Accept: 'application/json',
    };

    // 4. Fetch agents from specified org_ids
    console.log('Fetching agents from org_ids:', orgIds);
    let allAgents = [];
    
    for (const currentOrgId of orgIds) {
      console.log(`Fetching agents from org_id: ${currentOrgId}`);
      const baseURL = `https://partners.api.kw.com/v2/listings/orgs/${currentOrgId}/people`;
      
      let offset = 0;
      const apiLimit = 1000;
      let totalCount = 0;
      let first = true;

      do {
        const url = `${baseURL}?page[offset]=${offset}&page[limit]=${apiLimit}`;
        console.log('Calling KW Agents API:', url);
        
        try {
          const response = await axios.get(url, { headers });
          
          // Try to get people from different possible keys
          let agentsPage = [];
          if (Array.isArray(response.data?.people)) {
            agentsPage = response.data.people;
          } else if (Array.isArray(response.data?.results)) {
            agentsPage = response.data.results;
          } else if (Array.isArray(response.data?.data)) {
            agentsPage = response.data.data;
          }

          if (first) {
            totalCount = response.data?.pagination?.total ?? agentsPage.length;
            first = false;
          }

          if (!Array.isArray(agentsPage)) break;
          
          // Add org_id to each agent for tracking
          const agentsWithOrgId = agentsPage.map(agent => ({
            ...agent,
            source_org_id: currentOrgId
          }));
          
          allAgents = allAgents.concat(agentsWithOrgId);
          console.log(`Agents from org ${currentOrgId}:`, agentsWithOrgId.length);

          offset += apiLimit;
        } catch (orgError) {
          console.error(`Error fetching agents from org ${currentOrgId}:`, orgError.message);
          break;
        }
      } while (offset < totalCount);
    }

    console.log('Total agents fetched:', allAgents.length);

    // 5. Filter agents by single_agent if provided
    let filteredAgents = allAgents;
    if (singleAgent !== null && singleAgent !== undefined && singleAgent !== '') {
      const kwUid = String(singleAgent);
      filteredAgents = allAgents.filter(agent => String(agent.kw_uid) === kwUid);
      console.log(`After single agent filter (${kwUid}):`, filteredAgents.length);
    }

    // 6. Fetch property listings from region API
    console.log('Fetching property listings from region API...');
    let allListings = [];
    let listingsOffset = 0;
    const listingsApiLimit = 100;
    let listingsTotal = 0;
    let listingsFirst = true;

    do {
      const listingsURL = `https://partners.api.kw.com/v2/listings/region/50394?page[offset]=${listingsOffset}&page[limit]=${listingsApiLimit}`;
      console.log('Calling KW Listings API:', listingsURL);
      
      try {
        const listingsResponse = await axios.get(listingsURL, { headers });
        const hits = listingsResponse.data?.hits?.hits ?? [];
        
        const listings = hits.map(hit => ({
          ...hit._source,
          _kw_meta: { id: hit._id, score: hit._score ?? null },
        }));
        
        allListings = allListings.concat(listings);
        
        if (listingsFirst) {
          listingsTotal = listingsResponse.data?.hits?.total?.value ?? 0;
          listingsFirst = false;
        }
        
        console.log(`Listings batch: ${listings.length}, Total so far: ${allListings.length}`);
        listingsOffset += listingsApiLimit;
      } catch (listingsError) {
        console.error('Error fetching listings:', listingsError.message);
        break;
      }
    } while (listingsOffset < listingsTotal);

    console.log('Total listings fetched:', allListings.length);

    // 7. Apply property filters (same as main listing function)
    const allowedListStatuses = ['Active', 'Sold', 'Rented/Leased'];
    const allowedListCategories = ['For Sale', 'Sold', 'Rented/Leased'];
    const blockedStatuses = ['Expired', 'Pending', 'Withdrawn', 'Cancelled', 'Off Market'];
    const blockedCategories = ['Off Market', 'Pending', 'Withdrawn', 'Cancelled', 'Expired'];

    const filteredListings = allListings.filter(item => {
      // Get all possible status fields
      const listStatus = item.list_status || '';
      const status = item.status || '';
      const propertyStatus = item.property_status || '';
      
      // Get all possible category fields  
      const listCategory = item.list_category || '';
      const category = item.category || '';
      
      // Check if ANY status field contains blocked values
      const hasBlockedStatus = blockedStatuses.some(blocked => 
        listStatus === blocked || 
        status === blocked || 
        propertyStatus === blocked
      );
      
      // Check if ANY category field contains blocked values
      const hasBlockedCategory = blockedCategories.some(blocked =>
        listCategory === blocked ||
        category === blocked
      );
      
      // EXCLUDE if it has any blocked status or category
      if (hasBlockedStatus || hasBlockedCategory) {
        return false;
      }
      
      // Only INCLUDE if it has allowed status AND allowed category
      const hasAllowedStatus = allowedListStatuses.includes(listStatus) || 
                              allowedListStatuses.includes(status) || 
                              allowedListStatuses.includes(propertyStatus);
                              
      const hasAllowedCategory = allowedListCategories.includes(listCategory) ||
                                allowedListCategories.includes(category);
      
      return hasAllowedStatus && hasAllowedCategory;
    });

    console.log('Filtered listings (after status/category filter):', filteredListings.length);

    // 8. Filter properties by single_agent if provided
    let agentProperties = filteredListings;
    if (singleAgent !== null && singleAgent !== undefined && singleAgent !== '') {
      const kwUid = String(singleAgent);
      agentProperties = filteredListings.filter(property => {
        const listKwUid = property.list_kw_uid || property.listing_agent_kw_uid || property.agent_kw_uid || '';
        return String(listKwUid) === kwUid;
      });
      console.log(`Properties for agent ${kwUid}:`, agentProperties.length);
    }

    // 9. Prepare agent data for response
    const agentData = filteredAgents.map(agent => ({
      kw_uid: agent.kw_uid,
      first_name: agent.first_name,
      last_name: agent.last_name,
      full_name: `${agent.first_name} ${agent.last_name || ''}`.trim(),
      email: agent.email || '',
      phone: agent.phone || '',
      market_center_number: agent.market_center_number || '',
      city: agent.city || '',
      active: agent.active !== false,
      photo: agent.photo || '',
      source_org_id: agent.source_org_id
    }));

    // 10. Calculate pagination for properties
    const totalProperties = agentProperties.length;
    const totalPages = Math.ceil(totalProperties / perPage);
    
    // Check if requested page exceeds total pages
    if (page > totalPages && totalPages > 0) {
      return res.status(400).json({
        success: false,
        message: `Page ${page} does not exist. Total pages available: ${totalPages}`,
        error: 'Page out of range',
        total_pages: totalPages,
        total_properties: totalProperties
      });
    }

    // 11. Paginate properties
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedProperties = agentProperties.slice(startIndex, endIndex);

    // 12. Send comprehensive response
    const response = {
      success: true,
      org_id: orgId || null, // Include the org_id used in response
      single_agent: singleAgent,
      org_ids_used: orgIds, // Show which org_ids were actually used
      agents: {
        total: agentData.length,
        data: agentData
      },
      properties: {
        pagination: {
          current_page: page,
          per_page: perPage,
          total_items: totalProperties,
          total_pages: totalPages,
          has_next_page: page < totalPages,
          has_prev_page: page > 1,
          next_page: page < totalPages ? page + 1 : null,
          prev_page: page > 1 ? page - 1 : null,
          start_index: startIndex + 1,
          end_index: Math.min(endIndex, totalProperties)
        },
        count: paginatedProperties.length,
        data: paginatedProperties
      }
    };

    console.log('Response summary:', {
      org_id_requested: orgId,
      org_ids_used: orgIds,
      agents_count: agentData.length,
      properties_total: totalProperties,
      properties_page: paginatedProperties.length,
      single_agent: singleAgent
    });

    res.status(200).json(response);

  } catch (error) {
    console.error('Properties fetch error:', error?.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch properties data',
      error: error.message,
    });
  }
};
// export const getLeadsFromAgents = async (req, res) => {
//   try {
//     console.log('getLeadsFromAgents called');

//     // Get only Jasmin and Jeddah agents + form submissions
//     const allData = await Agent.find({
//       $or: [
//         { marketCenter: { $regex: "Jasmin", $options: "i" } },
//         { marketCenter: { $regex: "Jeddah", $options: "i" } }
//       ]
//     }).sort({ createdAt: -1 });

//     console.log(`Found ${allData.length} Jasmin/Jeddah records`);

//     // Transform into leads format
//     const leads = allData.map(item => {
//       if (item.isAgent) {
//         // Agent record
//         let formType = "contact-us";

//         if (item.marketCenter && item.marketCenter.includes("Jasmin")) {
//           formType = "jasmin";
//         } else if (item.marketCenter && item.marketCenter.includes("Jeddah")) {
//           formType = "jeddah";
//         }

//         return {
//           _id: item._id,
//           fullName: item.fullName,
//           email: item.email,
//           mobileNumber: item.phone,
//           city: item.city,
//           formType: formType,
//           message: `Agent from ${item.marketCenter}`,
//           createdAt: item.createdAt,
//           isAgent: true,
//         };
//       } else {
//         // Form submission record
//         return {
//           _id: item._id,
//           formType: item.formType,
//           createdAt: item.createdAt,
//           isAgent: false,
//           ...(item.fullName && { fullName: item.fullName }),
//           ...(item.fullname && { fullname: item.fullname }),
//           ...(item.email && { email: item.email }),
//           ...(item.mobileNumber && { mobileNumber: item.mobileNumber }),
//           ...(item.city && { city: item.city }),
//           ...(item.message && { message: item.message }),
//           ...(item.address && { address: item.address }),
//           ...(item.bedrooms && { bedrooms: item.bedrooms }),
//           ...(item.property_type && { property_type: item.property_type }),
//           ...(item.valuation_type && { valuation_type: item.valuation_type }),
//           ...(item.dob && { dob: item.dob }),
//           ...(item.educationStatus && { educationStatus: item.educationStatus }),
//           ...(item.promotionalConsent !== undefined && { promotionalConsent: item.promotionalConsent }),
//           ...(item.personalDataConsent !== undefined && { personalDataConsent: item.personalDataConsent }),
//           ...(item.enquiryType && { enquiryType: item.enquiryType }),
//         };
//       }
//     });

//     console.log(`Transformed ${leads.length} Jasmin/Jeddah leads`);

//     res.json(leads);
//   } catch (err) {
//     console.error("Error fetching leads from agents:", err);
//     res.status(500).json({
//       error: "Failed to fetch leads",
//       message: err.message,
//     });
//   }
// };

// Create a new lead from form submission
export const createLead = async (req, res) => {
  try {
    // Validate that req.body exists and is an object
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body. Expected JSON object.'
      });
    }
    
    console.log('Creating new lead from form submission:', req.body);
    console.log('Form type:', req.body.formType);
    console.log('All form fields:', Object.keys(req.body));
    console.log('Individual field values:', {
      city: req.body.city,
      fullname: req.body.fullname,
      mobileNumber: req.body.mobileNumber,
      bedrooms: req.body.bedrooms,
      property_type: req.body.property_type,
      valuation_type: req.body.valuation_type
    });
    
    let {
      formType,
      // Instant Valuation fields
      city,
      fullname,
      mobileNumber,
      bedrooms,
      property_type,
      valuation_type,
      // Jasmin/Jeddah fields
      fullName,
      email,
      message,
      // Franchise fields
      dob,
      educationStatus,
      promotionalConsent,
      personalDataConsent,
      // Contact Us fields
      enquiryType
    } = req.body;

    // Validate required fields based on form type
    let validationError = null;
    
    if (formType === 'jasmin' || formType === 'jeddah') {
      if (!fullName || !mobileNumber || !email || !city || !message) {
        validationError = 'Full name, mobile number, email, city, and message are required for Jasmin/Jeddah forms';
      }
    } else if (formType === 'instant-valuation') {
      console.log('Validating instant-valuation form with values:', {
        city: city, fullname: fullname, mobileNumber: mobileNumber,
        bedrooms: bedrooms, property_type: property_type, valuation_type: valuation_type
      });
      if (!city || !fullname || !mobileNumber || !bedrooms || !property_type || !valuation_type) {
        validationError = 'City, fullname, mobileNumber, bedrooms, property type, and valuation type are required for instant valuation forms';
      }
      // For instant valuation, generate a default email if not provided
      if (!email) {
        email = `instant-valuation-${Date.now()}@example.com`;
      }
    } else if (formType === 'join-us') {
      if (!fullName || !mobileNumber || !email || !city || !message) {
        validationError = 'Full name, mobile number, email, city, and message are required for Join Us forms';
      }
    } else if (formType === 'franchise') {
      if (!fullName || !mobileNumber || !email || !city || !dob || !educationStatus || !message || promotionalConsent === undefined || personalDataConsent === undefined) {
        validationError = 'Full name, mobile number, email, city, date of birth, education status, message, promotional consent, and personal data consent are required for franchise forms';
      }
    } else if (formType === 'contact-us') {
      if (!fullName || !mobileNumber || !email || !enquiryType || !message) {
        validationError = 'Full name, mobile number, email, enquiry type, and message are required for contact us forms';
      }
    } else {
      validationError = 'Invalid form type. Must be one of: jasmin, jeddah, instant-valuation, join-us, franchise, contact-us';
    }

    if (validationError) {
      console.log('Validation error:', validationError);
      console.log('Received data:', { city, fullname, mobileNumber, bedrooms, property_type, valuation_type });
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    // Generate slug based on form type with timestamp to ensure uniqueness
    let slug;
    const timestamp = Date.now();
    if (formType === 'jasmin' || formType === 'jeddah') {
      slug = `${fullName}-${city}-${timestamp}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    } else if (formType === 'instant-valuation') {
      slug = `${fullname}-${city}-${timestamp}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    } else if (formType === 'join-us') {
      slug = `${fullName}-${city}-${timestamp}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    } else if (formType === 'franchise') {
      slug = `${fullName}-${city}-${timestamp}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    } else if (formType === 'contact-us') {
      slug = `${fullName}-${enquiryType}-${timestamp}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    
    // Check if lead with same email and formType already exists
    const existingLead = await Agent.findOne({ 
      email, 
      formType,
      isAgent: { $ne: true }
    });
    
    if (existingLead) {
      return res.status(400).json({
        success: false,
        message: 'A lead with this email and form type already exists'
      });
    }

    // Prepare lead data based on form type
    let leadData = {
      slug,
      formType,
      isAgent: false,
      createdAt: new Date()
    };

    // Add form-specific fields
    if (formType === 'jasmin' || formType === 'jeddah') {
      leadData = {
        ...leadData,
        fullName,
        mobileNumber,
        email,
        city,
        message
      };
    } else if (formType === 'instant-valuation') {
      leadData = {
        ...leadData,
        city,
        fullname,
        mobileNumber,
        email,
        bedrooms: parseInt(bedrooms) || bedrooms, // Convert to number if possible
        property_type,
        valuation_type
      };
    } else if (formType === 'join-us') {
      leadData = {
        ...leadData,
        fullName,
        mobileNumber,
        email,
        city,
        message
      };
    } else if (formType === 'franchise') {
      leadData = {
        ...leadData,
        fullName,
        mobileNumber,
        email,
        city,
        dob: new Date(dob),
        educationStatus,
        promotionalConsent,
        personalDataConsent,
        message
      };
    } else if (formType === 'contact-us') {
      leadData = {
        ...leadData,
        fullName,
        mobileNumber,
        email,
        enquiryType,
        message
      };
    }

    const newLead = new Agent(leadData);
    const savedLead = await newLead.save();

    console.log('Lead created successfully:', savedLead._id);

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: savedLead
    });

  } catch (err) {
    console.error('Error creating lead:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to create lead',
      error: err.message
    });
  }
};

// Update a lead by ID
export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Validate that req.body exists and is an object
    if (!updateData || typeof updateData !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request body. Expected JSON object.'
      });
    }
    
    console.log('Updating lead:', id, 'with data:', updateData);
    
    // Check if lead exists
    const existingLead = await Agent.findById(id);
    if (!existingLead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    // Check if trying to update an agent (should not be allowed)
    if (existingLead.isAgent) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update agent records'
      });
    }
    
    // Generate new slug if name or city changes
    if (updateData.fullName || updateData.city || updateData.fullname) {
      const timestamp = Date.now();
      let newSlug;
      
      if (existingLead.formType === 'jasmin' || existingLead.formType === 'jeddah') {
        const name = updateData.fullName || existingLead.fullName;
        const city = updateData.city || existingLead.city;
        newSlug = `${name}-${city}-${timestamp}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      } else if (existingLead.formType === 'instant-valuation') {
        const name = updateData.fullname || existingLead.fullname;
        const city = updateData.city || existingLead.city;
        newSlug = `${name}-${city}-${timestamp}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      } else if (existingLead.formType === 'join-us') {
        const name = updateData.fullName || existingLead.fullName;
        const city = updateData.city || existingLead.city;
        newSlug = `${name}-${city}-${timestamp}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      } else if (existingLead.formType === 'franchise') {
        const name = updateData.fullName || existingLead.fullName;
        const city = updateData.city || existingLead.city;
        newSlug = `${name}-${city}-${timestamp}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      } else if (existingLead.formType === 'contact-us') {
        const name = updateData.fullName || existingLead.fullName;
        const enquiryType = updateData.enquiryType || existingLead.enquiryType;
        newSlug = `${name}-${enquiryType}-${timestamp}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
      
      if (newSlug) {
        updateData.slug = newSlug;
      }
    }
    
    // Update the lead
    const updatedLead = await Agent.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    console.log('Lead updated successfully:', updatedLead._id);
    
    res.json({
      success: true,
      message: 'Lead updated successfully',
      data: updatedLead
    });
    
  } catch (err) {
    console.error('Error updating lead:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update lead',
      error: err.message
    });
  }
};

// Delete a lead by ID
export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Deleting lead:', id);
    
    // Check if lead exists
    const existingLead = await Agent.findById(id);
    if (!existingLead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }
    
    // Check if trying to delete an agent (should not be allowed)
    if (existingLead.isAgent) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete agent records'
      });
    }
    
    // Delete the lead
    await Agent.findByIdAndDelete(id);
    
    console.log('Lead deleted successfully:', id);
    
    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
    
  } catch (err) {
    console.error('Error deleting lead:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to delete lead',
      error: err.message
    });
  }
};


 