# geracoes/

Snapshots congelados (somente leitura) dos artefatos gerados T1–T4, importados das execuções isoladas para avaliação.

## Estrutura esperada

```
geracoes/
├── T1/            # snapshot de T1-final + ORIGEM.txt
├── T2/            # snapshot de T2-final + ORIGEM.txt
├── T3/            # snapshot de T3-final (+ VERIFICATION_REPORT.md, CORRECTION_SUMMARY.md) + ORIGEM.txt
└── T4/            # snapshot de T4-final (+ VERIFICATION_REPORT.md, CORRECTION_SUMMARY.md) + ORIGEM.txt
```

## Condições, origem e tags

| Condição | Origem | Etapas | Tags |
|---|---|---|---|
| T1 | geração do zero | geração | `T1-final` |
| T2 | geração do zero | geração | `T2-final` |
| T3 | cópia congelada de `T1-final` | parecer → correção | `T3-parecer`, `T3-final` |
| T4 | cópia congelada de `T2-final` | parecer → correção | `T4-parecer`, `T4-final` |

Cada artefato é gerado em pasta dedicada **fora deste repositório** (proposta: `~/tcc-execucoes/Tn`), com repositório git próprio. O hash do commit de cada tag é o identificador de versão.

## Importação (convenção proposta)

> **Proposta.** O mecanismo de isolamento das sessões ainda está pendente (ver `documentos/DECISOES_SESSAO_CLAUDE_CODE.md`, seção 8).

Após congelar a etapa, exportar o snapshot da tag (sem `.git`, `node_modules` ou `dist`):

```sh
TN=T1; TAG=T1-final; SRC=~/tcc-execucoes/$TN
mkdir -p geracoes/$TN
git -C "$SRC" archive --format=tar "$TAG" | tar -x -C geracoes/$TN
printf 'tag: %s\ncommit: %s\norigem: %s\n' "$TAG" \
  "$(git -C "$SRC" rev-list -n1 "$TAG")" "$SRC" > geracoes/$TN/ORIGEM.txt
```

`git archive` exporta apenas arquivos versionados; garantir que `node_modules/` e `dist/` estejam no `.gitignore` do artefato.

## Regras

- Snapshots são somente leitura: nenhuma edição manual, nunca.
- Nunca alterar um artefato para fazer testes passarem.
- T3/T4 mantêm `VERIFICATION_REPORT.md` e `CORRECTION_SUMMARY.md` no snapshot.
- A avaliação usa os comandos de `avaliacao/` (ver `avaliacao/COMO_AVALIAR.md`) apontando para estes snapshots ou para os originais congelados.

## Status

| Condição | Tag | Commit | Status |
|---|---|---|---|
| T1 | `T1-final` | — | pendente |
| T2 | `T2-final` | — | pendente |
| T3 | `T3-final` | — | pendente |
| T4 | `T4-final` | — | pendente |
