import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      subscriptionTier: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    subscriptionTier?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string
    subscriptionTier: string
  }
}

