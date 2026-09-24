import React from 'react';

/**
 * Kindev Architectural Section Transitions
 * Subtle, luxury curves and topological linework that maintain visual continuity
 * without jarring or disruptive color cuts.
 */

interface WaveProps {
  className?: string;
  fillColor?: string;
  flip?: boolean;
}

// 1. Subtle Architectural Flow (Dark into Light)
export function WaveDarkToCream({ className = '', fillColor = '#FAF7F2' }: WaveProps) {
  return (
    <div className={`w-full overflow-hidden leading-none pointer-events-none -mb-0.5 ${className}`}>
      <svg
        viewBox="0 0 1440 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-8 sm:h-12 md:h-14 block"
      >
        <path
          d="M0,24 C360,52 1080,-8 1440,24 L1440,60 L0,60 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
}

// 2. Subtle Architectural Flow (Light into Dark)
export function WaveCreamToDark({ className = '', fillColor = '#080D18' }: WaveProps) {
  return (
    <div className={`w-full overflow-hidden leading-none pointer-events-none -mb-0.5 ${className}`}>
      <svg
        viewBox="0 0 1440 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-8 sm:h-12 md:h-14 block"
      >
        <path
          d="M0,36 C420,4 1020,56 1440,36 L1440,60 L0,60 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
}

// 3. Subtle Architectural Flow with Soft Gradient
export function WaveDarkToCreamSkyline({ className = '', fillColor = '#FAF7F2' }: WaveProps) {
  return <WaveDarkToCream className={className} fillColor={fillColor} />;
}

// 4. Subtle Architectural Flow with Soft Gradient
export function WaveCreamToDarkSkyline({ className = '', fillColor = '#070B14' }: WaveProps) {
  return <WaveCreamToDark className={className} fillColor={fillColor} />;
}

// 5. Topographic Blueprint Contour Grid
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
