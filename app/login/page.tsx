import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { hasSupabaseEnv } from "@/lib/supabase/server";

export default async function LoginPage({ searchParams }: { searchParams?: Promise<{ message?: string }> }) {
  const params = await searchParams;

  return (
    <main className="product-view view-active">
      <Nav mode="light" />
      <header className="product-header">
        <div className="container product-header-row">
          <h1 className="page-title">Entrar</h1>
          <p className="product-description">
            {hasSupabaseEnv
              ? "Use seu e-mail para receber o link seguro de acesso à assinatura NERY."
              : "O acesso seguro por e-mail será disponibilizado na abertura dos portais."}
          </p>
        </div>
      </header>
      <section className="product-section">
        <div className="container">
          {params?.message ? <p className="message">{params.message}</p> : null}
          {hasSupabaseEnv ? (
            <form className="auth-form" action="/api/auth/login" method="post">
              <input type="email" name="email" placeholder="seu@email.com" required />
              <button className="btn-dark" type="submit">Enviar link de acesso</button>
            </form>
          ) : (
            <p className="message">O acesso por e-mail está em preparação e será habilitado com a abertura dos portais.</p>
          )}
          <p className="legal-note">
            Ao utilizar uma conta NERY, seus dados serão tratados conforme nossa <Link className="link-underline" href="/privacidade">Política de Privacidade</Link>.
          </p>
        </div>
      </section>
      <Footer mode="light" />
    </main>
  );
}
