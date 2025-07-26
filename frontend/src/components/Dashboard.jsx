import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const Dashboard = () => {
  const [history, setHistory] = useState(null);

  useEffect(() => {
    fetchTodayHistory();
  }, []);

  const fetchTodayHistory = async () => {
    try {
      const res = await api.get('accounts/history/?page=1');
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = res.data.find((record) => record.date === today);
      if (todayRecord) {
        setHistory(todayRecord);
      }
    } catch (err) {
      console.error('히스토리 불러오기 실패', err);
    }
  };

  const renderGrade = (grade) => {
    const colors = { A: 'green', B: 'blue', C: 'orange', D: 'red' };
    return <span style={{ color: colors[grade], fontWeight: 'bold' }}>{grade}</span>;
  };

  return (
    <div className="container mt-5">
      <h2>오늘의 식사 요약</h2>
      {!history ? (
        <p>아직 평가가 없습니다. 식단을 입력하고 '그만'이라고 말해보세요.</p>
      ) : (
        <div className="card mt-3 p-3">
          <p><strong>섭취 요약:</strong> {history.total_intake_text}</p>
          <p><strong>Macro 균형 적절:</strong> {history.score_macro ? '예' : '아니오'}</p>
          <p><strong>질병 고려:</strong> {history.score_disease ? '예' : '아니오'}</p>
          <p><strong>목표 적합:</strong> {history.score_goal ? '예' : '아니오'}</p>
          <p><strong>총 평가:</strong> {renderGrade(history.total_grade)}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
