---
name: 새-페이지-만들기
description: 이 프로젝트(오늘의 그릇)에 새 화면(screen)을 추가할 때 사용. 별도 HTML 파일이 아니라 index.html 안의 <section class="screen"> 블록과 script.js의 화면 전환 로직을 기존 패턴에 맞춰 함께 추가한다.
---

# 새 페이지(화면) 만들기

이 프로젝트는 **단일 페이지 앱**이다. "새 페이지"는 새 `.html` 파일이 아니라,
`index.html` 안에 `<section class="screen">` 블록 하나를 추가하고 `script.js`의
화면 전환 로직에 등록하는 것을 의미한다.

## 1. index.html에 화면 섹션 추가

기존 섹션(`#screen-landing`, `#screen-steps`, `#screen-complete`, `#screen-result`) 바로 아래에
새 `<section>`을 추가한다.

```html
<section class="screen screen--yellow" id="screen-{name}">
  <!-- 별 데코는 선택사항. 배경색과 대비되는 색 2~3개를 위치만 바꿔 배치 -->
  <span class="deco deco--star deco--blue" style="top:6%;left:8%;transform:rotate(-12deg) scale(0.7);"></span>
  <span class="deco deco--star deco--magenta" style="bottom:10%;right:10%;transform:rotate(10deg) scale(0.6);"></span>

  <p class="kicker">{작은 상단 라벨}</p>
  <h2 class="step-title">{화면 제목}</h2>
  <p class="subtitle">{부제, 선택}</p>

  <!-- 화면 내용: options / result-card / bowl 등 기존 컴포넌트 재사용 -->

  <div class="result__actions">
    <button class="btn btn--primary" id="btn-{action}">{주요 액션}</button>
    <button class="btn btn--text" id="btn-{back}">이전으로</button>
  </div>
</section>
```

배경/텍스트 색 규칙 (style.css 기준):
- `screen--yellow` (기본, 밝은 배경) → `.kicker`/`.step-title`은 자동으로 어두운 잉크/블루 톤
- `screen--ink` (어두운 배경) → 밝은 텍스트가 필요하면 `kicker--light`, `step-title--light` 클래스 추가
- 배경 클래스를 안 주면 `--cream` 기본 배경

## 2. script.js에 화면 등록

`screens` 객체에 새 항목 추가 (`index.html`의 id와 반드시 일치):

```js
const screens = {
  landing: document.getElementById("screen-landing"),
  steps: document.getElementById("screen-steps"),
  complete: document.getElementById("screen-complete"),
  result: document.getElementById("screen-result"),
  {name}: document.getElementById("screen-{name}")   // 추가
};
```

전환은 항상 `showScreen("{name}")`으로만 한다 — 다른 화면의 `data-active`를
직접 건드리지 않는다 (`showScreen`이 알아서 전체 초기화 후 하나만 활성화함).

## 3. 진입/이탈 로직 연결

새 화면으로 들어오고 나가는 트리거를 파일 하단의 이벤트 리스너 등록 블록 근처에 추가한다.

```js
document.getElementById("btn-{action}").addEventListener("click", () => {
  // 필요하면 여기서 상태(state) 갱신
  showScreen("{name}");
});
```

화면 진입 시 동적으로 채울 내용(텍스트, 리스트 등)이 있으면 `renderStep()`,
`showResult()` 같은 기존 함수들처럼 `render{Name}()` 형태의 별도 함수로 분리해서
`showScreen()` 직전/직후에 호출한다.

## 4. 체크리스트

- [ ] `index.html`에 `<section class="screen ..." id="screen-{name}">` 추가
- [ ] `script.js`의 `screens` 객체에 등록 (id 철자 일치 확인)
- [ ] 이 화면으로 들어오는 버튼/트리거에 `showScreen("{name}")` 연결
- [ ] 이 화면에서 나가는 버튼(뒤로가기 등)도 연결
- [ ] 새 CSS가 필요하면 `style.css`의 기존 변수(`--yellow`, `--blue`, `--ink`, `--cream` 등)와
      기존 클래스(`.btn`, `.kicker`, `.step-title`, `.option-chip`, `.result-card`)를 최대한 재사용하고,
      정말 새로운 컴포넌트일 때만 새 클래스 추가
