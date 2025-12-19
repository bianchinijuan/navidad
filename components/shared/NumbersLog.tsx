"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export default function NumbersLog() {
  const [isExpanded, setIsExpanded] = useState(false);
  const revealedNumbers = useGameStore((state) => state.revealedNumbers);

  // Sort numbers in ascending order
  const sortedNumbers = [...revealedNumbers].sort((a, b) => a.number - b.number);

  if (revealedNumbers.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[100]">
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 border-2 border-amber-400/50 shadow-lg flex items-center justify-center hover:from-amber-500 hover:to-amber-700 transition-all"
        style={{
          boxShadow: '0 4px 15px rgba(217, 119, 6, 0.4)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Números revelados"
      >
        <span className="text-2xl">🔢</span>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="absolute bottom-16 left-0 bg-gradient-to-br from-amber-900/95 to-amber-950/95 backdrop-blur-md rounded-xl p-4 border-2 border-amber-400/50 shadow-2xl"
            style={{
              minWidth: '200px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
            }}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <h3
              className="text-center text-amber-100 font-bold mb-3 text-sm"
              style={{
                fontFamily: 'Georgia, serif',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              }}
            >
              Números Revelados
            </h3>

            <div className="space-y-2">
              {sortedNumbers.map((item, index) => (
                <motion.div
                  key={item.room}
                  className="flex items-center justify-between bg-amber-800/50 rounded-lg p-2 border border-amber-600/40"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <span
                    className="text-amber-200 text-xs capitalize"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {item.room}
                  </span>
                  <span
                    className="text-amber-100 font-bold text-lg"
                    style={{
                      fontFamily: 'monospace',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {item.number}
                  </span>
                </motion.div>
              ))}
            </div>

            <p
              className="text-center text-amber-300 text-xs mt-3"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Total: {revealedNumbers.length} número{revealedNumbers.length !== 1 ? 's' : ''}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
