# GEMINI.md: WYSH x Seth Godin Marketing Execution Engine

이 문서는 프로젝트의 핵심 아키텍처와 개발 원칙을 정의합니다. 모든 AI 에이전트와 개발자는 이 규칙을 반드시 준수해야 합니다.

---

## 1. 프로젝트 정의

- **프로젝트명**: WYSH x Seth Godin Marketing Execution Engine
- **브랜드**: WYSH (무지방 고단백 그릭요거트)
- **핵심 소재**: Seth Godin "This is Marketing" (23개 챕터)
- **미션**: 마케팅 철학을 주차별로 분석하여 WYSH 맞춤 실행 전략을 자동 생성

---

## 2. 3계층 아키텍처 (3-Layer Architecture)

복잡성을 관리하고 일관성을 유지하기 위해 다음의 3계층 구조를 사용합니다.

### Layer 1: Directive (What to do)
- **위치**: `directives/`
- **역할**: 주간 분석, 아이디어 생성, 피드백 루프의 표준 작업 절차(SOP) 정의.
- **원칙**: 자연어로 작성된 세부 지침서. 입력, 출력, 도구, 예외 상황을 명시합니다.

### Layer 2: Orchestration (Decision making)
- **위치**: AI 에이전트 (Antigravity)
- **역할**: 지시서를 읽고 판단하며, 도구를 호출하고 에러를 처리하는 브레인 역할.
- **핵심**: 직접 복잡한 로직을 수행하기보다 결정론적 도구(Script)를 조율하는 데 집중합니다.

### Layer 3: Execution (Doing the work)
- **위치**: `execution/`
- **역할**: 파이썬 스크립트 등 실제 작업을 수행하는 결정론적 도구.
- **원칙**: 재사용 가능하고 테스트 가능한 스크립트. `.env`를 통한 환경 변수 관리.

---

## 3. 7대 개발 원칙 (The 7 Commandments)

1. **Atomic Modularity & Separation**: 단일 책임 원칙(SRP) 준수. 파이프라인 각 단계는 독립 스크립트. UI 컴포넌트는 단일 책임.
2. **Explicit Full Output**: 코드 수정 시 일부 생략 없이 파일 전체 내용을 출력.
3. **Readability First**: 직관적인 변수명과 단순하고 명확한 로직 유지.
4. **Spec-First Approach**: 코딩 시작 전 반드시 `SPEC.md`와 `PLAN.md`를 작성하고 승인받음.
5. **Robust Error Handling**: 모든 코드는 예외 상황(Edge Cases)을 고려하여 방어적으로 작성.
6. **Intentional Documentation**: 모든 설명과 주석은 **한국어**로 작성하며, '무엇(What)'보다 **'왜(Why)'**를 상세히 기술.
7. **Incremental Refactoring & Scope Control**: 기능 구현 3회마다 기술 부채 점검. 요청 외 임의 변경 지양.

---

## 4. 활용 도구 (Skills & MCP)

| 도구 | 용도 |
|------|------|
| `youtube-summarizer` | 유튜브 트랜스크립트 추출 + 요약 |
| `notebooklm-mcp` | NotebookLM 지식 베이스 질의 |
| `browser-automation` | WYSH 쇼핑몰/인스타그램 스캔 |
| `deep-research` | D2C 트렌드/최신 인터뷰 리서치 |
| `marketing-ideas` | MFS 기반 마케팅 아이디어 채점 |

---

## 5. 운영 원칙

- **도구 우선 확인**: 직접 스크립트를 짜기 전 `execution/`에 기존 도구가 있는지 확인합니다.
- **자가 치유 (Self-annealing)**: 에러 발생 시 분석 -> 수정 -> 테스트 -> 지시서(Directive) 업데이트 순으로 시스템을 강화합니다.
- **지시서 업데이트**: 새로운 제약 사항이나 최적의 접근법을 발견하면 지시서를 최신화합니다.
- **주차별 데이터 격리**: 각 주차의 데이터는 `data/weeks/week-XX/`에 격리 보관합니다.
