"""
wysh_scanner.py — WYSH 쇼핑몰/인스타그램 스캔 스크립트

왜(Why) 이 스크립트가 필요한가:
  WYSH의 현재 브랜드 컨텍스트(제품 라인업, 프로모션, 인스타그램 콘텐츠)를
  수집하여 마케팅 아이디어 생성 시 최신 상황을 반영하기 위함이다.
  browser-automation 스킬의 Playwright를 활용한다.

사용법:
  python execution/wysh_scanner.py --target shop --week 1
  python execution/wysh_scanner.py --target instagram --week 1
  python execution/wysh_scanner.py --target all --week 1
  python execution/wysh_scanner.py --target shop --week 1 --headless
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

# --- WYSH 브랜드 URL ---
WYSH_SHOP_URL = "https://wysh.it/"
WYSH_INSTAGRAM_URL = "https://www.instagram.com/wyshlifestyle/"


def load_env_config() -> dict:
    """
    .env에서 브라우저 자동화 설정을 로드한다.
    왜: headless 모드, 타임아웃 등을 환경 변수로 관리하여
    서버 환경과 개발 환경에서 다르게 동작할 수 있게 한다.
    """
    config = {
        "headless": True,
        "shop_url": WYSH_SHOP_URL,
        "instagram_handle": "wyshlifestyle",
    }

    env_path = PROJECT_ROOT / ".env"
    if env_path.exists():
        with open(env_path, "r") as f:
            for line in f:
                line = line.strip()
                if line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                key, value = key.strip(), value.strip()
                if key == "HEADLESS":
                    config["headless"] = value.lower() == "true"
                elif key == "WYSH_SHOP_URL":
                    config["shop_url"] = value
                elif key == "WYSH_INSTAGRAM_HANDLE":
                    config["instagram_handle"] = value

    return config


async def scan_shop(config: dict) -> dict:
    """
    WYSH 쇼핑몰(https://wysh.it/)을 Playwright로 스캔한다.
    왜: 현재 판매 중인 제품, 가격, 프로모션 등을 파악하여
    마케팅 아이디어가 현실적인 브랜드 상황에 기반하도록 한다.

    수집 항목:
    - 메인 페이지 타이틀/설명
    - 제품 카테고리 및 항목
    - 현재 진행 중인 프로모션/배너
    - 사이트 전체 톤앤매너
    """
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        print("❌ playwright가 설치되지 않았습니다.")
        print("   설치: pip install playwright && python -m playwright install chromium")
        sys.exit(1)

    shop_url = config.get("shop_url", WYSH_SHOP_URL)
    headless = config.get("headless", True)

    result = {
        "source": "shop",
        "url": shop_url,
        "scanned_at": datetime.now(KST).isoformat(),
        "title": None,
        "description": None,
        "products": [],
        "promotions": [],
        "categories": [],
        "raw_text_snippet": None,
    }

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=headless)
        page = await browser.new_page(
            viewport={"width": 1920, "height": 1080},
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        )

        try:
            print(f"🌐 쇼핑몰 접속 중: {shop_url}")
            await page.goto(shop_url, wait_until="networkidle", timeout=30000)

            # --- 페이지 기본 정보 ---
            result["title"] = await page.title()

            # meta description 추출
            meta_desc = await page.query_selector('meta[name="description"]')
            if meta_desc:
                result["description"] = await meta_desc.get_attribute("content")

            # --- 제품 정보 추출 ---
            # 왜: 셀렉터는 사이트 구조에 따라 변경될 수 있으므로
            # 여러 패턴을 시도하는 방어적 접근을 한다.
            product_selectors = [
                '.product-card',
                '.product-item',
                '[data-product]',
                '.collection-product',
            ]

            for selector in product_selectors:
                products = await page.query_selector_all(selector)
                if products:
                    for product in products[:10]:  # 최대 10개만
                        name = await product.inner_text()
                        result["products"].append({
                            "name": name.strip()[:100],
                        })
                    break

            # 제품이 셀렉터로 안 잡히면 전체 텍스트에서 추출
            if not result["products"]:
                body_text = await page.inner_text("body")
                result["raw_text_snippet"] = body_text[:2000]
                print("⚠️  제품 셀렉터 매칭 실패. 페이지 텍스트 스냅샷을 저장합니다.")

            # --- 프로모션/배너 ---
            banner_selectors = [
                '.banner', '.hero', '.promotion', '.sale',
                '[class*="banner"]', '[class*="hero"]',
            ]
            for selector in banner_selectors:
                banners = await page.query_selector_all(selector)
                if banners:
                    for banner in banners[:5]:
                        text = await banner.inner_text()
                        if text.strip():
                            result["promotions"].append(text.strip()[:200])
                    break

            print(f"✅ 쇼핑몰 스캔 완료:")
            print(f"   제품 {len(result['products'])}개, 프로모션 {len(result['promotions'])}개")

        except Exception as e:
            print(f"❌ 쇼핑몰 스캔 에러: {e}")
            result["error"] = str(e)

        finally:
            await browser.close()

    return result


async def scan_instagram(config: dict) -> dict:
    """
    WYSH 인스타그램(@wyshlifestyle) 공개 프로필을 스캔한다.
    왜: 최근 콘텐츠의 톤/테마/해시태그를 분석하여
    마케팅 아이디어가 기존 콘텐츠 전략과 일관성을 유지하도록 한다.

    주의: Instagram은 로그인 없이 접근이 제한될 수 있다.
    공개 프로필만 스캔하며, 차단 시 수동 입력으로 폴백한다.
    """
    try:
        from playwright.async_api import async_playwright
    except ImportError:
        print("❌ playwright가 설치되지 않았습니다.")
        sys.exit(1)

    handle = config.get("instagram_handle", "wyshlifestyle")
    instagram_url = f"https://www.instagram.com/{handle}/"
    headless = config.get("headless", True)

    result = {
        "source": "instagram",
        "handle": handle,
        "url": instagram_url,
        "scanned_at": datetime.now(KST).isoformat(),
        "bio": None,
        "followers": None,
        "post_count": None,
        "recent_posts": [],
        "hashtags": [],
    }

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=headless)
        page = await browser.new_page(
            viewport={"width": 1920, "height": 1080},
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        )

        try:
            print(f"📸 인스타그램 접속 중: {instagram_url}")
            await page.goto(instagram_url, wait_until="networkidle", timeout=30000)

            # --- 로그인 팝업 닫기 ---
            # 왜: Instagram은 비로그인 사용자에게 로그인 모달을 표시한다.
            # 이를 닫아야 프로필 정보에 접근할 수 있다.
            try:
                close_btn = await page.wait_for_selector(
                    '[aria-label="Close"], [aria-label="닫기"], button:has-text("Not Now")',
                    timeout=5000
                )
                if close_btn:
                    await close_btn.click()
                    print("   로그인 모달 닫기 완료")
            except Exception:
                pass  # 모달이 없으면 무시

            # --- 프로필 정보 ---
            # 왜: 팔로워 수, 게시물 수 등은 브랜드 영향력을 파악하는 기본 지표
            header_text = await page.inner_text("header") if await page.query_selector("header") else ""
            result["bio"] = header_text[:500] if header_text else None

            # --- 최근 게시물 텍스트 ---
            # 왜: 최근 콘텐츠의 방향성을 파악하여 새로운 아이디어가
            # 기존 전략과 충돌하지 않도록 한다.
            articles = await page.query_selector_all("article a")
            for article in articles[:9]:  # 최근 9개 (3x3 그리드)
                href = await article.get_attribute("href")
                if href:
                    result["recent_posts"].append({
                        "url": f"https://www.instagram.com{href}",
                    })

            print(f"✅ 인스타그램 스캔 완료:")
            print(f"   최근 게시물 {len(result['recent_posts'])}개 수집")

            # 왜: Instagram 접근이 차단된 경우를 대비하여
            # 최소한의 정보라도 저장
            if not result["recent_posts"] and not result["bio"]:
                print("⚠️  Instagram 접근이 제한되었을 수 있습니다.")
                print("   수동으로 스크린샷을 data/wysh-snapshot/에 저장해주세요.")
                body_text = await page.inner_text("body")
                result["raw_fallback"] = body_text[:1000]

        except Exception as e:
            print(f"❌ 인스타그램 스캔 에러: {e}")
            result["error"] = str(e)

        finally:
            await browser.close()

    return result


def save_context(shop_result: dict, instagram_result: dict, week_number: int) -> Path:
    """
    수집된 WYSH 컨텍스트를 주차별 디렉토리에 저장한다.
    왜: shop과 instagram 데이터를 하나의 JSON으로 합쳐 저장하면
    아이디어 생성 시 한 번에 로드하여 참조할 수 있다.
    """
    week_dir = WEEKS_DIR / f"week-{week_number:02d}"
    week_dir.mkdir(parents=True, exist_ok=True)

    context = {
        "week": week_number,
        "collected_at": datetime.now(KST).isoformat(),
        "shop": shop_result,
        "instagram": instagram_result,
    }

    context_path = week_dir / "wysh-context.json"
    with open(context_path, "w", encoding="utf-8") as f:
        json.dump(context, f, ensure_ascii=False, indent=2)

    # 스냅샷 캐시에도 최신 버전 저장
    # 왜: 매번 스캔하지 않아도 가장 최근 스캔 결과를 빠르게 참조할 수 있게
    snapshot_dir = DATA_DIR / "wysh-snapshot"
    snapshot_dir.mkdir(parents=True, exist_ok=True)
    snapshot_path = snapshot_dir / "latest.json"
    with open(snapshot_path, "w", encoding="utf-8") as f:
        json.dump(context, f, ensure_ascii=False, indent=2)

    print(f"💾 WYSH 컨텍스트 저장 완료:")
    print(f"   주차별: {context_path}")
    print(f"   스냅샷: {snapshot_path}")

    return context_path


async def run_scan(args):
    """비동기 스캔 실행 헬퍼."""
    config = load_env_config()

    if args.headless is not None:
        config["headless"] = args.headless

    shop_result = {}
    instagram_result = {}

    if args.target in ("shop", "all"):
        shop_result = await scan_shop(config)

    if args.target in ("instagram", "all"):
        instagram_result = await scan_instagram(config)

    save_context(shop_result, instagram_result, args.week)
    print(f"\n🎉 Week {args.week} WYSH 컨텍스트 수집 완료!")


def main():
    parser = argparse.ArgumentParser(
        description="WYSH 쇼핑몰/인스타그램 스캔 스크립트"
    )
    parser.add_argument(
        "--target", choices=["shop", "instagram", "all"], default="all",
        help="스캔 대상 (shop, instagram, all)"
    )
    parser.add_argument(
        "--week", type=int, required=True,
        help="주차 번호 (1-23)"
    )
    parser.add_argument(
        "--headless", action="store_true", default=None,
        help="헤드리스 모드로 실행"
    )

    args = parser.parse_args()

    import asyncio
    asyncio.run(run_scan(args))


if __name__ == "__main__":
    main()
