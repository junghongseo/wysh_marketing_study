# SOP: 주간 분석 (Weekly Analysis)

> **버전**: v1.0  
> **역할**: 매주 1회 실행되는 전체 분석 파이프라인의 표준 작업 절차  
> **실행자**: AI 에이전트 (Antigravity) — Orchestration Layer

---

## 목적

이번 주에 해당하는 "This is Marketing" 챕터를 분석하고, WYSH 브랜드 맥락을 수집하여 마케팅 아이디어를 생성하는 전체 흐름을 정의한다.

---

## 사전 조건

- [ ] `.env` 파일에 필요한 환경 변수가 설정됨
- [ ] NotebookLM에 "This is Marketing" 소스가 업로드됨
- [ ] 이번 주 분석할 YouTube 영상 URL이 확인됨

---

## 실행 절차

### Step 1: 상태 확인 및 주차 초기화

```bash
# 현재 프로젝트 상태 확인
python execution/state_manager.py status

# 현재 주차 디렉토리 초기화 (처음 한 번만)
python execution/state_manager.py init-week
```

**확인**: `data/weeks/week-XX/` 디렉토리와 `meta.json`이 생성됨.

---

### Step 2: YouTube 트랜스크립트 추출

```bash
python execution/youtube_transcript.py --url "<영상_URL>" --week <주차번호>
```

**입력**: YouTube 영상 URL  
**출력**: `data/weeks/week-XX/transcript.md`, `transcript_segments.json`  
**완료 표시**:
```bash
python execution/state_manager.py complete-step transcript_extracted
```

**에러 시 대응**:
- 자막 비활성화 → 해당 영상 스킵, 다른 영상 찾기
- 네트워크 오류 → 1분 후 재시도 (최대 3회)

---

### Step 3: NotebookLM 챕터 분석

```bash
python execution/notebooklm_query.py --week <주차번호> --auto
```

**또는 MCP를 직접 호출**:
- `mcp_notebooklm_ask_question` 도구 사용
- 기본 질문 4개를 순차 질의
- 응답을 `data/weeks/week-XX/chapter-analysis.md`에 저장

**완료 표시**:
```bash
python execution/state_manager.py complete-step notebooklm_analyzed
```

**에러 시 대응**:
- 일일 쿼리 한도(50회) 초과 → 다음 날 재시도
- 인증 만료 → `mcp_notebooklm_re_auth` 실행

---

### Step 4: WYSH 브랜드 컨텍스트 수집

```bash
python execution/wysh_scanner.py --target all --week <주차번호>
```

**출력**: `data/weeks/week-XX/wysh-context.json`  
**완료 표시**:
```bash
python execution/state_manager.py complete-step wysh_context_collected
```

**에러 시 대응**:
- Instagram 접근 차단 → `--target shop`으로 쇼핑몰만 스캔
- 쇼핑몰 구조 변경 → `wysh_scanner.py`의 셀렉터 업데이트

---

### Step 5: D2C 트렌드 리서치

```bash
python execution/trend_researcher.py --week <주차번호>
```

**출력**: `data/weeks/week-XX/trends.md`, `trends.json`  
**완료 표시**:
```bash
python execution/state_manager.py complete-step trends_researched
```

**에러 시 대응**:
- GEMINI_API_KEY 미설정 → `search_web` 도구로 폴백
- 타임아웃 → `--skip-deep-research` 플래그로 폴백 모드 실행

---

### Step 6: 마케팅 아이디어 생성

→ `directives/idea-generation.md` SOP를 따른다.

**완료 표시**:
```bash
python execution/state_manager.py complete-step ideas_generated
```

---

### Step 7: 피드백 루프 (Week 2부터)

→ `directives/feedback-loop.md` SOP를 따른다.

**완료 표시**:
```bash
python execution/state_manager.py complete-step feedback_applied
```

---

### Step 8: 주차 완료 및 전이

```bash
# 최종 상태 확인
python execution/state_manager.py status

# 다음 주차로 전이
python execution/state_manager.py next
```

**결과**: `state.json`의 `current_week`가 +1, 다음 챕터가 자동 설정됨.

---

## 산출물 체크리스트

| 파일 | 설명 |
|------|------|
| `transcript.md` | 유튜브 트랜스크립트 |
| `chapter-analysis.md` | NotebookLM 분석 인사이트 |
| `wysh-context.json` | WYSH 쇼핑몰/인스타 스냅샷 |
| `trends.md` | D2C 트렌드 리서치 |
| `ideas.json` | MFS 채점 마케팅 아이디어 |
| `feedback.json` | 이전 주차 피드백 (Week 2+) |
| `meta.json` | 주차 메타데이터 및 진행 상태 |
