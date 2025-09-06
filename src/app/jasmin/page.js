'use client'
import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/newfooter';
import Box from '@/components/box';
import Image from 'next/image';
import { FaPhoneAlt,FaEnvelope } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import api from '@/utils/api';
import { useTranslation } from '@/contexts/TranslationContext';

const Riyadh = () => {
    const { language } = useTranslation();

    const [form, setForm] = useState({
      firstName: '',
      lastName: '',
      email: '',
      addressTo: '',
      message: ''
    });
    const [formData, setFormData] = useState({
      fullName: '',
      mobileNumber: '',
      email: '',
      city: '',
      message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [status, setStatus] = useState(null); // null | 'success' | 'error'
    // Add state for team members, loading, and error
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [heroSrc, setHeroSrc] = useState('/'); 
    const [page, setPage] = useState('');
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleFormSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitMessage('');

      try {
        const payload = {
          ...formData,
          formType: 'jasmin'
        };
        console.log('Jasmin form submitting with data:', payload);
        console.log('Form data validation:', {
          fullName: !!formData.fullName,
          mobileNumber: !!formData.mobileNumber,
          email: !!formData.email,
          city: !!formData.city,
          message: !!formData.message
        });
        
        const response = await api.post('/leads', payload);

        if (response.status === 200 || response.status === 201) {
          setSubmitMessage('Thank you! Your message has been sent successfully.');
          // Reset form
          setFormData({
            fullName: '',
            mobileNumber: '',
            email: '',
            city: '',
            message: ''
          });
        }
      } catch (error) {
        console.error('Error submitting Jasmin form:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        
        let errorMessage = 'Sorry, there was an error sending your message. Please try again.';
        
        if (error.response?.data?.message) {
          if (error.response.data.message.includes('already exists')) {
            errorMessage = 'A lead with this email already exists. Please use a different email address.';
          } else {
            errorMessage = error.response.data.message;
          }
        }
        
        setSubmitMessage(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setStatus(null);
      // try {
      //   const res = await fetch('/api/contact', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(form),
      //   });
      //   if (res.ok) {
      //     setStatus('success');
      //     setForm({ firstName: '', lastName: '', email: '', addressTo: '', message: '' });
      //   } else {
      //     setStatus('error');
      //   }
      // } catch {
      //   setStatus('error');
      // }
    };

    useEffect(() => {
      const fetchAgents = async () => {
        try {
          const response = await fetch('https://kwsaudi.x-360.ai/api/employee/team/Jasmin');
          if (!response.ok) throw new Error('Failed to fetch agents');
          const data = await response.json();
          // Map backend fields to UI fields
          console.log(data);
          
          const mappedAgents = Array.isArray(data.employees) ? data.employees.map(agent => ({
            name: agent.name,
            jobTitle: agent.jobTitle,
            phone: agent.phone,
            email: agent.email,
            city: agent.team,
            image: agent.profileImage ? `http://localhost:5000/${agent.profileImage.replace(/\\/g, '/')}` : null,
            title: agent.jobTitle || '',
            _id: agent._id,
            kw_id: ""
          })) : [];
          setTeamMembers(mappedAgents);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchAgents();
    }, []);
    useEffect(() => {
      const fetchPageHero = async () => {
        try {
          const res = await fetch('https://kwsaudi.x-360.ai/api/page/slug/jasmin');
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
        <Header></Header>
          <Box
       h3={page.backgroundOverlayContent}
      src={heroSrc}
         image={
           'https://static.wixstatic.com/media/36a881_3c5b1d5faca941ea915b39acfedf52ee~mv2.png/v1/fill/w_271,h_180,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/2-removebg-preview.png'
         }
       /> 
        {/* Combined Section */}
        <section className="mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Side */}
      <div className="space-y-6">
        <h1 className="md:text-3xl text-2xl font-semibold leading-snug">
          Shape Your <br></br><span className="text-[rgb(206,32,39,255)]">Future</span> in Real Estate
        </h1>
        <p className="md:text-lg text-md leading-relaxed">
  Are you ready to unlock your potential in the real estate industry? Join us at Keller
  Williams Saudi Arabia Career Night to learn more about how you can become a successful
  real estate agent with the world&apos;s largest real estate franchise.
</p>


        {/* Contact Info */}
        <div className="flex flex-col md:flex-row md:gap-8 gap-4 justify-center my-8 text-base text-gray-700">
  <div className="flex items-center gap-2">
    <span className="text-lg">📞</span>
    <a href="tel:+966500000000">+966 500000000</a>
  </div>
  <div className="flex items-center gap-2">
    <span className="text-lg">✉️</span>
    <a href="mailto:info@kwsaudiarabia.com">info@kwsaudiarabia.com</a>
  </div>
</div>


        {/* Google Map */}
        <div className="w-full h-90">
          <iframe
            src='https://www.google.com/maps?q=Jasmin,+Saudi+Arabia&output=embed'
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="bg-white shadow-md p-6">
        <h2 className="text-2xl font-medium mb-6  flex justify-center">Contact Us Today</h2>
        
        {/* Submit Message */}
        {submitMessage && (
          <div className={`mb-4 p-3 rounded ${submitMessage.includes('error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {submitMessage}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <div>
            <label className="block text-sm mb-2 font-medium">Full Name</label>
            <input 
              type="text" 
              name="fullName"
              placeholder="Full Name" 
              value={formData.fullName}
              onChange={handleFormInputChange}
              className="w-full border border-gray-300 p-2" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium">Mobile Number</label>
            <input 
              type="text" 
              name="mobileNumber"
              placeholder="Mobile" 
              value={formData.mobileNumber}
              onChange={handleFormInputChange}
              className="w-full border border-gray-300 p-2" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium">Email Address</label>
            <input 
              type="email" 
              name="email"
              placeholder="Email" 
              value={formData.email}
              onChange={handleFormInputChange}
              className="w-full border border-gray-300 p-2" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium">City</label>
            <input 
              type="text" 
              name="city"
              placeholder="City" 
              value={formData.city}
              onChange={handleFormInputChange}
              className="w-full border border-gray-300 p-2" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium">Message</label>
            <textarea 
              name="message"
              placeholder="Message" 
              rows={4} 
              value={formData.message}
              onChange={handleFormInputChange}
              className="w-full border border-gray-300 p-2"
              required>
            </textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full font-semibold py-2 transition ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed text-gray-600' 
                : 'bg-[rgb(206,32,39,255)] text-white hover:bg-red-800'
            }`}
          >
            {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
          </button>
        </form>
      </div>
    </section>
        <div className="min-h-screen bg-white mt-4 md:mt-20">
        {/* Changed outer container to stack on mobile */}
        <div className="flex flex-col md:flex-row border-t border-b border-r border-black">
          
          {/* Left Section - Full width on mobile, sticky 50% on desktop */}
          <div className="w-full md:w-1/2 flex justify-center items-center 
                         md:sticky md:top-0 top-20 h-auto md:h-screen 
                         border-b md:border-b md:border-r border-black
                         py-4 md:py-0">
            <div className="text-center px-4">
              <h2 className="md:text-3xl text-2xl font-semibold mb-2">OUR TEAM</h2>
              <div className="w-30 h-0.5 bg-[rgb(206,32,39,255)] mb-2 mx-auto border-0 mt-4 md:mt-10"></div>
              <p className="text-lg tracking-wider mt-4 md:mt-10">Jasmin</p>
            </div>
          </div>
      
          {/* Right Section - Full width on mobile, 50% on desktop */}
          <div className="w-full md:w-1/2">
      {loading && (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[rgb(206,32,39,255)] border-solid"></div>
        </div>
      )}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && teamMembers.length === 0 && <div>No agents found.</div>}
      {!loading && !error && teamMembers.map((agent, idx) => (
        <React.Fragment key={agent._id || idx}>
          <article
            className="p-4 md:mx-3 flex flex-row items-start gap-4 relative"
          >
            {/* Agent Image */}
            <div className="w-32 h-32 md:w-50 md:h-50 flex-shrink-0 relative md:mx-3">
              <div 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent click (prevents navigating)
                  localStorage.setItem('selectedAgent', JSON.stringify(agent));

                }}
                className="cursor-pointer"
              >
                {agent.image ? (
                  <Image 
                    src={agent.image}
                    alt={`Portrait of ${agent.name}`}
                    width={128}
                    height={128}
                   className="rounded-lg object-cover w-32 h-32 md:w-50 md:h-50"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center rounded-lg">
                    <span className="text-xs text-gray-500">No Image</span>
                  </div>
                )}
              </div>
            </div>
            {/* Vertical Divider */}
            <div className="hidden md:block w-px bg-gray-300 mx-2" />
            {/* Agent Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 ">
                <h3 className="text-lg sm:text-lg md:text-2xl font-semibold tracking-[0.1em] uppercase md:mb-2">{agent.name}</h3>
                {/* <p className="text-sm text-gray-500 ml-auto">{agent.city}</p> */}
              </div>
              <p className="md:text-sm text-[0.7rem] text-[rgb(206,32,39,255)]  mb-2 md:mb-2 break-all">{agent.jobTitle}</p>
              <div className="mt-6 space-y-2">
  <p className="flex items-center gap-2 md:text-base text-sm mb-2 md:mb-2 break-all">
    <FaPhoneAlt className="text-gray-600" />
    {agent.phone}
  </p>
  <p className="flex items-center gap-2 md:text-base text-sm mb-4 md:mb-12 break-all">
    <FaEnvelope className="text-gray-600" />
    {agent.email}
  </p>
</div>
<div className="flex justify-end">
  <Image
    src={language === 'ar' ? "/logoarebic.png" : "/headerlogo.png"}
    alt="Keller Williams"
    width={180}
    height={50}
    className="mb-4 w-28 md:w-44 lg:w-48 h-auto"
  />
</div>


              
            </div>
          </article>

          
           {/* Divider - Same as before */}
          {idx !== teamMembers.length - 1 && (
  <hr className="border-t border-black w-full" />
)}

              
        </React.Fragment>
      ))}
        </div>
        </div>
        </div>
       
             <div className="flex justify-center py:4 md:py-0">
                    <Image
                      src="/howwillyouthink.png"
                      alt="How Will You Thrive"
                      width={800}
                      height={400}
                      className="w-70 h-20 md:w-[950px] md:h-[400px] object-contain"
                    />
                  </div>
                   
          <Footer></Footer>
        </div>
    );
}

export default Riyadh;