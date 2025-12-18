"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { audioManager } from '@/lib/audioManager';
import Snowfall from '../effects/Snowfall';

export default function IntroScene() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const setScene = useGameStore((state) => state.setScene);

  const handleEnter = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    audioManager.play('click');

    // Iniciar transición
    setTimeout(() => {
      audioManager.crossfade('intro-ambient', 'hub-ambient');
      setScene('hub');
    }, 1000);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Imagen de fondo navideña */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/assets/init/init.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Superposición oscura para mejor legibilidad del texto */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Nieve - con z-index alto para estar visible desde el inicio */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
        <Snowfall count={150} />
      </div>

      {/* Superposición de fundido para la transición */}
      {isTransitioning && (
        <motion.div
          className="absolute inset-0 bg-black"
          style={{ zIndex: 20 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      )}

      {/* Botón de entrada */}
      {!isTransitioning && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 10 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.button
            onClick={handleEnter}
            className="game-element interactive px-12 py-4 text-white text-2xl rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(220, 38, 38, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              fontFamily: 'Georgia, serif',
              fontWeight: 'normal',
              letterSpacing: '1px',
              backdropFilter: 'blur(10px)',
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.6, type: "spring", bounce: 0.3 }}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 15px 50px rgba(0, 0, 0, 0.7), 0 0 40px rgba(220, 38, 38, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
              background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            Comencemos
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
