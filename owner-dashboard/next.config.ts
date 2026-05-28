import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack has a known bug in 16.2.6 where /_global-error prerender
  // fails with "workStore not initialized". Using webpack for production builds.
  // Dev mode still uses Turbopack (via `next dev --turbo`) for fast HMR.
  typescript: {
    // Type errors are already checked separately; don't block the build.
    ignoreBuildErrors: false,
  },
  eslint: {
    // ESLint warnings don't block deploy.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
