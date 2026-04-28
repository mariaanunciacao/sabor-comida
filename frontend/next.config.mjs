/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.vexels.com",
      },
      {
        protocol: "https",
        hostname: "www.sabornamesa.com.br",
      },
      {
        protocol: "https",
        hostname: "s2-receitas.glbimg.com",
      },
      {
        protocol: "https",
        hostname: "i.s3.glbimg.com",
      },
    ],
  },
};

export default nextConfig;
