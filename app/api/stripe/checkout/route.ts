import { NextResponse } from "next/server";
import { isProductCode } from "@/lib/catalog";
import { createStripe, hasStripeEnv, priceForProduct } from "@/lib/stripe";
import { createServiceClient, hasSupabaseServiceEnv } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/subscriptions";

export async function POST(request: Request) {
  const formData = await request.formData();
  const product = String(formData.get("product") ?? "");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  if (!isProductCode(product)) {
    return NextResponse.json({ error: "A valid product is required." }, { status: 400 });
  }
  if (!hasStripeEnv || !hasSupabaseServiceEnv) {
    return NextResponse.redirect(`${siteUrl}/pricing?checkout=unavailable&product=${product}`, 303);
  }
  const user = await getCurrentUser();
  if (!user) return NextResponse.redirect(`${siteUrl}/login`, 303);

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
    line_items: [{ price: priceForProduct(product)!, quantity: 1 }],
    success_url: `${siteUrl}/account?checkout=success&product=${product}`,
    cancel_url: `${siteUrl}/pricing?checkout=cancelled&product=${product}`,
    metadata: { user_id: user.id, product_code: product },
    subscription_data: { metadata: { user_id: user.id, product_code: product } }
  });

  return NextResponse.redirect(session.url!, 303);
}
