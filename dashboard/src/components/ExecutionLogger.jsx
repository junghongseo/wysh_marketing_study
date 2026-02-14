import React from 'react';

const ExecutionLogger = ({ data }) => {
    if (!data) return null;

    return (
        <div className="mt-12 p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">📝</span>
                <h2 className="text-2xl font-bold text-white">Real-World Execution Log</h2>
            </div>

            <p className="text-zinc-400 mb-8">
                AI가 제안한 아이디어 중, <span className="text-blue-400 font-bold">실제 실행하기로 결정한 전략</span>을 여기에 기록합니다.<br />
                이 기록은 다음 주차(Week 2) 분석의 핵심 데이터로 활용됩니다.
            </p>

            {/* 입력된 플랜이 없을 경우 가이드 표시 */}
            {(!data.plan || data.plan.length === 0) ? (
                <div className="p-6 border-2 border-dashed border-zinc-700 rounded-2xl bg-zinc-900/30 text-center">
                    <p className="text-zinc-500 mb-2">아직 실행 계획이 등록되지 않았습니다.</p>
                    <p className="text-sm text-zinc-600">
                        <code>src/data/weekData.js</code> 파일의
                        <code className="text-blue-400 mx-1">realExecution.plan</code> 배열에
                        실행할 내용을 작성해주세요.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {data.plan.map((item, index) => (
                        <div key={index} className="flex gap-4 p-5 bg-zinc-800/50 rounded-xl border border-zinc-700/50 hover:border-blue-500/30 transition-colors">
                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-500/10 text-blue-400 font-bold rounded-lg">
                                {index + 1}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed">{item.detail}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 회고 섹션 (데이터가 있을 때만 표시) */}
            {data.retro && (
                <div className="mt-8 pt-8 border-t border-zinc-800">
                    <h3 className="text-lg font-semibold text-zinc-300 mb-3">📊 Weekly Retro</h3>
                    <p className="text-zinc-400 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                        {data.retro}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ExecutionLogger;
