// Log meals icon - Notebook with food and utensils
import React from 'react';

const LogMealsIcon = ({ className = "" }) => (
  <svg 
    className={className}
    width="80" 
    height="80" 
    viewBox="0 0 80 80" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Notebook background */}
    <rect x="10" y="8" width="50" height="64" rx="8" fill="url(#notebookGradient)" />
    
    {/* Spiral rings */}
    <rect x="12" y="4" width="4" height="8" rx="2" fill="#8B7355" />
    <rect x="20" y="4" width="4" height="8" rx="2" fill="#8B7355" />
    <rect x="28" y="4" width="4" height="8" rx="2" fill="#8B7355" />
    
    {/* Fork */}
    <rect x="2" y="20" width="8" height="30" rx="4" fill="#8B7355" />
    <rect x="4" y="18" width="1" height="6" fill="#8B7355" />
    <rect x="6" y="18" width="1" height="6" fill="#8B7355" />
    <rect x="8" y="18" width="1" height="6" fill="#8B7355" />
    
    {/* Pencil */}
    <rect x="62" y="25" width="6" height="25" rx="3" fill="#CD853F" />
    <rect x="63.5" y="23" width="3" height="4" fill="#D2691E" />
    <circle cx="65" cy="21" r="1.5" fill="#8B4513" />
    
    {/* Food bowl */}
    <circle cx="40" cy="38" r="12" fill="#CD853F" />
    <circle cx="40" cy="38" r="10" fill="#D2691E" />
    
    {/* Food items in bowl */}
    <circle cx="37" cy="36" r="3" fill="#DEB887" />
    <circle cx="42" cy="40" r="2" fill="#F5DEB3" />
    <circle cx="39" cy="42" r="1.5" fill="#90EE90" />
    <circle cx="44" cy="36" r="1.5" fill="#90EE90" />
    
    {/* Text lines */}
    <rect x="18" y="56" width="20" height="2" fill="#8B7355" />
    <rect x="18" y="60" width="16" height="2" fill="#8B7355" />
    <rect x="18" y="64" width="24" height="2" fill="#8B7355" />
    
    <defs>
      <linearGradient id="notebookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F5E6D3" />
        <stop offset="100%" stopColor="#E8D5B7" />
      </linearGradient>
    </defs>
  </svg>
);

export default LogMealsIcon;
