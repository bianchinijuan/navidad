"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CombinationLockProps {
  onCorrect: () => void;
  onClose: () => void;
  correctCombination: (number | null)[];
}

export default function CombinationLock({ onCorrect, onClose, correctCombination }: CombinationLockProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '']);
  const [isShaking, setIsShaking] = useState(false);
  const [error, setError] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    // Focus first input on mount
    inputRefs[0].current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    // Only allow single digit numbers
    if (value && !/^\d$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    setError(false);

    // Auto-focus next input
    if (value && index < 2) {
      inputRefs[index + 1].current?.focus();
    }

    // Check if all digits are filled
    if (newDigits.every(d => d !== '') && index === 2) {
      checkCombination(newDigits);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs[index - 1].current?.focus();
    }
  };

  const checkCombination = (inputDigits: string[]) => {
    const inputNumbers = inputDigits.map(Number);
    const correct = correctCombination.every((num, i) => num === inputNumbers[i]);

    if (correct) {
      // Success!
      setTimeout(() => {
        onCorrect();
      }, 500);
    } else {
      // Wrong combination
      setError(true);
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        setDigits(['', '', '']);
        inputRefs[0].current?.focus();
      }, 600);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative bg-gradient-to-br from-red-900 via-red-800 to-amber-900 rounded-2xl p-8 border-4 border-amber-600"
        style={{
          maxWidth: '500px',
          width: '90vw',
          boxShadow: '0 0 60px rgba(217, 119, 6, 0.5)',
        }}
        initial={{ scale: 0.8, y: 50 }}
        animate={{
          scale: 1,
          y: 0,
          x: isShaking ? [0, -10, 10, -10, 10, 0] : 0,
        }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{
          scale: { duration: 0.3 },
          x: { duration: 0.6 },
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="text-6xl mb-4"
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            🎁
          </motion.div>
          <h2 className="text-4xl font-bold text-amber-100 mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            Combination Lock
          </h2>
          <p className="text-amber-200 text-sm">Enter the 3-digit combination</p>
        </div>

        {/* Combination inputs */}
        <div className="flex justify-center gap-4 mb-6">
          {digits.map((digit, index) => (
            <motion.input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-20 h-24 text-5xl font-bold text-center rounded-xl border-4 transition-all ${
                error
                  ? 'bg-red-900/50 border-red-500 text-red-200'
                  : digit
                  ? 'bg-amber-500/30 border-amber-400 text-amber-100'
                  : 'bg-gray-800/50 border-gray-600 text-gray-400'
              }`}
              style={{
                fontFamily: 'monospace',
              }}
              animate={{
                scale: digit ? 1.05 : 1,
              }}
            />
          ))}
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.p
              className="text-center text-red-400 text-sm mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              ❌ Wrong combination! Try again.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Hint */}
        <p className="text-center text-amber-300 text-xs mb-6 italic">
          Complete all rooms to find the numbers
        </p>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-amber-900/50 hover:bg-amber-900/70 text-amber-100 rounded-lg border border-amber-600/50 transition-colors"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}
