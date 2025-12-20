"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Snowflake {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

export default function Snowfall({ count = 50 }: { count?: number }) {
  // Use useState with useEffect to generate snowflakes only on client
  // This prevents hydration errors from Math.random() differences between server/client
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    setSnowflakes(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 4 + 4, // Larger snowflakes: 4-8px instead of 2-5px
        duration: Math.random() * 8 + 8, // Faster: 8-16s instead of 10-20s
        delay: Math.random() * 5,
      }))
    );
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${flake.x}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            top: '-10px',
            opacity: 0.85,
            boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, Math.sin(flake.id) * 30],
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
