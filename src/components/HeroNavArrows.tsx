'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroNavArrowsProps {
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

export function HeroNavArrows({ onPrev, onNext, className = '' }: HeroNavArrowsProps) {
  return (
    <>
      {/* Botón Flecha Izquierda */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Ver imagen anterior"
        className={`absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 group/nav cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5be196] rounded-full transition-transform ${className}`}
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white/10 sm:bg-black/30 text-white/70 border border-white/20 backdrop-blur-md shadow-lg opacity-40 sm:opacity-35 group-hover/hero:opacity-60 transition-all duration-300 ease-out group-hover/nav:!opacity-100 group-hover/nav:scale-110 group-hover/nav:bg-black/75 group-hover/nav:text-white group-hover/nav:border-white/70 group-hover/nav:shadow-[0_4px_25px_rgba(0,0,0,0.6),0_0_15px_rgba(91,225,150,0.3)] active:scale-95">
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover/nav:-translate-x-0.5" />
        </div>
      </button>

      {/* Botón Flecha Derecha */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Ver siguiente imagen"
        className={`absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 p-2 sm:p-3 group/nav cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5be196] rounded-full transition-transform ${className}`}
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white/10 sm:bg-black/30 text-white/70 border border-white/20 backdrop-blur-md shadow-lg opacity-40 sm:opacity-35 group-hover/hero:opacity-60 transition-all duration-300 ease-out group-hover/nav:!opacity-100 group-hover/nav:scale-110 group-hover/nav:bg-black/75 group-hover/nav:text-white group-hover/nav:border-white/70 group-hover/nav:shadow-[0_4px_25px_rgba(0,0,0,0.6),0_0_15px_rgba(91,225,150,0.3)] active:scale-95">
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover/nav:translate-x-0.5" />
        </div>
      </button>
    </>
  );
}
