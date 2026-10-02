#!/usr/bin/env bash
# Registra as versões efetivas do ambiente de avaliação (exigido antes da coleta).
# Uso: ./avaliacao/sonar/registrar_versoes.sh  → avaliacao/registros/versoes_ambiente.txt
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
OUT="$ROOT/avaliacao/registros/versoes_ambiente.txt"
TOKEN="${SONAR_TOKEN:-$(cat "$HERE/.sonar-token")}"
mkdir -p "$(dirname "$OUT")"

sq() { curl -s -u "$TOKEN:" "http://localhost:9000$1"; }

{
  echo "data: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "sistema: $(sw_vers -productName) $(sw_vers -productVersion) $(uname -m)"
  echo "node: $(node -v) | npm: $(npm -v)"
  echo "sonarqube_servidor: $(sq /api/system/status | python3 -c 'import json,sys; print(json.load(sys.stdin)["version"])')"
  echo "sonarqube_imagem: $(docker inspect --format '{{.Config.Image}} {{.Image}}' sonarqube)"
  echo "sonar_scanner: $(sonar-scanner -v 2>&1 | grep -o 'SonarScanner CLI [0-9.]*')"
  echo "modo_qualidade_MQR: $(sq '/api/settings/values?keys=sonar.multi-quality-mode.enabled' | python3 -c 'import json,sys; print(json.load(sys.stdin)["settings"][0]["value"])')"
  echo "perfis_de_regras (padrão):"
  sq '/api/qualityprofiles/search?defaults=true' | python3 -c '
import json,sys
for p in json.load(sys.stdin)["profiles"]:
    if p["language"] in ("js","ts","css","web"):
        print("  %s: %s (%s regras, atualizado %s)" % (p["language"], p["name"], p["activeRuleCount"], p.get("rulesUpdatedAt", "?")))'
  echo "mongodb: $(docker inspect --format '{{.Config.Image}} {{.Image}}' tcc-mongodb 2>/dev/null || echo 'contêiner parado')"
  echo "playwright_suite: $(cd "$ROOT/avaliacao/playwright" 2>/dev/null && npx --no-install playwright --version 2>/dev/null || echo 'não instalado')"
  echo "sonar-common.properties sha256: $(shasum -a 256 "$HERE/sonar-common.properties" | cut -d' ' -f1)"
} | tee "$OUT"
