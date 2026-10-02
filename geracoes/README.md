# geracoes/

Snapshots congelados, somente leitura, dos artefatos finais das quatro condições (T1–T4). São a única cópia preservada do código avaliado.

## Conteúdo

| Pasta | Condição | Layout | Arquivos adicionais |
|---|---|---|---|
| `T1/` | Geração direta | `backend/` + `frontend/` | `ORIGEM.txt` |
| `T2/` | Geração com TDD | `server/` + `client/`, com 6 arquivos de teste | `ORIGEM.txt`, `README.md` e `.gitignore` do próprio agente |
| `T3/` | T1 após verificação por agente seguida de correção | `backend/` + `frontend/` | `ORIGEM.txt`, `VERIFICATION_REPORT.md`, `CORRECTION_SUMMARY.md` |
| `T4/` | T2 após verificação por agente seguida de correção | `server/` + `client/`, com os mesmos 6 arquivos de teste | `ORIGEM.txt`, `README.md`, `.gitignore`, `VERIFICATION_REPORT.md`, `CORRECTION_SUMMARY.md` |

- `VERIFICATION_REPORT.md` é o parecer do verificador e `CORRECTION_SUMMARY.md`, o relato do corretor. Ambos foram escritos pelos agentes e fazem parte do artefato.
- Os layouts diferem porque cada gerador escolheu a própria estrutura; o contrato externo (portas, scripts, rotas, seed e `data-testid`) é o mesmo, fixado nos prompts.
- O código anterior à correção de T3 e T4 é o próprio snapshot de T1 ou T2, analisado pelo verificador no `VERIFICATION_REPORT.md`.

## Origem e marcações

Os artefatos foram gerados no diretório de execução `~/new-app`, fora deste repositório e reutilizado em todas as etapas, que tinha um repositório git próprio. Ao fim de cada etapa, o estado foi registrado com commit e marcação (tag):

| Marcação | Commit | Etapa |
|---|---|---|
| `T1-final` | `12f89bce0696eaeb383c6fb9feb3ad18e1320da0` | Geração de T1 |
| `T2-final` | `6eee00a22413965ed9f9ea04ac1ae34d8b4753a3` | Geração de T2 |
| `T3-parecer` | `674f2286bdf80eb335dbbc1b8f1a26ec0f7372bb` | Verificação sobre a base T1 |
| `T3-final` | `b2363d074ea58849eac8c2534c7fe971ee81a848` | Correção de T3 |
| `T4-parecer` | `dd7aa7e5c30cf58ff1a827f21e9c93288d47551a` | Verificação sobre a base T2 |
| `T4-final` | `e9886459b6b3d545e2a5913777fd02614ef194c5` | Correção de T4 |

- T3 e T4 **não foram clonados** do repositório original: a base foi restaurada a partir do snapshot `geracoes/T1` ou `geracoes/T2`, conferida arquivo a arquivo e registrada com um novo commit e a marcação de origem (`T1-final` ou `T2-final`).
- Os commits da tabela não são publicados e, como `~/new-app` foi esvaziado a cada etapa, a maioria deles **não existe mais**. Os identificadores ficam como registro histórico, em `ORIGEM.txt` e no log de decisões.
- Uma verificação de T4 foi descartada por violação de protocolo (`T4-parecer` = `0ffa2be1…`); está arquivada em [`avaliacao/registros/descartados/`](../avaliacao/registros/descartados/) e fica fora dos resultados.

## Exportação

Feita por [`avaliacao/coleta/congelar.sh`](../avaliacao/coleta/congelar.sh) nas marcações `*-final`: `git archive` da marcação, sem `.git`, `.claude`, `node_modules` e `dist`, mais um `ORIGEM.txt` com marcação, commit, diretório de origem e data. O caminho absoluto em `ORIGEM.txt` é o da máquina de coleta.

## Regras

- Snapshots são somente leitura: nenhuma edição manual.
- Nunca alterar um artefato para fazer testes passarem.
- A avaliação roda sobre cópias idênticas destes snapshots fora do iCloud, em `~/tcc-avaliacao/<Tn>` (ver [`avaliacao/COMO_AVALIAR.md`](../avaliacao/COMO_AVALIAR.md)).
- As credenciais presentes no código (`admin@teste.local`, segredos de desenvolvimento) são fictícias e definidas pelo contrato dos prompts.

## Status

| Condição | Coletada | Avaliação funcional |
|---|---|---|
| T1 | sim | 5/5 |
| T2 | sim | 5/5 |
| T3 | sim | 5/5 |
| T4 | sim | 5/5 |

Indicadores estruturais em [`avaliacao/resultados/tabelas/resultados.md`](../avaliacao/resultados/tabelas/resultados.md).
