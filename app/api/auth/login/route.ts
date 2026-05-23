import { NextResponse } from "next/server";
import { createBrowserAwareServerClient, hasSupabaseEnv } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  if (!hasSupabaseEnv) {
    return NextResponse.redirect(
      `${siteUrl}/login?message=${encodeURIComponent("Supabase ainda não está configurado neste ambiente.")}`,
      303
    );
  }

  const supabase = await createBrowserAwareServerClient();
  const { error } = await supabase!.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${siteUrl}/auth/callback` }
  });

  const message = error
    ? "Não foi possível enviar o link de acesso."
    : "Enviamos um link mágico para o seu e-mail.";

  return NextResponse.redirect(`${siteUrl}/login?message=${encodeURIComponent(message)}`, 303);
}
