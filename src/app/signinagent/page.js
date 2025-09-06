'use client'
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/header";
import { FaChevronRight } from "react-icons/fa";

const AgentProfile = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agentData, setAgentData] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [allProperties, setAllProperties] = useState([]);

  // Format price function
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price.toLocaleString('en-US');
    }
    if (typeof price === 'string' && !isNaN(Number(price))) {
      return Number(price).toLocaleString('en-US');
    }
    return price || '';
  };

  // Fetch agent data
  useEffect(() => {
    async function fetchAgentData() {
      try {
        // You can modify this to fetch a specific agent by slug
        const agentRes = await fetch('https://kwsaudi.x-360.ai/api/agents/agents');
        if (agentRes.ok) {
          const agents = await agentRes.json();
          // Find the specific agent (you can modify this logic)
          const agent = agents.find(a => 
            a.fullName?.includes("Ceri") || 
            a.fullName?.includes("Binucci") ||
            a.kwId === "2000046976"
          ) || {
            fullName: "Ceri Binucci",
            kwId: "2000046976",
            city: "Jeddah",
            marketCenter: "Jeddah",
            phone: "+966558787114",
            email: "othmanbotman@kwsaudiarabia.com"
          };
          
          setAgentData({
            name: agent.fullName || "Ceri Binucci",
            kwId: agent.kwId || "2000046976",
            city: agent.city || "Jeddah",
            marketCenter: agent.marketCenter || "Jeddah",
            mobile: agent.phone || "+966558787114",
            email: agent.email || "othmanbotman@kwsaudiarabia.com",
            profileImage: agent.profileImage || "/agent.jpg"
          });
        }
      } catch (err) {
        console.error('Error fetching agent data:', err);
        // Fallback to default data
        setAgentData({
          name: "Ceri Binucci",
          kwId: "2000046976",
          city: "Jeddah",
          marketCenter: "Jeddah",
          mobile: "+966558787114",
          email: "othmanbotman@kwsaudiarabia.com",
          profileImage: "/agent.jpg"
        });
      }
    }
    fetchAgentData();
  }, []);

  // Fetch properties for the agent
  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://kwsaudi.x-360.ai/api/listings/list/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            limit: 2000,
            page: 1,
          })
        });

        const data = await res.json();
        let fetched = [];
        if (Array.isArray(data?.data)) {
          fetched = data.data;
        }
        
        setAllProperties(fetched);
        
        // Filter properties for this specific agent
        const agentProperties = fetched.filter(property => {
          if (!agentData) return false;
          
          // Check if property belongs to this agent
          const propertyAgentName = property.agent?.name || property.agent?.fullName || '';
          const agentName = agentData.name || '';
          
          return propertyAgentName.toLowerCase().includes(agentName.toLowerCase()) ||
                 agentName.toLowerCase().includes(propertyAgentName.toLowerCase()) ||
                 property.agent?.kwId === agentData.kwId;
        });
        
        setProperties(agentProperties);
        
        // Update agent data with property counts
        if (agentData) {
          setAgentData(prev => ({
            ...prev,
            activeListings: agentProperties.length,
            propertyCount: agentProperties.length
          }));
        }
      } catch (err) {
        setError('Failed to load properties');
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    }
    
    if (agentData) {
      fetchProperties();
    }
  }, [agentData]);

  return (
    <div className="relative p-4 sm:p-6 md:p-8">
      <Header />

      <div className="absolute top-0 left-0 w-20 h-20 sm:w-[100px] sm:h-[100px] md:w-[150px] md:h-[150px] bg-[rgb(206,32,39,255)] z-0"></div>
      <div className="relative bg-gray-100">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 p-4 flex flex-col mt-20 pl-20">
            <h1 className="text-xl font-bold text-gray-500 py-6">Dashboard</h1>

            <nav>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-center gap-2 cursor-pointer hover:text-[rgb(206,32,39,255)]">
                  <i className="fas fa-user"></i> Profile
                </li>
                <li className="flex items-center gap-2 cursor-pointer hover:text-[rgb(206,32,39,255)]">
                  <i className="fas fa-calendar"></i> Calendar
                </li>
                <li className="flex items-center gap-2 cursor-pointer hover:text-[rgb(206,32,39,255)]">
                  <i className="fas fa-folder"></i> Agent Drive
                </li>
                <li className="flex items-center gap-2 cursor-pointer hover:text-[rgb(206,32,39,255)]">
                  <i className="fas fa-calendar-alt"></i> Events
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {/* Header */}
            <div className="flex justify-end gap-2 mb-6">
              <button className="px-4 py-2 bg-gray-800 text-white rounded">
                Agent Space
              </button>
              <button className="px-4 py-2 bg-[rgb(206,32,39,255)] text-white rounded">
                Sign Out
              </button>
            </div>

            {/* Profile Card */}
            <div className="bg-white mt-10">
            <h2 className="text-xl flex justify-center font-bold mb-4 py-10">
  <span className="text-[rgb(206,32,39,255)] mr-2">
    {(agentData?.name || "Ceri Binucci").split(" ")[0]}
  </span>{" "}
  <span className="text-black">
    {(agentData?.name || "Ceri Binucci").split(" ").slice(1).join(" ")}
  </span>
</h2>


  <div className="flex justify-center items-stretch gap-40">
    <div className="flex-shrink-0">
      <Image
        src={agentData?.profileImage || "/avtar.jpg"}
        alt="Agent"
        width={170}
        height={240}
        className="rounded border h-full object-cover"
      />
    </div>

    <div className="space-y-2 text-base">
      <p><span className="text-[rgb(206,32,39,255)] mr-2 ">KW ID: </span> {agentData?.kwId || "2000046976"}</p>
      <p><span className="text-[rgb(206,32,39,255)] mr-2">ACTIVE LISTINGS: </span> {agentData?.activeListings || 0}</p>
      <p><span className="text-[rgb(206,32,39,255)] mr-2">CITY:</span> {agentData?.city || "Jeddah"}</p>
      <p><span className="text-[rgb(206,32,39,255)] mr-2">MARKET CENTER:</span> {agentData?.marketCenter || "Jeddah"}</p>
      <p><span className="text-[rgb(206,32,39,255)] mr-2">MOBILE NUMBER:</span> {agentData?.mobile || "+966558787114"}</p>
      <p><span className="text-[rgb(206,32,39,255)] mr-2">EMAIL:</span> {agentData?.email || "othmanbotman@kwsaudiarabia.com"}</p>
      <p><span className="text-[rgb(206,32,39,255)] mr-2"> COUNT:</span> {agentData?.propertyCount || 0}</p>
    </div>
  </div>
</div>


            {/* Properties Section */}
            <div className="bg-white">
            <h3 className="text-2xl font-semibold py-10 flex justify-center items-start">
  <span>{properties.length} properties from</span>
  <span className="ml-2 text-[rgb(206,32,39,255)]">
    {agentData?.name || "Ceri Binucci"}
  </span>
</h3>


              {loading ? (
                <div className="flex justify-center items-center h-60">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[rgb(206,32,39,255)]"></div>
                </div>
              ) : error ? (
                <div className="text-[rgb(206,32,39,255)] text-center">{error}</div>
              ) : properties.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  No properties found for this agent.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.slice(0, visibleCount).map((property, idx) => (
                      <div
                        key={property._kw_meta?.id || property.id || idx}
                        className="bg-white shadow-2xl overflow-hidden w-full cursor-pointer"
                        onClick={() => {
                          const propertyId = property._kw_meta?.id || property.id || idx;
                          window.location.href = `/propertydetails/${propertyId}`;
                        }}
                      >
                        <div className="relative w-full h-50 md:h-60">
                          <Image
                            src={
                              property.image ||
                              (Array.isArray(property.images) && property.images[0]) ||
                              (Array.isArray(property.photos) && property.photos[0]?.ph_url) ||
                              '/property.jpg'
                            }
                            alt={property.title || property.prop_type || 'property'}
                            fill
                            className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          />
                          
                          {/* Property badges */}
                          <div className="absolute bottom-0 right-0 bg-black/80 text-white px-2 py-1 flex flex-row items-center gap-3">
                            {/* Beds */}
                            <div className="flex flex-col items-center">
                              <span className="relative w-5 h-5">
                                <Image src="/bed.png" alt="bed" fill className="object-contain invert" />
                              </span>
                              <span className="text-xs mt-1">
                                {property.total_bed || property.beds || property.bedrooms || 0}
                              </span>
                            </div>

                            {/* Baths */}
                            <div className="flex flex-col items-center">
                              <span className="relative w-5 h-5">
                                <Image src="/bath.png" alt="bath" fill className="object-contain invert" />
                              </span>
                              <span className="text-xs mt-1">
                                {property.total_bath || property.baths || property.bathrooms || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Property Details */}
                        <div className="p-4 py-6">
                          <h3 className="text-gray-700 text-lg flex justify-start items-center">
                            {property.title || property.prop_type || property.propertyType || "Property"}
                          </h3>
                          <span className="flex justify-start text-[rgb(206,32,39,255)] text-lg font-semibold">
                            {property?.list_category || property?.propertySubType || "Property"}
                          </span>
                          <p
                            className="text-xl font-bold text-gray-600 mb-2 truncate"
                            title={property.list_address?.address || property.address}
                          >
                            {property.list_address?.address || property.address || "Address not available"}
                          </p>
                          
                          <div className="flex justify-start items-center">
                            <span className="font-medium text-base text-gray-700">
                              {property.price
                                ? `SAR ${formatPrice(property.price)}`
                                : property.current_list_price
                                ? `SAR ${formatPrice(property.current_list_price)}`
                                : property.rental_price
                                ? `SAR ${formatPrice(property.rental_price)}`
                                : "Price on request"}
                            </span>
                          </div>
                          
                          {property.price_qualifier && (
                            <p className="text-xs text-gray-500 mt-1">
                              {property.price_qualifier}
                            </p>
                          )}
                        </div>
                        
                        <button 
                          className="w-full bg-[rgb(206,32,39,255)] text-white font-bold text-base py-3 px-4 flex items-center justify-end gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            const propertyId = property._kw_meta?.id || property.id || idx;
                            window.location.href = `/propertydetails/${propertyId}`;
                          }}
                        >
                          <span>MORE DETAILS</span>
                          <FaChevronRight className="text-white w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Load More Button */}
                  {visibleCount < properties.length && (
                    <div className="flex justify-center items-center my-10">
                      <button
                        className="w-80 py-2 px-4 bg-gray-500 text-white text-lg font-semibold transition hover:bg-gray-600"
                        onClick={() => setVisibleCount(c => c + 6)}
                      >
                        View More Properties..
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;
