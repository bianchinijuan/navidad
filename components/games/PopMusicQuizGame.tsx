"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '@/lib/audioManager';

interface PopMusicQuizGameProps {
  onComplete: () => void;
  onClose: () => void;
}

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

const QUESTIONS: Question[] = [
  {
    question: "¿Quién es conocida como la 'Princesa del Pop'?",
    options: ["Madonna", "Britney Spears", "Christina Aguilera", "Lady Gaga"],
    correctIndex: 1
  },
  {
    question: "¿Qué canción de Dua Lipa fue un gran éxito en 2020?",
    options: ["Levitating", "New Rules", "Be The One", "IDGAF"],
    correctIndex: 0
  },
  {
    question: "¿En qué año debutó Taylor Swift?",
    options: ["2004", "2006", "2008", "2010"],
    correctIndex: 1
  },
  {
    question: "¿Quién cantó 'Umbrella' junto a Rihanna?",
    options: ["Eminem", "Jay-Z", "Drake", "Kanye West"],
    correctIndex: 1
  },
  {
    question: "¿Cuál fue el primer sencillo de Ariana Grande?",
    options: ["Problem", "Break Free", "The Way", "Love Me Harder"],
    correctIndex: 2
  },
  {
    question: "¿Qué canción de The Weeknd alcanzó el #1 en 2020?",
    options: ["Starboy", "Blinding Lights", "Can't Feel My Face", "Save Your Tears"],
    correctIndex: 1
  },
  {
    question: "¿Quién es la artista femenina con más premios Grammy?",
    options: ["Taylor Swift", "Beyoncé", "Adele", "Alicia Keys"],
    correctIndex: 1
  },
  {
    question: "¿De qué país es originaria Shakira?",
    options: ["México", "España", "Colombia", "Argentina"],
    correctIndex: 2
  },
  {
    question: "¿Qué grupo de K-pop rompió récords en Billboard en 2020?",
    options: ["EXO", "BLACKPINK", "BTS", "TWICE"],
    correctIndex: 2
  },
  {
    question: "¿Quién cantó 'Rolling in the Deep'?",
    options: ["Adele", "Amy Winehouse", "Sam Smith", "Lorde"],
    correctIndex: 0
  },
  {
    question: "¿Cuál fue el álbum más vendido de Michael Jackson?",
    options: ["Bad", "Dangerous", "Thriller", "Off the Wall"],
    correctIndex: 2
  },
  {
    question: "¿Qué canción de Ed Sheeran fue #1 en 2017?",
    options: ["Thinking Out Loud", "Shape of You", "Perfect", "Photograph"],
    correctIndex: 1
  },
  {
    question: "¿Quién es conocida como 'Queen B'?",
    options: ["Beyoncé", "Britney Spears", "Billie Eilish", "Bruno Mars"],
    correctIndex: 0
  },
  {
    question: "¿En qué año se formó One Direction?",
    options: ["2008", "2010", "2012", "2014"],
    correctIndex: 1
  },
  {
    question: "¿Qué artista lanzó el álbum '1989'?",
    options: ["Katy Perry", "Taylor Swift", "Selena Gomez", "Miley Cyrus"],
    correctIndex: 1
  },
  {
    question: "¿Quién cantó 'Bad Romance'?",
    options: ["Madonna", "Lady Gaga", "Katy Perry", "P!nk"],
    correctIndex: 1
  },
  {
    question: "¿Cuál es el nombre real de Bruno Mars?",
    options: ["Peter Gene Hernandez", "Bruno Hernandez", "Peter Mars", "Gene Mars"],
    correctIndex: 0
  },
  {
    question: "¿Qué canción de Justin Bieber tiene a Ludacris?",
    options: ["Baby", "Sorry", "Love Yourself", "What Do You Mean"],
    correctIndex: 0
  },
  {
    question: "¿Quién es la vocalista de Paramore?",
    options: ["Avril Lavigne", "Hayley Williams", "Amy Lee", "Taylor Momsen"],
    correctIndex: 1
  },
  {
    question: "¿Qué artista pop lanzó 'Firework' en 2010?",
    options: ["Lady Gaga", "Rihanna", "Katy Perry", "Kesha"],
    correctIndex: 2
  }
];

export default function PopMusicQuizGame({ onComplete, onClose }: PopMusicQuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Music management
  useEffect(() => {
    if (!showInstructions) {
      // Game is active - play pop music
      audioManager.pause('christmas-music');
      audioManager.play('hub-ambient', true);

      // Cleanup only when game is actually active
      return () => {
        audioManager.stop('hub-ambient', true);
        audioManager.resume('christmas-music');
      };
    } else {
      // Game is not active - ensure music is stopped
      audioManager.stop('hub-ambient', true);
      audioManager.resume('christmas-music');
    }
  }, [showInstructions]);

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setErrors(0);
    setShowResult(false);
    setIsComplete(false);
    setIsGameOver(false);
    audioManager.play('click');
  };

  const handleAnswerClick = (index: number) => {
    if (selectedAnswer !== null) return; // Ya respondió

    setSelectedAnswer(index);
    const isCorrect = index === QUESTIONS[currentQuestion].correctIndex;

    if (isCorrect) {
      audioManager.play('success');
      setScore(prev => prev + 1);
    } else {
      audioManager.play('wrong');
      const newErrors = errors + 1;
      setErrors(newErrors);

      // Verificar si perdió (5 errores = Game Over)
      if (newErrors >= 5) {
        setTimeout(() => {
          setIsGameOver(true);
          // Auto-close after showing game over screen
          setTimeout(() => {
            onClose();
          }, 3000);
        }, 1500);
        return;
      }
    }

    // Esperar un momento antes de mostrar resultado
    setTimeout(() => {
      setShowResult(true);
    }, 500);

    // Avanzar a la siguiente pregunta o finalizar
    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        // Quiz completado
        setIsComplete(true);
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    }, 2000);
  };

  const currentQ = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

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
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/assets/sister/sister.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

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
              📝 {currentQuestion + 1}/{QUESTIONS.length}
            </span>
          </div>

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
              ⭐ {score}/{QUESTIONS.length}
            </span>
          </div>

          <div
            style={{
              background: errors >= 2
                ? 'linear-gradient(135deg, rgba(185, 28, 28, 0.98) 0%, rgba(153, 27, 27, 0.98) 100%)'
                : 'linear-gradient(135deg, rgba(55, 65, 81, 0.98) 0%, rgba(31, 41, 55, 0.98) 100%)',
              backdropFilter: 'blur(8px)',
              border: errors >= 2 ? '2px solid rgba(239, 68, 68, 0.7)' : '2px solid rgba(156, 163, 175, 0.6)',
              borderRadius: '10px',
              padding: '6px 12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          >
            <span style={{
              color: errors >= 2 ? '#fecaca' : '#d1d5db',
              fontFamily: 'Georgia, serif',
              fontSize: '13px',
              fontWeight: '600',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
            }}>
              ❌ {errors}/5
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
              whileHover={{ scale: 1.05, boxShadow: '0 6px 16px rgba(147, 51, 234, 0.5)' }}
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
                padding: '6px 14px',
                color: '#f3f4f6',
                fontWeight: '600',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                cursor: 'pointer',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 6px 16px rgba(0, 0, 0, 0.6)' }}
              whileTap={{ scale: 0.95 }}
            >
              ✕
            </motion.button>
          </div>

          {/* Center Title */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
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
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)',
              margin: 0,
              whiteSpace: 'nowrap',
            }}>
              🎤 Quiz de Música Pop 🎵
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Contenedor del quiz */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl w-full px-8">
        {/* Barra de progreso compacta */}
        <div className="w-full bg-gray-800/50 backdrop-blur-sm rounded-full h-1.5 mb-6 border border-gray-700/50">
          <motion.div
            className="bg-gradient-to-r from-pink-600 to-purple-400 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            style={{
              boxShadow: '0 0 8px rgba(236, 72, 153, 0.6)',
            }}
          />
        </div>

        {/* Pregunta actual */}
        <motion.div
          key={currentQuestion}
          className="w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {/* Question card */}
          <div
            className="bg-gradient-to-br from-pink-900/90 to-purple-800/90 rounded-2xl p-6 mb-4 border border-pink-600/40"
            style={{
              boxShadow: '0 4px 20px rgba(236, 72, 153, 0.3)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <h3
              className="text-xl text-pink-100 text-center leading-relaxed"
              style={{
                fontFamily: 'Georgia, serif',
                fontWeight: '600',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
              }}
            >
              {currentQ.question}
            </h3>
          </div>

          {/* Opciones */}
          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQ.correctIndex;
              const showCorrectAnswer = selectedAnswer !== null;

              let bgColor = 'from-gray-800/80 to-gray-900/80';
              let borderColor = 'border-gray-600/50';
              let textColor = 'text-gray-100';
              let shadowColor = '0 2px 8px rgba(0, 0, 0, 0.3)';

              if (showCorrectAnswer) {
                if (isCorrect) {
                  bgColor = 'from-green-600/90 to-green-700/90';
                  borderColor = 'border-green-400/70';
                  textColor = 'text-white';
                  shadowColor = '0 4px 16px rgba(34, 197, 94, 0.4)';
                } else if (isSelected && !isCorrect) {
                  bgColor = 'from-red-600/90 to-red-700/90';
                  borderColor = 'border-red-400/70';
                  textColor = 'text-white';
                  shadowColor = '0 4px 16px rgba(220, 38, 38, 0.4)';
                }
              }

              return (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  className={`w-full p-4 bg-gradient-to-r ${bgColor} rounded-xl border-2 ${borderColor} ${textColor} text-left`}
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontWeight: '500',
                    fontSize: '16px',
                    cursor: selectedAnswer !== null ? 'not-allowed' : 'pointer',
                    boxShadow: shadowColor,
                    backdropFilter: 'blur(8px)',
                  }}
                  whileHover={selectedAnswer === null ? {
                    scale: 1.02,
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
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
                className="mt-4 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <p
                  className={`text-base font-semibold ${
                    selectedAnswer === currentQ.correctIndex ? 'text-green-300' : 'text-red-300'
                  }`}
                  style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  {selectedAnswer === currentQ.correctIndex ? '¡Correcto! 🎉' : 'Incorrecto 😔'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Superposición de instrucciones */}
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
                🎤 Quiz de Música Pop
              </h3>
              <div className="text-pink-200 space-y-3 text-sm">
                <p>• Responde 20 preguntas sobre música pop</p>
                <p>• Solo tienes 5 errores permitidos</p>
                <p>• Las respuestas correctas se marcan en verde ✓</p>
                <p>• Las incorrectas en rojo ✗</p>
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

      {/* Superposición de éxito */}
      <AnimatePresence>
        {isComplete && (
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
                <h3
                  className="text-2xl text-white mb-3"
                  style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontWeight: '600'
                  }}
                >
                  ¡Quiz Completado!
                </h3>
                <p
                  className="text-green-100 text-base"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  Puntaje: {score}/{QUESTIONS.length} 🎤
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Superposición de Game Over */}
      <AnimatePresence>
        {isGameOver && (
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
                <h3
                  className="text-2xl text-white mb-3"
                  style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontWeight: '600'
                  }}
                >
                  ¡Demasiados Errores!
                </h3>
                <p
                  className="text-red-100 text-base mb-2"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  Fallaste más de 5 preguntas
                </p>
                <p
                  className="text-red-200 text-sm mb-6"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  Puntaje final: {score}/{QUESTIONS.length}
                </p>
                <button
                  onClick={handleRestart}
                  className="w-full py-3 bg-white/90 hover:bg-white text-red-900 rounded-lg font-semibold transition-colors"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
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
