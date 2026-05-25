# Instalação No Supabase

Este pacote foi preparado para um projeto Supabase novo.

## Aplicação

1. Execute `supabase/migrations/001_regulatory_news.sql` no SQL Editor.
2. Crie um segredo aleatório forte e publique a função com ele:

```bash
supabase secrets set INGEST_CRON_SECRET=LONG_RANDOM_CRON_SECRET
supabase functions deploy ingest-news
```

3. No SQL Editor, crie os secrets substituindo os valores; use o mesmo segredo aleatório:

```sql
select vault.create_secret('https://PROJECT_REF.functions.supabase.co/ingest-news', 'ingest_function_url');
select vault.create_secret('SUPABASE_ANON_KEY', 'ingest_function_token');
select vault.create_secret('LONG_RANDOM_CRON_SECRET', 'ingest_cron_secret');
```

4. Execute `supabase/migrations/002_ingestion_cron.sql`.

## Primeira Coleta

Faça uma chamada manual à função para confirmar o acesso às fontes:

```bash
curl -X POST "https://PROJECT_REF.functions.supabase.co/ingest-news" \
  -H "Authorization: Bearer SUPABASE_ANON_KEY" \
  -H "x-ingest-secret: LONG_RANDOM_CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d "{\"trigger\":\"initial-validation\"}"
```

Consulte os resultados:

```sql
select source_code, status, fetched_count, published_count, review_count, error_message, finished_at
from public.ingestion_runs
order by started_at desc;

select source_code, product_codes, status, title_original, official_url, published_at_verified
from public.articles
order by created_at desc
limit 50;
```

Na configuração inicial, todas as fontes permanecem em `needs_review`, mesmo quando o item está completo. Ministério das Cidades, Senado e CVM usam termos de seleção, e itens da ANA só recebem o produto `saneamento` quando aderem ao tema. Aegea e BRK Ambiental entram somente como fontes de RI em modo alerta com link.

Antes de liberar publicação automática, revise resultados por fonte, mantenha `text_republication_allowed` e `image_republication_allowed` desabilitados e valide a URL oficial. Itens com indícios de dados pessoais recebem a tag `privacy_review` e não devem ser publicados automaticamente.

Para habilitar alertas de uma fonte já validada, altere apenas `auto_publish_alert` após a revisão editorial. O MVP não gera matérias com IA nem republica imagens.

## Teste De RLS

Sem uma sessão autenticada, a consulta abaixo não deve retornar artigos:

```sql
select * from public.articles;
```

Um assinante precisa de uma linha em `subscriptions` com o `product_code` correto, status `active` ou `trialing` e período ainda válido.
