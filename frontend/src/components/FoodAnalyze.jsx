import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import Typewriter from 'typewriter-effect';
import api from '../api/axios';

import SimpleChat from '../assets/image/SimpleChat.png';
import ImageAnalysis from '../assets/image/ImageAnalysis.png';
import Hybrid from '../assets/image/Hybrid.png';
import AI from '../assets/image/AI.png';
import { useNavigate } from 'react-router-dom';
import './FoodAnalyze.css';

// TypewriterMessage 컴포넌트를 외부로 분리 - React.memo로 최적화
const TypewriterMessage = React.memo(({ text, messageId, onComplete }) => {
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) {
      setHasStarted(true);
    }
  }, [hasStarted]);

  if (!hasStarted) {
    return <div className="typewriter-text">{text.charAt(0)}</div>;
  }

  return (
    <div className="typewriter-text">
      <Typewriter
        key={messageId} // key를 추가하여 고유성 보장
        options={{
          strings: [text],
          autoStart: true,
          loop: false,
          delay: 25,
          deleteSpeed: Infinity,
          cursor: '',
        }}
        onInit={(typewriter) => {
          typewriter
            .typeString(text)
            .callFunction(() => {
              if (onComplete) {
                setTimeout(onComplete, 100); // 약간의 지연으로 안정성 확보
              }
            })
            .start();
        }}
      />
    </div>
  );
});

const FoodAnalyze = () => {
  const [mode, setMode] = useState('chat'); // 'chat', 'image', 'hybrid'
  const [input, setInput] = useState('');
  const [chat, setChat] = useState([]);
  const [stopped, setStopped] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const stopCommand = ['그만','완료','stop', 'exit', 'cancel', 'done', 'evaluate', 'finish'];
  const navigate = useNavigate();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]); // isTyping 제거하여 input 변화 시 재실행 방지

  const addMessage = (role, text, isEvaluation = false, withTyping = false) => {
    const message = {
      role,
      text,
      isEvaluation,
      withTyping,
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString(),
      isComplete: !withTyping // 타이핑이 아니면 즉시 완료 상태
    };

    // 즉시 메시지를 추가하고, 타이핑 효과는 렌더링에서 처리
    setChat((prev) => [...prev, message]);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages(prev => [...prev, {
            id: Date.now() + Math.random(),
            file,
            preview: e.target.result
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages(prev => [...prev, {
            id: Date.now() + Math.random(),
            file,
            preview: e.target.result
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && images.length === 0) return;

    const userMessage = input.trim() || `[${images.length} image(s) uploaded]`;
    addMessage('user', userMessage);

    // Check for stop command
    if (stopCommand.includes(input.toLowerCase())) {
      setStopped(true);

      // Show loading alert
      Swal.fire({
        title: 'Evaluating...',
        text: 'Analyzing your daily nutrition data',
        allowOutsideClick: false,
        allowEscapeKey: false,
        background: '#1a1a2e',
        color: '#ffffff',
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const res = await api.post('accounts/evaluate/', {});
        setEvaluation(res.data);

        const evalText =
          `Today's evaluation score: ${res.data.grade}\n\n` +
          `✅ Macro (${res.data.score_macro}/10): ${res.data.reason_macro}\n` +
          `💡 Improvement Tips: ${res.data.advice_macro}\n\n` +
          `✅ Disease (${res.data.score_disease}/10): ${res.data.reason_disease}\n` +
          `💡 Improvement Tips: ${res.data.advice_disease}\n\n` +
          `✅ Goal (${res.data.score_goal}/10): ${res.data.reason_goal}\n` +
          `💡 Improvement Tips: ${res.data.advice_goal}`;

        addMessage('bot', evalText, true, true);

        // Close loading and show success
        Swal.fire({
          title: 'Evaluation Complete!',
          text: `Your daily nutrition score: ${res.data.grade}`,
          icon: 'success',
          background: '#1a1a2e',
          color: '#ffffff',
          confirmButtonColor: '#00ff88'
        });
      } catch (err) {
        console.error('Evaluation failed', err);
        const detail = err?.response?.data?.detail || JSON.stringify(err?.response?.data) || err?.message || 'Failed to evaluate your daily nutrition.';
        addMessage('bot', `❌ ${detail}`, false, true);

        // Close loading and show error
        Swal.fire({
          title: 'Evaluation Failed',
          text: 'Failed to evaluate your daily nutrition. Please try again.',
          icon: 'error',
          background: '#1a1a2e',
          color: '#ffffff',
          confirmButtonColor: '#ff4444'
        });
      }
    } else {
      try {
        if (mode === 'chat') {
          // Simple Chat Mode - Existing functionality
          const res = await api.post('accounts/chat/', { content: input });
          addMessage('bot', `✨ Recorded: ${res.data.record.content}`, false, true);
        } else if (mode === 'image') {
          // Image Analysis Mode
          if (images.length === 0) {
            addMessage('bot', '📸 Please upload at least one image for analysis.', false, true);
            return;
          }

          // TODO: Backend - Implement image analysis API
          const form = new FormData();
          images.forEach((img) => form.append('images', img.file));
          if (input.trim()) form.append('note', input.trim());
          const res = await api.post('accounts/image-analyze/', form, {
             headers: { 'Content-Type': 'multipart/form-data' },
          });
          const count = res.data.ingested_count;
          const names = (res.data.images || []).map(x => x.image?.split('/').pop()).join(', ');
          addMessage('bot', `📸 Saved ${count} image(s): ${names}\n✨ Recorded: ${res.data.record.content}`, false, true);
          setImages([]);
        } else if (mode === 'hybrid') {
          // Hybrid Mode - Text + Image
          const form = new FormData();
          images.forEach((img) => form.append('images', img.file));
          if (input.trim()) form.append('text', input.trim());
          const res = await api.post('accounts/hybrid-analyze/', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          const names = (res.data.images || []).map(x => x.image?.split('/').pop()).join(', ');
          addMessage('bot', `🔬 Hybrid ingested!\n🖼 ${names || 'no images'}\n📝 ${res.data.record?.content || ''}`, false, true);
          setImages([]);
        }
      } catch (err) {
        console.error('Analysis failed', err);
        const detail =
          err?.response?.data?.error ||
          err?.response?.data?.detail ||
          (typeof err?.response?.data === 'string' ? err.response.data : JSON.stringify(err?.response?.data)) ||
          err?.message ||
          'Failed to process your input.';
        addMessage('bot', `❌ ${detail}`, false, true);
      }
    }

    setInput('');
  };

  const resetSession = () => {
    setChat([]);
    setStopped(false);
    setEvaluation(null);
    setImages([]);
    setInput('');
  };

  const getModeConfig = () => {
    switch (mode) {
      case 'chat':
        return {
          title: 'Simple Chat',
          icon: '💬',
          description: 'Describe your meals with text',
          placeholder: 'e.g., Chicken breast 100g, banana 1 piece'
        };
      case 'image':
        return {
          title: 'Image Analysis',
          icon: '📸',
          description: 'Upload photos of your food',
          placeholder: 'Add description (optional)'
        };
      case 'hybrid':
        return {
          title: 'Hybrid Analysis',
          icon: '🔬',
          description: 'Combine text description with food photos',
          placeholder: 'Describe your meal and upload photos'
        };
      default:
        return {
          title: 'Simple Chat',
          icon: '💬',
          description: 'Describe your meals with text',
          placeholder: 'e.g., Chicken breast 100g, banana 1 piece'
        };
    }
  };

  const currentConfig = getModeConfig();

  return (
    <div className="food-analyze">
      <motion.div
        className="analyze-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="analyze-header">
          <h2 className="analyze-title">
            <span className="title-icon">
              <img src={AI} alt="NutriLens AI Robot" className="img-fluid" width={100}/>
            </span>
            NutriLens Analyzer
          </h2>
          <p className="analyze-subtitle">
            Track your nutrition with AI-powered food analysis
          </p>
        </div>

        {/* Mode Selection */}
        <div className="mode-selector">
          <div className="mode-title">Analysis Mode</div>
          <div className="mode-buttons">
            {['chat', 'image', 'hybrid'].map((modeType) => {
              const config = {
                chat: { title: 'Simple Chat', icon: <img src={SimpleChat} alt="NutriLens AI Robot" className="img-fluid" width={100}/> },
                image: { title: 'Image Analysis', icon: <img src={ImageAnalysis} alt="NutriLens AI Robot" className="img-fluid" width={100}/> },
                hybrid: { title: 'Hybrid Analysis', icon: <img src={Hybrid} alt="NutriLens AI Robot" className="img-fluid" width={100}/> }
              }[modeType];

              return (
                <motion.button
                  key={modeType}
                  className={`mode-button ${mode === modeType ? 'active' : ''}`}
                  onClick={() => setMode(modeType)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="mode-icon">{config.icon}</span>
                  <span className="mode-text">{config.title}</span>
                </motion.button>
              );
            })}
          </div>
          <div className="mode-description">
            <span className="mode-desc-icon">{currentConfig.icon}</span>
            {currentConfig.description}
          </div>
        </div>

        {/* Chat Container */}
        <div className="chat-container" ref={chatContainerRef}>
          <AnimatePresence>
            {chat.map((message, index) => (
              <motion.div
                key={message.id || index}
                className={`message ${message.role}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="message-content">
                  <div className="message-avatar">
                    {message.role === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className="message-body">
                    <div className={`message-bubble ${message.isEvaluation ? 'evaluation' : ''}`}>
                      {message.withTyping && !message.isComplete ? (
                        <TypewriterMessage
                          text={message.text}
                          messageId={message.id}
                          onComplete={() => {
                            // 타이핑 완료 표시
                            setChat(prev => prev.map(msg =>
                              msg.id === message.id ? { ...msg, isComplete: true } : msg
                            ));
                          }}
                        />
                      ) : (
                        message.text
                      )}
                    </div>
                    <div className="message-time">{message.timestamp}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Image Upload Area (for image and hybrid modes) */}
        {(mode === 'image' || mode === 'hybrid') && (
          <motion.div
            className="image-upload-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="image-drop-zone"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="drop-zone-content">
                <span className="drop-icon">📷</span>
                <div className="drop-text">
                  <div>Drop food images here or click to upload</div>
                  <div className="drop-subtext">Supports JPG, PNG, GIF</div>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>

            {images.length > 0 && (
              <div className="image-preview-grid">
                {images.map((image) => (
                  <div key={image.id} className="image-preview-item">
                    <img src={image.preview} alt="Food preview" />
                    <button
                      className="remove-image-btn"
                      onClick={() => removeImage(image.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Input Form */}
        {!stopped && (
          <motion.form
            className="input-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="input-container">
              <input
                type="text"
                className="message-input"
                placeholder={currentConfig.placeholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <motion.button
                type="submit"
                className="send-button"
                disabled={!input.trim() && images.length === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="send-icon">🚀</span>
              </motion.button>
            </div>
            <div className="input-actions">
              <button
                type="button"
                className="action-button reset"
                onClick={resetSession}
              >
                <span>🔄</span> Reset
              </button>
              <button
                type="button"
                className="action-button evaluate"
                onClick={() => setInput('evaluate')}
              >
                <span>📊</span> Evaluate
              </button>
            </div>
          </motion.form>
        )}

        {/* Evaluation Complete State */}
        {stopped && evaluation && (
          <>
          <motion.div
            className="evaluation-complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="eval-header">
              <span className="eval-icon">🎯</span>
              <h3>Daily Evaluation Complete</h3>
            </div>
            <div className="eval-score">
              Score: <span className="score-value">{evaluation.grade}</span>
            </div>
            <div className="d-flex justify-content-center gap-2">
              <button
                className="new-session-btn"
                onClick={resetSession}
              >
                Start New Session
              </button>
              <button
                className="new-session-btn"
                onClick={() => navigate('/login')}
              >
                Go to Dashboard
              </button>
            </div>
          </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default FoodAnalyze;