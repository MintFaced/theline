/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'theline1.wpenginepowered.com',
      },
      {
        protocol: 'https',
        hostname: '**.ipfs.dweb.link',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
      },
      {
        protocol: 'https',
        hostname: '**.mypinata.cloud',
      },
    ],
  },
  async redirects() {
    return [
      // Legacy theline.wtf routes
      { source: '/all-listings', destination: '/artists', permanent: true },
      { source: '/all-listings/', destination: '/artists', permanent: true },
      { source: '/new-zealand', destination: '/gallery', permanent: true },
      { source: '/new-zealand/', destination: '/gallery', permanent: true },
      { source: '/walk', destination: '/storyline', permanent: true },
      { source: '/walk/', destination: '/storyline', permanent: true },
      { source: '/articles', destination: '/storyline', permanent: true },
      { source: '/articles/', destination: '/storyline', permanent: true },
      { source: '/articles/:slug', destination: '/storyline/:slug', permanent: true },
      { source: '/listing/:slug', destination: '/artists/:slug', permanent: true },
      { source: '/categorylisting/:type', destination: '/category/:type', permanent: true },
    ]
  },
}

module.exports = nextConfig
