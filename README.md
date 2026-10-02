# Validações programáticas e por agentes na qualidade de código gerado por LLMs

TCC do MBA em Engenharia de Software (USP/Esalq). Este estudo exploratório verifica se o **TDD** e a **verificação de boas práticas por agente, seguida de uma rodada de correção**, alteram a qualidade estrutural e funcional do código gerado por LLMs.

## Delineamento

As quatro condições geram a mesma aplicação: um catálogo de produtos para pequenas lojas, em React + Vite, Node.js e MongoDB.

| Condição | Geração | Verificação por agente + correção |
|---|---|---|
| T1 | direta | — |
| T2 | com TDD | — |
| T3 | cópia congelada de T1 | ✓ |
| T4 | cópia congelada de T2 | ✓ |

Os mesmos instrumentos avaliam todas as condições:

- **SonarQube**, para a qualidade estrutural;
- uma **suíte Playwright congelada** com os cenários P1–P5, para a avaliação funcional.

As comparações são pareadas: T2−T1, T3−T1 e T4−T2.

## Estrutura

| Pasta | Conteúdo |
|---|---|
| [`prompts/`](prompts/) | Prompts de geração (T1, T2), do verificador e do corretor (T3, T4) |
| [`avaliacao/`](avaliacao/) | Instrumentos de avaliação: SonarQube, suíte Playwright, MongoDB, consolidação e runbook |
| [`geracoes/`](geracoes/) | Artefatos gerados e congelados (T1–T4) |
| [`documentos/`](documentos/) | Documentos do TCC, material do curso e registro de decisões |

## Fluxo do experimento

1. Gerar T1 e T2 com os [prompts](prompts/), em sessões isoladas e fora deste repositório, e congelar cada artefato com uma tag git.
2. Criar T3 e T4 a partir das cópias congeladas: verificador → corretor → congelamento.
3. Avaliar cada condição, uma por vez, conforme [`avaliacao/COMO_AVALIAR.md`](avaliacao/COMO_AVALIAR.md).
4. Consolidar as tabelas de resultados (`avaliacao/resultados/tabelas/`).

As decisões tomadas durante a implementação estão em [`documentos/DECISOES_SESSAO_CLAUDE_CODE.md`](documentos/DECISOES_SESSAO_CLAUDE_CODE.md).

## Autoria

Raphael Marchetti Calciolari, com orientação de Vinicius Santos Andrade.
