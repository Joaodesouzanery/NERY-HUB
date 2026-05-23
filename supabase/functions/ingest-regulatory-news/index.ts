import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

type Source = {
  id: string;
  agency: string;
  name: string;
  url: string;
  rss_url: string | null;
};

type ParsedArticle = {
  title: string;
  url: string;
  summary: string;
  publishedAt: string;
  imageUrl: string | null;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: "Missing Supabase environment variables." }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { data: sources, error } = await supabase.from("sources").select("*").eq("status", "active");
  if (error) return json({ error: error.message }, 500);

  const results = [];
  for (const source of (sources ?? []) as Source[]) {
    const run = await supabase
      .from("ingestion_runs")
      .insert({ source_id: source.id, agency: source.agency })
      .select("id")
      .single();

    let inserted = 0;
    try {
      const articles = await fetchArticles(source);
      for (const article of articles.slice(0, 12)) {
        const hash = await sha256(`${source.agency}:${article.url}`);
        const slug = slugify(`${source.agency}-${article.title}-${article.publishedAt.slice(0, 10)}`);
        const { error: upsertError } = await supabase.from("articles").upsert(
          {
            source_id: source.id,
            agency: source.agency,
            source_name: `gov.br/${source.agency}`,
            slug,
            title_original: article.title,
            title_nery: article.title,
            summary: article.summary || `Resumo editorial NERY pendente. Consulte a fonte oficial da ${source.agency}.`,
            official_url: article.url,
            image_url: article.imageUrl,
            published_at: article.publishedAt,
            tags: [source.agency, "Regulação"],
            content_hash: hash,
            content_mode: "summary",
            status: article.title && article.url ? "published" : "needs_review"
          },
          { onConflict: "official_url" }
        );
        if (!upsertError) inserted += 1;
      }

      if (run.data?.id) {
        await supabase
          .from("ingestion_runs")
          .update({ status: "success", inserted_count: inserted, finished_at: new Date().toISOString() })
          .eq("id", run.data.id);
      }
      results.push({ agency: source.agency, inserted });
    } catch (err) {
      if (run.data?.id) {
        await supabase
          .from("ingestion_runs")
          .update({
            status: "error",
            error_message: err instanceof Error ? err.message : String(err),
            finished_at: new Date().toISOString()
          })
          .eq("id", run.data.id);
      }
      results.push({ agency: source.agency, error: err instanceof Error ? err.message : String(err) });
    }
  }

  return json({ ok: true, results });
});

async function fetchArticles(source: Source): Promise<ParsedArticle[]> {
  const candidateUrls = source.rss_url ? [source.rss_url, source.url] : [`${source.url}/@@rss`, `${source.url}/rss.xml`, source.url];

  for (const url of candidateUrls) {
    const response = await fetch(url, { headers: { "User-Agent": "NERY Regulatory Intelligence/1.0" } });
    if (!response.ok) continue;

    const text = await response.text();
    if (text.includes("<rss") || text.includes("<feed")) {
      const parsed = parseRss(text);
      if (parsed.length) return parsed;
    }

    const parsed = parseGovBrListing(text, source.url);
    if (parsed.length) return parsed;
  }

  return [];
}

function parseRss(xml: string): ParsedArticle[] {
  const itemMatches = [...xml.matchAll(/<item[\s\S]*?<\/item>/gi)];
  return itemMatches.map((match) => {
    const item = match[0];
    const title = clean(extract(item, "title"));
    const url = clean(extract(item, "link"));
    const summary = clean(stripHtml(extract(item, "description")));
    const pubDate = clean(extract(item, "pubDate"));
    const imageUrl = item.match(/url=["']([^"']+)["']/i)?.[1] ?? null;
    return {
      title,
      url,
      summary,
      publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      imageUrl
    };
  }).filter((article) => article.title && article.url);
}

function parseGovBrListing(html: string, baseUrl: string): ParsedArticle[] {
  const anchors = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  const seen = new Set<string>();
  const articles: ParsedArticle[] = [];

  for (const anchor of anchors) {
    const href = anchor[1];
    const title = clean(stripHtml(anchor[2]));
    if (!title || title.length < 24) continue;
    if (!href.includes("gov.br") && !href.startsWith("/")) continue;

    const url = new URL(href, baseUrl).toString();
    if (seen.has(url)) continue;
    seen.add(url);

    articles.push({
      title,
      url,
      summary: `Resumo editorial NERY: notícia oficial agregada da fonte pública. Consulte o link oficial para ler a íntegra.`,
      publishedAt: new Date().toISOString(),
      imageUrl: null
    });
  }

  return articles;
}

function extract(input: string, tag: string) {
  return input.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1] ?? "";
}

function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, " ");
}

function clean(input: string) {
  return input.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/\s+/g, " ").trim();
}

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 120);
}

async function sha256(input: string) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
