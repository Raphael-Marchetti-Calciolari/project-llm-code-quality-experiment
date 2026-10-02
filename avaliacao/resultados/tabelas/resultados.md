# Resultados consolidados

## Indicadores estruturais (SonarQube)

| Métrica | Unidade | T1 | T2 | T3 | T4 |
|---|---|---|---|---|---|
| Linhas de código | linhas | 644 | 671 | 709 | 752 |
| Complexidade ciclomática | total | 140 | 157 | 163 | 178 |
| Complexidade cognitiva | total | 40 | 62 | 54 | 71 |
| Linhas duplicadas | % | 0.00 | 0.00 | 0.00 | 0.00 |
| Problemas de manutenibilidade | problemas | 10 | 9 | 11 | 10 |
| Densidade de problemas | problemas/1.000 LOC | 15.53 | 13.41 | 15.51 | 13.30 |
| Esforço estimado de remediação | minutos | 50 | 45 | 51 | 50 |

## Comparações pareadas (diferença absoluta; % só com referência ≠ 0)

| Comparação | Métrica | Ref. | Alvo | Δ | Δ% |
|---|---|---|---|---|---|
| T2−T1 | Linhas de código | 644 | 671 | 27 | 4.19 |
| T2−T1 | Complexidade ciclomática | 140 | 157 | 17 | 12.14 |
| T2−T1 | Complexidade cognitiva | 40 | 62 | 22 | 55.00 |
| T2−T1 | Linhas duplicadas | 0.00 | 0.00 | 0.00 | não calculável (referência = 0) |
| T2−T1 | Problemas de manutenibilidade | 10 | 9 | -1 | -10.00 |
| T2−T1 | Densidade de problemas | 15.53 | 13.41 | -2.12 | -13.62 |
| T2−T1 | Esforço estimado de remediação | 50 | 45 | -5 | -10.00 |
| T3−T1 | Linhas de código | 644 | 709 | 65 | 10.09 |
| T3−T1 | Complexidade ciclomática | 140 | 163 | 23 | 16.43 |
| T3−T1 | Complexidade cognitiva | 40 | 54 | 14 | 35.00 |
| T3−T1 | Linhas duplicadas | 0.00 | 0.00 | 0.00 | não calculável (referência = 0) |
| T3−T1 | Problemas de manutenibilidade | 10 | 11 | 1 | 10.00 |
| T3−T1 | Densidade de problemas | 15.53 | 15.51 | -0.01 | -0.08 |
| T3−T1 | Esforço estimado de remediação | 50 | 51 | 1 | 2.00 |
| T4−T2 | Linhas de código | 671 | 752 | 81 | 12.07 |
| T4−T2 | Complexidade ciclomática | 157 | 178 | 21 | 13.38 |
| T4−T2 | Complexidade cognitiva | 62 | 71 | 9 | 14.52 |
| T4−T2 | Linhas duplicadas | 0.00 | 0.00 | 0.00 | não calculável (referência = 0) |
| T4−T2 | Problemas de manutenibilidade | 9 | 10 | 1 | 11.11 |
| T4−T2 | Densidade de problemas | 13.41 | 13.30 | -0.11 | -0.86 |
| T4−T2 | Esforço estimado de remediação | 45 | 50 | 5 | 11.11 |
| T4−T3 | Linhas de código | 709 | 752 | 43 | 6.06 |
| T4−T3 | Complexidade ciclomática | 163 | 178 | 15 | 9.20 |
| T4−T3 | Complexidade cognitiva | 54 | 71 | 17 | 31.48 |
| T4−T3 | Linhas duplicadas | 0.00 | 0.00 | 0.00 | não calculável (referência = 0) |
| T4−T3 | Problemas de manutenibilidade | 11 | 10 | -1 | -9.09 |
| T4−T3 | Densidade de problemas | 15.51 | 13.30 | -2.22 | -14.29 |
| T4−T3 | Esforço estimado de remediação | 51 | 50 | -1 | -1.96 |

## Avaliação funcional (Playwright)

| Cenário | T1 | T2 | T3 | T4 |
|---|---|---|---|---|
| P1 — Autenticação administrativa | aprovado | aprovado | aprovado | aprovado |
| P2 — Cadastro e publicação | aprovado | aprovado | aprovado | aprovado |
| P3 — Edição de produto | aprovado | aprovado | aprovado | aprovado |
| P4 — Inativação | aprovado | aprovado | aprovado | aprovado |
| P5 — Contato via WhatsApp | aprovado | aprovado | aprovado | aprovado |
| **Aprovados / 5** | 5/5 | 5/5 | 5/5 | 5/5 |

### Falhas de inicialização

- nenhuma

### Reprovados e não executados

- nenhum

## Testes de desenvolvimento (fora da análise estática)

| Condição | Arquivos | Linhas não vazias |
|---|---|---|
| T1 | 0 | 0 |
| T2 | 6 | 191 |
| T3 | 0 | 0 |
| T4 | 6 | 191 |

## Esforço observado (complementar)

| Condição | Etapa | Duração (min) | Tokens | Interações |
|---|---|---|---|---|
| T1 | geracao | 3.7 | 271886 | 1 |
| T2 | geracao | 2.9 | 690806 | 1 |
| T3 | verificacao | 1.4 | 237744 | 1 |
| T3 | correcao | 2.5 | 551503 | 1 |
| T4 | verificacao | 2.1 | 244779 | 1 |
| T4 | correcao | 2.1 | 661100 | 1 |

## Rastreabilidade

- SonarQube: 26.9.0.129388
- Suíte Playwright sha256: ed6b7cc531641ab932b5ecdb4e2eb06720fb1fcd293141643dc24ceeeb8b1685
