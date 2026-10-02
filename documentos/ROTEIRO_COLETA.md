# Roteiro da coleta (T1–T4)

Procedimento executado em 2026-10-02 para gerar, verificar e corrigir os artefatos. Os papéis são dois: o **pesquisador** conduz as sessões dos agentes, e um **assistente** (sessão do Claude Code aberta neste repositório) prepara, congela, audita e avalia. Desvios e eventos de cada etapa estão em [`DECISOES_SESSAO_CLAUDE_CODE.md`](DECISOES_SESSAO_CLAUDE_CODE.md).

## Antes de começar (uma vez)

- Docker em execução, com o contêiner `sonarqube` ativo (ver [`avaliacao/COMO_AVALIAR.md`](../avaliacao/COMO_AVALIAR.md)). O MongoDB (`tcc-mongodb`) é recriado pelos scripts.
- Nada rodando nas portas 5173 e 3000.

## Diretório de execução

Todas as etapas rodam no mesmo diretório, `~/new-app` (configurável por `APP_DIR`), fora deste repositório e do iCloud. Antes de cada etapa, ele é esvaziado e recebe apenas o conteúdo da etapa: vazio para T1 e T2; para T3 e T4, a base restaurada do snapshot `geracoes/T1` ou `geracoes/T2`, com um commit e a marcação `T1-final` ou `T2-final`. Não há bloqueio técnico de acesso; o isolamento é verificado depois, pela auditoria do transcript.

## Ciclo de cada etapa

| # | Quem | O quê |
|---|---|---|
| 1 | Assistente | `./avaliacao/coleta/preparar.sh <Tn> <etapa>`: prepara `~/new-app`, reinicia o MongoDB, desativa os plugins globais na pasta, fixa modelo e esforço em `.claude/settings.local.json` e registra a sessão em `avaliacao/registros/sessoes.csv`. |
| 2 | Pesquisador | Em outro terminal: `cd ~/new-app && claude` (**sessão nova**). Confira modelo e esforço apenas com `/status`. **Não use `/model` nem `/effort`**: eles sobrepõem a configuração fixada. |
| 3 | Pesquisador | Cole o conteúdo **integral** do prompt da etapa (tabela abaixo) e envie. Não intervenha. Se o agente perguntar algo, responda apenas: *"Siga as regras do prompt e decida de forma autônoma."* Cada resposta conta como interação. |
| 4 | Pesquisador | Quando o agente concluir, feche a sessão (`/exit`) e avise o assistente. Relate qualquer evento fora do normal. |
| 5 | Assistente | `./avaliacao/coleta/congelar.sh <Tn> <tag>`: commit e marcação em `~/new-app`; nas tags `*-final`, exporta o snapshot para `geracoes/<Tn>` e cria a cópia de avaliação `~/tcc-avaliacao/<Tn>`. |
| 6 | Assistente | `python3 avaliacao/coleta/auditar_sessao.py <Tn> <etapa>`: esforço (duração, tokens e interações), auditoria de caminhos fora de `~/new-app` e conferência do modelo. |
| 7 | Assistente | Só nas tags `*-final`: SonarQube e Playwright sobre `~/tcc-avaliacao/<Tn>` (o MongoDB é limpo no início e derrubado no fim). |
| 8 | Assistente | Registra resultados, desvios e eventos no log de decisões e faz o commit. |

## Ordem das etapas

| Ordem | Condição / etapa | Prompt ([`prompts/`](../prompts/)) | Modelo | Tag |
|---|---|---|---|---|
| 1 | T1 geracao | `01_T1_geracao_direta.md` | Sonnet 5.5, low | `T1-final` |
| 2 | T2 geracao | `02_T2_geracao_TDD.md` | Sonnet 5.5, low | `T2-final` |
| 3 | T3 verificacao (base T1) | `03_verificador_T3_T4.md` | Opus 5.5, low | `T3-parecer` |
| 4 | T3 correcao | `04_corretor_T3_T4.md` | Sonnet 5.5, low | `T3-final` |
| 5 | T4 verificacao (base T2) | `03_verificador_T3_T4.md` | Opus 5.5, low | `T4-parecer` |
| 6 | T4 correcao | `04_corretor_T3_T4.md` | Sonnet 5.5, low | `T4-final` |

Depois das quatro condições: `python3 avaliacao/scripts/consolidar.py`.

## Regras

- Uma sessão nova por etapa; nunca reaproveitar conversa.
- Não abrir nem editar arquivos em `~/new-app` durante ou após a sessão (nenhuma correção manual).
- Não mencionar a avaliação, a suíte ou este repositório ao agente.
- Copiar o prompt sem alterações (abrir o arquivo em `prompts/` e copiar tudo).
- Se algo der errado (queda, erro de API, sessão interrompida), avisar antes de qualquer ação; a decisão de refazer e o desvio são registrados no log.

## Quando uma etapa é refeita

Uma etapa só é refeita quando o **protocolo** não foi seguido (configuração ou ambiente). Comportamentos do próprio agente, inclusive erros de julgamento, permanecem como observados: repetir a sessão para obter um resultado melhor seria seleção de resultados.

Na coleta:

- **T4, 1ª verificação:** executada no modelo errado, porque `/model` sobrepôs a configuração. A etapa foi refeita, e a tentativa foi arquivada em `avaliacao/registros/descartados/T4_verificacao_tentativa1_modelo_errado/`, fora dos resultados.
- **T1, 1ª avaliação:** executada dentro do iCloud, com falha causada pelo ambiente. A avaliação foi repetida sobre a cópia fora do iCloud, e a tentativa foi preservada em `avaliacao/resultados/T1/playwright_tentativa1_icloud/`.
- **T3, correção:** o corretor concluiu, por engano, que o MongoDB estava indisponível. A etapa não foi refeita.

## Por que os plugins são desativados

Os plugins globais do Claude Code (`superpowers`, `frontend-design`, `code-review`, `context7`) injetam instruções em toda sessão; o `superpowers`, por exemplo, traz uma skill de TDD que contaminaria T1. O `preparar.sh` os desativa apenas em `~/new-app`, por meio de `.claude/settings.local.json`, que fica fora do snapshot.
