import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import './IntakeHistory.css';

const TextWithBreaks = ({ text }) => (
  <span style={{ whiteSpace: 'pre-line' }}>{text ?? ''}</span>
);

const IntakeHistory = () => {
  const [history, setHistory] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
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
    if (target.isIntersecting && hasMore && !fetching && !loading) {
      fetchMore();
    }
  };

  const fetchMore = async () => {
    if (fetching) return; // Prevent duplicate requests if already fetching

    setFetching(true);
    try {
      const res = await api.get(`accounts/history/?page=${page}`);
      if (res.data.length === 0) {
        setHasMore(false);
        setLoading(false);
        setFetching(false);
        return;
      }
      setHistory((prev) => [...prev, ...res.data]);
      setPage((prev) => prev + 1);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load data', err);
      setLoading(false);
    } finally {
      setFetching(false);
    }
  };

  const toggleExpand = (date, event) => {
    // Prevent event propagation
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setExpanded((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  const renderGrade = (grade) => {
    return (
      <div className={`history-grade grade-${grade}`}>
        {grade}
      </div>
    );
  };

  const getGoalText = (goal) => {
    const goals = {
      'loss': 'Weight Loss',
      'maintain': 'Maintain Weight',
      'gain': 'Muscle Gain'
    };
    return goals[goal] || goal;
  };

  const getHealthConditions = (record) => {
    const conditions = Object.entries(record)
      .filter(([k, v]) => k.startsWith('has_') && v)
      .map(([k]) => k.replace('has_', '').replace(/_/g, ' '))
      .map((label) => label.charAt(0).toUpperCase() + label.slice(1));

    return conditions.length > 0 ? conditions.join(', ') : 'None';
  };

  return (
    <div className="intake-history-container">
      <div className="intake-history-content">
        <motion.div
          className="intake-history-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="intake-history-title">Diet History</h1>
          <p className="intake-history-subtitle">
            Look back on your dietary journey and find areas for improvement
          </p>
        </motion.div>

        <div className="history-grid">
          {history.map((record, idx) => (
            <motion.div
              key={`${record.date}-${idx}`}
              className={`history-card ${expanded[record.date] ? 'expanded' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="history-card-header"
                onClick={(e) => toggleExpand(record.date, e)}
                style={{ cursor: 'pointer' }}
              >
                <div className="history-date">{record.date}</div>
                {renderGrade(record.total_grade)}
              </div>

              <div
                className="expand-indicator"
                onClick={(e) => toggleExpand(record.date, e)}
                style={{ cursor: 'pointer' }}
              >
                <span>View Details</span>
                <motion.div
                  className="expand-icon"
                  animate={{ rotate: expanded[record.date] ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ▼
                </motion.div>
              </div>

              <AnimatePresence>
                {expanded[record.date] && (
                  <motion.div
                    className="history-details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="intake-summary">
                      <h4>🍽️ Intake Content</h4>
                      <p className="intake-text">{record.total_intake_text}</p>
                    </div>

                    <div className="score-sections">
                      <div className="score-section">
                        <div className="score-header">
                          <span className="score-title">🥗 Nutritional Balance (Macro)</span>
                          <span className="score-value">({record.score_macro}/10)</span>
                        </div>
                        <p className="score-reason"><TextWithBreaks text={record.reason_macro} /></p>
                        <div className="score-advice">
                          <div className="advice-label">
                            💡 Improvement Tips
                          </div>
                          <p className="advice-text">{record.advice_macro}</p>
                        </div>
                      </div>

                      <div className="score-section">
                        <div className="score-header">
                          <span className="score-title">🏥 Disease Management</span>
                          <span className="score-value">({record.score_disease}/10)</span>
                        </div>
                        <p className="score-reason">{record.reason_disease}</p>
                        <div className="score-advice">
                          <div className="advice-label">
                            💡 Improvement Tips
                          </div>
                          <p className="advice-text">{record.advice_disease}</p>
                        </div>
                      </div>

                      <div className="score-section">
                        <div className="score-header">
                          <span className="score-title">🎯 Goal Achievement</span>
                          <span className="score-value">({record.score_goal}/10)</span>
                        </div>
                        <p className="score-reason">{record.reason_goal}</p>
                        <div className="score-advice">
                          <div className="advice-label">
                            💡 Improvement Tips
                          </div>
                          <p className="advice-text">{record.advice_goal}</p>
                        </div>
                      </div>
                    </div>

                    <div className="user-info-section">
                      <h4 className="user-info-title">
                        📋 Profile Information at Evaluation
                      </h4>
                      <div className="user-info-grid">
                        <div className="user-info-item">
                          <span className="info-label">Gender</span>
                          <span className="info-value">
                            {record.gender === 'M' ? 'Male' : 'Female'}
                          </span>
                        </div>
                        <div className="user-info-item">
                          <span className="info-label">Age</span>
                          <span className="info-value">{record.age} years old</span>
                        </div>
                        <div className="user-info-item">
                          <span className="info-label">Height</span>
                          <span className="info-value">{record.height}cm</span>
                        </div>
                        <div className="user-info-item">
                          <span className="info-label">Weight</span>
                          <span className="info-value">{record.weight}kg</span>
                        </div>
                        <div className="user-info-item">
                          <span className="info-label">Goal</span>
                          <span className="info-value">{getGoalText(record.diet_goal)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="health-conditions">
                      <h4 className="health-conditions-title">
                        🏥 Health Status
                      </h4>
                      <p className={`health-conditions-list ${getHealthConditions(record) === 'None' ? 'no-conditions' : ''}`}>
                        {getHealthConditions(record)}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div ref={loader} />

        {(loading || fetching) && (
          <div className="loading-indicator">
            <motion.div
              className="loading-text"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {loading ? 'Loading history...' : 'Loading additional data...'}
            </motion.div>
          </div>
        )}

        {!hasMore && !loading && !fetching && history.length > 0 && (
          <motion.div
            className="end-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            All records have been loaded.
          </motion.div>
        )}

        {!loading && !fetching && history.length === 0 && (
          <motion.div
            className="end-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            No diet records available yet.
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default IntakeHistory;