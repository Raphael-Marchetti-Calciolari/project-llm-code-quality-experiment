# documentos/

Registro de decisões do experimento e roteiro da coleta.

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| [`DECISOES_SESSAO_CLAUDE_CODE.md`](DECISOES_SESSAO_CLAUDE_CODE.md) | Log cronológico das decisões, desvios e eventos da coleta e da redação do TCC |
| [`ROTEIRO_COLETA.md`](ROTEIRO_COLETA.md) | Procedimento executado em cada etapa (geração, verificação e correção) |

## Documentos não versionados

O texto do TCC, as entregas das etapas anteriores e o material de apoio do curso (manual de normas, metodologias de pesquisa e modelos) ficam fora do repositório: contêm dados pessoais ou são material de terceiros (PECEGE/USP-Esalq). Foram removidos também do histórico do git em 2026-10-02.

- **TCC:** "Validações programáticas e por agentes na qualidade de código gerado por modelos de linguagem", MBA em Engenharia de Software, USP/Esalq, 2026. É a fonte oficial de resultados, discussão e limitações.
- **Normas de formatação:** seguem o manual de normas para trabalhos de conclusão de curso do MBA USP/Esalq, disponível aos alunos do curso.

## Desenho do estudo

Estudo aplicado, exploratório, quantitativo e quase-experimental: dois fatores manipulados (TDD sim/não; verificação por agente seguida de correção sim/não), sem repetição nem aleatorização, aplicados à geração de uma mesma aplicação web (catálogo de produtos para pequenas lojas).

- **T1** geração direta · **T2** geração com TDD · **T3** T1 + verificação por agente seguida de correção · **T4** T2 + verificação por agente seguida de correção.
- **Modelos:** Claude Code 2.1.287; gerador e corretor Claude Sonnet 5.5, verificador Claude Opus 5.5, todos com esforço low.
- **Instrumentos comuns:** SonarQube (complexidades ciclomática e cognitiva, duplicação, problemas de manutenibilidade e esforço de remediação) e uma suíte Playwright congelada antes da geração, com os cenários P1–P5.
- **Análise:** comparações pareadas e descritivas, com uma execução por condição (n = 1), sem revisão humana do código como tratamento.

## Log de decisões

O [`DECISOES_SESSAO_CLAUDE_CODE.md`](DECISOES_SESSAO_CLAUDE_CODE.md) é cronológico; entradas novas são acrescentadas ao final. Seções:

1. **Ajustes de alinhamento aplicados ao TCC:** decisões da fase de preparação já incorporadas ao texto. O registro completo dessa fase está no histórico do git.
2. **Decisões da coleta:** fluxo de execução e uma entrada por etapa (T1 a T4), com sessão, congelamento, esforço, auditoria, eventos e resultados; inclui a verificação descartada de T4 e a consolidação.
3. **Síntese para o TCC:** resumo do fluxo efetivamente executado, dos desvios e das limitações. Todo o conteúdo já foi incorporado ao texto.
4. **Sincronização do TCC:** registro das revisões do texto (Material e Métodos, Resultados e Discussão, Conclusão, Resumo e revisão final).
5. **Documentação do repositório:** revisão da documentação, licenças e remoção de dados pessoais do histórico.

As menções a `documentos/tcc/` no log referem-se a arquivos que hoje não são versionados.
