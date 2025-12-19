"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '@/lib/audioManager';

interface AirbagQuizGameProps {
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
    question: "¿En qué año se formó la banda Airbag?",
    options: ["1995", "1999", "2003", "2007"],
    correctIndex: 1
  },
  {
    question: "¿De qué país es originaria la banda Airbag?",
    options: ["Chile", "Uruguay", "Argentina", "España"],
    correctIndex: 2
  },
  {
    question: "¿Qué estilo musical caracteriza principalmente a Airbag?",
    options: ["Rock progresivo", "Pop rock", "Heavy metal", "Folk"],
    correctIndex: 0
  },
  {
    question: "¿Cuántos integrantes conforman Airbag?",
    options: ["2", "3", "4", "5"],
    correctIndex: 1
  },
  {
    question: "¿Cuál es el instrumento principal de Gastón Sardelli?",
    options: ["Bajo", "Guitarra", "Batería", "Teclados"],
    correctIndex: 1
  },
  {
    question: "¿Cuál fue el primer álbum de estudio de Airbag?",
    options: ["Airbag", "Identidad", "Blanco y Negro", "Al Parecer Todo Ha Sido una Trampa"],
    correctIndex: 0
  },
  {
    question: "¿Qué canción de Airbag incluye la letra 'Todo está guardado en la memoria'?",
    options: ["Colombina", "Diez Días Después", "Cae el Sol", "Nunca lo Olvides"],
    correctIndex: 1
  },
  {
    question: "¿Quién es el bajista de Airbag?",
    options: ["Patricio Sardelli", "Gastón Sardelli", "Guido Sardelli", "Martín Ruiz Díaz"],
    correctIndex: 2
  },
  {
    question: "¿Cuál es el nombre del álbum lanzado en 2016?",
    options: ["Vivamos el Momento", "Una Hora a Tokyo", "Libertad o Miedo", "Vorágine"],
    correctIndex: 2
  },
  {
    question: "¿Qué canción incluye la frase 'No quiero verte caer'?",
    options: ["Cae el Sol", "Colombina", "Será por Ti", "Nunca lo Olvides"],
    correctIndex: 2
  },
  {
    question: "¿En qué ciudad se formó Airbag?",
    options: ["Buenos Aires", "Rosario", "Córdoba", "Mendoza"],
    correctIndex: 0
  },
  {
    question: "¿Quién es el baterista de Airbag?",
    options: ["Gastón Sardelli", "Patricio Sardelli", "Guido Sardelli", "Cristian Prat"],
    correctIndex: 1
  },
  {
    question: "¿Qué álbum incluye la canción 'Colombina'?",
    options: ["Airbag", "Identidad", "Al Parecer Todo Ha Sido una Trampa", "Una Hora a Tokyo"],
    correctIndex: 2
  },
  {
    question: "¿Cuál fue el álbum lanzado en 2020?",
    options: ["Vorágine", "Libertad o Miedo", "Vivamos el Momento", "Abismo de Ilusión"],
    correctIndex: 3
  },
  {
    question: "¿Qué influencia musical principal tiene Airbag?",
    options: ["The Beatles", "Pink Floyd", "Led Zeppelin", "The Rolling Stones"],
    correctIndex: 1
  },
  {
    question: "¿Cuántos álbumes de estudio ha lanzado Airbag hasta 2020?",
    options: ["5", "6", "7", "8"],
    correctIndex: 3
  },
  {
    question: "¿Qué canción de Airbag fue usada en una película argentina?",
    options: ["Diez Días Después", "Colombina", "Cae el Sol", "Nunca lo Olvides"],
    correctIndex: 1
  },
  {
    question: "¿En qué año lanzaron el álbum 'Identidad'?",
    options: ["2007", "2009", "2011", "2013"],
    correctIndex: 1
  },
  {
    question: "¿Qué hermanos conforman Airbag?",
    options: ["Los Gieco", "Los Sardelli", "Los Calamaro", "Los Ciro"],
    correctIndex: 1
  },
  {
    question: "¿Cuál es una característica del sonido de Airbag?",
    options: ["Guitarras distorsionadas", "Sonidos atmosféricos y progresivos", "Ritmos latinos", "Voces operísticas"],
    correctIndex: 1
  }
];

export default function AirbagQuizGame({ onComplete, onClose }: AirbagQuizGameProps) {
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
      // Game is active - play airbag music
      audioManager.pause('christmas-music');
      audioManager.play('airbag-music', true);

      // Cleanup only when game is actually active
      return () => {
        audioManager.stop('airbag-music', true);
        audioManager.resume('christmas-music');
      };
    } else {
      // Game is not active - ensure airbag music is stopped
      audioManager.stop('airbag-music', true);
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
      {/* Compact Header - Moved lower to avoid overlap */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex items-start justify-center gap-3">
          {/* Left Column: Stats and Controls stacked */}
          <motion.div
            className="absolute left-4 top-0 flex flex-col gap-2"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Stats */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(153, 27, 27, 0.98) 0%, rgba(127, 29, 29, 0.98) 100%)',
                backdropFilter: 'blur(8px)',
                border: '2px solid rgba(239, 68, 68, 0.6)',
                borderRadius: '10px',
                padding: '6px 12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
            >
              <span style={{
                color: '#fecaca',
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
                background: 'linear-gradient(135deg, rgba(180, 83, 9, 0.98) 0%, rgba(146, 64, 14, 0.98) 100%)',
                backdropFilter: 'blur(8px)',
                border: '2px solid rgba(251, 191, 36, 0.6)',
                borderRadius: '10px',
                padding: '6px 12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
            >
              <span style={{
                color: '#fef3c7',
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
                ❌ {errors}/3
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 mt-1">
              <motion.button
                onClick={() => setShowInstructions(true)}
                style={{
                  background: 'linear-gradient(135deg, rgba(153, 27, 27, 0.98) 0%, rgba(127, 29, 29, 0.98) 100%)',
                  backdropFilter: 'blur(8px)',
                  border: '2px solid rgba(239, 68, 68, 0.6)',
                  borderRadius: '10px',
                  padding: '6px 12px',
                  color: '#fecaca',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  cursor: 'pointer',
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 6px 16px rgba(220, 38, 38, 0.5)' }}
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
          </motion.div>

          {/* Center: Title */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              background: 'linear-gradient(135deg, rgba(153, 27, 27, 0.98) 0%, rgba(127, 29, 29, 0.98) 100%)',
              backdropFilter: 'blur(8px)',
              border: '2px solid rgba(239, 68, 68, 0.6)',
              borderRadius: '10px',
              padding: '8px 18px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          >
            <p style={{
              color: '#fecaca',
              fontFamily: 'Georgia, serif',
              fontSize: '14px',
              fontWeight: '600',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.6)',
              margin: 0,
              whiteSpace: 'nowrap',
            }}>
              🎸 Quiz de Airbag 🎵
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contenedor del quiz */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl w-full px-8">
        {/* Barra de progreso compacta */}
        <div className="w-full bg-gray-800/50 backdrop-blur-sm rounded-full h-1.5 mb-6 border border-gray-700/50">
          <motion.div
            className="bg-gradient-to-r from-red-600 to-red-400 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            style={{
              boxShadow: '0 0 8px rgba(220, 38, 38, 0.6)',
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
            className="bg-gradient-to-br from-red-900/90 to-red-800/90 rounded-2xl p-6 mb-4 border border-red-600/40"
            style={{
              boxShadow: '0 4px 20px rgba(220, 38, 38, 0.3)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <h3
              className="text-xl text-amber-100 text-center leading-relaxed"
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
                    borderColor: 'rgba(239, 68, 68, 0.6)',
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
              className="relative max-w-full max-h-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src="/assets/instructions/airbag-game.webp"
                alt="Instrucciones del juego de Airbag"
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                style={{
                  boxShadow: '0 0 40px rgba(220, 38, 38, 0.6)',
                }}
              />
              <button
                onClick={() => setShowInstructions(false)}
                className="absolute top-2 right-2 bg-red-700 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white shadow-lg"
              >
                ✕
              </button>
              <p className="text-center text-red-200 mt-3 text-sm">
                Click para cerrar
              </p>
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
                  Puntaje: {score}/{QUESTIONS.length} 🎸
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
                  Fallaste más de 3 preguntas
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
