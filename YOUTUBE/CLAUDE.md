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
- **Nome do canal (recomendado):** "Obra Explicada".
- **Formato:** faceless (narração IA + b-roll + legendas).
- **Gerador de vídeo:** Fliki, plano pago (grátis só faz 1 min). Config fixa em `07-fliki-config.md`.
  REGRA CRÍTICA: Scene media = STOCK, nunca AI images (rachadura de IA parece falsa).
- **Shorts:** gerados como arquivos Fliki 9:16 separados (sem edição), não cortados.
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

## Regra: fonte visual POR FORMATO (não é sempre stock)
- **Explainer** (rachaduras, materiais, custos): Fliki modo **Stock media** — ele acha as fotos
  reais sozinho, vídeo sai pronto, sem criar nada. Credibilidade > animação.
- **História emocional** (empregado desvalorizado, obra que deu errado): cena não existe em stock →
  Fliki modo **AI images** ou InVideo AI (também sai pronto, sem editar).
- **Higgsfield:** só clipes curtos de IA; exige montar/sincronizar = edição. Não usar como gerador
  principal enquanto o usuário não editar.
- Começar pelo explainer (o único "pronto sem criar" hoje). História = formato de teste (2º vídeo/semana).

## Ao gerar QUALQUER vídeo, SEMPRE entregue junto
1. Config do Fliki a usar (de `07-fliki-config.md`).
2. Spec da thumbnail para o Claude Design (elementos, texto ≤4 palavras, cores, layout).
3. Os textos das narrações prontos pra colar.
4. Lembrar do QA (`08-qa-checklist.md`) antes de publicar.

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
- `07-fliki-config.md` — configuração fixa do Fliki (long-form e Shorts).
- `08-qa-checklist.md` — checklist de QA antes de publicar + métricas-alvo.
- `guia-primeiro-video.md` — passo a passo executável do 1º vídeo.
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
