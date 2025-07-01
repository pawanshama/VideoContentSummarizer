import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    // Allow external domains
    domains: ['res.cloudinary.com'],

    // Enable usage of local images (default works out of the box for `/public`)
    // You don't need to do anything special for local images like `/public/avatar.jpg`
  },
};

export default nextConfig;
