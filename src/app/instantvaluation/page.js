'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/header';
import NewFooter from "@/components/newfooter"
import Box from '@/components/box';
import api from '@/utils/api';
import { FaPlus } from "react-icons/fa";

const InstantValuation = () => {
  const [propertyType, setpropertyType] = useState([]);
  const [loading, setLoadingProperties] = useState(true);
  const [formData, setFormData] = useState({
    city: '',
    address: '',
    fullname: '',
    mobileNumber: '',
    bedrooms: '',
    property_type: '',
    valuation_type: '',
    promotionalConsent: false,
    personalDataConsent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

 // derive unique list once from API response
useEffect(() => {
  const fetchProperties = async () => {
    setLoadingProperties(true);
    try {
      const res = await fetch('https://kwbackend.jc2g.in/api/listings/list/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 1,
          limit: 1000,
         
       
        
        })
      });
      const data = await res.json();
      let fetched = [];
      if (Array.isArray(data?.data)) {
        fetched = data.data;
      }
      console.log('Fetched properties:', fetched.slice(0, 2));
      // normalize values and remove duplicates
      const uniqueTypes = [
        ...new Set(
          (fetched || []).map(
            (p) => p?.prop_type || p?.property_type || "Property"
          )
        ),
      ];

      setpropertyType(uniqueTypes);
    } catch (error) {
      setpropertyType([]);
    } finally {
      setLoadingProperties(false);
    }
  };
  fetchProperties();
}, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const payload = {
        ...formData,
        formType: 'instant-valuation'
      };
      console.log('Sending data to backend:', payload);
      
      const response = await api.post('/leads', payload);

      if (response.status === 200 || response.status === 201) {
        setSubmitMessage('Thank you! Your valuation request has been submitted successfully.');
        // Reset form
        setFormData({
          city: '',
          address: '',
          fullname: '',
          mobileNumber: '',
          bedrooms: '',
          property_type: '',
          valuation_type: '',
          promotionalConsent: false,
          personalDataConsent: false
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage('Sorry, there was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Debug log for property types
  useEffect(() => {
    console.log("Property Types:", propertyType);
  }, [propertyType]);

  return (
    <div>
    <div className="relative p-6 md:p-8">
      {/* Sticky Header */}
      <Header />

      <div className="absolute top-0 left-0 w-[100px] h-[100px] md:w-[150px] md:h-[150px] bg-[rgb(206,32,39,255)] z-0"></div>
      
      <div className="relative bg-white">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Left Column */}
          <div className="md:col-span-1 space-y-8">
            <Image src="/instant-val-img.jpg" alt="image" width={435} height={435} />
            <div className="text-gray-700 md:pr-30 md:text-lg text-md leading-relaxed mx-2 md:mx-0 mt-6">
              <p>
                Your valuation is based on millions of pieces of data, from sold house
                prices in your area to current market trends and the size of your home.
              </p>

              <p className="mt-6 font-semibold md:text-lg text-base">Included with your valuation :</p>

              <ul className="mt-4 space-y-2">
                <li className="flex items-start gap-2 ">
                  <FaPlus className="text-[rgb(206,32,39,255)] mt-1" />
                  <span className='md:text-lg text-base'>Agent will contact you</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaPlus className="text-[rgb(206,32,39,255)] mt-1" />
                  <span className='md:text-lg text-base'>We help you sell your property</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 p-8 mt-0 md:mt-20 mr-10">
            <h3 className="text-xl font-bold text-start mb-6">
              Your Free, Online Valuation Starts Here..
            </h3>
            
            {/* Submit Message */}
            {submitMessage && (
              <div className={`mb-4 p-3 rounded ${submitMessage.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {submitMessage}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="city"
                placeholder="Enter your city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-400 focus:outline-none focus:ring-1"
              />
              
             
              <input
                type="text"
                name="fullname"
                placeholder="Name"
                value={formData.fullname}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-400 focus:outline-none focus:ring-2"
              />
              <input
                type="text"
                name="mobileNumber"
                placeholder="Number"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-400 focus:outline-none focus:ring-2"
              />

              {/* Bedrooms Dropdown */}
              <select 
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-400 focus:outline-none focus:ring-2 text-gray-500"
              >
                <option value="">Bedrooms</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="6+">6+</option>
              </select>

              {/* Property Type Dropdown */}
              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-400 focus:outline-none focus:ring-2 text-gray-500"
              >
                <option value="">Select Type</option>
                {propertyType.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              {/* Type of Valuation */}
              <select 
                name="valuation_type"
                value={formData.valuation_type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-400 focus:outline-none focus:ring-2 text-gray-500"
              >
                <option value="">Type of valuation</option>
                <option value="Sale">Sale</option>
                <option value="Letting">Letting</option>
                <option value="Both">Both</option>
              </select>

              
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`flex justify-start text-white px-6 font-semibold p-2 ${
                  isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[rgb(206,32,39,255)]'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Image */}
        
      </div>

     
</div>
      <NewFooter />
    </div>
  );
};

export default InstantValuation;
