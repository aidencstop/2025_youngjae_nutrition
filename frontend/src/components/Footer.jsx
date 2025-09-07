import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../assets/image/logo.png';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <footer className="footer-section">
      <div className="footer-content">
        <div className="container">
          <motion.div 
            className="footer-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Brand Section */}
            <motion.div 
              className="footer-brand"
              variants={staggerItem}
            >
              <div className="brand-logo">
                <img src={Logo} alt="NutriLens Logo" className="footer-logo" />
                <h3>NutriLens</h3>
              </div>
              <p className="brand-description">
                AI-powered diet analysis for healthier living. 
                Get personalized nutrition insights tailored to your goals.
              </p>
              <div className="social-links">
                <motion.a 
                  href="#" 
                  className="social-link"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fab fa-facebook-f"></i>
                </motion.a>
                <motion.a 
                  href="#" 
                  className="social-link"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fab fa-twitter"></i>
                </motion.a>
                <motion.a 
                  href="#" 
                  className="social-link"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fab fa-instagram"></i>
                </motion.a>
                <motion.a 
                  href="#" 
                  className="social-link"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fab fa-linkedin-in"></i>
                </motion.a>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div 
              className="footer-links"
              variants={staggerItem}
            >
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <Link to="/" className="footer-link">Home</Link>
                </li>
                <li>
                  <Link to="/features" className="footer-link">Features</Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="footer-link">How It Works</Link>
                </li>
                <li>
                  <Link to="/pricing" className="footer-link">Pricing</Link>
                </li>
                <li>
                  <Link to="/about" className="footer-link">About Us</Link>
                </li>
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div 
              className="footer-links"
              variants={staggerItem}
            >
              <h4>Support</h4>
              <ul>
                <li>
                  <Link to="/help" className="footer-link">Help Center</Link>
                </li>
                <li>
                  <Link to="/contact" className="footer-link">Contact Us</Link>
                </li>
                <li>
                  <Link to="/faq" className="footer-link">FAQ</Link>
                </li>
                <li>
                  <Link to="/privacy" className="footer-link">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms" className="footer-link">Terms of Service</Link>
                </li>
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div 
              className="footer-contact"
              variants={staggerItem}
            >
              <h4>Get In Touch</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>support@nutrilens.com</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>123 Health St, Wellness City, HC 12345</span>
                </div>
              </div>
              
              {/* Newsletter */}
              <div className="newsletter">
                <h5>Stay Updated</h5>
                <p>Subscribe to get the latest nutrition tips and updates.</p>
                <motion.div 
                  className="newsletter-form"
                  whileHover={{ scale: 1.02 }}
                >
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="newsletter-input"
                  />
                  <motion.button 
                    type="submit"
                    className="newsletter-btn"
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 5px 15px rgba(74, 144, 226, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Subscribe
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer Bottom */}
      <motion.div 
        className="footer-bottom"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="container">
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} NutriLens. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link to="/privacy" className="bottom-link">Privacy</Link>
              <Link to="/terms" className="bottom-link">Terms</Link>
              <Link to="/cookies" className="bottom-link">Cookies</Link>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;