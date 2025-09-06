"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from '@/components/header';
import Image from 'next/image';
import Link from 'next/link';
import NewFooter from '@/components/newfooter'

export default function NewsDetailPage() {
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
          const stored = localStorage.getItem('selectedBlog');
          if (stored) {
            const blogData = JSON.parse(stored);
            if (blogData && blogData._id === id) {
              setBlog(blogData);
            }
          }
        }

        // Fetch fresh data from API
        console.log('Fetching news with ID:', id);
        const res = await fetch(`https://kwsaudi.x-360.ai/api/News/${id}`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const blogData = await res.json();
        console.log('API Response:', blogData);
        setBlog(blogData);
        
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('Failed to load news article. Please try again later.');
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
      <div className="text-lg text-gray-600">Loading news article...</div>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center">
      <div className="text-lg text-red-600">{error}</div>
    </div>
  );

  if (!blog) return (
    <div className="p-8 text-center">
      <div className="text-lg text-gray-600">No blog found.</div>
    </div>
  );

  return (
    <div>
      <div>
    <div className="relative p-4 sm:p-6 md:p-8">
      <Header />

      <div className="absolute top-0 left-0 w-20 h-20 sm:w-[100px] sm:h-[100px] md:w-[150px] md:h-[150px] bg-[rgb(206,32,39,255)] z-0"></div>

      <div className="relative bg-gray-100 pb-10">
      <div className="pt-32 sm:pt-32 md:pt-44 mx-4 md:mx-36">
        <Link href="/ourCulture/news" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to News</Link>
        <h1 className="md:text-3xl text-2xl font-bold mb-4">{blog.title}</h1>
        
        {/* Article Metadata */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
        
          {blog.publishedAt && (
            <span className="flex items-center">
              <span className="font-medium">Published: </span> {new Date(blog.publishedAt).toLocaleDateString('en-US', {
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
        ? `https://kwsaudi.x-360.ai/${blog.coverImage.replace(/\\/g, "/")}`
        : "/event.png"
    }
    alt={blog.title}
    fill
    className="object-cover"
  />
</div>

        <div className="text-lg text-gray-800 md:px-20 md:mt-20">
          {blog.content ? (
            blog.content.includes('<') ? (
              <span dangerouslySetInnerHTML={{ __html: blog.content }} />
            ) : (
              blog.content
            )
          ) : (
            <span>No content available.</span>
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