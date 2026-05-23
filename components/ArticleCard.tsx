import Link from "next/link";
import type { Article } from "@/lib/news";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="card">
      <div className="tagline">
        <span className="tag">{article.agency}</span>
        <span className="tag">{new Intl.DateTimeFormat("pt-BR").format(new Date(article.publishedAt))}</span>
      </div>
      <h3>{article.titleNery}</h3>
      <p>{article.summary}</p>
      <Link className="btn" href={`/noticias/${article.slug}`}>
        Ler análise
      </Link>
    </article>
  );
}
