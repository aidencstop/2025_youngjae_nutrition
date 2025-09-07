import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import Logo from '../assets/image/logo.png';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
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
    { key: 'has_diabetes', label: 'Diabetes' },
    { key: 'has_hypertension', label: 'Hypertension' },
    { key: 'has_hyperlipidemia', label: 'Hyperlipidemia' },
    { key: 'has_obesity', label: 'Obesity' },
    { key: 'has_metabolic_syndrome', label: 'Metabolic Syndrome' },
    { key: 'has_gout', label: 'Gout' },
    { key: 'has_fatty_liver', label: 'Fatty Liver' },
    { key: 'has_thyroid', label: 'Thyroid' },
    { key: 'has_gastritis', label: 'Gastritis' },
    { key: 'has_ibs', label: 'IBS' },
    { key: 'has_constipation', label: 'Constipation' },
    { key: 'has_reflux', label: 'Reflux' },
    { key: 'has_pancreatitis', label: 'Pancreatitis' },
    { key: 'has_heart_disease', label: 'Heart Disease' },
    { key: 'has_stroke', label: 'Stroke' },
    { key: 'has_anemia', label: 'Anemia' },
    { key: 'has_osteoporosis', label: 'Osteoporosis' },
    { key: 'has_food_allergy', label: 'Food Allergy' }
  ];

  // Initialize disease fields
  diseases.forEach(({ key }) => {
    if (!(key in form)) form[key] = false;
  });

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.password2) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);
    
    try {
      await api.post('accounts/register/', form);
      alert('회원가입 완료!');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data;
      alert("회원가입 실패: " + JSON.stringify(msg));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Cyberpunk Background */}
      <div className="register-background">
        <div className="cyber-grid"></div>
        <div className="neon-overlay"></div>
      </div>

      {/* Register Card */}
      <motion.div 
        className="register-card"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div 
          className="register-logo"
          variants={logoVariants}
        >
          <img src={Logo} alt="NutriLens Logo" />
          <h1>NutriLens</h1>
        </motion.div>

        {/* Welcome Text */}
        <motion.div 
          className="register-header"
          variants={itemVariants}
        >
          <h2>Join NutriLens</h2>
          <p>Start your personalized nutrition journey</p>
        </motion.div>

        {/* Register Form */}
        <motion.form 
          className="register-form"
          onSubmit={handleSubmit}
          variants={itemVariants}
        >
          {/* Basic Info Section */}
          <div className="form-section">
            <h3 className="section-title">Account Information</h3>
            
            <motion.div className="input-group" variants={itemVariants}>
              <i className="fas fa-user input-icon"></i>
              <input
                className="cyber-input"
                name="username"
                placeholder="Username"
                onChange={handleChange}
                required
              />
            </motion.div>

            <motion.div className="input-group" variants={itemVariants}>
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

            <motion.div className="input-group" variants={itemVariants}>
              <i className="fas fa-check-circle input-icon"></i>
              <input
                className="cyber-input"
                name="password2"
                type="password"
                placeholder="Confirm Password"
                onChange={handleChange}
                required
              />
            </motion.div>

            <motion.div className="input-group" variants={itemVariants}>
              <i className="fas fa-id-card input-icon"></i>
              <input
                className="cyber-input"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
              />
            </motion.div>
          </div>

          {/* Physical Info Section */}
          <div className="form-section">
            <h3 className="section-title">Physical Information</h3>
            
            <div className="input-row">
              <motion.div className="input-group half" variants={itemVariants}>
                <i className="fas fa-calendar input-icon"></i>
                <input
                  className="cyber-input"
                  name="age"
                  type="number"
                  placeholder="Age"
                  onChange={handleChange}
                  required
                />
              </motion.div>

              <motion.div className="input-group half" variants={itemVariants}>
                <i className="fas fa-venus-mars input-icon"></i>
                <select
                  className="cyber-select"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </motion.div>
            </div>

            <div className="input-row">
              <motion.div className="input-group half" variants={itemVariants}>
                <i className="fas fa-ruler-vertical input-icon"></i>
                <input
                  className="cyber-input"
                  name="height"
                  type="number"
                  placeholder="Height (cm)"
                  onChange={handleChange}
                  required
                />
              </motion.div>

              <motion.div className="input-group half" variants={itemVariants}>
                <i className="fas fa-weight input-icon"></i>
                <input
                  className="cyber-input"
                  name="weight"
                  type="number"
                  placeholder="Weight (kg)"
                  onChange={handleChange}
                  required
                />
              </motion.div>
            </div>
          </div>

          {/* Health Info Section */}
          <div className="form-section">
            <h3 className="section-title">Health & Diet Preferences</h3>
            
            <motion.div className="input-group" variants={itemVariants}>
              <i className="fas fa-target input-icon"></i>
              <select
                className="cyber-select"
                name="diet_goal"
                value={form.diet_goal}
                onChange={handleChange}
              >
                <option value="loss">Weight Loss</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Muscle Gain</option>
              </select>
            </motion.div>

            <motion.div className="checkbox-group" variants={itemVariants}>
              <label className="cyber-checkbox">
                <input
                  type="checkbox"
                  name="is_vegetarian"
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">I am vegetarian</span>
              </label>
            </motion.div>

            {/* Medical Conditions */}
            <motion.div className="medical-conditions" variants={itemVariants}>
              <h4 className="conditions-title">Medical Conditions</h4>
              <div className="conditions-grid">
                {diseases.map(({ key, label }) => (
                  <label key={key} className="cyber-checkbox small">
                    <input
                      type="checkbox"
                      name={key}
                      onChange={handleChange}
                    />
                    <span className="checkmark"></span>
                    <span className="checkbox-label">{label}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          </div>

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
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </span>
            <div className="button-glow"></div>
          </motion.button>
        </motion.form>

        {/* Footer Links */}
        <motion.div 
          className="register-footer"
          variants={itemVariants}
        >
          <Link to="/login" className="cyber-link">
            Already have an account? <span>Sign In</span>
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

export default Register;
