import React from 'react';

export const MedalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 6.5l2.5 5 5 1.5-3.5 3.5 1 5L12 18l-5 3.5 1-5-3.5-3.5 5-1.5z"></path>
    <path d="M12 18.5V22"></path>
    <path d="M5 14l-3 3 3 3"></path>
    <path d="M19 14l3 3-3 3"></path>
  </svg>
);
