// AI Analysis icon - Document with AI chip and chart
import React from 'react';

const AnalysisIcon = ({ className = "" }) => (
  <svg 
    className={className}
    width="80" 
    height="80" 
    viewBox="0 0 80 80" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Document background */}
    <rect x="15" y="10" width="45" height="60" rx="8" fill="url(#documentGradient)" />
    
    {/* AI Chip */}
    <rect x="20" y="15" width="20" height="16" rx="4" fill="#CD853F" />
    <rect x="22" y="17" width="16" height="12" rx="2" fill="#DEB887" />
    
    {/* AI Text */}
    <text x="30" y="26" fill="#8B4513" fontSize="8" fontWeight="bold" textAnchor="middle">AI</text>
    
    {/* Chip pins */}
    <rect x="18" y="19" width="2" height="1" fill="#8B7355" />
    <rect x="18" y="22" width="2" height="1" fill="#8B7355" />
    <rect x="18" y="25" width="2" height="1" fill="#8B7355" />
    <rect x="18" y="28" width="2" height="1" fill="#8B7355" />
    
    <rect x="40" y="19" width="2" height="1" fill="#8B7355" />
    <rect x="40" y="22" width="2" height="1" fill="#8B7355" />
    <rect x="40" y="25" width="2" height="1" fill="#8B7355" />
    <rect x="40" y="28" width="2" height="1" fill="#8B7355" />
    
    {/* Analysis Results Text */}
    <text x="30" y="42" fill="#8B4513" fontSize="6" fontWeight="bold" textAnchor="middle">ANALYSIS</text>
    <text x="30" y="49" fill="#8B4513" fontSize="6" fontWeight="bold" textAnchor="middle">RESULTS</text>
    
    {/* Data lines */}
    <rect x="20" y="52" width="12" height="1" fill="#8B7355" />
    <rect x="20" y="55" width="8" height="1" fill="#8B7355" />
    <rect x="20" y="58" width="10" height="1" fill="#8B7355" />
    <rect x="20" y="61" width="6" height="1" fill="#8B7355" />
    
    {/* Pie chart */}
    <circle cx="50" cy="55" r="8" fill="none" stroke="#CD853F" strokeWidth="2" />
    <path d="M50 47 A8 8 0 0 1 57 52 L50 55 Z" fill="#D2691E" />
    <path d="M50 47 A8 8 0 0 0 45 60 L50 55 Z" fill="#DEB887" />
    <circle cx="50" cy="55" r="2" fill="#F5E6D3" />
    
    <defs>
      <linearGradient id="documentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F5E6D3" />
        <stop offset="100%" stopColor="#E8D5B7" />
      </linearGradient>
    </defs>
  </svg>
);

export default AnalysisIcon;
