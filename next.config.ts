import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Turbopack иначе поднимается к ~/package.json и резолвит tailwindcss из ~/Desktop (без node_modules).
  turbopack: {
    root: path.join(__dirname),
    resolveAlias: {
      tailwindcss: path.join(__dirname, "node_modules/tailwindcss"),
    },
  },
};

export default nextConfig;
