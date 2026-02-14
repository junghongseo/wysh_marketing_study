"""
trend_researcher.py — D2C 식품 트렌드 리서치 스크립트

왜(Why) 이 스크립트가 필요한가:
  Seth Godin의 최신 인터뷰, D2C 식품 업계 동향, 건강식품 마케팅 트렌드를
  자동으로 리서치하여 마케팅 아이디어의 시장 적합성을 높인다.
  deep-research 스킬(Gemini Deep Research Agent)을 래핑한다.

사용법:
  python execution/trend_researcher.py --week 1
  python execution/trend_researcher.py --week 1 --query "커스텀 리서치 쿼리"
  python execution/trend_researcher.py --week 1 --topics "D2C 트렌드" "그릭요거트 시장"
"""

import argparse
import json
import os
import subprocess
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent
DATA_DIR = PROJECT_ROOT / "data"
WEEKS_DIR = DATA_DIR / "weeks"
SKILLS_DIR = Path("/Users/hong/Desktop/Antigravity/AI Skills/skills")

KST = timezone(timedelta(hours=9))

# --- 기본 리서치 쿼리 ---
# 왜: 매주 고정된 관심 분야를 리서치하여 트렌드 변화를 추적하고,
# 챕터별로 추가 쿼리를 덧붙여 맥락 있는 리서치가 되도록 한다.
DEFAULT_TOPICS = [
    "D2C 식품 브랜드 마케팅 트렌드 2026 한국",
    "그릭요거트 시장 트렌드 및 소비자 행동 2026",
    "Seth Godin 최신 인터뷰 마케팅 인사이트 2026",
]


def check_api_key() -> bool:
    """
    GEMINI_API_KEY 환경 변수를 확인한다.
    왜: deep-research 스킬은 Gemini API를 사용하므로
    키가 없으면 실행할 수 없다. 사전에 확인하여 실패를 방지한다.
    """
    # .env에서 로드 시도
    env_path = PROJECT_ROOT / ".env"
    if env_path.exists():
        with open(env_path, "r") as f:
            for line in f:
                line = line.strip()
                if line.startswith("GEMINI_API_KEY=") and "your-" not in line:
                    key = line.split("=", 1)[1].strip()
                    if key:
                        os.environ["GEMINI_API_KEY"] = key
                        return True

    if os.environ.get("GEMINI_API_KEY"):
        return True

    return False


def run_deep_research(query: str, output_format: str = None) -> dict:
    """
    deep-research 스킬 스크립트를 실행한다.
    왜: deep-research 스킬은 독립 Python 스크립트로 제공되므로
    subprocess로 호출하여 결과를 받아온다.
    비용($2-5/작업)과 시간(2-10분)이 소요되므로 주의가 필요하다.

    반환값:
      {
        "query": "...",
        "result": "... 리서치 결과 마크다운 ...",
        "status": "success" | "error",
        "cost_estimate": "$2-5"
      }
    """
    research_script = SKILLS_DIR / "deep-research" / "scripts" / "research.py"

    if not research_script.exists():
        print(f"⚠️  deep-research 스킬 스크립트를 찾을 수 없습니다: {research_script}")
        return {
            "query": query,
            "result": None,
            "status": "skill_not_found",
            "instruction": (
                "deep-research 스킬을 사용할 수 없습니다. "
                "에이전트가 search_web 도구를 사용하여 수동으로 리서치해주세요."
            ),
        }

    # 왜: 리서치는 2-10분 소요되므로 --stream 옵션으로 진행 상황을 표시
    cmd = [
        sys.executable, str(research_script),
        "--query", query,
        "--json",
    ]

    if output_format:
        cmd.extend(["--format", output_format])

    try:
        print(f"🔬 리서치 시작: {query[:80]}...")
        print(f"   예상 소요 시간: 2-10분")
        print(f"   예상 비용: $2-5")

        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=900,  # 15분 타임아웃
            cwd=str(SKILLS_DIR / "deep-research"),
        )

        if result.returncode == 0:
            try:
                return {
                    "query": query,
                    "result": json.loads(result.stdout),
                    "status": "success",
                }
            except json.JSONDecodeError:
                return {
                    "query": query,
                    "result": result.stdout,
                    "status": "success",
                }
        else:
            return {
                "query": query,
                "result": None,
                "status": "error",
                "error": result.stderr,
            }

    except subprocess.TimeoutExpired:
        return {
            "query": query,
            "result": None,
            "status": "timeout",
            "error": "리서치가 15분을 초과했습니다.",
        }
    except Exception as e:
        return {
            "query": query,
            "result": None,
            "status": "error",
            "error": str(e),
        }


def generate_search_fallback(query: str) -> dict:
    """
    deep-research 사용 불가 시, 에이전트에게 웹 검색을 지시한다.
    왜: deep-research가 비용/시간 문제로 사용 불가한 경우에도
    에이전트의 search_web 도구로 대체하여 무중단 운영이 가능하도록 한다.
    """
    return {
        "method": "agent_search",
        "tool": "search_web",
        "parameters": {
            "query": query,
        },
        "instruction": (
            f"에이전트(Antigravity)가 search_web 도구를 사용하여 "
            f"'{query}' 쿼리로 웹 검색을 수행하고 결과를 정리해주세요."
        ),
    }


def save_trends(results: list, week_number: int) -> Path:
    """
    리서치 결과를 주차별 디렉토리에 저장한다.
    왜: 다른 파이프라인 단계(아이디어 생성)에서 참조할 수 있도록
    마크다운과 JSON 모두 저장한다.
    """
    week_dir = WEEKS_DIR / f"week-{week_number:02d}"
    week_dir.mkdir(parents=True, exist_ok=True)

    # --- 마크다운 저장 ---
    trends_path = week_dir / "trends.md"

    content = f"""# D2C 트렌드 리서치 — Week {week_number}

**리서치 시각**: {datetime.now(KST).strftime('%Y-%m-%d %H:%M KST')}
**쿼리 수**: {len(results)}

---

"""
    for i, result in enumerate(results, 1):
        content += f"## {i}. {result.get('query', 'N/A')}\n\n"
        status = result.get("status", "unknown")

        if status == "success" and result.get("result"):
            if isinstance(result["result"], dict):
                content += json.dumps(result["result"], ensure_ascii=False, indent=2)
            else:
                content += str(result["result"])
        elif status == "skill_not_found":
            content += f"⚠️ {result.get('instruction', '스킬 미발견')}\n"
        elif status == "error":
            content += f"❌ 에러: {result.get('error', '알 수 없음')}\n"
        else:
            content += f"상태: {status}\n"

        content += "\n\n---\n\n"

    with open(trends_path, "w", encoding="utf-8") as f:
        f.write(content)

    # --- JSON 저장 ---
    trends_json_path = week_dir / "trends.json"
    with open(trends_json_path, "w", encoding="utf-8") as f:
        json.dump({
            "week": week_number,
            "researched_at": datetime.now(KST).isoformat(),
            "results": results,
        }, f, ensure_ascii=False, indent=2)

    print(f"💾 트렌드 리서치 결과 저장 완료:")
    print(f"   마크다운: {trends_path}")
    print(f"   JSON: {trends_json_path}")

    return trends_path


def main():
    parser = argparse.ArgumentParser(
        description="D2C 식품 트렌드 리서치 스크립트"
    )
    parser.add_argument(
        "--week", type=int, required=True,
        help="주차 번호 (1-23)"
    )
    parser.add_argument(
        "--topics", nargs="+", default=None,
        help="리서치할 토픽 목록 (생략 시 기본 토픽 사용)"
    )
    parser.add_argument(
        "--query", type=str, default=None,
        help="단일 커스텀 리서치 쿼리"
    )
    parser.add_argument(
        "--skip-deep-research", action="store_true",
        help="deep-research 스킬을 건너뛰고 search_web 폴백 지시만 생성"
    )

    args = parser.parse_args()

    # --- 리서치 토픽 결정 ---
    topics = args.topics or DEFAULT_TOPICS
    if args.query:
        topics = [args.query]

    print(f"🔍 리서치 토픽 {len(topics)}개:")
    for i, topic in enumerate(topics, 1):
        print(f"   {i}. {topic}")

    # --- API 키 확인 ---
    has_key = check_api_key()
    if not has_key:
        print("\n⚠️  GEMINI_API_KEY가 설정되지 않았습니다.")
        print("   deep-research 스킬 대신 search_web 폴백을 사용합니다.\n")

    # --- 리서치 실행 ---
    results = []

    for topic in topics:
        if args.skip_deep_research or not has_key:
            # 폴백: 에이전트에게 웹 검색 지시
            result = generate_search_fallback(topic)
            result["query"] = topic
            result["status"] = "fallback"
            results.append(result)
            print(f"\n📡 폴백 지시 생성: {topic[:60]}...")
        else:
            result = run_deep_research(topic)
            results.append(result)

    # --- 결과 저장 ---
    save_trends(results, args.week)
    print(f"\n🎉 Week {args.week} 트렌드 리서치 완료!")


if __name__ == "__main__":
    main()
