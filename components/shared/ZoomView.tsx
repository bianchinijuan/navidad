"use client";

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { audioManager } from '@/lib/audioManager';

interface ZoomViewProps {
  id: string;
  children: ReactNode;
  className?: string;
}

/**
 * ZoomView - A reusable component for zooming into objects in the game
 *
 * Usage:
 * <ZoomView id="unique-object-id">
 *   <div>Your zoomed-in content here</div>
 * </ZoomView>
 */
export default function ZoomView({ id, children, className = '' }: ZoomViewProps) {
  const zoomedObject = useGameStore((state) => state.zoomedObject);
  const zoomOut = useGameStore((state) => state.zoomOut);

  const isZoomed = zoomedObject === id;

  const handleClose = () => {
    audioManager.play('zoom-out');
    zoomOut();
  };

  return (
    <AnimatePresence>
      {isZoomed && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={handleClose}
          />

          {/* Zoomed content */}
          <motion.div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 ${className}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
          >
            <div className="relative max-w-4xl w-full max-h-full overflow-auto">
              {children}

              {/* Close button - Christmas themed */}
              <motion.button
                onClick={handleClose}
                className="absolute top-4 right-4 w-14 h-14 bg-gradient-to-br from-amber-800/90 to-amber-950/90 backdrop-blur-sm border-2 border-amber-600/50 rounded-full flex items-center justify-center text-amber-200 hover:bg-amber-700/90 hover:border-amber-500 transition-all game-element shadow-xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
