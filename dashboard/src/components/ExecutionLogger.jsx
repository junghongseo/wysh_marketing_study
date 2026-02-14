import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, serverTimestamp } from "firebase/firestore";

const ExecutionLogger = () => {
    // 왜: Firestore에서 실시간으로 가져온 데이터를 로컬 상태와 동기화
    const [plans, setPlans] = useState([]);
    const [newPlan, setNewPlan] = useState({ title: '', detail: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 왜: 컴포넌트 마운트 시 Firestore 리스너 연결 (Real-time update)
    useEffect(() => {
        const q = query(collection(db, "execution_plans"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const plansData = [];
            querySnapshot.forEach((doc) => {
                plansData.push({ id: doc.id, ...doc.data() });
            });
            setPlans(plansData);
        });
        return () => unsubscribe();
    }, []);

    // 왜: 사용자 입력을 받아 Firestore에 추가
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPlan.title.trim()) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "execution_plans"), {
                title: newPlan.title,
                detail: newPlan.detail,
                createdAt: serverTimestamp(),
                week: 1, // 현재는 Week 1로 고정
            });
            setNewPlan({ title: '', detail: '' }); // 입력 폼 초기화
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("저장에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 왜: 잘못된 항목 삭제 기능
    const handleDelete = async (id) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            try {
                await deleteDoc(doc(db, "execution_plans", id));
            } catch (error) {
                console.error("Error deleting document: ", error);
            }
        }
    };

    return (
        <div className="mt-12 p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">📝</span>
                <h2 className="text-2xl font-bold text-white">Real-World Execution Log</h2>
            </div>

            <p className="text-zinc-400 mb-8">
                이번 주 실제로 실행할 마케팅 액션을 기록하세요. <br />
                <span className="text-blue-400 font-bold">작성된 내용은 다음 주차(Week 2) 분석 시 AI에게 전달됩니다.</span>
            </p>

            {/* 입력 폼 */}
            <form onSubmit={handleSubmit} className="mb-8 bg-zinc-800/30 p-6 rounded-2xl border border-zinc-700/50">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">실행 제목</label>
                        <input
                            type="text"
                            value={newPlan.title}
                            onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                            placeholder="예: 수요일 10PM 타임딜 (결정)"
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">상세 내용 (선택)</label>
                        <textarea
                            value={newPlan.detail}
                            onChange={(e) => setNewPlan({ ...newPlan, detail: e.target.value })}
                            placeholder="구체적인 실행 방법, 목표 등을 적어주세요."
                            rows="2"
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={!newPlan.title || isSubmitting}
                        className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${!newPlan.title || isSubmitting
                                ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-blue-500/20"
                            }`}
                    >
                        {isSubmitting ? "저장 중..." : "계획 추가하기"}
                    </button>
                </div>
            </form>

            {/* 리스트 출력 */}
            <div className="space-y-4">
                {plans.length === 0 ? (
                    <div className="text-center py-8 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-xl">
                        아직 등록된 실행 계획이 없습니다.
                    </div>
                ) : (
                    plans.map((plan, index) => (
                        <div key={plan.id} className="group flex justify-between items-start gap-4 p-5 bg-zinc-800/50 rounded-xl border border-zinc-700/50 hover:border-blue-500/30 transition-colors">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-500/10 text-blue-400 font-bold rounded-lg border border-blue-500/20">
                                    {plans.length - index}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">{plan.title}</h3>
                                    {plan.detail && <p className="text-zinc-400 text-sm leading-relaxed">{plan.detail}</p>}
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(plan.id)}
                                className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="삭제"
                            >
                                🗑️
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ExecutionLogger;
