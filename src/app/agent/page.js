'use client'
import React, { useEffect, useState, useRef, Suspense } from 'react';
import Header from '@/components/header';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaPhoneAlt,FaChevronRight, FaEnvelope, FaSearch } from 'react-icons/fa';
import { MdPhone } from "react-icons/md";

const Footer = dynamic(() => import('@/components/newfooter'), { ssr: false });

// Wrapper component that uses useSearchParams
const AgentContent = () => {
  const [agents, setAgents] = useState([]);
  const [filter, setFilter] = useState("agent");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const agentsPerPage = 10;
  const [totalAgents, setTotalAgents] = useState(0);

  const [filterName, setFilterName] = useState("");
  const [filterMarket, setFilterMarket] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const searchTimeoutRef = useRef(null);
  const [searchTrigger, setSearchTrigger] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL parameters and pre-fill search fields
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam && searchParam !== filterName) {
      // Ensure filter is set to "agent" for search to work
      setFilter("agent");
      setFilterName(searchParam);
      // Force search to trigger by incrementing search trigger
      setSearchTrigger(prev => prev + 1);
    }
  }, [searchParams, filterName]);

  // Simple timeout-based search when user stops typing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    const timeout = setTimeout(() => {
      if (filterName.trim()) {
        setSearchTrigger(prev => prev + 1);
      }
    }, 500); // Wait 500ms after user stops typing
    
    searchTimeoutRef.current = timeout;
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [filterName]);

  useEffect(() => {
    if (filter !== "agent") return;
    const fetchAgents = async () => {
      if (currentPage > 1) setLoadingMore(true); else setLoading(true);
      setError(null);

      try {
        let query = `?page=${currentPage}&limit=${agentsPerPage}`;
        if (filterName.trim()) query += `&name=${encodeURIComponent(filterName.trim())}`;
        if (filterMarket && filterMarket !== "MARKET CENTER") query += `&marketCenter=${encodeURIComponent(filterMarket)}`;
        if (filterCity && filterCity !== "CITY" && filterCity !== "RESET_ALL") query += `&city=${encodeURIComponent(filterCity)}`;

        // Use the correct API endpoint for agents
        const response = await fetch(`https://kwsaudi.x-360.ai/api/agents/merge${query}`);
        if (!response.ok) throw new Error('Failed to fetch agents');
        const data = await response.json();

        const mappedAgents = Array.isArray(data.data) ? data.data.map(agent => ({
          name: agent.fullName || agent.name,
          phone: agent.phone || agent.phoneNumber,
          email: agent.email || agent.emailAddress,
          city: agent.city,
          image: agent.photo || agent.profileImage || agent.image,
          _id: agent._id || agent.id,
          marketCenter: agent.marketCenter || agent.market || "",
          kw_id: agent.kwId || agent.kw_id || ""
        })) : [];

        if (currentPage === 1) {
          setAgents(mappedAgents);
        } else {
          setAgents(prev => [...prev, ...mappedAgents]);
        }

        setTotalAgents(data.total || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };
    fetchAgents();
  }, [currentPage, filterName, filterMarket, filterCity, filter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterName, filterMarket, filterCity]);

  // Handle search trigger changes
  useEffect(() => {
    if (searchTrigger > 0) {
      // Reset to page 1 when search changes
      setCurrentPage(1);
    }
  }, [searchTrigger]);

  const handleAgentClick = (agent) => {
    if (typeof window !== 'undefined') {
      // Navigate to dynamic route with agent ID
      const agentId = agent._id || agent.kw_id || agent.kwId || agent.id;
      router.push(`/agent/${agentId}`);
    }
  };

  return (
    <div>
    <div className="relative p-4 sm:p-6 md:p-8">
      <Header />

      <div className="absolute top-0 left-0 w-20 h-20 sm:w-[100px] sm:h-[100px] md:w-[150px] md:h-[150px] bg-[rgb(206,32,39,255)] z-0"></div>

      <div className="relative bg-gray-100">
        <div className="pt-32 sm:pt-32 md:pt-44">
          <h1 className="text-start font-semibold text-2xl sm:text-3xl md:text-[40px] mx-4 sm:mx-10 md:mx-36 text-gray-700">
            {filter === "agent" ? "Find a local estate agent" : "Find a Market Center"}
          </h1>
        </div>

        <div className="bg-white shadow-lg mx-4 sm:mx-10 md:mx-36">
          <div className="grid grid-cols-1 md:grid-cols-2 my-6 sm:my-8 md:my-10 p-4 sm:px-6 md:px-10 gap-6 sm:gap-8">

            {/* Left */}
            <div className="space-y-6 md:pr-6">
              <div className="grid grid-cols-1 gap-6">

                {/* Sticky Search */}
                <div className="sticky top-12 sm:top-14 md:top-15 bg-white z-10 py-3 sm:py-4">
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-6 mb-3 sm:mb-4 text-gray-700 text-sm sm:text-base">
                    <span className="font-medium">Search by:</span>
                    <label className="flex items-center gap-1 sm:gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="agent"
                        checked={filter === "agent"}
                        onChange={() => setFilter("agent")}
                        className="text-red-600 focus:ring-red-600"
                      />
                      Agent Name
                    </label>
                    <label className="flex items-center gap-1 sm:gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="market"
                        checked={filter === "market"}
                        onChange={() => setFilter("market")}
                        className="text-red-600 focus:ring-red-600"
                      />
                      Market Center
                    </label>
                  </div>

                  <div className="flex items-center border border-gray-300">
                    <input
                      type="text"
                      placeholder={filter === "agent" ? "Enter Name" : "Enter City"}
                      className="flex-1 px-2 sm:px-3 py-2 sm:py-3 outline-none text-sm sm:text-base"
                      value={filterName}
                      onChange={(e) => {
                        setFilterName(e.target.value);
                        // Clear any existing timeout when user types
                        if (searchTimeoutRef.current) {
                          clearTimeout(searchTimeoutRef.current);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          // Trigger search immediately on Enter key
                          setSearchTrigger(prev => prev + 1);
                        }
                      }}
                    />
                    <button 
                      className="bg-[rgb(206,32,39,255)] text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center"
                      onClick={() => {
                        // Force search by incrementing search trigger
                        setSearchTrigger(prev => prev + 1);
                      }}
                    >
                      <FaSearch size={20} className="sm:w-6 sm:h-6" />
                    </button>
                  </div>

                  <div className="mt-2 text-right">
                    <button
                      className="text-[rgb(206,32,39,255)] text-xs sm:text-sm hover:underline"
                      onClick={() => {
                        setFilterName("");
                        setFilterMarket("");
                        setFilterCity("");
                      }}
                    >
                      Clear my search
                    </button>
                  </div>
                </div>

                {/* Conditional Rendering */}
                {filter === "agent" ? (
                  <>
                    {loading && currentPage === 1 && (
                      <div className="flex justify-center items-center h-40 sm:h-60">
                        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-4 border-b-4 border-[rgb(206,32,39,255)]"></div>
                      </div>
                    )}
                    {error && <div className="text-red-500">{error}</div>}
                    {!loading && !error && agents.length === 0 && (
                      <div>No agents found.</div>
                    )}

                    {!loading && !error && agents.map((agent, idx) => (
                      <article key={agent._id || idx}  className={`p-3 sm:p-4 flex flex-row items-start gap-3 sm:gap-4 relative ${
      idx !== agents.length - 1 ? 'border-b border-gray-300' : ''
    }`}
                       >
                        <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 relative">
                          <Image
                            src={agent.image || "/avtar.jpg"}
                            alt={`Portrait of ${agent.name}`}
                            width={128}
                            height={128}
                            className="object-cover w-full h-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              const agentId = agent._id || agent.kw_id || agent.kwId || agent.id;
                              router.push(`/agent/${agentId}`);
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-lg md:text-2xl font-semibold mb-2">{agent.name}</h3>
                          <p className="text-sm sm:text-base mb-2 break-all flex items-center gap-2">
                            <FaPhoneAlt className="text-gray-600" /> {agent.phone}
                          </p>
                          <p className="text-sm sm:text-base mb-4 break-all flex items-center gap-2">
                            <FaEnvelope className="text-gray-600" /> {agent.email}
                          </p>
                          <button
                            onClick={() => handleAgentClick(agent)}
                            className="hover:text-[rgb(206,32,39,255)] font-semibold transition-colors py-2 sm:py-3  flex items-center justify-end 
                            gap-1 sm:gap-2 text-base sm:text-base"
                          >
                            <span>View Details & Properties</span>
                            <FaChevronRight className="w-3 h-3 mt-0.5" />
                          </button>
                        </div>
                      </article>
                    ))}

                    {!loading && agents.length < totalAgents && (
                      <div className="flex justify-center mt-4 sm:mt-6">
                        <button
                          className="px-4 sm:px-6 py-2 font-semibold bg-gray-500 text-white text-sm sm:text-base"
                          onClick={() => setCurrentPage(prev => prev + 1)}
                          disabled={loadingMore}
                        >
                          {loadingMore ? "Loading..." : "Show More Agents"}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {loading ? (
                      <div className="flex justify-center items-center h-40 sm:h-60">
                        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-[rgb(206,32,39,255)]"></div>
                      </div>
                    ) : (
                      <>
                        <article className="p-3 sm:p-4 border-b border-gray-300 flex flex-col gap-2">
                          <h3 className="text-lg sm:text-lg md:text-2xl font-semibold mb-2">Keller Williams Jasmin</h3>
                          <p className="text-sm md:text-base mb-2 sm:mb-4">Dist, 2740 King Fahd Branch Rd, as Sahafah, 6403, Riyadh 13315</p>
                          <p className="text-sm md:text-base break-all flex items-center gap-2">
                            <FaPhoneAlt className="text-gray-600"/> 09200-15671
                          </p>
                          <p className="text-sm md:text-base break-all flex items-center gap-2">
                            <FaEnvelope className="text-gray-600"/> info@kwsaudiarabia.com
                          </p>
                          <a href='/jasmin' className="hover:text-[rgb(206,32,39,255)] font-semibold transition-colors py-2 sm:py-3 flex items-center justify-start 
                            gap-1 sm:gap-2 text-base sm:text-base">
                            More Details <FaChevronRight className="w-3 h-3 mt-0.5" />
                          </a>
                        </article>
                        <article className="p-3 sm:p-4 flex flex-col gap-2">
                          <h3 className="text-lg sm:text-lg md:text-2xl font-semibold mb-2">Keller Williams Jeddah</h3>
                          <p className="text-sm md:text-base mb-2 sm:mb-4">Al Khalidiyyah, Jeddah 23421</p>
                          <p className="text-sm md:text-base break-all flex items-center gap-2">
                            <FaPhoneAlt className="text-gray-600"/> 09200-15671
                          </p>
                          <p className="text-sm md:text-base break-all flex items-center gap-2">
                            <FaEnvelope className="text-gray-600"/> info@kwsaudiarabia.com
                          </p>
                          <a href='/jeddah'  className="hover:text-[rgb(206,32,39,255)] font-semibold transition-colors py-2 sm:py-3  flex items-center justify-start 
                            gap-1 sm:gap-2 text-base sm:text-base">
                            More Details <FaChevronRight className="w-3 h-3 mt-0.5" />
                          </a>
                        </article>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Right: Sticky Map */}
            <div className="pl-0 my-6 md:my-10 sticky md:top-20 h-[300px] sm:h-[400px] md:h-[calc(100vh-5rem)]">
              <div className="relative w-full overflow-hidden border border-gray-200 h-full">
                <iframe
                  title="Saudi Arabia Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4444535.330365576!2d41.51259970861697!3d23.8006960408425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15e8e4f105f8aaaf%3A0x70a8a6a2cb7f9405!2sSaudi%20Arabia!5e0!3m2!1sen!2sin!4v1717315040974!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      
      </div>
    
    </div>
  );
};

// Main component that wraps AgentContent in Suspense
const Agent = () => {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-[rgb(206,32,39,255)]"></div>
      </div>
    }>
      <AgentContent />
    </Suspense>
  );
};

export default Agent;
