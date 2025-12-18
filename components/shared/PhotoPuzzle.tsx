"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { audioManager } from '@/lib/audioManager';

export default function PhotoPuzzle() {
  const {
    photoFragments,
    allFragmentsCollected,
    photoRevealed,
    revealPhoto,
  } = useGameStore();

  const [showFlip, setShowFlip] = useState(false);

  useEffect(() => {
    if (allFragmentsCollected && !photoRevealed) {
      // Esperar un momento antes del flip
      setTimeout(() => {
        setShowFlip(true);
        audioManager.play('success');

        // Revelar la foto después del flip
        setTimeout(() => {
          revealPhoto();
        }, 1000);
      }, 500);
    }
  }, [allFragmentsCollected, photoRevealed, revealPhoto]);

  // Grid 3x1 (3 filas, 1 columna) - TEMPORAL para testing con 3 fragmentos
  const gridPositions = [
    { row: 0, col: 0 }, // Fragment 1
    { row: 1, col: 0 }, // Fragment 2
    { row: 2, col: 0 }, // Fragment 3
  ];

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
      {/* Título */}
      <div className="absolute top-8 left-0 right-0 text-center">
        <motion.h2
          className="text-3xl text-amber-400 mb-2"
          style={{
            textShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
            fontFamily: 'Georgia, serif',
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {photoRevealed ? 'Nuestra Memoria' : 'Fragmentos Coleccionados'}
        </motion.h2>
        <motion.p
          className="text-amber-200 text-sm"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {photoRevealed
            ? 'La combinación completa está revelada'
            : `${photoFragments.filter(f => f.collected).length}/6 fragmentos`}
        </motion.p>
      </div>

      {/* Photo Puzzle Container */}
      <motion.div
        className="relative"
        style={{
          perspective: '1000px',
        }}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.3 }}
      >
        {/* The Card with Flip Effect */}
        <motion.div
          className="relative"
          style={{
            width: '420px',
            height: '630px',
            transformStyle: 'preserve-3d',
          }}
          animate={{
            rotateY: showFlip ? 180 : 0,
          }}
          transition={{
            duration: 1,
            ease: 'easeInOut',
          }}
        >
          {/* Back Side - Fragment Grid with Numbers */}
          <div
            className="absolute inset-0 backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              backgroundColor: '#f8f8f8',
              borderRadius: '12px',
              padding: '8px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            }}
          >
            {/* Grid 3x1 - TEMPORAL */}
            <div
              style={{
                display: 'grid',
                gridTemplateRows: 'repeat(3, 1fr)',
                gridTemplateColumns: '1fr',
                gap: '8px',
                height: '100%',
              }}
            >
              {photoFragments.map((fragment, index) => {
                const position = gridPositions[index];
                const isCollected = fragment.collected;

                return (
                  <motion.div
                    key={fragment.id}
                    className="relative flex items-center justify-center"
                    style={{
                      // Dorso de foto - papel beige/crema con textura sutil
                      background: isCollected
                        ? 'linear-gradient(135deg, #f5f0e8 0%, #ebe5dc 50%, #f5f0e8 100%)'
                        : '#d1d1d1',
                      borderRadius: '4px',
                      border: isCollected ? '1px solid #d4c5b0' : '1px solid #999',
                      boxShadow: isCollected
                        ? '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)'
                        : '0 2px 8px rgba(0,0,0,0.2)',
                      // Textura de papel fotográfico
                      backgroundImage: isCollected
                        ? `repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 2px,
                            rgba(0,0,0,0.02) 2px,
                            rgba(0,0,0,0.02) 4px
                          )`
                        : 'none',
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {isCollected ? (
                      <motion.div
                        className="text-center w-full h-full flex flex-col items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', bounce: 0.5 }}
                      >
                        {/* Número escrito a mano en el dorso */}
                        <div
                          className="text-8xl font-bold"
                          style={{
                            fontFamily: 'Brush Script MT, cursive',
                            color: '#2c2c2c',
                            textShadow: '1px 1px 0px rgba(0,0,0,0.1)',
                            transform: 'rotate(-2deg)',
                          }}
                        >
                          {fragment.number}
                        </div>
                        {/* Pequeña marca en la esquina */}
                        <div
                          className="absolute bottom-2 right-2 text-xs"
                          style={{
                            fontFamily: 'Courier New, monospace',
                            color: '#8a8a8a',
                            opacity: 0.6,
                          }}
                        >
                          #{fragment.id}
                        </div>
                      </motion.div>
                    ) : (
                      <div
                        className="text-5xl"
                        style={{
                          color: '#999',
                        }}
                      >
                        ?
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Front Side - Complete Photo */}
          <div
            className="absolute inset-0 backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            }}
          >
            <img
              src="/assets/hub/couple.jpeg"
              alt="Juan y Lucía"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />

            {/* Overlay with combination */}
            {photoRevealed && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <div className="text-center">
                  <p
                    className="text-amber-200 text-sm mb-2"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    Combinación completa
                  </p>
                  <div
                    className="flex justify-center gap-2"
                    style={{ fontFamily: 'monospace' }}
                  >
                    {photoFragments.map((fragment) => (
                      <div
                        key={fragment.id}
                        className="bg-amber-500 text-white px-4 py-2 rounded-lg text-2xl font-bold"
                        style={{
                          boxShadow: '0 4px 12px rgba(251, 191, 36, 0.4)',
                        }}
                      >
                        {fragment.number}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Instruction Text */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p
          className="text-amber-300 text-sm"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          {photoRevealed
            ? 'Recuerda esta combinación para abrir la puerta final 🗝️'
            : 'Completa todos los rooms para revelar la foto completa 🎁'}
        </p>
      </motion.div>
    </motion.div>
  );
}
