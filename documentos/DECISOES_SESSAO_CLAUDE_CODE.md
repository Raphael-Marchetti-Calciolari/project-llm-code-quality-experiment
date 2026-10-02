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

- **Isolamento simplificado:** todas as etapas rodam em `~/new-app`, fora do repositório e do iCloud, esvaziada a cada etapa (sem remover a pasta). Não há sandbox; a garantia vem da auditoria do transcript, que procura acessos fora de `~/new-app` e marca como desvio os acessos sensíveis (repositório do TCC, transcripts e memória do Claude).
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

### 2026-10-02 — T2 (geração com TDD)

- **Sessão:** Claude Code 2.1.287, Sonnet 5.5, esforço low; sem `/model` nem `/effort` na sessão.
- **Congelamento:** `T2-final` = `6eee00a22413965ed9f9ea04ac1ae34d8b4753a3`.
- **Esforço:** 2,9 min, 690.806 tokens, 1 interação.
- **Auditoria:** 0 desvios e nenhum caminho externo.
- **Observação sobre o TDD:** o transcript mostra testes escritos antes da implementação e executados até falhar (módulo ausente) e depois passar. Os ciclos, porém, foram em **lotes**: arquivos de teste inteiros antes de cada módulo, não um teste por vez. O ajuste dos testes de componente (`components.test.jsx`) aconteceu durante o desenvolvimento, antes do congelamento. O agente informou 21 testes aprovados (14 no servidor, 7 no cliente).
- **Escopo extra relatado pelo agente:**
  - exclusão de produto (`product-delete-{slug}`);
  - configurações da loja em `/admin/loja`.

  Ambos estão previstos no MVP e não são avaliados pela suíte.
- **Evento:** um `sed -i` com sintaxe GNU falhou no macOS (exit 1), e o agente corrigiu na tentativa seguinte.
- **Resultado funcional** (cópia em `~/tcc-avaliacao/T2`, sem reinícios do servidor): P1–P5 aprovados (5/5).
- **SonarQube:**

  | Métrica | Valor |
  |---|---|
  | LOC | 671 |
  | Complexidade ciclomática | 157 |
  | Complexidade cognitiva | 62 |
  | Duplicação | 0,0% |
  | Problemas de manutenibilidade | 9 |
  | Esforço de remediação | 45 min |

- **Testes de desenvolvimento** (fora do SonarQube): 6 arquivos, 191 linhas não vazias.

### 2026-10-02 — Preparação de T3

- `geracoes/T1` continha `node_modules/` e `.scannerwork/`, resíduos da 1ª avaliação, feita dentro do iCloud. O `.scannerwork/` chegou a ser versionado.
- Os resíduos foram removidos e `preparar.sh` passou a excluir `node_modules`, `.scannerwork` e `dist` ao restaurar uma base.
- A base de T3 foi reconstruída e conferida contra os arquivos de `T1-final`: mesma lista e conteúdo idêntico.
- O registro duplicado de preparação em `sessoes.csv` foi removido.
- Nenhuma sessão de agente rodou sobre a base com os resíduos.

### 2026-10-02 — T3 (agente sobre T1)

- **Verificação:**
  - Claude Code 2.1.287, Opus 5.5 (`claude-opus-5-5`), esforço low; somente leitura respeitado (o único arquivo novo é `VERIFICATION_REPORT.md`).
  - `T3-parecer` = `674f2286bdf80eb335dbbc1b8f1a26ec0f7372bb`.
  - Esforço: 1,4 min, 237.744 tokens, 1 interação. Auditoria: 0 desvios.
  - **24 apontamentos:** erros 10, nomes 4, responsabilidades 3, duplicação 4, complexidade 3.
- **Correção:**
  - Sonnet 5.5, esforço low.
  - `T3-final` = `b2363d074ea58849eac8c2534c7fe971ee81a848`. Diff em relação ao parecer: 29 arquivos, +368/−249.
  - Esforço: 2,5 min, 551.503 tokens, 1 interação. Auditoria: 0 desvios.
  - **Aplicação:** 21 apontamentos aplicados integralmente, 1 parcialmente (D-03) e 2 não aplicados (D-01 no frontend e D-02), com justificativa em `CORRECTION_SUMMARY.md`.
- **Evento:** o corretor verificou apenas `which mongod`, concluiu que "MongoDB indisponível" e não validou a API nem a interface de ponta a ponta. O MongoDB do contrato estava ativo e saudável em `127.0.0.1:27017` (reiniciado às 04:58Z, antes da sessão). Validou só o build do frontend, `node --check` e a importação do backend.
- **Decisão:** a etapa **não foi refeita**. A conclusão errada foi do próprio agente, sem falha do ambiente. Repetir a sessão para obter um resultado melhor seria seleção de resultados. Fica registrado como comportamento observado.
- **Resultado funcional** (cópia fora do iCloud, sem reinícios): P1–P5 aprovados (5/5).
- **SonarQube:**

  | Métrica | Valor |
  |---|---|
  | LOC | 709 |
  | Complexidade ciclomática | 163 |
  | Complexidade cognitiva | 54 |
  | Duplicação | 0,0% |
  | Problemas de manutenibilidade | 11 |
  | Esforço de remediação | 51 min |

### 2026-10-02 — T4, 1ª verificação descartada

- **Desvio de protocolo (operação):** na sessão `dadc3571…`, o comando `/model` foi usado e selecionou **Sonnet 5.5**, sobrepondo o Opus 5.5 fixado em `.claude/settings.local.json`; o próprio Claude Code avisou do conflito. O verificador rodou em `claude-sonnet-5-5`, em vez de `claude-opus-5-5`.
- **Decisão:** a etapa foi **refeita**. Diferentemente do evento do MongoDB em T3, aqui o protocolo não foi seguido, o que torna o parecer inválido; refazer não é seleção de resultados.
- O parecer descartado (tag `T4-parecer` = `0ffa2be1…`, 34 apontamentos), sua auditoria e seu esforço (1,2 min; 289.096 tokens) foram arquivados em `avaliacao/registros/descartados/T4_verificacao_tentativa1_modelo_errado/` e ficam fora dos resultados.
- A base T2 foi restaurada do zero para a nova tentativa.
- **Ajustes no script de auditoria:**
  - arquivos `tool-results` gravados pelo próprio Claude Code na pasta da sessão (saídas longas) não contam mais como fuga; a única ocorrência foi uma dessas;
  - a auditoria passou a alertar quando o modelo do transcript difere do exigido para a etapa.
- **Orientação ao pesquisador:** não usar `/model` nem `/effort` nas sessões; apenas conferir com `/status`.

### 2026-10-02 — T4, verificação (2ª tentativa, válida)

- **Sessão:** Opus 5.5, esforço low, conforme o transcript. O pesquisador usou `/model` (Opus 5.5) e `/effort` (low) na sessão; os valores coincidem com o protocolo.
- `T4-parecer` = `dd7aa7e5c30cf58ff1a827f21e9c93288d47551a`.
- **Esforço:** 2,1 min, 244.779 tokens, 1 interação. Auditoria: 0 desvios.
- **Apontamentos:** 27 (C 4, D 6, E 8, N 5, R 4).

### 2026-10-02 — T4, correção e avaliação

- **Sessão:** Sonnet 5.5, esforço low. `/model` e `/effort` foram usados, com valores iguais aos do protocolo.
- `T4-final` = `e9886459b6b3d545e2a5913777fd02614ef194c5`. Diff em relação ao parecer: 26 arquivos, +310/−180.
- **Testes de TDD:** nenhum arquivo de teste foi alterado.
- **Esforço:** 2,1 min, 661.100 tokens, 1 interação. Auditoria: 0 desvios.
- **Aplicação:** o corretor declarou os 27 apontamentos aplicados, com uma ressalva parcial em E5. Validou com `npm test` (servidor 14/14, cliente 7/7) e com o build.
- **Resultado funcional** (cópia fora do iCloud, sem reinícios): P1–P5 aprovados (5/5).
- **SonarQube:**

  | Métrica | Valor |
  |---|---|
  | LOC | 752 |
  | Complexidade ciclomática | 178 |
  | Complexidade cognitiva | 71 |
  | Duplicação | 0,0% |
  | Problemas de manutenibilidade | 10 |
  | Esforço de remediação | 50 min |

- **Testes de desenvolvimento:** 6 arquivos, 191 linhas não vazias (iguais a T2).

### 2026-10-02 — Coleta concluída e consolidação

- As quatro condições foram coletadas e avaliadas com a mesma suíte (`ed6b7cc5…`) e o mesmo SonarQube (26.9.0.129388). A consolidação rodou sem erro de integridade; tabelas em `avaliacao/resultados/tabelas/`.
- **Funcional:** 5/5 em T1, T2, T3 e T4. A suíte não discrimina as condições; a comparação recai sobre os indicadores estruturais e o esforço.
- **Destaques estruturais**, descritivos e sem inferência (n = 1 por condição):
  - **T2−T1:** +27 LOC, complexidade cognitiva +22 (+55%), problemas −1, densidade 15,53 → 13,41 por 1.000 LOC.
  - **T3−T1:** +65 LOC, complexidade cognitiva +14, problemas +1, densidade praticamente igual (−0,01).
  - **T4−T2:** +81 LOC, complexidade cognitiva +9, problemas +1, densidade praticamente igual (−0,11).
  - Duplicação: 0% em todas as condições.
- **Esforço total por condição:**

  | Condição | Duração | Tokens |
  |---|---|---|
  | T1 | 3,7 min | 271.886 |
  | T2 | 2,9 min | 690.806 |
  | T3 | 3,9 min (verificação + correção) | 789.247 |
  | T4 | 4,2 min (verificação + correção) | 905.879 |

  T4 não inclui a tentativa descartada.

## Síntese para o TCC (próxima sessão)

Resumo do fluxo **efetivamente executado**, para incorporar ao documento. Indica-se em cada item a seção provável e se o texto atual precisa ser **corrigido** (diverge do que foi feito) ou só **complementado**.

### 1. Ambiente de execução dos agentes — *corrigir* ("Padronização da geração, verificação e isolamento")

O texto atual diz que geração, verificação e correção ocorrerão "em diretórios dedicados" e que "o mecanismo de restrição de acesso [...] será validado antes do início da coleta". O que foi feito:

- **Diretório único**, reutilizado por todas as etapas: `~/new-app`, fora do repositório do estudo e do iCloud. Antes de cada etapa, o diretório é esvaziado e recebe apenas o conteúdo daquela etapa: vazio para T1/T2, a base congelada para T3/T4.
- **Sem mecanismo de bloqueio** (sandbox, contêiner ou regras de negação). O isolamento foi garantido de duas formas:
  1. separação física: a suíte, as configurações do Sonar e os resultados ficam em outra pasta, e nada no diretório de execução aponta para eles;
  2. **auditoria posterior do transcript** de cada sessão: lista toda chamada de ferramenta com caminho fora de `~/new-app` e classifica como desvio os acessos sensíveis (repositório do estudo, transcripts e memória do Claude Code).
- **Resultado da auditoria:** 0 desvios nas 6 sessões válidas (a 7ª sessão, descartada, foi invalidada pelo modelo errado).
- **Plugins globais do Claude Code desativados** no diretório de execução, porque injetam instruções em toda sessão (por exemplo, uma skill de TDD que contaminaria T1). É um controle de contaminação que merece uma frase.
- **Modelo e esforço** fixados por arquivo de configuração local e conferidos pelo pesquisador com `/status` antes de colar o prompt.
- **Papel do pesquisador** em cada sessão: abrir uma sessão nova, conferir a configuração, colar o prompt integral, não intervir e encerrar ao final. Nenhuma sessão exigiu intervenção (1 interação humana por sessão).

### 2. Congelamento e derivação de T3/T4 — *complementar* (parágrafo de Git)

- Ao fim de cada etapa: commit e tag no repositório do diretório de execução (`T1-final`, `T2-final`, `Tn-parecer`, `Tn-final`). Nas tags `*-final`, o snapshot é exportado (`git archive`) para `geracoes/Tn`, junto com `ORIGEM.txt` (tag, commit, data).
- **T3/T4 não são clonados do repositório original.** A base é restaurada a partir do snapshot exportado (`geracoes/T1` ou `T2`), conferida arquivo a arquivo contra o congelado, e recebe novo commit com a tag da origem.
- Identificadores de versão:

  | Tag | Commit |
  |---|---|
  | `T1-final` | `12f89bce` |
  | `T2-final` | `6eee00a2` |
  | `T3-parecer` | `674f2286` |
  | `T3-final` | `b2363d07` |
  | `T4-parecer` | `dd7aa7e5` |
  | `T4-final` | `e9886459` |

  Hashes completos nas seções de cada condição.

### 3. Avaliação — *complementar* ("Avaliação funcional" / ambiente)

- A avaliação roda sobre uma **cópia idêntica** do snapshot, fora do iCloud (`~/tcc-avaliacao/Tn`), conferida por `diff`. Motivo: a sincronização do iCloud reiniciava o servidor em modo watch durante a suíte (ver T1). É uma limitação do ambiente que vale registrar.
- O MongoDB é reiniciado vazio antes de cada geração e de cada avaliação, e derrubado ao final de cada avaliação.
- Mesma suíte (`ed6b7cc5…`) e mesmo SonarQube (26.9.0.129388) em todas as condições; a consolidação confirmou a integridade.

### 4. Registro de esforço — *complementar* ("Plano de análise" / esforço)

- **Fonte:** o transcript JSONL de cada sessão.
- **Duração:** do envio do prompt à última mensagem do agente; os comandos de configuração ficam de fora.
- **Tokens:** soma de entrada, saída, criação e leitura de cache, com o detalhamento por categoria em `avaliacao/registros/auditoria/`. É um dado complementar; a leitura de cache domina o total.
- **Interações:** mensagens humanas enviadas ao agente; comandos locais (`/model`, `/status`, `/exit`) não contam.
- **Versão do Claude Code** em todas as sessões: 2.1.287.

### 5. Desvios e eventos — *incluir* (resultados ou "Ameaças à validade")

| Condição | Ocorrência | Tratamento |
|---|---|---|
| T1 | 1ª avaliação dentro do iCloud: 4/5 (P2 com HTTP 500 por reinício do servidor causado pela sincronização) | Reavaliado sobre cópia idêntica fora do iCloud: 5/5. A 1ª execução foi preservada. Falha do ambiente, não do artefato. |
| T1 | O agente executou `docker ps` e viu os nomes dos contêineres de avaliação | Evento (informação do ambiente, sem acesso a arquivos) |
| T2 | TDD em lotes (arquivos de teste inteiros antes de cada módulo) | Registrado como observação sobre a aderência ao protocolo de TDD |
| T3 | O corretor concluiu, por engano, que o MongoDB estava indisponível e não validou a aplicação de ponta a ponta | Etapa **não refeita**: é comportamento do agente, e refazer seria seleção de resultados |
| T4 | 1ª verificação executada no modelo errado (Sonnet, selecionado manualmente na sessão) | Etapa **refeita**, por violação do protocolo; o parecer descartado foi arquivado e excluído dos resultados |
| T3/T4 | Resíduos de avaliação (`node_modules`, `.scannerwork`) no snapshot de T1 | Removidos antes de qualquer sessão; a base foi conferida contra `T1-final` |

- **Regra adotada, que vale declarar no TCC:** uma etapa só é refeita quando o *protocolo* não foi seguido (configuração, ambiente). Comportamentos do próprio agente, inclusive erros de julgamento, permanecem como observados.

### 6. Resultados — *incluir* (nova seção ou capítulo de resultados)

- **Funcional:** 5/5 nas quatro condições; nesta amostra, a suíte não diferenciou os tratamentos.
- **Estrutural:** usar `avaliacao/resultados/tabelas/estrutural.csv` e `comparacoes.csv` (com o resumo legível em `resultados.md`). Os destaques estão na seção "Coleta concluída e consolidação" acima.
- **Verificador e corretor:**
  - T3: 24 apontamentos, 21 aplicados, 1 parcial, 2 não aplicados;
  - T4: 27 apontamentos, todos declarados aplicados (1 ressalva).
- **Leitura cautelosa (n = 1 por condição):**
  - as rodadas de verificação e correção aumentaram LOC e complexidade sem reduzir a densidade de problemas medida pelo SonarQube;
  - o TDD gerou menor densidade de problemas e maior complexidade cognitiva que a geração direta.

  Nenhuma inferência estatística.

### 7. Limitações novas — *incluir*

- Uma execução por condição: os resultados são descritivos e sensíveis à variabilidade entre execuções do modelo.
- O isolamento foi verificado por auditoria posterior, não por um bloqueio técnico.
- A suíte funcional atingiu o teto (5/5) em todas as condições e não discriminou os tratamentos.
- A aderência ao TDD em T2/T4 foi parcial (ciclos em lotes).

## Sincronização do TCC

### 2026-10-02 — Material e Métodos (itens 1 a 5 e parte do 7)

- O usuário autorizou editar o `.docx` nesta sessão, mantendo a formatação e a estrutura do template.
- **Tempo verbal:** "Material e Métodos" foi reescrito no pretérito perfeito, na forma impessoal, como exige o manual (item 16.4). Resumo, Introdução, Resultados e Discussão e Conclusão ainda estão no futuro e serão revistos com os resultados.
- **Delineamento:** classificado como quase-experimental (fatores manipulados, sem repetição nem aleatorização), citando Gil (2008), do material de apoio. A referência foi incluída.
- **Item 1 (corrigido):** diretório único fora do repositório e do iCloud, esvaziado a cada etapa; sem bloqueio técnico; auditoria posterior do registro (caminhos e modelo); plugins desativados; papel do pesquisador. O texto não traz caminhos locais.
- **Item 2:** novo subtítulo "Congelamento e derivação das versões". A tabela de marcações e commits não entrou no texto; os identificadores ficam nos registros do repositório.
- **Item 3:** avaliação sobre cópia fora do iCloud, com o motivo; mesma suíte e SonarQube.
- **Item 4:** definição operacional de duração, tokens e interações em "Métricas e coleta automatizada".
- **Item 5:** a regra "refazer só quando o protocolo não foi seguido" entrou em "Rastreabilidade, desvios e limitações" (subtítulo renomeado). A tabela de desvios fica para "Resultados e Discussão", em subtítulo correspondente.
- **Item 7:** só a limitação de desenho (isolamento por auditoria) entrou nos métodos; suíte no teto e TDD em lotes são resultados e serão discutidos lá.
- Não houve renderização visual (sem LibreOffice na máquina); o `.docx` passou na validação XSD e os parágrafos novos usam os mesmos estilos dos originais.

### 2026-10-02 — Resultados e Discussão (itens 5 a 7)

- Subtítulos: aderência ao protocolo e desvios; avaliação funcional; indicadores estruturais; verificação por agente e correção; esforço observado; limitações observadas. Seis tabelas no padrão do manual (item 15.2): título acima, fonte e nota abaixo, só bordas horizontais, sem negrito nem cor.
- **Análise qualitativa** feita por um subagente Opus 5.5 com contexto limpo, somente leitura, comparando pareceres, resumos de correção, diffs e issues do SonarQube. Conferi por amostragem os achados principais antes de usá-los.
- **Achados incorporados:**
  - nenhuma correção removeu issues do Sonar; cada uma acrescentou uma (T3: S1128, import não usado da correção D-03; T4: S6819, literal `role="status"` vindo da C4);
  - a regra S6772 responde por 34 das 40 issues; os critérios do verificador quase não se sobrepõem ao perfil Sonar way;
  - T2 e T1 têm pilhas diferentes (Express 5 + driver nativo + token próprio × Express 4 + Mongoose + jsonwebtoken), o que confunde o efeito do TDD;
  - os resumos de correção superestimam a aplicação (T3 D-03; T4 D3 e D4 parciais);
  - a correção de T4 mudou comportamento sem cobertura da suíte (resposta "JSON inválido" para qualquer 4xx; login com campo ausente → 400).
- **Discrepância técnica:** a métrica legada `code_smells` é sempre o total MQR + 1 (11/10/12/11), e `issues_raw.json` não explica o item extra. O TCC usa só a contagem MQR, e as métricas legadas ficam fora da análise principal, como já declarado em Material e Métodos.
- Citação adicional de Nunes et al. (2025): legibilidade percebida melhorou para 68,63% dos participantes, embora a maioria das soluções tenha introduzido erros ou novos problemas. O texto não traz o percentual.

### 2026-10-02 — Conclusão, Resumo, Introdução e revisão final

- **Conclusão:** responde à questão de pesquisa sem citações nem tabelas, como pede o manual (16.6).
- **Resumo:** reescrito no pretérito, com 240 palavras, incluindo resultados e conclusão. As palavras-chave foram mantidas, pois nenhuma repete o título.
- **Introdução:** questão e objetivos passados para o pretérito.
- **Revisão:**
  - as seis referências estão citadas e todas as citações têm referência;
  - o título tem 12 palavras;
  - a sigla [MVP] foi incluída na primeira ocorrência;
  - não restou verbo no futuro.
- **Pendências do autor:** e-mail do orientador ("[a informar]") e conferência visual do número de páginas (estimativa de 16 a 18 páginas, abaixo do limite de 30).
