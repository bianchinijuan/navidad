"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '@/lib/audioManager';

interface TapestrySlidingPuzzleProps {
  onComplete: () => void;
  onClose: () => void;
}

// Cuadrícula 3x3 = 9 azulejos (0-8), donde 8 es el espacio vacío
const GRID_SIZE = 3;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;

// Generar un rompecabezas aleatorio resoluble
const generatePuzzle = (): number[] => {
  const solution = Array.from({ length: TOTAL_TILES }, (_, i) => i);

  // Mezcla Fisher-Yates con verificación de resolubilidad
  const shuffle = () => {
    const arr = [...solution];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Verificar si el rompecabezas es resoluble
  const isSolvable = (puzzle: number[]): boolean => {
    let inversions = 0;
    for (let i = 0; i < puzzle.length; i++) {
      for (let j = i + 1; j < puzzle.length; j++) {
        if (puzzle[i] !== TOTAL_TILES - 1 && puzzle[j] !== TOTAL_TILES - 1 && puzzle[i] > puzzle[j]) {
          inversions++;
        }
      }
    }
    return inversions % 2 === 0;
  };

  let puzzle;
  do {
    puzzle = shuffle();
  } while (!isSolvable(puzzle) || JSON.stringify(puzzle) === JSON.stringify(solution));

  return puzzle;
};

export default function TapestrySlidingPuzzle({ onComplete, onClose }: TapestrySlidingPuzzleProps) {
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Music management
  useEffect(() => {
    if (!showInstructions) {
      // Game is active - play taylor music
      audioManager.pause('christmas-music');
      audioManager.play('taylor-room', true);

      // Cleanup only when game is actually active
      return () => {
        audioManager.stop('taylor-room', true);
        audioManager.resume('christmas-music');
      };
    } else {
      // Game is not active - ensure taylor music is stopped
      audioManager.stop('taylor-room', true);
      audioManager.resume('christmas-music');
    }
  }, [showInstructions]);

  useEffect(() => {
    setTiles(generatePuzzle());
  }, []);

  const getPosition = (index: number) => ({
    row: Math.floor(index / GRID_SIZE),
    col: index % GRID_SIZE,
  });

  const canMove = (tileIndex: number, emptyIndex: number): boolean => {
    const tilePos = getPosition(tileIndex);
    const emptyPos = getPosition(emptyIndex);

    const rowDiff = Math.abs(tilePos.row - emptyPos.row);
    const colDiff = Math.abs(tilePos.col - emptyPos.col);

    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
  };

  const handleTileClick = useCallback((clickedIndex: number) => {
    if (isComplete) return;

    const emptyIndex = tiles.indexOf(TOTAL_TILES - 1);

    if (canMove(clickedIndex, emptyIndex)) {
      const newTiles = [...tiles];
      [newTiles[clickedIndex], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[clickedIndex]];

      setTiles(newTiles);
      setMoves(prev => prev + 1);
      audioManager.play('click');

      // Verificar si está resuelto
      const solved = newTiles.every((tile, index) => tile === index);
      if (solved) {
        setIsComplete(true);
        audioManager.play('success');
        setTimeout(() => {
          onComplete();
        }, 1500);
      }
    } else {
      audioManager.play('wrong');
    }
  }, [tiles, isComplete, onComplete]);

  const handleReset = () => {
    setTiles(generatePuzzle());
    setMoves(0);
    setIsComplete(false);
    audioManager.play('click');
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Encabezado */}
      <div className="absolute top-4 left-0 right-0 flex justify-between items-center px-8 z-10">
        <div className="flex gap-6">
          <div
            className="bg-purple-900/90 border-2 border-purple-600 px-3 py-1.5 rounded-lg"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            <span className="text-purple-200 font-semibold text-sm">Movimientos: {moves}</span>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowInstructions(true)}
            className="bg-purple-700/90 hover:bg-purple-600/90 border-2 border-purple-500 px-3 py-1.5 rounded-lg text-purple-100 transition-colors text-sm"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '500' }}
            title="Ver instrucciones"
          >
            ❓
          </button>
          <button
            onClick={handleReset}
            className="bg-amber-800/90 border-2 border-amber-600 px-3 py-1.5 rounded-lg text-amber-200 hover:bg-amber-700 transition-colors text-sm"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '500' }}
          >
            Reiniciar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-800/90 border-2 border-gray-600 px-3 py-1.5 rounded-lg text-gray-200 hover:bg-gray-700 transition-colors text-sm"
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '500' }}
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Contenedor del rompecabezas */}
      <div className="flex flex-col items-center justify-center">
        <motion.h2
          className="text-2xl text-amber-400 mb-6"
          style={{
            textShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: '600'
          }}
        >
          Arma el Tapiz Australiano
        </motion.h2>

        {/* Cuadrícula 3x3 */}
        <div
          className="relative bg-black/50 p-2 rounded-xl border-4 border-amber-600/50"
          style={{
            width: 'min(80vmin, 600px)',
            height: 'min(80vmin, 600px)',
            boxShadow: '0 0 40px rgba(251, 191, 36, 0.3)',
          }}
        >
          <div
            className="relative w-full h-full grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            }}
          >
            {tiles.map((tile, index) => {
              const isEmpty = tile === TOTAL_TILES - 1;

              if (isEmpty) {
                return (
                  <motion.div
                    key={tile}
                    className="relative rounded-lg overflow-hidden bg-black/30"
                    style={{
                      border: '2px dashed rgba(255, 255, 255, 0.2)',
                    }}
                    layout
                    transition={{ duration: 0.2 }}
                  />
                );
              }

              // Para azulejos no vacíos, calcular qué pieza de la imagen mostrar
              const tileRow = Math.floor(tile / GRID_SIZE);
              const tileCol = tile % GRID_SIZE;

              return (
                <motion.div
                  key={tile}
                  className="relative rounded-lg overflow-hidden cursor-pointer"
                  style={{
                    backgroundImage: `url('/assets/brother/tapestry.png')`,
                    backgroundPosition: `${(tileCol * 100) / (GRID_SIZE - 1)}% ${(tileRow * 100) / (GRID_SIZE - 1)}%`,
                    backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
                    backgroundRepeat: 'no-repeat',
                    border: '2px solid rgba(0, 0, 0, 0.3)',
                  }}
                  onClick={() => handleTileClick(index)}
                  whileHover={{ scale: 1.05, opacity: 0.9 }}
                  whileTap={{ scale: 0.95 }}
                  layout
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
                </motion.div>
              );
            })}
          </div>
        </div>

        <p
          className="text-amber-200 mt-6 text-center max-w-md text-sm"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          Desliza las piezas para completar el tapiz. Click en una pieza adyacente al espacio vacío para moverla.
        </p>
      </div>

      {/* Superposición de instrucciones */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/90 z-20 p-8"
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
                src="/assets/instructions/tapestry-game.webp"
                alt="Instrucciones del juego del tapiz"
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
                style={{
                  boxShadow: '0 0 40px rgba(168, 85, 247, 0.6)',
                }}
              />
              <button
                onClick={() => setShowInstructions(false)}
                className="absolute top-2 right-2 bg-purple-700 hover:bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center border-2 border-white shadow-lg text-xl"
              >
                ✕
              </button>
              <p className="text-center text-purple-200 mt-3 text-sm">
                Click para cerrar
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Superposición de éxito */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/80 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.4 }}
            >
              <motion.div
                className="text-4xl mb-3"
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                🎉
              </motion.div>
              <h2
                className="text-3xl text-amber-400 mb-3"
                style={{
                  textShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontWeight: '600'
                }}
              >
                ¡Completado!
              </h2>
              <p
                className="text-amber-200 text-base"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                Armaste el tapiz en {moves} movimientos
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
