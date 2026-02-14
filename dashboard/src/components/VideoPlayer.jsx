// 왜: 각 주차에 해당하는 유튜브 영상을 인라인 임베드로 재생
// 썸네일 클릭 시 iframe으로 전환하여 바로 재생 (성능 최적화: 초기에는 iframe 미로딩)
import { useState } from 'react';
import { VIDEO_DATA } from '../data/weekData';

export default function VideoPlayer({ selectedWeek }) {
    const [isPlaying, setIsPlaying] = useState(false);

    // 왜: 영상 번호는 챕터 번호(0부터 시작)와 동일
    // Week 1 → 챕터 0(인트로) + 챕터 1 두 개가 매핑될 수 있으나,
    // 재생목록에서 인트로(0)를 포함하여 week-1은 video index 1(챕터 1)에 대응
    const video = VIDEO_DATA[selectedWeek];

    // 왜: 아직 영상이 없는 주차(19주 이후)는 빈 상태 처리
    if (!video) {
        return (
            <div className="video-section">
                <div className="section-title">
                    <span className="section-title__icon">🎬</span>
                    주차별 영상 강의
                </div>
                <div className="video-empty glass-card">
                    <div className="video-empty__icon">📹</div>
                    <p className="video-empty__text">이 주차의 영상은 아직 준비 중입니다</p>
                </div>
            </div>
        );
    }

    return (
        <div className="video-section">
            <div className="section-title">
                <span className="section-title__icon">🎬</span>
                주차별 영상 강의
            </div>

            <div className="video-card glass-card">
                {/* 왜: 성능 최적화 — 처음에는 썸네일만 보여주고, 클릭 시 iframe 로딩 */}
                <div className="video-card__player">
                    {isPlaying ? (
                        <iframe
                            className="video-card__iframe"
                            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <div
                            className="video-card__thumbnail"
                            onClick={() => setIsPlaying(true)}
                        >
                            {/* 왜: YouTube maxresdefault 썸네일 사용 — 고해상도 + 로딩 빠름 */}
                            <img
                                src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                                alt={video.title}
                                className="video-card__thumbnail-img"
                                onError={(e) => {
                                    // 왜: maxresdefault가 없으면 hqdefault로 폴백
                                    e.target.src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
                                }}
                            />
                            {/* 왜: 재생 버튼 오버레이로 클릭 유도 */}
                            <div className="video-card__play-btn">
                                <svg viewBox="0 0 68 48" width="68" height="48">
                                    <path
                                        d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
                                        fill="#FF0000"
                                    />
                                    <path d="M 45,24 27,14 27,34" fill="white" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>

                {/* 왜: 영상 정보(제목 + 챕터 매핑)를 플레이어 아래에 표시 */}
                <div className="video-card__info">
                    <h3 className="video-card__title">{video.title}</h3>
                    <p className="video-card__meta">
                        <span className="video-card__chapter-badge">
                            Chapter {video.chapter}
                        </span>
                        <span className="video-card__channel">1sentence 시즌 2</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
