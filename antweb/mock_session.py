"""
mock_session.py — Sessão HTTP falsa para validar o pipeline sem rede.

Emula o contrato de `requests.Session.get(url, params=..., timeout=...)`,
respondendo com fixtures que imitam a estrutura JSON real da API v2 do AntWeb.
Serve apenas para testar build.py offline (o antweb.org está bloqueado neste
ambiente). Em produção, NÃO é usado — o cliente fala com a API real.
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List


class _Resp:
    def __init__(self, payload: Dict[str, Any], status_code: int = 200):
        self._payload = payload
        self.status_code = status_code

    def json(self) -> Dict[str, Any]:
        return self._payload

    def raise_for_status(self) -> None:
        if self.status_code >= 400:
            raise RuntimeError(f"HTTP {self.status_code}")


class MockSession:
    def __init__(self, fixtures_path: Path):
        self.fixtures: Dict[str, List[Dict[str, Any]]] = json.loads(
            Path(fixtures_path).read_text(encoding="utf-8")
        )
        self.headers: Dict[str, str] = {}

    def get(self, url: str, params: Dict[str, Any] = None, timeout: float = 0) -> _Resp:
        params = params or {}
        genus = str(params.get("genus", "")).lower()
        limit = int(params.get("limit", 100))
        offset = int(params.get("offset", 0))
        pool = self.fixtures.get(genus, [])
        page = pool[offset: offset + limit]
        return _Resp({"count": len(pool), "results": page})
