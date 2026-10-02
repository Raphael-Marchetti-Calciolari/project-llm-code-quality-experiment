#!/usr/bin/env bash
# Analisa um artefato congelado com a configuração comum e salva as saídas brutas.
# Uso: ./avaliacao/sonar/analisar.sh <T1|T2|T3|T4> <diretório-do-projeto>
set -euo pipefail

COND="${1:?condição (T1..T4)}"
PROJECT_DIR="$(cd "${2:?diretório do projeto}" && pwd)"
[[ "$COND" =~ ^T[1-4]$ ]] || { echo "condição inválida: $COND" >&2; exit 2; }

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
OUT="$ROOT/avaliacao/resultados/$COND/sonar"
TOKEN="${SONAR_TOKEN:-$(cat "$HERE/.sonar-token")}"
KEY="tcc-$COND"
mkdir -p "$OUT"

sonar-scanner \
  -Dproject.settings="$HERE/sonar-common.properties" \
  -Dsonar.projectBaseDir="$PROJECT_DIR" \
  -Dsonar.projectKey="$KEY" \
  -Dsonar.projectName="TCC $COND" \
  -Dsonar.token="$TOKEN" \
  -Dsonar.qualitygate.wait=true \
  -Dsonar.qualitygate.timeout=600 \
  2>&1 | tee "$OUT/scanner.log" || true   # quality gate reprovado não interrompe a coleta

python3 "$ROOT/avaliacao/scripts/coletar_sonar.py" "$COND" "$KEY" "$OUT"
python3 "$ROOT/avaliacao/scripts/contar_testes.py" "$PROJECT_DIR" > "$OUT/testes_desenvolvimento.json"
echo "Saídas brutas em $OUT"
