import { betterAuth } from "better-auth"
import { Kysely } from "kysely"
import { NeonDialect } from "kysely-neon"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

// Create Kysely instance with Neon dialect
// BetterAuth supports Kysely directly with Neon through kysely-neon
const db = new Kysely<any>({
  dialect: new NeonDialect({
    connectionString: process.env.DATABASE_URL,
  }),
})

export const auth = betterAuth({
  database: db,
  emailAndPassword: {
    enabled: false,
  },
  magicLink: {
    enabled: true,
    sendVerificationEmail: async ({ user, url }) => {
      // In production, you'd send an email here using a service like Resend
      // For now, we'll log it to console
      console.log("Magic link for", user.email, ":", url)
      return { success: true }
    },
  },
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  basePath: "/api/auth",
  secret: process.env.BETTER_AUTH_SECRET || "change-this-secret-in-production",
})

export type Session = typeof auth.$Infer.Session

