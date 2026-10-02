# Decisões da sessão Claude Code

Registro vivo das decisões tomadas durante o experimento, para posterior atualização do documento do TCC (`documentos/tcc/TCC_Raphael_Marchetti_base_novo_escopo_v1.docx`, fonte de verdade).

As decisões da fase de preparação já foram incorporadas ao documento do TCC. O registro completo daquela fase está no histórico do git (commit anterior a este arquivo ser reiniciado).

## Ajustes de alinhamento aplicados ao TCC

- Sessão nova do Claude Code em cada etapa (geração, verificação e correção), sem histórico nem subagentes compartilhados.
- Versão do Claude Code, modelo e esforço registrados antes de cada sessão; justificativa da escolha do Sonnet 5.5 com esforço low.
- Qualquer alteração da suíte exige novo hash e a reavaliação de todas as condições.
- "Rotas públicas do contrato" corrigido para "rotas do contrato".
- Referência "Best Practices" do Playwright citada no texto.
- Declarado que detalhes de implementação (tempos, tolerâncias, scripts) ficam documentados no repositório público.

## Decisões da coleta

### 2026-10-02 — Fluxo de execução

- **Isolamento simplificado:** todas as etapas rodam em `~/new-app`, fora do repositório e do iCloud, recriada a cada etapa. Não há sandbox; a garantia vem da auditoria do transcript, que procura acessos fora de `~/new-app` e marca como desvio os acessos sensíveis (repositório do TCC, transcripts e memória do Claude).
- **Plugins globais desativados** em `~/new-app` (`superpowers`, `frontend-design`, `code-review`, `context7`). Motivo: injetam instruções em toda sessão, incluindo uma skill de TDD que contaminaria T1.
- **Modelo e esforço** fixados por `.claude/settings.local.json` em `~/new-app`. Versão do Claude Code, modelo e esforço são registrados por sessão em `avaliacao/registros/sessoes.csv`. Versão no início da coleta: 2.1.287.
- **Base de T3/T4:** restaurada a partir do snapshot `geracoes/T1|T2`, com um commit e a tag `T1-final`/`T2-final` no novo repositório.
- **Avaliação** sobre cópias idênticas dos snapshots em `~/tcc-avaliacao/Tn`, fora do iCloud (ver T1).
- **Esforço:** duração da 1ª à última mensagem; tokens = soma de entrada, saída, criação e leitura de cache (o detalhamento fica em `avaliacao/registros/auditoria/`); interações = mensagens humanas na sessão.
- **MongoDB:** `executar.sh` agora também derruba o MongoDB ao final de cada rodada. O hash da suíte não mudou (`ed6b7cc5…`).
- Scripts em `avaliacao/coleta/`; roteiro em `documentos/ROTEIRO_COLETA.md`.
- **Restrição:** o `.docx` do TCC não será mais alterado nesta fase.

### 2026-10-02 — T1 (geração direta)

- **Sessão:** Claude Code 2.1.287, Sonnet 5.5 (`claude-sonnet-5-5`), esforço low; plugins desativados (conferido pelo pesquisador com `/plugin`). O pesquisador usou `/model` e `/effort` na sessão; esses comandos não contam como interação.
- **Congelamento:** `T1-final` = `12f89bce0696eaeb383c6fb9feb3ad18e1320da0`.
- **Esforço:** 3,7 min (do prompt à última mensagem), 271.886 tokens, 1 interação.
- **Auditoria:** 0 desvios e nenhum caminho externo.
- **Evento:** o agente executou `docker ps` e viu os nomes dos contêineres `tcc-mongodb` e `sonarqube`. É exposição de informação do ambiente, sem acesso a arquivos; registrado como evento, não como desvio.
- **Evento:** o "exit code 1" relatado pelo pesquisador foi o erro de um comando de teste do próprio agente (curl), não uma falha da sessão. A sessão terminou normalmente.
- **Ajuste do script de auditoria:**
  - comandos locais (`/model`, `/effort`, `/plugin`, `/exit`) deixaram de contar como interação;
  - a duração passou a contar a partir do envio do prompt;
  - números recalculados antes do registro.
- **Desvio do ambiente de avaliação:**
  - **1ª execução** da suíte sobre `geracoes/T1`, dentro do iCloud: 4/5, com P2 reprovado (POST → 500).
  - **Causa:** o `node --watch` do backend reiniciou 4 vezes durante a suíte, sem alteração de código, por causa da sincronização do iCloud nos arquivos recém-criados. A requisição de criação caiu durante um reinício.
  - **2ª execução**, sobre uma cópia idêntica em `~/tcc-avaliacao/T1` (`diff` sem diferenças): **5/5**, sem nenhum reinício.
  - **Decisão:** todas as avaliações passam a usar a cópia fora do iCloud, que `congelar.sh` passa a criar. A 1ª execução foi preservada em `avaliacao/resultados/T1/playwright_tentativa1_icloud/`. A suíte e o hash não mudaram.
- **Resultado funcional:** P1–P5 aprovados (5/5).
- **SonarQube** (sobre a cópia):

  | Métrica | Valor |
  |---|---|
  | LOC | 644 |
  | Complexidade ciclomática | 140 |
  | Complexidade cognitiva | 40 |
  | Duplicação | 0,0% |
  | Problemas de manutenibilidade | 10 |
  | Esforço de remediação | 50 min |
