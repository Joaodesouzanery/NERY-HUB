import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { PRODUCTS, isProductCode } from "@/lib/catalog";
import { getSubscriberArticleBySlug } from "@/lib/news";
import { getCurrentUser, hasActiveSubscription } from "@/lib/subscriptions";

export const dynamic = "force-dynamic";

export default async function ArticlePage({
  params
}: {
  params: Promise<{ slug: string; articleSlug: string }>;
}) {
  const { slug, articleSlug } = await params;
  if (!isProductCode(slug)) notFound();

  const user = await getCurrentUser();
  if (!user) redirect(`/login?message=${encodeURIComponent("Entre para acessar esta notícia.")}`);
  if (!(await hasActiveSubscription(user.id, slug))) redirect(`/pricing?product=${slug}&access=required`);

  const article = await getSubscriberArticleBySlug(slug, articleSlug);
  if (!article) notFound();
  const heading = article.contentMode === "original_allowed" ? article.titleOriginal : article.titleNery;

  return (
    <main className="product-view view-active">
      <Nav mode="light" />
      <div className="container">
        <article className="article-detail">
          <div className="tagline">
            <span className="tag">{PRODUCTS[slug].shortName}</span>
            <span className="tag">{article.sourceName}</span>
            <span className="tag">{new Intl.DateTimeFormat("pt-BR").format(new Date(article.publishedAt))}</span>
          </div>
          <h1>{heading}</h1>
          {article.contentMode === "original_allowed" && article.subtitleOriginal ? (
            <p className="subtitle">{article.subtitleOriginal}</p>
          ) : null}
          <p className="article-summary">{article.summary}</p>
          <p className="notice">
            Conteúdo agregado com atribuição. Textos e imagens originais só são exibidos quando a permissão da fonte estiver registrada; o link abaixo leva à publicação oficial.
          </p>
          <div className="detail-actions">
            <a className="btn-dark" href={article.officialUrl} target="_blank" rel="noreferrer">Abrir fonte oficial</a>
            <Link className="btn-light" href={`/noticias/${slug}`}>Voltar ao feed</Link>
          </div>
        </article>
      </div>
      <Footer mode="light" />
    </main>
  );
}
