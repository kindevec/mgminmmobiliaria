'use client';

import React from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  ImageIcon,
  Star,
} from 'lucide-react';
import type { LotProperty } from '@/src/data/lots';
import { getLotWhatsAppUrl } from '@/src/data/lots';
import { useSiteSettings } from '@/src/lib/siteSettings';
import { WhatsAppIcon } from './SocialIcons';

interface PropertyCardProps {
  lot: LotProperty;
  onSelectLot: (lot: LotProperty) => void;
  dark?: boolean;
}

export function PropertyCard({
  lot,
  onSelectLot,
  dark = false,
}: PropertyCardProps) {
  useSiteSettings();

  return (
    <div
      onClick={() => onSelectLot(lot)}
      className={`w-full h-full rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group select-none cursor-pointer transform hover:-translate-y-1 ${
        dark
          ? 'bg-slate-900/90 backdrop-blur-md border-white/15 text-white shadow-lg hover:shadow-2xl hover:border-emerald-500/50 hover:shadow-emerald-950/40'
          : 'bg-white border-slate-200/90 text-slate-900 shadow-md hover:shadow-2xl hover:border-[#22A33D]/60 hover:shadow-emerald-900/10'
      }`}
    >
      {/* 1. Imagen con Badges de Estado */}
      <div className="relative w-full h-[190px] sm:h-[210px] overflow-hidden bg-slate-950">
        {lot.image ? (
          <>
            <Image
              src={lot.image}
              alt={lot.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 gap-1.5 p-4 text-center">
            <ImageIcon className="h-8 w-8 text-slate-600" />
            <span className="text-[11px] font-semibold text-slate-300">Sin foto de portada</span>
          </div>
        )}

        {/* Badges superiores de Estado */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          {lot.featured ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-[#F58220] text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg">
              <Star className="w-3 h-3 fill-slate-950 text-slate-950" />
              <span>Destacado</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5be196] shadow-[0_0_6px_#5be196]" />
              <span>{lot.status || 'Disponible'}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Cuerpo de la Tarjeta */}
      <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2.5">
          <div>
            <h3
              className={`text-base font-black leading-snug tracking-tight group-hover:text-[#22A33D] transition-colors line-clamp-1 ${
                dark ? 'text-white' : 'text-slate-900'
              }`}
              title={lot.name}
            >
              {lot.name}
            </h3>
          </div>

          {/* Ficha métrica */}
          <div
            className={`py-2 px-2.5 rounded-2xl grid grid-cols-2 divide-x ${
              dark
                ? 'bg-slate-800/60 divide-slate-700/80 text-slate-300'
                : 'bg-emerald-50/40 divide-emerald-200/60 text-slate-700'
            }`}
          >
            <div className="pr-2">
              <span className="text-[9px] font-bold uppercase tracking-wider block text-slate-600">
                Superficie
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span
                  className={`font-mono text-base font-black leading-none ${
                    dark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {lot.areaM2}
                </span>
                <span className="text-[11px] font-semibold text-slate-600">
                  m²
                </span>
              </div>
            </div>

            <div className="pl-2 text-right">
              <span className="text-[9px] font-bold uppercase tracking-wider block text-slate-600">
                Crédito Directo
              </span>
              <div className="flex items-baseline justify-end gap-1 mt-0.5">
                <span
                  className={`font-mono text-base font-black leading-none ${
                    dark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {lot.maxMonths || 48}
                </span>
                <span className="text-[11px] font-semibold text-slate-600">
                  meses
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Precios y Botones de Acción */}
        <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-end justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-600">
                Precio de Lista
              </span>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-xl sm:text-2xl font-black font-mono tracking-tight leading-none ${
                    dark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  ${lot.priceUSD.toLocaleString('es-EC')}
                </span>
                <span className="text-xs font-bold text-slate-600">
                  USD
                </span>
              </div>
            </div>

            <div className="text-right space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider block text-emerald-800">
                Cuota Estimada
              </span>
              <div className="flex items-baseline justify-end gap-0.5">
                <span
                  className={`text-base font-black font-mono leading-none ${
                    dark ? 'text-[#5be196]' : 'text-[#15803d]'
                  }`}
                >
                  ${lot.estimatedMonthlyUSD}
                </span>
                <span className="text-xs font-bold text-emerald-800">
                  /mes
                </span>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectLot(lot);
              }}
              className={`py-2 px-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1 border ${
                dark
                  ? 'border-white/20 text-white hover:bg-white/10'
                  : 'border-slate-300 text-slate-800 hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50'
              }`}
            >
              <span>Ver Ficha</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            <a
              href={getLotWhatsAppUrl(lot.name, lot.code, lot.priceUSD)}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-black text-xs sm:text-sm transition-all hover:scale-[1.03] active:scale-95 cursor-pointer text-center shadow-md flex items-center justify-center gap-1.5"
            >
              <WhatsAppIcon size={15} className="text-slate-950 shrink-0" />
              <span>Cotizar</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
