import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

type Source = {
  id: string;
  source_code: string;
  name: string;
  sector: string;
  url: string;
  rss_url: string | null;
  product_codes: string[];
  extractor_type: "rss_or_govbr_listing" | "rss_or_listing" | "document_listing";
  content_type: string;
  match_terms: string[];
  license_label: string | null;
  text_republication_allowed: boolean;
  image_republication_allowed: boolean;
  credit_required: boolean;
  auto_publish_alert: boolean;
};

type ParsedArticle = {
  title: string;
  url: string;
  summary: string;
  publishedAt: string;
  publishedAtVerified: boolean;
  imageUrl: string | null;
  imageCredit: string | null;
  extractionMode: "rss" | "listing";
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (!req.headers.get("authorization")) return json({ error: "Authorization required." }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const ingestSecret = Deno.env.get("INGEST_CRON_SECRET");
  if (!supabaseUrl || !serviceRoleKey || !ingestSecret) return json({ error: "Missing Supabase environment variables." }, 500);
  if (req.headers.get("x-ingest-secret") !== ingestSecret) return json({ error: "Invalid ingest secret." }, 403);

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { data: sources, error } = await supabase.from("sources").select("*").eq("status", "active");
  if (error) return json({ error: error.message }, 500);

  const results = [];
  for (const source of (sources ?? []) as Source[]) {
    const run = await supabase
      .from("ingestion_runs")
      .insert({ source_id: source.id, source_code: source.source_code, product_codes: source.product_codes })
      .select("id")
      .single();
    let published = 0;
    let review = 0;
    let fetched = 0;

    try {
      const items = await fetchArticles(source);
      fetched = items.length;
      for (const item of items.slice(0, 24)) {
        const officialUrl = normalizeUrl(item.url);
        const complete = Boolean(item.title && officialUrl && item.publishedAt && item.publishedAtVerified);
        const productCodes = articleProductCodes(source, item);
        const privacyReviewRequired = containsReviewOnlyData(item);
        const allowOriginalText = source.text_republication_allowed && item.extractionMode === "rss" && Boolean(item.summary);
        const allowImage =
          source.image_republication_allowed &&
          Boolean(item.imageUrl) &&
          (!source.credit_required || Boolean(item.imageCredit));
        const status = complete && source.auto_publish_alert && !privacyReviewRequired ? "published" : "needs_review";
        const hash = await sha256(`${source.source_code}:${officialUrl}`);
        const slug = slugify(`${source.source_code}-${item.title}-${item.publishedAt.slice(0, 10) || "revisao"}`);

        const { error: upsertError } = await supabase.from("articles").upsert(
          {
            source_id: source.id,
            source_code: source.source_code,
            source_name: source.name,
            product_codes: productCodes,
            sector: source.sector,
            content_type: source.content_type,
            slug,
            title_original: item.title,
            subtitle_original: allowOriginalText ? item.summary : null,
            title_nery: item.title,
            summary: allowOriginalText
              ? item.summary
              : `Alerta NERY: nova publicação identificada em ${source.name}. Consulte a fonte atribuída para a íntegra.`,
            official_url: officialUrl,
            image_url: allowImage ? item.imageUrl : null,
            image_credit: allowImage ? item.imageCredit : null,
            image_authorized: allowImage,
            source_license_label: source.license_label,
            published_at: item.publishedAt || new Date().toISOString(),
            published_at_verified: item.publishedAtVerified,
            tags: [source.source_code, source.sector, source.content_type, ...(privacyReviewRequired ? ["privacy_review"] : [])],
            content_hash: hash,
            content_mode: allowOriginalText ? "original_allowed" : "summary",
            status,
            updated_at: new Date().toISOString()
          },
          { onConflict: "official_url" }
        );

        if (upsertError) throw new Error(upsertError.message);
        if (status === "published") published += 1;
        else review += 1;
      }

      await closeRun(run.data?.id, {
        status: "success",
        fetched_count: fetched,
        published_count: published,
        review_count: review
      });
      results.push({ source: source.source_code, fetched, published, needsReview: review });
    } catch (err) {
      await closeRun(run.data?.id, {
        status: "error",
        fetched_count: fetched,
        published_count: published,
        review_count: review,
        error_message: err instanceof Error ? err.message : String(err)
      });
      results.push({ source: source.source_code, error: err instanceof Error ? err.message : String(err) });
    }
  }

  return json({ ok: true, results });

  async function closeRun(id: string | undefined, values: Record<string, unknown>) {
    if (!id) return;
    await supabase
      .from("ingestion_runs")
      .update({ ...values, finished_at: new Date().toISOString() })
      .eq("id", id);
  }
});

async function fetchArticles(source: Source): Promise<ParsedArticle[]> {
  const candidateFeeds = source.rss_url
    ? [source.rss_url]
    : [`${source.url.replace(/\/$/, "")}/@@rss`, `${source.url.replace(/\/$/, "")}/feed`, `${source.url.replace(/\/$/, "")}/rss.xml`];

  for (const url of candidateFeeds) {
    const text = await fetchText(url);
    if (!text) continue;
    const parsed = parseFeed(text);
    if (parsed.length) return filterTerms(parsed, source.match_terms);
  }

  const html = await fetchText(source.url);
  if (!html) return [];
  return filterTerms(parseListing(html, source.url), source.match_terms);
}

function filterTerms(items: ParsedArticle[], terms: string[]) {
  if (!terms?.length) return items;
  const expected = terms.map((term) => normalizeText(term));
  return items.filter((item) => {
    const searchable = normalizeText(`${item.title} ${item.summary} ${item.url}`);
    return expected.some((term) => searchable.includes(term));
  });
}

function articleProductCodes(source: Source, item: ParsedArticle) {
  if (source.source_code !== "ANA" || !source.product_codes.includes("saneamento")) {
    return source.product_codes;
  }

  const text = normalizeText(`${item.title} ${item.summary} ${item.url}`);
  const sanitationTerms = ["saneamento", "esgoto", "abastecimento", "agua potavel", "perdas de agua", "universalizacao"];
  return sanitationTerms.some((term) => text.includes(term))
    ? source.product_codes
    : source.product_codes.filter((product) => product !== "saneamento");
}

function containsReviewOnlyData(item: ParsedArticle) {
  const text = normalizeText(`${item.title} ${item.summary}`);
  const privacySignals = [
    /\bcpf\b/,
    /\brg\b/,
    /\bdenunciante\b/,
    /\bvitima\b/,
    /\bendereco residencial\b/,
    /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/,
    /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/i
  ];
  return privacySignals.some((signal) => signal.test(text));
}

async function fetchText(url: string) {
  try {
    const response = await fetch(url, { headers: { "User-Agent": "NERY News Monitor/1.0 (+fonte atribuida)" } });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

function parseFeed(xml: string): ParsedArticle[] {
  const items = [...xml.matchAll(/<(item|entry)[\s\S]*?<\/\1>/gi)];
  return items.map((match) => {
    const item = match[0];
    const title = clean(stripHtml(extract(item, "title")));
    const url = clean(extract(item, "link")) || item.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1] || "";
    const summary = clean(stripHtml(extract(item, "description") || extract(item, "summary") || extract(item, "content")));
    const dateText = clean(extract(item, "pubDate") || extract(item, "updated") || extract(item, "published"));
    const parsedDate = parseDate(dateText);
    return {
      title,
      url,
      summary,
      publishedAt: parsedDate?.toISOString() ?? "",
      publishedAtVerified: Boolean(parsedDate),
      imageUrl: item.match(/<(?:media:content|enclosure)[^>]+url=["']([^"']+)["']/i)?.[1] ?? null,
      imageCredit: clean(extract(item, "media:credit")) || null,
      extractionMode: "rss" as const
    };
  }).filter((item) => item.title && item.url);
}

function parseListing(html: string, baseUrl: string): ParsedArticle[] {
  const anchors = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  const seen = new Set<string>();
  const items: ParsedArticle[] = [];

  for (const anchor of anchors) {
    const title = clean(stripHtml(anchor[2]));
    if (title.length < 20 || title.length > 220) continue;
    let url: string;
    try {
      url = normalizeUrl(new URL(anchor[1], baseUrl).toString());
    } catch {
      continue;
    }
    if (seen.has(url) || url === normalizeUrl(baseUrl)) continue;
    seen.add(url);
    const index = anchor.index ?? 0;
    const context = clean(stripHtml(html.slice(Math.max(0, index - 240), index + anchor[0].length + 240)));
    const date = parseDateFromText(context);
    items.push({
      title,
      url,
      summary: "",
      publishedAt: date?.toISOString() ?? "",
      publishedAtVerified: Boolean(date),
      imageUrl: null,
      imageCredit: null,
      extractionMode: "listing"
    });
  }

  return items;
}

function parseDate(input: string) {
  if (!input) return null;
  const value = new Date(input);
  return Number.isNaN(value.valueOf()) ? parseDateFromText(input) : value;
}

function parseDateFromText(text: string) {
  const numeric = text.match(/\b(\d{1,2})[./-](\d{1,2})[./-](20\d{2})\b/);
  if (numeric) return new Date(Date.UTC(Number(numeric[3]), Number(numeric[2]) - 1, Number(numeric[1]), 12));
  const monthNames: Record<string, number> = {
    janeiro: 0, fevereiro: 1, marco: 2, abril: 3, maio: 4, junho: 5,
    julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11
  };
  const named = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .match(/\b(\d{1,2})\s+de\s+([a-z]+)\s+de\s+(20\d{2})\b/);
  if (!named || monthNames[named[2]] === undefined) return null;
  return new Date(Date.UTC(Number(named[3]), monthNames[named[2]], Number(named[1]), 12));
}

function normalizeUrl(input: string) {
  const url = new URL(input);
  url.hash = "";
  ["utm_source", "utm_medium", "utm_campaign", "utm_content"].forEach((key) => url.searchParams.delete(key));
  return url.toString();
}

function extract(input: string, tag: string) {
  return input.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1] ?? "";
}

function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, " ");
}

function clean(input: string) {
  return input.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/\s+/g, " ").trim();
}

function normalizeText(input: string) {
  return input.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function slugify(input: string) {
  return input.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 120);
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
