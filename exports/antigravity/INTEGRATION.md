# NERY Portals - Integração Com A Landing Oficial

O documento oficial atualizado da landing é `public/index.html`. Ele foi copiado byte a byte da origem Antigravity e deve ser transportado como arquivo estático literal, acompanhado dos quatro assets na mesma pasta. Não converter para JSX, não mover estilos/scripts, não trocar a fonte e não modificar as views internas `Nery Notícias` e `landing-saneamento`.

## Publicação

- URL publicada: `/`.
- A home React anterior e a rota pública duplicada `/blog` foram removidas.
- Não há uma rota de prévia ou outra landing pública paralela.

## Documento Oficial

- A landing usa `DM Sans` nos pesos `400`, `500` e `600`, CSS e JavaScript inline originais.
- O documento publicado atualizado possui SHA-256 `E51D37688B6F6D82B6005A0B713B0ED05891A011C7255BFC9C640FEB6C5CF97E`.
- Assets obrigatórios em `public/`: `vídeo hero section.mp4`, `imagem construdata.webp`, `imagem jurimetria.jpg` e `IMG_9652.JPG`.
- A tela interna acionada por `Notícias` já aponta para `/regulatorio`, `/saneamento`, `/noticias/*` e `/pricing`; esses links não devem ser reescritos.
- O CTA `Assinar e Acessar Agora` na view interna de saneamento abre `/portal-saneamento.html`, demonstração visual publicada ao lado da landing com aviso explícito de conteúdo ilustrativo.
- Os teasers exibidos nessa tela permanecem estáticos nesta entrega; a alimentação por fontes/scrapers pertence à próxima fase.

## Aplicação Paga

- As páginas funcionais dos portais permanecem em Next.js e atualmente usam `Inter`.
- `/portal-saneamento.html` é somente uma demonstração visual pública, identificada em tela; não substitui `/saneamento` nem o feed protegido `/noticias/saneamento`.
- `/regulatorio`, `/saneamento`, `/pricing`, `/login` e `/account` apresentam pré-lançamento sem ações de coleta, login ou pagamento enquanto as variáveis de Supabase/Stripe não existirem.
- `/privacidade` contém o aviso aplicável às futuras operações de login e assinatura sem alterar a landing oficial.
- `PublicTeaser` expõe apenas fonte, data e título.
- `SubscriberArticle` é exibido somente em feed/detalhe após entitlement do produto.

## Backend Entregue

- Schema e RLS: `supabase/migrations/001_regulatory_news.sql`.
- Cron: `supabase/migrations/002_ingestion_cron.sql`.
- Coleta: `supabase/functions/ingest-news/index.ts`.
- Cobrança: Stripe Checkout e webhook em `/api/stripe/*`.
- Política inicial: todas as fontes coletam para revisão; sem publicação automática, imagem original ou reprodução de texto até validação documental.
- Saneamento inclui Aegea e BRK Ambiental como fontes de RI em modo alerta com link e restringe entradas da ANA ao tema quando destinadas ao produto de saneamento.

O arquivo `nery-portals-export.json` é o manifesto transportável com rotas, hashes SHA-256, produtos, fontes, variáveis e arquivos necessários.
