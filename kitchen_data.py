"""냉장고 UI용 데이터: data/*.json (build_kitchen_data.py 생성)."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

_ROOT = Path(__file__).resolve().parent
_DATA = _ROOT / "data"


def _load_json(rel: str) -> Any:
    path = _DATA / rel
    if not path.is_file():
        raise FileNotFoundError(
            f"Missing {path}. Run: python tools/build_kitchen_data.py"
        )
    with path.open(encoding="utf-8") as f:
        return json.load(f)


INGREDIENTS: list[dict[str, Any]] = _load_json("ingredients.json")
RECIPES: list[dict[str, Any]] = _load_json("recipes.json")

_meta_path = _DATA / "match_meta.json"
if _meta_path.is_file():
    _META: dict[str, Any] = json.loads(_meta_path.read_text(encoding="utf-8"))
else:
    _META = {"substitution_families": []}

SUBSTITUTION_FAMILIES: list[frozenset[str]] = [
    frozenset(str(x) for x in grp) for grp in _META.get("substitution_families", [])
]


def expand_id_set(ids: set[str]) -> set[str]:
    out = set(ids)
    for i in list(out):
        for fam in SUBSTITUTION_FAMILIES:
            if i in fam:
                out |= fam
    return out


UI_CATEGORY_ORDER = ("육류", "해산물", "채소", "가공품")

INGREDIENTS_BY_CATEGORY: dict[str, list[dict[str, Any]]] = {
    c: [dict(x) for x in INGREDIENTS if x.get("category") == c] for c in UI_CATEGORY_ORDER
}

_ID_SET = {str(x["id"]) for x in INGREDIENTS}
assert len(_ID_SET) == len(INGREDIENTS)


def recipe_allowed_ids(r: dict[str, Any]) -> set[str]:
    """레시피 허용 풀(주·부·optional) + 대체군 확장."""
    raw: set[str] = set(str(x) for x in r["core_ingredients"])
    raw.update(str(x) for x in r.get("sub_ingredients", []))
    for grp in r.get("optional_any_of", []):
        raw.update(str(x) for x in grp)
    return expand_id_set(raw)


def recipe_matches_selection(selected: set[str], r: dict[str, Any]) -> bool:
    if not selected:
        return True
    pool = recipe_allowed_ids(r)
    return all(x in pool for x in selected)


for _r in RECIPES:
    for _k in ("core_ingredients", "sub_ingredients"):
        for _i in _r.get(_k, []):
            if str(_i) not in _ID_SET:
                raise ValueError(f"{_r.get('name')}: unknown ingredient id {_i}")
    for _g in _r.get("optional_any_of", []):
        for _i in _g:
            if str(_i) not in _ID_SET:
                raise ValueError(f"{_r.get('name')}: unknown optional id {_i}")

assert len(RECIPES) >= 100
