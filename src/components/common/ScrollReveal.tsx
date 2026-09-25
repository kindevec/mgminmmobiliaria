'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'zoom' | 'fade';

interface ScrollRevealProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'whileInView' | 'transition'> {
  children: React.ReactNode;
  direction?: RevealDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

const getDirectionalTransform = (direction: RevealDirection, distance: number) => {
  switch (direction) {
    case 'up':
      return { y: distance, x: 0, scale: 1 };
    case 'down':
      return { y: -distance, x: 0, scale: 1 };
    case 'left':
      return { x: -distance, y: 0, scale: 1 };
    case 'right':
      return { x: distance, y: 0, scale: 1 };
    case 'zoom':
      return { x: 0, y: 0, scale: 0.92 };
    case 'fade':
    default:
      return { x: 0, y: 0, scale: 1 };
  }
};

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.65,
  distance = 36,
  className = '',
  once = true,
  threshold = 0.1,
  style,
  ...rest
}) => {
  const initialOffset = getDirectionalTransform(direction, distance);

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...initialOffset,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once,
        amount: threshold,
        margin: '0px 0px -50px 0px',
      }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // Kindev ultra-smooth custom cubic bezier
      }}
      style={{
        willChange: 'transform, opacity',
        ...style,
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
