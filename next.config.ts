import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
  // Use output: 'standalone' to optimize the build for production
  output: "standalone",

  // Optimize which files are included in the serverless function bundle
  outputFileTracing: true,
  // Next.js supports this in the main config, not in experimental
  outputFileTracingExcludes: {
    "*": [
      // Exclude unnecessary files that might be included
      "node_modules/@swc/core-linux-x64-gnu",
      "node_modules/@swc/core-linux-x64-musl",
      "node_modules/@esbuild/linux-x64",
      "node_modules/@huggingface/transformers/**",
      // Add other large unnecessary files/folders here
    ],
  },
};

export default nextConfig;
