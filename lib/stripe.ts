import Stripe from "stripe";
import type { ProductCode } from "./catalog";

export const hasStripeEnv =
  Boolean(process.env.STRIPE_SECRET_KEY) &&
  Boolean(process.env.STRIPE_REGULATORIO_PRICE_ID) &&
  Boolean(process.env.STRIPE_SANEAMENTO_PRICE_ID) &&
  Boolean(process.env.NEXT_PUBLIC_SITE_URL);

export function priceForProduct(product: ProductCode) {
  return product === "regulatorio"
    ? process.env.STRIPE_REGULATORIO_PRICE_ID
    : process.env.STRIPE_SANEAMENTO_PRICE_ID;
}

export function productForPrice(priceId?: string | null): ProductCode | null {
  if (priceId && priceId === process.env.STRIPE_REGULATORIO_PRICE_ID) return "regulatorio";
  if (priceId && priceId === process.env.STRIPE_SANEAMENTO_PRICE_ID) return "saneamento";
  return null;
}

export function createStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Missing STRIPE_SECRET_KEY.");
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" });
}
