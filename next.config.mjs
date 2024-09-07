/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{
        MEILISEARCH_HOST: process.env.MEILISEARCH_HOST,
        MEILISEARCH_KEY: process.env.MEILISEARCH_KEY
    },
    output: 'standalone',
};
export default nextConfig;