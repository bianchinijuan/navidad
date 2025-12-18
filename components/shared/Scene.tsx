"use client";

import { CSSProperties, ReactNode } from 'react';

/**
 * SCENE COMPONENT - Sistema de Posicionamiento Proporcional
 *
 * Usa un sistema de coordenadas fijo (1000x600) donde todos los assets
 * se posicionan con porcentajes derivados de este grid.
 *
 * El aspect-ratio garantiza que las proporciones se mantengan siempre,
 * independientemente del tamaño de la ventana.
 */

interface SceneProps {
  children: ReactNode;
  background?: string;
  maxWidth?: string;
}

export function Scene({ children, background = '#6B0F1A', maxWidth = '1400px' }: SceneProps) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: '1000 / 600',
        maxWidth,
        background,
      }}
    >
      {/* SVG invisible - Sistema de coordenadas */}
      <svg
        className="absolute w-full h-full pointer-events-none opacity-0"
        viewBox="0 0 1000 600"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* No renderiza nada, solo establece el sistema de coordenadas */}
      </svg>

      {children}
    </div>
  );
}

/**
 * ASSET COMPONENT
 *
 * Posiciona un asset usando coordenadas del sistema 1000x600.
 *
 * @param x - Posición horizontal (0-1000)
 * @param y - Posición vertical desde arriba (0-600), opcional si se usa bottom
 * @param bottom - Distancia desde el piso (0-600), alternativa a y
 * @param width - Ancho en unidades del grid (0-1000)
 * @param height - Alto en unidades del grid (0-600)
 * @param centered - Si true, centra horizontalmente en x
 * @param zIndex - Orden de apilamiento
 */

interface AssetProps {
  src: string;
  alt: string;
  x: number;
  y?: number;
  bottom?: number;
  width: number;
  height: number;
  centered?: boolean;
  zIndex?: number;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

export function Asset({
  src,
  alt,
  x,
  y,
  bottom,
  width,
  height,
  centered = false,
  zIndex = 1,
  className = '',
  onClick,
  style = {},
}: AssetProps) {
  // Convertir coordenadas del grid (1000x600) a porcentajes
  const leftPercent = (x / 1000) * 100;
  const widthPercent = (width / 1000) * 100;
  const heightPercent = (height / 600) * 100;

  // Calcular posición vertical
  let topPercent: number | undefined;
  let bottomPercent: number | undefined;

  if (bottom !== undefined) {
    // Posicionar desde el piso hacia arriba
    bottomPercent = (bottom / 600) * 100;
  } else if (y !== undefined) {
    // Posicionar desde arriba
    topPercent = (y / 600) * 100;
  }

  const assetStyle: CSSProperties = {
    position: 'absolute',
    left: `${leftPercent}%`,
    top: topPercent !== undefined ? `${topPercent}%` : undefined,
    bottom: bottomPercent !== undefined ? `${bottomPercent}%` : undefined,
    width: `${widthPercent}%`,
    height: `${heightPercent}%`,
    transform: centered ? 'translateX(-50%)' : undefined,
    zIndex,
    display: 'block',
    objectFit: 'contain',
    cursor: onClick ? 'pointer' : undefined,
    ...style,
  };

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={assetStyle}
      onClick={onClick}
    />
  );
}

/**
 * FLOOR COMPONENT - Gradiente de piso o imagen
 */
interface FloorProps {
  height?: number;
  src?: string;
  gradient?: boolean;
}

export function Floor({ height = 180, src, gradient = true }: FloorProps) {
  const heightPercent = (height / 600) * 100;

  // Si hay imagen, usar imagen
  if (src) {
    return (
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: `${heightPercent}%`,
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom center',
          backgroundRepeat: 'repeat-x',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
    );
  }

  // Si no, usar gradiente
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: `${heightPercent}%`,
        background: gradient ? 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%)' : 'transparent',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

/**
 * OVERLAY COMPONENT - Para elementos UI superpuestos
 */
interface OverlayProps {
  children: ReactNode;
  zIndex?: number;
}

export function Overlay({ children, zIndex = 100 }: OverlayProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex,
      }}
    >
      {children}
    </div>
  );
}
