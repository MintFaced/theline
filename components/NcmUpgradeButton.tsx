'use client'
// components/NcmUpgradeButton.tsx
import { SendEthButton } from '@/components/SendEthButton'

interface Props {
  accentColor: string
}

export function NcmUpgradeButton({ accentColor }: Props) {
  return (
    <div className="flex flex-col gap-3">

      {/* Primary: send 0.1 ETH via connected wallet */}
      <SendEthButton defaultAmount="0.1" label="NCM Upgrade — 0.1 ETH" accentColor={accentColor} />

      {/* Secondary: enquire on X */}
      <a
        href="https://x.com/mintface"
        target="_blank"
        rel="noopener noreferrer"
        className="text-center font-mono text-[11px] tracking-widest uppercase px-6 py-3.5 border transition-colors hover:opacity-70"
        style={{ borderColor: accentColor, color: accentColor }}
      >
        DM Pay Receipt on X @mintface
      </a>

      <p className="font-mono text-[9px] text-line-muted tracking-widest text-center">
        Payment to mintface.eth · Must be an existing Line Artist
      </p>
    </div>
  )
}
