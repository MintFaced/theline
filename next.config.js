/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.privy.io https://*.vercel.app https://vercel.live",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "img-src * data: blob:",
              "media-src *",
              "connect-src * data:",
              "frame-src 'self' https://*.privy.io https://privy.io",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ]
  },

  images: {
    // List every possible format for the R2 domain
    remotePatterns: [
      // Cloudflare R2 — exact bucket ID
      {
        protocol: 'https',
        hostname: 'pub-40df8e6473b14a10a093ecf8c80c2f92.r2.dev',
      },
      // Wildcard catch-all for any r2.dev subdomain
      {
        protocol: 'https',
        hostname: '**.r2.dev',
      },
      // Legacy WordPress
      {
        protocol: 'https',
        hostname: 'theline1.wpenginepowered.com',
      },
      {
        protocol: 'https',
        hostname: '**.wpenginepowered.com',
      },
      // IPFS
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
      // Arweave
      {
        protocol: 'https',
        hostname: 'arweave.net',
      },
      {
        protocol: 'https',
        hostname: '**.arweave.net',
      },
      // NFT marketplaces
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
        hostname: '**.objkt.media',
      },
      {
        protocol: 'https',
        hostname: '**.nftstorage.link',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      // Vercel Blob
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
  },

  async redirects() {
    return [
      { source: '/all-listings',           destination: '/artists',         permanent: true },
      { source: '/all-listings/',          destination: '/artists',         permanent: true },
      { source: '/new-zealand',            destination: '/gallery',         permanent: true },
      { source: '/new-zealand/',           destination: '/gallery',         permanent: true },
      { source: '/walk',                   destination: '/storyline',       permanent: true },
      { source: '/walk/',                  destination: '/storyline',       permanent: true },
      { source: '/articles',              destination: '/storyline',       permanent: true },
      { source: '/articles/',             destination: '/storyline',       permanent: true },
      { source: '/articles/:slug',        destination: '/storyline/:slug', permanent: true },
      { source: '/membership',               destination: '/members/chat',    permanent: false },
      { source: '/membership/',              destination: '/members/chat',    permanent: false },
      { source: '/listing/:slug',         destination: '/artists/:slug',   permanent: true },
      { source: '/categorylisting/:type', destination: '/category/:type',  permanent: true },
    ]
  },
}

module.exports = nextConfig
