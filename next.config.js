/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
    output: "standalone",  // サーバーレス環境で最適化
    webpack(config) {
        config.resolve.fallback = { 
            fs: false, 
            'bls-eth-wasm': false,
            path: false,
            crypto: false
        };
        config.experiments = {
            ...config.experiments,
            asyncWebAssembly: true,
            topLevelAwait: true
        }
        return config;
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: '*' }
                ]
            }
        ]
    }
}

module.exports = nextConfig;