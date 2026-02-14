// 왜: WYSH 브랜드 적용 분석을 보여주는 컴포넌트
// SVM, Change Story, Culture, XY Statement를 카드 형태로 시각화

export default function WyshApplication({ wyshApplication }) {
    if (!wyshApplication) return null;

    const cards = [
        {
            icon: '🎯',
            title: 'Smallest Viable Market',
            content: wyshApplication.svm,
        },
        {
            icon: '✨',
            title: 'Change Story',
            content: wyshApplication.changeStory,
        },
        {
            icon: '🏛️',
            title: '문화적 정체성',
            content: wyshApplication.culture,
        },
        {
            icon: '📝',
            title: 'XY Statement',
            content: wyshApplication.xyStatement,
        },
    ];

    return (
        <div className="wysh-section">
            <div className="section-title">
                <span className="section-title__icon">🥛</span>
                WYSH 브랜드 적용
            </div>
            <div className="wysh-grid">
                {cards.map((card, i) => (
                    <div className="glass-card wysh-card" key={i}>
                        <div className="wysh-card__icon">{card.icon}</div>
                        <h3 className="wysh-card__title">{card.title}</h3>
                        <p className="wysh-card__content">{card.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
