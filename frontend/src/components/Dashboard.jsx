import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import './Dashboard.css';
import nutrilensRobot from '../assets/image/NutrilensBot.png';
import gradeA from '../assets/image/gradeA.png';
import gradeB from '../assets/image/gradeB.png';
import gradeC from '../assets/image/gradeC.png';
import gradeD from '../assets/image/gradeD.png';

const TextWithBreaks = ({ text }) => (
  <span style={{ whiteSpace: 'pre-line' }}>{text ?? ''}</span>
);

const Dashboard = () => {
  const [history, setHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  const renderGrade = (grade) => {
    const gradeConfig = {
      A: { color: '#00ff88', icon: <img src={gradeA} alt="gradeA" className="img-fluid" width={200}/>, text: 'Excellent' },
      B: { color: '#77c6ff', icon: <img src={gradeB} alt="gradeB" className="img-fluid" width={200}/>, text: 'Good' },
      C: { color: '#ffb347', icon: <img src={gradeC} alt="gradeC" className="img-fluid" width={200}/>, text: 'Fair' },
      D: { color: '#ff6b6b', icon: <img src={gradeD} alt="gradeD" className="img-fluid" width={200}/>, text: 'Needs Improvement' }
    };
    const config = gradeConfig[grade] || gradeConfig['D'];

    return (
      <div className="grade-display">
        <span className="grade-icon">{config.icon}</span>
        <div className="d-flex align-items-center gap-2">
          {/* <span className="grade-letter" style={{ color: config.color }}>{grade}</span> */}
          <span className="grade-text fs-3">{config.text}</span>
        </div>
      </div>
    );
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#00ff88';
    if (score >= 6) return '#77c6ff';
    if (score >= 4) return '#ffb347';
    return '#ff6b6b';
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-background">
          <div className="cyber-grid"></div>
          <div className="neon-overlay"></div>
        </div>
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading your nutrition data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
        <button className="btn btn-primary">Test Button</button>

      {/* Cyberpunk Background */}
      <div className="dashboard-background">
        <div className="cyber-grid"></div>
        <div className="neon-overlay"></div>
      </div>

      <motion.div
        className="dashboard-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          className="dashboard-header"
          variants={headerVariants}
        >
          <h1 className="dashboard-title">Today's Nutrition Summary</h1>
          <p className="dashboard-subtitle">Track your daily nutrition progress</p>
        </motion.div>

        <motion.div
          className="section-header"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <img src={nutrilensRobot} alt="NutriLens AI Robot" className="img-fluid" width={300}/>
        </motion.div>

        {!history ? (
          <motion.div
            className="no-data-card"
            variants={cardVariants}
          >
            <div className="no-data-icon">🍽️</div>
            <h3>No Data Available</h3>
            <p>Start by analyzing your meal and say "그만" to get your nutrition evaluation.</p>
          </motion.div>
        ) : (
          <>
            {/* Top Row - 2 Columns */}
            <div className="dashboard-row">
              {/* Summary Card */}
              <motion.div
                className="dashboard-card summary-card"
                variants={cardVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="card-header mb-4">
                  <h3 className="card-title">
                    <i className="fas fa-utensils card-icon"></i>
                    Daily Intake Summary
                  </h3>
                </div>
                <div className="card-content">
                  <div className="intake-text">
                    <TextWithBreaks text={history.total_intake_text} />
                  </div>
                </div>
              </motion.div>

              {/* Total Grade Card */}
              <motion.div
                className="dashboard-card grade-card"
                variants={cardVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="card-header mb-4">
                  <h3 className="card-title">
                    <i className="fas fa-chart-line card-icon"></i>
                    Overall Rating
                  </h3>
                </div>
                <div className="card-content">
                  {renderGrade(history.total_grade)}
                </div>
              </motion.div>
            </div>

            {/* Content Card - Full Width */}
            <motion.div
              className="dashboard-card content-card"
              variants={cardVariants}
              whileHover={{ scale: 1.01 }}
            >
              <div className="card-header mb-4">
                <h3 className="card-title">
                  <i className="fas fa-microscope card-icon"></i>
                  Detailed Analysis
                </h3>
              </div>
              <div className="card-content">
                <div className="analysis-grid">
                  {/* Macro Analysis */}
                  <div className="analysis-item">
                    <div className="analysis-header">
                      <div className="analysis-title">
                        <i className="fas fa-dna analysis-icon"></i>
                        Macronutrients
                      </div>
                      <div className="score-badge" style={{ backgroundColor: getScoreColor(history.score_macro) }}>
                        {history.score_macro}/10
                      </div>
                    </div>
                    <div className="analysis-content">
                      <p className="reason">
                        <i className="fas fa-info-circle"></i>{' '}
                        <TextWithBreaks text={history.reason_macro} />
                      </p>
                      <p className="advice">
                        <i className="fas fa-lightbulb"></i>
                        <TextWithBreaks text={history.advice_macro} />
                      </p>
                    </div>
                  </div>

                  {/* Disease Analysis */}
                  <div className="analysis-item">
                    <div className="analysis-header">
                      <div className="analysis-title">
                        <i className="fas fa-heartbeat analysis-icon"></i>
                        Health Conditions
                      </div>
                      <div className="score-badge" style={{ backgroundColor: getScoreColor(history.score_disease) }}>
                        {history.score_disease}/10
                      </div>
                    </div>
                    <div className="analysis-content">
                      <p className="reason">
                        <i className="fas fa-info-circle"></i>{' '}
                        <TextWithBreaks text={history.reason_disease} />
                      </p>
                      <p className="advice">
                        <i className="fas fa-lightbulb"></i>
                        <TextWithBreaks text={history.advice_disease} />
                      </p>
                    </div>
                  </div>

                  {/* Goal Analysis */}
                  <div className="analysis-item">
                    <div className="analysis-header">
                      <div className="analysis-title">
                        <i className="fas fa-target analysis-icon"></i>
                        Diet Goals
                      </div>
                      <div className="score-badge" style={{ backgroundColor: getScoreColor(history.score_goal) }}>
                        {history.score_goal}/10
                      </div>
                    </div>
                    <div className="analysis-content">
                      <p className="reason">
                        <i className="fas fa-info-circle"></i>{' '}
                        <TextWithBreaks text={history.reason_goal} />
                      </p>
                      <p className="advice">
                        <i className="fas fa-lightbulb"></i>
                        <TextWithBreaks text={history.advice_goal} />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;