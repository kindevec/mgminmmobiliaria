'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ArrowUpRight,
  BedDouble,
  Bath,
  ShieldCheck,
  Ruler,
  Maximize2,
  MapPin,
} from 'lucide-react';
import type { LotProperty } from '@/src/data/lots';
import { getLotWhatsAppUrl } from '@/src/data/lots';
import { WhatsAppIcon } from './SocialIcons';

interface PropertyCardProps {
  lot: LotProperty;
  onSelectLot: (lot: LotProperty) => void;
  onOpenVisitModal: (lotCode: string) => void;
  dark?: boolean;
}

export function PropertyCard({
  lot,
  onSelectLot,
  onOpenVisitModal,
  dark = false,
}: PropertyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const isAvailable = lot.status === 'Disponible';
  const isReserved = lot.status === 'En Reserva';
  const isHouse = lot.type === 'Vivienda';

  return (
    <div
      className="group relative w-full max-w-[245px] sm:max-w-none mx-auto h-[350px] sm:h-[400px] lg:h-[440px] [perspective:1200px] select-none cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full rounded-2xl sm:rounded-3xl transition-transform duration-700 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* ===================================================================
            CARA FRONTAL: FOTO (NÚMERO + DISPONIBILIDAD) + NOMBRE + PRECIO
            (SIN BOTONES NI CATEGORÍAS)
            =================================================================== */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between border transition-shadow duration-300 [backface-visibility:hidden] [transform:rotateY(0deg)] ${
            dark
              ? 'bg-slate-900 border-white/15 text-white shadow-xl group-hover:shadow-2xl'
              : 'bg-white border-slate-200/90 text-slate-900 shadow-md group-hover:shadow-2xl'
          }`}
        >
          {/* 1. Foto: NÚMERO DE LOTE + ETIQUETA DE DISPONIBILIDAD */}
          <div className="relative w-full h-[62%] sm:h-[64%] overflow-hidden bg-slate-950">
            <Image
              src={lot.image}
              alt={lot.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Badges superiores: Número de lote a la izquierda, Disponibilidad a la derecha */}
            <div className="absolute top-2.5 sm:top-3 inset-x-2.5 sm:inset-x-3 flex items-center justify-between z-10">
              {/* Número de lote */}
              <span className="text-[10px] sm:text-xs font-mono font-black text-white bg-slate-950/85 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full backdrop-blur-md border border-white/20 shadow-xs">
                {lot.code}
              </span>

              {/* Etiqueta de disponibilidad */}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide backdrop-blur-md shadow-xs ${
                  isAvailable
                    ? 'bg-emerald-950/85 text-emerald-300 border border-emerald-500/30'
                    : isReserved
                    ? 'bg-amber-950/85 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-900/85 text-slate-300 border border-white/20'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                    isAvailable ? 'bg-[#25D366]' : isReserved ? 'bg-amber-400' : 'bg-slate-400'
                  }`}
                />
                <span>{lot.status}</span>
              </span>
            </div>
          </div>

          {/* 2. Cuerpo frontal: Nombre y Precio (Completamente lleno, sin espacios en blanco vacíos) */}
          <div className="p-3 sm:p-4 lg:p-4.5 flex-1 flex flex-col justify-between space-y-1.5">
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug line-clamp-1">
                {lot.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                {lot.zone} · {lot.areaM2} m²
              </p>
            </div>

            {/* Precio y cuota */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block leading-none mb-0.5">
                  Precio de Venta
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-base sm:text-lg lg:text-xl font-black text-slate-900">
                    ${lot.priceUSD.toLocaleString()}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-500">USD</span>
                </div>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-[#F58220] font-mono bg-orange-50 border border-orange-200/60 px-2 py-0.5 rounded-full shrink-0">
                ${lot.estimatedMonthlyUSD}/mes
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================================
            CARA TRASERA (AL PASAR EL MOUSE): DESCRIPCIÓN + 3 BAÑOS/ESPECIFICACIONES + BOTONES
            (SIN NÚMERO DE LOTE)
            =================================================================== */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 lg:p-5 flex flex-col justify-between border transition-shadow duration-300 [backface-visibility:hidden] [transform:rotateY(180deg)] ${
            dark
              ? 'bg-slate-900 border-[#22A33D]/40 text-white shadow-2xl'
              : 'bg-[#fbfbfa] border-[#22A33D]/30 text-slate-900 shadow-xl'
          }`}
        >
          {/* Header trasero: Nombre del lote */}
          <div className="pb-1 sm:pb-1.5 border-b border-slate-200/80">
            <h4 className="text-xs sm:text-sm lg:text-base font-black text-slate-900 leading-snug truncate">
              {lot.name}
            </h4>
          </div>

          {/* Bloque central: Descripción del lote */}
          <div className="space-y-2 flex-1 overflow-y-auto py-1 scrollbar-thin flex flex-col justify-center">
            <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed font-serif italic bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/70 shadow-2xs line-clamp-2 sm:line-clamp-3">
              &ldquo;{lot.description}&rdquo;
            </p>

            {/* Especificaciones detalladas (3 baños, dormitorios, dimensiones, etc.) */}
            <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] sm:text-xs text-slate-700 bg-white/60 p-1.5 sm:p-2 rounded-lg border border-slate-200/50">
              {isHouse ? (
                <>
                  <div className="flex items-center gap-1 truncate">
                    <BedDouble className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#22A33D] shrink-0" />
                    <span className="font-semibold">{lot.beds} Dorms</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1 truncate">
                    <Bath className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#F58220] shrink-0" />
                    <span className="font-semibold">{lot.baths} Baños</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1 truncate">
                    <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#22A33D] shrink-0" />
                    <span className="font-semibold">{lot.registryStatus ? 'Listo' : 'Trámite'}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1 truncate">
                    <Ruler className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#F58220] shrink-0" />
                    <span className="font-semibold">{lot.dimensions.split('x')[0] || '10'}m fte</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1 truncate">
                    <Maximize2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#22A33D] shrink-0" />
                    <span className="font-semibold truncate max-w-[50px] sm:max-w-none">{lot.topography}</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1 truncate">
                    <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#22A33D] shrink-0" />
                    <span className="font-semibold">{lot.registryStatus ? 'Legal' : 'Trámite'}</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500 font-medium px-0.5">
              <span className="flex items-center gap-1 truncate max-w-[120px]">
                <MapPin className="h-3 w-3 text-[#22A33D] shrink-0" />
                <span className="truncate">{lot.zone}</span>
              </span>
              <span className="font-mono font-bold text-slate-900 shrink-0">{lot.areaM2} m²</span>
            </div>
          </div>

          {/* Botones de acción: Ficha Completa + Visita + WhatsApp */}
          <div className="pt-1.5 sm:pt-2 border-t border-slate-200/80 space-y-1.5 sm:space-y-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectLot(lot);
              }}
              className="w-full bg-[#113d22] hover:bg-[#22A33D] text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-xs text-center inline-flex items-center justify-center gap-1"
            >
              <span>Ver Ficha &amp; Fotos</span>
              <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenVisitModal(lot.code);
                }}
                className="flex-1 bg-[#F58220] hover:bg-[#ea580c] text-white py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-xs text-center inline-flex items-center justify-center gap-1 truncate"
              >
                <span>Visitar</span>
              </button>

              <a
                href={getLotWhatsAppUrl(lot.code, lot.name, lot.priceUSD)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-[#22A33D] hover:bg-[#1a8230] text-white py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-bold transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-xs text-center inline-flex items-center justify-center gap-1 truncate"
              >
                <WhatsAppIcon size={12} className="text-white shrink-0" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
