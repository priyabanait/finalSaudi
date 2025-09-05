'use client'

import { FaSearch, FaBars, FaTimes, FaBuilding, FaChevronDown, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { FaQuoteRight, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import Newfooter from "@/components/newfooter";
import Header from "@/components/header";
import Image from 'next/image';
import {
  UsersIcon,
  HandshakeIcon,
  DocumentTextIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from 'framer-motion';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Custom hook for intersection observer
const useInView = (options = {}) => {
  const [ref, setRef] = useState(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    observer.observe(ref);

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [ref, options]);

  return [setRef, isInView];
};

// Custom hook for counting animation
const useCountUp = (end, start = 0, duration = 2000, delay = 0) => {
  const [count, setCount] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const currentCount = Math.floor(start + (end - start) * progress);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const timeoutId = setTimeout(() => {
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [end, start, duration, delay, hasStarted]);

  const startAnimation = () => {
    if (!hasStarted) {
      setHasStarted(true);
    }
  };

  return [count, startAnimation];
};
const Home = () => {

  const scrollRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  // Hero background images array and index state
  const heroImages = [
    "/Banner 1.png",
    "/Banner 2.png",
    "/Banner 4.png",
    "/Banner 3.png",

  ];
  const [mobilePropertySearchTerm, setMobilePropertySearchTerm] = useState('');
  const [mobileAgentSearchTerm, setMobileAgentSearchTerm] = useState('');
  const [propertySearchTerm, setPropertySearchTerm] = useState('');
  const [heroIndex, setHeroIndex] = useState(0);
  const [isBlurring, setIsBlurring] = useState(true);
  const [prevHeroIndex, setPrevHeroIndex] = useState(null);
  const stats = [
    { value: '$532B', label1: 'Total Sales Volume', label2: 'Worldwide' },
    { value: '$1.4B', label1: 'Closed Transactions', label2: 'Worldwide' },
    { value: '1002', label1: 'Market Centers', label2: 'Worldwide' },
    { value: '191K', label1: 'Real Estate Agents', label2: 'Worldwide' },
  ];
  const testimonials = [
    {
      quote: "I'm truly grateful to be part of the Keller Williams family. After God's blessings, I found real comfort in practicing brokerage under KW’s umbrella. Before recent regulations, the market was unorganized, and earning commissions was often a struggle. At KW, I can achieve my goals without the stress of dealing with unreliable brokers. I look forward to seeing KW continue to grow and adapt to meet market needs.",
      name: "Abdulrahman Al-Rajihi",
      role: "KW Agent",
    },
    {
      quote: "Keller Williams is a global leader in real estate, driven by innovation in marketing and property technology. What inspired me to join was their proven success in the U.S. market, their effectiveness in the industry, and their clear vision for shaping the Saudi real estate market.",
      name: "Hani Al-Saadi",
      role: "KW Agent",
    },
    {
      quote: "Keller Williams is a global leader in real estate, driven by innovation in marketing and property technology. What inspired me to join was their proven success in the U.S. market, their effectiveness in the industry, and their clear vision for shaping the Saudi real estate market.",
      name: "Hani Al-Saadi",
      role: "KW Agent",
    },

  ]; const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 10000); // 20 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);
  useEffect(() => {
    const interval = setInterval(() => {
      setPrevHeroIndex(heroIndex);
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [heroIndex, heroImages.length]);

  useEffect(() => {
    setIsBlurring(true);
    const timeout = setTimeout(() => setIsBlurring(false), 800); // 0.8s blur duration
    return () => clearTimeout(timeout);
  }, [heroIndex]);

  useEffect(() => {
    if (prevHeroIndex !== null) {
      const timeout = setTimeout(() => setPrevHeroIndex(null), 800); // match transition duration
      return () => clearTimeout(timeout);
    }
  }, [prevHeroIndex]);
  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };
  // Trending properties state
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);

  // Helper function to format numbers with commas
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price.toLocaleString('en-US');
    }
    if (typeof price === 'string' && !isNaN(Number(price))) {
      return Number(price).toLocaleString('en-US');
    }
    return price || '';
  };

  // Icons for the top-right overlay on property cards
  const bedIconUrl = "/bed.png";
  const bathIconUrl = "/bath.png";

  const [filterCategory, setFilterCategory] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // filtering logic
  const filteredProperties = useMemo(() => {
    if (!isClient) return properties;

    return properties.filter((property) => {
      // Get the appropriate search term based on device
      const searchTerm = typeof window !== 'undefined' && window.innerWidth >= 768 ? propertySearchTerm : mobilePropertySearchTerm;

      // Search through multiple property fields
      const searchableFields = [
        property.list_address?.address || '',
        property.list_address?.city || '',
        property.list_address?.street_name || '',
        property.list_address?.state || '',
        property.list_address?.full_street_address || '',
        property.list_address.postal_code || '',
        property.title || '',
        property.property_title || '',
        property.prop_type || '',
        property.list_category || '',
        property.price?.toString() || '',
        property.current_list_price?.toString() || ''
      ].join(' ').toLowerCase();

      const searchTermLower = searchTerm.toLowerCase();

      // Check if search term matches any of the searchable fields
      const matchesSearch = searchTerm === '' || searchableFields.includes(searchTermLower);

      // Check if property matches the selected category
      const matchesCategory = !filterCategory ||
        property.list_category?.toLowerCase() === filterCategory.toLowerCase() ||
        (filterCategory === 'Sale' && property.list_category?.toLowerCase().includes('sale')) ||
        (filterCategory === 'Rent' && property.list_category?.toLowerCase().includes('rent'));

      return matchesSearch && matchesCategory;
    });
  }, [properties, propertySearchTerm, mobilePropertySearchTerm, filterCategory, isClient]);
  useEffect(() => {
    const fetchProperties = async () => {
      setLoadingProperties(true);
      try {
        const res = await fetch(
          "https://kwbackend.jc2g.in/api/listings/list/properties",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              page: 1,
              limit: 50,

            }),
          }
        );

        const data = await res.json();

        let fetched = [];
        if (Array.isArray(data?.data)) {
          fetched = data.data;
        }

        console.log("Fetched properties:", fetched.slice(0, 2));

        // ✅ update state
        setProperties(fetched);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties([]);
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchProperties();
  }, []);

  const [clear, setClear] = useState(false)

  // Animation states for the stats section
  const [statsRef, isStatsInView] = useInView({ threshold: 0.3 });
  const [count212000, startCount212000] = useCountUp(212000, 0, 2000, 500);
  const [count1100000, startCount1100000] = useCountUp(1100000, 0, 2000, 700);
  const [count4300, startCount4300] = useCountUp(4300, 0, 2000, 900);
  const [count180, startCount180] = useCountUp(180, 0, 2000, 1100);


  // Track if animations have been triggered
  const [animationTriggered, setAnimationTriggered] = useState(false);

  // Start counting animations when section comes into view (only once)
  useEffect(() => {
    if (isStatsInView && !animationTriggered) {
      // Section came into view for the first time - start animations
      setAnimationTriggered(true);
      startCount212000();
      startCount1100000();
      startCount4300();
      startCount180();
    }
  }, [isStatsInView, animationTriggered, startCount212000, startCount1100000, startCount4300, startCount180]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setClear(true)
    }, 1000) // 1 second

    return () => clearTimeout(timer)
  }, [])
  useEffect(() => {
    const el = scrollRef.current;

    const checkOverflow = () => {
      if (el && el.scrollWidth > el.clientWidth) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    checkOverflow(); // Initial check
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [properties]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      setShowBackButton(el.scrollLeft > 0);
    };

    el.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => el.removeEventListener("scroll", handleScroll);
  }, [properties]);

  const getCardScrollStep = () => {
    const el = scrollRef.current;
    if (!el) return 300;
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      const firstCard = el.querySelector('[data-card="true"]');
      if (firstCard) {
        const cardWidth = firstCard.getBoundingClientRect().width;
        const style = window.getComputedStyle(el);
        const gap = parseInt(style.columnGap || style.gap || "0", 10) || 0;
        return cardWidth + gap;
      }
    }
    return 300;
  };
  const scrollRight = () => {
    if (scrollRef.current) {
      const step = getCardScrollStep();
      scrollRef.current.scrollBy({ left: step, behavior: "smooth" });
    }
  }
  const handleScrollLeft = () => {
    if (scrollRef.current) {
      const step = getCardScrollStep();
      scrollRef.current.scrollBy({ left: -step, behavior: "smooth" });
    }
  };
  const [activeTab, setActiveTab] = useState('property');
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Mouse drag handlers for carousel
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1; // scroll-fastness multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  // Add separate state for each search input

  const [agentSearchTerm, setAgentSearchTerm] = useState('');

  const [loadedIndex, setLoadedIndex] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loaded, setLoaded] = useState({}); // track which images are loaded
  const [stableIndex, setStableIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setPrevHeroIndex(heroIndex);
      const nextIndex = (heroIndex + 1) % heroImages.length;
      setHeroIndex(nextIndex);
      setLoadedIndex(null); // reset before new loads
    }, 6000); // every 6s
    return () => clearInterval(interval);
  }, [heroIndex, heroImages.length]);
  return (
    <div>
      <div className="relative p-6 md:p-8">

        {/* Sticky Header */}

        <Header />


        <div className="absolute top-0 left-0 w-[100px] h-[100px] md:w-[150px] md:h-[150px] bg-[rgb(206,32,39,255)] z-0"></div>

        {/* Hero Section */}
        <div className="relative ">


          {/* Background Image with previous blurring out and next coming in */}

          <section className="relative w-full h-screen md:h-[120vh] text-white">
            {/* Background Image Transition */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <AnimatePresence initial={false} mode="sync">
                {[stableIndex, heroIndex]
                  .filter((v, i, a) => a.indexOf(v) === i) // de-dupe when they match
                  .map((idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: idx === heroIndex ? 0 : 1, filter: "blur(15px)" }}
                      animate={{
                        opacity:
                          idx === heroIndex
                            ? (loaded[idx] ? 1 : 0) // new one stays hidden until loaded
                            : 1,                     // old one stays fully visible
                        filter: loaded[idx] ? "blur(0px)" : "blur(15px)",
                      }}
                      exit={{ opacity: idx === stableIndex ? 0 : 1 }} // old fades only after we commit
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                      className="absolute inset-0"
                      onAnimationComplete={() => {
                        // once the new one has faded in, make it the stable one and remove the old
                        if (idx === heroIndex && loaded[idx]) setStableIndex(heroIndex);
                      }}
                      style={{ willChange: "opacity, filter" }}
                    >
                      <Image
                        src={heroImages[idx]}
                        alt="Hero Background"
                        fill
                        priority={idx === 0}
                        className="object-cover"
                        onLoadingComplete={() =>
                          setLoaded((prev) => ({ ...prev, [idx]: true }))
                        }
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>

              {/* Hidden preloader for the *next* image */}
              <div className="hidden">
                <Image
                  src={heroImages[(heroIndex + 1) % heroImages.length]}
                  alt="preload"
                  width={1}
                  height={1}
                  onLoadingComplete={() =>
                    setLoaded((prev) => ({
                      ...prev,
                      [(heroIndex + 1) % heroImages.length]: true,
                    }))
                  }
                />
              </div>
            </div>



            <div className="absolute inset-0"></div>
            <div className="inset-0 bg-opacity-60 z-10" />

            {/* Content */}
            <div className="absolute bottom-20 md:bottom-36 left-0 w-full px-6 md:px-36 pb-8 md:pb-10">
              <div className="max-w-full mx-auto">
                <h1 className="text-3xl sm:text-2xl  md:text-5xl font-bold md:font-semibold mb-3 md:mb-6 leading-tight">
                  Protect your move with a Keller<br className="hidden md:block" />  Williams Agent.
                </h1>

                <p className="text-base sm:text-sm md:text-[1.1rem] font-normal mb-3 md:mb-8 max-w-full md:max-w-2xl">
                  Our real estate agents are business owners, not employees, so you get more choice, time, and a better experience.
                  Get expert advice from the largest real estate franchise in the world.
                </p>

                {/* Tabs */}
                <div className="w-full flex flex-col items-left">

                  {/* Tab Navigation */}
                  <div className="flex flex-col md:flex-row flex-wrap gap-2 md:gap-8 text-lg sm:text-lg md:text-xl font-semibold w-fit mb-4 md:mb-6">
                    <span
                      onClick={() => setActiveTab('property')}
                      className={`pb-1 sm:pb-2 cursor-pointer border-b-4 ${activeTab === 'property' ? 'border-[rgb(206,32,39,255)]' : 'border-transparent'
                        }`}
                    >
                      Find a property
                    </span>

                    <span
                      onClick={() => setActiveTab('agent')}
                      className={`pb-1 sm:pb-2 cursor-pointer border-b-4 ${activeTab === 'agent' ? 'border-[rgb(206,32,39,255)]' : 'border-transparent'
                        }`}
                    >
                      Find an agent
                    </span>
                  </div>


                  {/* Desktop View */}
                  <div className="hidden md:flex md:max-w-2xl flex-col md:flex-row items-center gap-1 md:gap-1">
                    {activeTab === "property" ? (
                      <>
                        {/* Property search */}
                        {/* <div className="relative "> */}
                        {/* <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 md:text-xl text-sm" /> */}
                        <input
                          type="text"
                          value={propertySearchTerm}
                          onChange={(e) => setPropertySearchTerm(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const normalizedSearch = propertySearchTerm.toLowerCase().trim(); // Normalize case
                              router.push(`/buyer?city=${encodeURIComponent(normalizedSearch)}`);
                            }
                          }}
                          placeholder="City, Area or Street"
                          className="w-full md:w-85 px-4 py-2 md:py-3 bg-white shadow-lg text-black text-base md:text-xl outline-none "
                        />

                        {/* </div> */}

                        <div className="flex gap-1 md:gap-1">
                          <button
                            className="bg-[rgb(206,32,39,255)] hover:bg-red-950 text-white px-6 sm:px-4 md:px-6 py-3 text-base md:text-xl font-semibold"
                            onClick={() =>
                              router.push(
                                `/buyer?city=${encodeURIComponent(propertySearchTerm)}&category=sale`
                              )
                            }
                          >
                            Sale
                          </button>
                          <button
                            className="bg-[rgb(206,32,39,255)] hover:bg-red-950 text-white px-6 sm:px-4 md:px-6 py-3 text-base md:text-xl font-semibold"
                            onClick={() =>
                              router.push(
                                `/buyer?city=${encodeURIComponent(propertySearchTerm)}&category=rent`
                              )
                            }
                          >
                            Rent
                          </button>
                          {/* <button
          className="bg-[rgb(206,32,39,255)] hover:bg-red-950 text-white px-6 sm:px-4 md:px-6 py-3 text-base md:text-xl font-semibold"
          onClick={() =>
            router.push(
              `/buyer?city=${encodeURIComponent(propertySearchTerm)}`
            )
          }
        >
          Search
        </button> */}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Agent search */}
                        <div className="relative ">
                          {/* <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 md:text-xl text-sm" /> */}
                          <input
                            type="text"
                            value={agentSearchTerm}
                            onChange={(e) => setAgentSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && agentSearchTerm.trim()) {
                                router.push(`/agent?search=${encodeURIComponent(agentSearchTerm.trim())}`);
                              }
                            }}
                            placeholder="Name or City"
                            className="w-full md:w-85 px-4 py-2 md:py-3 bg-white shadow-lg text-black text-base md:text-xl outline-none "
                          />
                        </div>

                        <button
                          className=" bg-[rgb(206,32,39,255)] hover:bg-red-950 text-white px-15 py-3 text-sm sm:text-base md:text-xl font-semibold mt-2 md:mt-0"
                          onClick={() => {
                            if (agentSearchTerm.trim()) {
                              router.push(`/agent?search=${encodeURIComponent(agentSearchTerm.trim())}`);
                            }
                          }}
                        >
                          Search
                        </button>
                      </>
                    )}
                  </div>



                  {/* Mobile View */}
                  <div className="flex md:hidden  gap-1 ">

                    {activeTab === 'property' ? (
                      <>
                        {/* Input grows to take space */}
                        <input
                          type="text"
                          value={mobilePropertySearchTerm}
                          onChange={e => setMobilePropertySearchTerm(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              router.push(`/buyer?city=${encodeURIComponent(mobilePropertySearchTerm)}`)
                            }
                          }}
                          placeholder="City, Area or Street"
                          className="py-3 px-2 shadow-2xl text-black  w-40  bg-white text-base outline-none"
                        />

                        {/* Buttons stay side by side */}

                        <button className="bg-[rgb(206,32,39,255)] hover:bg-red-950 text-white px-2 py-3 text-base font-semibold">
                          Sale
                        </button>
                        <button className="bg-[rgb(206,32,39,255)] hover:bg-red-950 text-white px-2 py-3 text-base font-semibold ">
                          Rent
                        </button>
                        {/* <button
        className="bg-[rgb(206,32,39,255)] hover:bg-red-950 text-white px-2 py-3 text-base font-normal"
        onClick={() =>
          router.push(
            `/buyer?city=${encodeURIComponent(mobilePropertySearchTerm)}`
          )
        }
      >
        Search
      </button> */}

                      </>
                    ) : (
                      <>
                        <div className="flex md:hidden w-full  items-center gap-1 ">
                          {/* Input takes available width */}
                          <input
                            type="text"
                            value={mobileAgentSearchTerm}
                            onChange={e => setMobileAgentSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && mobileAgentSearchTerm.trim()) {
                                router.push(`/agent?search=${encodeURIComponent(mobileAgentSearchTerm.trim())}`);
                              }
                            }}
                            placeholder="Name or City"
                            className="py-3 px-2 shadow-2xl text-black w-40  bg-white text-normal outline-none"
                          />

                          {/* Search button */}
                          <button
                            className="flex-shrink-0 bg-[rgb(206,32,39,255)] hover:bg-red-950 text-white px-6 py-3 text-normal font-medium"
                            onClick={() => {
                              if (mobileAgentSearchTerm.trim()) {
                                router.push(`/agent?search=${encodeURIComponent(mobileAgentSearchTerm.trim())}`);
                              }
                            }}
                          >
                            Search
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Logos */}
                {/* <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 md:gap-6 mt-6 md:mt-12 items-center">
  <Image 
    src="https://www.kwuk.com/wp-content/uploads/2022/12/portal-logos-home-update-new.svg" 
    alt="Rightmove" 
    width={100} 
    height={40} 
    className="w-[300px] sm:w-[50px] md:w-[700px] h-auto object-contain"
  />
</div> */}

              </div>
            </div>
          </section>

        </div>



        {/* <hr className="w-44 mx-auto bg-[rgb(206,32,39,255)] h-[1.5px] border-0 my-12 md:hidden" /> */}

        {/* Image Grid Section */}
        {/* <div className="md:mx-8 mx-2 md:py-16 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-0 md:gap-2">
    {[
      { label: "Properties", path: 'properties', imageUrl: "/properties.jpg" },
      { label: "Market Center", path: 'marketCenter', imageUrl: "/marketcenter.jpg" },
      { label: "Agent", path: 'agent', imageUrl: "/agent.jpg" },
      { label: "Seller", path: 'seller', imageUrl: "/seller.jpg" },
      { label: "Buyer", path: 'buyer', imageUrl: "/buyer.jpg" },
      { label: "Tenant", path: 'tenant', imageUrl: "/tenant.jpg" },
      { label: "Franchise", path: 'franchise', imageUrl: "/franchise.jpg" },
      { label: "Our Culture", path: 'ourCulture', imageUrl: "/ourculture.jpg" },
    ].map(({ label, imageUrl, path }, i) => (
      <Link href={path} key={i} className="group">
        <div className="rounded-xl md:py-6 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 cursor-pointer">
          <Image
            src={imageUrl}
            alt={label}
            width={120}
            height={100}
            className="h-20 w-20 md:h-52 md:w-52 object-contain"
          />
        </div>
      </Link>
    ))}
  </div> */}

        {/* <div className="flex justify-center items-center md:my-0 my-8 mt-10 md:mt-0 col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-8">
          <hr className="md:w-170 w-44 mx-auto bg-[rgb(206,32,39,255)] border-0 h-[1.5px]" />
        </div>
        <div className="md:w-1/3 md:text-center text-center mb-6 md:mb-0">
       
    </div>
    <div className="flex justify-center text-center my-8 md:my-0 md:mt-30">
          <h1 className="text-center text-[1rem] md:text-[2.2rem] font-bold"><span className="text-[rgb(206,32,39,255)]">OUR </span> MARKET CENTERS</h1>
        </div>
        <div className="w-full mx-auto px-2 md:px-12 lg:px-18 md:py-14 py-4 md:mt-12">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-20">
       
            <div className="lg:w-1/2 overflow-hidden">
          <Link href="/riyadh">
            <Image
              src="/riyaddh.jpg"
              alt="Real Estate Property"
              width={800}
              height={500}
              className={`w-full h-auto max-h-[250px] md:max-h-[530px] object-contain transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                clear ? 'blur-0' : 'blur-xs'
              }`}
            />
          </Link>
        </div>

       
        <div className="lg:w-1/2 overflow-hidden">
          <Link href="/jeddah">
            <Image
              src="/jeddhah.jpg"
              alt="Real Estate Agent"
              width={800}
              height={500}
              className={`w-full h-auto max-h-[250px] md:max-h-[530px] object-contain transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                clear ? 'blur-0' : 'blur-xs'
              }`}
            />
          </Link>
        </div>
          </div>
        </div> */}

        {/* <div className="flex flex-col justify-center items-center md:my-16 my-8 md:gap-2">
     
      <div className="w-full text-center mb-8">
        <h1 className="text-[1rem] md:text-[2.2rem] font-bold">
          <span className="text-[rgb(206,32,39,255)]">TOOLS</span> FOR YOUR NEEDS
        </h1>
      </div>

      
      <div className="w-full md:px-100 px-2 md:px-20">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 justify-center">
          {[
            {
              label: "Seller",
              path: "seller/sellerguid",
              imageUrl: "/sellerguid.jpg",
            },
            {
              label: "Buyer",
              path: "buyer/buyerguid",
              imageUrl: "/buyerguid.jpg",
            },
            {
              label: "Tenant",
              path: "tenant",
              imageUrl: "/tenantguid.jpg",
            },
            {
              label: "KW Training",
              path: "training",
              imageUrl: "/kwtraining.jpg",
            },
          ].map(({ imageUrl, path }, i) => (
            <Link href={path} key={i} className="group">
              <div className="rounded-xl p-2 flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <Image
                  src={imageUrl}
                  alt="image"
                  width={120}
                  height={100}
                  className="h-20 w-20 md:h-40 md:w-40 object-contain"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div> */}




        {/*  <main className="w-full md:mt-4 mt-0">
  <div className="flex flex-col lg:flex-row min-h-screen"> 

  
    <div className="w-full lg:w-1/2 h-[40vh] md:h-[50vh] lg:h-auto relative min-h-[400px]"> 
      <Image
        src="/formimage.jpg"
        alt="Property"
        fill
        className="object-cover"
      />
    </div>


   <div className="w-full lg:w-1/2 flex items-center justify-center bg-[rgb(206,32,39,255)] py-6 sm:py-8 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl">

        <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-normal text-white mb-4 sm:mb-6 md:mb-8 text-center sm:text-left leading-snug">
          YOUR FUTURE MARKET CENTER STARTS WITH ONE BOLD STEP
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 md:mb-6">
          <div>
            <label className="block text-white text-sm sm:text-base md:text-lg font-normal ml-2 mb-1 sm:mb-2" htmlFor="first-name">
              First Name
            </label>
            <input
              className="w-full px-4 py-2 sm:py-3 border text-gray-200 text-sm sm:text-base md:text-lg border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-gray-400 bg-transparent"
              id="first-name"
              type="text"
              placeholder="First Name"
            />
          </div>

          <div>
            <label className="block text-white text-sm sm:text-base md:text-lg font-normal ml-2 mb-1 sm:mb-2" htmlFor="last-name">
              Last Name
            </label>
            <input
              className="w-full px-4 py-2 sm:py-3 border text-gray-200 text-sm sm:text-base md:text-lg border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-gray-400 bg-transparent"
              id="last-name"
              type="text"
              placeholder="Last Name"
            />
          </div>
        </div>

        <div className="mb-4 md:mb-6">
          <label className="block text-white text-sm sm:text-base md:text-lg font-normal ml-2 mb-1 sm:mb-2" htmlFor="purpose">
            I Want To
          </label>
          <input
            className="w-full sm:w-3/4 md:w-1/2 px-4 py-2 sm:py-3 border text-gray-200 text-sm sm:text-base md:text-lg border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-gray-400 bg-transparent"
            id="purpose"
            type="text"
            placeholder="Buy Property, Find agent"
          />
        </div>

        <div className="mb-4 md:mb-6"></div>
          <label className="block text-white text-sm sm:text-base md:text-lg font-normal ml-2 mb-1 sm:mb-2" htmlFor="notes">
            Notes
          </label>
          <textarea
            className="w-full px-4 py-2 sm:py-3 border text-gray-200 text-sm sm:text-base md:text-lg border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-gray-400 bg-transparent resize-none"
            id="notes"
            rows="3"
            placeholder="Your message"
          ></textarea>
        </div>

        <button className="w-full sm:w-3/5 md:w-2/5 bg-white text-[rgb(206,32,39,255)] font-bold text-sm sm:text-base py-3 sm:py-4 border px-4 sm:px-6 rounded-3xl transition duration-200 hover:bg-gray-100  block">
          Submit
        </button>

      </div>
    </div>

  </div> 
</main>*/}


        {/* Stats Section */}
        {/* <div className="relative h-[200px] md:h-400"> */}
        {/* Background Image */}
        {/* <div className="absolute inset-0 md:inset-[-10] z-0 h-[120px] md:h-200">
          <Image
            src="/mapbg.jpg"
            alt="Company showcase"
            fill
            className="w-full h-[120px] md:h-200 object-contain"
          />
        </div> */}

        {/* Overlay Content */}
        {/* <div className="relative z-10 px-2 sm:px-8 md:pt-2 my-4 text-black text-center bg-white/50"> */}
        {/* Heading */}
        {/* <div className="mt-10 mb-6 md:mb-0 md:mt-20 text-center">
<h1 className="text-2xl md:text-4xl font-bold mb-2">
  Keller Williams
</h1>
<hr className="w-44 md:w-120 mt-8 mb-10 mx-auto border-[rgb(206,32,39,255)] border-t-2" />
<p className="text-lg font-bold ">We focus on the customer not the competition.</p>
<p className="my-2 text-lg">As the largest, fastest-growing real estate franchise in the world, Keller Williams is at the forefront of tech, training and culture.
</p>
</div> */}


        {/* Stats Grid */}
        {/* <div className="grid grid-cols-2 items-center justify-center md:grid-cols-4 gap-2 md:gap-8  mt-10 md:mt-40 max-w-full mx-2 md:mx-12">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="text-center p-2"
          >
            <p className="text-lg md:text-5xl font-bold mb-2 md:mb-4">{stat.value}</p>
            <div className="flex items-center justify-center md:max-w-[200px] max-w-[100px] mx-auto my-2 md:my-4">
              <div className="flex-1 h-px bg-[rgb(206,32,39,255)]"></div>
              <div className="flex-1 h-px bg-gray-500"></div>
            </div>
            <p className="md:text-[1rem] text-[0.7rem] leading-tight">{stat.label1}</p>
            <p className="md:text-[1rem] text-[0.7rem] leading-tight">{stat.label2}</p>
          </motion.div>
        ))}
      </div> */}
        <section className="w-full bg-white py-20" ref={statsRef}>
          <div className="md:mx-40 mx-8 text-center">
            {/* Heading */}
            <motion.h2
              className="text-3xl md:text-[34px] font-semibold md:font-semibold text-gray-800"
              initial={{ opacity: 0, y: 50 }}
              animate={animationTriggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="text-[rgb(206,32,39,255)] font-semibold md:font-semibold">Keller Williams.</span>{" "}
              <span className="text-gray-600">We focus on the customer not the competition.</span>
            </motion.h2>

            <motion.p
              className="text-gray-800 text-lg py-8"
              initial={{ opacity: 0, y: 50 }}
              animate={animationTriggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              As the largest, fastest-growing real estate franchise in the world,
              Keller Williams is at the forefront of tech, training and culture.
            </motion.p>

            {/* Stats with dividers */}
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-500 py-2 md:py-18">
              {/* Item 1 */}
              <motion.div
                className="flex flex-col items-center text-center py-6 px-4"
                initial={{ opacity: 0, y: 50 }}
                animate={animationTriggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={animationTriggered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                >
                  <Image
                    src="https://www.kwuk.com/wp-content/uploads/2020/12/ox-icons-01.svg"
                    alt="Worldwide Associates"
                    width={100}
                    height={100}
                    className="md:mb-6 mb-10"
                  />
                </motion.div>
                <h3 className="text-4xl font-bold">{count212000.toLocaleString()}</h3>
                <p className="text-gray-600 mt-4">Worldwide Associates</p>
              </motion.div>

              {/* Item 2 */}
              <motion.div
                className="flex flex-col items-center text-center py-6 px-4"
                initial={{ opacity: 0, y: 50 }}
                animate={animationTriggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={animationTriggered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                >
                  <Image
                    src="https://www.kwuk.com/wp-content/uploads/2020/12/ox-icons-02.svg"
                    alt="Global Transactions"
                    width={100}
                    height={100}
                    className="md:mb-6 mb-10"
                  />
                </motion.div>
                <h3 className="text-4xl font-bold">1.1m</h3>
                <p className="text-gray-600 mt-4">Global transactions per year.</p>
              </motion.div>

              {/* Item 3 */}
              <motion.div
                className="flex flex-col items-center text-center py-6 px-4"
                initial={{ opacity: 0, y: 50 }}
                animate={animationTriggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={animationTriggered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
                >
                  <Image
                    src="https://www.kwuk.com/wp-content/uploads/2020/12/ox-icons-03.svg"
                    alt="Global Exchanges"
                    width={100}
                    height={100}
                    className="md:mb-6 mb-10"
                  />
                </motion.div>
                <h3 className="text-4xl font-bold">4,300</h3>
                <p className="text-gray-600 mt-4">Global exchanges every day.</p>
              </motion.div>

              {/* Item 4 */}
              <motion.div
                className="flex flex-col items-center text-center py-6 px-4"
                initial={{ opacity: 0, y: 50 }}
                animate={animationTriggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={animationTriggered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
                >
                  <Image
                    src="https://www.kwuk.com/wp-content/uploads/2020/12/ox-icons-04.svg"
                    alt="Exchanges Per Hour"
                    width={100}
                    height={100}
                    className="md:mb-6 mb-10"
                  />
                </motion.div>
                <h3 className="text-4xl font-bold">180</h3>
                <p className="text-gray-600 mt-4">Global exchanges per hour.</p>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="text-center mx-8 md:mx-0">
          <h1 className="text-2xl md:text-4xl font-semibold mb-2">
            About Keller Williams
          </h1>


          <p className="text-base md:text-lg font-semibold py-4 md:py-4">You come FIRST with Keller Williams. Your trust is our business.</p>
          <hr className="w-40 md:w-40 my-6 mx-auto border-[rgb(206,32,39,255)] border-2" />
          <p className="my-2 text-base md:text-lg mx-2 md:mx-40 leading-relaxed"> Maya Angelou said, &quot;People may not remember exactly what you did, or what you said, but they will always remember how you made them feel.&quot; By building understanding, trust, and respect, we can do what it takes to make things happen for you. We know how to deliver a dedicated and bespoke service. We want you to know, but more importantly, feel that we are there for every step of the property journey. Because we will be. Whether you need us today, or in the coming years, we are here to serve. As your local agent,
            we hope to become your go-to property adviser for life. As we are also part of the global Keller Williams&apos; family, our local hands have a global reach.</p>
          <p className="text-base md:text-lg font-semibold py-4 md:py-6">One call could build you a better tomorrow.</p>

          <button className="md:px-10 px-4  bg-[rgb(206,32,39,255)] text-white py-2 md:py-3 text-xs md:text-sm mt-6 md:mt-10 relative overflow-hidden group transition-all duration-300 hover:pr-12 hover:pl-12" onClick={() => router.push('/ourCulture/whyKW')}>
            <span className="inline-block md:text-base text-sm font-semibold transition-all duration-300 group-hover:-translate-x-3">
              Why Choose Keller Williams
            </span>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-white group-hover:translate-x-0 translate-x-4">
              <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
            </span>
          </button>
        </div>
        {/* </div> */}


        <div className="flex flex-col items-center justify-center my-8 md:my-20  text-center px-2  md:px-4 md:mb-30 bg-gray-100 border border-gray-100">
          <h1 className="text-2xl md:text-[2.5rem] mt-6 md:mt-10 font-bold mb-2 md:mb-4">
            <span className="text-[rgb(206,32,39,255)]">Recent </span>Properties
          </h1>
          <h2 className="text-base md:text-xl font-semibold text-gray-600 mb-4 md:mb-6">
            Start your search <span className="text-[rgb(206,32,39,255)]">here</span>
          </h2>

          <div className="hidden md:flex  flex-col md:flex-row  gap-1 md:gap-1 ">
            <input
              type="text"
              value={propertySearchTerm}
              onChange={(e) => setPropertySearchTerm(e.target.value)}
              placeholder="City, Area or Street"
              className="w-full md:w-80 px-4 py-2 md:py-3 bg-white shadow-lg text-black text-base md:text-xl outline-none "
            />
            <div className="flex gap-1 md:gap-1 w-full md:w-auto">
              <button
                onClick={() => setFilterCategory(filterCategory === "Sale" ? null : "Sale")}
                className={`flex-1 md:flex-none px-4 sm:px-6 md:px-6 py-2 md:py-3 text-base md:text-xl font-semibold transition-colors ${filterCategory === "Sale"
                  ? "bg-red-950 text-white"
                  : "bg-[rgb(206,32,39,255)] hover:bg-red-950 text-white"
                  }`}
              >
                Sale
              </button>
              <button
                onClick={() => setFilterCategory(filterCategory === "Rent" ? null : "Rent")}
                className={`flex-1 md:flex-none px-4 sm:px-6 md:px-6 py-2 md:py-3 text-base md:text-xl font-semibold transition-colors ${filterCategory === "Rent"
                  ? "bg-red-950 text-white"
                  : "bg-[rgb(206,32,39,255)] hover:bg-red-950 text-white"
                  }`}
              >
                Rent
              </button>
            </div>
          </div>


          <div className="flex md:hidden  p-2 items-center gap-1  ">
            <input
              type="text"
              value={mobilePropertySearchTerm}
              onChange={(e) => setMobilePropertySearchTerm(e.target.value)}
              placeholder="City, Area or Street"
              className="py-3 px-2 shadow-2xl text-black font-normal w-40  bg-white text-base outline-none"
            />
            <button
              onClick={() => setFilterCategory(filterCategory === "Sale" ? null : "Sale")}
              className={`px-2 py-3 text-base font-semibold transition-colors ${filterCategory === "Sale"
                ? "bg-red-950 text-white"
                : "bg-[rgb(206,32,39,255)] hover:bg-red-950 text-white"
                }`}
            >
              Sale
            </button>
            <button
              onClick={() => setFilterCategory(filterCategory === "Rent" ? null : "Rent")}
              className={`px-2 py-3 text-base font-semibold transition-colors ${filterCategory === "Rent"
                ? "bg-red-950 text-white"
                : "bg-[rgb(206,32,39,255)] hover:bg-red-950 text-white"
                }`}
            >
              Rent
            </button>
          </div>



          {/* First Home Block */}
          <div className="w-full py-10 px-4 md:px-16">
            <div >
              <div className="relative l">
                {/* Filter Status and Clear Button */}
                {/* {(propertySearchTerm || mobilePropertySearchTerm || filterCategory) && (
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-600">Active filters:</span>
          {propertySearchTerm && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Search: &ldquo;{propertySearchTerm}&rdquo;
            </span>
          )}
          {mobilePropertySearchTerm && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Search: &ldquo;{mobilePropertySearchTerm}&rdquo;
            </span>
          )}
          {filterCategory && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              Category: {filterCategory}
            </span>
          )}
          <button
            onClick={() => {
              setPropertySearchTerm('');
              setMobilePropertySearchTerm('');
              setFilterCategory(null);
            }}
            className="bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 transition-colors"
          >
            Clear All
          </button>
        </div>
      )}
       */}
                {/* Results Count */}
                {/* <div className="mb-4 text-gray-600">
        Showing {filteredProperties.length} of {properties.length} properties
      </div> */}

                {/* Property Cards Scroll Section */}
                <div
                  ref={scrollRef}
                  className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar w-full snap-x snap-mandatory"
                  onMouseDown={handleMouseDown}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                >
                  {loadingProperties ? (
                    <div className="w-full flex justify-center items-center h-40 text-lg">
                      Loading properties...
                    </div>
                  ) : properties.length === 0 ? (
                    <div className="w-full flex justify-center items-center h-40 text-lg">
                      No properties found.
                    </div>
                  ) : filteredProperties.length === 0 ? (
                    <div className="w-full flex justify-center items-center h-40 text-lg text-center">
                      <div>
                        <p className="text-gray-600 mb-2">No properties match your current filters.</p>
                        <p className="text-sm text-gray-500">Try adjusting your search terms or category selection.</p>
                      </div>
                    </div>
                  ) : (
                    filteredProperties.map((property, index) => (
                      <div
                        key={index}
                        data-card="true"
                        className="flex-shrink-0 w-[270px] md:w-[400px] border bg-white shadow-2xl border-gray-200 overflow-hidden  hover:shadow-md transition-shadow flex flex-col snap-start"
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            localStorage.setItem(
                              "selectedProperty",
                              JSON.stringify(property)
                            );
                            router.push(
                              `/propertydetails/${property._kw_meta?.id || property.id || index
                              }`
                            );
                          }
                        }}
                      >
                        {/* Property Image */}
                        <div className="md:h-70 h-40 relative">
                          {property.image ||
                            (Array.isArray(property.images) && property.images[0]) ||
                            (Array.isArray(property.photos) &&
                              property.photos[0]?.ph_url) ? (
                            <Image
                              src={
                                property.image ||
                                (Array.isArray(property.images) && property.images[0]) ||
                                (Array.isArray(property.photos) &&
                                  property.photos[0]?.ph_url) ||
                                "/properties.jpg"
                              }
                              alt={
                                property.title ||
                                property.property_title ||
                                "Property"
                              }
                              fill
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-200 via-white to-red-100 text-[rgb(206,32,39,255)] font-bold text-lg">
                              Coming Soon!
                            </div>
                          )}
                          {/* Bed/Bath overlay */}
                          <div className="absolute bottom-0 right-0 bg-black/80 text-white px-2 py-1 flex flex-row items-center gap-3">
                            {/* Beds */}
                            {/* <div className="absolute bottom-0 right-0 bg-black/80 text-white rounded-md px-3 py-2 flex flex-row items-center gap-6"> */}
                            {/* Beds */}
                            <div className="flex flex-col items-center">
                              <span className="relative w-5 h-5">
                                <Image src={bedIconUrl} alt="bed" fill className="object-contain invert" />
                              </span>
                              <span className="text-xs mt-1">
                                {property.total_bed || property.beds || property.bedrooms || 0}
                              </span>
                            </div>

                            {/* Baths */}
                            <div className="flex flex-col items-center">
                              <span className="relative w-5 h-5">
                                <Image src={bathIconUrl} alt="bath" fill className="object-contain invert" />
                              </span>
                              <span className="text-xs mt-1">
                                {property.total_bath || property.baths || property.bathrooms || 0}
                              </span>
                            </div>

                            {/* Garage (optional, if you have this) */}


                          </div>
                        </div>


                        {/* Property Details */}
                        <div className="p-4 py-6 ">
                          <h3 className=" text-gray-700 text-lg flex justify-start items-center">
                            {property.beds || property.bedrooms
                              ? `${property.beds || property.bedrooms} bed `
                              : ""}
                            {property.title || property.prop_type || "Property"}

                          </h3>
                          <span className=" flex justify-start items-start text-[rgb(206,32,39,255)] text-lg font-semibold">
                            {property?.list_category || "To Let"}
                          </span>
                          <div className="flex flex-col items-start">
                            <p
                              className="text-xl font-bold text-gray-600 mb-2 truncate"
                              title={property.list_address?.address} // hover to see full text
                            >
                              {property.list_address?.address?.split(' ').length > 5
                                ? property.list_address.address.split(' ').slice(0, 5).join(' ') + '...'
                                : property.list_address?.address}
                            </p>
                          </div>

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
                        <button className="w-full bg-[rgb(206,32,39,255)] text-white font-bold text-base py-3 px-4 flex items-center justify-end gap-2">
                          <span>MORE DETAILS</span>
                          <ChevronRight className="text-white w-4 h-4" />
                        </button>

                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Scroll Buttons BELOW cards */}
          <div className="flex justify-end gap-6  w-full px-4 md:px-16">
            <div className="flex gap-2">
              {showBackButton && (
                <button
                  onClick={handleScrollLeft}
                  className="bg-white border border-gray-300 p-4 shadow-md hover:shadow-lg transition"
                >
                  <ChevronLeft className="text-[rgb(206,32,39,255)] w-10 h-10" />
                </button>
              )}
              {showScrollButton && (
                <button
                  onClick={scrollRight}
                  className="bg-white border border-gray-300 p-4 shadow-md hover:shadow-lg transition"
                >
                  <ChevronRight className="text-[rgb(206,32,39,255)] w-10 h-10" />
                </button>
              )}
            </div>
          </div>

        </div>





        <div className="bg-gray-100 mt-10 md:mt-0  mx-2 md:mx-10 border-gray-100   flex flex-col md:flex-row">

          {/* Mobile Version: Stacked */}
          <div className="md:hidden flex flex-col">

            {/* Overlapping Text Box */}
            <div className="bg-gray-100 md:p-4 p-8 border-gray-100">
              <p className="md:text-xl text-xl font-bold text-gray-600">
                <span className="text-[rgb(206,32,39,255)]">Join us.</span> Our dynamic energy and innovative spirit bring the best and brightest together.
              </p>
            </div>

            {/* Image */}
            <div className="hidden md:block relative h-[200px] w-full">
              <Image
                src="/"
                alt="Full Height Image"
                fill
                className="object-cover "
              />
              <div className="absolute inset-0 bg-black/50"></div>
            </div>


            {/* Left Red Box */}
            <div className="bg-[rgb(206,32,39,255)] text-white flex items-center justify-center w-full h-32">
              <p className="md:text-xl text-xl font-bold text-left">
                Want to be an <br /> AGENT?
              </p>
            </div>

            {/* Right Transparent Box */}
            <div className="bg-white/80 shadow-md p-4 w-full">
              <p className=" text-xl md:text-xl font-bold py-8 md:py-0 text-gray-800 md:leading-relaxed">
                We offer the greatest rewards for
                <span className="text-[rgb(206,32,39,255)] font-bold"> exceptional customer care.</span>
              </p>

              <button className="mt-4 bg-[rgb(206,32,39,255)] text-white px-4 py-2  text-sm font-semibold flex items-center gap-2">
                <span className="whitespace-nowrap">Market Centre Search</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Laptop Version: Original Layout */}
          <div className="hidden md:flex w-full relative  ">
            {/* Box with half-overlap */}
            <div className="absolute top-0 z-10  bg-gray-100 p-6 w-120 border-gray-100  ">
              <p className="text-3xl leading-10 font-bold text-gray-800">
                <span className="text-[rgb(206,32,39,255)]">Join us.</span> Our dynamic energy and innovative spirit bring the best and brightest together.
              </p>
            </div>

            <div className="ml-70 h-[80vh] w-screen relative">
              <Image
                src="/4.jpg"
                alt="Full Height Image"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gray-500/50"></div>
            </div>

            <div className="absolute top-60 z-10 bg-[rgb(206,32,39,255)] text-white flex items-center justify-center w-70 h-65">
              <p className="text-3xl font-bold text-left">
                Want to be an <br /> AGENT?
              </p>
            </div>

            <div className="absolute top-60 left-70 z-10 bg-white/80 p-6 w-[700px] h-65">
              <p className="text-3xl mt-14 ml-8 font-bold text-gray-800 leading-relaxed">
                We offer the greatest rewards for <br />
                <span className="text-[rgb(206,32,39,255)] font-bold">exceptional customer care.</span>
              </p>

              <button className=" bg-[rgb(206,32,39,255)] text-white px-6  py-3 ml-132  text-base font-semibold flex items-center gap-2">
                <span className="whitespace-nowrap">Market Centre Search</span>
                <svg xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 transform scale-x-[-1]"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

        </div>


        <div className="flex flex-col md:flex-row items-center justify-center mx-2 md:mx-10 bg-white py-10 md:py-30 px-2 md:px-0">

          <div className="grid grid-cols-1 md:grid-cols-2 max-w-full w-full gap-0">

            {/* Left Red Box */}
            <div className="bg-[rgb(206,32,39,255)] text-white p-6 md:p-14 py-15 md:py-0 flex  flex-col justify-center">
              <p className="text-base md:text-xl font-semibold mb-2 pl-3 border-l-6 border-white">
                Download guide
              </p>

              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">How to sell your home</h2>
              <p className="text-base md:text-lg mb-4 md:mb-6 leading-relaxed">
                The guide to selling a property will advise not only on the process
                but also how you can be super prepared and help to achieve the highest sale price.
              </p>
              <div className="hidden md:flex w-full max-w-full md:max-w-lg p-1    items-center ">
                <input
                  type="text"
                  placeholder="Email Address"
                  className="w-full px-4 py-2 bg-white text-black text-base outline-none"
                />

                <button className=" bg-black hover:bg-gray-200 text-white px-4 md:px-8 py-2 text-base font-semibold border-black ">
                  Download
                </button>
              </div>
              <div className=" flex md:hidden w-full max-w-full md:max-w-md p-1 bg-white  flex-col md:flex-row items-center md:items-stretch gap-2 ">

                <input
                  type="text"
                  placeholder="Email Address"
                  className="w-full px-4 py-2 text-black text-base outline-none "
                />
              </div>
              <button className="flex md:hidden mt-4 w-fit  bg-black hover:bg-red-950 text-white px-8 py-2 text-base font-semibold border-black ">
                Download
              </button>


            </div>

            {/* Right Image Box */}
            <div className="relative h-[460px] md:h-[420px] ">
              <Image
                src="/3.jpg" // Replace with your actual image path
                alt="Home"
                fill
                className="object-cover grayscale "
              />
              <div className="absolute inset-0 bg-gray-500/50 py-15 md:py-0"></div>
              <div className="absolute inset-0 bg-opacity-40 p-4 md:p-10 flex flex-col justify-center text-white ">
                <p className="text-base md:text-xl font-semibold mb-2 pl-3 border-l-6 border-white">
                  Download guide
                </p>
                <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">How to buy a home</h2>
                <p className="text-base md:text-lg mb-4 md:mb-6 leading-relaxed">
                  The following guide to buying a property will explain how to position
                  yourself to negotiate the best price, but importantly ensure you are
                  the winning bidder when up against the competition.
                </p>
                <div className="hidden md:flex w-full max-w-full md:max-w-lg p-1    items-center ">
                  <input
                    type="text"
                    placeholder="Email Address"
                    className="w-full px-4 py-2 bg-white text-black text-base outline-none"
                  />

                  <button className=" bg-black hover:bg-gray-200 text-white px-4 md:px-8 py-2 text-base font-semibold border-black ">
                    Download
                  </button>

                </div>
                <div className=" flex md:hidden w-full max-w-full md:max-w-md p-1 bg-white  flex-col md:flex-row items-center md:items-stretch gap-2 ">

                  <input
                    type="text"
                    placeholder="Email Address"
                    className="w-full px-4 py-2 text-black text-base "
                  />
                </div>
                <button className="flex md:hidden mt-4 w-fit  bg-black hover:bg-red-950 text-white px-8 py-2 text-base font-semibold border-black">
                  Download
                </button>


              </div>
            </div>

          </div>

        </div>
        <div className="relative w-full h-[120vh] md:h-[90vh] flex items-center justify-center bg-gray-500/50 overflow-hidden border border-gray-100">

          {/* Background Image */}
          <Image
            src="/2.jpg" // Replace with your image in public folder
            alt="Background Crowd"
            fill
            className="object-cover grayscale"
          />

          {/* Optional dark overlay */}
          <div className="absolute inset-0 bg-opacity-30"></div>

          {/* Testimonial Box */}
          <div className="relative bg-white p-6 md:p-20 max-w-full md:max-w-3xl md:mx-auto mx-4 text-left shadow-lg z-10 transition-all duration-500 ease-in-out">
            <FaQuoteRight className="absolute text-4xl md:text-7xl text-[rgb(206,32,39,255)] -top-4 md:-top-8 mb-4 leading-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.8 }}
              >
                <p className=" py-4 mb-4 md:mb-8 leading-relaxed">
                  {testimonials[currentIndex].quote}
                </p>
                <p className="text-[rgb(206,32,39,255)] font-bold  mb-2">
                  {testimonials[currentIndex].name}
                </p>
                <p className="font-bold  text-gray-600">
                  {testimonials[currentIndex].role}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex justify-center mt-8 md:mt-6 space-x-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`h-2 w-2 md:h-2 md:w-2 rounded-full ${idx === currentIndex ? 'bg-[rgb(206,32,39,255)]' : 'bg-gray-300'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
        {/* <div className="flex justify-center items-center col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-8 md:mb-0">
          <hr className="md:w-170 w-44 my-8 md:my-12 mx-auto bg-[rgb(206,32,39,255)] border-0 h-[2px]" />
        </div> */}

      </div>
      <Newfooter></Newfooter>
    </div>
  );
};
export default Home;