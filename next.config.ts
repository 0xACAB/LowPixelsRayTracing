import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: false,
    experimental: {
        serverActions: {
            allowedOrigins: ['xtranscendence.ru', 'localhost:3000', 'localhost:80']
        }
    },
    devIndicators: false,
    poweredByHeader: false,
    trailingSlash: true,
    /*async redirects() {
        return [
            {
                source: '/mongo',
                destination: '/',
                permanent: true
            }
        ];
    },*/
    turbopack: {
        rules: {
            '*.{glsl,wgsl,vs,fs,vert,frag}': {
                loaders: ['raw-loader'],
                as: '*.js'
            }
        }
    }
};

export default nextConfig;
