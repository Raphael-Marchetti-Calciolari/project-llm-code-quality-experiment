#!/usr/bin/env python3
"""Consolida as saídas brutas de T1–T4 nas tabelas de resultados do estudo.

Uso: consolidar.py [--resultados DIR]   (padrão: avaliacao/resultados)

Entradas por condição (geradas por sonar/analisar.sh e playwright/executar.sh):
  <Tn>/sonar/resumo.json, <Tn>/sonar/testes_desenvolvimento.json,
  <Tn>/playwright/execucao.json, <Tn>/playwright/relatorio.json
Entrada opcional: avaliacao/registros/esforco.csv (condicao,etapa,duracao_min,tokens,interacoes)

Regras do plano de análise:
  - valores por condição; diferenças absolutas em T2−T1, T3−T1, T4−T2 (T4−T3 apenas descritivo);
  - variação percentual somente quando a referência ≠ 0;
  - densidade = 1000 × problemas / LOC, somente quando LOC > 0;
  - ausência de dado nunca vira zero ("não disponível"); sem pontuação agregada;
  - resultados de versões diferentes da suíte ou do SonarQube não são combinados.
"""
import argparse
import csv
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONDICOES = ["T1", "T2", "T3", "T4"]
CENARIOS = {
    "P1": "Autenticação administrativa",
    "P2": "Cadastro e publicação",
    "P3": "Edição de produto",
    "P4": "Inativação",
    "P5": "Contato via WhatsApp",
}
COMPARACOES = [
    ("T2", "T1", "TDD na geração"),
    ("T3", "T1", "verificação por agente sobre a geração direta"),
    ("T4", "T2", "verificação por agente sobre a geração com TDD"),
    ("T4", "T3", "contraste descritivo (origens distintas)"),
]
# (chave, rótulo, chave Sonar ou None se derivada, unidade)
METRICAS = [
    ("ncloc", "Linhas de código", "ncloc", "linhas"),
    ("complexidade_ciclomatica", "Complexidade ciclomática", "complexity", "total"),
    ("complexidade_cognitiva", "Complexidade cognitiva", "cognitive_complexity", "total"),
    ("duplicacao_pct", "Linhas duplicadas", "duplicated_lines_density", "%"),
    ("problemas_manutenibilidade", "Problemas de manutenibilidade",
     "software_quality_maintainability_issues", "problemas"),
    ("densidade_problemas", "Densidade de problemas", None, "problemas/1.000 LOC"),
    ("esforco_remediacao_min", "Esforço estimado de remediação",
     "software_quality_maintainability_remediation_effort", "minutos"),
]
ND = "não disponível"
ANSI = re.compile(r"\x1b\[[0-9;]*m")


def ler_json(path):
    try:
        return json.loads(path.read_text())
    except (FileNotFoundError, json.JSONDecodeError):
        return None


def numero(valor):
    if valor is None:
        return None
    v = float(valor)
    return int(v) if v.is_integer() else v


def fmt(v, casas=2):
    if v is None:
        return ND
    return str(v) if isinstance(v, int) else f"{v:.{casas}f}"


# ---------- estrutural ----------

def estrutural(base, cond):
    resumo = ler_json(base / cond / "sonar" / "resumo.json")
    brutas = (resumo or {}).get("metricas", {})
    valores = {}
    for chave, _, sonar_key, _ in METRICAS:
        if sonar_key:
            v = numero(brutas.get(sonar_key))
            valores[chave] = float(v) if (chave == "duplicacao_pct" and v is not None) else v
    loc, prob = valores.get("ncloc"), valores.get("problemas_manutenibilidade")
    valores["densidade_problemas"] = (1000 * prob / loc) if (loc and prob is not None) else None
    return valores, (resumo or {}).get("sonarqube_versao")


def testes_dev(base, cond):
    t = ler_json(base / cond / "sonar" / "testes_desenvolvimento.json")
    if t is None:
        return None, None
    return t["arquivos_de_teste"], t["linhas_nao_vazias"]


# ---------- funcional ----------

def motivo_falha(resultado):
    erros = resultado.get("errors") or ([resultado["error"]] if resultado.get("error") else [])
    if not erros:
        return resultado.get("status")
    linhas = [l.strip() for l in ANSI.sub("", erros[0].get("message", "")).splitlines() if l.strip()]
    return " | ".join(linhas[:4])[:300] if linhas else resultado.get("status")


def funcional(base, cond):
    pasta = base / cond / "playwright"
    execucao = ler_json(pasta / "execucao.json")
    relatorio = ler_json(pasta / "relatorio.json")
    hash_suite = (execucao or {}).get("suite_sha256")

    if execucao is None:
        return {p: ("não executado", "avaliação funcional não realizada") for p in CENARIOS}, None, hash_suite
    if execucao["inicializacao"] != "ok":
        falha = f"{execucao['inicializacao']}: {execucao.get('motivo')}"
        return {p: ("não executado", f"falha de inicialização — {execucao.get('motivo')}") for p in CENARIOS}, falha, hash_suite
    if relatorio is None:
        return {p: ("não executado", "relatório da suíte ausente") for p in CENARIOS}, None, hash_suite

    status = {}
    for suite in relatorio.get("suites", []):
        for spec in suite.get("specs", []):
            cen = spec["title"][:2]
            res = spec["tests"][0]["results"][-1] if spec["tests"] and spec["tests"][0]["results"] else {}
            st = res.get("status")
            if st == "passed":
                status[cen] = ("aprovado", "")
            elif st in ("failed", "timedOut"):
                status[cen] = ("reprovado", motivo_falha(res))
            else:
                status[cen] = ("não executado", st or "sem resultado")
    for p in CENARIOS:
        status.setdefault(p, ("não executado", "cenário ausente do relatório"))
    return status, None, hash_suite


# ---------- esforço (complementar) ----------

def esforco():
    path = ROOT / "registros" / "esforco.csv"
    if not path.exists():
        return []
    with path.open() as f:
        return list(csv.DictReader(f))


# ---------- saída ----------

def escrever_csv(path, cabecalho, linhas):
    with path.open("w", newline="") as f:
        w = csv.writer(f)
        w.writerow(cabecalho)
        w.writerows(linhas)


def diferenca(alvo, ref):
    if alvo is None or ref is None:
        return None, None
    d = alvo - ref
    pct = (100 * d / ref) if ref != 0 else None
    return d, pct


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--resultados", default=str(ROOT / "resultados"))
    base = Path(ap.parse_args().resultados)
    out = base / "tabelas"
    out.mkdir(parents=True, exist_ok=True)

    est, versoes_sonar, func, inicializacao, hashes, tdev = {}, {}, {}, {}, {}, {}
    for c in CONDICOES:
        est[c], versoes_sonar[c] = estrutural(base, c)
        func[c], inicializacao[c], hashes[c] = funcional(base, c)
        tdev[c] = testes_dev(base, c)

    # Integridade: não combinar versões diferentes de suíte ou analisador.
    avisos = []
    for nome, mapa in (("suíte Playwright (sha256)", hashes), ("SonarQube", versoes_sonar)):
        distintos = {v for v in mapa.values() if v}
        if len(distintos) > 1:
            print(f"ERRO: {nome} difere entre condições: {mapa}", file=sys.stderr)
            sys.exit(2)
        if any(v is None for v in mapa.values()):
            avisos.append(f"{nome}: sem registro em {[c for c, v in mapa.items() if v is None]}")

    # Tabela 1 — indicadores estruturais.
    linhas_est = [[rot, uni] + [fmt(est[c][k]) for c in CONDICOES] for k, rot, _, uni in METRICAS]
    escrever_csv(out / "estrutural.csv", ["metrica", "unidade"] + CONDICOES, linhas_est)

    # Tabela 2 — comparações pareadas.
    linhas_cmp = []
    for alvo, ref, desc in COMPARACOES:
        for k, rot, _, uni in METRICAS:
            d, pct = diferenca(est[alvo][k], est[ref][k])
            linhas_cmp.append([f"{alvo}−{ref}", desc, rot, uni, fmt(est[ref][k]), fmt(est[alvo][k]),
                               fmt(d), fmt(pct) if pct is not None else (ND if d is None else "não calculável (referência = 0)")])
    escrever_csv(out / "comparacoes.csv",
                 ["comparacao", "descricao", "metrica", "unidade", "referencia", "alvo", "diferenca_absoluta", "variacao_pct"],
                 linhas_cmp)

    # Tabela 3 — avaliação funcional.
    linhas_func = []
    for c in CONDICOES:
        for p, nome in CENARIOS.items():
            st, mot = func[c][p]
            linhas_func.append([c, p, nome, st, mot])
    escrever_csv(out / "funcional.csv", ["condicao", "cenario", "descricao", "resultado", "motivo"], linhas_func)

    # Tabela 4 — testes de desenvolvimento (excluídos da análise estática).
    escrever_csv(out / "testes_desenvolvimento.csv", ["condicao", "arquivos_de_teste", "linhas_nao_vazias"],
                 [[c, fmt(tdev[c][0]), fmt(tdev[c][1])] for c in CONDICOES])

    # Resumo legível.
    md = ["# Resultados consolidados", ""]
    if avisos:
        md += ["**Avisos:** " + "; ".join(avisos), ""]
    md += ["## Indicadores estruturais (SonarQube)", "",
           "| Métrica | Unidade | " + " | ".join(CONDICOES) + " |", "|---|---|" + "---|" * len(CONDICOES)]
    md += [f"| {l[0]} | {l[1]} | " + " | ".join(l[2:]) + " |" for l in linhas_est]
    md += ["", "## Comparações pareadas (diferença absoluta; % só com referência ≠ 0)", "",
           "| Comparação | Métrica | Ref. | Alvo | Δ | Δ% |", "|---|---|---|---|---|---|"]
    md += [f"| {l[0]} | {l[2]} | {l[4]} | {l[5]} | {l[6]} | {l[7]} |" for l in linhas_cmp]
    md += ["", "## Avaliação funcional (Playwright)", "",
           "| Cenário | " + " | ".join(CONDICOES) + " |", "|---|" + "---|" * len(CONDICOES)]
    for p, nome in CENARIOS.items():
        md.append(f"| {p} — {nome} | " + " | ".join(func[c][p][0] for c in CONDICOES) + " |")
    md.append("| **Aprovados / 5** | " + " | ".join(
        f"{sum(func[c][p][0] == 'aprovado' for p in CENARIOS)}/5" for c in CONDICOES) + " |")
    md += ["", "### Falhas de inicialização", ""]
    md += [f"- {c}: {inicializacao[c]}" for c in CONDICOES if inicializacao[c]] or ["- nenhuma"]
    md += ["", "### Reprovados e não executados", ""]
    md += [f"- {c} {p}: {st} — {mot}" for c in CONDICOES for p, (st, mot) in func[c].items() if st != "aprovado"] or ["- nenhum"]
    md += ["", "## Testes de desenvolvimento (fora da análise estática)", "",
           "| Condição | Arquivos | Linhas não vazias |", "|---|---|---|"]
    md += [f"| {c} | {fmt(tdev[c][0])} | {fmt(tdev[c][1])} |" for c in CONDICOES]
    reg = esforco()
    md += ["", "## Esforço observado (complementar)", ""]
    if reg:
        md += ["| Condição | Etapa | Duração (min) | Tokens | Interações |", "|---|---|---|---|---|"]
        md += [f"| {r['condicao']} | {r['etapa']} | {r.get('duracao_min') or 'não registrado'} | "
               f"{r.get('tokens') or 'não registrado'} | {r.get('interacoes') or 'não registrado'} |" for r in reg]
    else:
        md.append("não registrado")
    md += ["", "## Rastreabilidade", "",
           f"- SonarQube: {next((v for v in versoes_sonar.values() if v), ND)}",
           f"- Suíte Playwright sha256: {next((v for v in hashes.values() if v), ND)}"]
    (out / "resultados.md").write_text("\n".join(md) + "\n")
    print(f"Tabelas geradas em {out}")


if __name__ == "__main__":
    main()
