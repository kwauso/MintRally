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
                // すべてのルートに対してCORS設定を適用
                source: '/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Credentials', value: 'true' },
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
                ]
            }
        ]
    }
}

module.exports = nextConfig;