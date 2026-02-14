"""
youtube_transcript.py — 유튜브 트랜스크립트 추출 스크립트

왜(Why) 이 스크립트가 필요한가:
  Seth Godin 관련 유튜브 영상의 트랜스크립트(자막 텍스트)를 추출하여
  마크다운 요약 파일로 저장한다. 이 데이터가 챕터 분석의 1차 소스가 된다.
  youtube-summarizer 스킬의 youtube-transcript-api를 직접 활용한다.

사용법:
  python execution/youtube_transcript.py --url "https://youtu.be/VIDEO_ID" --week 1
  python execution/youtube_transcript.py --url "https://youtu.be/VIDEO_ID" --week 1 --dry-run
  python execution/youtube_transcript.py --url "https://youtu.be/VIDEO_ID" --week 1 --lang ko
"""

import argparse
import json
import re
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

# --- 프로젝트 경로 ---
PROJECT_ROOT = Path(__file__).parent.parent
DATA_DIR = PROJECT_ROOT / "data"
WEEKS_DIR = DATA_DIR / "weeks"

KST = timezone(timedelta(hours=9))


def extract_video_id(url: str) -> str:
    """
    유튜브 URL에서 Video ID를 추출한다.
    왜: 다양한 URL 포맷(youtube.com, youtu.be, m.youtube.com)을
    모두 지원해야 사용자가 어떤 형식으로든 입력할 수 있기 때문이다.
    """
    patterns = [
        # youtube.com/watch?v=VIDEO_ID
        r'(?:youtube\.com/watch\?.*v=)([a-zA-Z0-9_-]{11})',
        # youtu.be/VIDEO_ID
        r'(?:youtu\.be/)([a-zA-Z0-9_-]{11})',
        # youtube.com/embed/VIDEO_ID
        r'(?:youtube\.com/embed/)([a-zA-Z0-9_-]{11})',
        # youtube.com/v/VIDEO_ID
        r'(?:youtube\.com/v/)([a-zA-Z0-9_-]{11})',
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)

    # 왜: URL이 아닌 Video ID 직접 입력도 허용
    if re.match(r'^[a-zA-Z0-9_-]{11}$', url):
        return url

    return None


def fetch_transcript(video_id: str, languages: list = None) -> dict:
    """
    유튜브 트랜스크립트를 추출한다.
    왜: youtube-transcript-api를 래핑하여 에러 핸들링과
    언어 폴백 로직을 캡슐화한다.

    반환값:
      {
        "video_id": "...",
        "language": "en",
        "is_generated": True,
        "segments": [...],
        "full_text": "...",
        "duration_seconds": 1234
      }
    """
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
    except ImportError:
        print("❌ youtube-transcript-api가 설치되지 않았습니다.")
        print("   설치: pip install youtube-transcript-api")
        sys.exit(1)

    # 왜: 한국어를 우선, 영어를 폴백으로 시도. 사용자가 --lang으로 지정 가능.
    if languages is None:
        languages = ["ko", "en"]

    try:
        # 사용 가능한 트랜스크립트 목록 확인
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        print(f"📝 사용 가능한 트랜스크립트:")
        available = []
        for t in transcript_list:
            tag = "[자동생성]" if t.is_generated else "[수동]"
            print(f"   - {t.language} ({t.language_code}) {tag}")
            available.append(t.language_code)

        # 트랜스크립트 가져오기
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=languages)

        # 전체 텍스트 합치기
        full_text = " ".join([entry["text"] for entry in transcript])

        # 총 재생 시간 계산
        if transcript:
            last_entry = transcript[-1]
            duration = last_entry["start"] + last_entry.get("duration", 0)
        else:
            duration = 0

        # 사용된 언어 확인
        used_lang = "unknown"
        for lang in languages:
            if lang in available:
                used_lang = lang
                break

        return {
            "video_id": video_id,
            "language": used_lang,
            "is_generated": True,
            "segments": transcript,
            "full_text": full_text,
            "duration_seconds": int(duration),
            "character_count": len(full_text),
        }

    except Exception as e:
        error_msg = str(e)

        # 왜: 에러 유형별로 구체적인 안내를 제공하여 사용자가 문제를 해결할 수 있게 한다.
        if "TranscriptsDisabled" in error_msg:
            print(f"❌ 이 영상은 자막이 비활성화되어 있습니다: {video_id}")
        elif "NoTranscriptFound" in error_msg:
            print(f"❌ 트랜스크립트를 찾을 수 없습니다: {video_id}")
            print(f"   요청 언어: {', '.join(languages)}")
        elif "VideoUnavailable" in error_msg:
            print(f"❌ 영상이 비공개이거나 존재하지 않습니다: {video_id}")
        else:
            print(f"❌ 트랜스크립트 추출 실패: {error_msg}")

        return None


def save_transcript(result: dict, week_number: int) -> Path:
    """
    추출된 트랜스크립트를 주차별 디렉토리에 마크다운으로 저장한다.
    왜: 마크다운 형식으로 저장하면 사람이 직접 읽기도 편하고,
    다른 도구(NotebookLM 등)에 소스로 제공하기도 용이하다.
    """
    week_dir = WEEKS_DIR / f"week-{week_number:02d}"
    week_dir.mkdir(parents=True, exist_ok=True)

    # --- 마크다운 파일 생성 ---
    transcript_path = week_dir / "transcript.md"

    duration_min = result["duration_seconds"] // 60
    duration_sec = result["duration_seconds"] % 60

    content = f"""# YouTube 트랜스크립트

**Video ID**: {result['video_id']}
**URL**: https://youtube.com/watch?v={result['video_id']}
**언어**: {result['language']}
**길이**: {duration_min}분 {duration_sec}초
**문자 수**: {result['character_count']:,}자
**추출 시각**: {datetime.now(KST).strftime('%Y-%m-%d %H:%M KST')}

---

## 전체 텍스트

{result['full_text']}
"""

    with open(transcript_path, "w", encoding="utf-8") as f:
        f.write(content)

    # --- 원본 세그먼트 JSON 저장 (타임스탬프 포함) ---
    # 왜: 마크다운은 가독성용, JSON은 프로그래밍 활용용으로 분리 저장
    segments_path = week_dir / "transcript_segments.json"
    with open(segments_path, "w", encoding="utf-8") as f:
        json.dump(result["segments"], f, ensure_ascii=False, indent=2)

    print(f"💾 트랜스크립트 저장 완료:")
    print(f"   마크다운: {transcript_path}")
    print(f"   세그먼트: {segments_path}")

    return transcript_path


def main():
    parser = argparse.ArgumentParser(
        description="유튜브 트랜스크립트 추출 스크립트"
    )
    parser.add_argument(
        "--url", required=True,
        help="유튜브 영상 URL 또는 Video ID"
    )
    parser.add_argument(
        "--week", type=int, required=True,
        help="저장할 주차 번호 (1-23)"
    )
    parser.add_argument(
        "--lang", nargs="+", default=["ko", "en"],
        help="트랜스크립트 언어 우선순위 (기본: ko en)"
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="실제 API 호출 없이 URL 파싱만 테스트"
    )

    args = parser.parse_args()

    # Step 1: URL 파싱
    video_id = extract_video_id(args.url)
    if not video_id:
        print(f"❌ 유효하지 않은 YouTube URL: {args.url}")
        print("   지원 형식: https://youtube.com/watch?v=ID, https://youtu.be/ID")
        sys.exit(1)

    print(f"📹 Video ID: {video_id}")

    if args.dry_run:
        print(f"🧪 Dry run 모드 — API 호출을 건너뜁니다.")
        print(f"   주차: {args.week}")
        print(f"   언어: {args.lang}")
        sys.exit(0)

    # Step 2: 트랜스크립트 추출
    print(f"\n🔄 트랜스크립트 추출 중...")
    result = fetch_transcript(video_id, args.lang)

    if result is None:
        sys.exit(1)

    print(f"✅ 추출 완료: {result['character_count']:,}자")

    # Step 3: 파일 저장
    save_transcript(result, args.week)
    print(f"\n🎉 Week {args.week} 트랜스크립트 준비 완료!")


if __name__ == "__main__":
    main()
