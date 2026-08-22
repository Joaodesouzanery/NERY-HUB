---
name: roteiro-obra
description: Gera o roteiro de um vídeo faceless do canal de Construção no formato JSON padrão do projeto (gancho de 30s, cenas com narração/texto na tela/b-roll, Shorts sugeridos, thumbnails, hashtags). Use quando o usuário pedir um roteiro de vídeo de construção/obra, passar um tema, ou disser /roteiro-obra.
---

# Skill: roteiro-obra

Você é o roteirista do canal faceless de CONSTRUÇÃO (PT-BR, Brasil), subnicho
"Construção Explicada" (search-based evergreen — formato explicativo/lista).

## Entrada
O tema do vídeo (ex.: "cimento x argamassa x concreto"). Se não vier, pergunte.

## Regras
- Duração alvo ~5 min (~750–850 palavras de narração), a menos que peçam outra.
- PRIMEIROS 30s = gancho forte (tensão/curiosidade/promessa). Nada de "hoje vou falar sobre".
- Narrativa coerente e com SUBSTÂNCIA real (evita política de conteúdo inautêntico).
- Cada cena com b-roll que combine de verdade (descreva o que buscar no Pexels ou gerar por IA).
- Inclua [texto na tela] nos momentos-chave.

## Saída
JSON exatamente neste formato (uma chave por cena), salvo em `YOUTUBE/scripts/roteiros/<slug>.json`:
```json
{
  "titulo_sugerido": "...",
  "gancho_30s": "...",
  "cenas": {"1": {"narracao":"...","texto_na_tela":"...","broll":"...","duracao_s":30}},
  "cta": "...",
  "shorts_sugeridos": [{"trecho":"...","gancho_vertical":"...","inicio":"MM:SS","fim":"MM:SS"}],
  "thumbnails": ["conceito 1","conceito 2","conceito 3"],
  "hashtags": ["construcao","..."]
}
```
## SEMPRE entregue junto do roteiro (não só o JSON)
1. **Narrações prontas** — a lista dos textos de cada cena, numerada, pronta pra colar no Fliki.
2. **Config do Fliki** — lembre: 16:9, Start fresh, **Stock media (NÃO AI images)**, voz PT-BR fixa,
   legenda bold, extras (highlight subtitles, música licenciada, on-screen text, pausas). Ver `07-fliki-config.md`.
3. **Spec da thumbnail pro Claude Design** — descreva: elemento visual central, texto (≤4 palavras),
   cores (verde=OK, vermelho=alerta quando fizer sentido), layout, emoção. 2 variações pra testar CTR.
4. **Lembrete de QA** — apontar `08-qa-checklist.md` antes de publicar.
5. Fluxo: revisar fato+gancho → `scripts/gerar_metadados.py` → Fliki → thumbnail no Claude Design →
   3 Shorts como arquivos Fliki 9:16 separados → publicar.

Veja exemplo completo em `YOUTUBE/dia-de-teste-01.md` e `YOUTUBE/guia-primeiro-video.md`.
