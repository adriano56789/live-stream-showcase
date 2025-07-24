import React from 'react';

export const GamepadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="6" y1="12" x2="10" y2="12"></line>
    <line x1="8" y1="10" x2="8" y2="14"></line>
    <line x1="15" y1="13" x2="15.01" y2="13"></line>
    <line x1="18" y1="10" x2="18.01" y2="10"></line>
    <path d="M17.33 5.02c-1.74-2.36-4.6-3.82-7.83-3.82H7c-3.87 0-7 3.13-7 7v6c0 3.87 3.13 7 7 7h10c3.87 0 7-3.13 7-7v-1.17c0-2.3-.96-4.47-2.67-6.01z"></path>
  </svg>
);
