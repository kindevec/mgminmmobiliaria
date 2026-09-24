'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
  MapPin,
  Heart,
  ArrowUpRight,
  BedDouble,
  Bath,
  Maximize2,
  ShieldCheck,
  Ruler,
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
  const [isFavorite, setIsFavorite] = useState(false);
  const isAvailable = lot.status === 'Disponible';
  const isReserved = lot.status === 'En Reserva';
  const isHouse = lot.type === 'Vivienda';

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      onClick={() => onSelectLot(lot)}
      className={`group relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer ${
        dark
          ? 'bg-slate-900/85 backdrop-blur-md border border-white/15 text-white hover:border-emerald-400/40 hover:shadow-2xl hover:shadow-emerald-950/50'
          : 'bg-white border border-slate-200/80 text-slate-900 hover:shadow-xl'
      }`}
    >
      {/* 1. Full Bleed Architectural Photo */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-950">
        <Image
          src={lot.image}
          alt={lot.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent pointer-events-none" />

        {/* Top Minimal Info Bar (Unboxed) */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10 pointer-events-none">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide backdrop-blur-md ${
                isAvailable
                  ? 'bg-emerald-950/85 text-emerald-300 border border-emerald-500/30'
                  : isReserved
                  ? 'bg-amber-950/85 text-amber-300 border border-amber-500/30'
                  : 'bg-rose-950/85 text-rose-300 border border-rose-500/30'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isAvailable ? 'bg-emerald-400' : isReserved ? 'bg-amber-400' : 'bg-rose-400'
                }`}
              />
              {lot.status}
            </span>
            <span className="text-[11px] font-mono font-bold text-white/95 bg-black/70 px-2.5 py-1 rounded-full backdrop-blur-md border border-white/15">
              {lot.code}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            className="pointer-events-auto h-8 w-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center backdrop-blur-md transition-all active:scale-90"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-700'
              }`}
            />
          </button>
        </div>

        {/* Photo Bottom Strip: Clean typography */}
        <div className="absolute bottom-3 inset-x-3.5 flex items-center justify-between text-xs text-white z-10 pointer-events-none">
          <span className="text-[11px] font-medium tracking-wide text-slate-200">
            {lot.type}
          </span>
          <span className="font-mono text-[11px] text-emerald-300 font-bold bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/10">
            {lot.areaM2} m² · {lot.dimensions}
          </span>
        </div>
      </div>

      {/* 2. Content Body (Clean & Unboxed) */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{lot.zone}</span>
          </div>

          <h3 className={`text-base sm:text-lg font-bold transition-colors line-clamp-1 ${
            dark ? 'text-white group-hover:text-emerald-300' : 'text-slate-900 group-hover:text-emerald-700'
          }`}>
            {lot.name}
          </h3>

          <p className={`text-xs line-clamp-2 leading-relaxed ${
            dark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {lot.description}
          </p>
        </div>

        {/* Specifications line */}
        <div className={`pt-3 border-t flex items-center justify-between text-xs ${
          dark ? 'border-white/10 text-slate-300' : 'border-slate-100 text-slate-600'
        }`}>
          {isHouse ? (
            <>
              <div className="flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5 text-emerald-400" />
                <span>{lot.beds} Dorms</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Bath className="h-3.5 w-3.5 text-emerald-400" />
                <span>{lot.baths} Baños</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>{lot.registryStatus ? 'Escritura Lista' : 'En Trámite'}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1">
                <Ruler className="h-3.5 w-3.5 text-emerald-400" />
                <span>Frente {lot.dimensions.split('x')[0] || '10'}m</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Maximize2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>{lot.topography}</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Legalizado</span>
              </div>
            </>
          )}
        </div>

        {/* Price & Actions Strip */}
        <div className={`pt-3 border-t flex items-center justify-between ${
          dark ? 'border-white/10' : 'border-slate-100'
        }`}>
          <div>
            <span className={`text-[10px] uppercase font-bold tracking-wider block ${
              dark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Precio de Venta
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className={`font-mono text-xl font-black ${
                dark ? 'text-white' : 'text-slate-900'
              }`}>
                ${lot.priceUSD.toLocaleString()}
              </span>
              <span className={`text-[11px] font-medium ${
                dark ? 'text-slate-400' : 'text-slate-500'
              }`}>USD</span>
            </div>
            <span className="text-[11px] text-[#25D366] font-semibold block">
              Cuotas desde ${Math.round((lot.priceUSD * 0.8) / 36)}/mes
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick WhatsApp Action */}
            <a
              href={getLotWhatsAppUrl(lot.code, lot.name, lot.priceUSD)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="h-10 w-10 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 flex items-center justify-center transition-all duration-200 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              aria-label={`Consultar por WhatsApp lote ${lot.code}`}
              title="Consultar por WhatsApp Oficial"
            >
              <WhatsAppIcon size={18} className="text-slate-950" />
            </a>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenVisitModal(lot.code);
              }}
              className={`h-10 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-md hover:scale-102 active:scale-95 cursor-pointer ${
                dark
                  ? 'bg-white hover:bg-slate-100 text-slate-950'
                  : 'bg-slate-900 hover:bg-emerald-700 text-white'
              }`}
            >
              <span>Visitar</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
