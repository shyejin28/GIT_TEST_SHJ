/**
 * 데이터는 외부 파일 없이 이 스크립트에만 내장합니다.
 * 대분류(category) > 중분류(sub_category) > 재료(id, name)
 */

const ingredientsData = [
  { id: "pork_belly", name: "삼겹살", category: "육류", sub_category: "돼지고기", aliases: [] },
  { id: "pork_neck", name: "목살", category: "육류", sub_category: "돼지고기", aliases: ["돼지목살"] },
  { id: "beef_plate", name: "우삼겹", category: "육류", sub_category: "소고기", aliases: [] },
  { id: "beef_brisket", name: "차돌", category: "육류", sub_category: "소고기", aliases: ["차돌박이"] },
  { id: "chicken_thigh", name: "다리살", category: "육류", sub_category: "닭고기", aliases: ["닭다리살"] },
  { id: "chicken_breast", name: "가슴살", category: "육류", sub_category: "닭고기", aliases: ["닭가슴살"] },
  { id: "fish_mackerel", name: "고등어", category: "해산물", sub_category: "생선", aliases: [] },
  { id: "fish_salmon", name: "연어", category: "해산물", sub_category: "생선", aliases: [] },
  { id: "sea_shrimp", name: "새우", category: "해산물", sub_category: "패류", aliases: [] },
  { id: "sea_squid", name: "오징어", category: "해산물", sub_category: "패류", aliases: [] },
  { id: "veg_onion", name: "양파", category: "채소", sub_category: "채소", aliases: [] },
  { id: "veg_garlic", name: "마늘", category: "채소", sub_category: "채소", aliases: [] },
  { id: "veg_scallion", name: "대파", category: "채소", sub_category: "채소", aliases: ["파"] },
  { id: "veg_potato", name: "감자", category: "채소", sub_category: "채소", aliases: [] },
  { id: "veg_spinach", name: "시금치", category: "채소", sub_category: "채소", aliases: [] },
  { id: "veg_enoki", name: "팽이버섯", category: "채소", sub_category: "버섯", aliases: ["팽이"] },
  { id: "veg_kimchi", name: "김치", category: "채소", sub_category: "채소", aliases: ["배추김치"] },
  { id: "proc_ramen", name: "라면사리", category: "가공품", sub_category: "면류", aliases: ["라면"] },
  { id: "proc_spaghetti", name: "스파게티면", category: "가공품", sub_category: "면류", aliases: ["파스타면"] },
  { id: "proc_tofu", name: "두부", category: "가공품", sub_category: "기타", aliases: [] },
  { id: "proc_spam", name: "스팸", category: "가공품", sub_category: "기타", aliases: [] },
];

const recipesData = [
  {
    name: "삼겹살구이",
    category: "한식",
    name_en: "grilled-pork-belly",
    core_ingredients: ["pork_belly", "veg_onion"],
    sub_ingredients: [],
    optional_any_of: [],
    image_url: "https://picsum.photos/seed/samgyeop/800/500",
  },
  {
    name: "제육볶음",
    category: "한식",
    name_en: "jeyuk",
    core_ingredients: ["pork_neck", "veg_kimchi"],
    sub_ingredients: ["veg_scallion"],
    optional_any_of: [],
    image_url: "https://picsum.photos/seed/jeyuk/800/500",
  },
  {
    name: "불고기",
    category: "한식",
    name_en: "bulgogi",
    core_ingredients: ["beef_plate", "veg_onion"],
    sub_ingredients: [],
    optional_any_of: [],
    image_url: "https://picsum.photos/seed/bulgogi/800/500",
  },
  {
    name: "차돌박이전골",
    category: "한식",
    name_en: "brisket-hotpot",
    core_ingredients: ["beef_brisket", "veg_scallion"],
    sub_ingredients: [],
    optional_any_of: [],
    image_url: "https://picsum.photos/seed/brisket/800/500",
  },
  {
    name: "닭볶음탕",
    category: "한식",
    name_en: "dakbokkeum",
    core_ingredients: ["chicken_thigh", "veg_potato"],
    sub_ingredients: ["veg_scallion"],
    optional_any_of: [],
    image_url: "https://picsum.photos/seed/dak/800/500",
  },
  {
    name: "고등어조림",
    category: "한식",
    name_en: "mackerel",
    core_ingredients: ["fish_mackerel", "veg_onion"],
    sub_ingredients: [],
    optional_any_of: [],
    image_url: "https://picsum.photos/seed/mackerel/800/500",
  },
  {
    name: "연어구이",
    category: "한식",
    name_en: "salmon",
    core_ingredients: ["fish_salmon", "veg_spinach"],
    sub_ingredients: [],
    optional_any_of: [],
    image_url: "https://picsum.photos/seed/salmon/800/500",
  },
  {
    name: "새우볶음",
    category: "한식",
    name_en: "shrimp",
    core_ingredients: ["sea_shrimp", "veg_garlic"],
    sub_ingredients: [],
    optional_any_of: [],
    image_url: "https://picsum.photos/seed/shrimp/800/500",
  },
  {
    name: "오징어볶음",
    category: "한식",
    name_en: "squid",
    core_ingredients: ["sea_squid", "veg_onion"],
    sub_ingredients: [],
    optional_any_of: [],
    image_url: "https://picsum.photos/seed/squid/800/500",
  },
  {
    name: "라볶이",
    category: "한식",
    name_en: "rabokki",
    core_ingredients: ["proc_ramen", "veg_kimchi"],
    sub_ingredients: [],
    optional_any_of: [],
    image_url: "https://picsum.photos/seed/rabokki/800/500",
  },
  {
    name: "순두부찌개",
    category: "한식",
    name_en: "sundubu",
    core_ingredients: ["proc_tofu", "chicken_breast"],
    sub_ingredients: ["veg_scallion"],
    optional_any_of: [],
    image_url: "https://picsum.photos/seed/sundubu/800/500",
  },
  {
    name: "닭덮밥",
    category: "일식",
    name_en: "chicken-don",
    core_ingredients: ["chicken_thigh", "veg_onion"],
    sub_ingredients: ["veg_scallion", "veg_garlic"],
    optional_any_of: [],
    image_url: "https://picsum.photos/seed/dondon/800/500",
  },
];

/** 아코디언 대분류 순서 (가이드: 채소·육류·해산물 …) */
const MAJOR_ORDER = ["채소", "육류", "해산물", "가공품"];

const MAJOR_EMOJI = {
  채소: "🥬",
  육류: "🥩",
  해산물: "🐟",
  가공품: "🥫",
};

/** 재료별 이모지 (칩·검색·리스트 공통) */
const INGREDIENT_EMOJI = {
  pork_belly: "🥓",
  pork_neck: "🥩",
  beef_plate: "🥩",
  beef_brisket: "🥩",
  chicken_thigh: "🍗",
  chicken_breast: "🍗",
  fish_mackerel: "🐟",
  fish_salmon: "🐟",
  sea_shrimp: "🦐",
  sea_squid: "🦑",
  veg_onion: "🧅",
  veg_garlic: "🧄",
  veg_scallion: "🌿",
  veg_potato: "🥔",
  veg_spinach: "🥬",
  veg_enoki: "🍄",
  veg_kimchi: "🥬",
  proc_ramen: "🍜",
  proc_spaghetti: "🍝",
  proc_tofu: "🧊",
  proc_spam: "🥫",
};

const SUB_ORDER = {
  육류: ["돼지고기", "소고기", "닭고기"],
  해산물: ["생선", "패류"],
  채소: ["채소", "버섯"],
  가공품: ["면류", "기타"],
};

const $ = (sel) => document.querySelector(sel);

const state = {
  selected: new Set(),
  /** @type {Record<string, boolean>} */
  accordionMajor: {},
  /** @type {Record<string, boolean>} */
  accordionSub: {},
  _inited: false,
};

function sid(x) {
  return String(x);
}

function subKey(major, sub) {
  return `${major}|||${sub}`;
}

function idToName(id) {
  const row = ingredientsData.find((r) => sid(r.id) === sid(id));
  return row ? row.name : id;
}

function ingredientEmoji(id) {
  return INGREDIENT_EMOJI[sid(id)] || "📦";
}

function majorEmoji(major) {
  return MAJOR_EMOJI[major] || "📋";
}

function buildCategoryTree(list) {
  return list.reduce((acc, it) => {
    const cat = String(it.category || "").trim();
    const sub = String(it.sub_category || "").trim();
    if (!cat || !sub) return acc;
    if (!acc[cat]) acc[cat] = {};
    if (!acc[cat][sub]) acc[cat][sub] = [];
    acc[cat][sub].push(it);
    return acc;
  }, {});
}

function sortedSubs(major, tree) {
  const keys = Object.keys(tree[major] || {});
  const pref = SUB_ORDER[major] || [];
  const out = [];
  for (const s of pref) if (keys.includes(s)) out.push(s);
  for (const s of keys) if (!out.includes(s)) out.push(s);
  return out;
}

function ensureAccordionDefaults(tree) {
  if (state._inited) return;
  state._inited = true;
  for (const m of MAJOR_ORDER) {
    state.accordionMajor[m] = false;
    for (const s of sortedSubs(m, tree)) {
      state.accordionSub[subKey(m, s)] = false;
    }
  }
  const firstMajor = MAJOR_ORDER.find((m) => sortedSubs(m, tree).length);
  if (firstMajor) {
    state.accordionMajor[firstMajor] = true;
    const subs = sortedSubs(firstMajor, tree);
    if (subs[0]) state.accordionSub[subKey(firstMajor, subs[0])] = true;
  }
}

function recipeIngredientPool(r) {
  const pool = new Set((r.core_ingredients || []).map(sid));
  for (const x of r.sub_ingredients || []) pool.add(sid(x));
  for (const grp of r.optional_any_of || []) {
    for (const x of grp) pool.add(sid(x));
  }
  return pool;
}

function recipeMatchesSelection(r, selected) {
  if (!selected.size) return true;
  const pool = recipeIngredientPool(r);
  for (const id of selected) {
    if (!pool.has(sid(id))) return false;
  }
  return true;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 국가/요리 태그 — 연한 노란색 배지 (가이드) */
function categoryBadgeClass() {
  return "inline-flex w-fit rounded-md border border-yellow-200 bg-yellow-50 px-2 py-0.5 text-[11px] font-semibold text-yellow-900";
}

/**
 * [대분류] > [중분류] > [체크박스] — 텍스트 위주 심플 아코디언
 */
function renderCategories() {
  const container = $("#category-accordions");
  if (!container) return;

  const tree = buildCategoryTree(ingredientsData);
  ensureAccordionDefaults(tree);

  container.innerHTML = "";

  for (const major of MAJOR_ORDER) {
    const subs = sortedSubs(major, tree);
    if (!subs.length) continue;

    const majorOpen = !!state.accordionMajor[major];
    const majorWrap = document.createElement("div");
    majorWrap.className = "border-b border-line last:border-b-0";

    const majorBtn = document.createElement("button");
    majorBtn.type = "button";
    majorBtn.className =
      "flex w-full items-center justify-between gap-2 bg-[#FFFFFF] py-3.5 pl-0.5 pr-1 text-left text-sm font-semibold text-ink transition hover:bg-gray-50/80";
    majorBtn.setAttribute("aria-expanded", majorOpen ? "true" : "false");
    majorBtn.innerHTML = `<span class="flex items-center gap-2"><span class="text-base" aria-hidden="true">${majorEmoji(major)}</span><span>${escapeHtml(major)}</span></span><span class="text-xs text-gray-400" aria-hidden="true">${majorOpen ? "−" : "+"}</span>`;
    majorBtn.addEventListener("click", () => {
      state.accordionMajor[major] = !state.accordionMajor[major];
      renderCategories();
    });

    const majorPanel = document.createElement("div");
    majorPanel.className = majorOpen ? "pb-2 pl-1" : "hidden";

    if (majorOpen) {
      for (const sub of subs) {
        const items = (tree[major] && tree[major][sub]) || [];
        if (!items.length) continue;

        const sk = subKey(major, sub);
        const subOpen = !!state.accordionSub[sk];
        const subWrap = document.createElement("div");
        subWrap.className = "border-l border-line pl-3";

        const subBtn = document.createElement("button");
        subBtn.type = "button";
        subBtn.className =
          "flex w-full items-center justify-between gap-2 py-2 text-left text-sm font-medium text-gray-800 transition hover:text-ink";
        subBtn.setAttribute("aria-expanded", subOpen ? "true" : "false");
        subBtn.innerHTML = `<span>${escapeHtml(sub)}</span><span class="text-[11px] tabular-nums text-gray-400">${items.length}</span>`;
        subBtn.addEventListener("click", () => {
          state.accordionSub[sk] = !state.accordionSub[sk];
          renderCategories();
        });

        const subPanel = document.createElement("div");
        subPanel.className = subOpen ? "pb-2 pl-0.5 pt-0" : "hidden";

        if (subOpen) {
          const list = document.createElement("ul");
          list.className = "space-y-1.5 pl-1";
          for (const it of [...items].sort((a, b) => a.name.localeCompare(b.name, "ko"))) {
            const id = sid(it.id);
            const li = document.createElement("li");
            const label = document.createElement("label");
            label.className =
              "flex cursor-pointer items-center gap-2.5 rounded-md py-1 text-sm text-ink transition hover:bg-gray-50/90";
            const cb = document.createElement("input");
            cb.type = "checkbox";
            cb.className = "h-3.5 w-3.5 shrink-0 rounded border-line text-gray-700 focus:ring-gray-300";
            cb.checked = state.selected.has(id);
            cb.addEventListener("change", () => {
              if (cb.checked) state.selected.add(id);
              else state.selected.delete(id);
              syncSelectionUi();
            });
            const span = document.createElement("span");
            span.className = "flex items-center gap-2";
            span.innerHTML = `<span class="text-base leading-none" aria-hidden="true">${ingredientEmoji(id)}</span><span>${escapeHtml(it.name)}</span>`;
            label.appendChild(cb);
            label.appendChild(span);
            li.appendChild(label);
            list.appendChild(li);
          }
          subPanel.appendChild(list);
        }

        subWrap.appendChild(subBtn);
        subWrap.appendChild(subPanel);
        majorPanel.appendChild(subWrap);
      }
    }

    majorWrap.appendChild(majorBtn);
    majorWrap.appendChild(majorPanel);
    container.appendChild(majorWrap);
  }
}

function itemMatchesQuery(it, raw) {
  const t = String(raw).trim();
  if (!t) return false;
  const lower = t.toLowerCase();
  const parts = [it.name, ...((it.aliases || []).map(String))];
  return parts.some((s) => s.includes(t) || s.toLowerCase().includes(lower));
}

function renderSearchResults() {
  const wrap = $("#search-results");
  const input = $("#ingredient-search");
  if (!wrap || !input) return;

  const q = input.value;
  wrap.innerHTML = "";

  if (!q.trim()) {
    wrap.classList.add("hidden");
    return;
  }

  const matched = ingredientsData.filter(
    (it) => itemMatchesQuery(it, q) && !state.selected.has(sid(it.id))
  );

  wrap.classList.remove("hidden");
  if (!matched.length) {
    wrap.classList.add("hidden");
    return;
  }

  for (const it of matched.slice(0, 30)) {
    const id = sid(it.id);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "flex w-full flex-col gap-0.5 border-b border-line bg-[#FFFFFF] px-3 py-2.5 text-left text-sm last:border-b-0 hover:bg-gray-50/80";
    const em = ingredientEmoji(id);
    btn.innerHTML = `<span class="flex items-center gap-2 font-medium"><span class="text-lg" aria-hidden="true">${em}</span><span>${escapeHtml(it.name)}</span></span>
      <span class="pl-8 text-[11px] text-gray-400">${escapeHtml(it.category)} · ${escapeHtml(it.sub_category)}</span>`;
    btn.addEventListener("click", () => {
      state.selected.add(id);
      input.value = "";
      wrap.classList.add("hidden");
      wrap.innerHTML = "";
      syncSelectionUi();
    });
    wrap.appendChild(btn);
  }
}

function renderSelectedChips() {
  const host = $("#selected-tags");
  if (!host) return;
  host.innerHTML = "";

  const ids = [...state.selected].sort((a, b) => idToName(a).localeCompare(idToName(b), "ko"));
  for (const id of ids) {
    const chip = document.createElement("div");
    chip.className =
      "inline-flex max-w-full items-center gap-1 rounded-full border border-line bg-[#FFFFFF] pl-3 pr-1 py-1 text-sm text-ink shadow-sm";
    const label = document.createElement("span");
    label.className = "flex min-w-0 items-center gap-2 truncate";
    label.innerHTML = `<span class="shrink-0 text-base leading-none" aria-hidden="true">${ingredientEmoji(id)}</span><span class="truncate">${escapeHtml(idToName(id))}</span>`;
    const rm = document.createElement("button");
    rm.type = "button";
    rm.className =
      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200";
    rm.setAttribute("aria-label", "제거");
    rm.textContent = "×";
    rm.addEventListener("click", () => {
      state.selected.delete(id);
      syncSelectionUi();
    });
    chip.appendChild(label);
    chip.appendChild(rm);
    host.appendChild(chip);
  }
}

function updateSelectionCount() {
  const el = $("#selection-count");
  if (el) el.textContent = `선택: ${state.selected.size}개`;
}

function syncSelectionUi() {
  updateSelectionCount();
  renderSelectedChips();
  renderCategories();
  renderResults();
}

function clearSelection() {
  state.selected.clear();
  syncSelectionUi();
}

function fallbackImg(nameEn) {
  const slug = String(nameEn || "x")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `https://picsum.photos/seed/${slug}/800/500`;
}

function renderResults() {
  const grid = $("#results-grid");
  const empty = $("#results-empty");
  if (!grid || !empty) return;

  const list = recipesData.filter((r) => recipeMatchesSelection(r, state.selected));
  list.sort((a, b) => {
    const la = (a.core_ingredients || []).length;
    const lb = (b.core_ingredients || []).length;
    if (la !== lb) return la - lb;
    return a.name.localeCompare(b.name, "ko");
  });

  grid.innerHTML = "";
  if (!list.length) {
    empty.classList.remove("hidden");
    grid.classList.add("hidden");
    return;
  }

  empty.classList.add("hidden");
  grid.classList.remove("hidden");
  grid.className =
    "grid flex-1 grid-cols-1 content-start gap-5 overflow-y-auto sm:grid-cols-2";

  for (const r of list) {
    const nameEn = r.name_en || r.name;
    const imgSrc = (r.image_url && String(r.image_url).trim()) || fallbackImg(nameEn);
    const card = document.createElement("article");
    card.className =
      "group grid h-72 min-h-[16rem] w-full overflow-hidden rounded-lg border border-line bg-[#FFFFFF] shadow-sm transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lg grid-rows-[3fr_2fr]";

    const imgWrap = document.createElement("div");
    imgWrap.className = "relative min-h-0 overflow-hidden border-b border-line bg-gray-100";
    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = "";
    img.className = "h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]";
    img.addEventListener("error", () => {
      const fb = fallbackImg(nameEn);
      if (img.src !== fb) img.src = fb;
    });
    imgWrap.appendChild(img);

    const body = document.createElement("div");
    body.className =
      "flex min-h-0 flex-col gap-2 overflow-y-auto border-line bg-[#FFFFFF] p-3.5";

    const badge = document.createElement("span");
    badge.className = categoryBadgeClass();
    badge.textContent = r.category || "기타";

    const title = document.createElement("h3");
    title.className = "text-sm font-bold leading-snug text-ink";
    title.textContent = r.name;

    const coreLine = document.createElement("p");
    coreLine.className = "text-xs leading-relaxed text-ink";
    const coreNames = (r.core_ingredients || []).map(idToName).filter(Boolean).join(", ");
    coreLine.textContent = coreNames ? `주재료: ${coreNames}` : "주재료: —";

    body.appendChild(badge);
    body.appendChild(title);
    body.appendChild(coreLine);

    const subs = r.sub_ingredients || [];
    if (subs.length) {
      const subLine = document.createElement("p");
      subLine.className = "mt-auto text-[11px] leading-relaxed text-gray-500";
      const subNames = subs.map(idToName).filter(Boolean).join(", ");
      subLine.textContent = `부재료(안 골라도 됨): ${subNames}`;
      body.appendChild(subLine);
    }

    card.appendChild(imgWrap);
    card.appendChild(body);
    grid.appendChild(card);
  }
}

function wireSearch() {
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

function init() {
  $("#btn-clear")?.addEventListener("click", clearSelection);
  wireSearch();
  syncSelectionUi();
}

document.addEventListener("DOMContentLoaded", init);
