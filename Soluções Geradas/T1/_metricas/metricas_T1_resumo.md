# Métricas preliminares — Tratamento 1 (LLM sem revisão)

_Gerado em 14/06/2026. T1 = código gerado por LLM sem revisão. Cinco configurações do Claude, geradas via Claude Code v2.1.177._

## 1. Qualidade estrutural / manutenibilidade

| Projeto (modelo) | Arq. | SLOC | Func. | CC méd. | CC máx. | Cogn. méd. | Cogn. máx. | Cogn.>15 | IM (0–100) | Dup. % | Coment. % |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Haiku_4.5_high | 24 | 1639 | 72 | 2.29 | 9 | 1.88 | 21 | 1 | 44.0 | 4.8 | 0.5 |
| Sonnet_4.6_low | 20 | 765 | 68 | 1.69 | 5 | 1.21 | 20 | 1 | 47.0 | 0.0 | 1.7 |
| Opus_4.6_medium | 19 | 670 | 65 | 1.58 | 6 | 1.00 | 14 | 0 | 46.9 | 12.8 | 0.1 |
| Opus_4.7_extra | 24 | 978 | 100 | 1.80 | 8 | 1.14 | 15 | 0 | 46.7 | 8.0 | 0.0 |
| Opus_4.8_high | 41 | 1262 | 112 | 1.89 | 9 | 1.21 | 17 | 1 | 51.1 | 3.0 | 13.7 |

## 2. Eficiência: tempo e interações

| Projeto (modelo) | Tempo total | Geração principal | Turnos do usuário | Passos (⏺) | Writes | Bash | Loops correção |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Haiku_4.5_high | 4m20s | 4m05s | 2 | 49 | 33 | 7 | 5 |
| Sonnet_4.6_low | 5m15s | 4m46s | 2 | 34 | 27 | 0 | 1 |
| Opus_4.6_medium | 5m58s | 5m58s | 1 | 47 | 23 | 10 | 8 |
| Opus_4.7_extra | 8m50s | 8m50s | 1 | 49 | 31 | 4 | 1 |
| Opus_4.8_high | 12m36s | 12m36s | 1 | 98 | 51 | 13 | 2 |

_Tempo = tempo ativo do modelo reportado pelo Claude Code (`<verbo> for Xm Ys`), somado quando houve mais de um turno. **Haiku e Sonnet usaram 2 turnos** porque pararam para pedir confirmação antes de gerar (mockups / opções de autenticação); **os três Opus geraram em 1 turno**, assumindo as decisões. 'Geração principal' = turno de maior duração (a geração de fato)._

## 3. Glossário das métricas (o que significam e direção)

| Métrica | O que representa | Direção (bom/ruim) |
| --- | --- | --- |
| SLOC | Linhas de código-fonte (sem linhas em branco/comentário). | Contextual — menos código, se funcional, tende a ser mais fácil de manter; excesso pode indicar verbosidade. |
| Funções | Quantidade de funções/métodos. | Contextual. |
| Complexidade Ciclomática (CC) | Nº de caminhos de execução independentes (McCabe, 1976). Mede o esforço de teste. | ↓ Menor é melhor. Referência: >10 por função é sinal de atenção. |
| Complexidade Cognitiva | Dificuldade de um humano entender o fluxo (SonarSource/Campbell, 2018). Penaliza aninhamento e quebras de fluxo. | ↓ Menor é melhor. Referência SonarQube: >15 por função é um code smell. |
| Índice de Manutenibilidade (IM, 0–100) | Combina Volume de Halstead, CC e linhas de código (Oman & Hagemeister, 1992), normalizado 0–100. | ↑ Maior é melhor. Faixas (Visual Studio): 0–9 baixa, 10–19 moderada, 20–100 boa. |
| Duplicação % | % de linhas em blocos duplicados (janela de 50 tokens, estilo jscpd). | ↓ Menor é melhor. SonarQube costuma alertar acima de ~3%. |
| Densidade de comentários % | Proporção de linhas de comentário sobre o código. | Contextual — nem muito baixa (pouca documentação) nem alta demais (código que exige explicação). |
| Volume de Halstead | Tamanho 'textual' do código a partir de operadores e operandos. Insumo do IM. | ↓ Menor tende a melhor manutenção, em igualdade de função. |
| Tempo de processamento | Tempo ativo do modelo para produzir o código. | ↓ Menor é melhor em eficiência — mas deve ser lido junto da qualidade (qualidade × tempo). |
| Turnos do usuário | Nº de interações necessárias até o código completo. | ↓ Menor é melhor (mais autônomo: 1 = gerou sem pedir confirmação). |
| Passos (⏺) / Writes / Bash / Loops de correção | Esforço interno do agente: ações, arquivos escritos, comandos de shell e ocorrências de erro/retrabalho. | ↓ Menos retrabalho (loops de correção) é melhor; Writes refletem nº de arquivos, sendo mais descritivo que avaliativo. |

## 4. Metodologia e ressalvas

- Métricas de código calculadas por analisador estático próprio sobre a AST (`@babel/parser`), seguindo McCabe (1976), SonarSource/Campbell (2018) e Oman & Hagemeister (1992).
- Complexidade Cognitiva validada contra exemplos canônicos do SonarSource (`sumOfPrimes` = 7); 5/5 testes corretos.
- Escopo: arquivos `.js/.jsx/.mjs/.cjs`, excluindo `node_modules`, `dist`, `build`, `.git`.
- **SonarQube/SQALE e o catálogo oficial de _code smells_ não foram executados** (sem servidor/instalação neste ambiente); ficam para a coleta formal (Jul–Ago). Números preliminares e reprodutíveis.

## 5. Tokens (pendente)

Os `prompt.txt` não registram tokens, e a pasta `~/.claude/projects` (onde ficam os `.jsonl` de sessão com tokens por mensagem) é protegida e não pode ser montada automaticamente. Para incluir tokens, copie os `.jsonl` para um local acessível, por exemplo:

```bash
mkdir -p "$HOME/Library/Mobile Documents/com~apple~CloudDocs/My Documents/Education/MBA Software Engineering/TCC/Soluções Geradas/T1/_sessions"
grep -rl "Soluções Geradas/T1" "$HOME/.claude/projects" --include="*.jsonl" | while read f; do
  cp "$f" "$HOME/Library/Mobile Documents/com~apple~CloudDocs/My Documents/Education/MBA Software Engineering/TCC/Soluções Geradas/T1/_sessions/$(basename "$(dirname "$f")")__$(basename "$f")"
done
```
Com os `.jsonl` nessa pasta, extraio tempo de parede exato e tokens de entrada/saída por modelo.
