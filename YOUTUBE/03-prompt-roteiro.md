# Prompt de Roteiro — Canal de Construção (reutilizável)

> Cole no Claude Code quando for criar um vídeo. Ele devolve o roteiro em JSON, que o
> `scripts/gerar_metadados.py` lê pra gerar título/descrição/tags automaticamente.
> Troque só o `TEMA` e o `CANAL_REFERENCIA`. Para o canal de Fazenda, troque o contexto.

---

## PROMPT PRINCIPAL (long-form 4–6 min)

```
Você é um roteirista de um canal faceless no YouTube em português (Brasil) sobre
CONSTRUÇÃO e OBRAS. Estilo: histórias reais e envolventes de canteiros, engenharia,
erros caros e megaconstruções. Público: brasileiros interessados em obras, engenharia
e gestão. Tom: narrativo, humano, com substância real (nada genérico — isso é regra
para não cair na política de conteúdo inautêntico do YouTube).

TEMA: {ex.: "A planilha esquecida que custou milhões numa obra"}
DURAÇÃO ALVO: 5 minutos (~750-850 palavras de narração)
CANAL DE REFERÊNCIA (formato, não conteúdo): {link}

Regras:
- Os PRIMEIROS 30 SEGUNDOS são um gancho forte (pergunta/tensão/promessa). É a métrica
  que mais importa. Nada de "hoje eu vou falar sobre...".
- Narrativa coerente com começo, tensão e desfecho — não uma lista solta de fatos.
- Cada cena precisa de b-roll que REALMENTE combine (descreva o que buscar no Pexels/Pixabay
  ou gerar por IA). Evite cena desconexa.
- Inclua [texto na tela] em momentos-chave.
- Termine com um CTA leve (inscrever) e um gancho pro próximo vídeo.

Saída em JSON, uma chave por cena, neste formato:
{
  "titulo_sugerido": "...",
  "gancho_30s": "...",
  "cenas": {
    "1": {"narracao": "...", "texto_na_tela": "...", "broll": "descrição do que buscar", "duracao_s": 20},
    "2": {...}
  },
  "cta": "...",
  "shorts_sugeridos": [
    {"trecho": "cena 3-4", "gancho_vertical": "...", "inicio": "MM:SS", "fim": "MM:SS"}
  ],
  "thumbnails": ["conceito 1", "conceito 2", "conceito 3"],
  "hashtags": ["construcao", "obra", "..."]
}
```

## PROMPT DE PESQUISA DE TEMAS (rode 1x por semana)

```
Aja como estrategista de conteúdo do meu canal faceless de CONSTRUÇÃO (PT-BR, Brasil).
Me dê 10 temas de vídeo com ALTA busca consistente e BAIXA competição, dentro de
histórias de obras/engenharia/gestão. Para cada um: título proposto, o ângulo/gancho,
por que tem demanda, e nível de competição estimado. Ranqueie por (demanda ÷ competição).
Priorize temas "evergreen" (buscados o ano todo), não modismos.
```

## PROMPT DE THUMBNAIL

```
Sou um canal de construção. O vídeo se chama "{TÍTULO}". Me dê 3 conceitos de thumbnail
de ALTO CTR: o elemento visual central, o texto curto (máx 4 palavras) e a emoção que
deve transmitir. Estilo: contraste forte, rosto/reação ou objeto-símbolo, legível no celular.
```

---

## Como usar no fluxo
1. Rode o prompt de pesquisa → escolha 2 temas (decisão humana).
2. Rode o prompt principal com o tema → salve o JSON em `scripts/roteiros/`.
3. Revise fato + ângulo (10–15 min — os 30% humanos).
4. Rode `scripts/gerar_metadados.py roteiro.json` → sai título/desc/tags.
5. Gere a narração no ElevenLabs a partir do texto das cenas.
6. Monte no MoneyPrinter/CapCut, corte Shorts com `scripts/cortar_shorts.sh`.
