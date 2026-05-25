import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { isProductCode, type ProductCode } from "@/lib/catalog";
import { createStripe, productForPrice } from "@/lib/stripe";
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
  const inserted = await supabase.from("stripe_events").insert({
    stripe_event_id: event.id,
    event_type: event.type
  });

  if (inserted.error?.code === "23505") {
    const { data: prior } = await supabase
      .from("stripe_events")
      .select("processed_at")
      .eq("stripe_event_id", event.id)
      .maybeSingle();
    if (prior?.processed_at) return NextResponse.json({ received: true, duplicate: true });
  } else if (inserted.error) {
    return NextResponse.json({ error: inserted.error.message }, { status: 500 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      await processCheckout(event.data.object as Stripe.Checkout.Session);
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      await processSubscription(event.data.object as Stripe.Subscription);
    }

    await supabase
      .from("stripe_events")
      .update({ processed_at: new Date().toISOString(), last_error: null })
      .eq("stripe_event_id", event.id);
  } catch (error) {
    await supabase
      .from("stripe_events")
      .update({ last_error: error instanceof Error ? error.message : String(error) })
      .eq("stripe_event_id", event.id);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function processCheckout(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  if (!userId || !session.customer) return;

  const supabase = createServiceClient();
  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    email: session.customer_details?.email,
    stripe_customer_id: String(session.customer),
    updated_at: new Date().toISOString()
  }, { onConflict: "id" });
  if (error) throw new Error(error.message);
}

async function processSubscription(subscription: Stripe.Subscription) {
  const supabase = createServiceClient();
  const customerId = String(subscription.customer);
  const existing = await supabase
    .from("subscriptions")
    .select("user_id,product_code")
    .eq("stripe_subscription_id", subscription.id)
    .maybeSingle();
  if (existing.error) throw new Error(existing.error.message);

  let userId = subscription.metadata?.user_id ?? existing.data?.user_id;
  if (!userId) {
    const profile = await supabase.from("profiles").select("id").eq("stripe_customer_id", customerId).maybeSingle();
    if (profile.error) throw new Error(profile.error.message);
    userId = profile.data?.id;
  }

  const metadataProduct = subscription.metadata?.product_code;
  const product: ProductCode | null =
    metadataProduct && isProductCode(metadataProduct)
      ? metadataProduct
      : existing.data?.product_code as ProductCode | undefined
        ?? productForPrice(subscription.items.data[0]?.price.id);

  if (!userId || !product) throw new Error("Could not resolve subscription user or product.");

  const profile = await supabase.from("profiles").upsert({
    id: userId,
    stripe_customer_id: customerId,
    updated_at: new Date().toISOString()
  }, { onConflict: "id" });
  if (profile.error) throw new Error(profile.error.message);

  const saved = await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      product_code: product,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      stripe_price_id: subscription.items.data[0]?.price.id ?? null,
      status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString()
    },
    { onConflict: "stripe_subscription_id" }
  );
  if (saved.error) throw new Error(saved.error.message);
}
