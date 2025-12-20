"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { audioManager } from '@/lib/audioManager';
import NavigationArrow from '../shared/NavigationArrow';

export default function DoorRoom() {
  const { setScene, giftOpened, giftCombination, openGift } = useGameStore();
  const [showLock, setShowLock] = useState(false);
  const [combination, setCombination] = useState<number[]>([]);
  const [error, setError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    audioManager.play('hub-ambient');

    return () => {
      audioManager.stop('hub-ambient');
    };
  }, []);

  const handleBackToHub = () => {
    audioManager.stop('hub-ambient');
    audioManager.play('door-open');
    setScene('hub');
  };

  const handleDoorClick = () => {
    audioManager.play('click');

    if (giftOpened) {
      // Door is unlocked, can proceed to final scene
      audioManager.play('door-open');
      audioManager.stop('hub-ambient');
      setScene('final');
    } else {
      // Show lock interface
      setShowLock(true);
      setCombination([]);
      setError(false);
    }
  };

  const handleNumberClick = (num: number) => {
    if (combination.length < 4) {
      audioManager.play('mouse-click');
      const newCombination = [...combination, num];
      setCombination(newCombination);

      // Check if complete
      if (newCombination.length === 4) {
        // Check if correct
        const isCorrect = newCombination.every((n, i) => n === giftCombination[i]);

        if (isCorrect) {
          audioManager.play('success');
          openGift();
          setTimeout(() => {
            setShowLock(false);
            handleDoorClick(); // Open the door
          }, 1000);
        } else {
          audioManager.play('wrong');
          setError(true);
          setTimeout(() => {
            setCombination([]);
            setError(false);
          }, 1500);
        }
      }
    }
  };

  const handleCloseLock = () => {
    audioManager.play('click');
    setShowLock(false);
    setCombination([]);
    setError(false);
  };

  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #8B1538 0%, #A52A2A 25%, #C41E3A 50%, #A52A2A 75%, #8B1538 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
      }}
    >
      {/* Christmas snowflake pattern overlay */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' opacity='0.8'%3E%3Cpath d='M50 10 L50 90 M10 50 L90 50 M20 20 L80 80 M80 20 L20 80' stroke='%23ffffff' stroke-width='1.5' fill='none'/%3E%3Ccircle cx='50' cy='50' r='3' fill='%23ffffff'/%3E%3Ccircle cx='50' cy='20' r='2' fill='%23ffffff'/%3E%3Ccircle cx='50' cy='80' r='2' fill='%23ffffff'/%3E%3Ccircle cx='20' cy='50' r='2' fill='%23ffffff'/%3E%3Ccircle cx='80' cy='50' r='2' fill='%23ffffff'/%3E%3Cpath d='M30 30 L35 35 M70 30 L65 35 M30 70 L35 65 M70 70 L65 65' stroke='%23ffffff' stroke-width='1.5'/%3E%3C/g%3E%3Cg transform='translate(15,15)' fill='%23ffffff' opacity='0.4'%3E%3Cpath d='M0 0 L3 3 M0 3 L3 0' stroke='%23ffffff' stroke-width='1'/%3E%3C/g%3E%3Cg transform='translate(85,25)' fill='%23ffffff' opacity='0.5'%3E%3Ccircle cx='0' cy='0' r='1.5'/%3E%3C/g%3E%3Cg transform='translate(25,85)' fill='%23ffffff' opacity='0.6'%3E%3Ccircle cx='0' cy='0' r='2'/%3E%3C/g%3E%3Cg transform='translate(75,75)' fill='%23ffffff' opacity='0.4'%3E%3Cpath d='M0 -3 L0 3 M-3 0 L3 0' stroke='%23ffffff' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Container wrapper for frame and arrows */}
      <div className="relative flex items-center justify-center gap-20">
        {/* Left arrow - back to Hub */}
        <NavigationArrow
          direction="left"
          onClick={handleBackToHub}
          useAbsolutePosition={false}
        />

        {/* Frame container */}
        <motion.div
          className="relative"
          style={{
            width: '42vw',
            maxWidth: '630px',
            border: '20px solid #4A2511',
            borderRadius: '8px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.3)',
            background: 'linear-gradient(135deg, #5C3317 0%, #4A2511 100%)',
            padding: '8px',
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Door image */}
          <img
            src="/assets/exit/door.webp"
            alt={giftOpened ? "Puerta desbloqueada" : "Puerta bloqueada"}
            onLoad={() => setImageLoaded(true)}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              borderRadius: '4px',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
          />

          {/* Clickable door area */}
          <motion.div
            onClick={handleDoorClick}
            className="group"
            style={{
              position: 'absolute',
              left: '30%',
              top: '20%',
              width: '40%',
              height: '60%',
              cursor: 'pointer',
              borderRadius: '8px',
              backgroundColor: 'transparent',
            }}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
            title={giftOpened ? "Abrir puerta" : "Puerta bloqueada - necesitas la llave"}
          >
            {/* Tooltip - only show when locked */}
            {!giftOpened && (
              <motion.div
                className="absolute -top-20 left-1/2 -translate-x-1/2 px-6 py-3 bg-gradient-to-r from-red-700 to-red-900 text-white font-bold rounded-xl shadow-2xl border-2 border-red-300/50 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100"
                initial={{ y: 10 }}
                whileHover={{ y: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  boxShadow: '0 0 30px rgba(220, 38, 38, 0.6)',
                }}
              >
                <div className="text-center">
                  <div className="text-lg">🔒 Puerta bloqueada</div>
                  <div className="text-xs text-white/80 mt-1">Necesitas la llave del regalo</div>
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                  <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-red-900"></div>
                </div>
              </motion.div>
            )}

            {/* Tooltip - when unlocked */}
            {giftOpened && (
              <motion.div
                className="absolute -top-20 left-1/2 -translate-x-1/2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-2xl border-2 border-green-300/50 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100"
                initial={{ y: 10 }}
                whileHover={{ y: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  boxShadow: '0 0 30px rgba(34, 197, 94, 0.6)',
                }}
              >
                <div className="text-center">
                  <div className="text-lg">✨ Puerta desbloqueada</div>
                  <div className="text-xs text-white/80 mt-1">Click para abrir</div>
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                  <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-emerald-600"></div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Lock Interface Overlay */}
      <AnimatePresence>
        {showLock && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-gradient-to-br from-amber-900 to-red-900 rounded-3xl p-10 border-4 border-amber-500 max-w-2xl"
              style={{
                boxShadow: '0 0 80px rgba(251, 191, 36, 0.6)',
              }}
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", bounce: 0.3 }}
            >
              {/* Close button */}
              <button
                onClick={handleCloseLock}
                className="absolute top-4 right-4 text-amber-300 hover:text-white text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 transition-colors"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                ×
              </button>

              <div className="text-center">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{
                    rotate: error ? [0, -10, 10, -10, 10, 0] : 0,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  🔐
                </motion.div>

                <h2
                  className="text-3xl text-amber-300 mb-6"
                  style={{
                    textShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  Ingresa la Combinación
                </h2>

                {/* Combination Display - 4 slots */}
                <div className="flex gap-3 justify-center mb-8">
                  {[0, 1, 2, 3].map((index) => (
                    <motion.div
                      key={index}
                      className={`w-16 h-20 rounded-xl border-4 flex items-center justify-center ${
                        error
                          ? 'bg-red-900 border-red-500'
                          : combination[index] !== undefined
                          ? 'bg-amber-500 border-amber-300'
                          : 'bg-gray-800 border-gray-600'
                      }`}
                      style={{
                        boxShadow:
                          combination[index] !== undefined && !error
                            ? '0 0 20px rgba(251, 191, 36, 0.4)'
                            : 'none',
                      }}
                      animate={{
                        scale: error ? [1, 1.1, 1] : 1,
                      }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <div
                        className="text-4xl font-bold"
                        style={{
                          fontFamily: 'monospace',
                          color:
                            combination[index] !== undefined
                              ? error
                                ? '#fff'
                                : '#fff'
                              : '#666',
                        }}
                      >
                        {combination[index] !== undefined ? combination[index] : '?'}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Number Pad */}
                <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <motion.button
                      key={num}
                      onClick={() => handleNumberClick(num)}
                      className="w-20 h-20 bg-gradient-to-br from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 rounded-xl text-white text-3xl font-bold border-2 border-amber-400 transition-colors"
                      style={{
                        fontFamily: 'monospace',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                      }}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      disabled={combination.length >= 6}
                    >
                      {num}
                    </motion.button>
                  ))}
                  <div></div>
                  <motion.button
                    onClick={() => handleNumberClick(0)}
                    className="w-20 h-20 bg-gradient-to-br from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 rounded-xl text-white text-3xl font-bold border-2 border-amber-400 transition-colors"
                    style={{
                      fontFamily: 'monospace',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    disabled={combination.length >= 6}
                  >
                    0
                  </motion.button>
                  <motion.button
                    onClick={() => setCombination([])}
                    className="w-20 h-20 bg-gradient-to-br from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 rounded-xl text-white text-lg font-bold border-2 border-red-500 transition-colors"
                    style={{
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    ⌫
                  </motion.button>
                </div>

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      className="text-red-300 mt-6 text-lg font-semibold"
                      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      ❌ Combinación incorrecta
                    </motion.p>
                  )}
                </AnimatePresence>

                <p
                  className="text-amber-200 mt-6 text-sm italic"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Usa los números de los fragmentos de la foto
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
