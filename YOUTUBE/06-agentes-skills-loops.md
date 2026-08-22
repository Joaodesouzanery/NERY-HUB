# Agentes, Skills e Loops — automação dentro do Claude Code

> Dá pra criar assistentes e comandos reutilizáveis que fazem o trabalho repetitivo por você.
> IMPORTANTE: pra FUNCIONAR de verdade, Skills e agentes precisam ficar em `.claude/` (raiz do
> repositório), não dentro de `YOUTUBE/`. Este arquivo documenta o que fazer; peça pro Claude
> Code criar os arquivos funcionais quando quiser ativar.

## O que é cada coisa
| Recurso | O que faz | Exemplo pro projeto |
|---|---|---|
| **Skill** | Um comando reutilizável (`/nome`) com instruções fixas | `/roteiro-obra` gera o roteiro no formato JSON certo |
| **Agente** | Um assistente especializado que roda uma tarefa | "Analista de Métricas" lê o export do Studio e devolve relatório |
| **Loop** | Tarefa recorrente automática | Toda segunda: gerar o relatório de otimização |

## Skills sugeridas (crio quando você pedir)
1. **`/roteiro-obra <tema>`** — aplica o prompt de `03-prompt-roteiro.md` e devolve o JSON pronto.
2. **`/temas-obra`** — roda a pesquisa de 10 temas rankeados (search-based evergreen).
3. **`/metadados <arquivo.json>`** — chama o `scripts/gerar_metadados.py` e formata a saída.
4. **`/analise-semana <export.csv>`** — lê métricas e aplica a tabela de decisão do `04-loop`.

Arquivo funcional ficaria em: `.claude/skills/roteiro-obra/SKILL.md` (etc.).

## Agente sugerido
**"Analista YouTube"** — agente com foco só em ler métricas e propor otimização:
- Entrada: export do YouTube Studio (CSV).
- Saída: classificação VERDE/AMARELO/VERMELHO por vídeo + 3 ações + se algo virou "formato validado".
- Arquivo funcional: `.claude/agents/analista-youtube.md`.

## Loop sugerido (recorrente)
Usando o comando `/loop` do Claude Code ou um Routine agendado:
- **Loop semanal de otimização:** toda segunda, pega o último export e roda `/analise-semana`.
- **Loop de pauta:** toda sexta, roda `/temas-obra` e sugere os 2 temas da semana seguinte.

## Como ativar (quando decidir)
Peça ao Claude Code, por exemplo:
> "Crie a skill /roteiro-obra em .claude/skills usando o prompt do YOUTUBE/03-prompt-roteiro.md"

Ou:
> "Crie o agente Analista YouTube em .claude/agents que aplica a tabela do YOUTUBE/04-loop-otimizacao.md"

## Decisão pendente pra você
Você quer que eu crie esses arquivos funcionais em `.claude/`? Isso "fura" a regra de manter tudo
só em `YOUTUBE/`, mas é o único jeito de os comandos funcionarem. Alternativa: manter tudo como
documentação em `YOUTUBE/` e você copia/cola os prompts manualmente. Me diga qual prefere.
