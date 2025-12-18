"use client";

/**
 * Vintage damask wallpaper pattern background
 * Inspired by classic Cube Escape room aesthetics
 */
export default function WallpaperPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Damask pattern */}
          <pattern
            id="damask"
            x="0"
            y="0"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            {/* Background */}
            <rect width="120" height="120" fill="#a88650" />

            {/* Ornamental motif */}
            <g opacity="0.3" fill="#6d5128">
              {/* Central medallion */}
              <ellipse cx="60" cy="60" rx="25" ry="35" />
              <ellipse cx="60" cy="60" rx="20" ry="30" fill="#a88650" />

              {/* Top flourish */}
              <path d="M60 25 Q50 30 45 35 Q50 32 60 30 Q70 32 75 35 Q70 30 60 25" />

              {/* Bottom flourish */}
              <path d="M60 95 Q50 90 45 85 Q50 88 60 90 Q70 88 75 85 Q70 90 60 95" />

              {/* Side flourishes */}
              <path d="M25 60 Q30 50 35 45 Q32 50 30 60 Q32 70 35 75 Q30 70 25 60" />
              <path d="M95 60 Q90 50 85 45 Q88 50 90 60 Q88 70 85 75 Q90 70 95 60" />

              {/* Corner details */}
              <circle cx="20" cy="20" r="3" />
              <circle cx="100" cy="20" r="3" />
              <circle cx="20" cy="100" r="3" />
              <circle cx="100" cy="100" r="3" />
            </g>
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#damask)" />
      </svg>
    </div>
  );
}
