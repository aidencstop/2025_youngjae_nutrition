import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand" to="/dashboard">영양 관리</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item"><Link className="nav-link" to="/analyze">챗봇 입력</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/history">히스토리</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/dashboard">대시보드</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/mypage">내 정보</Link></li>
        </ul>
        <div className="d-flex">
          {token ? (
            <button className="btn btn-outline-danger" onClick={handleLogout}>로그아웃</button>
          ) : ( 
            <>
              <Link to="/login" className="btn btn-outline-primary me-2">로그인</Link>
              <Link to="/register" className="btn btn-outline-success">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
