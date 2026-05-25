import { NextResponse } from "next/server";
import { isProductCode } from "@/lib/catalog";
import { getSubscriberArticles } from "@/lib/news";
import { getCurrentUser, hasActiveSubscription } from "@/lib/subscriptions";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const url = new URL(request.url);
  const product = url.searchParams.get("product");
  if (!product || !isProductCode(product)) {
    return NextResponse.json({ error: "A valid product is required." }, { status: 400 });
  }
  if (!(await hasActiveSubscription(user.id, product))) {
    return NextResponse.json({ error: "Active subscription required for this product." }, { status: 403 });
  }

  const articles = await getSubscriberArticles(product, {
    source: url.searchParams.get("source") ?? undefined,
    sector: url.searchParams.get("sector") ?? undefined,
    contentType: url.searchParams.get("contentType") ?? undefined,
    from: url.searchParams.get("from") ?? undefined,
    to: url.searchParams.get("to") ?? undefined,
    q: url.searchParams.get("q") ?? undefined,
    limit: 100
  });
  return NextResponse.json({ product, articles });
}
