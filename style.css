/**************************************************
 * Faith-MBTI Test – app.js (최종 수정 버전)
 * - data.js의 데이터를 사용하여 로직을 수행합니다.
 **************************************************/

/* 1. 전역 상태 변수 초기화 */
let currentIndex = 0;
let questions = []; // data.js의 originalQuestions를 섞어서 담을 변수
const answers = {};
let myResultType = null;
let myScores = null;
let currentViewType = null;

/* 2. DOM 요소 가져오기 (HTML ID와 일치해야 함) */
const introSection = document.getElementById("intro-section");
const testSection = document.getElementById("test-section");
const resultSection = document.getElementById("result-section");
const churchSection = document.getElementById("church-section");

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

const bibleCharacterEl = document.getElementById("bible-character");
const bibleVerseEl = document.getElementById("bible-verse");
const bibleToggleBtn = document.getElementById("bible-toggle-btn");
const bibleBox = document.getElementById("bible-box");

const characterEmojiEl = document.getElementById("character-emoji");
const characterTitleEl = document.getElementById("character-title");
const characterTextEl = document.getElementById("character-text");

const otherTypesGrid = document.getElementById("other-types-grid");

const todayVerseBtn = document.getElementById("today-verse-btn");
const todayVerseBox = document.getElementById("today-verse-box");
const todayVerseBoxRef = document.getElementById("today-verse-box-ref");
const todayVerseBoxText = document.getElementById("today-verse-box-text");
const todayVerseBoxApply = document.getElementById("today-verse-box-apply");

/* 우리교회 관련 DOM */
const churchBtn = document.getElementById("church-btn");
const churchCloseBtn = document.getElementById("church-close-btn");
const inviteBtn = document.getElementById("invite-btn");
const memberNameInput = document.getElementById("member-name-input");
const memberChurchInput = document.getElementById("member-church-input");
const memberPasswordInput = document.getElementById("member-password-input");
const memberSaveBtn = document.getElementById("member-save-btn");
const viewChurchInput = document.getElementById("view-church-input");
const viewPasswordInput = document.getElementById("view-password-input");
const churchSummaryBtn = document.getElementById("church-summary-btn");
const churchResultList = document.getElementById("church-result-list");
const churchCopyBtn = document.getElementById("church-copy-btn");
const goResultBtn = document.getElementById("go-result-btn");


/* 3. 유틸리티 함수 */
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* 4. 질문 화면 렌더링 */
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
  const idx = currentIndex + 1;
  const total = questions.length;

  progressLabel.textContent = `문항 ${idx} / ${total}`;
  if(axisLabel) axisLabel.style.visibility = "hidden";

  progressFill.style.width = `${(idx / total) * 100}%`;

  questionCode.textContent = `Q${idx}`;
  questionText.textContent = q.text;

  renderScale(q.id);
  backBtn.disabled = currentIndex === 0;
}

/* 5. 결과 계산 로직 */
function calculateResult() {
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  const axisScores = { EI: 0, SN: 0, TF: 0, JP: 0 };

  // data.js의 originalQuestions 사용
  originalQuestions.forEach((q) => {
    const v = answers[q.id];
    if (!v) return; 

    scores[q.side] += v; 
    const centered = v - 3; 

    if (q.axis === "EI") {
      axisScores.EI += q.side === "E" ? centered : -centered;
    } else if (q.axis === "SN") {
      axisScores.SN += q.side === "S" ? centered : -centered;
    } else if (q.axis === "TF") {
      axisScores.TF += q.side === "T" ? centered : -centered;
    } else if (q.axis === "JP") {
      axisScores.JP += q.side === "J" ? centered : -centered;
    }
  });

  const type =
    (axisScores.EI >= 0 ? "E" : "I") +
    (axisScores.SN >= 0 ? "S" : "N") +
    (axisScores.TF >= 0 ? "T" : "F") +
    (axisScores.JP >= 0 ? "J" : "P");

  return { type, scores, axisScores };
}

/* 6. 다음 단계 이동 */
function goNextOrResult() {
  const total = questions.length;
  if (currentIndex < total - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    testSection.classList.add("hidden");
    resultSection.classList.remove("hidden");

    const { type, scores, axisScores } = calculateResult();
    myResultType = type;
    myScores = scores;
    currentViewType = type;

    renderResult(type);
    renderAxisUpgraded(axisScores); 
    renderDetailScores(scores);     
    renderMatchCards(type);
    buildOtherTypesGrid();
  }
}

/* 7. 결과 화면 렌더링 */
function renderResult(type) {
  const data = typeResults[type]; // data.js에서 가져옴

  resultCode.textContent = type;
  resultName.textContent = `${data.nameKo} · ${data.nameEn}`;
  resultSummary.textContent = data.summary;

  resultBadges.innerHTML = "";
  data.badges.forEach((b) => {
    const span = document.createElement("span");
    span.className = "badge";
    span.textContent = b;
    resultBadges.appendChild(span);
  });

  resultFeatures.innerHTML = "";
  data.features.forEach((f) => {
    const li = document.createElement("li");
    li.textContent = f;
    resultFeatures.appendChild(li);
  });

  resultGrowth.innerHTML = "";
  data.growth.forEach((g) => {
    const li = document.createElement("li");
    li.textContent = g;
    resultGrowth.appendChild(li);
  });

  resultStrength.textContent = `강점: ${data.strengthShort}`;
  resultWeakness.textContent = `약점: ${data.weaknessShort}`;
  resultWarning.textContent = data.warningShort;

  resultMinistries.innerHTML = "";
  data.ministries.forEach((m) => {
    const li = document.createElement("li");
    li.textContent = m;
    resultMinistries.appendChild(li);
  });

  // 성경 인물
  bibleCharacterEl.textContent = `${data.bibleCharacter} – ${data.bibleCharacterDesc}`;
  bibleVerseEl.textContent = `${data.verseRef} ${data.verseText}`; // 추가된 부분
  bibleBox.classList.add("hidden");
  bibleToggleBtn.textContent = "📖 성경 인물 보기";

  // 메인 캐릭터
  characterEmojiEl.textContent = data.characterEmoji;
  characterTitleEl.textContent = data.characterTitle;
  characterTextEl.textContent = data.characterStory;
}

/* 8. 그래프 및 추가 정보 렌더링 */
function renderAxisUpgraded(axisScores) {
  const container = document.getElementById("axis-upgraded");
  const defs = [
    { key: "EI", left: "E", right: "I", label: "에너지 방향" },
    { key: "SN", left: "S", right: "N", label: "정보 인식" },
    { key: "TF", left: "T", right: "F", label: "판단 기준" },
    { key: "JP", left: "J", right: "P", label: "생활 방식" },
  ];
  const MAX = 20;
  let html = "";

  defs.forEach((d) => {
    const v = axisScores[d.key] || 0; 
    let leftPercent = 50 + (v / (2 * MAX)) * 100;
    leftPercent = Math.max(0, Math.min(100, Math.round(leftPercent)));
    const rightPercent = 100 - leftPercent;

    html += `
      <div class="axis-row">
        <div class="axis-label">
          <span>${d.label}</span>
          <span style="font-size:11px;color:#9ca3af;">
            ${d.left} ${leftPercent}% · ${d.right} ${rightPercent}%
          </span>
        </div>
        <div class="axis-bar-bg">
          <div class="axis-bar-fill" style="width:${leftPercent}%"></div>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

function renderDetailScores(scores) {
  const container = document.getElementById("detail-score-list");
  const maxScore = 25; 
  let html = "";

  ["E", "I", "S", "N", "T", "F", "J", "P"].forEach((k) => {
    const v = scores[k] || 0;
    const percent = Math.min(100, Math.round((v / maxScore) * 100));

    html += `
      <div class="detail-score-row">
        <div class="detail-score-label">${k} (${v})</div>
        <div class="detail-score-bar-bg">
          <div class="detail-score-bar-fill" style="width:${percent}%"></div>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
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
    .map(([code, data]) => ({
      code,
      data,
      sim: similarityScore(type, code),
    }));

  const top2 = [...all].sort((a, b) => b.sim - a.sim).slice(0, 2);
  const opposite = [...all].sort((a, b) => a.sim - b.sim)[0];

  let htmlTop2 = "";
  top2.forEach((t) => {
    htmlTop2 += `
      <div class="match-item">
        <div class="match-item-title">${t.data.nameKo} (${t.code})</div>
        <div class="match-item-sub">
          비슷한 성향 덕분에 함께 사역할 때 호흡이 잘 맞는 유형입니다.
          서로의 강점을 더 크게 살려 줄 수 있어요.
        </div>
      </div>
    `;
  });
  document.getElementById("match-top2").innerHTML = htmlTop2;

  document.getElementById("match-opposite").innerHTML = `
    <div class="match-item match-item-opposite">
      <div class="match-item-title">${opposite.data.nameKo} (${opposite.code})</div>
      <div class="match-item-sub">
        나와 많이 다른 유형이지만, 그래서 더 균형을 도와주는 “반대 친구”입니다.
        같이 섬기며 서로의 약한 부분을 채워 줄 수 있어요.
      </div>
    </div>
  `;
}

function buildOtherTypesGrid() {
  otherTypesGrid.innerHTML = "";

  Object.keys(typeResults)
    .sort()
    .forEach((t) => {
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
      otherTypesGrid.appendChild(btn);
    });

  updateTypeButtonsActive();
}

function updateTypeButtonsActive() {
  document.querySelectorAll(".btn-type").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.type === currentViewType);
  });
}

/* 9. 이벤트 리스너 (버튼 동작) */

// 성경 말씀 토글
todayVerseBtn.addEventListener("click", () => {
  const type = currentViewType || myResultType;
  if (!type) return;

  const data = typeResults[type];
  todayVerseBoxRef.textContent = data.verseRef;
  todayVerseBoxText.textContent = data.verseText;
  todayVerseBoxApply.textContent = data.verseApply || "";

  todayVerseBox.classList.toggle("hidden");
});

// 성경 인물 토글
bibleToggleBtn.addEventListener("click", () => {
  const willOpen = bibleBox.classList.contains("hidden");
  if (willOpen) {
    bibleBox.classList.remove("hidden");
    bibleToggleBtn.textContent = "📖 성경 인물 닫기";
  } else {
    bibleBox.classList.add("hidden");
    bibleToggleBtn.textContent = "📖 성경 인물 보기";
  }
});

// 공유하기 버튼
if (shareBtn) {
  shareBtn.addEventListener("click", async () => {
    if (!myResultType || !typeResults || !typeResults[myResultType]) {
      alert("먼저 검사를 완료한 뒤, 결과를 공유해 주세요.");
      return;
    }

    const baseUrl = "https://faiths.life/";
    const data = typeResults[myResultType];
    const shareTitle = "FAITH-MBTI 신앙 유형 테스트";
    const shareDesc = `나의 Faith-MBTI 유형은 ${myResultType} (${data.nameKo}) 입니다.`;
    const shareUrl = baseUrl;

    // 1. 카카오 공유
    if (typeof Kakao !== "undefined" && Kakao.isInitialized && Kakao.isInitialized()) {
      try {
        Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: shareTitle,
            description: shareDesc,
            imageUrl: "https://csy870617.github.io/faith-mbti/images/thumbnail.jpg",
            link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
          },
          buttons: [
            { title: "테스트 하러가기", link: { mobileWebUrl: shareUrl, webUrl: shareUrl } },
          ],
        });
        return;
      } catch (err) { console.error(err); }
    }

    // 2. Web Share
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareDesc, url: shareUrl });
        return;
      } catch (err) {}
    }

    // 3. 클립보드 복사
    try {
      await navigator.clipboard.writeText(`${shareDesc}\n${shareUrl}`);
      alert("결과가 클립보드에 복사되었습니다.");
    } catch (err) {
      alert("공유 기능을 사용할 수 없습니다.");
    }
  });
}

// 네비게이션 버튼
startBtn.addEventListener("click", () => {
  // data.js에서 가져온 originalQuestions 사용
  questions = shuffle(originalQuestions);
  Object.keys(answers).forEach((k) => delete answers[k]);
  currentIndex = 0;
  myResultType = null;
  myScores = null;
  currentViewType = null;

  todayVerseBox.classList.add("hidden");
  bibleBox.classList.add("hidden");

  introSection.classList.add("hidden");
  testSection.classList.remove("hidden");
  resultSection.classList.add("hidden");

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

// 개발용 바로보기
if (goResultBtn) {
    goResultBtn.addEventListener("click", () => {
        // data.js의 데이터 사용
        originalQuestions.forEach((q) => { answers[q.id] = 3; });
        const { scores, axisScores } = calculateResult();
        const type = "ENFJ"; 

        myResultType = type;
        myScores = scores;
        currentViewType = type;

        introSection.classList.add("hidden");
        testSection.classList.add("hidden");
        resultSection.classList.remove("hidden");

        renderResult(type);
        renderAxisUpgraded(axisScores);
        renderDetailScores(scores);
        renderMatchCards(type);
        buildOtherTypesGrid();
    });
}


/* =========================================================
 * 10. Firebase + 우리교회 Firestore 연동
 * ======================================================= */

const CHURCH_COLLECTION = "faith_churches";
let _firebaseDb = null;
let _firebaseFsModule = null;

async function ensureFirebase() {
  if (_firebaseDb && _firebaseFsModule) {
    return { db: _firebaseDb, fs: _firebaseFsModule };
  }
  const appMod = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
  const fsMod = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");

  const firebaseConfig = {
    apiKey: "AIzaSyDAigdc0C7zzzOySBTFb527eeAN3jInIfQ",
    authDomain: "faith-mbti.firebaseapp.com",
    projectId: "faith-mbti",
    storageBucket: "faith-mbti.firebasestorage.app",
    messagingSenderId: "1065834838710",
    appId: "1:1065834838710:web:33382f9a82f94d112e8417",
    measurementId: "G-RWMSVFRMRP"
  };

  const app = appMod.initializeApp(firebaseConfig);
  const db = fsMod.getFirestore(app);
  _firebaseDb = db;
  _firebaseFsModule = fsMod;
  return { db, fs: fsMod };
}

function getTypeShortText(type) {
  const data = typeResults[type];
  if (!data) return "";
  return data.summary || data.strengthShort || data.nameKo || "";
}

async function saveMyResultToChurch(name, churchName, password) {
  const trimmedName = name.trim();
  const trimmedChurch = churchName.trim();
  const trimmedPassword = password.trim();

  if (!trimmedName || !trimmedChurch || !trimmedPassword) throw new Error("모든 항목을 입력해 주세요.");
  if (!myResultType) throw new Error("먼저 검사를 완료해 주세요.");

  const { db, fs } = await ensureFirebase();
  const { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } = fs;

  const churchRef = doc(db, CHURCH_COLLECTION, trimmedChurch);
  const snap = await getDoc(churchRef);

  if (snap.exists()) {
    if (snap.data().password !== trimmedPassword) throw new Error("비밀번호가 일치하지 않습니다.");
  } else {
    await setDoc(churchRef, {
      churchName: trimmedChurch,
      password: trimmedPassword,
      createdAt: serverTimestamp ? serverTimestamp() : Date.now(),
    });
  }

  await addDoc(collection(churchRef, "members"), {
    name: trimmedName,
    type: myResultType,
    shortText: getTypeShortText(myResultType),
    createdAt: serverTimestamp ? serverTimestamp() : Date.now(),
  });
}

async function loadChurchMembers(churchName, password) {
  const trimmedChurch = churchName.trim();
  const trimmedPassword = password.trim();
  if (!trimmedChurch || !trimmedPassword) throw new Error("정보를 모두 입력해 주세요.");

  const { db, fs } = await ensureFirebase();
  const { doc, getDoc, collection, query, orderBy, getDocs } = fs;

  const churchRef = doc(db, CHURCH_COLLECTION, trimmedChurch);
  const churchSnap = await getDoc(churchRef);

  if (!churchSnap.exists()) throw new Error("등록된 교회가 없습니다.");
  if (churchSnap.data().password !== trimmedPassword) throw new Error("비밀번호가 일치하지 않습니다.");

  const q = query(collection(churchRef, "members"), orderBy("createdAt", "asc"));
  const snap = await getDocs(q);

  return {
    churchName: churchSnap.data().churchName || trimmedChurch,
    members: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
  };
}

async function deleteChurchMember(churchName, password, memberId) {
  const trimmedChurch = churchName.trim();
  const trimmedPassword = password.trim();

  const { db, fs } = await ensureFirebase();
  const { doc, getDoc, collection, deleteDoc } = fs;

  const churchRef = doc(db, CHURCH_COLLECTION, trimmedChurch);
  const churchSnap = await getDoc(churchRef);

  if (!churchSnap.exists() || churchSnap.data().password !== trimmedPassword) {
    throw new Error("권한이 없습니다.");
  }
  await deleteDoc(doc(collection(churchRef, "members"), memberId));
}

function renderChurchList(churchName, members) {
  if (!churchResultList) return;

  if (!members || members.length === 0) {
    churchResultList.innerHTML = `<div class="result-card"><p class="gray">저장된 결과가 없습니다.</p></div>`;
    return;
  }

  let rows = "";
  members.forEach((m) => {
    rows += `
      <tr>
        <td>${m.name || ""}</td>
        <td>${m.type || ""}</td>
        <td>${m.shortText || ""}</td>
        <td><button class="btn-secondary member-delete-btn" data-member-id="${m.id}" data-church="${churchName}">삭제</button></td>
      </tr>`;
  });

  churchResultList.innerHTML = `
    <div class="result-card">
      <div class="card-title">🏠 ${churchName}</div>
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
          <thead>
            <tr style="border-bottom:1px solid #e5e7eb;">
              <th>이름</th><th>유형</th><th>설명</th><th>관리</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;

  churchResultList.querySelectorAll(".member-delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const pw = prompt("우리교회 비밀번호를 입력해 주세요.");
      if (!pw) return;
      try {
        await deleteChurchMember(btn.dataset.church, pw, btn.dataset.memberId);
        alert("삭제되었습니다.");
        const { members: refreshed } = await loadChurchMembers(btn.dataset.church, pw);
        renderChurchList(btn.dataset.church, refreshed);
      } catch (err) { alert(err.message); }
    });
  });
}

// 교회 섹션 이벤트 연결
if (churchBtn && churchSection) {
  churchBtn.addEventListener("click", () => {
    introSection.classList.add("hidden");
    testSection.classList.add("hidden");
    resultSection.classList.add("hidden");
    churchSection.classList.remove("hidden");
  });
}

if (churchCloseBtn) {
  churchCloseBtn.addEventListener("click", () => {
    churchSection.classList.add("hidden");
    resultSection.classList.remove("hidden");
  });
}

if (memberSaveBtn) {
  memberSaveBtn.addEventListener("click", async () => {
    try {
      await saveMyResultToChurch(memberNameInput.value, memberChurchInput.value, memberPasswordInput.value);
      alert("저장되었습니다.");
      memberNameInput.value = "";
    } catch (err) { alert(err.message); }
  });
}

if (churchSummaryBtn) {
  churchSummaryBtn.addEventListener("click", async () => {
    try {
      const { churchName, members } = await loadChurchMembers(viewChurchInput.value, viewPasswordInput.value);
      renderChurchList(churchName, members);
    } catch (err) { alert(err.message); }
  });
}

if (inviteBtn) {
  inviteBtn.addEventListener("click", async () => {
    const txt = "https://faiths.life - 우리교회 신앙 유형 함께해요!";
    try { await navigator.clipboard.writeText(txt); alert("링크가 복사되었습니다."); }
    catch(e) { alert("복사 실패"); }
  });
}

if (churchCopyBtn) {
    churchCopyBtn.addEventListener("click", async () => {
        // 간단 복사 로직
        const txt = churchResultList.innerText; 
        try { await navigator.clipboard.writeText(txt); alert("목록이 복사되었습니다."); }
        catch(e) { alert("복사 실패"); }
    });
}
