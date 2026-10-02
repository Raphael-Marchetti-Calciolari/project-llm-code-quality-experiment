#!/usr/bin/env bash
# Verificação da suíte antes do congelamento: a aplicação de referência deve aprovar P1–P5,
# e cada mutante deve ser reprovado exatamente no cenário que ele quebra.
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
APP="$HERE/app-referencia"

declare -a CASOS=(
  "referencia::"
  "referencia-alternativa::"
  "mutante-login::login-aceita-qualquer"
  "mutante-criacao::nao-persiste-criacao"
  "mutante-edicao::edicao-ignora-preco"
  "mutante-inativacao::inativo-na-vitrine"
  "mutante-whatsapp::whatsapp-numero-errado"
)
for caso in "${CASOS[@]}"; do
  nome="${caso%%::*}"; mutante="${caso##*::}"
  echo "=== $nome ${mutante:+(MUTANTE=$mutante)}"
  variante=""; [[ "$nome" == "referencia-alternativa" ]] && variante="controles-alternativos"
  MUTANTE="$mutante" VARIANTE="$variante" "$HERE/../executar.sh" "$nome" "$APP" > /dev/null 2>&1
done

python3 - "$HERE/resultados" <<'PY'
import json, sys
from pathlib import Path
esperado = {
    "referencia": set(), "referencia-alternativa": set(),
    "mutante-login": {"P1"}, "mutante-criacao": {"P2"}, "mutante-edicao": {"P3"},
    "mutante-inativacao": {"P4"}, "mutante-whatsapp": {"P5"},
}
ok = True
for nome, falhas_esperadas in esperado.items():
    rel = json.load(open(Path(sys.argv[1]) / nome / "relatorio.json"))
    status = {}
    for s in rel["suites"]:
        for spec in s.get("specs", []):
            status[spec["title"][:2]] = spec["tests"][0]["results"][-1]["status"]
    falhas = {p for p, st in status.items() if st != "passed"}
    certo = len(status) == 5 and falhas == falhas_esperadas
    ok &= certo
    print(f"{'OK  ' if certo else 'ERRO'} {nome:20} reprovados={sorted(falhas) or '-'} esperado={sorted(falhas_esperadas) or '-'}")
print("SUÍTE VALIDADA" if ok else "SUÍTE NÃO VALIDADA")
sys.exit(0 if ok else 1)
PY
