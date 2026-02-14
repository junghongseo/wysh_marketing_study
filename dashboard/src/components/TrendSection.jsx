// 왜: D2C 트렌드 리서치 결과를 시각적으로 보여주는 컴포넌트
// 시장 규모 통계 + 6개 트렌드 칩 + 위협 요소 표시

const TREND_ICONS = ['💪', '👥', '📣', '📦', '🎨', '🏠'];

export default function TrendSection({ trends }) {
    if (!trends) return null;

    return (
        <div className="trends-section">
            <div className="section-title">
                <span className="section-title__icon">📈</span>
                D2C 트렌드 리서치
            </div>

            {/* 시장 규모 통계 */}
            <div className="glass-card trends-stats">
                <div className="trends-stat">
                    <div className="trends-stat__value">{trends.marketSize}</div>
                    <div className="trends-stat__label">그릭요거트 시장 규모</div>
                </div>
                <div className="trends-stat">
                    <div className="trends-stat__value">{trends.marketShare}</div>
                    <div className="trends-stat__label">떠먹는 요거트 내 비중</div>
                </div>
            </div>

            {/* 핵심 트렌드 */}
            <div className="trends-grid">
                {trends.keyTrends.map((trend, i) => (
                    <div className="glass-card trend-chip" key={i}>
                        <span className="trend-chip__icon">{TREND_ICONS[i] || '📌'}</span>
                        <div>
                            <div className="trend-chip__name">{trend.name}</div>
                            <div className="trend-chip__desc">{trend.desc}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 위협 요소 */}
            {trends.threats && trends.threats.length > 0 && (
                <div className="threats-list">
                    {trends.threats.map((threat, i) => (
                        <div className="threat-item" key={i}>
                            <span className="threat-item__icon">⚠️</span>
                            {threat}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
