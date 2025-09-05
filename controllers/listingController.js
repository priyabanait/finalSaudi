
/** ------------------------------------------------------------------
 *  GET  or  POST   /api/get-external-listings
 *  Params / Body:
 *    page          (int, default 1)
 *    limit         (int, default 100)
 *    market_center (string / int, optional)
 *    list_category (string, optional)
 * ----------------------------------------------------------------- */
import axios from 'axios';
import util  from 'util';   // optional, for deep debug prints






export const getExternalListings = async (req, res) => {
  try {
    // 1. Get pagination and filter input from request
    const page = Number(req.body.page ?? req.query.page ?? 1);
    const perPage = Number(req.body.limit ?? req.query.limit ?? 50);
    const marketCenterFilter = req.body.market_center ?? req.query.market_center;
    const listCategoryFilter = req.body.list_category ?? req.query.list_category;
    const propertyCategoryFilter = req.body.property_category ?? req.query.property_category;
    const propertySubtypeFilter = req.body.property_subtype ?? req.query.property_subtype;
    const locationFilter = req.body.location ?? req.query.location;
    const minPrice = req.body.min_price ?? req.query.min_price;
    const maxPrice = req.body.max_price ?? req.query.max_price;
    const propertyType = req.body.property_type ?? req.query.property_type;
    
    // New optional filters
    const forSale = req.body.forsale ?? req.query.forsale;
    const forRent = req.body.forrent ?? req.query.forrent;

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

    // 2. Set up headers for API
    const headers = {
      Authorization:
        'Basic b2FoNkRibjE2dHFvOE52M0RaVXk0NHFVUXAyRjNHYjI6eHRscnJmNUlqYVZpckl3Mg==',
      Accept: 'application/json',
    };

    // 3. Fetch all listings from the API (loop through all pages)
    let allListings = [];
    let offset = 0;
    const apiLimit = 1000; // Use the largest allowed by the KW API
    let total = 0;
    let first = true;
    do {
      const pageURL = `https://partners.api.kw.com/v2/listings/region/50394?page[offset]=${offset}&page[limit]=${apiLimit}`;
      const pageRes = await axios.get(pageURL, { headers });
      const hits = pageRes.data?.hits?.hits ?? [];
      allListings = allListings.concat(hits.map(hit => ({
        ...hit._source,
        _kw_meta: { id: hit._id, score: hit._score ?? null },
      })));
      if (first) {
        total = pageRes.data?.hits?.total?.value ?? 0;
        first = false;
      }
      offset += apiLimit;
    } while (offset < total);

    // 4. Apply strict filtering - REMOVE unwanted listings completely
    // Define exactly what we want to KEEP
    const allowedListStatuses = ['Active', 'Sold', 'Rented/Leased'];
    const allowedListCategories = ['For Sale', 'For Rent', 'To Let', 'Sold', 'Rented/Leased'];
    
    // Define what we want to EXCLUDE (remove completely)
    const blockedStatuses = ['Expired', 'Pending', 'Withdrawn', 'Cancelled', 'Off Market'];
    const blockedCategories = ['Off Market', 'Pending', 'Withdrawn', 'Cancelled', 'Expired'];

    // Filter out listings with unwanted status or category
    allListings = allListings.filter(item => {
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
        return false; // Remove this listing completely
      }
      
      // Only INCLUDE if it has allowed status AND allowed category
      const hasAllowedStatus = allowedListStatuses.includes(listStatus) || 
                              allowedListStatuses.includes(status) || 
                              allowedListStatuses.includes(propertyStatus);
                              
      const hasAllowedCategory = allowedListCategories.includes(listCategory) ||
                                allowedListCategories.includes(category);
      
      // Keep only listings that have both allowed status AND allowed category
      return hasAllowedStatus && hasAllowedCategory;
    });

    // 5. Apply new optional filters
    
    // Debug: Log the filter values
    console.log('Filter values received:', {
      forSale,
      forRent,
      propertyType,
      minPrice,
      maxPrice,
      locationFilter,
      propertySubtypeFilter
    });
    
    // Debug: Log sample properties before filtering
    if (allListings.length > 0) {
      console.log('=== SAMPLE PROPERTIES BEFORE FILTERING ===');
      allListings.slice(0, 3).forEach((item, idx) => {
        console.log(`Property ${idx + 1}:`, {
          id: item._kw_meta?.id,
          list_category: item.list_category,
          category: item.category,
          prop_type: item.prop_type,
          city: item.list_address?.city
        });
      });
      console.log('=== END DEBUG ===');
    }
    
    // 1) For Sale filter - if forsale is true, only show "For Sale" listings
    if (forSale === 'true' || forSale === true) {
      console.log('Applying For Sale filter');
      allListings = allListings.filter(item => {
        const raw = item.list_category || item.category || '';
        const category = String(raw).toLowerCase();
        const matches = category.includes('sale');
        if (item._kw_meta?.id) {
          console.log(`Property ${item._kw_meta.id}: list_category="${raw}" (${category}) - matches sale: ${matches}`);
        }
        return matches;
      });
      console.log(`After For Sale filter: ${allListings.length} properties`);
    }
    
    // 2) For Rent filter - if forrent is true, only show "For Rent" listings  
    if (forRent === 'true' || forRent === true) {
      console.log('Applying For Rent filter');
      allListings = allListings.filter(item => {
        const raw = item.list_category || item.category || '';
        const category = String(raw).toLowerCase();
        const matches = category.includes('rent') || category.includes('lease') || category.includes('let');
        if (item._kw_meta?.id) {
          console.log(`Property ${item._kw_meta.id}: list_category="${raw}" (${category}) - matches rent: ${matches}`);
        }
        return matches;
      });
      console.log(`After For Rent filter: ${allListings.length} properties`);
    }
    
    // 3) Property Type filter - Residential or Commercial
    if (propertyType === 'Residential' || propertyType === 'Commercial') {
      console.log('Applying Property Type filter:', propertyType);
      allListings = allListings.filter(item => {
        const propType = (item.prop_type || item.property_type || '').toString().toLowerCase();
        const matches = propType === propertyType.toLowerCase();
        if (item._kw_meta?.id) {
          console.log(`Property ${item._kw_meta.id}: prop_type="${item.prop_type}" (${propType}) - matches ${propertyType}: ${matches}`);
        }
        return matches;
      });
      console.log(`After Property Type filter: ${allListings.length} properties`);
    }
    
    // 4) Price range filters on current_list_price
    if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
      const min = Number(minPrice);
      if (!isNaN(min) && min > 0) {
        allListings = allListings.filter(item => {
          const price = Number(item.current_list_price ?? item.price ?? item.rental_price ?? 0);
          return price >= min;
        });
      }
    }
    
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
      const max = Number(maxPrice);
      if (!isNaN(max) && max > 0) {
        allListings = allListings.filter(item => {
          const price = Number(item.current_list_price ?? item.price ?? item.rental_price ?? 0);
          return price <= max;
        });
      }
    }

    // 6. Apply additional filters if provided
    if (marketCenterFilter !== undefined) {
      const mc = String(marketCenterFilter);
      const FIELD_CANDIDATES = [
        'listing_market_center',
        'office_mls_id',
        'market_center',
      ];
      allListings = allListings.filter(item =>
        FIELD_CANDIDATES.some(
          key => item[key] !== undefined && String(item[key]) === mc
        )
      );
    }
    if (listCategoryFilter !== undefined) {
      const lc = String(listCategoryFilter).toLowerCase();
      allListings = allListings.filter(item => {
        const val = item.list_category || item.status || item.property_status || '';
        return String(val).toLowerCase() === lc;
      });
    }
    // New: property_category filter
    if (propertyCategoryFilter !== undefined) {
      const pc = String(propertyCategoryFilter).toLowerCase();
      allListings = allListings.filter(item => {
        const val = item.property_category || item.prop_type || '';
        return String(val).toLowerCase() === pc;
      });
    }
    // New: property_subtype filter
    if (propertySubtypeFilter !== undefined) {
      const ps = String(propertySubtypeFilter).toLowerCase();
      allListings = allListings.filter(item => {
        const val = item.property_subtype || item.subtype || '';
        return String(val).toLowerCase() === ps;
      });
    }
    // New: location filter
    if (locationFilter !== undefined) {
      const loc = String(locationFilter).toLowerCase();
      const getCandidates = (it) => {
        const candidates = [];
        if (it.location) candidates.push(it.location);
        if (it.city) candidates.push(it.city);
        if (it.region) candidates.push(it.region);
        if (it.municipality) candidates.push(it.municipality);
        if (it.list_address?.city) candidates.push(it.list_address.city);
        if (it.list_address?.address) candidates.push(it.list_address.address);
        if (it.property_address?.city) candidates.push(it.property_address.city);
        if (it.property_address?.address) candidates.push(it.property_address.address);
        return candidates;
      };
      allListings = allListings.filter(item => {
        return getCandidates(item).some(v => String(v ?? '').toLowerCase().includes(loc));
      });
    }


    // 7. Calculate pagination details
    const totalFiltered = allListings.length;
    const totalPages = Math.ceil(totalFiltered / perPage);
    
    // Debug: Log final results
    console.log('=== FILTERING RESULTS ===');
    console.log(`Total properties after all filters: ${totalFiltered}`);
    console.log(`Applied filters:`, {
      forSale: forSale === 'true' || forSale === true,
      forRent: forRent === 'true' || forRent === true,
      propertyType,
      minPrice,
      maxPrice,
      locationFilter,
      propertySubtypeFilter
    });
    console.log('=== END RESULTS ===');
    
    // Check if requested page exceeds total pages
    if (page > totalPages && totalPages > 0) {
      return res.status(400).json({
        success: false,
        message: `Page ${page} does not exist. Total pages available: ${totalPages}`,
        error: 'Page out of range',
        total_pages: totalPages,
        total: totalFiltered
      });
    }

    // 8. Paginate filtered results
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginated = allListings.slice(startIndex, endIndex);

    // 9. Return response with comprehensive pagination info
    return res.json({
      success: true,
      pagination: {
        current_page: page,
        per_page: perPage,
        total_items: totalFiltered,
        total_pages: totalPages,
        has_next_page: page < totalPages,
        has_prev_page: page > 1,
        next_page: page < totalPages ? page + 1 : null,
        prev_page: page > 1 ? page - 1 : null,
        start_index: startIndex + 1,
        end_index: Math.min(endIndex, totalFiltered)
      },
      count: paginated.length,
      data: paginated,
    });
  } catch (err) {
    const status = err.response?.status ?? 500;
    const message = err.response?.data ?? err.message;
    console.error('KW API Error:', message);
    return res.status(status).json({
      success: false,
      message: 'Failed to fetch listings',
      error: message,
    });
  }
};