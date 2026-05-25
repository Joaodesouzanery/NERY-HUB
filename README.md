# NERY Hub

Aplicação Next.js dos portais pagos NERY, com a landing institucional oficial publicada como documento HTML estático literal:

- **Portal de Notícias Regulatórias**: monitoramento das 12 agências reguladoras federais.
- **Portal de Notícias de Saneamento**: ANA, Cidades/SNSA, Senado, Trata Brasil, IAS, ABCON SINDCON, CVM e RI inicial de Sabesp, Sanepar, Copasa, Aegea e BRK Ambiental.

## Rotas

- `/` - landing oficial em `public/index.html`, com a view interna `Nery Notícias`.
- `/portal-saneamento.html` - demonstração pública estática identificada como ilustrativa, ainda sem conexão com o feed.
- `/regulatorio` e `/saneamento` - vitrines públicas em pré-lançamento até existir backend validado.
- `/pricing`, `/login` e `/account` - superfícies preparadas, sem ações ativas até Supabase e Stripe serem configurados.
- `/privacidade` - aviso de pré-lançamento aplicável às futuras áreas de conta e assinatura.
- `/noticias/regulatorio` e `/noticias/saneamento` - feeds protegidos.
- `/noticias/{produto}/{slug}` - detalhe protegido.
- `/api/news?product={produto}` - API protegida por assinatura do produto.

## Configuração

1. Copie `.env.example` para `.env.local` e preencha Supabase e Stripe.
2. Crie dois preços recorrentes no Stripe e use `STRIPE_REGULATORIO_PRICE_ID` e `STRIPE_SANEAMENTO_PRICE_ID`.
3. Em um projeto Supabase novo, aplique `supabase/migrations/001_regulatory_news.sql`.
4. Faça deploy da função `supabase/functions/ingest-news`.
5. Configure `INGEST_CRON_SECRET`, crie os secrets do Vault e aplique `supabase/migrations/002_ingestion_cron.sql`.
6. Configure o webhook Stripe para `/api/stripe/webhook`.

O cron executa às `09:00`, `16:00` e `22:00 UTC`, correspondentes atualmente a `06:00`, `13:00` e `19:00` em Brasília.

## Acesso E Conteúdo

- Cada produto possui assinatura independente; a RLS verifica acesso por `product_code`.
- Teasers públicos são consultas server-side reduzidas; artigos não possuem leitura pública direta.
- Na ANA, somente publicações aderentes ao tema também entram no produto de saneamento.
- Todas as fontes começam em `needs_review`; nenhuma publicação automática, texto original ou imagem original é habilitada na configuração inicial.
- O MVP usa alerta NERY curto, metadados e link oficial, sem IA para reescrever matérias.
- Itens com sinais de dados pessoais ou sem data publicada verificável permanecem em revisão.

## Entrega Para Integração

O manifesto exportável está em `exports/antigravity/nery-portals-export.json`; as instruções humanas estão em `exports/antigravity/INTEGRATION.md`. A landing oficial vive em `public/index.html`, usa `DM Sans`, vídeo e imagens originais e é servida em `/` sem adaptação React/CSS. O documento `public/portal-saneamento.html` mantém o visual recebido e inclui apenas o aviso aprovado de demonstração. Os cards estáticos serão conectados às fontes e aos scrapers em uma fase posterior.

## Verificação Local

Com `npm run dev` ativo:

```bash
npm test
npm run lint
npm run build
```
