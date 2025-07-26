import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    password2: '',
    name: '',
    gender: 'M',
    age: '',
    height: '',
    weight: '',
    is_vegetarian: false,
    diet_goal: 'maintain',
  });

  const diseases = [
    'has_diabetes', 'has_hypertension', 'has_hyperlipidemia', 'has_obesity',
    'has_metabolic_syndrome', 'has_gout', 'has_fatty_liver', 'has_thyroid',
    'has_gastritis', 'has_ibs', 'has_constipation', 'has_reflux',
    'has_pancreatitis', 'has_heart_disease', 'has_stroke', 'has_anemia',
    'has_osteoporosis', 'has_food_allergy'
  ];

  diseases.forEach(key => {
    if (!(key in form)) form[key] = false;
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('accounts/register/', form);
      alert('회원가입 완료!');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data;
      alert("회원가입 실패: " + JSON.stringify(msg));
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control my-2" placeholder="ID" name="username" onChange={handleChange} required />
        <input className="form-control my-2" placeholder="비밀번호" type="password" name="password" onChange={handleChange} required />
        <input className="form-control my-2" placeholder="비밀번호 확인" type="password" name="password2" onChange={handleChange} required />
        <input className="form-control my-2" placeholder="이름" name="name" onChange={handleChange} required />
        <input className="form-control my-2" placeholder="나이" name="age" type="number" onChange={handleChange} required />
        <input className="form-control my-2" placeholder="키(cm)" name="height" type="number" onChange={handleChange} required />
        <input className="form-control my-2" placeholder="몸무게(kg)" name="weight" type="number" onChange={handleChange} required />

        <div className="form-group my-2">
          <label className="me-2">성별:</label>
          <select name="gender" className="form-select" value={form.gender} onChange={handleChange}>
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>
        </div>

        <div className="form-group my-2">
          <label>질병 보유 여부:</label><br />
          {diseases.map((d) => (
            <div key={d} className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" name={d} onChange={handleChange} />
              <label className="form-check-label">{d.replace('has_', '').replaceAll('_', ' ')}</label>
            </div>
          ))}
        </div>

        <div className="form-check my-2">
          <input className="form-check-input" type="checkbox" name="is_vegetarian" onChange={handleChange} />
          <label className="form-check-label">채식주의자</label>
        </div>

        <div className="form-group my-2">
          <label className="me-2">식단 목적:</label>
          <select name="diet_goal" className="form-select" value={form.diet_goal} onChange={handleChange}>
            <option value="loss">체중 감량</option>
            <option value="maintain">현상 유지</option>
            <option value="gain">근육 증량</option>
          </select>
        </div>

        <button className="btn btn-primary mt-3" type="submit">가입하기</button>
      </form>
    </div>
  );
};

export default Register;
