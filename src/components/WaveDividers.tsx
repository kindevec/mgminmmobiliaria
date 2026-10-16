import React from 'react';

/**
 * Kindev Architectural Section Transitions
 * Subtle topological linework that maintains visual continuity.
 */

export function TopographicContours({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute inset-0 w-full h-full pointer-events-none opacity-[0.04] ${className}`}
    >
      <path
        d="M-50,200 C150,150 250,350 450,280 C650,210 750,420 900,380"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M-50,250 C160,200 270,400 470,330 C670,260 760,470 900,430"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M-50,300 C170,250 290,450 490,380 C690,310 770,520 900,480"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M-50,350 C180,300 310,500 510,430 C710,360 780,570 900,530"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <ellipse cx="620" cy="280" rx="180" ry="140" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="620" cy="280" rx="220" ry="170" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="620" cy="280" rx="260" ry="200" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
