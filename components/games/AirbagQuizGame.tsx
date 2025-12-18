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

      // Verificar si perdió (más de 3 errores)
      if (newErrors > 3) {
        setTimeout(() => {
          setIsGameOver(true);
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
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/assets/airbag/airbag.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Encabezado */}
      <div className="absolute top-4 left-0 right-0 flex justify-between items-center px-8 z-10">
        <div className="flex gap-6">
          <div
            className="bg-red-900/90 border-2 border-red-600 px-3 py-1.5 rounded-lg"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            <span className="text-red-200 font-semibold text-sm">Pregunta {currentQuestion + 1}/{QUESTIONS.length}</span>
          </div>
          <div
            className="bg-amber-900/90 border-2 border-amber-600 px-3 py-1.5 rounded-lg"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            <span className="text-amber-200 font-semibold text-sm">Puntaje: {score}/{QUESTIONS.length}</span>
          </div>
          <div
            className={`border-2 px-3 py-1.5 rounded-lg ${
              errors >= 3 ? 'bg-red-700/90 border-red-500' : 'bg-gray-800/90 border-gray-600'
            }`}
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            <span className={`font-semibold text-sm ${errors >= 3 ? 'text-red-200' : 'text-gray-200'}`}>
              Errores: {errors}/3
            </span>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowInstructions(true)}
            className="bg-red-700/90 hover:bg-red-600/90 border-2 border-red-500 px-3 py-1.5 rounded-lg text-red-100 transition-colors text-sm"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '500' }}
            title="Ver instrucciones"
          >
            ❓
          </button>
          <button
            onClick={onClose}
            className="bg-gray-800/90 border-2 border-gray-600 px-3 py-1.5 rounded-lg text-gray-200 hover:bg-gray-700 transition-colors text-sm"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '500' }}
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Contenedor del quiz */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl w-full px-8">
        <motion.h2
          className="text-3xl text-red-400 mb-8"
          style={{
            textShadow: '0 0 20px rgba(248, 113, 113, 0.5)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: '600'
          }}
        >
          🎸 Quiz de Airbag 🎵
        </motion.h2>

        {/* Barra de progreso */}
        <div className="w-full bg-gray-800 rounded-full h-2 mb-8">
          <motion.div
            className="bg-gradient-to-r from-red-600 to-red-400 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Pregunta actual */}
        <motion.div
          key={currentQuestion}
          className="bg-gradient-to-br from-red-900/90 to-amber-900/90 rounded-2xl p-8 border-4 border-red-600 w-full"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          style={{
            boxShadow: '0 0 60px rgba(220, 38, 38, 0.6)',
          }}
        >
          <h3
            className="text-xl text-amber-100 mb-6 text-center"
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: '600'
            }}
          >
            {currentQ.question}
          </h3>

          {/* Opciones */}
          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQ.correctIndex;
              const showCorrectAnswer = selectedAnswer !== null;

              let bgColor = 'from-gray-700 to-gray-800';
              let borderColor = 'border-gray-600';
              let textColor = 'text-white';

              if (showCorrectAnswer) {
                if (isCorrect) {
                  bgColor = 'from-green-600 to-green-700';
                  borderColor = 'border-green-400';
                } else if (isSelected && !isCorrect) {
                  bgColor = 'from-red-600 to-red-700';
                  borderColor = 'border-red-400';
                }
              }

              return (
                <motion.button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  className={`w-full p-4 bg-gradient-to-r ${bgColor} rounded-lg border-2 ${borderColor} ${textColor} text-left transition-all`}
                  style={{
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontWeight: '500',
                    cursor: selectedAnswer !== null ? 'not-allowed' : 'pointer',
                  }}
                  whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
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
                    selectedAnswer === currentQ.correctIndex ? 'text-green-300' : 'text-red-300'
                  }`}
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
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
                src="/assets/instructions/airbag-game.png"
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
