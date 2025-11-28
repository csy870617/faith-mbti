/**************************************************
 * Faith-MBTI Test – app.js (최적화 버전)
 **************************************************/

/* 1. 전역 상태 및 DOM 캐싱 */
let currentIndex = 0;
let questions = []; 
const answers = {};
let myResultType = null;
let currentViewType = null;

// DOM 요소 캐싱 (반복 조회 방지)
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
    invite: document.getElementById("invite-btn"),
    churchCopy: document.getElementById("church-copy-btn")
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
    viewPw: document.getElementById("view-password-input")
  },
  churchList: document.getElementById("church-result-list")
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
  const container = dom.question.inputs;
  container.innerHTML = "";
  
  // DocumentFragment 사용하여 리플로우 최소화
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

  dom.progress.label.textContent = `문항 ${idx} / ${total}`;
  dom.progress.fill.style.width = `${(idx / total) * 100}%`;

  dom.question.code.textContent = `Q${idx}`;
  dom.question.text.textContent = q.text;

  renderScale(q.id);
  dom.btns.back.disabled = currentIndex === 0;
}

function calculateResult() {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  const axisScores = { EI: 0, SN: 0, TF: 0, JP: 0 };

  originalQuestions.forEach((q) => {
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
    myResultType = type;
    currentViewType = type;

    (type);
    renderAxisUpgraded(axisScores);
    renderDetailScores(scores);
    renderMatchCards(type);
    buildOtherTypesGrid();
  }
}

function renderResult(type) {
  const data = typeResults[type];

  dom.result.code.textContent = type;
  dom.result.name.textContent = `${data.nameKo} · ${data.nameEn}`;
  dom.result.summary.textContent = data.summary;

  // 뱃지 렌더링
  dom.result.badges.innerHTML = "";
  data.badges.forEach(b => {
    const span = document.createElement("span");
    span.className = "badge";
    span.textContent = b;
    dom.result.badges.appendChild(span);
  });

  // 리스트 렌더링 함수
  const renderList = (el, items) => {
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

  dom.result.strength.textContent = `강점: ${data.strengthShort}`;
  dom.result.weakness.textContent = `약점: ${data.weaknessShort}`;
  dom.result.warning.textContent = data.warningShort;

  // [수정] 성경 인물 박스 초기화 (닫기)
  dom.bible.charEl.textContent = `${data.bibleCharacter} – ${data.bibleCharacterDesc}`;
  dom.bible.verseEl.textContent = `${data.verseRef} ${data.verseText}`;
  dom.bible.box.classList.add("hidden");
  dom.btns.bibleToggle.textContent = "📖 성경 인물 보기";
  
  // [추가됨] '오늘의 말씀' 박스도 화면이 바뀔 때마다 무조건 닫기
  dom.verse.box.classList.add("hidden");

  // 캐릭터 렌더링
  dom.character.emoji.textContent = data.characterEmoji;
  dom.character.title.textContent = data.characterTitle;
  dom.character.text.textContent = data.characterStory;
}

function renderAxisUpgraded(axisScores) {
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
          <span style="font-size:11px;color:#9ca3af;">${d.left} ${leftPercent}% · ${d.right} ${rightPercent}%</span>
        </div>
        <div class="axis-bar-bg"><div class="axis-bar-fill" style="width:${leftPercent}%"></div></div>
      </div>`;
  });
  dom.result.axis.innerHTML = html;
}

function renderDetailScores(scores) {
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
  const entries = Object.entries(typeResults);
  const all = entries
    .filter(([code]) => code !== type)
    .map(([code, data]) => ({ code, data, sim: similarityScore(type, code) }));

  const top2 = [...all].sort((a, b) => b.sim - a.sim).slice(0, 2);
  const opposite = [...all].sort((a, b) => a.sim - b.sim)[0];

  dom.result.matchTop2.innerHTML = top2.map(t => `
    <div class="match-item">
      <div class="match-item-title">${t.data.nameKo} (${t.code})</div>
      <div class="match-item-sub">비슷한 성향 덕분에 함께 사역할 때 호흡이 잘 맞는 유형입니다. 서로의 강점을 더 크게 살려 줄 수 있어요.</div>
    </div>`).join('');

  dom.result.matchOpposite.innerHTML = `
    <div class="match-item match-item-opposite">
      <div class="match-item-title">${opposite.data.nameKo} (${opposite.code})</div>
      <div class="match-item-sub">나와 많이 다른 유형이지만, 그래서 더 균형을 도와주는 “반대 친구”입니다. 같이 섬기며 서로의 약한 부분을 채워 줄 수 있어요.</div>
    </div>`;
}

function buildOtherTypesGrid() {
  dom.result.otherTypes.innerHTML = "";
  Object.keys(typeResults).sort().forEach(t => {
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

/* 4. 이벤트 핸들러 */
dom.btns.todayVerse.addEventListener("click", () => {
  const type = currentViewType || myResultType;
  if (!type) return;
  const data = typeResults[type];
  dom.verse.ref.textContent = data.verseRef;
  dom.verse.text.textContent = data.verseText;
  dom.verse.apply.textContent = data.verseApply || "";
  dom.verse.box.classList.toggle("hidden");
});

dom.btns.bibleToggle.addEventListener("click", () => {
  const isHidden = dom.bible.box.classList.contains("hidden");
  dom.bible.box.classList.toggle("hidden");
  dom.btns.bibleToggle.textContent = isHidden ? "📖 성경 인물 닫기" : "📖 성경 인물 보기";
});

// app.js의 공유하기 버튼 이벤트 (dom.btns.share) 전체 교체

if (dom.btns.share) {
  dom.btns.share.addEventListener("click", async () => {
    // [변경점] 현재 보고 있는 유형(currentViewType)을 우선으로 공유합니다.
    const targetType = currentViewType || myResultType;

    if (!targetType) return alert("먼저 검사를 완료한 뒤, 결과를 공유해 주세요.");
    
    const baseUrl = "https://faiths.life/";
    const data = typeResults[targetType]; // 현재 보고 있는 유형의 데이터 가져오기
    
    // 기본 정보 정의
    const shareTitle = "FAITH MBTI 신앙 유형 테스트";
    // 문구는 통일성을 위해 "나의 유형은..." 형식을 유지하거나, 필요시 "이 유형은..."으로 변경 가능
    // 여기서는 기존 요청대로 유지하되, 내용은 현재 보고 있는 유형이 들어갑니다.
    const shareDesc = `나의 유형은 ${targetType} (${data.nameKo}) 입니다.`;
    
    // [1] 카카오톡 공유 (전용 SDK 사용)
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
    
    // [2] 모바일 브라우저 기본 공유 (Web Share API)
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
    
    // [3] PC 등 클립보드 복사
    try { 
      const clipboardText = `${shareTitle}\n${shareDesc}\n${baseUrl}`;
      await navigator.clipboard.writeText(clipboardText); 
      alert("결과가 클립보드에 복사되었습니다."); 
    }
    catch (e) { alert("공유 기능을 사용할 수 없습니다."); }
  });
}


// 네비게이션
dom.btns.start.addEventListener("click", () => {
  questions = shuffle(originalQuestions);
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

dom.btns.back.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
});

dom.btns.skip.addEventListener("click", goNextOrResult);
dom.btns.restart.addEventListener("click", () => {
  dom.sections.result.classList.add("hidden");
  dom.sections.intro.classList.remove("hidden");
});

// 개발용 버튼
if (dom.btns.goResult) {
  dom.btns.goResult.addEventListener("click", () => {
    originalQuestions.forEach(q => answers[q.id] = 3);
    const { scores, axisScores } = calculateResult();
    myResultType = "ENFJ";
    currentViewType = "ENFJ";
    
    dom.sections.intro.classList.add("hidden");
    dom.sections.test.classList.add("hidden");
    dom.sections.result.classList.remove("hidden");

    renderResult("ENFJ");
    renderAxisUpgraded(axisScores);
    renderDetailScores(scores);
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
  if (!myResultType) throw new Error("먼저 검사를 완료해 주세요.");

  const { db, fs } = await ensureFirebase();
  const churchRef = fs.doc(db, CHURCH_COLLECTION, c);
  const snap = await fs.getDoc(churchRef);

  if (snap.exists() && snap.data().password !== p) throw new Error("비밀번호가 일치하지 않습니다.");
  if (!snap.exists()) await fs.setDoc(churchRef, { churchName: c, password: p, createdAt: fs.serverTimestamp ? fs.serverTimestamp() : Date.now() });

  const data = typeResults[myResultType];
  await fs.addDoc(fs.collection(churchRef, "members"), {
    name: n, type: myResultType, shortText: data.summary || data.nameKo || "",
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
  return { churchName: snap.data().churchName || c, members: membersSnap.docs.map(d => ({ id: d.id, ...d.data() })) };
}

async function deleteChurchMember(churchName, password, memberId) {
  const { db, fs } = await ensureFirebase();
  const churchRef = fs.doc(db, CHURCH_COLLECTION, churchName.trim());
  const snap = await fs.getDoc(churchRef);
  
  if (!snap.exists() || snap.data().password !== password.trim()) throw new Error("권한이 없습니다.");
  await fs.deleteDoc(fs.doc(fs.collection(churchRef, "members"), memberId));
}

function renderChurchList(churchName, members) {
  if (!dom.churchList) return;
  if (!members || !members.length) {
    dom.churchList.innerHTML = `<div class="result-card"><p class="gray">저장된 결과가 없습니다.</p></div>`;
    return;
  }
  const rows = members.map(m => `
    <tr>
      <td>${m.name || ""}</td><td>${m.type || ""}</td><td>${m.shortText || ""}</td>
      <td><button class="btn-secondary member-delete-btn" data-id="${m.id}" data-church="${churchName}">삭제</button></td>
    </tr>`).join('');
    
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
    try {
      const { churchName, members } = await loadChurchMembers(dom.inputs.viewChurch.value, dom.inputs.viewPw.value);
      renderChurchList(churchName, members);
    } catch (e) { alert(e.message); }
  });
}

if (dom.btns.invite) {
  dom.btns.invite.addEventListener("click", async () => {
    const baseUrl = "https://faiths.life";
    
    // 사용자가 입력한 그룹명 가져오기 (비어있으면 '우리교회'로 설정)
    const rawGroupName = dom.inputs.viewChurch.value.trim();
    const groupName = rawGroupName.length > 0 ? rawGroupName : "우리교회";

    const shareTitle = `${groupName} 신앙 유형 모임 초대`;
    const shareDesc = "함께 신앙 유형을 검사하고 결과를 나눠보세요!";
    
    // [1] 카카오톡 공유
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
          buttons: [{ title: "모임 참여하기", link: { mobileWebUrl: baseUrl, webUrl: baseUrl } }]
        });
        return; 
      } catch (e) { console.error(e); }
    }

    // [2] 모바일 기본 공유 (Web Share API)
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

    // [3] 클립보드 복사 (PC 등)
    try { 
      const clipboardText = `${shareTitle}\n${shareDesc}\n${baseUrl}`;
      await navigator.clipboard.writeText(clipboardText); 
      alert("초대 링크가 클립보드에 복사되었습니다."); 
    }
    catch(e) { alert("공유 기능을 사용할 수 없습니다."); }
  });
}

if (dom.btns.churchCopy) {
  dom.btns.churchCopy.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(dom.churchList.innerText); alert("목록이 복사되었습니다."); }
    catch(e) { alert("복사 실패"); }
  });
}




