"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { audioManager } from '@/lib/audioManager';
import NavigationArrow from '../shared/NavigationArrow';
import TaylorAlbumSort from '../games/TaylorAlbumSort';

export default function BedroomRoom() {
  const {
    setScene,
    collectFragment,
    photoFragments,
    roomsCompleted,
    completeRoom,
  } = useGameStore();
  const [showGame, setShowGame] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showFragmentReveal, setShowFragmentReveal] = useState(false);

  const isRoomCompleted = roomsCompleted.bedroom;

  // Bedroom room revela el fragmento 3
  const fragment = photoFragments.find(f => f.roomId === 'bedroom')!;

  useEffect(() => {
    audioManager.play('hub-ambient', true);

    return () => {
      audioManager.stop('hub-ambient', true);
    };
  }, []);

  const handleBackToDog = () => {
    audioManager.stop('hub-ambient', true);
    audioManager.play('door-open');
    setScene('dog');
  };

  const handleToAirbag = () => {
    audioManager.stop('hub-ambient', true);
    audioManager.play('door-open');
    setScene('airbag');
  };

  const handleRivenClick = () => {
    // If room is already completed, just show the card again
    if (isRoomCompleted) {
      audioManager.play('click');
      setShowCard(true);
      return;
    }

    // Otherwise, start the game
    audioManager.play('click');
    setShowGame(true);
  };

  const handleGameComplete = () => {
    setShowGame(false);

    // Collect fragment if not already collected
    if (!fragment.collected) {
      collectFragment(fragment.id);
    }

    // Mark room as completed
    completeRoom('bedroom');

    // Show fragment reveal animation
    setTimeout(() => {
      setShowFragmentReveal(true);
    }, 300);

    // Then show card
    setTimeout(() => {
      setShowFragmentReveal(false);
      setShowCard(true);
    }, 3500);
  };

  const handleCloseGame = () => {
    setShowGame(false);
  };

  const handleCardClick = () => {
    audioManager.play('click');
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

      {/* Container wrapper for frame and arrows */}
      <div className="relative flex items-center justify-center gap-20">
        {/* Left arrow - back to Dog */}
        <NavigationArrow
          direction="left"
          onClick={handleBackToDog}
          useAbsolutePosition={false}
        />

        {/* Frame container */}
        <motion.div
          className="relative"
          style={{
            width: '42vw',
            maxWidth: '630px',
            border: '20px solid #4A2511',
            borderRadius: '8px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.3)',
            background: 'linear-gradient(135deg, #5C3317 0%, #4A2511 100%)',
            padding: '8px',
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Room image - changes based on completion */}
          <img
            src={isRoomCompleted ? "/assets/bedroom/bedroom-final.png" : "/assets/bedroom/bedroom.png"}
            alt="Bedroom with Riven"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              borderRadius: '4px',
            }}
          />

          {/* Clickable Riven (dog) area */}
          <motion.div
            onClick={handleRivenClick}
            className="group"
            style={{
              position: 'absolute',
              right: '30%',
              bottom: '28%',
              width: '25%',
              height: '20%',
              cursor: 'pointer',
              borderRadius: '8px',
              backgroundColor: 'transparent',
            }}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.05 }}
          >
            {/* Tooltip personalizado */}
            <motion.div
              className="absolute -top-14 pointer-events-none opacity-0 group-hover:opacity-100"
              initial={{ y: 10, scale: 0.9 }}
              whileHover={{ y: 0, scale: 1 }}
              transition={{ duration: 0.3, type: "spring" }}
              style={{
                left: '55%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.95), rgba(236, 72, 153, 0.95))',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '10px',
                boxShadow: '0 0 25px rgba(168, 85, 247, 0.5), 0 8px 32px rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
                padding: '8px 20px',
              }}
            >
              <div className="text-center" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                <div
                  className="text-sm whitespace-nowrap"
                  style={{
                    color: '#FFFFFF',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                    fontWeight: '600',
                  }}
                >
                  {isRoomCompleted ? "Ver carta" : "Clickea a Riven"}
                </div>
              </div>
              {/* Arrow decorativo */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                <div
                  className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent"
                  style={{
                    borderTopColor: 'rgba(236, 72, 153, 0.95)',
                    borderLeftWidth: '6px',
                    borderRightWidth: '6px',
                    borderTopWidth: '6px',
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                  }}
                ></div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right arrow - to Airbag */}
        <NavigationArrow
          direction="right"
          onClick={handleToAirbag}
          useAbsolutePosition={false}
        />
      </div>

      {/* Taylor Album Sorting Game - Only show if not completed */}
      <AnimatePresence>
        {showGame && !isRoomCompleted && (
          <TaylorAlbumSort
            onComplete={handleGameComplete}
            onClose={handleCloseGame}
          />
        )}
      </AnimatePresence>

      {/* Fragment Reveal Overlay */}
      <AnimatePresence>
        {showFragmentReveal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: -50 }}
              transition={{ type: "spring", bounce: 0.4 }}
            >
              <motion.div
                className="mb-6"
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                <div className="text-6xl mb-4">🧩</div>
              </motion.div>

              <h2 className="text-4xl font-bold text-amber-400 mb-4" style={{ textShadow: '0 0 20px rgba(251, 191, 36, 0.5)', fontFamily: 'Georgia, serif' }}>
                ¡Fragmento Encontrado!
              </h2>

              <p className="text-amber-200 mb-6 text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                Fragmento #{fragment.id} revelado
              </p>

              {/* Fragment display - dorso de foto */}
              <motion.div
                className="rounded-lg mx-auto relative"
                style={{
                  background: 'linear-gradient(135deg, #f5f0e8 0%, #ebe5dc 50%, #f5f0e8 100%)',
                  border: '1px solid #d4c5b0',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5)',
                  maxWidth: '280px',
                  padding: '48px 32px',
                  backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)`,
                }}
                animate={{
                  boxShadow: [
                    '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5)',
                    '0 12px 40px rgba(251, 191, 36, 0.4), inset 0 1px 0 rgba(255,255,255,0.6)',
                    '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  className="text-9xl font-bold"
                  style={{
                    fontFamily: 'Brush Script MT, cursive',
                    color: '#2c2c2c',
                    textShadow: '2px 2px 0px rgba(0,0,0,0.1)',
                    transform: 'rotate(-3deg)',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {fragment.number}
                </motion.div>
                <div className="absolute bottom-3 right-3 text-xs" style={{ fontFamily: 'Courier New, monospace', color: '#8a8a8a', opacity: 0.6 }}>
                  Fragmento {fragment.id}/6
                </div>
              </motion.div>

              <p className="text-amber-300 mt-6 text-sm italic" style={{ fontFamily: 'Georgia, serif' }}>
                Colecciona todos los fragmentos...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Overlay */}
      <AnimatePresence>
        {showCard && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
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
              {/* Letter card image */}
              <img
                src="/assets/bedroom/letter.png"
                alt="Bedroom Letter Unlocked"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '12px',
                  boxShadow: '0 0 40px rgba(255, 215, 0, 0.6)',
                }}
              />
              <p className="text-center text-white mt-4 text-sm">
                Click para cerrar
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
