'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  Compass,
  CheckCircle2,
  CalendarCheck2,
  ShieldCheck,
  MapPin,
  TrendingUp,
  FileText,
  BadgeCheck,
  BedDouble,
  Bath,
  Maximize2,
  Ruler,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import type { LotProperty } from '@/src/data/lots';
import { getLotWhatsAppUrl } from '@/src/data/lots';
import { WhatsAppIcon } from './SocialIcons';

interface LotDetailsModalProps {
  lot: LotProperty | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenVisitModal: (lotCode: string) => void;
}

export function LotDetailsModal({
  lot,
  isOpen,
  onClose,
  onOpenVisitModal,
}: LotDetailsModalProps) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!isOpen || !lot) return null;

  const photos = lot.gallery && lot.gallery.length > 0 ? lot.gallery : [lot.image];
  const isHouse = lot.type === 'Vivienda';

  const nextPhoto = () => {
    setActivePhotoIdx((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setActivePhotoIdx((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[94dvh] flex flex-col">
        {/* Modal Header Media Viewer */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-slate-950 overflow-hidden shrink-0">
          <Image
            src={photos[activePhotoIdx]}
            alt={lot.name}
            fill
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover"
            referrerPolicy="no-referrer"
          />

          {/* Vignette Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-black/40 pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-white/90 hover:text-white bg-black/40 hover:bg-black/70 backdrop-blur-md rounded-full p-2 transition-all cursor-pointer"
            aria-label="Cerrar ficha de propiedad"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Flanked Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                aria-label="Foto anterior"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextPhoto}
                aria-label="Siguiente foto"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Image Overlay Title & Badges */}
          <div className="absolute bottom-4 inset-x-6 text-white z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 backdrop-blur-xs">
                {lot.code}
              </span>
              <span className="text-xs text-slate-300">{lot.type} · {lot.project}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white line-clamp-1">
              {lot.name}
            </h2>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>{lot.zone}</span>
            </p>
          </div>
        </div>

        {/* Scrollable Content Body - Open, unboxed layout */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Key Metrics Grid - Open horizontal rule */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Superficie
              </span>
              <span className="text-xl font-black text-slate-900 font-mono">
                {lot.areaM2} <span className="text-xs font-normal text-slate-600">m²</span>
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Dimensiones
              </span>
              <span className="text-sm font-bold text-slate-800 font-mono">
                {lot.dimensions}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                {isHouse ? 'Distribución' : 'Topografía'}
              </span>
              <span className="text-sm font-bold text-slate-800">
                {isHouse ? `${lot.beds} Hab. / ${lot.baths} Baños` : lot.topography}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Disponibilidad
              </span>
              <span
                className={`inline-block text-xs font-bold ${
                  lot.status === 'Disponible'
                    ? 'text-emerald-700'
                    : lot.status === 'En Reserva'
                    ? 'text-amber-700'
                    : 'text-rose-700'
                }`}
              >
                ● {lot.status}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Descripción General
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {lot.description}
            </p>
          </div>

          {/* Features & Amenities - Clean checklist, NO double borders */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Obras e Infraestructura Incluidas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              {lot.features.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Security Guarantee */}
          <div className="border-l-2 border-emerald-600 pl-4 py-1 space-y-1">
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Respaldo Notarial e Inscripción Registral
            </h5>
            <p className="text-xs text-slate-600 leading-relaxed">
              {lot.registryStatus}. Sociedad Civil MGM Inmobiliaria entrega cada
              propiedad con solvencia municipal al día y libre de gravamen hipotecario.
            </p>
          </div>

          {/* Pricing & Financing Options */}
          <div className="p-6 rounded-2xl bg-slate-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 font-medium block">
                Valor Total de Venta
              </span>
              <p className="text-3xl font-black font-mono text-white">
                ${lot.priceUSD.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-400">USD</span>
              </p>
              <p className="text-xs text-[#25D366] font-medium mt-0.5">
                Entrada mínima sugerida: ${lot.minDownPaymentUSD.toLocaleString()} USD
              </p>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-xs text-slate-400 block">Crédito Directo Propio</span>
              <p className="text-lg font-bold font-mono text-emerald-300">
                Hasta {lot.maxMonths} meses plazo
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                Cuotas desde ~${lot.estimatedMonthlyUSD}/mes
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions with Official WhatsApp Icon */}
        <div className="p-3 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row gap-2.5 sm:gap-3 shrink-0">
          <button
            onClick={() => {
              onClose();
              onOpenVisitModal(`${lot.code} - ${lot.name}`);
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-3 rounded-xl border border-slate-300 bg-white text-slate-800 font-bold text-xs sm:text-sm hover:bg-slate-50 active:scale-95 transition-all cursor-pointer text-center"
          >
            <CalendarCheck2 className="h-4 w-4 text-emerald-700 shrink-0" />
            <span>Agendar Recorrido en Terreno</span>
          </button>

          <a
            href={getLotWhatsAppUrl(lot.code, lot.name, lot.priceUSD)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#25D366] text-slate-950 font-black text-xs sm:text-sm hover:bg-[#20bd5a] shadow-md active:scale-95 transition-all cursor-pointer text-center"
          >
            <WhatsAppIcon size={18} className="text-slate-950 shrink-0" />
            <span>Consultar por WhatsApp Oficial</span>
          </a>
        </div>
      </div>
    </div>
  );
}
