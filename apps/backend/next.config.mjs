import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Sometimes strict mode double-invocations obscure race conditions
    productionBrowserSourceMaps: true, // Force source maps
    webpack: (config) => {
        config.devtool = 'source-map'; // Detailed source maps for dev
        return config;
    },
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
}

export default withPayload(nextConfig)
