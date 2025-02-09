/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
    output: "standalone",  // サーバーレス環境で最適化
    webpack(config) {
        config.resolve.fallback = { fs: false };  // ファイルシステムの依存関係を無効化
        return config;
    },
}

module.exports = nextConfig;