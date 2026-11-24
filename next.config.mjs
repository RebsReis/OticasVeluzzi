/** @type {import('next').NextConfig} */
const isExport = process.env.STATIC_EXPORT === '1';
const nextConfig = {
  reactStrictMode: true,
  ...(isExport ? { output: 'export', trailingSlash: true, images: { unoptimized: true } } : {}),
};
export default nextConfig;
