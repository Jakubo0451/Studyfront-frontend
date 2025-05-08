import backendUrl from './environment.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/study/:id/take',
        destination: '/study/[id]/take',
      },
    ];
  },
};

console.log(`Using backend: ${backendUrl}`);

export default nextConfig;