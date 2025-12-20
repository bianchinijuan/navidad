"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '@/lib/audioManager';

interface LyricsFillGameProps {
  onComplete: () => void;
  onClose: () => void;
}

interface LyricPuzzle {
  song: string;
  artist: string;
  lyric: string; // Lyric fragment to display
  hint: string; // Hint for the song
}

const PUZZLES: LyricPuzzle[] = [
  {
    song: "Cómo eran las cosas",
    artist: "Babasónicos",
    lyric: "Quizás fue en la mañana\nEn que vendados los dos\nDescubrimos cómo eran las cosas…",
    hint: "Rock argentino sobre descubrimientos y primeras veces"
  },
  {
    song: "Story of My Life",
    artist: "One Direction",
    lyric: "Written on these walls are the colors that I can't change\nLeave my heart open, but it stays right here in its cage…",
    hint: "Balada pop sobre memorias escritas en las paredes"
  },
  {
    song: "Porque yo te amo",
    artist: "Sandro",
    lyric: "Igual que sufro yo por esta situación\nQue nubla la razón sin permitir pensar…",
    hint: "Clásico romántico argentino sobre amor y sufrimiento"
  },
  {
    song: "Llorarás por mí",
    artist: "Chapa C",
    lyric: "Amor, sabes que me estoy muriendo de dolor\nDesde que te fuiste he perdido el control…",
    hint: "Canción de desamor sobre pérdida y dolor"
  },
  {
    song: "Campanas en la noche",
    artist: "Los Tipitos",
    lyric: "Un hombre de frente a una ventana\nSuperlúcida la mirada\nRecorre el paisaje y no…",
    hint: "Rock argentino con campanas y paisajes nocturnos"
  },
  {
    song: "Umbrella",
    artist: "Rihanna",
    lyric: "When the sun shine, we shine together\nTold you I'll be here forever…",
    hint: "Hit pop sobre estar juntos en las buenas y en las malas"
  },
  {
    song: "Cactus",
    artist: "Gustavo Cerati",
    lyric: "Y tiene un veneno más amargo que la hiel\nCon solo invocarte voy a convertirlo en miel\nY aunque a tus ojos ya no soy contemporáneo…",
    hint: "Canción de Cerati sobre transformar veneno en miel"
  },
  {
    song: "Bohemian Rhapsody",
    artist: "Queen",
    lyric: "Is this the real life?\nOr is this just fantasy?",
    hint: "Épica ópera rock que cuestiona la realidad"
  },
  {
    song: "Baby One More Time",
    artist: "Britney Spears",
    lyric: "Oh baby, baby, how was I supposed to know\nThat something wasn't right here…",
    hint: "Icónico hit pop de los 90s sobre arrepentimiento"
  }
];

const PUZZLES_TO_WIN = 5; // Need 5 correct to win
const TIME_PER_PUZZLE = 20; // 20 seconds per puzzle
const MAX_ATTEMPTS = 3; // 3 attempts per song

export default function LyricsFillGame({ onComplete, onClose }: LyricsFillGameProps) {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_PUZZLE);
  const [shuffledPuzzles, setShuffledPuzzles] = useState<LyricPuzzle[]>([]);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);

  // Music management
  useEffect(() => {
    if (!showInstructions) {
      audioManager.pause('christmas-music');
      audioManager.play('sister-room');

      return () => {
        audioManager.stop('sister-room');
        audioManager.resume('christmas-music');
      };
    } else {
      audioManager.stop('sister-room');
    }
  }, [showInstructions]);

  // Shuffle puzzles on start
  useEffect(() => {
    const shuffled = [...PUZZLES].sort(() => Math.random() - 0.5);
    setShuffledPuzzles(shuffled);
  }, []);

  // Timer
  useEffect(() => {
    if (showInstructions || showResult || gameWon || gameLost) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showInstructions, showResult, gameWon, gameLost, currentPuzzle, handleTimeOut]);

  const handleTimeOut = useCallback(() => {
    audioManager.play('wrong');
    setIsCorrect(false);
    setShowResult(true);

    setTimeout(() => {
      if (currentPuzzle < shuffledPuzzles.length - 1) {
        setCurrentPuzzle(prev => prev + 1);
        setUserAnswer("");
        setShowResult(false);
        setTimeLeft(TIME_PER_PUZZLE);
        setAttemptsLeft(MAX_ATTEMPTS);
      } else {
        // No more puzzles
        if (score >= PUZZLES_TO_WIN) {
          setGameWon(true);
          setTimeout(() => onComplete(), 2000);
        } else {
          setGameLost(true);
        }
      }
    }, 2000);
  }, [currentPuzzle, shuffledPuzzles.length, score, onComplete]);

  const normalizeString = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Remove accents
  };

  const handleSubmit = () => {
    if (userAnswer.trim() === "") {
      // Don't submit if field is empty
      return;
    }

    const puzzle = shuffledPuzzles[currentPuzzle];
    const correct = normalizeString(userAnswer) === normalizeString(puzzle.song);

    if (correct) {
      // Correct answer
      setIsCorrect(true);
      setShowResult(true);
      audioManager.play('success');
      setScore(prev => prev + 1);

      setTimeout(() => {
        if (score + 1 >= PUZZLES_TO_WIN) {
          setGameWon(true);
          setTimeout(() => onComplete(), 2000);
        } else if (currentPuzzle < shuffledPuzzles.length - 1) {
          setCurrentPuzzle(prev => prev + 1);
          setUserAnswer("");
          setShowResult(false);
          setTimeLeft(TIME_PER_PUZZLE);
          setAttemptsLeft(MAX_ATTEMPTS);
        } else {
          // No more puzzles
          if (score + 1 >= PUZZLES_TO_WIN) {
            setGameWon(true);
            setTimeout(() => onComplete(), 2000);
          } else {
            setGameLost(true);
          }
        }
      }, 2000);
    } else {
      // Wrong answer
      const newAttemptsLeft = attemptsLeft - 1;
      setAttemptsLeft(newAttemptsLeft);

      if (newAttemptsLeft === 0) {
        // No more attempts, show result and move to next
        setIsCorrect(false);
        setShowResult(true);
        audioManager.play('wrong');

        setTimeout(() => {
          if (currentPuzzle < shuffledPuzzles.length - 1) {
            setCurrentPuzzle(prev => prev + 1);
            setUserAnswer("");
            setShowResult(false);
            setTimeLeft(TIME_PER_PUZZLE);
            setAttemptsLeft(MAX_ATTEMPTS);
          } else {
            // No more puzzles
            if (score >= PUZZLES_TO_WIN) {
              setGameWon(true);
              setTimeout(() => onComplete(), 2000);
            } else {
              setGameLost(true);
            }
          }
        }, 2000);
      } else {
        // Still have attempts, just clear input and show brief feedback
        audioManager.play('wrong');
        setUserAnswer("");
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (shuffledPuzzles.length === 0) {
    return null;
  }

  const puzzle = shuffledPuzzles[currentPuzzle];
  const progress = (score / PUZZLES_TO_WIN) * 100;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Compact Header */}
      <div className="fixed top-4 left-4 z-30">
        <motion.div
          className="flex flex-col gap-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Score */}
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
              🎵 {score}/{PUZZLES_TO_WIN}
            </span>
          </div>

          {/* Timer */}
          <div
            style={{
              background: timeLeft <= 5
                ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.98) 0%, rgba(185, 28, 28, 0.98) 100%)'
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
              ⏱️ {timeLeft}s
            </span>
          </div>

          {/* Attempts */}
          <div
            style={{
              background: attemptsLeft === 1
                ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.98) 0%, rgba(185, 28, 28, 0.98) 100%)'
                : 'linear-gradient(135deg, rgba(34, 197, 94, 0.98) 0%, rgba(22, 163, 74, 0.98) 100%)',
              backdropFilter: 'blur(8px)',
              border: '2px solid rgba(134, 239, 172, 0.6)',
              borderRadius: '10px',
              padding: '6px 12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          >
            <span style={{
              color: '#dcfce7',
              fontFamily: 'Georgia, serif',
              fontSize: '13px',
              fontWeight: '600',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
            }}>
              💪 {attemptsLeft}/{MAX_ATTEMPTS}
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
              🎤 Adivina la Canción
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Game area */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-8">
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

        {/* Lyric fragment display */}
        <motion.div
          key={`lyric-${currentPuzzle}`}
          className="mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="bg-gradient-to-br from-pink-900/80 to-purple-900/80 rounded-3xl p-8 border-4 border-pink-500/50 backdrop-blur-md"
            style={{
              boxShadow: '0 8px 32px rgba(236, 72, 153, 0.4)',
            }}
          >
            <div className="text-center text-lg text-pink-100 leading-relaxed whitespace-pre-line font-serif italic">
              &ldquo;{puzzle.lyric}&rdquo;
            </div>
          </div>
        </motion.div>

        {/* Answer input */}
        {!showResult && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center mb-3">
              <label className="text-pink-200 text-lg font-semibold">
                ¿Qué canción es?
              </label>
            </div>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe el título de la canción..."
              className="w-full px-6 py-4 bg-white/10 border-3 border-pink-400/60 rounded-xl text-center text-white text-xl font-semibold backdrop-blur-sm"
              style={{
                outline: 'none',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
              }}
              autoFocus
            />
          </motion.div>
        )}

        {/* Submit button */}
        {!showResult && (
          <motion.button
            onClick={handleSubmit}
            className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xl font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              boxShadow: '0 4px 20px rgba(236, 72, 153, 0.4)',
            }}
            whileHover={{ scale: userAnswer.trim() ? 1.02 : 1 }}
            whileTap={{ scale: userAnswer.trim() ? 0.98 : 1 }}
            disabled={userAnswer.trim() === ""}
          >
            Adivinar
          </motion.button>
        )}

        {/* Feedback */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className={`text-center text-2xl font-bold mb-3 ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                {isCorrect ? '¡Correcto! 🎉' : 'Incorrecto 😔'}
              </div>
              <motion.div
                className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 rounded-2xl p-6 border-2 border-pink-400/60 backdrop-blur-md"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                style={{
                  boxShadow: '0 4px 20px rgba(236, 72, 153, 0.5)',
                }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-200 mb-2">
                    {puzzle.song}
                  </div>
                  <div className="text-xl text-pink-300">
                    {puzzle.artist}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
                🎤 Adivina la Canción
              </h3>
              <div className="text-pink-200 space-y-3 text-sm">
                <p>• Lee el fragmento de letra que aparece</p>
                <p>• Escribe el título de la canción</p>
                <p>• Tienes {MAX_ATTEMPTS} intentos por canción</p>
                <p>• Tienes {TIME_PER_PUZZLE} segundos por fragmento</p>
                <p>• Consigue {PUZZLES_TO_WIN} correctas para ganar</p>
              </div>
              <button
                onClick={() => setShowInstructions(false)}
                className="mt-6 w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-lg font-semibold transition-colors"
              >
                ¡Comenzar!
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
                  ¡Experta Musical!
                </h3>
                <p className="text-green-100 text-base">
                  Acertaste {score} de {shuffledPuzzles.length} canciones 🎵
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loss overlay */}
      <AnimatePresence>
        {gameLost && (
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
                <h3 className="text-2xl text-white mb-3 font-semibold">
                  ¡Casi!
                </h3>
                <p className="text-red-100 text-base mb-2">
                  Acertaste {score} de {shuffledPuzzles.length} canciones
                </p>
                <p className="text-red-100 text-xs">
                  (Necesitabas {PUZZLES_TO_WIN} para ganar)
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 w-full py-3 bg-white/90 hover:bg-white text-red-900 rounded-lg font-semibold transition-colors"
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
