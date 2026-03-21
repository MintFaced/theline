'use client'
// components/NcmUpgradeButton.tsx
// CTA buttons for the NCM upgrade package on the join page.
// ETH path: mints via Manifold (same as artist join)
// Contact path: opens mailto for artists who want to discuss first

interface Props {
  manifoldUrl: string
}

export function NcmUpgradeButton({ manifoldUrl }: Props) {
  return (
    <div className="flex flex-col gap-3">

      {/* Primary: mint with ETH */}
      <a
        href={manifoldUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary text-center"
      >
        Upgrade — 0.1 ETH →
      </a>

      {/* Secondary: email enquiry */}
      <a
        href="mailto:mintface@digitalartisteconomy.com?subject=NCM%20Upgrade%20—%20The%20Line&body=Hi%2C%20I%27m%20a%20Line%20Artist%20and%20I%27d%20like%20to%20add%20the%20Networked%20Collectors%20Map%20to%20my%20profile.%0A%0AMy%20Line%20number%3A%20%0AMy%20website%3A%20%0AMy%20smart%20contracts%3A%20"
        className="btn-outline text-center"
      >
        Enquire first
      </a>

      <p className="font-mono text-[9px] text-line-muted tracking-widest text-center">
        Must be an existing Line Artist
      </p>
    </div>
  )
}
