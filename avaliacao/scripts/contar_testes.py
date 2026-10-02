#!/usr/bin/env python3
"""Descreve os testes de desenvolvimento (excluídos do SonarQube): arquivos e linhas.

Uso: contar_testes.py <diretório-do-projeto>
Usa os mesmos padrões de teste excluídos em sonar/sonar-common.properties.
"""
import json
import sys
from pathlib import Path

SKIP_DIRS = {"node_modules", "dist", "build", "coverage", ".git", ".vite"}
TEST_DIRS = {"test", "tests", "__tests__", "e2e"}
CODE_EXT = {".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"}


def is_test(path, root):
    parts = path.relative_to(root).parts
    return (
        ".test." in path.name
        or ".spec." in path.name
        or any(p in TEST_DIRS for p in parts[:-1])
    )


def main():
    root = Path(sys.argv[1]).resolve()
    files = []
    for path in sorted(root.rglob("*")):
        rel = path.relative_to(root).parts
        if not path.is_file() or path.suffix not in CODE_EXT or SKIP_DIRS & set(rel):
            continue
        if is_test(path, root):
            lines = path.read_text(errors="replace").splitlines()
            files.append({
                "arquivo": "/".join(rel),
                "linhas": len(lines),
                "linhas_nao_vazias": sum(1 for l in lines if l.strip()),
            })
    print(json.dumps({
        "arquivos_de_teste": len(files),
        "linhas_nao_vazias": sum(f["linhas_nao_vazias"] for f in files),
        "arquivos": files,
    }, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
