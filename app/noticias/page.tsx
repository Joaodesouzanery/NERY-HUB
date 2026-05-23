import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { Nav } from "@/components/Nav";
import { REGULATORY_AGENCIES } from "@/lib/agencies";
import { getArticles } from "@/lib/news";
import { getCurrentUser, hasActiveSubscription } from "@/lib/subscriptions";

export default async function NewsPage({
  searchParams
}: {
  searchParams?: Promise<{ agency?: string }>;
}) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const active = await hasActiveSubscription(user?.id);
  const articles = await getArticles({ agency: params?.agency, subscriber: active, limit: active ? 100 : 3 });

  return (
    <main className="shell light">
      <Nav mode="light" />
      <div className="container">
        <section className="page-hero">
          <div className="page-hero-row">
            <h1 className="page-title">Notícias Regulatórias</h1>
            <p className="muted">
              {active
                ? "Base completa liberada para assinantes."
                : "Prévia pública. Assine para ver a base completa e todos os filtros."}
            </p>
          </div>
        </section>

        <section className="section">
          {!active ? (
            <div className="locked">
              Esta área mostra apenas uma amostra pública. A assinatura mensal libera todas as notícias coletadas,
              filtros e histórico.
              <br />
              <Link className="btn dark" href="/pricing" style={{ marginTop: 18 }}>
                Assinar acesso completo
              </Link>
            </div>
          ) : null}

          <div className="filters">
            <Link href="/noticias">Todas</Link>
            {REGULATORY_AGENCIES.map((agency) => (
              <Link href={`/noticias?agency=${agency.code}`} key={agency.code}>
                {agency.code}
              </Link>
            ))}
          </div>

          <div className="grid">
            {articles.map((article) => (
              <ArticleCard article={article} key={article.id} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
