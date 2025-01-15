/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/linkedin-bio-generator",
  assetPrefix: "/linkedin-bio-generator",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
