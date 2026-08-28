import React from 'react';

interface VeloraSymbolProps {
  className?: string;
  size?: number | string;
  color?: string;
  variant?: 'monochrome' | 'accent';
}

/**
 * VELORA Brand Symbol
 * 
 * Concept:
 * An abstract high-precision geometric construct combining:
 * - The letter "V"
 * - A cinematic camera frame / anamorphic aperture
 * - Forward temporal momentum & continuous generative flow
 * 
 * Works as a single-color vector from 16px to 512px.
 */
export const VeloraSymbol: React.FC<VeloraSymbolProps> = ({
  className = '',
  size = 24,
  color = 'currentColor',
  variant = 'monochrome',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform ${className}`}
      aria-label="VELORA Symbol"
    >
      {/* Left wing facet: Descending anchor line with precise chamfered bevel */}
      <path
        d="M4.5 6.5C4.5 5.67157 5.17157 5 6 5H10.8C11.3304 5 11.8391 5.21071 12.2142 5.58579L16 9.37157L11.5 27L4.5 6.5Z"
        fill={variant === 'accent' ? 'url(#velora-accent-grad-1)' : color}
        fillOpacity={variant === 'monochrome' ? 0.95 : 1}
      />

      {/* Right wing facet: Forward dynamic trajectory extending across the temporal plane */}
      <path
        d="M27.5 6.5C27.5 5.67157 26.8284 5 26 5H21.2C20.6696 5 20.1609 5.21071 19.7858 5.58579L16 9.37157L20.5 27L27.5 6.5Z"
        fill={variant === 'accent' ? 'url(#velora-accent-grad-2)' : color}
        fillOpacity={variant === 'monochrome' ? 0.75 : 0.85}
      />

      {/* Central cinematic aperture diamond / focal core */}
      <path
        d="M16 11.5L18.8 17.5L16 23L13.2 17.5L16 11.5Z"
        fill={variant === 'accent' ? '#FFFFFF' : color}
        fillOpacity={variant === 'monochrome' ? 1 : 0.9}
      />

      {variant === 'accent' && (
        <defs>
          <linearGradient id="velora-accent-grad-1" x1="4.5" y1="5" x2="16" y2="27" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7C3AED" />
            <stop offset="1" stopColor="#5B45FF" />
          </linearGradient>
          <linearGradient id="velora-accent-grad-2" x1="27.5" y1="5" x2="16" y2="27" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#6366F1" />
          </linearGradient>
        </defs>
      )}
    </svg>
  );
};

export const VeloraWordmark: React.FC<{
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  subtitleText?: string;
}> = ({
  className = '',
  size = 'md',
  showSubtitle = false,
  subtitleText = 'AI Video Studio',
}) => {
  const sizeStyles = {
    sm: 'text-sm tracking-[0.24em]',
    md: 'text-base tracking-[0.28em]',
    lg: 'text-xl tracking-[0.32em]',
  };

  return (
    <div className={`flex flex-col select-none ${className}`}>
      <span
        className={`font-bold font-sans text-white uppercase leading-none ${sizeStyles[size]}`}
        style={{ letterSpacing: '0.28em' }}
      >
        VELORA
      </span>
      {showSubtitle && (
        <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase mt-0.5 font-medium">
          {subtitleText}
        </span>
      )}
    </div>
  );
};

export const VeloraLogo: React.FC<{
  className?: string;
  symbolSize?: number;
  wordmarkSize?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  subtitleText?: string;
  variant?: 'monochrome' | 'accent';
  collapsed?: boolean;
}> = ({
  className = '',
  symbolSize = 22,
  wordmarkSize = 'md',
  showSubtitle = false,
  subtitleText = 'AI Video Studio',
  variant = 'accent',
  collapsed = false,
}) => {
  if (collapsed) {
    return (
      <div className={`inline-flex items-center justify-center ${className}`} title="VELORA">
        <VeloraSymbol size={symbolSize} variant={variant} />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <VeloraSymbol size={symbolSize} variant={variant} />
      <VeloraWordmark
        size={wordmarkSize}
        showSubtitle={showSubtitle}
        subtitleText={subtitleText}
      />
    </div>
  );
};

/**
 * Micro-animated Velora Symbol for generation progress & loading states
 */
export const VeloraAnimatedSymbol: React.FC<{
  size?: number;
  className?: string;
}> = ({ size = 48, className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full bg-violet-600/10 animate-ping opacity-30" />
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-pulse"
      >
        <path
          d="M4.5 6.5C4.5 5.67157 5.17157 5 6 5H10.8C11.3304 5 11.8391 5.21071 12.2142 5.58579L16 9.37157L11.5 27L4.5 6.5Z"
          fill="#8B5CF6"
        />
        <path
          d="M27.5 6.5C27.5 5.67157 26.8284 5 26 5H21.2C20.6696 5 20.1609 5.21071 19.7858 5.58579L16 9.37157L20.5 27L27.5 6.5Z"
          fill="#6366F1"
        />
        <path
          d="M16 11.5L18.8 17.5L16 23L13.2 17.5L16 11.5Z"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
};
