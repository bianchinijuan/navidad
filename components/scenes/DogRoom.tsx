"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { audioManager } from '@/lib/audioManager';
import InteractiveObject from '../shared/InteractiveObject';
import ZoomView from '../shared/ZoomView';
import NavigationArrow from '../shared/NavigationArrow';
import WallpaperPattern from '../effects/WallpaperPattern';

export default function DogRoom() {
  const {
    setScene,
    dogFed,
    dogFoodInBowl,
    putFoodInBowl,
    feedDog,
    photosCollected,
    collectPhoto,
    unlockRoom,
  } = useGameStore();

  const [showPhoto, setShowPhoto] = useState(false);
  const [foodJarOpen, setFoodJarOpen] = useState(false);

  const dogPhotoCollected = photosCollected.includes('dog');

  useEffect(() => {
    audioManager.play('dog-ambient', true);

    return () => {
      audioManager.stop('dog-ambient', true);
    };
  }, []);

  const handleFoodJarClick = () => {
    setFoodJarOpen(true);
  };

  const handleTakeFoodFromJar = () => {
    // Food is now "taken" - player can put it in bowl
  };

  const handleBowlClick = () => {
    if (foodJarOpen && !dogFoodInBowl) {
      putFoodInBowl();
      audioManager.play('click');
    }
  };

  const handleDogClick = () => {
    if (dogFoodInBowl && !dogFed) {
      feedDog();
      audioManager.play('dog-eat');

      // After dog eats, reveal photo
      setTimeout(() => {
        setShowPhoto(true);
        collectPhoto('dog');
        audioManager.play('photo-reveal');

        // Unlock next room (tarot)
        unlockRoom('tarot');
      }, 2000);
    }
  };

  const handleBackToHub = () => {
    audioManager.stop('dog-ambient', true);
    audioManager.play('door-open');
    setScene('hub');
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Wallpaper Background */}
      <WallpaperPattern />

      {/* Floor */}
      <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-amber-900/40 to-transparent" />

      {/* Back to Hub Navigation Arrow */}
      <NavigationArrow
        direction="right"
        onClick={handleBackToHub}
        position="bottom-right"
        label="Back to Hub"
      />

      {/* White Fluffy Dog (center-left) - READY FOR REAL IMAGE */}
      <div className="absolute left-[18%] bottom-[18%] w-[320px] h-[320px] z-10">
        <InteractiveObject
          id="dog"
          onClick={handleDogClick}
          disabled={!dogFoodInBowl || dogFed}
          hoverScale={1.015}
        >
          <div
            className="relative w-full h-full"
            style={{
              filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.6))',
            }}
          >
            <img
              src="/assets/dog/dog.png"
              alt="White Fluffy Dog"
              className="w-full h-full"
              style={{
                objectFit: 'contain',
                objectPosition: 'bottom center',
                imageRendering: 'auto',
              }}
            />

            {/* PLACEHOLDER SVG - Se mantiene oculto como fallback */}
            <div className="hidden">
            <svg viewBox="0 0 240 240" className="w-full h-full">
            {/* Dog body - white and fluffy */}
            <ellipse cx="120" cy="150" rx="70" ry="55" fill="#f8f8f8" stroke="#e0e0e0" strokeWidth="2" />

            {/* Fluffy texture on body */}
            <g opacity="0.15">
              {[...Array(12)].map((_, i) => (
                <circle
                  key={i}
                  cx={90 + (i % 4) * 20}
                  cy={130 + Math.floor(i / 4) * 15}
                  r="8"
                  fill="#d4d4d4"
                />
              ))}
            </g>

            {/* Dog head - fluffy and white */}
            <circle cx="120" cy="90" r="50" fill="#f8f8f8" stroke="#e0e0e0" strokeWidth="2" />

            {/* Fluffy texture on head */}
            <g opacity="0.15">
              {[...Array(8)].map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                return (
                  <circle
                    key={i}
                    cx={120 + Math.cos(angle) * 30}
                    cy={90 + Math.sin(angle) * 30}
                    r="6"
                    fill="#d4d4d4"
                  />
                );
              })}
            </g>

            {/* Tan/brown ears - fluffy */}
            <g>
              {/* Left ear */}
              <ellipse cx="85" cy="70" rx="18" ry="32" fill="#d4a574" stroke="#b8935f" strokeWidth="2" />
              <ellipse cx="85" cy="70" rx="14" ry="28" fill="#dbb485" opacity="0.7" />
              {/* Fluffy texture */}
              {[...Array(4)].map((_, i) => (
                <circle key={`left-${i}`} cx="85" cy={60 + i * 10} r="5" fill="#c9954d" opacity="0.3" />
              ))}

              {/* Right ear */}
              <ellipse cx="155" cy="70" rx="18" ry="32" fill="#d4a574" stroke="#b8935f" strokeWidth="2" />
              <ellipse cx="155" cy="70" rx="14" ry="28" fill="#dbb485" opacity="0.7" />
              {/* Fluffy texture */}
              {[...Array(4)].map((_, i) => (
                <circle key={`right-${i}`} cx="155" cy={60 + i * 10} r="5" fill="#c9954d" opacity="0.3" />
              ))}
            </g>

            {/* Big expressive eyes */}
            <g>
              {/* Left eye */}
              <ellipse cx="100" cy="85" rx="8" ry="11" fill="#2d2d2d" />
              <ellipse cx="100" cy="82" rx="6" ry="8" fill="#1a1a1a" />
              <ellipse cx="102" cy="80" rx="3" ry="4" fill="white" />

              {/* Right eye */}
              <ellipse cx="140" cy="85" rx="8" ry="11" fill="#2d2d2d" />
              <ellipse cx="140" cy="82" rx="6" ry="8" fill="#1a1a1a" />
              <ellipse cx="142" cy="80" rx="3" ry="4" fill="white" />
            </g>

            {/* Cute button nose - black */}
            <ellipse cx="120" cy="105" rx="10" ry="8" fill="#2d2d2d" />
            <ellipse cx="118" cy="103" rx="3" ry="2" fill="#4d4d4d" />

            {/* Mouth - cute expression */}
            <path
              d="M120 110 L120 115 M110 115 Q115 120 120 115 M130 115 Q125 120 120 115"
              stroke="#2d2d2d"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Happy mouth when fed */}
            {dogFed && (
              <motion.path
                d="M105 115 Q120 125 135 115"
                stroke="#2d2d2d"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}

            {/* Front legs - fluffy */}
            <g>
              <rect x="90" y="180" width="20" height="50" fill="#f8f8f8" stroke="#e0e0e0" strokeWidth="2" rx="10" />
              <rect x="130" y="180" width="20" height="50" fill="#f8f8f8" stroke="#e0e0e0" strokeWidth="2" rx="10" />
              {/* Fluffy paws */}
              <ellipse cx="100" cy="225" rx="12" ry="8" fill="#f8f8f8" stroke="#e0e0e0" strokeWidth="1.5" />
              <ellipse cx="140" cy="225" rx="12" ry="8" fill="#f8f8f8" stroke="#e0e0e0" strokeWidth="1.5" />
              {/* Paw pads - tan */}
              <circle cx="100" cy="225" r="4" fill="#d4a574" />
              <circle cx="140" cy="225" r="4" fill="#d4a574" />
            </g>

            {/* Tail - wagging if fed */}
            <motion.path
              d="M180 140 Q200 130 210 125 Q215 120 215 115"
              stroke="#f8f8f8"
              strokeWidth="18"
              strokeLinecap="round"
              fill="none"
              animate={dogFed ? {
                d: [
                  "M180 140 Q200 130 210 125 Q215 120 215 115",
                  "M180 140 Q200 155 210 160 Q215 165 215 170",
                  "M180 140 Q200 130 210 125 Q215 120 215 115",
                ],
              } : {}}
              transition={dogFed ? {
                duration: 0.4,
                repeat: Infinity,
              } : {}}
            />
            {/* Tail outline */}
            <motion.path
              d="M180 140 Q200 130 210 125 Q215 120 215 115"
              stroke="#e0e0e0"
              strokeWidth="20"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
              animate={dogFed ? {
                d: [
                  "M180 140 Q200 130 210 125 Q215 120 215 115",
                  "M180 140 Q200 155 210 160 Q215 165 215 170",
                  "M180 140 Q200 130 210 125 Q215 120 215 115",
                ],
              } : {}}
              transition={dogFed ? {
                duration: 0.4,
                repeat: Infinity,
              } : {}}
            />

            {/* Hearts inside SVG placeholder */}
            <AnimatePresence>
              {dogFed && (
                <>
                  {[0, 1, 2].map((i) => (
                    <motion.g key={i}>
                      <motion.path
                        d="M120 50 C120 50 110 40 105 40 C100 40 95 45 95 50 C95 55 100 60 120 75 C140 60 145 55 145 50 C145 45 140 40 135 40 C130 40 120 50 120 50"
                        fill="#ff6b9d"
                        stroke="#ff1744"
                        strokeWidth="1.5"
                        initial={{ opacity: 0, y: 0, scale: 0, x: 0 }}
                        animate={{
                          opacity: [0, 1, 1, 0],
                          y: [0, -50, -80],
                          scale: [0, 1, 0.8],
                          x: [(i - 1) * 15, (i - 1) * 20],
                        }}
                        transition={{
                          duration: 2.5,
                          delay: i * 0.4,
                          repeat: Infinity,
                          repeatDelay: 0.5,
                        }}
                      />
                    </motion.g>
                  ))}
                </>
              )}
            </AnimatePresence>
          </svg>
          </div>
          {/* FIN PLACEHOLDER SVG */}

          {/* Hearts overlay - permanece con imagen real */}
          <AnimatePresence>
            {dogFed && (
              <div className="absolute top-[15%] left-1/2 -translate-x-1/2 pointer-events-none">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{ left: `${(i - 1) * 25}px` }}
                    initial={{ opacity: 0, y: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      y: [0, -60, -100],
                      scale: [0, 1.2, 0.9],
                    }}
                    transition={{
                      duration: 2.5,
                      delay: i * 0.4,
                      repeat: Infinity,
                      repeatDelay: 0.5,
                    }}
                  >
                    <svg width="32" height="32" viewBox="0 0 32 32">
                      <path
                        d="M16 8 C16 8 13 5 11 5 C9 5 7 7 7 9 C7 11 9 13 16 18 C23 13 25 11 25 9 C25 7 23 5 21 5 C19 5 16 8 16 8"
                        fill="#ff6b9d"
                        stroke="#ff1744"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
          </div>
        </InteractiveObject>
      </div>

      {/* Food Bowl (center-right of dog) */}
      <div className="absolute left-[48%] bottom-[22%] w-[160px] h-[100px] z-10">
        <InteractiveObject
          id="bowl"
          onClick={handleBowlClick}
          disabled={dogFoodInBowl || !foodJarOpen}
          hoverScale={1.08}
        >
          <div
            className="relative w-full h-full"
            style={{
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))',
            }}
          >
            <img
              src="/assets/dog/food.png"
              alt="Dog Bowl"
              className="w-full h-full"
              style={{
                objectFit: 'contain',
                objectPosition: 'center',
                imageRendering: 'auto',
              }}
            />

            {/* Instruction hint overlay */}
            {foodJarOpen && !dogFoodInBowl && (
              <motion.div
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-amber-100 whitespace-nowrap pointer-events-none"
                style={{ fontFamily: 'Georgia, serif', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Click to add food
              </motion.div>
            )}
          </div>
        </InteractiveObject>
      </div>

      {/* Food Jar (right side shelf) */}
      <div className="absolute right-[18%] top-[28%] w-[180px] h-[220px] z-10">
        <InteractiveObject
          id="food-jar"
          zoomable
          hoverScale={1.04}
        >
          <div
            className="relative w-full h-full"
            style={{
              filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.5))',
            }}
          >
            <img
              src="/assets/dog/food-container.png"
              alt="Dog Food Jar"
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

      {/* Photo Frame (appears after dog is fed) */}
      <AnimatePresence>
        {dogPhotoCollected && (
          <motion.div
            className="absolute right-[12%] top-[18%] w-48 h-56"
            initial={{ opacity: 0, scale: 0, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={{
              duration: 1.2,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
          >
            <InteractiveObject id="dog-photo" zoomable>
              <div className="w-full h-full bg-gradient-to-br from-amber-900 to-amber-950 p-4 border-4 border-amber-800 shadow-2xl" style={{ transform: 'rotate(-3deg)' }}>
                <div className="w-full h-full bg-amber-50 flex items-center justify-center text-amber-900 text-sm font-serif text-center p-3 border-2 border-amber-700">
                  A cherished memory of playful moments and unconditional love
                  <div className="text-5xl mt-2">🐕</div>
                </div>
              </div>
            </InteractiveObject>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Food Jar Zoom View */}
      <ZoomView id="food-jar">
        <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-slate-900 rounded-2xl p-10 border-4 border-purple-500 shadow-2xl max-w-lg mx-auto">
          <div className="bg-purple-100/10 rounded-xl p-8 border-2 border-purple-400/30">
            <h2 className="text-3xl font-serif text-purple-100 text-center mb-6" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              Dog Food Jar
            </h2>

            {!foodJarOpen ? (
              <div className="space-y-6 text-center">
                <p className="text-purple-200 text-lg leading-relaxed">
                  A jar filled with tasty dog food. Your fluffy friend might be hungry...
                </p>

                <button
                  onClick={() => {
                    setFoodJarOpen(true);
                    handleTakeFoodFromJar();
                  }}
                  className="px-10 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-serif text-xl rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Open Jar
                </button>
              </div>
            ) : (
              <div className="text-center text-purple-100 space-y-4">
                <p className="text-lg">You&apos;ve taken some food from the jar.</p>
                <p className="text-sm text-purple-200/80 bg-purple-900/30 border border-purple-500/30 rounded-lg py-3 px-4">
                  Click the bowl to add food, then feed your furry friend!
                </p>
              </div>
            )}
          </div>
        </div>
      </ZoomView>

      {/* Dog Photo Zoom View */}
      <ZoomView id="dog-photo">
        <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 rounded-2xl p-10 border-4 border-amber-500 shadow-2xl max-w-2xl mx-auto">
          <div className="bg-amber-100/10 rounded-xl p-8 border-2 border-amber-400/30">
            <h2 className="text-4xl font-serif text-amber-100 text-center mb-8" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              A Precious Memory
            </h2>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 aspect-[4/3] rounded-xl mb-6 flex items-center justify-center text-8xl shadow-inner border-4 border-amber-600">
              🐕
            </div>

            <p className="text-amber-100 text-center text-xl font-serif leading-relaxed">
              The photo shows a moment of pure joy - your fluffy companion looking up at you with complete trust and unconditional love. A reminder of the care, presence, and affection you share together.
            </p>
          </div>
        </div>
      </ZoomView>

      {/* Completion notification */}
      <AnimatePresence>
        {showPhoto && (
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-amber-900 to-red-900 backdrop-blur-xl px-16 py-10 rounded-2xl border-4 border-amber-500 z-50 shadow-2xl"
            initial={{ opacity: 0, scale: 0.7, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 20 }}
            transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            <div className="bg-amber-100/10 rounded-xl p-6 border-2 border-amber-400/30">
              <h3 className="text-3xl font-serif text-amber-200 text-center mb-3" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                ✨ Photo Collected! ✨
              </h3>
              <p className="text-amber-100 text-center text-lg font-serif">
                The Tarot Room has been unlocked.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
