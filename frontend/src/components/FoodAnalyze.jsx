import React, { useState } from 'react';
import api from '../api/axios';

const FoodAnalyze = () => {
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [stopped, setStopped] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setChat((prev) => [...prev, userMessage]);

    if (input === '그만') {
      setStopped(true);
      try {
        const res = await api.post('accounts/evaluate/');
        setEvaluation(res.data);
        const evalMsg = {
          role: 'bot',
          text:
            `오늘의 평가 점수는 ${res.data.grade} 입니다.\n\n` +
            `✅ Macro (${res.data.score_macro}/10): ${res.data.reason_macro}\n` +
            `👉 개선 팁: ${res.data.advice_macro}\n\n` +
            `✅ Disease (${res.data.score_disease}/10): ${res.data.reason_disease}\n` +
            `👉 개선 팁: ${res.data.advice_disease}\n\n` +
            `✅ Goal (${res.data.score_goal}/10): ${res.data.reason_goal}\n` +
            `👉 개선 팁: ${res.data.advice_goal}`,
        };
        setChat((prev) => [...prev, evalMsg]);
      } catch (err) {
        console.error('평가 실패', err);
        setChat((prev) => [...prev, { role: 'bot', text: 'GPT 평가에 실패했습니다.' }]);
      }
    } else {
      try {
        const res = await api.post('accounts/chat/', { content: input });
        const reply = { role: 'bot', text: `기록 완료: ${res.data.record.content}` };
        setChat((prev) => [...prev, reply]);
      } catch (err) {
        console.error('기록 실패', err);
        setChat((prev) => [...prev, { role: 'bot', text: '기록에 실패했습니다.' }]);
      }
    }

    setInput('');
  };

  return (
    <div className="container mt-5">
      <h3>오늘 먹은 음식이나 영양제를 입력하세요.</h3>
      <div className="border rounded p-3 mb-3" style={{ height: '300px', overflowY: 'auto' }}>
        {chat.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <span className={`badge bg-${msg.role === 'user' ? 'primary' : 'secondary'}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      {!stopped && (
        <form onSubmit={handleSubmit}>
          <input
            className="form-control"
            placeholder="예: 닭가슴살 100g, 바나나 1개"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="btn btn-success mt-2" type="submit">입력</button>
        </form>
      )}
    </div>
  );
};

export default FoodAnalyze;
