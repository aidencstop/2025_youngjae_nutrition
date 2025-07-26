import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="container text-center mt-5">
      <h1>🥗 식단 분석 및 피드백 웹앱</h1>
      <p className="mt-3">
        당신의 건강 목표와 상태에 맞춘<br />식단 피드백을 매일 제공해드립니다.
      </p>
      <div className="mt-4">
        <Link to="/login" className="btn btn-primary me-3">로그인</Link>
        <Link to="/register" className="btn btn-outline-primary">회원가입</Link>
      </div>
    </div>
  );
};

export default Landing;
