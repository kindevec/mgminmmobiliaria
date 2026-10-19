'use client';

import React from 'react';

interface LogoMGMProps {
  className?: string;
  variant?: 'full' | 'compact' | 'symbol';
  showSubtitle?: boolean;
  isGhost?: boolean;
}

// Brand Vector Paths (Exact Geometry: House Emblem on top, MGM Letters centered below)
const ORANGE_PATH =
  'M 113,220 L 113,256 L 115,260 L 125,260 L 125,224 L 151,199 L 163,186 L 169,182 L 175,175 L 202,152 L 202,257 L 203,258 L 203,260 L 214,260 L 214,139 L 215,137 L 231,122 L 233,119 L 234,119 L 241,111 L 249,104 L 251,103 L 260,111 L 286,137 L 287,139 L 287,260 L 289,261 L 292,261 L 293,260 L 296,261 L 298,260 L 301,151 L 322,171 L 332,182 L 338,186 L 353,202 L 375,223 L 376,225 L 376,260 L 387,260 L 387,218 L 362,194 L 343,174 L 340,173 L 337,169 L 333,166 L 323,155 L 299,133 L 299,109 L 289,99 L 287,98 L 285,119 L 252,87 L 249,87 L 236,99 L 217,118 L 214,117 L 214,98 L 212,99 L 202,109 L 203,119 L 202,125 L 203,126 L 203,129 L 202,132 L 177,156 L 165,169 L 159,173 L 147,186 L 116,215 Z M 202,52 L 203,60 L 202,81 L 203,82 L 203,89 L 205,88 L 213,80 L 214,78 L 214,57 L 251,21 L 271,40 L 275,45 L 284,53 L 284,54 L 287,57 L 287,79 L 296,88 L 299,89 L 299,52 L 298,50 L 277,30 L 274,26 L 273,26 L 266,18 L 265,18 L 253,5 L 251,4 L 248,5 L 243,11 L 203,50 Z M 234,283 L 223,286 L 218,288 L 209,293 L 203,297 L 190,311 L 187,313 L 187,316 L 179,330 L 176,338 L 174,352 L 174,366 L 175,374 L 177,383 L 179,388 L 188,406 L 202,420 L 206,423 L 218,430 L 226,433 L 239,436 L 261,436 L 277,432 L 286,428 L 298,420 L 310,408 L 318,396 L 322,387 L 322,384 L 324,381 L 326,373 L 326,351 L 324,350 L 249,351 L 250,379 L 291,381 L 288,386 L 277,397 L 264,404 L 259,405 L 240,405 L 234,403 L 223,397 L 217,392 L 212,386 L 207,377 L 204,367 L 204,351 L 206,344 L 213,331 L 222,322 L 228,318 L 237,314 L 241,313 L 260,313 L 266,315 L 274,319 L 277,321 L 281,325 L 284,325 L 303,306 L 303,303 L 296,297 L 290,293 L 273,285 L 257,282 L 242,282 Z';

const GREEN_PATH =
  'M 158,134 L 158,173 L 165,168 L 169,164 L 169,140 L 213,98 L 220,90 L 248,63 L 251,62 L 253,63 L 255,66 L 282,91 L 300,110 L 330,138 L 331,140 L 332,150 L 332,163 L 334,166 L 338,169 L 340,172 L 343,173 L 343,134 L 319,111 L 317,108 L 299,90 L 296,89 L 262,55 L 251,45 L 243,51 L 237,58 L 216,77 L 205,89 L 179,113 Z M 169,183 L 163,187 L 159,191 L 158,193 L 158,260 L 160,261 L 164,261 L 165,260 L 169,260 Z M 333,183 L 331,184 L 331,259 L 333,261 L 337,261 L 343,260 L 343,193 L 339,188 Z M 254,178 L 255,189 L 257,190 L 263,190 L 264,189 L 266,189 L 266,178 L 264,177 Z M 235,178 L 235,189 L 237,189 L 238,190 L 244,190 L 245,189 L 247,189 L 246,177 Z M 235,197 L 236,208 L 242,209 L 247,208 L 246,196 Z M 254,197 L 255,208 L 266,207 L 265,196 Z M 39,283 L 40,436 L 69,435 L 70,375 L 85,395 L 103,421 L 107,425 L 111,431 L 111,432 L 113,433 L 137,401 L 144,390 L 152,379 L 155,376 L 157,379 L 157,397 L 156,402 L 157,436 L 186,436 L 187,434 L 187,405 L 178,388 L 176,383 L 174,374 L 173,366 L 173,352 L 175,338 L 178,330 L 186,316 L 187,312 L 186,283 L 175,297 L 138,348 L 134,355 L 130,359 L 115,380 L 115,381 L 111,381 L 95,358 L 91,354 L 80,339 L 76,332 L 46,291 Z M 313,283 L 313,349 L 324,349 L 326,350 L 327,373 L 325,381 L 323,384 L 323,387 L 320,394 L 315,401 L 313,405 L 314,436 L 343,435 L 344,375 L 352,385 L 359,396 L 367,407 L 374,415 L 378,422 L 386,433 L 390,430 L 416,393 L 422,386 L 424,382 L 427,379 L 427,378 L 431,377 L 430,378 L 430,433 L 431,435 L 460,436 L 461,434 L 460,283 L 455,289 L 453,293 L 444,304 L 420,337 L 413,348 L 404,359 L 391,377 L 390,380 L 388,382 L 386,382 L 384,380 L 378,370 L 339,318 L 321,292 L 315,285 L 315,284 Z';

export function LogoMGM({
  className = 'h-11 sm:h-12 lg:h-14 w-auto',
  variant = 'full',
  showSubtitle = true,
  isGhost = false,
}: LogoMGMProps) {
  // Variant symbol: sólo el isotipo vectorial
  if (variant === 'symbol') {
    return (
      <svg
        viewBox="0 0 500 450"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="MGM Inmobiliaria Isotipo"
      >
        <path d={ORANGE_PATH} fill="#EA931F" fillRule="evenodd" />
        <path d={GREEN_PATH} fill="#55AB46" fillRule="evenodd" />
      </svg>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 sm:gap-3.5 select-none ${className}`}>
      <svg
        viewBox="0 0 500 450"
        className="h-full w-auto aspect-square shrink-0 max-h-20 sm:max-h-24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="MGM Inmobiliaria Logo"
      >
        <path d={ORANGE_PATH} fill="#EA931F" fillRule="evenodd" />
        <path d={GREEN_PATH} fill="#55AB46" fillRule="evenodd" />
      </svg>

      {showSubtitle && (
        <div className="flex flex-col text-left justify-center">
          <span
            className={`font-black text-lg sm:text-xl lg:text-[22px] tracking-tight leading-none transition-colors ${
              isGhost ? 'text-white' : 'text-slate-900'
            }`}
          >
            MGM INMOBILIARIA
          </span>
          <span
            className={`text-xs sm:text-[13px] tracking-wider font-semibold uppercase mt-0.5 transition-colors ${
              isGhost ? 'text-emerald-300' : 'text-slate-500'
            }`}
          >
            Sociedad Civil · Ecuador
          </span>
        </div>
      )}
    </div>
  );
}
