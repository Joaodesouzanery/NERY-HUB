# Playbook Operacional — Canal de Construção (depois Fazenda)

> Como sair do zero e chegar rápido a um canal que retém e monetiza, com o máximo de
> automação sensata. Estratégia: **1 canal por vez.** Construção primeiro. Só depois
> replicar o mesmo sistema para Fazenda. Sem forçar venda de ConstruData/AgroTorre —
> o canal é editorial; a venda vem sozinha depois.
>
> Data: 2026-08-22

---

## 0. A regra que faz você ir "mais rápido que a expectativa"

Ir rápido **não** é postar mais. É **encurtar o ciclo de aprendizado**:
publicar → medir CTR/retenção → ajustar o próximo → repetir.

> Quem acha o formato vencedor em 12 vídeos ganha de quem posta 100 vídeos no escuro.

Então a automação existe para você **conseguir manter cadência sem cansar** e para
**medir e decidir mais rápido** — não para produzir lixo em massa (isso te derruba no YPP).

**Meta de velocidade realista-agressiva:** formato validado em **8–12 semanas**, YPP em
**3–5 meses**, R$ 5.000/mês em **6–12 meses**. Dá pra bater a ponta baixa se o loop de
análise for disciplinado.

---

## 1. Cadência: quanto postar

Esqueça "5–10/dia" (isso te reprova no YPP). Para nicho editorial de Construção:

| Formato | Cadência | Papel |
|---|---|---|
| **Long-form** (8–12 min) | **2/semana** (comece com 1/semana se apertar) | Motor de watch time + AdSense + autoridade |
| **Shorts** (derivados do long) | **3–5/semana** | Feeder de alcance/inscritos, alimenta o long |
| **Community post** | 1–2/semana | Grátis, testa ganchos e enquete de tema |

**Por quê 2 long-form/semana?** É o ponto onde você gera dados suficientes para aprender rápido
sem sacrificar qualidade. Cada long-form vira 3–5 Shorts, então saem ~10 peças/semana de **1–2 gravações**.

---

## 2. Metas de views (o alvo)

Do arquivo `meta-5000-reais-por-mes.md`: nicho de negócios/obras tem RPM bom (R$ 12–20).

| Marco | Views/mês | O que significa |
|---|---|---|
| Validação de formato | 20–50k | 1 vídeo "fora da curva" apareceu |
| YPP ligado | — | 1.000 inscritos + 4.000h (long-form) |
| Primeira renda relevante | ~150k | ~R$ 2.000 de ads |
| **Meta R$ 5.000/mês** | **280–420k** | RPM R$ 12–18, ou menos com 1 patrocínio |

---

## 3. O pipeline completo — 6 estágios, e o que automatizar em cada um

Legenda: 🤖 = automatizável | 🧠 = decisão humana (os 30% que salvam o canal) | ⚙️ = ferramenta

```
[1] PESQUISA  →  [2] ROTEIRO  →  [3] NARRAÇÃO/VOZ  →  [4] VISUAL/EDIÇÃO  →  [5] PUBLICAÇÃO  →  [6] ANÁLISE
```

### Estágio 1 — Pesquisa de tema e demanda 🤖🧠
**O quê:** achar temas de Construção com busca consistente + baixa competição.
**Como automatizar:**
- ⚙️ **Claude Code** roda um agente semanal que: puxa YouTube autocomplete + Google Trends (filtro "Pesquisa do YouTube"), cruza com vidIQ, e devolve **10 temas rankeados** por (demanda ÷ competição).
- Registra tudo numa planilha (a que vamos montar). 
**Humano 🧠:** você escolhe 2 temas da lista pra semana. 30 segundos. É a decisão editorial que a IA não deve tomar sozinha.

### Estágio 2 — Roteiro cena a cena 🤖🧠
**O quê:** roteiro com gancho forte nos 1ºs 30s, estrutura narrativa, on-screen text, 3 conceitos de thumbnail.
**Como automatizar:**
- ⚙️ **Claude Code** com um prompt-template salvo (vou deixar pronto). Gera roteiro em JSON (cenas, narração, [texto na tela], b-roll sugerido).
- Formato de história (as ideias que você tem: "o funcionário que salvou a obra", "a planilha que custou milhões") — 60% história emocional, 25% caso real, 15% gestão/dados.
**Humano 🧠:** revisar **fato** e **ângulo** (10–15 min). Aqui é onde você garante substância original = não cai na política de conteúdo inautêntico.

### Estágio 3 — Narração / voz 🤖
**O quê:** transformar roteiro em áudio.
**Como automatizar:**
- ⚙️ **ElevenLabs** (voz PT-BR realista — a melhor hoje; tem plano barato) ou voz do MoneyPrinterTurbo (mais fraca).
- Opção premium de retenção: **sua própria voz** gravada rápido + limpeza por IA (Descript/Adobe Podcast). Voz humana retém mais.
**Recomendação:** comece com ElevenLabs. Se retenção travar, teste sua voz.

### Estágio 4 — Visual e edição (seu ponto fraco — aqui está a solução) 🤖🧠
**O quê:** juntar narração + imagens/vídeos + legendas + cortes num vídeo assistível.
**Como resolver com pouca noção de edição:**
- ⚙️ **CapCut** (grátis, fácil) — legenda automática, auto-reframe pra Shorts, templates. **É o seu editor principal no começo.**
- ⚙️ **Descript** — **edição por TEXTO**: você edita o vídeo apagando palavras do transcript. Perfeito pra iniciante. Corta "é... hmm..." deletando texto.
- ⚙️ **MoneyPrinterTurbo** — monta rascunho automático (narração + b-roll de banco + legenda) que você refina.
- ⚙️ **B-roll:** Pexels/Pixabay (grátis) + imagens geradas por IA pra cenas específicas de obra.
**Humano 🧠:** escolher b-roll que **combina** com a narração (o erro clássico é cena desconexa = cara de robô). 20–30 min/vídeo no começo, cai com a prática.

> **Atalho de edição:** monte 1 **template CapCut** (intro, estilo de legenda, transições, outro).
> Depois é só trocar o conteúdo. 80% da "edição" vira preencher template.

### Estágio 5 — Publicação e metadados 🤖
**O quê:** título, descrição (com keywords), tags, thumbnail, agendamento, cortar Shorts.
**Como automatizar:**
- ⚙️ **Claude Code / Python** lê o roteiro JSON e gera título + descrição + tags automaticamente (script já existe no material que você tem).
- ⚙️ **FFmpeg** (script em lote) corta os Shorts dos timestamps marcados.
- ⚙️ **n8n** agenda e publica via YouTube Data API (ver seção n8n abaixo).
**Humano 🧠:** aprovar thumbnail e título finais (é o que decide o CTR). Nunca publicar 100% no automático.

### Estágio 6 — Análise e otimização 🤖🧠 ← **o estágio que te faz ir rápido**
**O quê:** ler CTR/retenção/views e decidir o que mudar no próximo vídeo.
**Como automatizar:**
- ⚙️ **n8n** puxa YouTube Analytics API toda segunda → joga numa planilha/dashboard.
- ⚙️ **Claude Code** lê os números e escreve um **relatório semanal**: "vídeo X teve CTR 3% (baixo) → problema de thumbnail; vídeo Y reteve 75% nos 30s → repita esse tipo de gancho."
**Humano 🧠:** aplicar as recomendações no roteiro/thumbnail da semana seguinte.

---

## 4. n8n vs Claude Code — quem faz o quê

Os dois se complementam. Não é ou/ou.

| Tarefa | Ferramenta | Por quê |
|---|---|---|
| Gerar roteiro/pesquisa (raciocínio) | **Claude Code** | É onde a inteligência mora; roda prompts complexos, lê arquivos, escreve scripts |
| Orquestrar/agendar/conectar APIs | **n8n** | Feito pra workflows: "toda segunda faça A→B→C"; visual, sem código |
| Cortar Shorts, mexer em vídeo | **Python/FFmpeg** (chamado pelo Claude Code) | Manipulação de arquivo |
| Publicar no YouTube no horário | **n8n** (YouTube Data API) | Agendamento nativo |
| Relatório de análise semanal | **Claude Code** lê dados, **n8n** entrega | Claude pensa, n8n distribui |

**Fluxo mental:**
- **Claude Code = o cérebro** (planeja, escreve, decide, gera scripts).
- **n8n = o sistema nervoso** (executa no horário, conecta as pontas, roda sozinho).

**Ordem de adoção (importante pra ir rápido, não pra travar montando robô):**
1. **Semanas 1–4:** faça quase tudo **manual + Claude Code**. Aprenda o que funciona. **NÃO monte n8n ainda.**
2. **Semanas 5–8:** automatize só o que já provou ser repetitivo (metadados, cortes de Short).
3. **Semana 9+:** só então monte n8n pra orquestrar pesquisa semanal + publicação + coleta de analytics.

> Erro fatal: gastar 3 semanas montando automação antes de saber qual conteúdo funciona.
> Automatize um processo **comprovado**, nunca um palpite.

---

## 5. MCPs e ferramentas que ajudam de verdade

**MCPs (conectam o Claude Code direto a serviços):**
- **YouTube Data / Analytics** via MCP ou n8n → Claude lê suas métricas e sugere otimizações.
- **Google Drive MCP** (você já tem disponível) → salvar roteiros, thumbnails, planilha de controle.
- **Filesystem** (nativo do Claude Code) → gerenciar os arquivos de vídeo/roteiro localmente.
- **Figma MCP** (você tem) → gerar/ajustar thumbnails com identidade visual consistente.

**Ferramentas de produção:**
- Roteiro/pesquisa/análise: **Claude** (Claude Code)
- Voz: **ElevenLabs** (PT-BR)
- Edição fácil: **CapCut** + **Descript** (edição por texto)
- Rascunho automático: **MoneyPrinterTurbo**
- B-roll: **Pexels/Pixabay** + IA de imagem
- SEO: **vidIQ grátis** + **YouTube Studio (aba Tendências)** + **Google Trends**
- Orquestração: **n8n** (self-host grátis ou cloud)
- Thumbnail: **Figma / CapCut / Canva**

---

## 6. O loop de otimização (como analisar e melhorar cada vídeo)

Toda segunda, olhe **4 métricas** (as que o próprio YouTube prioriza) por vídeo dos últimos 7/30 dias:

| Métrica | Se ruim → o que ajustar |
|---|---|
| **CTR** < 4% | Thumbnail e título (teste 2 thumbs por vídeo) |
| **Retenção 30s** < 60% | Gancho/abertura do roteiro (vá direto ao ponto) |
| **% médio assistido** < 40% | Ritmo/estrutura (cortar partes chatas, mais b-roll) |
| **Inscritos/1.000 views** < 3 | Falta identidade — o canal não "promete" algo claro |

**Regra de decisão:**
- Vídeo com CTR ≥ 5% **e** retenção 30s ≥ 70% → **é o seu formato. Faça 3 variações dele.**
- 3 vídeos seguidos ruins no mesmo eixo → mude **esse** eixo (só thumbnail, ou só gancho), não tudo de uma vez. Teste isolado ensina mais rápido.

Claude Code pode gerar esse relatório automaticamente a partir do export do YouTube Studio.

---

## 7. Timeline de 90 dias (Construção)

**Semanas 1–2 — Fundação**
- Configurar canal (not-for-kids, keywords, dublagem auto, enhancements).
- Montar planilha de análise de canais concorrentes (10–15 canais de referência).
- Escolher subnicho + formato copiado de 1 canal validado.
- Salvar prompt-template de roteiro no Claude Code.
- Publicar 2 vídeos.

**Semanas 3–6 — Validação**
- 2 long-form/semana + 3 Shorts cada.
- Testar 2 thumbnails por vídeo.
- Relatório semanal de métricas → ajustar próximo.
- Meta: achar 1 vídeo "fora da curva".

**Semanas 7–10 — Automação do comprovado**
- Automatizar metadados + cortes de Short (Python/FFmpeg).
- Montar n8n: pesquisa semanal + publicação agendada + coleta de analytics.
- Dobrar no formato que funcionou.

**Semanas 11–13 — Escala + YPP**
- Manter cadência, refinar só o que os dados pedem.
- Buscar 1.000 inscritos + 4.000h → aplicar ao YPP.
- **Só depois disso**: começar a planejar a replicação pro canal de Fazenda (mesmo sistema, trocar nicho).

---

## 8. Replicação para o canal de Fazenda

Quando o de Construção tiver formato validado + YPP:
- **Copie o sistema inteiro**, troque só: nicho, prompt-template, planilha de referência, identidade visual.
- n8n: duplica o workflow, muda credenciais do canal.
- **Não rode os dois do zero ao mesmo tempo.** O 2º canal só nasce quando o 1º está no automático e você tem processo comprovado. Aí ele cresce 3x mais rápido porque você já sabe o caminho.

---

## 9. Resumo — o que automatizar vs. manter humano

| Etapa | Automatizar 🤖 | Manter humano 🧠 |
|---|---|---|
| Pesquisa | Coleta de temas/dados | Escolha final do tema |
| Roteiro | Rascunho JSON | Revisão de fato + ângulo original |
| Voz | Geração ElevenLabs | (opcional: sua voz) |
| Edição | Legenda, cortes, rascunho, template | Escolha de b-roll coerente |
| Metadados | Título/desc/tags/Shorts | Aprovar thumbnail + título |
| Publicação | Agendamento n8n | — |
| Análise | Relatório automático | Decidir o ajuste do próximo |

> **70% automatizado, 30% decisão editorial humana.** Esses 30% são o que separa "canal que
> monetiza" de "canal reprovado". As ferramentas multiplicam um formato que VOCÊ validou —
> elas não inventam o formato.

---

## Próximos entregáveis que posso montar agora
1. **Planilha de análise de canais concorrentes** (template pronto pra preencher).
2. **Prompt-template de roteiro** (Construção) salvo como arquivo reutilizável.
3. **Scripts Python** de metadados + corte de Shorts (FFmpeg).
4. **Blueprint do workflow n8n** (nós, ordem, APIs).
5. **Checklist de setup do canal** (passo a passo).

Me diga por qual começar.
