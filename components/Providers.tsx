'use client'
// components/Providers.tsx
import { PrivyProvider } from '@privy-io/react-auth'

const PRIVY_APP_ID = 'cmmk8h5lp00jo0dl6abt8y0cu'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#C8A96E',
        },
        loginMethods: ['wallet'],
      }}
    >
      {children}
    </PrivyProvider>
  )
}
