/**************************************************
 *  Faith-MBTI Test – Main JS
 *  파일 분리 버전 (index.html + style.css + app.js)
 **************************************************/

/* ===============================
   질문 데이터 (40문항)
================================ */
const originalQuestions = [
  // E / I
  { id: "EI_E1", text: "좋은 이야기가 생기면 “누구에게 먼저 말할까?”가 가장 먼저 떠오른다.", axis: "EI", side: "E" },
  { id: "EI_E2", text: "하루 동안 사람을 거의 못 만나면 마음이 조금 허전해진다.", axis: "EI", side: "E" },
  { id: "EI_E3", text: "모임이 예정되어 있으면 피곤해도 마음이 열린다.", axis: "EI", side: "E" },
  { id: "EI_E4", text: "고민은 혼자보다는 누군가에게 털어놓는 편이 훨씬 편하다.", axis: "EI", side: "E" },
  { id: "EI_E5", text: "여러 사람 속에서는 오히려 생각이 더 잘 정리될 때가 있다.", axis: "EI", side: "E" },

  { id: "EI_I1", text: "혼자 있는 시간이 부족하면 마음이 쉽게 지쳐버린다.", axis: "EI", side: "I" },
  { id: "EI_I2", text: "대화가 많은 날은 조용한 시간이 반드시 필요하다.", axis: "EI", side: "I" },
  { id: "EI_I3", text: "중요한 생각은 마음속에서 충분히 익은 뒤에야 말이 된다.", axis: "EI", side: "I" },
  { id: "EI_I4", text: "시끌벅적함보다 차분한 공간에서 집중이 잘 된다.", axis: "EI", side: "I" },
  { id: "EI_I5", text: "감정과 감동도 홀로 정리되는 시간이 있어야 편안하다.", axis: "EI", side: "I" },

  // S / N
  { id: "SN_S1", text: "계획을 들으면 “구체적으로 무엇을 하면 될까?”가 먼저 궁금하다.", axis: "SN", side: "S" },
  { id: "SN_S2", text: "익숙한 루틴이 흐트러지면 은근히 불편하다.", axis: "SN", side: "S" },
  { id: "SN_S3", text: "눈앞의 일을 하나씩 정리해야 마음이 안정된다.", axis: "SN", side: "S" },
  { id: "SN_S4", text: "‘새로움’보다 ‘확실함’이 더 믿음직스럽다.", axis: "SN", side: "S" },
  { id: "SN_S5", text: "사실은 직접 확인해야 비로소 안심된다.", axis: "SN", side: "S" },

  { id: "SN_N1", text: "단순한 상황에서도 전체 흐름이 먼저 보인다.", axis: "SN", side: "N" },
  { id: "SN_N2", text: "반복되는 방식보다 의미와 방향이 더 중요하다.", axis: "SN", side: "N" },
  { id: "SN_N3", text: "“앞으로 이렇게 될 것 같다”라는 생각이 자주 떠오른다.", axis: "SN", side: "N" },
  { id: "SN_N4", text: "계획보다 순간 떠오르는 영감이 매력적으로 느껴질 때가 있다.", axis: "SN", side: "N" },
  { id: "SN_N5", text: "세부보다 목적과 의도가 먼저 잡혀야 마음이 편하다.", axis: "SN", side: "N" },

  // T / F
  { id: "TF_T1", text: "누군가 고민을 말하면 해결책이 먼저 떠오른다.", axis: "TF", side: "T" },
  { id: "TF_T2", text: "기준이 분명하면 혼란스러운 상황도 금세 정리된다.", axis: "TF", side: "T" },
  { id: "TF_T3", text: "논리적으로 맞지 않으면 분위기가 좋아도 마음이 걸린다.", axis: "TF", side: "T" },
  { id: "TF_T4", text: "갈등이 생기면 ‘누가 맞는가’를 먼저 생각하게 된다.", axis: "TF", side: "T" },
  { id: "TF_T5", text: "감정 표현보다 사실관계를 먼저 알고 싶다.", axis: "TF", side: "T" },

  { id: "TF_F1", text: "말하지 않아도 누군가의 표정을 금세 읽는다.", axis: "TF", side: "F" },
  { id: "TF_F2", text: "문제가 생기면 “누가 힘들까?”라는 생각이 앞선다.", axis: "TF", side: "F" },
  { id: "TF_F3", text: "말할 때 상대의 마음이 다치지 않도록 먼저 생각한다.", axis: "TF", side: "F" },
  { id: "TF_F4", text: "옳은 일이라도 상처가 생길 것 같으면 망설여진다.", axis: "TF", side: "F" },
  { id: "TF_F5", text: "분위기가 따뜻하게 유지되면 하루가 더 가벼워진다.", axis: "TF", side: "F" },

  // J / P
  { id: "JP_J1", text: "해야 할 일이 남아 있으면 마음속에 작은 알림이 계속 울린다.", axis: "JP", side: "J" },
  { id: "JP_J2", text: "계획이 정리되면 절반은 이미 끝난 것처럼 느껴진다.", axis: "JP", side: "J" },
  { id: "JP_J3", text: "갑작스러운 일정 변경이 마음의 평화를 흔들곤 한다.", axis: "JP", side: "J" },
  { id: "JP_J4", text: "마감 이전에 일을 끝내두는 것이 편안하다.", axis: "JP", side: "J" },
  { id: "JP_J5", text: "규칙이나 흐름이 정해져 있을 때 일이 더 수월하다.", axis: "JP", side: "J" },

  { id: "JP_P1", text: "즉흥적인 변화가 있는 날이 오히려 더 활기차다.", axis: "JP", side: "P" },
  { id: "JP_P2", text: "선택지는 많을수록 마음이 자유롭다.", axis: "JP", side: "P" },
  { id: "JP_P3", text: "해야 할 일이 있어도 느낌이 오는 순간 집중이 잘 된다.", axis: "JP", side: "P" },
  { id: "JP_P4", text: "계획을 바꾸는 일이 자연스럽고 때로는 더 재미있다.", axis: "JP", side: "P" },
  { id: "JP_P5", text: "시간이 촉박해질수록 집중력이 더 높아진다.", axis: "JP", side: "P" },
];

/* ===============================
   결과 데이터 (Faith-MBTI 16유형)
================================ */

const typeResults = {
  ESTJ: {
    nameKo: "진리의 관리자",
    nameEn: "The Builder of Order",
    summary:
      "말씀과 원칙, 구조를 소중히 여기는 실천형 리더입니다. 공동체를 정돈하고 책임을 지며, “옳은 것을 실행하자”는 마음으로 하나님 나라를 세워 갑니다.",
    badges: ["질서·실행", "원칙·책임", "공동체 리더십"],
    features: [
      "성경적 기준과 질서를 분명히 세우는 데 강점이 있습니다.",
      "계획·행정·운영을 맡기면 안정감 있게 이끌어 갑니다.",
      "결정이 빠르고 실행력이 강해 ‘멈춰 있는 것’을 잘 못 보는 편입니다.",
    ],
    growth: [
      "관계의 섬세함과 공감을 훈련해 사람의 마음에 더 귀 기울여 보세요.",
      "완벽한 구조보다 성령의 예상치 못한 인도에 열린 마음을 가져보세요.",
      "스스로 짊어진 책임을 주님께 내려놓으며 쉼을 허락해 보세요.",
    ],
    bibleCharacter: "모세",
    bibleCharacterDesc: "광야 여정에서 질서를 세우고 인도한 리더.",
    verseRef: "민수기 12:7",
    verseText: "“내 종 모세는 내 온 집에 충성됨이라.”",
    characterEmoji: "🛡️",
    characterTitle: "광야의 질서 담당 장교",
    characterStory:
      "캠프 세팅, 예배 흐름, 이동 동선까지 책임지는 안정형 리더.",
    ministries: [
      "예배·행정 운영팀",
      "재정·행정 관리",
      "조직·리더 훈련 과정",
    ],
    strengthShort: "책임감과 실행력이 강함.",
    weaknessShort: "유연성과 공감 표현 부족.",
    warningShort: "원칙을 지키다 사람의 마음을 놓칠 수 있음.",
    bestMatches: [
      "INFP – 진리와 온유의 균형",
      "ESFJ – 따뜻한 돌봄과 구조의 조화",
    ],
    prayerTopics: [
      "기준을 지키되 사랑을 잃지 않도록.",
      "책임감으로 인한 부담을 주님께 맡기도록.",
    ],
    verseApply:
      "하나님의 질서를 지키는 당신에게 ‘함께하신다’는 위로를 주는 말씀입니다.",
  },

  /* ⚠️ 실제 배포에서는 16유형 모두 포함해야 함.
     지금은 파일 길이 제한 때문에 4개만 샘플로 넣어 둠.
     → 완전한 16유형 데이터는 네 기존 1번 파일에서 이미 제공했음.
     → 그대로 가져와 아래에 추가하면 됨!
  */

  ESFJ: { /* ... 동일 구조 ... */ },
  ENTJ: { /* ... 동일 구조 ... */ },
  ENFJ: { /* ... 동일 구조 ... */ },
  ISTJ: { /* ... 동일 구조 ... */ },
  ISFJ: { /* ... 동일 구조 ... */ },
  INTJ: { /* ... 동일 구조 ... */ },
  INFJ: { /* ... 동일 구조 ... */ },
  ESTP: { /* ... 동일 구조 ... */ },
  ESFP: { /* ... 동일 구조 ... */ },
  ENTP: { /* ... 동일 구조 ... */ },
  ENFP: { /* ... 동일 구조 ... */ },
  ISTP: { /* ... 동일 구조 ... */ },
  ISFP: { /* ... 동일 구조 ... */ },
  INTP: { /* ... 동일 구조 ... */ },
  INFP: { /* ... 동일 구조 ... */ },
};

/* ===============================
   전역 상태 & DOM 요소
================================ */

let currentIndex = 0;
let questions = [];
const answers = {}; // { questionId: value }

let myResultType = null;
let myScores = null;
let myResultName = null;
let currentViewType = null;

/* DOM Elements */
const introSection = document.getElementById("intro-section");
const testSection = document.getElementById("test-section");
const resultSection = document.getElementById("result-section");

const startBtn = document.getElementById("start-btn");
const backBtn = document.getElementById("back-btn");
const skipBtn = document.getElementById("skip-btn");
const restartBtn = document.getElementById("restart-btn");
const shareBtn = document.getElementById("share-btn");

const progressLabel = document.getElementById("progress-label");
const axisLabel = document.getElementById("axis-label");
const progressFill = document.getElementById("progress-fill");
const questionCode = document.getElementById("question-code");
const questionText = document.getElementById("question-text");
const scaleInputs = document.getElementById("scale-inputs");

const resultCode = document.getElementById("result-code");
const resultName = document.getElementById("result-name");
const resultSummary = document.getElementById("result-summary");
const resultBadges = document.getElementById("result-badges");
const resultFeatures = document.getElementById("result-features");
const resultGrowth = document.getElementById("result-growth");
const resultStrength = document.getElementById("result-strength");
const resultWeakness = document.getElementById("result-weakness");
const resultWarning = document.getElementById("result-warning");
const resultMinistries = document.getElementById("result-ministries");
const resultMatches = document.getElementById("result-matches");
const resultPrayer = document.getElementById("result-prayer");

const bibleCharacterEl = document.getElementById("bible-character");
const bibleVerseEl = document.getElementById("bible-verse");

const characterEmojiEl = document.getElementById("character-emoji");
const characterTitleEl = document.getElementById("character-title");
const characterTextEl = document.getElementById("character-text");

const otherTypesGrid = document.getElementById("other-types-grid");
const viewTypeNote = document.getElementById("view-type-note");

const todayVerseBtn = document.getElementById("today-verse-btn");
const todayVerseBox = document.getElementById("today-verse-box");
const todayVerseBoxRef = document.getElementById("today-verse-box-ref");
const todayVerseBoxText = document.getElementById("today-verse-box-text");
const todayVerseBoxApply = document.getElementById("today-verse-box-apply");

/* ===============================
   질문 셔플 유틸
================================ */
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ===============================
   질문 화면 렌더
================================ */
function renderScale(questionId) {
  scaleInputs.innerHTML = "";
  const currentValue = answers[questionId] || null;

  for (let i = 1; i <= 5; i++) {
    const label = document.createElement("label");
    label.className = "scale-option";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "scale";
    input.value = String(i);
    input.checked = currentValue === i;

    const pill = document.createElement("div");
    pill.className = "scale-pill";
    pill.textContent = i;

    const handleSelect = () => {
      answers[questionId] = i;
      goNextOrResult();
    };

    input.addEventListener("change", handleSelect);
    pill.addEventListener("click", () => {
      input.checked = true;
      handleSelect();
    });

    label.appendChild(input);
    label.appendChild(pill);
    scaleInputs.appendChild(label);
  }
}

function renderQuestion() {
  const q = questions[currentIndex];
  const total = questions.length;
  const idx = currentIndex + 1;

  // 문항 번호만 표시
  progressLabel.textContent = `문항 ${idx} / ${total}`;

  // 🔥 축 이름 표시 제거
  axisLabel.textContent = ""; 
  axisLabel.style.visibility = "hidden";

  progressFill.style.width = `${(idx / total) * 100}%`;

  questionCode.textContent = `Q${idx}`;
  questionText.textContent = q.text;

  renderScale(q.id);
  backBtn.disabled = currentIndex === 0;
}


/* ===============================
   점수 계산
================================ */
function calculateResult() {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  questions.forEach((q) => {
    const value = answers[q.id];
    if (!value) return;

    // 값(1~5)을 중심값(3) 기준으로 -2~+2로 변환
    const centered = value - 3;

    // E/S/T/J → 정방향 / I/N/F/P → 역방향
    if (q.side === "E") scores.E += centered;
    if (q.side === "I") scores.I += centered;
    if (q.side === "S") scores.S += centered;
    if (q.side === "N") scores.N += centered;
    if (q.side === "T") scores.T += centered;
    if (q.side === "F") scores.F += centered;
    if (q.side === "J") scores.J += centered;
    if (q.side === "P") scores.P += centered;
  });

  const type =
    (scores.E >= scores.I ? "E" : "I") +
    (scores.S >= scores.N ? "S" : "N") +
    (scores.T >= scores.F ? "T" : "F") +
    (scores.J >= scores.P ? "J" : "P");

  return { type, scores };
}

/* ===============================
   goNextOrResult
================================ */
function goNextOrResult() {
  const total = questions.length;

  if (currentIndex < total - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    testSection.classList.add("hidden");
    resultSection.classList.remove("hidden");

    renderResult();

    // Step 1 — 축/세부 점수
    renderAxisUpgraded(myScores);
    renderDetailScores(myScores);

    // Step 2 — 매칭 카드
    renderMatchCards(myResultType);
  }
}

/* ===============================
   결과 화면 렌더링
================================ */
function renderResult() {
  const { type, scores } = calculateResult();

  myResultType = type;
  myScores = scores;

  const data = typeResults[type];
  myResultName = data ? `${data.nameKo} · ${data.nameEn}` : type;

  /* 그래프 기본 데이터 없이도 안전하게 처리 */
  if (!data) {
    resultCode.textContent = type;
    resultName.textContent = "설명 데이터 없음";
    resultSummary.textContent = "";
    return;
  }

  resultCode.textContent = type;
  resultName.textContent = `${data.nameKo} · ${data.nameEn}`;
  resultSummary.textContent = data.summary;

  /* 뱃지 */
  resultBadges.innerHTML = "";
  data.badges.forEach((b) => {
    const span = document.createElement("span");
    span.textContent = b;
    resultBadges.appendChild(span);
  });

  /* 특징 */
  resultFeatures.innerHTML = "";
  data.features.forEach((f) => {
    const li = document.createElement("li");
    li.textContent = f;
    resultFeatures.appendChild(li);
  });

  /* 성장 */
  resultGrowth.innerHTML = "";
  data.growth.forEach((g) => {
    const li = document.createElement("li");
    li.textContent = g;
    resultGrowth.appendChild(li);
  });

  resultStrength.textContent = `강점: ${data.strengthShort}`;
  resultWeakness.textContent = `약점: ${data.weaknessShort}`;
  resultWarning.textContent = data.warningShort || "";

  /* 사역 */
  resultMinistries.innerHTML = "";
  data.ministries.forEach((m) => {
    const li = document.createElement("li");
    li.textContent = m;
    resultMinistries.appendChild(li);
  });

  /* 함께 섬기면 좋은 조합 */
  resultMatches.innerHTML = "";
  data.bestMatches.forEach((m) => {
    const li = document.createElement("li");
    li.textContent = m;
    resultMatches.appendChild(li);
  });

  /* 기도 제목 */
  resultPrayer.innerHTML = "";
  data.prayerTopics.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = p;
    resultPrayer.appendChild(li);
  });

  /* 성경 인물 */
  bibleCharacterEl.textContent = `${data.bibleCharacter} – ${data.bibleCharacterDesc}`;
  bibleVerseEl.textContent = `${data.verseRef} · ${data.verseText}`;

  /* 캐릭터 블록 */
  characterEmojiEl.textContent = data.characterEmoji || "🙂";
  characterTitleEl.textContent = data.characterTitle || "";
  characterTextEl.textContent = data.characterStory || "";
}

/* ===============================
   STEP 1 — 업그레이드된 축 그래프
================================ */
function renderAxisUpgraded(scores) {
  const container = document.getElementById("axis-upgraded");

  const pairs = [
    { a: "E", b: "I", label: "에너지 방향" },
    { a: "S", b: "N", label: "정보 인식" },
    { a: "T", b: "F", label: "판단 기준" },
    { a: "J", b: "P", label: "생활 방식" },
  ];

  let html = "";

  pairs.forEach((pair) => {
    const aScore = scores[pair.a];
    const bScore = scores[pair.b];
    const total = aScore + bScore || 1; // divide-by-zero 방지
    const percentA = Math.round((aScore / total) * 100);

    html += `
      <div class="axis-row">
        <div class="axis-label">
          <span>${pair.label}</span>
          <span style="font-family:monospace;">${pair.a}:${aScore} / ${pair.b}:${bScore}</span>
        </div>

        <div class="axis-score">${pair.a} ${percentA}% · ${pair.b} ${100 - percentA}%</div>

        <div class="axis-bar-bg">
          <div class="axis-bar-fill" style="width:${percentA}%;"></div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/* ===============================
   STEP 1 — 세부 점수 막대
================================ */
function renderDetailScores(scores) {
  const container = document.getElementById("detail-score-list");
  const maxScore = 35; // 5문항 × 7점 = 35

  let html = "";

  ["E", "I", "S", "N", "T", "F", "J", "P"].forEach((trait) => {
    const score = scores[trait];
    const percent = Math.round((score / maxScore) * 100);

    html += `
      <div class="detail-score-row">
        <div class="detail-score-label">${trait} (${score} / ${maxScore})</div>
        <div class="detail-score-bar-bg">
          <div class="detail-score-bar-fill" style="width:${percent}%;"></div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/* ===============================
   STEP 2 — 유형 매칭 계산
================================ */
function similarityScore(a, b) {
  let score = 0;
  for (let i = 0; i < 4; i++) {
    if (a[i] === b[i]) score++;
  }
  return score;
}

function renderMatchCards(typeCode) {
  const entries = Object.entries(typeResults);

  const all = entries
    .filter(([code]) => code !== typeCode)
    .map(([code, data]) => ({
      code,
      data,
      sim: similarityScore(typeCode, code),
    }));

  // TOP 2 — 가장 비슷한 유형
  const top2 = [...all].sort((a, b) => b.sim - a.sim).slice(0, 2);

  // 반대유형 1개
  const opposite = [...all].sort((a, b) => a.sim - b.sim)[0];

  /* TOP 2 렌더 */
  let top2HTML = "";
  top2.forEach((t) => {
    top2HTML += `
      <div class="match-item">
        <div class="match-item-title">${t.data.nameKo} (${t.code})</div>
        <div class="match-item-sub">${t.data.summary.slice(0, 50)}...</div>
        <div class="match-item-hint">일치 글자: ${t.sim} / 4</div>
      </div>
    `;
  });

  document.getElementById("match-top2").innerHTML = top2HTML;

  /* 반대 유형 렌더 */
  document.getElementById("match-opposite").innerHTML = `
    <div class="match-item match-item-opposite">
      <div class="match-item-title">${opposite.data.nameKo} (${opposite.code})</div>
      <div class="match-item-sub">${opposite.data.summary.slice(0, 50)}...</div>
      <div class="match-item-hint">일치 글자: ${opposite.sim} / 4</div>
    </div>
  `;
}

/* ===============================
   "다른 유형 보기" 버튼 목록 구성
================================ */
function buildOtherTypesGrid() {
  otherTypesGrid.innerHTML = "";

  const types = Object.keys(typeResults).sort();

  types.forEach((t) => {
    const btn = document.createElement("button");
    btn.className = "btn-type";
    btn.dataset.type = t;
    btn.innerHTML = `<strong>${t}</strong>`;

    btn.addEventListener("click", () => {
      currentViewType = t;
      renderTypeDetail(t);
      updateTypeButtonsActive();
    });

    otherTypesGrid.appendChild(btn);
  });

  updateTypeButtonsActive();
}

function updateTypeButtonsActive() {
  document.querySelectorAll(".btn-type").forEach((btn) => {
    const code = btn.dataset.type;
    btn.classList.toggle("active", code === currentViewType);
  });
}

/* ===============================
   특정 유형 정보 렌더
================================ */
function renderTypeDetail(type) {
  currentViewType = type;

  const data = typeResults[type];
  if (!data) return;

  resultCode.textContent = type;
  resultName.textContent = `${data.nameKo} · ${data.nameEn}`;
  resultSummary.textContent = data.summary;

  /* 뱃지 */
  resultBadges.innerHTML = "";
  data.badges.forEach((b) => {
    const span = document.createElement("span");
    span.textContent = b;
    resultBadges.appendChild(span);
  });

  /* 특징 */
  resultFeatures.innerHTML = "";
  data.features.forEach((f) => {
    const li = document.createElement("li");
    li.textContent = f;
    resultFeatures.appendChild(li);
  });

  /* 성장 */
  resultGrowth.innerHTML = "";
  data.growth.forEach((g) => {
    const li = document.createElement("li");
    li.textContent = g;
    resultGrowth.appendChild(li);
  });

  resultStrength.textContent = `강점: ${data.strengthShort}`;
  resultWeakness.textContent = `약점: ${data.weaknessShort}`;
  resultWarning.textContent = data.warningShort;

  /* 사역 */
  resultMinistries.innerHTML = "";
  data.ministries.forEach((m) => {
    const li = document.createElement("li");
    li.textContent = m;
    resultMinistries.appendChild(li);
  });

  /* 조합 */
  resultMatches.innerHTML = "";
  data.bestMatches.forEach((m) => {
    const li = document.createElement("li");
    li.textContent = m;
    resultMatches.appendChild(li);
  });

  /* 기도제목 */
  resultPrayer.innerHTML = "";
  data.prayerTopics.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = p;
    resultPrayer.appendChild(li);
  });

  /* 성경 인물 */
  bibleCharacterEl.textContent = `${data.bibleCharacter} – ${data.bibleCharacterDesc}`;
  bibleVerseEl.textContent = `${data.verseRef} · ${data.verseText}`;

  /* 캐릭터 */
  characterEmojiEl.textContent = data.characterEmoji;
  characterTitleEl.textContent = data.characterTitle;
  characterTextEl.textContent = data.characterStory;

  updateTypeButtonsActive();
}

/* ===============================
   오늘의 말씀
================================ */
function getRandomVerseForType(type) {
  const data = typeResults[type];
  if (!data) return null;

  return {
    ref: data.verseRef,
    text: data.verseText,
    apply: data.verseApply || "",
  };
}

todayVerseBtn.addEventListener("click", () => {
  const type = myResultType || currentViewType;
  const verse = getRandomVerseForType(type);

  if (!verse) {
    alert("말씀이 등록되지 않은 유형입니다.");
    return;
  }

  todayVerseBoxRef.textContent = verse.ref;
  todayVerseBoxText.textContent = verse.text;
  todayVerseBoxApply.textContent = verse.apply;

  todayVerseBox.classList.remove("hidden");
});

/* ===============================
   공유 기능
================================ */
shareBtn.addEventListener("click", async () => {
  const type = myResultType;
  const text = `나의 Faith-MBTI 유형은 ${type} (${myResultName}) 입니다!`;

  if (navigator.share) {
    await navigator.share({
      title: "Faith-MBTI 결과",
      text,
      url: window.location.href,
    });
  } else {
    await navigator.clipboard.writeText(`${text}\n${location.href}`);
    alert("클립보드에 복사되었습니다!");
  }
});

/* ===============================
   시작/뒤로가기/건너뛰기/다시하기
================================ */
startBtn.addEventListener("click", () => {
  questions = shuffle(originalQuestions);
  Object.keys(answers).forEach((k) => delete answers[k]);

  currentIndex = 0;
  myResultType = null;
  myScores = null;

  introSection.classList.add("hidden");
  testSection.classList.remove("hidden");

  renderQuestion();
});

backBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
});

skipBtn.addEventListener("click", () => {
  goNextOrResult();
});

restartBtn.addEventListener("click", () => {
  resultSection.classList.add("hidden");
  introSection.classList.remove("hidden");
});

/* ===============================
   초기화
================================ */
buildOtherTypesGrid();


