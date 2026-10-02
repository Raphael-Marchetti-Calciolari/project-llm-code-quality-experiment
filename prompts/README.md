# prompts/

Prompts usados para gerar, verificar e corrigir os artefatos das quatro condições (T1–T4). São instrumentos do estudo e não devem ser alterados.

| Arquivo | Condição | Papel | Modelo / esforço | Saída esperada |
|---|---|---|---|---|
| `01_T1_geracao_direta.md` | T1 | Gerador (geração direta) | Sonnet 5.5 (`claude-sonnet-5-5`) / low | Aplicação + resumo breve |
| `02_T2_geracao_TDD.md` | T2 | Gerador (geração com TDD) | Sonnet 5.5 (`claude-sonnet-5-5`) / low | Aplicação + testes + resumo breve |
| `03_verificador_T3_T4.md` | T3, T4 | Verificador (somente leitura) | Opus 5.5 (`claude-opus-5-5`) / low | `VERIFICATION_REPORT.md` |
| `04_corretor_T3_T4.md` | T3, T4 | Corretor (rodada única) | Sonnet 5.5 (`claude-sonnet-5-5`) / low | `CORRECTION_SUMMARY.md` |

## Fluxo

```text
T1: prompt 01 → T1-final
T2: prompt 02 → T2-final

T3: base restaurada de geracoes/T1 → prompt 03 → T3-parecer → prompt 04 → T3-final
T4: base restaurada de geracoes/T2 → prompt 03 → T4-parecer → prompt 04 → T4-final
```

Todas as etapas rodaram no mesmo diretório de execução (`~/new-app`), fora deste repositório, esvaziado antes de cada etapa. Ao fim de cada uma, o estado foi registrado com commit e marcação, sem alteração manual. Os snapshots de T1 e T2 em [`geracoes/`](../geracoes/) permanecem intocados para a comparação pareada.

## Configuração das sessões

- Claude Code 2.1.287, uma sessão nova por etapa (geração, verificação, correção), sem histórico.
- Modelo e esforço fixados em `.claude/settings.local.json` por [`avaliacao/coleta/preparar.sh`](../avaliacao/coleta/preparar.sh), que também desativa os plugins globais no diretório de execução.
- Modelo e esforço conferidos apenas com `/status`; `/model` e `/effort` não devem ser usados.

O procedimento completo está em [`documentos/ROTEIRO_COLETA.md`](../documentos/ROTEIRO_COLETA.md).

## Regras de uso

- Colar o prompt **literalmente**, sem acrescentar nada (nenhuma menção a TCC, métricas ou avaliação).
- Sem teto de duração, tokens ou passos; o consumo é apenas registrado.
- Execução sequencial: uma condição e uma etapa por vez.
- Nenhuma edição manual nos artefatos entre etapas.

## Notas

- **`CONTRATOS FIXOS DE EXECUÇÃO E INTERFACE`** (em 01 e 02): contrato externo (portas, scripts, rotas, seed, `data-testid`) do qual depende a suíte de avaliação. O bloco é idêntico nos dois prompts.
- **`legado/`**: prompt-base do escopo anterior do estudo, do qual 01 e 02 foram derivados. Não foi usado na coleta.
