"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface SceneTransitionProps {
  children: ReactNode;
  sceneKey: string;
  transitionType?: 'fade' | 'zoom' | 'slide';
  duration?: number;
}

const transitionVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  zoom: {
    initial: { opacity: 0, scale: 1.2 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  slide: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  },
};

export default function SceneTransition({
  children,
  sceneKey,
  transitionType = 'fade',
  duration = 0.8,
}: SceneTransitionProps) {
  const variants = transitionVariants[transitionType];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={sceneKey}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={{
          duration,
          ease: [0.43, 0.13, 0.23, 0.96], // Custom easing for smooth feel
        }}
        className="absolute inset-0 w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
