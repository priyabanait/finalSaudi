'use client';
import React, { useEffect, useState } from 'react';
import Header from '@/components/header';
import Image from 'next/image';
import Footer from '@/components/newfooter';
import { FiSearch } from 'react-icons/fi';
import Box from '@/components/box';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
export default function Page(){
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [heroSrc, setHeroSrc] = useState('/');
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('https://kwsaudi.x-360.ai/api/events');
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        setBlogs(data);
        console.log(data.coverImage);
        
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const fetchPageHero = async () => {
      try {
        const res = await fetch('https://kwsaudi.x-360.ai/api/page/slug/events');
        if (!res.ok) return;
        const page = await res.json();
        if (page?.backgroundImage) {
          setHeroSrc(`https://kwsaudi.x-360.ai/${page.backgroundImage}`);
        }
      } catch (e) {
        console.error('Error fetching page hero:', e);
      }
    };
    fetchPageHero();
  }, []);

  const handleReadMore = (post) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedEvent', JSON.stringify(post));
      router.push(`/ourCulture/events/${post._id}`);
    }
  };

  return (
    <div>
      <Header />
      
              <Box
       
          h3="Events"
          src={heroSrc}
        />
      {/* Filter Bar */}
      

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20 ">
          <div className="text-lg text-gray-600">Loading events...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex justify-center items-center py-20">
          <div className="text-lg text-red-600 text-center">
            {error}
          </div>
        </div>
      )}

      {/* Blog Cards */}
      {!loading && !error && (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 p-4 md:px-40 ">
    {blogs.length === 0 ? (
      <div className="col-span-full text-center py-20">
        <div className="text-lg text-gray-600">No events found.</div>
      </div>
    ) : (
      blogs.map((post, index) => (
        <div
          key={post._id || index}
          className="bg-white shadow-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
        >
          <div className="w-full h-60 bg-gray-200 relative">
            <Image
              src={
                post.coverImage
                  ? `https://kwsaudi.x-360.ai/${post.coverImage}`
                  : "/event.png"
              }
              alt={post.title || "Event"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <div className="p-4 flex flex-col flex-grow">
            {post.createdAt && (
              <p className="text-xs text-gray-500 mb-3">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            )}
            <h3 className="md:text-2xl text-xl mb-2 font-semibold line-clamp-2">
              {post.title}
            </h3>
            <p className="text-gray-600 text-base line-clamp-3 mb-3">
              {post.description}
            </p>

            <button
              onClick={() => handleReadMore(post)}
              className="mt-auto w-full px-4 py-2 bg-[rgb(206,32,39)] text-white transition-colors text-base font-semibold hover:bg-[rgb(180,28,35)]"
            >
              Read More
            </button>
          </div>
        </div>
      ))
    )}
  </div>
)}
<Footer></Footer>
    </div>
  );
};

