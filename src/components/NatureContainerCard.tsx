'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin, ChevronRight } from 'lucide-react';

export interface NatureContainerCardProps {
  image: string;
  imageAlt: string;
  badgeTopLeft?: string;
  tagRight?: string;
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonIcon?: React.ReactNode;
  onPrimaryClick: () => void;
  secondaryLinkText?: string;
  onSecondaryClick?: () => void;
  extraInfo?: React.ReactNode;
}

export function NatureContainerCard({
  image,
  imageAlt,
  title,
  description,
  primaryButtonText,
  primaryButtonIcon,
  onPrimaryClick,
  secondaryLinkText,
  onSecondaryClick,
  extraInfo,
}: NatureContainerCardProps) {
  return (
    <div className="w-full bg-[#f4f7ee] rounded-[2.2rem] sm:rounded-[2.8rem] lg:rounded-[3.2rem] border border-[#dce3d2] shadow-xl overflow-hidden transition-all duration-300 flex flex-col lg:flex-row">
      {/* Columna Izquierda: La imagen ocupa todo el ancho y alto del contenedor en su ubicación */}
      <div className="relative w-full lg:w-5/12 h-[280px] sm:h-[350px] lg:h-auto min-h-[280px] sm:min-h-[350px] lg:min-h-[400px] bg-slate-900 shrink-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-cover transition-transform duration-700 hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Columna Derecha: Título, texto debajo de él y botones completamente centrados */}
      <div className="w-full lg:w-7/12 flex flex-col justify-center items-center text-center space-y-4 sm:space-y-5 p-6 sm:p-8 lg:p-12">
        {/* Título Principal Centrado */}
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#18181B] tracking-tight leading-[1.18] [text-wrap:balance] text-center mx-auto">
          {title}
        </h3>

        {/* Párrafo descriptivo centrado */}
        <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed max-w-xl text-center mx-auto">
          {description}
        </p>

        {/* Extra Info centrado si se proporciona */}
        {extraInfo && <div className="pt-1 flex justify-center">{extraInfo}</div>}

        {/* Botones de acción centrados */}
        <div className="pt-2 sm:pt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onPrimaryClick}
            className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#22A33D] hover:bg-[#1a8230] text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            {primaryButtonIcon ? (
              primaryButtonIcon
            ) : (
              <MapPin className="h-4 w-4 text-white" />
            )}
            <span>{primaryButtonText}</span>
          </button>

          {secondaryLinkText && onSecondaryClick && (
            <button
              onClick={onSecondaryClick}
              className="text-xs sm:text-sm font-bold text-[#18181B] hover:text-[#F58220] inline-flex items-center gap-1 transition-colors py-2 px-2 cursor-pointer group"
            >
              <span>{secondaryLinkText}</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
