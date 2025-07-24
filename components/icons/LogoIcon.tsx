
import React from 'react';
export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F472B6" />
        <stop offset="100%" stopColor="#A78BFA" />
      </linearGradient>
    </defs>
    <path d="M23.1667 5H16.8333C10.2875 5 5 10.2875 5 16.8333V23.1667C5 29.7125 10.2875 35 16.8333 35H23.1667C29.7125 35 35 29.7125 35 23.1667V16.8333C35 10.2875 29.7125 5 23.1667 5Z" fill="url(#logo-gradient)"/>
    <path d="M20 27.5C21.3807 27.5 22.5 26.3807 22.5 25V20.8333C22.5 17.5 20.8333 15.8333 17.5 15.8333H12.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
