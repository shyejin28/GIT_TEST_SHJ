/**
 * 검색·계층 UI.
 * 대분류(category) → 중분류(sub_category) → 재료 칩.
 */

/** 왼쪽 아코디언 최상단 순서 (대분류) */
const ROOT_ORDER = ["육류", "해산물", "채소", "가공품"];

/** 중분류 표시 순서 (데이터에 없는 라벨은 건너뜀) */
const SUB_ORDER_BY_ROOT = {
  육류: ["돼지고기", "소고기", "닭고기", "난류"],
  해산물: ["생선", "패류"],
  채소: ["채소", "버섯"],
  가공품: ["면류", "냉동·기타"],
};

/** @type {Set<string>[]} */
let substitutionFamilies = [];

const state = {
  selected: new Set(),
  idToName: new Map(),
  allIngredients: [],
  ingredientsByCategory: null,
  recipes: null,
  /** @type {Record<string, boolean>} */
  accordionMajor: {},
  /** @type {Record<string, boolean>} */
  accordionSub: {},
  _accordionInited: false,
};

const $ = (sel) => document.querySelector(sel);

/** 재료 id는 항상 문자열로 통일 */
function sid(x) {
  return String(x);
}

function subKey(root, leaf) {
  return `${root}|||${leaf}`;
}

/**
 * 전체 재료에서 대분류→중분류 트리를 한 번에 파생 (빈 필드는 제외).
 * @param {object[]} ingredients
 * @returns {Record<string, Record<string, object[]>>}
 */
function buildCategoryTree(ingredients) {
  return ingredients.reduce((acc, it) => {
    const cat = String(it.category || "").trim();
    const sub = String(it.sub_category || "").trim();
    if (!cat || !sub) return acc;
    if (!acc[cat]) acc[cat] = {};
    if (!acc[cat][sub]) acc[cat][sub] = [];
    acc[cat][sub].push(it);
    return acc;
  }, {});
}

function buildRecipeImageUrl(nameEn) {
  return fallbackImageUrl(nameEn);
}

function fallbackImageUrl(nameEn) {
  const slug = String(nameEn || "recipe")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `https://picsum.photos/seed/${slug.slice(0, 40)}/800/500`;
}

function categoryPillClass(cat) {
  if (cat === "한식") return "border-amber-200 bg-amber-50 text-amber-900";
  if (cat === "일식") return "border-sky-200 bg-sky-50 text-sky-900";
  if (cat === "이탈리안") return "border-rose-200 bg-rose-50 text-rose-900";
  return "border-line bg-gray-50 text-ink";
}

function recipeAllowedIdsRaw(r) {
  const s = new Set((r.core_ingredients || []).map(sid));
  for (const x of r.sub_ingredients || []) s.add(sid(x));
  for (const grp of r.optional_any_of || []) {
    for (const x of grp) s.add(sid(x));
  }
  return s;
}

function expandMatchPool(baseIds) {
  const s = new Set(baseIds);
  for (const id of [...s]) {
    for (const fam of substitutionFamilies) {
      if (fam.has(id)) for (const x of fam) s.add(x);
    }
  }
  return s;
}

function recipeAllowedIds(r) {
  return expandMatchPool(recipeAllowedIdsRaw(r));
}

function recipeMatchesSelected(r, selectedSet) {
  if (!selectedSet.size) return true;
  const pool = recipeAllowedIds(r);
  return [...selectedSet].every((id) => pool.has(sid(id)));
}

function filterRecipes() {
  if (!state.recipes) return [];
  return state.recipes.filter((r) => recipeMatchesSelected(r, state.selected));
}

function tierOf(item) {
  const root = String(item.category || "").trim();
  const sub = String(item.sub_category || "").trim();
  return { root, sub };
}

function itemMatchesSearch(item, raw) {
  const t = String(raw).trim();
  if (!t) return false;
  const lower = t.toLowerCase();
  const parts = [item.name, ...((item.aliases || []).map(String))];
  return parts.some((s) => s.includes(t) || s.toLowerCase().includes(lower));
}

function collectSubsForRoot(root) {
  const tree = buildCategoryTree(state.allIngredients);
  const set = new Set(Object.keys(tree[root] || {}));
  const preferred = SUB_ORDER_BY_ROOT[root] || [];
  const out = [];
  for (const s of preferred) if (set.has(s)) out.push(s);
  for (const s of set) if (!out.includes(s)) out.push(s);
  return out;
}

function rootHasAnyIngredient(root) {
  return state.allIngredients.some((it) => tierOf(it).root === root);
}

function ensureAccordionDefaults() {
  if (state._accordionInited || !state.allIngredients.length) return;
  state._accordionInited = true;
  for (const r of ROOT_ORDER) state.accordionMajor[r] = false;
  const firstR = ROOT_ORDER.find((r) => rootHasAnyIngredient(r));
  if (firstR) state.accordionMajor[firstR] = true;

  for (const r of ROOT_ORDER) {
    for (const s of collectSubsForRoot(r)) {
      state.accordionSub[subKey(r, s)] = false;
    }
  }

  if (firstR) {
    const subs = collectSubsForRoot(firstR);
    if (subs[0]) state.accordionSub[subKey(firstR, subs[0])] = true;
  }
}

function selectIngredient(id) {
  const n = sid(id);
  if (state.selected.has(n)) return;
  state.selected.add(n);
  syncLeftPanel();
}

function removeIngredient(id) {
  state.selected.delete(sid(id));
  syncLeftPanel();
}

function toggleMajor(root) {
  state.accordionMajor[root] = !state.accordionMajor[root];
  renderCategories();
}

function toggleSub(root, leaf) {
  const k = subKey(root, leaf);
  state.accordionSub[k] = !state.accordionSub[k];
  renderCategories();
}

function syncLeftPanel() {
  ensureAccordionDefaults();
  renderSearchResults();
  renderCategories();
  renderSelectedTags();
  updateSelectionLabel();
  refreshResults();
}

function renderSearchResults() {
  const wrap = $("#search-results");
  const input = $("#ingredient-search");
  if (!wrap || !input) return;

  const q = input.value;
  if (!q.trim()) {
    wrap.classList.add("hidden");
    wrap.innerHTML = "";
    return;
  }

  const matched = state.allIngredients.filter(
    (it) => itemMatchesSearch(it, q) && !state.selected.has(sid(it.id))
  );

  wrap.innerHTML = "";
  if (!matched.length) {
    wrap.classList.remove("hidden");
    const p = document.createElement("p");
    p.className = "px-3 py-3 text-center text-xs text-gray-500";
    p.textContent = "일치하는 미선택 재료가 없습니다.";
    wrap.appendChild(p);
    return;
  }

  wrap.classList.remove("hidden");
  for (const item of matched.slice(0, 40)) {
    const id = sid(item.id);
    const t = tierOf(item);
    const path = t.root && t.sub ? `${t.root} · ${t.sub}` : ingredientLabel(id);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("role", "option");
    btn.className =
      "flex w-full flex-col gap-0.5 border-b border-line px-3 py-2.5 text-left text-sm transition last:border-b-0 hover:bg-gray-50";
    btn.innerHTML = `<span class="font-medium text-ink">${escapeHtml(item.name)}</span>
      <span class="text-[11px] text-gray-400">${escapeHtml(path)}</span>`;
    btn.addEventListener("click", () => {
      selectIngredient(id);
      input.value = "";
      renderSearchResults();
    });
    wrap.appendChild(btn);
  }
  if (matched.length > 40) {
    const note = document.createElement("p");
    note.className = "border-t border-line px-3 py-2 text-center text-[11px] text-gray-400";
    note.textContent = `상위 40개만 표시 (총 ${matched.length}개)`;
    wrap.appendChild(note);
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderCategories() {
  const host = $("#category-accordions");
  if (!host || !state.allIngredients.length) return;
  host.innerHTML = "";

  const tree = buildCategoryTree(state.allIngredients);

  for (const displayRoot of ROOT_ORDER) {
    if (!rootHasAnyIngredient(displayRoot)) continue;

    const rootOpen = !!state.accordionMajor[displayRoot];
    const rootBlock = document.createElement("div");
    rootBlock.className = "mb-2 overflow-hidden rounded-xl border border-line bg-white shadow-sm";

    const rHead = document.createElement("button");
    rHead.type = "button";
    rHead.className =
      "flex w-full items-center justify-between gap-2 bg-white px-4 py-3 text-left text-sm font-semibold text-ink transition hover:bg-gray-50";
    rHead.setAttribute("aria-expanded", rootOpen ? "true" : "false");
    rHead.innerHTML = `<span>${escapeHtml(displayRoot)}</span><span class="text-gray-400" aria-hidden="true">${rootOpen ? "▲" : "▼"}</span>`;
    rHead.addEventListener("click", () => toggleMajor(displayRoot));

    const rPanel = document.createElement("div");
    rPanel.className = rootOpen ? "border-t border-line bg-gray-50/60 px-2 py-2" : "hidden";

    if (rootOpen) {
      const subs = collectSubsForRoot(displayRoot);
      for (const sub of subs) {
        const items = (tree[displayRoot] && tree[displayRoot][sub]) || [];
        if (!items.length) continue;

        const sk = subKey(displayRoot, sub);
        const subOpen = !!state.accordionSub[sk];
        const subWrap = document.createElement("div");
        subWrap.className = "mb-1.5 overflow-hidden rounded-lg border border-line bg-white last:mb-0";

        const sHead = document.createElement("button");
        sHead.type = "button";
        sHead.className =
          "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-semibold text-gray-800 transition hover:bg-gray-50";
        sHead.setAttribute("aria-expanded", subOpen ? "true" : "false");
        sHead.innerHTML = `<span>${escapeHtml(sub)} <span class="font-normal text-gray-400">(${items.length})</span></span><span class="text-gray-400">${subOpen ? "▲" : "▼"}</span>`;
        sHead.addEventListener("click", () => toggleSub(displayRoot, sub));

        const sPanel = document.createElement("div");
        sPanel.className = subOpen ? "border-t border-line px-2 py-2" : "hidden";

        if (subOpen) {
          const row = document.createElement("div");
          row.className = "flex flex-wrap gap-2";
          for (const item of [...items].sort((a, b) => a.name.localeCompare(b.name, "ko"))) {
            const id = sid(item.id);
            const on = state.selected.has(id);
            const btn = document.createElement("button");
            btn.type = "button";
            if (on) {
              btn.disabled = true;
              btn.className =
                "inline-flex cursor-default items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500";
              btn.innerHTML = `${escapeHtml(item.name)} <span class="rounded bg-white px-1 py-0.5 text-[10px]">선택됨</span>`;
            } else {
              btn.className =
                "rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-medium text-ink shadow-sm transition hover:border-gray-300 hover:bg-gray-50";
              btn.textContent = item.name;
              const als = (item.aliases || []).filter(Boolean);
              btn.title = als.length ? `${item.name} · ${als.join(", ")}` : item.name;
              btn.addEventListener("click", () => selectIngredient(id));
            }
            row.appendChild(btn);
          }
          sPanel.appendChild(row);
        }

        subWrap.appendChild(sHead);
        subWrap.appendChild(sPanel);
        rPanel.appendChild(subWrap);
      }
    }

    rootBlock.appendChild(rHead);
    rootBlock.appendChild(rPanel);
    host.appendChild(rootBlock);
  }
}

function renderSelectedTags() {
  const host = $("#selected-tags");
  const hint = $("#selected-empty-hint");
  if (!host) return;
  host.innerHTML = "";

  const ids = [...state.selected].sort(
    (a, b) => ingredientLabel(a).localeCompare(ingredientLabel(b), "ko")
  );

  if (hint) hint.classList.toggle("hidden", ids.length > 0);

  for (const id of ids) {
    const chip = document.createElement("div");
    chip.className =
      "inline-flex max-w-full items-center gap-1 rounded-full border border-line bg-gray-50 pl-3 pr-1 py-1 text-sm text-ink shadow-sm";
    chip.setAttribute("role", "listitem");

    const label = document.createElement("span");
    label.className = "truncate";
    label.textContent = ingredientLabel(id);

    const rm = document.createElement("button");
    rm.type = "button";
    rm.className =
      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-200 hover:text-ink";
    rm.setAttribute("aria-label", `${ingredientLabel(id)} 제거`);
    rm.textContent = "×";
    rm.addEventListener("click", () => removeIngredient(id));

    chip.appendChild(label);
    chip.appendChild(rm);
    host.appendChild(chip);
  }
}

function ingredientLabel(id) {
  return state.idToName.get(sid(id)) || `#${sid(id)}`;
}

function updateSelectionLabel() {
  const el = $("#selection-count");
  if (el) el.textContent = `선택: ${state.selected.size}개`;
}

function clearSelection() {
  state.selected.clear();
  syncLeftPanel();
}

function refreshResults() {
  const grid = $("#results-grid");
  const empty = $("#results-empty");
  const hint = $("#results-hint");

  const matched = filterRecipes();
  matched.sort((a, b) => {
    const la = (a.core_ingredients || []).length;
    const lb = (b.core_ingredients || []).length;
    if (la !== lb) return la - lb;
    return a.name.localeCompare(b.name, "ko");
  });

  if (state.selected.size === 0) {
    empty.classList.remove("hidden");
    empty.textContent = "재료를 선택하면 조건에 맞는 요리만 보입니다. (선택 없음: 전체 목록)";
    grid.classList.remove("hidden");
    hint.textContent = `전체 ${matched.length}개`;
    renderRecipeCards(matched, grid, true);
    return;
  }

  if (matched.length === 0) {
    empty.classList.remove("hidden");
    empty.textContent = "선택하신 재료로 만들 수 있는 요리가 아직 없어요.";
    grid.classList.add("hidden");
    grid.innerHTML = "";
    hint.textContent = "";
    return;
  }

  empty.classList.add("hidden");
  grid.classList.remove("hidden");
  hint.textContent = `조건에 맞는 요리 ${matched.length}개 (선택이 많을수록 좁아짐)`;

  renderRecipeCards(matched, grid, false);
}

function renderRecipeCards(list, grid, isAllMode) {
  grid.innerHTML = "";
  grid.className =
    "grid grid-cols-1 gap-5 sm:grid-cols-2 " + (list.length > 6 ? "lg:grid-cols-2" : "");

  for (const r of list) {
    const nameEn = r.name_en || r.name;
    const imgSrc = (r.image_url && String(r.image_url).trim()) || buildRecipeImageUrl(nameEn);
    const fallback = fallbackImageUrl(nameEn);

    const card = document.createElement("article");
    card.className =
      "flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]";
    card.setAttribute("role", "listitem");

    const imgWrap = document.createElement("div");
    imgWrap.className = "relative aspect-[16/10] w-full overflow-hidden bg-gray-100";
    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = `${r.name} 이미지`;
    img.loading = "lazy";
    img.className = "h-full w-full object-cover";
    img.addEventListener("error", () => {
      if (img.src !== fallback) img.src = fallback;
    });
    imgWrap.appendChild(img);

    if (!isAllMode && state.selected.size > 0) {
      const badge = document.createElement("span");
      badge.className =
        "absolute right-2 top-2 rounded-md border border-line bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-ink shadow-sm";
      badge.textContent = "필터 일치";
      imgWrap.appendChild(badge);
    }

    const body = document.createElement("div");
    body.className = "flex flex-1 flex-col gap-2 p-4";

    const cat = document.createElement("span");
    cat.className = `inline-flex w-fit rounded-md border px-2 py-0.5 text-xs font-semibold ${categoryPillClass(r.category)}`;
    cat.textContent = r.category;

    const title = document.createElement("h3");
    title.className = "text-lg font-semibold text-ink";
    title.textContent = r.name;

    const desc = document.createElement("p");
    desc.className = "text-xs leading-relaxed text-gray-500";
    desc.textContent = r.description || "";

    const meta = document.createElement("div");
    meta.className = "space-y-1 text-[11px] text-gray-600";
    meta.innerHTML = tagSection(
      "주재료",
      (r.core_ingredients || []).map((id) => ingredientLabel(id))
    );
    if ((r.optional_any_of || []).length) {
      const line = r.optional_any_of
        .map((grp) => grp.map((id) => ingredientLabel(id)).join(" · "))
        .join(" | ");
      meta.innerHTML += tagSection("선택 재료(대안·하나만 있어도 됨)", line);
    }
    if ((r.sub_ingredients || []).length) {
      meta.innerHTML += tagSection(
        "부재료(안 골라도 검색에서 제외 안 함)",
        r.sub_ingredients.map((id) => ingredientLabel(id))
      );
    }

    body.appendChild(cat);
    body.appendChild(title);
    if (r.description) body.appendChild(desc);
    body.appendChild(meta);

    card.appendChild(imgWrap);
    card.appendChild(body);
    grid.appendChild(card);
  }
}

function tagSection(label, namesOrText) {
  if (namesOrText == null || namesOrText === "") return "";
  const body = Array.isArray(namesOrText)
    ? namesOrText.filter(Boolean).join(", ")
    : String(namesOrText);
  if (!body) return "";
  return `<div><span class="font-semibold text-gray-700">${label}:</span> ${body}</div>`;
}

function wireSearchInput() {
  const input = $("#ingredient-search");
  if (!input) return;
  input.addEventListener("input", () => renderSearchResults());
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      input.value = "";
      renderSearchResults();
    }
  });
}

function showIngredientError() {
  const root = $("#ingredient-app-root");
  if (!root) return;
  root.innerHTML = `<div class="px-6 py-6">
    <div class="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
      <p class="font-semibold">데이터를 불러오지 못했습니다.</p>
      <p class="mt-2 text-amber-900/90">터미널에서 <code class="rounded bg-white/80 px-1">python app.py</code> 실행 후
      <code class="rounded bg-white/80 px-1">http://127.0.0.1:8080</code> 으로 접속해 주세요.</p>
    </div>
  </div>`;
}

async function init() {
  try {
    const res = await fetch("/api/bootstrap");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    state.ingredientsByCategory = data.ingredientsByCategory;
    state.recipes = data.recipes;
    substitutionFamilies = (data.substitutionFamilies || []).map((arr) => new Set((arr || []).map(sid)));

    state.idToName.clear();
    state.allIngredients = Array.isArray(data.ingredients) ? [...data.ingredients] : [];
    for (const row of state.allIngredients) {
      state.idToName.set(sid(row.id), row.name);
    }
    if (!state.allIngredients.length && data.ingredientsByCategory) {
      for (const list of Object.values(data.ingredientsByCategory)) {
        for (const item of list || []) {
          state.allIngredients.push(item);
          state.idToName.set(sid(item.id), item.name);
        }
      }
    }

    const loading = $("#ingredient-loading");
    const ui = $("#ingredient-ui");
    if (loading) loading.classList.add("hidden");
    if (ui) ui.classList.remove("hidden");

    wireSearchInput();
    syncLeftPanel();

    $("#btn-clear")?.addEventListener("click", clearSelection);
  } catch (e) {
    console.error(e);
    showIngredientError();
  }
}

document.addEventListener("DOMContentLoaded", init);
