document.addEventListener('DOMContentLoaded', () => {

  /* =========================================
     1. DOM 요소 캐싱 & 전역 변수
     ========================================= */
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
      inviteBottom: document.getElementById("invite-btn-bottom"), // 하단 초대 버튼
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
    churchViewContent: document.getElementById("church-view-content"),
    churchAfterActions: document.getElementById("church-after-actions") // 분석/초대 버튼 컨테이너
  };

  let currentIndex = 0;
  let questions = []; 
  const answers = {};
  let myResultType = null;
  let currentViewType = null;
  let currentChurchMembers = []; 

  /* =========================================
     2. 유틸리티 함수 (셔플, 복사 등)
     ========================================= */
  function shuffle(array) {
    if (!array) return [];
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(() => fallbackCopyText(text));
    } else {
      return Promise.resolve(fallbackCopyText(text));
    }
  }

  function fallbackCopyText(text) {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      console.error("복사 실패", err);
      return false;
    }
  }

  /* =========================================
     3. 테스트 로직 (렌더링, 계산)
     ========================================= */
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

    if(dom.progress.label) dom.progress.label.textContent = `문항 ${idx} / ${total}`;
    if(dom.progress.fill) dom.progress.fill.style.width = `${(idx / total) * 100}%`;
    if(dom.question.code) dom.question.code.textContent = `Q${idx}`;
    if(dom.question.text) dom.question.text.textContent = q.text;

    renderScale(q.id);
    if(dom.btns.back) dom.btns.back.disabled = false; 
  }

  function calculateResult() {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    const axisScores = { EI: 0, SN: 0, TF: 0, JP: 0 };

    if (typeof originalQuestions === 'undefined') return { type: "ISTJ", scores, axisScores };

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
      
      const resultData = {
        type: type, scores: scores, axisScores: axisScores, date: new Date().getTime()
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

  /* =========================================
     4. 결과 화면 렌더링
     ========================================= */
  function renderResult(type) {
    if (typeof typeResults === 'undefined') return;
    const data = typeResults[type];

    if(dom.result.code) dom.result.code.textContent = type;
    if(dom.result.name) dom.result.name.textContent = `${data.nameKo} · ${data.nameEn}`;
    if(dom.result.summary) dom.result.summary.textContent = data.summary;

    if(dom.result.badges) {
      dom.result.badges.innerHTML = "";
      data.badges.forEach(b => {
        const span = document.createElement("span");
        span.className = "badge";
        span.textContent = b;
        dom.result.badges.appendChild(span);
      });
    }

    const renderList = (el, items) => {
      if(!el) return;
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

    if(dom.result.strength) dom.result.strength.textContent = `강점: ${data.strengthShort}`;
    if(dom.result.weakness) dom.result.weakness.textContent = `약점: ${data.weaknessShort}`;
    if(dom.result.warning) dom.result.warning.textContent = data.warningShort;

    if(dom.bible.charEl) dom.bible.charEl.textContent = `${data.bibleCharacter} – ${data.bibleCharacterDesc}`;
    if(dom.bible.verseEl) dom.bible.verseEl.textContent = `${data.verseRef} ${data.verseText}`;
    if(dom.bible.box) dom.bible.box.classList.add("hidden");
    if(dom.btns.bibleToggle) dom.btns.bibleToggle.textContent = "📖 성경 인물 보기";
    
    if(dom.verse.box) dom.verse.box.classList.add("hidden");
    if(dom.character.emoji) dom.character.emoji.textContent = data.characterEmoji;
    if(dom.character.title) dom.character.title.textContent = data.characterTitle;
    if(dom.character.text) dom.character.text.textContent = data.characterStory;
  }

  function renderAxisUpgraded(axisScores) {
    if(!dom.result.axis) return;
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
    if(!dom.result.detail) return;
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
    if (typeof typeResults === 'undefined') return;
    const entries = Object.entries(typeResults);
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
    if(!dom.result.otherTypes) return;
    if (typeof typeResults === 'undefined') return;

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

  /* =========================================
     5. Firebase & 우리교회 기능
     ========================================= */
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
    if (typeof typeResults === 'undefined') throw new Error("데이터를 로드할 수 없습니다.");

    const { db, fs } = await ensureFirebase();
    const churchRef = fs.doc(db, CHURCH_COLLECTION, c);
    const snap = await fs.getDoc(churchRef);

    if (snap.exists() && snap.data().password !== p) throw new Error("비밀번호가 일치하지 않습니다.");
    if (!snap.exists()) await fs.setDoc(churchRef, { churchName: c, password: p, createdAt: fs.serverTimestamp ? fs.serverTimestamp() : Date.now() });

    const data = typeResults[targetType];
    await fs.addDoc(fs.collection(churchRef, "members"), {
      name: n, type: targetType, shortText: data.summary || data.nameKo || "",
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

  function renderChurchList(churchName, members) {
    if (!dom.churchList) return;
    if (!members || !members.length) {
      dom.churchList.innerHTML = `<div style="padding:20px; text-align:center; color:#94a3b8;">저장된 결과가 없습니다.</div>`;
      return;
    }
    const rows = members.map(m => {
      const typeData = (typeof typeResults !== 'undefined') ? typeResults[m.type] : null;
      const desc = typeData ? typeData.strengthShort : (m.shortText || "");
      return `
      <tr>
        <td style="font-weight:600;">${m.name || ""}</td>
        <td><span class="type-pill" style="margin:0; padding:2px 8px; font-size:0.75rem;">${m.type || ""}</span></td>
        <td style="font-size:0.85rem; color:#64748b;">${desc}</td>
        <td style="text-align:right;"><button class="btn-secondary member-delete-btn" style="padding:4px 8px; font-size:0.75rem;" data-id="${m.id}" data-church="${churchName}">삭제</button></td>
      </tr>`;
    }).join('');
      
    dom.churchList.innerHTML = `
      <div class="church-list-header">🏠 ${churchName} <span style="font-size:0.9rem; font-weight:400; color:#64748b; margin-left:auto;">${members.length}명</span></div>
      <div class="member-table-container">
        <table>
          <thead><tr><th>이름</th><th>유형</th><th>설명</th><th style="text-align:right;">관리</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
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

  function analyzeAndRenderCommunity() {
    const members = currentChurchMembers;
    if (!members || members.length === 0) {
      alert("먼저 [공동체 유형 확인] 버튼을 눌러 데이터를 불러와 주세요.");
      return;
    }
    if (typeof typeResults === 'undefined') { alert("데이터 로드 중 오류가 발생했습니다."); return; }

    const total = members.length;
    const counts = { E:0, I:0, S:0, N:0, T:0, F:0, J:0, P:0 };
    const typeCounts = {};

    members.forEach(m => {
      const t = m.type; 
      if (!t || t.length !== 4) return;
      counts[t[0]]++; counts[t[1]]++; counts[t[2]]++; counts[t[3]]++;
      typeCounts[t] = (typeCounts[t] || 0) + 1;
    });

    let maxVal = 0;
    for (const v of Object.values(typeCounts)) if (v > maxVal) maxVal = v;
    const maxTypes = Object.entries(typeCounts).filter(([t, v]) => v === maxVal).map(([t]) => t);
    const maxTypeDisplay = maxTypes.join(", ");
    const isTie = maxTypes.length > 1;

    const domE = counts.E === counts.I ? "E/I" : (counts.E > counts.I ? "E" : "I");
    const domS = counts.S === counts.N ? "S/N" : (counts.S > counts.N ? "S" : "N");
    const domT = counts.T === counts.F ? "T/F" : (counts.T > counts.F ? "T" : "F");
    const domJ = counts.J === counts.P ? "J/P" : (counts.J > counts.P ? "J" : "P");
    const displayCode = `${domE} - ${domS} - ${domT} - ${domJ}`;

    const lookupCode = (counts.E >= counts.I ? "E" : "I") + (counts.S >= counts.N ? "S" : "N") + 
                       (counts.T >= counts.F ? "T" : "F") + (counts.J >= counts.P ? "J" : "P");

    const topTypeName = typeResults[lookupCode] ? typeResults[lookupCode].nameKo : lookupCode;
    const isHybrid = (counts.E === counts.I) || (counts.S === counts.N) || (counts.T === counts.F) || (counts.J === counts.P);
    const typeBadge = isHybrid ? '<span class="badge badge-balanced" style="font-size:0.75rem; margin-left:6px;">복합/균형</span>' : '';

    let html = `
      <div class="analysis-report-container">
        <div class="analysis-section-flat">
          <div class="analysis-header">📊 우리 공동체 영적 DNA</div>
          <div class="analysis-summary-grid">
            <div class="summary-item">
              <div class="summary-val">${total}명</div>
              <div class="summary-label">분석 인원</div>
            </div>
            <div class="summary-item">
              <div class="summary-val" style="font-size:${isTie ? '1rem' : '1.3rem'}">${maxTypeDisplay}</div>
              <div class="summary-label">최다 유형 (${maxVal}명)</div>
            </div>
          </div>
          <div class="insight-text">
            우리의 대표 성향은 <span class="insight-highlight">${displayCode}</span> 입니다.<br/>
            <div style="margin-top:6px; font-weight:700; color:#1e293b; font-size:1.05rem;">"${topTypeName}" ${typeBadge}</div>
            <div style="margin-top:10px; font-size:0.8rem; color:#94a3b8;">* 에너지 비율에 따른 전체 경향성입니다.</div>
          </div>
        </div>

        <div class="analysis-section-flat">
          <div class="analysis-header">⚖️ 에너지 균형</div>
          <div style="background:#fff; padding:16px; border-radius:12px; border:1px solid #e2e8f0;">
            ${renderBarEnhanced("관계 에너지", "외향 E", counts.E, "내향 I", counts.I, total)}
            ${renderBarEnhanced("인식 스타일", "현실 S", counts.S, "이상 N", counts.N, total)}
            ${renderBarEnhanced("판단 기준", "이성 T", counts.T, "감성 F", counts.F, total)}
            ${renderBarEnhanced("생활 패턴", "계획 J", counts.J, "유연 P", counts.P, total)}
          </div>
        </div>

        <div class="analysis-section-flat">
          <div class="analysis-header">🗣️ 모임 스타일</div>
          <div class="content-box-flat">${getMeetingStyle(counts, total)}</div>
        </div>

        <div class="analysis-section-flat">
          <div class="analysis-header">💎 배려가 필요한 '숨은 보석'</div>
          <div class="content-box-flat" style="background:#fff7ed; border-color:#ffedd5;">${getMinorityCare(counts, total)}</div>
        </div>

        <div class="analysis-section-flat">
          <div class="analysis-header">🌱 성장 가이드</div>
          <div class="content-box-flat" style="background:#f0fdf4; border-color:#dcfce7;">${getDetailedGrowthGuide(counts, total)}</div>
        </div>
        <button id="close-analysis-btn" class="close-analysis-btn">분석 결과 닫기 ✖</button>
      </div>`;

    if (dom.churchAnalysisResult) {
      dom.churchAnalysisResult.innerHTML = html;
      dom.churchAnalysisResult.classList.remove("hidden");
      document.getElementById("close-analysis-btn").addEventListener("click", () => {
        dom.churchAnalysisResult.classList.add("hidden");
        dom.btns.churchSummary.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }

  function renderBarEnhanced(title, leftLabel, leftVal, rightLabel, rightVal, total) {
    const leftPct = Math.round((leftVal / total) * 100);
    const rightPct = 100 - leftPct;
    const gap = Math.abs(leftPct - rightPct);
    let badgeHtml = "";
    if (leftVal === rightVal) badgeHtml = `<span class="balance-badge badge-balanced">완벽한 균형 ✨</span>`;
    else if (gap < 15) badgeHtml = `<span class="balance-badge badge-balanced">황금 밸런스 ⚖️</span>`;

    return `
      <div style="margin-bottom:16px;">
        <div class="analysis-label-row"><span>${title} ${badgeHtml}</span></div>
        <div class="analysis-bar-container">
          <div style="width:${leftPct}%; background:#f43f5e; height:100%; transition: width 1s;"></div>
          <div style="width:${rightPct}%; background:#3b82f6; height:100%; transition: width 1s;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:#6b7280; margin-top:4px;">
          <span>${leftLabel} <strong>${leftVal}명</strong> (${leftPct}%)</span>
          <span>${rightLabel} <strong>${rightVal}명</strong> (${rightPct}%)</span>
        </div>
      </div>`;
  }

  function getMeetingStyle(c, total) {
    let text = "";
    if (c.E === c.I) text += "✨ <strong>활력과 깊이의 균형:</strong> 역동적인 에너지와 차분한 묵상이 공존하는 이상적인 분위기입니다.<br/><br/>";
    else if (c.E > c.I) text += "🎤 <strong>활기차고 에너지가 넘쳐요:</strong> 누군가 먼저 말을 꺼내고 분위기를 주도합니다. 목소리 큰 사람 위주로 흘러가지 않도록 주의하세요.<br/><br/>";
    else text += "☕ <strong>차분하고 깊이가 있어요:</strong> 소그룹으로 깊게 나누는 것을 선호합니다. 침묵을 어색해하지 마세요.<br/><br/>";

    if (c.J === c.P) text += "🤝 <strong>계획과 유연함의 조화:</strong> 큰 틀은 지키되 상황에 맞춰 융통성을 발휘할 줄 압니다.";
    else if (c.J > c.P) text += "📅 <strong>계획대로 착착:</strong> 시작과 끝 시간이 명확하고 정해진 순서대로 진행되는 것을 좋아합니다.";
    else text += "🌊 <strong>그때그때 유연하게:</strong> 순서가 바뀌어도 즐겁게 받아들입니다. 마무리를 잘 챙겨주세요.";
    return text;
  }

  function getMinorityCare(c, total) {
    const minorities = [];
    const threshold = total * 0.4; 
    if (c.I < threshold && c.I > 0) minorities.push("🤫 <strong>내향형(I):</strong> 에너지가 높은 모임에서 기가 빨릴 수 있어요. 생각할 시간을 주세요.");
    if (c.E < threshold && c.E > 0) minorities.push("📣 <strong>외향형(E):</strong> 너무 차분하면 답답할 수 있어요. 에너지를 발산할 기회를 주세요.");
    if (c.S < threshold && c.S > 0) minorities.push("👀 <strong>현실형(S):</strong> 구체적인 적용점을 좋아해요.");
    if (c.N < threshold && c.N > 0) minorities.push("🌈 <strong>직관형(N):</strong> '우리 공동체의 꿈' 같은 깊은 주제를 던져주세요.");
    if (c.F < threshold && c.F > 0) minorities.push("💖 <strong>감정형(F):</strong> '서로의 마음'을 확인받고 싶어 해요.");
    if (c.T < threshold && c.T > 0) minorities.push("🤔 <strong>사고형(T):</strong> 논리적인 이유를 설명해 주세요.");

    if (minorities.length === 0) return "⚖️ <strong>치우침 없이 조화로워요!</strong><br/>다양성을 유지하며 서로 배우는 관계가 되세요.";
    return minorities.join("<br/><br/>");
  }

  function getDetailedGrowthGuide(c, total) {
    const guides = [];
    if (c.E === c.I) guides.push(`<div class="growth-item"><div class="growth-icon">⚖️</div><div><strong>소통의 균형:</strong> 말하기와 듣기의 비율이 좋습니다.</div></div>`);
    else if (c.E > c.I) guides.push(`<div class="growth-item"><div class="growth-icon">👂</div><div><strong>경청의 영성:</strong> 가끔은 '거룩한 침묵'의 시간을 가져보세요.</div></div>`);
    else guides.push(`<div class="growth-item"><div class="growth-icon">🔥</div><div><strong>표현의 용기:</strong> 은혜를 입 밖으로 꺼내어 나누는 용기를 내보세요.</div></div>`);

    if (c.S === c.N) guides.push(`<div class="growth-item"><div class="growth-icon">🌉</div><div><strong>현실과 비전의 다리:</strong> 꿈꾸는 사람과 길을 만드는 사람이 함께 있어 든든합니다.</div></div>`);
    else if (c.S > c.N) guides.push(`<div class="growth-item"><div class="growth-icon">🔭</div><div><strong>거룩한 상상력:</strong> 당장의 문제 해결을 넘어 '큰 그림'을 꿈꿔보세요.</div></div>`);
    else guides.push(`<div class="growth-item"><div class="growth-icon">🧹</div><div><strong>거룩한 디테일:</strong> 꿈을 이루기 위해 오늘 해야 할 '작은 순종'을 놓치지 마세요.</div></div>`);

    if (c.T === c.F) guides.push(`<div class="growth-item"><div class="growth-icon">🤝</div><div><strong>머리와 가슴의 조화:</strong> 냉철한 판단과 따뜻한 공감이 어우러졌습니다.</div></div>`);
    else if (c.T > c.F) guides.push(`<div class="growth-item"><div class="growth-icon">💓</div><div><strong>공감의 온도:</strong> 정답을 전하기 전에 따뜻한 눈빛으로 마음을 녹여주세요.</div></div>`);
    else guides.push(`<div class="growth-item"><div class="growth-icon">⚖️</div><div><strong>분별의 지혜:</strong> 건강한 관계를 위해 '사랑 안에서 진리'를 말해보세요.</div></div>`);

    if (c.J === c.P) guides.push(`<div class="growth-item"><div class="growth-icon">⚓</div><div><strong>안정과 모험:</strong> 체계적인 안정감과 유연함이 모두 있습니다.</div></div>`);
    else if (c.J > c.P) guides.push(`<div class="growth-item"><div class="growth-icon">🕊️</div><div><strong>여백의 미:</strong> 계획대로 되지 않는 의외성을 기쁨으로 받아들여 보세요.</div></div>`);
    else guides.push(`<div class="growth-item"><div class="growth-icon">🧱</div><div><strong>질서의 능력:</strong> 약속 시간과 규칙 같은 작은 질서를 지킬 때 신뢰가 단단해집니다.</div></div>`);
    return guides.join("");
  }

  /* =========================================
     6. 이벤트 리스너 설정
     ========================================= */
  
  // 버튼 이벤트 연결
  if (dom.btns.start) {
    dom.btns.start.addEventListener("click", () => {
      localStorage.removeItem('faith_result_v1');
      if (typeof originalQuestions === 'undefined') { alert("데이터 로딩 중..."); return; }
      questions = shuffle(originalQuestions);
      for (let k in answers) delete answers[k];
      currentIndex = 0; myResultType = null; currentViewType = null;

      dom.verse.box.classList.add("hidden");
      dom.bible.box.classList.add("hidden");
      dom.sections.intro.classList.add("hidden");
      dom.sections.test.classList.remove("hidden");
      dom.sections.result.classList.add("hidden");
      renderQuestion();
    });
  }

  if (dom.btns.back) {
    dom.btns.back.addEventListener("click", () => {
      if (currentIndex > 0) { currentIndex--; renderQuestion(); } 
      else { dom.sections.test.classList.add("hidden"); dom.sections.intro.classList.remove("hidden"); }
    });
  }
  if (dom.btns.skip) dom.btns.skip.addEventListener("click", goNextOrResult);

  if (dom.btns.restart) {
    dom.btns.restart.addEventListener("click", () => {
      if(confirm("초기화 하시겠습니까?")) {
        localStorage.removeItem('faith_result_v1');
        myResultType = null; currentViewType = null;
        dom.sections.result.classList.add("hidden");
        dom.sections.intro.classList.remove("hidden");
      }
    });
  }

  // 공유하기
  if (dom.btns.share) {
    dom.btns.share.addEventListener("click", async () => {
      const targetType = myResultType || currentViewType;
      if (!targetType) return alert("공유할 유형이 없습니다.");
      
      const baseUrl = "https://faiths.life/";
      const data = typeResults[targetType];
      const shareTitle = "FAITH MBTI 신앙 유형 테스트";
      const shareDesc = `나의 유형은 ${targetType} (${data.nameKo}) 입니다.`;

      if (typeof Kakao !== "undefined" && Kakao.isInitialized && Kakao.isInitialized()) {
        try {
          Kakao.Share.sendDefault({
            objectType: "feed",
            content: {
              title: shareTitle, description: shareDesc,
              imageUrl: "https://csy870617.github.io/faith-mbti/images/thumbnail.jpg",
              link: { mobileWebUrl: baseUrl, webUrl: baseUrl },
            },
            buttons: [{ title: "테스트 하러가기", link: { mobileWebUrl: baseUrl, webUrl: baseUrl } }]
          });
          return; 
        } catch (e) { console.error(e); }
      }
      
      if (navigator.share) {
        try { await navigator.share({ title: shareTitle, text: shareDesc, url: baseUrl }); return; } catch(e) {}
      }
      
      const success = await copyToClipboard(`${shareTitle}\n${shareDesc}\n${baseUrl}`);
      alert(success !== false ? "링크가 복사되었습니다." : "링크 복사에 실패했습니다.");
    });
  }

  // 교회 섹션 관련
  if (dom.btns.church && dom.sections.church) {
    dom.btns.church.addEventListener("click", () => {
      history.pushState({ page: "church" }, "", "#church");
      dom.sections.intro.classList.add("hidden");
      dom.sections.test.classList.add("hidden");
      dom.sections.result.classList.add("hidden");
      dom.sections.church.classList.remove("hidden");
    });
  }
  window.addEventListener("popstate", () => {
    if (!dom.sections.church.classList.contains("hidden")) {
      dom.sections.church.classList.add("hidden");
      if (myResultType) dom.sections.result.classList.remove("hidden");
      else dom.sections.intro.classList.remove("hidden");
    }
  });
  if (dom.btns.churchClose) {
    dom.btns.churchClose.addEventListener("click", () => {
      if (location.hash === "#church") history.back(); 
      else {
        dom.sections.church.classList.add("hidden");
        if (myResultType) dom.sections.result.classList.remove("hidden");
        else dom.sections.intro.classList.remove("hidden");
      }
    });
  }

  if (dom.btns.memberSave) {
    dom.btns.memberSave.addEventListener("click", async () => {
      try {
        await saveMyResultToChurch(dom.inputs.memberName.value, dom.inputs.memberChurch.value, dom.inputs.memberPw.value);
        alert("저장되었습니다."); dom.inputs.memberName.value = "";
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
        
        // [수정] 데이터 로드 성공 시 하단 분석/초대 버튼 및 공유 버튼 표시
        if (dom.churchAfterActions) dom.churchAfterActions.classList.remove("hidden");
        if (dom.btns.churchCopy) dom.btns.churchCopy.classList.remove("hidden");

      } catch (e) { 
        alert(e.message); 
        // 실패 시 숨김
        if (dom.churchAfterActions) dom.churchAfterActions.classList.add("hidden");
        if (dom.btns.churchCopy) dom.btns.churchCopy.classList.add("hidden");
      }
    });
  }

  if (dom.btns.churchAnalysis) dom.btns.churchAnalysis.addEventListener("click", analyzeAndRenderCommunity);

  if (dom.churchViewToggle && dom.churchViewContent) {
    dom.churchViewToggle.addEventListener("click", () => {
      const isHidden = dom.churchViewContent.classList.contains("hidden");
      dom.churchViewContent.classList.toggle("hidden");
      dom.churchViewToggle.querySelector("h3").innerText = isHidden ? "우리교회 신앙 유형 모아보기 ▲" : "우리교회 신앙 유형 모아보기 ▼";
    });
  }

  // [수정] 초대 링크 복사 핸들러 (상단, 하단 버튼 공통 사용)
  const handleInvite = async () => {
    const baseUrl = "https://faiths.life";
    const gName = dom.inputs.viewChurch.value.trim() || "우리교회";
    const shareTitle = `${gName} 신앙 유형 모임 초대`;
    const shareDesc = "함께 신앙 유형을 검사하고 결과를 나눠보세요!";

    if (typeof Kakao !== "undefined" && Kakao.isInitialized && Kakao.isInitialized()) {
      try {
        Kakao.Share.sendDefault({
          objectType: "feed",
          content: { title: shareTitle, description: shareDesc, imageUrl: "https://csy870617.github.io/faith-mbti/images/thumbnail.jpg", link: { mobileWebUrl: baseUrl, webUrl: baseUrl } },
          buttons: [{ title: "모임 참여하기", link: { mobileWebUrl: baseUrl, webUrl: baseUrl } }]
        });
        return; 
      } catch (e) { console.error(e); }
    }
    if (navigator.share) { try { await navigator.share({ title: shareTitle, text: shareDesc, url: baseUrl }); return; } catch(e) {} }
    const success = await copyToClipboard(`${shareTitle}\n${shareDesc}\n${baseUrl}`);
    alert(success ? "초대 링크가 복사되었습니다." : "복사에 실패했습니다.");
  };

  if (dom.btns.invite) dom.btns.invite.addEventListener("click", handleInvite);
  if (dom.btns.inviteBottom) dom.btns.inviteBottom.addEventListener("click", handleInvite); // [추가]

  // 그룹 결과 복사
  if (dom.btns.churchCopy) {
    dom.btns.churchCopy.addEventListener("click", async () => {
      const members = currentChurchMembers;
      if (!members || !members.length) return alert("복사할 데이터가 없습니다.");
      const gName = dom.inputs.viewChurch.value.trim() || "우리교회";
      const header = `${gName} - 신앙 유형 결과`;
      let body = "";
      members.forEach(m => {
        const tData = (typeof typeResults !== 'undefined') ? typeResults[m.type] : null;
        body += `이름: ${m.name}\n유형: ${m.type}\n설명: ${tData ? tData.strengthShort : (m.shortText || "")}\n\n`;
      });
      const fullText = `${header}\n\n${body}`;
      
      if (typeof Kakao !== "undefined" && Kakao.isInitialized && Kakao.isInitialized()) {
        try {
          Kakao.Share.sendDefault({ objectType: "text", text: fullText, link: { mobileWebUrl: "https://faiths.life", webUrl: "https://faiths.life" }, buttonTitle: "검사하러 가기" });
          return; 
        } catch (e) { console.error(e); }
      }
      if (navigator.share) { try { await navigator.share({ title: header, text: "\n\n" + body }); return; } catch(e) {} }
      const success = await copyToClipboard(fullText);
      alert(success ? "그룹 결과가 복사되었습니다." : "복사에 실패했습니다.");
    });
  }

  // 기타 버튼들
  if (dom.btns.todayVerse) {
    dom.btns.todayVerse.addEventListener("click", () => {
      const type = currentViewType || myResultType;
      if (!type) return;
      const data = typeResults[type];
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
  if (dom.btns.goResult) {
    dom.btns.goResult.addEventListener("click", () => {
      localStorage.removeItem('faith_result_v1');
      myResultType = null; currentViewType = "ENFJ";
      dom.sections.intro.classList.add("hidden");
      dom.sections.test.classList.add("hidden");
      dom.sections.result.classList.remove("hidden");
      renderResult("ENFJ");
      renderAxisUpgraded({ EI: 15, SN: 15, TF: 15, JP: 15 });
      renderDetailScores({ E: 20, I: 5, S: 20, N: 5, T: 20, F: 5, J: 20, P: 5 });
      renderMatchCards("ENFJ");
      buildOtherTypesGrid();
    });
  }

  // 폰트 조절
  let currentFontScale = parseFloat(localStorage.getItem("faith_font_scale")) || 1.0;
  function applyFontSize(scale) {
    scale = Math.round(scale * 10) / 10;
    document.documentElement.style.fontSize = `${Math.round(scale * 120)}%`;
    localStorage.setItem("faith_font_scale", scale);
    currentFontScale = scale;
  }
  applyFontSize(currentFontScale);

  if (dom.btns.fontUp) dom.btns.fontUp.addEventListener("click", () => { if (currentFontScale < 1.3) applyFontSize(currentFontScale + 0.1); });
  if (dom.btns.fontDown) dom.btns.fontDown.addEventListener("click", () => { if (currentFontScale > 0.7) applyFontSize(currentFontScale - 0.1); });
  if (dom.btns.fontReset) dom.btns.fontReset.addEventListener("click", () => applyFontSize(1.0));

  /* =========================================
     7. 초기 로드 (저장된 결과 확인)
     ========================================= */
  const savedData = localStorage.getItem('faith_result_v1');
  if (savedData) {
    try {
      const data = JSON.parse(savedData);
      if (data.type && data.scores && data.axisScores) {
        myResultType = data.type; currentViewType = data.type;
        dom.sections.intro.classList.add("hidden");
        dom.sections.test.classList.add("hidden");
        dom.sections.result.classList.remove("hidden");
        renderResult(data.type);
        renderAxisUpgraded(data.axisScores);
        renderDetailScores(data.scores);
        renderMatchCards(data.type);
        buildOtherTypesGrid();
      }
    } catch (e) { localStorage.removeItem('faith_result_v1'); }
  }

  const savedChurch = localStorage.getItem('faith_church_name');
  const savedPw = localStorage.getItem('faith_church_pw');
  if (savedChurch && savedPw && dom.inputs.rememberCreds) {
    dom.inputs.viewChurch.value = savedChurch;
    dom.inputs.viewPw.value = savedPw;
    dom.inputs.rememberCreds.checked = true;
  }

});