'use client'
import React, { useRef,useState, useEffect } from 'react';
import Header from '@/components/header';
import Box from '@/components/box';
import Footer from '@/components/newfooter';
import Image from 'next/image';

import CeoTeam from '@/components/ceoTeam';
import Howwill from '@/components/Howwill';
export default function Aboutus() {
  const [heroSrc, setHeroSrc] = useState('/'); 
  const [page, setPage] = useState('');
  const videoRef = useRef(null);

  // useEffect(() => {
  //   const video = videoRef.current;
  //   if (!video) return;
  //   let observer;
  //   if ('IntersectionObserver' in window) {
  //     observer = new window.IntersectionObserver(
  //       ([entry]) => {
  //         if (entry.isIntersecting) {
  //           video.play();
  //         } else {
  //           video.pause();
  //         }
  //       },
  //       { threshold: 0.5 }
  //     );
  //     observer.observe(video);
  //   }
  //   return () => {
  //     if (observer && video) observer.unobserve(video);
  //   };
  // }, []);
  useEffect(() => {
    const fetchPageHero = async () => {
      try {
        const res = await fetch('https://kwsaudi.x-360.ai/api/page/slug/about-us');
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
    <div>
      <Header />

      <Box
      
        src={heroSrc}
        h3={page.backgroundOverlayContent}
        image="https://static.wixstatic.com/media/36a881_a82aacde83a9442dae07d99a846cadf4~mv2.png/v1/fill/w_271,h_180,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/8-removebg-preview%20(1).png"
      />

      <div className="px-10 md:px-20 py-2 text-black bg-white">
        {/* Heading + Image on same line */}
        <div className="md:flex md:items-start md:justify-between md:gap-10">
          {/* Text Section */}
          <div className="md:w-2/3">
            <div className="mb-6">
                <p className='text-[rgb(206,32,39,255)] text-xl py-4'>About Us</p>
              <h2 className="text-2xl md:text-3xl font-bold  text-left">
                Empowering Real Estate Across Saudi Arabia
              </h2>
            </div>

            <div className="space-y-4 text-md md:text-lg leading-relaxed">
              <p>KW Saudi Arabia — Building Dreams, Creating Opportunities</p>
              <p>
                KW Saudi Arabia is part of Keller Williams, the world&apos;s largest real estate technology and franchise company.
                Founded on values of integrity, excellence, and innovation, KW Saudi Arabia is transforming how people buy,
                sell, and invest in real estate across the Kingdom.
              </p>
              <p>
                We partner with developers, investors, and homeowners to unlock the true potential of Saudi Arabia&apos;s thriving
                real estate market.
              </p>
              <p>
                KW Saudi Arabia is more than real estate — it&apos;s a platform for building communities, growing wealth,
                and shaping the future of property in the Kingdom. We believe in &quot;people before profit.&quot;
              </p>
            </div>
          </div>

          {/* Video Section */}
          <div className="md:w-1/3  md:mt-20">
            <Image 
              src="/kw about video pic.jpg"
              alt="KW Saudi Team" 
              width={500}
              height={350}
              className=""
            />
          </div>
        </div>

        {/* Bottom Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4 md:mt-16 text-center md:text-left mb-10 md:mb-20">
  {/* First Column */}
  <div>
    <h3 className="text-lg md:text-3xl md:leading-16 tracking-[0.1rem]">
      Our Operating <br />
      Principles
    </h3>
  </div>

  {/* Second Column */}
  <div>
    <h3 className="font-semibold md:text-xl text-lg py-2 md:py-6 text-[rgb(206,32,39,255)]">Our Mission</h3>
    <p className='md:text-lg text-md'>
      To Build Careers Worth Having, Businesses Worth Owning, Lives Worth Living, 
      Experiences Worth Giving, And Legacies Worth Leaving.
    </p>
  </div>

  {/* Third Column */}
  <div>
    <h3 className="font-semibold md:text-xl text-lg py-2 md:py-6 text-[rgb(206,32,39,255)]">Our Vision</h3>
    <p className='md:text-lg text-md'>
      To Be The Real Estate Company Of Choice For Agents And Their Customers.
    </p>
  </div>

  {/* Extra Content - Second Column */}
  <div className="md:col-start-2">
    <h3 className="font-semibold md:text-xl text-lg py-2 md:py-6 text-[rgb(206,32,39,255)]">Our Perspective</h3>
    <p className='md:text-lg text-md'>
    A Technology Company That Provides The Real Estate Platform That Our Agents’ Buyers And Sellers Prefer. Keller Williams Thinks Like A Top Producer, Acts Like A Trainer-consultant, And Focuses All Its Activities On Service, Productivity, And Profitability.
    </p>
  </div>

  {/* Extra Content - Third Column */}
  <div>
    <h3 className="font-semibold md:text-xl text-lg py-2 md:py-6 text-[rgb(206,32,39,255)]">WI4C2TES</h3>
    <p className='md:text-lg text-md'>
    Our Belief System Win-win: Or No Deal Integrity: Do The Right Thing Customers: Always Come First Commitment: In All Things Communication: Seek First To Understandcreativity: Ideas Before Results Teamwork: Together Everyone Achieves More Trust: Starts With Honesty Equity: Opportunities For Allsuccess: Results Through People.
    </p>
  </div>
</div>

      </div>
<CeoTeam page={page}></CeoTeam>
<Howwill></Howwill>
      <Footer />
    </div>
  );
}
