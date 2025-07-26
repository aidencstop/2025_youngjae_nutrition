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
              <p>Macro: {record.score_macro ? '예' : '아니오'}, Disease: {record.score_disease ? '예' : '아니오'}, Goal: {record.score_goal ? '예' : '아니오'}</p>
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
