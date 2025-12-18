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
    collectFragment,
    photoFragments,
    roomsCompleted,
    completeRoom,
  } = useGameStore();
  const [showGame, setShowGame] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showFragmentReveal, setShowFragmentReveal] = useState(false);

  const isRoomCompleted = roomsCompleted.airbag;

  // Airbag room revela el fragmento 6
  const fragment = photoFragments.find(f => f.roomId === 'airbag')!;

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

  const handleBandClick = () => {
    // Si la room ya está completa, solo muestra la carta nuevamente
    if (isRoomCompleted) {
      audioManager.play('click');
      setShowCard(true);
      return;
    }

    // Si no, inicia el juego
    audioManager.play('click');
    setShowGame(true);
  };

  const handleGameComplete = () => {
    setShowGame(false);

    // Collect fragment if not already collected
    if (!fragment.collected) {
      collectFragment(fragment.id);
    }

    // Marcar room como completada
    completeRoom('airbag');

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
        {/* Flecha izquierda - volver a Bedroom */}
        <NavigationArrow
          direction="left"
          onClick={handleToBedroom}
          useAbsolutePosition={false}
        />

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
            src={isRoomCompleted ? "/assets/airbag/airbag-final.jpg" : "/assets/airbag/airbag.jpg"}
            alt="Airbag Room"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              borderRadius: '4px',
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
                  {isRoomCompleted ? "Ver mensaje" : "Jugar quiz"}
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

      {/* Superposición de carta */}
      <AnimatePresence>
        {showCard && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative cursor-pointer max-w-2xl mx-auto px-8"
              onClick={handleCardClick}
              initial={{ scale: 0.5, rotateY: 90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.5, rotateY: 90 }}
              transition={{ duration: 0.5, type: "spring" }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Carta de felicitación */}
              <div
                className="bg-gradient-to-br from-red-900 via-amber-900 to-red-900 rounded-2xl p-10 border-4 border-amber-500"
                style={{
                  boxShadow: '0 0 60px rgba(251, 191, 36, 0.6)',
                }}
              >
                <div className="text-center">
                  <motion.div
                    className="text-6xl mb-6"
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  >
                    🎸
                  </motion.div>
                  <h2
                    className="text-4xl mb-6 text-amber-300"
                    style={{
                      textShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
                      fontFamily: 'Georgia, serif',
                    }}
                  >
                    ¡Ritmo Perfecto!
                  </h2>
                  <p
                    className="text-xl text-amber-100 leading-relaxed mb-4"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    Como nuestra banda favorita, encontramos armonía en cada momento juntos.
                  </p>
                  <p
                    className="text-lg text-amber-200 italic"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    Cada canción es más bella cuando la compartimos 💕
                  </p>
                </div>
              </div>
              <p
                className="text-center text-amber-300 mt-4 text-sm"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                Click para cerrar
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
