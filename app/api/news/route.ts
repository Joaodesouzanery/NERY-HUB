import { NextResponse } from "next/server";
import { getArticles } from "@/lib/news";
import { getCurrentUser, hasActiveSubscription } from "@/lib/subscriptions";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const agency = url.searchParams.get("agency") ?? undefined;
  const user = await getCurrentUser();
  const subscriber = await hasActiveSubscription(user?.id);
  const articles = await getArticles({ agency, subscriber, limit: subscriber ? 100 : 6 });

  return NextResponse.json({ subscriber, articles });
}
