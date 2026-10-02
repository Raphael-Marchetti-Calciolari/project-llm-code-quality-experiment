#!/usr/bin/env python3
"""Audita a sessão mais recente do Claude Code em ~/new-app.

Uso: python3 avaliacao/coleta/auditar_sessao.py <Tn> <geracao|verificacao|correcao> [arquivo.jsonl]

- Lista chamadas de ferramenta com caminhos fora de ~/new-app; caminhos sensíveis
  (repositório do TCC, transcripts e memória do Claude) são desvios de protocolo.
- Extrai esforço: duração (prompt → última mensagem), tokens e interações humanas.
- Grava avaliacao/registros/auditoria/<Tn>_<etapa>.json e acrescenta esforco.csv.
"""
import csv, json, re, sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HOME = Path.home()
APP = HOME / "new-app"
PROJ = HOME / ".claude" / "projects" / str(APP).replace("/", "-")
SENSIVEIS = ["Mobile Documents", "Library/Mobile", "MBA Software Engineering", "/.claude/projects", "/.claude/memory",
             "avaliacao/", "geracoes/", "tcc-mongodb"]
PATH_RE = re.compile(r"(?:~|/(?:Users|private|tmp|var|etc|opt|usr|Volumes))[^\s'\"`;|&<>()]*")

def ts(e):
    t = e.get("timestamp")
    return datetime.fromisoformat(t.replace("Z", "+00:00")) if t else None

def strings(v):
    if isinstance(v, str): yield v
    elif isinstance(v, dict):
        for x in v.values(): yield from strings(x)
    elif isinstance(v, list):
        for x in v: yield from strings(x)

def main():
    tn, etapa = sys.argv[1], sys.argv[2]
    if len(sys.argv) > 3:
        principal = Path(sys.argv[3])
    else:
        principal = max(PROJ.glob("*.jsonl"), key=lambda p: p.stat().st_mtime)
    arquivos = [principal] + sorted((principal.parent / principal.stem).rglob("*.jsonl"))

    tempos, usos, chamadas, interacoes, modelos, inicio = [], {}, [], 0, set(), None
    for arq in arquivos:
        for linha in arq.open():
            try: e = json.loads(linha)
            except json.JSONDecodeError: continue
            if (t := ts(e)): tempos.append(t)
            msg = e.get("message") or {}
            if e.get("type") == "user" and arq == principal and not e.get("isMeta"):
                c = msg.get("content")
                texto = c if isinstance(c, str) else " ".join(b.get("text", "") for b in c or [] if b.get("type") == "text")
                # Comandos locais (/model, /exit...) e suas saídas não são interações com o agente.
                if texto.strip() and not texto.lstrip().startswith(("<command-name>", "<local-command")):
                    interacoes += 1
                    inicio = inicio or ts(e)
            if e.get("type") == "assistant":
                if msg.get("model"): modelos.add(msg["model"])
                if msg.get("id") and msg.get("usage"): usos[msg["id"]] = msg["usage"]
                for b in msg.get("content") or []:
                    if b.get("type") == "tool_use":
                        for s in strings(b.get("input")):
                            for p in PATH_RE.findall(s):
                                full = str(Path(p.replace("~", str(HOME), 1)))
                                # Saídas longas que o próprio Claude Code grava na pasta da sessão não são fuga.
                                proprio = full.startswith(str(PROJ / principal.stem / "tool-results"))
                                if not full.startswith(str(APP)) and not proprio:
                                    chamadas.append({"ferramenta": b.get("name"), "caminho": p,
                                                     "sensivel": any(k in full for k in SENSIVEIS)})

    tok = {k: sum(u.get(k, 0) or 0 for u in usos.values()) for k in
           ("input_tokens", "output_tokens", "cache_creation_input_tokens", "cache_read_input_tokens")}
    # Duração: do envio do prompt à última mensagem (exclui comandos de configuração).
    dur = round((max(tempos) - (inicio or min(tempos))).total_seconds() / 60, 1) if tempos else None
    desvios = [c for c in chamadas if c["sensivel"]]
    out = {"condicao": tn, "etapa": etapa, "transcript": str(principal), "modelos": sorted(modelos),
           "duracao_min": dur, "tokens": tok, "tokens_total": sum(tok.values()),
           "interacoes_humanas": interacoes, "desvios": desvios,
           "caminhos_externos_para_revisao": sorted({c["caminho"] for c in chamadas if not c["sensivel"]})}
    d = ROOT / "avaliacao" / "registros" / "auditoria"; d.mkdir(parents=True, exist_ok=True)
    (d / f"{tn}_{etapa}.json").write_text(json.dumps(out, ensure_ascii=False, indent=2))

    csvp = ROOT / "avaliacao" / "registros" / "esforco.csv"
    novo = not csvp.exists()
    with csvp.open("a", newline="") as f:
        w = csv.writer(f)
        if novo: w.writerow(["condicao", "etapa", "duracao_min", "tokens", "interacoes"])
        w.writerow([tn, etapa, dur, out["tokens_total"], interacoes])

    print(f"{tn}/{etapa}: {dur} min, {out['tokens_total']} tokens, {interacoes} interação(ões), modelos {out['modelos']}")
    esperado = "claude-opus-5-5" if etapa == "verificacao" else "claude-sonnet-5-5"
    if modelos and modelos != {esperado}:
        print(f"ALERTA: modelo(s) {sorted(modelos)} diferente(s) do protocolo ({esperado}). Etapa inválida.")
    print(f"DESVIOS: {len(desvios)}" + "".join(f"\n  {c['ferramenta']}: {c['caminho']}" for c in desvios))
    print(f"Caminhos externos não sensíveis (revisar): {len(out['caminhos_externos_para_revisao'])}")

if __name__ == "__main__":
    main()
