import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  experimental: { authInterrupts: true, useTypeScriptCli: true },
};

export default nextConfig;
