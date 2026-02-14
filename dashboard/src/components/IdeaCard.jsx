// 왜: 마케팅 아이디어를 MFS 점수와 함께 시각화하는 핵심 컴포넌트
// 접이식(Accordion) 패턴으로 상세 정보를 토글
// MFS 바 차트로 각 점수 항목을 시각적으로 비교
import { useState } from 'react';

// 왜: MFS 점수 범위에 따른 CSS 클래스를 결정하는 유틸 함수
function getMfsClass(total) {
    if (total >= 10) return 'excellent';
    if (total >= 7) return 'good';
    return 'moderate';
}

function MfsBars({ mfs }) {
    // 왜: Impact/Fit/Speed는 높을수록 좋고(positive), Effort/Cost는 낮을수록 좋아(negative) 시각적으로 구분
    const bars = [
        { key: 'impact', label: 'Impact', value: mfs.impact, type: 'positive' },
        { key: 'fit', label: 'Fit', value: mfs.fit, type: 'positive' },
        { key: 'speed', label: 'Speed', value: mfs.speed, type: 'positive' },
        { key: 'effort', label: 'Effort', value: mfs.effort, type: 'negative' },
        { key: 'cost', label: 'Cost', value: mfs.cost, type: 'negative' },
    ];

    return (
        <div className="mfs-bars">
            {bars.map((bar) => (
                <div className="mfs-bar" key={bar.key}>
                    <span className="mfs-bar__label">{bar.label}</span>
                    <div className="mfs-bar__track">
                        <div
                            className={`mfs-bar__fill mfs-bar__fill--${bar.type}`}
                            style={{ width: `${(bar.value / 5) * 100}%` }}
                        />
                    </div>
                    <span className="mfs-bar__value">{bar.value}/5</span>
                </div>
            ))}
        </div>
    );
}

export default function IdeaCard({ idea, rank }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const mfsClass = getMfsClass(idea.mfs.total);

    return (
        <div
            className={`glass-card idea-card ${rank <= 2 ? `idea-card--rank-${rank}` : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            {/* 헤더: 제목 + MFS 점수 */}
            <div className="idea-card__header">
                <div className="idea-card__title-area">
                    <div className="idea-card__badges">
                        <span className={`idea-card__category idea-card__category--${idea.category}`}>
                            {idea.categoryEmoji} {idea.category}
                        </span>
                        <span className={`idea-card__recommendation idea-card__recommendation--${idea.recommendation}`}>
                            {idea.recommendation === '즉시 실행' ? '🔥' : '📋'} {idea.recommendation}
                        </span>
                    </div>
                    <h3 className="idea-card__title">{idea.title}</h3>
                </div>
                <div className="idea-card__mfs-score">
                    <div className={`idea-card__mfs-value idea-card__mfs-value--${mfsClass}`}>
                        +{idea.mfs.total}
                    </div>
                    <div className="idea-card__mfs-label">MFS</div>
                </div>
            </div>

            {/* 설명 */}
            <p className="idea-card__description">{idea.description}</p>

            {/* MFS 바 차트 */}
            <MfsBars mfs={idea.mfs} />

            {/* 확장 상세 */}
            {isExpanded && (
                <div className="idea-detail">
                    <div className="idea-detail__item">
                        <div className="idea-detail__label">📖 Chapter 원칙</div>
                        <div className="idea-detail__value">{idea.chapterPrinciple}</div>
                    </div>
                    <div className="idea-detail__item">
                        <div className="idea-detail__label">⚡ 최소 실행 액션</div>
                        <div className="idea-detail__value">{idea.smallestViableAction}</div>
                    </div>
                    <div className="idea-detail__item">
                        <div className="idea-detail__label">📊 성공 지표</div>
                        <div className="idea-detail__value">{idea.successMetric}</div>
                    </div>
                    <div className="idea-detail__item">
                        <div className="idea-detail__label">⚠️ 리스크</div>
                        <div className="risks-tags">
                            {idea.risks.map((risk, i) => (
                                <span className="risk-tag" key={i}>⚠ {risk}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
