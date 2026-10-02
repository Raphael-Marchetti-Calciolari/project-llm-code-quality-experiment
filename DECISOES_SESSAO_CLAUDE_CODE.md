# Decisões da sessão Claude Code

Registro das decisões tomadas durante a preparação do experimento, para posterior atualização do documento final do TCC (`TCC_Raphael_Marchetti_base_novo_escopo_v1.docx`, fonte de verdade).

## 1. Repositório

- Repositório versionado com git (`.gitignore`: `node_modules/`, `dist/`, `build/`, `.DS_Store`, `.env`).
- A execução do escopo anterior (comparação entre modelos em `Soluções Geradas/T1/`) foi removida da árvore de trabalho; permanece apenas no commit inicial `5cdec36`. Não será usada como resultado de T1–T4.

## 2. Prompts (`New Prompts/`)

Derivados de `Prompt de geração - T1 (LLM sem revisão).md`, mantendo a especificação funcional original (objetivo, stack, escopo, dados mínimos, regras e expectativas de qualidade) idêntica em T1 e T2.

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
- Arquivos: `infra/mongodb/docker-compose.yml` e `infra/mongodb/reset.sh`.
- Imagem `mongo:7.0` (versão efetiva verificada: **7.0.43**; image ID `sha256:41d8560e5c8d…e2ce`), porta `127.0.0.1:27017`, contêiner `tcc-mongodb`.
- Dados em `tmpfs` (sem persistência): `reset.sh` derruba o contêiner, descarta os dados e sobe uma instância limpa, aguardando o healthcheck. Reset validado (dados inseridos não persistem após o reset).
- Procedimento: executar `./infra/mongodb/reset.sh` antes de cada geração e de cada avaliação; em seguida, o `npm run seed` da própria aplicação prepara os dados.
- Texto a incluir no TCC (seção de ambiente): MongoDB 7.0.43 em contêiner Docker, reiniciado em estado vazio antes de cada condição.

## 4. Pendências

- Definir e registrar modelo gerador (versão + esforço) e modelo verificador (leve).
- Definir limites numéricos por etapa (geração; verificação + correção).
- Configuração do SonarQube (`sonar-project.properties`, perfil de regras, exclusões) e registro de versões.
- Suíte Playwright P1–P5 congelada, fora do alcance dos agentes, com hash registrado.
- Scripts de análise (densidade de problemas, consolidação).
- T3/T4: verificador e corretor em sessões novas e isoladas (não subagentes na mesma sessão).
