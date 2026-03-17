// 왜: Week 1 데이터를 정적으로 번들링하여 별도 서버 없이 즉시 로딩
// 향후 Week 2~23 데이터 추가 시 이 파일만 확장하면 됨
// data/weeks/week-XX/의 JSON/MD를 JS 객체로 변환하여 제공

// 왜: 유튜브 재생목록 "1sentence 시즌 2"의 영상을 주차별로 매핑
// 재생목록: https://youtube.com/playlist?list=PLGjc2nvFhPoNSOng1Y28kTklj69EAlIgn
// 영상 제목의 숫자가 챕터 번호(0부터 시작) → Week 매핑:
//   챕터 0 = 인트로 (Week 1에 부가 콘텐츠로 표시)
//   챕터 1~18 = Week 1~18
export const VIDEO_DATA = {
    1: { videoId: 'B5Q2nwJEPkM', chapter: 1, title: '순식간에 퍼지는 브랜드 마케팅 첫번째 원칙' },
    2: { videoId: 'jXmjoi0sjh0', chapter: 2, title: '상위 1% 브랜드 마케터는 다른 걸 봅니다' },
    3: { videoId: 'yZ9_wU_JCDc', chapter: 3, title: '브랜드 마케터는 어떤 일을 할까? (+필수 역량)' },
    4: { videoId: 'adBZDDOZliI', chapter: 4, title: '허황된 거 말고, 내 브랜드가 진짜 문화가 되려면' },
    5: { videoId: '8Ea6plyPdgY', chapter: 5, title: '멋만 부리는 브랜드가 절대 모르는 것' },
    6: { videoId: 'Tg0hacp_46k', chapter: 6, title: '멋만 부리는 브랜드가 절대 모르는 것 2' },
    7: { videoId: 'FjUojt16DVA', chapter: 7, title: '팔고 싶은 것 vs 사람들이 사고 싶은 것' },
    8: { videoId: 'R-UnodXzD8U', chapter: 8, title: '런칭 후 브랜드 마케팅 첫 목표는 이것' },
    9: { videoId: 'SIwA7Zl6wtU', chapter: 9, title: '팬덤 1,000명까지 브랜드 마케팅 총정리' },
    10: { videoId: 'ccyK76hYzSE', chapter: 10, title: '브랜드 마케팅은 나에게 잘 맞을까?' },
    11: { videoId: 'LORXO4SvhXU', chapter: 11, title: '남들과 다른 기획은 어디에서 올까?' },
    12: { videoId: 'ixdGnE4FPLc', chapter: 12, title: '사업계획서 잘쓰는법' },
    13: { videoId: 'RFRPXV7KLK8', chapter: 13, title: '상표 말고 진짜 브랜드로 경쟁력 만들기' },
    14: { videoId: 'QOySe-R7IVE', chapter: 14, title: '정체성 마케팅 제1원칙' },
    15: { videoId: 'SjJ4W5SMX88', chapter: 15, title: "'아 좀 그냥 해' 에 대한 세계적인 거장의 생각" },
    16: { videoId: 'aRyjw2OO_Qc', chapter: 16, title: '비상식적 가격 법칙' },
    17: { videoId: 'h2SkRbUPQCw', chapter: 17, title: '시끄럽지 않게 마케팅 잘하는 브랜드는 어떻게 하는걸까?' },
    18: { videoId: 'ohyrD-6XBFQ', chapter: 18, title: '대혐오의 시대, 작은 브랜드가 살아남으려면?' },
};

export const CHAPTERS = [
    { week: 1, title: "Not Mass, Not Spam, Not Shameful", subtitle: "마케팅은 광고가 아닌 변화를 일으키는 관대한 행위" },
    { week: 2, title: "The Marketer Learns to See", subtitle: "마케터는 다르게 보는 법을 배운다" },
    { week: 3, title: "Marketing Changes People Through Stories", subtitle: "이야기를 통해 사람들을 변화시킨다" },
    { week: 4, title: "The Smallest Viable Market", subtitle: "최소 유효 시장에 집중하라" },
    { week: 5, title: "In Search of 'Better'", subtitle: "더 나은 것을 추구하며" },
    { week: 6, title: "Beyond Commodities", subtitle: "일용품을 넘어서" },
    { week: 7, title: "The Canvas of Dreams and Desires", subtitle: "꿈과 욕망의 캔버스" },
    { week: 8, title: "More of the Who", subtitle: "타겟을 더 깊이 이해하기" },
    { week: 9, title: "People Like Us Do Things Like This", subtitle: "우리 같은 사람들은 이런 일을 한다" },
    { week: 10, title: "Trust and Tension", subtitle: "신뢰와 긴장" },
    { week: 11, title: "Status, Dominance, and Affiliation", subtitle: "위상, 지배, 소속" },
    { week: 12, title: "A Better Business Plan", subtitle: "더 나은 사업 계획" },
    { week: 13, title: "Semiotics, Symbols, and Vernacular", subtitle: "기호, 상징, 그리고 언어" },
    { week: 14, title: "Treat Different People Differently", subtitle: "다른 사람들을 다르게 대하라" },
    { week: 15, title: "Reaching the Right People", subtitle: "올바른 사람들에게 도달하기" },
    { week: 16, title: "Price Is a Story", subtitle: "가격은 이야기다" },
    { week: 17, title: "Permission and Remarkability", subtitle: "허가와 주목할 만함" },
    { week: 18, title: "Trust Is as Scarce as Attention", subtitle: "신뢰는 주의만큼 희소하다" },
    { week: 19, title: "The Funnel", subtitle: "퍼널" },
    { week: 20, title: "Organizing and Leading a Tribe", subtitle: "부족을 조직하고 이끌기" },
    { week: 21, title: "Some Case Studies", subtitle: "사례 연구" },
    { week: 22, title: "Marketing Works", subtitle: "마케팅은 작동한다" },
    { week: 23, title: "Marketing to the Most Important Person", subtitle: "가장 중요한 사람에게 마케팅하기" },
];

// 왜: Week 1 분석 결과를 하드코딩하여 빠른 프로토타이핑
// 향후 fetch()로 JSON 파일 동적 로딩으로 전환 가능
//
// 🔑 Brand Pivot (2026.02.14 Update):
// 기존 '운동하는 남성' 타겟 → '관리하는 2030 여성' (Aesthetic Self-Care)
// 키워드: #꾸덕함 #세련됨 #수요일_리셋 #밤10시_리추얼
export const WEEK_DATA = {
    1: {
        week: 1,
        chapter: "Chapter 1: Not Mass, Not Spam, Not Shameful",
        status: "completed",
        analysis: {
            coreMessage: "마케팅은 '변화를 일으키는 행위(making change happen)'이다.",
            keyPrinciples: [
                { label: "마케팅 ≠ 광고", desc: "단순히 물건을 파는 게 아니라, 고객의 삶을 더 나은 방향으로 변화시키는 것" },
                { label: "관대한 행위", desc: "남을 속이는 게 아닌, 다른 사람의 문제를 해결하도록 돕는 것" },
                { label: "문화의 창조", desc: "'우리 같은 사람들은 이런 일을 한다'는 소속감과 정체성 형성" },
            ],
            fiveSteps: [
                { step: 1, title: "만들 가치가 있는 것을 고안", desc: "꾸덕함에 집착하는 2030 여성의 '미식 욕구' 발견" },
                { step: 2, title: "소수를 위해 설계", desc: "모두가 아닌, '세련된 자기관리'를 원하는 SVM에 집중" },
                { step: 3, title: "내러티브에 맞는 이야기", desc: "'당신의 식단은 당신의 안목을 증명한다'는 스토리" },
                { step: 4, title: "입소문 퍼뜨리기", desc: "수요일 밤 10시, 긴장감 있는 한정판 드롭" },
                { step: 5, title: "꾸준히 신뢰 구축", desc: "매주 변함없는 꾸덕함으로 신뢰 획득" },
            ],
            wyshApplication: {
                // 왜: 리뷰 데이터 기반 페르소나 (꾸덕함, 식단, 활용도 중시)
                svm: "단순한 다이어트가 아닌, '관리하는 나'를 전시하고 싶은 2030 여성. 요거트 하나를 먹어도 예쁘게 플레이팅하며 자신의 세련된 안목을 확인받고 싶어한다.",
                changeStory: "무미건조한 닭가슴살 식단에서 벗어나, 매일 밤 죄책감 없이 즐기는 '호텔 디저트 같은 안식'으로 변화.",
                culture: "WYSH 피플은 밤 10시가 되면 냉장고를 연다. 야식을 참는 게 아니라, 가장 건강하고 세련된 방식으로 즐긴다.",
                xyStatement: "WYSH는 식단 관리조차 우아한 취미가 되길 원하는 2030 여성들이(X), 죄책감 없는 달콤한 밤(Y)을 보낼 수 있도록 돕는다.",
            },
        },
        trends: {
            marketSize: "1,116억원 (2025, 2년간 2배 성장)",
            marketShare: "떠먹는 요거트 내 23.6%",
            keyTrends: [
                { name: "Aesthetic Health", desc: "보여주기 위한 건강, 예쁜 플레이팅 필수" },
                { name: "Hobbyist Diet", desc: "식단 관리가 고통이 아닌 취미/놀이 화" },
                { name: "티핑 포인트: 수요일", desc: "주중 피로감 최고조, 보상 심리 발동" },
                { name: "나이트 루틴", desc: "잠들기 전 나를 돌보는 시간(Self-care)" },
                { name: "꾸덕함의 미학", desc: "질감 자체가 프리미엄의 척도가 됨" },
                { name: "Guilt-Free Pleasure", desc: "맛있지만 살찌지 않는 모순적 가치 추구" },
            ],
            threats: [
                "저가 대용량 홈메이드 요거트 유행",
                "편의점 PB 상품의 퀄리티 상향 평준화",
                "비주얼보다 가성비 중시하는 불황형 소비",
            ],
        },
        ideas: [
            {
                id: 1,
                title: "'수요일 10PM' 위시 타임 (Mid-week Reset)",
                category: "프로모션",
                categoryEmoji: "🌙",
                // 왜: 주문 데이터 분석 결과 수요일 & 10시에 주문 피크 → 이를 공식 리추얼로 선점
                description: "주말 폭식 후회와 주중 피로가 겹치는 수요일 밤 10시. '망가진 식단, 지금 리셋하세요'라는 메시지와 함께 2시간 한정 타임딜 오픈. 구매 행위 자체를 '내일의 클린한 나를 예약하는 의식'으로 포지셔닝.",
                chapterPrinciple: "긴장(Tension)을 창출하고, 행동할 수 있는 기회를 제공하라.",
                smallestViableAction: "수요일 밤 10시 카카오톡 푸시 발송 + 자사몰 타임딜 배너 오픈",
                successMetric: "수요일 22-24시 매출 전주 대비 150% 성장",
                mfs: { impact: 5, fit: 5, speed: 5, effort: 2, cost: 2, total: 13 },
                recommendation: "즉시 실행",
                risks: ["자사몰 트래픽 폭주 서버 다운", "할인 의존도 심화 우려"],
            },
            {
                id: 2,
                title: "'Guilt-Free Night' 콘텐츠 시리즈",
                category: "콘텐츠",
                categoryEmoji: "✨",
                // 왜: 리뷰에서 '죄책감 없는' 키워드와 '맛' 동시 추구 확인
                description: "야식 참지 마세요, 위시하세요. 밤 11시에 먹어도 다음 날 붓지 않는 '무지방 꾸덕 야식' 레시피(위시 카나페, 요거트 바크 등) 릴스 시리즈. '참는 건 촌스러운 것, 즐기며 관리하는 게 세련된 것'이라는 가치 제안.",
                chapterPrinciple: "사람들에게 더 나은(Better) 대안을 제시하라.",
                smallestViableAction: "밤 배경의 감성적인 레시피 릴스 3편 제작 및 업로드",
                successMetric: "저장/공유 수 200건 이상, '야식' 키워드 유입 증가",
                mfs: { impact: 4, fit: 5, speed: 4, effort: 3, cost: 1, total: 12 },
                recommendation: "우선순위",
                risks: ["고칼로리 토핑(초코 등) 과다 사용 시 모순", "야식 조장 비판 소지"],
            },
            {
                id: 3,
                title: "Aesthetic Plating 챌린지",
                category: "바이럴",
                categoryEmoji: "📸",
                // 왜: 고객들은 '관리하는 나'를 전시하고 싶어함 (Aesthetic Health)
                description: "WYSH를 가장 예쁘게 먹는 순간을 인증하는 챌린지. 단순히 먹는 게 아니라 '식탁 위의 오브제'로 연출. 우수작은 공식 계정 박제 및 '이달의 큐레이터' 선정. 고객의 허영심(Positive Vanity)을 자극하여 자발적 바이럴 유도.",
                chapterPrinciple: "'우리 같은 사람들은 이런 일을 한다'는 부족 문화 형성.",
                smallestViableAction: "인스타그램 챌린지 공지 + 레퍼런스 이미지(핀터레스트 감성) 5장 업로드",
                successMetric: "UGC(유저 생성 콘텐츠) 50건 이상 생성",
                mfs: { impact: 5, fit: 5, speed: 3, effort: 2, cost: 1, total: 12 },
                recommendation: "우선순위",
                risks: ["참여 저조 (진입장벽)", "기존 고객(운동 타겟)의 이질감"],
            },
            {
                id: 4,
                title: "오피스 3시: '당 충전' 대신 '위시 충전'",
                category: "타겟팅",
                categoryEmoji: "🏢",
                // 왜: 2030 오피스 여성의 페인 포인트(오후 당 떨어짐 + 살찍 걱정) 해결
                description: "가장 못생겨지는 시간 오후 3시. 탕비실 과자 대신 책상 위 위시볼 하나. '일 잘하는 여자의 간식' 포지셔닝. 사무실 책상 위에서 위화감 없이 어울리는 세련된 패키지 강조.",
                chapterPrinciple: "타겟의 세계관(Worldview)에 맞는 이야기를 하라.",
                smallestViableAction: "오피스 배경의 공감 툰/이미지 광고 집행 (타겟: 강남/판교 2030 여성)",
                successMetric: "클릭률(CTR) 2% 달성",
                mfs: { impact: 4, fit: 4, speed: 4, effort: 3, cost: 3, total: 11 },
                recommendation: "보류 (Next Step)",
                risks: ["냉장 보관 필요성(오피스 냉장고 전쟁)", "취식 편의성 이슈"],
            },
            {
                id: 5,
                title: "1 Week 1 Tub 정기구독 서약",
                category: "전환",
                categoryEmoji: "📦",
                // 왜: 1주일 1통 소비 패턴을 비즈니스 모델(구독)로 연결
                description: "'매주 월요일, 당신의 냉장고를 채우는 든든한 약속'. 1주일 1통 자동 결제 구독 모델 런칭. 구독자에게만 제공되는 '시크릿 레시피 카드'와 '전용 우드 스푼' 굿즈로 소속감 강화.",
                chapterPrinciple: "신뢰는 희소하다. 꾸준한 약속 이행으로 신뢰를 쌓아라.",
                smallestViableAction: "스마트스토어 정기구독 상품 등록 + 상세페이지 '1통=1주' 루틴 강조 수정",
                successMetric: "구독 전환율 5% 달성",
                mfs: { impact: 5, fit: 5, speed: 2, effort: 4, cost: 2, total: 10 },
                recommendation: "장기 추진",
                risks: ["물류/배송비 이슈", "매주 소비에 대한 가격 부담"],
            },
        ],

        realExecution: {
            status: "pending", // pending | commited
            plan: [
                // 여기에 실제 실행할 위시의 아이디어(또는 수정된 아이디어)를 적으세요
                // 예: { title: "수요일 10PM 타임딜", detail: "인스타 스토리로만 1시간 게릴라 오픈" }
            ],
            retro: "", // 실행 후 회고 (성공/실패 원인)
        },
    },
    2: {
        week: 2,
        chapter: "Chapter 2 & 3: 사람들은 무엇을 원하는가 & 최소유효시장",
        status: "completed",
        analysis: {
            coreMessage: "우리가 파는 것은 제품이 아니라 '기분'이다. 최소유효시장에 집중하라.",
            keyPrinciples: [
                { label: "우리가 파는 것은 기분이다", desc: "제품 구매는 라이프스타일과 소속감, 자기효능감을 얻기 위함" },
                { label: "최소유효시장", desc: "모두를 만족시키기보다 핵심 팬덤에게 인정받아야 함" },
                { label: "문화의 가시화", desc: "'우리 같은 사람들은 이런 일을 한다'를 증명" },
            ],
            fiveSteps: [
                { step: 1, title: "기분 정의", desc: "트렌디한 웰니스 라이프를 실천하는 세련된 기분 선사" },
                { step: 2, title: "기회 전환", desc: "단순 정보 습득을 즉각적인 구매와 실천으로 연결" },
                { step: 3, title: "희소성 레버리지", desc: "품절을 위기가 아닌 브랜드의 배타적 가치로 승화" },
                { step: 4, title: "가시화", desc: "고객이 실천하는 모습을 공간에 전시하여 커뮤니티 형성" },
                { step: 5, title: "신뢰 구축", desc: "매주 발행하는 트렌드 레터로 전문성과 관심 이어가기" },
            ],
            wyshApplication: {
                svm: "단순히 제품을 소비하는 것이 아니라, 자기 관리에 진심인 소수정예 그룹",
                changeStory: "알기만 하는 트렌드에서 멈추는 것이 아니라, 웰니스 리추얼을 직접 실천하고 증명하는 삶으로 변화",
                culture: "WYSH 피플은 트렌드를 읽고 나만의 리추얼 플랜을 세운다.",
                xyStatement: "WYSH는 글로벌 웰니스 트렌드를 내 삶에 적용하고 싶은 사람들이(X), 정성스러운 나만의 웰니스 문화를 실천하도록 돕는다(Y).",
            },
        },
        trends: {
            marketSize: "정보성 메시지 전환 테스트 가설 검증중",
            marketShare: "노출 229건 / 클릭 44건",
            keyTrends: [
                { name: "정보의 실천화", desc: "지식을 아는 데 그치지 않고 구체적 패키지 구매로 이행" },
                { name: "비자발적 희소성", desc: "품절이나 대기가 프리미엄의 인식 지표로 작용" },
                { name: "소셜 리추얼 인증", desc: "개인의 활동을 커뮤니티에 올려 정체성을 각인" },
            ],
            threats: [
                "정보만 재미로 소비하고 제품 경험으로 이어지지 않는 현상",
                "이벤트 당첨 목적의 허수 트래픽 유입",
            ],
        },
        ideas: [
            {
                id: 1,
                title: "'Trend to Table' 원클릭 패키지",
                category: "전환",
                categoryEmoji: "🛒",
                description: "트렌드 아티클 하단에 해당 트렌드를 즉시 적용할 수 있는 '이번 주 위시 리추얼 패키지' 시크릿 구매 링크 삽입.",
                chapterPrinciple: "우리가 파는 것은 제품이 아니라 특정 기분과 열쇠다.",
                smallestViableAction: "다음 주 트렌드 아티클 하단에 전용 큐레이션 세트 상품 구매 버튼 추가",
                successMetric: "아티클 트래픽 대비 구매 전환율 5%",
                mfs: { impact: 5, fit: 5, speed: 4, effort: 2, cost: 1, total: 11 },
                recommendation: "즉시 실행",
                risks: ["품절 시 기대감 단절 위험"],
            },
            {
                id: 2,
                title: "품절 보상 레버리지 & VIP Waiting",
                category: "커뮤니티",
                categoryEmoji: "👑",
                description: "품절을 '희소성'과 '최상 품질 유지'의 결과로 소구. 대기 명단을 받아 가장 먼저 입고 알림을 주는 'WYSH 소수 정예 알림방' 운영.",
                chapterPrinciple: "최소유효시장(Smallest Viable Market)의 배타적 소속감 자극.",
                smallestViableAction: "품절 시 쇼핑몰 팝업 안내 및 대기 명단 폼 연결",
                successMetric: "품절 기간 중 대기 명단 30명 이상 확보",
                mfs: { impact: 4, fit: 5, speed: 5, effort: 2, cost: 1, total: 11 },
                recommendation: "즉시 실행",
                risks: ["알림 후 실제 전환율 하락의 우려"],
            },
            {
                id: 3,
                title: "'Show Your Ritual' 인증 이벤트",
                category: "바이럴",
                categoryEmoji: "📸",
                description: "인스타그램 스토리로 나만의 웰니스 스낵 리추얼을 공유하게 하고 위시 체험권 등 리워드 증정하여 문화를 가시화함.",
                chapterPrinciple: "'우리 같은 사람들은 이런 일을 한다'는 부족 문화 형성.",
                smallestViableAction: "카톡 메시지에 인증 이벤트 안내 및 인스타 태그 유도",
                successMetric: "인스타그램 스토리 태그 20건 이상 확보",
                mfs: { impact: 3, fit: 4, speed: 4, effort: 3, cost: 2, total: 8 },
                recommendation: "우선순위",
                risks: ["마이크로 타겟 대상이라 참여율 저조 가능성"],
            },
        ],
        realExecution: {
            status: "pending",
            plan: [],
            retro: "",
        },
    },
    3: {
        week: 3,
        chapter: "Chapter 3~5: 이야기, 유대, 더 나은 것",
        status: "active",
        analysis: {
            coreMessage: "사람들은 팩트가 아닌 자신의 세계관을 이해하게 해주는 '이야기'를 산다.",
            keyPrinciples: [
                { label: "이야기와 거울", desc: "제품 구매는 나의 가치를 확인하고 증명하는 수단" },
                { label: "최소 유효 시장", desc: "우리의 가치관을 가장 사랑할 '소수의 부족'에 집중" },
                { label: "주관적 '더 나은 것'", desc: "가격 인하 경쟁을 멈추고 타겟 고객만의 '경험의 기준'을 선점" },
            ],
            fiveSteps: [
                { step: 1, title: "감정의 엔드스테이트", desc: "요거트를 먹을 때 느끼는 통제감과 만족감을 스토리텔링" },
                { step: 2, title: "진정성 있는 가이드", desc: "단순 광고가 아닌 일상을 돕는 '관대한 행위(Trend to Table)'" },
                { step: 3, title: "배타성 확보", desc: "누구에게나 할인하는 대신, 우리 부족만 알아보는 가치 제공" },
                { step: 4, title: "커뮤니티 소속감", desc: "이벤트 참여자를 1회성이 아닌 폐쇄형 웰니스 서클로 초대" },
                { step: 5, title: "문화의 확산", desc: "'우리 같은 사람들은 이런 일을 한다'는 부족 문화 형성" },
            ],
            wyshApplication: {
                svm: "단순히 제품을 소비하는 것이 아니라, 세계관에 동조하는 정예 팬덤",
                changeStory: "영양 정보 소비에서 벗어나, 제품을 통해 평온하고 통제된 내 삶을 실현",
                culture: "WYSH 피플은 유행이 아닌 진짜 나다운 의식을 묵묵히 지킨다.",
                xyStatement: "WYSH는 기능성에 매몰된 사람들이(X), 자신의 웰니스 위상을 세우고 증명할 수 있는 이야기를 나누도록(Y) 돕는다.",
            },
        },
        trends: {
            marketSize: "1주차 대비 클릭 및 인증 캠페인 전환율 (진행 예정)",
            marketShare: "비공개 웰니스 서클 가입자 수",
            keyTrends: [
                { name: "엔드스테이트 마케팅", desc: "제품의 스펙보다 제품이 주는 감정적 결과에 집중" },
                { name: "비공개 팬덤 커뮤니티", desc: "대규모 마케팅 대신 소속감을 강조하는 클로즈드 커뮤니티" },
                { name: "주관적 하이엔드 굿즈", desc: "팬덤만 알아볼 수 있는 상징성을 담은 굿즈 활용" },
            ],
            threats: [
                "감성 스토리가 자칫 설명적이고 작위적으로 흐를 위험",
                "폐쇄형 커뮤니티 운영의 리소스 부담 및 단절감 유발"
            ],
        },
        ideas: [
            {
                id: 1,
                title: "'Trend to Table' 스토리텔링 개편",
                category: "콘텐츠",
                categoryEmoji: "📖",
                description: "레시피나 단백질 함량 설명 대신, 요거트를 완성했을 때 느끼는 '통제감과 미식의 평온함'을 묘사하여 관대한 행위로 인식되게 함.",
                chapterPrinciple: "팩트가 아닌 자신의 세상을 이해하는 데 도움을 주는 '이야기'를 구매함.",
                smallestViableAction: "다음 트렌드 레터 실천 가이드를 감정 테마 메시지로 작성",
                successMetric: "수신자 CTR 대비 전환율의 질적 개선",
                mfs: { impact: 4, fit: 5, speed: 5, effort: 1, cost: 1, total: 12 },
                recommendation: "즉시 실행",
                risks: ["너무 은유적이면 구매 명분이 약해짐"],
            },
            {
                id: 2,
                title: "소속감 증명 '배타적 표식' 굿즈",
                category: "브랜딩",
                categoryEmoji: "🥄",
                description: "Show Your Ritual 보상으로 흔한 할인 쿠폰 대신, 팬들만 알아보는 상징적 오브제(우드 스푼 등)를 리워드로 제공.",
                chapterPrinciple: "경쟁 없는 주관적 '더 나은 것(Better)'의 기준 제시.",
                smallestViableAction: "인증 이벤트 경품을 '위시 전용 리추얼 스푼'으로 공지 변경",
                successMetric: "굿즈 수령자의 자발적인 2차 인증(리그램) 비율 30%",
                mfs: { impact: 5, fit: 5, speed: 3, effort: 3, cost: 3, total: 9 },
                recommendation: "우선순위 부여",
                risks: ["제작비 부담 및 타겟 미스매치 시 의미 퇴색"],
            },
            {
                id: 3,
                title: "'WYSH 웰니스 서클' 폐쇄 커뮤니티",
                category: "커뮤니티",
                categoryEmoji: "🔒",
                description: "이벤트 참여자를 1회성 응모자로 두지 않고, 공통 언어를 나누는 비밀 인스타/단톡방으로 초대하여 부족(Tribe)화.",
                chapterPrinciple: "\"우리 같은 사람들은 이런 일을 한다\"는 소속감 기반 커뮤니티 형성.",
                smallestViableAction: "참여자에게 비공개 웰니스 서클 팔로우 초대장(DM) 발송",
                successMetric: "메시지 대비 초대 수락률(가입률) 50%",
                mfs: { impact: 4, fit: 4, speed: 4, effort: 4, cost: 1, total: 9 },
                recommendation: "우선순위 부여",
                risks: ["초기 운영 리소스 부족으로 방치될 리스크"],
            },
        ],
        realExecution: {
            status: "pending",
            plan: [],
            retro: "",
        },
    },
};
