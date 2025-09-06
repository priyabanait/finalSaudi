'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { MapPin, Building2, Phone, Mail } from 'lucide-react';
import NewFooter from '@/components/newfooter'
import { FaArrowLeft,FaQuoteLeft ,FaChevronRight,FaChevronLeft } from 'react-icons/fa';
import Header from '@/components/header';
import { dancing } from "../app/layout";
const AgentProfile = (props) => {
  
  const [agent, setAgent] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  
  // Icon URLs
  const bedIconUrl = "/bed.png";
  const bathIconUrl = "/bath.png";
  
  // Helper function to format price
  const formatPrice = (price) => {
    if (!price) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  useEffect(() => {
    // Load agent from localStorage
    try {
      const agentData = localStorage.getItem('selectedAgent');
      if (agentData) {
        const parsed = JSON.parse(agentData);
        setAgent(parsed);
        if (parsed.image) setImgSrc(parsed.image);
      } else {
        setError('No agent selected.');
      }
    } catch (e) {
      setError('Failed to load agent data.');
    }
  }, []);
  
  // Update filteredProperties when properties change
  useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);

  // useEffect(() => {
  //   // Fetch all properties and filter for this agent
  //   const fetchProperties = async () => {
  //     if (!agent) return;
  //     setLoading(true);
  //     try {
  //       const res = await fetch('https://kwsaudi.x-360.ai/api/listings/list/properties', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //       });
  //       const data = await res.json();
  //       console.log(agent.email);
        
  //       let all = Array.isArray(data.data) ? data.data : [];
  //       // Filter by agent email if available, else by name
  //       let filtered = all.filter((prop) => {
  //         if (agent.email && (prop.agent_email || prop.agent?.email)) {
  //           return (
  //             prop.agent_email === agent.email ||
  //             (prop.agent && prop.agent.email === agent.email)
  //           );
  //         } else if (agent.name || agent.fullName) {
  //           const agentName = agent.name || agent.fullName;
  //           return (
  //             prop.agent_name === agentName ||
  //             (prop.agent && prop.agent.name === agentName)
  //           );
  //         }
  //         return false;
  //       });
  //       setProperties(filtered);
  //     } catch (e) {
  //       setError('Failed to load properties.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchProperties();
  // }, [agent]);

  // if (error) {
  //   return (
  //     <div className='relative p-6 md:p-8'>
  //       <Header />
  //       <div className='text-center bg-[rgb(206,32,39,255)] py-20'>{error}</div>
  //       <Footer />
  //     </div>
  //   );
  // }
  if (!agent) {
    return null;
  }

  return (
    <div className='relative p-6 md:p-8 '>
      <Header />
      <div className="absolute top-0 left-0 w-[100px] h-[100px] md:w-[150px] md:h-[150px] bg-[rgb(206,32,39,255)] z-0"></div>

<div className="relative bg-gray-100 px-4 md:px-20 py-4 md:py-10">
  {/* Top Header */}
  <div className="w-full flex flex-col md:flex-row items-start md:px-10 md:items-center justify-between gap-4 md:gap-0">
    {/* Back Button */}
    {/* <div className="flex items-center gap-2 md:mt-30  mt-20 px-4 border rounded-full border-[rgb(206,32,39,255)] py-1 bg-[rgb(206,32,39,255)] h-10">
      <a href="/properties" className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full bg-white border border-white text-[rgb(206,32,39,255)] hover:bg-gray-100">
        <FaArrowLeft className="w-2 h-2 md:w-3 md:h-3" />
      </a>
      <a href={props.nav} className="text-[0.6rem] md:text-xs text-white font-medium">Back to Search</a>
      </div> */}
                
              
            
  
   
    
  </div>
  <p className="font-semibold  pt-20 text-[rgb(206,32,39,255)] text-2xl md:px-10"> {agent.name || agent.fullName || '-'}</p>
  <p className="font-semibold text-gray-600 text-lg md:px-10"> Keller Williams {agent.city || '-'}</p>
  {/* Agent Card Section */}
  <div className="hidden md:flex flex-col md:flex-row md:mt-6 mt-20 shadow-xl rounded-3xl overflow-hidden  w-full">
    {/* Left Section */}
    <div className="w-full text-white px-6 sm:px-10 lg:px-16 bg-[rgb(206,32,39,255)] min-h-[80vh] flex flex-col justify-center">
  {/* Left Section */}
  <div className="text-center md:text-left">
    <h1 className="text-xl sm:text-2xl lg:text-3xl break-words mt-6 sm:mt-2">
      Property Sales in Saudi Arabia
    </h1>

    <div className="text-sm sm:text-base lg:text-lg">
      {/* Property Expert */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 sm:mt-20 lg:mt-30 items-center sm:items-start md:items-center">
        <p className="tracking-[2.5px]">Property Expert</p>
      </div>

      {/* Agent Name */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 text-2xl sm:text-3xl lg:text-4xl font-semibold mt-4 items-center sm:items-start md:items-center">
        <span className="truncate">{agent.name || agent.fullName || '-'}</span>
      </div>

      {/* Powered by */}
      <div className="flex mt-6 sm:mt-8 lg:mt-30">
  <Image
    src="/powerdby.png"   // your single combined image
    alt="Powered by Keller Williams"
    width={250}
    height={80}
    className="h-auto w-auto"
  />
</div>
  </div>
</div>
</div>

{/* Right Section */}
<div className="w-full relative flex items-center justify-center bg-[rgb(206,32,39,255)] mt-8 md:mt-0">
  {/* Optional Background Split for Desktop */}
  <div className="hidden md:flex absolute inset-0">
    <div className="w-1/2 bg-[rgb(206,32,39,255)]"></div>
    <div className="w-1/2 bg-gray-400"></div>
  </div>

  {/* Agent Image */}
  <div className="relative z-10 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-100 w-48 h-56 sm:w-64 sm:h-64 lg:w-100 lg:h-100 aspect-square">
    <Image
      src={agent.image || '/images.jpg'}
      alt={agent.name || agent.fullName || 'Agent'}
      fill
      className="object-cover"
    />
  </div>
  </div>
</div>




{/* Mobile-Only Agent Card Box */}
<div className="flex flex-col bg-[rgb(206,32,39,255)] text-white shadow-lg rounded-2xl gap-4 mt-4 md:hidden">
  {/* Agent Image */}
  <div className="w-40 h-40 mx-auto mt-4 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100">
  
      <Image
       src={agent.image||'/images.jpg'}
        alt={agent.name || agent.fullName || 'Agent'}
        width={160}
        height={160}
        className="object-cover w-full h-full"
       
      />
   
  </div>

  {/* Agent Info */}
  <div className="text-center space-y-2  px-10">
    <h2 className="text-xl text-white uppercase ">Property Sales in Saudi Arabia</h2>
  
  </div>

  {/* Info Items */}
  <div className="text-sm sm:text-base lg:text-lg">
      {/* Property Expert */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 sm:mt-20 lg:mt-30 items-center sm:items-start md:items-center">
        <p className="tracking-[2.5px]">Property Expert</p>
      </div>

      {/* Agent Name */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 text-2xl sm:text-3xl lg:text-4xl font-semibold mt-4 items-center sm:items-start md:items-center">
        <span className="truncate">{agent.name || agent.fullName || '-'}</span>
      </div>

      {/* Powered by */}
      <div className="flex items-center justify-center mt-6 mb-4 sm:mt-8 lg:mt-30">
  <Image
    src="/powerdby.png"   // your single combined image
    alt="Powered by Keller Williams"
    width={250}
    height={80}
    className="h-auto w-auto"
  />
</div>

 </div>
  </div>
  


  </div>
  <div className="flex flex-col items-center justify-center mt-10 px-4 text-center">
  <p className="text-4xl font-semibold">
    <span className="text-[rgb(206,32,39,255)]">Sell your home with </span>
    <span>
  {(() => {
    const fullName = agent?.name || agent?.fullName || "-";
    const parts = fullName.split(" "); // split by space
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" "); // supports multiple surnames

    return (
      <>
        <span className="text-gray-500">{firstName}</span>{" "}
        <span className="text-[rgb(206,32,39,255)] font-semibold">{lastName}</span>
      </>
    );
  })()}
</span>

  </p>
</div>

<div className="flex flex-col md:flex-row items-center justify-center mt-4 gap-2 md:gap-6 px-4 text-center md:text-left">
  {/* Phone */}
  <span className="flex items-center gap-1 text-gray-500 text-lg">
    Call:
    <span className="text-[rgb(206,32,39,255)]">{agent?.phone || "-"}</span>
  </span>

  {/* Divider for desktop */}
  <span className="hidden md:inline border-l h-5 border-gray-400"></span>

  {/* Email */}
  <span className="flex items-center gap-1 text-gray-500 text-lg">
    Email:
    <span className="text-[rgb(206,32,39,255)]">{agent?.email || "-"}</span>
  </span>

  {/* Divider for desktop */}
  <span className="hidden md:inline border-l h-5 border-gray-400"></span>

  {/* KW UID */}
  <span className="flex items-center gap-1 text-gray-500 text-lg">
    Kw UID:
    <span className="text-[rgb(206,32,39,255)]">
      {agent?.kw_id || agent?.kwId || agent?.list_id || agent?.id || 'Not specified'}
    </span>
  </span>
  

</div>
      <div className="flex flex-col md:flex-row items-center justify-center  mx-2 md:mx-20 bg-white py-10 md:py-10  ">

<div className="grid grid-cols-1 md:grid-cols-2 max-w-full w-full gap-0">

  {/* Left Red Box */}
  <div className="bg-[rgb(206,32,39,255)] text-white p-6 md:p-14 py-15 md:py-0 flex  flex-col justify-center">
    <p className="text-base md:text-xl font-semibold mb-2">| Download guide</p>
    <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">How to sell your home</h2>
    <p className="text-base md:text-lg mb-4 md:mb-6 leading-relaxed">
      The guide to selling a property will advise not only on the process
      but also how you can be super prepared and help to achieve the highest sale price.
    </p>
    <div className="hidden md:flex w-full max-w-full md:max-w-md p-1  flex-col md:flex-row items-center md:items-stretch ">
  
    <input
    type="text"
    placeholder="email"
    className="w-full px-4 py-2 bg-white text-black text-base outline-none"
  />

  <button className=" bg-black hover:bg-gray-200 text-white px-4 md:px-8 py-2 text-base font-semibold border-black ">
    Download
  </button>
  </div>
 <div className=" flex md:hidden w-full max-w-full md:max-w-md p-1 bg-white  flex-col md:flex-row items-center md:items-stretch gap-2 ">
  
  <input
    type="text"
    placeholder="email"
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
       src="/Homepage_buy_your_home.jpeg" // Replace with your actual image path
      alt="Home"
      fill
      className="object-cover"
    />
<div className="absolute inset-0 bg-black/50 py-15 md:py-0"></div>
    <div className="absolute inset-0 bg-opacity-40 p-4 md:p-10 flex flex-col justify-center text-white ">
    <p className="text-base md:text-xl font-semibold mb-2">| Download guide</p>
    <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">How to buy a home</h2>
    <p className="text-base md:text-lg mb-4 md:mb-6 leading-relaxed">
        The following guide to buying a property will explain how to position
        yourself to negotiate the best price, but importantly ensure you are
        the winning bidder when up against the competition.
      </p>
      <div className="hidden md:flex w-full max-w-full md:max-w-md p-1  flex-col md:flex-row items-center ">
      <input
    type="text"
    placeholder="email"
    className="w-full px-4 py-2 bg-white text-black text-base outline-none"
  />

  <button className=" bg-black hover:bg-gray-200 text-white px-4 md:px-8 py-2 text-base font-semibold border-black ">
    Download
  </button>
  </div>
 <div className=" flex md:hidden w-full max-w-full md:max-w-md p-1 bg-white  flex-col md:flex-row items-center md:items-stretch gap-2 ">
  
  <input
    type="text"
    placeholder="email"
    className="w-full px-4 py-2 text-black text-base outline-none "
  />
  </div>
  <button className="flex md:hidden mt-4 w-fit  bg-black hover:bg-red-950 text-white px-8 py-2 text-base font-semibold border-black ">
    Download
  </button>


    </div>
  </div>

</div>

</div>
<div className="w-full px-6 md:px-12 lg:px-20 py-10">
  {/* About Section */}
  <div className="flex flex-col md:flex-row ">
    {/* Left Tab */}
    <div className="w-full md:w-1/4">
      <div className="bg-gray-200 border-gray-200 p-3 text-center font-medium">
       <p className='bg-white p-2 font-semibold text-lg'> About {agent.name || agent.fullName || '-'}</p>
      </div>
    </div>

    {/* Right Content */}
    <div className="w-full md:w-3/4">
      <div className="rounded-md shadow-md p-6">
        {/* Welcome Title */}
        <h2 className={`${dancing.className} text-3xl mb-4`}>
  Welcome
</h2>

        {/* Paragraph */}
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
          As a dedicated real estate professional at Keller Williams Saudi
          Arabia, I&apos;m proud to be part of a global brand that puts people first.
          With a deep understanding of the local market and a commitment to
          exceptional service, I strive to make every client&apos;s real estate
          journey smooth, informed, and successful.
          <br />
          <br />
          Being part of Saudi Arabia&apos;s exciting transformation under Vision 2030
          inspires me to help individuals, families, and investors find .
        </p>

        {/* Signature */}
        <p className={`${dancing.className} text-3xl`}>
        {agent.name || agent.fullName || '-'}
</p>
      </div>
      </div>
      </div>
      </div>
      <div className="w-full px-6 md:px-12 lg:px-20 py-12">
      {/* Heading */}
      <h2 className="text-center text-xl md:text-3xl font-semibold mb-10">
        My customer reviews
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Review Card 1 */}
        <div className=" rounded-xl shadow-md p-4 md:p-20 border border-gray-200 flex flex-col items-center text-center bg-white">
          <FaQuoteLeft className="text-gray-300 text-4xl border-1 rounded-full p-1 bg-white shadow-md mb-4" />
          <p className="text-gray-700 text-base md:text-lg  leading-relaxed">
            Absolutely fabulous service received from Ceri from the very first
            telephone contact! She was very supportive, helpful, professional
            and friendly. I do recommend her to anyone who is looking to sell or
            buy a property.
          </p>
        </div>

        {/* Review Card 2 */}
        <div className=" rounded-xl shadow-md p-4 md:p-20 text-lg border border-gray-200 flex flex-col items-center text-center bg-white">
        <FaQuoteLeft className="text-gray-300 text-4xl border-1 rounded-full p-1 bg-white shadow-md mb-4" />
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            My mum recently bought an apartment in Maidenhead through Ceri and
            Keller Williams. Ceri is a great independent estate agent who was
            very helpful throughout the whole process. I would not hesitate
            recommending her versus the larger high street estate agents.
          </p>
        </div>
      </div>
    </div>

   <p className='flex justify-center items-center text-2xl font-semibold'>10 Properties from {agent.name || agent.fullName || '-'} </p>
    {loading ? (
  <div className="flex justify-center items-center h-60">
    <div className="animate-spin h-12 w-12 border-t-4 border-b-4 border-[rgb(206,32,39,255)] border-solid"></div>
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
          localStorage.setItem(
            "selectedProperty",
            JSON.stringify(property)
          );
          window.location.href = "/propertydetails";
        }}
      >
        {/* Image section */}
        <div className="relative w-full h-50 md:h-60">
          <Image
            src={
              property.image ||
              (Array.isArray(property.images) && property.images[0]) ||
              (Array.isArray(property.photos) && property.photos[0]?.ph_url) ||
              "/property.jpg"
            }
            alt={property.title || property.prop_type || "property"}
            fill
            className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
          />

          {/* Beds / Baths overlay */}
          <div className="absolute bottom-0 right-0 bg-black/80 text-white px-2 py-1 flex flex-row items-center gap-3">
            {/* Beds */}
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

            {/* Baths */}
            <div className="flex flex-col items-center">
              <span className="relative w-5 h-5">
                <Image
                  src={bathIconUrl}
                  alt="bath"
                  fill
                  className="object-contain invert"
                />
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

        {/* Property Details */}
        <div className="p-4 py-6">
          <h3 className="text-gray-700 text-lg flex justify-start items-center">
            {property.beds || property.bedrooms
              ? `${property.beds || property.bedrooms} bed `
              : ""}
            {property.title || property.prop_type || "Property"}
          </h3>

          <span className="flex justify-start text-[rgb(206,32,39,255)] text-lg font-semibold">
            {property?.list_category || "To Let"}
          </span>

          <p
            className="text-xl font-bold text-gray-600 mb-2 truncate"
            title={property.list_address?.address}
          >
            {property.list_address?.address?.split(" ").length > 5
              ? property.list_address.address
                  .split(" ")
                  .slice(0, 5)
                  .join(" ") + "..."
              : property.list_address?.address}
          </p>

          <div className="flex justify-start items-center">
            <span className="font-medium text-base text-gray-700">
              {property.price
                ? `﷼ ${formatPrice(property.price)}`
                : property.current_list_price
                ? `﷼ ${formatPrice(property.current_list_price)}`
                : ""}
              {property.rental_price
                ? `﷼ ${formatPrice(property.rental_price)} `
                : ""}
            </span>
          </div>
          

          {property.price_qualifier && (
            <p className="text-xs text-gray-500 mt-1">
              {property.price_qualifier}
            </p>
          )}
        </div>

        {/* More Details button */}
        <button className="w-full bg-[rgb(206,32,39,255)] text-white font-bold text-base py-3 px-4 flex items-center justify-end gap-2">
          <span>MORE DETAILS</span>
          <FaChevronRight className="text-white w-4 h-4" />
        </button>
      </div>
    ))}
  </div>
)}

{/* Load More button */}
{/* {visibleCount < filteredProperties.length && !loading && !error && (
  <div className="flex justify-center items-center my-10 md:my-5">
    <button
      className="md:w-80 w-50 md:py-2 py-2 mb-10 md:mb-0 px-4 bg-[rgba(202,3,32,255)] hover:bg-red-950 text-white text-base md:text-lg font-semibold transition whitespace-nowrap"
      onClick={() => setVisibleCount((c) => c + 6)}
    >
      View More Properties..
    </button>
  </div>
)} */}

  


  {/* Properties by Agent Section */}
  {/* <div className="w-full flex justify-center my-4">
        <div className="w-full bg-gray-100 rounded-3xl p-6 md:p-12 shadow flex flex-col">
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
            
              <span className="text-3xl text-[rgb(206,32,39,255)]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l9-7 9 7v7a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-7z" /></svg>
              </span>
              <h2 className="text-lg md:text-2xl font-semibold text-gray-700">
                Properties by <span className="text-[rgb(206,32,39,255)]">{agent.name || agent.fullName || '-'}</span>
              </h2>
            </div>
            <span className="text-gray-500 text-sm md:text-lg font-semibold">Property Count : {loading ? '...' : properties.length}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-3 text-center text-gray-500 py-10">Loading properties...</div>
            ) : properties.length === 0 ? (
              <div className="col-span-3 text-center text-gray-500 py-10">No properties found for this agent.</div>
            ) : (
              properties.map((prop, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow p-4 flex flex-col">
                  <div className="relative w-full h-48 mb-4">
                    <Image
                      src={
                        prop.image ||
                        (Array.isArray(prop.images) && prop.images[0]) ||
                        (Array.isArray(prop.photos) && prop.photos[0]?.ph_url) ||
                        '/home2.jpg'
                      }
                      alt="Property"
                      fill
                      className="object-cover rounded-xl"
                    />
                  </div>
                  <div className="text-left text-lg font-bold text-gray-700 mb-2">
                    {prop.price ? `ر.س ${prop.price.toLocaleString()}` : prop.current_list_price || '-'}
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>{prop.bedrooms || prop.total_bed || '-'} bd</span>
                    <span>{prop.bathrooms || prop.total_bath || '-'} ba</span>
                    <span>{prop.areaSize || prop.lot_size_area || '-'} sq m</span>
                    <span>{prop.areaSize ? (prop.areaSize * 1.07639).toFixed(2) : (prop.lot_size_area ? (prop.lot_size_area * 1.07639).toFixed(2) : '-')} sq m</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {prop.address || prop.location || (prop.property_address && prop.property_address.address) || '-'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div> */}
     
      {/* {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 relative shadow-2xl border border-gray-200">
          
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>

      
            <div className="flex items-center space-x-4 mb-6">
              <Image
                src={imgSrc || '/images.jpg'}
                alt={agent.name || agent.fullName || 'Agent'}
                width={50}
                height={50}
                className="w-18 h-16 rounded-xl"
              />
              <h2 className="text-lg font-bold bg-[rgb(206,32,39,255)] text-white px-4 py-1 rounded-full">
                {agent.name || agent.fullName || '-'}
              </h2>
            </div>

           
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <input
                type="tel"
                placeholder="Phone"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <textarea
                rows="3"
                className="w-full text-sm md:text-base px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                defaultValue={`Hi ${agent.name || agent.fullName || ''}, I saw your profile on Keller Williams and wanted to see if I can get some help`}
              ></textarea>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400">
                <option>Select</option>
                <option>Buy</option>
                <option>Rent</option>
                <option>Sell</option>
              </select>

              <label className="flex items-center space-x-2 text-sm">
                <input type="checkbox" className="w-4 h-4" />
                <span>
                  By submitting this form I agree to{' '}
                  <a href="#" className="text-blue-600 underline">
                    Terms of Use
                  </a>
                </span>
              </label>

              <button
                type="submit"
                className="w-full py-3 bg-[rgb(206,32,39,255)] hover:bg-red-800 text-white font-bold rounded-full"
              >
                SUBMIT
              </button>
            </form>
          </div>
        </div>
      )} */}
      
      <NewFooter />
    </div>
  );
};

export default AgentProfile;