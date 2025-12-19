// app.js - 메인 엔트리 포인트
import * as Utils from './utils.js';
import * as Core from './core.js';
import * as Church from './church.js';

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================
     0. 화면 전환 시 스크롤 초기화 (먹통 방지 핵심 함수)
     ========================================= */
  function scrollToTop() {
    // 즉시 스크롤 이동
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    // 모바일 브라우저 주소창/레이아웃 재계산 딜레이 대응
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  }

  /* =========================================
     1. DOM 요소 캐싱
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
      churchMainClose: document.getElementById("church-main-close-btn"), 
      memberSave: document.getElementById("member-save-btn"),
      churchSummary: document.getElementById("church-summary-btn"),
      churchAnalysis: document.getElementById("church-analysis-btn"), 
      inviteBottom: document.getElementById("invite-btn-bottom"),
      churchCopy: document.getElementById("church-copy-btn"),
      fontUp: document.getElementById("font-up"),
      fontDown: document.getElementById("font-down"),
      fontReset: document.getElementById("font-reset"),
      
      groupCreate: document.getElementById("group-create-btn"),
      groupLogin: document.getElementById("group-login-btn"),
      groupAuthClose: document.getElementById("church-auth-close-btn")
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
      setupChurch: document.getElementById("setup-church-input"),
      setupPw: document.getElementById("setup-password-input"),
      autoLogin: document.getElementById("auto-login-check") 
    },
    churchList: document.getElementById("church-result-list"),
    churchAnalysisResult: document.getElementById("church-analysis-result"),
    churchCommunityArea: document.getElementById("church-community-area"),
    churchAfterActions: document.getElementById("church-after-actions"),
    churchAuthCard: document.getElementById("church-auth-card"),
    churchMainContent: document.getElementById("church-main-content")
  };

  let currentIndex = 0;
  let questions = []; 
  const answers = {};
  let myResultType = null;
  let currentViewType = null;
  let currentChurchMembers = []; 

  Core.initFontControl(dom);

  /* =========================================
     2. 브라우저 뒤로가기(popstate) 핸들링
     ========================================= */
  window.addEventListener('popstate', (event) => {
    // 1. 검사 화면에서 뒤로가기
    if (!dom.sections.test.classList.contains("hidden")) {
      if (currentIndex > 0) {
        currentIndex--;
        // 문항 이동 시에는 스크롤을 굳이 맨 위로 안 올려도 되지만, 
        // 깔끔하게 하려면 scrollToTop()을 호출해도 됩니다.
        Core.renderQuestion(dom, questions, currentIndex, answers, goNextOrResult);
        // 강제로 상태 푸시 (페이지 이탈 방지)
        history.pushState({ page: "test" }, "", "#test");
      } else {
        // 첫 문항 -> 홈으로
        dom.sections.test.classList.add("hidden");
        dom.sections.intro.classList.remove("hidden");
        scrollToTop(); // [필수] 홈으로 갈 때 스크롤 초기화
      }
    } 
    // 2. 결과 화면 -> 홈으로
    else if (!dom.sections.result.classList.contains("hidden")) {
      dom.sections.result.classList.add("hidden");
      dom.sections.intro.classList.remove("hidden");
      scrollToTop(); // [필수]
    }
    // 3. 교회 화면 -> 홈 또는 결과
    else if (!dom.sections.church.classList.contains("hidden")) {
      dom.sections.church.classList.add("hidden");
      if (myResultType) {
        dom.sections.result.classList.remove("hidden");
      } else {
        dom.sections.intro.classList.remove("hidden");
      }
      scrollToTop(); // [필수]
    }
  });


  /* =========================================
     3. 로직 함수들
     ========================================= */
  function goNextOrResult() {
    if (currentIndex < questions.length - 1) {
      // 다음 문항
      history.pushState({ page: "test" }, "", "#test");
      currentIndex++;
      Core.renderQuestion(dom, questions, currentIndex, answers, goNextOrResult);
    } else {
      // 결과 보기
      dom.sections.test.classList.add("hidden");
      dom.sections.result.classList.remove("hidden");
      
      scrollToTop(); // [필수] 결과 화면 진입 시 최상단으로 이동

      history.pushState({ page: "result" }, "", "#result");

      const { type, scores, axisScores } = Core.calculateResult(window.originalQuestions, answers);
      
      const resultData = {
        type: type, scores: scores, axisScores: axisScores, date: new Date().getTime()
      };
      localStorage.setItem('faith_result_v1', JSON.stringify(resultData));

      myResultType = type;
      currentViewType = type;

      Core.renderResultScreen(dom, type, scores, axisScores);
      buildOtherTypesGrid();
    }
  }

  function buildOtherTypesGrid() {
    if(!dom.result.otherTypes) return;
    if (typeof window.typeResults === 'undefined') return;

    dom.result.otherTypes.innerHTML = "";
    Object.keys(window.typeResults).sort().forEach(t => {
      const btn = document.createElement("button");
      btn.className = "btn-type";
      btn.dataset.type = t;
      btn.innerHTML = `<strong>${t}</strong>`;
      btn.addEventListener("click", () => {
        currentViewType = t;
        Core.renderResultScreen(dom, t, 
          { E:0,I:0,S:0,N:0,T:0,F:0,J:0,P:0 }, 
          { EI:0,SN:0,TF:0,JP:0 } 
        );
        scrollToTop(); // [선택] 다른 유형 보기 클릭 시에도 맨 위로 올려줌
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

  function proceedToGroup(cName, cPw) {
    dom.inputs.memberChurch.value = cName;
    dom.inputs.memberPw.value = cPw;
    dom.inputs.viewChurch.value = cName;
    dom.inputs.viewPw.value = cPw;

    if (dom.inputs.autoLogin && dom.inputs.autoLogin.checked) {
      localStorage.setItem('faith_church_name', cName);
      localStorage.setItem('faith_church_pw', cPw);
    } else {
      localStorage.removeItem('faith_church_name');
      localStorage.removeItem('faith_church_pw');
    }

    dom.churchAuthCard.classList.add("hidden");
    dom.churchMainContent.classList.remove("hidden");
    dom.churchCommunityArea.classList.add("hidden");
    
    scrollToTop(); // [필수] 그룹 화면 진입 시 스크롤 초기화
  }


  /* =========================================
     4. 이벤트 리스너 설정
     ========================================= */

  // 그룹 생성
  if (dom.btns.groupCreate) {
    dom.btns.groupCreate.addEventListener("click", async () => {
      const cName = dom.inputs.setupChurch.value.trim();
      const cPw = dom.inputs.setupPw.value.trim();

      if (!cName || !cPw) return alert("그룹명과 비밀번호를 모두 입력해 주세요.");
      if (cName === cPw) return alert("비밀번호를 다르게 입력해주세요.");

      try {
        const { db, fs } = await Church.ensureFirebase();
        const docRef = fs.doc(db, "faith_churches", cName);
        const snap = await fs.getDoc(docRef);

        if (snap.exists()) {
          alert("이미 존재하는 그룹입니다. 그룹명 또는 비밀번호를 바꿔주세요.");
          return;
        }

        await fs.setDoc(docRef, {
          churchName: cName,
          password: cPw,
          createdAt: fs.serverTimestamp ? fs.serverTimestamp() : Date.now()
        });

        alert(`'${cName}' 그룹이 생성되었습니다!`);
        proceedToGroup(cName, cPw);

      } catch (e) {
        console.error(e);
        alert("오류가 발생했습니다: " + e.message);
      }
    });
  }

  // 그룹 로그인
  if (dom.btns.groupLogin) {
    dom.btns.groupLogin.addEventListener("click", async () => {
      const cName = dom.inputs.setupChurch.value.trim();
      const cPw = dom.inputs.setupPw.value.trim();

      if (!cName || !cPw) return alert("그룹명과 비밀번호를 입력해 주세요.");

      try {
        const { db, fs } = await Church.ensureFirebase();
        const docRef = fs.doc(db, "faith_churches", cName);
        const snap = await fs.getDoc(docRef);

        if (!snap.exists()) {
          alert("존재하지 않는 그룹입니다. '그룹 생성'을 먼저 진행해 주세요.");
          return;
        }
        if (snap.data().password !== cPw) {
          alert("비밀번호가 틀렸습니다.");
          return;
        }
        proceedToGroup(cName, cPw);
      } catch (e) {
        console.error(e);
        alert("오류가 발생했습니다.");
      }
    });
  }

  // 그룹 로그인창 닫기
  if (dom.btns.groupAuthClose) {
    dom.btns.groupAuthClose.addEventListener("click", () => {
      if (location.hash === "#church") {
         history.back();
      } else {
         dom.sections.church.classList.add("hidden");
         if (myResultType) {
           dom.sections.result.classList.remove("hidden");
         } else {
           dom.sections.intro.classList.remove("hidden");
         }
         scrollToTop();
      }
    });
  }

  // 검사 시작
  if (dom.btns.start) {
    dom.btns.start.addEventListener("click", () => {
      // 히스토리 추가
      history.pushState({ page: "test" }, "", "#test");

      localStorage.removeItem('faith_result_v1');
      if (typeof window.originalQuestions === 'undefined') { alert("데이터 로딩 중..."); return; }
      
      questions = Utils.shuffle(window.originalQuestions);
      for (let k in answers) delete answers[k];
      currentIndex = 0; myResultType = null; currentViewType = null;

      dom.verse.box.classList.add("hidden");
      dom.bible.box.classList.add("hidden");
      
      // 화면 전환
      dom.sections.intro.classList.add("hidden");
      dom.sections.test.classList.remove("hidden");
      dom.sections.result.classList.add("hidden");
      
      scrollToTop(); // [필수] 검사 시작 시 최상단
      Core.renderQuestion(dom, questions, currentIndex, answers, goNextOrResult);
    });
  }

  // 뒤로가기 버튼 (브라우저 히스토리 이용)
  if (dom.btns.back) {
    dom.btns.back.addEventListener("click", () => {
      history.back(); 
    });
  }
  
  // 건너뛰기
  if (dom.btns.skip) dom.btns.skip.addEventListener("click", goNextOrResult);

  // 재시작 (처음으로)
  if (dom.btns.restart) {
    dom.btns.restart.addEventListener("click", () => {
      if(confirm("초기화 하시겠습니까?")) {
        localStorage.removeItem('faith_result_v1');
        myResultType = null; currentViewType = null;
        
        dom.sections.result.classList.add("hidden");
        dom.sections.intro.classList.remove("hidden");
        
        scrollToTop(); // [필수] 홈으로 복귀 시 스크롤 초기화
        
        // 홈으로 갈 때 해시 제거
        history.replaceState(null, "", " "); 
      }
    });
  }

  // 공유하기
  if (dom.btns.share) {
    dom.btns.share.addEventListener("click", async () => {
      const targetType = myResultType || currentViewType;
      if (!targetType) return alert("공유할 유형이 없습니다.");
      
      const baseUrl = "https://faiths.life/";
      const data = window.typeResults[targetType];
      const shareTitle = "FAITH MBTI 신앙 유형 테스트";
      const shareDesc = `나의 유형은 ${targetType} (${data.nameKo}) 입니다.`;
      const imageUrl = "https://csy870617.github.io/faith-mbti/images/thumbnail.jpg";

      if (typeof Kakao !== "undefined" && Kakao.isInitialized && Kakao.isInitialized()) {
        try {
          Kakao.Share.sendDefault({
            objectType: "feed",
            content: {
              title: shareTitle,
              description: shareDesc,
              imageUrl: imageUrl,
              link: { mobileWebUrl: baseUrl, webUrl: baseUrl },
            },
            buttons: [{ title: "테스트 하러가기", link: { mobileWebUrl: baseUrl, webUrl: baseUrl } }]
          });
          return;
        } catch (e) { console.error("카카오 공유 오류", e); }
      }
      if (navigator.share) { try { await navigator.share({ title: shareTitle, text: shareDesc, url: baseUrl }); return; } catch(e) {} }
      const success = await Utils.copyToClipboard(`${shareTitle}\n${shareDesc}\n${baseUrl}`);
      alert(success !== false ? "링크가 복사되었습니다." : "링크 복사에 실패했습니다.");
    });
  }

  // 교회(그룹) 버튼
  if (dom.btns.church && dom.sections.church) {
    dom.btns.church.addEventListener("click", () => {
      history.pushState({ page: "church" }, "", "#church");
      
      dom.sections.intro.classList.add("hidden");
      dom.sections.test.classList.add("hidden");
      dom.sections.result.classList.add("hidden");
      dom.sections.church.classList.remove("hidden");
      
      scrollToTop(); // [필수] 교회 섹션 진입 시 스크롤 초기화

      dom.churchAuthCard.classList.remove("hidden");
      dom.churchMainContent.classList.add("hidden");
    });
  }

  // 교회 메인 닫기
  if (dom.btns.churchMainClose) {
    dom.btns.churchMainClose.addEventListener("click", () => {
      if (location.hash === "#church") {
         history.back();
      } else {
         dom.sections.church.classList.add("hidden");
         if (myResultType) {
           dom.sections.result.classList.remove("hidden");
         } else {
           dom.sections.intro.classList.remove("hidden");
         }
         scrollToTop();
      }
    });
  }

  // 내 결과 저장하기
  if (dom.btns.memberSave) {
    dom.btns.memberSave.addEventListener("click", async () => {
      try {
        await Church.saveMyResultToChurch(
          dom.inputs.memberName.value, 
          dom.inputs.memberChurch.value, 
          dom.inputs.memberPw.value,
          currentViewType || myResultType
        );
        alert("저장되었습니다."); dom.inputs.memberName.value = "";
      } catch (e) { alert(e.message); }
    });
  }
  
  // 공동체 유형 확인 (리스트 불러오기)
  if (dom.btns.churchSummary) {
    dom.btns.churchSummary.addEventListener("click", async () => {
      if (!dom.churchCommunityArea.classList.contains("hidden")) {
        dom.churchCommunityArea.classList.add("hidden");
        return;
      }

      try {
        const { churchName, members } = await Church.loadChurchMembers(dom.inputs.viewChurch.value, dom.inputs.viewPw.value);
        currentChurchMembers = members;
        
        dom.churchCommunityArea.classList.remove("hidden");
        // 리스트가 펼쳐지면서 화면이 길어지므로 스크롤 체크는 브라우저에게 맡김 (Native Scroll)

        Church.renderChurchList(dom, churchName, members, async (btn) => {
           const pw = prompt("우리교회 비밀번호를 입력해 주세요.");
           if (!pw) return;
           try {
             await Church.deleteChurchMember(btn.dataset.church, pw, btn.dataset.id);
             alert("삭제되었습니다.");
             const refreshed = await Church.loadChurchMembers(btn.dataset.church, pw);
             currentChurchMembers = refreshed.members;
             Church.renderChurchList(dom, refreshed.churchName, refreshed.members, (b) => btn.click()); 
           } catch (e) { alert(e.message); }
        });

        if (dom.churchAfterActions) dom.churchAfterActions.classList.remove("hidden");

      } catch (e) { 
        alert(e.message); 
        dom.churchCommunityArea.classList.add("hidden");
      }
    });
  }

  // 공동체 분석 버튼
  if (dom.btns.churchAnalysis) {
    dom.btns.churchAnalysis.addEventListener("click", () => {
      Church.analyzeAndRenderCommunity(dom, currentChurchMembers);
      // 분석 결과가 나오면 스크롤이 길어질 수 있음 -> 사용자가 직접 스크롤
    });
  }

  // 하단 초대 버튼
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
    const success = await Utils.copyToClipboard(`${shareTitle}\n${shareDesc}\n${baseUrl}`);
    alert(success ? "초대 링크가 복사되었습니다." : "복사에 실패했습니다.");
  };
  if (dom.btns.inviteBottom) dom.btns.inviteBottom.addEventListener("click", handleInvite);

  // 결과 텍스트 복사
  if (dom.btns.churchCopy) {
    dom.btns.churchCopy.addEventListener("click", async () => {
      const members = currentChurchMembers;
      if (!members || !members.length) return alert("복사할 데이터가 없습니다.");
      const gName = dom.inputs.viewChurch.value.trim() || "우리교회";
      const header = `${gName} - 신앙 유형 결과`;
      let body = "";
      members.forEach(m => {
        const tData = (typeof window.typeResults !== 'undefined') ? window.typeResults[m.type] : null;
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
      const success = await Utils.copyToClipboard(fullText);
      alert(success ? "그룹 결과가 복사되었습니다." : "복사에 실패했습니다.");
    });
  }

  // 오늘의 말씀 보기
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
  
  // 성경 인물 보기/닫기
  if (dom.btns.bibleToggle) {
    dom.btns.bibleToggle.addEventListener("click", () => {
      const isHidden = dom.bible.box.classList.contains("hidden");
      dom.bible.box.classList.toggle("hidden");
      dom.btns.bibleToggle.textContent = isHidden ? "📖 성경 인물 닫기" : "📖 성경 인물 보기";
    });
  }
  
  // 결과 페이지 미리보기 (개발용/바로가기)
  if (dom.btns.goResult) {
    dom.btns.goResult.addEventListener("click", () => {
      localStorage.removeItem('faith_result_v1');
      myResultType = null; currentViewType = "ENFJ";
      
      dom.sections.intro.classList.add("hidden");
      dom.sections.test.classList.add("hidden");
      dom.sections.result.classList.remove("hidden");
      
      scrollToTop(); // [필수]
      
      history.pushState({ page: "result" }, "", "#result");
      
      const sampleScores = { E: 20, I: 5, S: 20, N: 5, T: 20, F: 5, J: 20, P: 5 };
      const sampleAxis = { EI: 15, SN: 15, TF: 15, JP: 15 };
      Core.renderResultScreen(dom, "ENFJ", sampleScores, sampleAxis);
      buildOtherTypesGrid();
    });
  }

  // 저장된 결과 불러오기
  const savedData = localStorage.getItem('faith_result_v1');
  if (savedData) {
    try {
      const data = JSON.parse(savedData);
      if (data.type && data.scores && data.axisScores) {
        myResultType = data.type; currentViewType = data.type;
        
        dom.sections.intro.classList.add("hidden");
        dom.sections.test.classList.add("hidden");
        dom.sections.result.classList.remove("hidden");
        
        // 새로고침해도 스크롤은 위로
        scrollToTop(); 

        if (location.hash !== "#result") history.replaceState({ page: "result" }, "", "#result");

        Core.renderResultScreen(dom, data.type, data.scores, data.axisScores);
        buildOtherTypesGrid();
      }
    } catch (e) { localStorage.removeItem('faith_result_v1'); }
  }

  // 저장된 교회 로그인 정보 불러오기
  const savedChurch = localStorage.getItem('faith_church_name');
  const savedPw = localStorage.getItem('faith_church_pw');
  if (savedChurch && savedPw) {
    if (dom.inputs.setupChurch) dom.inputs.setupChurch.value = savedChurch;
    if (dom.inputs.setupPw) dom.inputs.setupPw.value = savedPw;
    if (dom.inputs.autoLogin) dom.inputs.autoLogin.checked = true;
  }
});