# Roteiro da coleta (T1–T4)

Passo a passo para executar o experimento. **Você** (pesquisador) conduz as sessões dos agentes; o **Claude Code deste repositório** (assistente) prepara, congela, audita e avalia.

## Antes de começar (uma vez)

- Docker em execução (contêineres `sonarqube` e `tcc-mongodb`; ver `avaliacao/COMO_AVALIAR.md`).
- Nada rodando nas portas 5173 e 3000.

## Ciclo de cada etapa

| # | Quem | O quê |
|---|---|---|
| 1 | Assistente | `./avaliacao/coleta/preparar.sh <Tn> <etapa>`: prepara `~/new-app`, reinicia o MongoDB, desativa os plugins globais na pasta, fixa modelo/esforço e registra a sessão em `avaliacao/registros/sessoes.csv`. |
| 2 | Você | Em outro terminal: `cd ~/new-app && claude` (**sessão nova**). Confira com `/model` e `/status` o modelo e o esforço indicados. |
| 3 | Você | Cole o conteúdo **integral** do prompt da etapa (tabela abaixo) e envie. Não intervenha. Se o agente perguntar algo, responda apenas: *"Siga as regras do prompt e decida de forma autônoma."* (cada resposta conta como interação). |
| 4 | Você | Quando o agente concluir, feche a sessão (`/exit`) e avise o assistente: "**Tn etapa concluída**". Relate qualquer evento fora do normal. |
| 5 | Assistente | `./avaliacao/coleta/congelar.sh <Tn> <tag>`: commit + tag em `~/new-app`; nas tags `*-final`, exporta o snapshot para `geracoes/<Tn>`. |
| 6 | Assistente | `python3 avaliacao/coleta/auditar_sessao.py <Tn> <etapa>`: esforço (duração, tokens, interações) e auditoria de caminhos fora de `~/new-app`. |
| 7 | Assistente | Só nas tags `*-final`: Sonar + Playwright sobre a cópia idêntica `~/tcc-avaliacao/<Tn>`, fora do iCloud (o MongoDB é limpo no início e no fim). |
| 8 | Assistente | Registra resultados, desvios e eventos em `documentos/DECISOES_SESSAO_CLAUDE_CODE.md` e faz o commit. |

## Ordem das etapas

| Ordem | Condição / etapa | Prompt (`prompts/`) | Modelo | Tag |
|---|---|---|---|---|
| 1 | T1 geracao | `01_T1_geracao_direta.md` | Sonnet 5.5 low | `T1-final` |
| 2 | T2 geracao | `02_T2_geracao_TDD.md` | Sonnet 5.5 low | `T2-final` |
| 3 | T3 verificacao (base T1) | `03_verificador_T3_T4.md` | Opus 5.5 low | `T3-parecer` |
| 4 | T3 correcao | `04_corretor_T3_T4.md` | Sonnet 5.5 low | `T3-final` |
| 5 | T4 verificacao (base T2) | `03_verificador_T3_T4.md` | Opus 5.5 low | `T4-parecer` |
| 6 | T4 correcao | `04_corretor_T3_T4.md` | Sonnet 5.5 low | `T4-final` |

Depois das quatro condições: `python3 avaliacao/scripts/consolidar.py`.

## Regras

- Uma sessão nova por etapa; nunca reaproveitar conversa.
- Não abrir nem editar arquivos em `~/new-app` durante ou após a sessão (nenhuma correção manual).
- Não mencionar a avaliação, a suíte ou este repositório ao agente.
- Copie o prompt sem alterações (abra o arquivo em `prompts/` e copie tudo).
- Se algo der errado (queda, erro de API, sessão interrompida), avise antes de qualquer ação: o assistente decide com você se a etapa é refeita e registra o desvio.

## Por que os plugins são desativados

Os plugins globais (`superpowers`, `frontend-design`, `code-review`, `context7`) injetam instruções em toda sessão; o `superpowers`, por exemplo, traz uma skill de TDD que contaminaria T1. O `preparar.sh` os desativa apenas em `~/new-app` (`.claude/settings.local.json`, excluído do snapshot).
