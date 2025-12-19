"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { audioManager } from '@/lib/audioManager';
import NavigationArrow from '../shared/NavigationArrow';
import ZodiacElementGame from '../games/ZodiacElementGame';

export default function MotherRoom() {
  const {
    setScene,
    roomsCompleted,
    completeRoom,
    revealNumber,
  } = useGameStore();
  const [showGame, setShowGame] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showNumberReveal, setShowNumberReveal] = useState(false);

  const isRoomCompleted = roomsCompleted.mother;

  // Mother room revela el número 2
  const roomNumber = 2;

  useEffect(() => {
    audioManager.play('hub-ambient', true);

    return () => {
      audioManager.stop('hub-ambient', true);
    };
  }, []);

  const handleToBrother = () => {
    audioManager.stop('hub-ambient', true);
    audioManager.play('door-open');
    setScene('brother');
  };

  const handleAltarClick = () => {
    // If room is already completed, just show the card again
    if (isRoomCompleted) {
      audioManager.play('mouse-click');
      audioManager.play('achievement');
      setShowCard(true);
      return;
    }

    // Otherwise, start the game
    audioManager.play('mouse-click');
    setShowGame(true);
  };

  const handleGameComplete = () => {
    setShowGame(false);

    // Mark room as completed
    completeRoom('mother');
    
    // Reveal number
    revealNumber('Zodíaco', roomNumber);

    // Show number reveal animation
    setTimeout(() => {
      audioManager.play('unlock');
      setShowNumberReveal(true);
    }, 300);

    // Then show card
    setTimeout(() => {
      setShowNumberReveal(false);
      audioManager.play('achievement'); // Play achievement when showing reward
      setShowCard(true);
    }, 3500);
  };

  const handleCloseGame = () => {
    setShowGame(false);
  };

  const handleCardClick = () => {
    audioManager.play('mouse-click');
    setShowCard(false);
  };

  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #8B1538 0%, #A52A2A 25%, #C41E3A 50%, #A52A2A 75%, #8B1538 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
      }}
    >
      {/* Christmas snowflake pattern overlay */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' opacity='0.8'%3E%3Cpath d='M50 10 L50 90 M10 50 L90 50 M20 20 L80 80 M80 20 L20 80' stroke='%23ffffff' stroke-width='1.5' fill='none'/%3E%3Ccircle cx='50' cy='50' r='3' fill='%23ffffff'/%3E%3Ccircle cx='50' cy='20' r='2' fill='%23ffffff'/%3E%3Ccircle cx='50' cy='80' r='2' fill='%23ffffff'/%3E%3Ccircle cx='20' cy='50' r='2' fill='%23ffffff'/%3E%3Ccircle cx='80' cy='50' r='2' fill='%23ffffff'/%3E%3Cpath d='M30 30 L35 35 M70 30 L65 35 M30 70 L35 65 M70 70 L65 65' stroke='%23ffffff' stroke-width='1.5'/%3E%3C/g%3E%3Cg transform='translate(15,15)' fill='%23ffffff' opacity='0.4'%3E%3Cpath d='M0 0 L3 3 M0 3 L3 0' stroke='%23ffffff' stroke-width='1'/%3E%3C/g%3E%3Cg transform='translate(85,25)' fill='%23ffffff' opacity='0.5'%3E%3Ccircle cx='0' cy='0' r='1.5'/%3E%3C/g%3E%3Cg transform='translate(25,85)' fill='%23ffffff' opacity='0.6'%3E%3Ccircle cx='0' cy='0' r='2'/%3E%3C/g%3E%3Cg transform='translate(75,75)' fill='%23ffffff' opacity='0.4'%3E%3Cpath d='M0 -3 L0 3 M-3 0 L3 0' stroke='%23ffffff' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }}
      />


      {/* Zodiac Element Game */}
      <AnimatePresence>
        {showGame && !isRoomCompleted && (
          <ZodiacElementGame
            onComplete={handleGameComplete}
            onClose={handleCloseGame}
          />
        )}
      </AnimatePresence>

      {/* Number Reveal - Compact Notification */}
      <AnimatePresence>
        {showNumberReveal && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-500 rounded-2xl p-8 border-4 border-amber-300"
              style={{
                boxShadow: '0 0 60px rgba(251, 191, 36, 0.8)',
                maxWidth: '400px',
              }}
              initial={{ scale: 0.5, rotateY: -90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.5, rotateY: 90 }}
              transition={{ type: "spring", bounce: 0.3 }}
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-6" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)', fontFamily: 'Georgia, serif' }}>
                  Número Revelado
                </h3>

                {/* Number display */}
                <motion.div
                  className="w-24 h-32 rounded-xl border-4 flex items-center justify-center bg-amber-500/30 border-amber-400 mx-auto mb-4"
                  style={{
                    boxShadow: '0 4px 20px rgba(217, 119, 6, 0.4)',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div
                    className="text-7xl font-bold text-amber-100"
                    style={{
                      fontFamily: 'monospace',
                    }}
                  >
                    {roomNumber}
                  </div>
                </motion.div>

                <p className="text-sm text-amber-50" style={{ fontFamily: 'Georgia, serif' }}>
                  Recuerda este número
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Overlay */}
      <AnimatePresence>
        {showCard && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative cursor-pointer"
              onClick={handleCardClick}
              initial={{ scale: 0.5, rotateY: 90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.5, rotateY: 90 }}
              transition={{ duration: 0.5, type: "spring" }}
              whileHover={{ scale: 1.05 }}
              style={{
                maxWidth: '400px',
                width: '80vw',
              }}
            >
              {/* Pasionaria card image */}
              <img
                src="/assets/mother/pasionaria.webp"
                alt="Pasionaria Unlocked"
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '12px',
                  boxShadow: '0 0 40px rgba(168, 85, 247, 0.6)',
                }}
              />
              <p className="text-center text-white mt-4 text-sm">
                ¡Pasionaria desbloqueada! Click para cerrar
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
