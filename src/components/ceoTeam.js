import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { useTranslation } from '@/contexts/TranslationContext';
import { employeeAPI } from '@/utils/api';

const TeamComponent = ({ page }) => {
  const { language } = useTranslation();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const images = [
    '/M.AWAD.png',
    '/Sarah Said.png',
    '/Abdullah Bakeer.png',
    '/Khalid Yaseen Baig.png',
    '/Rawan Rahhal.png',
    '/Areej Al Rashed.png',
    '/Essa Aljuwaied.png',
    '/Zeeshan Saif.png',
    '/Abdulaziz.png',
   
    '/Amro Nada.png',
   
    
    '/Hamdan Alkatheeri.png',
    
   
    
   
    
    
  ];
  
  
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const response = await employeeAPI.getEmployeesByTeam('Regional Team');

        if (response.success && response.employees) {
          setTeamMembers(response.employees);
        } else {
          console.warn('No team members found from API');
          setTeamMembers([]);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
        setError(error.message);
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);
  

  return (
    <div>
      <div className="pt-4 mx-10 md:mx-10">
        <div className="flex flex-col md:flex-row md:px-20 items-start">
          <div className="md:w-140 h-[40vh] w-full md:h-full items-start">
            <Image
              src='/ceoimage.png'
              alt="CEO"
              width={800}
              height={500}
              className="h-[40vh] md:h-full w-full md:w-140 border border-gray-400"
            />
          </div>

          <div className="w-full md:w-full flex flex-col justify-center items-center text-center mt-10 px-2 md:px-10">
            <h1 className="text-xl md:text-2xl font-semibold tracking-wide text-[rgb(206,32,39,255)]">
              MEET OUR CEO
            </h1>
            <p className="mt-4 md:text-lg text-md md:leading-relaxed leading-normal mx-w-sm">
              More than ever, we want to thank and recognize our agents and partners
              for diligently bringing their very best when their clients need it most.
              As a company built by agents, and for agents, we wake up every day asking
              ourselves how we can best support them.
            </p>
            <p className="mt-4 md:text-lg text-md md:leading-relaxed leading-normal mx-w-sm">
              KW has cultivated an agent-centric, technology-driven, and education-based culture that rewards agents as stakeholders.
            </p>
            <p className="mt-4 md:text-lg text-md md:leading-relaxed leading-normal mx-w-sm">
              Regional team members, market center team members, and agent partners. No
              one succeeds alone, and this is truly a shared moment in recognition of
              our continuous achievements together.
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-white mt-4 md:mt-20">
        <div className="flex flex-col md:flex-row border-t border-b border-r border-black">
          <div className="w-full md:w-1/2 flex justify-center items-center md:sticky md:top-0 top-20 h-auto md:h-screen border-b md:border-b-0 md:border-r border-black py-6 md:py-0">
            <div className="text-center px-4">
              <h2 className="text-3xl md:text-4xl md:font-normal font-semibold mb-2">OUR TEAM</h2>
              <div className="w-30 h-0.5 bg-[rgb(206,32,39,255)] border-0 mb-2 mx-auto mt-4 md:mt-10"></div>
              <p className="text-lg tracking-wider mt-4 md:mt-10">Regional Team</p>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(206,32,39,255)] mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading team members...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-center">
                  <p className="text-red-600 mb-2">Error loading team members</p>
                  <p className="text-sm text-gray-500">Please try again later.</p>
                </div>
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-600">No team members found</p>
              </div>
            ) : (
              teamMembers.map((member, index) => (
  <div key={member._id || index}>
    <div className="flex flex-row gap-3 md:gap-6 p-6 md:p-6 items-start">
      
      <div className="flex-shrink-0 w-32 h-32 sm:w-32 sm:h-32 md:w-60 md:h-60">
        <Image
          src={images[index] || '/placeholder-avatar.png'}
          alt={member.name}
          width={160}
          height={160}
          className="rounded-xl object-cover w-32 h-32 sm:w-32 sm:h-32 md:w-60 md:h-60"
        />
      </div>

      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
          <h3 className="text-lg sm:text-lg md:text-2xl font-semibold tracking-[0.1em] uppercase md:mb-2">
            {member.name}
          </h3>
        </div>
      
                      <p className="md:text-sm text-[0.7rem] text-[rgb(206,32,39,255)] mb-2 md:mb-2 break-all">
                        {member.jobTitle || member.title || 'Team Member'}
                      </p>
                      <div className="mt-6 space-y-2">
                        <p className="flex items-center gap-2 md:text-base text-sm mb-2 break-all">
                          <FaPhoneAlt className="text-gray-600" />
                          {member.phone}
                        </p>

                        <p className="flex items-center gap-2 md:text-base text-sm mb-4 md:mb-12 break-all">
                          <FaEnvelope className="text-gray-600" />
                          {member.email}
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
                  </div>

                  {index !== teamMembers.length - 1 && (
                    <hr className="border-t border-black" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamComponent;