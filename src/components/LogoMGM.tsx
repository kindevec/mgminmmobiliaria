'use client';

import React from 'react';

interface LogoMGMProps {
  className?: string;
  variant?: 'full' | 'compact' | 'symbol';
  showSubtitle?: boolean;
  isGhost?: boolean;
}

export function LogoMGM({
  className = 'h-10 w-auto',
  variant = 'full',
  showSubtitle = true,
  isGhost = false,
}: LogoMGMProps) {
  if (variant === 'symbol') {
    return (
      <svg
        viewBox="0 0 300 240"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="MGM Inmobiliaria Isotipo"
      >
        {/* Roof 1 (Top Orange Gable) */}
        <path
          d="M 150,15 L 175,48 L 175,145 L 166,145 L 166,56 L 150,35 L 134,56 L 134,145 L 125,145 L 125,48 Z"
          fill="#F58220"
        />
        {/* Roof 2 (Middle Green Gable) */}
        <path
          d="M 150,55 L 202,115 L 202,150 L 193,150 L 193,120 L 150,72 L 107,120 L 107,150 L 98,150 L 98,115 Z"
          fill="#22A33D"
        />
        {/* Roof 3 (Outer Orange Gable) */}
        <path
          d="M 150,92 L 230,172 L 230,155 L 150,75 L 70,155 L 70,172 Z"
          fill="#F58220"
        />
        {/* 4-Pane Green Window */}
        <rect x="141" y="96" width="7" height="7" rx="1" fill="#22A33D" />
        <rect x="152" y="96" width="7" height="7" rx="1" fill="#22A33D" />
        <rect x="141" y="107" width="7" height="7" rx="1" fill="#22A33D" />
        <rect x="152" y="107" width="7" height="7" rx="1" fill="#22A33D" />
        {/* MGM Letters in Symbol */}
        <path
          d="M 30,155 L 68,155 L 94,204 L 120,155 L 126,155 L 126,235 L 98,235 L 98,194 L 77,230 L 62,230 L 60,194 L 60,235 L 30,235 Z"
          fill="#22A33D"
        />
        <path
          d="M 150,154 C 176,154 196,171 196,202 C 196,233 176,240 150,240 C 124,240 110,221 110,202 C 110,174 125,154 150,154 Z M 150,178 C 139,178 132,187 132,202 C 132,217 139,226 150,226 C 160,226 166,218 168,209 L 148,209 L 148,192 L 191,192 C 192,195 192,198 192,202 C 192,227 176,245 150,245 C 126,245 113,227 113,202 C 113,177 126,160 150,160 Z"
          fill="#F58220"
        />
        <path
          d="M 172,155 L 178,155 L 204,204 L 230,155 L 268,155 L 268,235 L 238,235 L 238,194 L 236,230 L 221,230 L 200,194 L 200,235 L 172,235 Z"
          fill="#22A33D"
        />
      </svg>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <svg
        viewBox="0 0 500 440"
        className="h-full w-auto max-h-12 aspect-[500/440]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="MGM Inmobiliaria Logo"
      >
        {/* Roof 1 (Top Orange Gable) */}
        <path
          d="M 250,30 L 285,75 L 285,220 L 273,220 L 273,85 L 250,55 L 227,85 L 227,220 L 215,220 L 215,75 Z"
          fill="#F58220"
        />
        {/* Roof 2 (Middle Green Gable) */}
        <path
          d="M 250,90 L 320,170 L 320,220 L 308,220 L 308,177 L 250,110 L 192,177 L 192,220 L 180,220 L 180,170 Z"
          fill="#22A33D"
        />
        {/* Roof 3 (Lower Orange Outer Gable) */}
        <path
          d="M 250,140 L 355,250 L 355,220 L 250,115 L 145,220 L 145,250 Z"
          fill="#F58220"
        />
        <rect x="145" y="175" width="12" height="45" fill="#F58220" />
        <rect x="343" y="175" width="12" height="45" fill="#F58220" />

        {/* 4-Pane Green Window */}
        <rect x="238" y="147" width="10" height="10" rx="1.5" fill="#22A33D" />
        <rect x="252" y="147" width="10" height="10" rx="1.5" fill="#22A33D" />
        <rect x="238" y="161" width="10" height="10" rx="1.5" fill="#22A33D" />
        <rect x="252" y="161" width="10" height="10" rx="1.5" fill="#22A33D" />

        {/* MGM Letters */}
        {/* Left M */}
        <path
          d="M 85,230 L 138,230 L 175,300 L 212,230 L 220,230 L 220,360 L 180,360 L 180,287 L 150,345 L 128,345 L 125,287 L 125,360 L 85,360 Z"
          fill="#22A33D"
        />
        {/* Center G */}
        <path
          d="M 250,228 C 285,228 312,252 312,295 C 312,338 285,362 250,362 C 215,362 195,335 195,295 C 195,255 216,228 250,228 Z M 250,260 C 235,260 227,273 227,295 C 227,317 235,330 250,330 C 263,330 272,319 274,307 L 246,307 L 246,283 L 305,283 C 306,287 306,291 306,295 C 306,330 285,355 250,355 C 218,355 200,330 200,295 C 200,260 218,235 250,235 Z"
          fill="#F58220"
        />
        {/* Right M */}
        <path
          d="M 280,230 L 288,230 L 325,300 L 362,230 L 415,230 L 415,360 L 375,360 L 375,287 L 372,345 L 350,345 L 320,287 L 320,360 L 280,360 Z"
          fill="#22A33D"
        />

        {/* Subtitle */}
        {showSubtitle && (
          <text
            x="250"
            y="405"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="800"
            fontSize="21"
            letterSpacing="2"
            fill={isGhost ? '#ffffff' : '#0f172a'}
          >
            SOCIEDAD CIVIL MGM INMOBILIARIA
          </text>
        )}
      </svg>
      {variant === 'compact' && showSubtitle && (
        <div className="flex flex-col text-left">
          <span
            className={`font-extrabold text-sm tracking-tight leading-tight transition-colors ${
              isGhost
                ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                : 'text-slate-900'
            }`}
          >
            MGM INMOBILIARIA
          </span>
          <span
            className={`text-[10px] tracking-wider font-semibold uppercase transition-colors ${
              isGhost
                ? 'text-emerald-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]'
                : 'text-slate-500'
            }`}
          >
            Sociedad Civil · Ecuador
          </span>
        </div>
      )}
    </div>
  );
}
