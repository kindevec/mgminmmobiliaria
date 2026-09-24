'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export function InteractiveBackground() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-slate-50"
    >
      {/* 1. Fine Architectural Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* 2. Topographic & Blueprint Contour Dots */}
      <div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1.5px 1.5px, rgba(16, 185, 129, 0.25) 1.5px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* 3. Ambient Breathing Gradient Orbs */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.12, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-300/25 via-teal-200/20 to-transparent blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 40, -30, 0],
          scale: [1, 0.92, 1.08, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute top-1/3 -right-48 w-[550px] h-[550px] rounded-full bg-gradient-to-bl from-amber-200/20 via-emerald-200/15 to-transparent blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -30, 40, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
        className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-100/30 via-slate-200/20 to-transparent blur-3xl"
      />

      {/* 4. Mouse Interactive Spotlight (Only active when cursor has moved on screen) */}
      {mousePos.x >= 0 && (
        <div
          className="absolute w-[450px] h-[450px] rounded-full bg-radial from-emerald-400/15 to-transparent blur-2xl transition-transform duration-100 ease-out hidden md:block"
          style={{
            transform: `translate3d(${mousePos.x - 225}px, ${mousePos.y - 225}px, 0)`,
          }}
        />
      )}
    </div>
  );
}
