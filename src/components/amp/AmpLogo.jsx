import React from 'react';

export function AmpLogo({ className = "h-11", showTagline = true, light = true }) {
  const strokeColor = light ? "#F1F5F9" : "#0F172A";
  const taglineColor = light ? "#94A3B8" : "#64748B";

  return (
    <div className={`flex flex-col items-start select-none ${className}`}>
      <div className="flex items-center gap-2.5">
        
        {/* Official Wireframe Globe Icon */}
        <svg
          viewBox="0 0 100 100"
          className="w-9 h-9 shrink-0"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer circle */}
          <circle
            cx="50"
            cy="50"
            r="44"
            stroke={strokeColor}
            strokeWidth="5"
            className="transition-all"
          />
          
          {/* Horizontal equator */}
          <line
            x1="6"
            y1="50"
            x2="94"
            y2="50"
            stroke={strokeColor}
            strokeWidth="4"
          />
          
          {/* Upper latitude line */}
          <ellipse
            cx="50"
            cy="32"
            rx="39"
            ry="16"
            stroke={strokeColor}
            strokeWidth="3.5"
          />
          
          {/* Lower latitude line */}
          <ellipse
            cx="50"
            cy="68"
            rx="39"
            ry="16"
            stroke={strokeColor}
            strokeWidth="3.5"
          />
          
          {/* Center meridian */}
          <line
            x1="50"
            y1="6"
            x2="50"
            y2="94"
            stroke={strokeColor}
            strokeWidth="4"
          />
          
          {/* Left curved meridian */}
          <ellipse
            cx="50"
            cy="50"
            rx="24"
            ry="44"
            stroke={strokeColor}
            strokeWidth="3.5"
          />
        </svg>

        {/* Geometric AMP Linear Letters */}
        <svg
          viewBox="0 0 180 65"
          className="h-8 w-auto shrink-0"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* A */}
          <path
            d="M 12 56 L 32 10 L 52 56 M 19 40 L 45 40"
            stroke={strokeColor}
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* M */}
          <path
            d="M 64 56 L 64 10 L 92 48 L 120 10 L 120 56"
            stroke={strokeColor}
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* P */}
          <path
            d="M 132 56 L 132 10 L 158 10 C 172 10, 175 34, 158 34 L 132 34"
            stroke={strokeColor}
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Tagline */}
      {showTagline && (
        <span
          className="text-[8.5px] font-medium uppercase tracking-[0.24em] mt-0.5 ml-0.5"
          style={{ color: taglineColor }}
        >
          Ampliando sua Tecnologia
        </span>
      )}
    </div>
  );
}
