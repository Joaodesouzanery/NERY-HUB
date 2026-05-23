import Stripe from "stripe";

export const hasStripeEnv =
  Boolean(process.env.STRIPE_SECRET_KEY) &&
  Boolean(process.env.STRIPE_MONTHLY_PRICE_ID) &&
  Boolean(process.env.NEXT_PUBLIC_SITE_URL);

export function createStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Missing STRIPE_SECRET_KEY.");
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" });
}
