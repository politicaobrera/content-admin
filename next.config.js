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
            
            value:`
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:;
              style-src 'self' 'unsafe-inline';
              img-src 'self' blob: data: https:;
              media-src 'self' blob:;
              worker-src 'self' blob:;
              child-src 'self' blob:;
              connect-src 'self';
              font-src 'self';
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
            `.replace(/\n/g, ' ').trim()
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig

              // "default-src 'self'; " +
              // "frame-src https://www.youtube.com https://www.youtube-nocookie.com; " +
              // "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
              // "style-src 'self' 'unsafe-inline'; " +
              // "img-src 'self' data: https:; " +
              // "connect-src 'self';",