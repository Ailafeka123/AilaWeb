import type { NextConfig } from "next";
// const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  /* config options here */
  eslint:{
    ignoreDuringBuilds:true,
  },
  output: 'export',
  basePath:'',
  assetPrefix:'',
  publicRuntimeConfig:{
    basePath:""
  },
  // basePath: isProd? '/aila-web':'',
  // assetPrefix: isProd? '/aila-web':'',
  // publicRuntimeConfig:{
  //   basePath:isProd? '/aila-web':''
  // },
  images:{
    unoptimized:true,
  }
};

export default nextConfig;
