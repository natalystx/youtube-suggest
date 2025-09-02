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
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Properly handle externals - could be an array or object
      if (Array.isArray(config.externals)) {
        config.externals.push("onnxruntime-node");
      } else {
        config.externals = [
          ...(config.externals ? [config.externals] : []),
          "onnxruntime-node",
        ];
      }
    }
    return config;
  },
};

export default nextConfig;
