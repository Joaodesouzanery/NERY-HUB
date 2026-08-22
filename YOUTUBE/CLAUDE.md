# YOUTUBE — Contexto do Projeto (leia isto primeiro)

> Este arquivo é lido automaticamente pelo Claude Code sempre que você abrir este
> repositório. Ele carrega TODO o contexto do projeto para você não ter que re-explicar
> nada em nenhuma sessão/conta. Mantenha atualizado conforme o projeto evolui.

## O que é este projeto
Negócio de canais no YouTube **faceless** (sem aparecer), em **português (Brasil)**, com
apoio pesado de IA. Objetivo: renda de **~R$ 5.000/mês**. Canal 1 = **Construção/Obras**.
Canal 2 (só depois de validar o 1º) = **Fazenda/Agro**. O dono também tem as empresas
**ConstruData** e **AgroTorre** — o canal pode virar fonte de leads B2B, mas NÃO forçamos
venda; o canal é editorial primeiro.

## Decisões travadas
- **Formato:** faceless (narração IA + b-roll + legendas).
- **Idioma:** PT-BR, público Brasil.
- **Orçamento:** até ~R$150/mês (ElevenLabs + vidIQ). Sem TubeGen, sem tráfego pago.
- **Tempo:** 5–10h/semana, mais nos fins de semana (adiantar em lote).
- **Cérebro:** Claude Code. **Orquestração:** n8n (só a partir da semana ~9).
- **Cadência:** 2–3 vídeos de 4–6 min + 5–6 Shorts por semana.

## Realidade financeira (não esquecer)
- AdSense só liga após o **YPP** (1.000 inscritos + 4.000h long-form, ou 10M views Shorts/90d)
  + revisão humana. Isso leva ~3–5 meses no melhor caso.
- R$ 5.000/mês só de AdSense de canal novo NÃO vem em 1–2 meses. Caminhos pra acelerar:
  leads B2B (ConstruData/AgroTorre), afiliados e micro-patrocínio antes do YPP.
- Meta de views pra R$ 5.000 via ads: ~280–420k/mês (RPM nicho negócios R$ 12–18).

## Regra de ouro
70% automatizado, 30% decisão editorial humana. Ir rápido = encurtar o LOOP de aprendizado
(publicar → medir CTR/retenção → ajustar), não postar mais. Automatizar só o que já
provou funcionar.

## Métricas-alvo (sinais verdes)
- CTR ≥ 4–6% | Retenção 30s ≥ 70% | % assistido ≥ 40% | Inscritos/1.000 views ≥ 3–5
- Formato validado = 1 vídeo com CTR ≥5% + retenção ≥70%. Aí faça 3 variações dele.

## Skills e agente (ficam em YOUTUBE/, com symlink em .claude/ pra funcionar)
- `/roteiro-obra <tema>` → gera roteiro JSON (skills/roteiro-obra/)
- `/temas-obra` → 10 temas rankeados (skills/temas-obra/)
- `/analise-semana <csv>` → relatório de otimização (skills/analise-semana/)
- agente `analista-youtube` → análise de métricas (agents/)
Se os symlinks sumirem (novo clone), recrie: `ln -sfn ../../YOUTUBE/skills/<nome> .claude/skills/<nome>`

## Mapa dos arquivos desta pasta
- `ROTINAS.md` — passo a passo enxuto (COMECE POR AQUI).
- `analise-automacao-youtube.md` — análise crítica das ideias/ferramentas/hype.
- `meta-5000-reais-por-mes.md` — a conta de views e viabilidade.
- `playbook-operacional-canais.md` — visão geral do pipeline e automação.
- `01-checklist-setup-canal.md` — passo a passo pra configurar o canal.
- `02-analise-canais.csv` — planilha de pesquisa de concorrentes (abrir no Sheets/Excel).
- `03-prompt-roteiro.md` — prompt reutilizável de roteiro (cole no Claude Code).
- `04-loop-otimizacao.md` — o loop semanal de análise e otimização.
- `05-ferramentas-e-mcp.md` — como usar ElevenLabs/CapCut/Descript e conectar MCPs.
- `06-agentes-skills-loops.md` — como criar Skills/agentes/loops no Claude Code.
- `dia-de-teste-01.md` — subnicho escolhido, 10 temas rankeados, 1º vídeo pronto.
- `scripts/gerar_metadados.py` — gera título/descrição/tags do roteiro.
- `scripts/cortar_shorts.sh` — corta Shorts do vídeo longo (FFmpeg).

## Formato de conteúdo (definido)
Subnicho: **"Construção Explicada"** — formato SEARCH-BASED EVERGREEN (explicativo/lista,
buscado o ano todo). Fácil de produzir faceless. Geração de vídeo via **Fliki** (texto→vídeo,
~US$8–28/mês) em vez de edição manual. 1º vídeo: "O que cada rachadura na parede significa".

## Stack
Claude Code (roteiro/pesquisa/análise) · ElevenLabs (voz PT-BR) · MoneyPrinterTurbo
(rascunho) · Descript (edição por texto) · CapCut (acabamento + auto-reframe) ·
vidIQ + Google Trends + YouTube Studio (SEO) · Pexels/Pixabay (b-roll) · n8n (orquestração, fase 2).
