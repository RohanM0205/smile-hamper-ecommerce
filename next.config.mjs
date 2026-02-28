/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  distDir: process.env.DIST_DIR || ".next",

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "images.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "img.rocket.new",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // ✅ Cloudinary
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "/homepage",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
