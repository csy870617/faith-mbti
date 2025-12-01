/**************************************************
 * Faith-MBTI Test – app.js (Final Integrated Version)
 **************************************************/

/* 1. 전역 상태 및 DOM 캐싱 */
let currentIndex = 0;
let questions = []; 
const answers = {};
let myResultType = null;
let currentViewType = null;
let currentChurchMembers = []; 

// DOM 요소 캐싱
const dom = {
  sections: {
    intro: document.getElementById("intro-section"),
    test: document.getElementById("test-section"),
    result: document.getElementById("result-section"),
    church: document.getElementById("church-section")
  },
  btns: {
    start: document.getElementById("start-btn"),
    back: document.getElementById("back-btn"),
    skip: document.getElementById("skip-btn"),
    restart: document.getElementById("restart-btn"),
    share: document.getElementById("share-btn"),
    goResult: document.getElementById("go-result-btn"),
    bibleToggle: document.getElementById("bible-toggle-btn"),
    todayVerse: document.getElementById("today-verse-btn"),
    church: document.getElementById("church-btn"),
    churchClose: document.getElementById("church-close-btn"),
    memberSave: document.getElementById("member-save-btn"),
    churchSummary: document.getElementById("church-summary-btn"),
    churchAnalysis: document.getElementById("church-analysis-btn"), 
    invite: document.getElementById("invite-btn"),
    churchCopy: document.getElementById("church-copy-btn"),
    fontUp: document.getElementById("font-up"),
    fontDown: document.getElementById("font-down"),
    fontReset: document.getElementById("font-reset")
  },
  progress: {
    label: document.getElementById("progress-label"),
    fill: document.getElementById("progress-fill")
  },
  question: {
    code: document.getElementById("question-code"),
    text: document.getElementById("question-text"),
    inputs: document.getElementById("scale-inputs")
  },
  result: {
    code: document.getElementById("result-code"),
    name: document.getElementById("result-name"),
    summary: document.getElementById("result-summary"),
    badges: document.getElementById("result-badges"),
    features: document.getElementById("result-features"),
    growth: document.getElementById("result-growth"),
    strength: document.getElementById("result-strength"),
    weakness: document.getElementById("result-weakness"),
    warning: document.getElementById("result-warning"),
    ministries: document.getElementById("result-ministries"),
    axis: document.getElementById("axis-upgraded"),
    detail: document.getElementById("detail-score-list"),
    matchTop2: document.getElementById("match-top2"),
    matchOpposite: document.getElementById("match-opposite"),
    otherTypes: document.getElementById("other-types-grid")
  },
  bible: {
    charEl: document.getElementById("bible-character"),
    verseEl: document.getElementById("bible-verse"),
    box: document.getElementById("bible-box")
  },
  character: {
    emoji: document.getElementById("character-emoji"),
    title: document.getElementById("character-title"),
    text: document.getElementById("character-text")
  },
  verse: {
    box: document.getElementById("today-verse-box"),
    ref: document.getElementById("today-verse-box-ref"),
    text: document.getElementById("today-verse-box-text"),
    apply: document.getElementById("today-verse-box-apply")
  },
  inputs: {
    memberName: document.getElementById("member-name-input"),
    memberChurch: document.getElementById("member-church-input"),
    memberPw: document.getElementById("member-password-input"),
    viewChurch: document.getElementById("view-church-input"),
    viewPw: document.getElementById("view-password-input"),
    rememberCreds: document.getElementById("remember-creds-input")
  },
  churchList: document.getElementById("church-result-list"),
  churchAnalysisResult: document.getElementById("church-analysis-result"),
  churchViewToggle: document.getElementById("church-view-toggle"),
  churchViewContent: document.getElementById("church-view-content")
};

/* 2. 유틸리티 */
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* 3. 렌더링 로직 */
function renderScale(questionId) {
  if (!dom.question.inputs) return;
  const container = dom.question.inputs;
  container.innerHTML = "";
  
  const fragment = document.createDocumentFragment();
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
    fragment.appendChild(label);
  }
  container.appendChild(fragment);
}

function renderQuestion() {
  const q = questions[currentIndex];
  const idx = currentIndex + 1;
  const total = questions.length;

  if (dom.progress.label) dom.progress.label.textContent = `문항 ${idx} / ${total}`;
  if (dom.progress.fill) dom.progress.fill.style.width = `${(idx / total) * 100}%`;

  if (dom.question.code) dom.question.code.textContent = `Q${idx}`;
  if (dom.question.text) dom.question.text.textContent = q.text;

  renderScale(q.id);
  
  if (dom.btns.back) dom.btns.back.disabled = false; 
}

function calculateResult() {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  const axisScores = { EI: 0, SN: 0, TF: 0, JP: 0 };

  window.originalQuestions.forEach((q) => {
    const v = answers[q.id];
    if (!v) return;

    scores[q.side] += v;
    const centered = v - 3;

    if (q.axis === "EI") axisScores.EI += q.side === "E" ? centered : -centered;
    else if (q.axis === "SN") axisScores.SN += q.side === "S" ? centered : -centered;
    else if (q.axis === "TF") axisScores.TF += q.side === "T" ? centered : -centered;
    else if (q.axis === "JP") axisScores.JP += q.side === "J" ? centered : -centered;
  });

  const type =
    (axisScores.EI >= 0 ? "E" : "I") +
    (axisScores.SN >= 0 ? "S" : "N") +
    (axisScores.TF >= 0 ? "T" : "F") +
    (axisScores.JP >= 0 ? "J" : "P");

  return { type, scores, axisScores };
}

function goNextOrResult() {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    dom.sections.test.classList.add("hidden");
    dom.sections.result.classList.remove("hidden");

    const { type, scores, axisScores } = calculateResult();
    
    // 결과 로컬스토리지 저장
    const resultData = {
      type: type,
      scores: scores,
      axisScores: axisScores,
      date: new Date().getTime()
    };
    localStorage.setItem('faith_result_v1', JSON.stringify(resultData));

    myResultType = type;
    currentViewType = type;

    renderResult(type);
    renderAxisUpgraded(axisScores);
    renderDetailScores(scores);
    renderMatchCards(type);
    buildOtherTypesGrid();
  }
}

function renderResult(type) {
  if (!window.typeResults) return;
  const data = window.typeResults[type];

  if (dom.result.code) dom.result.code.textContent = type;
  if (dom.result.name) dom.result.name.textContent = `${data.nameKo} · ${data.nameEn}`;
  if (dom.result.summary) dom.result.summary.textContent = data.summary;

  if (dom.result.badges) {
    dom.result.badges.innerHTML = "";
    data.badges.forEach(b => {
      const span = document.createElement("span");
      span.className = "badge";
      span.textContent = b;
      dom.result.badges.appendChild(span);
    });
  }

  const renderList = (el, items) => {
    if (!el) return;
    el.innerHTML = "";
    items.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      el.appendChild(li);
    });
  };

  renderList(dom.result.features, data.features);
  renderList(dom.result.growth, data.growth);
  renderList(dom.result.ministries, data.ministries);

  if (dom.result.strength) dom.result.strength.textContent = `강점: ${data.strengthShort}`;
  if (dom.result.weakness) dom.result.weakness.textContent = `약점: ${data.weaknessShort}`;
  if (dom.result.warning) dom.result.warning.textContent = data.warningShort;

  if (dom.bible.charEl) dom.bible.charEl.textContent = `${data.bibleCharacter} – ${data.bibleCharacterDesc}`;
  if (dom.bible.verseEl) dom.bible.verseEl.textContent = `${data.verseRef} ${data.verseText}`;
  if (dom.bible.box) dom.bible.box.classList.add("hidden");
  if (dom.btns.bibleToggle) dom.btns.bibleToggle.textContent = "📖 성경 인물 보기";
  
  if (dom.verse.box) dom.verse.box.classList.add("hidden");

  if (dom.character.emoji) dom.character.emoji.textContent = data.characterEmoji;
  if (dom.character.title) dom.character.title.textContent = data.characterTitle;
  if (dom.character.text) dom.character.text.textContent = data.characterStory;
}

function renderAxisUpgraded(axisScores) {
  if (!dom.result.axis) return;
  const defs = [
    { key: "EI", left: "E", right: "I", label: "에너지 방향" },
    { key: "SN", left: "S", right: "N", label: "정보 인식" },
    { key: "TF", left: "T", right: "F", label: "판단 기준" },
    { key: "JP", left: "J", right: "P", label: "생활 방식" }
  ];
  const MAX = 20;
  
  let html = "";
  defs.forEach(d => {
    const v = axisScores[d.key] || 0;
    let leftPercent = Math.max(0, Math.min(100, Math.round(50 + (v / (2 * MAX)) * 100)));
    const rightPercent = 100 - leftPercent;

    html += `
      <div class="axis-row">
        <div class="axis-label">
          <span>${d.label}</span>
          <span class="axis-sub-label">${d.left} ${leftPercent}% · ${d.right} ${rightPercent}%</span>
        </div>
        <div class="axis-bar-bg"><div class="axis-bar-fill" style="width:${leftPercent}%"></div></div>
      </div>`;
  });
  dom.result.axis.innerHTML = html;
}

function renderDetailScores(scores) {
  if (!dom.result.detail) return;
  const maxScore = 25;
  let html = "";
  ["E", "I", "S", "N", "T", "F", "J", "P"].forEach(k => {
    const v = scores[k] || 0;
    const percent = Math.min(100, Math.round((v / maxScore) * 100));
    html += `
      <div class="detail-score-row">
        <div class="detail-score-label">${k} (${v})</div>
        <div class="detail-score-bar-bg"><div class="detail-score-bar-fill" style="width:${percent}%"></div></div>
      </div>`;
  });
  dom.result.detail.innerHTML = html;
}

function similarityScore(a, b) {
  let s = 0;
  for (let i = 0; i < 4; i++) if (a[i] === b[i]) s++;
  return s;
}

function renderMatchCards(type) {
  const entries = Object.entries(window.typeResults);
  const all = entries
    .filter(([code]) => code !== type)
    .map(([code, data]) => ({ code, data, sim: similarityScore(type, code) }));

  const top2 = [...all].sort((a, b) => b.sim - a.sim).slice(0, 2);
  const opposite = [...all].sort((a, b) => a.sim - b.sim)[0];

  if (dom.result.matchTop2) {
    dom.result.matchTop2.innerHTML = top2.map(t => `
      <div class="match-item">
        <div class="match-item-title">${t.data.nameKo} (${t.code})</div>
        <div class="match-item-sub">${t.data.strengthShort}</div>
      </div>`).join('');
  }

  if (dom.result.matchOpposite) {
    dom.result.matchOpposite.innerHTML = `
      <div class="match-item match-item-opposite">
        <div class="match-item-title">${opposite.data.nameKo} (${opposite.code})</div>
        <div class="match-item-sub">${opposite.data.strengthShort}</div>
      </div>`;
  }
}

function buildOtherTypesGrid() {
  if (!dom.result.otherTypes) return;
  dom.result.otherTypes.innerHTML = "";
  Object.keys(window.typeResults).sort().forEach(t => {
    const btn = document.createElement("button");
    btn.className = "btn-type";
    btn.dataset.type = t;
    btn.innerHTML = `<strong>${t}</strong>`;
    btn.addEventListener("click", () => {
      currentViewType = t;
      renderResult(t);
      renderMatchCards(t);
      updateTypeButtonsActive();
    });
    dom.result.otherTypes.appendChild(btn);
  });
  updateTypeButtonsActive();
}

function updateTypeButtonsActive() {
  document.querySelectorAll(".btn-type").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.type === currentViewType);
  });
}

/* 4. 이벤트 핸들러 (모든 버튼에 안전장치 추가) */

if (dom.btns.todayVerse) {
  dom.btns.todayVerse.addEventListener("click", () => {
    const type = currentViewType || myResultType;
    if (!type) return;
    const data = window.typeResults[type];
    dom.verse.ref.textContent = data.verseRef;
    dom.verse.text.textContent = data.verseText;
    dom.verse.apply.textContent = data.verseApply || "";
    dom.verse.box.classList.toggle("hidden");
  });
}

if (dom.btns.bibleToggle) {
  dom.btns.bibleToggle.addEventListener("click", () => {
    const isHidden = dom.bible.box.classList.contains("hidden");
    dom.bible.box.classList.toggle("hidden");
    dom.btns.bibleToggle.textContent = isHidden ? "📖 성경 인물 닫기" : "📖 성경 인물 보기";
  });
}

// 공유하기
if (dom.btns.share) {
  dom.btns.share.addEventListener("click", async () => {
    const targetType = myResultType || currentViewType;

    if (!targetType) return alert("먼저 검사를 완료하거나, 공유할 유형을 선택해 주세요.");
    
    const baseUrl = "https://faiths.life/";
    const data = window.typeResults[targetType];
    
    const shareTitle = "FAITH MBTI 신앙 유형 테스트";
    const shareDesc = `나의 유형은 ${targetType} (${data.nameKo}) 입니다.`;

    if (typeof Kakao !== "undefined" && Kakao.isInitialized && Kakao.isInitialized()) {
      try {
        Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: shareTitle,
            description: shareDesc,
            imageUrl: "https://csy870617.github.io/faith-mbti/images/thumbnail.jpg",
            link: { mobileWebUrl: baseUrl, webUrl: baseUrl },
          },
          buttons: [{ title: "테스트 하러가기", link: { mobileWebUrl: baseUrl, webUrl: baseUrl } }]
        });
        return; 
      } catch (e) { console.error(e); }
    }
    
    if (navigator.share) {
      try { 
        await navigator.share({ 
          title: shareTitle, 
          text: shareDesc, 
          url: baseUrl 
        }); 
        return; 
      } catch(e) {}
    }
    
    try { 
      await navigator.clipboard.writeText(`${shareTitle}\n${shareDesc}\n${baseUrl}`); 
      alert("결과가 클립보드에 복사되었습니다."); 
    }
    catch (e) { alert("공유 기능을 사용할 수 없습니다."); }
  });
}

// 시작 버튼
if (dom.btns.start) {
  dom.btns.start.addEventListener("click", () => {
    localStorage.removeItem('faith_result_v1');
    if (!window.originalQuestions) {
        alert("데이터를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
        return;
    }
    questions = shuffle(window.originalQuestions);
    for (let k in answers) delete answers[k];
    currentIndex = 0;
    myResultType = null;
    currentViewType = null;

    dom.verse.box.classList.add("hidden");
    dom.bible.box.classList.add("hidden");
    dom.sections.intro.classList.add("hidden");
    dom.sections.test.classList.remove("hidden");
    dom.sections.result.classList.add("hidden");

    renderQuestion();
  });
}

// 이전 버튼
if (dom.btns.back) {
  dom.btns.back.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion();
    } else {
      dom.sections.test.classList.add("hidden");
      dom.sections.intro.classList.remove("hidden");
    }
  });
}

if (dom.btns.skip) {
  dom.btns.skip.addEventListener("click", goNextOrResult);
}

// 처음으로 버튼
if (dom.btns.restart) {
  dom.btns.restart.addEventListener("click", () => {
    if(confirm("결과가 초기화됩니다. 처음 화면으로 돌아가시겠습니까?")) {
      localStorage.removeItem('faith_result_v1');
      myResultType = null;
      currentViewType = null;
      dom.sections.result.classList.add("hidden");
      dom.sections.intro.classList.remove("hidden");
    }
  });
}

// 개발용 버튼
if (dom.btns.goResult) {
  dom.btns.goResult.addEventListener("click", () => {
    localStorage.removeItem('faith_result_v1');
    myResultType = null;
    
    if (!window.originalQuestions) return;
    currentViewType = "ENFJ";
    
    const dummyScores = { E: 20, I: 5, S: 20, N: 5, T: 20, F: 5, J: 20, P: 5 };
    const dummyAxis = { EI: 15, SN: 15, TF: 15, JP: 15 };

    dom.sections.intro.classList.add("hidden");
    dom.sections.test.classList.add("hidden");
    dom.sections.result.classList.remove("hidden");

    renderResult("ENFJ");
    renderAxisUpgraded(dummyAxis);
    renderDetailScores(dummyScores);
    renderMatchCards("ENFJ");
    buildOtherTypesGrid();
  });
}

/* 5. Firebase & 우리교회 */
const CHURCH_COLLECTION = "faith_churches";
let _firebaseDb = null, _firebaseFsModule = null;

async function ensureFirebase() {
  if (_firebaseDb && _firebaseFsModule) return { db: _firebaseDb, fs: _firebaseFsModule };
  const appMod = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
  const fsMod = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");
  const app = appMod.initializeApp({
    apiKey: "AIzaSyDAigdc0C7zzzOySBTFb527eeAN3jInIfQ",
    authDomain: "faith-mbti.firebaseapp.com",
    projectId: "faith-mbti",
    storageBucket: "faith-mbti.firebasestorage.app",
    messagingSenderId: "1065834838710",
    appId: "1:1065834838710:web:33382f9a82f94d112e8417",
    measurementId: "G-RWMSVFRMRP"
  });
  return { db: (_firebaseDb = fsMod.getFirestore(app)), fs: (_firebaseFsModule = fsMod) };
}

async function saveMyResultToChurch(name, churchName, password) {
  const n = name.trim(), c = churchName.trim(), p = password.trim();
  if (!n || !c || !p) throw new Error("모든 항목을 입력해 주세요.");

  const targetType = currentViewType || myResultType;
  if (!targetType) throw new Error("먼저 검사를 완료하거나, '다른 유형 보기'에서 내 유형을 선택해 주세요.");

  const { db, fs } = await ensureFirebase();
  const churchRef = fs.doc(db, CHURCH_COLLECTION, c);
  const snap = await fs.getDoc(churchRef);

  if (snap.exists() && snap.data().password !== p) throw new Error("비밀번호가 일치하지 않습니다.");
  if (!snap.exists()) await fs.setDoc(churchRef, { churchName: c, password: p, createdAt: fs.serverTimestamp ? fs.serverTimestamp() : Date.now() });

  const data = window.typeResults[targetType];
  await fs.addDoc(fs.collection(churchRef, "members"), {
    name: n, 
    type: targetType, 
    shortText: data.summary || data.nameKo || "",
    createdAt: fs.serverTimestamp ? fs.serverTimestamp() : Date.now()
  });
}

async function loadChurchMembers(churchName, password) {
  const c = churchName.trim(), p = password.trim();
  if (!c || !p) throw new Error("정보를 모두 입력해 주세요.");

  const { db, fs } = await ensureFirebase();
  const churchRef = fs.doc(db, CHURCH_COLLECTION, c);
  const snap = await fs.getDoc(churchRef);

  if (!snap.exists()) throw new Error("등록된 교회가 없습니다.");
  if (snap.data().password !== p) throw new Error("비밀번호가 일치하지 않습니다.");

  const q = fs.query(fs.collection(churchRef, "members"), fs.orderBy("createdAt", "asc"));
  const membersSnap = await fs.getDocs(q);
  
  const membersData = membersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  currentChurchMembers = membersData;

  return { churchName: snap.data().churchName || c, members: membersData };
}

async function deleteChurchMember(churchName, password, memberId) {
  const { db, fs } = await ensureFirebase();
  const churchRef = fs.doc(db, CHURCH_COLLECTION, churchName.trim());
  const snap = await fs.getDoc(churchRef);
  
  if (!snap.exists() || snap.data().password !== password.trim()) throw new Error("권한이 없습니다.");
  await fs.deleteDoc(fs.doc(fs.collection(churchRef, "members"), memberId));
}

// [수정됨] 결과 리스트 렌더링 (강점 요약 데이터 사용)
function renderChurchList(churchName, members) {
  if (!dom.churchList) return;
  if (!members || !members.length) {
    dom.churchList.innerHTML = `<div class="result-card"><p class="gray">저장된 결과가 없습니다.</p></div>`;
    return;
  }
  const rows = members.map(m => {
    // 저장된 데이터가 없거나 텍스트일 경우를 대비해, 실시간 강점 데이터 사용
    const typeData = window.typeResults[m.type];
    const desc = typeData ? typeData.strengthShort : (m.shortText || "");
    
    return `
    <tr>
      <td>${m.name || ""}</td><td>${m.type || ""}</td><td>${desc}</td>
      <td><button class="btn-secondary member-delete-btn" data-id="${m.id}" data-church="${churchName}">삭제</button></td>
    </tr>`;
  }).join('');
    
  dom.churchList.innerHTML = `
    <div class="result-card"><div class="card-title">🏠 ${churchName}</div>
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
          <thead><tr style="border-bottom:1px solid #e5e7eb;"><th>이름</th><th>유형</th><th>설명</th><th>관리</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;

  dom.churchList.querySelectorAll(".member-delete-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const pw = prompt("우리교회 비밀번호를 입력해 주세요.");
      if (!pw) return;
      try {
        await deleteChurchMember(btn.dataset.church, pw, btn.dataset.id);
        alert("삭제되었습니다.");
        const { members: refreshed } = await loadChurchMembers(btn.dataset.church, pw);
        renderChurchList(btn.dataset.church, refreshed);
      } catch (e) { alert(e.message); }
    });
  });
}

/* =========================================
   [업그레이드됨] 공동체 분석 로직
   ========================================= */

function analyzeAndRenderCommunity() {
  const members = currentChurchMembers;
  if (!members || members.length === 0) {
    alert("먼저 [공동체 유형 확인] 버튼을 눌러 데이터를 불러와 주세요.");
    return;
  }

  const total = members.length;
  // 각 축별 카운트
  const counts = { E:0, I:0, S:0, N:0, T:0, F:0, J:0, P:0 };
  const typeCounts = {};

  members.forEach(m => {
    const t = m.type; 
    if (!t || t.length !== 4) return;
    counts[t[0]]++; counts[t[1]]++; counts[t[2]]++; counts[t[3]]++;
    typeCounts[t] = (typeCounts[t] || 0) + 1;
  });

  // 1. 최다 유형 찾기
  let maxType = "", maxVal = 0;
  for (const [t, v] of Object.entries(typeCounts)) {
    if (v > maxVal) { maxVal = v; maxType = t; }
  }
  
  // 2. 대표 성향 결정 (동률일 경우 시스템상 앞쪽 알파벳 선택하되, 밸런스 체크)
  const domE = counts.E >= counts.I ? "E" : "I";
  const domS = counts.S >= counts.N ? "S" : "N";
  const domT = counts.T >= counts.F ? "T" : "F";
  const domJ = counts.J >= counts.P ? "J" : "P";
  
  // 대표 유형 코드 (이미지/타이틀용)
  const groupType = domE + domS + domT + domJ; 
  const topTypeName = window.typeResults[groupType] ? window.typeResults[groupType].nameKo : groupType;

  // 3. HTML 생성
  let html = `
    <div class="analysis-box">
      <div class="analysis-header">📊 우리 공동체 영적 DNA</div>
      
      <div class="analysis-summary-grid">
        <div class="summary-item">
          <div class="summary-val">${total}명</div>
          <div class="summary-label">분석 인원</div>
        </div>
        <div class="summary-item">
          <div class="summary-val">${maxType}</div>
          <div class="summary-label">최다 유형 (${maxVal}명)</div>
        </div>
      </div>

      <div class="insight-text" style="text-align:center; margin-top:16px;">
        우리의 대표 성향은 <span class="insight-highlight">${topTypeName}</span> 입니다.<br/>
        <span style="font-size:0.85rem; color:#6b7280; font-weight:400;">
          (전체 비율을 합산하여 도출된 결과입니다)
        </span>
      </div>
    </div>

    <div class="analysis-box">
      <div class="analysis-header">⚖️ 에너지 균형 (Energy Balance)</div>
      ${renderBarEnhanced("관계 에너지", "외향 (E)", counts.E, "내향 (I)", counts.I, total)}
      ${renderBarEnhanced("인식 스타일", "현실 (S)", counts.S, "이상 (N)", counts.N, total)}
      ${renderBarEnhanced("판단 기준", "이성 (T)", counts.T, "감성 (F)", counts.F, total)}
      ${renderBarEnhanced("생활 패턴", "계획 (J)", counts.J, "유연 (P)", counts.P, total)}
    </div>

    <div class="analysis-box">
      <div class="analysis-section-title">🗣️ 우리 공동체의 모임 스타일</div>
      <div class="meeting-style-box">
        ${getMeetingStyle(counts, total)}
      </div>
    </div>

    <div class="analysis-box">
      <div class="analysis-section-title">💎 놓치지 말아야 할 '숨은 보석'</div>
      <div class="minority-box">
        ${getMinorityCare(counts, total)}
      </div>
    </div>

    <button id="close-analysis-btn" class="close-analysis-btn">분석 결과 닫기 ✖</button>
  `;

  if (dom.churchAnalysisResult) {
    dom.churchAnalysisResult.innerHTML = html;
    dom.churchAnalysisResult.classList.remove("hidden");
    
    // 닫기 버튼 클릭 시 스크롤을 다시 위로 살짝 올려줌
    document.getElementById("close-analysis-btn").addEventListener("click", () => {
      dom.churchAnalysisResult.classList.add("hidden");
      dom.btns.churchSummary.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
}

// [개선됨] 막대 그래프 + 밸런스 배지 표시 함수
function renderBarEnhanced(title, leftLabel, leftVal, rightLabel, rightVal, total) {
  const leftPct = Math.round((leftVal / total) * 100);
  const rightPct = 100 - leftPct;
  
  // 동률 또는 밸런스 체크 (차이가 10% 미만이면 밸런스 좋음)
  const gap = Math.abs(leftPct - rightPct);
  let badgeHtml = "";
  
  if (leftVal === rightVal) {
    badgeHtml = `<span class="balance-badge badge-balanced">완벽한 균형 ✨</span>`;
  } else if (gap < 15) {
    badgeHtml = `<span class="balance-badge badge-balanced">황금 밸런스 ⚖️</span>`;
  }

  // 막대 색상: 우세한 쪽을 진하게
  const leftColor = leftPct >= rightPct ? "#8b5cf6" : "#ddd6fe";
  const rightColor = rightPct > leftPct ? "#8b5cf6" : "#ddd6fe"; // 오른쪽이 더 크면 진하게

  return `
    <div style="margin-bottom:16px;">
      <div class="analysis-label-row">
        <span>${title} ${badgeHtml}</span>
      </div>
      <div class="analysis-bar-container">
        <div style="width:${leftPct}%; background:${leftColor}; height:100%; transition: width 1s;"></div>
        <div style="width:${rightPct}%; background:${rightColor}; height:100%; transition: width 1s;"></div>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:#6b7280; margin-top:4px;">
        <span>${leftLabel} <strong>${leftVal}명</strong> (${leftPct}%)</span>
        <span>${rightLabel} <strong>${rightVal}명</strong> (${rightPct}%)</span>
      </div>
    </div>
  `;
}

// [신규] 모임/회의 스타일 분석 로직
function getMeetingStyle(c, total) {
  let text = "";

  // E vs I
  if (c.E > c.I * 1.5) text += "🎤 <strong>활기차고 에너지가 넘쳐요.</strong> 누군가 먼저 말을 꺼내고 분위기를 주도하는 것이 자연스럽습니다. 다만 목소리 큰 사람 위주로 흘러가지 않도록 주의하세요.<br/><br/>";
  else if (c.I > c.E * 1.5) text += "☕ <strong>차분하고 깊이가 있어요.</strong> 왁자지껄하기보다 소그룹으로 깊게 나누는 것을 선호합니다. 침묵을 어색해하지 마세요.<br/><br/>";
  else text += "✨ <strong>역동과 정적인 분위기가 조화로워요.</strong> 상황에 따라 활발하게, 때로는 진지하게 모임을 이끌 수 있는 건강한 모임입니다.<br/><br/>";

  // J vs P
  if (c.J > c.P * 1.5) text += "📅 <strong>계획대로 착착!</strong> 시작과 끝 시간이 명확하고, 정해진 순서대로 진행되는 것을 좋아합니다. 돌발 상황에는 당황할 수 있어요.";
  else if (c.P > c.J * 1.5) text += "🌊 <strong>그때그때 유연하게!</strong> 순서가 바뀌거나 새로운 나눔이 길어져도 즐겁게 받아들입니다. 하지만 결론 없이 끝날 수도 있으니 마무리를 챙겨주세요.";
  else text += "🤝 <strong>계획과 유연함의 조화!</strong> 큰 틀은 지키되 상황에 맞춰 융통성을 발휘할 줄 아는 성숙한 모임입니다.";

  return text;
}

// [신규] 소수자(Minority) 케어 가이드
function getMinorityCare(c, total) {
  const minorities = [];
  const threshold = total * 0.3; // 30% 미만이면 소수자로 간주

  if (c.I < threshold && c.I > 0) minorities.push("🤫 <strong>내향형(I) 지체들:</strong> 에너지가 너무 높은 모임에서 기가 빨릴 수 있어요. 'OO님 생각은 어때요?'라고 부드럽게 물어봐 주고, 생각할 시간을 주세요.");
  if (c.E < threshold && c.E > 0) minorities.push("📣 <strong>외향형(E) 지체들:</strong> 너무 차분한 분위기를 답답해할 수 있어요. 가끔은 야외 활동이나 액티비티로 에너지를 발산할 기회를 주세요.");
  if (c.S < threshold && c.S > 0) minorities.push("👀 <strong>현실형(S) 지체들:</strong> 뜬구름 잡는 비전 나눔보다 '이번 주에 당장 무엇을 할지' 구체적인 적용점을 나눌 때 살아납니다.");
  if (c.N < threshold && c.N > 0) minorities.push("🌈 <strong>직관형(N) 지체들:</strong> 반복되는 일상 나눔을 지루해할 수 있어요. '우리 공동체의 꿈'이나 '하나님 나라' 같은 깊은 주제를 던져주세요.");
  if (c.F < threshold && c.F > 0) minorities.push("💖 <strong>감정형(F) 지체들:</strong> 일 처리보다 '서로의 마음'을 확인받고 싶어 해요. 회의 전에 충분한 아이스브레이킹과 공감의 시간을 가져주세요.");
  if (c.T < threshold && c.T > 0) minorities.push("🤔 <strong>사고형(T) 지체들:</strong> 감정적인 호소만으로는 설득되지 않아요. '왜 해야 하는지' 논리적인 이유와 목적을 설명해 주세요.");

  if (minorities.length === 0) {
    return "⚖️ <strong>모든 성향이 골고루 섞여 있어요!</strong><br/>한쪽으로 치우치지 않은 건강한 구성입니다. 서로 다른 은사를 가진 지체들이 협력하여 큰 시너지를 낼 수 있습니다.";
  }

  return minorities.join("<br/><br/>");
}

/* -----------------------------------------------------------
   나머지 기존 하단 코드들 (이벤트 리스너 등)은 그대로 유지합니다.
   아래 내용은 기존 app.js의 하단부와 동일합니다.
   ----------------------------------------------------------- */

// 교회 섹션 이벤트
if (dom.btns.church && dom.sections.church) {
  dom.btns.church.addEventListener("click", () => {
    dom.sections.intro.classList.add("hidden");
    dom.sections.test.classList.add("hidden");
    dom.sections.result.classList.add("hidden");
    dom.sections.church.classList.remove("hidden");
  });
}

if (dom.btns.churchClose) {
  dom.btns.churchClose.addEventListener("click", () => {
    dom.sections.church.classList.add("hidden");
    dom.sections.result.classList.remove("hidden");
  });
}

if (dom.btns.memberSave) {
  dom.btns.memberSave.addEventListener("click", async () => {
    try {
      await saveMyResultToChurch(dom.inputs.memberName.value, dom.inputs.memberChurch.value, dom.inputs.memberPw.value);
      alert("저장되었습니다.");
      dom.inputs.memberName.value = "";
    } catch (e) { alert(e.message); }
  });
}

if (dom.btns.churchSummary) {
  dom.btns.churchSummary.addEventListener("click", async () => {
    if (dom.inputs.rememberCreds && dom.inputs.rememberCreds.checked) {
      localStorage.setItem('faith_church_name', dom.inputs.viewChurch.value);
      localStorage.setItem('faith_church_pw', dom.inputs.viewPw.value);
    } else {
      localStorage.removeItem('faith_church_name');
      localStorage.removeItem('faith_church_pw');
    }

    try {
      const { churchName, members } = await loadChurchMembers(dom.inputs.viewChurch.value, dom.inputs.viewPw.value);
      renderChurchList(churchName, members);
      if (dom.btns.churchCopy) dom.btns.churchCopy.classList.remove("hidden");
    } catch (e) { alert(e.message); }
  });
}

if (dom.btns.churchAnalysis) {
  dom.btns.churchAnalysis.addEventListener("click", analyzeAndRenderCommunity);
}

// 모아보기 토글
if (dom.churchViewToggle && dom.churchViewContent) {
  dom.churchViewToggle.addEventListener("click", () => {
    const isHidden = dom.churchViewContent.classList.contains("hidden");
    if (isHidden) {
      dom.churchViewContent.classList.remove("hidden");
      dom.churchViewToggle.querySelector("h3").innerText = "우리교회 신앙 유형 모아보기 ▲";
    } else {
      dom.churchViewContent.classList.add("hidden");
      dom.churchViewToggle.querySelector("h3").innerText = "우리교회 신앙 유형 모아보기 ▼";
    }
  });
}

if (dom.btns.invite) {
  dom.btns.invite.addEventListener("click", async () => {
    const baseUrl = "https://faiths.life";
    const rawGroupName = dom.inputs.viewChurch.value.trim();
    const groupName = rawGroupName.length > 0 ? rawGroupName : "우리교회";
    const shareTitle = `${groupName} 신앙 유형 모임 초대`;
    const shareDesc = "함께 신앙 유형을 검사하고 결과를 나눠보세요!";

    if (typeof Kakao !== "undefined" && Kakao.isInitialized && Kakao.isInitialized()) {
      try {
        Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: shareTitle, description: shareDesc,
            imageUrl: "https://csy870617.github.io/faith-mbti/images/thumbnail.jpg",
            link: { mobileWebUrl: baseUrl, webUrl: baseUrl },
          },
          buttons: [{ title: "모임 참여하기", link: { mobileWebUrl: baseUrl, webUrl: baseUrl } }]
        });
        return; 
      } catch (e) { console.error(e); }
    }

    if (navigator.share) {
      try { await navigator.share({ title: shareTitle, text: shareDesc, url: baseUrl }); return; } catch(e) {}
    }

    try { 
      await navigator.clipboard.writeText(`${shareTitle}\n${shareDesc}\n${baseUrl}`); 
      alert("초대 링크가 클립보드에 복사되었습니다."); 
    }
    catch(e) { alert("공유 기능을 사용할 수 없습니다."); }
  });
}

if (dom.btns.churchCopy) {
  dom.btns.churchCopy.addEventListener("click", async () => {
    const members = currentChurchMembers;
    if (!members || members.length === 0) return alert("복사할 데이터가 없습니다.");

    const groupName = dom.inputs.viewChurch.value.trim() || "우리교회";
    const shareHeader = `${groupName} - 신앙 유형 결과`;
    
    let shareBody = "";
    members.forEach(m => {
      const typeData = window.typeResults[m.type];
      const desc = typeData ? typeData.strengthShort : (m.shortText || "");
      shareBody += `이름: ${m.name}\n유형: ${m.type}\n설명: ${desc}\n\n`;
    });

    const fullText = `${shareHeader}\n\n${shareBody}`;
    
    if (typeof Kakao !== "undefined" && Kakao.isInitialized && Kakao.isInitialized()) {
      try {
        Kakao.Share.sendDefault({
          objectType: "text",
          text: fullText,
          link: { mobileWebUrl: "https://faiths.life", webUrl: "https://faiths.life" },
          buttonTitle: "검사하러 가기"
        });
        return; 
      } catch (e) { console.error(e); }
    }

    if (navigator.share) {
      try { 
        await navigator.share({ 
          title: shareHeader, 
          text: "\n\n" + shareBody 
        }); 
        return; 
      } catch(e) {}
    }

    try { 
      await navigator.clipboard.writeText(fullText); 
      alert("그룹 결과가 클립보드에 복사되었습니다."); 
    }
    catch(e) { alert("공유 기능을 사용할 수 없습니다."); }
  });
}

/* =========================================
   글자 크기 조절 기능 (REM 기반)
   ========================================= */

let currentFontScale = parseFloat(localStorage.getItem("faith_font_scale")) || 1.0;

function applyFontSize(scale) {
  scale = Math.round(scale * 10) / 10;
  const root = document.documentElement;
  const basePercent = 120; 
  const percent = Math.round(scale * basePercent);
  root.style.fontSize = `${percent}%`;
  localStorage.setItem("faith_font_scale", scale);
  currentFontScale = scale;
}

if (currentFontScale !== 1.0) {
  applyFontSize(currentFontScale);
} else {
  applyFontSize(1.0);
}

if (dom.btns.fontUp) {
  dom.btns.fontUp.addEventListener("click", () => {
    if (currentFontScale < 1.3) applyFontSize(currentFontScale + 0.1);
  });
  dom.btns.fontDown.addEventListener("click", () => {
    if (currentFontScale > 0.7) applyFontSize(currentFontScale - 0.1);
  });
  dom.btns.fontReset.addEventListener("click", () => {
    applyFontSize(1.0);
  });
}

/* =========================================
   페이지 로드 시 저장된 결과 & 교회 정보 불러오기
   ========================================= */
window.addEventListener('DOMContentLoaded', () => {
  const savedData = localStorage.getItem('faith_result_v1');
  if (savedData) {
    try {
      const data = JSON.parse(savedData);
      if (data.type && data.scores && data.axisScores) {
        myResultType = data.type;
        currentViewType = data.type;
        
        dom.sections.intro.classList.add("hidden");
        dom.sections.test.classList.add("hidden");
        dom.sections.result.classList.remove("hidden");

        renderResult(data.type);
        renderAxisUpgraded(data.axisScores);
        renderDetailScores(data.scores);
        renderMatchCards(data.type);
        buildOtherTypesGrid();
      }
    } catch (e) {
      console.error("저장된 데이터 로드 실패", e);
      localStorage.removeItem('faith_result_v1');
    }
  }

  const savedChurch = localStorage.getItem('faith_church_name');
  const savedPw = localStorage.getItem('faith_church_pw');
  
  if (savedChurch && savedPw && dom.inputs.rememberCreds) {
    dom.inputs.viewChurch.value = savedChurch;
    dom.inputs.viewPw.value = savedPw;
    dom.inputs.rememberCreds.checked = true;
  }
});


if (dom.btns.church && dom.sections.church) {
  dom.btns.church.addEventListener("click", () => {
    dom.sections.intro.classList.add("hidden");
    dom.sections.test.classList.add("hidden");
    dom.sections.result.classList.add("hidden");
    dom.sections.church.classList.remove("hidden");
  });
}

if (dom.btns.churchClose) {
  dom.btns.churchClose.addEventListener("click", () => {
    dom.sections.church.classList.add("hidden");
    dom.sections.result.classList.remove("hidden");
  });
}

if (dom.btns.memberSave) {
  dom.btns.memberSave.addEventListener("click", async () => {
    try {
      await saveMyResultToChurch(dom.inputs.memberName.value, dom.inputs.memberChurch.value, dom.inputs.memberPw.value);
      alert("저장되었습니다.");
      dom.inputs.memberName.value = "";
    } catch (e) { alert(e.message); }
  });
}

if (dom.btns.churchSummary) {
  dom.btns.churchSummary.addEventListener("click", async () => {
    if (dom.inputs.rememberCreds && dom.inputs.rememberCreds.checked) {
      localStorage.setItem('faith_church_name', dom.inputs.viewChurch.value);
      localStorage.setItem('faith_church_pw', dom.inputs.viewPw.value);
    } else {
      localStorage.removeItem('faith_church_name');
      localStorage.removeItem('faith_church_pw');
    }

    try {
      const { churchName, members } = await loadChurchMembers(dom.inputs.viewChurch.value, dom.inputs.viewPw.value);
      renderChurchList(churchName, members);
      if (dom.btns.churchCopy) dom.btns.churchCopy.classList.remove("hidden");
    } catch (e) { alert(e.message); }
  });
}

if (dom.btns.churchAnalysis) {
  dom.btns.churchAnalysis.addEventListener("click", analyzeAndRenderCommunity);
}

if (dom.churchViewToggle && dom.churchViewContent) {
  dom.churchViewToggle.addEventListener("click", () => {
    const isHidden = dom.churchViewContent.classList.contains("hidden");
    if (isHidden) {
      dom.churchViewContent.classList.remove("hidden");
      dom.churchViewToggle.querySelector("h3").innerText = "우리교회 신앙 유형 모아보기 ▲";
    } else {
      dom.churchViewContent.classList.add("hidden");
      dom.churchViewToggle.querySelector("h3").innerText = "우리교회 신앙 유형 모아보기 ▼";
    }
  });
}

if (dom.btns.invite) {
  dom.btns.invite.addEventListener("click", async () => {
    const baseUrl = "https://faiths.life";
    const rawGroupName = dom.inputs.viewChurch.value.trim();
    const groupName = rawGroupName.length > 0 ? rawGroupName : "우리교회";
    const shareTitle = `${groupName} 신앙 유형 모임 초대`;
    const shareDesc = "함께 신앙 유형을 검사하고 결과를 나눠보세요!";

    if (typeof Kakao !== "undefined" && Kakao.isInitialized && Kakao.isInitialized()) {
      try {
        Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: shareTitle, description: shareDesc,
            imageUrl: "https://csy870617.github.io/faith-mbti/images/thumbnail.jpg",
            link: { mobileWebUrl: baseUrl, webUrl: baseUrl },
          },
          buttons: [{ title: "모임 참여하기", link: { mobileWebUrl: baseUrl, webUrl: baseUrl } }]
        });
        return; 
      } catch (e) { console.error(e); }
    }

    if (navigator.share) {
      try { await navigator.share({ title: shareTitle, text: shareDesc, url: baseUrl }); return; } catch(e) {}
    }

    try { 
      await navigator.clipboard.writeText(`${shareTitle}\n${shareDesc}\n${baseUrl}`); 
      alert("초대 링크가 클립보드에 복사되었습니다."); 
    }
    catch(e) { alert("공유 기능을 사용할 수 없습니다."); }
  });
}

// [수정됨] 그룹 결과 복사/공유 버튼 (하이픈 제거 & 줄바꿈 유지)
if (dom.btns.churchCopy) {
  dom.btns.churchCopy.addEventListener("click", async () => {
    const members = currentChurchMembers;
    if (!members || members.length === 0) return alert("복사할 데이터가 없습니다.");

    const groupName = dom.inputs.viewChurch.value.trim() || "우리교회";
    
    // 1. 헤더 (형식 변경: 하이픈 없이 공백으로 구분)
    // 예: "우리집 신앙 유형 결과"
    const shareHeader = `- ${groupName} 신앙 유형 결과`;
    
    // 2. 본문 (명단)
    let shareBody = "";
    members.forEach(m => {
      // 실시간 강점 데이터 불러오기
      const typeData = window.typeResults[m.type];
      const desc = typeData ? typeData.strengthShort : (m.shortText || "");
      shareBody += `이름: ${m.name}\n유형: ${m.type}\n설명: ${desc}\n\n`;
    });

    // 3. 전체 합친 텍스트 (제목 + 두 줄 띄움 + 본문)
    const fullText = `${shareHeader}\n\n${shareBody}`;
    
    // A. 카카오톡 공유
    if (typeof Kakao !== "undefined" && Kakao.isInitialized && Kakao.isInitialized()) {
      try {
        Kakao.Share.sendDefault({
          objectType: "text",
          text: fullText,
          link: { mobileWebUrl: "https://faiths.life", webUrl: "https://faiths.life" },
          buttonTitle: "검사하러 가기"
        });
        return; 
      } catch (e) { console.error(e); }
    }

    // B. 기본 공유 (Web Share API)
    // 제목과 본문이 붙지 않도록 text 맨 앞에 줄바꿈(\n\n)을 넣습니다.
    if (navigator.share) {
      try { 
        await navigator.share({ 
          title: shareHeader, 
          text: "\n\n" + shareBody 
        }); 
        return; 
      } catch(e) {}
    }

    // C. 클립보드 복사
    try { 
      await navigator.clipboard.writeText(fullText); 
      alert("그룹 결과가 클립보드에 복사되었습니다."); 
    }
    catch(e) { alert("공유 기능을 사용할 수 없습니다."); }
  });
}

/* =========================================
   글자 크기 조절 기능 (REM 기반)
   ========================================= */

let currentFontScale = parseFloat(localStorage.getItem("faith_font_scale")) || 1.0;

function applyFontSize(scale) {
  scale = Math.round(scale * 10) / 10;
  const root = document.documentElement;
  const basePercent = 120; 
  const percent = Math.round(scale * basePercent);
  root.style.fontSize = `${percent}%`;
  localStorage.setItem("faith_font_scale", scale);
  currentFontScale = scale;
}

if (currentFontScale !== 1.0) {
  applyFontSize(currentFontScale);
} else {
  applyFontSize(1.0);
}

if (dom.btns.fontUp) {
  dom.btns.fontUp.addEventListener("click", () => {
    if (currentFontScale < 1.3) applyFontSize(currentFontScale + 0.1);
  });
  dom.btns.fontDown.addEventListener("click", () => {
    if (currentFontScale > 0.7) applyFontSize(currentFontScale - 0.1);
  });
  dom.btns.fontReset.addEventListener("click", () => {
    applyFontSize(1.0);
  });
}

/* =========================================
   페이지 로드 시 저장된 결과 & 교회 정보 불러오기
   ========================================= */
window.addEventListener('DOMContentLoaded', () => {
  const savedData = localStorage.getItem('faith_result_v1');
  if (savedData) {
    try {
      const data = JSON.parse(savedData);
      if (data.type && data.scores && data.axisScores) {
        myResultType = data.type;
        currentViewType = data.type;
        
        dom.sections.intro.classList.add("hidden");
        dom.sections.test.classList.add("hidden");
        dom.sections.result.classList.remove("hidden");

        renderResult(data.type);
        renderAxisUpgraded(data.axisScores);
        renderDetailScores(data.scores);
        renderMatchCards(data.type);
        buildOtherTypesGrid();
      }
    } catch (e) {
      console.error("저장된 데이터 로드 실패", e);
      localStorage.removeItem('faith_result_v1');
    }
  }

  const savedChurch = localStorage.getItem('faith_church_name');
  const savedPw = localStorage.getItem('faith_church_pw');
  
  if (savedChurch && savedPw && dom.inputs.rememberCreds) {
    dom.inputs.viewChurch.value = savedChurch;
    dom.inputs.viewPw.value = savedPw;
    dom.inputs.rememberCreds.checked = true;
  }
});

/* =========================================
   [추가] 뒤로 가기 버튼 제어 (History API)
   - 교회 그룹 화면에서 뒤로 가기 시 결과 화면으로 복귀
   ========================================= */

// 1. 교회 그룹 섹션 열 때 히스토리 추가
if (dom.btns.church) {
  dom.btns.church.addEventListener("click", () => {
    // 현재 상태를 히스토리에 추가 (가짜 URL 파라미터 추가)
    history.pushState({ page: "church" }, "", "#church");
    
    dom.sections.intro.classList.add("hidden");
    dom.sections.test.classList.add("hidden");
    dom.sections.result.classList.add("hidden");
    dom.sections.church.classList.remove("hidden");
  });
}

// 2. 브라우저 뒤로 가기 감지 (popstate 이벤트)
window.addEventListener("popstate", (event) => {
  // 교회 섹션이 열려있는 상태에서 뒤로 가기를 눌렀을 때
  if (!dom.sections.church.classList.contains("hidden")) {
    // 교회 섹션 닫고 결과 화면 보여주기
    dom.sections.church.classList.add("hidden");
    
    // 만약 결과 데이터가 있다면 결과 화면으로, 없다면 인트로로
    if (myResultType) {
      dom.sections.result.classList.remove("hidden");
    } else {
      dom.sections.intro.classList.remove("hidden");
    }
  }
});

// 3. '결과로 돌아가기' 버튼 클릭 시 히스토리 정리
if (dom.btns.churchClose) {
  dom.btns.churchClose.addEventListener("click", () => {
    // 브라우저 히스토리도 한 단계 뒤로 돌려줌 (URL의 #church 제거)
    if (location.hash === "#church") {
      history.back(); 
    } else {
      // 만약 히스토리가 꼬여서 #church가 아니더라도 강제로 화면 전환
      dom.sections.church.classList.add("hidden");
      dom.sections.result.classList.remove("hidden");
    }
  });
}




