/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
        serverComponentsExternalPackages: ['better-sqlite3'],
    },
}

module.exports = nextConfig
