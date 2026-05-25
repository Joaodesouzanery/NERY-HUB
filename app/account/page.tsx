import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { PRODUCTS, type ProductCode } from "@/lib/catalog";
import { getCurrentUser, getActiveProducts } from "@/lib/subscriptions";
import { hasSupabaseEnv } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();
  const activeProducts = await getActiveProducts(user?.id);

  return (
    <main className="product-view view-active">
      <Nav mode="light" />
      <header className="product-header">
        <div className="container product-header-row">
          <h1 className="page-title">Minha Conta</h1>
          <p className="product-description">Gerencie os acessos independentes aos portais NERY.</p>
        </div>
      </header>
      <section className="product-section">
        <div className="container">
          {!hasSupabaseEnv ? (
            <div className="access-panel">
              <h2>Área em preparação</h2>
              <p>Login e gestão de assinaturas serão habilitados quando a infraestrutura segura do portal estiver configurada.</p>
              <Link className="link-underline" href="/privacidade">Consultar política de privacidade</Link>
            </div>
          ) : !user ? (
            <div className="access-panel">
              <h2>Acesso necessário</h2>
              <p>Entre por e-mail para conectar suas assinaturas e abrir os feeds contratados.</p>
              <Link className="btn-dark" href="/login">Entrar</Link>
              <p className="legal-note">Consulte a <Link className="link-underline" href="/privacidade">Política de Privacidade</Link> antes de acessar.</p>
            </div>
          ) : (
            <>
              <p className="account-email">{user.email}</p>
              <div className="entitlement-grid">
                {(["regulatorio", "saneamento"] as ProductCode[]).map((product) => {
                  const active = activeProducts.includes(product);
                  return (
                    <article className="access-panel" key={product}>
                      <p className="eyebrow">{PRODUCTS[product].name}</p>
                      <h2>{active ? "Assinatura ativa" : "Sem assinatura ativa"}</h2>
                      <p>{active ? "Seu acesso ao feed completo está liberado." : "Assine este portal para liberar notícias, filtros e histórico."}</p>
                      <Link className="btn-dark" href={active ? `/noticias/${product}` : `/pricing?product=${product}`}>
                        {active ? "Acessar feed" : "Assinar agora"}
                      </Link>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
      <Footer mode="light" />
    </main>
  );
}
