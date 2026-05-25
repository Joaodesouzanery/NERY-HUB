-- Fresh-install schema for both paid NERY portals.
create extension if not exists pgcrypto;

create table if not exists public.products (
  code text primary key check (code in ('regulatorio', 'saneamento')),
  name text not null,
  description text not null,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now()
);

create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  source_code text not null unique,
  name text not null,
  organization_type text not null,
  sector text not null,
  url text not null,
  rss_url text,
  product_codes text[] not null check (
    cardinality(product_codes) > 0
    and product_codes <@ array['regulatorio', 'saneamento']::text[]
  ),
  extractor_type text not null default 'rss_or_listing',
  content_type text not null default 'noticia',
  match_terms text[] not null default '{}',
  usage_policy text not null default 'alert_with_link',
  license_label text,
  license_url text,
  license_verified_at date,
  text_republication_allowed boolean not null default false,
  image_republication_allowed boolean not null default false,
  credit_required boolean not null default true,
  auto_publish_alert boolean not null default false,
  status text not null default 'active' check (status in ('active', 'inactive', 'validation_pending')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.sources(id) on delete set null,
  source_code text not null,
  source_name text not null,
  product_codes text[] not null check (
    cardinality(product_codes) > 0
    and product_codes <@ array['regulatorio', 'saneamento']::text[]
  ),
  sector text not null,
  content_type text not null default 'noticia',
  slug text not null unique,
  title_original text not null,
  subtitle_original text,
  title_nery text,
  summary text not null,
  official_url text not null unique,
  image_url text,
  image_credit text,
  image_authorized boolean not null default false,
  source_license_label text,
  published_at timestamptz not null,
  published_at_verified boolean not null default false,
  tags text[] not null default '{}',
  content_hash text not null unique,
  content_mode text not null default 'summary' check (content_mode in ('summary', 'original_allowed')),
  status text not null default 'needs_review' check (status in ('published', 'needs_review', 'discarded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_product_codes_idx on public.articles using gin (product_codes);
create index if not exists articles_publication_idx on public.articles (published_at desc);
create index if not exists articles_source_idx on public.articles (source_code, published_at desc);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  stripe_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_code text not null references public.products(code),
  stripe_customer_id text,
  stripe_subscription_id text not null unique,
  stripe_price_id text,
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_access_idx
  on public.subscriptions (user_id, product_code, status, current_period_end);

create table if not exists public.stripe_events (
  stripe_event_id text primary key,
  event_type text not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  last_error text
);

create table if not exists public.ingestion_runs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.sources(id) on delete set null,
  source_code text not null,
  product_codes text[] not null default '{}',
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running' check (status in ('running', 'success', 'error')),
  fetched_count integer not null default 0,
  published_count integer not null default 0,
  review_count integer not null default 0,
  error_message text
);

alter table public.products enable row level security;
alter table public.sources enable row level security;
alter table public.articles enable row level security;
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.stripe_events enable row level security;
alter table public.ingestion_runs enable row level security;

drop policy if exists "Public products are readable" on public.products;
create policy "Public products are readable"
  on public.products for select using (status = 'active');

drop policy if exists "Public active sources are readable" on public.sources;
create policy "Public active sources are readable"
  on public.sources for select using (status = 'active');

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users can read own subscriptions" on public.subscriptions;
create policy "Users can read own subscriptions"
  on public.subscriptions for select using (auth.uid() = user_id);

create or replace function public.has_product_access(requested_product text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.subscriptions
    where user_id = auth.uid()
      and product_code = requested_product
      and status in ('active', 'trialing')
      and (current_period_end is null or current_period_end > now())
  );
$$;

revoke all on function public.has_product_access(text) from public;
grant execute on function public.has_product_access(text) to authenticated;

drop policy if exists "Subscribers can read licensed articles" on public.articles;
create policy "Subscribers can read licensed articles"
  on public.articles for select to authenticated
  using (
    status = 'published'
    and exists (
      select 1 from unnest(product_codes) as product
      where public.has_product_access(product)
    )
  );

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email, updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

insert into public.products (code, name, description)
values
  ('regulatorio', 'Portal de Notícias Regulatórias', 'Monitoramento das 12 agências reguladoras federais.'),
  ('saneamento', 'Portal de Notícias de Saneamento', 'Notícias, estudos e atos de mercado do saneamento básico.')
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description,
  status = 'active';

insert into public.sources (
  source_code, name, organization_type, sector, url, product_codes, extractor_type,
  content_type, usage_policy, license_label, license_url, license_verified_at,
  text_republication_allowed, image_republication_allowed, credit_required, auto_publish_alert
)
values
  ('ANA', 'Agência Nacional de Águas e Saneamento Básico', 'agency', 'Águas e saneamento', 'https://www.gov.br/ana/pt-br/assuntos/noticias-e-eventos/noticias', array['regulatorio','saneamento'], 'rss_or_govbr_listing', 'noticia', 'licensed_original', 'Creative Commons Atribuição-SemDerivações 3.0 Não Adaptada', 'https://creativecommons.org/licenses/by-nd/3.0/deed.pt_BR', '2026-05-24', true, false, true, true),
  ('ANAC', 'Agência Nacional de Aviação Civil', 'agency', 'Aviação civil', 'https://www.gov.br/anac/pt-br/noticias', array['regulatorio'], 'rss_or_govbr_listing', 'noticia', 'licensed_original', 'Creative Commons Atribuição-SemDerivações 3.0 Não Adaptada', 'https://creativecommons.org/licenses/by-nd/3.0/deed.pt_BR', '2026-05-24', true, false, true, true),
  ('ANCINE', 'Agência Nacional do Cinema', 'agency', 'Audiovisual', 'https://www.gov.br/ancine/pt-br/assuntos/noticias', array['regulatorio'], 'rss_or_govbr_listing', 'noticia', 'licensed_original', 'Creative Commons Atribuição-SemDerivações 3.0 Não Adaptada', 'https://creativecommons.org/licenses/by-nd/3.0/deed.pt_BR', '2026-05-24', true, false, true, true),
  ('ANEEL', 'Agência Nacional de Energia Elétrica', 'agency', 'Energia elétrica', 'https://www.gov.br/aneel/pt-br/assuntos/noticias', array['regulatorio'], 'rss_or_govbr_listing', 'noticia', 'licensed_original', 'Creative Commons Atribuição-SemDerivações 3.0 Não Adaptada', 'https://creativecommons.org/licenses/by-nd/3.0/deed.pt_BR', '2026-05-24', true, false, true, true),
  ('ANM', 'Agência Nacional de Mineração', 'agency', 'Mineração', 'https://www.gov.br/anm/pt-br/assuntos/noticias', array['regulatorio'], 'rss_or_govbr_listing', 'noticia', 'licensed_original', 'Creative Commons Atribuição-SemDerivações 3.0 Não Adaptada', 'https://creativecommons.org/licenses/by-nd/3.0/deed.pt_BR', '2026-05-24', true, false, true, true),
  ('ANP', 'Agência Nacional do Petróleo, Gás Natural e Biocombustíveis', 'agency', 'Petróleo e gás', 'https://www.gov.br/anp/pt-br/canais_atendimento/imprensa/noticias-comunicados', array['regulatorio'], 'rss_or_govbr_listing', 'noticia', 'licensed_original', 'Creative Commons Atribuição-SemDerivações 3.0 Não Adaptada', 'https://creativecommons.org/licenses/by-nd/3.0/deed.pt_BR', '2026-05-24', true, false, true, true),
  ('ANS', 'Agência Nacional de Saúde Suplementar', 'agency', 'Saúde suplementar', 'https://www.gov.br/ans/pt-br/assuntos/noticias', array['regulatorio'], 'rss_or_govbr_listing', 'noticia', 'licensed_original', 'Creative Commons Atribuição-SemDerivações 3.0 Não Adaptada', 'https://creativecommons.org/licenses/by-nd/3.0/deed.pt_BR', '2026-05-24', true, false, true, true),
  ('ANATEL', 'Agência Nacional de Telecomunicações', 'agency', 'Telecomunicações', 'https://www.gov.br/anatel/pt-br/assuntos/noticias', array['regulatorio'], 'rss_or_govbr_listing', 'noticia', 'licensed_original', 'Creative Commons Atribuição-SemDerivações 3.0 Não Adaptada', 'https://creativecommons.org/licenses/by-nd/3.0/deed.pt_BR', '2026-05-24', true, false, true, true),
  ('ANTAQ', 'Agência Nacional de Transportes Aquaviários', 'agency', 'Transportes aquaviários', 'https://www.gov.br/antaq/pt-br/noticias', array['regulatorio'], 'rss_or_govbr_listing', 'noticia', 'licensed_original', 'Creative Commons Atribuição-SemDerivações 3.0 Não Adaptada', 'https://creativecommons.org/licenses/by-nd/3.0/deed.pt_BR', '2026-05-24', true, false, true, true),
  ('ANTT', 'Agência Nacional de Transportes Terrestres', 'agency', 'Transportes terrestres', 'https://www.gov.br/antt/pt-br/assuntos/ultimas-noticias', array['regulatorio'], 'rss_or_govbr_listing', 'noticia', 'licensed_original', 'Creative Commons Atribuição-SemDerivações 3.0 Não Adaptada', 'https://creativecommons.org/licenses/by-nd/3.0/deed.pt_BR', '2026-05-24', true, false, true, true),
  ('ANVISA', 'Agência Nacional de Vigilância Sanitária', 'agency', 'Vigilância sanitária', 'https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa', array['regulatorio'], 'rss_or_govbr_listing', 'noticia', 'licensed_original', 'Creative Commons Atribuição-SemDerivações 3.0 Não Adaptada', 'https://creativecommons.org/licenses/by-nd/3.0/deed.pt_BR', '2026-05-24', true, false, true, true),
  ('ANPD', 'Agência Nacional de Proteção de Dados', 'agency', 'Proteção de dados', 'https://www.gov.br/anpd/pt-br/assuntos/noticias', array['regulatorio'], 'rss_or_govbr_listing', 'noticia', 'licensed_original', 'Creative Commons Atribuição-SemDerivações 3.0 Não Adaptada', 'https://creativecommons.org/licenses/by-nd/3.0/deed.pt_BR', '2026-05-24', true, false, true, true),
  ('CIDADES_SNSA', 'Ministério das Cidades / SNSA', 'government', 'Política pública e SINISA', 'https://www.gov.br/cidades/pt-br/assuntos/noticias-1', array['saneamento'], 'rss_or_govbr_listing', 'noticia', 'licensed_original', 'Creative Commons Atribuição-SemDerivações 3.0 Não Adaptada', 'https://creativecommons.org/licenses/by-nd/3.0/deed.pt_BR', '2026-05-24', true, false, true, true),
  ('SENADO', 'Agência Senado', 'legislative', 'Legislativo', 'https://www12.senado.leg.br/noticias/ultimas?SearchableText=saneamento', array['saneamento'], 'rss_or_listing', 'noticia', 'credited_original', 'Política de uso Agência Senado', 'https://www12.senado.leg.br/noticias/politica-de-uso', '2026-05-24', true, true, true, true),
  ('TRATA_BRASIL', 'Instituto Trata Brasil', 'institute', 'Estudos e indicadores', 'https://tratabrasil.org.br/', array['saneamento'], 'rss_or_listing', 'estudo', 'alert_with_link', null, 'https://tratabrasil.org.br/politica-de-privacidade/', '2026-05-24', false, false, true, true),
  ('IAS', 'Instituto Água e Saneamento', 'institute', 'Municípios e indicadores', 'https://www.aguaesaneamento.org.br/imprensa/noticias/', array['saneamento'], 'rss_or_listing', 'noticia', 'alert_with_link', null, 'https://www.aguaesaneamento.org.br/imprensa/noticias/', '2026-05-24', false, false, true, true),
  ('ABCON_SINDCON', 'ABCON SINDCON', 'association', 'Concessões e PPPs', 'https://abconsindcon.com.br/noticias/', array['saneamento'], 'rss_or_listing', 'noticia', 'alert_with_link', null, 'https://abconsindcon.com.br/noticias/', '2026-05-24', false, false, true, true),
  ('CVM', 'Comissão de Valores Mobiliários', 'market', 'Atos societários', 'https://sistemas.cvm.gov.br/cias-abertas.asp', array['saneamento'], 'document_listing', 'ato_societario', 'alert_with_link', null, 'https://www.gov.br/cvm/pt-br', '2026-05-24', false, false, true, true),
  ('SABESP_RI', 'Sabesp RI', 'market', 'Resultados e fatos relevantes', 'https://ri.sabesp.com.br/', array['saneamento'], 'rss_or_listing', 'fato_relevante', 'alert_with_link', null, 'https://ri.sabesp.com.br/', '2026-05-24', false, false, true, true),
  ('SANEPAR_RI', 'Sanepar RI', 'market', 'Resultados e fatos relevantes', 'https://ri.sanepar.com.br/pt', array['saneamento'], 'rss_or_listing', 'fato_relevante', 'alert_with_link', null, 'https://ri.sanepar.com.br/pt', '2026-05-24', false, false, true, true),
  ('COPASA_RI', 'Copasa RI', 'market', 'Resultados e fatos relevantes', 'https://ri.copasa.com.br/', array['saneamento'], 'rss_or_listing', 'fato_relevante', 'alert_with_link', null, 'https://ri.copasa.com.br/', '2026-05-24', false, false, true, false),
  ('AEGEA_RI', 'Aegea RI', 'market', 'Resultados e fatos relevantes', 'https://ri.aegea.com.br/informacoes-aos-investidores/', array['saneamento'], 'rss_or_listing', 'fato_relevante', 'alert_with_link', null, 'https://ri.aegea.com.br/informacoes-aos-investidores/', '2026-05-24', false, false, true, false),
  ('BRK_RI', 'BRK Ambiental RI', 'market', 'Resultados e fatos relevantes', 'https://www.ri.brkambiental.com.br/divulgacoes-e-documentos/comunicados-e-fatos-relevantes/', array['saneamento'], 'rss_or_listing', 'fato_relevante', 'alert_with_link', null, 'https://www.ri.brkambiental.com.br/', '2026-05-24', false, false, true, false)
on conflict (source_code) do update set
  name = excluded.name,
  organization_type = excluded.organization_type,
  sector = excluded.sector,
  url = excluded.url,
  product_codes = excluded.product_codes,
  extractor_type = excluded.extractor_type,
  content_type = excluded.content_type,
  usage_policy = excluded.usage_policy,
  license_label = excluded.license_label,
  license_url = excluded.license_url,
  license_verified_at = excluded.license_verified_at,
  text_republication_allowed = excluded.text_republication_allowed,
  image_republication_allowed = excluded.image_republication_allowed,
  credit_required = excluded.credit_required,
  auto_publish_alert = excluded.auto_publish_alert,
  status = 'active',
  updated_at = now();

update public.sources set match_terms = array['saneamento', 'sinisa', 'esgoto', 'abastecimento'] where source_code = 'CIDADES_SNSA';
update public.sources set match_terms = array['saneamento', 'agua', 'esgoto', 'abastecimento'] where source_code = 'SENADO';
update public.sources set match_terms = array['sabesp', 'sanepar', 'copasa', 'aegea', 'brk ambiental'] where source_code = 'CVM';

-- Conservative launch policy: collect for editorial review before any public item is enabled.
update public.sources
set text_republication_allowed = false,
    image_republication_allowed = false,
    auto_publish_alert = false,
    updated_at = now();
