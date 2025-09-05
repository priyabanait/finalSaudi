"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from '@/components/header';
import Image from 'next/image';
import Link from 'next/link';
import NewFooter from '@/components/newfooter'

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First try to get from localStorage (for immediate display)
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('selectedEvent');
          if (stored) {
            const blogData = JSON.parse(stored);
            if (blogData && blogData._id === id) {
              setBlog(blogData);
            }
          }
        }

        // Fetch fresh data from API
        console.log('Fetching event with ID:', id);
        const res = await fetch(`http://localhost:5000/api/event/${id}`);
        
        console.log('Response status:', res.status);
        console.log('Response headers:', res.headers);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Error response body:', errorText);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const blogData = await res.json();
        console.log('API Response:', blogData);
        
        // Handle case where API might return an array
        if (Array.isArray(blogData)) {
          const event = blogData.find(item => item._id === id);
          if (event) {
            setBlog(event);
          } else {
            setError('Event not found');
          }
        } else {
          setBlog(blogData);
        }
        
      } catch (error) {
        console.error('Error fetching event:', error);
        setError('Failed to load event. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  if (loading) return (
    <div className="p-8 text-center">
      <div className="text-lg text-gray-600">Loading event...</div>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center">
      <div className="text-lg text-red-600">{error}</div>
    </div>
  );

  if (!blog) return (
    <div className="p-8 text-center">
      <div className="text-lg text-gray-600">No event found.</div>
    </div>
  );

  return (
    <div>
      <div>
    <div className="relative p-4 sm:p-6 md:p-8">
      <Header />

      <div className="absolute top-0 left-0 w-20 h-20 sm:w-[100px] sm:h-[100px] md:w-[150px] md:h-[150px] bg-[rgb(206,32,39,255)] z-0"></div>

      <div className="relative bg-gray-100 pb-10">
      <div className="pt-32 sm:pt-32 md:pt-44 sm:mx-10 md:mx-36">
        <Link href="/ourCulture/events" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Events</Link>
        <h1 className="md:text-3xl text-2xl font-bold mb-4">{blog.title}</h1>
        
        {/* Article Metadata */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
          {blog.author && (
            <span className="flex items-center">
              <span className="font-medium">By:</span> {blog.author}
            </span>
          )}
          {blog.publishedAt && (
            <span className="flex items-center">
              <span className="font-medium">Published:</span> {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          )}
          {blog.createdAt && blog.createdAt !== blog.publishedAt && (
            <span className="flex items-center">
              <span className="font-medium">Created:</span> {new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          )}
        </div>
        <div className="w-full aspect-[4/3] md:aspect-[14/6] relative mb-6">
  <Image
    src={
      blog.coverImage
        ? `http://localhost:5000/${blog.coverImage.replace(/\\/g, "/")}`
        : "/event.png"
    }
    alt={blog.title}
    fill
    className="object-cover"
  />
</div>
        <div className="text-lg text-gray-800 md:px-20 md:mt-20">
          {blog.description ? (
            blog.description.includes('<') ? (
              <span dangerouslySetInnerHTML={{ __html: blog.description }} />
            ) : (
              blog.description
            )
          ) : (
            <span>No description available.</span>
          )}
        </div>
      </div>
    </div>
    </div>
    </div>
    <NewFooter></NewFooter>
        </div>
  );
} 