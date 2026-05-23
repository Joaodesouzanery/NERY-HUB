import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createStripe } from "@/lib/stripe";
import { createServiceClient, hasSupabaseServiceEnv } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET || !hasSupabaseServiceEnv) {
    return NextResponse.json({ error: "Webhook env vars are not configured." }, { status: 503 });
  }

  const stripe = createStripe();
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing stripe signature." }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  const supabase = createServiceClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    if (userId && session.customer) {
      await supabase.from("profiles").upsert({
        id: userId,
        email: session.customer_details?.email,
        stripe_customer_id: String(session.customer)
      });
    }
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = String(subscription.customer);
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle();

    if (profile?.id) {
      await supabase.from("subscriptions").upsert({
        user_id: profile.id,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
      });
    }
  }

  return NextResponse.json({ received: true });
}
