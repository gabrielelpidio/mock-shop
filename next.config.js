/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    reactRemoveProperties: process.env.NODE_ENV === "production" ? true : false,
  },
};

module.exports = nextConfig;
