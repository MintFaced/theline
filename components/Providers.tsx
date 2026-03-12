'use client'
// components/Providers.tsx
import { PrivyProvider } from '@privy-io/react-auth'

// Public App ID — safe to hardcode (not a secret)
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cmmk8h5lp00jo0dl6abt8y0cu'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#C8A96E',
          logo: '/images/the-line-logo.png',
        },
        loginMethods: ['wallet', 'email'],
        embeddedWallets: {
          createOnLogin: 'off',
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}
