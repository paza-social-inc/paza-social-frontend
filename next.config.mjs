const nextConfig = {
    assetPrefix: "/exp3-static",
    transpilePackages: ["@workspace/ui"],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*',
            },
        ],
    },
}

export default nextConfig
