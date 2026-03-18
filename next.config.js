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
              "frame-src 'self' https://*.privy.io https://privy.io https://*.oncyber.io https://oncyber.io https://*.substack.com https://substack.com https://www.youtube.com https://youtube.com",
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
      // Alchemy NFT CDN
      {
        protocol: 'https',
        hostname: 'nft-cdn.alchemy.com',
      },
      {
        protocol: 'https',
        hostname: '**.nft-cdn.alchemy.com',
      },
      // OpenSea CDN
      {
        protocol: 'https',
        hostname: 'i.seadn.io',
      },
      // Substack / S3 media
      {
        protocol: 'https',
        hostname: 'substackcdn.com',
      },
      {
        protocol: 'https',
        hostname: '**.substack-post-media.s3.amazonaws.com',
      },
    ],
  },

  async redirects() {
    return [
      // wp-content images -> R2
      { source: '/wp-content/uploads/:path*', destination: 'https://pub-40df8e6473b14a10a093ecf8c80c2f92.r2.dev/migrated/wp-content/uploads/:path*', permanent: true },
      { source: '/all-listings',           destination: '/artists',         permanent: true },
      { source: '/artists/whale-papi',      destination: '/artists/matt-walch', permanent: true },
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
      // Old WP pages -> new equivalents
      { source: '/art-timeline',           destination: '/cryptoart',       permanent: true },
      { source: '/art-timeline/',          destination: '/cryptoart',       permanent: true },
      { source: '/crypto-books',           destination: '/books',           permanent: true },
      { source: '/crypto-books/',          destination: '/books',           permanent: true },
      { source: '/proposal',               destination: '/vision',          permanent: true },
      { source: '/proposal/',              destination: '/vision',          permanent: true },
      { source: '/events',                 destination: '/gallery',         permanent: true },
      { source: '/events/',                destination: '/gallery',         permanent: true },
      { source: '/promotion',              destination: '/join',            permanent: true },
      { source: '/promotion/',             destination: '/join',            permanent: true },
      { source: '/line-setup',             destination: '/join',            permanent: true },
      { source: '/line-setup/',            destination: '/join',            permanent: true },
      { source: '/swap-lines',             destination: '/join',            permanent: true },
      { source: '/swap-lines/',            destination: '/join',            permanent: true },
      { source: '/errors',                 destination: '/faq',             permanent: true },
      { source: '/errors/',                destination: '/faq',             permanent: true },
      { source: '/subscribe',              destination: '/storyline',       permanent: true },
      { source: '/subscribe/',             destination: '/storyline',       permanent: true },
      { source: '/featured',               destination: '/storyline',       permanent: true },
      { source: '/featured/',              destination: '/storyline',       permanent: true },
      { source: '/categorylisting/ai',         destination: '/artists?category=ai',          permanent: true },
      { source: '/categorylisting/generative', destination: '/artists?category=generative',  permanent: true },
      { source: '/categorylisting/glitch',     destination: '/artists?category=glitch',      permanent: true },
      { source: '/categorylisting/illustration', destination: '/artists?category=illustration', permanent: true },
      { source: '/categorylisting/painting',   destination: '/artists?category=painting',    permanent: true },
      { source: '/categorylisting/photography', destination: '/artists?category=photography', permanent: true },
      { source: '/categorylisting/3d',         destination: '/artists?category=3d',          permanent: true },
      // Catch-all WP admin / feed URLs -> home
      { source: '/wp-admin',               destination: '/',                permanent: true },
      { source: '/wp-admin/:path*',        destination: '/',                permanent: true },
      { source: '/wp-login.php',           destination: '/',                permanent: true },
      { source: '/feed',                   destination: '/storyline',       permanent: true },
      { source: '/feed/',                  destination: '/storyline',       permanent: true },
      { source: '/sitemap_index.xml',      destination: '/sitemap.xml',     permanent: true },

      { source: '/categorylisting/:type', destination: '/category/:type',  permanent: true },
    ]
  },
}

module.exports = nextConfig
