import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaTiktok, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import { useTranslation } from '@/contexts/TranslationContext';

export default function Home() {
  const { language } = useTranslation();
  const [open, setOpen] = useState(null);

  const toggleMenu = (menu) => {
    setOpen(open === menu ? null : menu);
  };
  
  const handleGoogleClick = () => {
    window.open("https://accounts.google.com/signin", "_blank", "width=500,height=600");
  };
  
  return (
    <div className="flex flex-col ">
      {/* Main Content */}
     

      {/* Footer */}
      <footer className="mt-auto md:mt-10 md:mx-8">
        {/* Desktop Footer */}
        <div className="border-t border-gray-300 hidden md:block">
          {/* Top Footer */}
         {/* Top Footer */}
<div className="md:mx-10 mx-4 py-10 hidden md:flex justify-between gap-10">
  
  {/* Logo */}
  <div className="flex-shrink-0">
    <Image
      src={language === 'ar' ? "/logoarebic.png" : "/headerlogo.png"}
      alt="Keller Williams"
      width={250}
      height={180}
    />
  </div>

  {/* Columns */}
  <div className="flex flex-1 justify-between gap-10">
    
    {/* OUR CULTURE */}
    <div>
      <h3 className="text-black font-semibold mb-3">OUR CULTURE</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li><Link href="/aboutus">About Us</Link></li>
        <li><Link href="/ourCulture/whyKW">Why KW</Link></li>
        <li><Link href="/training">Training</Link></li>
        <li><Link href="/ourCulture/technology">Technology</Link></li>
        <li><Link href="/ourCulture/news">News</Link></li>
        <li><Link href="/ourCulture/events">Events</Link></li>
      </ul>
    </div>

    {/* SEARCH */}
    <div>
      <h3 className="text-black font-semibold mb-3">SEARCH</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li><Link href="/buyer">Properties</Link></li>
        <li><Link href="/agent">Agent</Link></li>
        <li><Link href="/marketCenter">Market Center</Link></li>
        <li>
          <a 
            href="https://www.kw.com/search/sale?viewport=56.41671222773751%2C120.63362495324327%2C-14.684966046563696%2C-6.807781296756721" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Worldwide
          </a>
        </li>
      </ul>
    </div>

    {/* OTHERS */}
    <div>
      <h3 className="text-black font-semibold mb-3">OTHERS</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li><Link href="/contactUs">Contact</Link></li>
        <li><Link href="/instantvaluation">Instant Valuation</Link></li>
        <li><Link href="/franchise">Open a Franchise</Link></li>
      </ul>
    </div>

    {/* KNOWLEDGE */}
    <div>
      <h3 className="text-black font-semibold mb-3">KNOWLEDGE</h3>
      <ul className="space-y-2 text-sm text-gray-700">
        <li><Link href="/seller/sellerguid">Seller Guide</Link></li>
        <li><Link href="/buyer/buyerguid">Buyer Guide</Link></li>
        <li><Link href="/seller">Five Steps to Sell</Link></li>
      </ul>
    </div>

    
    <div className="bg-[rgb(206,32,39,255)] text-white p-5 max-w-[250px]">
      <h3 className="text-lg font-semibold mb-4">AGENT PORTAL</h3>
      <p className="text-xs mb-3">
        Access your dashboard, tools and resources to grow your business.
      </p>
      <div className="relative w-full mb-3">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-3 py-2 pr-10 bg-white text-black text-sm outline-none border border-gray-300"
        />
        <button
          type="button"
          onClick={handleGoogleClick}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <Image
            src="/redgoogle-removebg-preview.png"
            alt="Google Logo"
            width={30}
            height={30}
          />
        </button>
      </div>
                <Link href='/signinagent' className="w-full flex justify-center bg-white text-[rgb(206,32,39,255)] py-2 text-sm font-medium hover:bg-gray-800 px-4">
        Sign In
      </Link>
    </div>
  </div>


           
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-300 mt-6">
            <div className="md:mx-8 mx-auto py-6">
              <div className="flex flex-col md:flex-row md:justify-between items-center text-sm text-gray-600">
                
                {/* Left Text */}
                <div className="text-center md:text-left mb-3 md:mb-0">
                  <a href="https://www.kwsaudiarabia.com/termsofuse" className="mx-2">Terms of Use</a> | 
                  <a href="https://www.kwsaudiarabia.com/privacypolicy" className="mx-2">Privacy Policy</a> | 
                  <span className="mx-2">REGA License Number #1200018764</span> | 
                  <a href='#' className="mx-2">شركة المقيّمين لإدارة وتطوير العقارات</a>
                </div>

                {/* Social Icons */}
                <div className="flex space-x-4 text-xl">
                  
                <a href="https://www.snapchat.com/add/kwsaudiarabia?invite_id=uOPm-ny1&locale=en_SA%40calendar%3Dgregorian&share_id=AYEA3l8WSMqsIdDUTwPzow&sid=26f1fc0b18b4498197cf201797833561">
                <i className="fab fa-snapchat"></i></a>
                <a href="https://www.tiktok.com/@kw.saudiarabia" rel="noopener noreferrer">
  <i className="fab fa-tiktok"></i>
</a>
                <a href="https://www.facebook.com/kellerwilliamssaudiarabia">
                <i className="fab fa-facebook"></i></a> <a href="https://www.instagram.com/kwsaudiarabia">
                <i className="fab fa-instagram"></i></a> <a href="https://www.youtube.com/@KWSaudiArabia">
                <i className="fab fa-youtube"></i></a> <a href="https://www.linkedin.com/company/kwsaudiarabia/" aria-label="LinkedIn" >
                <i className="fab fa-linkedin"></i></a>
                </div>
              </div>

              {/* Copyright */}
              <p className="text-sm mx-2 text-gray-500 mt-3 text-center md:text-left">
                Copyright © 1998-2025 Keller Williams Realty, LLC <br />
                Keller Williams Realty, LLC, a franchise company, is an Equal Opportunity Employer 
                and supports the Fair Housing Act. Each Keller Williams® office is independently owned and operated.
              </p>
            </div>
          </div>
        </div>

       {/* Mobile Footer */}
<div className="  p-6 md:hidden">
  {/* Menu Sections */}
  <div className="space-y-3">
    {/* OUR CULTURE */}
    <div>
      <button
        className="flex justify-between items-center w-full text-left font-medium text-md"
        onClick={() => toggleMenu("culture")}
      >
        OUR CULTURE
        <FaChevronDown
          className={`transition-transform duration-300 ${
            open === "culture" ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {open === "culture" && (
        <ul className="pl-4 mt-2 text-md space-y-2">
          <li><Link href="/aboutus">About Us</Link></li>
          <li><Link href="/ourCulture/whyKW">Why KW</Link></li>
          <li><Link href="/training">Training</Link></li>
          <li><Link href="/ourCulture/technology">Technology</Link></li>
          <li><Link href="/ourCulture/news">News</Link></li>
          <li><Link href="/ourCulture/events">Events</Link></li>
        </ul>
      )}
    </div>

    {/* SEARCH */}
    <div>
      <button
        className="flex justify-between items-center w-full text-left font-medium text-md"
        onClick={() => toggleMenu("search")}
      >
        SEARCH
        <FaChevronDown
          className={`transition-transform duration-300 ${
            open === "search" ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {open === "search" && (
        <ul className="pl-4 mt-2  text-md space-y-2">
          <li><Link href="/buyer">Properties</Link></li>
          <li><Link href="/agent">Agent</Link></li>
          <li><Link href="/marketCenter">Market Center</Link></li>
          <li>
            <a
              href="https://www.kw.com/search/sale?viewport=56.41671222773751%2C120.63362495324327%2C-14.684966046563696%2C-6.807781296756721"
              target="_blank"
              rel="noopener noreferrer"
            >
              Worldwide
            </a>
          </li>
        </ul>
      )}
    </div>

    {/* OTHERS */}
    <div>
      <button
        className="flex justify-between items-center w-full text-left font-medium text-md"
        onClick={() => toggleMenu("others")}
      >
        OTHERS
        <FaChevronDown
          className={`transition-transform duration-300 ${
            open === "others" ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {open === "others" && (
        <ul className="pl-4 mt-2  text-md space-y-2">
          <li><Link href="/contactUs">Contact</Link></li>
          <li><Link href="/instantvaluation">Instant Valuation</Link></li>
          <li><Link href="/franchise">Open a Franchise</Link></li>
        </ul>
      )}
    </div>

    {/* KNOWLEDGE */}
    <div>
      <button
        className="flex justify-between items-center w-full text-left font-medium text-md"
        onClick={() => toggleMenu("knowledge")}
      >
        KNOWLEDGE
        <FaChevronDown
          className={`transition-transform duration-300 ${
            open === "knowledge" ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {open === "knowledge" && (
        <ul className="pl-4 mt-2  text-md space-y-2">
          <li><Link href="/seller/sellerguid">Seller Guide</Link></li>
          <li><Link href="/buyer/buyerguid">Buyer Guide</Link></li>
          <li><Link href="/seller">Five Steps to Sell</Link></li>
        </ul>
      )}
    </div>

    {/* AGENT PORTAL */}
    <div>
      <button
        className="flex justify-between items-center w-full text-left font-medium text-md"
        onClick={() => toggleMenu("portal")}
      >
        AGENT PORTAL
        <FaChevronDown
          className={`transition-transform duration-300 ${
            open === "portal" ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {open === "portal" && (
        <div className="pl-4 mt-2 shadow-md p-2 border border-gray-200 bg-[rgb(206,32,39,255)] text-md space-y-2">
          <p className="text-md text-white">
            Access your dashboard, tools and resources to grow your business.
          </p>
          <div className="relative w-full">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 pr-10 bg-white text-black text-sm outline-none border border-gray-300"
            />
            <button
              type="button"
              onClick={handleGoogleClick}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Image
                src="/redgoogle-removebg-preview.png"
                alt="Google Logo"
                width={30}
                height={30}
              />
            </button>
          </div>
          <Link
            href="/signinagent"
            className="w-full flex justify-center bg-white text-[rgb(206,32,39,255)] py-2 text-sm font-medium hover:bg-gray-800 px-4"
          >
            Sign In
          </Link>
        </div>
      )}
    </div>
  </div>

  {/* App Store Buttons */}
 

  <hr className="border-gray-500 my-6" />

  {/* Social Icons */}
  <div className="flex justify-center space-x-4 text-xl">
    <a href="https://www.snapchat.com/add/kwsaudiarabia?invite_id=uOPm-ny1"><i className="fab fa-snapchat"></i></a>
    <a href="https://www.facebook.com/kellerwilliamssaudiarabia"><i className="fab fa-facebook"></i></a>
    <a href="https://www.instagram.com/kwsaudiarabia"><i className="fab fa-instagram"></i></a>
    <a href="https://www.youtube.com/@KWSaudiArabia"><i className="fab fa-youtube"></i></a>
    <a href="https://www.linkedin.com/company/kwsaudiarabia/"><i className="fab fa-linkedin"></i></a>
  </div>

  {/* Footer Links */}
  <div className="flex flex-wrap justify-center gap-1 text-gray-600 text-sm mt-6">
    <a href="https://www.kwsaudiarabia.com/termsofuse">Terms of Use  | </a>
    <a href="https://www.kwsaudiarabia.com/privacypolicy">Privacy Policy  | </a>
    <span className="mx-2">REGA License Number #1200018764</span> | 
                  <a href='#' className="mx-2">شركة المقيّمين لإدارة وتطوير العقارات</a>
  </div>
  <p className="text-sm mx-2 text-gray-500 mt-3 text-center md:text-left">
                Copyright © 1998-2025 Keller Williams Realty, LLC <br />
                Keller Williams Realty, LLC, a franchise company, is an Equal Opportunity Employer 
                and supports the Fair Housing Act. Each Keller Williams® office is independently owned and operated.
              </p>
</div>

      </footer>
    </div>
  );
}