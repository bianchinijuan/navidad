"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { audioManager } from '@/lib/audioManager';
import InteractiveObject from '../shared/InteractiveObject';
import ZoomView from '../shared/ZoomView';

export default function HubRoom() {
  const {
    setScene,
    treeLightsOn,
    fireplaceOn,
    toggleTreeLights,
    toggleFireplace,
    mainGiftUnlocked,
    unlockGift,
    giftCombination,
    allRoomsComplete,
    roomsUnlocked,
  } = useGameStore();

  const [giftInput, setGiftInput] = useState('');
  const [showGiftError, setShowGiftError] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  useEffect(() => {
    audioManager.play('hub-ambient', true);
  }, []);

  const handleTreeClick = () => {
    if (allRoomsComplete() && !treeLightsOn) {
      toggleTreeLights();
      audioManager.play('tree-lights');
    }
  };

  const handleFireplaceClick = () => {
    if (!fireplaceOn) {
      toggleFireplace();
      audioManager.play('fireplace-ignite');
    }
  };

  const handleGiftUnlock = () => {
    const combinationString = giftCombination.filter(n => n !== null).join('');
    if (giftInput === combinationString) {
      unlockGift();
      audioManager.play('gift-unlock');
      setShowFinalMessage(true);
    } else {
      setShowGiftError(true);
      setTimeout(() => setShowGiftError(false), 2000);
    }
  };

  const navigateToRoom = (room: 'dog' | 'tarot' | 'boardgames' | 'personal') => {
    if (roomsUnlocked[room]) {
      audioManager.play('door-open');
      audioManager.stop('hub-ambient', true);
      setScene(room);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-amber-900/20 via-red-900/10 to-slate-900">
      {/* Living Room Background */}
      <div className="absolute inset-0">
        {/* Wall */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100/5 to-transparent" />

        {/* Floor */}
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-amber-950/30 to-transparent" />
      </div>

      {/* Christmas Tree (Left Side) */}
      <div className="absolute left-[10%] bottom-[15%] w-64 h-80">
        <InteractiveObject
          id="christmas-tree"
          onClick={handleTreeClick}
          disabled={!allRoomsComplete() || treeLightsOn}
          hoverScale={1.02}
        >
          <div className="relative w-full h-full">
            {/* Tree shape */}
            <svg viewBox="0 0 200 300" className="w-full h-full">
              {/* Tree layers */}
              <path d="M100 20 L40 100 L60 100 L20 160 L40 160 L10 220 L190 220 L160 160 L180 160 L140 100 L160 100 Z" fill="#1a4d2e" />
              <path d="M100 20 L40 100 L60 100 L20 160 L40 160 L10 220 L190 220 L160 160 L180 160 L140 100 L160 100 Z" fill="#2d5f3f" opacity="0.6" />

              {/* Trunk */}
              <rect x="85" y="220" width="30" height="60" fill="#4a2516" />

              {/* Ornaments (always visible) */}
              <circle cx="100" cy="80" r="6" fill="#dc2626" />
              <circle cx="70" cy="120" r="6" fill="#fbbf24" />
              <circle cx="130" cy="130" r="6" fill="#3b82f6" />
              <circle cx="60" cy="170" r="6" fill="#dc2626" />
              <circle cx="140" cy="180" r="6" fill="#fbbf24" />

              {/* Star on top */}
              <path d="M100 5 L105 15 L116 16 L108 24 L110 35 L100 29 L90 35 L92 24 L84 16 L95 15 Z" fill="#fbbf24" />
            </svg>

            {/* Lights (conditional) */}
            <AnimatePresence>
              {treeLightsOn && (
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  {/* Glowing lights */}
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        left: `${30 + Math.random() * 40}%`,
                        top: `${20 + i * 5}%`,
                        backgroundColor: ['#fbbf24', '#dc2626', '#3b82f6', '#10b981'][i % 4],
                        boxShadow: `0 0 10px ${['#fbbf24', '#dc2626', '#3b82f6', '#10b981'][i % 4]}`,
                      }}
                      animate={{
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </InteractiveObject>
      </div>

      {/* Gift under tree */}
      <div className="absolute left-[22%] bottom-[15%] w-24 h-24">
        <InteractiveObject id="gift" zoomable>
          <div className="relative w-full h-full">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <rect x="20" y="30" width="60" height="60" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
              <rect x="20" y="25" width="60" height="10" fill="#fbbf24" />
              <rect x="47" y="25" width="6" height="65" fill="#fbbf24" />
              <path d="M50 25 Q40 15 35 20 Q40 25 50 25 Q60 25 65 20 Q60 15 50 25" fill="#fbbf24" />
            </svg>
            {!mainGiftUnlocked && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-10 bg-amber-600 rounded-md border-2 border-amber-800 flex items-center justify-center">
                <div className="w-3 h-4 bg-amber-900 rounded-sm" />
              </div>
            )}
          </div>
        </InteractiveObject>
      </div>

      {/* Fireplace (Right Side) */}
      <div className="absolute right-[10%] bottom-[15%] w-80 h-64">
        <InteractiveObject
          id="fireplace"
          onClick={handleFireplaceClick}
          disabled={fireplaceOn}
          hoverScale={1.01}
        >
          <div className="relative w-full h-full">
            <svg viewBox="0 0 300 250" className="w-full h-full">
              {/* Fireplace structure */}
              <rect x="50" y="50" width="200" height="180" fill="#4a2516" stroke="#2d1810" strokeWidth="3" />
              <rect x="70" y="80" width="160" height="120" fill="#1a0f08" />

              {/* Mantle */}
              <rect x="30" y="40" width="240" height="15" fill="#5d2f0f" stroke="#2d1810" strokeWidth="2" />

              {/* Fire (conditional) */}
              {fireplaceOn && (
                <g>
                  <motion.path
                    d="M150 180 Q140 150 145 120 Q150 140 150 120 Q150 140 155 120 Q160 150 150 180"
                    fill="#ff6b35"
                    animate={{ d: ['M150 180 Q140 150 145 120 Q150 140 150 120 Q150 140 155 120 Q160 150 150 180', 'M150 180 Q145 155 148 125 Q150 145 150 125 Q150 145 152 125 Q155 155 150 180'] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                  />
                  <motion.path
                    d="M150 180 Q135 160 140 130 Q145 150 150 130 Q155 150 160 130 Q165 160 150 180"
                    fill="#fbbf24"
                    opacity="0.7"
                    animate={{ d: ['M150 180 Q135 160 140 130 Q145 150 150 130 Q155 150 160 130 Q165 160 150 180', 'M150 180 Q138 165 143 135 Q148 155 150 135 Q152 155 157 135 Q162 165 150 180'] }}
                    transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
                  />
                </g>
              )}

              {/* Logs */}
              <ellipse cx="150" cy="190" rx="40" ry="8" fill="#3d2817" />
              <rect x="120" y="185" width="60" height="10" fill="#4a2516" rx="5" />
            </svg>

            {/* Glow effect when lit */}
            {fireplaceOn && (
              <motion.div
                className="absolute inset-0 bg-orange-500/20 blur-xl"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
        </InteractiveObject>
      </div>

      {/* Stockings on fireplace */}
      <div className="absolute right-[12%] bottom-[36%] flex gap-4">
        {['#dc2626', '#10b981', '#3b82f6'].map((color, i) => (
          <motion.div
            key={i}
            className="w-8 h-12"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
          >
            <svg viewBox="0 0 40 60" className="w-full h-full">
              <path d="M5 15 L5 40 Q5 50 15 50 L25 50 Q35 50 35 40 L35 15 Z" fill={color} />
              <rect x="0" y="10" width="40" height="8" fill="white" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Room Doors */}
      <div className="absolute top-[20%] left-[35%] w-20 h-32">
        <InteractiveObject
          id="dog-door"
          onClick={() => navigateToRoom('dog')}
          disabled={!roomsUnlocked.dog}
        >
          <div className="relative w-full h-full bg-amber-900 border-4 border-amber-950 rounded-t-lg flex items-center justify-center">
            <span className="text-white text-xs font-serif">Dog</span>
          </div>
        </InteractiveObject>
      </div>

      <div className="absolute top-[20%] right-[35%] w-20 h-32 opacity-50">
        <InteractiveObject
          id="tarot-door"
          onClick={() => navigateToRoom('tarot')}
          disabled={!roomsUnlocked.tarot}
        >
          <div className="relative w-full h-full bg-purple-900 border-4 border-purple-950 rounded-t-lg flex items-center justify-center">
            <span className="text-white text-xs font-serif">Tarot</span>
          </div>
        </InteractiveObject>
      </div>

      {/* Gift Zoom View */}
      <ZoomView id="gift">
        <div className="bg-gradient-to-br from-red-900 to-slate-900 rounded-xl p-8 border-4 border-amber-600 max-w-2xl mx-auto">
          <h2 className="text-3xl font-serif text-white text-center mb-6">
            {mainGiftUnlocked ? 'The Gift Awaits' : 'A Locked Gift'}
          </h2>

          {!mainGiftUnlocked ? (
            <div className="space-y-6">
              <p className="text-white/80 text-center">
                {treeLightsOn
                  ? `The tree's light reveals the combination: ${giftCombination}`
                  : 'This gift is locked. Perhaps lighting the Christmas tree will reveal how to open it...'}
              </p>

              {treeLightsOn && (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={giftInput}
                    onChange={(e) => setGiftInput(e.target.value)}
                    placeholder="Enter combination"
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/30 rounded-lg text-white placeholder-white/50 text-center text-xl tracking-widest uppercase"
                    maxLength={10}
                  />

                  <button
                    onClick={handleGiftUnlock}
                    className="w-full px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-serif text-lg rounded-lg transition-colors"
                  >
                    Unlock Gift
                  </button>

                  {showGiftError && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-center"
                    >
                      That&apos;s not quite right...
                    </motion.p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {!showFinalMessage ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
                  className="text-center"
                >
                  <p className="text-2xl text-amber-300 mb-4">The gift opens...</p>
                  <button
                    onClick={() => setShowFinalMessage(true)}
                    className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-serif text-lg rounded-lg transition-colors"
                  >
                    Look Inside
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="text-white space-y-4"
                >
                  <p className="text-xl text-center leading-relaxed">
                    Inside, you find a note:
                  </p>
                  <div className="bg-amber-100 text-slate-900 p-6 rounded-lg font-serif">
                    <p className="text-center text-lg italic">
                      &ldquo;The real gift was the memories we shared along the way. 🎄&rdquo;
                    </p>
                    <p className="text-center mt-4 text-sm">
                      [Your personalized message will appear here]
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </ZoomView>

      {/* Instructions overlay (subtle, bottom center) */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm font-serif text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Click to explore the room
      </motion.div>
    </div>
  );
}
