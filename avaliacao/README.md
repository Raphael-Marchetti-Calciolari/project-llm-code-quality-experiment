# avaliacao/

Instrumentos de coleta e de avaliação do experimento, registros das sessões e resultados. Os mesmos instrumentos, sem ajuste por condição, mediram os quatro artefatos congelados (T1–T4).

## Estrutura

```
avaliacao/
├── COMO_AVALIAR.md              # runbook da avaliação
├── coleta/                      # preparação, congelamento e auditoria das sessões (ver documentos/ROTEIRO_COLETA.md)
│   ├── preparar.sh                # preparar.sh <Tn> <etapa>: prepara ~/new-app, fixa modelo/esforço, registra a sessão
│   ├── congelar.sh                # congelar.sh <Tn> <tag>: commit + marcação; nas tags *-final exporta para geracoes/ e ~/tcc-avaliacao/
│   └── auditar_sessao.py          # auditar_sessao.py <Tn> <etapa>: esforço e auditoria de caminhos a partir do transcript
├── infra/mongodb/               # docker-compose.yml (mongo:7.0 em tmpfs, contêiner tcc-mongodb) + reset.sh
├── sonar/                       # análise estática (qualidade estrutural)
│   ├── sonar-common.properties    # configuração única: exclusões, SCM desativado
│   ├── analisar.sh                # analisar.sh <Tn> <dir>: scanner + coleta via API + contagem de testes
│   ├── registrar_versoes.sh       # grava registros/versoes_ambiente.txt (macOS)
│   └── .sonar-token               # token local (não versionado)
├── playwright/                  # suíte funcional congelada (P1–P5)
│   ├── playwright.config.js       # Chromium headless, 1 worker, sem retentativas
│   ├── testes/                    # cenarios.spec.js + contrato.js (valores dos contratos fixos dos prompts)
│   ├── executar.sh                # executar.sh <Tn> <dir>: hash, MongoDB limpo, aplicação, P1–P5, encerramento
│   ├── hash_suite.sh              # calcula o SHA-256 da suíte
│   ├── SUITE_SHA256               # hash congelado; a execução é recusada se divergir
│   └── validacao/                 # validar_suite.sh, aplicação de referência (com variante) e cinco mutantes
├── scripts/                     # coletar_sonar.py, contar_testes.py, consolidar.py (Python, biblioteca padrão)
├── registros/                   # registros da coleta (ver abaixo)
└── resultados/                  # saídas brutas por condição e tabelas consolidadas (ver abaixo)
```

## Registros (`registros/`)

| Arquivo | Conteúdo | Origem |
|---|---|---|
| `versoes_ambiente.txt` | Versões do sistema, Node, SonarQube, scanner, perfis de regras, imagens Docker e Playwright | `sonar/registrar_versoes.sh` |
| `validacao_suite.txt` | Resultado da validação da suíte contra a referência e os mutantes | Registro manual da saída de `validar_suite.sh` |
| `sessoes.csv` | Uma linha por sessão preparada: data, condição, etapa, versão do Claude Code, modelo e esforço | `coleta/preparar.sh` |
| `esforco.csv` | Duração, tokens e interações de cada sessão válida | `coleta/auditar_sessao.py` |
| `auditoria/Tn_etapa.json` | Auditoria de cada transcript: caminhos externos, desvios, modelo e detalhamento de tokens | `coleta/auditar_sessao.py` |
| `descartados/` | Tentativa invalidada (1ª verificação de T4, executada no modelo errado), com o motivo | Arquivamento manual |

`sessoes.csv` inclui a sessão descartada de T4; `esforco.csv` e as tabelas consolidadas, não.

## Resultados (`resultados/`)

- `Tn/sonar/`: `resumo.json`, `measures_raw.json`, `issues_raw.json`, `testes_desenvolvimento.json` e `scanner.log`.
- `Tn/playwright/`: `execucao.json`, `relatorio.json`, `playwright.log` e os logs `npm_*.log` e `mongodb.log`.
- `T1/playwright_tentativa1_icloud/`: primeira execução da suíte sobre T1, feita dentro do iCloud (4/5, com falha de P2 causada pelo ambiente). Foi preservada como evidência do desvio, inclusive com o trace da falha em `artefatos/`, e não entra nos resultados.
- `tabelas/`: `resultados.md` (resumo legível), `estrutural.csv`, `comparacoes.csv`, `funcional.csv` e `testes_desenvolvimento.csv`, gerados por `scripts/consolidar.py`.

## Ordem de uso

1. **Antes da coleta:** `sonar/registrar_versoes.sh` e, se a suíte mudou, `playwright/validacao/validar_suite.sh`.
2. **Em cada etapa da coleta:** `coleta/preparar.sh`, sessão do agente, `coleta/congelar.sh` e `coleta/auditar_sessao.py` ([`documentos/ROTEIRO_COLETA.md`](../documentos/ROTEIRO_COLETA.md)).
3. **Em cada condição congelada (`Tn-final`):** `sonar/analisar.sh` e depois `playwright/executar.sh`, sobre a cópia `~/tcc-avaliacao/Tn` ([`COMO_AVALIAR.md`](COMO_AVALIAR.md)).
4. **Após as quatro condições:** `scripts/consolidar.py`.

## O que é medido

**Estrutural (SonarQube, modo MQR, perfil Sonar way padrão)**

| Métrica | Significado |
|---|---|
| `ncloc` | linhas de código (sem testes) |
| `complexity` | complexidade ciclomática |
| `cognitive_complexity` | complexidade cognitiva |
| `duplicated_lines_density` | % de linhas duplicadas |
| `software_quality_maintainability_issues` | problemas de manutenibilidade |
| `software_quality_maintainability_remediation_effort` | esforço de remediação (min) |

A densidade de problemas (por 1.000 linhas de código) é calculada na consolidação. As métricas legadas `code_smells` e `sqale_index` são coletadas só para auditoria e ficam fora da análise. Métrica ausente é registrada como `null`, nunca como zero.

**Funcional (Playwright)**

- **P1** Login: credenciais válidas exibem a área administrativa; senha inválida não.
- **P2** Cadastro: o produto criado aparece na vitrine e nos detalhes, com os sete campos persistidos.
- **P3** Edição: as alterações persistem na vitrine, nos detalhes e no formulário.
- **P4** Inativação: o produto some da vitrine e permanece inativo na área administrativa.
- **P5** WhatsApp: `whatsapp-button` aponta para o número `5511999999999` (requisições interceptadas).

**Esforço (complementar):** duração do envio do prompt à última mensagem do agente, tokens (entrada, saída, criação e leitura de cache) e interações humanas, extraídos do transcript de cada sessão.

## Regras de integridade

Resumo; as regras completas do protocolo estão em [`COMO_AVALIAR.md`](COMO_AVALIAR.md#5-regras-do-protocolo).


- Suíte congelada por hash (`SUITE_SHA256`): hash divergente faz a execução ser recusada.
- O artefato nunca é corrigido: falhas de build, seed, inicialização ou testes são resultados.
- Os agentes de geração e de correção trabalham fora deste repositório e não têm acesso a `avaliacao/`.
- A consolidação aborta se o hash da suíte ou a versão do SonarQube diferirem entre as condições.

## Requisitos

Lista completa, com versões e instalação, em [`COMO_AVALIAR.md`](COMO_AVALIAR.md#1-pré-requisitos).
