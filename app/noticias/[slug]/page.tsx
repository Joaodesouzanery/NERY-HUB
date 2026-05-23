import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { getArticleBySlug } from "@/lib/news";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <main className="shell light">
      <Nav mode="light" />
      <div className="container">
        <article className="article-detail">
          <div className="tagline">
            <span className="tag">{article.agency}</span>
            <span className="tag">{article.sourceName}</span>
            <span className="tag">{new Intl.DateTimeFormat("pt-BR").format(new Date(article.publishedAt))}</span>
          </div>
          <h1>{article.titleNery}</h1>
          <p className="article-summary">{article.summary}</p>
          <p className="notice">
            Política editorial: este conteúdo é uma agregação com atribuição. Texto integral e imagem original só são
            exibidos quando houver permissão clara; caso contrário, mantemos resumo próprio e link oficial.
          </p>
          <div className="hero-actions" style={{ marginTop: 28 }}>
            <a className="btn dark" href={article.officialUrl} target="_blank" rel="noreferrer">
              Abrir fonte oficial
            </a>
            <Link className="btn" href="/noticias">
              Voltar
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
