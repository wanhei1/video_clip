import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { priceId, successUrl, cancelUrl } = body

    if (!priceId) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 })
    }

    // Initialize Stripe with your secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2023-10-16",
    })

    try {
      // Create a checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url:
          successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
      })

      return NextResponse.json({ sessionId: session.id, url: session.url })
    } catch (stripeError: any) {
      console.error("Stripe error:", stripeError)
      return NextResponse.json({ error: `Stripe error: ${stripeError.message}` }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: `Error creating checkout session: ${error.message}` }, { status: 500 })
  }
}

