/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: process.cwd(),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.gov.br" },
      { protocol: "https", hostname: "gov.br" }
    ]
  }
};

export default nextConfig;
