-- Before enabling this schedule, create these Supabase secrets:
-- select vault.create_secret('https://PROJECT_REF.functions.supabase.co/ingest-regulatory-news', 'ingest_function_url');
-- select vault.create_secret('SUPABASE_ANON_OR_SERVICE_TOKEN', 'ingest_function_token');

create extension if not exists pg_net;

select cron.schedule(
  'nery-regulatory-news-09',
  '0 9 * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'ingest_function_url'),
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'ingest_function_token'),
      'Content-Type', 'application/json'
    ),
    body := '{"schedule":"09:00 UTC"}'::jsonb
  );
  $$
);

select cron.schedule(
  'nery-regulatory-news-16',
  '0 16 * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'ingest_function_url'),
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'ingest_function_token'),
      'Content-Type', 'application/json'
    ),
    body := '{"schedule":"16:00 UTC"}'::jsonb
  );
  $$
);

select cron.schedule(
  'nery-regulatory-news-22',
  '0 22 * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'ingest_function_url'),
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'ingest_function_token'),
      'Content-Type', 'application/json'
    ),
    body := '{"schedule":"22:00 UTC"}'::jsonb
  );
  $$
);
