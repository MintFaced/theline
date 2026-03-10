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
      {
        protocol: 'https',
        hostname: 'pub-d9cd1d9cbee240ac910a712435c5224c.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '**.arweave.net',
      },
      {
        protocol: 'https',
        hostname: 'arweave.net',
      },
      {
        protocol: 'https',
        hostname: '**.nftstorage.link',
      },
      {
        protocol: 'https',
        hostname: 'i.seadn.io',
      },
      {
        protocol: 'https',
        hostname: 'openseauserdata.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.objkt.media',
      },
      {
        protocol: 'https',
        hostname: '**.objkt.media',
      },
    ],
    // Allow all domains as fallback for development
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
