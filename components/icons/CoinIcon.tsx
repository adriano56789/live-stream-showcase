
import React from 'react';
export const CoinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-yellow-400" {...props}>
    <circle cx="12" cy="12" r="8"></circle>
    <line x1="12" y1="16" x2="12" y2="16"></line>
    <line x1="12" y1="8" x2="12" y2="12.5"></line>
  </svg>
);