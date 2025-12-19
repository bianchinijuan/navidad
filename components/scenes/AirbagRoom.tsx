"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { audioManager } from '@/lib/audioManager';
import NavigationArrow from '../shared/NavigationArrow';
import AirbagQuizGame from '../games/AirbagQuizGame';

export default function AirbagRoom() {
  const {
    setScene,
    roomsCompleted,
    roomsUnlocked,
    completeRoom,
    revealNumber,
  } = useGameStore();
  const [showGame, setShowGame] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showNumberReveal, setShowNumberReveal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isRoomCompleted = roomsCompleted.airbag;

  // Airbag room revela el número 3
  const roomNumber = 3;

  useEffect(() => {
    audioManager.play('hub-ambient', true);

    return () => {
      audioManager.stop('hub-ambient', true);
    };
  }, []);

  const handleToBedroom = () => {
    audioManager.stop('hub-ambient', true);
    audioManager.play('door-open');
    setScene('bedroom');
  };

  const handleToSister = () => {
    audioManager.stop('hub-ambient', true);
    audioManager.play('door-open');
    setScene('sister');
  };

  const handleBandClick = () => {
    // Si la room ya está completa, solo muestra la carta nuevamente
    if (isRoomCompleted) {
      audioManager.play('mouse-click');
      audioManager.play('achievement');
      setShowCard(true);
      return;
    }

    // Si no, inicia el juego
    audioManager.play('mouse-click');
    setShowGame(true);
  };

  const handleGameComplete = () => {
    setShowGame(false);

    // Marcar room como completada y revelar número
    completeRoom('airbag');
    revealNumber('airbag', roomNumber);

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
        background: 'linear-gradient(135deg, #7C2D12 0%, #991B1B 25%, #B91C1C 50%, #991B1B 75%, #7C2D12 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
      }}
    >
      {/* Patrón de copos de nieve navideños */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' opacity='0.8'%3E%3Cpath d='M50 10 L50 90 M10 50 L90 50 M20 20 L80 80 M80 20 L20 80' stroke='%23ffffff' stroke-width='1.5' fill='none'/%3E%3Ccircle cx='50' cy='50' r='3' fill='%23ffffff'/%3E%3Ccircle cx='50' cy='20' r='2' fill='%23ffffff'/%3E%3Ccircle cx='50' cy='80' r='2' fill='%23ffffff'/%3E%3Ccircle cx='20' cy='50' r='2' fill='%23ffffff'/%3E%3Ccircle cx='80' cy='50' r='2' fill='%23ffffff'/%3E%3Cpath d='M30 30 L35 35 M70 30 L65 35 M30 70 L35 65 M70 70 L65 65' stroke='%23ffffff' stroke-width='1.5'/%3E%3C/g%3E%3Cg transform='translate(15,15)' fill='%23ffffff' opacity='0.4'%3E%3Cpath d='M0 0 L3 3 M0 3 L3 0' stroke='%23ffffff' stroke-width='1'/%3E%3C/g%3E%3Cg transform='translate(85,25)' fill='%23ffffff' opacity='0.5'%3E%3Ccircle cx='0' cy='0' r='1.5'/%3E%3C/g%3E%3Cg transform='translate(25,85)' fill='%23ffffff' opacity='0.6'%3E%3Ccircle cx='0' cy='0' r='2'/%3E%3C/g%3E%3Cg transform='translate(75,75)' fill='%23ffffff' opacity='0.4'%3E%3Cpath d='M0 -3 L0 3 M-3 0 L3 0' stroke='%23ffffff' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Contenedor wrapper para frame y flechas */}
      <div className="relative flex items-center justify-center gap-20">
        {/* Flecha izquierda - back to Bedroom */}
        {roomsUnlocked.bedroom && (
          <NavigationArrow
            direction="left"
            onClick={handleToBedroom}
            useAbsolutePosition={false}
          />
        )}

        {/* Contenedor del marco */}
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
          {/* Imagen del room - cambia según completado */}
          <img
            src={isRoomCompleted ? "/assets/airbag/airbag-final.webp" : "/assets/airbag/airbag.webp"}
            alt="Airbag Room"
            onLoad={() => setImageLoaded(true)}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              borderRadius: '4px',
              objectFit: 'contain',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
          />

          {/* Área clickeable de la banda - centro de la imagen */}
          <motion.div
            onClick={handleBandClick}
            className="group"
            style={{
              position: 'absolute',
              left: '25%',
              top: '35%',
              width: '50%',
              height: '40%',
              cursor: 'pointer',
              borderRadius: '8px',
              backgroundColor: 'transparent',
            }}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.05 }}
          >
            {/* Tooltip personalizado */}
            <motion.div
              className="absolute -top-12 pointer-events-none opacity-0 group-hover:opacity-100"
              initial={{ y: 10, scale: 0.9 }}
              whileHover={{ y: 0, scale: 1 }}
              transition={{ duration: 0.3, type: "spring" }}
              style={{
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.95), rgba(239, 68, 68, 0.95))',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                boxShadow: '0 0 25px rgba(248, 113, 113, 0.5), 0 8px 32px rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
                padding: '6px 16px',
              }}
            >
              <div className="text-center" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                <div
                  className="text-xs whitespace-nowrap"
                  style={{
                    color: '#FFFFFF',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                    fontWeight: '600',
                  }}
                >
                  {isRoomCompleted ? "Ver Recompensa" : "Tocalo a Guido"}
                </div>
              </div>
              {/* Arrow decorativo */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                <div
                  className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent"
                  style={{
                    borderTopColor: 'rgba(239, 68, 68, 0.95)',
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

        {/* Flecha derecha - to Sister */}
        <NavigationArrow
          direction="right"
          onClick={handleToSister}
          useAbsolutePosition={false}
        />
      </div>

      {/* Quiz de Airbag - Solo mostrar si no está completo */}
      <AnimatePresence>
        {showGame && !isRoomCompleted && (
          <AirbagQuizGame
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
                <h3 className="text-2xl font-bold text-white mb-4" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)', fontFamily: 'Georgia, serif' }}>
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

      {/* Superposición de carta */}
      <AnimatePresence>
        {showCard && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
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
              {/* Disk reward image */}
              <img
                src="/assets/airbag/disk.webp"
                alt="Airbag Disk Unlocked"
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '12px',
                  boxShadow: '0 0 40px rgba(251, 191, 36, 0.6)',
                }}
              />
              <p className="text-center text-amber-200 mt-4 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                ¡Disco desbloqueado! Click para cerrar
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
