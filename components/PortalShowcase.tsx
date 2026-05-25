import Link from "next/link";
import { PublicTeaserCard } from "@/components/ArticleCard";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { PRODUCT_SOURCES, PRODUCTS, type ProductCode } from "@/lib/catalog";
import { getPublicTeasers } from "@/lib/news";
import { hasStripeEnv } from "@/lib/stripe";
import { hasSupabaseServiceEnv } from "@/lib/supabase/server";

export async function PortalShowcase({ product }: { product: ProductCode }) {
  const details = PRODUCTS[product];
  const sources = PRODUCT_SOURCES[product];
  const dataReady = hasSupabaseServiceEnv;
  const commerceReady = dataReady && hasStripeEnv;
  const teasers = dataReady ? await getPublicTeasers(product, 3) : [];
  const descriptor = product === "regulatorio" ? "12 Agências Federais" : "Saneamento e Mercado";

  return (
    <main className="blog-view view-active">
      <Nav mode="light" blogLabel />
      <div className="blog-subnav">
        <div className="container blog-subnav-inner">
          <span className="active">{details.shortName}</span>
          <span>{descriptor}</span>
          <span>{dataReady ? "Fontes em validação" : "Pré-lançamento"}</span>
          <span>{commerceReady ? "Feed para assinantes" : "Acesso em preparação"}</span>
        </div>
      </div>

      <div className="container">
        <header className="blog-hero">
          <h1 className="blog-hero-title">{details.shortName}</h1>
          <p className="blog-hero-desc">{details.description}</p>
        </header>

        <section className="blog-featured">
          <div className="featured-grid">
            <div className="featured-thumb">
              <div className="featured-thumb-inner portal-mark">NERY / {product.toUpperCase()}</div>
            </div>
            <div>
              <div className="featured-meta"><strong>Portal em destaque</strong><span>Assinatura mensal</span></div>
              <h2 className="featured-headline">{details.name}</h2>
              <p className="featured-excerpt">
                {commerceReady
                  ? "Feed completo com pesquisa, filtros, histórico e acesso direto às publicações atribuídas."
                  : "Portal em preparação. O acesso pago e a coleta de publicações serão liberados após a configuração e validação das fontes."}
              </p>
              <div className="feature-actions">
                <Link className="btn-dark" href={`/pricing?product=${product}`}>{commerceReady ? "Assinar acesso" : "Acompanhar lançamento"}</Link>
                {commerceReady ? <Link className="btn-light" href={`/noticias/${product}`}>Entrar no feed</Link> : null}
              </div>
            </div>
          </div>
        </section>

        {teasers.length ? <section className="blog-cat">
          <div className="cat-header">
            <h2>Chamadas recentes</h2>
            <Link className="cat-link" href={`/pricing?product=${product}`}>Acessar o feed completo</Link>
          </div>
          <div className="posts-grid">
            {teasers.map((article) => (
              <PublicTeaserCard article={article} href={`/pricing?product=${product}`} key={article.id} />
            ))}
          </div>
        </section> : null}

        <section className="blog-cat sources-band">
          <div className="cat-header">
            <h2>Fontes previstas</h2>
            <p className="cat-note">A coleta será ativada após validação técnica e editorial.</p>
          </div>
          <div className="agency-grid">
            {sources.map((source) => (
              <div className="agency-row" key={source.code}>
                <strong>{source.code}</strong>
                <span>{source.name}</span>
                <small>{source.sector}</small>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer mode="light" />
    </main>
  );
}
