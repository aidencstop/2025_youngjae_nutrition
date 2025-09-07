// ScrollStack.jsx
import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import './ScrollStack.css';

const ScrollStack = ({ children, useContainerScroll = false }) => {
  const containerRef = useRef(null);
  const rafIdRef = useRef(null);
  const lenisRef = useRef(null);

  // ❗ (A) Framer Motion scroll source
  // - 컨테이너 스크롤을 쓰고 싶으면 CSS에서 고정 높이 + overflow-y: auto 필요
  // - 페이지 스크롤이면 target을 제거
  const scrollOpts = useContainerScroll
    ? { target: containerRef, offset: ['start end', 'end start'] }
    : { offset: ['start end', 'end start'] };

  const { scrollYProgress } = useScroll(scrollOpts);

  // ❗ (B) Lenis 1회만 생성 + 깨끗한 클린업
  useEffect(() => {
    if (lenisRef.current) return; // StrictMode 중복 방지

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    const raf = (time) => {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    };
    rafIdRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`scroll-stack-container${useContainerScroll ? ' scroll-stack-container--scroller' : ''}`}
      // ↑ 페이지 스크롤이면 그냥 기본 컨테이너, 컨테이너 스크롤이면 CSS 클래스로 높이/overflow 적용
    >
      <div className="scroll-stack">
        {children}
      </div>
    </div>
  );
};

const ScrollStackItem = ({ children, index = 0, maxZ = 50 }) => {
  const itemRef = useRef(null);

  // 개별 카드의 viewport 진입/이탈 기준 변환
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [-5, 0, 5]);

  return (
    <motion.div
      ref={itemRef}
      className="scroll-stack-item"
      style={{ y, scale, opacity, rotate, zIndex: Math.max(0, maxZ - index) }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollStack;
export { ScrollStackItem };
