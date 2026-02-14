// 왜: 대시보드 최상단에 시각적 임팩트를 주는 히어로 배너
// 책 표지 이미지를 활용하여 프로젝트의 정체성을 즉시 전달
// CTA 버튼 없이 브랜딩 + 정보 전달에 집중

export default function HeroBanner({ progress }) {
    return (
        <div className="hero-banner">
            {/* 왜: 배너 이미지를 background로 사용하여 텍스트 오버레이 가능 */}
            <img
                src="/banner.png"
                alt="This is Marketing by Seth Godin — WYSH Marketing Execution Engine"
                className="hero-banner__image"
            />

            {/* 왜: 이미지 위에 반투명 오버레이로 텍스트 가독성 확보 */}
            <div className="hero-banner__overlay">
                <div className="hero-banner__content">
                    <div className="hero-banner__badge">📚 23주 마케팅 스터디</div>
                    <h1 className="hero-banner__title">
                        <span className="hero-banner__wysh">WYSH</span>
                        <span className="hero-banner__separator">×</span>
                        <span className="hero-banner__godin">Seth Godin</span>
                    </h1>
                    <p className="hero-banner__subtitle">
                        "This is Marketing" 23개 챕터를 매주 분석하고<br />
                        WYSH 맞춤 실행 전략을 자동 생성합니다
                    </p>
                    <div className="hero-banner__stats">
                        <div className="hero-banner__stat">
                            <span className="hero-banner__stat-value">{progress.completed}</span>
                            <span className="hero-banner__stat-label">완료 주차</span>
                        </div>
                        <div className="hero-banner__stat-divider" />
                        <div className="hero-banner__stat">
                            <span className="hero-banner__stat-value">{progress.total - progress.completed}</span>
                            <span className="hero-banner__stat-label">남은 주차</span>
                        </div>
                        <div className="hero-banner__stat-divider" />
                        <div className="hero-banner__stat">
                            <span className="hero-banner__stat-value">{progress.percentage}%</span>
                            <span className="hero-banner__stat-label">진행률</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
