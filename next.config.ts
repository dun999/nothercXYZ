import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "@react-native-async-storage/async-storage": "./src/lib/empty-module.ts",
      "react-native-encrypted-storage": "./src/lib/empty-module.ts",
      "@react-native-community/netinfo": "./src/lib/empty-module.ts",
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage": false,
      "react-native-encrypted-storage": false,
      "@react-native-community/netinfo": false,
    };
    return config;
  },
};

export default nextConfig;
