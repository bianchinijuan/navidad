"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface AssetProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: {
    color: string;
    width: number;
    height: number;
  };
  style?: React.CSSProperties;
}

/**
 * Asset component - handles images with graceful fallback to colored placeholders
 * Use this for all game assets until real AI-generated images are ready
 */
export default function Asset({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder,
  style = {},
}: AssetProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // If image fails to load or doesn't exist, show placeholder
  if (hasError && placeholder) {
    return (
      <div
        className={`${className}`}
        style={{
          width: placeholder.width,
          height: placeholder.height,
          backgroundColor: placeholder.color,
          border: '2px dashed rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.5)',
          textAlign: 'center',
          padding: '8px',
          ...style,
        }}
      >
        {alt}
        <br />
        (placeholder)
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={src}
        alt={alt}
        width={width || placeholder?.width || 300}
        height={height || placeholder?.height || 300}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </motion.div>
  );
}
