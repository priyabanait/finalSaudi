/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'static.wixstatic.com',
      'storage.googleapis.com',
      'source.unsplash.com',
      'localhost',
      'static.kw.com',
      'c.pxhere.com',
      'images.unsplash.com',
      'images.pexels.com',
      'www.kwuk.com',
      'photos.harstatic.com',
      'i.pravatar.cc',
      'api.dicebear.com',
      'www.kw.com',
      'encrypted-tbn0.gstatic.com',
      'avatar.kwconnect.com'
    ],
  },
  // Optional: change the build output folder
  distDir: 'build',        // build folder instead of default '.next'
  trailingSlash: true,     // adds trailing slash to URLs

  // Only use 'output: "export"' if you want a static HTML export
  // Remove it if you are running a server-rendered Next.js app
  // output: 'export', 
};

export default nextConfig;
