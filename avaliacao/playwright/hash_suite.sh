#!/usr/bin/env bash
# Hash SHA-256 da suíte congelada (configuração, dependências fixadas e testes).
set -euo pipefail
cd "$(dirname "$0")"
for f in package.json package-lock.json playwright.config.js testes/*.js; do
  shasum -a 256 "$f"
done | shasum -a 256 | cut -d' ' -f1
