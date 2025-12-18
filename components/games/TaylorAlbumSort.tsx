"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

interface Album {
  id: number;
  title: string;
  year: number;
  color: string;
}

interface TaylorAlbumSortProps {
  onComplete: () => void;
  onClose: () => void;
}

const ALBUMS: Album[] = [
  { id: 1, title: "Taylor Swift", year: 2006, color: "from-teal-400 to-teal-600" },
  { id: 2, title: "Fearless", year: 2008, color: "from-yellow-400 to-amber-600" },
  { id: 3, title: "Speak Now", year: 2010, color: "from-purple-400 to-purple-600" },
  { id: 4, title: "Red", year: 2012, color: "from-red-500 to-red-700" },
  { id: 5, title: "1989", year: 2014, color: "from-sky-400 to-blue-500" },
  { id: 6, title: "Reputation", year: 2017, color: "from-gray-800 to-black" },
  { id: 7, title: "Lover", year: 2019, color: "from-pink-400 to-pink-600" },
  { id: 8, title: "Folklore", year: 2020, color: "from-gray-400 to-gray-600" },
  { id: 9, title: "Evermore", year: 2020, color: "from-amber-700 to-orange-900" },
  { id: 10, title: "Midnights", year: 2022, color: "from-indigo-600 to-purple-800" },
  { id: 11, title: "TTPD", year: 2024, color: "from-stone-300 to-stone-500" },
];

// Mezcla Fisher-Yates
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function TaylorAlbumSort({ onComplete, onClose }: TaylorAlbumSortProps) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Inicializar con álbumes mezclados
  useEffect(() => {
    setAlbums(shuffleArray([...ALBUMS]));
  }, []);

  // Verificar si está ordenado correctamente
  useEffect(() => {
    if (albums.length === 0) return;

    const isSorted = albums.every((album, index) => album.id === index + 1);

    if (isSorted && !isComplete) {
      setIsComplete(true);
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  }, [albums, isComplete, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 rounded-2xl p-4 border-4 border-pink-600"
        style={{
          maxWidth: '500px',
          width: '90vw',
          maxHeight: '90vh',
          boxShadow: '0 0 60px rgba(236, 72, 153, 0.5)',
          overflow: 'hidden',
        }}
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
      >
        {/* Encabezado */}
        <div className="relative text-center mb-4">
          {/* Botón de instrucciones */}
          <button
            onClick={() => setShowInstructions(true)}
            className="absolute left-0 top-0 bg-pink-700/50 hover:bg-pink-600/70 text-white rounded-full w-8 h-8 flex items-center justify-center border border-pink-400/50 transition-colors"
            title="Ver instrucciones"
          >
            ❓
          </button>

          <h2
            className="text-2xl text-pink-100 mb-1"
            style={{
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: '600'
            }}
          >
            🎵 Taylor&apos;s Eras 💜
          </h2>
          <p
            className="text-pink-200 text-xs"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            Drag albums to sort chronologically
          </p>
        </div>

        {/* Lista de álbumes desplazable */}
        <div
          className="mb-4 overflow-y-auto pr-2"
          style={{
            maxHeight: 'calc(90vh - 180px)',
          }}
        >
          <Reorder.Group
            axis="y"
            values={albums}
            onReorder={setAlbums}
            className="space-y-2"
          >
            {albums.map((album) => (
              <Reorder.Item
                key={album.id}
                value={album}
                className="touch-none"
              >
                <motion.div
                  className={`relative bg-gradient-to-r ${album.color} rounded-xl p-3 cursor-grab active:cursor-grabbing border-2 border-white/20`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className={`text-sm ${
                          album.id === 6 ? 'text-white' :
                          album.id === 8 || album.id === 11 ? 'text-gray-900' :
                          'text-white'
                        }`}
                        style={{
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                          fontWeight: '600'
                        }}
                      >
                        {album.title}
                      </h3>
                    </div>
                    <div className="text-xl">
                      ☰
                    </div>
                  </div>
                </motion.div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="w-full py-2 bg-pink-900/50 hover:bg-pink-900/70 text-pink-100 rounded-lg border border-pink-600/50 transition-colors text-sm"
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
                  src="/assets/instructions/taylor-game.png"
                  alt="Instrucciones del juego de Taylor Swift"
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                  style={{
                    boxShadow: '0 0 40px rgba(236, 72, 153, 0.6)',
                  }}
                />
                <button
                  onClick={() => setShowInstructions(false)}
                  className="absolute top-2 right-2 bg-pink-700 hover:bg-pink-600 text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white shadow-lg"
                >
                  ✕
                </button>
                <p className="text-center text-pink-200 mt-3 text-sm">
                  Click para cerrar
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Superposición de finalización */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gradient-to-br from-pink-500 to-purple-600 px-8 py-5 rounded-2xl border-3 border-pink-300"
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                style={{ maxWidth: '280px' }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">✨</div>
                  <h3
                    className="text-xl text-white mb-2"
                    style={{
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      fontWeight: '600'
                    }}
                  >
                    Perfect Order!
                  </h3>
                  <p
                    className="text-pink-100 text-sm"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  >
                    You know your Eras! 💕
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
