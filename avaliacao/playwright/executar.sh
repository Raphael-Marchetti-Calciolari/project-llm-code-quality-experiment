#!/usr/bin/env bash
# Executa a suíte funcional congelada contra um artefato.
# Uso: ./avaliacao/playwright/executar.sh <T1|T2|T3|T4|nome-validacao> <diretório-do-projeto>
#
# Fluxo (contrato dos prompts): MongoDB limpo → npm install → npm run seed → npm run dev
# → aguarda :5173 e :3000 → suíte P1–P5 (cada cenário roda npm run reset-db) → encerra.
set -uo pipefail

COND="${1:?condição}"
PROJECT_DIR="$(cd "${2:?diretório do projeto}" && pwd)"
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
if [[ "$COND" =~ ^T[1-4]$ ]]; then OUT="$ROOT/avaliacao/resultados/$COND/playwright"
else OUT="$HERE/validacao/resultados/$COND"; fi
rm -rf "$OUT"; mkdir -p "$OUT"

FRONT="http://localhost:5173"
API="http://localhost:3000/api"
LIMITE_INICIALIZACAO=180

registrar() { # status motivo
  python3 - "$OUT/execucao.json" "$COND" "$PROJECT_DIR" "$HASH" "$1" "$2" <<'PY'
import json, sys, datetime
out, cond, proj, h, status, motivo = sys.argv[1:]
json.dump({"condicao": cond, "projeto": proj, "suite_sha256": h,
           "inicializacao": status, "motivo": motivo or None,
           "data": datetime.datetime.now(datetime.timezone.utc).isoformat()},
          open(out, "w"), indent=2, ensure_ascii=False)
PY
}

livre() { ! lsof -nP -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1; }
responde() { [[ "$(curl -s -o /dev/null -m 3 -w '%{http_code}' "$1")" != "000" ]]; }
encerrar() {
  [[ -n "${DEV_PID:-}" ]] && kill -TERM -- -"$DEV_PID" 2>/dev/null
  sleep 2
  for p in 5173 3000; do lsof -nP -tiTCP:"$p" -sTCP:LISTEN 2>/dev/null | xargs kill -9 2>/dev/null; done
}
trap encerrar EXIT

# 1. Integridade da suíte.
HASH="$("$HERE/hash_suite.sh")"
if [[ "$HASH" != "$(cat "$HERE/SUITE_SHA256" 2>/dev/null)" ]]; then
  echo "ERRO: hash da suíte difere de SUITE_SHA256 (suíte alterada após o congelamento)." >&2
  registrar "abortado" "hash da suíte divergente"; exit 3
fi

# 2. Portas do contrato livres (evita testar um servidor de outra condição).
for p in 5173 3000; do
  livre "$p" || { registrar "abortado" "porta $p já em uso antes da execução"; echo "porta $p ocupada" >&2; exit 4; }
done

# 3. Banco limpo e preparação pelos comandos do contrato.
"$ROOT/avaliacao/infra/mongodb/reset.sh" > "$OUT/mongodb.log" 2>&1 || { registrar "falha" "MongoDB não iniciou"; exit 5; }
( cd "$PROJECT_DIR" && npm install --no-audit --no-fund ) > "$OUT/npm_install.log" 2>&1 \
  || { registrar "falha" "npm install falhou"; exit 0; }
( cd "$PROJECT_DIR" && npm run seed ) > "$OUT/npm_seed.log" 2>&1 \
  || { registrar "falha" "npm run seed falhou"; exit 0; }

# 4. Inicialização (grupo de processos próprio para encerramento completo).
set -m
( cd "$PROJECT_DIR" && exec npm run dev ) > "$OUT/npm_dev.log" 2>&1 &
DEV_PID=$!
set +m
for ((i = 0; i < LIMITE_INICIALIZACAO; i++)); do
  responde "$FRONT" && responde "$API" && break
  kill -0 "$DEV_PID" 2>/dev/null || break
  sleep 1
done
if ! (responde "$FRONT" && responde "$API"); then
  registrar "falha" "frontend ($FRONT) e/ou API ($API) não responderam em ${LIMITE_INICIALIZACAO}s"
  exit 0
fi
registrar "ok" ""

# 5. Suíte (resultado individual por cenário fica no relatório JSON).
( cd "$HERE" && PROJECT_DIR="$PROJECT_DIR" RELATORIO_JSON="$OUT/relatorio.json" \
  ARTEFATOS_DIR="$OUT/artefatos" npx --no-install playwright test ) 2>&1 | tee "$OUT/playwright.log"
exit 0
