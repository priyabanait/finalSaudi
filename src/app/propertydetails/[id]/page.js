'use client'

import { useState,useRef,useEffect } from 'react';
import { ChevronLeft, ChevronRight} from 'lucide-react';
import Image from 'next/image';
import NewFooter from '@/components/newfooter'
import { Phone, Mail, User , MessageCircle } from "lucide-react";
import { FaPhoneAlt, FaEnvelope, FaRegCalendarAlt, FaSnowflake, FaHome,  FaMoneyBillWave, FaCar } from 'react-icons/fa';

import { PiMapPinLineThin } from 'react-icons/pi';
import { FaArrowLeft ,FaChevronLeft ,FaChevronRight ,FaTimes,FaWhatsapp   } from 'react-icons/fa';

import Header from '@/components/header';

import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import AgentModal from '@/components/agentdetails';

export default function PropertyListing() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);  
  const [isAtTop, setIsAtTop] = useState(true);  
  const prevScrollY = useRef(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [property, setProperty] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const mapSectionRef = useRef(null);
  const propertyDetailsRef = useRef(null);
  const tourSectionRef = useRef(null);
  const similarSectionRef = useRef(null);
  const overviewSectionRef = useRef(null);
  const overviewContentRef = useRef(null);
  const propertyDetailsContentRef = useRef(null);
  const [similarImageIndices, setSimilarImageIndices] = useState([]);
  const [similarLoading, setSimilarLoading] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const propertyTemplates = {
    land: {
      type: "أرض (Land)",
      description: `
        This exceptional {size} {measurement} plot of land in {neighborhood / area} offers a rare opportunity 
        to secure a foothold in one of {city}’s most strategically positioned and fast-developing locations. 
        Priced at SAR {price}, the property holds remarkable potential for {residential / commercial / mixed-use} 
        development, benefiting from proximity to major transport routes, established neighborhoods, 
        and rapidly expanding urban infrastructure.
  
        Saudi Arabia’s Vision 2030 is driving unprecedented transformation in the Kingdom’s real estate sector, 
        with a strong focus on creating modern, sustainable, and connected communities. 
        This plot sits at the heart of that transformation.
  
        Whether for an immediate build or long-term investment, the land’s location offers direct access to 
        commercial centers, educational institutions, healthcare facilities, and leisure destinations.
      `,
      fields: ["size",'measurement', "neighborhood / area", "city", "price", "developmentType"]
    },
  
    villa: {
      type: "فيلا (Villa)",
      description: `
        This beautifully designed {bedrooms}-bedroom villa in {neighborhood / area} captures the essence 
        of modern Saudi living — a balance of elegance, comfort, and functionality. 
        Spanning {size} {measurement} and built in {year built}, it offers spacious living areas, 
        natural light, and privacy. Priced at SAR {price}.
      `,
      fields: ["bedrooms", "size",'measurement', "year built", "neighborhood / area", "city", "price"]
    },
  
    residential: {
      type: "سكني (Residential)",
      description: `
        This thoughtfully crafted residential property in {neighborhood / area} combines practicality, 
        style, and strategic location. Offering {bedrooms} bedrooms, {bathrooms} bathrooms, 
        and {size} {measurement} of living space, built in {year built}. 
        Priced at SAR {price}.
      `,
      fields: ["bedrooms", "bathrooms",'measurement',  "size", "year built", "neighborhood / area", "city", "price"]
    },
  
    building: {
      type: "عمارة (Building)",
      description: `
        An exceptional {residential / commercial / mixed-use} building in {neighborhood / area}, 
        spanning {size} {measurement}  with {number of units / floors}. Built in {year built} 
        and priced at SAR {price}. Strategically located in {city}.
      `,
      fields: ["usageType", "size", 'measurement', "unitsOrFloors", "year built", "neighborhood / area", "city", "price"]
    },
  
    apartment: {
      type: "شقة (Apartment)",
      description: `
        This stylish {bedrooms}-bedroom apartment in {neighborhood / area} spans {size} {measurement}, 
        completed in {year built}. Designed for functionality and comfort. 
        Priced at SAR {price}, located in {city}.
      `,
      fields: ["bedrooms", "size",'measurement',  "year built", "neighborhood / area", "city", "price"]
    },
  
    floor: {
      type: "دور (Floor)",
      description: `
        This {size} {measurement} floor in {neighborhood / area} offers {bedrooms} bedrooms and {bathrooms} bathrooms. 
        Built in {year built}, priced at SAR {price}.
      `,
      fields: ["size",'measurement',  "bedrooms", "bathrooms", "year built", "neighborhood / area", "city", "price"]
    },
  
    farm: {
      type: "مزرعة (Farm)",
      description: `
        This {size} {measurement} farm in {neighborhood / area} offers natural beauty, agricultural potential, 
        and investment value. Features include {existing elements such as wells, plantations, storage buildings}. 
        Priced at SAR {price}, near {nearest city}.
      `,
      fields: ["size",'measurement', "neighborhood / area", "nearestCity", "price", "features"]
    },
  
    factory: {
      type: "مصنع (Factory)",
      description: `
        This {size} {measurement} industrial facility in {neighborhood / area} is ideal for 
        manufacturing, warehousing, or logistics. Built in {year built}, priced at SAR {price}. 
        Includes {key features such as high ceilings, loading bays, office areas}.
      `,
      fields: ["size", 'measurement', "neighborhood / area", "year built", "price", "features"]
    },
  
    resthouse: {
      type: "استراحة (Rest House)",
      description: `
        Set on {size} {measurement} in {neighborhood / area}, this rest house is ideal for leisure and gatherings. 
        Features {gardens, shaded areas, swimming pool, outdoor seating}. 
        Priced at SAR {price}.
      `,
      fields: ["size",'measurement', "neighborhood / area", "price", "features"]
    },
  
    warehouse: {
      type: "مستودع (Warehouse)",
      description: `
        This {size} {measurement} warehouse in {neighborhood / area} offers space for storage, 
        distribution, or commercial use. Built in {year built}, priced at SAR {price}. 
        Includes {features such as loading docks, high ceilings, 24/7 security}.
      `,
      fields: ["size", 'measurement', "neighborhood / area", "year built", "price", "features"]
    }
  };
  

  // Add this useEffect to reset image indices and loading states for similar properties
  useEffect(() => {
    setSimilarImageIndices(Array(similarProperties.length).fill(0));
    setSimilarLoading(Array(similarProperties.length).fill(false));
  }, [similarProperties]);

  useEffect(() => {  
    const handleScroll = () => {  
      const currentScrollY = window.scrollY;  

      // At the very top  
      if (currentScrollY < 10) {  
        setIsAtTop(true);  
        setIsVisible(true);  
        return;  
      } else {  
        setIsAtTop(false);  
      }  

      // Scrolling down → Hide header  
      if (currentScrollY > prevScrollY.current) {  
        setIsVisible(false);  
      }  
      // Scrolling up → Show header  
      else {  
        setIsVisible(true);  
      }  

      prevScrollY.current = currentScrollY;  
    };  

    window.addEventListener('scroll', handleScroll, { passive: true });  
    return () => window.removeEventListener('scroll', handleScroll);  
  }, []);

  useEffect(() => {
    async function fetchPropertyById() {
      if (!id) return;
      
      try {
        setPageLoading(true);
        // Fetch property by ID from your API
        const response = await fetch('https://kwbackend.jc2g.in/api/listings/list/properties', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: 1,
            limit: 100, // Increased limit to have better chance of finding the property
            // You might need to add a filter for specific ID if your API supports it
          })
        });

        const data = await response.json();
        
        console.log('Property fetch response:', { success: data.success, dataLength: data.data?.length, id });
        
        if (data.success && data.data) {
          // Find the specific property by ID
          const foundProperty = data.data.find(prop => 
            String(prop._kw_meta?.id) === String(id) || 
            String(prop.id) === String(id)
          );
          
          console.log('Found property:', foundProperty ? 'Yes' : 'No');
          
          if (foundProperty) {
            setProperty(foundProperty);
            fetchSimilarProperties(foundProperty);
          } else {
            // Try to get from localStorage as fallback
            const stored = localStorage.getItem('selectedProperty');
            if (stored) {
              const propertyData = JSON.parse(stored);
              if (
                (propertyData._kw_meta && String(propertyData._kw_meta.id) === String(id)) ||
                String(propertyData.id) === String(id)
              ) {
                setProperty(propertyData);
                fetchSimilarProperties(propertyData);
              } else {
                console.error('Property not found with ID:', id);
              }
            } else {
              console.error('Property not found with ID:', id);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setPageLoading(false);
      }
    }

    fetchPropertyById();
  }, [id]);
  
  // Function to fetch similar properties
  const fetchSimilarProperties = async (currentProperty) => {
    if (!currentProperty) return;
    
    setLoadingSimilar(true);
    try {
      // Calculate price range for similar properties (±20% of current property price)
      const currentPrice = currentProperty?.current_list_price || currentProperty?.price || 0;
      const minPrice = Math.max(0, currentPrice * 0.8);
      const maxPrice = currentPrice * 1.2;

      const response = await fetch('https://kwbackend.jc2g.in/api/listings/list/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_category: currentProperty?.prop_type || currentProperty?.property_type,
          property_subtype: currentProperty?.property_subtype || currentProperty?.subtype,
          min_price: minPrice,
          max_price: maxPrice,
          limit: 6,
          page: 1
        })
      });

      const data = await response.json();
      
      if (data.success && data.data) {
        // Filter out the current property and get up to 6 similar properties
        const filtered = data.data
          .filter(p => p._kw_meta?.id !== currentProperty._kw_meta?.id)
          .slice(0, 6);
        
        setSimilarProperties(filtered);
      }
    } catch (error) {
      console.error('Error fetching similar properties:', error);
    } finally {
      setLoadingSimilar(false);
    }
  };

 

  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+974',
    phone: '',
    message: property ? `I'm interested in ${property?.prop_type}. Please provide me more details about this property.` : ''
  });

  // Use property images or fallback
  const propertyImages = property?.photos?.map(photo => photo?.ph_url) || [
    "/formimage.jpg"
  ];

  // Use property images for thumbnails or fallback
  const thumbnailImages = propertyImages.slice(0, 8);

  // Tab state
  const [activeTab, setActiveTab] = useState('overview');
  const tabList = [
    { key: 'overview', label: 'OVERVIEW' },
    { key: 'map', label: 'MAP LOCATION' },
    { key: 'tour', label: '360 TOUR' },
  ];

  function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-red-600 mr-2"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8.5 8.5a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L7.5 12.086l7.793-7.793a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Enquiry submitted successfully!');
  };

  const handleTabClick = (key) => {
    setActiveTab(key);
    if (key === 'overview' && overviewContentRef.current) {
    
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    if (key === 'property details' && propertyDetailsContentRef.current) {
     
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (activeTab === 'map' && mapSectionRef.current) {
      const yOffset = -130; 
      const y = mapSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  
    if (activeTab === 'tour' && tourSectionRef.current) {
      const yOffset = -100;
      const y = tourSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }

    if (activeTab === 'similar properties' && similarSectionRef.current) {
      const yOffset = -100;
      const y = similarSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [activeTab]);
  

  if (pageLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600"></div>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error: Property ID not found</h1>
        <p className="text-gray-700">The property you are looking for does not exist or the link is invalid.</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Property Not Found</h1>
        <p className="text-gray-700 mb-4">The property with ID &quot;{id}&quot; could not be found.</p>
        <button
          onClick={() => router.back()}
          className="bg-[rgb(179,4,4)] text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Helper function to get property type display
  const getPropertyTypeDisplay = () => {
    const beds = property?.total_bed || property?.beds || 0;
    const type = property?.prop_type || property?.property_type || 'Property';
    return `${beds} bed ${type}`;
  };

  // Helper function to get property status
  const getPropertyStatus = () => {
    if (property?.status) return property?.status;
    if (property?.list_type === 'rent') return 'For Rent';
    if (property?.list_type === 'sale') return 'For Sale';
    return 'Active';
  };

  // Helper function to get property images
  const getPropertyImages = (property) => {
    const fallbackImages = [
      "/formimage.jpg"
    ];
    return property?.photos?.map(photo => photo.ph_url) || fallbackImages;
  };

  // Helper function to get property address
  const getPropertyAddress = (property) => {
    return property?.list_address?.address || 
           property?.property_address || 
           property?.address || 
           property?.full_address || 
           'Address not available';
  };

  // Helper to get agent info for modal
  const agent = {
    name: property?.list_agent_office?.list_agent_full_name || property?.list_agent_full_name || '',
    fullName: property?.list_agent_office?.list_agent_full_name || property?.list_agent_full_name || '',
    email: property?.list_agent_office?.list_office_email || property?.agent_email || '',
    image: (property?.list_agent_office?.list_agent_url && /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(property?.list_agent_office?.list_agent_url)) ? property?.list_agent_office?.list_agent_url : '/avtar.jpg',
  };

  
  return (
    <div>
    <div className="relative p-6 md:p-8">
      <Header />
      <div className="absolute top-0 left-0 w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] md:w-[150px] md:h-[150px] bg-[rgb(179,4,4)] z-0"></div>
      
      <div ref={overviewSectionRef} className='relative bg-gray-100'>
        {/* Hero Section */}
        <div className="relative min-h-[40vh] sm:min-h-[60vh] w-full px-4 md:px-36">
          {/* Back to Search and Price */}
          <div className="w-full flex flex-col items-start gap-0 mb-2 sm:mb-4 md:mb-6">
            <div className="flex items-center gap-0 mt-30  md:mt-30 md:gap-3  py-1 ">
              <button
                onClick={() => {
                  router.back();
                }}
                className="flex items-center gap-1 text-[rgb(179,4,4)] hover:bg-gray-100  py-1 "
              >
                <FaChevronLeft className="w-2 h-2 md:w-3 md:h-3" />
                <span className="text-sm md:text-base font-medium">
                  Back to Search
                </span>
              </button>
            </div>
            <p className='mt-2 md:mt-4 text-sm sm:text-base font-medium md:text-base text-[rgb(179,4,4)]'>   {property?.list_status}</p>
            <p className="text-2xl sm:text-xl md:text-3xl font-semibold text-gray-800 mt-2">{property?.list_address.address || property?.property_address || property?.address || property?.full_address || 'Address not available'}</p>
            <h1 className="text-lg sm:text-xl md:text-xl mt-1 font-semibold text-gray-800">
            <div className="flex items-center gap-1">
  <span className="relative w-4 h-4">
    <Image 
      src="/currencysuadi.png"   // 👈 replace with your currency image path
      alt="currency"
      fill
      className="object-contain"
    />
  </span>

  <span>
    {property?.price
      ? formatPrice(property.price)
      : property?.current_list_price
      ? formatPrice(property.current_list_price)
      : ""}
  </span>
</div>

  {property?.rental_price ? ` ﷼ ${formatPrice(property.rental_price)}` : ""}
</h1>
          </div>

          {/* Main Content */}
          <div className="w-full flex flex-col lg:flex-row justify-between gap-2 md:gap-4">
            {/* Main Image */}
            <div className="relative w-full aspect-[16/9] md:aspect-[16/9]">
  <Image
    src={propertyImages[currentImageIndex]}
    alt="Property"
    fill
    className="object-cover"
    onClick={() => setIsFullscreen(true)}
    style={{ zIndex: 1 }}
  />



              {/* Arrows */}
              {propertyImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-[rgb(179,4,4)] p-1 md:p-2 shadow-lg z-30"
                    style={{ zIndex: 30 }}
                  >
                    <FaChevronLeft className="w-6 h-6 md:w-10 md:h-10 text-white" />
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-[rgb(179,4,4)]  p-1 md:p-2 shadow-lg z-30"
                    style={{ zIndex: 30 }}
                  >
                    <FaChevronRight className="w-6 h-6 md:w-10 md:h-10 text-white" />
                  </button>
                </>
              )}

              {/* Dots for Mobile */}
              <div className="sm:hidden absolute  bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {propertyImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 md:w-3 md:h-3  border rounded-full border-white transition-all ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>

            {isFullscreen && (
  <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
    {/* Close Button */}
    <button
      onClick={() => {
        setIsFullscreen(false);
        setZoom(1);
      }}
      className="absolute top-4 right-4 text-white text-2xl"
    >
      <FaTimes />
    </button>

    {/* Image with Zoom */}
    <div className="relative max-w-[90%] max-h-[90%] overflow-hidden flex items-center justify-center">
      <Image
        src={propertyImages[currentImageIndex]}
        alt="Fullscreen"
        width={1200}
        height={800}
        className="object-contain transition-transform duration-200"
        style={{
          transform: zoom === 1 ? "none" : `scale(${zoom})`, // ✅ no scaling by default
          cursor: zoom > 1 ? "grab" : "zoom-in",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
        onWheel={(e) => {
          if (e.deltaY < 0) setZoom((z) => Math.min(z + 0.2, 3));
          else setZoom((z) => Math.max(z - 0.2, 1));
        }}
      />
    </div>

    {/* Navigation Arrows */}
    {propertyImages.length > 1 && (
      <>
        <button
          onClick={prevImage}
          className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-3xl"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-3xl"
        >
          <FaChevronRight />
        </button>
      </>
    )}
  </div>
)}


            {/* Thumbnail Grid */}
            <div className="hidden sm:flex flex-col gap-2 overflow-y-auto ml-6 overflow-x-hidden scrollbar-hide aspect-[16/9] md:aspect-[16/9]">
              <div className="grid grid-cols-2 gap-2">
                {thumbnailImages.map((image, index) => (
                  <div
                    key={index}
                    className={`aspect-square cursor-pointer border-2 transition-all duration-200 overflow-hidden ${index === currentImageIndex ? 'border-[rgb(179,4,4)]' : 'border-gray-200'}`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <Image
                      src={image}
                      alt={`Property view ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Buttons */}
        <div className="z-40 mt-6 py-4 md:px-36  md:mt-10 flex justify-start overflow-x-auto scrollbar-hide bg-gray-100">
          <div className="flex min-w-full md:min-w-0 gap-1 md:gap-2">
            {tabList.map(tab => (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className={`flex-shrink-0 w-30 md:w-auto px-2 md:px-8 py-1 md:py-2 font-bold text-xs md:text-sm lg:text-base border-b-4 uppercase tracking-wide ${
                  activeTab === tab.key
                    ? 'border-[rgb(179,4,4)] bg-white text-[rgb(179,4,4)]'
                    : 'border-transparent bg-gray-400 text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-4 justify-between md:gap-8 px-6 md:px-36">
        <div className="w-full md:w-2/3 ">
          
          {/* OVERVIEW TAB CONTENT */}
          {activeTab === 'overview' && (
            <>
              {/* Description */}
              <div className="mt-4 md:mt-8">
                <h2 className="font-bold text-lg text-gray-800 sm:text-lg md:text-2xl flex items-center gap-2">
                  Property Description
                </h2>
              </div>

              {(property?.description || property?.long_description || '').length > 200 && (
                <button 
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-2 md:mt-4 text-indigo-600 text-xs sm:text-sm md:text-base font-semibold hover:text-indigo-800 transition-colors"
                >
                  {showFullDescription ? 'Show Less' : 'Show More'}
                </button>
              )}

              <div className="mt-4 md:mt-10" ref={propertyDetailsRef}>
                <div ref={propertyDetailsContentRef}></div>
                <div className="min-h-screen bg-white  flex justify-center">
                  <div className="w-full">
                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800 text-lg font-medium">
                      
                      {/* Left column */}
                      <div className="flex items-center">
                        <CheckIcon />
                        {property?.list_address.city ||'Not specified'}
                      </div>
                      <div className="flex items-center">
                        <CheckIcon />
                        Year Built: {property?.year_built || 'Not specified'}
                      </div>

                      <div className="flex items-center">
                        <CheckIcon />
                        {property?.total_bed || property?.total_bed || 'Not specified'} Bedrooms
                      </div>
                      <div className="flex items-center">
                        <CheckIcon />
                        {property.lot_size_area || 0} {property.lot_size_units}
                      </div>

                      <div className="flex items-center">
                        <CheckIcon />
                        {property?.total_bath || property?.total_bath || 'Not specified'} Bathrooms
                      </div>
                      <div className="flex items-center">
                        <CheckIcon />
                        {property?.prop_subtype || property?.prop_subtype || 'Not specified'}
                      </div>

                      <div className="flex items-center">
                        <CheckIcon />
                        Property Type: {property?.prop_type || property?.property_type || 'Not specified'}
                      </div>
                      <div className="flex items-center">
                        <CheckIcon />
                        {property?.list_type || 'Not specified'}
                      </div>

                      <div className="flex items-center">
                        <CheckIcon />
                        Property Sub Type: {property?.prop_subtype || property?.prop_subtype || 'Not specified'}
                      </div>
                      <div className="flex items-center">
                        <CheckIcon />
                        {property?.list_category}
                      </div>
                    </div>
                    <h1 className='text-lg my-10 font-semibold text-gray-800'>Address: {property?.list_address.address || 'Not specified'}</h1>
                    {/* Dynamic Description based on Property Type */}
                    <div className="">
                     
                      {(() => {
                        const propType = property?.prop_type || property?.property_type || '';
                        const propSubtype = property?.prop_subtype || property?.subtype || '';
                        
                        // Find matching template
                        let template = null;
                        for (const [key, value] of Object.entries(propertyTemplates)) {
                          if (propType.toLowerCase().includes(key) || propSubtype.toLowerCase().includes(key)) {
                            template = value;
                            break;
                          }
                        }
                        
                        if (template) {
                          // Replace template placeholders with actual property data
                          let description = template.description;
                          const fields = template.fields;
                          
                          fields.forEach(field => {
                            let value = '';
                            switch (field) {
                              case 'size':
                                value = property?.lot_size_area || '0';
                                break;
                              case 'neighborhood / area':
                                value = property?.list_address.full_street_address || 'N/A';
                                break;
                              case 'city':
                                value = property?.list_address.city || property?.city || 'N/A';
                                break;
                              case 'price':
                                value = formatPrice(property?.price || property?.current_list_price || 0);
                                break;
                              case 'developmentType':
                                value = property?.list_type === 'rent' ? 'rental' : 'residential';
                                break;
                              case 'bedrooms':
                                value = property?.total_bed || property?.beds || 'N/A';
                                break;
                              case 'year built':
                                value = property?.year_built|| 'N/A';
                                break;
                              case 'bathrooms':
                                value = property?.total_bath || property?.baths || 'N/A';
                                break;
                              case 'usageType':
                                value = property?.list_type === 'rent' ? 'rental' : 'commercial';
                                break;
                              case 'measurement':
                                value = property?.lot_size_units || 'N/A';
                                break;
                              case 'industrialArea':
                                value = property?.list_address?.city || property?.city || 'industrial area';
                                break;
                              case 'features':
                                value = property?.amenities || property?.features || 'standard features';
                                break;
                              case 'nearestCity':
                                value = property?.list_address?.city || property?.city || 'N/A';
                                break;
                              default:
                                value = 'N/A';
                            }
                           
                            
                            // Replace placeholder in description
                            const regex = new RegExp(`{${field}}`, 'g');
                            description = description.replace(regex, value);
                          });
                          
                          return (
                            <div>
                              <p className="text-gray-700 leading-relaxed ">{description}</p>
                         
                            </div>
                          );
                        } else {
                          // Fallback to original description or default
                          return (
                            <p className="text-gray-700 leading-relaxed">
                            Not Available
                            </p>
                          );
                        }
                      })()}
                    </div>

                                         <div className='py-10'>
                        <p>KW Listing ID: {property?.kw_id || property?.list_id || property?.id || 'Not specified'}</p>
                        <p> Estimation Provided by Keller Williams Realty, LLC</p>
                     </div>
                     <p className=''>
                      {property?.list_desc||'Not Available'}
                     </p>
                  </div>
                </div>
              </div>
            </>
          )}

        

        </div>

        {/* RIGHT SIDE: Sticky Agent Box */}
        {activeTab === 'overview' && (  <main className="flex flex-col justify-between  mt-30 md:mt-34">
          <div className="relative bg-gray-100 p-6 shadow-md w-full max-w-sm text-center">
            {/* Profile Image */}
            <div className="absolute -top-24 left-1/2 transform -translate-x-1/2">
              <div className="w-46 h-46 rounded-full overflow-hidden border-4 border-white ">
                <Image
                   src={
                property.list_agent_office?.list_agent_url || 
                property.agent_photo || 
                "/avtar.jpg"
              }
              alt="Agent"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* Content */}
            <div className="mt-20">
              <p className="text-2xl font-medium text-gray-600">
                To discuss this property please contact <br />
                <span className="font-semibold">{property.list_agent_office?.list_agent_full_name
                  || property.list_agent_full_name || 'Agent Name'}</span> on:
              </p>

              <p className="my-8 text-gray-900 font-medium">
              {property.list_agent_office?.list_office_email || property.agent_email || 'agent@kw.com'}
              </p>
              
              {/* Contact Me Button */}
              <a
                href="https://wa.me/{property.list_agent_office?.list_agent_preferred_phone || property.agent_phone || '(206) 739-2150'}"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block w-full bg-red-700 text-white py-2  hover:bg-red-800 transition"
              >
                Contact Me
              </a>

              {/* Action Buttons */}
              <div className="grid grid-cols-4 gap-3 mt-5">
                {/* Call */}
                <a
                  href={`tel:${property.list_agent_office?.list_agent_preferred_phone || property.agent_phone || "12067392150"}`}
                  className="flex flex-col items-center justify-center border p-2 hover:bg-gray-200 transition"
                >
                  <Phone className="w-6 h-6 text-gray-700" />
                  <span className="text-[0.6rem] md:text-xs mt-1">Call</span>
                </a>

                {/* WhatsApp */}
                <a
  href={`https://wa.me/${property.list_agent_office?.list_agent_preferred_phone || property.agent_phone || "12067392150"}`}
  target="_blank"
  rel="noopener noreferrer"
  className="flex flex-col items-center justify-center border p-2 hover:bg-gray-200 transition"
>
  <FaWhatsapp  className="w-6 h-6 text-gray-700" />
  <span className="text-[0.6rem] md:text-xs mt-1">WhatsApp</span>
</a>


                {/* Mail */}
                <a
                  href={`mailto:${property.list_agent_office?.list_office_email || property.agent_email || 'agent@kw.com'}`}
                  className="flex flex-col items-center justify-center border p-2 hover:bg-gray-200 transition"
                >
                  <Mail className="w-6 h-6 text-gray-700" />
                  <span className="text-[0.6rem] md:text-xs mt-1">Mail</span>
                </a>

                {/* File */}
                <button
  onClick={() => {
    // Get agent ID from property data - try multiple possible fields
    const agentId = property?.list_agent_office?.list_agent_id || 
                   property?.list_agent_office?.kw_uid || 
                   property?.list_agent_office?.agent_id ||
                   property?.agent_id || 
                   property?.list_agent_id ||
                   property?.listing_agent_kw_uid ||
                   property?.agent_kw_uid ||
                   property?.kw_id || 
                   property?.list_id || 
                   property?.id;
    
    if (agentId) {
      // Store agent data in localStorage for the agent details page to use
      const agentData = {
        name: property?.list_agent_office?.list_agent_full_name || property?.list_agent_full_name || '',
        fullName: property?.list_agent_office?.list_agent_full_name || property?.list_agent_full_name || '',
        email: property?.list_agent_office?.list_office_email || property?.agent_email || '',
        phone: property?.list_agent_office?.list_agent_preferred_phone || property?.agent_phone || '',
        image: (property?.list_agent_office?.list_agent_url && /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(property?.list_agent_office?.list_agent_url)) 
          ? property?.list_agent_office?.list_agent_url 
          : '/avtar.jpg',
        city: property?.list_address?.city || property?.city || '',
        office: property?.list_agent_office?.list_office_name || '',
        kw_id: property?.kw_id || property?.list_id || property?.id || '',
        _id: agentId
      };
      localStorage.setItem('selectedAgent', JSON.stringify(agentData));
      
      // Navigate directly to agent details page using the ID
      router.push(`/agent/${agentId}`);
    } else {
      // Fallback: store agent data and navigate to newdetails page
      const agentData = {
        name: property?.list_agent_office?.list_agent_full_name || property?.list_agent_full_name || '',
        fullName: property?.list_agent_office?.list_agent_full_name || property?.list_agent_full_name || '',
        email: property?.list_agent_office?.list_office_email || property?.agent_email || '',
        phone: property?.list_agent_office?.list_agent_preferred_phone || property?.agent_phone || '',
        image: (property?.list_agent_office?.list_agent_url && /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(property?.list_agent_office?.list_agent_url)) 
          ? property?.list_agent_office?.list_agent_url 
          : '/avtar.jpg',
        city: property?.list_address?.city || property?.city || '',
        office: property?.list_agent_office?.list_office_name || '',
        kw_id: property?.kw_id || property?.list_id || property?.id || ''
      };
      localStorage.setItem('selectedAgent', JSON.stringify(agentData));
      router.push('/agent/newdetails');
    }
  }}
  className="flex flex-col items-center justify-center border p-2 hover:bg-gray-200 transition"
>
  <User  className="w-6 h-6 text-gray-700" />
  <span className="text-[0.6rem] md:text-xs mt-1">Profile</span>
</button>

              </div>
            </div>
          </div>

        </main>
        )}
        </div>
          {/* MAP LOCATION TAB CONTENT */}
          {/* MAP LOCATION TAB CONTENT */}
{activeTab === "map" && (
  <div  className="w-full">
    {/* <h2 className="text-lg md:text-2xl md:mx-36 mb-6 font-semibold text-gray-800 text-left flex items-center gap-2 tracking-[0.1rem]">
      <PiMapPinLineThin className="text-[rgb(179,4,4)] text-xl md:text-2xl" />
      MAP LOCATION
    </h2> */}

    <div className="px-6 md:px-36 mt-4 md:mt-10">  {/* 👈 horizontal margin */}
      <div className="w-full h-64 md:h-80 lg:h-[400px] overflow-hidden shadow-md">
        <iframe
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.222373018991!2d${property?.longitude || -122.389936}!3d${property?.latitude || 37.768255}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzA1LjciTiAxMjLCsDIzJzIzLjgiVw!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  </div>
)}

         {/* 360 TOUR TAB CONTENT */}
{activeTab === "tour" && (
  <div className="w-full">
    <div className="flex flex-col items-center justify-center px-6 md:px-36 mt-4 md:mt-10">
      

      <div className="flex flex-col items-center mx-4 w-full">
        {/* Main Image Container */}
        <div className="w-full h-64 md:h-80 lg:h-[400px]  overflow-hidden shadow-md relative mb-4 md:mb-6 cursor-pointer">
          <Image
            src={propertyImages[currentImageIndex]}
            alt="360 Virtual Tour"
            width={1200}
            height={800}
            className="w-full h-full object-cover"
          />

<div className="absolute inset-0 flex flex-col items-center justify-center">
  <Image
    src="/360logo.png"
    alt="360° Overlay"
    width={80}
    height={80}
    className="md:w-[120px] md:h-[120px]"
  />
  <p className="mt-2 text-white text-sm md:text-lg font-semibold">Click here</p>
</div>
         
        </div>

        {/* Centered Button */}
        {/* <div className="flex justify-center w-full">
          <button
            onClick={() => {
              const fullscreenImage = propertyImages[currentImageIndex];
              if (fullscreenImage) {
                const newWindow = window.open(
                  fullscreenImage,
                  "_blank",
                  "width=1200,height=800,scrollbars=yes,resizable=yes"
                );
                if (newWindow) {
                  newWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <title>360 Virtual Tour - Full Screen</title>
                        <style>
                          body { 
                            margin: 0; 
                            padding: 0; 
                            background: #000; 
                            display: flex; 
                            justify-content: center; 
                            align-items: center; 
                            height: 100vh;
                            overflow: hidden;
                          }
                          img { 
                            max-width: 100%; 
                            max-height: 100vh; 
                            object-fit: contain;
                            border-radius: 8px;
                          }
                          .close-btn {
                            position: fixed;
                            top: 20px;
                            right: 20px;
                            background: rgba(0,0,0,0.7);
                            color: white;
                            border: none;
                            padding: 10px 15px;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 16px;
                            z-index: 1000;
                          }
                          .close-btn:hover {
                            background: rgba(0,0,0,0.9);
                          }
                        </style>
                      </head>
                      <body>
                        <button class="close-btn" onclick="window.close()">Close</button>
                        <img src="${fullscreenImage}" alt="360 Virtual Tour" />
                      </body>
                    </html>
                  `);
                  newWindow.document.close();
                }
              }
            }}
            className="px-4 md:px-8 py-2 md:py-3  bg-gray-400 text-white text-sm md:text-lg font-semibold shadow hover:bg-gray-500 transition"
          >
            View in Full Screen
          </button>
        </div> */}
      </div>
    </div>
  </div>
)}
</div>
      
      <NewFooter />
    </div>
  );
}