#!/usr/bin/env bash
# Congela a etapa concluída em ~/new-app (commit + tag) e, nas tags *-final,
# exporta o snapshot para geracoes/<Tn>.
# Uso: ./avaliacao/coleta/congelar.sh <Tn> <tag>   (ex.: T1 T1-final, T3 T3-parecer)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
APP="${APP_DIR:-$HOME/new-app}"
TN="${1:?condição}"; TAG="${2:?tag}"
G=(git -C "$APP" -c user.name=tcc -c user.email=tcc@local)

[[ -d "$APP/.git" ]] || git -C "$APP" init -q
# Sem editar o artefato: exclusões aplicadas apenas na seleção do commit.
"${G[@]}" add -A -- . ':(exclude,glob)**/node_modules/**' ':(exclude,glob)**/dist/**' ':(exclude).claude'
"${G[@]}" commit -q --allow-empty -m "$TAG"
"${G[@]}" tag "$TAG"
COMMIT="$(git -C "$APP" rev-list -n1 "$TAG")"
echo "$TAG → $COMMIT"

if [[ "$TAG" == *-final ]]; then
  DEST="$ROOT/geracoes/$TN"
  rm -rf "$DEST"; mkdir -p "$DEST"
  git -C "$APP" archive --format=tar "$TAG" | tar -x -C "$DEST"
  rm -rf "$DEST/.claude"
  printf 'tag: %s\ncommit: %s\norigem: %s\nexportado: %s\n' "$TAG" "$COMMIT" "$APP" "$(date -u +%FT%TZ)" > "$DEST/ORIGEM.txt"
  echo "Snapshot exportado para geracoes/$TN"
fi
