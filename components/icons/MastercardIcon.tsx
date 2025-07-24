
import React from 'react';

export const MastercardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mastercard" {...props}>
    <g fill="none" fillRule="evenodd">
      <circle fill="#EB001B" cx="15" cy="12" r="7" />
      <circle fill="#F79E1B" cx="23" cy="12" r="7" />
      <path
        d="M22.5 12c0-3.866-3.134-7-7-7s-7 3.134-7 7 3.134 7 7 7 7-3.134 7-7z"
        fill="#FF5F00"
      />
    </g>
  </svg>
);