# The Line — theline.nz

> 1,000 artists. One permanent line. A world-class digital art museum on-chain.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in all values in .env.local

# 3. Run development server
npm run dev
# → http://localhost:3000

# 4. Build for production
npm run build
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Connect repo in your Vercel dashboard
3. Add all environment variables from `.env.example` in Vercel → Settings → Environment Variables
4. Add Vercel KV store (Storage tab in dashboard) — auto-populates `KV_*` variables
5. Add Vercel Blob store (Storage tab) — auto-populates `BLOB_READ_WRITE_TOKEN`
6. Deploy → theline.nz

## Image Migration (run before WordPress decommission)

```bash
# From the project root, with artists-clean.json in same directory:
pip install requests tqdm
python3 scripts/download-images.py

# Then upload to Vercel Blob:
npx vercel blob upload public/images/artists/* --prefix artists/

# Update image URLs in data/artists.json to Blob URLs
python3 scripts/update-image-urls.py \
  --blob-base https://[your-id].public.blob.vercel-storage.com
```

## Project Structure

```
app/                 Next.js App Router pages + API routes
components/          React components
lib/                 Alchemy, bio generation, token gating
data/artists.json    All 784 unique artists (from 821 records)
public/fonts/        Self-hosted WOFF2 fonts (add Canela, Söhne, JetBrains Mono)
styles/globals.css   Design tokens, base styles
types/index.ts       TypeScript types
```

## Fonts

All fonts load automatically via `next/font/google` — **no font files needed**.

- **Cormorant Garamond** — display serif (replaces Canela; swap when licensed)
- **DM Sans** — clean UI font (replaces Söhne; swap when licensed)
- **JetBrains Mono** — data, wallets, line numbers (free, stays)

To upgrade to Canela + Söhne later:
1. License from https://klim.co.nz
2. Add WOFF2 files to `public/fonts/`
3. Replace `next/font/google` imports in `app/layout.tsx` with `next/font/local`
4. Update CSS variable names in `styles/globals.css`

## Artist Data

`data/artists.json` — 784 unique artist profiles merged from 821 CSV records.
- 25 artists hold multiple Line positions (e.g. MintFace: Lines 0, 106, 681, 686, 751)
- All 784 have gallery images and oncyber URLs
- 81% have wallet addresses
- 59% have X handles

## Phase Tracker

- [x] Phase 1 — Foundation + Data ← **You are here**
- [ ] Phase 2 — The Line Rail (react-window virtualisation)
- [ ] Phase 3 — Live On-Chain Data (Alchemy + TzKT + OpenSea)
- [ ] Phase 4 — AI Bio Pipeline (X API + Claude + Vercel KV)
- [ ] Phase 5 — Auth + Token Gating (Privy + membership chat)
- [ ] Phase 6 — Editorial + Remaining Pages
- [ ] Phase 7 — Polish + Launch → theline.nz

## Domain Migration

At launch:
1. Point `theline.nz` DNS A record to Vercel
2. Add `theline.nz` as custom domain in Vercel dashboard
3. Configure `theline.wtf` → `theline.nz` 301 redirects (via Vercel or DNS CNAME)

## Environment Variables

See `.env.example` for all required variables.

**Never commit `.env.local` to git.**
