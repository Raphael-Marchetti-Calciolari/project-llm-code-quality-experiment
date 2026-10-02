#!/usr/bin/env bash
# Derruba o MongoDB compartilhado, descarta todos os dados e sobe uma instância limpa.
# Uso: ./avaliacao/infra/mongodb/reset.sh   (antes de cada geração/avaliação de condição)
set -euo pipefail
cd "$(dirname "$0")"

docker compose down --volumes --remove-orphans
docker compose up -d --wait
docker compose exec -T mongodb mongosh --quiet --eval 'db.version()' \
  | xargs -I{} echo "MongoDB {} pronto em mongodb://127.0.0.1:27017"
