
'use client'
import React, { useState, useEffect, Suspense, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaSearch, FaBars, FaTimes, FaBuilding, FaChevronDown, FaChevronRight, FaChevronLeft,FaCheck  } from "react-icons/fa";
import {motion} from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef } from 'react';

import PropertyType from '@/components/propertype'
import NewFooter from '@/components/newfooter';
import Header from '@/components/header';

// Wrapper component that uses useSearchParams
const PropertiesContent = () => {
  const [price, setPrice] = useState(750000);
  const [visibleCount, setVisibleCount] = useState(6);
  const [prevHeroIndex, setPrevHeroIndex] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(6);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  
  // Filter state - separate from display state
  // Note: sale: false in appliedFilters means no sale filter is applied by default
  // This ensures all properties are shown initially, regardless of the checkbox state
  const [appliedFilters, setAppliedFilters] = useState({
    selected: { sale: false, rent: false, commercial: false },
    propertyType: 'PROPERTY TYPE',
    propertySubType: '',
    city: 'CITY',
    minPrice: '',
    maxPrice: '',
    includeNewHomes: true,
    marketCenter: 'MARKET CENTER'
  });

  // Display state for form inputs
  // Note: sale: true in displayFilters means the checkbox is checked by default
  // but it doesn't affect filtering until search button is clicked
  const [displayFilters, setDisplayFilters] = useState({
    selected: { sale: true, rent: false, commercial: false },
    propertyType: 'PROPERTY TYPE',
    propertySubType: '',
    city: 'CITY',
    minPrice: '',
    maxPrice: '',
    includeNewHomes: true,
    marketCenter: 'MARKET CENTER'
  });
  
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price.toLocaleString('en-US');
    }
    if (typeof price === 'string' && !isNaN(Number(price))) {
      return Number(price).toLocaleString('en-US');
    }
    return price || '';
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Reset pagination when filters change
  const resetPagination = useCallback((newPerPage = perPage) => {
    setCurrentPage(1);
    // Clear all properties and reload first page
    setProperties([]);
    setHasNextPage(false);
    setHasPrevPage(false);
    setTotalPages(1);
    setTotalItems(0);
    // Set perPage to 6 for filtered results
    setPerPage(newPerPage);
    // Reset visible count to show only first page
    setVisibleCount(newPerPage);
  }, [perPage]);

  // Apply filters function - only called when search button is clicked
  const applyFilters = useCallback(async () => {
    // Update applied filters with current display values
    setAppliedFilters({
      selected: { ...displayFilters.selected },
      propertyType: displayFilters.propertyType,
      propertySubType: displayFilters.propertySubType,
      city: displayFilters.city,
      minPrice: displayFilters.minPrice,
      maxPrice: displayFilters.maxPrice,
      includeNewHomes: displayFilters.includeNewHomes,
      marketCenter: displayFilters.marketCenter
    });
    
    // Reset pagination with 6 properties per page for filtered results
    resetPagination(6);
    
    // Prepare API request body with filter parameters
    const requestBody = {
      page: 1,
      limit: 6  // Set to 6 properties per page for filtered results
    };
    
    // Add forsale/forrent parameters based on selected filters
    if (displayFilters.selected.sale && !displayFilters.selected.rent) {
      requestBody.forsale = true;
    } else if (displayFilters.selected.rent && !displayFilters.selected.sale) {
      requestBody.forrent = true;
    }
    
    // Add property_type parameter if commercial is selected
    if (displayFilters.selected.commercial) {
      requestBody.property_type = 'Commercial';
    }
    
    // Reload properties with new filters
    try {
      setLoading(true);
      const res = await fetch('https://kwbackend.jc2g.in/api/listings/list/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      const data = await res.json();
      
      if (data.success) {
        let fetched = [];
        if (Array.isArray(data?.data)) {
          fetched = data.data;
        }
        
        // Update pagination state from API response
        if (data.pagination) {
          setCurrentPage(data.pagination.current_page);
          setTotalPages(data.pagination.total_pages);
          setTotalItems(data.pagination.total_items);
          setPerPage(data.pagination.per_page);
          setHasNextPage(data.pagination.has_next_page);
          setHasPrevPage(data.pagination.has_prev_page);
        }
        
        // Ensure no duplicates in the fetched data
        const uniqueProperties = [];
        const seenIds = new Set();
        
        fetched.forEach(prop => {
          const propId = prop._kw_meta?.id || prop.id;
          if (propId && !seenIds.has(propId)) {
            seenIds.add(propId);
            uniqueProperties.push(prop);
          } else if (!propId) {
            // If no ID, add with timestamp to ensure uniqueness
            uniqueProperties.push({
              ...prop,
              _temp_id: `temp-${Date.now()}-${Math.random()}`
            });
          }
        });
        
        setProperties(uniqueProperties);
      }
    } catch (err) {
      console.error('Error reloading properties after filter change:', err);
    } finally {
      setLoading(false);
    }
  }, [displayFilters, resetPagination]);
  const bedIconUrl = "/bed.png";
  const bathIconUrl = "/bath.png";

  // Update display filters when form inputs change
  const updateDisplayFilter = (key, value) => {
    setDisplayFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateSelectedFilter = (key, value) => {
    setDisplayFilters(prev => ({
      ...prev,
      selected: {
        ...prev.selected,
        [key]: value
      }
    }));
  };

  // Update visible count when properties change
  useEffect(() => {
    // For initial load (page 1), show only perPage properties
    // For subsequent pages, show all loaded properties
    if (currentPage === 1) {
      // Ensure we only show the expected number of properties for the first page
      const expectedCount = Math.min(perPage, properties.length);
      setVisibleCount(expectedCount);
      console.log(`Page 1: Setting visible count to ${expectedCount} (perPage: ${perPage}, properties: ${properties.length})`);
    } else {
      // Show all loaded properties when on page 2+
      setVisibleCount(properties.length);
      console.log(`Page ${currentPage}: Setting visible count to ${properties.length} (all loaded properties)`);
    }
  }, [properties.length, currentPage, perPage]);
  useEffect(() => {
    async function fetchProperties(page = 1, append = false) {
      setLoading(true);
      setError(null);
      try {
        // Prepare API request body with filter parameters
        const requestBody = {
          page: page,
          limit: perPage
        };
        
        // Add forsale/forrent parameters based on applied filters
        if (appliedFilters.selected.sale && !appliedFilters.selected.rent) {
          requestBody.forsale = true;
        } else if (appliedFilters.selected.rent && !appliedFilters.selected.sale) {
          requestBody.forrent = true;
        }
        
        // Add property_type parameter if commercial is selected
        if (appliedFilters.selected.commercial) {
          requestBody.property_type = 'Commercial';
        }
        
        const res = await fetch('https://kwbackend.jc2g.in/api/listings/list/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
        
        const data = await res.json();
        
        if (data.success) {
          let fetched = [];
          if (Array.isArray(data?.data)) {
            fetched = data.data;
          }
          
          // Update pagination state from API response
          if (data.pagination) {
            setCurrentPage(data.pagination.current_page);
            setTotalPages(data.pagination.total_pages);
            setTotalItems(data.pagination.total_items);
            setPerPage(data.pagination.per_page);
            setHasNextPage(data.pagination.has_next_page);
            setHasPrevPage(data.pagination.has_prev_page);
          }
          
          console.log(`Fetched ${fetched.length} properties (requested: ${perPage}, page: ${page})`);
          
          // Debug: Log sample properties to see list_category values
          if (fetched.length > 0) {
            console.log('=== SAMPLE PROPERTIES FOR DEBUG ===');
            fetched.slice(0, 3).forEach((prop, idx) => {
              console.log(`Property ${idx + 1}:`, {
                id: prop._kw_meta?.id || prop.id,
                list_category: prop.list_category,
                category: prop.category,
                prop_type: prop.prop_type,
                city: prop.list_address?.city
              });
            });
            console.log('=== END DEBUG ===');
          }
          
          // If appending, add to existing properties, otherwise replace
          if (append) {
            setProperties(prev => {
              // Create a map of existing properties by ID to avoid duplicates
              const existingIds = new Set(prev.map(p => p._kw_meta?.id || p.id));
              const newProperties = fetched.filter(prop => {
                const propId = prop._kw_meta?.id || prop.id;
                return propId && !existingIds.has(propId);
              });
              return [...prev, ...newProperties];
            });
          } else {
            // For initial load, also ensure no duplicates within the fetched data
            const uniqueProperties = [];
            const seenIds = new Set();
            
            fetched.forEach(prop => {
              const propId = prop._kw_meta?.id || prop.id;
              if (propId && !seenIds.has(propId)) {
                seenIds.add(propId);
                uniqueProperties.push(prop);
              } else if (!propId) {
                // If no ID, add with timestamp to ensure uniqueness
                uniqueProperties.push({
                  ...prop,
                  _temp_id: `temp-${Date.now()}-${Math.random()}`
                });
              }
            });
            
            // Ensure we don't exceed perPage for initial load
            const limitedProperties = uniqueProperties.slice(0, perPage);
            console.log(`Initial load: Limiting ${uniqueProperties.length} properties to ${limitedProperties.length} (perPage: ${perPage})`);
            setProperties(limitedProperties);
          }
        } else {
          setError(data.message || 'Failed to load properties');
        }
      } catch (err) {
        setError('Failed to load properties');
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    }
    
    // Initial load
    if (currentPage === 1) {
      fetchProperties(1, false);
    }
  }, [currentPage, perPage, appliedFilters]); // Include dependencies
  
  // Preselect city and category from query parameters and apply filter
  const searchParams = useSearchParams();
  useEffect(() => {
    const qpCity = searchParams?.get('city');
    const qpCategory = searchParams?.get('category');
    
    if (qpCity) {
      updateDisplayFilter('city', qpCity);
    }
    
    if (qpCategory) {
      if (qpCategory === 'sale') {
        updateDisplayFilter('selected', { sale: true, rent: false, commercial: false });
        // Also update applied filters for query parameters
        setAppliedFilters(prev => ({
          ...prev,
          selected: { sale: true, rent: false, commercial: false }
        }));
      } else if (qpCategory === 'rent') {
        updateDisplayFilter('selected', { sale: false, rent: true, commercial: false });
        // Also update applied filters for query parameters
        setAppliedFilters(prev => ({
          ...prev,
          selected: { sale: false, rent: true, commercial: false }
        }));
      }
    }
  }, [searchParams]);
  // Remove this line as it's now handled in displayFilters
  const [showSSTC, setShowSSTC] = useState(true);

  // Enhanced filtering logic
  const filterBy = (property, key, value) => {
    if (!value || value === key || value === 'All' || value === '') return true;
    const v = value.toLowerCase().trim();
    
    if (key === 'PROPERTY TYPE') {
      const propType = String(property.type || property.prop_type || '').toLowerCase().trim();
      return propType.includes(v) || v.includes(propType);
    }
    
    if (key === 'MARKET CENTER') {
      const marketCenter = String(property.market_center || property.center || '').toLowerCase().trim();
      return marketCenter.includes(v) || v.includes(marketCenter);
    }
    
    if (key === 'PROPERTY SUBTYPE') {
      const subType = String(property.subtype || property.property_subtype || '').toLowerCase().trim();
      return subType.includes(v) || v.includes(subType);
    }
    
    if (key === 'CITY') {
      // Search across multiple address fields: city, street name, and full street address
      const addressFields = [
        property.city,
        property.region,
        property.municipality,
        property.list_address?.city,
        property.property_address?.city,
        property.list_address?.street_name,
        property.property_address?.street_name,
        property.list_address?.full_street_address,
        property.property_address?.full_street_address,
        property.street_name,
        property.full_street_address
      ].filter(val => val != null && val !== undefined).map(val => String(val).toLowerCase().trim());
      
      return addressFields.some(field => field.includes(v) || v.includes(field));
    }
    
    return true;
  };

  const filteredProperties = properties.filter(property => {
    // Filter by price
    const propPrice = Number(property.price || property.current_list_price || 0);
    const minPriceNum = appliedFilters.minPrice ? Number(appliedFilters.minPrice) : 0;
    const maxPriceNum = appliedFilters.maxPrice ? Number(appliedFilters.maxPrice) : Infinity;
    
    if (minPriceNum > 0 && propPrice < minPriceNum) return false;
    if (maxPriceNum > 0 && propPrice > maxPriceNum) return false;
    
    // Filter by commercial checkbox - if commercial is selected, only show commercial properties
    if (appliedFilters.selected.commercial) {
      const propType = String(property.prop_type || property.type || '').toLowerCase().trim();
      if (propType !== 'commercial') {
        return false;
      }
    }
    
    // Filter by list_category (sale/rent) based on selected state
    // Only apply these filters if at least one is explicitly selected
    if (appliedFilters.selected.sale || appliedFilters.selected.rent) {
      const propListCategory = String(property.list_category || property.category || '').toLowerCase().trim();
      
      // If only sale is selected
      if (appliedFilters.selected.sale && !appliedFilters.selected.rent) {
        if (!propListCategory.includes('sale') && !propListCategory.includes('buy') && !propListCategory.includes('forsale')) {
          return false;
        }
      }
      
      // If only rent is selected
      if (appliedFilters.selected.rent && !appliedFilters.selected.sale) {
        if (!propListCategory.includes('rent') && !propListCategory.includes('forrent') && !propListCategory.includes('lease')) {
          return false;
        }
      }
      
      // If both are selected, show all properties (no filtering needed)
    }
    // If neither sale nor rent is selected in appliedFilters, show all properties regardless of category
    
    // Filter by property type - only if a type is selected
    if (appliedFilters.propertyType && appliedFilters.propertyType !== 'PROPERTY TYPE') {
      const propType = String(property.prop_type || property.type || '').toLowerCase().trim();
      const selectedType = String(appliedFilters.propertyType).toLowerCase().trim();
      if (propType !== selectedType) return false;
    }
    
    // Filter by market center - only if a market center is selected
    if (appliedFilters.marketCenter && appliedFilters.marketCenter !== 'MARKET CENTER') {
      const propMarketCenter = String(property.market_center || property.center || '').toLowerCase().trim();
      const selectedMarketCenter = String(appliedFilters.marketCenter).toLowerCase().trim();
      if (propMarketCenter !== selectedMarketCenter) return false;
    }
    
    // Filter by property subtype - only if a subtype is selected
    if (appliedFilters.propertySubType && appliedFilters.propertySubType !== '') {
      const propSubType = String(property.prop_subtype || property.property_subtype || property.subtype || '').toLowerCase().trim();
      const selectedSubType = String(appliedFilters.propertySubType).toLowerCase().trim();
      
      if (propSubType !== selectedSubType) return false;
    }
    
    // Filter by city/address - only if a city/address is selected
    if (appliedFilters.city && appliedFilters.city !== 'CITY') {
      // Search across multiple address fields: city, street name, and full street address
      const addressFields = [
        property.city,
        property.region,
        property.municipality,
        property.list_address?.city,
        property.property_address?.city,
        property.list_address?.street_name,
        property.property_address?.street_name,
        property.list_address?.full_street_address,
        property.property_address?.full_street_address,
        property.street_name,
        property.full_street_address
      ].filter(val => val != null && val !== undefined).map(val => String(val).toLowerCase().trim());
      
      const selectedCity = String(appliedFilters.city).toLowerCase().trim();
      if (!addressFields.some(field => field.includes(selectedCity) || selectedCity.includes(field))) return false;
    }
    
    return true;
  });

  // Debug: Log filter counts
  useEffect(() => {
    if (properties.length > 0) {
      console.log('Filter states:', {
        displayFilters,
        appliedFilters,
        totalProperties: properties.length,
        filteredCount: filteredProperties.length
      });
    }
  }, [displayFilters, appliedFilters, properties, filteredProperties]);

  // Generate unique key for properties
  const generatePropertyKey = (property, index) => {
    const propId = property._kw_meta?.id || property.id;
    if (propId) {
      return `${propId}-${index}`;
    }
    // Fallback to timestamp + index if no ID
    return `prop-${Date.now()}-${index}`;
  };

  // View More function
  const goToNextPage = useCallback(async () => {
    if (hasNextPage) {
      const nextPage = currentPage + 1;
      console.log(`Loading next page: ${nextPage}`);
      setCurrentPage(nextPage);
      
      // Fetch and append next page properties
      try {
        setLoadingMore(true);
        
        // Prepare API request body with filter parameters
        const requestBody = {
          page: nextPage,
          limit: perPage
        };
        
        // Add forsale/forrent parameters based on applied filters
        if (appliedFilters.selected.sale && !appliedFilters.selected.rent) {
          requestBody.forsale = true;
        } else if (appliedFilters.selected.rent && !appliedFilters.selected.sale) {
          requestBody.forrent = true;
        }
        
        // Add property_type parameter if commercial is selected
        if (appliedFilters.selected.commercial) {
          requestBody.property_type = 'Commercial';
        }
        
        const res = await fetch('https://kwbackend.jc2g.in/api/listings/list/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
        
        const data = await res.json();
        
        if (data.success && Array.isArray(data?.data)) {
          // Append new properties to existing ones with deduplication
          setProperties(prev => {
            // Create a map of existing properties by ID to avoid duplicates
            const existingIds = new Set(prev.map(p => p._kw_meta?.id || p.id));
            const newProperties = data.data.filter(prop => {
              const propId = prop._kw_meta?.id || prop.id;
              return propId && !existingIds.has(propId);
            });
            return [...prev, ...newProperties];
          });
          
          console.log(`Appending ${data.data.length} new properties`);
          
          // Update pagination state
          if (data.pagination) {
            setCurrentPage(data.pagination.current_page);
            setTotalPages(data.pagination.total_pages);
            setTotalItems(data.pagination.total_items);
            setHasNextPage(data.pagination.has_next_page);
            setHasPrevPage(data.pagination.has_prev_page);
          }
          
          // The useEffect will automatically update visibleCount when properties change
        }
      } catch (err) {
        console.error('Error fetching next page:', err);
      } finally {
        setLoadingMore(false);
      }
    }
  }, [hasNextPage, currentPage, perPage, appliedFilters.selected.sale, appliedFilters.selected.rent, appliedFilters.selected.commercial]);
  const [heroSrc, setHeroSrc] = useState('/')
  const[page,setPage]=useState('');
  useEffect(() => {
    const fetchPageHero = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/page/slug/rental-search');
        if (!res.ok) return;
       
        
        const page = await res.json();
        console.log(page);
        setPage(page)
        if (page?.backgroundImage) {
          setHeroSrc(`http://localhost:5000/${page.backgroundImage}`);
        }
      } catch (e) {
        console.error('Error fetching page hero:', e);
      }
    };
    fetchPageHero();
  }, []);

 
  return (
    <div className="relative p-6 md:p-8 ">
    
    {/* Sticky Header */}
   
      <Header />
  
  
      <div className="absolute top-0 left-0 w-[100px] h-[100px] md:w-[150px] md:h-[150px] bg-[rgb(206,32,39,255)]  z-0"></div>
  
  {/* Hero Section */}
  <div className="relative bg-gray-100 md:pb-10">
  
    <section className={`relative w-full ${showFilters ? 'h-[120vh] md:h-[125vh]' : 'h-screen md:h-screen'} text-white overflow-hidden transition-all duration-500 ease-in-out`}>
      {/* Background Image with previous blurring out and next coming in */}
      <Image
              src={heroSrc}
              alt="Previous Hero Background"
              layout="fill"
              
              objectPosition="center"
              priority
              className={`z-0 transition-all  duration-500 object-cover ${showFilters ? 'scale-110' : 'scale-100'}` }
            />
             {/* Content */}
             <div className={`absolute ${showFilters ? 'bottom-0' : 'bottom-20'}  md:bottom-0 left-0 w-full z-10 flex flex-col items-center text-center text-white py-2 md:py-14 px-4`}>
  {/* Title */}
  <h2 className="text-3xl font-semibold md:pb-8 pb-4">
    {loading
      ? 'Loading...'
      : `${totalItems} Properties`}
  </h2>
  
  {/* Properties Count Info */}
  {/* {totalItems > 0 && (
    <div className="text-sm text-white/80 mb-4">
      {loading ? (
        <span>Loading properties...</span>
      ) : (
        `Showing ${properties.length} of ${totalItems} properties`
      )}
    </div>
  )} */}


  {/* Line 1 - For Sale + To Rent */}
  <div className="flex md:gap-4 gap-2 md:pb-4 pb-2">
    {/* For Sale */}
    <button
  onClick={() => {
    updateSelectedFilter('sale', !displayFilters.selected.sale);
  }}
  className={`flex items-center md:gap-8 gap-2 px-4 py-2 font-semibold border ${
    displayFilters.selected.sale
      ? "bg-[rgb(206,32,39,255)] border-[rgb(206,32,39,255)] text-white"
      : "bg-white border-gray-300 text-black"
  }`}
>
  For Sale
  <span
    className={`w-4 h-4 border flex items-center justify-center ${
      displayFilters.selected.sale
        ? "bg-white border-[rgb(206,32,39,255)]"
        : "border-gray-400 bg-white"
    }`}
  >
    {displayFilters.selected.sale && <FaCheck className="text-[rgb(206,32,39,255)] text-xs" />}
  </span>
</button>

    {/* To Rent */}
    <button
      onClick={() => {
        updateSelectedFilter('rent', !displayFilters.selected.rent);
      }}
      className={`flex items-center md:gap-8 gap-2 px-4 py-2 font-semibold border ${
        displayFilters.selected.rent
          ? "bg-[rgb(206,32,39,255)] border-[rgb(206,32,39,255)] text-white"
          : "bg-white border-gray-300 text-black"
      }`}
    >
      To Rent
              <span
          className={`w-4 h-4 border flex items-center justify-center ${
            displayFilters.selected.rent
              ? "bg-white border-[rgb(206,32,39,255)]"
              : "border-gray-400 bg-white"
          }`}
        >
        {displayFilters.selected.rent && <FaCheck className="text-[rgb(206,32,39,255)] text-xs" />}
      </span>
    </button>
  </div>

  {/* Line 2 - Commercial */}
  <div className="mb-4">
    <button
      onClick={() => {
        updateSelectedFilter('commercial', !displayFilters.selected.commercial);
      }}
      className={`flex items-center md:gap-8 gap-2 px-4 py-2 font-semibold border ${
        displayFilters.selected.commercial
          ? "bg-[rgb(206,32,39,255)] border-[rgb(206,32,39,255)] text-white"
          : "bg-white border-gray-300 text-black"
      }`}
    >
      Commercial
      <span
        className={`w-4 h-4 border flex items-center justify-center ${
          displayFilters.selected.commercial
            ? "bg-white border-[rgb(206,32,39,255)]"
            : "border-gray-400 bg-white"
        }`}
      >
        {displayFilters.selected.commercial && <FaCheck className="text-[rgb(206,32,39,255)] text-xs" />}
      </span>
    </button>
  </div>

  {/* Line 3 - Property Type Dropdown */}
  <div className="mb-6 w-full max-w-sm">
  <select 
    className="w-full px-4 py-2 text-black border bg-white border-gray-300 outline-none"
    value={displayFilters.propertyType === 'PROPERTY TYPE' ? '' : displayFilters.propertyType}
    onChange={(e) => {
      updateDisplayFilter('propertyType', e.target.value || 'PROPERTY TYPE');
    }}
  >
  <option value="">Select Type</option>
  {Array.from(
    new Set(
      properties.map((p) => p.prop_type)
    )
  ).filter(Boolean).map((type, idx) => (
    <option key={idx} value={type}>
      {type}
    </option>
  ))}
</select>
  </div>

  {/* Location Input */}
  <div className="mb-6 w-full max-w-4xl">
  <label className="flex justify-start text-base">Location</label>
  <select
    className="w-full bg-white px-4 py-2 text-black outline-none border border-gray-300"
    value={displayFilters.city === 'CITY' ? '' : displayFilters.city}
    onChange={(e) => {
      updateDisplayFilter('city', e.target.value || 'CITY');
    }}
  >
  <option value="">Select Location</option>
{Array.from(
  new Set(
    properties.map((loc) => loc.list_address?.city)
  )
).filter(Boolean).map((city, idx) => (
  <option key={idx} value={city}>
    {city}
  </option>
))}
  </select>
</div>


  {/* More Filters Toggle */}
  <div className="my-4 ">
    <button
      onClick={toggleFilters}
      className="text-white font-medium flex items-center transition-colors"
    >
      {showFilters ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          HIDE FILTERS -
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          MORE FILTERS +
        </>
      )}
    </button>
  </div>

  {/* Additional Filters */}
  <div
    className={`overflow-hidden transition-all md:mt-6 mt-2 duration-500 ease-in-out ${
      showFilters ? "max-h-[2000px] md:max-h-96 opacity-100" : "max-h-0 opacity-0"
    }`}
  >
    <div>
      {/* First row of dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 w-full md:w-4xl">
       
        {/* Type Dropdown */}
<div>
  <label className="flex justify-start text-sm font-medium mb-1">
    Type
  </label>
  <select 
    className="border border-gray-300 p-2 w-full bg-white text-black"
    value={displayFilters.propertySubType}
    onChange={(e) => {
      updateDisplayFilter('propertySubType', e.target.value);
    }}
  >
    <option value="">No Preference</option>
    {Array.from(
      new Set(
        properties.map(
          (p) => p.prop_subtype || p.property_subtype || p.subtype || "Other"
        )
      )
    )
      .filter(Boolean)
      .map((type, idx) => (
        <option key={idx} value={type}>
          {type}
        </option>
      ))}
  </select>
</div>

{/* Min Price Dropdown */}
<div>
  <label className="flex justify-start text-sm font-medium mb-1">
    Min Price
  </label>
  <select 
    className="border border-gray-300 p-2 w-full bg-white text-black"
    value={displayFilters.minPrice}
    onChange={(e) => {
      updateDisplayFilter('minPrice', e.target.value);
    }}
  >
    <option value="">No Preference</option>
    {Array.from(
      new Set(
        properties.map(
          (p) => p.price || p.current_list_price || p.rental_price || 0
        )
      )
    )
      .filter((price) => price > 0)
      .sort((a, b) => a - b)
      .map((price, idx) => (
        <option key={idx} value={price}>
          ﷼ {formatPrice(price)}
        </option>
      ))}
  </select>
</div>

{/* Max Price Dropdown */}
<div>
  <label className="flex justify-start text-sm font-medium mb-1">
    Max Price
  </label>
  <select 
    className="border border-gray-300 p-2 w-full bg-white text-black"
    value={displayFilters.maxPrice}
    onChange={(e) => {
      updateDisplayFilter('maxPrice', e.target.value);
    }}
  >
    <option value="">No Preference</option>
    {Array.from(
      new Set(
        properties.map(
          (p) => p.price || p.current_list_price || p.rental_price || 0
        )
      )
    )
      .filter((price) => price > 0)
      .sort((a, b) => a - b)
      .map((price, idx) => (
        <option key={idx} value={price}>
          ﷼ {formatPrice(price)}
        </option>
      ))}
  </select>
</div>

      </div>


      {/* Checkboxes */}
      <div className="flex flex-col md:flex-row md:gap-6 gap-2 mb-6 justify-center items-center">
  {/* Include new homes */}
  <div className="flex flex-col gap-2">
    <span className="font-medium">Include new homes?</span>
    <div className="flex gap-4">
      {/* YES Option */}
      <label
        className={`flex justify-between items-center font-semibold w-30 px-4 py-2 border cursor-pointer ${
          displayFilters.includeNewHomes
            ? "bg-[rgb(206,32,39,255)] text-white border-[rgb(206,32,39,255)]"
            : "bg-white text-black"
        }`}
      >
        <span>Yes</span>
        <span
          className={`w-4 h-4 border bg-white flex items-center justify-center ${
            displayFilters.includeNewHomes ? "border-[rgb(206,32,39,255)]" : "border-gray-400"
          }`}
        >
          {displayFilters.includeNewHomes && (
            <FaCheck className="text-[10px]" />
          )}
        </span>
        <input
          type="checkbox"
          className="hidden"
          checked={displayFilters.includeNewHomes}
          onChange={() => updateDisplayFilter('includeNewHomes', true)}
        />
      </label>

      {/* NO Option */}
      <label
        className={`flex justify-between items-center w-30 font-semibold px-4 py-2  cursor-pointer ${
          !displayFilters.includeNewHomes
            ? "bg-[rgb(206,32,39,255)] text-white border-[rgb(206,32,39,255)]"
            : "bg-white text-black"
        }`}
      >
        <span>No</span>
        <span
          className={`w-4 h-4 border bg-white flex items-center justify-center ${
            !displayFilters.includeNewHomes ? "border-[rgb(206,32,39,255)]" : "border-gray-400"
          }`}
        >
          {!displayFilters.includeNewHomes && (
            <FaCheck className="text-[rgb(206,32,39,255)] text-[10px]" />
          )}
        </span>
        <input
          type="checkbox"
          className="hidden"
          checked={!displayFilters.includeNewHomes}
          onChange={() => updateDisplayFilter('includeNewHomes', false)}
        />
      </label>
    </div>
  </div>

   
       
      </div>
</div>
    </div>
      {/* Search button */}
      <div className="text-center">
        <button
          className="bg-[rgb(206,32,39,255)] text-white px-8 py-2 text-xl font-semibold hover:bg-red-700 transition-colors duration-200"
          onClick={(event) => {
            // Apply filters when search button is clicked
            applyFilters();
            
            // Show a brief success message
            const button = event.target;
            const originalText = button.textContent;
            button.textContent = 'Filters Applied!';
            button.className = 'bg-green-600 text-white px-8 py-2 text-xl font-semibold transition-colors duration-200';
            
            setTimeout(() => {
              button.textContent = originalText;
              button.className = 'bg-[rgb(206,32,39,255)] text-white px-8 py-2 text-xl font-semibold hover:bg-red-700 transition-colors duration-200';
            }, 2000);
            
            // Scroll to results section
            const resultsSection = document.querySelector('.min-h-screen');
            if (resultsSection) {
              resultsSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          Search
        </button>
      
  </div>
  
  {/* Active Filters Summary */}
  <div className="mt-4 text-center">
    <div className="inline-flex flex-wrap gap-2 justify-center">
      {appliedFilters.selected.commercial && (
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          Commercial Properties
        </span>
      )}
      {(appliedFilters.selected.sale || appliedFilters.selected.rent) && (
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
          {appliedFilters.selected.sale && appliedFilters.selected.rent ? 'Sale & Rent' : 
           appliedFilters.selected.sale ? 'For Sale Only' : 'For Rent Only'}
        </span>
      )}
      {appliedFilters.propertyType && appliedFilters.propertyType !== 'PROPERTY TYPE' && (
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          Type: {appliedFilters.propertyType}
        </span>
      )}
      {appliedFilters.propertySubType && appliedFilters.propertySubType !== '' && appliedFilters.propertySubType !== 'No Preference' && (
        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
          Subtype: {appliedFilters.propertySubType}
        </span>
      )}
      {appliedFilters.city && appliedFilters.city !== 'CITY' && (
        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
          Location: {appliedFilters.city}
        </span>
      )}
      {appliedFilters.minPrice && appliedFilters.minPrice !== '' && appliedFilters.minPrice !== 'No Preference' && (
        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
          Min: ﷼ {formatPrice(appliedFilters.minPrice)}
        </span>
      )}
      {appliedFilters.maxPrice && appliedFilters.maxPrice !== '' && appliedFilters.maxPrice !== 'No Preference' && (
        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
          Max: ﷼ {formatPrice(appliedFilters.maxPrice)}
        </span>
      )}
      {filteredProperties.length > 0 && (
        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
          {filteredProperties.length} Results
        </span>
      )}
    </div>
  </div>
</div>
  
    </section>
    

    <div className="min-h-screen">
  {/* Filters always inside margin */}
  <div className={`${showMap ? "md:mx-2" : "mx-6 md:mx-38"}`}>
    <div className="py-6 mt-10 gap-2 flex flex-col md:flex-row justify-start">
      <select className="border border-gray-400 p-2 bg-white text-black">
        <option>Sort by price: high to low</option>
        <option>Sort by date added</option>
        <option>Sort by price: low to high</option>
      </select>

      <button
        className="hidden md:inline-block border border-gray-400 p-2 bg-white text-black"
        onClick={() => setShowMap(!showMap)}
      >
        {showMap ? "Hide Map" : "Map View"}
      </button>
    </div>
  </div>



  {/* Conditional rendering */}
  {showMap ? (
    // ✅ Map is outside mx-38 → takes full width
    <PropertyType />
  ) : (
    <>
      <div className="mx-6 md:mx-38">
        {/* Properties Count Display */}
        {!loading && !error && (
          <div className="mb-6 text-center">
            <p className="text-lg text-gray-700">
              Showing <span className="font-semibold text-[rgb(206,32,39,255)]">{filteredProperties.length}</span> properties
              {totalItems > filteredProperties.length && (
                <span className="text-gray-500"> of {totalItems} total</span>
              )}
            </p>
            {/* Debug info */}
            {/* <p className="text-sm text-gray-500 mt-2">
              Loaded: {properties.length} | Visible: {visibleCount} | Current Page: {currentPage}
            </p> */}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600"></div>
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.slice(0, visibleCount).map((property, idx) => (
              <div
                key={generatePropertyKey(property, idx)}
                className="bg-white shadow-2xl overflow-hidden w-full cursor-pointer"
                onClick={() => {
                  const propertyId =
                    property._kw_meta?.id || property.id || idx;
                  window.location.href = `/propertydetails/${propertyId}`;
                }}
              >
                {/* Image Section */}
                <div className="relative w-full h-50 md:h-60">
                  <Image
                    src={
                      property.image ||
                      (Array.isArray(property.images) && property.images[0]) ||
                      (Array.isArray(property.photos) &&
                        property.photos[0]?.ph_url) ||
                      "/property.jpg"
                    }
                    alt={property.title || property.prop_type || "property"}
                    fill
                    className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  />

                  {/* Beds & Baths Overlay */}
                  <div className="absolute bottom-0 right-0 bg-black/80 text-white px-2 py-1 flex flex-row items-center gap-3">
                    <div className="flex flex-col items-center">
                      <span className="relative w-5 h-5">
                        <Image
                          src={bedIconUrl}
                          alt="bed"
                          fill
                          className="object-contain invert"
                        />
                      </span>
                      <span className="text-xs mt-1">
                        {property.total_bed ||
                          property.beds ||
                          property.bedrooms ||
                          0}
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <span className="relative w-5 h-5">
                        <span className="relative w-5 h-5">
                          <Image
                            src={bathIconUrl}
                            alt="bath"
                            fill
                            className="object-contain invert"
                          />
                        </span>
                      </span>
                      <span className="text-xs mt-1">
                        {property.total_bath ||
                          property.baths ||
                          property.bathrooms ||
                          0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 py-6">
                  <h3 className="text-gray-700 text-lg flex justify-start items-center">
                    {property.title || property.prop_type || "Property"}
                  </h3>
                  <span className="flex justify-start text-[rgb(206,32,39,255)] text-lg font-semibold">
                    {property?.prop_subtype || "To Let"}
                  </span>

                  <p
                    className="text-xl font-bold text-gray-600 mb-2 truncate"
                    title={property.list_address?.address}
                  >
                    {property.list_address.address?.split(" ").length > 5
                      ? property.list_address.address
                          .split(" ")
                          .slice(0, 5)
                          .join(" ") + "..."
                      : property.list_address.address}
                  </p>

                  <div className="flex justify-start items-center">
                  <span className="relative w-4 h-4 mr-2">
    <Image 
      src="/currency.png"   // 👈 replace with your currency image path
      alt="currency"
      fill
      className="object-contain"
    />
  </span>

  <span>
    {property.price
      ? formatPrice(property.price)
      : property.current_list_price
      ? formatPrice(property.current_list_price)
      : ""}
  </span>
                  </div>

                  {property.price_qualifier && (
                    <p className="text-xs text-gray-500 mt-1">
                      {property.price_qualifier}
                    </p>
                  )}
                </div>

                {/* Button */}
                <button
                  className="w-full bg-[rgb(206,32,39,255)] text-white font-bold text-base py-3 px-4 flex items-center justify-end gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    const propertyId =
                      property._kw_meta?.id || property.id || idx;
                    window.location.href = `/propertydetails/${propertyId}`;
                  }}
                >
                  <span>MORE DETAILS</span>
                  <FaChevronRight className="text-white w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View More Properties Button */}
      {hasNextPage && !loading && (
        <div className="flex justify-center items-center my-10">
          <button
            onClick={goToNextPage}
            disabled={loadingMore}
            className={`md:w-80 w-50 md:py-3 py-2 px-6 text-white text-base md:text-lg font-semibold  transition-all duration-200 shadow-lg ${
              loadingMore 
                ? 'bg-gray-400 cursor-not-allowed opacity-75' 
                : 'bg-gray-500 hover:shadow-xl'
            }`}
          >
            {loadingMore ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Loading More...</span>
              </div>
            ) : (
              'View More Properties'
            )}
          </button>
        </div>
      )}
    </>
  )}
</div>


      
    
   
    </div>
    <NewFooter></NewFooter>
    </div>
  );
}

// Main component that wraps PropertiesContent in Suspense
const Properties = () => {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-[rgb(206,32,39,255)]"></div>
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
};

export default Properties;
