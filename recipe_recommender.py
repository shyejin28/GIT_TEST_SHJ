"""
data/recipes.json 기반 추천 (검색 필터).
선택한 각 재료 id가 레시피의 (core ∪ sub ∪ optional, 대체군 확장 풀)에 포함되면 통과.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

_ROOT = Path(__file__).resolve().parent
_RECIPES_PATH = _ROOT / "data" / "recipes.json"


def load_data() -> dict[str, Any]:
    with _RECIPES_PATH.open(encoding="utf-8") as f:
        recipes = json.load(f)
    return {"recipes": recipes}


def recipe_matches(fridge: set[str], r: dict[str, Any]) -> bool:
    from kitchen_data import recipe_allowed_ids

    if not fridge:
        return True
    pool = recipe_allowed_ids(r)
    return all(x in pool for x in fridge)


# 예시: 김치 id
user_fridge: list[str] = ["veg_kimchi"]


def recommend_recipes(
    fridge: list[str] | None = None,
    *,
    data: dict[str, Any] | None = None,
) -> list[dict[str, Any]]:
    payload = data if data is not None else load_data()
    have = {str(x) for x in (fridge if fridge is not None else user_fridge)}
    return [r for r in payload["recipes"] if recipe_matches(have, r)]


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    recipes = recommend_recipes()
    print(f"recipes: {_RECIPES_PATH}")
    print(f"user_fridge: {sorted(user_fridge)}")
    print(f"매칭 요리: {len(recipes)}개\n")
    for r in recipes[:20]:
        print(f"  - {r['name']} ({r.get('category', '')})")
    if len(recipes) > 20:
        print(f"  ... 외 {len(recipes) - 20}개")
