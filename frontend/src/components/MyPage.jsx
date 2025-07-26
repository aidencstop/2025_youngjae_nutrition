import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const MyPage = () => {
  const [form, setForm] = useState(null);

  const diseases = [
    'has_diabetes', 'has_hypertension', 'has_hyperlipidemia', 'has_obesity',
    'has_metabolic_syndrome', 'has_gout', 'has_fatty_liver', 'has_thyroid',
    'has_gastritis', 'has_ibs', 'has_constipation', 'has_reflux',
    'has_pancreatitis', 'has_heart_disease', 'has_stroke', 'has_anemia',
    'has_osteoporosis', 'has_food_allergy'
  ];

  useEffect(() => {
    fetchMyInfo();
  }, []);

  const fetchMyInfo = async () => {
    try {
      const res = await api.get('accounts/my-info/');
      setForm(res.data);
    } catch (err) {
      console.error('정보 불러오기 실패', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('accounts/my-info/', form);
      alert('정보가 수정되었습니다.');
    } catch (err) {
      alert('수정 실패');
      console.error(err);
    }
  };

  if (!form) return <div className="container mt-5">로딩 중...</div>;

  return (
    <div className="container mt-4">
      <h2>내 정보 수정</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control my-2" value={form.name} name="name" onChange={handleChange} placeholder="이름" />
        <input className="form-control my-2" value={form.age} name="age" onChange={handleChange} placeholder="나이" type="number" />
        <input className="form-control my-2" value={form.height} name="height" onChange={handleChange} placeholder="키(cm)" type="number" />
        <input className="form-control my-2" value={form.weight} name="weight" onChange={handleChange} placeholder="몸무게(kg)" type="number" />

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
              <input className="form-check-input" type="checkbox" name={d} checked={form[d]} onChange={handleChange} />
              <label className="form-check-label">{d.replace('has_', '').replaceAll('_', ' ')}</label>
            </div>
          ))}
        </div>

        <div className="form-check my-2">
          <input className="form-check-input" type="checkbox" name="is_vegetarian" checked={form.is_vegetarian} onChange={handleChange} />
          <label className="form-check-label">채식주의자</label>
        </div>

        <div className="form-group my-2">
          <label className="me-2">식단 목표:</label>
          <select name="diet_goal" className="form-select" value={form.diet_goal} onChange={handleChange}>
            <option value="loss">체중 감량</option>
            <option value="maintain">현상 유지</option>
            <option value="gain">근육 증량</option>
          </select>
        </div>

        <button className="btn btn-primary mt-3" type="submit">저장하기</button>
      </form>
    </div>
  );
};

export default MyPage;
