import React from 'react';

const SpinnerHex = ({ size = 48, color = '#C8A96A' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 40 40" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes hexDraw {
            0%   { stroke-dashoffset: 120; opacity: 0.3; }
            50%  { stroke-dashoffset: 0;   opacity: 1;   }
            100% { stroke-dashoffset: 120; opacity: 0.3; }
          }
        `}
      </style>
      <polygon
        points="20,2 38,10 38,30 20,38 2,30 2,10"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeDasharray="120"
        style={{ animation: 'hexDraw 1.4s ease-in-out infinite' }}
      />
    </svg>
  );
};

export default SpinnerHex;
