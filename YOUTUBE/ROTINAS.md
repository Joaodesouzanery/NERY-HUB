# ROTINAS — Passo a passo enxuto (comece por aqui)

> O que usar, quando usar, em que ordem. Leia isto antes de tudo. Detalhes nos outros arquivos.

## STACK (o que usar)
- **Claude Code** → pesquisa de temas, roteiro, análise de métricas.
- **Fliki** → gera o vídeo (voz PT-BR + b-roll + legenda). Substitui edição manual.
- **CapCut / Canva** → só thumbnail e ajuste leve.
- **vidIQ + Google Trends + YouTube Studio** → SEO e métricas.
- **scripts/** → metadados e corte de Shorts.

---

## ROTINA ÚNICA (setup) — 1 vez, ~2h
1. Criar canal (Brand Account) + configurações → `01-checklist-setup-canal.md`.
2. Criar contas: Fliki, vidIQ, instalar CapCut.
3. Pronto.

---

## ROTINA SEMANAL DE PRODUÇÃO (o ciclo principal)

### Sexta ou fim de semana — PLANEJAR (30 min)
1. No Claude Code: `/temas-obra` (ou prompt de pesquisa do `03`) → 10 temas.
2. Escolher **2 temas**: 1 evergreen seguro + 1 de teste. (decisão humana)

### Fim de semana — PRODUZIR EM LOTE (2–4h pros 2 vídeos)
Para cada vídeo:
1. `/roteiro-obra <tema>` → gera o roteiro JSON. Salvar em `scripts/roteiros/`.
2. Revisar fato + gancho (10 min). ← os 30% humanos, não pule.
3. `python3 scripts/gerar_metadados.py scripts/roteiros/ARQ.json --canal "SEU CANAL"`.
4. Colar as cenas no **Fliki** → gerar vídeo → baixar.
5. Thumbnail no CapCut/Canva (usar 1 dos 3 conceitos do roteiro).
6. Cortar Shorts: auto-reframe do Fliki OU `scripts/cortar_shorts.sh`.

### Durante a semana — PUBLICAR
- 2 vídeos (4–6 min) + 3–4 Shorts, espaçados. Você aprova título+thumb antes de postar.

### Segunda — ANALISAR E OTIMIZAR (30 min) ← o que te faz ir rápido
1. YouTube Studio → exportar CSV das métricas.
2. No Claude Code: `/analise-semana <export.csv>` (ou prompt do `04`).
3. Aplicar as 3 ações sugeridas no roteiro da semana seguinte.

---

## AS 4 MÉTRICAS (decoreba)
| Métrica | Meta | Se ruim → ajuste |
|---|---|---|
| CTR | ≥ 4–6% | thumbnail/título |
| Retenção 30s | ≥ 70% | gancho |
| % assistido | ≥ 40% | ritmo |
| Inscritos/1.000 views | ≥ 3–5 | identidade |

**Formato validado = CTR ≥5% + retenção ≥70% → faça 3 variações dele.**

---

## LINHA DO TEMPO
| Fase | Quando | Foco |
|---|---|---|
| Validar formato | Semana 1–8 | 2 vídeos/sem, achar o que retém |
| Automatizar comprovado | Semana 9+ | Skills/loops, n8n |
| YPP | Mês 3–5 | 1.000 inscritos + 4.000h |
| R$ 5.000/mês | Mês 6–12 | escalar formato vencedor + afiliado/patrocínio |

---

## REGRAS DE OURO
1. Automatize só o que já funciona. Não monte robô antes de validar.
2. Consistência > volume. 2 bons/semana vencem 4 que te esgotam.
3. 1 teste de formato por semana (não mude tudo junto).
4. Os 30% humanos (revisão de fato + gancho + thumbnail) salvam o canal do "conteúdo inautêntico".
5. R$ 5.000 só de AdSense não vem em 1–2 meses (YPP leva meses). Renda antes = leads/afiliados.
