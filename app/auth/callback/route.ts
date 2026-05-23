import { NextResponse } from "next/server";
import { createBrowserAwareServerClient, hasSupabaseEnv } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code && hasSupabaseEnv) {
    const supabase = await createBrowserAwareServerClient();
    await supabase!.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL("/account", request.url));
}
