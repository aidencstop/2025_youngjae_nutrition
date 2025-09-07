import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '../api/axios';
import './MyPage.css';

const MyPage = () => {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  const diseases = [
    { key: 'has_diabetes', label: 'Diabetes' },
    { key: 'has_hypertension', label: 'Hypertension' },
    { key: 'has_hyperlipidemia', label: 'Hyperlipidemia' },
    { key: 'has_obesity', label: 'Obesity' },
    { key: 'has_metabolic_syndrome', label: 'Metabolic Syndrome' },
    { key: 'has_gout', label: 'Gout' },
    { key: 'has_fatty_liver', label: 'Fatty Liver' },
    { key: 'has_thyroid', label: 'Thyroid Issues' },
    { key: 'has_gastritis', label: 'Gastritis' },
    { key: 'has_ibs', label: 'IBS' },
    { key: 'has_constipation', label: 'Constipation' },
    { key: 'has_reflux', label: 'Acid Reflux' },
    { key: 'has_pancreatitis', label: 'Pancreatitis' },
    { key: 'has_heart_disease', label: 'Heart Disease' },
    { key: 'has_stroke', label: 'Stroke' },
    { key: 'has_anemia', label: 'Anemia' },
    { key: 'has_osteoporosis', label: 'Osteoporosis' },
    { key: 'has_food_allergy', label: 'Food Allergy' }
  ];

  useEffect(() => {
    fetchMyInfo();
  }, []);

  const fetchMyInfo = async () => {
    try {
      const res = await api.get('accounts/my-info/');
      setForm(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load information', err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load your information.',
        icon: 'error',
        background: '#1a1a2e',
        color: '#ffffff',
        confirmButtonColor: '#77c6ff'
      });
      setLoading(false);
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
      Swal.fire({
        title: 'Success!',
        text: 'Your information has been updated successfully.',
        icon: 'success',
        background: '#1a1a2e',
        color: '#ffffff',
        confirmButtonColor: '#00ff88',
        timer: 2000,
        timerProgressBar: true
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update information.',
        icon: 'error',
        background: '#1a1a2e',
        color: '#ffffff',
        confirmButtonColor: '#77c6ff'
      });
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading your profile...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mypage-container">
      <div className="mypage-content">
        <motion.div
          className="mypage-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="mypage-title">My Profile</h1>
          <p className="mypage-subtitle">
            Update your personal information and health preferences
          </p>
        </motion.div>

        <motion.form
          className="profile-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Basic Information */}
          <div className="form-section">
            <h3 className="section-title">
              👤 Basic Information
            </h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  className="form-input"
                  value={form.name || ''}
                  name="name"
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  className="form-input"
                  value={form.age || ''}
                  name="age"
                  onChange={handleChange}
                  placeholder="Enter your age"
                  type="number"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input
                  className="form-input"
                  value={form.height || ''}
                  name="height"
                  onChange={handleChange}
                  placeholder="Enter your height"
                  type="number"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input
                  className="form-input"
                  value={form.weight || ''}
                  name="weight"
                  onChange={handleChange}
                  placeholder="Enter your weight"
                  type="number"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  name="gender"
                  className="form-select"
                  value={form.gender || 'M'}
                  onChange={handleChange}
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Diet Goal</label>
                <select
                  name="diet_goal"
                  className="form-select"
                  value={form.diet_goal || 'maintain'}
                  onChange={handleChange}
                >
                  <option value="loss">Weight Loss</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="gain">Muscle Gain</option>
                </select>
              </div>
            </div>
          </div>

          {/* Health Conditions */}
          <div className="form-section">
            <div className="diseases-section">
              <h3 className="diseases-title">
                🏥 Health Conditions
              </h3>
              <div className="diseases-grid">
                {diseases.map((disease) => (
                  <motion.div
                    key={disease.key}
                    className={`checkbox-item ${form[disease.key] ? 'checked' : ''}`}
                    onClick={() => setForm({ ...form, [disease.key]: !form[disease.key] })}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`custom-checkbox ${form[disease.key] ? 'checked' : ''}`}></div>
                    <span className="checkbox-label">{disease.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Diet Preferences */}
          <div className="form-section">
            <div className="diet-preferences">
              <h3 className="preferences-title">
                🌱 Diet Preferences
              </h3>
              <motion.div
                className={`vegetarian-option ${form.is_vegetarian ? 'checked' : ''}`}
                onClick={() => setForm({ ...form, is_vegetarian: !form.is_vegetarian })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`custom-checkbox ${form.is_vegetarian ? 'checked' : ''}`}></div>
                <span className="checkbox-label">Vegetarian</span>
              </motion.div>
            </div>
          </div>

          <motion.button
            className="submit-button"
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Update Profile
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default MyPage;