import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import Logo from '../assets/image/favicon.png';
import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      background: 'rgba(26, 26, 46, 0.95)',
      color: '#ffffff',
      iconColor: '#77c6ff',
      confirmButtonColor: '#77c6ff',
      cancelButtonColor: '#ff6b6b',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'cyber-alert',
        title: 'cyber-alert-title',
        content: 'cyber-alert-content'
      }
    });

    if (result.isConfirmed) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been successfully logged out',
        background: 'rgba(26, 26, 46, 0.95)',
        color: '#ffffff',
        iconColor: '#00ff88',
        confirmButtonColor: '#77c6ff',
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: 'cyber-alert',
          title: 'cyber-alert-title',
          content: 'cyber-alert-content'
        }
      });

      navigate('/login');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Animation variants
  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
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

  const menuVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.nav
      className="cyber-navbar"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="navbar-container">
        {/* Logo Section */}
        <motion.div
          className="navbar-brand d-flex align-items-center"
          variants={logoVariants}
        >
          <Link to="/" className="brand-link">
            <img src={Logo} alt="NutriLens Logo" className="brand-logo" />
            <span className="brand-text">NutriLens</span>
          </Link>
        </motion.div>

        {/* Desktop Menu */}
        {token && (
          <motion.div
            className="navbar-menu desktop-menu"
            variants={menuVariants}
          >
            <motion.div variants={itemVariants}>
              <Link
                to="/dashboard"
                className={`menu-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                <i className="fas fa-chart-bar nav-icon"></i>
                Dashboard
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                to="/analyze"
                className={`menu-link ${isActive('/analyze') ? 'active' : ''}`}
              >
                <i className="fas fa-robot nav-icon"></i>
                AI Analyzer
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                to="/history"
                className={`menu-link ${isActive('/history') ? 'active' : ''}`}
              >
                <i className="fas fa-history nav-icon"></i>
                History
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                to="/mypage"
                className={`menu-link ${isActive('/mypage') ? 'active' : ''}`}
              >
                <i className="fas fa-user nav-icon"></i>
                Profile
              </Link>
            </motion.div>
          </motion.div>
        )}

        {/* Auth Section */}
        <motion.div
          className="navbar-auth"
          variants={menuVariants}
        >
          {token ? (
            <motion.button
              className="cyber-logout-btn"
              onClick={handleLogout}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </motion.button>
          ) : (
            <div className="auth-buttons">
              <motion.div variants={itemVariants}>
                <Link to="/login" className="cyber-auth-btn login-btn">
                  <i className="fas fa-sign-in-alt"></i>
                  Login
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link to="/register" className="cyber-auth-btn register-btn">
                  <i className="fas fa-user-plus"></i>
                  Sign Up
                </Link>
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Mobile Menu Toggle */}
        {token && (
          <motion.button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            variants={itemVariants}
            whileTap={{ scale: 0.9 }}
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </motion.button>
        )}
      </div>

      {/* Mobile Menu */}
      {token && (
        <motion.div
          className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}
          initial={false}
          animate={isMobileMenuOpen ? "open" : "closed"}
          variants={{
            open: {
              opacity: 1,
              height: "auto",
              transition: { duration: 0.3, ease: "easeOut" }
            },
            closed: {
              opacity: 0,
              height: 0,
              transition: { duration: 0.3, ease: "easeIn" }
            }
          }}
        >
          <div className="mobile-menu-content">
            <Link
              to="/dashboard"
              className={`mobile-menu-link ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-chart-bar nav-icon"></i>
              Dashboard
            </Link>
            <Link
              to="/analyze"
              className={`mobile-menu-link ${isActive('/analyze') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-robot nav-icon"></i>
              AI Analyzer
            </Link>
            <Link
              to="/history"
              className={`mobile-menu-link ${isActive('/history') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-history nav-icon"></i>
              History
            </Link>
            <Link
              to="/mypage"
              className={`mobile-menu-link ${isActive('/mypage') ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-user nav-icon"></i>
              Profile
            </Link>
          </div>
        </motion.div>
      )}

      {/* Navbar Background Effects */}
      <div className="navbar-glow"></div>
    </motion.nav>
  );
};

export default NavBar;