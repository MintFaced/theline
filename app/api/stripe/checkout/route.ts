// app/api/stripe/checkout/route.ts
// Creates a Stripe Checkout session for the $10/month subscription
// Requires env vars: STRIPE_SECRET_KEY, STRIPE_PRICE_ID

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const priceId   = process.env.STRIPE_PRICE_ID
  const appUrl    = process.env.NEXT_PUBLIC_APP_URL ?? 'https://theline.nz'

  if (!stripeKey || !priceId) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const { email } = body

    const params = new URLSearchParams({
      'mode': 'subscription',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      'success_url': `${appUrl}/join/success?session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url': `${appUrl}/join`,
      'allow_promotion_codes': 'true',
    })

    if (email) params.append('customer_email', email)

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    if (!res.ok) {
      const err = await res.json()
      console.error('Stripe error:', err)
      return NextResponse.json({ error: err.error?.message ?? 'Stripe error' }, { status: 400 })
    }

    const session = await res.json()
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }
}
