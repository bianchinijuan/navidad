"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '@/lib/audioManager';

interface ZodiacElementGameProps {
  onComplete: () => void;
  onClose: () => void;
}

interface ZodiacSign {
  name: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  emoji: string;
}

const ZODIAC_SIGNS: ZodiacSign[] = [
  // Fuego
  { name: "Aries", symbol: "♈", element: "fire", emoji: "🔥" },
  { name: "Leo", symbol: "♌", element: "fire", emoji: "🦁" },
  { name: "Sagitario", symbol: "♐", element: "fire", emoji: "🏹" },
  // Tierra
  { name: "Tauro", symbol: "♉", element: "earth", emoji: "🐂" },
  { name: "Virgo", symbol: "♍", element: "earth", emoji: "👧" },
  { name: "Capricornio", symbol: "♑", element: "earth", emoji: "🐐" },
  // Aire
  { name: "Géminis", symbol: "♊", element: "air", emoji: "👯" },
  { name: "Libra", symbol: "♎", element: "air", emoji: "⚖️" },
  { name: "Acuario", symbol: "♒", element: "air", emoji: "🏺" },
  // Agua
  { name: "Cáncer", symbol: "♋", element: "water", emoji: "🦀" },
  { name: "Escorpio", symbol: "♏", element: "water", emoji: "🦂" },
  { name: "Piscis", symbol: "♓", element: "water", emoji: "🐟" },
];

const ELEMENTS = [
  { id: 'fire', name: 'Fuego', color: '#EF4444', emoji: '🔥', gradient: 'from-red-600 via-orange-600 to-red-700', border: 'border-orange-400/40', glow: '0 0 20px rgba(239, 68, 68, 0.5)' },
  { id: 'earth', name: 'Tierra', color: '#D97706', emoji: '🌍', gradient: 'from-amber-700 via-yellow-600 to-amber-800', border: 'border-amber-400/40', glow: '0 0 20px rgba(217, 119, 6, 0.5)' },
  { id: 'air', name: 'Aire', color: '#06B6D4', emoji: '💨', gradient: 'from-cyan-500 via-blue-500 to-cyan-600', border: 'border-cyan-300/40', glow: '0 0 20px rgba(6, 182, 212, 0.5)' },
  { id: 'water', name: 'Agua', color: '#3B82F6', emoji: '💧', gradient: 'from-blue-600 via-indigo-600 to-blue-700', border: 'border-blue-400/40', glow: '0 0 20px rgba(59, 130, 246, 0.5)' },
];

export default function ZodiacElementGame({ onComplete, onClose }: ZodiacElementGameProps) {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const [placedSigns, setPlacedSigns] = useState<{ [key: string]: ZodiacSign[] }>({
    fire: [],
    earth: [],
    air: [],
    water: [],
  });
  const [showInstructions, setShowInstructions] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [shakingElement, setShakingElement] = useState<string | null>(null);

  // Shuffle signs for display
  const [shuffledSigns] = useState(() => {
    return [...ZODIAC_SIGNS].sort(() => Math.random() - 0.5);
  });

  // Music management
  useEffect(() => {
    if (!showInstructions) {
      // Game is active - play zodiac music
      audioManager.pause('christmas-music');
      audioManager.play('zodiac-music', true);

      // Cleanup only when game is actually active
      return () => {
        audioManager.stop('zodiac-music', true);
        audioManager.resume('christmas-music');
      };
    } else {
      // Game is not active - ensure zodiac music is stopped
      audioManager.stop('zodiac-music', true);
      audioManager.resume('christmas-music');
    }
  }, [showInstructions]);

  const handleSignClick = (sign: ZodiacSign) => {
    // Check if already placed
    const isPlaced = Object.values(placedSigns).some(arr =>
      arr.some(s => s.name === sign.name)
    );
    if (isPlaced) return;

    audioManager.play('click');
    setSelectedSign(sign);
  };

  const handleElementClick = (elementId: string) => {
    if (!selectedSign) return;

    // Check if correct element
    if (selectedSign.element === elementId) {
      audioManager.play('success');
      setPlacedSigns(prev => ({
        ...prev,
        [elementId]: [...prev[elementId], selectedSign],
      }));
      setSelectedSign(null);

      // Check if all signs are placed correctly
      const totalPlaced = Object.values({
        ...placedSigns,
        [elementId]: [...placedSigns[elementId], selectedSign],
      }).reduce((sum, arr) => sum + arr.length, 0);

      if (totalPlaced === ZODIAC_SIGNS.length) {
        setTimeout(() => {
          setShowSuccess(true);
          audioManager.play('success');
        }, 500);

        setTimeout(() => {
          onComplete();
        }, 2500);
      }
    } else {
      audioManager.play('wrong');
      setShakingElement(elementId);
      setTimeout(() => {
        setShakingElement(null);
        setSelectedSign(null);
      }, 500);
    }
  };

  const handleStartGame = () => {
    audioManager.play('click');
    setShowInstructions(false);
  };

  if (showInstructions) {
    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={handleStartGame}
      >
        <motion.div
          className="relative max-w-full max-h-full"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src="/assets/instructions/zodiac-game.png"
            alt="Instrucciones del juego de signos zodiacales"
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
            style={{
              boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)',
            }}
          />
          <button
            onClick={handleStartGame}
            className="absolute top-2 right-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white shadow-lg"
          >
            ✕
          </button>
          <p className="text-center text-indigo-200 mt-3 text-sm">
            Click para comenzar
          </p>
        </motion.div>
      </motion.div>
    );
  }

  const availableSigns = shuffledSigns.filter(sign =>
    !Object.values(placedSigns).some(arr => arr.some(s => s.name === sign.name))
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="relative w-full max-w-4xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-2 right-0 text-indigo-300/60 hover:text-indigo-200 text-2xl w-9 h-9 flex items-center justify-center rounded-lg hover:bg-indigo-900/30 transition-all z-10"
          style={{ fontFamily: 'system-ui' }}
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-xl font-normal text-center text-indigo-200 mb-3 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
          Elementos del Zodíaco
        </h2>

        {/* Progress */}
        <div className="text-center mb-4">
          <p className="text-slate-400 text-xs" style={{ fontFamily: 'Georgia, serif' }}>
            {Object.values(placedSigns).reduce((sum, arr) => sum + arr.length, 0)} / {ZODIAC_SIGNS.length} colocados
          </p>
        </div>

        {/* Elements - Horizontal row */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {ELEMENTS.map((element) => {
            const isShaking = shakingElement === element.id;
            const placedInElement = placedSigns[element.id];

            return (
              <motion.div
                key={element.id}
                onClick={() => handleElementClick(element.id)}
                className={`relative p-4 rounded-xl border-2 cursor-pointer bg-gradient-to-br ${element.gradient} ${element.border} shadow-lg`}
                style={{
                  boxShadow: element.glow,
                  fontFamily: 'Georgia, serif',
                }}
                animate={isShaking ? {
                  x: [-5, 5, -5, 5, 0],
                } : {}}
                transition={{ duration: 0.5 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: `0 0 30px ${element.color}80`,
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Element header */}
                <div className="text-center mb-2">
                  <motion.div
                    className="text-2xl mb-1"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  >
                    {element.emoji}
                  </motion.div>
                  <div className="text-white font-semibold text-sm tracking-wide drop-shadow-lg">{element.name}</div>
                  <div className="text-white/70 text-xs mt-1">{placedInElement.length}/3</div>
                </div>

                {/* Placed signs */}
                <div className="flex flex-col gap-1 min-h-[60px]">
                  {placedInElement.map((sign) => (
                    <motion.div
                      key={sign.name}
                      className="bg-black/40 backdrop-blur-sm px-2 py-1.5 rounded-lg text-center border border-white/20 shadow-md"
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                    >
                      <span className="text-white text-sm font-semibold">{sign.symbol}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Available signs - Compact grid */}
        <div className="bg-gradient-to-br from-slate-900/80 to-indigo-950/80 backdrop-blur-md rounded-xl p-4 border border-indigo-400/30 shadow-xl" style={{ boxShadow: '0 0 30px rgba(99, 102, 241, 0.2)' }}>
          <h3 className="text-sm text-indigo-200 mb-3 text-center tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>Signos disponibles</h3>
          <div className="grid grid-cols-6 gap-2">
            {availableSigns.map((sign) => {
              const isSelected = selectedSign?.name === sign.name;

              return (
                <motion.div
                  key={sign.name}
                  onClick={() => handleSignClick(sign)}
                  className={`p-2.5 rounded-lg border-2 transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'bg-gradient-to-br from-yellow-500 to-amber-600 border-yellow-400'
                      : 'bg-slate-800/60 border-slate-600/50 hover:border-indigo-500 hover:bg-slate-700/70'
                  }`}
                  style={{
                    boxShadow: isSelected ? '0 0 20px rgba(251, 191, 36, 0.6)' : '0 2px 4px rgba(0,0,0,0.3)',
                    fontFamily: 'Georgia, serif',
                  }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  animate={isSelected ? {
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{ duration: 1, repeat: isSelected ? Infinity : 0 }}
                >
                  <div className="text-2xl mb-1">{sign.symbol}</div>
                  <div className="text-white text-[10px] tracking-wide font-medium">{sign.name}</div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Success overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-600 rounded-3xl p-12 border-2 border-indigo-300 text-center"
                style={{
                  boxShadow: '0 0 80px rgba(99, 102, 241, 0.8)',
                  fontFamily: 'Georgia, serif',
                }}
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.4 }}
              >
                <motion.div
                  className="text-8xl mb-6"
                  style={{ filter: 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.8))' }}
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    rotate: { duration: 2 },
                    scale: { duration: 1, repeat: 2 },
                  }}
                >
                  ✨
                </motion.div>
                <h3 className="text-5xl font-bold text-white mb-4" style={{ textShadow: '0 0 20px rgba(0, 0, 0, 0.5)' }}>¡Perfecto!</h3>
                <p className="text-indigo-100 text-xl">Todos los signos alineados con sus elementos</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
