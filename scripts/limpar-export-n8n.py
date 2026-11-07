#!/usr/bin/env python3
"""Limpa um export de workflow do n8n antes de versionar.

Uso: python3 scripts/limpar-export-n8n.py entrada.json saida.json

Remove credenciais, metadados da instância, pinData, URLs em cache e e-mails,
e troca os webhookId. IDs específicos da conta (funil, campos, planilhas)
devem ser substituídos manualmente pelos marcadores de docs/mapeamento-campos.md.
"""
import json
import re
import sys
import uuid

EMAIL = re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+")


def limpar(valor):
    if isinstance(valor, dict):
        return {k: limpar(v) for k, v in valor.items() if k not in ("cachedResultUrl",)}
    if isinstance(valor, list):
        return [limpar(v) for v in valor]
    if isinstance(valor, str):
        return EMAIL.sub("seu-email@exemplo.com", valor)
    return valor


def main(entrada, saida):
    w = json.load(open(entrada, encoding="utf-8"))
    for chave in ("id", "versionId", "meta", "tags", "shared"):
        w.pop(chave, None)
    w["pinData"] = {}
    w["active"] = False
    for no in w.get("nodes", []):
        no.pop("credentials", None)
        if "webhookId" in no:
            no["webhookId"] = str(uuid.uuid4())
    w = limpar(w)
    with open(saida, "w", encoding="utf-8") as f:
        json.dump(w, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"Export limpo salvo em {saida}. Revise os IDs da conta antes do commit.")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
