"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '@/lib/audioManager';

interface BeatMatchGameProps {
  onComplete: () => void;
  onClose: () => void;
}

interface Beat {
  id: number;
  lane: number; // 0-3 (4 lanes)
  position: number; // 0-100 (percentage from top)
  hit: boolean;
}

const LANES = 4;
const BEAT_SPEED = 1.5; // pixels per frame
const HIT_ZONE = 85; // percentage from top where beats should be hit
const HIT_TOLERANCE = 8; // how close to hit zone counts as hit
const BEATS_TO_WIN = 40; // successful beats needed to win
const MAX_MISSES = 10; // maximum misses allowed

export default function BeatMatchGame({ onComplete, onClose }: BeatMatchGameProps) {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [misses, setMisses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [keyPressed, setKeyPressed] = useState<number | null>(null);

  const gameLoopRef = useRef<number>();
  const nextBeatIdRef = useRef(0);
  const lastBeatTimeRef = useRef(0);

  // Music management
  useEffect(() => {
    if (!showInstructions) {
      // Game is active - play music
      audioManager.pause('christmas-music');
      audioManager.play('hub-ambient', true);

      return () => {
        audioManager.stop('hub-ambient', true);
        audioManager.resume('christmas-music');
      };
    } else {
      audioManager.stop('hub-ambient', true);
      audioManager.resume('christmas-music');
    }
  }, [showInstructions]);

  // Generate beats periodically
  const spawnBeat = useCallback(() => {
    const now = Date.now();
    if (now - lastBeatTimeRef.current > 800) { // New beat every 800ms
      lastBeatTimeRef.current = now;
      const lane = Math.floor(Math.random() * LANES);
      const newBeat: Beat = {
        id: nextBeatIdRef.current++,
        lane,
        position: 0,
        hit: false,
      };
      setBeats(prev => [...prev, newBeat]);
    }
  }, []);

  // Game loop
  useEffect(() => {
    if (showInstructions || gameOver || gameWon) return;

    const gameLoop = () => {
      // Move beats down
      setBeats(prev => {
        const updated = prev.map(beat => ({
          ...beat,
          position: beat.position + BEAT_SPEED,
        }));

        // Remove beats that went past the bottom and count as miss if not hit
        const remaining = updated.filter(beat => {
          if (beat.position > 100) {
            if (!beat.hit) {
              setMisses(m => {
                const newMisses = m + 1;
                if (newMisses >= MAX_MISSES) {
                  setGameOver(true);
                }
                return newMisses;
              });
              setCombo(0);
              audioManager.play('wrong');
            }
            return false;
          }
          return true;
        });

        return remaining;
      });

      // Spawn new beat
      spawnBeat();

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [showInstructions, gameOver, gameWon, spawnBeat]);

  // Check for win condition
  useEffect(() => {
    if (score >= BEATS_TO_WIN && !gameWon && !gameOver) {
      setGameWon(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  }, [score, gameWon, gameOver, onComplete]);

  // Handle key press
  const handleLaneClick = (lane: number) => {
    setKeyPressed(lane);
    setTimeout(() => setKeyPressed(null), 100);

    // Find the closest beat in this lane near the hit zone
    const beatsInLane = beats.filter(b => b.lane === lane && !b.hit);
    let closestBeat: Beat | null = null;
    let minDistance = Infinity;

    beatsInLane.forEach(beat => {
      const distance = Math.abs(beat.position - HIT_ZONE);
      if (distance < minDistance && distance < HIT_TOLERANCE) {
        minDistance = distance;
        closestBeat = beat;
      }
    });

    if (closestBeat) {
      // Hit!
      audioManager.play('success');
      setBeats(prev => prev.map(b =>
        b.id === closestBeat!.id ? { ...b, hit: true } : b
      ));
      setScore(s => s + 1);
      setCombo(c => c + 1);
    } else {
      // Miss
      audioManager.play('click');
      setCombo(0);
    }
  };

  // Keyboard controls
  useEffect(() => {
    if (showInstructions || gameOver || gameWon) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: { [key: string]: number } = {
        'a': 0,
        's': 1,
        'd': 2,
        'f': 3,
      };

      const lane = keyMap[e.key.toLowerCase()];
      if (lane !== undefined) {
        e.preventDefault();
        handleLaneClick(lane);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [beats, showInstructions, gameOver, gameWon]);

  const handleRestart = () => {
    setBeats([]);
    setScore(0);
    setCombo(0);
    setMisses(0);
    setGameOver(false);
    setGameWon(false);
    nextBeatIdRef.current = 0;
    lastBeatTimeRef.current = 0;
    audioManager.play('click');
  };

  const progress = (score / BEATS_TO_WIN) * 100;
  const laneKeys = ['A', 'S', 'D', 'F'];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background with music visualizer effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.3) 0%, rgba(168, 85, 247, 0.2) 50%, transparent 100%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Compact Header - Upper left corner */}
      <div className="fixed top-4 left-4 z-30">
        <motion.div
          className="flex flex-col gap-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Stats */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.98) 0%, rgba(219, 39, 119, 0.98) 100%)',
              backdropFilter: 'blur(8px)',
              border: '2px solid rgba(251, 207, 232, 0.6)',
              borderRadius: '10px',
              padding: '6px 12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          >
            <span style={{
              color: '#fce7f3',
              fontFamily: 'Georgia, serif',
              fontSize: '13px',
              fontWeight: '600',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
            }}>
              🎵 {score}/{BEATS_TO_WIN}
            </span>
          </div>

          <div
            style={{
              background: combo > 5
                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.98) 0%, rgba(22, 163, 74, 0.98) 100%)'
                : 'linear-gradient(135deg, rgba(147, 51, 234, 0.98) 0%, rgba(126, 34, 206, 0.98) 100%)',
              backdropFilter: 'blur(8px)',
              border: '2px solid rgba(192, 132, 252, 0.6)',
              borderRadius: '10px',
              padding: '6px 12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          >
            <span style={{
              color: '#e9d5ff',
              fontFamily: 'Georgia, serif',
              fontSize: '13px',
              fontWeight: '600',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
            }}>
              🔥 x{combo}
            </span>
          </div>

          <div
            style={{
              background: misses >= 7
                ? 'linear-gradient(135deg, rgba(185, 28, 28, 0.98) 0%, rgba(153, 27, 27, 0.98) 100%)'
                : 'linear-gradient(135deg, rgba(55, 65, 81, 0.98) 0%, rgba(31, 41, 55, 0.98) 100%)',
              backdropFilter: 'blur(8px)',
              border: misses >= 7 ? '2px solid rgba(239, 68, 68, 0.7)' : '2px solid rgba(156, 163, 175, 0.6)',
              borderRadius: '10px',
              padding: '6px 12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          >
            <span style={{
              color: misses >= 7 ? '#fecaca' : '#d1d5db',
              fontFamily: 'Georgia, serif',
              fontSize: '13px',
              fontWeight: '600',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
            }}>
              ❌ {misses}/{MAX_MISSES}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 mt-1">
            <motion.button
              onClick={() => setShowInstructions(true)}
              style={{
                background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.98) 0%, rgba(126, 34, 206, 0.98) 100%)',
                backdropFilter: 'blur(8px)',
                border: '2px solid rgba(192, 132, 252, 0.6)',
                borderRadius: '10px',
                padding: '6px 12px',
                color: '#e9d5ff',
                fontWeight: 'bold',
                fontSize: '15px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                cursor: 'pointer',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
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
                padding: '6px 14px',
                color: '#f3f4f6',
                fontWeight: '600',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                cursor: 'pointer',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✕
            </motion.button>
          </div>

          {/* Title */}
          <motion.div
            style={{
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.98) 0%, rgba(219, 39, 119, 0.98) 100%)',
              backdropFilter: 'blur(8px)',
              border: '2px solid rgba(251, 207, 232, 0.6)',
              borderRadius: '10px',
              padding: '8px 18px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          >
            <p style={{
              color: '#fce7f3',
              fontFamily: 'Georgia, serif',
              fontSize: '14px',
              fontWeight: '600',
              margin: 0,
              whiteSpace: 'nowrap',
            }}>
              🎤 Beat Match 🎶
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Game area */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-8">
        {/* Progress bar */}
        <div className="w-full bg-gray-800/50 backdrop-blur-sm rounded-full h-2 mb-6 border border-gray-700/50">
          <motion.div
            className="bg-gradient-to-r from-pink-600 to-purple-400 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            style={{
              boxShadow: '0 0 8px rgba(236, 72, 153, 0.6)',
            }}
          />
        </div>

        {/* Game lanes */}
        <div className="relative h-[500px] flex gap-2">
          {Array.from({ length: LANES }).map((_, laneIndex) => (
            <div
              key={laneIndex}
              className="relative flex-1"
              style={{
                background: 'linear-gradient(180deg, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.2) 100%)',
                borderRadius: '8px',
                border: '2px solid rgba(236, 72, 153, 0.3)',
              }}
            >
              {/* Hit zone indicator */}
              <div
                className="absolute left-0 right-0 h-16 border-4 border-pink-500 rounded-lg"
                style={{
                  top: `${HIT_ZONE}%`,
                  transform: 'translateY(-50%)',
                  background: 'rgba(236, 72, 153, 0.2)',
                  boxShadow: '0 0 20px rgba(236, 72, 153, 0.5)',
                }}
              />

              {/* Beats in this lane */}
              <AnimatePresence>
                {beats
                  .filter(beat => beat.lane === laneIndex && !beat.hit)
                  .map(beat => (
                    <motion.div
                      key={beat.id}
                      className="absolute left-1/2 w-12 h-12 rounded-full"
                      style={{
                        top: `${beat.position}%`,
                        transform: 'translate(-50%, -50%)',
                        background: 'radial-gradient(circle, #EC4899, #A855F7)',
                        boxShadow: '0 0 20px rgba(236, 72, 153, 0.8)',
                        border: '3px solid rgba(255, 255, 255, 0.5)',
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    />
                  ))}
              </AnimatePresence>

              {/* Lane button */}
              <motion.button
                onClick={() => handleLaneClick(laneIndex)}
                className="absolute bottom-4 left-1/2 w-16 h-16 rounded-full font-bold text-2xl"
                style={{
                  transform: 'translateX(-50%)',
                  background: keyPressed === laneIndex
                    ? 'linear-gradient(135deg, #22C55E, #16A34A)'
                    : 'linear-gradient(135deg, #EC4899, #A855F7)',
                  boxShadow: keyPressed === laneIndex
                    ? '0 0 30px rgba(34, 197, 94, 0.8)'
                    : '0 0 20px rgba(236, 72, 153, 0.6)',
                  border: '3px solid rgba(255, 255, 255, 0.5)',
                  color: 'white',
                  cursor: 'pointer',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {laneKeys[laneIndex]}
              </motion.button>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions overlay */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/90 z-20 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInstructions(false)}
          >
            <motion.div
              className="relative bg-gradient-to-br from-pink-900/95 to-purple-900/95 rounded-2xl p-8 max-w-md border-4 border-pink-500"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                boxShadow: '0 0 40px rgba(236, 72, 153, 0.6)',
              }}
            >
              <h3 className="text-2xl text-pink-100 text-center mb-4 font-bold">
                🎵 Beat Match
              </h3>
              <div className="text-pink-200 space-y-3 text-sm">
                <p>• Presiona A, S, D, F o haz click en los botones</p>
                <p>• Cuando los beats lleguen a la zona rosa</p>
                <p>• Alcanza {BEATS_TO_WIN} beats exitosos para ganar</p>
                <p>• Solo puedes fallar {MAX_MISSES} veces</p>
                <p>• ¡Crea combos para mantener el ritmo!</p>
              </div>
              <button
                onClick={() => setShowInstructions(false)}
                className="mt-6 w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-lg font-semibold transition-colors"
              >
                ¡A bailar!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Win overlay */}
      <AnimatePresence>
        {gameWon && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/80 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-green-600 to-green-900 px-10 py-8 rounded-2xl border-4 border-green-400 max-w-sm"
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.4 }}
            >
              <div className="text-center">
                <motion.div
                  className="text-5xl mb-4"
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  🎉
                </motion.div>
                <h3 className="text-2xl text-white mb-3 font-semibold">
                  ¡Perfecto Ritmo!
                </h3>
                <p className="text-green-100 text-base">
                  Puntaje: {score} 🎵
                </p>
                <p className="text-green-200 text-sm">
                  Combo máximo: x{Math.max(combo, 0)}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over overlay */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/80 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-red-600 to-red-900 px-10 py-8 rounded-2xl border-4 border-red-400 max-w-sm"
              initial={{ scale: 0.5, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', bounce: 0.4 }}
            >
              <div className="text-center">
                <div className="text-5xl mb-4">😢</div>
                <h3 className="text-2xl text-white mb-3 font-semibold">
                  ¡Perdiste el Ritmo!
                </h3>
                <p className="text-red-100 text-base mb-2">
                  Demasiados errores
                </p>
                <p className="text-red-200 text-sm mb-6">
                  Puntaje: {score}/{BEATS_TO_WIN}
                </p>
                <button
                  onClick={handleRestart}
                  className="w-full py-3 bg-white/90 hover:bg-white text-red-900 rounded-lg font-semibold transition-colors"
                >
                  Intentar de nuevo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
