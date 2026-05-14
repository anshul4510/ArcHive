import React, { useId } from 'react';

const HexBackground = ({ density = 10, opacity = 0.05, animated = true }) => {
  const patternId = useId();
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width="60"
            height="103.92"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M30 0L60 17.32V51.96L30 69.28L0 51.96V17.32L30 0ZM30 103.92L60 86.6V51.96L30 69.28L0 86.6V103.92Z"
              fill="none"
              stroke="var(--accent-gold)"
              strokeWidth="1"
              strokeOpacity={opacity}
              className={animated ? 'animate-hex-pulse' : ''}
              style={{ animationDelay: `${Math.random() * 2}s` }}
            />
            <path
              d="M60 51.96L90 34.64V0L60 17.32"
              fill="none"
              stroke="var(--accent-gold)"
              strokeWidth="1"
              strokeOpacity={opacity}
              className={animated ? 'animate-hex-pulse' : ''}
              style={{ animationDelay: `${Math.random() * 2}s` }}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
};

export default HexBackground;
