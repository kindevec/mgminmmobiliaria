'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
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
  FileDown,
  ImageIcon,
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

function PropertyExtendedSpecs({ lot }: { lot: LotProperty }) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Descripción Editorial Extensa (Lienzo Abierto, Cero Box-in-Box) */}
      <div className="space-y-3">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-700 shrink-0" />
          <span>Descripción Detallada del Inmueble</span>
        </h3>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
          {lot.description}
        </p>
      </div>

      {/* Obras e Infraestructura Incluidas (Lista Directa sin Cajas) */}
      <div className="pt-6 sm:pt-8 border-t border-slate-200/90 space-y-4">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0" />
          <span>Obras Civiles e Infraestructura Entregada</span>
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-slate-700">
          {lot.features.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-medium text-slate-800 leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Respaldo Notarial e Inscripción Registral */}
      <div className="pt-6 sm:pt-8 border-t border-slate-200/90 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-bold text-slate-900">
            Garantía Jurídica y Notarial MGM
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            {lot.registryStatus}. Sociedad Civil MGM Inmobiliaria protocoliza cada promesa y escritura definitiva directamente en notaría pública, con solvencia municipal al día, coordenadas UTM georreferenciadas y 100% libre de gravámenes hipotecarios.
          </p>
        </div>
      </div>

      {/* Botones de Documentación Oficial en PDF (Diseño Minimalista) */}
      <div className="pt-6 sm:pt-8 border-t border-slate-200/90 space-y-3">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="h-4 w-4 text-emerald-700 shrink-0" />
          <span>Documentación Oficial (PDF)</span>
        </h4>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Botón 1: Ficha Técnica */}
          <a
            href={
              lot.pdfUrl ||
              (lot.documents && lot.documents.length > 0
                ? lot.documents[0].url
                : `/properties/${lot.code}/ficha-tecnica-${lot.code}.pdf`)
            }
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-emerald-600/30 bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-950 font-bold text-xs sm:text-sm transition-all shadow-xs hover:shadow-sm active:scale-98 cursor-pointer group text-center"
          >
            <FileText className="h-4 w-4 text-emerald-700 group-hover:scale-110 transition-transform shrink-0" />
            <span className="truncate">Ficha Técnica Oficial {lot.code}</span>
            <ExternalLink className="h-3.5 w-3.5 text-emerald-600/70 shrink-0 ml-0.5" />
          </a>

          {/* Botón 2: Dossier Institucional */}
          <a
            href="/docs/MGM_Inmobiliaria_Dossier_Institucional_Completo.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-800 font-bold text-xs sm:text-sm transition-all shadow-xs hover:shadow-sm active:scale-98 cursor-pointer group text-center"
          >
            <FileDown className="h-4 w-4 text-slate-600 group-hover:scale-110 transition-transform shrink-0" />
            <span className="truncate">Dossier Institucional MGM</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400 shrink-0 ml-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
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
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);

  // Simulador rápido interactivo
  const [customMonths, setCustomMonths] = useState(lot.maxMonths || 48);
  const [customDownPayment, setCustomDownPayment] = useState(lot.minDownPaymentUSD);

  const carouselRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
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
    setIsMobileDetailsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lot.id]);

  // Centrar miniatura activa automáticamente al cambiar de foto
  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeThumb = thumbnailsRef.current.children[activePhotoIdx] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
  }, [activePhotoIdx]);

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
    <div className="w-full min-h-screen bg-white text-slate-900 pb-6 sm:pb-8 pt-24 sm:pt-28">
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
            
            {/* Cabecera del Título Principal para Móvil (Encima de la Imagen) */}
            <div className="block lg:hidden space-y-2 mb-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <span>{lot.project}</span>
                <span>·</span>
                <span>{lot.type}</span>
                <span>·</span>
                <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                  {lot.code}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {lot.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{lot.zone}, Azuay, Ecuador</span>
              </p>
              <div className="pt-0.5">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    lot.status === 'Disponible'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : lot.status === 'En Reserva'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{lot.status} para Entrega Notariada Inmediata</span>
                </span>
              </div>
            </div>

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
                    alt=""
                    fill
                    aria-hidden="true"
                    className="object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  <Image
                    src={photos[activePhotoIdx]}
                    alt={`${lot.name} - Foto ${activePhotoIdx + 1}`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-contain object-center z-10"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Degradado y Viñeta de Protección de Contraste */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/35 pointer-events-none" />

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

            {/* Galería de Miniaturas Clicables (Sin scrollbar, con controles ergonómicos) */}
            {photos.length > 1 && (
              <div className="space-y-2.5 pt-1">
                {/* Indicador de fotos */}
                <div className="flex items-center gap-2 px-1 text-xs text-slate-500">
                  <ImageIcon className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-700">Galería</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="font-mono text-slate-600 font-medium">
                    <strong className="text-emerald-700 font-bold">{activePhotoIdx + 1}</strong> de {photos.length}
                  </span>
                </div>

                {/* Contenedor Deslizable con Gradientes de Desvanecimiento Lateral */}
                <div className="relative group/thumbnails">
                  {/* Gradiente izquierdo para indicar desborde suave */}
                  <div className="absolute left-0 inset-y-0 w-6 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none rounded-l-2xl" />
                  {/* Gradiente derecho para indicar desborde suave */}
                  <div className="absolute right-0 inset-y-0 w-6 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none rounded-r-2xl" />

                  <div
                    ref={thumbnailsRef}
                    className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto py-2 px-1 scroll-smooth select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {photos.map((photoUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActivePhotoIdx(idx)}
                        aria-label={`Ver foto ${idx + 1}`}
                        className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 transition-all duration-200 cursor-pointer ${
                          activePhotoIdx === idx
                            ? 'ring-2 ring-emerald-600 ring-offset-2 ring-offset-white scale-[1.03] shadow-md z-1 opacity-100'
                            : 'border border-slate-200/90 opacity-60 hover:opacity-100 hover:scale-[1.02] hover:border-emerald-500/50 shadow-2xs'
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
                </div>
              </div>
            )}

            {/* Especificaciones Extensas en Desktop (Lienzo Abierto, Directo) */}
            <div className="hidden lg:block pt-8 border-t border-slate-200/90">
              <PropertyExtendedSpecs lot={lot} />
            </div>

          </div>

          {/* -----------------------------------------------------------------------
              COLUMNA DERECHA: BUY BOX ESTILO AMAZON / FICHA FINANCIERA DIRECTA
              ----------------------------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col space-y-6 lg:sticky lg:top-28">
            
            {/* Cabecera del Título y Código (Visible en Desktop) */}
            <div className="hidden lg:block space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <span>{lot.project}</span>
                <span>·</span>
                <span>{lot.type}</span>
                <span>·</span>
                <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">{lot.code}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {lot.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{lot.zone}, Azuay, Ecuador</span>
              </p>
              <div className="pt-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    lot.status === 'Disponible'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : lot.status === 'En Reserva'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{lot.status} para Entrega Notariada Inmediata</span>
                </span>
              </div>
            </div>

            {/* SECCIÓN PRECIO Y COMPRA DIRECTA (ESTILO AMAZON, PEGADO AL LIENZO) */}
            <div className="pt-5 border-t border-slate-200/90 space-y-5">
              
              {/* Precio Principal */}
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Precio Total de Venta:
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 tracking-tight leading-none">
                    ${lot.priceUSD.toLocaleString()}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-500 font-sans">USD</span>
                </div>
                <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 pt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  Sin comisiones inmobiliarias · Trato directo notariado con propietarios
                </p>
              </div>

              {/* Desglose de Financiamiento Directo (Limpio y sin cajas anidadas) */}
              <div className="pt-4 border-t border-slate-200/90 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Facilidades de Crédito Directo Propio:</span>
                  <span className="font-semibold text-emerald-700 font-mono">0% Buró Bancario</span>
                </div>
                <div className="text-xs text-slate-600 space-y-1.5 pt-1">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Entrada sugerida (20% inicial):</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      ${customDownPayment.toLocaleString()} USD
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Cuota mensual estimada:</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">
                      ~${calculatedMonthly} / mes
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 pt-0.5">
                    * Planes flexibles hasta {customMonths} meses en cuotas fijas sin variación ni intereses bancarios.
                  </p>
                </div>
              </div>

              {/* Botones de Acción Primarios */}
              <div className="space-y-3 pt-2">
                {/* 1. Botón WhatsApp Oficial (Verde Vibrante) */}
                <a
                  href={getLotWhatsAppUrl(lot.code, lot.name, lot.priceUSD)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-95 transition-all cursor-pointer text-center"
                >
                  <WhatsAppIcon size={20} className="text-slate-950 shrink-0" />
                  <span>Consultar por WhatsApp Oficial</span>
                </a>

                {/* 2. Enlace Google Maps sin box */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${lot.project}, ${lot.zone}, Azuay, Ecuador`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-1 text-xs sm:text-sm font-bold text-slate-700 hover:text-emerald-700 transition-colors hover:underline cursor-pointer text-center"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="#EA4335"/>
                  </svg>
                  <span>Google Maps</span>
                </a>

                {/* 3. Acceso Directo a Ficha Técnica Oficial (PDF) */}
                {(() => {
                  const pdfTarget =
                    lot.pdfUrl ||
                    (lot.documents && lot.documents.length > 0 ? lot.documents[0].url : '/docs/MGM_Inmobiliaria_Dossier_Institucional_Completo.pdf');
                  const pdfLabel =
                    lot.pdfTitle ||
                    (lot.documents && lot.documents.length > 0 ? lot.documents[0].title : 'Dossier Institucional MGM');

                  return (
                    <a
                      href={pdfTarget}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-emerald-600/30 bg-emerald-50/60 hover:bg-emerald-100/90 text-emerald-950 font-bold text-xs sm:text-sm transition-all cursor-pointer text-center group shadow-xs active:scale-98"
                    >
                      <FileDown className="h-4 w-4 text-emerald-700 group-hover:scale-110 transition-transform shrink-0" />
                      <span className="truncate">Ver {pdfLabel} (PDF)</span>
                      <ExternalLink className="h-3.5 w-3.5 text-emerald-600 ml-0.5 opacity-70 shrink-0" />
                    </a>
                  );
                })()}

              </div>

              {/* Micro-puntos de garantía */}
              <div className="pt-2 flex flex-col gap-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Minuta notariada desde la primera cuota de abono</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Transporte institucional gratuito para visita guiada a obra</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Linderos georreferenciados con coordenadas UTM y clave catastral</span>
                </div>
              </div>
            </div>

            {/* Ficha Técnica Rápida (Estilo Tabla Técnica Amazon, directo en el lienzo) */}
            <div className="pt-6 border-t border-slate-200/90 space-y-3">
              <h4 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Ficha Técnica del Inmueble
              </h4>
              <dl className="divide-y divide-slate-100 text-xs sm:text-sm">
                <div className="py-2.5 grid grid-cols-3 gap-2">
                  <dt className="text-slate-500 font-medium">Área Total</dt>
                  <dd className="col-span-2 font-bold text-slate-900 font-mono">{lot.areaM2} m²</dd>
                </div>
                <div className="py-2.5 grid grid-cols-3 gap-2">
                  <dt className="text-slate-500 font-medium">Dimensiones</dt>
                  <dd className="col-span-2 font-bold text-slate-900 font-mono">{lot.dimensions}</dd>
                </div>
                <div className="py-2.5 grid grid-cols-3 gap-2">
                  <dt className="text-slate-500 font-medium">Topografía</dt>
                  <dd className="col-span-2 text-slate-800 font-medium">{lot.topography}</dd>
                </div>
                <div className="py-2.5 grid grid-cols-3 gap-2">
                  <dt className="text-slate-500 font-medium">Orientación</dt>
                  <dd className="col-span-2 text-slate-800 font-medium">{lot.orientation}</dd>
                </div>
                {isHouse && (
                  <>
                    <div className="py-2.5 grid grid-cols-3 gap-2">
                      <dt className="text-slate-500 font-medium">Dormitorios</dt>
                      <dd className="col-span-2 font-bold text-slate-900">{lot.beds} Habitaciones</dd>
                    </div>
                    <div className="py-2.5 grid grid-cols-3 gap-2">
                      <dt className="text-slate-500 font-medium">Baños</dt>
                      <dd className="col-span-2 font-bold text-slate-900">{lot.baths} Baños Completos</dd>
                    </div>
                  </>
                )}
                <div className="py-2.5 grid grid-cols-3 gap-2">
                  <dt className="text-slate-500 font-medium">Situación Legal</dt>
                  <dd className="col-span-2 text-slate-800 font-medium">{lot.registryStatus}</dd>
                </div>
              </dl>
            </div>

            {/* Desplegable de Especificaciones Extensas en Móvil (Ubicado después del Precio, Acciones y Ficha) */}
            <div className="block lg:hidden pt-6 border-t border-slate-200/90 space-y-3">
              <button
                type="button"
                onClick={() => setIsMobileDetailsOpen((prev) => !prev)}
                className="w-full py-3.5 px-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-600/50 flex items-center justify-between text-left transition-all cursor-pointer group select-none"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Detalles del Inmueble</span>
                    <span className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {isMobileDetailsOpen ? 'Ocultar información técnica' : 'Ver descripción, obras y garantía'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <span>{isMobileDetailsOpen ? 'Ver menos' : 'Ver más'}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isMobileDetailsOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              <AnimatePresence>
                {isMobileDetailsOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs mt-2">
                      <PropertyExtendedSpecs lot={lot} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
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
                      className="inline-flex items-center gap-1 text-[#113d22] hover:text-[#F58220] text-xs font-bold transition-colors cursor-pointer hover:underline"
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
