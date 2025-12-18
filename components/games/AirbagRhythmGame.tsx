"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '@/lib/audioManager';

interface AirbagRhythmGameProps {
  onComplete: () => void;
  onClose: () => void;
}

type Instrument = 'guitar' | 'drums' | 'bass';

interface InstrumentButton {
  id: Instrument;
  label: string;
  emoji: string;
  color: string;
  activeColor: string;
}

const INSTRUMENTS: InstrumentButton[] = [
  {
    id: 'guitar',
    label: 'Guitarra',
    emoji: '🎸',
    color: 'from-red-700 to-red-900',
    activeColor: 'from-red-400 to-red-600'
  },
  {
    id: 'drums',
    label: 'Batería',
    emoji: '🥁',
    color: 'from-amber-700 to-amber-900',
    activeColor: 'from-amber-400 to-amber-600'
  },
  {
    id: 'bass',
    label: 'Bajo',
    emoji: '🎸',
    color: 'from-purple-700 to-purple-900',
    activeColor: 'from-purple-400 to-purple-600'
  },
];

const WINNING_LEVEL = 5; // Completar 5 secuencias para ganar

export default function AirbagRhythmGame({ onComplete, onClose }: AirbagRhythmGameProps) {
  const [sequence, setSequence] = useState<Instrument[]>([]);
  const [userSequence, setUserSequence] = useState<Instrument[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeInstrument, setActiveInstrument] = useState<Instrument | null>(null);
  const [level, setLevel] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [canPlay, setCanPlay] = useState(false);

  // Generar nueva secuencia al inicio o al subir de nivel
  const generateSequence = useCallback(() => {
    const newSequence = [...sequence];
    const randomInstrument = INSTRUMENTS[Math.floor(Math.random() * INSTRUMENTS.length)].id;
    newSequence.push(randomInstrument);
    setSequence(newSequence);
    setUserSequence([]);
    setCanPlay(false);
  }, [sequence]);

  // Iniciar el juego con la primera secuencia
  useEffect(() => {
    if (sequence.length === 0) {
      const firstInstrument = INSTRUMENTS[Math.floor(Math.random() * INSTRUMENTS.length)].id;
      setSequence([firstInstrument]);
    }
  }, [sequence.length]);

  // Reproducir la secuencia actual
  const playSequence = useCallback(async () => {
    if (sequence.length === 0) return;

    setIsPlaying(true);
    setCanPlay(false);

    for (let i = 0; i < sequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveInstrument(sequence[i]);
      audioManager.play('click');
      await new Promise(resolve => setTimeout(resolve, 400));
      setActiveInstrument(null);
    }

    setIsPlaying(false);
    setCanPlay(true);
  }, [sequence]);

  // Reproducir secuencia cuando cambia
  useEffect(() => {
    if (sequence.length > 0 && !isGameOver && !isComplete) {
      playSequence();
    }
  }, [sequence, isGameOver, isComplete, playSequence]);

  // Manejar click en instrumento
  const handleInstrumentClick = (instrument: Instrument) => {
    if (!canPlay || isPlaying) return;

    const newUserSequence = [...userSequence, instrument];
    setUserSequence(newUserSequence);

    // Efecto visual y sonoro
    setActiveInstrument(instrument);
    audioManager.play('click');
    setTimeout(() => setActiveInstrument(null), 300);

    // Verificar si el jugador se equivocó
    const currentIndex = newUserSequence.length - 1;
    if (newUserSequence[currentIndex] !== sequence[currentIndex]) {
      // Error!
      audioManager.play('wrong');
      setIsGameOver(true);
      return;
    }

    // Verificar si completó la secuencia
    if (newUserSequence.length === sequence.length) {
      audioManager.play('success');

      // Verificar si ganó el juego
      if (level >= WINNING_LEVEL) {
        setIsComplete(true);
        setTimeout(() => {
          onComplete();
        }, 2000);
      } else {
        // Subir de nivel
        setTimeout(() => {
          setLevel(prev => prev + 1);
          generateSequence();
        }, 1000);
      }
    }
  };

  const handleRestart = () => {
    setSequence([]);
    setUserSequence([]);
    setLevel(1);
    setIsGameOver(false);
    setIsComplete(false);
    setCanPlay(false);
    audioManager.play('click');
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
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url(/assets/airbag/airbag.png)',
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
            <span className="text-red-200 font-semibold text-sm">Nivel: {level}/{WINNING_LEVEL}</span>
          </div>
          <div
            className="bg-amber-900/90 border-2 border-amber-600 px-3 py-1.5 rounded-lg"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            <span className="text-amber-200 font-semibold text-sm">Secuencia: {sequence.length}</span>
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
            onClick={handleRestart}
            className="bg-amber-800/90 border-2 border-amber-600 px-3 py-1.5 rounded-lg text-amber-200 hover:bg-amber-700 transition-colors text-sm"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '500' }}
          >
            Reiniciar
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

      {/* Contenedor del juego */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <motion.h2
          className="text-3xl text-red-400 mb-6"
          style={{
            textShadow: '0 0 20px rgba(248, 113, 113, 0.5)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: '600'
          }}
        >
          🎵 Airbag Rhythm 🎸
        </motion.h2>

        {/* Estado del juego */}
        <div className="mb-8">
          {isPlaying && (
            <motion.p
              className="text-amber-300 text-lg"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              🎼 Observa la secuencia...
            </motion.p>
          )}
          {canPlay && !isPlaying && (
            <motion.p
              className="text-green-300 text-lg"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ✨ ¡Tu turno! Repite la secuencia
            </motion.p>
          )}
          {!canPlay && !isPlaying && (
            <motion.p
              className="text-gray-400 text-lg"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Preparando...
            </motion.p>
          )}
        </div>

        {/* Instrumentos */}
        <div className="flex gap-6">
          {INSTRUMENTS.map((instrument) => {
            const isActive = activeInstrument === instrument.id;
            const colorClass = isActive ? instrument.activeColor : instrument.color;

            return (
              <motion.button
                key={instrument.id}
                onClick={() => handleInstrumentClick(instrument.id)}
                className={`relative bg-gradient-to-br ${colorClass} rounded-2xl p-8 border-4 ${
                  isActive ? 'border-white' : 'border-white/30'
                } transition-all`}
                style={{
                  width: '140px',
                  height: '140px',
                  boxShadow: isActive
                    ? '0 0 40px rgba(255, 255, 255, 0.8), 0 10px 30px rgba(0,0,0,0.5)'
                    : '0 10px 30px rgba(0,0,0,0.5)',
                  cursor: canPlay && !isPlaying ? 'pointer' : 'not-allowed',
                  opacity: canPlay && !isPlaying ? 1 : 0.6,
                }}
                whileHover={canPlay && !isPlaying ? { scale: 1.05 } : {}}
                whileTap={canPlay && !isPlaying ? { scale: 0.95 } : {}}
                animate={isActive ? {
                  scale: [1, 1.1, 1],
                } : {}}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-5xl mb-2">{instrument.emoji}</div>
                  <div
                    className="text-white text-sm font-semibold"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    {instrument.label}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Progreso del usuario */}
        <div className="mt-8 flex gap-2">
          {sequence.map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 ${
                index < userSequence.length
                  ? userSequence[index] === sequence[index]
                    ? 'bg-green-400 border-green-600'
                    : 'bg-red-400 border-red-600'
                  : 'bg-gray-700 border-gray-500'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Superposición de instrucciones */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/90 z-20 p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInstructions(false)}
          >
            <motion.div
              className="relative bg-gradient-to-br from-red-900 via-amber-900 to-purple-900 rounded-2xl p-8 border-4 border-red-600 max-w-md"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                boxShadow: '0 0 60px rgba(220, 38, 38, 0.6)',
              }}
            >
              <h3
                className="text-2xl text-red-300 mb-4 text-center"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '600' }}
              >
                🎵 Cómo Jugar
              </h3>
              <div
                className="text-amber-100 space-y-3 text-sm leading-relaxed"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                <p>1. 👀 Observa la secuencia de instrumentos que se ilumina</p>
                <p>2. 🎸 Repite la secuencia en el mismo orden haciendo click en los instrumentos</p>
                <p>3. 📈 Cada nivel añade un instrumento más a la secuencia</p>
                <p>4. 🏆 Completa {WINNING_LEVEL} niveles para ganar</p>
                <p className="text-red-300 mt-4">⚠️ Si te equivocas, el juego termina!</p>
              </div>
              <button
                onClick={() => setShowInstructions(false)}
                className="mt-6 w-full py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg border-2 border-red-500 transition-colors"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '500' }}
              >
                ¡Entendido!
              </button>
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
                  ¡Secuencia Incorrecta!
                </h3>
                <p
                  className="text-red-100 text-base mb-6"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  Llegaste al nivel {level}
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
                  ¡Ritmo Perfecto!
                </h3>
                <p
                  className="text-green-100 text-base"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  Completaste todos los niveles 🎸
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
