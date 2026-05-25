import type { ProductCode } from "./catalog";
import { createServiceClient, hasSupabaseServiceEnv } from "./supabase/server";

export type PublicTeaser = {
  id: string;
  product: ProductCode;
  sourceCode: string;
  sourceName: string;
  title: string;
  publishedAt: string;
};

export type SubscriberArticle = {
  id: string;
  slug: string;
  productCodes: ProductCode[];
  sourceCode: string;
  sourceName: string;
  sector: string;
  contentType: string;
  titleOriginal: string;
  subtitleOriginal: string | null;
  titleNery: string;
  summary: string;
  officialUrl: string;
  imageUrl: string | null;
  imageCredit: string | null;
  publishedAt: string;
  tags: string[];
  contentMode: "summary" | "original_allowed";
};

export type NewsFilters = {
  source?: string;
  sector?: string;
  contentType?: string;
  from?: string;
  to?: string;
  q?: string;
  limit?: number;
};

type ArticleRow = {
  id: string;
  slug: string;
  product_codes: ProductCode[];
  source_code: string;
  source_name: string;
  sector: string;
  content_type: string;
  title_original: string;
  subtitle_original: string | null;
  title_nery: string | null;
  summary: string;
  official_url: string;
  image_url: string | null;
  image_credit: string | null;
  published_at: string;
  tags: string[] | null;
  content_mode: "summary" | "original_allowed";
};

function mapRow(row: ArticleRow): SubscriberArticle {
  return {
    id: row.id,
    slug: row.slug,
    productCodes: row.product_codes,
    sourceCode: row.source_code,
    sourceName: row.source_name,
    sector: row.sector,
    contentType: row.content_type,
    titleOriginal: row.title_original,
    subtitleOriginal: row.subtitle_original,
    titleNery: row.title_nery ?? row.title_original,
    summary: row.summary,
    officialUrl: row.official_url,
    imageUrl: row.image_url,
    imageCredit: row.image_credit,
    publishedAt: row.published_at,
    tags: row.tags ?? [],
    contentMode: row.content_mode
  };
}

export async function getPublicTeasers(product: ProductCode, limit = 3): Promise<PublicTeaser[]> {
  if (!hasSupabaseServiceEnv) return [];

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("articles")
    .select("id,source_code,source_name,title_original,published_at")
    .contains("product_codes", [product])
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id,
    product,
    sourceCode: row.source_code,
    sourceName: row.source_name,
    title: row.title_original,
    publishedAt: row.published_at
  }));
}

export async function getSubscriberArticles(product: ProductCode, filters: NewsFilters = {}) {
  if (!hasSupabaseServiceEnv) return [] as SubscriberArticle[];

  const supabase = createServiceClient();
  let query = supabase
    .from("articles")
    .select("*")
    .contains("product_codes", [product])
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (filters.source) query = query.eq("source_code", filters.source);
  if (filters.sector) query = query.eq("sector", filters.sector);
  if (filters.contentType) query = query.eq("content_type", filters.contentType);
  if (filters.from) query = query.gte("published_at", `${filters.from}T00:00:00.000Z`);
  if (filters.to) query = query.lte("published_at", `${filters.to}T23:59:59.999Z`);
  if (filters.q?.trim()) {
    const safeTerm = filters.q.trim().replace(/[%(),]/g, " ");
    query = query.or(`title_original.ilike.%${safeTerm}%,title_nery.ilike.%${safeTerm}%,summary.ilike.%${safeTerm}%`);
  }
  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error || !data) return [] as SubscriberArticle[];
  return (data as ArticleRow[]).map(mapRow);
}

export async function getSubscriberArticleBySlug(product: ProductCode, slug: string) {
  if (!hasSupabaseServiceEnv) return null;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .contains("product_codes", [product])
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  return mapRow(data as ArticleRow);
}
