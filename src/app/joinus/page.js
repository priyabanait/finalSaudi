'use client'
import React,{useState,useEffect} from 'react';
import Image from 'next/image';
import Box from '@/components/box';
import Header from '@/components/header';
import NewFooter from '@/components/newfooter';
const Joinus = (props) => {
  const [heroSrc, setHeroSrc] = useState('/');
  const [page, setPage] = useState('');
  
  useEffect(() => {
    const fetchPageHero = async () => {
      try {
        const res = await fetch('https://kwsaudi.x-360.ai/api/page/slug/join-us');
        if (!res.ok) return;
        console.log(res);
        
        const page = await res.json();
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
    <div className="">
      {/* Hero Section */}
      <Header />

      <Box
       
        src={heroSrc}
        h3={page.backgroundOverlayContent}
        image={
          '/joinus.png'
        }
      ></Box>
  {/* Intro Text */}
      {/* <main className="px-4 py-6 md:mt-10 mt-10">
        <div className="mx-auto text-center">
            <p className='text-xs md:text-[1rem] tracking-[0.1em] mb-4' >  Partner With A Winning Team </p>
          <h1 className="text-xl md:text-5xl font-normal text-gray-800">
           KW SAUDI ARABIA
          </h1>
          <hr className="w-60 md:w-60 mx-auto bg-[rgb(206,32,39,255)] border-0 h-[1.5px] mt-6 md:mt-14" />
          <div className="mt-10">
            <p className="text-xs md:text-[1rem]">
            You Join A Winning Team Of Real Estate Professionals Who Are Leading The  Industry To Greater Heights
            </p>
            
          </div>
        </div>
      </main> */}
      <div className=" px-10 md:pl-20">
      <div className="grid md:grid-cols-2 gap-0 items-start ">
        {/* Left Column */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold md:py-5 text-black">
              Shape Your <br /> 
              <span className="text-[rgb(206,32,39,255)]">Future </span>
              in Real Estate </h2>
            <p className="mt-4 md:pr-50 md:text-lg text-md text-gray-700">
          
           
  Are you ready to unlock your potential in the real estate industry? Join us at Keller Williams Saudi
   Arabia Career Night to learn more about how you can become a successful real estate agent with the
    world&apos;s largest real estate franchise.
</p>

          </div>
          {/* Why Attend */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Why Us?</h3>
            <ul className="text-gray-700 space-y-2">
  <li className="flex items-start gap-2">
    <span className="text-[rgb(206,32,39,255)] font-bold mt-1">✓</span>
    <span className='md:text-lg text-md'>One-of-a-kind culture</span>
  </li>
  <li className="flex items-start gap-2">
    <span className="text-[rgb(206,32,39,255)] font-bold mt-1">✓</span>
    <span className='md:text-lg text-md'>Limitless earning potential</span>
  </li>
  <li className="flex items-start gap-2">
    <span className="text-[rgb(206,32,39,255)] font-bold mt-1">✓</span>
    <span className='md:text-lg text-md'>Industry-leading technology</span>
  </li>
</ul>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="bg-white shadow-md  p-8">
          <h3 className="text-xl font-bold text-center mb-6">Join Us Today</h3>
          <form className="space-y-4">
            <label className='block mb-2'>Full Name</label>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 border  focus:outline-none focus:ring-2"
            />
              <label className='block mb-2'>Mobile Number</label>
            <input
              type="tel"
              placeholder="Mobile Number"
              className="w-full px-4 py-2 border focus:outline-none focus:ring-2 "
            />
               <label className='block mb-2'>Email Address</label>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-2 border focus:outline-none focus:ring-2 "
            />
             <label className='block mb-2'>City</label>
            <select className="w-full px-4 py-2 border focus:outline-none focus:ring-2 ">
              <option>Select your city</option>
              <option>Riyadh</option>
              <option>Jeddah</option>
              <option>Dammam</option>
              <option>Other</option>
            </select>
            {/* ✅ Message textarea added */}
            <label className="block mb-2">Message</label>

            <textarea
              placeholder="Your Message"
              className="w-full px-4 py-2 border h-24 resize-none focus:outline-none focus:ring-2 "
            ></textarea>

            {/* ✅ Submit Button */}
            <button
              type="submit"
              className="w-full bg-[rgb(206,32,39,255)] text-white font-semibold py-2 hover:bg-red-700 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
     
          
          <div className="flex justify-center py-2 md:py-0">
                   <Image
                     src="/howwillyouthink.png"
                     alt="How Will You Thrive"
                     width={800}
                     height={400}
                   
                   />
                 </div>
           
                 {/* <hr className="w-8/12 md:w-5/12 mx-auto bg-[rgb(206,32,39,255)] border-0 h-[1.5px] mt-2 md:mt-14 mb-10" /> */}
      
      <NewFooter></NewFooter>
    </div>
  );
};

export default Joinus;
