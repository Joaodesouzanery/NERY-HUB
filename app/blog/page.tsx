import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { Nav } from "@/components/Nav";
import { REGULATORY_AGENCIES } from "@/lib/agencies";
import { getArticles } from "@/lib/news";

export default async function BlogPage() {
  const articles = await getArticles({ limit: 6 });

  return (
    <main className="shell light">
      <Nav mode="light" blogLabel />
      <div className="container">
        <section className="page-hero">
          <div className="page-hero-row">
            <h1 className="page-title">Nery Blog</h1>
            <p className="muted">
              Vitrine pública de inteligência regulatória. Assinantes acessam a base completa, filtros e histórico.
            </p>
          </div>
        </section>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="eyebrow">Produto em destaque</p>
              <h2>Portal de Notícias Regulatórias</h2>
            </div>
            <Link className="btn dark" href="/pricing">
              Assinar acesso completo
            </Link>
          </div>
          <div className="locked">
            Agregamos informações públicas e sempre direcionamos para a fonte oficial. Textos integrais e imagens só
            são republicados quando houver permissão clara; nos demais casos, usamos resumo editorial e link oficial.
          </div>
          <div className="grid">
            {articles.map((article) => (
              <ArticleCard article={article} key={article.id} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Fontes monitoradas</h2>
            <p className="muted">MVP com as 11 agências reguladoras federais clássicas.</p>
          </div>
          <div className="grid">
            {REGULATORY_AGENCIES.map((agency) => (
              <article className="card" key={agency.code}>
                <div className="tagline">
                  <span className="tag">{agency.code}</span>
                  <span className="tag">{agency.sector}</span>
                </div>
                <h3>{agency.name}</h3>
                <p>Fonte oficial gov.br cadastrada para ingestão diária.</p>
                <a className="btn" href={agency.newsUrl} target="_blank" rel="noreferrer">
                  Fonte oficial
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
