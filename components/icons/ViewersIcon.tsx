import React from 'react';

export const ViewersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect y="4" width="2.5" height="6" rx="1" fill="white"/>
        <rect x="4.75" y="2" width="2.5" height="8" rx="1" fill="white"/>
        <rect x="9.5" y="0" width="2.5" height="10" rx="1" fill="white"/>
    </svg>
);
