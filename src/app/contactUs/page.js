'use client'
import React, { useState,useEffect } from 'react';
import Box from '@/components/box';
import Header from '@/components/header';
import Footer from '@/components/newfooter';
import api from '@/utils/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    enquiryType: 'General Enquiry',
    message: '',
   
  });
  const [heroSrc, setHeroSrc] = useState('/')
  const[page,setPage]=useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  useEffect(() => {
    const fetchPageHero = async () => {
      try {
        const res = await fetch('https://kwsaudi.x-360.ai/api/page/slug/contact-us');
        if (!res.ok) return;
       
        
        const page = await res.json();
        console.log(page);
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
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await api.post('/leads', {
        ...formData,
        formType: 'contact-us'
      });

      if (response.status === 200 || response.status === 201) {
        setSubmitMessage('Thank you! Your message has been sent successfully.');
        // Reset form
        setFormData({
          fullName: '',
          mobileNumber: '',
          email: '',
          enquiryType: 'General Enquiry',
          message: '',
         
        });
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage('Sorry, there was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <Header />
      <Box
        src='/active_listings_page.jpeg'
        h3={page.backgroundOverlayContent}
        image="/contactus.png"
      />

      {/* Contact Form */}
      <div className="w-full md:px-70 px-10 py-10">
        {/* Submit Message */}
        {submitMessage && (
          <div className={`mb-6 p-4 rounded ${submitMessage.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {submitMessage}
          </div>
        )}

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              placeholder="E.g. John Doe"
              value={formData.fullName}
              onChange={handleInputChange}
              className="peer w-full border-b border-gray-400 bg-transparent 
                         focus:outline-none focus:border-[rgb(206,32,39,255)] py-2 
                         placeholder-transparent focus:placeholder-gray-400"
            />
            <label
              htmlFor="fullName"
              className={`absolute left-0 text-gray-500 text-[1.1rem] transition-all ${
                formData.fullName 
                  ? '-top-3.5 text-sm text-black' 
                  : 'top-2 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-black'
              }`}
            >
              Full Name *
            </label>
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                placeholder="E.g. +966 512 345 678"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className="peer w-full border-b border-gray-400 bg-transparent 
                           focus:outline-none focus:border-[rgb(206,32,39,255)] py-2 
                           placeholder-transparent focus:placeholder-gray-400"
              />
              <label
                htmlFor="mobileNumber"
                className={`absolute left-0 text-gray-500 text-[1.1rem] transition-all ${
                  formData.mobileNumber 
                    ? '-top-3.5 text-sm text-black' 
                    : 'top-2 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-black'
                }`}
              >
                Phone Number
              </label>
            </div>

            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="E.g. john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="peer w-full border-b border-gray-400 bg-transparent 
                           focus:outline-none focus:border-[rgb(206,32,39,255)] py-2 
                           placeholder-transparent focus:placeholder-gray-400"
              />
              <label
                htmlFor="email"
                className={`absolute left-0 text-gray-500 text-[1.1rem] transition-all ${
                  formData.email 
                    ? '-top-3.5 text-sm text-black' 
                    : 'top-2 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-black'
                }`}
              >
                Email Address *
              </label>
            </div>
          </div>

          {/* Dropdown */}
          <div className="relative">
            <select
              id="enquiryType"
              name="enquiryType"
              value={formData.enquiryType}
              onChange={handleInputChange}
              className="w-full border-b border-gray-400 bg-transparent 
                         focus:outline-none focus:border-[rgb(206,32,39,255)] py-2 text-gray-700"
            >
              <option value="General Enquiry">General Enquiry</option>
              <option value="Agent Related Enquiry">Agent Related Enquiry</option>
              <option value="Market Center Related Enquiry">Market Center Related Enquiry</option>
            </select>
            <label
              htmlFor="enquiryType"
              className="absolute left-0 -top-3.5 text-gray-500 text-[1.1rem]"
            >
              Select
            </label>
          </div>

          {/* Message with FULL BORDER + floating label */}
          <div className="relative">
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              placeholder="Write your message here..."
              value={formData.message}
              onChange={handleInputChange}
              className="peer w-full border border-gray-400 bg-transparent 
                         focus:outline-none focus:border-black p-3 
                         text-[1.1rem] placeholder-transparent focus:placeholder-gray-400"
            ></textarea>
            <label
              htmlFor="message"
              className={`absolute text-gray-500 text-[1.1rem] transition-all bg-white px-1 ${
                formData.message 
                  ? '-top-2 left-2 text-sm text-black' 
                  : 'left-3 top-3 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:left-2 peer-focus:text-sm peer-focus:text-black'
              }`}
            >
              Message *
            </label>
          </div>

         
       

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`font-semibold px-6 py-2 ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
                  : 'bg-[rgb(206,32,39,255)] text-white'
              }`}
            >
              {isSubmitting ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
