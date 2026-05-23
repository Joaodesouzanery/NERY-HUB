import { NextResponse } from "next/server";
import { createStripe, hasStripeEnv } from "@/lib/stripe";
import { createServiceClient, hasSupabaseServiceEnv } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/subscriptions";

export async function POST(request: Request) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  const user = await getCurrentUser();

  if (!user) return NextResponse.redirect(`${siteUrl}/login`, 303);

  if (!hasStripeEnv || !hasSupabaseServiceEnv) {
    return NextResponse.json(
      { error: "Stripe/Supabase env vars are required before checkout can run." },
      { status: 503 }
    );
  }

  const supabase = createServiceClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  const stripe = createStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: profile?.stripe_customer_id ?? undefined,
    customer_email: profile?.stripe_customer_id ? undefined : user.email ?? undefined,
    line_items: [{ price: process.env.STRIPE_MONTHLY_PRICE_ID!, quantity: 1 }],
    success_url: `${siteUrl}/account?checkout=success`,
    cancel_url: `${siteUrl}/pricing?checkout=cancelled`,
    metadata: { user_id: user.id }
  });

  return NextResponse.redirect(session.url!, 303);
}
