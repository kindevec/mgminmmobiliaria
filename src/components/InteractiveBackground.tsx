'use client';

import React from 'react';

/**
 * Kindev Luxury Architectural Background
 * Crisp, battery-efficient, zero-loop background with subtle blueprint grid and ambient depth.
 */
export function InteractiveBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-slate-50"
    >
      {/* 1. Fine Architectural Grid (Subtle Blueprint Mesh) */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0f172a 1px, transparent 1px),
            linear-gradient(to bottom, #0f172a 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* 2. Topographic & Surveying Reference Dots */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1.5px 1.5px, #16a34a 1.5px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* 3. Static Soft Lighting Gradients (No CPU/GPU loops) */}
      <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-emerald-500/[0.04] blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-amber-500/[0.03] blur-3xl" />
      <div className="absolute -bottom-32 left-1/3 w-[550px] h-[550px] rounded-full bg-teal-500/[0.03] blur-3xl" />
    </div>
  );
}
