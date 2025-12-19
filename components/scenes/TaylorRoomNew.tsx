"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { audioManager } from '@/lib/audioManager';
import NavigationArrow from '../shared/NavigationArrow';
import SlidingPuzzle from '../games/SlidingPuzzle';

export default function TaylorRoom() {
  const {
    setScene,
    roomsCompleted,
    completeRoom,
    roomsUnlocked,
  } = useGameStore();
  const [showGame, setShowGame] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showNumberReveal, setShowNumberReveal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isRoomCompleted = roomsCompleted.taylor;

  useEffect(() => {
    audioManager.play('hub-ambient', true);

    return () => {
      audioManager.stop('hub-ambient', true);
    };
  }, []);

  const handleToHub = () => {
    audioManager.stop('hub-ambient', true);
    audioManager.play('door-open');
    setScene('hub');
  };

  const handleToKitchen = () => {
    audioManager.stop('hub-ambient', true);
    audioManager.play('door-open');
    setScene('kitchen');
  };

  const handlePuzzleClick = () => {
    audioManager.play('mouse-click');
    // If room is already completed, just show the card again
    if (isRoomCompleted) {
      audioManager.play('achievement');
      setShowCard(true);
      return;
    }
    // Otherwise, start the game
    setShowGame(true);
  };

  const handleGameComplete = () => {
    setShowGame(false);

    // Mark room as completed
    completeRoom('taylor');

    // Show card
    setTimeout(() => {
      audioManager.play('achievement');
      setShowCard(true);
    }, 300);
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

      {/* Container wrapper for frame and arrows */}
      <div
        className="relative flex items-center justify-center gap-20"
        style={{
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
        }}
      >
        {/* Left arrow - to Kitchen */}
        {roomsUnlocked.kitchen && (
          <NavigationArrow
            direction="left"
            onClick={handleToKitchen}
            useAbsolutePosition={false}
          />
        )}

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
          {/* Room image */}
          <img
            src={isRoomCompleted ? "/assets/taylor/taylor-final.webp" : "/assets/taylor/taylor.webp"}
            alt="Taylor Room"
            onLoad={() => setImageLoaded(true)}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              borderRadius: '4px',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
          />

          {/* Clickable area */}
          <motion.div
            onClick={handlePuzzleClick}
            style={{
              position: 'absolute',
              left: '30%',
              top: '50%',
              width: '40%',
              height: '35%',
              cursor: 'pointer',
              borderRadius: '8px',
              backgroundColor: 'transparent',
            }}
            whileTap={{ scale: 0.98 }}
            title={isRoomCompleted ? "Ver Recompensa" : "Comenzar juego"}
          />
        </motion.div>

        {/* Right arrow - to Hub */}
        <NavigationArrow
          direction="right"
          onClick={handleToHub}
          useAbsolutePosition={false}
        />
      </div>

      {/* Sliding Puzzle Game */}
      <AnimatePresence>
        {showGame && (
          <SlidingPuzzle
            imageUrl="/assets/shared/couple.jpeg"
            onComplete={handleGameComplete}
            onClose={handleCloseGame}
          />
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
              {/* Couple photo reward */}
              <img
                src="/assets/hub/couple.webp"
                alt="Test Room Card Unlocked"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '12px',
                  boxShadow: '0 0 40px rgba(255, 215, 0, 0.6)',
                }}
              />
              <p className="text-center text-white mt-4 text-sm">
                ¡Carta desbloqueada! Click para cerrar
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
