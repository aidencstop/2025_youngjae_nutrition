import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ username: '', password: '' });

  // ✅ 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ✅ 로그인 시도
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('accounts/login/', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert('로그인 성공!');
      navigate(from, { replace: true });  // 로그인 후 원래 가려던 경로로 이동
    } catch (err) {
      alert('로그인 실패');
      console.error(err);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control my-2"
          name="username"
          placeholder="아이디"
          onChange={handleChange}
          required
        />
        <input
          className="form-control my-2"
          name="password"
          type="password"
          placeholder="비밀번호"
          onChange={handleChange}
          required
        />
        <button className="btn btn-primary w-100 mt-3" type="submit">로그인</button>
      </form>
    </div>
  );
};

export default Login;
