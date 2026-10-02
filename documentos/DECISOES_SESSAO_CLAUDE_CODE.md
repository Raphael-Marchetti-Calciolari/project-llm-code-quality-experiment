# Decisões da sessão Claude Code

Registro das decisões tomadas durante a preparação do experimento, para posterior atualização do documento final do TCC (`TCC_Raphael_Marchetti_base_novo_escopo_v1.docx`, fonte de verdade).

## 1. Repositório

- Repositório versionado com git (`.gitignore`: `node_modules/`, `dist/`, `build/`, `.DS_Store`, `.env`).
- A execução do escopo anterior (comparação entre modelos em `Soluções Geradas/T1/`) foi removida da árvore de trabalho; permanece apenas no commit inicial `5cdec36`. Não será usada como resultado de T1–T4.

- Estrutura do repositório (reorganizada para publicação no GitHub): `avaliacao/` (instrumentos de avaliação, MongoDB e runbook), `documentos/` (documentos do TCC, material de apoio e este registro), `geracoes/` (artefatos congelados T1–T4), `prompts/` (prompts do experimento e prompt-base legado).

## 2. Prompts (`prompts/`)

Derivados de `prompts/legado/Prompt de geração - T1 (LLM sem revisão).md`, mantendo a especificação funcional original (objetivo, stack, escopo, dados mínimos, regras e expectativas de qualidade) idêntica em T1 e T2.

| Arquivo | Uso | Papel |
|---|---|---|
| `01_T1_geracao_direta.md` | T1 | Geração direta, autônoma |
| `02_T2_geracao_TDD.md` | T2 | Geração com ciclos de TDD |
| `03_verificador_T3_T4.md` | T3 e T4 | Parecer de boas práticas (somente leitura) |
| `04_corretor_T3_T4.md` | T3 e T4 | Rodada única de correção a partir do parecer |

### Ajustes em relação ao prompt-base anterior

- **Removido** o protocolo de múltiplos modelos/configurações por tratamento (escopo antigo).
- **Adicionada** seção "Regras desta execução": execução autônoma, sem perguntas ao usuário sobre arquitetura, comandos de instalação/build/execução permitidos, sem funcionalidades fora do escopo, autoverificação final e resumo breve ao concluir.
- **T1:** testes espontâneos permitidos, sem exigência de TDD; proibida etapa separada de revisão/refatoração após a conclusão.
- **T2:** ciclos observáveis de TDD (teste falha → implementação mínima → teste passa → refatoração); testes executados durante os ciclos, preservados e não alterados para ocultar falhas; resumo final inclui comandos de testes.
- **Adicionada** seção "CONTRATOS FIXOS DE EXECUÇÃO E INTERFACE" (idêntica em T1 e T2), necessária para que uma única suíte Playwright rode contra os quatro artefatos, sem impor arquitetura interna:
  - Execução: frontend `http://localhost:5173`; API `http://localhost:3000/api`; MongoDB `mongodb://127.0.0.1:27017/tcc_catalog`; scripts na raiz `npm install`, `npm run dev`, `npm run seed`, `npm run reset-db`.
  - Credenciais sintéticas: `admin@teste.local` / `admin123`.
  - Rotas: `/`, `/produtos/:slug`, `/admin/login`, `/admin`, `/admin/produtos/novo`, `/admin/produtos/:id/editar`.
  - Seed: WhatsApp `5511999999999`; produto ativo `Produto Fixture` (`produto-fixture`, `R$ 10,00`, descrições fixas, imagem por URL).
  - Seletores `data-testid` fixos para login, formulário de produto, linha administrativa, editar, ativar/inativar, card público, detalhes e botão de WhatsApp.
- **Verificador (03):** avalia apenas nomes, responsabilidades, duplicação, complexidade de fluxo e tratamento de erros; não altera arquivos; sem acesso a SonarQube/Playwright; sem nota agregada; saída `VERIFICATION_REPORT.md` com identificador, arquivo, trecho, problema, justificativa e correção sugerida.
- **Corretor (04):** uma única rodada; preserva requisitos e testes de desenvolvimento (inclusive os de TDD); pode executar testes existentes, build e inicialização; não acessa a suíte final nem relatórios do SonarQube; registra apontamentos não aplicados; saída `CORRECTION_SUMMARY.md`.

### Decisões de escopo

- Não haverá rota fixa nem cenário Playwright para configurações da vitrine; P1–P5 permanecem como definidos no documento.
- Os testes de desenvolvimento (unitários/TDD) já cobrem validação interna e ficam fora da análise de produção do SonarQube.

## 3. MongoDB

- Um único servidor MongoDB compartilhado, em Docker; as condições são executadas **uma por vez** (sem instância por repositório).
- Arquivos: `avaliacao/infra/mongodb/docker-compose.yml` e `avaliacao/infra/mongodb/reset.sh`.
- Imagem `mongo:7.0` (versão efetiva verificada: **7.0.43**; image ID `sha256:41d8560e5c8d…e2ce`), porta `127.0.0.1:27017`, contêiner `tcc-mongodb`.
- Dados em `tmpfs` (sem persistência): `reset.sh` derruba o contêiner, descarta os dados e sobe uma instância limpa, aguardando o healthcheck. Reset validado (dados inseridos não persistem após o reset).
- Procedimento: executar `./avaliacao/infra/mongodb/reset.sh` antes de cada geração e de cada avaliação; em seguida, o `npm run seed` da própria aplicação prepara os dados.
- Texto a incluir no TCC (seção de ambiente): MongoDB 7.0.43 em contêiner Docker, reiniciado em estado vazio antes de cada condição.

## 4. SonarQube (análise estática → qualidade estrutural)

- Arquivos: `avaliacao/sonar/sonar-common.properties` (configuração única), `avaliacao/sonar/analisar.sh <Tn> <dir>` (execução), `avaliacao/sonar/registrar_versoes.sh` (registro de versões → `avaliacao/registros/versoes_ambiente.txt`), `avaliacao/scripts/coletar_sonar.py` (coleta via API), `avaliacao/scripts/contar_testes.py` (descrição dos testes excluídos).
- Versões efetivas: servidor **SonarQube 26.9.0.129388** (`sonarqube:community`, image ID `sha256:8e79c4957e1e…7ddc`), **SonarScanner CLI 8.1.0.6389**, Node 20.20.2.
- Modo de qualidade **MQR** ativo. Métricas do estudo: `ncloc`, `complexity` (ciclomática), `cognitive_complexity`, `duplicated_lines_density`, `software_quality_maintainability_issues` (problemas de manutenibilidade) e `software_quality_maintainability_remediation_effort` (esforço de remediação, minutos). `code_smells`/`sqale_index` (modelo legado) são coletados apenas para auditoria.
- Perfil de regras: **Sonar way** padrão do servidor (js 420, ts 435, css 40, web 61 regras ativas), sem customização.
- Escopo analisado (`sonar.sources=.`) com exclusões idênticas para todas as condições: dependências, build/cobertura, testes (`*.test.*`, `*.spec.*`, `__tests__`, `test/`, `tests/`, `e2e/`) e configurações de ferramentas de teste (jest/vitest/playwright/cypress). Justificativa: arquivos de teste e suas configurações existem em T2/T4 por exigência do TDD e distorceriam LOC e problemas de produção.
- Testes de desenvolvimento são descritos separadamente (quantidade de arquivos e linhas não vazias) por `contar_testes.py`, com os mesmos padrões das exclusões.
- `sonar.scm.disabled=true` (sem dependência de histórico git); chave de projeto `tcc-T1`…`tcc-T4`.
- Ausência de métrica é gravada como `null`, nunca como zero.
- Validado com projeto descartável: só o arquivo de produção foi indexado; testes, `node_modules`, `dist` e `vitest.config` foram excluídos; métricas e problemas coletados corretamente.
- Token de análise local em `avaliacao/sonar/.sonar-token` (fora do git).
- Texto a incluir no TCC: versões acima, modo MQR, perfil Sonar way padrão e a lista de exclusões.

## 5. Suíte Playwright congelada (avaliação funcional → "funciona?")

- Local: `avaliacao/playwright/` — fora dos diretórios de geração; **as sessões de geração/correção devem rodar em diretórios fora deste repositório** para que os agentes não acessem a suíte.
- Versões: **@playwright/test 1.49.1** fixado localmente (`package-lock.json`), **Chromium 131.0.6778.33** (build 1148). Observação: o Playwright global instalado na máquina é 1.63.0; a suíte usa apenas a versão local 1.49.1, conforme o documento.
- Configuração (`playwright.config.js`): somente Chromium, headless, `workers: 1`, `retries: 0`, timeout por cenário 90 s, asserções 10 s, ações 10 s, navegação 30 s; trace/screenshot apenas em falha.
- Um teste por cenário (`testes/cenarios.spec.js`), utilitários e valores do contrato em `testes/contrato.js`. Todos os valores vêm exclusivamente de "CONTRATOS FIXOS" dos prompts (URLs, credenciais, rotas, seed, `data-testid`).
- Preparação independente: antes de cada cenário, `npm run reset-db` (contrato) no projeto avaliado; imagens de teste (`https://example.com/tcc/*`) respondidas localmente pelo Playwright.
- Cenários:
  - **P1:** sessão limpa com credenciais válidas → linha `admin-product-row-produto-fixture` visível em `/admin`; outra sessão limpa com senha inválida → `/admin` não exibe a linha.
  - **P2:** cria produto ativo em `/admin/produtos/novo` → após recarregar, card em `/` e detalhes em `/produtos/:slug` contendo o nome → reabre a edição e confere os 7 campos persistidos.
  - **P3:** edita o `Produto Fixture` (nome, descrições, preço, imagem; slug mantido) → após recarregar, vitrine e detalhes exibem o novo nome → reabre a edição e confere todos os campos editados.
  - **P4:** pré-condição (card visível) → `product-toggle-active-produto-fixture` → card ausente em `/` após recarregar → linha preservada em `/admin` com estado inativo no formulário.
  - **P5:** em `/produtos/produto-fixture`, o `whatsapp-button` aponta para WhatsApp (`wa.me`, `api/web.whatsapp.com` ou `whatsapp://`) com o número `5511999999999`; requisições ao WhatsApp são interceptadas e respondidas localmente (nada é enviado).
- Tolerâncias aplicadas igualmente a todas as condições (não há exceções por tratamento): `product-active` pode ser checkbox/radio, select ou controle `aria-checked/aria-pressed`; o botão de WhatsApp pode ser link (`href`) ou botão com `window.open`; após o login, se a aplicação não redirecionar, a suíte acessa a rota `/admin` do contrato.
- Premissa documentada: a sessão administrativa deve sobreviver à navegação direta para as rotas do contrato no mesmo navegador (cookie/localStorage).
- Execução (`executar.sh <Tn> <dir>`): verifica o hash da suíte → exige portas 5173/3000 livres → MongoDB limpo (`avaliacao/infra/mongodb/reset.sh`) → `npm install` → `npm run seed` → `npm run dev` → aguarda até 180 s por `:5173` e `:3000/api` → executa P1–P5 → encerra todos os processos. Falhas de install/seed/inicialização são gravadas em `execucao.json` (cenários ficam "não executados"). Saídas em `avaliacao/resultados/<Tn>/playwright/`.
- Congelamento: SHA-256 da suíte (config, dependências fixadas e testes) = **`ed6b7cc531641ab932b5ecdb4e2eb06720fb1fcd293141643dc24ceeeb8b1685`** (`SUITE_SHA256`; versão anterior `e6033d6c065a…` substituída antes de qualquer coleta). A execução é recusada se o hash divergir. Qualquer correção futura exige novo hash e reavaliação de todas as condições.
- Verificação antes do congelamento (`validacao/validar_suite.sh`), com aplicação de referência mínima que cumpre o contrato (`validacao/app-referencia/`) e falhas deliberadas: referência e variante com controles alternativos → 5/5 aprovados; cada mutante (login aceita qualquer senha, criação não persiste, edição ignora preço, inativo na vitrine, número de WhatsApp errado) → reprovado **exatamente** no cenário-alvo (P1…P5). Resultado: **SUÍTE VALIDADA** (`avaliacao/registros/validacao_suite.txt`).
- Limitação a registrar no TCC: P1–P5 não cobrem exclusão de produto nem configurações da vitrine.
- **Revisão de generalidade** (agente revisor, somente leitura) e ajustes aplicados antes de qualquer coleta, para que implementações válidas segundo os prompts não sejam reprovadas por suposições da suíte:
  1. página de detalhes: verifica apenas o nome (os prompts não exigem exibir preço/descrição completa nem fixam formatação); todos os valores continuam conferidos no formulário de edição;
  2. confirmações nativas (`window.confirm`) são aceitas automaticamente (ex.: confirmação ao inativar);
  3. destino do WhatsApp lido do próprio elemento, de um link ancestral ou de um link descendente do `whatsapp-button`;
  4. estado de `product-active` também lido de `data-state`, `data-active` e `data-checked` (além de checkbox/select/`aria-*`);
  5. após salvar e após ativar/inativar, a suíte aguarda a resposta da requisição de escrita (não GET), em vez de depender só de `networkidle`.
- Premissas remanescentes, a declarar como limitações: sessão administrativa persiste na navegação direta às rotas do contrato; `reset-db` com a aplicação em execução pressupõe ausência de cache em memória; URL da imagem armazenada sem normalização; listagem administrativa em `/admin` (única rota administrativa do contrato compatível).

## 6. Scripts de análise (saídas brutas → tabelas de resultados)

- Arquivo: `avaliacao/scripts/consolidar.py` (Python padrão, sem dependências). Uso: `python3 avaliacao/scripts/consolidar.py` → `avaliacao/resultados/tabelas/`.
- Entradas por condição: `sonar/resumo.json`, `sonar/testes_desenvolvimento.json`, `playwright/execucao.json`, `playwright/relatorio.json`. Entrada opcional: `avaliacao/registros/esforco.csv` (`condicao,etapa,duracao_min,tokens,interacoes`).
- Saídas: `estrutural.csv` (indicadores por condição), `comparacoes.csv` (pareadas), `funcional.csv` (P1–P5 com motivo), `testes_desenvolvimento.csv`, `resultados.md` (resumo legível).
- Regras implementadas conforme o "Plano de análise":
  - comparações **T2−T1** (TDD), **T3−T1** (agente sobre geração direta), **T4−T2** (agente sobre TDD) e **T4−T3** rotulada como contraste descritivo;
  - diferença absoluta sempre; variação percentual somente com referência ≠ 0 (senão "não calculável (referência = 0)");
  - densidade = 1.000 × problemas ÷ LOC, somente com LOC > 0;
  - dado ausente → "não disponível", nunca zero; nenhuma pontuação agregada;
  - funcional: aprovado / reprovado / não executado com motivo (inclui Expected/Received da asserção), fração aprovados/5, falhas de inicialização em seção própria;
  - esforço (duração, tokens, interações) apenas complementar; sem registro → "não registrado".
- Integridade: a consolidação **é abortada** se o hash da suíte ou a versão do SonarQube diferirem entre condições ("resultados de versões diferentes não serão combinados"); ausência de registro gera aviso.
- Validado com dados sintéticos cobrindo: execução normal, referência zero (sem %), condição sem dados do SonarQube, falha de inicialização (seed) e hash divergente (abortado).

### Fluxo completo de avaliação por condição

```
./avaliacao/sonar/analisar.sh      Tn <dir-do-artefato-congelado>
./avaliacao/playwright/executar.sh Tn <dir-do-artefato-congelado>
python3 avaliacao/scripts/consolidar.py      # após as quatro condições
```

## 7. Protocolo de execução

### 7.1 Modelos

| Papel | Etapas | Modelo | Esforço |
|---|---|---|---|
| Gerador | T1, T2 | Claude **Sonnet 5.5** (`claude-sonnet-5-5`) | low |
| Verificador | T3, T4 (prompt 03) | Claude **Opus 5.5** (`claude-opus-5-5`) | low |
| Corretor | T3, T4 (prompt 04) | Claude **Sonnet 5.5** (`claude-sonnet-5-5`), o mesmo gerador | low |

- Justificativa: o Sonnet 5.5 com esforço baixo dá qualidade consistente com respostas mais rápidas. O corretor é o próprio gerador, como prevê o documento ("O modelo gerador será responsável por aplicar os pareceres").
- Executados via Claude Code. Antes de cada sessão, registrar a versão do Claude Code, o modelo e o esforço efetivos.
- ⚠ Ajustar no TCC: o documento descreve o verificador como "de configuração leve". Com o Opus 5.5, a leveza vem do esforço *low*, não do porte do modelo; o texto deve dizer isso.

### 7.2 Sem limites de execução

- Não haverá teto de duração, tokens ou passos em nenhuma etapa; cada modelo decide quando concluir. Os prompts não mencionam limites.
- O consumo efetivo continua registrado por etapa, como dado complementar (`avaliacao/registros/esforco.csv`), sem ser usado como critério.
- ⚠ Ajustar no TCC: o documento diz que "os limites de duração, tokens ou passos [...] serão definidos numericamente e registrados", e que T1/T2 e T3/T4 teriam tetos iguais. Esse trecho deve passar a dizer que as execuções não terão limites, que o consumo será observado e reportado, e que, por isso, a comparação considera esforço observado, não esforço controlado.

### 7.3 Isolamento do diretório de geração

- Cada geração e cada correção roda num diretório dedicado, **fora deste repositório**. Os agentes não devem ter motivo nem meio de ler `avaliacao/` (suíte, configuração do Sonar, resultados) nem outras condições.
- **A definir** (proposta para validar):
  - diretórios como `~/tcc-execucoes/T1`…`T4`, sem relação de pasta com o repositório do TCC;
  - em cada diretório, uma regra de permissão do Claude Code negando leitura e execução fora dele (por exemplo, `deny` para `Read(~/Library/Mobile Documents/**)` e `Read(~/tcc-execucoes/<outras condições>/**)`), sem nenhum texto que aponte para a avaliação;
  - **auditoria de fuga**: depois de cada sessão, um script percorre o transcript da sessão (JSONL) e lista toda chamada de ferramenta (`Read`, `Bash`, `Glob`, `Grep` etc.) que cite um caminho fora do diretório da condição. Toda ocorrência é registrada como desvio de protocolo.

### 7.4 Congelamento por etapa (git)

- Cada artefato tem seu próprio repositório git. Ao fim de cada etapa: commit + tag, sem nenhuma alteração manual.
  - T1: `T1-final`. T2: `T2-final`.
  - T3: cópia congelada de `T1-final` (clone a partir da tag) → verificador → tag `T3-parecer` → corretor → `T3-final`.
  - T4: cópia congelada de `T2-final` → verificador → `T4-parecer` → corretor → `T4-final`.
- T3 e T4 não geram nada do zero: são uma rodada adicional sobre a base congelada, o que economiza tempo e tokens. T1 e T2 continuam intocados para comparação pareada.
- O hash do commit de cada tag é registrado como "identificador de versão" exigido pelo documento.

### 7.5 Isolamento de sessão e execução sequencial

- Uma sessão nova do Claude Code por etapa (geração, verificação, correção), sem histórico e sem subagentes compartilhados. Execução **sequencial**: uma condição e uma etapa por vez.
- Ciclo de avaliação por condição: MongoDB limpo → Sonar + Playwright → saídas salvas em `avaliacao/resultados/Tn/` → **limpeza do MongoDB** (derrubar o contêiner e descartar os dados) antes da próxima condição.
- ⚠ Implementar: hoje o `executar.sh` só limpa o MongoDB no **início**. Falta a limpeza ao final de cada rodada.

## 8. Pendências

- Definir e validar o mecanismo de isolamento de diretório e o script de auditoria de fuga (7.3).
- Implementar a limpeza do MongoDB ao final de cada rodada (7.5).
- Registrar versões do Claude Code, modelos e esforço efetivos no início da coleta.
- Atualizar no documento do TCC:
  - versões efetivas (Playwright: suíte local 1.49.1, global 1.63.0; MongoDB 7.0.43; SonarQube 26.9.0.129388 em modo MQR);
  - os modelos e o esforço (7.1);
  - a remoção dos limites de execução (7.2);
  - o verificador "leve" (7.1).
