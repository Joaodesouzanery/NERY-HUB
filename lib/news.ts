import { REGULATORY_AGENCIES, type AgencyCode } from "./agencies";
import { createServiceClient, hasSupabaseEnv } from "./supabase/server";

export type Article = {
  id: string;
  slug: string;
  agency: AgencyCode;
  sourceName: string;
  titleOriginal: string;
  titleNery: string;
  summary: string;
  officialUrl: string;
  imageUrl: string | null;
  publishedAt: string;
  tags: string[];
  contentMode: "summary" | "original_allowed";
  status: "published" | "needs_review";
};

export const FALLBACK_ARTICLES: Article[] = [
  {
    id: "ana-saneamento-regulacao-referencia",
    slug: "ana-saneamento-regulacao-referencia",
    agency: "ANA",
    sourceName: "gov.br/ANA",
    titleOriginal: "Monitoramento regulatório do saneamento ganha nova camada de acompanhamento",
    titleNery: "ANA concentra novas movimentações de referência para saneamento básico",
    summary:
      "Resumo editorial NERY: acompanhe atos, consultas e notícias oficiais da ANA com foco em saneamento, segurança hídrica e regulação infranacional.",
    officialUrl: REGULATORY_AGENCIES[0].newsUrl,
    imageUrl: null,
    publishedAt: "2026-05-20T09:00:00.000Z",
    tags: ["Saneamento", "ANA", "Regulação"],
    contentMode: "summary",
    status: "published"
  },
  {
    id: "aneel-agenda-regulatoria",
    slug: "aneel-agenda-regulatoria",
    agency: "ANEEL",
    sourceName: "gov.br/ANEEL",
    titleOriginal: "Atualizações regulatórias no setor elétrico",
    titleNery: "ANEEL sinaliza temas de acompanhamento para operações intensivas em energia",
    summary:
      "Resumo editorial NERY: notícia agregada com link oficial para apoiar equipes jurídicas, técnicas e comerciais no monitoramento do setor elétrico.",
    officialUrl: REGULATORY_AGENCIES.find((agency) => agency.code === "ANEEL")!.newsUrl,
    imageUrl: null,
    publishedAt: "2026-05-18T16:00:00.000Z",
    tags: ["Energia", "ANEEL", "Agenda regulatória"],
    contentMode: "summary",
    status: "published"
  },
  {
    id: "anvisa-alertas-regulatorios",
    slug: "anvisa-alertas-regulatorios",
    agency: "ANVISA",
    sourceName: "gov.br/ANVISA",
    titleOriginal: "Notícias e alertas regulatórios da vigilância sanitária",
    titleNery: "ANVISA mantém empresas atentas a riscos, normas e comunicados oficiais",
    summary:
      "Resumo editorial NERY: centralização de novidades da vigilância sanitária para quem precisa acompanhar decisões oficiais sem perder contexto.",
    officialUrl: REGULATORY_AGENCIES.find((agency) => agency.code === "ANVISA")!.newsUrl,
    imageUrl: null,
    publishedAt: "2026-05-15T22:00:00.000Z",
    tags: ["Saúde", "ANVISA", "Compliance"],
    contentMode: "summary",
    status: "published"
  }
];

type ArticleRow = {
  id: string;
  slug: string;
  agency: AgencyCode;
  source_name: string | null;
  title_original: string;
  title_nery: string | null;
  summary: string;
  official_url: string;
  image_url: string | null;
  published_at: string;
  tags: string[] | null;
  content_mode: "summary" | "original_allowed";
  status: "published" | "needs_review";
};

function mapRow(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    agency: row.agency,
    sourceName: row.source_name ?? `gov.br/${row.agency}`,
    titleOriginal: row.title_original,
    titleNery: row.title_nery ?? row.title_original,
    summary: row.summary,
    officialUrl: row.official_url,
    imageUrl: row.image_url,
    publishedAt: row.published_at,
    tags: row.tags ?? [],
    contentMode: row.content_mode,
    status: row.status
  };
}

export async function getArticles(options: { limit?: number; agency?: string; subscriber?: boolean } = {}) {
  if (!hasSupabaseEnv) {
    return filterFallback(options).slice(0, options.limit ?? FALLBACK_ARTICLES.length);
  }

  const supabase = createServiceClient();
  let query = supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (options.agency) query = query.eq("agency", options.agency);
  if (!options.subscriber) query = query.limit(options.limit ?? 6);
  else if (options.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error || !data?.length) {
    return filterFallback(options).slice(0, options.limit ?? FALLBACK_ARTICLES.length);
  }

  return (data as ArticleRow[]).map(mapRow);
}

export async function getArticleBySlug(slug: string) {
  if (!hasSupabaseEnv) return FALLBACK_ARTICLES.find((article) => article.slug === slug) ?? null;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return FALLBACK_ARTICLES.find((article) => article.slug === slug) ?? null;
  return mapRow(data as ArticleRow);
}

function filterFallback(options: { agency?: string }) {
  return FALLBACK_ARTICLES.filter((article) => !options.agency || article.agency === options.agency);
}
