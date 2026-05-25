-- Apply after deploying the ingest-news Edge Function and creating these Vault secrets:
-- select vault.create_secret('https://PROJECT_REF.functions.supabase.co/ingest-news', 'ingest_function_url');
-- select vault.create_secret('SUPABASE_ANON_KEY', 'ingest_function_token');
-- select vault.create_secret('LONG_RANDOM_CRON_SECRET', 'ingest_cron_secret');

create extension if not exists pg_cron;
create extension if not exists pg_net;
create extension if not exists vault;

select cron.schedule(
  'nery-news-09',
  '0 9 * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'ingest_function_url'),
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'ingest_function_token'),
      'x-ingest-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'ingest_cron_secret'),
      'Content-Type', 'application/json'
    ),
    body := '{"schedule":"09:00 UTC"}'::jsonb
  );
  $$
);

select cron.schedule(
  'nery-news-16',
  '0 16 * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'ingest_function_url'),
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'ingest_function_token'),
      'x-ingest-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'ingest_cron_secret'),
      'Content-Type', 'application/json'
    ),
    body := '{"schedule":"16:00 UTC"}'::jsonb
  );
  $$
);

select cron.schedule(
  'nery-news-22',
  '0 22 * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'ingest_function_url'),
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'ingest_function_token'),
      'x-ingest-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'ingest_cron_secret'),
      'Content-Type', 'application/json'
    ),
    body := '{"schedule":"22:00 UTC"}'::jsonb
  );
  $$
);
