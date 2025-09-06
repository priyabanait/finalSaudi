'use client'
import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/newfooter';
import Box from '@/components/box';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
const Sellerguid = () => {
  const timelineRef = useRef(null);
  const [markerTop, setMarkerTop] = useState(0);
  const [heroSrc, setHeroSrc] = useState('/');
  const [page, setPage] = useState('');

  const steps = [
    {
      title: 'Manageviewings',
      content: `Once You've Chosen Your Keller Williams Agent, And Together Have Prepped Your House For Sale And Set A Price, You're Ready For The Public To See Your Home.

​What Is A Viewing?   +

How Do I Prepare My House For A Viewing?   +

What Can I Expect When People View My House?   +

Selling Your Home Guide.`,
      align: 'right',
    },
    {
      title: 'Review Offers',
      content: `Congratulations! You Received A Message From Your Kw Agent That You Have An Offer On Your Home. Now You Need To Evaluate That Offer And Decide How To Respond

What Is An Offer?   +

How Do I Evaluate Each Offer?  +

What Happens If I Receive Multiple Offers?  +`,
      align: 'left',
    },
    {
      title: 'Prepare For Inspection',
      content: `Most Buyers Request A Home Inspection As A Condition Of Their Offer. While A Home Inspector Will Dig More Deeply Into Your Home Than A Buyer, The Preparation You Made Before Your First Viewing Should Help You Get Ready For The Inspection. Your Keller Williams Agent Can Give You Personalised Advice, Too.

​What Is A Home Inspection?  +

What Is Looked At During A Home Inspection? +

What's Not Looked At During A Home Inspection? +

How Should I Prepare For An Inspection?  +

What Happens Now? +`,
      align: 'right',
    },
    {
      title: 'Completion',
      content: `While It's Tempting To Focus On Your Next Move, Your Keller Williams Agent Is Likely To Remind You That Until The Completion Is Over, You Have Some Final Responsibilities As A Seller.

.What Should I Do Before The Completion?  +

What Can I Expect When We Complete?   +

What's Next?  +`,
      align: 'left',
    },
   
  ];

   useEffect(() => {
  const handleScroll = () => {
    if (!timelineRef.current) return;

    const timelineRect = timelineRef.current.getBoundingClientRect();
    const timelineStart = window.scrollY + timelineRect.top;
    const timelineHeight = timelineRect.height;
    const currentScroll = window.scrollY+200;

    let progress = (currentScroll - timelineStart) / timelineHeight;

    // Clamp the progress between 0 and 1
    progress = Math.max(0, Math.min(progress, 1));

    setMarkerTop(progress * 100);
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
useEffect(() => {
  const fetchPageHero = async () => {
    try {
      const res = await fetch('https://kwsaudi.x-360.ai/api/page/slug/seller-guide');
      if (!res.ok) return;
      console.log(res);
      
      const page = await res.json();
      setPage(page)
      if (page?.backgroundImage) {
        setHeroSrc(`https://kwsaudi.x-360.ai/${page.backgroundImage}`);
      }
    } catch (e) {
      console.error('Error fetching page hero:', e);
    }
  };
  fetchPageHero();
}, []);

  return (
    <div className="relative">
      <Header />

      

        <Box
        src='/seller_guide_page.jpeg'
          h3={page.backgroundOverlayContent}
          image="https://static.wixstatic.com/media/36a881_0ed2d4fa08bb4022acbbb9e48b783092~mv2.png/v1/fill/w_271,h_180,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/4-removebg-preview.png"
        />
    

      {/* Main Content Section */}
<main className="px-4 md:px-46 py-2">
  <div className="  md:p-0 max-w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-0 md:mb-8">
      <div className="w-full md:w-auto"> 
        <h1 className="text-2xl md:text-3xl md:py-8 py-4">Selling Your <span className='text-[rgb(206,32,39,255)]'>Home</span> Guide</h1>
        <p className="text-md md:text-lg">
        You&rsquo;re Ready To Sell Your Property. And, While You&rsquo;re Looking Forward To Seeing The Word &quot;SOLD&quot; Posted From The Curb, You Know There&rsquo;s A Lot To Consider Along The Way.
       
        
        One Of Your First Decisions Is To Select A Real Estate Company And Real Estate Agent Who&rsquo;ll Join You In The Process.
        </p>
      </div>
    </div>
  </div>
</main>

      {/* Timeline Section */}
      <div ref={timelineRef} className="relative bg-white pt-12 pb-24">
        {/* Center Vertical Line - hidden on mobile */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-black z-0" />

       
        {/* Red Marker over vertical line */}
  <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 z-10 h-full">
    <div
      className="absolute left-1/2 transform -translate-x-1/2"
      style={{
        top: `${markerTop}%`,
        transition: 'top 0.1s ease-out',
      }}
    >
     <div className="w-6 h-6 relative flex items-start justify-center">
  <span className="w-6 h-[2.5px] bg-[rgb(206,32,39,255)]" />
</div>

    </div>
      </div>
      {/* Content Sections */}
        <div className="max-w-full mx-auto space-y-12 md:space-y-42">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`grid grid-cols-1 md:grid-cols-2 gap-4 items-start px-4 md:px-8 lg:px-24`}
            >
             <div className={`mx-4 md:hidden mb-4 ${step.align === 'right' ? 'text-right' : 'text-left'}`}>
  {/* Step Number */}
  <div className={`${step.align === 'right' ? 'flex justify-start' : 'flex justify-end'}`}>
    <span className="text-gray-500 text-2xl font-normal block mb-1">{`${index + 1}.`}</span>
  </div>

  {/* Title - Reverse align compared to number */}
  <div className={`${step.align === 'right' ? 'text-left' : 'text-right'}`}>
    <h2 className="text-[rgb(206,32,39,255)] text-2xl md:text-3xl font-normal  inline-block">
      {step.title}
    </h2>
    <p className="whitespace-pre-line mt-2 text-md">{step.content}</p>
  </div>
</div>


              {/* Desktop: Number on opposite side of vertical line */}
              {step.align === 'right' ? (
                <>
                  {/* Number on the left side */}
                  <div className="hidden md:flex items-center justify-end pr-4">
                    <span className="text-gray-500 text-4xl font-normal md:mb-4">{`${index + 1}.`}</span>
                  </div>
                  <div className="hidden md:block text-left px-0 md:px-8">
                    <h2 className="text-[rgb(206,32,39,255)] md:text-3xl text-xl font-normal ">
                      {step.title}
                    </h2>
                    <p className="whitespace-pre-line mt-2 md:mt-4 leading-7 text-lg">{step.content}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="hidden md:block text-left md:text-right px-0 md:px-8">
                    <h2 className="text-[rgb(206,32,39,255)] md:text-3xl text-xl font-normal ">
                      {step.title}
                    </h2>
                    <p className="whitespace-pre-line mt-2 leading-7 md:mt-4 text-lg">{step.content}</p>
                  </div>
                  {/* Number on the right side */}
                  <div className="hidden md:flex items-center justify-start pl-4">
                    <span className="text-gray-500 text-4xl font-normal md:mb-4">{`${index + 1}.`}</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

 
  <div className="hidden md:flex justify-center py-2 md:py-16">
         <Image
           src="/howwillyouthink.png"
           alt="How Will You Thrive"
           width={800}
           height={400}
         className="w-70 h-20 md:w-[950px] md:h-[400px] object-contain"
         />
       </div>
 
       
      <Footer />
    </div>
  );
}

export default Sellerguid;