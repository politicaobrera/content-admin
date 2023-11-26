/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    swcPlugins: [
      ["next-superjson-plugin", {}]
    ]
  }
}

module.exports = nextConfig