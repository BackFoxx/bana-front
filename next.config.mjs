/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    productionBrowserSourceMaps: false,
    reactStrictMode: false,
    swcMinify: true,
    typescript: {
        ignoreBuildErrors: true
    },
    async rewrites() {
        return [{
            source: '/api/:path*',
            destination: `${process.env.BACKEND_API}/api/:path*`
        }];
    },
};

export default nextConfig;
