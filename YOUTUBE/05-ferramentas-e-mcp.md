# Ferramentas, Edição e MCPs — como usar cada coisa

> Guia prático pra quem tem pouca noção de edição. Orçamento até ~R$150/mês.

## 1. O fluxo de produção de 1 vídeo (faceless, PT-BR)

```
Claude Code (roteiro JSON)
   → ElevenLabs (narração MP3)
      → MoneyPrinterTurbo (rascunho: junta voz + b-roll + legenda)
         → Descript (limpa: corta erros/pausas editando o TEXTO)
            → CapCut (acabamento: template, legenda estilizada, música, auto-reframe → Shorts)
               → scripts/gerar_metadados.py (título/desc/tags)
                  → publicar no YouTube Studio (você aprova thumb + título)
```

## 2. Como usar cada ferramenta de edição

### ElevenLabs (voz) — ~US$5–22/mês
- Cole o texto da narração (das cenas do JSON). Escolha 1 voz PT-BR e **use sempre a mesma**
  (consistência = identidade do canal).
- Ajuste "stability" ~50% e "similarity" ~75% pra som natural. Baixe o MP3.
- Dica: gere cena por cena se quiser controlar entonação; ou tudo de uma vez pra rapidez.

### MoneyPrinterTurbo (rascunho) — grátis
- Dá o tema/roteiro e ele monta um vídeo base com b-roll de banco + legenda. Use como
  **ponto de partida**, não produto final (o b-roll dele é genérico).

### Descript (limpeza) — grátis pra começar
- Importe o vídeo/áudio → ele transcreve. Você **apaga palavras do texto e o vídeo corta junto.**
- Use "Remove filler words" e "Remove gaps" pra tirar pausas e "é...". É o jeito mais fácil
  de editar sem saber editar.

### CapCut (acabamento) — grátis
- Monte **1 template**: intro (3s), estilo de legenda grande (retém), transições simples, outro.
  Depois é só trocar o conteúdo — 80% da edição vira preencher template.
- **Legenda automática:** gera sozinha, você só revisa.
- **Auto-reframe / proporção 9:16:** transforma o vídeo de 4–6 min em Short vertical automático.
- Adicione música de fundo baixa (biblioteca do YouTube = livre de copyright).

### B-roll — grátis
- **Pexels** e **Pixabay**: vídeos/imagens de obras, máquinas, engenharia.
- Para cenas específicas que não existem em banco: gere imagem por IA e anime no CapCut (zoom lento).

### vidIQ (SEO) — grátis
- Veja score de keyword, competição, e "outliers" (vídeos que performaram acima da média
  do canal — ótimos pra achar formato).

## 3. TubeGen — por que NÃO agora
Custa US$149+/mês (~US$1,94/min). Resultado com "cara de IA" (risco de política) e você perde
controle editorial. Só considere DEPOIS de ter formato validado, e mesmo assim compare custo.
Com R$150/mês, ElevenLabs + CapCut + Descript entregam mais e mais barato.

## 4. Como conectar os MCPs (no Claude Code)

MCPs deixam o Claude Code falar direto com serviços. Configuração fica em `~/.claude.json`
ou via `claude mcp add`. Os úteis pra este projeto:

### Google Drive (você já tem) — salvar roteiros/thumbs/planilha
Já disponível nesta conta. Peça ao Claude Code: "salve este roteiro no meu Drive na pasta X".

### Filesystem (nativo)
Já ativo — o Claude Code lê/escreve os arquivos desta pasta (roteiros, scripts, CSV).

### YouTube (Data + Analytics) — o mais importante pro loop
Não vem pronto; duas opções:
- **Opção A (recomendada, sem código):** use **n8n** com o nó nativo do YouTube (OAuth do
  Google). Ele publica vídeos e puxa Analytics. Ver seção 5.
- **Opção B:** instalar um MCP de YouTube da comunidade:
  ```
  claude mcp add youtube -- npx -y @modelcontextprotocol/server-youtube
  ```
  (verifique o pacote atual; a lista muda. Precisa de API key do Google Cloud + OAuth.)
- Passos comuns pra qualquer opção:
  1. Google Cloud Console → criar projeto → ativar "YouTube Data API v3" e "YouTube Analytics API".
  2. Criar credencial OAuth (Desktop/Web) → baixar client_id/secret.
  3. Autorizar sua conta do canal (tela de consentimento).

### Figma (você já tem) — thumbnails consistentes
Peça: "crie 2 thumbnails 1280x720 pro vídeo {título}, estilo {X}".

## 5. n8n — o loop automático (fase 2, semana ~9+)

Não monte agora. Quando o formato estiver validado, um workflow n8n faz:

```
[Cron: toda segunda 8h]
  → HTTP/Node YouTube Analytics: puxa métricas dos últimos vídeos
  → Google Sheets: grava a linha da semana
  → Claude (via API node): gera o relatório de otimização
  → Email/Telegram: te manda o relatório
```

E um segundo workflow pra publicação:
```
[Trigger: novo arquivo de vídeo no Drive/pasta]
  → YouTube node: upload agendado
  → Sheets: registra data/título
```

n8n pode ser self-host (grátis, Docker) ou cloud (plano free limitado). Comece self-host.

## 6. Resumo de custo mensal (dentro dos R$150)
| Item | Custo |
|---|---|
| ElevenLabs (starter/creator) | ~US$5–22 (~R$30–120) |
| vidIQ | grátis (pro é opcional) |
| CapCut, Descript, MoneyPrinter, Pexels, n8n | grátis |
| **Total** | **~R$30–120/mês** ✅ dentro do orçamento |
