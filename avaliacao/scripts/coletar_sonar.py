#!/usr/bin/env python3
"""Coleta as medidas e os problemas de manutenibilidade de um projeto no SonarQube.

Uso: coletar_sonar.py <condição> <projectKey> <diretório-de-saída>
Grava as respostas brutas da API (auditoria) e um resumo com as métricas do estudo.
"""
import base64
import json
import os
import sys
import urllib.parse
import urllib.request
from pathlib import Path

HOST = "http://localhost:9000"
TOKEN_FILE = Path(__file__).resolve().parent.parent / "sonar" / ".sonar-token"

# Métricas do estudo (modo MQR) + equivalentes legados, mantidos apenas para auditoria.
METRICS = [
    "ncloc",
    "complexity",
    "cognitive_complexity",
    "duplicated_lines",
    "duplicated_lines_density",
    "software_quality_maintainability_issues",
    "software_quality_maintainability_remediation_effort",
    "code_smells",
    "sqale_index",
]


def api(path, params):
    token = os.environ.get("SONAR_TOKEN") or TOKEN_FILE.read_text().strip()
    url = f"{HOST}{path}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url)
    req.add_header("Authorization", "Basic " + base64.b64encode(f"{token}:".encode()).decode())
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.load(resp)


def fetch_issues(key):
    issues, page = [], 1
    while True:
        data = api("/api/issues/search", {
            "componentKeys": key,
            "impactSoftwareQualities": "MAINTAINABILITY",
            "issueStatuses": "OPEN,CONFIRMED",
            "ps": 500,
            "p": page,
        })
        issues += data["issues"]
        if page * 500 >= data["paging"]["total"]:
            return issues
        page += 1


def main():
    cond, key, out = sys.argv[1], sys.argv[2], Path(sys.argv[3])
    out.mkdir(parents=True, exist_ok=True)

    measures = api("/api/measures/component", {"component": key, "metricKeys": ",".join(METRICS)})
    issues = fetch_issues(key)
    status = api("/api/system/status", {})

    (out / "measures_raw.json").write_text(json.dumps(measures, indent=2, ensure_ascii=False))
    (out / "issues_raw.json").write_text(json.dumps(issues, indent=2, ensure_ascii=False))

    values = {m["metric"]: m.get("value") for m in measures["component"]["measures"]}
    summary = {
        "condicao": cond,
        "projectKey": key,
        "sonarqube_versao": status.get("version"),
        "metricas": {m: values.get(m) for m in METRICS},  # ausente = null, nunca zero
        "problemas_manutenibilidade_listados": len(issues),
    }
    (out / "resumo.json").write_text(json.dumps(summary, indent=2, ensure_ascii=False))
    print(json.dumps(summary, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
