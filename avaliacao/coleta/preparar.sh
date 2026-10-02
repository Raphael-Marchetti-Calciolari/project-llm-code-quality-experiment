#!/usr/bin/env bash
# Prepara ~/new-app para uma etapa do experimento.
# Uso: ./avaliacao/coleta/preparar.sh <T1|T2|T3|T4> <geracao|verificacao|correcao>
#   T1/T2 geracao  → diretório vazio
#   T3/T4 verificacao → snapshot congelado de T1/T2 (geracoes/) como base
#   T3/T4 correcao → mantém ~/new-app como está (parecer já congelado)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
APP="${APP_DIR:-$HOME/new-app}"
TN="${1:?condição}"; ETAPA="${2:?etapa}"

case "$TN/$ETAPA" in
  T1/geracao|T2/geracao) BASE="" ;;
  T3/verificacao) BASE="T1" ;;
  T4/verificacao) BASE="T2" ;;
  T3/correcao|T4/correcao) BASE="-" ;;
  *) echo "Combinação inválida: $TN $ETAPA" >&2; exit 2 ;;
esac

if [[ "$BASE" != "-" ]]; then
  rm -rf "$APP"; mkdir -p "$APP"
  if [[ -n "$BASE" ]]; then
    [[ -f "$ROOT/geracoes/$BASE/ORIGEM.txt" ]] || { echo "Snapshot geracoes/$BASE ausente." >&2; exit 3; }
    (cd "$ROOT/geracoes/$BASE" && tar -cf - --exclude ORIGEM.txt --exclude node_modules --exclude .scannerwork --exclude dist .) | tar -xf - -C "$APP"
    git -C "$APP" init -q
    git -C "$APP" add -A
    git -C "$APP" -c user.name=tcc -c user.email=tcc@local commit -qm "Base: $BASE-final"
    git -C "$APP" tag "$BASE-final"
  fi
fi

# Configuração local da sessão: modelo, esforço e plugins desativados
# (plugins globais injetam instruções — p.ex. TDD — e contaminariam as condições).
case "$ETAPA" in verificacao) MODEL=claude-opus-5-5 ;; *) MODEL=claude-sonnet-5-5 ;; esac
mkdir -p "$APP/.claude"
cat > "$APP/.claude/settings.local.json" <<JSON
{
  "model": "$MODEL",
  "effortLevel": "low",
  "enabledPlugins": {
    "superpowers@claude-plugins-official": false,
    "code-review@claude-plugins-official": false,
    "context7@claude-plugins-official": false,
    "frontend-design@claude-plugins-official": false
  }
}
JSON

"$ROOT/avaliacao/infra/mongodb/reset.sh"
echo "$(date -u +%FT%TZ),$TN,$ETAPA,$(claude --version | cut -d' ' -f1),$MODEL,low" >> "$ROOT/avaliacao/registros/sessoes.csv"

echo
echo "Pronto: $APP ($TN / $ETAPA). Modelo $MODEL, esforço low."
echo "Abra uma sessão NOVA:  cd $APP && claude"
