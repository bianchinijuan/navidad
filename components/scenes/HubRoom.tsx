"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { audioManager } from '@/lib/audioManager';
import InteractiveObject from '../shared/InteractiveObject';
import ZoomView from '../shared/ZoomView';
import NavigationArrow from '../shared/NavigationArrow';
import WallpaperPattern from '../effects/WallpaperPattern';
import PhotoPuzzle from '../shared/PhotoPuzzle';

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
    allFragmentsCollected,
    photoFragments,
  } = useGameStore();

  const [giftInput, setGiftInput] = useState('');
  const [showGiftError, setShowGiftError] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showPhotoPuzzle, setShowPhotoPuzzle] = useState(false);

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
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#6B0F1A' }}>
      {/* Wallpaper Background - Layer 0 (furthest) */}
      {/* <WallpaperPattern /> */}

      {/* Floor shadow - creates depth */}
      <div
        className="absolute bottom-0 w-full h-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 30%, transparent 100%)',
        }}
      />

      {/* "Merry Christmas!" Title */}
      <motion.h1
        className="absolute top-8 left-1/2 -translate-x-1/2 text-5xl md:text-6xl font-serif text-white z-20"
        style={{
          fontFamily: 'Brush Script MT, cursive',
          textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        Merry Christmas!
      </motion.h1>

      {/* LAYER 1: Background elements (furthest from camera) */}

      {/* Picture frame on wall (background) - clickable to show photo puzzle */}
      <motion.div
        className="absolute right-[35%] top-[22%] w-32 h-40 z-5 cursor-pointer group"
        onClick={() => setShowPhotoPuzzle(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <div
          className="w-full h-full bg-gradient-to-br from-amber-900 to-amber-950 rounded-sm shadow-2xl"
          style={{
            border: '8px solid #4a2516',
            boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
          }}
        >
          <div className="w-full h-full bg-amber-100 flex items-center justify-center relative">
            <span className="text-6xl">🧩</span>
            {/* Badge showing fragments collected */}
            <div className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg">
              {photoFragments.filter(f => f.collected).length}/6
            </div>
          </div>
        </div>
        {/* Tooltip */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Ver Fragmentos
        </div>
      </motion.div>

      {/* LAYER 2: Fireplace (mid-ground) - READY FOR REAL IMAGE */}
      <div className="absolute left-[35%] bottom-0 w-[520px] h-[470px] z-10">
        <InteractiveObject
          id="fireplace"
          onClick={handleFireplaceClick}
          disabled={fireplaceOn}
          hoverScale={1.003}
        >
          <div
            className="relative w-full h-full"
            style={{
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.7))',
            }}
          >
            <img
              src="/assets/hub/fireplace.png"
              alt="Fireplace"
              className="w-full h-full"
              style={{
                objectFit: 'contain',
                objectPosition: 'bottom center',
                imageRendering: 'auto',
              }}
            />

            {/* Fire effect overlay - permanece con imagen real */}
            {fireplaceOn && (
              <div className="absolute top-[30%] left-[20%] right-[20%] bottom-[22%] flex items-end justify-center">
                <motion.div
                  className="w-40 h-48 rounded-full"
                  style={{
                    background: 'radial-gradient(ellipse at bottom, #ff6b35 0%, #ff8c42 30%, #ffa500 60%, transparent 100%)',
                    filter: 'blur(10px)',
                  }}
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(255,140,0,0.4) 0%, transparent 70%)',
                    mixBlendMode: 'screen',
                  }}
                  animate={{
                    opacity: [0.5, 0.9, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </div>
            )}
          </div>
        </InteractiveObject>
      </div>

      {/* LAYER 3: Christmas Tree (foreground-left) - REAL IMAGE */}
      <div className="absolute left-[2%] bottom-0 w-[480px] h-[580px] z-15">
        <InteractiveObject
          id="christmas-tree"
          onClick={handleTreeClick}
          disabled={!allRoomsComplete() || treeLightsOn}
          hoverScale={1.005}
        >
          <div
            className="relative w-full h-full"
            style={{
              filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.8))',
            }}
          >
            {/* Real Christmas Tree Image */}
            <img
              src="/assets/hub/christmas-tree.png"
              alt="Christmas Tree"
              className="w-full h-full"
              style={{
                objectFit: 'contain',
                objectPosition: 'bottom center',
                imageRendering: 'auto',
              }}
            />

            {/* Lights overlay when tree is on */}
            {treeLightsOn && (
              <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => {
                  const colors = ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4d96ff', '#ff69b4'];
                  const layer = Math.floor(i / 5);
                  const posInLayer = i % 5;
                  const x = 40 + (posInLayer - 2) * 15 + Math.random() * 5;
                  const y = 15 + layer * 18 + Math.random() * 5;

                  return (
                    <motion.div
                      key={i}
                      className="absolute w-4 h-4 rounded-full pointer-events-none"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        backgroundColor: colors[i % 5],
                        boxShadow: `0 0 15px ${colors[i % 5]}, 0 0 25px ${colors[i % 5]}`,
                      }}
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [1, 1.3, 1],
                      }}
                      transition={{
                        duration: 2 + Math.random(),
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* Glow effect when lit */}
            {treeLightsOn && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at center, rgba(255,215,0,0.2) 0%, transparent 70%)',
                  mixBlendMode: 'screen',
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />
            )}
          </div>
        </InteractiveObject>
      </div>

      {/* LAYER 4: Gift (foreground) - READY FOR REAL IMAGE */}
      <div className="absolute left-[8%] bottom-[3%] w-[160px] h-[160px] z-20">
        <InteractiveObject id="gift" zoomable>
          <div
            className="relative w-full h-full"
            style={{
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.7))',
            }}
          >
            <img
              src="/assets/hub/gift.png"
              alt="Wrapped Gift"
              className="w-full h-full"
              style={{
                objectFit: 'contain',
                objectPosition: 'center',
                imageRendering: 'auto',
              }}
            />
          </div>
        </InteractiveObject>
      </div>

      {/* Navigation Arrows */}
      {roomsUnlocked.dog && (
        <NavigationArrow
          direction="left"
          onClick={() => navigateToRoom('dog')}
          position="bottom-left"
          label="Dog Room"
        />
      )}

      {roomsUnlocked.tarot && (
        <NavigationArrow
          direction="right"
          onClick={() => navigateToRoom('tarot')}
          position="bottom-right"
          label="Tarot Room"
        />
      )}

      {/* Gift Zoom View */}
      <ZoomView id="gift">
        <div className="bg-gradient-to-br from-red-900 via-amber-900 to-red-950 rounded-2xl p-10 border-4 border-amber-500 shadow-2xl max-w-2xl mx-auto">
          <div className="bg-amber-100/10 rounded-xl p-8 border-2 border-amber-600/30">
            <h2 className="text-4xl font-serif text-amber-100 text-center mb-8" style={{ fontFamily: 'Georgia, serif', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              {mainGiftUnlocked ? '🎁 The Gift Opens 🎁' : '🔒 A Locked Gift 🔒'}
            </h2>

            {!mainGiftUnlocked ? (
              <div className="space-y-6">
                <p className="text-amber-200 text-center text-lg leading-relaxed">
                  {treeLightsOn
                    ? `The tree&apos;s magical light reveals the secret combination: ${giftCombination}`
                    : 'This precious gift awaits... Perhaps the Christmas tree holds the key to unlocking it.'}
                </p>

                {treeLightsOn && (
                  <div className="space-y-4 mt-8">
                    <input
                      type="text"
                      value={giftInput}
                      onChange={(e) => setGiftInput(e.target.value)}
                      placeholder="Enter the combination"
                      className="w-full px-6 py-4 bg-amber-950/50 border-3 border-amber-500/50 rounded-xl text-amber-100 placeholder-amber-300/50 text-center text-2xl tracking-widest uppercase font-serif focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/50"
                      maxLength={10}
                    />

                    <button
                      onClick={handleGiftUnlock}
                      className="w-full px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-serif text-xl rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Unlock the Gift
                    </button>

                    {showGiftError && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-300 text-center bg-red-900/30 border border-red-500/50 rounded-lg py-3 px-4"
                      >
                        Not quite right... Try again!
                      </motion.p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {!showFinalMessage ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
                    className="text-center"
                  >
                    <p className="text-3xl text-amber-200 mb-6">✨ The gift opens with a warm glow... ✨</p>
                    <button
                      onClick={() => setShowFinalMessage(true)}
                      className="px-10 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-serif text-xl rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Look Inside
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-amber-100 space-y-6"
                  >
                    <p className="text-2xl text-center leading-relaxed font-serif">
                      Inside, you find a beautiful note:
                    </p>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 text-slate-800 p-8 rounded-xl shadow-inner border-4 border-amber-600">
                      <p className="text-center text-xl font-serif italic leading-relaxed">
                        &ldquo;The real gift was the memories we shared along the way. 🎄&rdquo;
                      </p>
                      <p className="text-center mt-6 text-sm opacity-70 font-serif">
                        [Your personalized message will appear here]
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </ZoomView>

      {/* Photo Puzzle Overlay */}
      <AnimatePresence>
        {showPhotoPuzzle && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPhotoPuzzle(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <PhotoPuzzle />
            </div>
            {/* Close button */}
            <button
              onClick={() => setShowPhotoPuzzle(false)}
              className="absolute top-8 right-8 text-white bg-black/50 hover:bg-black/70 rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold transition-colors z-60"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
