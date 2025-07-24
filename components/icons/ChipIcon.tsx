
import React from 'react';

export const ChipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500" {...props}>
        <rect x="2" y="6" width="20" height="12" rx="2" ry="2" />
        <line x1="7" y1="10" x2="7" y2="14" />
        <line x1="12" y1="10" x2="12" y2="14" />
        <line x1="17" y1="10" x2="17" y2="14" />
        <line x1="9.5" y1="6" x2="9.5" y2="18" />
        <line x1="14.5" y1="6" x2="14.5" y2="18" />
    </svg>
);