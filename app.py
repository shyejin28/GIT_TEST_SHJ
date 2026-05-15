from __future__ import annotations

from flask import Flask, jsonify, render_template, request

from kitchen_data import (
    INGREDIENTS,
    INGREDIENTS_BY_CATEGORY,
    RECIPES,
    SUBSTITUTION_FAMILIES,
    recipe_matches_selection,
)

app = Flask(__name__)


@app.get("/")
def index() -> str:
    return render_template("index.html")


@app.get("/api/bootstrap")
def bootstrap():
    return jsonify(
        {
            "ingredients": INGREDIENTS,
            "ingredientsByCategory": INGREDIENTS_BY_CATEGORY,
            "recipes": RECIPES,
            "substitutionFamilies": [sorted(list(f)) for f in SUBSTITUTION_FAMILIES],
        }
    )


@app.post("/api/recommend")
def recommend():
    """
    검색 필터: 선택한 각 재료 id가 레시피의 (core ∪ sub ∪ optional 대안) 풀에 있으면 통과.
    선택이 비어 있으면 전체 레시피 반환.
    """
    body = request.get_json(silent=True) or {}
    raw = body.get("selected")
    if not isinstance(raw, list):
        return jsonify({"error": "selected must be a list of ingredient ids"}), 400

    selected: set[str] = set()
    for x in raw:
        if x is None:
            return jsonify({"error": "selected ids must be strings"}), 400
        s = str(x).strip()
        if not s:
            return jsonify({"error": "selected ids must be non-empty strings"}), 400
        selected.add(s)

    if not selected:
        results = list(RECIPES)
    else:
        results = [r for r in RECIPES if recipe_matches_selection(selected, r)]

    results.sort(key=lambda x: (len(x["core_ingredients"]), x["name"]))

    return jsonify(
        {
            "results": results,
            "message": None if results else "선택하신 재료로 만들 수 있는 요리가 아직 없어요.",
        }
    )


if __name__ == "__main__":
    # Windows: 포트 5000은 AirPlay 등과 충돌하는 경우가 많음. localhost는 IPv6(::1)만 가리켜
    # 연결 실패할 수 있어 127.0.0.1로 접속하도록 안내합니다.
    port = 8080
    print(f"\n  서버 시작: http://127.0.0.1:{port}\n  (브라우저 주소창에 위 주소를 입력하세요. 'localhost' 대신 127.0.0.1 권장)\n")
    app.run(debug=True, host="0.0.0.0", port=port, use_reloader=False)
