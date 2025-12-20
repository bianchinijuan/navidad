"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '@/lib/audioManager';

export default function VolumeControl() {
  const [isMuted, setIsMuted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    if (newMutedState) {
      // Mute all music
      audioManager.setMusicVolume(0);
    } else {
      // Restore music volume to 15%
      audioManager.setMusicVolume(0.15);
    }
  };

  return (
    <div
      className="fixed top-4 right-4 z-[100]"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <motion.button
        onClick={toggleMute}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 border-2 border-red-400/50 shadow-lg flex items-center justify-center hover:from-red-500 hover:to-red-700 transition-all"
        style={{
          boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <span className="text-2xl">
          {isMuted ? '🔇' : '🔊'}
        </span>
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="absolute top-full right-0 mt-2 px-3 py-2 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          >
            {isMuted ? 'Activar música' : 'Silenciar música'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
