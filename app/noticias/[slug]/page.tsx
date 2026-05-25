import { notFound, redirect } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { PRODUCT_SOURCES, PRODUCTS, isProductCode, productSectors } from "@/lib/catalog";
import { getSubscriberArticles } from "@/lib/news";
import { getCurrentUser, hasActiveSubscription } from "@/lib/subscriptions";

export const dynamic = "force-dynamic";

type Search = { source?: string; sector?: string; contentType?: string; from?: string; to?: string; q?: string };

export default async function ProductNewsPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Search>;
}) {
  const { slug } = await params;
  if (!isProductCode(slug)) notFound();

  const user = await getCurrentUser();
  if (!user) redirect(`/login?message=${encodeURIComponent("Entre para acessar o feed de assinantes.")}`);
  if (!(await hasActiveSubscription(user.id, slug))) redirect(`/pricing?product=${slug}&access=required`);

  const filters = (await searchParams) ?? {};
  const articles = await getSubscriberArticles(slug, { ...filters, limit: 100 });

  return (
    <main className="product-view view-active">
      <Nav mode="light" />
      <header className="product-header">
        <div className="container product-header-row">
          <h1 className="page-title">{PRODUCTS[slug].feedTitle}</h1>
          <p className="product-description">Feed completo para assinantes com busca, histórico, filtros e acesso à fonte atribuída.</p>
        </div>
      </header>
      <section className="product-section">
        <div className="container">
          <form className="filters-form" action={`/noticias/${slug}`}>
            <input name="q" defaultValue={filters.q} placeholder="Buscar no feed" aria-label="Buscar no feed" />
            <select name="source" defaultValue={filters.source ?? ""} aria-label="Fonte">
              <option value="">Todas as fontes</option>
              {PRODUCT_SOURCES[slug].map((source) => <option value={source.code} key={source.code}>{source.code}</option>)}
            </select>
            <select name="sector" defaultValue={filters.sector ?? ""} aria-label="Setor">
              <option value="">Todos os setores</option>
              {productSectors(slug).map((sector) => <option value={sector} key={sector}>{sector}</option>)}
            </select>
            <select name="contentType" defaultValue={filters.contentType ?? ""} aria-label="Tipo de conteúdo">
              <option value="">Todos os tipos</option>
              <option value="noticia">Notícias</option>
              <option value="estudo">Estudos</option>
              <option value="indicador">Indicadores</option>
              <option value="ato_societario">Atos societários</option>
            </select>
            <input type="date" name="from" defaultValue={filters.from} aria-label="Data inicial" />
            <input type="date" name="to" defaultValue={filters.to} aria-label="Data final" />
            <button className="btn-dark" type="submit">Filtrar</button>
          </form>

          <div className="article-grid">
            {articles.map((article) => <ArticleCard article={article} product={slug} key={article.id} />)}
          </div>
        </div>
      </section>
      <Footer mode="light" />
    </main>
  );
}
