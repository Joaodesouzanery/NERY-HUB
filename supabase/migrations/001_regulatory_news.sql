create extension if not exists pgcrypto;
create extension if not exists pg_cron;
create extension if not exists vault;

create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  agency text not null unique,
  name text not null,
  sector text not null,
  url text not null,
  rss_url text,
  source_type text not null default 'govbr',
  usage_policy text not null default 'summary_with_link',
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.sources(id) on delete set null,
  slug text not null unique,
  agency text not null,
  source_name text,
  title_original text not null,
  title_nery text,
  summary text not null,
  official_url text not null unique,
  image_url text,
  published_at timestamptz not null default now(),
  tags text[] not null default '{}',
  content_hash text not null unique,
  content_mode text not null default 'summary',
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
  stripe_subscription_id text not null unique,
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ingestion_runs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.sources(id) on delete set null,
  agency text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running',
  inserted_count integer not null default 0,
  error_message text
);

alter table public.sources enable row level security;
alter table public.articles enable row level security;
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.ingestion_runs enable row level security;

create policy "Public active sources are readable"
  on public.sources for select
  using (status = 'active');

create policy "Published articles are readable"
  on public.articles for select
  using (status = 'published');

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can read own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

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

insert into public.sources (agency, name, sector, url)
values
  ('ANA', 'Agência Nacional de Águas e Saneamento Básico', 'Águas e saneamento', 'https://www.gov.br/ana/pt-br/assuntos/noticias-e-eventos/noticias'),
  ('ANAC', 'Agência Nacional de Aviação Civil', 'Aviação civil', 'https://www.gov.br/anac/pt-br/noticias'),
  ('ANCINE', 'Agência Nacional do Cinema', 'Audiovisual', 'https://www.gov.br/ancine/pt-br/assuntos/noticias'),
  ('ANEEL', 'Agência Nacional de Energia Elétrica', 'Energia elétrica', 'https://www.gov.br/aneel/pt-br/assuntos/noticias'),
  ('ANM', 'Agência Nacional de Mineração', 'Mineração', 'https://www.gov.br/anm/pt-br/assuntos/noticias'),
  ('ANP', 'Agência Nacional do Petróleo, Gás Natural e Biocombustíveis', 'Petróleo e gás', 'https://www.gov.br/anp/pt-br/canais_atendimento/imprensa/noticias-comunicados'),
  ('ANS', 'Agência Nacional de Saúde Suplementar', 'Saúde suplementar', 'https://www.gov.br/ans/pt-br/assuntos/noticias'),
  ('ANATEL', 'Agência Nacional de Telecomunicações', 'Telecomunicações', 'https://www.gov.br/anatel/pt-br/assuntos/noticias'),
  ('ANTAQ', 'Agência Nacional de Transportes Aquaviários', 'Transportes aquaviários', 'https://www.gov.br/antaq/pt-br/noticias'),
  ('ANTT', 'Agência Nacional de Transportes Terrestres', 'Transportes terrestres', 'https://www.gov.br/antt/pt-br/assuntos/noticias'),
  ('ANVISA', 'Agência Nacional de Vigilância Sanitária', 'Vigilância sanitária', 'https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa')
on conflict (agency) do update set
  name = excluded.name,
  sector = excluded.sector,
  url = excluded.url,
  status = 'active';
