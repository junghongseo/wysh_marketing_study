"""
notebooklm_query.py — NotebookLM 질의 스크립트

왜(Why) 이 스크립트가 필요한가:
  NotebookLM에 "This is Marketing" 챕터 내용을 질의하여
  소스 기반(hallucination-free)의 분석 인사이트를 얻는다.
  notebooklm-mcp 서버를 우선 사용하고, 실패 시 notebooklm 스킬 스크립트로 폴백한다.

사용법:
  python execution/notebooklm_query.py --week 1 --questions "질문1" "질문2"
  python execution/notebooklm_query.py --week 1 --chapter "Chapter 1: ..."
  python execution/notebooklm_query.py --week 1 --auto
"""

import argparse
import json
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
DATA_DIR = PROJECT_ROOT / "data"
WEEKS_DIR = DATA_DIR / "weeks"

KST = timezone(timedelta(hours=9))

# --- 챕터별 기본 질문 템플릿 ---
# 왜: 매주 동일한 프레임워크로 챕터를 분석해야 일관성 있는 결과를 얻을 수 있다.
# WYSH 브랜드 맥락을 포함한 질문으로 구성하여 단순 요약이 아닌 적용 가능한 인사이트를 생성.
DEFAULT_QUESTIONS = [
    "이 챕터의 핵심 마케팅 원칙 3가지를 요약해주세요. 각 원칙에 대해 구체적인 예시와 함께 설명해주세요.",
    "이 챕터의 원칙을 무지방 고단백 그릭요거트 D2C 브랜드(WYSH)에 적용한다면, 어떤 구체적인 마케팅 액션을 취할 수 있을까요? 3가지 이상 제안해주세요.",
    "Seth Godin이 이 챕터에서 경고하는 마케팅 실수나 흔한 오류는 무엇인가요? WYSH가 이를 어떻게 피할 수 있을까요?",
    "이 챕터의 'Smallest Viable Market' 개념을 WYSH에 적용하면, WYSH의 최소 실행 가능 시장(타겟 고객)은 누구일까요?",
]


def load_notebooklm_config() -> dict:
    """
    .env에서 NotebookLM 관련 설정을 로드한다.
    왜: API URL이나 노트북 ID를 코드에 하드코딩하지 않고
    환경 변수로 관리하여 유연성을 확보한다.
    """
    config = {
        "notebook_url": None,
        "notebook_id": None,
    }

    # .env 파일에서 로드 시도
    env_path = PROJECT_ROOT / ".env"
    if env_path.exists():
        with open(env_path, "r") as f:
            for line in f:
                line = line.strip()
                if line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                key = key.strip()
                value = value.strip()
                if key == "NOTEBOOKLM_NOTEBOOK_URL":
                    config["notebook_url"] = value

    return config


def query_via_mcp(question: str, notebook_url: str = None) -> dict:
    """
    notebooklm-mcp 서버를 통해 질의한다.
    왜: MCP 서버를 사용하면 에이전트 레벨에서 직접 호출할 수 있어
    파이프라인 자동화에 가장 적합하다.

    주의: 이 함수는 에이전트(Antigravity)가 MCP 도구를 호출할 때
    참조하는 인터페이스 정의이다. 실제 MCP 호출은 에이전트 레이어에서 수행된다.

    반환값:
      {
        "method": "mcp",
        "question": "...",
        "answer": "...",
        "timestamp": "..."
      }
    """
    # 왜: 이 스크립트는 "실행 도구"이지만, NotebookLM MCP 호출은
    # "오케스트레이션 레이어"(에이전트)가 수행하는 것이 아키텍처적으로 맞다.
    # 따라서 이 함수는 에이전트가 호출해야 할 MCP 파라미터를 JSON으로 반환한다.
    return {
        "method": "mcp",
        "tool": "mcp_notebooklm_ask_question",
        "parameters": {
            "question": question,
            "notebook_url": notebook_url,
        },
        "instruction": (
            "에이전트(Antigravity)가 mcp_notebooklm_ask_question 도구를 "
            "위 파라미터로 호출해주세요."
        ),
    }


def generate_chapter_questions(chapter_name: str, custom_questions: list = None) -> list:
    """
    챕터 이름을 기반으로 질문 목록을 생성한다.
    왜: 기본 질문 템플릿을 챕터별로 커스터마이징하여
    더 구체적이고 맥락에 맞는 분석 결과를 얻기 위함이다.
    """
    questions = []

    if custom_questions:
        questions.extend(custom_questions)
    else:
        # 기본 질문에 챕터명을 삽입
        for q in DEFAULT_QUESTIONS:
            questions.append(f"[{chapter_name}] {q}")

    return questions


def save_analysis(results: list, week_number: int, chapter_name: str) -> Path:
    """
    분석 결과를 주차별 디렉토리에 저장한다.
    왜: 마크다운과 JSON 모두 저장하여 사람 가독성과 프로그래밍 활용을 동시에 지원.
    """
    week_dir = WEEKS_DIR / f"week-{week_number:02d}"
    week_dir.mkdir(parents=True, exist_ok=True)

    # --- 마크다운 저장 ---
    analysis_path = week_dir / "chapter-analysis.md"

    content = f"""# 챕터 분석: {chapter_name}

**분석 시각**: {datetime.now(KST).strftime('%Y-%m-%d %H:%M KST')}
**질문 수**: {len(results)}

---

"""
    for i, result in enumerate(results, 1):
        content += f"## Q{i}: {result.get('question', 'N/A')}\n\n"
        content += f"{result.get('answer', '(응답 없음)')}\n\n"
        content += "---\n\n"

    with open(analysis_path, "w", encoding="utf-8") as f:
        f.write(content)

    # --- JSON 저장 ---
    analysis_json_path = week_dir / "chapter-analysis.json"
    with open(analysis_json_path, "w", encoding="utf-8") as f:
        json.dump({
            "chapter": chapter_name,
            "week": week_number,
            "analyzed_at": datetime.now(KST).isoformat(),
            "results": results,
        }, f, ensure_ascii=False, indent=2)

    print(f"💾 분석 결과 저장 완료:")
    print(f"   마크다운: {analysis_path}")
    print(f"   JSON: {analysis_json_path}")

    return analysis_path


def main():
    parser = argparse.ArgumentParser(
        description="NotebookLM 챕터 분석 질의 스크립트"
    )
    parser.add_argument(
        "--week", type=int, required=True,
        help="주차 번호 (1-23)"
    )
    parser.add_argument(
        "--chapter", type=str, default=None,
        help="챕터 이름 (생략 시 state.json에서 현재 챕터 사용)"
    )
    parser.add_argument(
        "--questions", nargs="+", default=None,
        help="커스텀 질문 목록 (생략 시 기본 질문 사용)"
    )
    parser.add_argument(
        "--auto", action="store_true",
        help="state.json에서 자동으로 챕터와 설정을 가져옴"
    )

    args = parser.parse_args()

    # --- 챕터 결정 ---
    chapter_name = args.chapter
    if chapter_name is None:
        # state.json에서 현재 챕터 가져오기
        state_path = DATA_DIR / "state.json"
        if state_path.exists():
            with open(state_path, "r", encoding="utf-8") as f:
                state = json.load(f)
            chapter_name = state.get("current_chapter", f"Week {args.week}")
        else:
            chapter_name = f"Week {args.week}"

    # --- 질문 생성 ---
    questions = generate_chapter_questions(chapter_name, args.questions)

    print(f"📖 챕터: {chapter_name}")
    print(f"📋 질문 {len(questions)}개 준비:")
    for i, q in enumerate(questions, 1):
        print(f"   Q{i}: {q[:80]}{'...' if len(q) > 80 else ''}")

    # --- NotebookLM 설정 확인 ---
    config = load_notebooklm_config()
    if not config["notebook_url"]:
        print("\n⚠️  NOTEBOOKLM_NOTEBOOK_URL이 설정되지 않았습니다.")
        print("   .env 파일에 NOTEBOOKLM_NOTEBOOK_URL을 설정하거나,")
        print("   에이전트가 mcp_notebooklm_ask_question 도구를 직접 호출해주세요.")

    # --- MCP 호출 지시 생성 ---
    print("\n📡 NotebookLM MCP 호출 지시:")
    for i, question in enumerate(questions, 1):
        mcp_call = query_via_mcp(question, config.get("notebook_url"))
        print(f"\n--- Q{i} ---")
        print(json.dumps(mcp_call, ensure_ascii=False, indent=2))

    print(f"\n💡 에이전트가 위 지시에 따라 mcp_notebooklm_ask_question을 호출하고,")
    print(f"   응답을 수집한 뒤 save_analysis()를 호출하면 Week {args.week} 분석이 완료됩니다.")


if __name__ == "__main__":
    main()
