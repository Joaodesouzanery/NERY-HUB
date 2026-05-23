import Link from "next/link";
import { Nav } from "@/components/Nav";
import { getCurrentUser, hasActiveSubscription } from "@/lib/subscriptions";

export default async function AccountPage() {
  const user = await getCurrentUser();
  const active = await hasActiveSubscription(user?.id);

  return (
    <main className="shell light">
      <Nav mode="light" />
      <div className="container">
        <section className="page-hero">
          <h1 className="page-title">Minha Conta</h1>
        </section>
        <section className="section">
          {!user ? (
            <div className="locked">
              Você ainda não está autenticado. Entre com Supabase Auth para conectar assinatura e acesso.
              <br />
              <Link className="btn dark" href="/login" style={{ marginTop: 18 }}>
                Entrar
              </Link>
            </div>
          ) : (
            <div className="card">
              <p className="eyebrow">{user.email}</p>
              <h2>{active ? "Assinatura ativa" : "Sem assinatura ativa"}</h2>
              <p>
                {active
                  ? "Seu acesso completo ao portal de notícias está liberado."
                  : "Assine o plano mensal para liberar a base completa."}
              </p>
              <Link className="btn dark" href={active ? "/noticias" : "/pricing"}>
                {active ? "Acessar notícias" : "Assinar agora"}
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
