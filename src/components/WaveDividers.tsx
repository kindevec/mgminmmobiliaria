import React from 'react';

/**
 * Organic Wave Dividers matching the undulating architectural aesthetic
 * Inspired by luxury Dubai / international real estate reference layouts.
 */

interface WaveProps {
  className?: string;
  fillColor?: string;
  flip?: boolean;
}

// 1. Wave Dark to Light (Flows from dark hero/stats into cream/sand section)
export function WaveDarkToCream({ className = '', fillColor = '#FAF7F2' }: WaveProps) {
  return (
    <div className={`w-full overflow-hidden leading-none pointer-events-none -mb-1 ${className}`}>
      <svg
        viewBox="0 0 1440 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-14 sm:h-24 md:h-32 block"
      >
        <path
          d="M0,45 C280,125 520,10 840,75 C1120,135 1320,25 1440,55 L1440,140 L0,140 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
}

// 2. Wave Cream to Dark (Flows from cream/sand section into midnight dark catalog)
export function WaveCreamToDark({ className = '', fillColor = '#080D18' }: WaveProps) {
  return (
    <div className={`w-full overflow-hidden leading-none pointer-events-none -mb-1 ${className}`}>
      <svg
        viewBox="0 0 1440 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-14 sm:h-24 md:h-32 block"
      >
        <path
          d="M0,95 C320,15 640,125 960,45 C1200,-15 1350,65 1440,30 L1440,140 L0,140 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
}

// 3. Wave Dark to Cream Alt (Flows from dark catalog back to cream section with subtle skyline)
export function WaveDarkToCreamSkyline({ className = '', fillColor = '#FAF7F2' }: WaveProps) {
  return (
    <div className={`w-full overflow-hidden leading-none pointer-events-none -mb-1 ${className}`}>
      <svg
        viewBox="0 0 1440 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-14 sm:h-24 md:h-32 block"
      >
        <path
          d="M0,40 C320,115 580,20 900,80 C1180,135 1360,35 1440,65 L1440,140 L0,140 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
}

// 4. Wave Cream to Dark with Skyline Silhouette (matching the reference image's city/masterplan silhouette)
export function WaveCreamToDarkSkyline({ className = '', fillColor = '#070B14' }: WaveProps) {
  return (
    <div className={`w-full overflow-hidden leading-none pointer-events-none -mb-1 relative ${className}`}>
      {/* Delicate City Silhouette along the transition line */}
      <svg
        viewBox="0 0 1440 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-12 sm:h-18 absolute bottom-12 sm:bottom-20 left-0 right-0 opacity-15 text-slate-800 pointer-events-none"
      >
        <path
          d="M100,80 L100,50 L120,50 L120,40 L130,40 L130,80 L180,80 L180,30 L195,30 L195,20 L200,10 L205,20 L205,30 L220,30 L220,80 L290,80 L290,55 L310,55 L310,80 L380,80 L380,35 L395,35 L400,25 L405,35 L420,35 L420,80 L520,80 L520,45 L540,45 L540,80 L620,80 L620,25 L635,25 L640,15 L645,25 L660,25 L660,80 L760,80 L760,60 L780,60 L780,80 L880,80 L880,30 L900,30 L900,80 L980,80 L980,48 L1000,48 L1000,80 L1100,80 L1100,20 L1115,20 L1120,5 L1125,20 L1140,20 L1140,80 L1240,80 L1240,50 L1260,50 L1260,80 L1350,80 L1350,40 L1370,40 L1370,80 Z"
          fill="currentColor"
        />
      </svg>

      <svg
        viewBox="0 0 1440 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-14 sm:h-24 md:h-32 block relative z-10"
      >
        <path
          d="M0,90 C340,20 660,130 980,50 C1220,-10 1370,70 1440,35 L1440,140 L0,140 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
}

// 5. Topographic Contour Line background for organic architectural sections
export function TopographicContours({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute inset-0 w-full h-full pointer-events-none opacity-[0.07] ${className}`}
    >
      <path
        d="M-50,200 C150,150 250,350 450,280 C650,210 750,420 900,380"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M-50,250 C160,200 270,400 470,330 C670,260 760,470 900,430"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M-50,300 C170,250 290,450 490,380 C690,310 770,520 900,480"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M-50,350 C180,300 310,500 510,430 C710,360 780,570 900,530"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M-50,400 C190,350 330,550 530,480 C730,410 790,620 900,580"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {/* Concentric ripples around organic pebble */}
      <ellipse cx="620" cy="280" rx="180" ry="140" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="620" cy="280" rx="220" ry="170" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="620" cy="280" rx="260" ry="200" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="620" cy="280" rx="300" ry="230" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
