"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { audioManager } from '@/lib/audioManager';
import InteractiveObject from '../shared/InteractiveObject';
import ZoomView from '../shared/ZoomView';

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
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-amber-50/10 via-orange-100/5 to-slate-900">
      {/* Back button */}
      <button
        onClick={handleBackToHub}
        className="absolute top-8 left-8 z-30 px-6 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-serif rounded-lg hover:bg-white/20 hover:border-white/50 transition-all"
      >
        ← Back to Hub
      </button>

      {/* Room Background */}
      <div className="absolute inset-0">
        {/* Wall */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-100/10 to-transparent" />

        {/* Floor */}
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-amber-950/30 to-transparent" />
      </div>

      {/* Dog (center-left) */}
      <div className="absolute left-[25%] bottom-[20%] w-48 h-48">
        <InteractiveObject
          id="dog"
          onClick={handleDogClick}
          disabled={!dogFoodInBowl || dogFed}
          hoverScale={1.03}
        >
          <div className="relative w-full h-full">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {/* Dog body */}
              <ellipse cx="100" cy="120" rx="60" ry="45" fill="#8b5a3c" />

              {/* Dog head */}
              <circle cx="100" cy="70" r="40" fill="#8b5a3c" />

              {/* Ears */}
              <ellipse cx="75" cy="55" rx="15" ry="30" fill="#6d4428" />
              <ellipse cx="125" cy="55" rx="15" ry="30" fill="#6d4428" />

              {/* Eyes */}
              <circle cx="85" cy="65" r="6" fill="#1a1a1a" />
              <circle cx="115" cy="65" r="6" fill="#1a1a1a" />
              <circle cx="87" cy="63" r="2" fill="white" />
              <circle cx="117" cy="63" r="2" fill="white" />

              {/* Nose */}
              <ellipse cx="100" cy="80" rx="8" ry="6" fill="#1a1a1a" />

              {/* Mouth */}
              {dogFed && (
                <motion.path
                  d="M100 85 Q90 90 85 88 M100 85 Q110 90 115 88"
                  stroke="#1a1a1a"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}

              {/* Legs */}
              <rect x="70" y="140" width="15" height="40" fill="#6d4428" rx="7" />
              <rect x="115" y="140" width="15" height="40" fill="#6d4428" rx="7" />

              {/* Tail (wagging if fed) */}
              <motion.path
                d="M140 110 Q160 100 165 95"
                stroke="#8b5a3c"
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
                animate={dogFed ? {
                  d: ['M140 110 Q160 100 165 95', 'M140 110 Q160 120 165 125', 'M140 110 Q160 100 165 95'],
                } : {}}
                transition={dogFed ? {
                  duration: 0.5,
                  repeat: Infinity,
                } : {}}
              />
            </svg>

            {/* Hearts when dog is happy */}
            <AnimatePresence>
              {dogFed && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      initial={{ opacity: 0, y: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        y: [0, -40],
                        scale: [0, 1, 0.8],
                        x: [(i - 1) * 10, (i - 1) * 15],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.3,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20">
                        <path
                          d="M10 17.5 C10 17.5 2.5 12 2.5 7 C2.5 4 4.5 2.5 6.5 2.5 C8 2.5 9.5 3.5 10 5 C10.5 3.5 12 2.5 13.5 2.5 C15.5 2.5 17.5 4 17.5 7 C17.5 12 10 17.5 10 17.5 Z"
                          fill="#ff6b9d"
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
      <div className="absolute left-[45%] bottom-[20%] w-24 h-16">
        <InteractiveObject
          id="bowl"
          onClick={handleBowlClick}
          disabled={dogFoodInBowl || !foodJarOpen}
          hoverScale={1.1}
        >
          <div className="relative w-full h-full">
            <svg viewBox="0 0 100 60" className="w-full h-full">
              {/* Bowl */}
              <ellipse cx="50" cy="50" rx="45" ry="10" fill="#e5e7eb" />
              <path d="M5 50 Q5 30 50 30 Q95 30 95 50" fill="#d1d5db" />
              <ellipse cx="50" cy="30" rx="45" ry="8" fill="#e5e7eb" />

              {/* Food in bowl (if added) */}
              {dogFoodInBowl && !dogFed && (
                <g>
                  <ellipse cx="50" cy="35" rx="30" ry="6" fill="#8b5a3c" />
                  {[...Array(8)].map((_, i) => (
                    <circle
                      key={i}
                      cx={35 + (i % 4) * 10}
                      cy={32 + Math.floor(i / 4) * 6}
                      r="4"
                      fill="#6d4428"
                    />
                  ))}
                </g>
              )}
            </svg>

            {/* Instruction hint */}
            {foodJarOpen && !dogFoodInBowl && (
              <motion.div
                className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-white/60 text-xs"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Click to add food
              </motion.div>
            )}
          </div>
        </InteractiveObject>
      </div>

      {/* Food Jar (right side shelf) */}
      <div className="absolute right-[20%] top-[30%] w-32 h-40">
        <InteractiveObject
          id="food-jar"
          zoomable
          hoverScale={1.05}
        >
          <div className="relative w-full h-full">
            <svg viewBox="0 0 100 120" className="w-full h-full">
              {/* Jar */}
              <rect x="25" y="30" width="50" height="70" fill="#a78bfa" opacity="0.3" stroke="#7c3aed" strokeWidth="2" rx="5" />
              <rect x="25" y="30" width="50" height="10" fill="#7c3aed" />

              {/* Lid */}
              <rect x="20" y="20" width="60" height="12" fill="#6d28d9" rx="3" />
              <rect x="35" y="15" width="30" height="8" fill="#5b21b6" rx="2" />

              {/* Food kibbles inside (if not taken) */}
              {!foodJarOpen && (
                <g>
                  {[...Array(15)].map((_, i) => (
                    <circle
                      key={i}
                      cx={35 + (i % 5) * 8}
                      cy={45 + Math.floor(i / 5) * 10}
                      r="3"
                      fill="#8b5a3c"
                    />
                  ))}
                </g>
              )}

              {/* Label */}
              <text x="50" y="110" fontSize="10" textAnchor="middle" fill="#7c3aed" fontFamily="serif">
                DOG FOOD
              </text>
            </svg>
          </div>
        </InteractiveObject>
      </div>

      {/* Photo Frame (appears after dog is fed) */}
      <AnimatePresence>
        {dogPhotoCollected && (
          <motion.div
            className="absolute right-[15%] top-[20%] w-40 h-48"
            initial={{ opacity: 0, scale: 0, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              duration: 1,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
          >
            <InteractiveObject id="dog-photo" zoomable>
              <div className="w-full h-full bg-amber-900 p-3 border-4 border-amber-950 shadow-2xl">
                <div className="w-full h-full bg-amber-100 flex items-center justify-center text-amber-900 text-xs font-serif text-center p-2">
                  A cherished memory of playful moments together
                  <br />
                  🐕
                </div>
              </div>
            </InteractiveObject>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Food Jar Zoom View */}
      <ZoomView id="food-jar">
        <div className="bg-gradient-to-br from-purple-900 to-slate-900 rounded-xl p-8 border-4 border-purple-600 max-w-md mx-auto">
          <h2 className="text-2xl font-serif text-white text-center mb-6">Dog Food Jar</h2>

          {!foodJarOpen ? (
            <div className="space-y-6 text-center">
              <p className="text-white/80">A jar filled with dog food. The dog might be hungry...</p>

              <button
                onClick={() => {
                  setFoodJarOpen(true);
                  handleTakeFoodFromJar();
                }}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-serif text-lg rounded-lg transition-colors"
              >
                Open Jar
              </button>
            </div>
          ) : (
            <div className="text-center text-white/80 space-y-4">
              <p>You&apos;ve taken some food from the jar.</p>
              <p className="text-sm text-white/60">Click the bowl to add food, then feed the dog.</p>
            </div>
          )}
        </div>
      </ZoomView>

      {/* Dog Photo Zoom View */}
      <ZoomView id="dog-photo">
        <div className="bg-gradient-to-br from-amber-900 to-slate-900 rounded-xl p-8 border-4 border-amber-600 max-w-2xl mx-auto">
          <h2 className="text-3xl font-serif text-white text-center mb-6">A Precious Memory</h2>

          <div className="bg-amber-100 aspect-[4/3] rounded-lg mb-6 flex items-center justify-center text-6xl">
            🐕
          </div>

          <p className="text-white/90 text-center text-lg font-serif leading-relaxed">
            The photo shows a moment of pure joy - your dog looking up at you with complete trust and love.
            A reminder of the care, presence, and unconditional affection you share.
          </p>
        </div>
      </ZoomView>

      {/* Completion notification */}
      <AnimatePresence>
        {showPhoto && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md px-12 py-8 rounded-2xl border-2 border-amber-600 z-40"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-serif text-amber-300 text-center mb-2">Photo Collected!</h3>
            <p className="text-white/80 text-center">The Tarot Room has been unlocked.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
