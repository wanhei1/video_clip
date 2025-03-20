import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Demo users for testing
const DEMO_USERS = [
  {
    id: "user-1",
    name: "Free User",
    email: "free@example.com",
    password: "password123",
    subscriptionTier: "free",
  },
  {
    id: "user-2",
    name: "Pro User",
    email: "pro@example.com",
    password: "password123",
    subscriptionTier: "pro",
  },
  {
    id: "user-3",
    name: "Team User",
    email: "team@example.com",
    password: "password123",
    subscriptionTier: "team",
  },
];

export const config = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user in demo users
        const user = DEMO_USERS.find(
          (user) =>
            user.email === credentials.email &&
            user.password === credentials.password
        );

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            subscriptionTier: user.subscriptionTier,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.subscriptionTier = user.subscriptionTier || "free";
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.subscriptionTier = token.subscriptionTier as string;
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: true,
};

export const { auth, signIn, signOut } = NextAuth(config);
