'use client';

import React from 'react';

/**
 * MGM Luxury Architectural Background
 * Global master layer providing the continuous, subtle olive topographic contour texture
 * across all public views wherever the background is white/light.
 */
interface InteractiveBackgroundProps {
  currentPage?: string;
}

export function InteractiveBackground({ currentPage }: InteractiveBackgroundProps = {}) {
  const isDimmed = currentPage === 'appraisals' || currentPage === 'contact';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#faf8f5]"
    >
      {/* 1. Textura Topográfica Olivo Claro Continua (Capa Maestra Global para Toda la Web) */}
      <div
        className={`absolute inset-0 select-none pointer-events-none transition-opacity duration-500 ease-out ${
          isDimmed ? 'opacity-50' : 'opacity-100'
        }`}
        style={{
          backgroundImage: "url('/topographic-olive-pattern.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* 2. Soft Ambient Floating Volumetric Light Auras (Zero CPU loops, GPU CSS) */}
      <div
        className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full bg-emerald-500/[0.04] blur-[120px] animate-float-slow"
        style={{ transform: 'translate3d(0, 0, 0)' }}
      />
      <div
        className="absolute top-1/4 -right-40 w-[600px] h-[600px] rounded-full bg-[#F58220]/[0.03] blur-[140px] animate-float-slow"
        style={{ animationDelay: '-3.5s', transform: 'translate3d(0, 0, 0)' }}
      />
      <div
        className="absolute top-2/3 -left-32 w-[620px] h-[620px] rounded-full bg-emerald-600/[0.04] blur-[130px] animate-float-subtle"
        style={{ animationDelay: '-2s', transform: 'translate3d(0, 0, 0)' }}
      />
      <div
        className="absolute -bottom-40 right-1/4 w-[680px] h-[680px] rounded-full bg-teal-600/[0.03] blur-[140px] animate-float-slow"
        style={{ animationDelay: '-5s', transform: 'translate3d(0, 0, 0)' }}
      />

      {/* 3. Vignette sutil perimetral para enmarcar el lienzo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_70%,rgba(9,44,24,0.02)_100%)] pointer-events-none" />
    </div>
  );
}
