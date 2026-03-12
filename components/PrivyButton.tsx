'use client'
// components/PrivyButton.tsx — loaded dynamically, client-only
import { usePrivy } from '@privy-io/react-auth'

export default function PrivyButton() {
  const { ready, authenticated, login, logout, user } = usePrivy()
  const walletAddress = user?.wallet?.address
  const shortAddress = walletAddress ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}` : null

  if (authenticated && shortAddress) {
    return (
      <button onClick={logout} className="font-mono text-[11px] tracking-widest text-line-accent border border-line-accent px-3 py-1.5 hover:bg-line-accent hover:text-line-bg transition-all">
        {shortAddress}
      </button>
    )
  }

  return (
    <button
      onClick={login}
      disabled={!ready}
      className="font-mono text-[11px] tracking-widest uppercase text-line-bg bg-line-accent px-4 py-1.5 hover:opacity-85 transition-opacity disabled:opacity-60"
    >
      Connect Wallet
    </button>
  )
}
