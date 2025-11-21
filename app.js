/**************************************************
 *  Faith-MBTI Test – app.js (완성 버전)
 *  - 40문항
 *  - 16유형 풍성 설명
 *  - 성장 포인트 아래 성경 인물
 *  - 성경 인물/오늘의 말씀 버튼 클릭 열기
 *  - 4축 분포 그래프 + 세부 점수
 **************************************************/

/* 1. 질문 데이터 (40문항) */
const originalQuestions = [
  // E / I — 관계 에너지, 나눔 스타일
  { id: "EI_E1", text: "예배가 끝나면 ‘오늘 은혜 나눌 사람 누구 없나?’ 하며 자연스럽게 사람을 찾는다.", axis: "EI", side: "E" },
  { id: "EI_I1", text: "예배가 끝나면 사람들과 섞이기보다 조용히 혼자 여운을 느끼고 싶다.", axis: "EI", side: "I" },

  { id: "EI_E2", text: "새로운 소그룹에 들어가면 어색한 분위기를 풀려고 먼저 말을 거는 편이다.", axis: "EI", side: "E" },
  { id: "EI_I2", text: "새로운 소그룹에 들어가면 먼저 분위기를 지켜보다가 천천히 참여하는 편이다.", axis: "EI", side: "I" },

  { id: "EI_E3", text: "하루에 사람을 거의 못 만나면 ‘누군가와 얘기하고 싶다’는 생각이 든다.", axis: "EI", side: "E" },
  { id: "EI_I3", text: "사람을 많이 만난 날에는 반드시 혼자만의 충전 시간이 필요하다.", axis: "EI", side: "I" },

  { id: "EI_E4", text: "신앙 고민이 생기면 혼자 결정하기보다 누군가와 상의하고 싶다.", axis: "EI", side: "E" },
  { id: "EI_I4", text: "신앙 고민이 생기면 먼저 내 안에서 충분히 정리한 뒤에 나누고 싶다.", axis: "EI", side: "I" },

  { id: "EI_E5", text: "새로운 사역 제안이 오면 ‘재밌겠다, 해보자!’라는 마음이 먼저 든다.", axis: "EI", side: "E" },
  { id: "EI_I5", text: "새로운 사역 제안이 오면 나와 맞는지, 감당 가능할지부터 조용히 따져보는 편이다.", axis: "EI", side: "I" },

  // S / N — 현실 vs 의미, 현재 vs 미래
  { id: "SN_S1", text: "설교를 들을 때 구체적으로 ‘내 일상에서 무엇을 바꿔야 할지’가 먼저 떠오른다.", axis: "SN", side: "S" },
  { id: "SN_N1", text: "설교를 들을 때 ‘이 말씀이 우리 공동체에 어떤 그림을 그릴까’를 먼저 떠올린다.", axis: "SN", side: "N" },

  { id: "SN_S2", text: "하나님을 경험할 때 작은 사건과 현실 상황의 변화를 통해 체감하는 편이다.", axis: "SN", side: "S" },
  { id: "SN_N2", text: "하나님을 경험할 때 마음속 깊은 생각과 영감, 그림으로 더 강하게 느끼는 편이다.", axis: "SN", side: "N" },

  { id: "SN_S3", text: "새로운 사역 이야기를 들으면 우선 일정, 장소, 역할 같은 구체적인 정보를 알고 싶다.", axis: "SN", side: "S" },
  { id: "SN_N3", text: "새로운 사역 이야기를 들으면 그 사역이 가진 방향성과 의미가 먼저 궁금하다.", axis: "SN", side: "N" },

  { id: "SN_S4", text: "기도할 때 당장 눈앞의 현실 문제들을 하나씩 올려드리는 편이다.", axis: "SN", side: "S" },
  { id: "SN_N4", text: "기도할 때 하나님이 이끄실 미래의 방향과 그림을 상상하며 기도하는 편이다.", axis: "SN", side: "N" },

  { id: "SN_S5", text: "공동체에서 ‘지금 당장 필요한 것’을 채우는 실질적 섬김에 마음이 끌린다.", axis: "SN", side: "S" },
  { id: "SN_N5", text: "공동체에서 ‘앞으로 어떻게 자라나면 좋을지’를 고민하며 비전을 나누는 데 마음이 끌린다.", axis: "SN", side: "N" },

  // T / F — 기준 vs 마음
  { id: "TF_T1", text: "누군가 어려움을 나누면 그 상황을 어떻게 해결할지 방법이 먼저 떠오른다.", axis: "TF", side: "T" },
  { id: "TF_F1", text: "누군가 어려움을 나누면 얼마나 마음이 힘들었을지 먼저 공감부터 된다.", axis: "TF", side: "F" },

  { id: "TF_T2", text: "갈등 상황이 생기면 ‘무엇이 옳고 공정한가’를 먼저 생각한다.", axis: "TF", side: "T" },
  { id: "TF_F2", text: "갈등 상황이 생기면 ‘누가 상처받지 않을까’를 먼저 생각한다.", axis: "TF", side: "F" },

  { id: "TF_T3", text: "말씀을 들을 때 내용의 논리와 구조를 정리하는 편이다.", axis: "TF", side: "T" },
  { id: "TF_F3", text: "말씀을 들을 때 하나님의 마음과 감정이 어떻게 느껴지는지가 더 크게 다가온다.", axis: "TF", side: "F" },

  { id: "TF_T4", text: "사역 회의에서 비효율적이거나 비논리적인 부분이 보이면 바로잡고 싶다.", axis: "TF", side: "T" },
  { id: "TF_F4", text: "사역 회의에서 사람들의 감정과 분위기가 상하지 않는 것이 더 중요하게 느껴진다.", axis: "TF", side: "F" },

  { id: "TF_T5", text: "도움을 요청받았을 때 지금 내가 할 수 있는지 현실적인 가능성을 먼저 판단한다.", axis: "TF", side: "T" },
  { id: "TF_F5", text: "도움을 요청받았을 때 거절하면 상대가 상처받지 않을까를 먼저 떠올린다.", axis: "TF", side: "F" },

  // J / P — 계획 vs 유연
  { id: "JP_J1", text: "큐티나 기도는 가능한 한 일정한 시간과 장소를 정해두고 지키는 편이 편하다.", axis: "JP", side: "J" },
  { id: "JP_P1", text: "큐티나 기도는 정해진 틀보다 상황과 느낌에 맞게 자유롭게 하는 편이 더 편하다.", axis: "JP", side: "P" },

  { id: "JP_J2", text: "사역 준비를 할 때 체크리스트를 만들어 하나씩 완수하는 게 마음이 놓인다.", axis: "JP", side: "J" },
  { id: "JP_P2", text: "사역 준비를 할 때 대략적인 그림만 잡고 상황에 맞춰 유연하게 맞추는 편이다.", axis: "JP", side: "P" },

  { id: "JP_J3", text: "모임 시간이나 계획이 갑자기 바뀌면 스트레스를 좀 받는 편이다.", axis: "JP", side: "J" },
  { id: "JP_P3", text: "모임 시간이나 계획이 갑자기 바뀌어도 ‘뭐, 그렇지’ 하며 금방 적응하는 편이다.", axis: "JP", side: "P" },

  { id: "JP_J4", text: "신앙생활에서도 계획적으로 목표를 세우고 체크하는 것이 중요하다고 느낀다.", axis: "JP", side: "J" },
  { id: "JP_P4", text: "신앙생활에서도 계획보다 그때그때 주어지는 기회와 흐름을 따라가는 편이다.", axis: "JP", side: "P" },

  { id: "JP_J5", text: "한 주를 돌아볼 때 무엇을 얼마나 완료했는지가 중요하게 느껴진다.", axis: "JP", side: "J" },
  { id: "JP_P5", text: "한 주를 돌아볼 때 어떤 경험과 만남이 있었는지가 더 중요하게 느껴진다.", axis: "JP", side: "P" },
];

/* 2. 16유형 결과 데이터 – 풍성 버전 */
const typeResults = {
  ESTJ: {
    nameKo: "진리의 관리자",
    nameEn: "The Builder of Order",
    summary:
      "말씀과 원칙, 구조를 소중히 여기는 실천형 리더입니다. 혼란스러운 상황에서도 기준을 세우고, 공동체가 안전하게 머물 수 있는 질서를 만들어 갑니다. 당신이 있는 자리에는 자연스럽게 책임과 신뢰가 따라오고, 사람들은 ‘저 사람이 있으면 든든하다’는 안도감을 느낍니다.",
    badges: ["질서·실행", "원칙·책임", "공동체 리더십"],
    features: [
      "성경적 기준과 질서를 분명히 세우는 데 강점이 있습니다.",
      "계획·행정·운영을 맡기면 안정감 있게 이끌어 갑니다.",
      "결정을 미루기보다 빨리 정리하고 실행하는 편입니다.",
      "복잡한 일도 단계별로 쪼개어 현실적으로 실천 가능한 계획으로 만드는 능력이 있습니다.",
    ],
    growth: [
      "옳고 그름보다 먼저 사람의 마음을 한 번 더 살펴보는 연습이 필요합니다.",
      "실수와 느린 속도를 허용할 때 공동체가 더 안전함을 느낍니다.",
      "모든 책임을 혼자 지려 하기보다, 하나님께도 맡기고 나누는 연습을 해보세요.",
      "‘규정’과 ‘사람’ 사이에서, 예수님의 마음이 어느 쪽에 가까운지 한 번 더 묻는 습관을 가져 보세요.",
    ],
    bibleCharacter: "모세",
    bibleCharacterDesc:
      "광야에서 율법과 질서를 세우고 백성을 끝까지 인도한 리더. 책임감과 순종의 면에서 ESTJ와 닮았습니다.",
    verseRef: "민수기 12:7",
    verseText: "“내 종 모세는 내 온 집에 충성됨이라.”",
    characterEmoji: "🛡️",
    characterTitle: "광야 진영의 질서 담당 장교",
    characterStory:
      "캠프의 시간표와 역할을 나누고, 예배가 흐트러지지 않도록 보이지 않는 곳에서 끝까지 지키는 사람입니다. 사람들은 잘 알아채지 못하지만, 전기·의자·시간·안전까지 당신이 잡아 준 덕분에 모두가 마음 편안히 예배 자리에 앉을 수 있습니다.",
    ministries: [
      "예배/행정 운영 팀 (시간·순서·전체 구조 관리)",
      "재정·행정·규정 정리",
      "조직·리더 훈련 과정 운영",
      "안전·보안·시설 관리 및 점검",
    ],
    strengthShort:
      "책임감과 실행력이 강하고, 질서를 세우고 유지하는 능력이 탁월합니다.",
    weaknessShort:
      "유연성과 공감 표현이 부족하다는 피드백을 들을 수 있고, 때로는 딱딱하게 느껴질 수 있습니다.",
    warningShort:
      "원칙을 지키다가 사람의 마음을 놓치지 않도록, 말투와 표정을 한 번 더 돌아보면 좋습니다.",
    verseApply:
      "당신의 충성스러운 섬김이 하나님께 기억되고 있으며, 그 무게를 결국 함께 지시는 분도 하나님이심을 기억하게 합니다. 오늘은 ‘내가 책임져야 한다’는 생각보다 ‘주님이 이미 책임지고 계신다’는 사실을 한 번 더 고백해 보세요.",
  },

  ESFJ: {
    nameKo: "사랑의 돌봄자",
    nameEn: "The Nurturing Shepherd",
    summary:
      "관계와 섬김, 환대에 강한 따뜻한 리더입니다. 누가 새로 왔는지, 누가 요즘 힘든지 누구보다 빨리 알아차리고 다가갑니다. 당신의 존재 자체가 공동체에 ‘정서적 안전지대’를 만들어 주며, 사람들로 하여금 교회가 집처럼 느껴지게 합니다.",
    badges: ["돌봄·관계", "환대·케어", "공동체 감수성"],
    features: [
      "새가족이나 낯선 사람도 편안하게 느끼도록 먼저 다가갑니다.",
      "생일, 중요한 일정, 소소한 사정을 잘 기억해 주는 편입니다.",
      "분위기를 부드럽게 만들고 갈등을 완화하는 데 자연스러운 재능이 있습니다.",
      "사람들의 필요를 실제 행동(식사, 연락, 방문 등)으로 채워 주는 데 강점이 있습니다.",
    ],
    growth: [
      "누구의 마음도 놓치고 싶지 않지만, 모든 사람을 다 책임질 수는 없습니다. ‘경계’를 배우는 것이 사랑을 지키는 길이기도 합니다.",
      "갈등 상황에서 진리의 기준을 세우는 일을 지나치게 두려워하지 말고, 부드럽지만 분명하게 말하는 연습이 필요합니다.",
      "내 감정과 피로도 하나님께 솔직하게 올려 드리며, 정기적으로 회복의 시간을 가지면 섬김이 더 오래 갑니다.",
      "‘지금 당장 도와주지 못해도 괜찮다’는 문장을 자신에게 허락해 주면 마음의 부담이 한결 가벼워질 수 있습니다.",
    ],
    bibleCharacter: "마르다",
    bibleCharacterDesc:
      "섬김과 환대에 바빴던 마르다는 공동체의 실제 필요를 누구보다 잘 챙기는 ESFJ와 닮았습니다.",
    verseRef: "요한복음 11:5",
    verseText: "“예수께서… 마르다와 그 동생과 나사로를 사랑하시더니.”",
    characterEmoji: "🫶",
    characterTitle: "따뜻한 식탁을 여는 사람",
    characterStory:
      "배고픈 사람, 어색한 사람을 그냥 지나치지 못하고 먼저 음료를 건네고 자리를 내어주는 사람입니다. 당신이 있는 모임에는 ‘내 자리가 있다’고 느끼는 사람이 점점 늘어나고, 공동체는 당신을 통해 부드러운 숨을 쉽니다.",
    ministries: [
      "새가족 환영·정착 사역",
      "식사·커피·간식 준비 및 환대",
      "소그룹/셀 인도, 돌봄 리더",
      "병문안·격려 메시지·생활 지원 네트워크",
    ],
    strengthShort:
      "사람을 따뜻하게 돌보고, 공동체에 안락하고 포근한 분위기를 만듭니다.",
    weaknessShort:
      "거절과 한계 설정이 어려워, 마음과 몸이 쉽게 지칠 수 있습니다.",
    warningShort:
      "모든 사람의 감정을 책임지려다 보면 정작 나 자신과 하나님과의 깊은 시간을 잃어버릴 수 있습니다.",
    verseApply:
      "예수님이 마르다를 ‘사랑하셨다’는 고백처럼, 바쁘고 지친 당신의 섬김도 그분의 시선 안에 있음을 일깨웁니다. 오늘은 누군가를 챙기기 전에, 먼저 당신 자신에게도 ‘괜찮아, 수고했다’고 말해 주는 시간을 가져 보세요.",
  },

  ENTJ: {
    nameKo: "비전의 개척자",
    nameEn: "The Kingdom Strategist",
    summary:
      "비전과 전략, 추진력을 가진 개척형 리더입니다. ‘이 사역이 더 건강하게, 더 멀리 갈 수 있는 방법은 없을까?’를 늘 고민하며 시스템과 구조를 새롭게 정비합니다. 당신이 나서는 곳에는 방향과 속도가 동시에 생기고, 사람들은 흩어져 있던 에너지가 한 목표를 향해 모이는 경험을 하게 됩니다.",
    badges: ["비전·전략", "개척·확장", "목표 지향"],
    features: [
      "복잡한 상황에서도 핵심 목표를 빠르게 파악하고 정리합니다.",
      "사역에 필요한 자원과 사람을 적재적소에 배치하는 능력이 뛰어납니다.",
      "도전적인 프로젝트도 두려워하기보다 오히려 에너지를 느끼는 편입니다.",
      "문제점이나 비효율을 발견했을 때, 구체적인 대안과 개선안을 함께 제시하는 편입니다.",
    ],
    growth: [
      "속도와 성과뿐 아니라, 사람의 속도와 감정도 함께 챙기는 연습이 필요합니다.",
      "‘지금 당장’이 아니라 ‘하나님의 때’를 기다리는 인내도 리더십의 일부입니다.",
      "실패와 멈춤의 순간에도, 사역의 주인이 하나님이심을 반복해 상기할 필요가 있습니다.",
      "결정 과정에서 혼자 판단하기보다, 최소 한 사람 이상과 함께 분별하는 습관을 길러 보세요.",
    ],
    bibleCharacter: "느헤미야",
    bibleCharacterDesc:
      "무너진 성벽을 재건하기 위해 상황을 파악하고 전략을 세우며, 사람들을 조직한 리더. 비전과 실행이 조화를 이룹니다.",
    verseRef: "느헤미야 2:18",
    verseText: "“일어나 건축하자 하고… 손을 힘써 이 선한 일을 하려 하매.”",
    characterEmoji: "🧭",
    characterTitle: "도시 재건 프로젝트 디렉터",
    characterStory:
      "비어 있는 공간을 보면 ‘이곳을 통해 하나님이 무엇을 하실 수 있을까?’를 떠올리며, 사람을 모으고 역할을 나누어 실제 변화를 만들어내는 사람입니다. 당신의 노트에는 늘 새로운 프로젝트와 구조도가 가득하지만, 결국 그 중심에는 ‘복음이 더 잘 흘러가도록’이라는 한 문장이 자리잡고 있습니다.",
    ministries: [
      "교회/공동체 비전·전략 기획",
      "프로젝트 리드(행사, 캠페인, 개척 등)",
      "리더·사역자 멘토링, 코칭",
      "사역 구조 진단 및 시스템 개선",
    ],
    strengthShort:
      "큰 그림과 전략으로 사람과 조직을 이끄는 능력이 뛰어나고, 실제 변화를 만들어내는 추진력이 있습니다.",
    weaknessShort:
      "사람의 감정보다 목표와 효율을 우선하기 쉬워, 냉정하거나 부담스럽게 느껴질 수 있습니다.",
    warningShort:
      "사역의 성공과 성과가, 한 사람의 눈물과 마음보다 앞서지 않도록 주의해야 합니다.",
    verseApply:
      "하나님이 시작하신 ‘선한 일’은 당신의 리더십을 통해 진행되지만, 완성하시는 분은 결국 하나님이심을 기억하게 합니다. 오늘은 회의 시작 전에, ‘주님, 이 계획의 주인은 저가 아니라 주님이십니다’라고 짧게라도 고백해 보세요.",
  },

  ENFJ: {
    nameKo: "감동의 인도자",
    nameEn: "The Inspirer",
    summary:
      "사람의 마음을 읽고 비전으로 움직이는 감동형 리더입니다. 한 사람의 가능성을 발견하고, 그 사람이 걸어갈 길을 함께 상상하며, 공동체의 분위기를 끌어올리는 데 탁월합니다. 당신이 말할 때 사람들은 단순한 정보를 듣는 것이 아니라, ‘나도 할 수 있다’는 용기를 함께 전달받습니다.",
    badges: ["비전·감동", "공감 리더십", "연합"],
    features: [
      "사람 안의 잠재력과 소명을 잘 발견하고 구체적으로 격려합니다.",
      "스토리와 예시, 비전 캐스팅으로 마음에 불을 붙입니다.",
      "다양한 사람을 연결하고, 팀을 하나로 묶는 능력이 있습니다.",
      "서로 다른 사람들 사이의 갈등을 완화하고, 공통 분모를 찾아 내는 데 능숙합니다.",
    ],
    growth: [
      "모든 사람의 기대를 다 들어주지 못해도 괜찮다는 사실을 받아들이는 연습이 필요합니다.",
      "사람의 반응보다 하나님이 기뻐하시는 중심을 붙잡을 때 리더십이 더 자유로워집니다.",
      "“내가 도와줘야 한다”는 부담보다, “하나님께 맡길 수 있다”는 믿음을 배우면 번아웃을 예방할 수 있습니다.",
      "리더로서의 ‘역할’과 한 사람으로서의 ‘나’를 구분하고, 정기적으로 내 영혼을 돌보는 시간을 확보해 보세요.",
    ],
    bibleCharacter: "바나바",
    bibleCharacterDesc:
      "위로와 격려로 사람을 세우고, 사역자를 발굴하여 세워 준 인도자. 사람을 세우는 ENFJ와 잘 닮아 있습니다.",
    verseRef: "사도행전 11:24",
    verseText: "“바나바는 착한 사람이라 성령과 믿음이 충만한 자라.”",
    characterEmoji: "📣",
    characterTitle: "마음에 불을 붙이는 코치",
    characterStory:
      "‘너의 안에 이런 가능성이 보여’라고 구체적으로 짚어 주며, 누군가의 삶의 방향을 바꾸는 한마디를 남기는 사람입니다. 당신의 작은 격려 메시지 하나가, 누군가에게는 사역을 포기하지 않게 만드는 동력이 되고, 공동체의 분위기를 한 번 더 살아나게 합니다.",
    ministries: [
      "소그룹/셀 리더, 청년/다음세대 리더",
      "양육·멘토링 사역",
      "비전 집회, 리트릿 인도",
      "새가족·청소년 정착 및 연결 사역",
    ],
    strengthShort:
      "사람을 세우고 공동체를 하나로 모으는 인도력이 탁월하며, 비전과 감동을 전염시키는 능력이 있습니다.",
    weaknessShort:
      "모든 사람을 돕고 싶어 하다 보니, 자기 소진에 취약할 수 있고, 거절을 어려워할 수 있습니다.",
    warningShort:
      "타인의 기대와 감정을 모두 품으려다 정작 자신의 영혼과 하나님과의 관계를 돌보지 못할 수 있습니다.",
    verseApply:
      "사람을 격려하고 세우는 당신의 성향이 성령 안에서 사용될 때, 많은 이가 주님께 돌아오게 됨을 보여 줍니다. 오늘은 적어도 한 사람에게, 하나님 안에서 본 그 사람의 가능성을 구체적인 문장으로 써서 보내 보세요.",
  },

  ISTJ: {
    nameKo: "믿음의 수호자",
    nameEn: "The Faithful Keeper",
    summary:
      "전통과 성실, 책임감을 갖고 신앙의 뼈대를 지키는 유형입니다. 말보다 행동, 감정보다 약속과 원칙을 중시하며, 눈에 띄지 않는 자리에서 공동체의 기초를 단단하게 붙들어 줍니다. 당신의 꾸준함은 사람들이 ‘이 교회는 믿을 만하다’고 느끼게 만드는 힘입니다.",
    badges: ["전통·성실", "안정·책임"],
    features: [
      "맡은 일을 끝까지 책임지는 신뢰할 만한 사람입니다.",
      "재정·문서·운영·기록 등 꼼꼼함이 필요한 영역에서 큰 강점을 가집니다.",
      "‘원래 하던 방식’과 검증된 길을 선호하여 안정감을 줍니다.",
      "위기 상황에서도 규정과 절차를 따라 차분히 대응하려는 편입니다.",
    ],
    growth: [
      "새로운 시도와 변화를 무조건 위험하게 여기기보다, 작은 범위에서 시도해 보는 연습이 도움이 됩니다.",
      "감사와 사랑을 마음에만 두지 말고, 말과 따뜻한 표현으로 나눌 때 관계가 더 깊어집니다.",
      "스스로의 피로를 인식하고, 쉼과 휴식도 책임의 일부로 받아들이는 것이 필요합니다.",
      "규칙을 지키는 것만큼, 사람을 세우는 것이 하나님께 중요하다는 사실을 자주 상기해 보세요.",
    ],
    bibleCharacter: "다니엘",
    bibleCharacterDesc:
      "환경이 바뀌어도 기도와 말씀의 삶을 변함없이 지켰던 신실한 자. ISTJ의 꾸준함과 충성을 잘 보여 줍니다.",
    verseRef: "다니엘 6:10",
    verseText: "“전에 하던 대로 하루 세 번… 무릎을 꿇고 기도하며.”",
    characterEmoji: "📘",
    characterTitle: "기도 시간 지키는 기록 담당",
    characterStory:
      "예배와 기도 모임의 시간, 기도 제목, 응답을 꼼꼼히 기록하고 잊지 않고 중보하는 숨은 기둥과 같은 사람입니다. 사람들은 잘 보지 못하지만, 하나님 앞에서는 당신의 수첩 한 장 한 장이 귀한 향기로 기억됩니다.",
    ministries: [
      "재정·문서·기록 사역",
      "예배 준비·운영 백오피스",
      "기도 모임 시간·순서 관리",
      "시설·안전·규정 점검",
    ],
    strengthShort:
      "꾸준함과 신실함으로 공동체를 안정시키고, 보이지 않는 토대를 단단히 세웁니다.",
    weaknessShort:
      "변화와 새로운 방식에 쉽게 마음이 열리지 않을 수 있고, 딱딱하게 보일 수 있습니다.",
    warningShort:
      "익숙한 방식에만 머물다 보면, 하나님이 여시는 새로운 길과 기회를 놓칠 수 있습니다.",
    verseApply:
      "작고 성실한 반복이 하나님 나라에서 큰 열매로 연결될 수 있음을 보여 줍니다. 오늘도 ‘전에 하던 대로’ 지키는 작은 기도와 섬김을 하나님이 기뻐 보고 계신다는 사실을 기억해 보세요.",
  },

  ISFJ: {
    nameKo: "은혜의 섬김자",
    nameEn: "The Quiet Servant",
    summary:
      "조용하지만 끝까지 남아 섬기는 헌신형 제자입니다. 사람들의 필요를 세심하게 살피고, 눈에 잘 띄지 않는 자리를 기쁨으로 감당합니다. 많은 사람이 편안함을 느끼는 배경에는 종종 당신의 수고가 숨어 있고, 하나님은 그 조용한 헌신을 누구보다 깊이 기억하고 계십니다.",
    badges: ["헌신·돌봄", "안정·배려"],
    features: [
      "연약한 사람, 소외되기 쉬운 사람을 자연스럽게 찾아가는 편입니다.",
      "티 내지 않고 필요한 일을 알아서 챙기는 ‘숨은 일꾼’입니다.",
      "한 번 맡은 관계와 사역을 오래, 꾸준히 책임지는 경향이 있습니다.",
      "작은 선물, 메모, 메시지 등 섬세한 표현으로 사람을 위로하는 데 능숙합니다.",
    ],
    growth: [
      "자신의 필요와 한계를 솔직하게 나누는 연습이 필요합니다. ‘나도 돌봄이 필요한 사람’이라는 사실을 기억해 보세요.",
      "도움을 요청하는 것이 약함이나 민폐가 아니라, 건강한 공동체의 모습이라는 것을 배워가는 것이 중요합니다.",
      "감정을 계속 눌러두지 말고, 안전한 사람과 함께 나누는 시간을 가져 보세요.",
      "하나님 앞에서 ‘나는 괜찮다’가 아니라 ‘저도 힘듭니다’라고 고백하는 기도를 허락해 보세요.",
    ],
    bibleCharacter: "룻",
    bibleCharacterDesc:
      "시어머니와 함께 끝까지 남아 헌신한 인물. 조용하지만 깊은 충성과 사랑을 보여 줍니다.",
    verseRef: "룻기 1:16",
    verseText: "“어디로 가시든지 나도 가고… 당신의 하나님이 나의 하나님이 되시리니.”",
    characterEmoji: "🍞",
    characterTitle: "끝까지 남아 설거지하는 동역자",
    characterStory:
      "모임이 끝난 후, 사람들이 다 돌아간 뒤에도 마지막까지 남아 의자를 정리하고, 바닥을 쓸며, 다음 모임을 준비하는 사람입니다. 아무도 부탁하지 않았지만, 당신은 사랑 때문에 그렇게 움직입니다. 그리고 하나님은 그 손길 하나하나에 ‘잘했다’고 미소 지으십니다.",
    ministries: [
      "방문·돌봄·간식/식사 준비",
      "봉사·세팅·정리 팀",
      "환자/연약한 지체 돌봄",
      "숨은 중보·격려 카드 사역",
    ],
    strengthShort:
      "섬세하고 꾸준한 섬김으로 사람들을 편안하게 만들고, 공동체에 깊은 신뢰를 쌓습니다.",
    weaknessShort:
      "자신의 필요를 숨기고 혼자 견디다가 지칠 위험이 크고, 마음에 쌓인 서운함을 표현하지 못할 수 있습니다.",
    warningShort:
      "“나는 괜찮아요”라는 말을 습관처럼 사용하다 보면 마음 안의 신호를 놓칠 수 있습니다.",
    verseApply:
      "당신의 조용한 헌신도 하나님께 분명히 기록되고 있으며, 그 길 끝에 예비된 은혜가 있음을 보여 줍니다. 오늘은 한 가지 일만큼은 ‘함께 하자’고 부탁해 보고, 혼자서만 감당하지 않도록 연습해 보세요.",
  },

  INTJ: {
    nameKo: "지혜의 설계자",
    nameEn: "The Vision Architect",
    summary:
      "통찰력과 구조화 능력을 가진 사색가입니다. 단기적인 열심보다, 장기적인 방향과 시스템을 통해 사람을 세우는 것에 관심이 많습니다. 머릿속에서 늘 사역의 ‘다음 단계’를 그리고 있으며, 잘 설계된 구조를 통해 더 많은 사람이 건강하게 자라나도록 돕고 싶어 합니다.",
    badges: ["통찰·체계", "기획·분별"],
    features: [
      "복잡한 개념과 상황을 구조화하고 핵심을 뽑아내는 능력이 있습니다.",
      "양육·훈련·사역 로드맵을 설계하는 일에 잘 어울립니다.",
      "감정에 휘둘리기보다, 무엇이 맞는 방향인지 냉정하게 판단하려고 합니다.",
      "한 번 정리해 둔 시스템과 프로세스를 꾸준히 개선하는 것을 좋아합니다.",
    ],
    growth: [
      "머릿속에 있는 좋은 아이디어를 실제로 꺼내어 나누고, 함께 실험해 보는 연습이 필요합니다.",
      "완벽하게 정리되지 않아도 한 걸음을 내딛는 용기가 중요합니다.",
      "계획과 구조가 사람을 위한 도구이지, 사람보다 앞서지 않도록 주의해야 합니다.",
      "정기적으로 ‘이 구조 안에서 실제 사람이 어떻게 느끼고 있는지’를 묻는 시간을 가져 보세요.",
    ],
    bibleCharacter: "사도 바울",
    bibleCharacterDesc:
      "복음의 큰 그림과 교회의 구조를 깊이 고민하며 서신으로 정리한 전략가적 사도입니다.",
    verseRef: "골로새서 1:28",
    verseText: "“각 사람을 그리스도 안에서 완전한 자로 세우려 함이니.”",
    characterEmoji: "♟️",
    characterTitle: "사역 로드맵 설계자",
    characterStory:
      "단순히 ‘지금 잘 되는 것’보다, 1년·3년 이후를 내다보며 훈련과 제자 양육의 과정을 설계하는 사람입니다. 당신의 노트에는 다이어그램과 화살표가 가득하지만, 그 화살표는 결국 ‘각 사람을 그리스도 안에서 온전한 자로 세우려는 길’을 향하고 있습니다.",
    ministries: [
      "양육·훈련 커리큘럼 설계",
      "중/장기 비전 기획",
      "성경/신학 공부 모임 인도",
      "사역 평가·데이터 분석·개선 제안",
    ],
    strengthShort:
      "깊이 있고 체계적인 통찰로 방향을 제시하고, 장기적인 성장을 돕는 구조를 만듭니다.",
    weaknessShort:
      "감정 표현이 적어 거리감 있게 느껴질 수 있고, 계획이 실행보다 앞서가 실패를 두려워할 수 있습니다.",
    warningShort:
      "생각과 설계가 너무 앞서가면, 지금 눈앞에 있는 사람의 마음과 현재의 작은 순종을 놓칠 수 있습니다.",
    verseApply:
      "당신이 고민하는 모든 구조와 계획의 중심에 결국 ‘사람을 그리스도 안에서 온전하게 세우는 것’이 있음을 상기시킵니다. 오늘은 설계보다 한 사람의 이름을 먼저 떠올리고, 그를 위한 작은 기도 한 줄을 적어 보세요.",
  },

  INFJ: {
    nameKo: "영혼의 안내자",
    nameEn: "The Spiritual Guide",
    summary:
      "깊은 묵상과 통찰로 영혼을 돌보는 영성가입니다. 표면 아래 흐르는 이야기를 민감하게 느끼고, 한 사람의 내면에 길게 관심을 두는 편입니다. 하나님의 마음과 사람의 마음을 잇는 ‘다리’ 같은 존재로, 말보다 침묵과 눈빛으로 더 많은 것을 전달하기도 합니다.",
    badges: ["직관·묵상", "의미·치유"],
    features: [
      "사람의 말 뒤에 숨은 동기와 상처를 잘 읽어냅니다.",
      "기도와 묵상으로 하나님의 뜻을 깊이 탐색하는 것을 좋아합니다.",
      "양육, 상담, 영적 동행과 같은 ‘깊은 관계’에 끌립니다.",
      "공동체 안에서 소수의 사람이라도 끝까지 책임지고 동행하려는 마음이 큽니다.",
    ],
    growth: [
      "통찰을 마음속에만 간직하지 말고, 안전한 공동체 안에서 나누고 함께 분별하는 연습이 필요합니다.",
      "타인의 감정을 너무 많이 짊어지지 않도록 경계와 쉼을 배우는 것이 중요합니다.",
      "완벽한 이해보다, 작은 순종의 발걸음이 먼저일 때도 있음을 기억해 보세요.",
      "혼자서 모든 짐을 지려 하기보다, ‘내가 감당할 수 있는 부분’과 ‘하나님께 맡겨야 할 부분’을 구분하는 연습을 해보세요.",
    ],
    bibleCharacter: "사도 요한",
    bibleCharacterDesc:
      "사랑과 친밀함, 깊은 묵상을 강조하며 하나님의 마음을 서술한 제자. 내면과 의미를 중요하게 여기는 INFJ와 닮았습니다.",
    verseRef: "요한일서 4:16",
    verseText: "“하나님은 사랑이시라… 사랑 안에 거하는 자는 하나님 안에 거하고.”",
    characterEmoji: "🌙",
    characterTitle: "조용히 듣는 영혼 상담자",
    characterStory:
      "시끄러운 그룹 토론보다, 한 사람과 깊이 이야기 나누는 시간을 더 좋아하는 사람입니다. 당신의 조용한 한마디가 누군가에게는 인생의 전환점이 되기도 하고, 부드러운 눈물 한 방울이 그 사람의 마음에 긴 위로를 남기기도 합니다.",
    ministries: [
      "상담·돌봄·기도 동역",
      "1:1 양육·코칭",
      "기도 모임 인도 및 중보",
      "치유 예배·영성 수련회 스태프",
    ],
    strengthShort:
      "사람의 내면을 깊이 이해하고, 영적으로 안내하며 치유의 통로가 될 수 있습니다.",
    weaknessShort:
      "혼자 짊어지다가 정서적으로 지치기 쉽고, 상처를 깊이 받아 쉽게 소진될 수 있습니다.",
    warningShort:
      "모든 사람의 아픔을 마음에 품다 보면, 정작 나의 심령이 먼저 무너질 수 있습니다.",
    verseApply:
      "하나님의 사랑 안에 먼저 머물 때, 복잡한 감정과 이야기 속에서도 길을 잃지 않게 됨을 보여 줍니다. 오늘은 누군가를 위해 기도하기 전에, 먼저 당신 자신을 위해 ‘주님의 사랑 안에 머무는 기도’를 해 보세요.",
  },

  ESTP: {
    nameKo: "행동의 사명자",
    nameEn: "The Field Warrior",
    summary:
      "현장과 실천에 강한 행동 중심 제자입니다. 복잡한 회의보다 실제 도움이 필요한 자리에서 힘을 발휘하며, 위기 상황에서도 몸이 먼저 움직입니다. 당신의 발과 손이 향하는 곳마다 ‘지금 여기’ 필요한 도움과 변화가 조금씩 일어납니다.",
    badges: ["실행·도전", "현장 중심"],
    features: [
      "필요를 보면 먼저 몸이 움직이고, 즉각적인 도움을 줍니다.",
      "위기 상황에서도 침착하게 현실적인 해결책을 찾습니다.",
      "전도·봉사·재난 대응 등 ‘현장’이 있는 사역에 강한 에너지를 느낍니다.",
      "사람들이 두려워하거나 망설이는 상황에서도 먼저 나서 분위기를 전환시키는 힘이 있습니다.",
    ],
    growth: [
      "움직이기 전에 잠시 멈추어 말씀과 기도로 방향을 점검하는 습관이 필요합니다.",
      "즉흥적 실행뿐 아니라, 장기적인 책임과 관계를 함께 세우는 연습이 중요합니다.",
      "감정과 생각을 말로 나누는 연습을 할수록, 동역자와의 협력이 더 깊어집니다.",
      "‘나 혼자 해결해야 한다’는 부담을 내려놓고, 팀과 함께 움직이는 법을 배워보세요.",
    ],
    bibleCharacter: "베드로",
    bibleCharacterDesc:
      "생각보다 먼저 뛰어드는 행동파 제자. 실패도 있었지만, 주님 사랑 때문에 크게 쓰임 받았습니다.",
    verseRef: "마태복음 14:29",
    verseText: "“베드로가 배에서 내려 물 위로 걸어서 예수께로 가되.”",
    characterEmoji: "🚀",
    characterTitle: "현장 제일주의 해결사",
    characterStory:
      "누군가 쓰러졌다는 소식을 들으면 가장 먼저 뛰어나가고, 현장에서 손이 더럽혀지는 것을 두려워하지 않는 사람입니다. 당신 덕분에 현장은 빨리 정리되고, 도움을 받은 사람은 ‘교회가 정말 나를 사랑하는구나’를 몸으로 느끼게 됩니다.",
    ministries: [
      "아웃리치·봉사·구제 현장 사역",
      "행사 준비·세팅·정리",
      "위기 시 지원·구호 활동",
      "야외 프로그램·스포츠·지역 섬김",
    ],
    strengthShort:
      "두려움 없이 현장에 뛰어들어 실제적인 도움을 주고, 빠른 실행으로 변화를 이끌어냅니다.",
    weaknessShort:
      "충동적으로 움직여 계획과 조율을 놓칠 수 있고, 위험을 가볍게 여길 때가 있습니다.",
    warningShort:
      "열심히 뛰어가지만, 기도 없이 앞서 나가면 지치고 방향을 잃기 쉽습니다.",
    verseApply:
      "주님을 향해 과감하게 뛰어드는 당신의 용기를 격려하면서도, 그 시선이 끝까지 예수님께 고정되도록 초대하는 말씀입니다. 오늘은 어떤 행동을 하기 전, 60초만이라도 눈을 감고 ‘주님, 이걸 정말 원하십니까?’라고 물어보세요.",
  },

  ESFP: {
    nameKo: "기쁨의 찬양자",
    nameEn: "The Joyful Worshiper",
    summary:
      "기쁨과 표현, 감정으로 하나님을 예배하는 유형입니다. 사람들의 긴장을 풀어 주고, 예배와 모임의 분위기를 활짝 여는 데 탁월합니다. 당신이 있는 자리에는 웃음과 따뜻한 에너지가 생겨나고, 그 안에서 사람들은 자연스럽게 하나님께 마음을 열기 시작합니다.",
    badges: ["기쁨·표현", "환대·격려", "예배 감수성"],
    features: [
      "찬양·춤·예술 등 몸과 감정으로 하나님께 반응하는 것을 좋아합니다.",
      "새로 온 사람도 금세 편안하게 느끼게 만드는 밝은 에너지가 있습니다.",
      "분위기를 부드럽게 풀고 웃음을 나누는 데 강점이 있습니다.",
      "슬퍼하는 사람 곁에서는 조용히 함께 있어 주며, 눈물과 웃음을 함께 나누는 따뜻함이 있습니다.",
    ],
    growth: [
      "기분이 좋지 않은 날에도 말씀과 작은 습관으로 신앙을 지키는 연습이 필요합니다.",
      "재정·시간 관리 등 ‘보이지 않는 질서’를 세우면 기쁨이 더 안정됩니다.",
      "슬플 때도 ‘괜찮은 척’하기보다, 있는 그대로 하나님께 감정을 올려 드리는 경험이 중요합니다.",
      "사람들 앞에서의 ‘재미있는 나’와 하나님 앞에서의 ‘있는 그대로의 나’를 구분하고, 후자의 시간을 자주 가져보세요.",
    ],
    bibleCharacter: "다윗",
    bibleCharacterDesc:
      "춤추며 하나님을 찬양하고, 시로 감정을 솔직히 표현한 예배자. 기쁨과 눈물이 함께 있던 인물입니다.",
    verseRef: "시편 103:1",
    verseText: "“내 영혼아 여호와를 송축하라.”",
    characterEmoji: "🎉",
    characterTitle: "축제 예배 리드보컬",
    characterStory:
      "박수와 춤, 표정으로 예배의 분위기를 활짝 열어 주는 사람입니다. 당신의 손짓 하나, 미소 하나에 분위기가 달라지고, 사람들은 점점 더 자유롭게 찬양하며 하나님께 나아갑니다. 때로는 조용한 곡에서 눈물을 훔치며, 진짜 위로를 받기도 합니다.",
    ministries: [
      "찬양팀·워십댄스",
      "환영·인사·분위기 메이커 역할",
      "행사 사회·MC",
      "청소년·다문화 예배 등 표현이 중요한 현장",
    ],
    strengthShort:
      "사람들을 즐겁게 하고 예배의 분위기를 활짝 열어, 하나님께 마음을 여는 문을 만들어 줍니다.",
    weaknessShort:
      "감정에 따라 영적 리듬이 쉽게 흔들릴 수 있고, 속마음을 숨긴 채 ‘밝음’을 유지하려 할 수 있습니다.",
    warningShort:
      "즐거운 분위기 뒤에 감추어진 자신의 슬픔과 공허함을 무시하지 않도록 주의해야 합니다.",
    verseApply:
      "기쁨의 분위기를 넘어, 마음 깊은 곳에서 하나님을 찬양하는 예배자로 부르심을 상기시켜 줍니다. 오늘은 시편 한 편을 소리 내어 읽으며, 기쁨뿐 아니라 슬픔과 두려움까지도 그분께 솔직히 고백해 보세요.",
  },

  ENTP: {
    nameKo: "창의의 변증가",
    nameEn: "The Faith Innovator",
    summary:
      "질문과 아이디어, 토론을 통해 신앙을 탐구하는 혁신가입니다. ‘왜 꼭 이렇게 해야 하지?’를 묻고, 복음을 전할 새로운 길을 찾습니다. 생각의 경계를 깨뜨리는 당신의 질문은 때로 사람들을 불편하게 하지만, 그 불편을 통해 잠자던 믿음이 깨어나기도 합니다.",
    badges: ["창의·아이디어", "변증·토론"],
    features: [
      "복잡한 주제를 다양한 각도에서 바라보고 새롭게 설명하는 재능이 있습니다.",
      "토론과 대화를 통해 서로의 생각을 확장시키는 것을 즐깁니다.",
      "새로운 플랫폼(미디어, 온라인 등)을 활용하는 데 두려움이 적습니다.",
      "당연하게 여겨지는 전통과 관습을 점검하며, 본질을 회복하자는 질문을 자주 던집니다.",
    ],
    growth: [
      "시작한 아이디어를 끝까지 완주하는 훈련이 필요합니다.",
      "상대를 이기는 토론이 아니라, 복음을 드러내는 대화를 목표로 삼을 때 건강해집니다.",
      "교회의 전통과 질서를 무시하기보다, 사랑 안에서 질문하고 제안하는 태도가 필요합니다.",
      "내 생각을 말하기 전에 ‘지금 이 자리에서 가장 사랑이 되는 말이 무엇일까?’를 먼저 떠올려 보세요.",
    ],
    bibleCharacter: "바울(아레오바고의 바울)",
    bibleCharacterDesc:
      "도시마다 들어가 회당과 광장에서 토론하며 복음을 변증했던 사도. 논리와 열정을 함께 지닌 인물입니다.",
    verseRef: "사도행전 17:17",
    verseText: "“회당에서는 유대인들과… 날마다 토론하니라.”",
    characterEmoji: "💡",
    characterTitle: "아이디어 폭주 토론가",
    characterStory:
      "어떤 주제든 새로운 각도에서 질문을 던지고, 사람들의 생각의 틀을 넓혀 주는 대화를 이끄는 사람입니다. 가끔은 ‘또 시작이다’라는 반응을 듣지만, 시간이 지나면 많은 이가 당신 덕분에 더 깊이 믿음을 고민하게 되었음을 고백합니다.",
    ministries: [
      "변증·토론 모임",
      "콘텐츠/미디어 기획",
      "전략 회의 아이디어 뱅크",
      "청년 Q&A, 강연·팟캐스트 사역",
    ],
    strengthShort:
      "창의적 발상과 논리로 새 길을 열고, 복음을 새로운 언어로 설명하는 데 능합니다.",
    weaknessShort:
      "안정성과 일관성이 부족해 보일 수 있고, 논쟁에서 이기려는 마음이 앞설 때가 있습니다.",
    warningShort:
      "논쟁에서 이기는 것에 집중하다 보면, 상대의 마음과 복음의 본질을 놓칠 수 있습니다.",
    verseApply:
      "당신의 질문과 논리가 사람을 무너뜨리는 무기가 아니라, 복음을 더 깊이 이해하게 하는 통로가 되도록 이끄는 말씀입니다. 오늘은 토론에 앞서, 상대의 말을 한 번 요약해 주고 ‘내가 맞다’보다 ‘우리가 함께 진리에 가까워지자’는 마음으로 대화를 시작해 보세요.",
  },

  ENFP: {
    nameKo: "열정의 전도자",
    nameEn: "The Passionate Storyteller",
    summary:
      "감동과 스토리, 열정으로 사람의 마음에 불을 붙이는 전도자형 유형입니다. 자신의 경험을 진솔하게 나누며, 사람들 안에 ‘나도 하나님을 만나보고 싶다’는 마음을 불러일으킵니다. 당신의 이야기는 종종 준비된 설교보다 더 깊게 사람들의 가슴에 꽂히기도 합니다.",
    badges: ["열정·영감", "스토리·전도"],
    features: [
      "간증과 스토리를 통해 복음을 생생하게 전달하는 재능이 있습니다.",
      "새로운 사람, 새로운 모임, 새로운 시도를 두려워하지 않습니다.",
      "사람 안의 가능성을 보고, 함께 꿈꾸며 격려하는 것을 좋아합니다.",
      "분위기를 살리면서도, 중요한 순간에는 솔직하고 깊은 진심을 털어놓을 줄 압니다.",
    ],
    growth: [
      "비전과 열정을 실제 일정표와 루틴 속에 뿌리내리는 연습이 필요합니다.",
      "감정이 식는 시기에도, 작은 순종을 이어 가는 법을 배워가는 것이 중요합니다.",
      "너무 많은 가능성 사이에서 방황하기보다, 하나님이 주신 몇 개의 핵심 부르심에 집중해 보세요.",
      "‘지금 느끼는 감정’보다 하나님이 이미 약속하신 진리를 붙드는 훈련을 해 보세요.",
    ],
    bibleCharacter: "사마리아 여인",
    bibleCharacterDesc:
      "예수를 만난 후 마을 사람들에게 기쁜 소식을 열정적으로 전한 사람. 스토리 전도의 상징 같은 인물입니다.",
    verseRef: "요한복음 4:29",
    verseText: "“나의 행한 모든 일을 내게 말한 사람을 와서 보라.”",
    characterEmoji: "🔥",
    characterTitle: "이야기로 전도하는 스토리텔러",
    characterStory:
      "하나님께 받은 작은 감동도 이야기로 풀어내며, 주변 사람들의 마음에 불씨를 옮겨 심는 사람입니다. 당신이 나누는 ‘작은 간증’을 모아, 공동체 안에 ‘나도 다시 시작해 보고 싶다’는 소망이 생겨나고, 잃어버린 양들이 다시 교회의 문을 두드리기도 합니다.",
    ministries: [
      "관계 전도·초청 사역",
      "간증·스토리 나눔",
      "새로운 모임·소그룹 개척",
      "다양한 문화/예술 사역과의 콜라보",
    ],
    strengthShort:
      "사람들의 마음에 믿음의 용기와 열정을 불어넣고, 복음을 매력적인 이야기로 들려줍니다.",
    weaknessShort:
      "계획과 마무리가 약해 시작만 많아질 수 있고, 감정 기복에 따라 사역의 리듬이 크게 흔들릴 수 있습니다.",
    warningShort:
      "감정과 열정이 식는다고 해서, 하나님이 멀어지신 것은 아니라는 사실을 기억해야 합니다.",
    verseApply:
      "당신의 스토리와 감동을 통해 많은 사람이 예수님을 보고 싶어지도록 이끄는 삶으로 부르심을 확인하게 해 줍니다. 오늘은 한 사람을 떠올리며, 그에게 들려줄 수 있는 ‘3분 간증’을 간단히 적어보고 실제로 나눠 보세요.",
  },

  ISTP: {
    nameKo: "묵묵한 실천가",
    nameEn: "The Silent Craftsman",
    summary:
      "말보다 행동, 생각보다 손으로 섬기는 유형입니다. 기술·설비·문제 해결에 강한 ‘현장형 장인’입니다. 누군가가 당황할 때, 당신은 차분히 문제의 핵심을 파악하고 해결책을 찾으며, 말없이 공동체를 지탱합니다.",
    badges: ["실용·문제해결", "기술·현장"],
    features: [
      "음향, 영상, 시설, IT 등 ‘손이 필요한 곳’에 헌신하기 좋습니다.",
      "위기 상황에서도 감정에 휘둘리기보다 해결책을 찾는 편입니다.",
      "앞에서 말하기보다 뒤에서 조용히 도와주는 역할을 선호합니다.",
      "복잡한 문제를 단계적으로 쪼개어 단순하고 효과적인 해결책을 만드는 데 강점이 있습니다.",
    ],
    growth: [
      "자신의 생각과 감정을 적어도 가까운 사람에게는 나누는 연습이 필요합니다.",
      "공동체와 함께 계획을 세우고, 혼자보다 같이 움직이는 경험을 할수록 사역이 더 가벼워집니다.",
      "도움을 받는 것에도 익숙해질 때, 섬김이 더 오래가고 건강해집니다.",
      "‘내가 없으면 안 된다’는 부담보다 ‘하나님이 다른 사람도 세우신다’는 믿음을 배워 보세요.",
    ],
    bibleCharacter: "브살렐",
    bibleCharacterDesc:
      "성막의 세밀한 부분을 손으로 지어낸 기술자. 조용한 실력과 섬김으로 하나님의 집을 세웠습니다.",
    verseRef: "출애굽기 31:3",
    verseText: "“하나님의 영을 그에게 충만하게 하여… 여러 가지 일을 하게 하였고.”",
    characterEmoji: "🛠️",
    characterTitle: "성막 기술팀 마스터",
    characterStory:
      "케이블, 조명, 소리, 화면… 뒤에서 묵묵히 만져 주는 손 덕분에 예배가 자연스럽게 흘러갑니다. 사람들은 잘 보지 못하지만, 예배가 끝난 뒤 당신은 조용히 잔상을 지우고 다음 예배를 준비하는 또 하나의 예배를 드리고 있습니다.",
    ministries: [
      "음향·영상·IT·시설 담당",
      "행사 세팅·철거 지원",
      "현장 안전·기술 지원",
      "교회 내 기술/장비 교육 및 관리",
    ],
    strengthShort:
      "위기에도 침착하게 문제를 해결하는 능력이 뛰어나고, 손으로 섬기는 실제적인 사랑을 보여 줍니다.",
    weaknessShort:
      "감정 표현이 적어, 거리감 있게 느껴질 수 있고, 혼자 모든 것을 해결하려다 지치기 쉽습니다.",
    warningShort:
      "혼자 모든 문제를 해결하려다, 정작 자신의 마음과 영적 상태를 방치할 수 있습니다.",
    verseApply:
      "당신의 손과 기술의 배후에 성령께서 함께 일하고 계시며, 그 섬김이 예배의 일부임을 기억하게 해 주는 말씀입니다. 오늘은 한 가지 작업을 마친 뒤, ‘주님, 이 작은 수고도 당신께 드립니다’라고 조용히 고백해 보세요.",
  },

  ISFP: {
    nameKo: "온유한 예배자",
    nameEn: "The Gentle Artist",
    summary:
      "온유함과 아름다움으로 하나님을 표현하는 예배자입니다. 음악·그림·디자인·공예 등 예술적 언어로 사랑을 나타내는 것을 좋아합니다. 당신의 섬세한 감수성은 사람들의 상처 난 마음을 부드럽게 감싸며, 말없이도 깊은 위로를 전합니다.",
    badges: ["온유·아름다움", "예술·감성"],
    features: [
      "예술적 재능으로 예배와 공간을 아름답게 꾸미는 일을 좋아합니다.",
      "한 사람에게 깊이 헌신하며 섬세하게 돌보는 편입니다.",
      "따뜻하고 부드러운 분위기를 만드는 데 자연스러운 재능이 있습니다.",
      "큰 소리보다 작은 제스처와 작품으로 마음을 표현할 때 더 편안함을 느낍니다.",
    ],
    growth: [
      "갈등을 너무 피하지 말고, 부드럽게 자신의 생각을 표현하는 연습이 필요합니다.",
      "장기적인 계획 책임을 조금씩 늘려 갈 때, 은사가 더 크게 사용될 수 있습니다.",
      "남을 위해 희생하는 것만큼, 하나님 안에서 자신을 돌보는 연습도 중요합니다.",
      "‘내가 싫은 말’을 하는 것이 사랑의 표현이 될 때도 있다는 것을 배워 보세요.",
    ],
    bibleCharacter: "향유를 부은 여인",
    bibleCharacterDesc:
      "값비싼 향유로 조용히 사랑을 표현한 예배자. 눈에 띄지 않는 깊은 헌신이 아름답습니다.",
    verseRef: "마가복음 14:8",
    verseText: "“그는 힘을 다하여 내 몸에 향유를 부어…”",
    characterEmoji: "🎨",
    characterTitle: "색과 음악으로 예배하는 아티스트",
    characterStory:
      "사소한 장식 하나, 배경 음악 하나에도 마음을 담는 사람입니다. 당신의 손길이 닿는 곳마다 ‘은근한 아름다움’이 배어 나고, 사람들은 왜인지 모르게 그 공간에서 조금 더 오래 머물고 싶어집니다.",
    ministries: [
      "찬양·악기·예술 사역",
      "공간/무대/시각 디자인",
      "선물·카드·작품으로 격려",
      "치유·아트 워크숍·감성 소그룹",
    ],
    strengthShort:
      "온유하고 따뜻한 예술적 표현으로 사람들을 위로하고, 예배의 아름다움을 더합니다.",
    weaknessShort:
      "갈등과 비판을 두려워해 의견을 숨길 수 있고, 상처를 마음에 오래 담아둘 수 있습니다.",
    warningShort:
      "조용히 참고만 있다 보면, 마음에 쌓인 서운함이 어느 날 한 번에 터질 수 있습니다.",
    verseApply:
      "보이는 성과보다, 마음을 다한 작은 헌신을 기쁘게 받으시는 주님의 마음을 보여 주는 말씀입니다. 오늘은 한 사람을 위해 작은 그림, 메모, 음악 링크 하나라도 정성껏 준비해 보세요.",
  },

  INTP: {
    nameKo: "진리의 탐구자",
    nameEn: "The Theological Thinker",
    summary:
      "진리를 지적으로 탐구하고 구조화하는 사색가입니다. ‘왜 그런가?’를 끝까지 따라가며, 성경과 신학, 세계관을 깊이 있게 이해하고 싶어 합니다. 당신의 정밀한 질문과 분석은 공동체의 믿음의 내용을 더 단단하게 만드는데 큰 도움을 줍니다.",
    badges: ["논리·탐구", "신학·분석"],
    features: [
      "성경과 신학, 세계관을 깊이 공부하며 논리적으로 이해하고자 합니다.",
      "복잡한 개념을 정리해 글이나 강의로 설명하는 재능이 있습니다.",
      "감정적 분위기보다, 내용의 정확성과 진리를 더 중요하게 여깁니다.",
      "잘못된 정보나 애매한 표현을 발견했을 때, 더 정확한 언어로 정리하고 싶어 합니다.",
    ],
    growth: [
      "알고 있는 것을 실제 삶과 관계 속에서 ‘하나씩’ 실천해 보는 것이 중요합니다.",
      "사람의 마음을 향한 따뜻한 관심과 표현을 의식적으로 연습해 보세요.",
      "완벽한 이해가 아니라, 부분적인 순종이 먼저일 때도 있음을 기억하는 것이 도움이 됩니다.",
      "논쟁보다 ‘함께 진리를 찾는 여행’을 목표로 삼을 때, 관계와 진리가 동시에 자랍니다.",
    ],
    bibleCharacter: "누가",
    bibleCharacterDesc:
      "사실을 자세히 조사해 복음서와 사도행전을 기록한 의사. 분석과 기록의 모범입니다.",
    verseRef: "누가복음 1:3",
    verseText:
      "“모든 일을 자세히 미루어 살핀 나도… 차례대로 써 보내는 것이 좋은 줄 알았노니.”",
    characterEmoji: "📚",
    characterTitle: "기록과 분별의 연구자",
    characterStory:
      "기록과 정리를 통해 진리를 더 선명하게 보이게 만드는 사람입니다. 당신이 만든 요약 노트, 학습 자료, FAQ 문서 덕분에 많은 사람이 ‘이제야 조금 알 것 같다’는 안도감을 느끼고, 복잡했던 질문들이 하나씩 정리됩니다.",
    ministries: [
      "성경/신학 공부 인도",
      "자료 정리·콘텐츠 작성",
      "교재·가이드 제작",
      "정책·FAQ·교육 문서화",
    ],
    strengthShort:
      "깊이 있는 이해와 논리로 진리를 설명하고, 공동체의 신앙 내용을 단단하게 세워 줍니다.",
    weaknessShort:
      "머릿속에만 머물고 행동으로 옮기지 못할 수 있으며, 차갑게 느껴지는 표현으로 사람을 상처 입힐 수 있습니다.",
    warningShort:
      "이해가 완벽해야만 순종할 수 있다고 느끼지 않도록 주의해야 합니다.",
    verseApply:
      "당신의 연구와 기록이 사람들을 예수님께로 이끄는 통로가 되도록 이끄는 말씀입니다. 오늘은 공부한 내용 중 ‘생활에서 하나만 바꿀 수 있는 적용’을 적어 보고, 실제로 실천해 보세요.",
  },

  INFP: {
    nameKo: "소명의 시인",
    nameEn: "The Idealistic Dreamer",
    summary:
      "마음 깊은 곳의 가치와 소명을 소중히 여기는 이상가입니다. 순수한 열망으로 하나님을 따르며, ‘진짜’와 ‘가짜’를 직감적으로 구분하려 합니다. 당신의 눈에는 세상의 거친 소음 속에서도 ‘하나님 나라의 아름다움’이 보이고, 그 아름다움을 지키고 싶어 하는 마음이 있습니다.",
    badges: ["가치·소명", "공감·상상"],
    features: [
      "내면의 양심과 가치가 허락하지 않으면, 분위기와 상관없이 조용히 거리를 둡니다.",
      "시·글·기도·예술 등으로 마음을 표현하는 것을 좋아합니다.",
      "연약한 이들의 아픔에 쉽게 이입하고, 함께 울어 줄 수 있습니다.",
      "관계와 사역 안에서 진정성과 진심을 매우 중요하게 여깁니다.",
    ],
    growth: [
      "마음속 이상을 작은 실천으로 옮기는 연습이 필요합니다.",
      "실망과 상처 속에서도, 공동체와 계속 연결되어 있는 것이 중요합니다.",
      "감정의 파도 속에서도 변하지 않는 하나님의 진리와 약속을 붙드는 훈련이 필요합니다.",
      "‘완벽한 모임’보다 ‘지금 가능한 한 걸음’을 선택하는 용기를 내보세요.",
    ],
    bibleCharacter: "예레미야",
    bibleCharacterDesc:
      "하나님의 마음을 깊이 느끼고 눈물로 기도했던 선지자. 마음이 예민하고 깊은 INFP와 닮았습니다.",
    verseRef: "예레미야 20:9",
    verseText: "“마음이 불붙는 것 같아서 골수에 사무치니…”",
    characterEmoji: "🕊️",
    characterTitle: "마음으로 기도하는 시인",
    characterStory:
      "말로 다 하지 못하는 감정을 기도와 글로 쏟아내며, 하나님께 올려 드리는 사람입니다. 당신의 노트와 일기는 때로 눈물로 젖어 있지만, 그 안에는 하나님께만 털어놓은 가장 솔직한 고백들이 가득합니다. 그 고백은 언젠가 누군가를 살리는 기도와 시가 됩니다.",
    ministries: [
      "중보기도 사역",
      "글·시·묵상 나눔",
      "예술·감성 기반 치유 모임",
      "소수·상처 입은 이들과의 깊은 동행",
    ],
    strengthShort:
      "깊고 순수한 마음으로 하나님과 사람을 사랑하고, 상처 입은 이들을 섬세하게 품어 줍니다.",
    weaknessShort:
      "현실의 거친 면을 마주할 때 쉽게 상처받을 수 있고, 실망할 때 관계와 공동체에서 멀어지려는 경향이 있습니다.",
    warningShort:
      "실망 때문에 마음의 문을 닫아 버리면, 부르심도 함께 가려질 수 있습니다.",
    verseApply:
      "당신의 마음속 불씨가 하나님 안에서 꺼지지 않도록 붙들어 주는 말씀입니다. 오늘은 한 줄이라도 짧은 기도시를 써서, 한 사람과 나누거나 하나님께만 올려 드려 보세요.",
  },
};

/* 3. 전역 상태 & DOM */
let currentIndex = 0;
let questions = [];
const answers = {};
let myResultType = null;
let myScores = null;
let currentViewType = null;

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

/* 4. 유틸 */
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* 5. 질문 렌더링 */
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
  axisLabel.style.visibility = "hidden";

  progressFill.style.width = `${(idx / total) * 100}%`;

  questionCode.textContent = `Q${idx}`;
  questionText.textContent = q.text;

  renderScale(q.id);
  backBtn.disabled = currentIndex === 0;
}

/* 6. 결과 계산 */
function calculateResult() {
  // ✅ 세부 점수용: 내가 클릭한 값 그대로 합산 (1~5)
  const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  // ✅ 축/유형 계산용: 중심(3) 기준으로 얼마나 치우쳤는지 (±)
  const axisScores = { EI: 0, SN: 0, TF: 0, JP: 0 };

  originalQuestions.forEach((q) => {
    const v = answers[q.id];
    if (!v) return; // 건너뛴 문항은 계산 제외

    // 1) 세부 점수: 선택한 점수 그대로 누적
    scores[q.side] += v; // 예: E문항 5개에서 5,4,3,2,1 누르면 E = 15

    // 2) 축 점수: 타입/그래프용 (중립 3에서 얼마나 벗어났나)
    const centered = v - 3; // 1~5 → -2 ~ +2

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

  // ✅ 축 점수를 기준으로 최종 유형 결정
  const type =
    (axisScores.EI >= 0 ? "E" : "I") +
    (axisScores.SN >= 0 ? "S" : "N") +
    (axisScores.TF >= 0 ? "T" : "F") +
    (axisScores.JP >= 0 ? "J" : "P");

  return { type, scores, axisScores };
}

/* 7. 다음/결과 이동 */
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
    renderAxisUpgraded(axisScores); // 축 점수로 그래프 그림
    renderDetailScores(scores);     // 글자별 세부 점수
    renderMatchCards(type);
    buildOtherTypesGrid();
  }
}

/* 8. 결과 렌더링 */
function renderResult(type) {
  const data = typeResults[type];

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

  // 성경 인물 (토글 박스 내용)
  bibleCharacterEl.textContent = `${data.bibleCharacter} – ${data.bibleCharacterDesc}`;
  bibleBox.classList.add("hidden");
  bibleToggleBtn.textContent = "📖 성경 인물 보기";

  // 메인 캐릭터
  characterEmojiEl.textContent = data.characterEmoji;
  characterTitleEl.textContent = data.characterTitle;
  characterTextEl.textContent = data.characterStory;
}

/* 9. 4축 성향 분포 */
function renderAxisUpgraded(axisScores) {
  const container = document.getElementById("axis-upgraded");

  const defs = [
    { key: "EI", left: "E", right: "I", label: "에너지 방향" },
    { key: "SN", left: "S", right: "N", label: "정보 인식" },
    { key: "TF", left: "T", right: "F", label: "판단 기준" },
    { key: "JP", left: "J", right: "P", label: "생활 방식" },
  ];

  // 질문 10개 × 최대 2점 = 20점 정도를 최대치로 가정
  const MAX = 20;

  let html = "";

  defs.forEach((d) => {
    const v = axisScores[d.key] || 0; // -20 ~ +20
    // -MAX → 0%, 0 → 50%, +MAX → 100%
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

/* 10. 세부 점수 */
function renderDetailScores(scores) {
  const container = document.getElementById("detail-score-list");
  const maxScore = 25; // 문항 5개 × 최고 5점 = 25점
  let html = "";

  ["E", "I", "S", "N", "T", "F", "J", "P"].forEach((k) => {
    const v = scores[k] || 0; // 내가 클릭한 점수들의 합 (항상 0~25)
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

/* 11. 유형 관계 보기 */
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

/* 12. 다른 유형 보기 */
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

/* 13. 오늘의 말씀 보기 (토글) */
todayVerseBtn.addEventListener("click", () => {
  const type = currentViewType || myResultType;
  if (!type) return;

  const data = typeResults[type];
  todayVerseBoxRef.textContent = data.verseRef;
  todayVerseBoxText.textContent = data.verseText;
  todayVerseBoxApply.textContent = data.verseApply || "";

  todayVerseBox.classList.toggle("hidden");
});

/* 14. 성경 인물 토글 */
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

/* 15. 공유 – Kakao 링크 우선, 그 외에는 기본 공유 / 클립보드 */

if (shareBtn) {
  shareBtn.addEventListener("click", async () => {
    // 아직 결과가 없으면 막기
    if (!myResultType || !typeResults || !typeResults[myResultType]) {
      alert("먼저 검사를 완료한 뒤, 결과를 공유해 주세요.");
      return;
    }

    const baseUrl = "https://csy870617.github.io/faith-mbti/";
    const data = typeResults[myResultType];
    const nameKo = data.nameKo;
    const nameEn = data.nameEn;

    const shareTitle = "FAITH-MBTI 신앙 유형 테스트";
    const shareDesc =
      `나의 Faith-MBTI 유형은 ${myResultType} (${nameKo} · ${nameEn}) 입니다.\n` +
      `당신의 신앙 유형은 무엇인가요?`;
    const shareUrl = baseUrl;
    const shareText = `${shareDesc}\n${shareUrl}`;

    // 1) Kakao JS SDK가 있으면, 환경 상관 없이 Kakao.Link 우선 사용
    if (
      typeof Kakao !== "undefined" &&
      Kakao &&
      typeof Kakao.isInitialized === "function" &&
      Kakao.isInitialized() &&
      Kakao.Link &&
      typeof Kakao.Link.sendDefault === "function"
    ) {
      try {
        Kakao.Link.sendDefault({
          objectType: "feed",
          content: {
            title: shareTitle,
            description: shareDesc,
            imageUrl: shareUrl + "images/thumbnail.jpg",
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
          buttons: [
            {
              title: "나도 FAITH-MBTI 검사하기",
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
              },
            },
          ],
        });
        // Kakao 공유 창이 뜨면 여기서 끝
        return;
      } catch (err) {
        console.error("Kakao Link 공유 오류:", err);
        // 실패하면 아래 공통 공유 로직으로 자연스럽게 진행
      }
    }

    // 2) Web Share API 지원 브라우저 → 기본 공유 시트
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDesc,
          url: shareUrl,
        });
        return;
      } catch (err) {
        console.log("공유 취소/오류:", err);
      }
    }

    // 3) 그 외 → 마지막으로 클립보드
    try {
      await navigator.clipboard.writeText(shareText);
      alert(
        "결과가 클립보드에 복사되었습니다.\n" +
        "원하는 대화창에 붙여넣기 해 주세요."
      );
    } catch (err) {
      console.error(err);
      alert("공유 기능을 사용할 수 없습니다. 다른 브라우저에서 다시 시도해 주세요.");
    }
  });
}


/* 16. 시작 / 뒤로 / 건너뛰기 / 다시 검사 */
startBtn.addEventListener("click", () => {
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

// 개발용: 바로 결과 보기 버튼
const goResultBtn = document.getElementById("go-result-btn");

goResultBtn.addEventListener("click", () => {
  // (원래대로) 임의 응답 생성 – 그래프/점수용
  originalQuestions.forEach((q) => {
    answers[q.id] = 3; // 중립값
  });

  // 점수/그래프는 기존 로직 활용
  const { scores, axisScores } = calculateResult();

  // 🔹 유형 코드는 무조건 ENFJ로 고정
  const type = "ENFJ";

  myResultType = type;
  myScores = scores;
  currentViewType = type;

  introSection.classList.add("hidden");
  testSection.classList.add("hidden");
  resultSection.classList.remove("hidden");

  renderResult(type);            // ENFJ 설명/텍스트
  renderAxisUpgraded(axisScores);
  renderDetailScores(scores);
  renderMatchCards(type);
  buildOtherTypesGrid();
});

/* =========================================================
 * 17. Firebase + 우리교회 Firestore 연동
 * ======================================================= */

const CHURCH_COLLECTION = "faith_churches";

let _firebaseDb = null;
let _firebaseFsModule = null;

/**
 * Firebase + Firestore 모듈 동적 import + 초기화
 */
async function ensureFirebase() {
  if (_firebaseDb && _firebaseFsModule) {
    return { db: _firebaseDb, fs: _firebaseFsModule };
  }

  const appMod = await import(
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"
  );
  const fsMod = await import(
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
  );

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

/**
 * 타입별로 공유문서에 넣을 "간략한 내용" 텍스트 생성
 */
function getTypeShortText(type) {
  const data = typeResults[type];
  if (!data) return "";
  return data.summary || data.strengthShort || data.nameKo || "";
}

/**
 * 17-2. 교회 문서에 내 결과 저장
 */
async function saveMyResultToChurch(name, churchName, password) {
  const trimmedName = name.trim();
  const trimmedChurch = churchName.trim();
  const trimmedPassword = password.trim();

  if (!trimmedName || !trimmedChurch || !trimmedPassword) {
    throw new Error("이름, 교회이름, 비밀번호를 모두 입력해 주세요.");
  }
  if (!myResultType) {
    throw new Error("먼저 FAITH-MBTI 검사를 완료한 뒤 저장해 주세요.");
  }

  const { db, fs } = await ensureFirebase();
  const { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } = fs;

  const churchRef = doc(db, CHURCH_COLLECTION, trimmedChurch);
  const snap = await getDoc(churchRef);

  if (snap.exists()) {
    const data = snap.data();
    if (data.password !== trimmedPassword) {
      throw new Error("이미 등록된 교회입니다. 비밀번호가 일치하지 않습니다.");
    }
  } else {
    await setDoc(churchRef, {
      churchName: trimmedChurch,
      password: trimmedPassword,
      createdAt: serverTimestamp ? serverTimestamp() : Date.now(),
    });
  }

  const membersCol = collection(churchRef, "members");
  const shortText = getTypeShortText(myResultType);

  await addDoc(membersCol, {
    name: trimmedName,
    type: myResultType,
    shortText,
    createdAt: serverTimestamp ? serverTimestamp() : Date.now(),
  });
}

/**
 * 17-3. 특정 교회 전체 목록 불러오기
 *  - members: 각 항목에 Firestore doc id 포함 (삭제용)
 */
async function loadChurchMembers(churchName, password) {
  const trimmedChurch = churchName.trim();
  const trimmedPassword = password.trim();

  if (!trimmedChurch || !trimmedPassword) {
    throw new Error("교회이름과 비밀번호를 모두 입력해 주세요.");
  }

  const { db, fs } = await ensureFirebase();
  const { doc, getDoc, collection, query, orderBy, getDocs } = fs;

  const churchRef = doc(db, CHURCH_COLLECTION, trimmedChurch);
  const churchSnap = await getDoc(churchRef);

  if (!churchSnap.exists()) {
    throw new Error("해당 이름으로 등록된 교회가 없습니다.");
  }

  const churchData = churchSnap.data();
  if (churchData.password !== trimmedPassword) {
    throw new Error("비밀번호가 일치하지 않습니다.");
  }

  const membersCol = collection(churchRef, "members");
  const q = query(membersCol, orderBy("createdAt", "asc"));
  const snap = await getDocs(q);

  const members = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  return {
    churchName: churchData.churchName || trimmedChurch,
    members,
  };
}

/**
 * 17-3-1. 개별 member 삭제 (비밀번호 확인 포함)
 */
async function deleteChurchMember(churchName, password, memberId) {
  const trimmedChurch = churchName.trim();
  const trimmedPassword = password.trim();

  if (!trimmedChurch || !trimmedPassword) {
    throw new Error("교회이름과 비밀번호를 모두 입력해 주세요.");
  }
  if (!memberId) {
    throw new Error("삭제할 대상을 찾을 수 없습니다.");
  }

  const { db, fs } = await ensureFirebase();
  const { doc, getDoc, collection, deleteDoc } = fs;

  const churchRef = doc(db, CHURCH_COLLECTION, trimmedChurch);
  const churchSnap = await getDoc(churchRef);

  if (!churchSnap.exists()) {
    throw new Error("해당 이름으로 등록된 교회가 없습니다.");
  }

  const churchData = churchSnap.data();
  if (churchData.password !== trimmedPassword) {
    throw new Error("비밀번호가 일치하지 않습니다.");
  }

  const membersCol = collection(churchRef, "members");
  const memberRef = doc(membersCol, memberId);
  await deleteDoc(memberRef);
}

/**
 * 17-4. 우리교회 목록 렌더링
 *  - 이름 / 유형 / 간략한 설명 / 삭제 버튼
 *  - 삭제 시 우리교회 비밀번호를 다시 입력해야 함
 */
function renderChurchList(churchName, members) {
  const container = document.getElementById("church-result-list");
  if (!container) return;

  if (!members || members.length === 0) {
    container.innerHTML = `
      <div class="result-card">
        <div class="card-title">우리교회 신앙 유형 모음</div>
        <p class="gray">아직 이 교회 이름으로 저장된 결과가 없습니다.</p>
      </div>
    `;
    return;
  }

  let rows = "";
  members.forEach((m) => {
    rows += `
      <tr>
        <td>${m.name || ""}</td>
        <td>${m.type || ""}</td>
        <td>${m.shortText || ""}</td>
        <td>
          <button 
            class="btn-secondary member-delete-btn"
            data-member-id="${m.id}"
            data-church="${churchName}"
          >
            삭제
          </button>
        </td>
      </tr>
    `;
  });

  container.innerHTML = `
    <div class="result-card">
      <div class="card-title">🏠 ${churchName} 신앙 유형 모음</div>
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
          <thead>
            <tr style="border-bottom:1px solid #e5e7eb;">
              <th style="text-align:left;padding:6px 4px;">이름</th>
              <th style="text-align:left;padding:6px 4px;">유형</th>
              <th style="text-align:left;padding:6px 4px;">간략한 설명</th>
              <th style="text-align:left;padding:6px 4px;">관리</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
      <p class="gray" style="margin-top:8px;">
        같은 그룹명과 비밀번호로 저장한 신앙 유형 모음입니다.<br/>
        항목을 삭제하려면 우리교회 비밀번호를 입력하세요.
      </p>
    </div>
  `;

  // 삭제 버튼 이벤트 연결 (비밀번호 확인 포함)
  container.querySelectorAll(".member-delete-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const memberId = btn.dataset.memberId;
      const church = btn.dataset.church;

      const pw = prompt(
        "해당 항목을 삭제하려면 우리교회 비밀번호를 다시 입력해 주세요."
      );
      if (!pw) return;

      try {
        await deleteChurchMember(church, pw, memberId);
        alert("해당 항목이 삭제되었습니다.");

        // 삭제 후 최신 목록 다시 조회
        const { members: refreshed } = await loadChurchMembers(church, pw);
        renderChurchList(church, refreshed);
      } catch (err) {
        console.error(err);
        alert(err.message || "삭제 중 오류가 발생했습니다.");
      }
    });
  });
}

/* =========================================================
 * 18. 우리교회 화면 / 버튼 연결
 * ======================================================= */

const churchBtn = document.getElementById("church-btn");
const churchSection = document.getElementById("church-section");
const churchCloseBtn = document.getElementById("church-close-btn");

const inviteBtn = document.getElementById("invite-btn");
const churchNameInput = document.getElementById("member-church-input");

const memberNameInput = document.getElementById("member-name-input");
const memberChurchInput = document.getElementById("member-church-input");
const memberPasswordInput = document.getElementById("member-password-input");
const memberSaveBtn = document.getElementById("member-save-btn");

const viewChurchInput = document.getElementById("view-church-input");
const viewPasswordInput = document.getElementById("view-password-input");
const churchViewBtn = document.getElementById("church-view-btn");

const churchResultList = document.getElementById("church-result-list");
const churchSummaryBtn = document.getElementById("church-summary-btn");

// 18-1. 결과 화면 → 우리교회 화면으로 이동
if (churchBtn && churchSection) {
  churchBtn.addEventListener("click", () => {
    introSection.classList.add("hidden");
    testSection.classList.add("hidden");
    resultSection.classList.add("hidden");
    churchSection.classList.remove("hidden");
  });
}

// 18-2. 우리교회 화면 닫기 → 다시 결과 화면으로 돌아가기
if (churchCloseBtn && churchSection) {
  churchCloseBtn.addEventListener("click", () => {
    churchSection.classList.add("hidden");
    resultSection.classList.remove("hidden");
  });
}

// 18-3. "입력" 버튼 → 해당 교회 공유문서에 내 결과 저장
if (
  memberSaveBtn &&
  memberNameInput &&
  memberChurchInput &&
  memberPasswordInput
) {
  memberSaveBtn.addEventListener("click", async () => {
    try {
      const name = memberNameInput.value;
      const churchName = memberChurchInput.value;
      const password = memberPasswordInput.value;

      await saveMyResultToChurch(name, churchName, password);
      alert("우리교회 신앙 유형 목록에 저장되었습니다. 🙌");

      memberNameInput.value = "";
    } catch (err) {
      console.error(err);
      alert(err.message || "저장 중 오류가 발생했습니다.");
    }
  });
}

// 18-4. "우리교회 신앙유형확인" 버튼 → 목록 조회
if (churchViewBtn && viewChurchInput && viewPasswordInput) {
  churchViewBtn.addEventListener("click", async () => {
    try {
      const churchName = viewChurchInput.value;
      const password = viewPasswordInput.value;

      const { churchName: displayName, members } =
        await loadChurchMembers(churchName, password);

      renderChurchList(displayName, members);
    } catch (err) {
      console.error(err);
      alert(err.message || "목록을 불러오는 중 오류가 발생했습니다.");
    }
  });
}

// churchResultList 최초 안내
if (churchResultList && !churchResultList.innerHTML.trim()) {
  churchResultList.innerHTML = `
    <div class="result-card">
      <div class="card-title"> FAITH MBTI</div>
      <p class="gray">
        위에서 교회이름과 비밀번호를 입력하고<br/>
        [우리교회 신앙 유형 확인] 버튼을 눌러 주세요.
      </p>
    </div>
  `;
}

if (churchSummaryBtn) {
  churchSummaryBtn.addEventListener("click", async () => {
    const churchName = (viewChurchInput?.value || "").trim();
    const pw = (viewPasswordInput?.value || "").trim();

    if (!churchName) {
      alert("교회 이름을 입력해 주세요.");
      viewChurchInput?.focus();
      return;
    }
    if (!pw) {
      alert("우리교회 비밀번호를 입력해 주세요.");
      viewPasswordInput?.focus();
      return;
    }

    try {
      // Firestore에서 해당 교회 목록 불러오기 (이미 만든 함수라고 가정)
      const { members } = await loadChurchMembers(churchName, pw);

      // 화면에 렌더링
      renderChurchList(churchName, members);
    } catch (err) {
      console.error(err);
      alert(err.message || "우리교회 신앙 유형을 불러오는 중 오류가 발생했습니다.");
    }
  });
}


// 18-5. "초대하기" 버튼 → 교회 이름 포함 초대 링크 공유

async function shareInviteLink() {
  const baseUrl = "https://csy870617.github.io/faith-mbti/";

  // 교회 이름 입력
  const churchName =
    churchNameInput?.value?.trim() && churchNameInput.value.trim().length > 0
      ? churchNameInput.value.trim()
      : "우리교회";

  const shareText =
    `${churchName} 신앙 유형 모음을 함께 만들어요!\n` +
    `당신의 신앙 유형은 무엇인가요?\n` +
    baseUrl;

  // 1. 카카오 인앱 → 카카오 공유 시도
  if (/KAKAOTALK/i.test(navigator.userAgent || "")) {
    if (typeof Kakao !== "undefined" && Kakao.Link && Kakao.Link.sendDefault) {
      try {
        Kakao.Link.sendDefault({
          objectType: "feed",
          content: {
            title: "FAITH-MBTI 신앙 유형 테스트",
            description: shareText,
            imageUrl: baseUrl + "images/thumbnail.jpg",
            link: { mobileWebUrl: baseUrl, webUrl: baseUrl },
          },
          buttons: [
            {
              title: "나도 FAITH-MBTI 검사하기",
              link: { mobileWebUrl: baseUrl, webUrl: baseUrl },
            },
          ],
        });
        return;
      } catch (err) {
        console.error("카카오 링크 오류:", err);
      }
    }
    // SDK가 안 뜨면 → Web Share로 이어짐
  }

  // 2. Web Share API 지원 → 기본 공유 시트
  if (navigator.share) {
    try {
      await navigator.share({
        title: "FAITH-MBTI 초대",
        text: shareText,
        url: baseUrl,
      });
      return;
    } catch (err) {
      console.log("공유 취소/오류:", err);
    }
  }

  // 3. 최후 → 클립보드 복사
  try {
    await navigator.clipboard.writeText(shareText);
    alert(
      "초대 메시지가 클립보드에 복사되었어요!\n" +
      "원하는 대화창에 붙여넣기 해 주세요."
    );
  } catch (err) {
    alert("공유 기능을 사용할 수 없습니다.");
  }
}

if (inviteBtn) {
  inviteBtn.addEventListener("click", shareInviteLink);
}

/* =========================================================
 * 19. 우리교회 목록 → 클립보드 복사 기능 (그룹명 + 신앙 유형 + 검사 링크)
 * ======================================================= */

const churchCopyBtn = document.getElementById("church-copy-btn");

if (churchCopyBtn) {
  churchCopyBtn.addEventListener("click", async () => {
    const container = document.getElementById("church-result-list");
    if (!container) return;

    const table = container.querySelector("table");
    if (!table) {
      alert("복사할 내용이 없습니다. 먼저 우리교회를 조회해 주세요.");
      return;
    }

    const rows = table.querySelectorAll("tbody tr");
    if (!rows.length) {
      alert("복사할 내용이 없습니다. 먼저 우리교회를 조회해 주세요.");
      return;
    }

    // 조회할 때 직접 입력한 그룹명
    const rawGroupName = (viewChurchInput?.value || "").trim();
    const groupName = rawGroupName || "우리교회";

    // 1) 맨 윗줄: "그룹명 + 신앙 유형"
    let text = `${groupName} 신앙 유형\n\n`;

    // 2) 사람별 블록
    rows.forEach((row, index) => {
      const cells = row.querySelectorAll("td");
      const name = (cells[0]?.innerText || "").trim();
      const type = (cells[1]?.innerText || "").trim();
      const desc = (cells[2]?.innerText || "").trim();

      text += `이름: ${name}\n`;
      text += `유형: ${type}\n`;
      text += `간단한 설명: ${desc}\n`;

      if (index !== rows.length - 1) {
        text += `\n`;
      }
    });

    // 🔹 3) 맨 아래 검사 링크 추가
    const baseUrl = "https://csy870617.github.io/faith-mbti/";
    text += `\n\n검사 링크: ${baseUrl}`;

    try {
      await navigator.clipboard.writeText(text);
      alert("우리교회 신앙 유형 목록이 클립보드에 복사되었습니다! 🙌");
    } catch (err) {
      console.error(err);
      alert("복사 중 오류가 발생했습니다. 다른 브라우저에서 다시 시도해 주세요.");
    }
  });
}






