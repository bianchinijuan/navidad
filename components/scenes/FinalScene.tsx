"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { audioManager } from '@/lib/audioManager';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export default function FinalScene() {
  const { setScene } = useGameStore();
  const [showButton, setShowButton] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const { width, height } = useWindowSize();

  const carouselCards = [
    "Yo libre y voluntariamente",
    "Con pleno conocimiento de las causas y efectos",
    "Confieso que..."
  ];

  // Music management for final scene
  useEffect(() => {
    // Stop christmas music and play final music for celebration
    audioManager.stop('christmas-music');
    audioManager.play('final');

    return () => {
      // Cleanup - stop final music when leaving final scene
      audioManager.stop('final');
      audioManager.resume('christmas-music');
    };
  }, []);

  useEffect(() => {
    // Show button after a delay
    setTimeout(() => {
      setShowButton(true);
    }, 3000);
  }, []);

  const handleBackToHub = () => {
    setScene('hub');
  };

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % carouselCards.length);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + carouselCards.length) % carouselCards.length);
  };

  return (
    <div className="relative w-full h-full overflow-y-auto overflow-x-hidden"
      style={{
        background: 'linear-gradient(135deg, #8B1538 0%, #A52A2A 25%, #C41E3A 50%, #A52A2A 75%, #8B1538 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
      }}
    >
      {/* Confetti - fixed position */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <Confetti
          width={width}
          height={height}
          recycle={true}
          numberOfPieces={200}
          colors={['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']}
        />
      </div>

      {/* Snowflake pattern overlay */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' opacity='0.8'%3E%3Cpath d='M50 10 L50 90 M10 50 L90 50 M20 20 L80 80 M80 20 L20 80' stroke='%23ffffff' stroke-width='1.5' fill='none'/%3E%3Ccircle cx='50' cy='50' r='3' fill='%23ffffff'/%3E%3Ccircle cx='50' cy='20' r='2' fill='%23ffffff'/%3E%3Ccircle cx='50' cy='80' r='2' fill='%23ffffff'/%3E%3Ccircle cx='20' cy='50' r='2' fill='%23ffffff'/%3E%3Ccircle cx='80' cy='50' r='2' fill='%23ffffff'/%3E%3Cpath d='M30 30 L35 35 M70 30 L65 35 M30 70 L35 65 M70 70 L65 65' stroke='%23ffffff' stroke-width='1.5'/%3E%3C/g%3E%3Cg transform='translate(15,15)' fill='%23ffffff' opacity='0.4'%3E%3Cpath d='M0 0 L3 3 M0 3 L3 0' stroke='%23ffffff' stroke-width='1'/%3E%3C/g%3E%3Cg transform='translate(85,25)' fill='%23ffffff' opacity='0.5'%3E%3Ccircle cx='0' cy='0' r='1.5'/%3E%3C/g%3E%3Cg transform='translate(25,85)' fill='%23ffffff' opacity='0.6'%3E%3Ccircle cx='0' cy='0' r='2'/%3E%3C/g%3E%3Cg transform='translate(75,75)' fill='%23ffffff' opacity='0.4'%3E%3Cpath d='M0 -3 L0 3 M-3 0 L3 0' stroke='%23ffffff' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Scrollable Content */}
      <div className="relative z-10 min-h-full flex flex-col items-center justify-start py-28 px-8 space-y-24">
        {/* Main message */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.8 }}
          >
            <motion.h1
              className="text-7xl md:text-9xl font-serif mb-8"
              style={{
                background: 'linear-gradient(45deg, #FFD700, #FFA500, #FF6B6B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 40px rgba(255, 215, 0, 0.5)',
              }}
            >
              {'¡Lo lograste! 🎉'}
            </motion.h1>
          </motion.div>

          <motion.p
            className="text-2xl md:text-3xl text-amber-100 mb-8"
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Has completado todos los desafíos
          </motion.p>
        </motion.div>

        {/* Tarjeta elegante de regalos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8, type: "spring" }}
          style={{
            background: 'linear-gradient(135deg, rgba(139, 21, 56, 0.98) 0%, rgba(127, 29, 29, 0.98) 50%, rgba(153, 27, 27, 0.98) 100%)',
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(255, 215, 0, 0.4)',
            borderRadius: '24px',
            padding: '40px 60px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            maxWidth: '600px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          {/* Decorative corner accents */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              width: '40px',
              height: '40px',
              border: '2px solid rgba(255, 215, 0, 0.5)',
              borderRight: 'none',
              borderBottom: 'none',
              borderRadius: '8px 0 0 0',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '40px',
              height: '40px',
              border: '2px solid rgba(255, 215, 0, 0.5)',
              borderLeft: 'none',
              borderBottom: 'none',
              borderRadius: '0 8px 0 0',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              width: '40px',
              height: '40px',
              border: '2px solid rgba(255, 215, 0, 0.5)',
              borderRight: 'none',
              borderTop: 'none',
              borderRadius: '0 0 0 8px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              width: '40px',
              height: '40px',
              border: '2px solid rgba(255, 215, 0, 0.5)',
              borderLeft: 'none',
              borderTop: 'none',
              borderRadius: '0 0 8px 0',
            }}
          />

          {/* Icon */}
          <motion.div
            className="text-center mb-4"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span
              style={{
                fontSize: '48px',
                filter: 'drop-shadow(0 4px 12px rgba(255, 215, 0, 0.6))',
              }}
            >
              🎁
            </span>
          </motion.div>

          {/* Main title */}
          <h2
            className="text-4xl font-bold text-center mb-3"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Georgia, serif',
              letterSpacing: '2px',
              textShadow: 'none',
            }}
          >
            Reclama tus Regalos
          </h2>

          {/* Subtitle */}
          <p
            className="text-center text-amber-100"
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: '16px',
              fontStyle: 'italic',
              opacity: 0.9,
              letterSpacing: '0.5px',
              lineHeight: '1.6',
            }}
          >
            ¡Feliz Navidad Amor!
          </p>

          {/* Decorative divider */}
          <div
            style={{
              width: '60px',
              height: '2px',
              background: 'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.6), transparent)',
              margin: '20px auto 0',
            }}
          />
        </motion.div>

        {/* Carrusel de tarjetas */}
        <motion.div
          className="max-w-2xl w-full px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.8 }}
        >
          <div className="relative flex items-center gap-6">
            {/* Botón izquierdo - fuera del cartel */}
            <button
              onClick={prevCard}
              className="flex-shrink-0 bg-white/90 hover:bg-white text-red-900 rounded-full p-3 shadow-lg transition-all"
              style={{
                border: '2px solid rgba(139, 21, 56, 0.3)',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {/* Tarjeta actual */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCard}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  style={{
                    background: 'rgba(139, 21, 56, 0.35)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '40px 32px',
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                    border: '2px solid rgba(255, 215, 0, 0.4)',
                    minHeight: '140px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <h2
                    className="text-xl md:text-3xl font-serif text-center"
                    style={{
                      color: '#FFF8F0',
                      fontWeight: 'bold',
                      letterSpacing: '0.5px',
                      lineHeight: '1.4',
                      textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    {carouselCards[currentCard]}
                  </h2>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Botón derecho - fuera del cartel */}
            <button
              onClick={nextCard}
              className="flex-shrink-0 bg-white/90 hover:bg-white text-red-900 rounded-full p-3 shadow-lg transition-all"
              style={{
                border: '2px solid rgba(139, 21, 56, 0.3)',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          {/* Indicadores de páginas */}
          <div className="flex justify-center gap-2 mt-6">
            {carouselCards.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCard(index)}
                className="transition-all"
                style={{
                  width: currentCard === index ? '32px' : '12px',
                  height: '12px',
                  borderRadius: '6px',
                  backgroundColor: currentCard === index ? 'rgba(255, 215, 0, 0.9)' : 'rgba(255, 255, 255, 0.4)',
                  border: '1px solid rgba(255, 215, 0, 0.5)',
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Galería de fotos estilo polaroid */}
        <motion.div
          className="max-w-4xl w-full px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
        >
          <h2
            className="text-4xl md:text-5xl font-serif text-center mb-16 text-amber-300"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            💕 Te amo 💕
          </h2>

          {/* Fotos estilo polaroid esparcidas */}
          <div className="relative flex flex-wrap justify-center items-center gap-10 min-h-[600px]">
            {/* Foto 1 - Inclinada a la izquierda */}
            <motion.div
              className="relative bg-white p-3 shadow-2xl"
              style={{
                width: '220px',
                transform: 'rotate(-8deg)',
              }}
              initial={{ opacity: 0, y: 50, rotate: -8 }}
              animate={{ opacity: 1, y: 0, rotate: -8 }}
              transition={{ delay: 3.7, type: "spring" }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <div className="relative">
                <img
                  src="/assets/photos/1.jpeg"
                  alt="Juan y Lucía"
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: '3/4' }}
                />
              </div>
              <div className="h-12 flex items-center justify-center">
                <div style={{
                  width: '40px',
                  height: '1px',
                  background: 'linear-gradient(to right, transparent, #d1d5db, transparent)',
                }}></div>
              </div>
            </motion.div>

            {/* Foto 3 - Inclinada a la derecha */}
            <motion.div
              className="relative bg-white p-3 shadow-2xl"
              style={{
                width: '220px',
                transform: 'rotate(6deg)',
              }}
              initial={{ opacity: 0, y: 50, rotate: 6 }}
              animate={{ opacity: 1, y: 0, rotate: 6 }}
              transition={{ delay: 3.9, type: "spring" }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <div className="relative">
                <img
                  src="/assets/photos/3.jpeg"
                  alt="Juan y Lucía"
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: '3/4' }}
                />
              </div>
              <div className="h-12 flex items-center justify-center gap-1">
                <div style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  backgroundColor: '#d1d5db',
                }}></div>
                <div style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  backgroundColor: '#d1d5db',
                }}></div>
                <div style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  backgroundColor: '#d1d5db',
                }}></div>
              </div>
            </motion.div>

            {/* Foto 4 - Levemente inclinada */}
            <motion.div
              className="relative bg-white p-3 shadow-2xl"
              style={{
                width: '280px',
                transform: 'rotate(-3deg)',
              }}
              initial={{ opacity: 0, y: 50, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: -3 }}
              transition={{ delay: 4.1, type: "spring" }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <div className="relative">
                <img
                  src="/assets/photos/4v2.jpeg"
                  alt="Juan y Lucía"
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: '4/3', objectPosition: 'center top' }}
                />
              </div>
              <div className="h-12 flex items-center justify-center">
                <div style={{
                  width: '50px',
                  height: '1px',
                  background: 'linear-gradient(to right, transparent, #d1d5db, transparent)',
                }}></div>
              </div>
            </motion.div>

            {/* Foto 2 - Inclinada opuesta */}
            <motion.div
              className="relative bg-white p-3 shadow-2xl"
              style={{
                width: '280px',
                transform: 'rotate(4deg)',
              }}
              initial={{ opacity: 0, y: 50, rotate: 4 }}
              animate={{ opacity: 1, y: 0, rotate: 4 }}
              transition={{ delay: 4.3, type: "spring" }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <div className="relative">
                <img
                  src="/assets/photos/2.jpeg"
                  alt="Con amigos"
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: '4/3' }}
                />
              </div>
              <div className="h-12 flex items-center justify-center gap-1.5">
                <div style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  backgroundColor: '#d1d5db',
                }}></div>
                <div style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  backgroundColor: '#d1d5db',
                }}></div>
                <div style={{
                  width: '3px',
                  height: '3px',
                  borderRadius: '50%',
                  backgroundColor: '#d1d5db',
                }}></div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Back to Hub button */}
        {showButton && (
          <motion.button
            onClick={handleBackToHub}
            className="px-12 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xl font-bold rounded-full shadow-2xl border-4 border-amber-300 transition-all mb-24"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              boxShadow: '0 0 30px rgba(255, 215, 0, 0.6)',
            }}
          >
            Volver al Hub
          </motion.button>
        )}
      </div>
    </div>
  );
}
