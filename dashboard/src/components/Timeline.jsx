// 왜: 23주 진행 상황을 한눈에 보여주는 타임라인 컴포넌트
// 완료/진행 중/잠김 상태를 시각적으로 구분
import { CHAPTERS } from '../data/weekData';

export default function Timeline({ selectedWeek, onSelectWeek, completedWeeks }) {
    // 왜: 각 주차의 상태를 판별하여 적절한 CSS 클래스 적용
    const getWeekStatus = (week) => {
        if (completedWeeks.includes(week)) return 'completed';
        // 왜: 완료된 주차 바로 다음이 현재 진행 중인 주차
        if (completedWeeks.length > 0 && week === Math.max(...completedWeeks) + 1) return 'current';
        if (completedWeeks.length === 0 && week === 1) return 'current';
        return 'locked';
    };

    return (
        <div className="timeline-section">
            <div className="section-title">
                <span className="section-title__icon">📅</span>
                23주 학습 타임라인
            </div>
            <div className="glass-card">
                <div className="timeline">
                    {CHAPTERS.map((chapter) => {
                        const status = getWeekStatus(chapter.week);
                        const isSelected = chapter.week === selectedWeek;
                        return (
                            <div
                                key={chapter.week}
                                className={`timeline__week timeline__week--${status} ${isSelected ? 'timeline__week--selected' : ''}`}
                                onClick={() => onSelectWeek(chapter.week)}
                                title={`Week ${chapter.week}: ${chapter.title}`}
                            >
                                {status === 'completed' ? '✓' : chapter.week}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
