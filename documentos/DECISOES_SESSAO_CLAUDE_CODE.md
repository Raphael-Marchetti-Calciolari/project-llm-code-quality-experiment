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
- **Avaliação sobre os snapshots** em `geracoes/Tn`.
- **Esforço:** duração da 1ª à última mensagem; tokens = soma de entrada, saída, criação e leitura de cache (o detalhamento fica em `avaliacao/registros/auditoria/`); interações = mensagens humanas na sessão.
- **MongoDB:** `executar.sh` agora também derruba o MongoDB ao final de cada rodada. O hash da suíte não mudou (`ed6b7cc5…`).
- Scripts em `avaliacao/coleta/`; roteiro em `documentos/ROTEIRO_COLETA.md`.
- **Restrição:** o `.docx` do TCC não será mais alterado nesta fase.
