'use client'
import React, { useEffect, useState } from 'react';
import Box from '@/components/box';
import Header from '@/components/header';
import Footer from '@/components/newfooter';
import Image from 'next/image';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import api from '@/utils/api';

import { FaCheck } from "react-icons/fa";
const Franchise = () => {
  // Add state to track screen size
  const [isMobile, setIsMobile] = useState(false);
  const [phone, setPhone] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    city: '',
    educationStatus: '',
    dob: '',
    message: '',
    promotionalConsent: false,
    personalDataConsent: false
  });
  const [heroSrc, setHeroSrc] = useState('/');
  const [page, setPage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  useEffect(() => {
    const fetchPageHero = async () => {
      try {
        const res = await fetch('https://kwsaudi.x-360.ai/api/page/slug/franchise');
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
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await api.post('/leads', {
        ...form,
        formType: 'franchise'
      });

      if (response.status === 200 || response.status === 201) {
        setSubmitMessage('Thank you! Your franchise application has been submitted successfully.');
        // Reset form
        setForm({
          fullName: '',
          mobileNumber: '',
          email: '',
          city: '',
          educationStatus: '',
          dob: '',
          message: '',
          promotionalConsent: false,
          personalDataConsent: false
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage('Sorry, there was an error submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative">
      <Header />

      <Box
        h3={page.backgroundOverlayContent}
        src='/become_a_franchise.jpeg'
        image={
          'https://static.wixstatic.com/media/36a881_d93a5085a707440e9b7a3346a80846a1~mv2.png/v1/fill/w_271,h_180,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/7-removebg-preview.png'
        }
      ></Box>

     
            
       
      
        
       
            {/* Big Life Box */}
            <main className="px-4 md:py-10 py-2 ">
  <div className="mx-auto text-center ">
    <h1 className="text-2xl md:text-3xl font-semibold md:font-semibold tracking-[0.05em] md:tracking-[0.1em] text-gray-800 leading-snug">
      WE WANT YOU TO <span className="text-[rgb(206,32,39,255)]">LIVE A BIG LIFE</span>
    </h1>

    <hr className="w-32 sm:w-48 md:w-60 lg:w-72 border-0 mx-auto bg-[rgb(206,32,39,255)] h-[2px] mt-6 md:mt-14" />

    <div className="mt-6 sm:mt-10 px-2 sm:px-6 md:px-34">
      <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-700">
        Our Mission Is To Help You To Build Careers Worth Having, Businesses Worth Owning, 
        Lives Worth Living, Experiences Worth Giving And Legacies Worth Leaving. 
        To That End We Want This To Be The Most Amazing Place To Be An Estate Agent 
        In The UK And Globally. And We Want The Best Leadership For Our Market Centres.
      </p>
    </div>
  </div>
</main>

            {/* Black Strip Section */}
            <div className="relative min-h-[40vh] md:min-h-screen bg-black flex items-center justify-center">
              <main className="px-4 py-6">
                <div className="mx-auto text-center md:mt-6">
                  <p className="text-white md:text-[0.8rem]">WHERE</p>
                  <h1 className="text-xl md:text-4xl font-normal text-white mt-4">
                    TRUE FINANCIAL FREEDOM BEGINS
                  </h1>
                  <hr className="w-48 md:w-120 border-0 mx-auto bg-[rgb(206,32,39,255)] h-[2px] rounded-full mt-6 md:mt-14" />
                  <div className="mt-10">
                    <p className="text-xs md:text-[1rem] text-white">
                      As A Company Founded On Proven Systems And Models, Keller Williams Provides The Blueprint For Building A Big Business And An Even Bigger Life.
                    </p>
                    <div className="flex justify-center md:justify-center mt-6 md:mt-10">
                      <button className="
                        px-6 md:px-20 bg-[rgb(206,32,39,255)] text-white py-2 md:py-4 rounded-full font-semibold text-sm
                        relative overflow-hidden
                        group transition-all duration-300
                        hover:pr-8 hover:pl-4
                      ">
                        <span className="inline-block transition-all duration-300 group-hover:-translate-x-3">
                          GET STARTED
                        </span>
                        <span className="
                          absolute right-4 top-1/2 -translate-y-1/2
                          opacity-0 group-hover:opacity-100
                          transition-all duration-300 text-black
                          group-hover:translate-x-0 translate-x-4
                        ">
                          ⟶
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </main>
       
          </div>
      
     

      <div className="w-full py-6  md:py-12 px-8">
      <div className="mx-auto grid md:grid-cols-2 gap-10">
        
        {/* Left Section */}
        <div>
          <h2 className="md:text-3xl text-2xl  font-semibold leading-snug">
            WE WANT <span className="text-[rgb(206,32,39,255)]">YOU TO LIVE</span><br /> A BIG LIFE
          </h2>
          <p className="mt-8 text-base md:text-lg leading-relaxed ">
            At Keller Williams Saudi Arabia, we empower entrepreneurs to build thriving businesses, 
            create lasting legacies, and achieve true financial freedom. Our Franchise model is designed 
            to give you the tools, training, and support you need to lead in your market and grow beyond it.
          </p>

          <h3 className="mt-8 font-bold md:text-xl text-lg text-[rgb(206,32,39,255)]">WHY PARTNER WITH US?</h3>
  <ul className="mt-6 space-y-6 text-sm">
    <li>
    <span className="flex items-center gap-2 md:text-lg text-base font-semibold">
    <FaCheck className="text-[rgb(206,32,39,255)] text-lg" />
    Competitive Investment Costs
  </span>
      <span className="md:text-base text-sm">Start your franchise with one of the most cost-effective models in the industry.</span>
    </li>
    <li>
    <span className="flex items-center gap-2  text-lg font-semibold">
    <FaCheck className="text-[rgb(206,32,39,255)] text-lg" />
    Limitless Earning Potential
  </span>
      
      <span className="md:text-base text-sm">Your success is only limited by your ambition and effort.</span>
    </li>
    <li>
    <span className="flex items-center gap-2  md:text-lg text-base font-semibold">
    <FaCheck className="text-[rgb(206,32,39,255)] text-lg" />
    24/7 Training & Support
  </span>
      
      <span className="md:text-base text-sm">Access world-class coaching, mentorship, and operational guidance anytime.</span>
    </li>
    <li>
    <span className="flex items-center gap-2  md:text-lg text-base font-semibold">
    <FaCheck className="text-[rgb(206,32,39,255)] text-lg" />
    Industry-Leading Technology
  </span>
      
      <span className="md:text-base text-sm">Stay ahead with innovative tools that drive efficiency and growth.</span>
    </li>
    <li>
    <span className="flex items-center gap-2  md:text-lg text-base font-semibold">
    <FaCheck className="text-[rgb(206,32,39,255)] text-lg" />
    Additional Growth Opportunities
  </span>
      
      <span className="md:text-base text-sm">Expand your business with multiple revenue streams and service offerings.</span>
    </li>
    <li>
    <span className="flex items-center gap-2 md:text-lg text-base font-semibold">
    <FaCheck className="text-[rgb(206,32,39,255)] text-lg" />
    One-of-a-Kind Culture
  </span>
      
      <span className="md:text-base text-sm">Join a collaborative, success-driven network that celebrates your wins.</span>
    </li>
  </ul>


          <h1 className="mt-8">
            <span className="font-bold text-[rgb(206,32,39,255)] md:text-xl text-lg">SHAPE YOUR FUTURE IN REAL ESTATE</span>
            <p className='text-base md:text-lg mt-2'>
            Ready to own a piece of the world&apos;s largest real estate franchise? Fill out the Franchise Application 
            and take your first step toward building a business that offers both financial rewards and personal fulfillment.
            </p>
          </h1>
        </div>

        {/* Right Section - Form */}
        <div className="bg-white text-black p-8 shadow-lg">
          <h3 className="text-2xl font-medium mb-6 flex justify-center">Franchise Application</h3>
          
          {/* Submit Message */}
          {submitMessage && (
            <div className={`mb-4 p-3 rounded ${submitMessage.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {submitMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
  <div>
    <label className="block text-sm mb-2 font-medium text-gray-700">Full Name</label>
    <input 
      type="text" 
      name="fullName"
      placeholder="Full Name" 
      value={form.fullName}
      onChange={handleInputChange}
      className="w-full border border-gray-300 p-2" 
      required 
    />
  </div>

  <div>
    <label className="block text-sm mb-2 font-medium text-gray-700">Mobile Number</label>
    <input 
      type="text" 
      name="mobileNumber"
      placeholder="Mobile Number" 
      value={form.mobileNumber}
      onChange={handleInputChange}
      className="w-full border border-gray-300 p-2" 
      required 
    />
  </div>

  <div>
    <label className="block text-sm mb-2 font-medium text-gray-700">Email Address</label>
    <input 
      type="email" 
      name="email"
      placeholder="Email Address" 
      value={form.email}
      onChange={handleInputChange}
      className="w-full border border-gray-300 p-2" 
      required 
    />
  </div>

  <div>
    <label className="block text-sm mb-2 font-medium text-gray-700">City</label>
    <input 
      type="text" 
      name="city"
      placeholder="City" 
      value={form.city}
      onChange={handleInputChange}
      className="w-full border border-gray-300 p-2" 
      required 
    />
  </div>

  <div>
    <label className="block text-sm mb-2 font-medium text-gray-700">Education</label>
    <input 
      type="text" 
      name="educationStatus"
      placeholder="Education" 
      value={form.educationStatus}
      onChange={handleInputChange}
      className="w-full border border-gray-300 p-2" 
    />
  </div>

  <div>
    <label className="block text-sm mb-2 font-medium text-gray-700">Date of Birth</label>
    <input 
      type="date" 
      name="dob"
      value={form.dob}
      onChange={handleInputChange}
      className="w-full border border-gray-300 p-2" 
    />
  </div>

  <div>
    <label className="block text-sm mb-2 font-medium text-gray-700">Message</label>
    <textarea 
      name="message"
      placeholder="Message" 
      value={form.message}
      onChange={handleInputChange}
      className="w-full border border-gray-300 p-2" 
      rows={3}>
    </textarea>
  </div>
</div>


            {/* Checkbox */}
            <div className="text-xs text-gray-500">
  <h1 className="font-semibold mb-2">Promotional Declaration</h1>
  <div className="flex items-start space-x-2">
    <input 
      type="checkbox" 
      id="permission" 
      name="promotionalConsent"
      checked={form.promotionalConsent}
      onChange={handleInputChange}
      className="mt-1" 
    />
    <label htmlFor="permission" className="leading-snug">
      I consent to receiving promotional content, text messages, and calls regarding Keller Williams services.
    </label>
  </div>
</div>

            {/* GDPR notice */}
            <div className="text-xs text-gray-500 leading-snug">
  <h1 className="font-semibold mb-2">Personal Data Protection Declaration</h1>
  
  <div className="flex items-start mb-2">
    <input 
      type="checkbox" 
      id="dataPermission" 
      name="personalDataConsent"
      checked={form.personalDataConsent}
      onChange={handleInputChange}
      className="mt-1 mr-2" 
    />
    <label htmlFor="dataPermission" className="leading-snug">
      At Keller Williams Saudi Arabia, we care about your security. In order to fulfill our obligations to inform 
      arising from Article 10 of the Personal Data Protection Law, you can obtain your 
      <span className="text-black font-semibold"> &ldquo;Personal Data Protection Information and Personal Data Sharing Permission&rdquo;</span> 
      from our valued visitors. We kindly request you to read and approve the text in the link below.
    </label>
  </div>
</div>


            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full font-bold py-3 mt-4 ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[rgb(206,32,39,255)] text-white'
              }`}
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
            </button>
          </form>
        </div>
      </div>
    </div>
    

     
      <Footer />
    </div>
    
  );
};

export default Franchise;
