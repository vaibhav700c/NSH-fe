/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    PORT: "8000",
  },
};

module.exports = nextConfig;