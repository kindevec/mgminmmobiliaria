'use client';

import React from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  Ruler,
  MapPin,
  CreditCard,
} from 'lucide-react';
import type { LotProperty } from '@/src/data/lots';
import { getLotWhatsAppUrl } from '@/src/data/lots';
import { WhatsAppIcon } from './SocialIcons';

interface PropertyCardProps {
  lot: LotProperty;
  onSelectLot: (lot: LotProperty) => void;
  onOpenVisitModal?: (lotCode: string) => void;
  dark?: boolean;
}

export function PropertyCard({
  lot,
  onSelectLot,
  onOpenVisitModal,
  dark = false,
}: PropertyCardProps) {
  const isAvailable = lot.status === 'Disponible';
  const isReserved = lot.status === 'En Reserva';

  return (
    <div
      onClick={() => onSelectLot(lot)}
      className={`w-full h-full rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group select-none cursor-pointer ${
        dark
          ? 'bg-slate-900 border-white/15 text-white shadow-lg hover:shadow-2xl hover:border-emerald-500/40'
          : 'bg-white border-slate-200/90 text-slate-900 shadow-md hover:shadow-2xl hover:border-[#22A33D]/50'
      }`}
    >
      {/* 1. Imagen */}
      <div className="relative w-full h-[180px] sm:h-[195px] overflow-hidden bg-slate-950">
        <Image
          src={lot.image}
          alt={lot.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent pointer-events-none" />

        {/* Badges superiores: Código a la izquierda, Estado a la derecha */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
          <span className="text-[11px] font-mono font-black text-white bg-slate-950/85 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/20 shadow-xs">
            {lot.code}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide backdrop-blur-md shadow-xs ${
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

      {/* 2. Cuerpo de la Tarjeta Luxury */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
        <div className="space-y-2">
          <div className="space-y-0.5">
            <h3
              className="text-sm sm:text-base font-black text-slate-900 leading-snug tracking-tight group-hover:text-emerald-700 transition-colors line-clamp-1"
              title={lot.name}
            >
              {lot.name}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium line-clamp-1 flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
              <span>{lot.zone}</span>
              <span className="text-slate-300">•</span>
              <span>{lot.topography}</span>
            </p>
          </div>

          {/* Ficha métrica abierta y arquitectónica */}
          <div className="py-2 border-y border-slate-100 grid grid-cols-2 divide-x divide-slate-100 text-slate-700">
            <div className="pr-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Superficie</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-mono text-sm sm:text-base font-black text-slate-900 leading-none">{lot.areaM2}</span>
                <span className="text-[11px] font-semibold text-slate-500">m²</span>
              </div>
            </div>

            <div className="pl-2 text-right">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Financiamiento</span>
              <div className="flex items-baseline justify-end gap-1 mt-0.5">
                <span className="font-mono text-sm sm:text-base font-black text-slate-900 leading-none">{lot.maxMonths}</span>
                <span className="text-[11px] font-semibold text-slate-500">meses</span>
              </div>
            </div>
          </div>
        </div>

        {/* Precios y Botones de Acción */}
        <div className="space-y-3 pt-0.5">
          <div className="flex items-end justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Precio de Lista
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight leading-none">
                  ${lot.priceUSD.toLocaleString('es-EC')}
                </span>
                <span className="text-xs font-bold text-slate-400 font-sans">USD</span>
              </div>
            </div>

            <div className="text-right space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                Cuota Mensual
              </span>
              <div className="flex items-baseline justify-end gap-0.5">
                <span className="text-sm sm:text-base font-black text-emerald-700 font-mono leading-none">
                  ${lot.estimatedMonthlyUSD}
                </span>
                <span className="text-xs font-bold text-emerald-800/80 font-sans">/mes</span>
              </div>
            </div>
          </div>

          {/* Botones de Acción Luxury */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectLot(lot);
              }}
              className="action-btn-ficha w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-[#113d22] text-white font-bold text-xs sm:text-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer text-center shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Ver Ficha</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>

            <a
              href={getLotWhatsAppUrl(lot.name, lot.code, lot.priceUSD)}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-black text-xs sm:text-sm transition-all hover:scale-[1.02] active:scale-95 cursor-pointer text-center shadow-xs flex items-center justify-center gap-1.5"
            >
              <WhatsAppIcon size={16} className="text-slate-950 shrink-0" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
