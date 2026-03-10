/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Cloudflare R2 — primary image store (all 784 artist images)
      {
        protocol: 'https',
        hostname: 'pub-40df8e6473b14a10a093ecf8c80c2f92.r2.dev',
        pathname: '/**',
      },
      // Vercel Blob — future uploads
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
        pathname: '/**',
      },
      // Legacy WordPress images (still referenced by some articles/artists)
      {
        protocol: 'https',
        hostname: 'theline1.wpenginepowered.com',
        pathname: '/**',
      },
      // IPFS gateways
      {
        protocol: 'https',
        hostname: '**.ipfs.dweb.link',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.mypinata.cloud',
        pathname: '/**',
      },
      // Arweave
      {
        protocol: 'https',
        hostname: 'arweave.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.arweave.net',
        pathname: '/**',
      },
      // NFT marketplaces
      {
        protocol: 'https',
        hostname: 'i.seadn.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'openseauserdata.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.objkt.media',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.objkt.media',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.nftstorage.link',
        pathname: '/**',
      },
      // AWS S3 (some older NFT metadata)
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
        pathname: '/**',
      },
    ],
  },

  async headers() {
    return [
      {
        // Allow R2 images to load cross-origin
        source: '/_next/image(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ]
  },

  async redirects() {
    return [
      { source: '/all-listings',          destination: '/artists',       permanent: true },
      { source: '/all-listings/',         destination: '/artists',       permanent: true },
      { source: '/new-zealand',           destination: '/gallery',       permanent: true },
      { source: '/new-zealand/',          destination: '/gallery',       permanent: true },
      { source: '/walk',                  destination: '/storyline',     permanent: true },
      { source: '/walk/',                 destination: '/storyline',     permanent: true },
      { source: '/articles',             destination: '/storyline',     permanent: true },
      { source: '/articles/',            destination: '/storyline',     permanent: true },
      { source: '/articles/:slug',       destination: '/storyline/:slug', permanent: true },
      { source: '/listing/:slug',        destination: '/artists/:slug', permanent: true },
      { source: '/categorylisting/:type', destination: '/category/:type', permanent: true },
    ]
  },
}

module.exports = nextConfig
