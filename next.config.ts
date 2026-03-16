import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  turbopack: {
    resolveAlias: {
      "@react-native-async-storage/async-storage": false,
      "react-native-encrypted-storage": false,
      "@react-native-community/netinfo": false,
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
