# Loop de Otimização — o que te faz chegar rápido

> 30 minutos, toda segunda-feira. É o núcleo do negócio. Ir rápido = aprender rápido,
> não postar mais. Este loop transforma cada vídeo em aprendizado pro próximo.

## O ritual semanal (toda segunda)

### 1. Coletar (5 min)
- Abra **YouTube Studio → Análises**. Para cada vídeo dos últimos 7 e 30 dias, anote:
  CTR, retenção nos 30s, % médio assistido, inscritos por mil views, views 7d e 30d.
- (Automatizável depois com n8n puxando a YouTube Analytics API — ver `05-ferramentas-e-mcp.md`.)

### 2. Diagnosticar (10 min) — a tabela de decisão
| Métrica | Ruim se... | O que ajustar no PRÓXIMO vídeo |
|---|---|---|
| CTR | < 4% | Thumbnail e título. Teste 2 thumbs sempre. |
| Retenção 30s | < 60% | O gancho. Vá direto à tensão, corte a introdução. |
| % médio assistido | < 40% | Ritmo: cortar partes lentas, mais b-roll, cenas mais curtas. |
| Inscritos/1.000 views | < 3 | Identidade: o canal não promete algo claro. Reforce o nicho. |

### 3. Decidir (10 min) — regras
- **Achou o formato:** vídeo com CTR ≥ 5% **E** retenção 30s ≥ 70% → faça **3 variações**
  do mesmo formato/tema na semana seguinte. É onde o crescimento acelera.
- **Teste isolado:** mude UMA variável por vez (só thumbnail, OU só gancho). Mudar tudo
  junto não ensina o que funcionou.
- **Corte o que não funciona:** 3 vídeos ruins seguidos no mesmo eixo → abandone esse eixo.

### 4. Deixar o Claude Code fazer o relatório (5 min)
Exporte o CSV do YouTube Studio e rode no Claude Code:
```
Leia este export do YouTube Studio. Para cada vídeo, classifique CTR, retenção 30s,
% assistido e inscritos/mil views como VERDE/AMARELO/VERMELHO usando as metas do
arquivo 04-loop-otimizacao.md. Depois me dê:
1. Qual foi o melhor formato e por quê.
2. 3 ações concretas pros próximos vídeos.
3. Se algum vídeo bateu "formato validado" (CTR≥5% + retenção≥70%).
```

## Metas de progresso (pra saber se está no ritmo)
| Semana | Meta |
|---|---|
| 1–2 | Canal no ar, 2–4 vídeos publicados, loop rodando |
| 3–6 | Achar 1 vídeo "fora da curva" (3–5x a mediana) |
| 7–10 | Formato validado + automatizar o comprovado |
| 11–16 | Rumo a 1.000 inscritos + 4.000h → aplicar YPP |
| Pós-YPP | Escalar formato vencedor + buscar afiliado/patrocínio |

## Aviso sobre velocidade
R$ 5.000/mês em 1–2 meses **não** vem de AdSense de canal novo (YPP leva meses). Se quiser
renda antes disso, os caminhos são: leads B2B (ConstruData/AgroTorre), afiliados na descrição,
micro-patrocínio. O loop acima é o que te leva ao YPP no menor tempo possível — normalmente
3–5 meses com execução disciplinada.
