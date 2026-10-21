'use client';

import React from 'react';

/**
 * Kindev Luxury Architectural Background
 * Crisp, battery-efficient, GPU-accelerated background with ambient depth,
 * subtle architectural topographic mesh, and warm volumetric light auras.
 */
export function InteractiveBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#fafcf9]"
    >
      {/* 1. Fine Architectural Grid (Blueprint Mesh) */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #092c18 1px, transparent 1px),
            linear-gradient(to bottom, #092c18 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* 2. Topographic & Surveying Reference Dots */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1.5px 1.5px, #22A33D 1.5px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* 3. Soft Ambient Floating Volumetric Light Auras (Zero CPU loops, GPU CSS) */}
      <div
        className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full bg-emerald-500/[0.08] blur-[120px] animate-float-slow"
        style={{ transform: 'translate3d(0, 0, 0)' }}
      />
      <div
        className="absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-[#F58220]/[0.06] blur-[140px] animate-float-slow"
        style={{ animationDelay: '-3.5s', transform: 'translate3d(0, 0, 0)' }}
      />
      <div
        className="absolute top-2/3 -left-32 w-[620px] h-[620px] rounded-full bg-emerald-600/[0.06] blur-[130px] animate-float-subtle"
        style={{ animationDelay: '-2s', transform: 'translate3d(0, 0, 0)' }}
      />
      <div
        className="absolute -bottom-40 right-1/4 w-[680px] h-[680px] rounded-full bg-teal-600/[0.05] blur-[140px] animate-float-slow"
        style={{ animationDelay: '-5s', transform: 'translate3d(0, 0, 0)' }}
      />

      {/* 4. Vignette sutil perimetral para enmarcar el lienzo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(9,44,24,0.03)_100%)] pointer-events-none" />
    </div>
  );
}
