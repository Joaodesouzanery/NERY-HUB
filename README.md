# NERY Hub

Aplicação Next.js para a landing NERY e o MVP do Produto de Notícias Regulatórias.

## Stack

- Next.js App Router
- Supabase Auth, Postgres, RLS, Cron e Edge Functions
- Stripe Checkout para assinatura mensal
- Vercel para deploy da aplicação web

## Rotas principais

- `/` - landing NERY
- `/blog` - vitrine pública do portal de notícias
- `/pricing` - CTA de assinatura mensal
- `/login` - login por magic link do Supabase
- `/account` - status da conta e assinatura
- `/noticias` - área de notícias, com prévia pública ou base completa para assinantes
- `/noticias/[slug]` - detalhe com resumo, atribuição e fonte oficial

## Variáveis de ambiente

Copie `.env.example` para `.env.local` no desenvolvimento e configure as mesmas variáveis no Vercel:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_MONTHLY_PRICE_ID`
- `STRIPE_WEBHOOK_SECRET`

## Supabase

1. Rode as migrations em `supabase/migrations`.
2. Publique a Edge Function `supabase/functions/ingest-regulatory-news`.
3. Configure os secrets do cron citados em `002_ingestion_cron.sql`.
4. Ative os jobs das 09:00, 16:00 e 22:00 UTC, equivalentes a 06:00, 13:00 e 19:00 em São Paulo.

## Compliance editorial

O produto usa resumo editorial com link oficial por padrão. Texto integral e imagens da fonte só devem ser republicados quando a licença/permissão for clara. Toda notícia deve manter atribuição e URL oficial.
