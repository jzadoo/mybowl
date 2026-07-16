import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getFirestore, doc, getDoc, getDocs, setDoc, addDoc, updateDoc,
  collection, onSnapshot, runTransaction, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Firebase 콘솔 > 프로젝트 설정 > 내 앱에서 발급받은 config로 교체하세요 (같이 먹기 기능에만 필요, 혼자 먹기는 영향 없음)
const firebaseConfig = {
  apiKey: "AIzaSyDSS6ovj5NHKqbCJRPyQKnKwzwQx8nawZg",
  authDomain: "mybowl-336f0.firebaseapp.com",
  projectId: "mybowl-336f0",
  storageBucket: "mybowl-336f0.firebasestorage.app",
  messagingSenderId: "798009204892",
  appId: "1:798009204892:web:4b0588be752232d1768d59",
  measurementId: "G-WZ4B9NQ3T5"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const ROOM_CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const ROOM_EXPIRY_MS = 30 * 60 * 1000;
const ROOM_MANUAL_COUNT_MAX = 30;

const ROOM_PURPOSES = [
  { label: "단순 식사", situation: "친구랑", emoji: "🍚" },
  { label: "친목 모임", situation: "친구랑", emoji: "🎉" },
  { label: "회식", situation: "회식", emoji: "🍻" },
  { label: "데이트", situation: "소개팅데이트", emoji: "💕" }
];

const MENUS = [
  { id: "menu_001", name: "김치찌개", emoji: "🍲", moods: ["위로받고싶음", "든든하게"], situations: ["혼밥", "회식"], price: "8000이하", spicy: "자극적으로", weather: ["추움", "비"], cuisine: "한식", description: "얼큰하고 든든한 국민 메뉴", kakaoSearchKeyword: "김치찌개 맛집" },
  { id: "menu_002", name: "된장찌개", emoji: "🍚", moods: ["위로받고싶음", "그냥그럼"], situations: ["혼밥", "친구랑"], price: "8000이하", spicy: "담백하게", weather: ["추움", "맑음"], cuisine: "한식", description: "구수하고 편안한 집밥 느낌", kakaoSearchKeyword: "된장찌개 맛집" },
  { id: "menu_003", name: "마라탕", emoji: "🌶️", moods: ["신남", "스트레스받음"], situations: ["친구랑", "소개팅데이트"], price: "만원대", spicy: "자극적으로", weather: ["추움", "비"], cuisine: "중식", description: "화끈하게 스트레스 날리는 얼얼함", kakaoSearchKeyword: "마라탕 맛집" },
  { id: "menu_004", name: "마라샹궈", emoji: "🔥", moods: ["신남", "스트레스받음"], situations: ["친구랑", "회식"], price: "만오천이상", spicy: "자극적으로", weather: ["추움", "비"], cuisine: "중식", description: "기름지고 알싸한 볶음 요리", kakaoSearchKeyword: "마라샹궈 맛집" },
  { id: "menu_005", name: "닭갈비", emoji: "🍗", moods: ["신남", "든든하게"], situations: ["친구랑", "회식"], price: "만원대", spicy: "자극적으로", weather: ["추움", "맑음"], cuisine: "한식", description: "매콤달콤 철판 위 든든한 한 끼", kakaoSearchKeyword: "닭갈비 맛집" },
  { id: "menu_006", name: "초밥", emoji: "🍣", moods: ["그냥그럼", "신남"], situations: ["소개팅데이트", "친구랑"], price: "만오천이상", spicy: "담백하게", weather: ["맑음", "더움"], cuisine: "일식", description: "깔끔하고 산뜻한 한 접시", kakaoSearchKeyword: "초밥 맛집" },
  { id: "menu_007", name: "파스타", emoji: "🍝", moods: ["그냥그럼", "신남"], situations: ["소개팅데이트", "친구랑"], price: "만원대", spicy: "느끼한거땡김", weather: ["맑음", "비"], cuisine: "양식", description: "부드럽고 크리미한 분위기 메뉴", kakaoSearchKeyword: "파스타 맛집" },
  { id: "menu_008", name: "냉면", emoji: "🥶", moods: ["그냥그럼", "위로받고싶음"], situations: ["혼밥", "친구랑"], price: "만원대", spicy: "담백하게", weather: ["더움", "맑음"], cuisine: "한식", description: "시원하게 속을 달래주는 한 그릇", kakaoSearchKeyword: "냉면 맛집" },
  { id: "menu_009", name: "비빔국수", emoji: "🍜", moods: ["신남", "스트레스받음"], situations: ["혼밥", "친구랑"], price: "8000이하", spicy: "자극적으로", weather: ["더움", "맑음"], cuisine: "한식", description: "새콤매콤 입맛 돋우는 비빔면", kakaoSearchKeyword: "비빔국수 맛집" },
  { id: "menu_010", name: "삼겹살", emoji: "🥓", moods: ["든든하게", "신남"], situations: ["회식", "친구랑"], price: "만오천이상", spicy: "느끼한거땡김", weather: ["추움", "맑음"], cuisine: "한식", description: "지글지글 구워먹는 회식 필수 메뉴", kakaoSearchKeyword: "삼겹살 맛집" },
  { id: "menu_011", name: "곱창", emoji: "🔥", moods: ["든든하게", "스트레스받음"], situations: ["회식", "친구랑"], price: "만오천이상", spicy: "느끼한거땡김", weather: ["추움", "비"], cuisine: "한식", description: "고소하고 쫄깃한 술안주 겸 식사", kakaoSearchKeyword: "곱창 맛집" },
  { id: "menu_012", name: "짬뽕", emoji: "🍥", moods: ["위로받고싶음", "스트레스받음"], situations: ["혼밥", "회식"], price: "만원대", spicy: "자극적으로", weather: ["추움", "비"], cuisine: "중식", description: "얼큰한 국물이 속을 확 풀어주는 메뉴", kakaoSearchKeyword: "짬뽕 맛집" },
  { id: "menu_013", name: "짜장면", emoji: "🍜", moods: ["그냥그럼", "위로받고싶음"], situations: ["혼밥", "친구랑"], price: "8000이하", spicy: "느끼한거땡김", weather: ["맑음", "비"], cuisine: "중식", description: "달콤짭짤 편안하게 즐기는 국민 메뉴", kakaoSearchKeyword: "짜장면 맛집" },
  { id: "menu_014", name: "돈까스", emoji: "🍱", moods: ["든든하게", "그냥그럼"], situations: ["혼밥", "친구랑"], price: "만원대", spicy: "담백하게", weather: ["맑음", "비"], cuisine: "일식", description: "바삭하고 든든한 한 끼", kakaoSearchKeyword: "돈까스 맛집" },
  { id: "menu_015", name: "스테이크", emoji: "🥩", moods: ["신남", "든든하게"], situations: ["소개팅데이트", "회식"], price: "만오천이상", spicy: "담백하게", weather: ["맑음", "추움"], cuisine: "양식", description: "분위기 내기 좋은 든든한 한 접시", kakaoSearchKeyword: "스테이크 맛집" },
  { id: "menu_016", name: "국밥", emoji: "🍚", moods: ["위로받고싶음", "든든하게"], situations: ["혼밥", "회식"], price: "8000이하", spicy: "담백하게", weather: ["추움", "비"], cuisine: "한식", description: "뜨끈하게 속을 채워주는 든든함", kakaoSearchKeyword: "국밥 맛집" },
  { id: "menu_017", name: "떡볶이", emoji: "🌶️", moods: ["스트레스받음", "신남"], situations: ["혼밥", "친구랑"], price: "8000이하", spicy: "자극적으로", weather: ["비", "맑음"], cuisine: "분식", description: "매콤달콤 국민 분식", kakaoSearchKeyword: "떡볶이 맛집" },
  { id: "menu_018", name: "삼계탕", emoji: "🍗", moods: ["든든하게", "위로받고싶음"], situations: ["혼밥", "친구랑"], price: "만원대", spicy: "담백하게", weather: ["더움", "추움"], cuisine: "한식", description: "보양식으로 든든하게 채우는 한 그릇", kakaoSearchKeyword: "삼계탕 맛집" },
  { id: "menu_019", name: "쌀국수", emoji: "🍜", moods: ["그냥그럼", "위로받고싶음"], situations: ["혼밥", "친구랑"], price: "만원대", spicy: "담백하게", weather: ["더움", "비"], cuisine: "기타", description: "깔끔한 육수로 편안하게 즐기는 한 끼", kakaoSearchKeyword: "쌀국수 맛집" },
  { id: "menu_020", name: "피자", emoji: "🍕", moods: ["신남", "그냥그럼"], situations: ["친구랑", "회식"], price: "만원대", spicy: "느끼한거땡김", weather: ["맑음", "비"], cuisine: "양식", description: "여럿이 나눠먹기 좋은 즐거운 한 판", kakaoSearchKeyword: "피자 맛집" },
  { id: "menu_021", name: "수제버거", emoji: "🍔", moods: ["신남", "그냥그럼"], situations: ["혼밥", "친구랑"], price: "8000이하", spicy: "느끼한거땡김", weather: ["맑음", "더움"], cuisine: "양식", description: "간단하고 든든하게 즐기는 한 끼", kakaoSearchKeyword: "수제버거 맛집" },
  { id: "menu_022", name: "우동", emoji: "🍥", moods: ["위로받고싶음", "그냥그럼"], situations: ["혼밥", "친구랑"], price: "8000이하", spicy: "담백하게", weather: ["추움", "비"], cuisine: "일식", description: "뜨끈한 국물로 편안하게 즐기는 면 요리", kakaoSearchKeyword: "우동 맛집" },
  { id: "menu_023", name: "회", emoji: "🐟", moods: ["신남", "그냥그럼"], situations: ["소개팅데이트", "회식"], price: "만오천이상", spicy: "담백하게", weather: ["맑음", "더움"], cuisine: "일식", description: "신선하고 깔끔한 특별한 한 끼", kakaoSearchKeyword: "회 맛집" },
  { id: "menu_024", name: "샐러드", emoji: "🥗", moods: ["그냥그럼", "스트레스받음"], situations: ["혼밥", "소개팅데이트"], price: "만원대", spicy: "담백하게", weather: ["더움", "맑음"], cuisine: "양식", description: "가볍고 산뜻하게 즐기는 건강식", kakaoSearchKeyword: "샐러드 맛집" },
  { id: "menu_025", name: "순두부찌개", emoji: "🥘", moods: ["위로받고싶음", "든든하게"], situations: ["혼밥", "친구랑"], price: "8000이하", spicy: "자극적으로", weather: ["추움", "비"], cuisine: "한식", description: "얼큰하고 부드러운 순두부의 위로", kakaoSearchKeyword: "순두부찌개 맛집" },
  { id: "menu_026", name: "갈비탕", emoji: "🍖", moods: ["든든하게", "위로받고싶음"], situations: ["혼밥", "회식"], price: "만원대", spicy: "담백하게", weather: ["추움", "맑음"], cuisine: "한식", description: "진한 육수로 든든하게 채우는 보양식", kakaoSearchKeyword: "갈비탕 맛집" },
  { id: "menu_027", name: "쭈꾸미볶음", emoji: "🦑", moods: ["스트레스받음", "신남"], situations: ["친구랑", "회식"], price: "만원대", spicy: "자극적으로", weather: ["추움", "비"], cuisine: "한식", description: "매콤한 쭈꾸미로 화끈하게 스트레스 해소", kakaoSearchKeyword: "쭈꾸미볶음 맛집" },
  { id: "menu_028", name: "감자탕", emoji: "🍖", moods: ["든든하게", "위로받고싶음"], situations: ["회식", "친구랑"], price: "만원대", spicy: "자극적으로", weather: ["추움", "비"], cuisine: "한식", description: "진하고 얼큰한 국물의 든든한 한 끼", kakaoSearchKeyword: "감자탕 맛집" },
  { id: "menu_029", name: "부대찌개", emoji: "🍲", moods: ["든든하게", "스트레스받음"], situations: ["친구랑", "회식"], price: "만원대", spicy: "자극적으로", weather: ["추움", "비"], cuisine: "한식", description: "얼큰하고 푸짐한 부대찌개 한 그릇", kakaoSearchKeyword: "부대찌개 맛집" },
  { id: "menu_030", name: "청국장", emoji: "🍚", moods: ["위로받고싶음", "그냥그럼"], situations: ["혼밥", "친구랑"], price: "8000이하", spicy: "담백하게", weather: ["추움", "맑음"], cuisine: "한식", description: "구수하고 건강한 집밥 한 상", kakaoSearchKeyword: "청국장 맛집" },
  { id: "menu_031", name: "콩나물국밥", emoji: "🍚", moods: ["위로받고싶음", "그냥그럼"], situations: ["혼밥", "친구랑"], price: "8000이하", spicy: "담백하게", weather: ["추움", "비"], cuisine: "한식", description: "해장에 좋은 시원하고 깔끔한 국밥", kakaoSearchKeyword: "콩나물국밥 맛집" },
  { id: "menu_032", name: "낙지볶음", emoji: "🌶️", moods: ["스트레스받음", "신남"], situations: ["친구랑", "회식"], price: "만원대", spicy: "자극적으로", weather: ["비", "추움"], cuisine: "한식", description: "쫄깃한 낙지와 화끈한 매콤함", kakaoSearchKeyword: "낙지볶음 맛집" },
  { id: "menu_033", name: "김밥", emoji: "🍙", moods: ["그냥그럼", "든든하게"], situations: ["혼밥", "친구랑"], price: "8000이하", spicy: "담백하게", weather: ["맑음", "더움"], cuisine: "분식", description: "간단하면서 든든한 한 끼 분식", kakaoSearchKeyword: "김밥 맛집" },
  { id: "menu_034", name: "라멘", emoji: "🍜", moods: ["위로받고싶음", "그냥그럼"], situations: ["혼밥", "친구랑"], price: "만원대", spicy: "느끼한거땡김", weather: ["추움", "비"], cuisine: "일식", description: "진한 돈코츠 국물의 깊은 위로", kakaoSearchKeyword: "라멘 맛집" },
  { id: "menu_035", name: "규동", emoji: "🍚", moods: ["든든하게", "그냥그럼"], situations: ["혼밥", "친구랑"], price: "8000이하", spicy: "느끼한거땡김", weather: ["맑음", "추움"], cuisine: "일식", description: "달콤짭짤한 소고기와 든든한 한 그릇", kakaoSearchKeyword: "규동 맛집" },
  { id: "menu_036", name: "초계국수", emoji: "🍜", moods: ["그냥그럼", "신남"], situations: ["친구랑", "소개팅데이트"], price: "만원대", spicy: "담백하게", weather: ["더움", "맑음"], cuisine: "한식", description: "새콤달콤 시원한 여름 별미", kakaoSearchKeyword: "초계국수 맛집" },
  { id: "menu_037", name: "물회", emoji: "🐟", moods: ["신남", "그냥그럼"], situations: ["친구랑", "소개팅데이트"], price: "만원대", spicy: "자극적으로", weather: ["더움", "맑음"], cuisine: "한식", description: "새콤매콤 시원한 여름 물회 한 그릇", kakaoSearchKeyword: "물회 맛집" },
  { id: "menu_038", name: "리조또", emoji: "🍚", moods: ["그냥그럼", "신남"], situations: ["소개팅데이트", "친구랑"], price: "만원대", spicy: "느끼한거땡김", weather: ["맑음", "비"], cuisine: "양식", description: "부드럽고 고소한 크리미 리조또", kakaoSearchKeyword: "리조또 맛집" },
  { id: "menu_039", name: "그라탕", emoji: "🧀", moods: ["든든하게", "위로받고싶음"], situations: ["소개팅데이트", "친구랑"], price: "만원대", spicy: "느끼한거땡김", weather: ["추움", "비"], cuisine: "양식", description: "치즈 듬뿍 든든하고 따뜻한 한 그릇", kakaoSearchKeyword: "그라탕 맛집" },
  { id: "menu_040", name: "타코", emoji: "🌮", moods: ["신남", "그냥그럼"], situations: ["친구랑", "소개팅데이트"], price: "만원대", spicy: "자극적으로", weather: ["맑음", "더움"], cuisine: "기타", description: "이국적이고 경쾌한 한 끼", kakaoSearchKeyword: "타코 맛집" },
  { id: "menu_041", name: "쌈밥", emoji: "🥬", moods: ["든든하게", "그냥그럼"], situations: ["혼밥", "친구랑"], price: "만원대", spicy: "담백하게", weather: ["맑음", "더움"], cuisine: "한식", description: "건강하고 든든하게 쌈 싸먹는 한 상", kakaoSearchKeyword: "쌈밥 맛집" },
  { id: "menu_042", name: "훠궈", emoji: "🍲", moods: ["신남", "스트레스받음"], situations: ["친구랑", "회식"], price: "만오천이상", spicy: "자극적으로", weather: ["추움", "비"], cuisine: "중식", description: "얼큰한 육수에 부글부글 끓여먹는 즐거움", kakaoSearchKeyword: "훠궈 맛집" },
  { id: "menu_043", name: "양꼬치", emoji: "🍢", moods: ["신남", "든든하게"], situations: ["친구랑", "회식"], price: "만오천이상", spicy: "느끼한거땡김", weather: ["추움", "맑음"], cuisine: "중식", description: "향신료 가득 이국적인 회식 메뉴", kakaoSearchKeyword: "양꼬치 맛집" },
  { id: "menu_044", name: "딤섬", emoji: "🥟", moods: ["그냥그럼", "신남"], situations: ["소개팅데이트", "친구랑"], price: "만원대", spicy: "담백하게", weather: ["맑음", "비"], cuisine: "중식", description: "정갈하고 담백한 딤섬 한 상", kakaoSearchKeyword: "딤섬 맛집" },
  { id: "menu_045", name: "한정식", emoji: "🍱", moods: ["든든하게", "위로받고싶음"], situations: ["소개팅데이트", "회식"], price: "만오천이상", spicy: "담백하게", weather: ["맑음", "추움"], cuisine: "한식", description: "정갈하게 차려진 든든한 상차림", kakaoSearchKeyword: "한정식 맛집" },
  { id: "menu_046", name: "해물찜", emoji: "🦀", moods: ["든든하게", "신남"], situations: ["회식", "소개팅데이트"], price: "만오천이상", spicy: "자극적으로", weather: ["추움", "비"], cuisine: "한식", description: "푸짐한 해물로 즐기는 화끈한 한 상", kakaoSearchKeyword: "해물찜 맛집" },
  { id: "menu_047", name: "브런치세트", emoji: "🍳", moods: ["그냥그럼", "신남"], situations: ["소개팅데이트", "혼밥"], price: "만원대", spicy: "담백하게", weather: ["맑음", "더움"], cuisine: "양식", description: "여유롭게 즐기는 산뜻한 브런치", kakaoSearchKeyword: "브런치 맛집" },
  { id: "menu_048", name: "로제떡볶이", emoji: "🍜", moods: ["스트레스받음", "신남"], situations: ["혼밥", "친구랑"], price: "8000이하", spicy: "느끼한거땡김", weather: ["비", "맑음"], cuisine: "분식", description: "매콤달콤 크리미한 로제 소스 분식", kakaoSearchKeyword: "로제떡볶이 맛집" },
  { id: "menu_049", name: "육회비빔밥", emoji: "🥩", moods: ["신남", "그냥그럼"], situations: ["친구랑", "소개팅데이트"], price: "만원대", spicy: "담백하게", weather: ["더움", "맑음"], cuisine: "한식", description: "신선하고 고급스러운 별미 한 그릇", kakaoSearchKeyword: "육회비빔밥 맛집" }
];

const STEPS = [
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
  },
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
    key: "dislikedCuisine",
    title: "오늘 안 땡기는 종류는요?",
    field: "cuisine",
    options: [
      { value: "한식", emoji: "🍚" },
      { value: "중식", emoji: "🥢" },
      { value: "일식", emoji: "🍣" },
      { value: "양식", emoji: "🍝" },
      { value: "분식", emoji: "🍜" },
      { value: "기타", emoji: "🍽️" }
    ]
  }
];

const state = {
  stepIndex: 0,
  answers: {},
  lastMenuId: null,
  mode: "solo",
  roomId: null,
  pendingRoomId: null,
  participantId: null,
  nickname: null,
  isHost: false,
  targetCount: null,
  roomFormTargetCount: null,
  roomFormPurposeLabel: null,
  participantsCache: [],
  groupResultReceived: false,
  quizStarted: false,
  unsubscribers: []
};

const screens = {
  landing: document.getElementById("screen-landing"),
  steps: document.getElementById("screen-steps"),
  complete: document.getElementById("screen-complete"),
  result: document.getElementById("screen-result"),
  groupEntry: document.getElementById("screen-group-entry"),
  roomCreate: document.getElementById("screen-room-create"),
  join: document.getElementById("screen-join"),
  waiting: document.getElementById("screen-waiting"),
  groupResult: document.getElementById("screen-group-result")
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
const INGREDIENT_BUBBLE_MS = 750;
const INGREDIENT_MELT_MS = 320;

function shakeBowl(bowlEl) {
  bowlEl.classList.remove("bowl--shake");
  void bowlEl.offsetWidth;
  bowlEl.classList.add("bowl--shake");
  window.setTimeout(() => bowlEl.classList.remove("bowl--shake"), 400);
}

function spawnBubbles(bowlIngredientsEl, xPct, yPct) {
  for (let i = 0; i < 4; i++) {
    const bubble = document.createElement("span");
    bubble.className = "ingredient-bubble";
    const size = 12 + Math.random() * 12;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `calc(${xPct}% + ${Math.random() * 24 - 12}px)`;
    bubble.style.top = `${yPct}%`;
    bubble.style.animationDelay = `${i * 0.11}s`;
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
    } else if (state.mode === "group") {
      submitGroupAnswers();
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
    state.lastMenuId = menu.id;
    showResult(menu);
  }, RESULT_REVEAL_DELAY_MS);
}

// 가격·맛강도는 명확한 조건이라 가중치를 높게, 기분·상황·날씨는 유사하면 되는 조건이라 낮게 둔다
const SCORE_WEIGHTS = { mood: 1, situation: 1, price: 2, spicy: 2, weather: 1 };

function scoreMenu(menu, answers = state.answers) {
  const a = answers;
  let score = 0;
  if (menu.moods.includes(a.mood)) score += SCORE_WEIGHTS.mood;
  if (menu.situations.includes(a.situation)) score += SCORE_WEIGHTS.situation;
  if (menu.price === a.price) score += SCORE_WEIGHTS.price;
  if (menu.spicy === a.spicy) score += SCORE_WEIGHTS.spicy;
  if (menu.weather.includes(a.weather)) score += SCORE_WEIGHTS.weather;
  return score;
}

function pickMenu(answers = state.answers, excludeId = state.lastMenuId) {
  let candidates = MENUS.filter((m) => m.id !== excludeId);

  // "먹기 싫은 종류"는 가점이 아니라 완전 제외 필터 — 다 걸러지면 필터를 무시해 빈 후보를 막는다
  if (answers.dislikedCuisines && answers.dislikedCuisines.size > 0) {
    const filtered = candidates.filter((m) => !answers.dislikedCuisines.has(m.cuisine));
    if (filtered.length > 0) candidates = filtered;
  } else if (answers.dislikedCuisine) {
    const filtered = candidates.filter((m) => m.cuisine !== answers.dislikedCuisine);
    if (filtered.length > 0) candidates = filtered;
  }

  const scored = candidates.map((m) => ({ menu: m, score: scoreMenu(m, answers) }));
  const maxScore = Math.max(...scored.map((s) => s.score));
  const best = scored.filter((s) => s.score === maxScore).map((s) => s.menu);
  return best[Math.floor(Math.random() * best.length)];
}

// 그룹 모드: 참여자 전원의 선택값을 항목별 최빈값(다수결)으로 합쳐 대표 조건을 만든다. 동률은 랜덤.
// situation(방 목적)과 dislikedCuisine(제외 필터)은 다수결이 아니라 별도로 합쳐지므로 여기서 제외한다.
function aggregateGroupAnswers(participantAnswersList) {
  const fields = ["weather", "mood", "price", "spicy"];
  const aggregated = {};
  fields.forEach((field) => {
    const counts = {};
    participantAnswersList.forEach((a) => {
      if (a == null || a[field] == null) return;
      counts[a[field]] = (counts[a[field]] || 0) + 1;
    });
    const maxCount = Math.max(...Object.values(counts));
    const winners = Object.keys(counts).filter((v) => counts[v] === maxCount);
    aggregated[field] = winners[Math.floor(Math.random() * winners.length)];
  });
  return aggregated;
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

// ===== 같이 먹기 (그룹 모드) =====

function generateRoomCode() {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)];
  }
  return code;
}

function inviteLinkFor(roomId) {
  return `${location.origin}${location.pathname}?room=${roomId}`;
}

async function dedupeNickname(roomId, baseName) {
  const snap = await getDocs(collection(db, "rooms", roomId, "participants"));
  const existingCount = snap.docs.filter((d) => d.data().baseNickname === baseName).length;
  return existingCount === 0 ? baseName : `${baseName}(${existingCount + 1})`;
}

async function checkRoomStatus(roomId) {
  const roomSnap = await getDoc(doc(db, "rooms", roomId));
  if (!roomSnap.exists()) return { ok: false, reason: "not-found" };
  const data = roomSnap.data();
  const lastActivityMs = data.lastActivityAt ? data.lastActivityAt.toMillis() : 0;
  if (Date.now() - lastActivityMs > ROOM_EXPIRY_MS) return { ok: false, reason: "expired" };
  const participantsSnap = await getDocs(collection(db, "rooms", roomId, "participants"));
  if (participantsSnap.size >= data.targetCount) return { ok: false, reason: "full" };
  return { ok: true, data };
}

async function createRoom(hostBaseNickname, targetCount, purpose) {
  let roomId = generateRoomCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await getDoc(doc(db, "rooms", roomId));
    if (!existing.exists()) break;
    roomId = generateRoomCode();
  }

  const clampedTargetCount = Math.max(2, targetCount);

  await setDoc(doc(db, "rooms", roomId), {
    hostNickname: hostBaseNickname,
    targetCount: clampedTargetCount,
    purpose,
    status: "waiting",
    createdAt: serverTimestamp(),
    lastActivityAt: serverTimestamp(),
    groupResult: null
  });

  const nickname = await dedupeNickname(roomId, hostBaseNickname);
  const participantRef = await addDoc(collection(db, "rooms", roomId, "participants"), {
    nickname,
    baseNickname: hostBaseNickname,
    isHost: true,
    joinedAt: serverTimestamp(),
    submitted: false,
    submittedAt: null,
    answers: null
  });

  state.mode = "group";
  state.roomId = roomId;
  state.participantId = participantRef.id;
  state.nickname = nickname;
  state.isHost = true;
  state.targetCount = clampedTargetCount;

  return { roomId, nickname };
}

async function joinRoom(roomId, baseNickname) {
  await updateDoc(doc(db, "rooms", roomId), { lastActivityAt: serverTimestamp() });
  const roomSnap = await getDoc(doc(db, "rooms", roomId));
  const nickname = await dedupeNickname(roomId, baseNickname);
  const participantRef = await addDoc(collection(db, "rooms", roomId, "participants"), {
    nickname,
    baseNickname,
    isHost: false,
    joinedAt: serverTimestamp(),
    submitted: false,
    submittedAt: null,
    answers: null
  });

  state.mode = "group";
  state.roomId = roomId;
  state.participantId = participantRef.id;
  state.nickname = nickname;
  state.isHost = false;
  state.targetCount = Math.max(2, roomSnap.data().targetCount);

  return { nickname };
}

function unsubscribeAll() {
  state.unsubscribers.forEach((unsub) => unsub());
  state.unsubscribers = [];
}

const RESULT_REVEAL_DELAY_MS = 1200;

function subscribeToRoom(roomId) {
  unsubscribeAll();
  state.groupResultReceived = false;
  state.quizStarted = false;
  state.participantsCache = [];

  const participantsUnsub = onSnapshot(collection(db, "rooms", roomId, "participants"), (snap) => {
    state.participantsCache = snap.docs.map((d) => d.data());

    if (!state.quizStarted) {
      if (state.participantsCache.length >= state.targetCount) {
        startGroupSteps(); // 호스트·참여자 전원이 각자 이 조건을 동시에 만족 → 동시 시작
        return;
      }
      if (screens.roomCreate.hasAttribute("data-active")) renderHostLobby();
      else if (screens.waiting.hasAttribute("data-active")) renderWaiting();
      return;
    }
    if (screens.waiting.hasAttribute("data-active")) renderWaiting();
  });

  const roomUnsub = onSnapshot(doc(db, "rooms", roomId), (snap) => {
    const data = snap.data();
    // groupResult가 뜬 뒤에도 다른 참여자의 lastActivityAt 갱신으로 이 리스너가 재발화될 수 있다 —
    // 가드 없이는 이미 결과 화면에 있는 사용자가 완성 화면으로 되돌아갔다가 다시 전환되는 회귀가 생긴다
    if (data && data.groupResult && !state.groupResultReceived) {
      state.groupResultReceived = true;
      showScreen("complete");
      window.setTimeout(() => {
        renderGroupResult(data.groupResult);
        showScreen("groupResult");
      }, RESULT_REVEAL_DELAY_MS);
    }
  });

  state.unsubscribers.push(participantsUnsub, roomUnsub);
}

async function maybeComputeGroupResult(roomId, participantDataList) {
  const roomInfoSnap = await getDoc(doc(db, "rooms", roomId));
  const purpose = roomInfoSnap.data().purpose;
  const dislikedCuisines = new Set(
    participantDataList.map((p) => p.answers && p.answers.dislikedCuisine).filter(Boolean)
  ); // 다수결이 아니라 전원이 고른 카테고리를 모두 합쳐 제외 — "먹기 싫다"는 타협 대상이 아니므로

  const aggregatedAnswers = aggregateGroupAnswers(participantDataList.map((p) => p.answers));
  aggregatedAnswers.situation = purpose; // 방 목적이 개인별 "누구와 함께" 다수결을 대체

  const menu = pickMenu({ ...aggregatedAnswers, dislikedCuisines }, null);
  // Firestore는 Set을 저장할 수 없으므로 기록용에는 배열로 남긴다
  aggregatedAnswers.dislikedCuisines = Array.from(dislikedCuisines);

  await runTransaction(db, async (transaction) => {
    const roomRef = doc(db, "rooms", roomId);
    const roomSnap = await transaction.get(roomRef);
    if (roomSnap.data().groupResult) return;
    transaction.update(roomRef, {
      status: "completed",
      groupResult: {
        menuId: menu.id,
        name: menu.name,
        emoji: menu.emoji,
        description: menu.description,
        kakaoSearchKeyword: menu.kakaoSearchKeyword,
        computedAt: serverTimestamp(),
        aggregatedAnswers
      }
    });
  });
}

async function submitGroupAnswers() {
  // "완성!"은 아직 아무것도 안 됐는데 보여주면 오해를 준다 — 제출 직후엔 곧바로 대기 화면을 보여주고,
  // "완성!"은 그룹 결과가 실제로 나온 순간(subscribeToRoom의 room onSnapshot)에만 잠깐 띄운다.
  showScreen("waiting");
  renderWaiting();

  await updateDoc(doc(db, "rooms", state.roomId, "participants", state.participantId), {
    answers: state.answers,
    submitted: true,
    submittedAt: serverTimestamp()
  });
  await updateDoc(doc(db, "rooms", state.roomId), { lastActivityAt: serverTimestamp() });

  const participantsSnap = await getDocs(collection(db, "rooms", state.roomId, "participants"));
  const participantDataList = participantsSnap.docs.map((d) => d.data());
  const submittedCount = participantDataList.filter((p) => p.submitted).length;
  if (submittedCount >= state.targetCount) {
    // 여러 참여자가 동시에 마지막 제출자가 되면 다 같이 이 함수를 호출할 수 있다 — 트랜잭션이
    // 승자를 가리고 나머지는 no-op 처리하지만, 진 쪽은 경합으로 인해 권한 오류로 보일 수 있어 무시한다
    maybeComputeGroupResult(state.roomId, participantDataList).catch(() => {});
  }
}

function startGroupSteps() {
  state.quizStarted = true;
  state.stepIndex = 0;
  state.answers = {};
  document.getElementById("bowl-ingredients").innerHTML = "";
  showScreen("steps");
  renderStep();
}

function renderRoomPurposeOptions() {
  const optionsEl = document.getElementById("room-purpose-options");
  optionsEl.innerHTML = "";
  ROOM_PURPOSES.forEach((purpose) => {
    const btn = document.createElement("button");
    btn.className = "option-chip";
    btn.type = "button";

    const emojiSpan = document.createElement("span");
    emojiSpan.className = "option-chip__emoji";
    emojiSpan.textContent = purpose.emoji;

    const labelSpan = document.createElement("span");
    labelSpan.className = "option-chip__label";
    labelSpan.textContent = purpose.label;

    btn.appendChild(emojiSpan);
    btn.appendChild(labelSpan);

    // situation 값은 "단순 식사"/"친목 모임"처럼 여러 목적이 공유할 수 있으므로 label로 선택 상태를 추적한다
    if (state.roomFormPurposeLabel === purpose.label) btn.setAttribute("data-selected", "true");
    btn.addEventListener("click", () => {
      state.roomFormPurposeLabel = purpose.label;
      renderRoomPurposeOptions();
    });
    optionsEl.appendChild(btn);
  });
}

function showRoomCreateError(message) {
  const errorEl = document.getElementById("room-create-error");
  errorEl.textContent = message;
  errorEl.style.display = "block";
}

function enterRoomCreateScreen() {
  document.getElementById("room-nickname").value = "";
  document.getElementById("room-count-manual").value = "";
  document.getElementById("room-create-error").style.display = "none";
  document.getElementById("room-create-form").hidden = false;
  document.getElementById("room-create-invite").hidden = true;
  state.roomFormPurposeLabel = null;
  state.roomFormTargetCount = null;
  renderRoomPurposeOptions();
  showScreen("roomCreate");
}

function showJoinError(reason) {
  const messages = {
    "not-found": "방을 찾을 수 없어요. 코드를 다시 확인해주세요.",
    expired: "방이 만료됐어요. 새로 만들어주세요.",
    full: "이미 인원이 다 찼어요."
  };
  const errorEl = document.getElementById("join-error");
  errorEl.textContent = messages[reason] || "알 수 없는 오류가 발생했어요.";
  errorEl.style.display = "block";
}

async function enterJoinFlow(roomId) {
  document.getElementById("join-nickname").value = "";
  document.getElementById("join-code-input").style.display = "none";
  document.getElementById("join-error").style.display = "none";
  document.getElementById("join-title").textContent = "방에 참여해요";
  state.pendingRoomId = roomId;
  showScreen("join");

  const status = await checkRoomStatus(roomId);
  if (!status.ok) {
    showJoinError(status.reason);
    return;
  }
  document.getElementById("join-title").textContent = `${status.data.hostNickname}님의 방에 참여해요`;
}

function renderProgressDots(container, total, doneCount) {
  container.innerHTML = "";
  for (let i = 0; i < total; i++) {
    const dot = document.createElement("span");
    if (i < doneCount) dot.setAttribute("data-done", "true");
    container.appendChild(dot);
  }
}

function renderJoinedRoster(rosterEl, participants) {
  rosterEl.innerHTML = "";
  participants.forEach((p) => {
    const item = document.createElement("p");
    item.className = "waiting-roster__item";
    item.textContent = `✅ ${p.nickname}`;
    rosterEl.appendChild(item);
  });
}

function renderWaiting() {
  const participants = state.participantsCache || [];
  const kickerEl = document.getElementById("waiting-kicker");
  const progressEl = document.getElementById("waiting-progress");
  const rosterEl = document.getElementById("waiting-roster");

  if (!state.quizStarted) {
    // 로비 단계: 인원이 다 찰 때까지 대기
    kickerEl.textContent = `${participants.length}/${state.targetCount}명 모였어요`;
    renderProgressDots(progressEl, state.targetCount, participants.length);
    renderJoinedRoster(rosterEl, participants);
    return;
  }

  // 제출 대기 단계: 각자 그릇을 다 채울 때까지 대기 (기존 동작)
  const submittedCount = participants.filter((p) => p.submitted).length;
  kickerEl.textContent = `${submittedCount}/${state.targetCount}명 담는 중`;
  renderProgressDots(progressEl, state.targetCount, submittedCount);
  rosterEl.innerHTML = "";
  participants.forEach((p) => {
    const item = document.createElement("p");
    item.className = "waiting-roster__item";
    item.textContent = `${p.submitted ? "✅" : "⏳"} ${p.nickname}`;
    rosterEl.appendChild(item);
  });
}

function renderHostLobby() {
  const participants = state.participantsCache || [];
  document.getElementById("room-lobby-kicker").textContent = `${participants.length}/${state.targetCount}명 모였어요`;
  renderJoinedRoster(document.getElementById("room-lobby-roster"), participants);
}

function renderGroupResult(groupResult) {
  document.getElementById("group-result-emoji").textContent = groupResult.emoji;
  document.getElementById("group-result-name").textContent = groupResult.name;
  document.getElementById("group-result-desc").textContent = groupResult.description;
  document.getElementById("btn-group-map").href = `https://map.kakao.com/link/search/${encodeURIComponent(groupResult.kakaoSearchKeyword)}`;
}

function exitGroupModeToLanding() {
  unsubscribeAll();
  state.mode = "solo";
  state.roomId = null;
  state.pendingRoomId = null;
  state.participantId = null;
  state.nickname = null;
  state.isHost = false;
  state.targetCount = null;
  state.roomFormPurposeLabel = null;
  state.participantsCache = [];
  state.quizStarted = false;
  state.groupResultReceived = false;
  if (location.search) history.replaceState(null, "", location.pathname);
  showScreen("landing");
}

function enterManualJoinFlow() {
  document.getElementById("join-nickname").value = "";
  document.getElementById("join-code-input").value = "";
  document.getElementById("join-code-input").style.display = "block";
  document.getElementById("join-error").style.display = "none";
  document.getElementById("join-title").textContent = "방에 참여해요";
  state.pendingRoomId = null;
  showScreen("join");
}

document.getElementById("btn-solo").addEventListener("click", startSolo);
document.getElementById("btn-group").addEventListener("click", () => showScreen("groupEntry"));
document.getElementById("btn-back").addEventListener("click", goBack);
document.getElementById("btn-retry").addEventListener("click", retry);
document.getElementById("btn-restart").addEventListener("click", restart);

document.getElementById("btn-group-entry-create").addEventListener("click", enterRoomCreateScreen);
document.getElementById("btn-group-entry-join").addEventListener("click", enterManualJoinFlow);
document.getElementById("btn-group-entry-back").addEventListener("click", () => showScreen("landing"));

document.getElementById("btn-room-create-back").addEventListener("click", exitGroupModeToLanding);

document.getElementById("btn-create-room").addEventListener("click", async () => {
  const baseNickname = document.getElementById("room-nickname").value.trim();
  if (!baseNickname) {
    showRoomCreateError("닉네임을 입력해주세요.");
    return;
  }
  if (!state.roomFormPurposeLabel) {
    showRoomCreateError("오늘의 목적을 선택해주세요.");
    return;
  }
  if (!state.roomFormTargetCount || state.roomFormTargetCount < 2 || state.roomFormTargetCount > ROOM_MANUAL_COUNT_MAX) {
    showRoomCreateError("인원 수를 확인해주세요.");
    return;
  }
  document.getElementById("room-create-error").style.display = "none";

  const purpose = ROOM_PURPOSES.find((p) => p.label === state.roomFormPurposeLabel).situation;
  const { roomId } = await createRoom(baseNickname, state.roomFormTargetCount, purpose);
  subscribeToRoom(roomId);

  document.getElementById("invite-code").textContent = roomId;
  document.getElementById("room-create-form").hidden = true;
  document.getElementById("room-create-invite").hidden = false;
  renderHostLobby();
});

document.getElementById("room-count-manual").addEventListener("input", (e) => {
  const val = parseInt(e.target.value, 10);
  state.roomFormTargetCount = Number.isFinite(val) ? val : null;
});

document.getElementById("btn-copy-invite").addEventListener("click", async () => {
  const link = inviteLinkFor(state.roomId);
  const message = `${state.nickname}님이 초대했어요! 함께 그릇을 채워보세요 🥣\n${link}`;
  try {
    await navigator.clipboard.writeText(message);
  } catch (err) {
    window.prompt("아래 링크를 복사하세요", message);
  }
});

document.getElementById("btn-join-back").addEventListener("click", exitGroupModeToLanding);

document.getElementById("btn-join-room").addEventListener("click", async () => {
  const baseNickname = document.getElementById("join-nickname").value.trim();
  if (!baseNickname) return;

  let roomId = state.pendingRoomId;
  if (!roomId) {
    const codeInput = document.getElementById("join-code-input").value.trim().toUpperCase();
    if (!codeInput) {
      showJoinError("not-found");
      return;
    }
    roomId = codeInput;
  }

  const status = await checkRoomStatus(roomId);
  if (!status.ok) {
    showJoinError(status.reason);
    return;
  }

  await joinRoom(roomId, baseNickname);
  subscribeToRoom(roomId);
  showScreen("waiting");
  renderWaiting();
});

document.getElementById("btn-group-restart").addEventListener("click", exitGroupModeToLanding);

const urlRoomId = new URLSearchParams(location.search).get("room");
if (urlRoomId) {
  document.getElementById("join-code-input").style.display = "none";
  enterJoinFlow(urlRoomId.toUpperCase());
}
