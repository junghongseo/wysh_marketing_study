// 왜: 메인 앱 컴포넌트 — 모든 섹션을 조합하여 대시보드 페이지 구성
// useWeekData 훅으로 데이터 관리, 각 섹션 컴포넌트에 데이터 전달
import { useWeekData } from './hooks/useWeekData';
import HeroBanner from './components/HeroBanner';
import VideoPlayer from './components/VideoPlayer';
import ProgressBar from './components/ProgressBar';
import Timeline from './components/Timeline';
import ChapterAnalysis from './components/ChapterAnalysis';
import WyshApplication from './components/WyshApplication';
import TrendSection from './components/TrendSection';
import IdeaCard from './components/IdeaCard';
import ExecutionLogger from './components/ExecutionLogger';

export default function App() {
  const {
    selectedWeek,
    setSelectedWeek,
    weekData,
    currentChapter,
    progress,
    sortedIdeas,
  } = useWeekData(3);

  // 왜: 완료된 주차 목록을 계산하여 타임라인에 전달
  const completedWeeks = progress.completedWeekNumbers || [];

  return (
    <div className="app">
      {/* 히어로 배너 — 책 표지 이미지 + 프로젝트 통계 */}
      <HeroBanner progress={progress} />

      {/* 주차별 유튜브 영상 — 배너 바로 아래 배치 */}
      <VideoPlayer selectedWeek={selectedWeek} />

      {/* 전체 진행률 */}
      <ProgressBar
        completed={progress.completed}
        total={progress.total}
        percentage={progress.percentage}
      />

      {/* 23주 타임라인 */}
      <Timeline
        selectedWeek={selectedWeek}
        onSelectWeek={setSelectedWeek}
        completedWeeks={completedWeeks}
      />

      {/* 주간 상세 콘텐츠 */}
      {weekData ? (
        <>
          {/* 챕터 분석 */}
          <ChapterAnalysis
            analysis={weekData.analysis}
            chapter={currentChapter}
          />

          {/* WYSH 적용 */}
          {weekData.analysis?.wyshApplication && (
            <WyshApplication
              wyshApplication={weekData.analysis.wyshApplication}
            />
          )}

          {/* 트렌드 리서치 */}
          <TrendSection trends={weekData.trends} />

          {/* 마케팅 아이디어 */}
          <div className="ideas-section">
            <div className="section-title">
              <span className="section-title__icon">💡</span>
              마케팅 아이디어 ({sortedIdeas.length}개)
            </div>
            <div className="glass-card ideas-summary">
              Chapter 1 "현대 마케팅은 문화를 만드는 관대한 행위"라는 핵심 원칙을 바탕으로
              즉시 실행 가능한 아이디어를 도출했습니다. 카드를 클릭하면 상세 정보를 볼 수 있습니다.
            </div>
            <div className="ideas-grid">
              {sortedIdeas.map((idea, index) => (
                <IdeaCard key={idea.id} idea={idea} rank={index + 1} />
              ))}
            </div>
          </div>

          {/* [NEW] 실제 실행 로그 — 사용자가 직접 수정하여 AI에게 피드백 전달 */}
          <ExecutionLogger />
        </>
      ) : (
        /* 빈 상태 */
        <div className="glass-card empty-state">
          <div className="empty-state__icon">🔒</div>
          <h3 className="empty-state__title">Week {selectedWeek}는 아직 분석되지 않았습니다</h3>
          <p className="empty-state__desc">
            이전 주차를 먼저 완료해주세요
          </p>
        </div>
      )}

      {/* 푸터 */}
      <footer className="footer">
        <p className="footer__text">
          WYSH × Seth Godin Marketing Engine — Powered by Antigravity
        </p>
      </footer>
    </div>
  );
}
