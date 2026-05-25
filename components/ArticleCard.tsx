import Link from "next/link";
import Image from "next/image";
import type { PublicTeaser, SubscriberArticle } from "@/lib/news";
import type { ProductCode } from "@/lib/catalog";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));
}

export function PublicTeaserCard({ article, href = "/" }: { article: PublicTeaser; href?: string }) {
  return (
    <Link className="post-card" href={href}>
      <div className="post-thumb"><div className="post-thumb-inner" /></div>
      <div className="post-meta-sm"><strong>{article.sourceCode}</strong><span>{formatDate(article.publishedAt)}</span></div>
      <h3 className="post-title">{article.title}</h3>
    </Link>
  );
}

export function ArticleCard({ article, product }: { article: SubscriberArticle; product: ProductCode }) {
  return (
    <article className="article-card">
      <div className="article-visual">
        {article.imageUrl ? <Image src={article.imageUrl} alt="" width={640} height={360} /> : <span>{article.sourceCode}</span>}
      </div>
      <div className="tagline">
        <span className="tag">{article.sourceCode}</span>
        <span className="tag">{article.contentType}</span>
        <span className="tag">{formatDate(article.publishedAt)}</span>
      </div>
      <h3>{article.contentMode === "original_allowed" ? article.titleOriginal : article.titleNery}</h3>
      <p>{article.summary}</p>
      <Link className="btn-outline" href={`/noticias/${product}/${article.slug}`}>Ler notícia</Link>
    </article>
  );
}
