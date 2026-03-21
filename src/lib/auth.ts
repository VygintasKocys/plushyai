import { polar, checkout, portal, webhooks } from "@polar-sh/better-auth"
import { Polar } from "@polar-sh/sdk"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { admin } from "better-auth/plugins"
import { eq, sql } from "drizzle-orm"
import { db } from "./db"
import { PRICING_PLANS } from "./mock-data"
import { user } from "./schema"
import * as schema from "./schema"

const polarClient = process.env.POLAR_ACCESS_TOKEN
  ? new Polar({
      accessToken: process.env.POLAR_ACCESS_TOKEN,
      server: (process.env.POLAR_ENVIRONMENT as "sandbox" | "production") || "sandbox",
    })
  : null

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      // Log password reset URL to terminal (no email integration yet)
      // eslint-disable-next-line no-console
      console.log(`\n${"=".repeat(60)}\nPASSWORD RESET REQUEST\nUser: ${user.email}\nReset URL: ${url}\n${"=".repeat(60)}\n`)
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      // Log verification URL to terminal (no email integration yet)
      // eslint-disable-next-line no-console
      console.log(`\n${"=".repeat(60)}\nEMAIL VERIFICATION\nUser: ${user.email}\nVerification URL: ${url}\n${"=".repeat(60)}\n`)
    },
  },
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        socialProviders: {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        },
      }
    : {}),
  plugins: [
    admin(),
    ...(polarClient
      ? [
          polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
              checkout({
                products: PRICING_PLANS.map((plan) => ({
                  productId: plan.polarProductId,
                  slug: plan.id,
                })),
                successUrl: "/success?checkout_id={CHECKOUT_ID}",
                authenticatedUsersOnly: true,
              }),
              portal(),
              webhooks({
                secret: process.env.POLAR_WEBHOOK_SECRET!,
                onOrderPaid: async (payload) => {
                  // eslint-disable-next-line no-console
                  console.log(`[Polar] onOrderPaid fired`, JSON.stringify({
                    productId: payload.data.productId,
                    externalId: payload.data.customer?.externalId,
                    customerId: payload.data.customerId,
                  }))

                  const externalId = payload.data.customer?.externalId
                  if (!externalId) {
                    // eslint-disable-next-line no-console
                    console.log(`[Polar] No externalId found, skipping credit update`)
                    return
                  }

                  const productId = payload.data.productId
                  const plan = PRICING_PLANS.find((p) => p.polarProductId === productId)
                  if (!plan) {
                    // eslint-disable-next-line no-console
                    console.log(`[Polar] No matching plan for productId: ${productId}`)
                    return
                  }

                  await db
                    .update(user)
                    .set({ credits: sql`${user.credits} + ${plan.credits}` })
                    .where(eq(user.id, externalId))
                  // eslint-disable-next-line no-console
                  console.log(`[Polar] Added ${plan.credits} credits for user ${externalId}`)
                },
                onSubscriptionCanceled: async (payload) => {
                  // No credit removal — user retains credits until billing period ends
                  // eslint-disable-next-line no-console
                  console.log(`[Polar] Subscription canceled for customer ${payload.data.customer?.externalId ?? "unknown"}`)
                },
                onSubscriptionRevoked: async (payload) => {
                  // Subscription fully ended — log for observability, credits remain as-is for graceful degradation
                  // eslint-disable-next-line no-console
                  console.log(`[Polar] Subscription revoked for customer ${payload.data.customer?.externalId ?? "unknown"}`)
                },
              }),
            ],
          }),
        ]
      : []),
  ],
})