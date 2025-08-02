import React, { useEffect, useState, useRef } from 'react';
import api from '../api/axios';

const IntakeHistory = () => {
  const [history, setHistory] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  useEffect(() => {
    fetchMore();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 1.0 });
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [loader]);

  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting && hasMore) fetchMore();
  };

  const fetchMore = async () => {
    try {
      const res = await api.get(`accounts/history/?page=${page}`);
      if (res.data.length === 0) {
        setHasMore(false);
        return;
      }
      setHistory((prev) => [...prev, ...res.data]);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error('불러오기 실패', err);
    }
  };

  const toggleExpand = (date) => {
    setExpanded((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  const renderGrade = (grade) => {
    const colors = { A: 'green', B: 'blue', C: 'orange', D: 'red' };
    return <span style={{ color: colors[grade], fontWeight: 'bold' }}>{grade}</span>;
  };

  return (
    <div className="container mt-5">
      <h3>내 식단 히스토리</h3>
      {history.map((record, idx) => (
        <div key={idx} className="border rounded p-3 mb-2" onClick={() => toggleExpand(record.date)} style={{ cursor: 'pointer' }}>
          <div><strong>{record.date}</strong> - 총 평가: {renderGrade(record.total_grade)}</div>
          {expanded[record.date] && (
            <div className="mt-2">
              <p><strong>섭취 내용:</strong> {record.total_intake_text}</p>

              <p><strong>Macro ({record.score_macro}/10):</strong> {record.reason_macro}</p>
              <p><em>👉 개선 팁:</em> {record.advice_macro}</p>

              <p><strong>Disease ({record.score_disease}/10):</strong> {record.reason_disease}</p>
              <p><em>👉 개선 팁:</em> {record.advice_disease}</p>

              <p><strong>Goal ({record.score_goal}/10):</strong> {record.reason_goal}</p>
              <p><em>👉 개선 팁:</em> {record.advice_goal}</p>

              <hr />
              <p><strong>📋 평가 시점 내 정보</strong></p>
              <ul>
                <li>성별: {record.gender === 'M' ? '남성' : '여성'}</li>
                <li>나이: {record.age}세</li>
                <li>키: {record.height}cm</li>
                <li>체중: {record.weight}kg</li>
                <li>목표: {{
                  'loss': '체중 감량',
                  'maintain': '현상 유지',
                  'gain': '근육 증량'
                }[record.diet_goal]}</li>
              </ul>

              <p><strong>📌 건강 상태:</strong> {
                Object.entries(record)
                  .filter(([k, v]) => k.startsWith('has_') && v)
                  .map(([k]) => k.replace('has_', '').replace(/_/g, ' '))
                  .map((label) => label.charAt(0).toUpperCase() + label.slice(1))
                  .join(', ') || '없음'
              }</p>
            </div>
          )}
        </div>
      ))}
      <div ref={loader} />
      {!hasMore && <p className="text-center mt-3">모든 기록을 불러왔습니다.</p>}
    </div>
  );
};

export default IntakeHistory;
