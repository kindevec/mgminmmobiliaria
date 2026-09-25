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
  onOpenVisitModal,
  dark = false,
}: PropertyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const isAvailable = lot.status === 'Disponible';
  const isReserved = lot.status === 'En Reserva';
  const isHouse = lot.type === 'Vivienda';

  return (
    <div
      className="group relative w-full h-[460px] sm:h-[480px] [perspective:1200px] select-none cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full rounded-3xl transition-transform duration-700 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* ===================================================================
            CARA FRONTAL: FOTO (NÚMERO + DISPONIBILIDAD) + NOMBRE + PRECIO
            (SIN BOTONES NI CATEGORÍAS)
            =================================================================== */}
        <div
          className={`absolute inset-0 w-full h-full rounded-3xl overflow-hidden flex flex-col justify-between border transition-shadow duration-300 [backface-visibility:hidden] [transform:rotateY(0deg)] ${
            dark
              ? 'bg-slate-900 border-white/15 text-white shadow-xl group-hover:shadow-2xl'
              : 'bg-white border-slate-200/90 text-slate-900 shadow-md group-hover:shadow-2xl'
          }`}
        >
          {/* 1. Foto: NÚMERO DE LOTE + ETIQUETA DE DISPONIBILIDAD */}
          <div className="relative w-full h-[62%] overflow-hidden bg-slate-950">
            <Image
              src={lot.image}
              alt={lot.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Badges superiores: Número de lote a la izquierda, Disponibilidad a la derecha */}
            <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
              {/* Número de lote */}
              <span className="text-xs font-mono font-black text-white bg-slate-950/85 px-3 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-md">
                {lot.code}
              </span>

              {/* Etiqueta de disponibilidad */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide backdrop-blur-md shadow-md ${
                  isAvailable
                    ? 'bg-emerald-950/85 text-emerald-300 border border-emerald-500/30'
                    : isReserved
                    ? 'bg-amber-950/85 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-900/85 text-slate-300 border border-white/20'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isAvailable ? 'bg-[#25D366]' : isReserved ? 'bg-amber-400' : 'bg-slate-400'
                  }`}
                />
                {lot.status}
              </span>
            </div>
          </div>

          {/* 2. Cuerpo frontal: Nombre y Precio (Limpios, sin botones) */}
          <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug line-clamp-2">
                {lot.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {lot.zone} · {lot.areaM2} m²
              </p>
            </div>

            {/* Precio */}
            <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Precio de Venta
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-xl font-black text-slate-900">
                    ${lot.priceUSD.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">USD</span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#F58220] font-mono bg-orange-50 border border-orange-200/60 px-2 py-0.5 rounded-full">
                Cuota: ${lot.estimatedMonthlyUSD}/mes
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================================
            CARA TRASERA (AL PASAR EL MOUSE): DESCRIPCIÓN + 3 BAÑOS/ESPECIFICACIONES + BOTONES
            (SIN NÚMERO DE LOTE)
            =================================================================== */}
        <div
          className={`absolute inset-0 w-full h-full rounded-3xl p-5 sm:p-6 flex flex-col justify-between border transition-shadow duration-300 [backface-visibility:hidden] [transform:rotateY(180deg)] ${
            dark
              ? 'bg-slate-900 border-[#22A33D]/40 text-white shadow-2xl'
              : 'bg-[#fbfbfa] border-[#22A33D]/30 text-slate-900 shadow-xl'
          }`}
        >
          {/* Header trasero: Nombre del lote */}
          <div className="pb-2 border-b border-slate-200/80">
            <h4 className="text-base font-black text-slate-900 leading-snug">
              {lot.name}
            </h4>
          </div>

          {/* Bloque central: Descripción del lote */}
          <div className="space-y-3 flex-1 overflow-y-auto py-2 scrollbar-thin flex flex-col justify-center">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif italic bg-white p-3.5 rounded-2xl border border-slate-200/70 shadow-xs">
              &ldquo;{lot.description}&rdquo;
            </p>

            {/* Especificaciones detalladas (3 baños, dormitorios, dimensiones, etc.) */}
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-700 bg-white/60 p-2.5 rounded-xl border border-slate-200/50">
              {isHouse ? (
                <>
                  <div className="flex items-center gap-1">
                    <BedDouble className="h-3.5 w-3.5 text-[#22A33D]" />
                    <span className="font-semibold">{lot.beds} Dorms</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <Bath className="h-3.5 w-3.5 text-[#F58220]" />
                    <span className="font-semibold">{lot.baths} Baños</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#22A33D]" />
                    <span className="font-semibold">{lot.registryStatus ? 'Escrituras Listas' : 'En Trámite'}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1">
                    <Ruler className="h-3.5 w-3.5 text-[#F58220]" />
                    <span className="font-semibold">Frente {lot.dimensions.split('x')[0] || '10'}m</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <Maximize2 className="h-3.5 w-3.5 text-[#22A33D]" />
                    <span className="font-semibold">{lot.topography}</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#22A33D]" />
                    <span className="font-semibold">{lot.registryStatus ? 'Legalizado' : 'En Trámite'}</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-[#22A33D]" />
                <span>{lot.zone}</span>
              </span>
              <span className="font-mono font-bold text-slate-900">{lot.areaM2} m²</span>
            </div>
          </div>

          {/* Botones de acción: Exclusivos en la cara trasera / descripción (Naranja Visita + Verde WhatsApp) */}
          <div className="pt-3 border-t border-slate-200/80 flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenVisitModal(lot.code);
              }}
              className="flex-1 bg-[#F58220] hover:bg-[#ea580c] text-white py-2.5 px-3 rounded-xl text-xs font-bold transition-all hover:scale-102 active:scale-95 cursor-pointer shadow-md text-center inline-flex items-center justify-center gap-1.5"
            >
              <span>Visitar</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>

            <a
              href={getLotWhatsAppUrl(lot.code, lot.name, lot.priceUSD)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 bg-[#22A33D] hover:bg-[#1a8230] text-white py-2.5 px-3 rounded-xl text-xs font-bold transition-all hover:scale-102 active:scale-95 cursor-pointer shadow-md text-center inline-flex items-center justify-center gap-1.5"
            >
              <WhatsAppIcon size={16} className="text-white" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
