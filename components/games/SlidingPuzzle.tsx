"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tile {
  id: number;
  position: number;
  isEmpty: boolean;
}

interface SlidingPuzzleProps {
  imageUrl: string;
  onComplete: () => void;
  onClose: () => void;
}

const GRID_SIZE = 3; // 3x3 grid
const TILE_COUNT = GRID_SIZE * GRID_SIZE;
const TILE_SIZE = 140; // Fixed size in pixels
const GAP = 8;

// Helper to check if two positions are adjacent
const areAdjacent = (pos1: number, pos2: number): boolean => {
  const row1 = Math.floor(pos1 / GRID_SIZE);
  const col1 = pos1 % GRID_SIZE;
  const row2 = Math.floor(pos2 / GRID_SIZE);
  const col2 = pos2 % GRID_SIZE;

  return (
    (Math.abs(row1 - row2) === 1 && col1 === col2) ||
    (Math.abs(col1 - col2) === 1 && row1 === row2)
  );
};

// Fisher-Yates shuffle
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Check if puzzle is solvable (important for sliding puzzles!)
const isSolvable = (tiles: Tile[]): boolean => {
  let inversions = 0;
  const tileNumbers = tiles.filter(t => !t.isEmpty).map(t => t.id);

  for (let i = 0; i < tileNumbers.length; i++) {
    for (let j = i + 1; j < tileNumbers.length; j++) {
      if (tileNumbers[i] > tileNumbers[j]) inversions++;
    }
  }

  // For odd grid size, puzzle is solvable if inversions is even
  return inversions % 2 === 0;
};

export default function SlidingPuzzle({ imageUrl, onComplete, onClose }: SlidingPuzzleProps) {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Initialize puzzle
  useEffect(() => {
    let shuffledTiles: Tile[];

    // Keep shuffling until we get a solvable configuration
    do {
      const initialTiles: Tile[] = Array.from({ length: TILE_COUNT }, (_, i) => ({
        id: i,
        position: i,
        isEmpty: i === TILE_COUNT - 1, // Last tile is empty
      }));

      const shuffled = shuffleArray(initialTiles);
      shuffledTiles = shuffled.map((tile, index) => ({
        ...tile,
        position: index,
      }));
    } while (!isSolvable(shuffledTiles));

    setTiles(shuffledTiles);
  }, []);

  // Check if puzzle is solved
  useEffect(() => {
    if (tiles.length === 0) return;

    const solved = tiles.every(tile => tile.id === tile.position);
    if (solved && moves > 0) {
      setIsComplete(true);
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  }, [tiles, moves, onComplete]);

  const handleTileClick = (clickedTile: Tile) => {
    if (clickedTile.isEmpty) return;

    const emptyTile = tiles.find(t => t.isEmpty);
    if (!emptyTile) return;

    // Check if clicked tile is adjacent to empty tile
    if (areAdjacent(clickedTile.position, emptyTile.position)) {
      setTiles(prevTiles => {
        const newTiles = [...prevTiles];
        const clickedIndex = newTiles.findIndex(t => t.id === clickedTile.id);
        const emptyIndex = newTiles.findIndex(t => t.isEmpty);

        // Swap positions
        [newTiles[clickedIndex].position, newTiles[emptyIndex].position] =
        [newTiles[emptyIndex].position, newTiles[clickedIndex].position];

        return newTiles;
      });
      setMoves(prev => prev + 1);
    }
  };

  const getTilePosition = (position: number) => {
    const row = Math.floor(position / GRID_SIZE);
    const col = position % GRID_SIZE;
    return {
      x: col * (TILE_SIZE + GAP),
      y: row * (TILE_SIZE + GAP),
    };
  };

  const getTileStyle = (tile: Tile) => {
    const imageRow = Math.floor(tile.id / GRID_SIZE);
    const imageCol = tile.id % GRID_SIZE;

    return {
      backgroundImage: tile.isEmpty ? 'none' : `url(${imageUrl})`,
      backgroundSize: `${GRID_SIZE * 100}%`,
      backgroundPosition: `${(imageCol * 100) / (GRID_SIZE - 1)}% ${(imageRow * 100) / (GRID_SIZE - 1)}%`,
    };
  };

  const gridWidth = GRID_SIZE * TILE_SIZE + (GRID_SIZE - 1) * GAP;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 rounded-2xl p-6 border-4 border-cyan-600"
        style={{
          maxWidth: '600px',
          width: '90vw',
          boxShadow: '0 0 60px rgba(34, 211, 238, 0.5)',
        }}
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-serif text-cyan-100 mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            📸 Sliding Puzzle 🧩
          </h2>
          <p className="text-cyan-200 text-sm">Slide the tiles to reveal the photo!</p>

          {/* Moves counter */}
          <div className="flex justify-center mt-4">
            <div className="bg-cyan-900/30 px-6 py-2 rounded-lg border border-cyan-600/30">
              <span className="text-xs text-cyan-200 opacity-75">Moves:</span>
              <span className="ml-2 font-bold text-lg text-cyan-100">{moves}</span>
            </div>
          </div>
        </div>

        {/* Puzzle Grid */}
        <div className="mb-6 mx-auto flex justify-center">
          <div
            className="relative bg-cyan-950/50 p-2 rounded-xl border-2 border-cyan-700"
            style={{
              width: `${gridWidth + 16}px`,
              height: `${gridWidth + 16}px`,
            }}
          >
            {tiles.map((tile) => {
              const pos = getTilePosition(tile.position);

              return (
                <motion.button
                  key={tile.id}
                  onClick={() => handleTileClick(tile)}
                  className={`absolute rounded-lg overflow-hidden ${
                    tile.isEmpty
                      ? 'bg-cyan-950/80 border-2 border-dashed border-cyan-700/50'
                      : 'bg-cover bg-center cursor-pointer border-2 border-cyan-600/30 hover:border-cyan-400'
                  }`}
                  style={{
                    ...getTileStyle(tile),
                    width: `${TILE_SIZE}px`,
                    height: `${TILE_SIZE}px`,
                    left: 0,
                    top: 0,
                  }}
                  animate={{
                    x: pos.x,
                    y: pos.y,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 35,
                  }}
                  whileHover={!tile.isEmpty ? { scale: 1.05, borderColor: 'rgba(34, 211, 238, 0.8)' } : {}}
                  whileTap={!tile.isEmpty ? { scale: 0.95 } : {}}
                >
                  {tile.isEmpty && (
                    <div className="absolute inset-0 flex items-center justify-center text-cyan-700 text-4xl opacity-30">
                      ?
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-cyan-900/50 hover:bg-cyan-900/70 text-cyan-100 rounded-lg border border-cyan-600/50 transition-colors"
        >
          Close
        </button>

        {/* Completion overlay */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gradient-to-br from-green-600 to-green-800 px-12 py-8 rounded-2xl border-4 border-green-400"
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', bounce: 0.5 }}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">✨</div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    Perfect!
                  </h3>
                  <p className="text-green-100">
                    Completed in {moves} moves
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
