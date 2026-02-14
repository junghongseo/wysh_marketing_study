// 왜: 사용자가 실제 실행할 마케팅 전략을 기록하고, Firebase Firestore에 실시간 저장하는 컴포넌트
// Tailwind 없이 index.css의 BEM 클래스 시스템을 그대로 따름
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    deleteDoc,
    doc,
    serverTimestamp,
} from 'firebase/firestore';

export default function ExecutionLogger() {
    // 왜: Firestore에서 실시간으로 가져온 데이터를 로컬 상태와 동기화
    const [plans, setPlans] = useState([]);
    const [newPlan, setNewPlan] = useState({ title: '', detail: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 왜: 컴포넌트 마운트 시 Firestore 리스너 연결 (Real-time update)
    useEffect(() => {
        const q = query(
            collection(db, 'execution_plans'),
            orderBy('createdAt', 'desc')
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = [];
            snapshot.forEach((docSnap) => {
                data.push({ id: docSnap.id, ...docSnap.data() });
            });
            setPlans(data);
        });
        // 왜: 언마운트 시 리스너 해제하여 메모리 누수 방지
        return () => unsubscribe();
    }, []);

    // 왜: 사용자 입력을 받아 Firestore에 추가
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPlan.title.trim()) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'execution_plans'), {
                title: newPlan.title,
                detail: newPlan.detail,
                createdAt: serverTimestamp(),
                week: 1, // 왜: 현재는 Week 1만 존재하므로 고정 — 향후 동적으로 변경
            });
            setNewPlan({ title: '', detail: '' });
        } catch (error) {
            console.error('Firestore 저장 실패:', error);
            alert('저장에 실패했습니다. Firebase 콘솔에서 Firestore가 활성화되었는지 확인해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // 왜: 잘못된 항목 삭제 기능
    const handleDelete = async (id) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        try {
            await deleteDoc(doc(db, 'execution_plans', id));
        } catch (error) {
            console.error('Firestore 삭제 실패:', error);
        }
    };

    return (
        <div className="execution-section">
            <div className="section-title">
                <span className="section-title__icon">📝</span>
                실행 계획 로그 ({plans.length}건)
            </div>

            <div className="glass-card">
                {/* 헤더 */}
                <div className="execution-header">
                    <h2 className="execution-header__title">
                        Real-World Execution Log
                    </h2>
                    <p className="execution-header__desc">
                        이번 주 실제로 실행할 마케팅 액션을 기록하세요.{' '}
                        <span className="execution-header__highlight">
                            작성된 내용은 다음 주차(Week 2) 분석 시 AI에게 전달됩니다.
                        </span>
                    </p>
                </div>

                {/* 입력 폼 */}
                <form className="execution-form" onSubmit={handleSubmit}>
                    <div className="execution-form__group">
                        <label className="execution-form__label">
                            실행 제목
                        </label>
                        <input
                            type="text"
                            className="execution-form__input"
                            value={newPlan.title}
                            onChange={(e) =>
                                setNewPlan({ ...newPlan, title: e.target.value })
                            }
                            placeholder="예: 수요일 10PM 타임딜 (결정)"
                        />
                    </div>
                    <div className="execution-form__group">
                        <label className="execution-form__label">
                            상세 내용 (선택)
                        </label>
                        <textarea
                            className="execution-form__textarea"
                            value={newPlan.detail}
                            onChange={(e) =>
                                setNewPlan({ ...newPlan, detail: e.target.value })
                            }
                            placeholder="구체적인 실행 방법, 목표 등을 적어주세요."
                            rows="2"
                        />
                    </div>
                    <div className="execution-form__actions">
                        <button
                            type="submit"
                            className="execution-form__submit"
                            disabled={!newPlan.title.trim() || isSubmitting}
                        >
                            {isSubmitting ? '저장 중...' : '✚ 계획 추가하기'}
                        </button>
                    </div>
                </form>
            </div>

            {/* 리스트 */}
            {plans.length === 0 ? (
                <div className="execution-list__empty">
                    아직 등록된 실행 계획이 없습니다.
                </div>
            ) : (
                <div className="execution-list">
                    {plans.map((plan, index) => (
                        <div className="execution-item" key={plan.id}>
                            <div className="execution-item__content">
                                <div className="execution-item__number">
                                    {plans.length - index}
                                </div>
                                <div className="execution-item__text">
                                    <div className="execution-item__title">
                                        {plan.title}
                                    </div>
                                    {plan.detail && (
                                        <div className="execution-item__detail">
                                            {plan.detail}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                className="execution-item__delete"
                                onClick={() => handleDelete(plan.id)}
                                title="삭제"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
