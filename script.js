const MENUS = [
  { id: "menu_001", name: "김치찌개", emoji: "🍲", moods: ["위로받고싶음", "든든하게"], situations: ["혼밥", "회식"], price: "8000이하", spicy: "자극적으로", weather: ["추움", "비"], description: "얼큰하고 든든한 국민 메뉴", kakaoSearchKeyword: "김치찌개 맛집" },
  { id: "menu_002", name: "된장찌개", emoji: "🍚", moods: ["위로받고싶음", "그냥그럼"], situations: ["혼밥", "친구랑"], price: "8000이하", spicy: "담백하게", weather: ["추움", "맑음"], description: "구수하고 편안한 집밥 느낌", kakaoSearchKeyword: "된장찌개 맛집" },
  { id: "menu_003", name: "마라탕", emoji: "🌶️", moods: ["신남", "스트레스받음"], situations: ["친구랑", "소개팅데이트"], price: "만원대", spicy: "자극적으로", weather: ["추움", "비"], description: "화끈하게 스트레스 날리는 얼얼함", kakaoSearchKeyword: "마라탕 맛집" },
  { id: "menu_004", name: "마라샹궈", emoji: "🔥", moods: ["신남", "스트레스받음"], situations: ["친구랑", "회식"], price: "만오천이상", spicy: "자극적으로", weather: ["추움", "비"], description: "기름지고 알싸한 볶음 요리", kakaoSearchKeyword: "마라샹궈 맛집" },
  { id: "menu_005", name: "닭갈비", emoji: "🍗", moods: ["신남", "든든하게"], situations: ["친구랑", "회식"], price: "만원대", spicy: "자극적으로", weather: ["추움", "맑음"], description: "매콤달콤 철판 위 든든한 한 끼", kakaoSearchKeyword: "닭갈비 맛집" },
  { id: "menu_006", name: "초밥", emoji: "🍣", moods: ["그냥그럼", "신남"], situations: ["소개팅데이트", "친구랑"], price: "만오천이상", spicy: "담백하게", weather: ["맑음", "더움"], description: "깔끔하고 산뜻한 한 접시", kakaoSearchKeyword: "초밥 맛집" },
  { id: "menu_007", name: "파스타", emoji: "🍝", moods: ["그냥그럼", "신남"], situations: ["소개팅데이트", "친구랑"], price: "만원대", spicy: "느끼한거땡김", weather: ["맑음", "비"], description: "부드럽고 크리미한 분위기 메뉴", kakaoSearchKeyword: "파스타 맛집" },
  { id: "menu_008", name: "냉면", emoji: "🥶", moods: ["그냥그럼", "위로받고싶음"], situations: ["혼밥", "친구랑"], price: "만원대", spicy: "담백하게", weather: ["더움", "맑음"], description: "시원하게 속을 달래주는 한 그릇", kakaoSearchKeyword: "냉면 맛집" },
  { id: "menu_009", name: "비빔국수", emoji: "🍜", moods: ["신남", "스트레스받음"], situations: ["혼밥", "친구랑"], price: "8000이하", spicy: "자극적으로", weather: ["더움", "맑음"], description: "새콤매콤 입맛 돋우는 비빔면", kakaoSearchKeyword: "비빔국수 맛집" },
  { id: "menu_010", name: "삼겹살", emoji: "🥓", moods: ["든든하게", "신남"], situations: ["회식", "친구랑"], price: "만오천이상", spicy: "느끼한거땡김", weather: ["추움", "맑음"], description: "지글지글 구워먹는 회식 필수 메뉴", kakaoSearchKeyword: "삼겹살 맛집" },
  { id: "menu_011", name: "곱창", emoji: "🔥", moods: ["든든하게", "스트레스받음"], situations: ["회식", "친구랑"], price: "만오천이상", spicy: "느끼한거땡김", weather: ["추움", "비"], description: "고소하고 쫄깃한 술안주 겸 식사", kakaoSearchKeyword: "곱창 맛집" },
  { id: "menu_012", name: "짬뽕", emoji: "🍥", moods: ["위로받고싶음", "스트레스받음"], situations: ["혼밥", "회식"], price: "만원대", spicy: "자극적으로", weather: ["추움", "비"], description: "얼큰한 국물이 속을 확 풀어주는 메뉴", kakaoSearchKeyword: "짬뽕 맛집" },
  { id: "menu_013", name: "짜장면", emoji: "🍜", moods: ["그냥그럼", "위로받고싶음"], situations: ["혼밥", "친구랑"], price: "8000이하", spicy: "느끼한거땡김", weather: ["맑음", "비"], description: "달콤짭짤 편안하게 즐기는 국민 메뉴", kakaoSearchKeyword: "짜장면 맛집" },
  { id: "menu_014", name: "돈까스", emoji: "🍱", moods: ["든든하게", "그냥그럼"], situations: ["혼밥", "친구랑"], price: "만원대", spicy: "담백하게", weather: ["맑음", "비"], description: "바삭하고 든든한 한 끼", kakaoSearchKeyword: "돈까스 맛집" },
  { id: "menu_015", name: "스테이크", emoji: "🥩", moods: ["신남", "든든하게"], situations: ["소개팅데이트", "회식"], price: "만오천이상", spicy: "담백하게", weather: ["맑음", "추움"], description: "분위기 내기 좋은 든든한 한 접시", kakaoSearchKeyword: "스테이크 맛집" },
  { id: "menu_016", name: "국밥", emoji: "🍚", moods: ["위로받고싶음", "든든하게"], situations: ["혼밥", "회식"], price: "8000이하", spicy: "담백하게", weather: ["추움", "비"], description: "뜨끈하게 속을 채워주는 든든함", kakaoSearchKeyword: "국밥 맛집" },
  { id: "menu_017", name: "떡볶이", emoji: "🌶️", moods: ["스트레스받음", "신남"], situations: ["혼밥", "친구랑"], price: "8000이하", spicy: "자극적으로", weather: ["비", "맑음"], description: "매콤달콤 국민 분식", kakaoSearchKeyword: "떡볶이 맛집" },
  { id: "menu_018", name: "삼계탕", emoji: "🍗", moods: ["든든하게", "위로받고싶음"], situations: ["혼밥", "친구랑"], price: "만원대", spicy: "담백하게", weather: ["더움", "추움"], description: "보양식으로 든든하게 채우는 한 그릇", kakaoSearchKeyword: "삼계탕 맛집" },
  { id: "menu_019", name: "쌀국수", emoji: "🍜", moods: ["그냥그럼", "위로받고싶음"], situations: ["혼밥", "친구랑"], price: "만원대", spicy: "담백하게", weather: ["더움", "비"], description: "깔끔한 육수로 편안하게 즐기는 한 끼", kakaoSearchKeyword: "쌀국수 맛집" },
  { id: "menu_020", name: "피자", emoji: "🍕", moods: ["신남", "그냥그럼"], situations: ["친구랑", "회식"], price: "만원대", spicy: "느끼한거땡김", weather: ["맑음", "비"], description: "여럿이 나눠먹기 좋은 즐거운 한 판", kakaoSearchKeyword: "피자 맛집" },
  { id: "menu_021", name: "수제버거", emoji: "🍔", moods: ["신남", "그냥그럼"], situations: ["혼밥", "친구랑"], price: "8000이하", spicy: "느끼한거땡김", weather: ["맑음", "더움"], description: "간단하고 든든하게 즐기는 한 끼", kakaoSearchKeyword: "수제버거 맛집" },
  { id: "menu_022", name: "우동", emoji: "🍥", moods: ["위로받고싶음", "그냥그럼"], situations: ["혼밥", "친구랑"], price: "8000이하", spicy: "담백하게", weather: ["추움", "비"], description: "뜨끈한 국물로 편안하게 즐기는 면 요리", kakaoSearchKeyword: "우동 맛집" },
  { id: "menu_023", name: "회", emoji: "🐟", moods: ["신남", "그냥그럼"], situations: ["소개팅데이트", "회식"], price: "만오천이상", spicy: "담백하게", weather: ["맑음", "더움"], description: "신선하고 깔끔한 특별한 한 끼", kakaoSearchKeyword: "회 맛집" },
  { id: "menu_024", name: "샐러드", emoji: "🥗", moods: ["그냥그럼", "스트레스받음"], situations: ["혼밥", "소개팅데이트"], price: "만원대", spicy: "담백하게", weather: ["더움", "맑음"], description: "가볍고 산뜻하게 즐기는 건강식", kakaoSearchKeyword: "샐러드 맛집" }
];

const STEPS = [
  {
    key: "mood",
    title: "오늘 기분이 어때요?",
    field: "moods",
    options: [
      { value: "스트레스받음", emoji: "😤" },
      { value: "위로받고싶음", emoji: "🥺" },
      { value: "신남", emoji: "🤩" },
      { value: "그냥그럼", emoji: "😐" },
      { value: "든든하게", emoji: "💪" }
    ]
  },
  {
    key: "situation",
    title: "누구와 함께 먹나요?",
    field: "situations",
    options: [
      { value: "혼밥", emoji: "🧍" },
      { value: "친구랑", emoji: "👯" },
      { value: "회식", emoji: "🍻" },
      { value: "소개팅데이트", emoji: "💕" }
    ]
  },
  {
    key: "price",
    title: "오늘 예산은 어느 정도예요?",
    field: "price",
    options: [
      { value: "8000이하", emoji: "🪙" },
      { value: "만원대", emoji: "💵" },
      { value: "만오천이상", emoji: "💰" }
    ]
  },
  {
    key: "spicy",
    title: "맛의 강도는요?",
    field: "spicy",
    options: [
      { value: "자극적으로", emoji: "🌶️" },
      { value: "담백하게", emoji: "🍃" },
      { value: "느끼한거땡김", emoji: "🧈" }
    ]
  },
  {
    key: "weather",
    title: "오늘 날씨는 어때요?",
    field: "weather",
    options: [
      { value: "더움", emoji: "☀️" },
      { value: "추움", emoji: "❄️" },
      { value: "비", emoji: "🌧️" },
      { value: "맑음", emoji: "🌤️" }
    ]
  }
];

const state = {
  stepIndex: 0,
  answers: {},
  lastMenuId: null
};

const screens = {
  landing: document.getElementById("screen-landing"),
  steps: document.getElementById("screen-steps"),
  complete: document.getElementById("screen-complete"),
  result: document.getElementById("screen-result")
};

function showScreen(name) {
  Object.values(screens).forEach((el) => el.removeAttribute("data-active"));
  screens[name].setAttribute("data-active", "true");
}

function startSolo() {
  state.stepIndex = 0;
  state.answers = {};
  document.getElementById("bowl-ingredients").innerHTML = "";
  showScreen("steps");
  renderStep();
}

function renderStep() {
  const step = STEPS[state.stepIndex];
  document.getElementById("step-kicker").textContent = `STEP ${state.stepIndex + 1} / ${STEPS.length}`;
  document.getElementById("step-title").textContent = step.title;

  const progress = document.getElementById("progress");
  progress.innerHTML = "";
  STEPS.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i <= state.stepIndex) dot.setAttribute("data-done", "true");
    progress.appendChild(dot);
  });

  const optionsEl = document.getElementById("step-options");
  optionsEl.innerHTML = "";
  step.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "option-chip";

    const emojiSpan = document.createElement("span");
    emojiSpan.className = "option-chip__emoji";
    emojiSpan.textContent = opt.emoji;

    const labelSpan = document.createElement("span");
    labelSpan.className = "option-chip__label";
    labelSpan.textContent = opt.value;

    btn.appendChild(emojiSpan);
    btn.appendChild(labelSpan);

    if (state.answers[step.key] === opt.value) {
      btn.setAttribute("data-selected", "true");
    }
    btn.addEventListener("click", () => selectOption(step, opt, btn));
    optionsEl.appendChild(btn);
  });

  document.getElementById("btn-back").style.visibility = state.stepIndex === 0 ? "hidden" : "visible";
}

// 이모지 스티커 → 그릇 인터랙션: bounce → fly → bubble → melt (5단계 공용 컴포넌트)
const INGREDIENT_FLY_MS = 420;
const INGREDIENT_BUBBLE_MS = 650;
const INGREDIENT_MELT_MS = 320;

function shakeBowl(bowlEl) {
  bowlEl.classList.remove("bowl--shake");
  void bowlEl.offsetWidth;
  bowlEl.classList.add("bowl--shake");
  window.setTimeout(() => bowlEl.classList.remove("bowl--shake"), 400);
}

function spawnBubbles(bowlIngredientsEl, xPct, yPct) {
  for (let i = 0; i < 3; i++) {
    const bubble = document.createElement("span");
    bubble.className = "ingredient-bubble";
    const size = 6 + Math.random() * 6;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `calc(${xPct}% + ${Math.random() * 16 - 8}px)`;
    bubble.style.top = `${yPct}%`;
    bubble.style.animationDelay = `${i * 0.12}s`;
    bubble.addEventListener("animationend", () => bubble.remove());
    bowlIngredientsEl.appendChild(bubble);
  }
}

function flyIngredientToBowl(sourceEl, emoji, onArrive) {
  const bowlIngredients = document.getElementById("bowl-ingredients");
  const bowl = bowlIngredients.closest(".bowl");
  const sourceRect = sourceEl.getBoundingClientRect();
  const bowlRect = bowlIngredients.getBoundingClientRect();

  const xPct = 32 + Math.random() * 36;
  const yPct = 40 + Math.random() * 6;
  const startX = sourceRect.left + sourceRect.width / 2;
  const startY = sourceRect.top + sourceRect.height / 2;
  const targetX = bowlRect.left + bowlRect.width * (xPct / 100);
  const targetY = bowlRect.top + bowlRect.height * (yPct / 100);
  const dx = targetX - startX;
  const dy = targetY - startY;
  const arcLift = -(80 + Math.random() * 30);

  const wrapper = document.createElement("span");
  wrapper.className = "ingredient-fly";
  wrapper.style.left = `${startX}px`;
  wrapper.style.top = `${startY}px`;

  // bounce(scale/rotate)는 여기서, 흰 테두리용 filter는 visual에서 — 같은 요소에서
  // 둘 다 애니메이션하면 브라우저가 매 프레임 filter를 다시 그리며 블러가 생긴다.
  const bounce = document.createElement("span");
  bounce.className = "ingredient-fly__bounce";

  const visual = document.createElement("span");
  visual.className = "ingredient-fly__visual";
  visual.textContent = emoji;

  bounce.appendChild(visual);
  wrapper.appendChild(bounce);
  document.body.appendChild(wrapper);

  const flight = wrapper.animate(
    [
      { transform: "translate(0, 0)", offset: 0 },
      { transform: `translate(${dx * 0.3}px, ${dy * 0.3 + arcLift}px)`, offset: 0.35 },
      { transform: `translate(${dx}px, ${dy}px)`, offset: 1 }
    ],
    { duration: INGREDIENT_FLY_MS, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)", fill: "forwards" }
  );

  flight.onfinish = () => {
    shakeBowl(bowl);
    spawnBubbles(bowlIngredients, xPct, yPct);
    if (onArrive) onArrive();

    window.setTimeout(() => {
      bounce.classList.add("is-melting");
      visual.classList.add("is-melting");
      window.setTimeout(() => wrapper.remove(), INGREDIENT_MELT_MS);
    }, INGREDIENT_BUBBLE_MS);
  };
}

function selectOption(step, opt, chipEl) {
  if (state.busy) return;
  state.busy = true;

  state.answers[step.key] = opt.value;
  chipEl.setAttribute("data-selected", "true");

  const emojiEl = chipEl.querySelector(".option-chip__emoji");
  flyIngredientToBowl(emojiEl, opt.emoji);

  window.setTimeout(() => {
    state.busy = false;
    if (state.stepIndex < STEPS.length - 1) {
      state.stepIndex += 1;
      renderStep();
    } else {
      showComplete();
    }
  }, INGREDIENT_FLY_MS + INGREDIENT_BUBBLE_MS);
}

function goBack() {
  if (state.stepIndex === 0) {
    showScreen("landing");
    return;
  }
  state.stepIndex -= 1;
  renderStep();
}

function showComplete() {
  showScreen("complete");
  window.setTimeout(() => {
    const menu = pickMenu();
    showResult(menu);
  }, 1200);
}

function scoreMenu(menu) {
  const a = state.answers;
  let score = 0;
  if (menu.moods.includes(a.mood)) score += 1;
  if (menu.situations.includes(a.situation)) score += 1;
  if (menu.price === a.price) score += 1;
  if (menu.spicy === a.spicy) score += 1;
  if (menu.weather.includes(a.weather)) score += 1;
  return score;
}

function pickMenu() {
  const candidates = MENUS.filter((m) => m.id !== state.lastMenuId);
  const scored = candidates.map((m) => ({ menu: m, score: scoreMenu(m) }));
  const maxScore = Math.max(...scored.map((s) => s.score));
  const best = scored.filter((s) => s.score === maxScore).map((s) => s.menu);
  const chosen = best[Math.floor(Math.random() * best.length)];
  state.lastMenuId = chosen.id;
  return chosen;
}

function showResult(menu) {
  document.getElementById("result-emoji").textContent = menu.emoji;
  document.getElementById("result-name").textContent = menu.name;
  document.getElementById("result-desc").textContent = menu.description;
  document.getElementById("btn-map").href = `https://map.kakao.com/link/search/${encodeURIComponent(menu.kakaoSearchKeyword)}`;
  showScreen("result");
}

function retry() {
  showComplete();
}

function restart() {
  state.lastMenuId = null;
  showScreen("landing");
}

document.getElementById("btn-solo").addEventListener("click", startSolo);
document.getElementById("btn-group").addEventListener("click", () => {
  alert("같이 먹기 기능은 준비 중이에요!");
});
document.getElementById("btn-back").addEventListener("click", goBack);
document.getElementById("btn-retry").addEventListener("click", retry);
document.getElementById("btn-restart").addEventListener("click", restart);
