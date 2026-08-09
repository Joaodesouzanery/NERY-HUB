"""
antweb_client.py — Cliente Python para a API do AntWeb (https://www.antweb.org/api.do)

Objetivo
--------
Puxar de forma robusta os *specimens* do AntWeb (nomes, taxonomia, localidade,
metadados e URLs de imagens, incluindo as "Favorite Images"), com paginação
completa, retries e filtros configuráveis.

Notas importantes
-----------------
1. A API v2 do AntWeb é REST e retorna JSON. Endpoint base:
       https://www.antweb.org/api/v2/
   Parâmetros comuns aceitos (todos opcionais, combináveis):
       taxonName, subfamily, genus, species, country, adm1 (estado/UF),
       bbox (minLng,minLat,maxLng,maxLat), habitat, elevation,
       dateStart, dateEnd, dateUpdate, georeferenced,
       limit (máx. 1000), offset
   Resposta: { "count": <int>, "results": [ {specimen}, ... ] }
   Cada specimen traz um bloco "images" com shot_types (h=cabeça, p=perfil,
   d=dorsal, l=etiqueta) e cada shot traz uma lista de URLs (thumb/med/high).

2. "Favorite Images": no AntWeb, curadores marcam a imagem representativa de um
   táxon. Quando a API expõe esse flag ele é lido; caso contrário usamos a
   melhor imagem de perfil (p) em alta como representante. Veja pick_favorite_image().

3. Este ambiente de execução BLOQUEIA o acesso a antweb.org (proxy de egress).
   Por isso o cliente aceita `session=` injetável e há um modo mock em build.py
   para validar todo o pipeline offline. Ao rodar na sua máquina/deploy com rede,
   o cliente fala com a API real sem alterações.

Referência: https://www.antweb.org/api.do  e  https://www.antweb.org/documentation/api/
"""
from __future__ import annotations

import time
import logging
from dataclasses import dataclass, field
from typing import Any, Dict, Iterable, Iterator, List, Optional

try:
    import requests
except Exception:  # pragma: no cover - requests é dependência declarada
    requests = None  # type: ignore

log = logging.getLogger("antweb")

API_V2_BASE = "https://www.antweb.org/api/v2/"
# Tamanho de página. A API aceita até 1000; usamos algo educado por padrão.
DEFAULT_PAGE_SIZE = 100
# Ordem de preferência dos tamanhos de imagem (do maior p/ menor) no nome do arquivo.
IMG_SIZE_PREFERENCE = ("high", "med", "low", "thumbview")
# Ordem de preferência de tomada (shot) para escolher a imagem "favorita"/representativa.
SHOT_PREFERENCE = ("p", "h", "d", "l")  # perfil, cabeça, dorsal, etiqueta


@dataclass
class AntWebConfig:
    base_url: str = API_V2_BASE
    page_size: int = DEFAULT_PAGE_SIZE
    max_records: Optional[int] = None      # None = todos (paginação até count)
    max_retries: int = 4
    backoff_base: float = 2.0              # 2s, 4s, 8s, 16s
    timeout: float = 60.0
    sleep_between_pages: float = 0.5       # cortesia com o servidor
    user_agent: str = "NERY-HUB-AntWeb-Client/1.0 (research; contact via repo)"


class AntWebClient:
    """Cliente da API v2 do AntWeb com paginação e retries."""

    def __init__(self, config: Optional[AntWebConfig] = None, session: Any = None):
        self.cfg = config or AntWebConfig()
        # `session` permite injetar um mock (objeto com .get(url, params, timeout)).
        if session is not None:
            self.session = session
        else:
            if requests is None:
                raise RuntimeError(
                    "A biblioteca 'requests' não está instalada. "
                    "Rode: pip install -r antweb/requirements.txt"
                )
            self.session = requests.Session()
            self.session.headers.update({"User-Agent": self.cfg.user_agent})

    # ------------------------------------------------------------------ HTTP
    def _get(self, params: Dict[str, Any]) -> Dict[str, Any]:
        last_exc: Optional[Exception] = None
        for attempt in range(self.cfg.max_retries):
            try:
                resp = self.session.get(
                    self.cfg.base_url, params=params, timeout=self.cfg.timeout
                )
                status = getattr(resp, "status_code", 200)
                if status >= 500 or status == 429:
                    raise RuntimeError(f"HTTP {status} do AntWeb")
                if hasattr(resp, "raise_for_status"):
                    resp.raise_for_status()
                return resp.json()
            except Exception as exc:  # rede instável / 5xx / rate limit
                last_exc = exc
                wait = self.cfg.backoff_base ** (attempt + 1)
                log.warning(
                    "Falha ao consultar AntWeb (tentativa %d/%d): %s — aguardando %.0fs",
                    attempt + 1, self.cfg.max_retries, exc, wait,
                )
                time.sleep(wait)
        raise RuntimeError(f"AntWeb inacessível após {self.cfg.max_retries} tentativas") from last_exc

    # ---------------------------------------------------------------- páginas
    def iter_specimens(self, **filters: Any) -> Iterator[Dict[str, Any]]:
        """Itera por TODOS os specimens que casam com os filtros, paginando.

        Ex.: client.iter_specimens(genus="pheidole")
             client.iter_specimens(taxonName="formicidae", country="Brazil")
        """
        offset = 0
        yielded = 0
        total: Optional[int] = None
        while True:
            params = {k: v for k, v in filters.items() if v not in (None, "")}
            params.update({"limit": self.cfg.page_size, "offset": offset})
            payload = self._get(params)
            results = _extract_results(payload)
            if total is None:
                total = _extract_count(payload, fallback=len(results))
                log.info("AntWeb informou count=%s para filtros=%s", total, filters)
            if not results:
                break
            for rec in results:
                yield rec
                yielded += 1
                if self.cfg.max_records and yielded >= self.cfg.max_records:
                    return
            offset += len(results)
            if total is not None and offset >= total:
                break
            time.sleep(self.cfg.sleep_between_pages)

    def fetch_all(self, **filters: Any) -> List[Dict[str, Any]]:
        return list(self.iter_specimens(**filters))


# ----------------------------------------------------------------- parsing helpers
def _extract_results(payload: Dict[str, Any]) -> List[Dict[str, Any]]:
    """A API v2 usa 'results'; toleramos 'specimens' por robustez."""
    for key in ("results", "specimens", "data"):
        val = payload.get(key)
        if isinstance(val, list):
            return val
    return []


def _extract_count(payload: Dict[str, Any], fallback: int = 0) -> int:
    for key in ("count", "total", "totalResults"):
        val = payload.get(key)
        if isinstance(val, (int, float)):
            return int(val)
        if isinstance(val, str) and val.isdigit():
            return int(val)
    return fallback


def _first(rec: Dict[str, Any], *keys: str) -> str:
    for k in keys:
        v = rec.get(k)
        if v not in (None, ""):
            return str(v)
    return ""


def flatten_specimen(rec: Dict[str, Any]) -> Dict[str, Any]:
    """Achata um registro de specimen em colunas planas para planilha/CSV."""
    lat = _first(rec, "decimal_latitude", "latitude")
    lon = _first(rec, "decimal_longitude", "longitude")
    # Alguns registros trazem geo em geojson.
    geo = rec.get("geojson") or {}
    if (not lat or not lon) and isinstance(geo, dict):
        coord = geo.get("coord") or geo.get("coordinates")
        if isinstance(coord, (list, tuple)) and len(coord) == 2:
            lon, lat = str(coord[0]), str(coord[1])

    catalog = _first(rec, "catalogNumber", "code", "specimenCode", "specimen")
    images = collect_image_urls(rec)
    fav = pick_favorite_image(rec, images)
    return {
        "catalogNumber": catalog,
        "url": _first(rec, "url") or (f"https://www.antweb.org/specimen/{catalog}" if catalog else ""),
        "family": _first(rec, "family"),
        "subfamily": _first(rec, "subfamily"),
        "genus": _first(rec, "genus"),
        "species": _first(rec, "species", "specificEpithet"),
        "scientific_name": _first(rec, "scientific_name", "scientificName") or
                           " ".join(x for x in [_first(rec, "genus"),
                                                _first(rec, "species", "specificEpithet")] if x),
        "typeStatus": _first(rec, "typeStatus"),
        "caste": _first(rec, "caste"),
        "country": _first(rec, "country"),
        "stateProvince": _first(rec, "stateProvince", "adm1"),
        "locality": _first(rec, "localityName", "locality"),
        "habitat": _first(rec, "habitat"),
        "minimumElevationInMeters": _first(rec, "minimumElevationInMeters", "elevation"),
        "dateIdentified": _first(rec, "dateIdentified"),
        "decimal_latitude": lat,
        "decimal_longitude": lon,
        "n_images": len(images),
        "image_urls": " | ".join(images),
        "favorite_image": fav,
    }


def collect_image_urls(rec: Dict[str, Any]) -> List[str]:
    """Extrai todas as URLs de imagem de um specimen, priorizando alta resolução."""
    urls: List[str] = []
    images = rec.get("images")
    if not isinstance(images, dict):
        return urls
    for _img_key, block in images.items():
        if not isinstance(block, dict):
            continue
        shots = block.get("shot_types") or block.get("shots") or {}
        if not isinstance(shots, dict):
            continue
        for _shot, shot_block in shots.items():
            candidates: List[str] = []
            if isinstance(shot_block, dict):
                for v in shot_block.values():
                    if isinstance(v, str) and v.startswith("http"):
                        candidates.append(v)
                    elif isinstance(v, list):
                        candidates += [u for u in v if isinstance(u, str) and u.startswith("http")]
            elif isinstance(shot_block, list):
                candidates += [u for u in shot_block if isinstance(u, str) and u.startswith("http")]
            best = _best_by_size(candidates)
            if best:
                urls.append(best)
    # de-dup preservando ordem
    seen = set()
    out = []
    for u in urls:
        if u not in seen:
            seen.add(u)
            out.append(u)
    return out


def _best_by_size(candidates: List[str]) -> str:
    if not candidates:
        return ""
    for size in IMG_SIZE_PREFERENCE:
        for u in candidates:
            if size in u:
                return u
    return candidates[0]


def pick_favorite_image(rec: Dict[str, Any], all_urls: Optional[List[str]] = None) -> str:
    """Retorna a "Favorite Image" (representativa) do specimen.

    1) Se a API marcar explicitamente (chaves 'favorite'/'representative'/'main'), usa.
    2) Senão, escolhe pela ordem de preferência de tomada (perfil > cabeça > dorsal).
    """
    images = rec.get("images")
    if isinstance(images, dict):
        for _k, block in images.items():
            if isinstance(block, dict) and (
                block.get("favorite") or block.get("representative") or block.get("main")
            ):
                shots = block.get("shot_types") or block.get("shots") or {}
                for shot in SHOT_PREFERENCE:
                    sb = shots.get(shot) if isinstance(shots, dict) else None
                    urls = _urls_from_shot(sb)
                    best = _best_by_size(urls)
                    if best:
                        return best
        # sem flag: preferir perfil (p) em alta
        for shot in SHOT_PREFERENCE:
            for _k, block in images.items():
                if not isinstance(block, dict):
                    continue
                shots = block.get("shot_types") or block.get("shots") or {}
                sb = shots.get(shot) if isinstance(shots, dict) else None
                best = _best_by_size(_urls_from_shot(sb))
                if best:
                    return best
    all_urls = all_urls if all_urls is not None else collect_image_urls(rec)
    return all_urls[0] if all_urls else ""


def _urls_from_shot(shot_block: Any) -> List[str]:
    out: List[str] = []
    if isinstance(shot_block, dict):
        for v in shot_block.values():
            if isinstance(v, str) and v.startswith("http"):
                out.append(v)
            elif isinstance(v, list):
                out += [u for u in v if isinstance(u, str) and u.startswith("http")]
    elif isinstance(shot_block, list):
        out += [u for u in shot_block if isinstance(u, str) and u.startswith("http")]
    return out
