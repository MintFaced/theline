'use client'
// components/NcmUpgradeButton.tsx

interface Props {
  ethUri: string      // ethereum:mintface.eth?value=1e17
  accentColor: string // matches the NCM ember color
}

export function NcmUpgradeButton({ ethUri, accentColor }: Props) {
  return (
    <div className="flex flex-col gap-3">

      {/* Primary: direct ETH send to mintface.eth */}
      <a
        href={ethUri}
        className="text-center font-mono text-[11px] tracking-widest uppercase px-6 py-3.5 transition-colors text-line-bg"
        style={{ background: accentColor }}
      >
        Upgrade — 0.1 ETH →
      </a>

      {/* Secondary: enquire on X */}
      <a
        href="https://x.com/mintface"
        target="_blank"
        rel="noopener noreferrer"
        className="text-center font-mono text-[11px] tracking-widest uppercase px-6 py-3.5 border transition-colors"
        style={{ borderColor: accentColor, color: accentColor }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = accentColor + '15' }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
      >
        Enquire on X @mintface
      </a>

      <p className="font-mono text-[9px] text-line-muted tracking-widest text-center">
        Payment to ourline.eth · Must be an existing Line Artist
      </p>
    </div>
  )
}
