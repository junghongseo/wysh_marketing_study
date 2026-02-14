// 왜: 전체 프로젝트 진행률을 시각적으로 보여주는 프로그레스 바
// 23주 중 완료된 주차 비율을 계산하여 표시

export default function ProgressBar({ completed, total, percentage }) {
    return (
        <div className="progress-section">
            <div className="glass-card progress-bar">
                <div className="progress-bar__label">
                    {completed}/{total} 주차 완료
                </div>
                <div className="progress-bar__track">
                    <div
                        className="progress-bar__fill"
                        style={{ width: `${Math.max(percentage, 2)}%` }}
                    />
                </div>
                <div className="progress-bar__percentage">
                    {percentage}%
                </div>
            </div>
        </div>
    );
}
