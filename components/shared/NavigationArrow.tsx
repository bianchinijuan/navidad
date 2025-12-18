"use client";

import { motion } from 'framer-motion';
import { audioManager } from '@/lib/audioManager';

interface NavigationArrowProps {
  direction: 'left' | 'right' | 'up' | 'down';
  onClick: () => void;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'middle-left' | 'middle-right';
  label?: string;
  useAbsolutePosition?: boolean;
}

const arrowPaths = {
  left: "M15 5 L5 12 L15 19",
  right: "M5 5 L15 12 L5 19",
  up: "M5 15 L12 5 L19 15",
  down: "M5 5 L12 15 L19 5",
};

const positionClasses = {
  'top-left': 'top-8 left-8',
  'top-right': 'top-8 right-8',
  'bottom-left': 'bottom-8 left-8',
  'bottom-right': 'bottom-8 right-8',
  'middle-left': 'top-1/2 -translate-y-1/2 left-8',
  'middle-right': 'top-1/2 -translate-y-1/2 right-8',
};

/**
 * Cube Escape-style navigation arrow
 * Appears in corners of the screen for room navigation
 */
export default function NavigationArrow({
  direction,
  onClick,
  position = 'bottom-right',
  label,
  useAbsolutePosition = true,
}: NavigationArrowProps) {
  const handleClick = () => {
    audioManager.play('click');
    onClick();
  };

  const positionClass = useAbsolutePosition ? `absolute ${positionClasses[position]}` : '';

  return (
    <motion.button
      onClick={handleClick}
      className={`${positionClass} z-30 group`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
    >
      {/* Arrow background circle */}
      <div className="relative">
        <motion.div
          className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-800/90 to-amber-950/90 border-2 border-amber-600/50 shadow-xl backdrop-blur-sm flex items-center justify-center"
          whileHover={{ borderColor: 'rgba(217, 119, 6, 0.8)' }}
        >
          {/* Arrow icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-amber-200 group-hover:text-amber-100 transition-colors"
          >
            <motion.path
              d={arrowPaths[direction]}
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ x: direction === 'left' ? [-2, 0] : direction === 'right' ? [2, 0] : 0 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
            />
          </svg>
        </motion.div>

        {/* Label tooltip */}
        {label && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none"
            style={{
              left: direction === 'left' ? 'calc(100% + 12px)' : undefined,
              right: direction === 'right' ? 'calc(100% + 12px)' : undefined,
            }}
            initial={{ opacity: 0, x: direction === 'left' ? -10 : 10 }}
            whileHover={{ opacity: 1, x: 0 }}
          >
            <div className="bg-amber-900/95 border-2 border-amber-600/50 px-4 py-2 rounded-lg shadow-lg">
              <span className="text-amber-100 font-serif text-sm">{label}</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}
