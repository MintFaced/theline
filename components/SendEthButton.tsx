'use client'
// components/SendEthButton.tsx
import { useState } from 'react'

const RECIPIENT = 'ourline.eth'
const RECIPIENT_ADDRESS = '0xd40B63bF04a44e43fBFE5784bCf22ACaAB34a180' // ourline.eth resolved

interface SendEthButtonProps {
  defaultAmount: string // e.g. "3"
  label: string         // e.g. "Lead Producer — 3 ETH"
}

export function SendEthButton({ defaultAmount, label }: SendEthButtonProps) {
  const [amount, setAmount] = useState(defaultAmount)
  const [status, setStatus] = useState<'idle' | 'pending' | 'sent' | 'error'>('idle')
  const [txHash, setTxHash] = useState<string | null>(null)

  const sendEth = async () => {
    const eth = window.ethereum as any
    if (!eth) {
      alert('No Ethereum wallet detected. Please install MetaMask or use a Web3 browser.')
      return
    }

    setStatus('pending')
    try {
      const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' })
      if (!accounts.length) throw new Error('No accounts found')

      const amountWei = '0x' + Math.round(parseFloat(amount) * 1e18).toString(16)

      const txHash = await eth.request({
        method: 'eth_sendTransaction',
        params: [{
          from: accounts[0],
          to: RECIPIENT_ADDRESS,
          value: amountWei,
          gas: '0x5208',
        }],
      })

      setTxHash(txHash)
      setStatus('sent')
    } catch (err: any) {
      console.error(err)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-3">
        <input
          type="number"
          step="0.1"
          min="0.1"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-24 bg-line-bg border border-line-border px-3 py-2 font-mono text-sm text-line-text focus:outline-none focus:border-line-accent transition-colors"
        />
        <span className="font-mono text-sm text-line-muted">ETH</span>
        <button
          onClick={sendEth}
          disabled={status === 'pending' || status === 'sent'}
          className="btn-primary disabled:opacity-50"
        >
          {status === 'pending' ? 'Confirm in wallet...' : status === 'sent' ? 'Sent' : 'Send ETH'}
        </button>
      </div>
      <p className="font-mono text-[10px] text-line-muted tracking-widest">
        to {RECIPIENT}
      </p>
      {status === 'sent' && txHash && (
        <p className="font-mono text-[10px] text-line-accent tracking-widest">
          tx: <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="underline">{txHash.slice(0, 20)}...</a>
        </p>
      )}
      {status === 'error' && (
        <p className="font-mono text-[10px] text-red-400 tracking-widest">Transaction cancelled or failed</p>
      )}
    </div>
  )
}
