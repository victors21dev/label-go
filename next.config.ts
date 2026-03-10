import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [process.env.NEXTAUTH_URL || "http://localhost:3000"],
};

export default nextConfig;
