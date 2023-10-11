/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverActions: true,
    swcPlugins: [
      ["next-superjson-plugin", {}]
    ]
  }
}

module.exports = nextConfig