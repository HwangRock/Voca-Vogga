import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["subset-font", "harfbuzzjs"],
  outputFileTracingIncludes: {
    "/api/velogv2": [
      "./node_modules/harfbuzzjs/*.wasm",
      "./public/font/NanumJinJuBagGyeongACe.ttf",
    ],
  },
};

export default nextConfig;
