"""
data/ingredients.json + data/recipes.json + data.json
- 대분류 category: 육류 | 해산물 | 채소 | 가공품
- 중분류 sub_category: 돼지고기, 소고기, … (절대 비우지 않음)
- id: 문자열 슬러그
"""
from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"

SUBSTITUTION_FAMILIES: list[frozenset[str]] = [
    frozenset({"pork_belly", "pork_neck"}),
]


def slug(s: str) -> str:
    s = unicodedata.normalize("NFKD", s)
    s = re.sub(r"[^\w\s-]", "", s, flags=re.ASCII)
    return re.sub(r"[-\s]+", "-", s.strip().lower())[:48] or "dish"


def img_url(name_en: str) -> str:
    return f"https://picsum.photos/seed/{slug(name_en)}/800/500"


def build_ingredients() -> list[dict]:
    spec: list[tuple[str, str, str, str, list[str]]] = [
        # --- 육류 ---
        ("pork_belly", "삼겹살", "육류", "돼지고기", []),
        ("pork_neck", "목살", "육류", "돼지고기", ["돼지목살"]),
        ("beef_plate", "우삼겹", "육류", "소고기", []),
        ("beef_brisket", "차돌박이", "육류", "소고기", ["차돌"]),
        ("chicken_thigh", "닭다리살", "육류", "닭고기", []),
        ("chicken_breast", "닭가슴살", "육류", "닭고기", ["가슴살"]),
        ("egg", "계란", "육류", "난류", ["달걀"]),
        # --- 해산물 ---
        ("fish_mackerel", "고등어", "해산물", "생선", []),
        ("fish_salmon", "연어", "해산물", "생선", ["생연어"]),
        ("sea_shrimp", "새우", "해산물", "패류", ["왕새우"]),
        ("sea_squid", "오징어", "해산물", "패류", []),
        # --- 채소 ---
        ("veg_onion", "양파", "채소", "채소", []),
        ("veg_scallion", "대파", "채소", "채소", ["파"]),
        ("veg_garlic", "마늘", "채소", "채소", []),
        ("veg_lettuce", "상추", "채소", "채소", []),
        ("veg_kimchi", "김치", "채소", "채소", ["배추김치"]),
        ("veg_enoki", "팽이버섯", "채소", "버섯", ["팽이"]),
        ("veg_spinach", "시금치", "채소", "채소", []),
        # --- 가공품 ---
        ("proc_ramen", "라면사리", "가공품", "면류", ["라면"]),
        ("proc_spaghetti", "파스타면", "가공품", "면류", ["스파게티면"]),
        ("proc_dumpling", "만두", "가공품", "냉동·기타", ["왕만두"]),
        ("proc_fish_cake", "어묵", "가공품", "냉동·기타", ["오뎅"]),
        ("proc_spam", "스팸", "가공품", "냉동·기타", []),
        ("proc_instant_rice", "즉석밥", "가공품", "냉동·기타", ["밥"]),
        ("proc_tofu", "두부", "가공품", "냉동·기타", []),
        ("proc_soft_tofu", "순두부", "가공품", "냉동·기타", []),
        ("proc_sausage", "소시지", "가공품", "냉동·기타", []),
        ("proc_ham", "햄", "가공품", "냉동·기타", []),
        ("veg_potato", "감자", "채소", "채소", []),
    ]
    return [
        {"id": i, "name": n, "category": c, "sub_category": sc, "aliases": a}
        for i, n, c, sc, a in spec
    ]


def main() -> None:
    DATA.mkdir(parents=True, exist_ok=True)
    ingredients = build_ingredients()
    ids = {x["id"] for x in ingredients}
    assert len(ids) == len(ingredients)

    idx = {row["id"]: row for row in ingredients}

    def nm(s: str) -> str:
        return idx[s]["name"]

    def en(s: str) -> str:
        return slug(nm(s))

    SUB = ["veg_onion", "veg_scallion", "veg_garlic"]

    def R(
        name: str,
        cat: str,
        name_en: str,
        core: list[str],
        sub: list[str] | None = None,
        optional_any_of: list[list[str]] | None = None,
    ) -> dict:
        s = list(dict.fromkeys((sub or []) + SUB))
        for i in core + s:
            if i not in ids:
                raise ValueError(name, i)
        if optional_any_of:
            for grp in optional_any_of:
                for i in grp:
                    if i not in ids:
                        raise ValueError(name, i)
        return {
            "name": name,
            "category": cat,
            "name_en": name_en,
            "core_ingredients": core,
            "sub_ingredients": s,
            "optional_any_of": optional_any_of or [],
            "image_url": img_url(name_en),
        }

    recipes: list[dict] = []

    recipes += [
        R("제육볶음", "한식", "jeyuk", ["pork_neck"], ["veg_kimchi"]),
        R("삼겹살구이", "한식", "samgyeop", ["pork_belly", "veg_lettuce"], []),
        R("김치찌개", "한식", "kimchi jjigae", ["veg_kimchi", "pork_neck", "proc_tofu"], []),
        R("순두부찌개", "한식", "sundubu", ["proc_soft_tofu", "chicken_breast", "egg"], []),
        R("부대찌개", "한식", "budae", ["proc_spam", "proc_sausage", "proc_ramen", "proc_ham"], ["veg_potato"]),
        R("라볶이", "한식", "rabokki", ["proc_ramen", "proc_fish_cake", "veg_kimchi"], []),
        R("떡볶이 스타일", "한식", "tteokbokki style", ["proc_fish_cake", "veg_onion"], []),
        R("오징어볶음", "한식", "ojingeo", ["sea_squid", "veg_potato"], []),
        R("새우볶음", "한식", "shrimp stir", ["sea_shrimp", "veg_garlic"], []),
        R("연어구이", "한식", "salmon grill", ["fish_salmon", "veg_lettuce"], []),
        R("고등어조림", "한식", "mackerel", ["fish_mackerel", "veg_onion"], []),
        R("불고기", "한식", "bulgogi", ["beef_plate", "veg_onion"], []),
        R("차돌볶음", "한식", "brisket stir", ["beef_brisket", "veg_scallion"], []),
        R("닭볶음탕", "한식", "dakbokkeum", ["chicken_thigh", "veg_potato"], []),
        R("닭가슴살 샐러드", "한식", "chicken salad", ["chicken_breast", "veg_lettuce", "veg_spinach"], []),
        R("파스타 토마토", "이탈리안", "pasta tomato", ["proc_spaghetti", "veg_kimchi"], []),
        R("명란파스타", "이탈리안", "mentaiko pasta", ["proc_spaghetti", "sea_shrimp"], []),
    ]

    k_veg = [
        "veg_kimchi",
        "veg_onion",
        "veg_lettuce",
        "veg_spinach",
        "veg_enoki",
        "veg_potato",
        "veg_scallion",
    ]
    k_meat = [
        "pork_belly",
        "pork_neck",
        "beef_plate",
        "beef_brisket",
        "chicken_thigh",
        "chicken_breast",
    ]
    k_sea = ["fish_mackerel", "fish_salmon", "sea_shrimp", "sea_squid"]
    k_proc = [
        "proc_ramen",
        "proc_spaghetti",
        "proc_dumpling",
        "proc_fish_cake",
        "proc_spam",
        "proc_instant_rice",
    ]

    n = 0
    for v in k_veg:
        for m in k_meat:
            if n >= 42:
                break
            recipes.append(
                R(
                    f"{nm(v)}{nm(m)} 볶음",
                    "한식",
                    f"korean stir {en(v)} {en(m)}",
                    [v, m],
                    [],
                )
            )
            n += 1
        if n >= 42:
            break

    n2 = 0
    for p in k_proc:
        for s in k_sea:
            if n2 >= 24:
                break
            recipes.append(
                R(
                    f"{nm(p)} {nm(s)} 요리",
                    "한식",
                    f"dish {en(p)} {en(s)}",
                    [p, s],
                    [],
                )
            )
            n2 += 1
        if n2 >= 24:
            break

    n3 = 0
    for m in k_meat:
        for s in k_sea:
            if n3 >= 20:
                break
            recipes.append(
                R(
                    f"{nm(m)} {nm(s)} 덮밥",
                    "일식",
                    f"donburi {en(m)} {en(s)}",
                    [m, s, "proc_instant_rice"],
                    [],
                )
            )
            n3 += 1
        if n3 >= 20:
            break

    n4 = 0
    for pasta in ["proc_spaghetti", "proc_ramen"]:
        for prot in ["sea_shrimp", "sea_squid", "fish_salmon", "pork_neck", "chicken_breast"]:
            for veg in ["veg_spinach", "veg_enoki", "veg_potato", "veg_lettuce"]:
                if n4 >= 24:
                    break
                recipes.append(
                    R(
                        f"{nm(pasta)} {nm(prot)} {nm(veg)}",
                        "이탈리안",
                        f"italian {en(pasta)} {en(prot)} {en(veg)}",
                        [pasta, prot, veg],
                        [],
                    )
                )
                n4 += 1
            if n4 >= 24:
                break
        if n4 >= 24:
            break

    assert len(recipes) >= 100, len(recipes)

    (DATA / "ingredients.json").write_text(
        json.dumps(ingredients, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    (DATA / "recipes.json").write_text(
        json.dumps(recipes, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    (ROOT / "data.json").write_text(
        json.dumps({"ingredients": ingredients, "recipes": recipes}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    meta = {
        "substitution_families": [sorted(list(f)) for f in SUBSTITUTION_FAMILIES],
    }
    (DATA / "match_meta.json").write_text(
        json.dumps(meta, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print("ingredients", len(ingredients), "recipes", len(recipes))


if __name__ == "__main__":
    main()