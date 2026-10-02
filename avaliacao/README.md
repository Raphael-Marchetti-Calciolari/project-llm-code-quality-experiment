# avaliacao/

Validadores finais que medem, com instrumentos idênticos, os artefatos congelados das condições T1–T4.

## Estrutura

```
avaliacao/
├── COMO_AVALIAR.md            # procedimento completo (runbook)
├── sonar/                     # análise estática (qualidade estrutural)
│   ├── sonar-common.properties  # configuração única: exclusões, scm desativado
│   ├── analisar.sh              # analisar.sh <Tn> <dir> → scanner + coleta via API
│   ├── registrar_versoes.sh     # grava registros/versoes_ambiente.txt
│   └── .sonar-token             # token local (não versionado)
├── playwright/                # suíte funcional congelada (P1–P5)
│   ├── playwright.config.js     # Chromium headless, workers 1, retries 0
│   ├── testes/                  # cenarios.spec.js + contrato.js (valores dos CONTRATOS FIXOS)
│   ├── executar.sh              # executar.sh <Tn> <dir> → hash, MongoDB limpo, app, P1–P5
│   ├── hash_suite.sh            # calcula o SHA-256 da suíte
│   ├── SUITE_SHA256             # hash congelado; execução recusada se divergir
│   └── validacao/               # validar_suite.sh + app-referencia/ (app mínima) e mutantes
├── scripts/                   # coletar_sonar.py, contar_testes.py, consolidar.py (Python padrão)
├── infra/mongodb/             # docker-compose.yml (mongo:7.0, tmpfs) + reset.sh
├── registros/                 # versoes_ambiente.txt, validacao_suite.txt, esforco.csv (opcional)
└── resultados/                # criado em tempo de execução: Tn/sonar, Tn/playwright, tabelas/
```

## Quando cada ferramenta roda

1. **Antes da coleta:** `registrar_versoes.sh` registra as versões do ambiente.
2. **Por condição**, após o artefato estar congelado na tag `Tn-final`: Sonar (`analisar.sh`) e depois Playwright (`executar.sh`).
3. **Sequencial:** uma condição por vez, com MongoDB limpo a cada rodada.
4. **Após as quatro condições:** `consolidar.py` gera as tabelas.
5. **Só quando a suíte muda:** `validacao/validar_suite.sh`, novo hash e reavaliação de T1–T4.

## Início rápido

```bash
./avaliacao/sonar/analisar.sh      Tn <dir-do-artefato-congelado>
./avaliacao/playwright/executar.sh Tn <dir-do-artefato-congelado>
python3 avaliacao/scripts/consolidar.py      # após as quatro condições
```

Pré-requisitos, saídas, conferências e problemas comuns: [COMO_AVALIAR.md](COMO_AVALIAR.md).

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

`code_smells`/`sqale_index` (legado) são coletados só para auditoria. Métrica ausente = `null`, nunca zero.

**Funcional (Playwright)**

- **P1** Login: credenciais válidas exibem o admin; senha inválida não.
- **P2** Cadastro: produto criado aparece na vitrine e nos detalhes; 7 campos persistidos.
- **P3** Edição: alterações persistem na vitrine, nos detalhes e no formulário.
- **P4** Inativação: produto some da vitrine e permanece inativo no admin.
- **P5** WhatsApp: `whatsapp-button` aponta para o número `5511999999999` (requisições interceptadas).

## Regras de integridade

- Suíte congelada por hash (`SUITE_SHA256`); hash divergente → execução recusada.
- Nunca corrigir o artefato: falhas de build, seed, inicialização ou testes são resultados.
- Agentes de geração/correção não acessam `avaliacao/`; artefatos são gerados fora deste repositório.
- A consolidação aborta se o hash da suíte ou a versão do SonarQube diferirem entre condições.

## Requisitos

- Docker (SonarQube e MongoDB `tcc-mongodb`)
- Node 20.20.2 (`@playwright/test` 1.49.1 fixado localmente)
- Python 3
- sonar-scanner 8.1.0
- SonarQube 26.9 em `http://localhost:9000`
- Token em `avaliacao/sonar/.sonar-token` (não versionado)
