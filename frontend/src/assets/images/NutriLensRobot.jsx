// NutriLens Robot mascot
import React from 'react';

const NutriLensRobot = ({ className = "" }) => (
  <svg 
    className={className}
    width="200" 
    height="240" 
    viewBox="0 0 200 240" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Robot platform */}
    <ellipse cx="100" cy="220" rx="50" ry="15" fill="url(#platformGradient)" />
    
    {/* Robot body */}
    <rect x="60" y="120" width="80" height="100" rx="15" fill="url(#bodyGradient)" />
    
    {/* Chest display */}
    <rect x="75" y="140" width="50" height="30" rx="8" fill="url(#screenGradient)" />
    <text x="100" y="158" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">NutriLens</text>
    
    {/* Robot head */}
    <circle cx="100" cy="80" r="35" fill="url(#headGradient)" />
    
    {/* Eyes */}
    <circle cx="88" cy="75" r="8" fill="url(#eyeGradient)" />
    <circle cx="112" cy="75" r="8" fill="url(#eyeGradient)" />
    <circle cx="88" cy="75" r="5" fill="#00BFFF" />
    <circle cx="112" cy="75" r="5" fill="#00BFFF" />
    <circle cx="88" cy="75" r="2" fill="white" />
    <circle cx="112" cy="75" r="2" fill="white" />
    
    {/* Mouth */}
    <path d="M90 90 Q100 95 110 90" stroke="#666" strokeWidth="2" fill="none" strokeLinecap="round" />
    
    {/* Arms */}
    <rect x="35" y="130" width="20" height="50" rx="10" fill="url(#armGradient)" />
    <rect x="145" y="130" width="20" height="50" rx="10" fill="url(#armGradient)" />
    
    {/* Hands */}
    <circle cx="45" cy="185" r="8" fill="url(#handGradient)" />
    <circle cx="155" cy="185" r="8" fill="url(#handGradient)" />
    
    {/* Legs */}
    <rect x="75" y="220" width="15" height="25" rx="7" fill="url(#legGradient)" />
    <rect x="110" y="220" width="15" height="25" rx="7" fill="url(#legGradient)" />
    
    {/* Antenna */}
    <rect x="99" y="40" width="2" height="15" fill="#4ECDC4" />
    <circle cx="100" cy="38" r="3" fill="#FF6B6B" />
    
    {/* Joint details */}
    <circle cx="45" cy="130" r="3" fill="#666" />
    <circle cx="155" cy="130" r="3" fill="#666" />
    <circle cx="82" cy="220" r="3" fill="#666" />
    <circle cx="118" cy="220" r="3" fill="#666" />
    
    <defs>
      <linearGradient id="platformGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#87CEEB" />
        <stop offset="100%" stopColor="#4682B4" />
      </linearGradient>
      
      <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E6F3FF" />
        <stop offset="50%" stopColor="#B3D9FF" />
        <stop offset="100%" stopColor="#87CEEB" />
      </linearGradient>
      
      <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F0F8FF" />
        <stop offset="50%" stopColor="#E6F3FF" />
        <stop offset="100%" stopColor="#B3D9FF" />
      </linearGradient>
      
      <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ECDC4" />
        <stop offset="100%" stopColor="#44A08D" />
      </linearGradient>
      
      <linearGradient id="eyeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#333" />
        <stop offset="100%" stopColor="#666" />
      </linearGradient>
      
      <linearGradient id="armGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E6F3FF" />
        <stop offset="100%" stopColor="#B3D9FF" />
      </linearGradient>
      
      <linearGradient id="handGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4E6F1" />
        <stop offset="100%" stopColor="#A9CCE3" />
      </linearGradient>
      
      <linearGradient id="legGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4E6F1" />
        <stop offset="100%" stopColor="#5DADE2" />
      </linearGradient>
    </defs>
  </svg>
);

export default NutriLensRobot;
