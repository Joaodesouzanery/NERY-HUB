import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const baseUrl = process.env.TEST_BASE_URL ?? "http://localhost:3000";

async function html(path) {
  const response = await fetch(`${baseUrl}${path}`);
  assert.equal(response.status, 200, `${path} should be publicly available.`);
  return response.text();
}

const landing = await html("/");
assert.match(landing, /DM\+Sans/, "Official landing must preserve its original font.");
assert.match(landing, /vídeo hero section\.mp4/, "Official landing must preserve its hero video reference.");
assert.match(landing, /Nery Notícias/, "Official landing must preserve the embedded news view.");
assert.match(landing, /id="view-landing-saneamento"/, "Updated official landing must preserve its embedded sanitation view.");
assert.match(landing, /portal-saneamento\.html/, "Sanitation call to action must retain the literal demo destination.");
assert.doesNotMatch(landing, /Foundational/, "Removed React landing must not be served at root.");
const landingBytes = await readFile(new URL("../public/index.html", import.meta.url));
assert.equal(
  createHash("sha256").update(landingBytes).digest("hex").toUpperCase(),
  "E51D37688B6F6D82B6005A0B713B0ED05891A011C7255BFC9C640FEB6C5CF97E",
  "Official landing bytes must remain unchanged."
);

for (const asset of ["imagem%20construdata.webp", "imagem%20jurimetria.jpg", "IMG_9652.JPG", "v%C3%ADdeo%20hero%20section.mp4"]) {
  const response = await fetch(`${baseUrl}/${asset}`, { method: "HEAD" });
  assert.equal(response.status, 200, `Official landing asset ${asset} must be served.`);
}

const sanitationDemo = await html("/portal-saneamento.html");
assert.match(sanitationDemo, /Portal Saneamento - NERY/, "Static sanitation demonstration must be publicly served.");
assert.match(sanitationDemo, /Últimas Publicações/, "Static sanitation demonstration must preserve its literal content.");
assert.match(sanitationDemo, /href="index\.html"/, "Static sanitation demonstration must preserve its return link.");
assert.match(sanitationDemo, /Demonstração visual/, "Static sanitation demonstration must clearly identify illustrative content.");

const preview = await fetch(`${baseUrl}/landing-preview/index.html`, { redirect: "manual" });
assert.equal(preview.status, 404, "Preview copy must not remain publicly available after promotion.");

const blog = await fetch(`${baseUrl}/blog`, { redirect: "manual" });
assert.equal(blog.status, 404, "Duplicate public blog route must be removed.");

const genericNews = await fetch(`${baseUrl}/noticias`, { redirect: "manual" });
assert.equal(genericNews.status, 307, "Generic news entry should redirect to the official landing.");
assert.match(genericNews.headers.get("location") ?? "", /\/$/, "Generic news entry must return to the embedded public news view.");

for (const product of ["regulatorio", "saneamento"]) {
  const showcase = await html(`/${product}`);
  assert.match(showcase, /Pré-lançamento/, `${product} showcase must identify its pre-launch state without backend configuration.`);
  assert.match(showcase, /Acompanhar lançamento/, `${product} showcase must not present active checkout before configuration.`);

  const feed = await fetch(`${baseUrl}/noticias/${product}`, { redirect: "manual" });
  assert.equal(feed.status, 307, `Anonymous ${product} feed access must redirect.`);
  assert.match(feed.headers.get("location") ?? "", /\/login/, `Anonymous ${product} feed must redirect to login.`);

  const detail = await fetch(`${baseUrl}/noticias/${product}/protected-article`, { redirect: "manual" });
  assert.equal(detail.status, 307, `Anonymous ${product} detail access must redirect.`);
}

const pricing = await html("/pricing");
assert.match(pricing, /assinaturas estão em preparação/i, "Pricing must not offer checkout before Stripe and Supabase are configured.");
assert.match(pricing, /Política de Privacidade/, "Pricing must link to privacy information.");

const login = await html("/login");
assert.match(login, /acesso por e-mail está em preparação/i, "Login must not collect email before Supabase is configured.");

const privacy = await html("/privacidade");
assert.match(privacy, /login e pagamentos ainda não estão ativos/i, "Privacy notice must describe the pre-launch state.");

const api = await fetch(`${baseUrl}/api/news?product=regulatorio`);
assert.equal(api.status, 401, "Anonymous API access must be rejected.");

const migration = await readFile(new URL("../supabase/migrations/001_regulatory_news.sql", import.meta.url), "utf8");
assert.match(migration, /ANPD/, "Migration must seed ANPD.");
assert.match(migration, /ABCON_SINDCON/, "Migration must seed sanitation sources.");
assert.match(migration, /AEGEA_RI/, "Migration must seed Aegea as a sanitation market source.");
assert.match(migration, /BRK_RI/, "Migration must seed BRK as a sanitation market source.");
assert.match(migration, /has_product_access/, "Migration must provide product-specific RLS.");
assert.match(migration, /set text_republication_allowed = false,[\s\S]*auto_publish_alert = false/, "Initial source policy must require editorial review.");

const webhook = await readFile(new URL("../app/api/stripe/webhook/route.ts", import.meta.url), "utf8");
assert.match(webhook, /stripe_events/, "Webhook must record Stripe events for idempotency.");
assert.match(webhook, /product_code/, "Webhook must persist subscription products.");

const ingestion = await readFile(new URL("../supabase/functions/ingest-news/index.ts", import.meta.url), "utf8");
assert.match(ingestion, /INGEST_CRON_SECRET/, "Ingestion must reject unscheduled unauthorised triggers.");
assert.match(ingestion, /filterTerms/, "Ingestion must limit broad sources to relevant sanitation terms.");
assert.match(ingestion, /articleProductCodes/, "Ingestion must scope ANA sanitation inclusion per article.");
assert.match(ingestion, /containsReviewOnlyData/, "Ingestion must flag possible personal-data content for review.");

console.log("Public pages, two-product paywall, schema and webhook checks passed.");
