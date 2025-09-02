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
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Properly handle externals for server-side code
      const externalPackages = [
        "onnxruntime-node",
        "@huggingface/transformers",
      ];

      if (Array.isArray(config.externals)) {
        config.externals.push(...externalPackages);
      } else {
        config.externals = [
          ...(config.externals ? [config.externals] : []),
          ...externalPackages,
        ];
      }
    }

    // Enable tree-shaking optimization
    config.optimization = {
      ...config.optimization,
      usedExports: true,
    };

    return config;
  },
};

export default nextConfig;
