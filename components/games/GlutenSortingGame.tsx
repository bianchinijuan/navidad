"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '@/lib/audioManager';

interface Ingredient {
  id: string;
  name: string;
  emoji: string;
  isNeeded: boolean; // true if needed for pan dulce
}

const INGREDIENTS: Ingredient[] = [
  // NEEDED for pan dulce SIN TACC
  { id: '1', name: 'Harina sin TACC', emoji: '✨', isNeeded: true },
  { id: '2', name: 'Huevos', emoji: '🥚', isNeeded: true },
  { id: '3', name: 'Leche', emoji: '🥛', isNeeded: true },
  { id: '4', name: 'Manteca', emoji: '🧈', isNeeded: true },
  { id: '5', name: 'Frutas secas', emoji: '🍇', isNeeded: true },
  { id: '6', name: 'Azúcar', emoji: '🍬', isNeeded: true },

  // NOT NEEDED for pan dulce (contienen gluten o no son necesarios)
  { id: '7', name: 'Arroz', emoji: '🍚', isNeeded: false },
  { id: '8', name: 'Papa', emoji: '🥔', isNeeded: false },
  { id: '9', name: 'Maíz', emoji: '🌽', isNeeded: false },
  { id: '10', name: 'Carne', emoji: '🥩', isNeeded: false },
  { id: '11', name: 'Pescado', emoji: '🐟', isNeeded: false },
  { id: '12', name: 'Pollo', emoji: '🍗', isNeeded: false },
  { id: '13', name: 'Queso', emoji: '🧀', isNeeded: false },
  { id: '14', name: 'Harina común', emoji: '🌾', isNeeded: false }, // ¡PELIGRO! Tiene gluten
  { id: '15', name: 'Pan', emoji: '🍞', isNeeded: false },
  { id: '16', name: 'Pasta', emoji: '🍝', isNeeded: false },
  { id: '17', name: 'Pizza', emoji: '🍕', isNeeded: false },
];

interface FallingIngredient extends Ingredient {
  instanceId: string;
  startX: number;
  showWrongMark?: boolean;
}

interface GlutenSortingGameProps {
  onComplete: () => void;
  onClose: () => void;
}

export default function GlutenSortingGame({ onComplete, onClose }: GlutenSortingGameProps) {
  const [fallingIngredients, setFallingIngredients] = useState<FallingIngredient[]>([]);
  const [collected, setCollected] = useState(0); // Correct ingredients collected
  const [errors, setErrors] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [spawnInterval, setSpawnInterval] = useState(1000); // Reduced from 2000 to spawn more frequently
  const processedIdsRef = useRef<Set<string>>(new Set()); // Track clicked/processed ingredients
  const [showInstructions, setShowInstructions] = useState(true);

  const INGREDIENTS_NEEDED = 6; // Total ingredients needed for pan dulce
  const MAX_ERRORS = 3;

  // Music management
  useEffect(() => {
    if (!showInstructions) {
      // Game is active - play kitchen music
      audioManager.pause('christmas-music');
      audioManager.play('kitchen-music', true);

      // Cleanup only when game is actually active
      return () => {
        audioManager.stop('kitchen-music', true);
        audioManager.resume('christmas-music');
      };
    } else {
      // Game is not active - ensure kitchen music is stopped
      audioManager.stop('kitchen-music', true);
      audioManager.resume('christmas-music');
    }
  }, [showInstructions]);

  // Spawn ingredients
  useEffect(() => {
    if (gameOver || collected >= INGREDIENTS_NEEDED) return;

    const interval = setInterval(() => {
      const randomIngredient = INGREDIENTS[Math.floor(Math.random() * INGREDIENTS.length)];
      const startX = Math.random() * 70 + 15; // 15-85% from left

      setFallingIngredients(prev => [
        ...prev,
        {
          ...randomIngredient,
          instanceId: `${randomIngredient.id}-${Date.now()}`,
          startX,
        },
      ]);

      // Increase difficulty - spawn even faster
      if (collected > 2) {
        setSpawnInterval(prev => Math.max(600, prev - 80));
      }
    }, spawnInterval);

    return () => clearInterval(interval);
  }, [gameOver, collected, spawnInterval]);

  const handleIngredientClick = useCallback((ingredient: FallingIngredient) => {
    // Mark as processed to prevent onAnimationComplete from triggering
    processedIdsRef.current.add(ingredient.instanceId);

    // Check if this ingredient is needed for pan dulce
    if (ingredient.isNeeded) {
      // CORRECT! This ingredient is needed
      audioManager.play('correct');
      setCollected(prev => prev + 1);
      // Remove from falling immediately
      setFallingIngredients(prev => prev.filter(i => i.instanceId !== ingredient.instanceId));
    } else {
      // WRONG! This ingredient is NOT needed - show X mark first
      audioManager.play('wrong');

      // Show wrong mark on ingredient
      setFallingIngredients(prev =>
        prev.map(i => i.instanceId === ingredient.instanceId
          ? { ...i, showWrongMark: true }
          : i
        )
      );

      // Remove after showing X
      setTimeout(() => {
        setFallingIngredients(prev => prev.filter(i => i.instanceId !== ingredient.instanceId));
      }, 500);

      setErrors(prev => {
        const newErrors = prev + 1;
        if (newErrors >= MAX_ERRORS) {
          setGameOver(true);
        }
        return newErrors;
      });
    }
  }, []);

  const handleIngredientMissed = useCallback((ingredient: FallingIngredient) => {
    // Check if this ingredient was already clicked/processed
    if (processedIdsRef.current.has(ingredient.instanceId)) {
      // Already processed by click, ignore this animation complete
      return;
    }

    // Mark as processed
    processedIdsRef.current.add(ingredient.instanceId);

    // Remove ingredient from screen
    setFallingIngredients(prev => prev.filter(i => i.instanceId !== ingredient.instanceId));

    // ONLY count as error if the missed ingredient was NEEDED for pan dulce
    if (ingredient.isNeeded) {
      audioManager.play('wrong');
      setErrors(prev => {
        const newErrors = prev + 1;
        if (newErrors >= MAX_ERRORS) {
          setGameOver(true);
        }
        return newErrors;
      });
    }
    // If it wasn't needed, letting it fall is CORRECT - do nothing
  }, []);

  useEffect(() => {
    if (collected >= INGREDIENTS_NEEDED) {
      audioManager.play('success');
      // Clear falling ingredients when game is won
      setFallingIngredients([]);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  }, [collected, onComplete]);

  // Clear falling ingredients when game over
  useEffect(() => {
    if (gameOver) {
      setFallingIngredients([]);
    }
  }, [gameOver]);

  const handleRestart = () => {
    setFallingIngredients([]);
    setCollected(0);
    setErrors(0);
    setGameOver(false);
    setSpawnInterval(1000);
    processedIdsRef.current.clear(); // Clear processed IDs
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Game container */}
      <div className="relative w-full h-full max-w-4xl mx-auto">
        {/* Compact Header */}
        <div className="absolute top-4 left-0 right-0 px-6 z-20">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Stats */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(180, 83, 9, 0.98) 0%, rgba(146, 64, 14, 0.98) 100%)',
                  backdropFilter: 'blur(8px)',
                  border: '2px solid rgba(251, 191, 36, 0.6)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                }}
              >
                <span style={{
                  color: '#fef3c7',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontSize: '14px',
                  fontWeight: '700',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                }}>
                  🍞 {collected}/{INGREDIENTS_NEEDED}
                </span>
              </div>

              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(153, 27, 27, 0.98) 0%, rgba(127, 29, 29, 0.98) 100%)',
                  backdropFilter: 'blur(8px)',
                  border: '2px solid rgba(239, 68, 68, 0.6)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                }}
              >
                <span style={{
                  color: '#fecaca',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontSize: '14px',
                  fontWeight: '700',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                }}>
                  ❌ {errors}/{MAX_ERRORS}
                </span>
              </div>
            </motion.div>

            {/* Center: Instructions */}
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{
                background: 'linear-gradient(135deg, rgba(146, 64, 14, 0.98) 0%, rgba(120, 53, 15, 0.98) 100%)',
                backdropFilter: 'blur(8px)',
                border: '2px solid rgba(251, 191, 36, 0.6)',
                borderRadius: '10px',
                padding: '8px 20px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
            >
              <p style={{
                color: '#fef3c7',
                fontFamily: 'Georgia, serif',
                fontSize: '13px',
                fontWeight: '600',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)',
                margin: 0,
                whiteSpace: 'nowrap',
              }}>
                ✨ Clickea solo los ingredientes necesarios ✨
              </p>
            </motion.div>

            {/* Right: Controls */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.button
                onClick={() => setShowInstructions(true)}
                style={{
                  background: 'linear-gradient(135deg, rgba(180, 83, 9, 0.98) 0%, rgba(120, 53, 15, 0.98) 100%)',
                  backdropFilter: 'blur(8px)',
                  border: '2px solid rgba(251, 191, 36, 0.6)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  color: '#fef3c7',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  cursor: 'pointer',
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 6px 16px rgba(217, 119, 6, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                title="Ver instrucciones"
              >
                ❓
              </motion.button>

              <motion.button
                onClick={onClose}
                style={{
                  background: 'linear-gradient(135deg, rgba(55, 65, 81, 0.98) 0%, rgba(31, 41, 55, 0.98) 100%)',
                  backdropFilter: 'blur(8px)',
                  border: '2px solid rgba(156, 163, 175, 0.6)',
                  borderRadius: '10px',
                  padding: '8px 16px',
                  color: '#f3f4f6',
                  fontWeight: '600',
                  fontSize: '13px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                  cursor: 'pointer',
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 6px 16px rgba(0, 0, 0, 0.6)' }}
                whileTap={{ scale: 0.95 }}
              >
                ✕ Cerrar
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Falling area */}
        <div className="absolute inset-0 top-20 bottom-8 overflow-hidden">
          <AnimatePresence>
            {fallingIngredients.map((ingredient) => (
              <motion.div
                key={ingredient.instanceId}
                className="absolute flex flex-col items-center gap-2 cursor-pointer select-none"
                style={{
                  left: `${ingredient.startX}%`,
                  top: -100,
                }}
                initial={{ y: -100 }}
                animate={{ y: window.innerHeight }}
                exit={{
                  opacity: 0,
                  scale: 0,
                  rotate: 360,
                  transition: { duration: 0.4, ease: 'easeOut' }
                }}
                transition={{
                  duration: 4.5,
                  ease: 'linear',
                }}
                onAnimationComplete={() => handleIngredientMissed(ingredient)}
                onClick={() => handleIngredientClick(ingredient)}
              >
                {/* Emoji */}
                <motion.div
                  className="text-7xl relative"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.5))',
                  }}
                >
                  {ingredient.emoji}

                  {/* Wrong mark overlay */}
                  <AnimatePresence>
                    {ingredient.showWrongMark && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1.3, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 0.3, type: "spring" }}
                        style={{
                          textShadow: '0 0 10px rgba(220, 38, 38, 0.8), 0 0 20px rgba(220, 38, 38, 0.6)',
                        }}
                      >
                        <span className="text-8xl">❌</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Name label */}
                <motion.div
                  className="bg-black/90 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-amber-400/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-amber-100 text-sm font-bold tracking-wide">{ingredient.name}</span>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Instructions overlay */}
        <AnimatePresence>
          {showInstructions && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/90 z-30 p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInstructions(false)}
            >
              <motion.div
                className="relative max-w-full max-h-full"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src="/assets/instructions/pan-dulce-game.jpg"
                  alt="Instrucciones del juego de pan dulce"
                  className="max-w-full max-h-[85vh] object-contain rounded-lg"
                  style={{
                    boxShadow: '0 0 40px rgba(217, 119, 6, 0.6)',
                  }}
                />
                <button
                  onClick={() => setShowInstructions(false)}
                  className="absolute top-2 right-2 bg-amber-700 hover:bg-amber-600 text-white rounded-full w-10 h-10 flex items-center justify-center border-2 border-white shadow-lg text-xl"
                >
                  ✕
                </button>
                <p className="text-center text-amber-200 mt-3 text-sm">
                  Click para cerrar
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Over overlay */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/90 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="relative"
                style={{
                  background: 'rgba(127, 29, 29, 0.95)',
                  border: '2px solid rgba(220, 38, 38, 0.6)',
                  borderRadius: '12px',
                  padding: '20px 28px',
                  maxWidth: '320px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">😞</div>

                  <h2
                    className="text-xl font-semibold mb-2"
                    style={{
                      color: '#fecaca',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
                    }}
                  >
                    ¡Ups!
                  </h2>

                  <p
                    className="text-sm mb-2"
                    style={{
                      color: '#fca5a5',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                  >
                    Demasiados errores
                  </p>

                  <p
                    className="text-xs mb-5"
                    style={{
                      color: '#fbbf24',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                    }}
                  >
                    Ingredientes: {collected}/{INGREDIENTS_NEEDED}
                  </p>

                  <button
                    onClick={onClose}
                    className="w-full"
                    style={{
                      background: 'rgba(75, 85, 99, 0.9)',
                      border: '2px solid rgba(107, 114, 128, 0.6)',
                      borderRadius: '8px',
                      padding: '10px 24px',
                      color: '#e5e7eb',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      fontWeight: '500',
                      fontSize: '14px',
                    }}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
