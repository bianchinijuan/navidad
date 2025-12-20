"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '@/lib/audioManager';

interface MusicEmojiGameProps {
  onComplete: () => void;
  onClose: () => void;
}

interface EmojiPuzzle {
  emojis: string;
  answer: string;
  options: string[];
}

const PUZZLES: EmojiPuzzle[] = [
  {
    emojis: "🌂☔",
    answer: "Umbrella - Rihanna",
    options: ["Umbrella - Rihanna", "Rain On Me - Lady Gaga", "Purple Rain - Prince", "Singin' in the Rain"]
  },
  {
    emojis: "🎰👸",
    answer: "Poker Face - Lady Gaga",
    options: ["Poker Face - Lady Gaga", "Queen - Beyoncé", "Royals - Lorde", "Casino - Rihanna"]
  },
  {
    emojis: "🔥💃",
    answer: "Firework - Katy Perry",
    options: ["Firework - Katy Perry", "Hot Girl Summer - Megan", "Burn - Ellie Goulding", "Flames - David Guetta"]
  },
  {
    emojis: "👋👋👋",
    answer: "Bye Bye Bye - NSYNC",
    options: ["Bye Bye Bye - NSYNC", "Hello - Adele", "Wave - Beck", "See You Again - Wiz Khalifa"]
  },
  {
    emojis: "🎸🏨",
    answer: "Hotel California - Eagles",
    options: ["Hotel California - Eagles", "Guitar Hotel - Unknown", "Motel - Ricky Martin", "California Love - 2Pac"]
  },
  {
    emojis: "💎💍",
    answer: "Diamonds - Rihanna",
    options: ["Diamonds - Rihanna", "Gold Digger - Kanye West", "Bling Bling - Lil Wayne", "Ring - Cardi B"]
  },
  {
    emojis: "🌟⚡",
    answer: "Starboy - The Weeknd",
    options: ["Starboy - The Weeknd", "Thunderstruck - AC/DC", "Shooting Stars - Bag Raiders", "Electric Feel - MGMT"]
  },
  {
    emojis: "🏃💨",
    answer: "Run the World - Beyoncé",
    options: ["Run the World - Beyoncé", "Running - OneRepublic", "Fast Car - Tracy Chapman", "Escape - Enrique Iglesias"]
  },
  {
    emojis: "🍎📱",
    answer: "Call Me Maybe - Carly Rae",
    options: ["Call Me Maybe - Carly Rae", "Apple Bottom Jeans - Flo Rida", "Hotline Bling - Drake", "Ring Ring - ABBA"]
  },
  {
    emojis: "🌙☀️",
    answer: "Halo - Beyoncé",
    options: ["Halo - Beyoncé", "Here Comes the Sun - Beatles", "Moonlight - Ariana Grande", "Sunflower - Post Malone"]
  },
  {
    emojis: "💃🏻🕺🏻",
    answer: "Dance Monkey - Tones and I",
    options: ["Dance Monkey - Tones and I", "Dancing Queen - ABBA", "Can't Stop the Feeling - JT", "Uptown Funk - Bruno Mars"]
  },
  {
    emojis: "🎭😢",
    answer: "Tears Dry On Their Own - Amy",
    options: ["Tears Dry On Their Own - Amy", "Cry Me a River - Justin", "Behind These Hazel Eyes - Kelly", "The Show Must Go On - Queen"]
  },
  {
    emojis: "🚗💨",
    answer: "Life is a Highway - Rascal",
    options: ["Life is a Highway - Rascal", "Fast Car - Tracy Chapman", "Drive - Incubus", "Cars - Gary Numan"]
  },
  {
    emojis: "🌹🔴",
    answer: "Roses - Chainsmokers",
    options: ["Roses - Chainsmokers", "Red - Taylor Swift", "Every Rose Has Its Thorn - Poison", "Kiss From a Rose - Seal"]
  },
  {
    emojis: "💔😭",
    answer: "Someone Like You - Adele",
    options: ["Someone Like You - Adele", "Heartbreak Hotel - Elvis", "Cry Baby - Janis Joplin", "Bleeding Love - Leona Lewis"]
  },
];

const PUZZLES_TO_WIN = 10;

export default function MusicEmojiGame({ onComplete, onClose }: MusicEmojiGameProps) {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [shuffledPuzzles, setShuffledPuzzles] = useState<EmojiPuzzle[]>([]);

  // Music management
  useEffect(() => {
    if (!showInstructions) {
      // Game is active - pause christmas-music and play sister-room
      audioManager.pause('christmas-music');
      audioManager.play('sister-room');

      return () => {
        audioManager.stop('sister-room');
        audioManager.resume('christmas-music');
      };
    } else {
      // Ensure sister music is stopped when instructions are showing
      audioManager.stop('sister-room');
    }
  }, [showInstructions]);

  // Shuffle puzzles on start
  useEffect(() => {
    const shuffled = [...PUZZLES].sort(() => Math.random() - 0.5);
    setShuffledPuzzles(shuffled);
  }, []);

  const handleAnswerClick = (answer: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === shuffledPuzzles[currentPuzzle].answer;

    if (isCorrect) {
      audioManager.play('success');
      setScore(prev => prev + 1);
    } else {
      audioManager.play('wrong');
    }

    setShowResult(true);

    setTimeout(() => {
      if (isCorrect && score + 1 >= PUZZLES_TO_WIN) {
        setGameWon(true);
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else if (currentPuzzle < shuffledPuzzles.length - 1) {
        setCurrentPuzzle(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        // No more puzzles but not enough score
        if (score < PUZZLES_TO_WIN) {
          // Could add game over state here
        }
      }
    }, 1500);
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
              🎵 {score}/{PUZZLES_TO_WIN}
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
              📝 {currentPuzzle + 1}/{shuffledPuzzles.length}
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
              😎 Emoji Musical 🎵
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

        {/* Emoji Display */}
        <motion.div
          key={currentPuzzle}
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="bg-gradient-to-br from-pink-900/80 to-purple-900/80 rounded-3xl p-12 border-4 border-pink-500/50 backdrop-blur-md"
            style={{
              boxShadow: '0 8px 32px rgba(236, 72, 153, 0.4)',
            }}
          >
            <div className="text-center">
              <p className="text-sm text-pink-200 mb-4 font-semibold">Adivina la canción:</p>
              <div className="text-8xl mb-2">{puzzle.emojis}</div>
            </div>
          </div>
        </motion.div>

        {/* Answer Options */}
        <div className="space-y-3">
          {puzzle.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === puzzle.answer;
            const showCorrectAnswer = selectedAnswer !== null;

            let bgColor = 'from-gray-700/80 to-gray-800/80';
            let borderColor = 'border-gray-600/50';
            let textColor = 'text-gray-100';
            let shadowColor = '0 2px 8px rgba(0, 0, 0, 0.3)';

            if (showCorrectAnswer) {
              if (isCorrect) {
                bgColor = 'from-green-600/90 to-green-700/90';
                borderColor = 'border-green-400/70';
                textColor = 'text-white';
                shadowColor = '0 4px 16px rgba(34, 197, 94, 0.5)';
              } else if (isSelected && !isCorrect) {
                bgColor = 'from-red-600/90 to-red-700/90';
                borderColor = 'border-red-400/70';
                textColor = 'text-white';
                shadowColor = '0 4px 16px rgba(220, 38, 38, 0.5)';
              }
            }

            return (
              <motion.button
                key={index}
                onClick={() => handleAnswerClick(option)}
                className={`w-full p-4 bg-gradient-to-r ${bgColor} rounded-xl border-2 ${borderColor} ${textColor} text-left backdrop-blur-md`}
                style={{
                  fontFamily: 'Georgia, serif',
                  fontWeight: '500',
                  fontSize: '16px',
                  cursor: selectedAnswer !== null ? 'not-allowed' : 'pointer',
                  boxShadow: shadowColor,
                }}
                whileHover={selectedAnswer === null ? {
                  scale: 1.02,
                  boxShadow: '0 6px 20px rgba(236, 72, 153, 0.4)',
                  borderColor: 'rgba(236, 72, 153, 0.6)',
                } : {}}
                whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                disabled={selectedAnswer !== null}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showCorrectAnswer && isCorrect && <span className="text-2xl">✓</span>}
                  {showCorrectAnswer && isSelected && !isCorrect && <span className="text-2xl">✗</span>}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p
                className={`text-lg font-semibold ${
                  selectedAnswer === puzzle.answer ? 'text-green-300' : 'text-red-300'
                }`}
                style={{
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                }}
              >
                {selectedAnswer === puzzle.answer ? '¡Correcto! 🎉' : 'Incorrecto 😔'}
              </p>
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
                😎 Emoji Musical 🎵
              </h3>
              <div className="text-pink-200 space-y-3 text-sm">
                <p>• Adivina la canción usando solo emojis</p>
                <p>• Lee los emojis y piensa en la canción</p>
                <p>• Selecciona la respuesta correcta</p>
                <p>• Consigue {PUZZLES_TO_WIN} correctas para ganar</p>
                <p>• ¡Demuestra tu conocimiento musical!</p>
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
                  ¡Experto Musical!
                </h3>
                <p className="text-green-100 text-base">
                  Puntaje: {score}/{PUZZLES_TO_WIN} 🎵
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
