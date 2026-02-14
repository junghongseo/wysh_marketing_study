// 왜: 비즈니스 로직(데이터 로딩/파싱)을 UI 컴포넌트에서 격리하기 위한 커스텀 훅
// GEMINI.md 7대 원칙 #1: Atomic Modularity & Separation — SRP 준수
import { useState, useMemo } from 'react';
import { WEEK_DATA, CHAPTERS } from '../data/weekData';

// 왜: 현재는 정적 import, 향후 fetch()로 동적 로딩 시 이 훅만 수정하면 됨
export function useWeekData(weekNumber) {
    const [selectedWeek, setSelectedWeek] = useState(weekNumber || 1);

    const weekData = useMemo(() => {
        return WEEK_DATA[selectedWeek] || null;
    }, [selectedWeek]);

    const currentChapter = useMemo(() => {
        return CHAPTERS.find(ch => ch.week === selectedWeek) || null;
    }, [selectedWeek]);

    // 왜: 전체 주차 진행 현황을 한눈에 보여주기 위한 계산
    const progress = useMemo(() => {
        const completedWeeks = Object.keys(WEEK_DATA).filter(
            w => WEEK_DATA[w].status === 'completed'
        ).length;
        return {
            completed: completedWeeks,
            total: 23,
            percentage: Math.round((completedWeeks / 23) * 100),
        };
    }, []);

    // 왜: 아이디어를 MFS 점수 내림차순으로 정렬하여 높은 레버리지 아이디어를 먼저 표시
    const sortedIdeas = useMemo(() => {
        if (!weekData?.ideas) return [];
        return [...weekData.ideas].sort((a, b) => b.mfs.total - a.mfs.total);
    }, [weekData]);

    return {
        selectedWeek,
        setSelectedWeek,
        weekData,
        currentChapter,
        progress,
        sortedIdeas,
        chapters: CHAPTERS,
    };
}
