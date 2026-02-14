// 왜: Chapter 분석 결과를 구조적으로 보여주는 컴포넌트
// 핵심 메시지, 원칙 3개, 5단계 프레임워크를 시각적으로 표현

export default function ChapterAnalysis({ analysis, chapter }) {
    if (!analysis) return null;

    return (
        <div className="chapter-section">
            {/* 챕터 헤더 */}
            <div className="glass-card chapter-header">
                <div className="chapter-header__week-badge">
                    📖 Week {chapter.week}
                </div>
                <h2 className="chapter-header__title">{chapter.title}</h2>
                <p className="chapter-header__subtitle">{chapter.subtitle}</p>
            </div>

            {/* 분석 그리드 */}
            <div className="analysis-grid">
                {/* 핵심 메시지 */}
                <div className="glass-card analysis-card">
                    <h3 className="analysis-card__title">💡 핵심 메시지</h3>
                    <div className="analysis-card__content">
                        <div className="analysis-card__highlight">
                            {analysis.coreMessage}
                        </div>
                    </div>
                    <div className="principles-list" style={{ marginTop: '1rem' }}>
                        {analysis.keyPrinciples.map((p, i) => (
                            <div className="principle-item" key={i}>
                                <div className="principle-item__dot" />
                                <div>
                                    <div className="principle-item__label">{p.label}</div>
                                    <div className="principle-item__desc">{p.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5단계 프레임워크 */}
                <div className="glass-card analysis-card">
                    <h3 className="analysis-card__title">🚀 현대 마케팅의 5단계</h3>
                    <ul className="steps-list">
                        {analysis.fiveSteps.map((s) => (
                            <li className="steps-list__item" key={s.step}>
                                <div className="steps-list__number">{s.step}</div>
                                <div className="steps-list__content">
                                    <div className="steps-list__title">{s.title}</div>
                                    <div className="steps-list__desc">{s.desc}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
