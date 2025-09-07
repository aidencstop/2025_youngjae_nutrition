import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '../api/axios';
import Logo from '../assets/image/logo.png';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        type: "spring",
        stiffness: 100
      }
    }
  };

  // ✅ 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ✅ 로그인 시도
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post('accounts/login/', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // SweetAlert2로 성공 메시지 표시
      await Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome back to NutriLens',
        background: 'rgba(26, 26, 46, 0.95)',
        color: '#ffffff',
        iconColor: '#77c6ff',
        confirmButtonColor: '#77c6ff',
        confirmButtonText: 'Continue',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: 'cyber-alert',
          title: 'cyber-alert-title',
          content: 'cyber-alert-content'
        }
      });

      navigate(from, { replace: true });
    } catch (err) {
      // 에러도 SweetAlert2로 표시
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Please check your credentials and try again',
        background: 'rgba(26, 26, 46, 0.95)',
        color: '#ffffff',
        iconColor: '#ff6b6b',
        confirmButtonColor: '#77c6ff',
        confirmButtonText: 'Try Again',
        customClass: {
          popup: 'cyber-alert',
          title: 'cyber-alert-title',
          content: 'cyber-alert-content'
        }
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Cyberpunk Background */}
      <div className="login-background">
        <div className="cyber-grid"></div>
        <div className="neon-overlay"></div>
      </div>

      {/* Login Card */}
      <motion.div
        className="login-card"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div
          className="login-logo"
          variants={logoVariants}
          style={ { cursor: 'pointer' } }
          onClick={() => navigate('/')}
        >
          <img src={Logo} alt="NutriLens Logo" />
          <h1>NutriLens</h1>
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          className="login-header"
          variants={itemVariants}
        >
          <h2>Welcome Back</h2>
          <p>Sign in to continue your healthy journey</p>
        </motion.div>

        {/* Login Form */}
        <motion.form
          className="login-form"
          onSubmit={handleSubmit}
          variants={itemVariants}
        >
          <motion.div
            className="input-group"
            variants={itemVariants}
            whileFocus={{ scale: 1.02 }}
          >
            <i className="fas fa-user input-icon"></i>
            <input
              className="cyber-input"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
            />
          </motion.div>

          <motion.div
            className="input-group"
            variants={itemVariants}
            whileFocus={{ scale: 1.02 }}
          >
            <i className="fas fa-lock input-icon"></i>
            <input
              className="cyber-input"
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </motion.div>

          <motion.button
            className="cyber-button"
            type="submit"
            disabled={isLoading}
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 30px rgba(119, 198, 255, 0.6)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="button-text">
              {isLoading ? 'Signing In...' : 'Sign In'}
            </span>
            <div className="button-glow"></div>
          </motion.button>
        </motion.form>

        {/* Footer Links */}
        <motion.div
          className="login-footer"
          variants={itemVariants}
        >
          <Link to="/register" className="cyber-link">
            Don't have an account? <span>Sign Up</span>
          </Link>
          <Link to="/forgot-password" className="cyber-link">
            Forgot Password?
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating Particles */}
      <div className="floating-particles">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{
              opacity: 0,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            animate={{
              opacity: [0, 1, 0],
              y: [null, -100, -200],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Login;