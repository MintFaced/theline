// app/members/chat/page.tsx
import type { Metadata } from 'next'
import { LarpChat } from '@/components/LarpChat'

export const metadata: Metadata = {
  title: 'LARP Chat — Line Artists Rad Party',
  description: 'Token-gated chat for Line Artists.',
  robots: { index: false, follow: false },
}

export default function ChatPage() {
  return <LarpChat />
}
