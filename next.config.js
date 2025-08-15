/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.my-proxy.com'],
    },
    // swcPlugins: [
    //   ["next-superjson-plugin", {}]
    // ]
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; " +
              "frame-src https://www.youtube.com https://www.youtube-nocookie.com; " +
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data: https:; " +
              "connect-src 'self';",
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig