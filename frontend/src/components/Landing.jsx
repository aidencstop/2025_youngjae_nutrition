import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AIAnalysisResults from '../assets/image/AIAnalysisResults.png';
import LogYourMeals from '../assets/image/LogYourMeals.png';
import nutrilensRobot from '../assets/image/NutrilensBot.png';
import profileSetup from '../assets/image/ProfileSetup.png';
import Logo from '../assets/image/logo.png';
import foodVideo from '../assets/video/food.mp4';
import '../styles/Landing.css';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import SpotlightCard from './SpotlightCard';
import Footer from './Footer';
import NavBar from './NavBar';


const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { scrollYProgress } = useScroll();
  const yPos = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Check login status
  useEffect(() => {
    // const token = localStorage.getItem('accessToken');
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.2 }
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.4 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // Counter component for animated numbers
  const AnimatedCounter = ({ target, suffix = '' }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (isInView) {
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          setCount(Math.floor(current));
        }, duration / steps);

        return () => clearInterval(timer);
      }
    }, [isInView, target]);

    return (
      <motion.div
        ref={ref}
        className="stat-number"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {count}{suffix}
      </motion.div>
    );
  };

  return (
    <div className="landing-container">
      {isLoggedIn && <NavBar />}
      {/* Hero Section with Layered Background */}
      <section className="hero-section">
        {/* Layer 3: Video Background (Bottom) */}
        <div className="video-background">
          <video autoPlay loop muted playsInline>
            <source src={foodVideo} type="video/mp4" />
          </video>
        </div>

        {/* Layer 2: Dark Transparent Overlay (Middle) */}
        <div className="dark-overlay"></div>

        {/* Layer 1: Text + Image Content (Top) */}
        <div className="hero-content-wrapper">
          <motion.div
            className="hero-content"
            style={{ y: yPos, opacity }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <span className="highlight">NutriLens</span>
              {/* <img src={Logo} alt="NutriLens Logo" /> */}
              <br />
              <span className="subtitle">AI-Powered Diet Analysis</span>
            </motion.h1>
            <motion.p
              className="hero-description"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              Get personalized dietary feedback tailored to your health goals
              and conditions with AI-powered daily analysis.
            </motion.p>
            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Link to="/register" className="btn btn-lg btn-primary border-0">
                  Get Started Now
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Link to="/login" className="btn btn-lg btn-outline-light">
                  Sign In
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-robot"
            initial={{ opacity: 0, x: 100, rotate: -10 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
            whileHover={{
              scale: 1.05,
              rotate: 5,
              transition: { duration: 0.3 }
            }}
          >
            <img src={Logo} alt="NutriLens Logo" className="robot-image" />
          </motion.div>
        </div>

        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="scroll-arrow"></div>
        </motion.div>
      </section>

      {/* Features Section with ScrollStack */}
      <section className="features-section">
        <div className="container">
          <motion.div
            className="section-header"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>Why Choose NutriLens?</h2>
            <p>Experience better health management through the fusion of AI technology and nutrition science</p>
          </motion.div>
        </div>

        <div className="container">
          <motion.div
            className="section-header"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <img src={nutrilensRobot} alt="NutriLens AI Robot" className="robot-image" />
          </motion.div>
        </div>

        <ScrollStack>
          <ScrollStackItem index={0}>
            <motion.div
              className="feature-icon"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
            >
              🤖
            </motion.div>

            <div className="highlight-number">01</div>
            <h3>AI-Powered Personalized Analysis</h3>
            <p>Our advanced AI analyzes your dietary habits with unprecedented accuracy, considering your unique health profile, goals, and preferences.</p>
            <div className="feature-details">
              <ul className="feature-list">
                <li>Machine learning algorithms trained on nutritional data</li>
                <li>Personalized recommendations based on health conditions</li>
                <li>Continuous learning from your eating patterns</li>
                <li>Integration with medical guidelines and dietary standards</li>
              </ul>
            </div>
          </ScrollStackItem>

          <ScrollStackItem index={1}>
            <motion.div
              className="feature-icon"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 3 }}
            >
              📊
            </motion.div>
            <div className="highlight-number">02</div>
            <h3>Real-time Smart Feedback</h3>
            <p>Get instant, actionable insights about your meals with comprehensive nutritional analysis and improvement suggestions tailored to your goals.</p>
            <div className="feature-details">
              <ul className="feature-list">
                <li>Instant macro and micronutrient breakdown</li>
                <li>Calorie tracking with portion size estimation</li>
                <li>Real-time alerts for dietary restrictions</li>
                <li>Smart meal timing optimization</li>
              </ul>
            </div>
          </ScrollStackItem>

          <ScrollStackItem index={2}>
            <motion.div
              className="feature-icon"
              animate={{ rotate: [0, -15, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, repeatDelay: 1 }}
            >
              🎯
            </motion.div>
            <div className="highlight-number">03</div>
            <h3>Advanced Goal Management</h3>
            <p>Whether you're aiming for weight loss, muscle gain, or managing health conditions, our system adapts to guide you toward your specific objectives.</p>
            <div className="feature-details">
              <ul className="feature-list">
                <li>Dynamic goal adjustment based on progress</li>
                <li>Multi-goal tracking and prioritization</li>
                <li>Evidence-based meal planning</li>
                <li>Integration with fitness and health apps</li>
              </ul>
            </div>
          </ScrollStackItem>
        </ScrollStack>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <motion.div
            className="section-header"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2>Simple 3-Step Process</h2>
            <p>Get started immediately without complex setup</p>
          </motion.div>

          <motion.div
            className="steps-container"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div
              variants={staggerItem}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              <SpotlightCard
                className="custom-spotlight-card"
                spotlightColor="rgba(119, 198, 255, 0.25)"
              >
                <div className="feature-icon">
                  {/* <ProfileIcon className="icon-image" /> */}
                  <img src={profileSetup} alt="Profile Setup" width={128} height={128} />
                </div>
                <div className="step-number">01</div>
                <h3>Profile Setup</h3>
                <p>Enter your basic information including age, weight, and health conditions to get personalized recommendations</p>
              </SpotlightCard>
            </motion.div>

            <motion.div
              variants={staggerItem}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              <SpotlightCard
                className="custom-spotlight-card"
                spotlightColor="rgba(255, 119, 198, 0.25)"
              >
                <div className="feature-icon">
                  {/* <LogMealsIcon className="icon-image" /> */}
                  <img src={LogYourMeals} alt="Log Your Meals" width={128} height={128} />
                </div>
                <div className="step-number">02</div>
                <h3>Log Your Meals</h3>
                <p>Simply input what you ate today using text descriptions and let our AI analyze your dietary patterns</p>
              </SpotlightCard>
            </motion.div>

            <motion.div
              variants={staggerItem}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              <SpotlightCard
                className="custom-spotlight-card"
                spotlightColor="rgba(198, 255, 119, 0.25)"
              >
                <div className="feature-icon">
                  <img src={AIAnalysisResults} alt="AI Analysis Results" width={128} height={128} />
                </div>
                <div className="step-number">03</div>
                <h3>AI Analysis Results</h3>
                <p>Review personalized feedback and improvement recommendations tailored to your health goals</p>
              </SpotlightCard>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-content"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Start Your Healthy Eating Journey
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Begin better health management with NutriLens today and transform your lifestyle
            </motion.p>
            <motion.div
              className="cta-buttons"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                  y: -3,
                  boxShadow: "0 20px 40px rgba(74, 144, 226, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  hover: { type: "spring", stiffness: 300 }
                }}
              >
                <Link to="/register" className="btn btn-primary btn-large btn-lg w-100">
                  Get Started
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Landing;