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
              script-src 
                'self' 
                'unsafe-eval' 
                'unsafe-inline' 
                blob: 
                https://cdn.jsdelivr.net 
                https://www.googletagmanager.com 
                https://www.google-analytics.com 
                https://connect.facebook.net 
                https://platform.twitter.com;
              style-src 
                'self' 
                'unsafe-inline' 
                https://cdn.jsdelivr.net 
                https://fonts.googleapis.com;
              img-src 
                'self' 
                blob: 
                data: 
                https: 
                https://firebasestorage.googleapis.com 
                https://www.google-analytics.com 
                https://stats.g.doubleclick.net;
              media-src 
                'self' 
                blob: 
                https://www.youtube.com 
                https://firebasestorage.googleapis.com;
              worker-src 
                'self' 
                blob:;
              child-src 
                'self' 
                blob: 
                https://www.youtube.com 
                https://platform.twitter.com 
                https://www.facebook.com 
                https://player.vimeo.com;
              connect-src 
                'self' 
                https://firebasestorage.googleapis.com 
                https://www.google-analytics.com 
                https://stats.g.doubleclick.net 
                wss://*.firebaseio.com;
              font-src 
                'self' 
                https://cdn.jsdelivr.net 
                https://fonts.gstatic.com;
              frame-src 
                'self' 
                https://www.youtube.com 
                https://platform.twitter.com 
                https://www.facebook.com 
                https://player.vimeo.com 
                https://www.instagram.com;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
            `.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim()
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