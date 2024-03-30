
const nextConfig = {
    output: process.env.NEXT_DOCKER ? "standalone" : undefined,
    distDir: "dist",
    reactStrictMode: false,
    experimental: {
        instrumentationHook: true,
    },
    webpack: (config) => {
        config.optimization.minimize = false;
        config.resolve.fallback = { fs: false };
        return config;
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                ]
            }
        ]
    }
}
module.exports = nextConfig