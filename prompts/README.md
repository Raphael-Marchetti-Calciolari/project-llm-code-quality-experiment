# Prompts do experimento

Prompts usados para gerar, verificar e corrigir os artefatos das quatro condições (T1–T4).

| Arquivo | Condição | Papel | Modelo / esforço | Saída esperada |
|---|---|---|---|---|
| `01_T1_geracao_direta.md` | T1 | Gerador (geração direta) | Sonnet 5.5 (`claude-sonnet-5-5`) / low | Aplicação + resumo breve |
| `02_T2_geracao_TDD.md` | T2 | Gerador (geração com TDD) | Sonnet 5.5 (`claude-sonnet-5-5`) / low | Aplicação + testes + resumo breve |
| `03_verificador_T3_T4.md` | T3, T4 | Verificador (somente leitura) | Opus 5.5 (`claude-opus-5-5`) / low | `VERIFICATION_REPORT.md` |
| `04_corretor_T3_T4.md` | T3, T4 | Corretor (rodada única) | Sonnet 5.5 (`claude-sonnet-5-5`) / low | `CORRECTION_SUMMARY.md` |

## Fluxo

```text
T1: prompt 01 → tag T1-final
T2: prompt 02 → tag T2-final

T3: cópia de T1-final → prompt 03 → tag T3-parecer → prompt 04 → tag T3-final
T4: cópia de T2-final → prompt 03 → tag T4-parecer → prompt 04 → tag T4-final
```

Cada artefato tem repositório git próprio; ao fim de cada etapa, commit + tag, sem alteração manual.
T1 e T2 permanecem intocados para comparação pareada.

## Regras de uso

- Colar o prompt **literalmente**, sem acrescentar nada (nenhuma menção a TCC, métricas ou avaliação).
- Uma sessão nova do Claude Code por etapa (geração, verificação, correção), sem histórico.
- Executar dentro do diretório dedicado da condição, **fora deste repositório**.
- Sem teto de duração, tokens ou passos; o consumo é apenas registrado.
- Execução sequencial: uma condição e uma etapa por vez.
- Nenhuma edição manual nos artefatos entre etapas.

## Notas

- **`CONTRATOS FIXOS DE EXECUÇÃO E INTERFACE`** (em 01 e 02): contrato externo (portas, scripts, rotas, seed, `data-testid`) do qual depende a suíte de avaliação; deve permanecer idêntico nos dois prompts.
- **`legado/`**: prompt-base do escopo anterior, do qual 01 e 02 foram derivados.
