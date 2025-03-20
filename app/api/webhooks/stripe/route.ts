import { NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = headers().get("stripe-signature") || ""

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session
        // Handle successful payment
        await handleSuccessfulPayment(session)
        break
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        const subscription = event.data.object as Stripe.Subscription
        // Handle subscription updates
        await handleSubscriptionChange(subscription)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error handling webhook:", error)
    return NextResponse.json({ error: "Error handling webhook" }, { status: 500 })
  }
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  // Here you would typically:
  // 1. Verify the payment status
  // 2. Update your database to mark the user as a paid subscriber
  // 3. Grant access to premium features
  console.log("Payment successful for session:", session.id)

  // If you have a user ID in the metadata, you can use it to update your user record
  if (session.metadata?.userId) {
    // In a real app, you would update your database
    // For example, with Prisma:
    // await prisma.user.update({
    //   where: { id: session.metadata.userId },
    //   data: {
    //     subscriptionTier: session.metadata.tier || 'pro',
    //     stripeCustomerId: session.customer as string,
    //     subscriptionId: session.subscription as string,
    //   },
    // });
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const status = subscription.status
  const customerId = subscription.customer as string

  // Determine subscription tier based on the price ID
  let subscriptionTier = "free"
  if (subscription.items.data.length > 0) {
    const priceId = subscription.items.data[0].price.id
    if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
      subscriptionTier = "pro"
    } else if (priceId === process.env.STRIPE_TEAM_PRICE_ID) {
      subscriptionTier = "team"
    }
  }

  // Update subscription status in your database
  console.log(`Subscription ${subscription.id} for customer ${customerId} is now ${status}`)

  // In a real app, you would update your database
  // For example, with Prisma:
  // await prisma.user.update({
  //   where: { stripeCustomerId: customerId },
  //   data: {
  //     subscriptionTier: ['active', 'trialing'].includes(status) ? subscriptionTier : 'free',
  //     subscriptionStatus: status,
  //     subscriptionId: subscription.id,
  //   },
  // });
}

