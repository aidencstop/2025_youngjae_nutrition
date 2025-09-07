// Profile setup icon - User with settings
import React from 'react';

const ProfileIcon = ({ className = "" }) => (
  <svg 
    className={className}
    width="80" 
    height="80" 
    viewBox="0 0 80 80" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background */}
    <rect width="80" height="80" rx="16" fill="url(#profileGradient)" />
    
    {/* User icon */}
    <circle cx="40" cy="28" r="10" fill="#E8A87C" />
    <path d="M25 55 C25 45, 32 40, 40 40 C48 40, 55 45, 55 55" fill="#E8A87C" />
    
    {/* Settings gear */}
    <g transform="translate(52, 52)">
      <circle cx="8" cy="8" r="3" fill="none" stroke="#CD853F" strokeWidth="1.5" />
      <path d="M8 1 L8 3 M15 8 L13 8 M8 15 L8 13 M1 8 L3 8" stroke="#CD853F" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12.5 3.5 L11.1 4.9 M12.5 12.5 L11.1 11.1 M3.5 12.5 L4.9 11.1 M3.5 3.5 L4.9 4.9" stroke="#CD853F" strokeWidth="1.5" strokeLinecap="round" />
    </g>
    
    <defs>
      <linearGradient id="profileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F5E6D3" />
        <stop offset="100%" stopColor="#E8D5B7" />
      </linearGradient>
    </defs>
  </svg>
);

export default ProfileIcon;
