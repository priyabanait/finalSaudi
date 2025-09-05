
'use client'
import React, { useState, useEffect, Suspense } from 'react';
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
  const [propertyType, setPropertyType] = useState('PROPERTY TYPE');
  const [marketCenter, setMarketCenter] = useState('MARKET CENTER');
  const [propertySubType, setPropertySubType] = useState('');
  const [city, setCity] = useState('CITY');

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  

  
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
  const bedIconUrl = "/bed.png";
  const bathIconUrl = "/bath.png";

  const [selected, setSelected] = useState({
    sale: true,
    rent: false,
    commercial: false,
  });
  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      setError(null);
      try {
        const requestBody = {
          limit: 1000,
          page: 1,
        };
        
        // Add property_type parameter if commercial is selected
        if (selected.commercial) {
          requestBody.property_type = 'Commercial';
        }
        
        const res = await fetch('https://kw-backend-q6ej.vercel.app/api/listings/list/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
        


        const data = await res.json();
        let fetched = [];
        if (Array.isArray(data?.data)) {
          fetched = data.data;
        }
        console.log('Fetched properties:', fetched.slice(0, 2)); // Debug: log first 2 properties
        
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
        
        setProperties(fetched);
      } catch (err) {
        setError('Failed to load properties');
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);
  
  // Preselect city from query parameter and apply filter
  const searchParams = useSearchParams();
  useEffect(() => {
    const qpCity = searchParams?.get('city');
    if (qpCity) {
      setCity(qpCity);
    }
  }, [searchParams]);
  const [includeNewHomes, setIncludeNewHomes] = useState(true);
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
      const cityValues = [
        property.city,
        property.region,
        property.municipality,
        property.list_address?.city,
        property.property_address?.city
      ].filter(val => val != null && val !== undefined).map(val => String(val).toLowerCase().trim());
      
      return cityValues.some(city => city.includes(v) || v.includes(city));
    }
    
    return true;
  };

  const filteredProperties = properties.filter(property => {
    // Filter by price
    const propPrice = Number(property.price || property.current_list_price || 0);
    const minPriceNum = minPrice ? Number(minPrice) : 0;
    const maxPriceNum = maxPrice ? Number(maxPrice) : Infinity;
    
    if (minPriceNum > 0 && propPrice < minPriceNum) return false;
    if (maxPriceNum > 0 && propPrice > maxPriceNum) return false;
    
    // Filter by commercial checkbox - if commercial is selected, only show commercial properties
    if (selected.commercial) {
      const propType = String(property.prop_type || property.type || '').toLowerCase().trim();
      if (propType !== 'commercial') {
        return false;
      }
    }
    
    // Filter by property type - only if a type is selected
    if (propertyType && propertyType !== 'PROPERTY TYPE') {
      const propType = String(property.prop_type || property.type || '').toLowerCase().trim();
      const selectedType = String(propertyType).toLowerCase().trim();
      if (propType !== selectedType) return false;
    }
    
    // Filter by market center - only if a market center is selected
    if (marketCenter && marketCenter !== 'MARKET CENTER') {
      const propMarketCenter = String(property.market_center || property.center || '').toLowerCase().trim();
      const selectedMarketCenter = String(marketCenter).toLowerCase().trim();
      if (propMarketCenter !== selectedMarketCenter) return false;
    }
    
    // Filter by property subtype - only if a subtype is selected
    if (propertySubType && propertySubType !== '') {
      const propSubType = String(property.prop_subtype || property.property_subtype || property.subtype || '').toLowerCase().trim();
      const selectedSubType = String(propertySubType).toLowerCase().trim();
      
      // Debug logging for property subtype filtering
      console.log(`Property: ${property.id || 'unknown'}, Subtype: "${propSubType}", Selected: "${selectedSubType}", Match: ${propSubType === selectedSubType}`);
      
      if (propSubType !== selectedSubType) return false;
    }
    
    // Filter by city - only if a city is selected
    if (city && city !== 'CITY') {
      const cityValues = [
        property.city,
        property.region,
        property.municipality,
        property.list_address?.city,
        property.property_address?.city
      ].filter(val => val != null && val !== undefined).map(val => String(val).toLowerCase().trim());
      
      const selectedCity = String(city).toLowerCase().trim();
      if (!cityValues.some(cityVal => cityVal === selectedCity)) return false;
    }
    
    return true;
  });

  // Debug: Log filter counts
  useEffect(() => {
    if (properties.length > 0) {
      console.log('Filter states:', {
        propertyType,
        marketCenter,
        propertySubType,
        city,
        minPrice,
        maxPrice,
        totalProperties: properties.length,
        filteredCount: filteredProperties.length
      });
      
      // Log when filters are applied
      if (propertyType !== 'PROPERTY TYPE') {
        console.log(`Filtering by property type: ${propertyType}`);
      }
      if (city !== 'CITY') {
        console.log(`Filtering by city: ${city}`);
      }
      if (propertySubType !== '') {
        console.log(`Filtering by property subtype: ${propertySubType}`);
      }
      
      // Debug: Log available property subtypes
      const availableSubtypes = Array.from(
        new Set(
          properties.map(
            (p) => p.prop_subtype || p.property_subtype || p.subtype
          )
        )
      ).filter(Boolean);
      console.log('Available property subtypes:', availableSubtypes);
    }
  }, [propertyType, marketCenter, propertySubType, city, minPrice, maxPrice, properties, filteredProperties]);

  const [heroSrc, setHeroSrc] = useState('/')
  const[page,setPage]=useState('');
  useEffect(() => {
    const fetchPageHero = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/page/slug/recently-rented');
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
  <div className="relative bg-gray-100">
  
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
    : `${filteredProperties.length} Properties`}
</h2>


  {/* Line 1 - For Sale + To Rent */}
  <div className="flex md:gap-4 gap-2 md:pb-4 pb-2">
    {/* For Sale */}
    <button
  onClick={() => setSelected((prev) => ({ ...prev, sale: !prev.sale }))}
  className={`flex items-center md:gap-8 gap-2 px-4 py-2 font-semibold border ${
    selected.sale
      ? "bg-[rgb(206,32,39,255)] border-[rgb(206,32,39,255)] text-white"
      : "bg-white border-gray-300 text-black"
  }`}
>
  For Sale
  <span
    className={`w-4 h-4 border flex items-center justify-center ${
      selected.sale
        ? "bg-white border-[rgb(206,32,39,255)]"
        : "border-gray-400 bg-white"
    }`}
  >
    {selected.sale && <FaCheck className="text-[rgb(206,32,39,255)] text-xs" />}
  </span>
</button>

    {/* To Rent */}
    <button
      onClick={() => setSelected((prev) => ({ ...prev, rent: !prev.rent }))}
      className={`flex items-center md:gap-8 gap-2 px-4 py-2 font-semibold border ${
        selected.rent
          ? "bg-[rgb(206,32,39,255)] border-[rgb(206,32,39,255)] text-white"
          : "bg-white border-gray-300 text-black"
      }`}
    >
      To Rent
      <span
        className={`w-4 h-4 border flex items-center justify-center ${
          selected.rent
            ? "bg-white text-[rgb(206,32,39,255)]"
            : "border-gray-400 bg-white"
        }`}
      >
        {selected.rent && <FaCheck className="text-[rgb(206,32,39,255)] text-xs" />}
      </span>
    </button>
  </div>

  {/* Line 2 - Commercial */}
  <div className="mb-4">
    <button
      onClick={() =>
        setSelected((prev) => ({ ...prev, commercial: !prev.commercial }))
      }
      className={`flex items-center md:gap-8 gap-2 px-4 py-2 font-semibold border ${
        selected.commercial
          ? "bg-[rgb(206,32,39,255)] border-[rgb(206,32,39,255)] text-white"
          : "bg-white border-gray-300 text-black"
      }`}
    >
      Commercial
      <span
        className={`w-4 h-4 border flex items-center justify-center ${
          selected.commercial
            ? "bg-white text-[rgb(206,32,39,255)]"
            : "border-gray-400 bg-white"
        }`}
      >
        {selected.commercial && <FaCheck className="text-[rgb(206,32,39,255)] text-xs" />}
      </span>
    </button>
  </div>

  {/* Line 3 - Property Type Dropdown */}
  <div className="mb-6 w-full max-w-sm">
  <select 
    className="w-full px-4 py-2 text-black border bg-white border-gray-300 outline-none"
    value={propertyType === 'PROPERTY TYPE' ? '' : propertyType}
    onChange={(e) => setPropertyType(e.target.value || 'PROPERTY TYPE')}
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
    value={city === 'CITY' ? '' : city}
    onChange={(e) => setCity(e.target.value || 'CITY')}
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
    value={propertySubType}
    onChange={(e) => setPropertySubType(e.target.value)}
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
    value={minPrice}
    onChange={(e) => setMinPrice(e.target.value)}
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
    value={maxPrice}
    onChange={(e) => setMaxPrice(e.target.value)}
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
          includeNewHomes
            ? "bg-[rgb(206,32,39,255)] text-white border-[rgb(206,32,39,255)]"
            : "bg-white text-black"
        }`}
      >
        <span>Yes</span>
        <span
          className={`w-4 h-4 border bg-white flex items-center justify-center ${
            includeNewHomes ? "border-[rgb(206,32,39,255)]" : "border-gray-400"
          }`}
        >
          {includeNewHomes && (
            <FaCheck className="text-[rgb(206,32,39,255)] text-[10px]" />
          )}
        </span>
        <input
          type="checkbox"
          className="hidden"
          checked={includeNewHomes}
          onChange={() => setIncludeNewHomes(true)}
        />
      </label>

      {/* NO Option */}
      <label
        className={`flex justify-between items-center w-30 font-semibold px-4 py-2  cursor-pointer ${
          !includeNewHomes
            ? "bg-[rgb(206,32,39,255)] text-white border-[rgb(206,32,39,255)]"
            : "bg-white text-black"
        }`}
      >
        <span>No</span>
        <span
          className={`w-4 h-4 border bg-white flex items-center justify-center ${
            !includeNewHomes ? "border-[rgb(206,32,39,255)]" : "border-gray-400"
          }`}
        >
          {!includeNewHomes && (
            <FaCheck className="text-[rgb(206,32,39,255)] text-[10px]" />
          )}
        </span>
        <input
          type="checkbox"
          className="hidden"
          checked={!includeNewHomes}
          onChange={() => setIncludeNewHomes(false)}
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
            // Apply filters locally without making API call
            console.log('Applying filters locally:', {
              selected,
              propertyType,
              propertySubType,
              city,
              minPrice,
              maxPrice,
              includeNewHomes
            });
            
            // The filtering is already applied through the filteredProperties variable
            // Show success message and scroll to results
            console.log('Filters applied successfully!');
            console.log('Filtered results:', filteredProperties.length);
            
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
      {selected.commercial && (
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          Commercial Properties
        </span>
      )}
      {propertyType && propertyType !== 'PROPERTY TYPE' && (
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          Type: {propertyType}
        </span>
      )}
      {propertySubType && propertySubType !== '' && propertySubType !== 'No Preference' && (
        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
          Subtype: {propertySubType}
        </span>
      )}
      {city && city !== 'CITY' && (
        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
          Location: {city}
        </span>
      )}
      {minPrice && minPrice !== '' && minPrice !== 'No Preference' && (
        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
          Min: ﷼ {formatPrice(minPrice)}
        </span>
      )}
      {maxPrice && maxPrice !== '' && maxPrice !== 'No Preference' && (
        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
          Max: ﷼ {formatPrice(maxPrice)}
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
                key={property._kw_meta?.id || property.id || idx}
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

      {/* View More Button */}
      {visibleCount < filteredProperties.length && !loading && !error && (
        <div className="flex justify-center items-center ">
          <button
            className="md:w-80 w-50 md:py-2 py-2 my-10 md:my-10 px-4 bg-gray-500 text-white text-base md:text-lg font-semibold transition whitespace-nowrap"
            onClick={() => setVisibleCount((c) => c + 6)}
          >
            View More Properties..
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
