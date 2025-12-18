"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export default function FinalScene() {
  const { setScene } = useGameStore();
  const [showButton, setShowButton] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    // Show button after a delay
    setTimeout(() => {
      setShowButton(true);
    }, 3000);
  }, []);

  const handleBackToHub = () => {
    setScene('hub');
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
      <div className="relative z-10 min-h-full flex flex-col items-center justify-start py-20 px-8 space-y-16">
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
            className="text-2xl md:text-3xl text-amber-100 mb-6"
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Has completado todos los desafíos
          </motion.p>
        </motion.div>

        {/* Gift message */}
        <motion.div
          className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 max-w-2xl border-4 border-amber-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <p className="text-xl md:text-2xl text-amber-200 mb-4 font-serif italic">
            {'"Tu regalo te está esperando..."'}
          </p>
          <p className="text-lg text-amber-300">
            🎁 Busca bajo el árbol de Navidad 🎄
          </p>
        </motion.div>

        {/* Memory sections - scrolleable content */}
        <motion.div
          className="max-w-3xl space-y-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          {/* Memory 1 */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border-2 border-amber-400/30">
            <h3 className="text-3xl font-serif text-amber-300 mb-4">✨ Nuestro Viaje</h3>
            <p className="text-amber-100 text-lg leading-relaxed">
              Cada desafío que completaste representa un momento especial que hemos compartido.
              Desde las pequeñas aventuras hasta los grandes sueños, todo forma parte de nuestra historia.
            </p>
          </div>

          {/* Memory 2 */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border-2 border-amber-400/30">
            <h3 className="text-3xl font-serif text-amber-300 mb-4">💝 Lo que significas</h3>
            <p className="text-amber-100 text-lg leading-relaxed">
              Cada rompecabezas resuelto, cada código descifrado, es solo una pequeña muestra
              de la alegría y el amor que traes a mi vida cada día.
            </p>
          </div>

          {/* Memory 3 */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border-2 border-amber-400/30">
            <h3 className="text-3xl font-serif text-amber-300 mb-4">🌟 Hacia adelante</h3>
            <p className="text-amber-100 text-lg leading-relaxed">
              Este es solo el comienzo. Hay infinitos momentos más por vivir,
              infinitas sonrisas por compartir, e infinitas razones para celebrar
              cada día juntos.
            </p>
          </div>
        </motion.div>

        {/* Galería de fotos estilo polaroid */}
        <motion.div
          className="max-w-4xl w-full px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
        >
          <h2
            className="text-4xl md:text-5xl font-serif text-center mb-12 text-amber-300"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            💕 Nuestros Momentos
          </h2>

          {/* Fotos estilo polaroid esparcidas */}
          <div className="relative flex flex-wrap justify-center items-center gap-8 min-h-[600px]">
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
            className="px-12 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xl font-bold rounded-full shadow-2xl border-4 border-amber-300 transition-all mb-20"
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
