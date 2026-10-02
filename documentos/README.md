# documentos/

Documentos do TCC (MBA Engenharia de Software, USP/Esalq), material de apoio do curso e registro de decisões da implementação do experimento.

## Arquivos

| Arquivo | O que é | Status |
|---|---|---|
| `tcc/TCC_Raphael_Marchetti_base_novo_escopo_v1.docx` | Texto do TCC no escopo atual (T1–T4) | **Fonte de verdade** |
| `tcc/TCC_Raphael_Marchetti_escopo_atualizado.docx` | Texto do TCC com escopo atualizado, anterior à v1 | Versão anterior |
| `tcc/[Projeto de pesquisa] - Raphael Marchetti Calciolari_original.docx` | Projeto de pesquisa original | Entrega de etapa anterior |
| `tcc/[Resultados Preliminares] - Raphael Marchetti Calciolari_original.docx` | Resultados preliminares | Entrega de etapa anterior |
| `tcc/[FDE] - Raphael Marchetti Calciolari.pdf` | Entrega FDE | Entrega de etapa anterior |
| `tcc/Resultado - Raphael Marchetti Calciolari-1.pdf` | Resultado de etapa | Entrega de etapa anterior |
| `material-de-apoio/*` | Manual de normas, metodologias de pesquisa, templates, termo de anuência etc. | Material do curso |
| `DECISOES_SESSAO_CLAUDE_CODE.md` | Registro de decisões da implementação | Documento vivo |

## Desenho do estudo (resumo da v1)

Estudo aplicado, exploratório e quantitativo, com dois fatores (TDD sim/não; verificação de boas práticas por agente + uma rodada de correção sim/não) aplicados à geração de uma mesma aplicação web (catálogo de produtos para pequenas lojas):
**T1** geração direta · **T2** geração com TDD · **T3** T1 + verificação/correção por agente · **T4** T2 + verificação/correção por agente.
Instrumentos comuns às quatro condições: **SonarQube** (complexidades ciclomática e cognitiva, duplicação, problemas de manutenibilidade, esforço de remediação) e uma **suíte Playwright congelada** antes da geração, com cenários **P1–P5**.
Comparações pareadas e descritivas (melhorias, ausência de alteração e regressões), sem revisão humana do código como tratamento.

## `DECISOES_SESSAO_CLAUDE_CODE.md`

Registro vivo das decisões tomadas durante a preparação do experimento, que precisam ser incorporadas ao texto final do TCC. Seções:

1. **Repositório** — versionamento, remoção do escopo anterior e estrutura de pastas.
2. **Prompts** — prompts T1/T2, verificador e corretor; contratos fixos de execução e interface.
3. **MongoDB** — instância Docker única, efêmera, reiniciada antes de cada condição.
4. **SonarQube** — versões, modo MQR, perfil Sonar way, métricas e exclusões.
5. **Suíte Playwright congelada** — cenários P1–P5, tolerâncias, hash de congelamento e validação.
6. **Scripts de análise** — consolidação das saídas brutas em tabelas e regras de comparação.
7. **Protocolo de execução** — modelos, ausência de limites, isolamento de diretório/sessão e congelamento por git.
8. **Pendências** — o que falta implementar e atualizar no documento.

> Itens marcados com **"⚠ Ajustar no TCC"** e a seção **Pendências** indicam o que ainda precisa ser refletido no `.docx` fonte de verdade.
