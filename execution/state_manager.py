"""
state_manager.py — 주차별 상태 관리 핵심 모듈

왜(Why) 이 모듈이 필요한가:
  이 프로젝트는 23주 반복 사이클로 운영된다. 매주 어떤 챕터를 분석 중인지,
  파이프라인의 어떤 단계까지 완료했는지를 추적해야 한다.
  state.json을 단일 진실 소스(Single Source of Truth)로 사용하며,
  이 모듈이 모든 상태 읽기/쓰기/전이를 담당한다.

사용법:
  python execution/state_manager.py status         # 현재 상태 출력
  python execution/state_manager.py next            # 다음 주차로 전이
  python execution/state_manager.py init-week       # 현재 주차 디렉토리 생성
  python execution/state_manager.py complete-step <step_name>  # 단계 완료 표시
"""

import json
import os
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

# --- 프로젝트 루트 경로를 동적으로 결정 ---
# 왜: execution/ 하위에서 실행되더라도 항상 프로젝트 루트의 data/를 참조하기 위함
PROJECT_ROOT = Path(__file__).parent.parent
DATA_DIR = PROJECT_ROOT / "data"
STATE_FILE = DATA_DIR / "state.json"
WEEKS_DIR = DATA_DIR / "weeks"

# --- 한국 표준시 (KST) ---
KST = timezone(timedelta(hours=9))

# --- "This is Marketing" 23개 챕터 목록 ---
# 왜: 챕터 목록을 코드 내에 상수로 관리하여, state.json 전이 시 다음 챕터를
# 자동으로 결정할 수 있게 한다. 추후 사용자가 수정 가능하도록 별도 파일로 분리 가능.
CHAPTERS = [
    "Chapter 1: Not Mass, Not Spam, Not Shameful...",
    "Chapter 2: The Marketer Learns to See",
    "Chapter 3: Marketing Changes People Through Stories, Connections, and Experience",
    "Chapter 4: The Smallest Viable Market",
    "Chapter 5: In Search of \"Better\"",
    "Chapter 6: Beyond Commodities",
    "Chapter 7: The Canvas of Dreams and Desires",
    "Chapter 8: More of the Who: Seeking the Smallest Viable Market",
    "Chapter 9: People Like Us Do Things Like This",
    "Chapter 10: Trust and Tension",
    "Chapter 11: Status, Dominion, and Affiliation",
    "Chapter 12: A Better Business Plan",
    "Chapter 13: Semiotics, Symbols, and Vernacular",
    "Chapter 14: Treat Different People Differently",
    "Chapter 15: Reaching the Right People",
    "Chapter 16: Price Is a Story",
    "Chapter 17: Permission and Remarkability in a Virtuous Cycle",
    "Chapter 18: Trust Is as Scarce as Attention",
    "Chapter 19: The Funnel",
    "Chapter 20: Organizing and Leading a Tribe",
    "Chapter 21: Some Case Studies Using the Method",
    "Chapter 22: Marketing Works, and Now It's Your Turn",
    "Chapter 23: Marketing to the Most Important Person",
]

# --- 파이프라인 단계 정의 ---
# 왜: 각 주차에서 수행해야 할 단계를 명확히 정의하여,
# 어떤 단계까지 완료했는지 추적하고 중단 후 재시작 시 이어갈 수 있게 한다.
PIPELINE_STEPS = [
    "transcript_extracted",      # 유튜브 트랜스크립트 추출 완료
    "notebooklm_analyzed",       # NotebookLM 챕터 분석 완료
    "wysh_context_collected",    # WYSH 쇼핑몰/인스타 스캔 완료
    "trends_researched",         # D2C 트렌드 리서치 완료
    "ideas_generated",           # 마케팅 아이디어 생성 완료
    "feedback_applied",          # 이전 주차 피드백 반영 완료
]


def load_state() -> dict:
    """
    state.json을 읽어 딕셔너리로 반환한다.
    왜: 단일 진실 소스에서 현재 상태를 가져오기 위함.
    파일이 없으면 초기 상태를 생성한다.
    """
    if not STATE_FILE.exists():
        # 왜: 초기 실행 시 state.json이 없을 수 있으므로 기본값으로 생성
        initial_state = {
            "project": "WYSH x Seth Godin Marketing Execution Engine",
            "total_weeks": len(CHAPTERS),
            "current_week": 1,
            "current_chapter": CHAPTERS[0],
            "status": "pending",
            "youtube_urls": [],
            "notebooklm_notebook_url": None,
            "created_at": datetime.now(KST).isoformat(),
            "updated_at": datetime.now(KST).isoformat(),
            "history": [],
        }
        save_state(initial_state)
        return initial_state

    with open(STATE_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_state(state: dict) -> None:
    """
    state.json에 상태를 저장한다.
    왜: 모든 상태 변경은 반드시 이 함수를 통해야 일관성이 보장된다.
    """
    state["updated_at"] = datetime.now(KST).isoformat()

    # 왜: data/ 디렉토리가 없을 수 있으므로 방어적으로 생성
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)


def get_week_dir(week_number: int) -> Path:
    """
    주차별 데이터 디렉토리 경로를 반환한다.
    왜: 주차 번호를 zero-padded 문자열로 변환하여 파일 정렬이 자연스럽게 되도록 한다.
    """
    return WEEKS_DIR / f"week-{week_number:02d}"


def init_week(state: dict) -> dict:
    """
    현재 주차의 디렉토리와 초기 파일을 생성한다.
    왜: 매주 시작 시 필요한 데이터 폴더를 생성하고,
    history에 새 주차 엔트리를 추가하여 진행 상태를 기록한다.
    """
    week_num = state["current_week"]
    chapter = state["current_chapter"]
    week_dir = get_week_dir(week_num)

    # 왜: 이미 생성된 주차라면 중복 생성을 방지
    if week_dir.exists():
        print(f"⚠️  Week {week_num} 디렉토리가 이미 존재합니다: {week_dir}")
        return state

    week_dir.mkdir(parents=True, exist_ok=True)
    print(f"📁 Week {week_num} 디렉토리 생성: {week_dir}")

    # 왜: 주차별로 어떤 파이프라인 단계를 완료했는지 추적하는 메타 파일 생성
    week_meta = {
        "week": week_num,
        "chapter": chapter,
        "started_at": datetime.now(KST).isoformat(),
        "completed_at": None,
        "completed_steps": [],
        "ideas_count": 0,
    }

    meta_path = week_dir / "meta.json"
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(week_meta, f, ensure_ascii=False, indent=2)

    # history에 추가
    # 왜: 전체 프로젝트 히스토리에서 각 주차의 시작/완료를 한눈에 볼 수 있게 한다.
    state["history"].append({
        "week": week_num,
        "chapter": chapter,
        "started_at": datetime.now(KST).isoformat(),
        "completed_at": None,
        "ideas_count": 0,
        "feedback_applied": False,
    })

    state["status"] = "in_progress"
    save_state(state)

    print(f"✅ Week {week_num} 초기화 완료: {chapter}")
    return state


def complete_step(state: dict, step_name: str) -> dict:
    """
    현재 주차에서 특정 파이프라인 단계를 완료 표시한다.
    왜: 파이프라인 중간에 중단되더라도 어디서부터 재시작해야 하는지 알 수 있다.
    """
    if step_name not in PIPELINE_STEPS:
        valid_steps = ", ".join(PIPELINE_STEPS)
        print(f"❌ 알 수 없는 단계: '{step_name}'")
        print(f"   유효한 단계: {valid_steps}")
        return state

    week_num = state["current_week"]
    week_dir = get_week_dir(week_num)
    meta_path = week_dir / "meta.json"

    if not meta_path.exists():
        print(f"❌ Week {week_num} 메타 파일이 없습니다. 먼저 init-week를 실행하세요.")
        return state

    with open(meta_path, "r", encoding="utf-8") as f:
        week_meta = json.load(f)

    # 왜: 이미 완료된 단계는 다시 표시하지 않는다 (멱등성 보장)
    if step_name in week_meta["completed_steps"]:
        print(f"⚠️  '{step_name}' 단계는 이미 완료되었습니다.")
        return state

    week_meta["completed_steps"].append(step_name)

    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(week_meta, f, ensure_ascii=False, indent=2)

    remaining = [s for s in PIPELINE_STEPS if s not in week_meta["completed_steps"]]
    progress = len(week_meta["completed_steps"]) / len(PIPELINE_STEPS) * 100

    print(f"✅ '{step_name}' 완료 ({progress:.0f}%)")
    if remaining:
        print(f"   남은 단계: {', '.join(remaining)}")
    else:
        print(f"🎉 Week {week_num} 모든 단계 완료!")

    save_state(state)
    return state


def transition_to_next_week(state: dict) -> dict:
    """
    현재 주차를 완료하고 다음 주차로 전이한다.
    왜: 주간 사이클의 핵심 로직. 자동으로 다음 챕터를 설정하고
    상태를 갱신하여 매끄러운 순환이 가능하게 한다.
    """
    week_num = state["current_week"]
    total = state["total_weeks"]

    # --- 현재 주차 완료 처리 ---
    week_dir = get_week_dir(week_num)
    meta_path = week_dir / "meta.json"

    if meta_path.exists():
        with open(meta_path, "r", encoding="utf-8") as f:
            week_meta = json.load(f)

        # 왜: 모든 단계가 완료되지 않았으면 경고 (강제 전이는 허용)
        incomplete = [s for s in PIPELINE_STEPS if s not in week_meta.get("completed_steps", [])]
        if incomplete:
            print(f"⚠️  Week {week_num}에 미완료 단계가 있습니다: {', '.join(incomplete)}")
            print(f"   강제로 다음 주차로 전이합니다.")

        week_meta["completed_at"] = datetime.now(KST).isoformat()
        with open(meta_path, "w", encoding="utf-8") as f:
            json.dump(week_meta, f, ensure_ascii=False, indent=2)

    # history 업데이트
    for entry in state["history"]:
        if entry["week"] == week_num and entry["completed_at"] is None:
            entry["completed_at"] = datetime.now(KST).isoformat()
            break

    # --- 다음 주차로 전이 ---
    if week_num >= total:
        # 왜: 23주 사이클 완주 시 completed 상태로 전환
        state["status"] = "completed"
        save_state(state)
        print(f"🏆 축하합니다! 전체 {total}주 사이클을 완주했습니다!")
        return state

    next_week = week_num + 1
    next_chapter = CHAPTERS[next_week - 1]  # 0-indexed

    state["current_week"] = next_week
    state["current_chapter"] = next_chapter
    state["status"] = "pending"
    save_state(state)

    print(f"➡️  Week {next_week}로 전이 완료: {next_chapter}")
    return state


def print_status(state: dict) -> None:
    """
    현재 프로젝트 상태를 보기 좋게 출력한다.
    왜: 에이전트와 사용자 모두가 현재 상황을 빠르게 파악할 수 있어야 한다.
    """
    week_num = state["current_week"]
    total = state["total_weeks"]
    chapter = state["current_chapter"]
    status = state["status"]

    # 진행률 바 계산
    progress = (week_num - 1) / total * 100
    bar_filled = int(progress / 5)
    bar_empty = 20 - bar_filled
    bar = "█" * bar_filled + "░" * bar_empty

    print("╔══════════════════════════════════════════════════════════════╗")
    print("║     📊 WYSH x Seth Godin — 프로젝트 상태                    ║")
    print("╠══════════════════════════════════════════════════════════════╣")
    print(f"║ 현재 주차: {week_num}/{total} ({status})                    ")
    print(f"║ 챕터: {chapter[:50]}{'...' if len(chapter) > 50 else ''}   ")
    print(f"║ 진행률: [{bar}] {progress:.0f}%                           ")
    print("╚══════════════════════════════════════════════════════════════╝")

    # 현재 주차 파이프라인 진행 상황
    week_dir = get_week_dir(week_num)
    meta_path = week_dir / "meta.json"

    if meta_path.exists():
        with open(meta_path, "r", encoding="utf-8") as f:
            week_meta = json.load(f)

        completed = week_meta.get("completed_steps", [])
        print("\n📋 파이프라인 진행 상황:")
        for step in PIPELINE_STEPS:
            icon = "✅" if step in completed else "⬜"
            print(f"   {icon} {step}")
    else:
        print(f"\n📋 Week {week_num} 아직 초기화되지 않음. 'init-week' 명령을 실행하세요.")


def main():
    """
    CLI 엔트리포인트.
    왜: state_manager를 커맨드라인에서 직접 실행할 수 있게 하여
    에이전트와 개발자 모두 사용 가능하게 한다.
    """
    if len(sys.argv) < 2:
        print("사용법: python execution/state_manager.py <command>")
        print("")
        print("명령어:")
        print("  status          현재 프로젝트 상태 출력")
        print("  init-week       현재 주차 디렉토리 초기화")
        print("  next            다음 주차로 전이")
        print("  complete-step <step>  파이프라인 단계 완료 표시")
        print("")
        print("파이프라인 단계:")
        for step in PIPELINE_STEPS:
            print(f"  - {step}")
        sys.exit(1)

    command = sys.argv[1]
    state = load_state()

    if command == "status":
        print_status(state)
    elif command == "init-week":
        init_week(state)
    elif command == "next":
        transition_to_next_week(state)
    elif command == "complete-step":
        if len(sys.argv) < 3:
            print("❌ 단계 이름을 지정해주세요.")
            print(f"   예: python execution/state_manager.py complete-step transcript_extracted")
            sys.exit(1)
        complete_step(state, sys.argv[2])
    else:
        print(f"❌ 알 수 없는 명령어: '{command}'")
        sys.exit(1)


if __name__ == "__main__":
    main()
