"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '@/lib/audioManager';

interface DanceSequenceGameProps {
  onComplete: () => void;
  onClose: () => void;
}

type DanceMove = '↑' | '↓' | '←' | '→' | '↺';

const DANCE_MOVES: DanceMove[] = ['↑', '↓', '←', '→', '↺'];
const MOVES_TO_WIN = 8; // Number of rounds to complete
const INITIAL_SEQUENCE_LENGTH = 3;

export default function DanceSequenceGame({ onComplete, onClose }: DanceSequenceGameProps) {
  const [sequence, setSequence] = useState<DanceMove[]>([]);
  const [playerSequence, setPlayerSequence] = useState<DanceMove[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [highlightedMove, setHighlightedMove] = useState<DanceMove | null>(null);
  const [score, setScore] = useState(0);

  // Music management
  useEffect(() => {
    if (!showInstructions && !gameOver && !gameWon) {
      // Game is active - play sister room music
      audioManager.pause('christmas-music');
      audioManager.play('sister-room', true);

      return () => {
        audioManager.stop('sister-room', true);
        audioManager.resume('christmas-music');
      };
    } else {
      audioManager.stop('sister-room', true);
      if (!showInstructions) {
        audioManager.resume('christmas-music');
      }
    }
  }, [showInstructions, gameOver, gameWon]);

  // Generate new sequence
  const generateSequence = useCallback((length: number) => {
    const newSequence: DanceMove[] = [];
    for (let i = 0; i < length; i++) {
      const randomMove = DANCE_MOVES[Math.floor(Math.random() * DANCE_MOVES.length)];
      newSequence.push(randomMove);
    }
    return newSequence;
  }, []);

  // Show sequence to player
  const showSequence = useCallback(async (seq: DanceMove[]) => {
    setIsShowingSequence(true);
    setIsPlayerTurn(false);
    setPlayerSequence([]);

    // Wait a bit before starting
    await new Promise(resolve => setTimeout(resolve, 800));

    // Show each move
    for (let i = 0; i < seq.length; i++) {
      setHighlightedMove(seq[i]);
      audioManager.play('click');
      await new Promise(resolve => setTimeout(resolve, 600));
      setHighlightedMove(null);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setIsShowingSequence(false);
    setIsPlayerTurn(true);
  }, []);

  // Start new round
  const startRound = useCallback(() => {
    const sequenceLength = INITIAL_SEQUENCE_LENGTH + currentRound - 1;
    const newSequence = generateSequence(sequenceLength);
    setSequence(newSequence);
    showSequence(newSequence);
  }, [currentRound, generateSequence, showSequence]);

  // Initialize game
  useEffect(() => {
    if (!showInstructions && !gameOver && !gameWon && sequence.length === 0) {
      startRound();
    }
  }, [showInstructions, gameOver, gameWon, sequence.length, startRound]);

  // Handle player move
  const handleMoveClick = (move: DanceMove) => {
    if (!isPlayerTurn || isShowingSequence) return;

    const newPlayerSequence = [...playerSequence, move];
    setPlayerSequence(newPlayerSequence);

    // Check if move is correct
    const currentIndex = newPlayerSequence.length - 1;
    if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
      // Wrong move!
      audioManager.play('wrong');
      setGameOver(true);
      return;
    }

    // Correct move
    audioManager.play('success');
    setHighlightedMove(move);
    setTimeout(() => setHighlightedMove(null), 200);

    // Check if sequence is complete
    if (newPlayerSequence.length === sequence.length) {
      // Round complete!
      setScore(score + 1);

      if (currentRound >= MOVES_TO_WIN) {
        // Game won!
        setTimeout(() => {
          setGameWon(true);
          setTimeout(() => {
            onComplete();
          }, 2000);
        }, 500);
      } else {
        // Next round
        setTimeout(() => {
          setCurrentRound(currentRound + 1);
          setSequence([]);
          setPlayerSequence([]);
        }, 1000);
      }
    }
  };

  const handleRestart = () => {
    setSequence([]);
    setPlayerSequence([]);
    setCurrentRound(1);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setIsShowingSequence(false);
    setIsPlayerTurn(false);
    audioManager.play('click');
  };

  const getMoveLabel = (move: DanceMove) => {
    switch (move) {
      case '↑': return 'Arriba';
      case '↓': return 'Abajo';
      case '←': return 'Izquierda';
      case '→': return 'Derecha';
      case '↺': return 'Girar';
    }
  };

  const getMoveColor = (move: DanceMove) => {
    switch (move) {
      case '↑': return { bg: 'from-blue-500 to-blue-700', border: 'border-blue-400', shadow: 'rgba(59, 130, 246, 0.6)' };
      case '↓': return { bg: 'from-green-500 to-green-700', border: 'border-green-400', shadow: 'rgba(34, 197, 94, 0.6)' };
      case '←': return { bg: 'from-purple-500 to-purple-700', border: 'border-purple-400', shadow: 'rgba(168, 85, 247, 0.6)' };
      case '→': return { bg: 'from-pink-500 to-pink-700', border: 'border-pink-400', shadow: 'rgba(236, 72, 153, 0.6)' };
      case '↺': return { bg: 'from-yellow-500 to-yellow-700', border: 'border-yellow-400', shadow: 'rgba(234, 179, 8, 0.6)' };
    }
  };

  const progress = (score / MOVES_TO_WIN) * 100;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(3px)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
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
              💃 Ronda {currentRound}/{MOVES_TO_WIN}
            </span>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.98) 0%, rgba(126, 34, 206, 0.98) 100%)',
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
              🎯 Pasos: {playerSequence.length}/{sequence.length}
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
              🕺 Pasos de Baile 💃
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

        {/* Status message */}
        <div className="text-center mb-6">
          <motion.div
            className="inline-block px-6 py-3 rounded-xl text-white font-semibold text-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.9) 0%, rgba(168, 85, 247, 0.9) 100%)',
              backdropFilter: 'blur(8px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            }}
            animate={{
              scale: isShowingSequence ? [1, 1.05, 1] : 1,
            }}
            transition={{
              duration: 0.6,
              repeat: isShowingSequence ? Infinity : 0,
            }}
          >
            {isShowingSequence ? '👀 ¡Observa los pasos!' : isPlayerTurn ? '🎵 ¡Tu turno!' : '⏸️ Preparando...'}
          </motion.div>
        </div>

        {/* Dance moves buttons */}
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          {/* Top arrow */}
          <div></div>
          <motion.button
            onClick={() => handleMoveClick('↑')}
            disabled={!isPlayerTurn || isShowingSequence}
            className="aspect-square rounded-2xl font-bold text-6xl flex items-center justify-center"
            style={{
              background: highlightedMove === '↑'
                ? `linear-gradient(135deg, ${getMoveColor('↑').bg})`
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.7), rgba(37, 99, 235, 0.7))',
              border: `3px solid ${highlightedMove === '↑' ? '#fff' : 'rgba(147, 197, 253, 0.5)'}`,
              boxShadow: highlightedMove === '↑'
                ? `0 0 30px ${getMoveColor('↑').shadow}, 0 4px 20px rgba(0, 0, 0, 0.4)`
                : '0 4px 20px rgba(0, 0, 0, 0.3)',
              cursor: isPlayerTurn ? 'pointer' : 'not-allowed',
              opacity: isPlayerTurn ? 1 : 0.6,
              color: 'white',
              backdropFilter: 'blur(8px)',
            }}
            whileHover={isPlayerTurn ? { scale: 1.1 } : {}}
            whileTap={isPlayerTurn ? { scale: 0.95 } : {}}
          >
            ↑
          </motion.button>
          <div></div>

          {/* Left, Spin, Right arrows */}
          <motion.button
            onClick={() => handleMoveClick('←')}
            disabled={!isPlayerTurn || isShowingSequence}
            className="aspect-square rounded-2xl font-bold text-6xl flex items-center justify-center"
            style={{
              background: highlightedMove === '←'
                ? `linear-gradient(135deg, ${getMoveColor('←').bg})`
                : 'linear-gradient(135deg, rgba(168, 85, 247, 0.7), rgba(126, 34, 206, 0.7))',
              border: `3px solid ${highlightedMove === '←' ? '#fff' : 'rgba(216, 180, 254, 0.5)'}`,
              boxShadow: highlightedMove === '←'
                ? `0 0 30px ${getMoveColor('←').shadow}, 0 4px 20px rgba(0, 0, 0, 0.4)`
                : '0 4px 20px rgba(0, 0, 0, 0.3)',
              cursor: isPlayerTurn ? 'pointer' : 'not-allowed',
              opacity: isPlayerTurn ? 1 : 0.6,
              color: 'white',
              backdropFilter: 'blur(8px)',
            }}
            whileHover={isPlayerTurn ? { scale: 1.1 } : {}}
            whileTap={isPlayerTurn ? { scale: 0.95 } : {}}
          >
            ←
          </motion.button>

          <motion.button
            onClick={() => handleMoveClick('↺')}
            disabled={!isPlayerTurn || isShowingSequence}
            className="aspect-square rounded-2xl font-bold text-6xl flex items-center justify-center"
            style={{
              background: highlightedMove === '↺'
                ? `linear-gradient(135deg, ${getMoveColor('↺').bg})`
                : 'linear-gradient(135deg, rgba(234, 179, 8, 0.7), rgba(202, 138, 4, 0.7))',
              border: `3px solid ${highlightedMove === '↺' ? '#fff' : 'rgba(253, 224, 71, 0.5)'}`,
              boxShadow: highlightedMove === '↺'
                ? `0 0 30px ${getMoveColor('↺').shadow}, 0 4px 20px rgba(0, 0, 0, 0.4)`
                : '0 4px 20px rgba(0, 0, 0, 0.3)',
              cursor: isPlayerTurn ? 'pointer' : 'not-allowed',
              opacity: isPlayerTurn ? 1 : 0.6,
              color: 'white',
              backdropFilter: 'blur(8px)',
            }}
            whileHover={isPlayerTurn ? { scale: 1.1, rotate: 360 } : {}}
            whileTap={isPlayerTurn ? { scale: 0.95 } : {}}
            transition={{ duration: 0.5 }}
          >
            ↺
          </motion.button>

          <motion.button
            onClick={() => handleMoveClick('→')}
            disabled={!isPlayerTurn || isShowingSequence}
            className="aspect-square rounded-2xl font-bold text-6xl flex items-center justify-center"
            style={{
              background: highlightedMove === '→'
                ? `linear-gradient(135deg, ${getMoveColor('→').bg})`
                : 'linear-gradient(135deg, rgba(236, 72, 153, 0.7), rgba(219, 39, 119, 0.7))',
              border: `3px solid ${highlightedMove === '→' ? '#fff' : 'rgba(251, 207, 232, 0.5)'}`,
              boxShadow: highlightedMove === '→'
                ? `0 0 30px ${getMoveColor('→').shadow}, 0 4px 20px rgba(0, 0, 0, 0.4)`
                : '0 4px 20px rgba(0, 0, 0, 0.3)',
              cursor: isPlayerTurn ? 'pointer' : 'not-allowed',
              opacity: isPlayerTurn ? 1 : 0.6,
              color: 'white',
              backdropFilter: 'blur(8px)',
            }}
            whileHover={isPlayerTurn ? { scale: 1.1 } : {}}
            whileTap={isPlayerTurn ? { scale: 0.95 } : {}}
          >
            →
          </motion.button>

          {/* Bottom arrow */}
          <div></div>
          <motion.button
            onClick={() => handleMoveClick('↓')}
            disabled={!isPlayerTurn || isShowingSequence}
            className="aspect-square rounded-2xl font-bold text-6xl flex items-center justify-center"
            style={{
              background: highlightedMove === '↓'
                ? `linear-gradient(135deg, ${getMoveColor('↓').bg})`
                : 'linear-gradient(135deg, rgba(34, 197, 94, 0.7), rgba(22, 163, 74, 0.7))',
              border: `3px solid ${highlightedMove === '↓' ? '#fff' : 'rgba(134, 239, 172, 0.5)'}`,
              boxShadow: highlightedMove === '↓'
                ? `0 0 30px ${getMoveColor('↓').shadow}, 0 4px 20px rgba(0, 0, 0, 0.4)`
                : '0 4px 20px rgba(0, 0, 0, 0.3)',
              cursor: isPlayerTurn ? 'pointer' : 'not-allowed',
              opacity: isPlayerTurn ? 1 : 0.6,
              color: 'white',
              backdropFilter: 'blur(8px)',
            }}
            whileHover={isPlayerTurn ? { scale: 1.1 } : {}}
            whileTap={isPlayerTurn ? { scale: 0.95 } : {}}
          >
            ↓
          </motion.button>
          <div></div>
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
                💃 Pasos de Baile 🕺
              </h3>
              <div className="text-pink-200 space-y-3 text-sm">
                <p>• Observa la secuencia de pasos</p>
                <p>• Repite los pasos en el mismo orden</p>
                <p>• Cada ronda añade más pasos</p>
                <p>• Completa {MOVES_TO_WIN} rondas para ganar</p>
                <p>• ¡Un error y pierdes!</p>
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
                  ¡Bailarín Profesional!
                </h3>
                <p className="text-green-100 text-base">
                  Completaste todas las rondas 💃
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
                  ¡Paso equivocado!
                </h3>
                <p className="text-red-100 text-base mb-2">
                  Te equivocaste en la secuencia
                </p>
                <p className="text-red-200 text-sm mb-6">
                  Llegaste a la ronda {currentRound}
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
