'use client';

import React from 'react';
import { motion } from 'motion/react';

interface AnimatedInsigniaProps {
  className?: string;
  size?: number;
}

export function AnimatedInsignia({ className = '', size = 80 }: AnimatedInsigniaProps) {
  const height = (size * 90) / 80;

  return (
    <div className={`flex justify-center w-full select-none pointer-events-none ${className}`}>
      <motion.svg
        width={size}
        height={height}
        viewBox="0 0 80 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial="hidden"
        animate="visible"
        className="filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.65)]"
      >
        {/* Techo exterior - Naranja MGM (#F58220) */}
        <motion.path
          d="M10 52 L40 20 L70 52"
          stroke="#F58220"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 1.4, ease: 'easeInOut' },
            },
          }}
        />
        {/* Techo interior - Verde MGM (#22A33D) */}
        <motion.path
          d="M22 60 L40 40 L58 60"
          stroke="#22A33D"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 1.2, delay: 0.3, ease: 'easeInOut' },
            },
          }}
        />
        {/* Línea base - Naranja MGM (#F58220) */}
        <motion.path
          d="M16 72 L64 72"
          stroke="#F58220"
          strokeWidth="3"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { duration: 0.8, delay: 0.8, ease: 'easeOut' },
            },
          }}
        />
      </motion.svg>
    </div>
  );
}
