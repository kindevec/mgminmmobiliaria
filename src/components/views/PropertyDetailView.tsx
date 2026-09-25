'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CalendarCheck2,
  Phone,
  CheckCircle2,
  ShieldCheck,
  Ruler,
  Maximize2,
  Compass,
  FileText,
  BadgeCheck,
  Share2,
  Check,
  BedDouble,
  Bath,
  Sparkles,
  Layers,
  Calculator,
  ExternalLink,
} from 'lucide-react';
import type { LotProperty } from '@/src/data/lots';
import { getLotWhatsAppUrl, WHATSAPP_PHONE } from '@/src/data/lots';
import type { PageView } from '../Header';
import { WhatsAppIcon } from '../SocialIcons';
import { ScrollReveal } from '../common/ScrollReveal';

interface PropertyDetailViewProps {
  lot: LotProperty;
  allLots: LotProperty[];
  onNavigate: (page: PageView) => void;
  onSelectLot: (lot: LotProperty) => void;
  onOpenVisitModal: (defaultInterest?: string) => void;
}

export function PropertyDetailView({
  lot,
  allLots,
  onNavigate,
  onSelectLot,
  onOpenVisitModal,
}: PropertyDetailViewProps) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Simulador rápido interactivo
  const [customMonths, setCustomMonths] = useState(lot.maxMonths || 48);
  const [customDownPayment, setCustomDownPayment] = useState(lot.minDownPaymentUSD);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const photos = lot.gallery && lot.gallery.length > 0 ? lot.gallery : [lot.image];
  const isHouse = lot.type === 'Vivienda';

  // Filtrar propiedades recomendadas (excluyendo la actual)
  const recommendedLots = allLots.filter((item) => item.id !== lot.id);

  // Reiniciar foto y datos al cambiar de lote
  useEffect(() => {
    setActivePhotoIdx(0);
    setCustomMonths(lot.maxMonths || 48);
    setCustomDownPayment(lot.minDownPaymentUSD);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lot.id]);

  const nextPhoto = () => {
    setActivePhotoIdx((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setActivePhotoIdx((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}${window.location.pathname}#lote/${lot.code.toLowerCase()}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2400);
    }
  };

  // Cálculo de cuota en vivo
  const financedAmount = Math.max(0, lot.priceUSD - customDownPayment);
  const calculatedMonthly = Math.round(financedAmount / (customMonths || 1));

  // Control de scroll del carrusel de recomendados
  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth > 768 ? 400 : 300;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 320);
    }
  };

  useEffect(() => {
    checkScroll();
  }, [recommendedLots]);

  return (
    <div className="w-full min-h-screen bg-slate-50/60 text-slate-900 pb-6 sm:pb-8 pt-24 sm:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* =========================================================================
            1. BREADCRUMBS & RETORNO AL CATÁLOGO (ESTILO E-COMMERCE AMAZON)
            ========================================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 mb-4 text-xs text-slate-500 border-b border-slate-200/80">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-emerald-700 transition-colors font-medium cursor-pointer"
            >
              Inicio
            </button>
            <span>/</span>
            <button
              onClick={() => onNavigate('properties')}
              className="hover:text-emerald-700 transition-colors font-medium cursor-pointer"
            >
              Catálogo de Lotes
            </button>
            <span>/</span>
            <span className="text-slate-400">{lot.project}</span>
            <span>/</span>
            <span className="font-bold text-slate-900 font-mono">{lot.code}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              title="Copiar enlace directo de esta propiedad"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">¡Enlace Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Compartir Lote</span>
                </>
              )}
            </button>

            <button
              onClick={() => onNavigate('properties')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#113d22] hover:bg-[#22A33D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Volver a Lotes</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. VISTA PRINCIPAL DEL PRODUCTO: 2 COLUMNAS (GALERÍA + BUY BOX)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          
          {/* -----------------------------------------------------------------------
              COLUMNA IZQUIERDA: GALERÍA VISUAL Y ESPECIFICACIONES TÉCNICAS
              ----------------------------------------------------------------------- */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            {/* Visor Fotográfico Principal */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-slate-950 rounded-3xl overflow-hidden shadow-xl border border-slate-200 select-none group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePhotoIdx}
                  initial={{ opacity: 0.2, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.2 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={photos[activePhotoIdx]}
                    alt={`${lot.name} - Foto ${activePhotoIdx + 1}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Degradado y Viñeta de Protección de Contraste */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/35 pointer-events-none" />

              {/* Badges Flotantes Superiores */}
              <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-extrabold px-3 py-1 rounded-full bg-slate-950/80 text-emerald-400 border border-emerald-500/40 backdrop-blur-md shadow-md">
                  {lot.code}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20">
                  {lot.type}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-700/80 text-white backdrop-blur-md">
                  {lot.category}
                </span>
              </div>

              {/* Badge de Disponibilidad Superior Derecho */}
              <div className="absolute top-4 right-4 z-20">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-md ${
                    lot.status === 'Disponible'
                      ? 'bg-emerald-600/90 text-white border border-emerald-400/40'
                      : lot.status === 'En Reserva'
                      ? 'bg-amber-600/90 text-white border border-amber-400/40'
                      : 'bg-rose-600/90 text-white border border-rose-400/40'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>{lot.status}</span>
                </span>
              </div>

              {/* Flechas de Navegación Flanqueadas */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    aria-label="Foto anterior"
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-[#22A33D] backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer shadow-lg border border-white/20"
                  >
                    <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    aria-label="Siguiente foto"
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-[#22A33D] backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer shadow-lg border border-white/20"
                  >
                    <ChevronRight className="h-6 w-6 stroke-[2.5]" />
                  </button>
                </>
              )}

              {/* Leyenda Inferior en la Imagen */}
              <div className="absolute bottom-4 inset-x-6 z-20 text-white">
                <p className="text-xs sm:text-sm font-medium text-slate-200 flex items-center gap-1.5 drop-shadow-md">
                  <MapPin className="h-4 w-4 text-[#F58220] shrink-0" />
                  <span>{lot.project} · {lot.zone}</span>
                </p>
              </div>
            </div>

            {/* Galería de Miniaturas Clicables */}
            {photos.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {photos.map((photoUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative w-20 h-16 sm:w-24 sm:h-18 rounded-2xl overflow-hidden shrink-0 transition-all cursor-pointer border-2 ${
                      activePhotoIdx === idx
                        ? 'border-[#22A33D] ring-2 ring-emerald-400/50 scale-105 shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100 hover:border-slate-300'
                    }`}
                  >
                    <Image
                      src={photoUrl}
                      alt={`Miniatura ${idx + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Descripción Editorial Extensa */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#22A33D]" />
                <span>Descripción Detallada del Inmueble</span>
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                {lot.description}
              </p>
            </div>

            {/* Obras e Infraestructura Incluidas */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#22A33D]" />
                <span>Obras Civiles e Infraestructura Entregada</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700 pt-1">
                {lot.features.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#22A33D] shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-800 leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Respaldo Notarial e Inscripción Registral */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2.5 text-emerald-900 font-bold text-base">
                <ShieldCheck className="h-5 w-5 text-[#22A33D]" />
                <h4>Garantía Jurídica y Notarial MGM</h4>
              </div>
              <p className="text-xs sm:text-sm text-emerald-950/80 leading-relaxed font-medium">
                {lot.registryStatus}. Sociedad Civil MGM Inmobiliaria protocoliza cada promesa y escritura definitiva directamente en notaría pública, con solvencia municipal al día, coordenadas UTM georreferenciadas y 100% libre de gravámenes hipotecarios.
              </p>
            </div>

          </div>

          {/* -----------------------------------------------------------------------
              COLUMNA DERECHA: BUY BOX ESTILO AMAZON / FICHA FINANCIERA DIRECTA
              ----------------------------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col space-y-6 lg:sticky lg:top-28">
            
            {/* Cabecera del Título y Código */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <span>{lot.project}</span>
                <span>·</span>
                <span>{lot.type}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {lot.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{lot.zone}, Azuay, Ecuador</span>
              </p>
            </div>

            {/* BUY BOX FINANCIERO (ESTILO AMAZON LUXURY REAL ESTATE) */}
            <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#22A33D]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F58220]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Precio Principal */}
              <div className="relative z-10 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Precio Total de Venta
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                    ${lot.priceUSD.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-slate-400">USD</span>
                </div>
                <p className="text-xs font-semibold text-[#25D366]">
                  Sin comisiones inmobiliarias · Trato directo con propietarios
                </p>
              </div>

              {/* Desglose de Financiamiento Directo */}
              <div className="relative z-10 pt-4 border-t border-slate-800/90 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="block text-slate-400 font-medium mb-1">Entrada Sugerida</span>
                  <span className="block text-base font-bold font-mono text-white">
                    ${customDownPayment.toLocaleString()} USD
                  </span>
                  <span className="text-[10.5px] text-slate-400">20% inicial</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="block text-slate-400 font-medium mb-1">Cuota Mensual</span>
                  <span className="block text-base font-bold font-mono text-emerald-400">
                    ~${calculatedMonthly}/mes
                  </span>
                  <span className="text-[10.5px] text-slate-400">Hasta {customMonths} meses</span>
                </div>
              </div>

              {/* Botones de Acción Primarios */}
              <div className="relative z-10 space-y-3 pt-2">
                {/* 1. Botón WhatsApp Oficial (Verde Vibrante) */}
                <a
                  href={getLotWhatsAppUrl(lot.code, lot.name, lot.priceUSD)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all cursor-pointer text-center"
                >
                  <WhatsAppIcon size={20} className="text-slate-950 shrink-0" />
                  <span>Consultar por WhatsApp Oficial</span>
                </a>

                {/* 2. Botón Agendar Visita Presencial (Naranja MGM) */}
                <button
                  type="button"
                  onClick={() => onOpenVisitModal(`${lot.code} - ${lot.name}`)}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full bg-[#F58220] hover:bg-[#ea580c] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer text-center"
                >
                  <CalendarCheck2 className="h-4.5 w-4.5 shrink-0" />
                  <span>Agendar Visita con Transporte</span>
                </button>

                {/* 3. Botón de Llamada Telefónica */}
                <a
                  href={`tel:+${WHATSAPP_PHONE}`}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-xs tracking-wider transition-all text-center"
                >
                  <Phone className="h-3.5 w-3.5 text-slate-300" />
                  <span>Llamar a Asesor: +593 98 488 7434</span>
                </a>
              </div>

              <div className="relative z-10 pt-2 text-[11px] text-slate-400 text-center">
                <span>Reserva garantizada con promesa notarial y posesión inmediata.</span>
              </div>
            </div>

            {/* Ficha Técnica Rápida en Tarjetas */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Ficha Técnica del Inmueble
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block mb-0.5">Área Total</span>
                  <span className="text-base font-black text-slate-900 font-mono">
                    {lot.areaM2} m²
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block mb-0.5">Dimensiones</span>
                  <span className="text-sm font-bold text-slate-900 font-mono">
                    {lot.dimensions}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block mb-0.5">Topografía</span>
                  <span className="text-sm font-bold text-slate-900">
                    {lot.topography}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block mb-0.5">Orientación Solar</span>
                  <span className="text-sm font-bold text-slate-900">
                    {lot.orientation}
                  </span>
                </div>
                {isHouse && (
                  <>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block mb-0.5">Dormitorios</span>
                      <span className="text-sm font-bold text-slate-900">
                        {lot.beds} Habitaciones
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-500 block mb-0.5">Baños</span>
                      <span className="text-sm font-bold text-slate-900">
                        {lot.baths} Baños Completos
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* =========================================================================
            3. SCROLL DE PROPIEDADES RECOMENDADAS (AMAZON CAROUSEL RECOMENDADOS)
            ========================================================================= */}
        <section className="mt-8 pt-10 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span>Opciones Similares en Azuay</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Propiedades Recomendadas para Explorar
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Continúa revisando otros lotes residenciales y viviendas con financiamiento directo propio.
              </p>
            </div>

            {/* Flechas de Navegación del Carrusel */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                disabled={!canScrollLeft}
                aria-label="Desplazar a la izquierda"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 flex items-center justify-center transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                disabled={!canScrollRight}
                aria-label="Desplazar a la derecha"
                className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 flex items-center justify-center transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Carrusel Horizontal Suave con Tarjetas de Propiedades */}
          <div
            ref={carouselRef}
            onScroll={checkScroll}
            className="flex items-stretch gap-5 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory"
          >
            {recommendedLots.map((item) => (
              <div
                key={item.id}
                className="w-[280px] sm:w-[320px] md:w-[340px] shrink-0 snap-start bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
                onClick={() => onSelectLot(item)}
              >
                {/* Imagen del Lote Recomendado */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-900">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="340px"
                    className="object-cover object-center group-hover:scale-108 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                    <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-xs">
                      {item.code}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                    <p className="text-[11px] text-slate-200 truncate">{item.project}</p>
                    <h4 className="text-sm font-bold text-white truncate drop-shadow-xs">{item.name}</h4>
                  </div>
                </div>

                {/* Info & Precio */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Área</span>
                      <span className="font-mono font-bold text-slate-800">{item.areaM2} m²</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Topografía</span>
                      <span className="font-semibold text-slate-800 truncate block">{item.topography}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Precio Total</span>
                      <span className="text-base font-black font-mono text-slate-900">
                        ${item.priceUSD.toLocaleString()} USD
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLot(item);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#113d22] group-hover:bg-[#F58220] text-white text-xs font-bold transition-all shadow-xs"
                    >
                      <span>Ver Ficha</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botón Inferior: Regresar a ver todo el catálogo */}
          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigate('properties')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-slate-900 hover:bg-[#113d22] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <span>Explorar Todo el Catálogo ({allLots.length} Lotes Disponibles)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
