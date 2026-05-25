/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: process.cwd(),
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/index.html" }
      ]
    };
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.gov.br" },
      { protocol: "https", hostname: "gov.br" }
    ]
  }
};

export default nextConfig;
