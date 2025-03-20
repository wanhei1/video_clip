import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    proPriceId: process.env.STRIPE_PRO_PRICE_ID || "",
    teamPriceId: process.env.STRIPE_TEAM_PRICE_ID || "",
  })
}

