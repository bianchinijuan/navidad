"use client";

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { audioManager } from '@/lib/audioManager';

interface InteractiveObjectProps {
  id: string;
  children: ReactNode;
  onClick?: () => void;
  zoomable?: boolean;
  className?: string;
  hoverScale?: number;
  disabled?: boolean;
}

/**
 * InteractiveObject - A clickable object in the game world
 *
 * Features:
 * - Hover feedback
 * - Click sound
 * - Optional zoom behavior
 * - Smooth animations
 */
export default function InteractiveObject({
  id,
  children,
  onClick,
  zoomable = false,
  className = '',
  hoverScale = 1.05,
  disabled = false,
}: InteractiveObjectProps) {
  const zoomIn = useGameStore((state) => state.zoomIn);

  const handleClick = () => {
    if (disabled) return;

    audioManager.play(zoomable ? 'zoom-in' : 'click');

    if (zoomable) {
      zoomIn(id);
    }

    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      className={`game-element cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      whileHover={!disabled ? { scale: hoverScale } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={handleClick}
      transition={{
        duration: 0.2,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
}
