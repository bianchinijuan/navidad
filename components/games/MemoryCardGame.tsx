"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '@/lib/audioManager';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryCardGameProps {
  onComplete: () => void;
  onClose: () => void;
}

const cardEmojis = ['🦴', '🎄', '🎁']; // Solo 3 pares para una cuadrícula más pequeña

export default function MemoryCardGame({ onComplete, onClose }: MemoryCardGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Music management
  useEffect(() => {
    if (!showInstructions) {
      // Game is active - play taylor music
      audioManager.pause('christmas-music');
      audioManager.play('taylor-room', true);

      // Cleanup only when game is actually active
      return () => {
        audioManager.stop('taylor-room', true);
        audioManager.resume('christmas-music');
      };
    } else {
      // Game is not active - ensure taylor music is stopped
      audioManager.stop('taylor-room', true);
      audioManager.resume('christmas-music');
    }
  }, [showInstructions]);

  // Inicializar cartas
  useEffect(() => {
    const doubled = [...cardEmojis, ...cardEmojis];
    const shuffled = doubled
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
  }, []);

  // Verificar coincidencias
  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true);
      const [first, second] = flippedCards;

      if (cards[first].emoji === cards[second].emoji) {
        // ¡Coincidencia encontrada!
        setTimeout(() => {
          setCards(prev => prev.map((card, index) =>
            index === first || index === second
              ? { ...card, isMatched: true }
              : card
          ));
          setMatches(prev => prev + 1);
          setFlippedCards([]);
          setIsChecking(false);
        }, 600);
      } else {
        // Sin coincidencia
        setTimeout(() => {
          setCards(prev => prev.map((card, index) =>
            index === first || index === second
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
          setIsChecking(false);
        }, 1200);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedCards, cards]);

  // Verificar si el juego se ganó
  useEffect(() => {
    if (matches === 3 && cards.length > 0) {
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  }, [matches, onComplete, cards.length]);

  const handleCardClick = (index: number) => {
    if (
      isChecking ||
      flippedCards.length >= 2 ||
      cards[index].isFlipped ||
      cards[index].isMatched
    ) {
      return;
    }

    setCards(prev => prev.map((card, i) =>
      i === index ? { ...card, isFlipped: true } : card
    ));
    setFlippedCards(prev => [...prev, index]);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative bg-gradient-to-br from-red-900 via-red-800 to-amber-900 rounded-2xl p-6 border-4 border-amber-600"
        style={{
          maxWidth: '420px',
          width: '75vw',
          boxShadow: '0 0 60px rgba(217, 119, 6, 0.5)',
        }}
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
      >
        {/* Encabezado */}
        <div className="relative text-center mb-6">
          {/* Botón de instrucciones */}
          <button
            onClick={() => setShowInstructions(true)}
            className="absolute left-0 top-0 bg-amber-700/50 hover:bg-amber-600/70 text-white rounded-full w-8 h-8 flex items-center justify-center border border-amber-400/50 transition-colors"
            title="Ver instrucciones"
          >
            ❓
          </button>

          <h2
            className="text-2xl text-amber-100 mb-2"
            style={{
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: '600'
            }}
          >
            🐕 Memory Game 🎄
          </h2>
          <p
            className="text-amber-200 text-xs"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Find all matching pairs!
          </p>

          {/* Estadísticas */}
          <div className="flex justify-center gap-6 mt-4 text-amber-100">
            <div
              className="bg-amber-900/30 px-3 py-1.5 rounded-lg border border-amber-600/30"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              <span className="text-xs opacity-75">Moves:</span>
              <span className="ml-2 font-semibold text-base">{moves}</span>
            </div>
            <div
              className="bg-amber-900/30 px-3 py-1.5 rounded-lg border border-amber-600/30"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              <span className="text-xs opacity-75">Pairs:</span>
              <span className="ml-2 font-semibold text-base">{matches}/3</span>
            </div>
          </div>
        </div>

        {/* Cuadrícula del juego - 3x2 (más pequeña) */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {cards.map((card, index) => (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className="relative aspect-square rounded-xl cursor-pointer"
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
              }}
              whileHover={!card.isFlipped && !card.isMatched ? { scale: 1.05 } : {}}
              whileTap={!card.isFlipped && !card.isMatched ? { scale: 0.95 } : {}}
            >
              <motion.div
                className="absolute inset-0 w-full h-full"
                style={{
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  rotateY: card.isFlipped || card.isMatched ? 180 : 0,
                }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                {/* Reverso de la carta */}
                <div
                  className="absolute inset-0 rounded-xl flex items-center justify-center"
                  style={{
                    backfaceVisibility: 'hidden',
                    background: 'linear-gradient(135deg, #B91C1C 0%, #7C2D12 100%)',
                    border: '3px solid #D97706',
                    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  <div className="text-3xl opacity-30">🎁</div>
                </div>

                {/* Frente de la carta */}
                <div
                  className="absolute inset-0 rounded-xl flex items-center justify-center"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: card.isMatched
                      ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
                      : 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                    border: card.isMatched ? '3px solid #10B981' : '3px solid #D97706',
                    boxShadow: card.isMatched
                      ? '0 0 20px rgba(16, 185, 129, 0.5)'
                      : 'inset 0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  <motion.div
                    className="text-4xl"
                    animate={card.isMatched ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {card.emoji}
                  </motion.div>
                </div>
              </motion.div>
            </motion.button>
          ))}
        </div>

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-amber-900/50 hover:bg-amber-900/70 text-amber-100 rounded-lg border border-amber-600/50 transition-colors text-sm"
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: '500'
          }}
        >
          Close
        </button>

        {/* Superposición de instrucciones */}
        <AnimatePresence>
          {showInstructions && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/90 rounded-2xl z-10 p-4"
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
                  src="/assets/instructions/memory-game.png"
                  alt="Instrucciones del Memory Game"
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                  style={{
                    boxShadow: '0 0 40px rgba(217, 119, 6, 0.6)',
                  }}
                />
                <button
                  onClick={() => setShowInstructions(false)}
                  className="absolute top-2 right-2 bg-amber-700 hover:bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white shadow-lg"
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

        {/* Mensaje de finalización */}
        <AnimatePresence>
          {matches === 3 && cards.length > 0 && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gradient-to-br from-green-600 to-green-800 px-8 py-6 rounded-2xl border-3 border-green-400"
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                style={{ maxWidth: '280px' }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">🎉</div>
                  <h3
                    className="text-xl text-white mb-2"
                    style={{
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      fontWeight: '600'
                    }}
                  >
                    Completed!
                  </h3>
                  <p
                    className="text-green-100 text-sm"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    Moves: {moves}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
