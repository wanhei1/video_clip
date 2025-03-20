export const env = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
  STRIPE_PRO_PRICE_ID: process.env.STRIPE_PRO_PRICE_ID || "",
  STRIPE_TEAM_PRICE_ID: process.env.STRIPE_TEAM_PRICE_ID || "",
}

