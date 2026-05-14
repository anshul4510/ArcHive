import React, { useId } from 'react';
import { motion } from 'framer-motion';

const HexPattern = ({ dark = false }) => {
  const patternId = useId();
  const outlineOpacity = dark ? 0.08 : 0.05;
  const strokeColor = '#C8A96A';

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base Hexagon SVG Pattern */}
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width="55.42" /* 32 * sqrt(3) */
            height="96" /* 32 * 3 */
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M27.71 0 L55.42 16 L55.42 48 L27.71 64 L0 48 L0 16 Z 
                 M0 96 L27.71 80 L55.42 96"
              fill="none"
              stroke={strokeColor}
              strokeWidth="1"
              strokeOpacity={outlineOpacity}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      
      {/* Animated Gradient Overlay for Pulse Effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${strokeColor} 0%, transparent 60%)`,
          mixBlendMode: 'screen',
        }}
        animate={{
          opacity: [0.03, 0.10, 0.03],
          scale: [1, 1.2, 1],
          x: ['-10%', '10%', '-10%'],
          y: ['-10%', '10%', '-10%']
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default HexPattern;
