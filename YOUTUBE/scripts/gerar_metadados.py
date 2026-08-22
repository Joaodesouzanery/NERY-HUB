#!/usr/bin/env python3
"""
Gera título, descrição e tags a partir do roteiro JSON produzido pelo prompt de
03-prompt-roteiro.md.

Uso:
    python3 gerar_metadados.py roteiro.json
    python3 gerar_metadados.py roteiro.json --canal "Obra Contada"

Saída: imprime os metadados prontos pra colar no YouTube Studio e salva
metadados_<arquivo>.txt ao lado do roteiro.
"""
import json
import sys
import argparse
from pathlib import Path


def carregar(caminho: str) -> dict:
    with open(caminho, encoding="utf-8") as f:
        return json.load(f)


def montar_titulo(roteiro: dict) -> str:
    # Usa o título sugerido pelo roteiro; cai pro gancho se faltar.
    return roteiro.get("titulo_sugerido") or roteiro.get("gancho_30s", "Sem título")[:100]


def montar_descricao(roteiro: dict, canal: str) -> str:
    cenas = roteiro.get("cenas", {})
    # Resumo a partir da narração das primeiras cenas (cheio de contexto/keywords).
    narracao = " ".join(c.get("narracao", "") for c in cenas.values())
    resumo = narracao[:280].rsplit(" ", 1)[0] + "..." if narracao else ""
    hashtags = " ".join(f"#{h.strip('# ')}" for h in roteiro.get("hashtags", [])[:5])
    cta = roteiro.get("cta", "Inscreva-se para mais histórias reais de obras.")
    titulo = montar_titulo(roteiro)
    return (
        f"{titulo}\n\n"
        f"{resumo}\n\n"
        f"▶ {cta}\n"
        f"Canal: {canal}\n\n"
        f"{hashtags}"
    )


def montar_tags(roteiro: dict) -> list:
    base = ["construcao", "obra", "engenharia civil", "canteiro de obras",
            "gestao de obras", "historia de obra"]
    extra = [h.strip("# ").lower() for h in roteiro.get("hashtags", [])]
    # Dedup preservando ordem, limite de 15 (recomendado do YouTube).
    vistos, tags = set(), []
    for t in base + extra:
        if t and t not in vistos:
            vistos.add(t)
            tags.append(t)
    return tags[:15]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("roteiro", help="caminho do roteiro .json")
    ap.add_argument("--canal", default="Meu Canal de Construção")
    args = ap.parse_args()

    roteiro = carregar(args.roteiro)
    titulo = montar_titulo(roteiro)
    descricao = montar_descricao(roteiro, args.canal)
    tags = montar_tags(roteiro)

    saida = (
        "=== TÍTULO ===\n" + titulo + "\n\n"
        "=== DESCRIÇÃO ===\n" + descricao + "\n\n"
        "=== TAGS (cole separadas por vírgula) ===\n" + ", ".join(tags) + "\n\n"
        "=== THUMBNAILS (conceitos) ===\n"
        + "\n".join(f"- {t}" for t in roteiro.get("thumbnails", [])) + "\n\n"
        "=== SHORTS SUGERIDOS ===\n"
        + "\n".join(
            f"- {s.get('inicio','?')}–{s.get('fim','?')}: {s.get('gancho_vertical','')}"
            for s in roteiro.get("shorts_sugeridos", [])
        )
    )

    print(saida)
    destino = Path(args.roteiro).with_name("metadados_" + Path(args.roteiro).stem + ".txt")
    destino.write_text(saida, encoding="utf-8")
    print(f"\n[salvo em {destino}]", file=sys.stderr)


if __name__ == "__main__":
    main()
