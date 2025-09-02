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
      config.externals = {
        ...config.externals,
        "onnxruntime-node": "commonjs onnxruntime-node",
      };
    }
    return config;
  },
};

export default nextConfig;
