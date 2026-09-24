'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Building,
  Award,
  Star,
  ChevronRight,
  ChevronLeft,
  Handshake,
  FileCheck2,
  KeyRound,
  Trees,
  Sparkles,
  CalendarCheck2,
  Info,
  Layers,
  MapPin,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import type { PageView } from '../Header';
import {
  AMENITIES_MIRAVALLE,
  TESTIMONIALS_DATA,
  getMiravalleWhatsAppUrl,
  getGeneralWhatsAppUrl,
  type LotProperty,
} from '@/src/data/lots';
import { useProperties } from '@/src/context/PropertyContext';
import { PropertyCard } from '../PropertyCard';
import { WhatsAppIcon } from '../SocialIcons';
import {
  WaveDarkToCream,
  WaveCreamToDark,
  WaveDarkToCreamSkyline,
  WaveCreamToDarkSkyline,
  TopographicContours,
} from '../WaveDividers';

interface HomeViewProps {
  onNavigate: (page: PageView) => void;
  onOpenVisitModal: (defaultInterest?: string) => void;
  onSelectLot: (lot: LotProperty) => void;
  onFilterSearch?: (location: string, type: string, maxPrice: number) => void;
}

// Data for "Nosotros" summary carousel
const ABOUT_PILLARS = [
  {
    title: 'Certeza Jurídica & Notarial',
    subtitle: 'Escrituras Individuales Inmediatas',
    desc: 'Cada predio cuenta con aprobación municipal definitiva, levantamiento topográfico georreferenciado y protocolización ante Notaría Pública, libre de hipotecas.',
    icon: ShieldCheck,
    tag: '100% Legalizado',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Obras Civiles Concluidas',
    subtitle: 'Urbanismo Real, No Promesas',
    desc: 'Calzadas adoquinadas de 10 a 12 metros, aceras con franjas peatonales, bordillos de hormigón y alcantarillado pluvial y sanitario en pleno funcionamiento.',
    icon: Building,
    tag: 'Obras Entregadas',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Financiamiento Directo hasta 48 Meses',
    subtitle: 'Sin Bancos ni Buró de Crédito',
    desc: 'Crédito directo otorgado por la urbanizadora. Cuotas mensuales fijas, mínimos requisitos (solo cédula) y aprobación sin trabas burocráticas.',
    icon: CreditCard,
    tag: 'Crédito Propio',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Redes Eléctricas Soterradas',
    subtitle: 'Estética y Seguridad Subterránea',
    desc: 'Cableado eléctrico y acometidas de fibra óptica totalmente bajo tierra, garantizando un horizonte limpio sin cables aéreos y máxima estabilidad.',
    icon: KeyRound,
    tag: 'Tecnología Soterrada',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
  },
];

export function HomeView({
  onNavigate,
  onOpenVisitModal,
  onSelectLot,
}: HomeViewProps) {
  const { properties } = useProperties();

  // Carousel 1: "Nosotros" Pillars
  const [aboutIndex, setAboutIndex] = useState(0);

  // Carousel 2: "Lotes / Catálogo" Filter & Carousel
  const [catalogTab, setCatalogTab] = useState<'Todos' | 'Lote de Terreno' | 'Vivienda'>('Todos');
  const [catalogIndex, setCatalogIndex] = useState(0);

  // Carousel 3: "Miravalle" Amenities Carousel
  const [miravalleIndex, setMiravalleIndex] = useState(0);

  // Carousel 4: "Testimonios / Confianza"
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Filtered properties for Catalog Summary Carousel
  const filteredCatalog = properties.filter((item) => {
    if (catalogTab === 'Todos') return true;
    return item.type === catalogTab;
  });

  // Items per page in Catalog Carousel
  const itemsPerPage = 3;
  const totalCatalogPages = Math.ceil(filteredCatalog.length / itemsPerPage);
  const visibleCatalog = filteredCatalog.slice(
    catalogIndex * itemsPerPage,
    catalogIndex * itemsPerPage + itemsPerPage
  );

  const nextCatalog = () => {
    setCatalogIndex((prev) => (prev + 1 >= totalCatalogPages ? 0 : prev + 1));
  };
  const prevCatalog = () => {
    setCatalogIndex((prev) => (prev - 1 < 0 ? totalCatalogPages - 1 : prev - 1));
  };

  const nextAbout = () => {
    setAboutIndex((prev) => (prev + 1 >= ABOUT_PILLARS.length ? 0 : prev + 1));
  };
  const prevAbout = () => {
    setAboutIndex((prev) => (prev - 1 < 0 ? ABOUT_PILLARS.length - 1 : prev - 1));
  };

  const nextMiravalle = () => {
    setMiravalleIndex((prev) => (prev + 1 >= AMENITIES_MIRAVALLE.length ? 0 : prev + 1));
  };
  const prevMiravalle = () => {
    setMiravalleIndex((prev) => (prev - 1 < 0 ? AMENITIES_MIRAVALLE.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1 >= TESTIMONIALS_DATA.length ? 0 : prev + 1));
  };
  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 < 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1));
  };

  return (
    <div className="w-full overflow-hidden bg-slate-950 text-white">
      {/* =========================================================================
          1. CINEMATIC FULLSCREEN HERO (Resumen General & Bienvenida)
          ========================================================================= */}
      <section className="relative w-full min-h-[620px] md:min-h-[720px] lg:min-h-[780px] flex flex-col justify-between overflow-hidden bg-slate-950 text-white">
        {/* Cinematic Background with Slow Ken Burns Zoom Effect */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2160&q=90"
            alt="Sociedad Civil MGM Inmobiliaria - Urbanismo Planificado en Ecuador"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.88]"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Multi-layer Dark Gradient Overlays for Maximum Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/35 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        {/* Center Content Container */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center pt-28 sm:pt-32 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl space-y-6"
          >
            {/* Informative Portal Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md shadow-lg"
            >
              <Sparkles className="h-4 w-4 text-[#25D366] shrink-0" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#25D366]">
                Portal Informativo Oficial · Sociedad Civil MGM Inmobiliaria
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.06] [text-wrap:balance]"
            >
              Tierra firme, certeza jurídica y el{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 font-serif italic font-normal">
                patrimonio de tu familia.
              </span>
            </motion.h1>

            {/* Informative Summary Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl leading-relaxed drop-shadow-sm"
            >
              Conoce nuestro resumen informativo: proyectos urbanizados con obras concluidas, 
              escrituras notariales individuales y crédito directo sin bancos en Ecuador.
            </motion.p>

            {/* Executive Quick Links to Main Pages - Horizontal swipeable rail on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-2 flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap"
            >
              <button
                onClick={() => onNavigate('about')}
                className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95"
              >
                <Award className="h-3.5 w-3.5 text-amber-300" />
                <span>1. Sobre Nosotros</span>
              </button>

              <button
                onClick={() => onNavigate('properties')}
                className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95"
              >
                <Layers className="h-3.5 w-3.5 text-emerald-300" />
                <span>2. Catálogo de Lotes</span>
              </button>

              <button
                onClick={() => onNavigate('miravalle')}
                className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95"
              >
                <Trees className="h-3.5 w-3.5 text-teal-300" />
                <span>3. Ciudadela Miravalle</span>
              </button>

              <button
                onClick={() => onNavigate('contact')}
                className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95"
              >
                <WhatsAppIcon size={14} className="text-[#25D366]" />
                <span>4. Contacto & Asesoría</span>
              </button>
            </motion.div>

            {/* Primary Action CTAs - Responsive full-width on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3"
            >
              <button
                onClick={() => onNavigate('properties')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-[#25D366] text-slate-950 font-black text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Ver Catálogo Informativo</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </button>

              <button
                onClick={() => onOpenVisitModal('Consulta General MGM')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm backdrop-blur-md border border-white/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CalendarCheck2 className="h-4 w-4 text-emerald-300" />
                <span>Agendar Asesoría Notarial</span>
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Dynamic Wave to Cream Section */}
        <WaveDarkToCream fillColor="#FAF7F2" />
      </section>

      {/* =========================================================================
          2. STATS RIBBON (Solidez en Cifras)
          ========================================================================= */}
      <section className="relative w-full bg-[#FAF7F2] text-slate-900 py-10 sm:py-12 border-b border-amber-900/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center">
            {/* Stat 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="flex items-center gap-3.5"
            >
              <div className="h-12 w-12 rounded-full border border-amber-800/30 bg-white flex items-center justify-center shrink-0 shadow-sm text-amber-800">
                <Award className="h-6 w-6 stroke-[1.8]" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono block tracking-tight">
                  10+ Años
                </span>
                <span className="text-[11px] sm:text-xs text-slate-600 uppercase tracking-wider block font-semibold">
                  Trayectoria Urbanística
                </span>
              </div>
            </motion.div>

            {/* Stat 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-3.5"
            >
              <div className="h-12 w-12 rounded-full border border-emerald-800/30 bg-white flex items-center justify-center shrink-0 shadow-sm text-emerald-700">
                <Building className="h-6 w-6 stroke-[1.8]" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono block tracking-tight">
                  +350 Lotes
                </span>
                <span className="text-[11px] sm:text-xs text-slate-600 uppercase tracking-wider block font-semibold">
                  Urbanizados & Entregados
                </span>
              </div>
            </motion.div>

            {/* Stat 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-3.5"
            >
              <div className="h-12 w-12 rounded-full border border-teal-800/30 bg-white flex items-center justify-center shrink-0 shadow-sm text-teal-700">
                <ShieldCheck className="h-6 w-6 stroke-[1.8]" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-emerald-700 font-mono block tracking-tight">
                  100% Notarial
                </span>
                <span className="text-[11px] sm:text-xs text-slate-600 uppercase tracking-wider block font-semibold">
                  Escrituras Individuales
                </span>
              </div>
            </motion.div>

            {/* Stat 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-3.5"
            >
              <div className="h-12 w-12 rounded-full border border-amber-800/30 bg-white flex items-center justify-center shrink-0 shadow-sm text-amber-700">
                <CreditCard className="h-6 w-6 stroke-[1.8]" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-amber-700 font-mono block tracking-tight">
                  Hasta 48 Meses
                </span>
                <span className="text-[11px] sm:text-xs text-slate-600 uppercase tracking-wider block font-semibold">
                  Crédito Directo Propio
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. RESUMEN PÁGINA 1: "NOSOTROS & SOLIDEZ JURÍDICA" (con Carrusel de Pilares)
          ========================================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full bg-[#FAF7F2] text-slate-900 py-16 sm:py-24 overflow-hidden"
      >
        <TopographicContours className="text-amber-800/15" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header strip with badge and link to full page */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-amber-900/15">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-widest">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-mono">
                  RESUMEN 01
                </span>
                <span>SOBRE SOCIEDAD CIVIL MGM INMOBILIARIA</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Solidez jurídica y urbanismo de{' '}
                <span className="font-serif italic font-normal text-amber-900">
                  alta plusvalía
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-700 max-w-2xl leading-relaxed">
                MGM Inmobiliaria transforma terrenos en ciudadelas planificadas con obras concluidas, 
                garantizando que cada dólar invertido por tu familia esté legalmente blindado.
              </p>
            </div>

            <button
              onClick={() => onNavigate('about')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-950 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap shadow-md hover:scale-105 active:scale-95"
            >
              <span>Ver Más de Nosotros</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Carrusel Interactivo de Pilares de "Nosotros" */}
          <div className="relative">
            {/* Controles de navegación del Carrusel */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pilar {aboutIndex + 1} de {ABOUT_PILLARS.length}: {ABOUT_PILLARS[aboutIndex].tag}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevAbout}
                  className="w-10 h-10 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 flex items-center justify-center transition-all shadow-xs active:scale-90 cursor-pointer"
                  aria-label="Pilar anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextAbout}
                  className="w-10 h-10 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 flex items-center justify-center transition-all shadow-xs active:scale-90 cursor-pointer"
                  aria-label="Pilar siguiente"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Contenedor del Slide Activo con Transición Fluida */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={aboutIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="flex flex-col lg:grid lg:grid-cols-12 gap-6 sm:gap-8 items-center p-5 sm:p-10"
                >
                  {/* Left Column: Descriptive Content */}
                  <div className="lg:col-span-6 space-y-4 w-full order-last lg:order-first">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {React.createElement(ABOUT_PILLARS[aboutIndex].icon, { className: 'h-4 w-4' })}
                      <span>{ABOUT_PILLARS[aboutIndex].tag}</span>
                    </div>

                    <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {ABOUT_PILLARS[aboutIndex].title}
                    </h3>

                    <h4 className="text-xs sm:text-sm font-bold text-amber-800 uppercase tracking-wide">
                      {ABOUT_PILLARS[aboutIndex].subtitle}
                    </h4>

                    <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
                      {ABOUT_PILLARS[aboutIndex].desc}
                    </p>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => onNavigate('about')}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Conoce los detalles notariales</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Visual Photo Mask */}
                  <div className="lg:col-span-6 w-full order-first lg:order-last">
                    <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                      <Image
                        src={ABOUT_PILLARS[aboutIndex].image}
                        alt={ABOUT_PILLARS[aboutIndex].title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-white text-[11px] sm:text-xs font-medium">
                        Sociedad Civil MGM Inmobiliaria · Obras y Certeza Notarial
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Dots Indicators */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
                {ABOUT_PILLARS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setAboutIndex(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      aboutIndex === i ? 'w-8 bg-slate-950' : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Ir a pilar ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Wave to Midnight Dark Section */}
        <WaveCreamToDark className="mt-14" fillColor="#080D18" />
      </motion.section>

      {/* =========================================================================
          4. RESUMEN PÁGINA 2: "CATÁLOGO DE LOTES & VIVIENDAS" (con Carrusel de Inmuebles)
          ========================================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full bg-[#080D18] text-white py-16 sm:py-24 overflow-hidden"
      >
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header strip with informative note */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/15">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono">
                  RESUMEN 02
                </span>
                <span>CATÁLOGO INFORMATIVO DE PROPIEDADES</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]">
                Lotes y viviendas con{' '}
                <span className="font-serif italic font-normal text-amber-300">
                  crédito directo
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Este portal es estrictamente informativo. No realizamos cobros en línea: agenda tu visita guiada en terreno y consulta disponibilidad en tiempo real con un asesor.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Type Filter Tabs */}
              <div className="inline-flex p-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-slate-200 border border-white/15">
                {(['Todos', 'Lote de Terreno', 'Vivienda'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setCatalogTab(tab);
                      setCatalogIndex(0);
                    }}
                    className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                      catalogTab === tab
                        ? 'bg-gradient-to-r from-emerald-500 to-[#25D366] text-slate-950 font-black shadow-md'
                        : 'hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab === 'Todos' ? 'Todos' : tab === 'Lote de Terreno' ? 'Lotes' : 'Villas'}
                  </button>
                ))}
              </div>

              <button
                onClick={() => onNavigate('properties')}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-md"
              >
                <span>Ver Todo ({properties.length})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Carrusel de Propiedades Destacadas: Diseño Independiente PC vs Móvil */}
          <div className="relative">
            {/* VISTA DESKTOP / TABLET (>= 768px): Cuadrícula paginada con flechas */}
            <div className="hidden md:block">
              {filteredCatalog.length > itemsPerPage && (
                <>
                  <button
                    onClick={prevCatalog}
                    aria-label="Propiedades anteriores"
                    className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-900/95 hover:bg-emerald-500 text-white hover:text-slate-950 shadow-xl border border-white/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
                  >
                    <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
                  </button>

                  <button
                    onClick={nextCatalog}
                    aria-label="Siguientes propiedades"
                    className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-900/95 hover:bg-emerald-500 text-white hover:text-slate-950 shadow-xl border border-white/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
                  >
                    <ChevronRight className="h-6 w-6 stroke-[2.5]" />
                  </button>
                </>
              )}

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {visibleCatalog.map((lot) => (
                  <PropertyCard
                    key={lot.id}
                    lot={lot}
                    dark={true}
                    onSelectLot={onSelectLot}
                    onOpenVisitModal={onOpenVisitModal}
                  />
                ))}
              </div>

              {/* Pagination Dots (Desktop) */}
              {totalCatalogPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  {Array.from({ length: totalCatalogPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCatalogIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        catalogIndex === idx ? 'w-8 bg-[#25D366]' : 'w-2 bg-white/30 hover:bg-white/50'
                      }`}
                      aria-label={`Ir a página de catálogo ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* VISTA MÓVIL (< 768px): Rail táctil con snap horizontal nativo estilo App */}
            <div className="md:hidden">
              <div className="flex items-center justify-between mb-3 px-1 text-xs text-slate-300">
                <span className="font-semibold text-[#25D366] flex items-center gap-1">
                  <span>Desliza para ver más</span>
                  <span>→</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {filteredCatalog.length} disponibles
                </span>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none -mx-4 px-4">
                {filteredCatalog.map((lot) => (
                  <div key={lot.id} className="w-[84vw] max-w-[325px] shrink-0 snap-center">
                    <PropertyCard
                      lot={lot}
                      dark={true}
                      onSelectLot={onSelectLot}
                      onOpenVisitModal={onOpenVisitModal}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Wave to Warm Cream Skyline Section */}
        <WaveDarkToCreamSkyline className="mt-14" fillColor="#FAF7F2" />
      </motion.section>

      {/* =========================================================================
          5. RESUMEN PÁGINA 3: "CIUDADELA MIRAVALLE" (con Carrusel de Obras & Amenidades)
          ========================================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full bg-[#FAF7F2] text-slate-900 py-16 sm:py-24 overflow-hidden"
      >
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header strip with badge and link */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-amber-900/15">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-widest">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-mono">
                  RESUMEN 03
                </span>
                <span>PROYECTO INSIGNIA · MODELO DE URBANISMO</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Ciudadela Miravalle:{' '}
                <span className="font-serif italic font-normal text-amber-900">
                  Infraestructura viva
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-700 max-w-2xl leading-relaxed">
                Más de 300 lotes planificados, calzadas adoquinadas de alto tránsito, 8.000 m² de áreas deportivas y recreativas, y redes eléctricas soterradas.
              </p>
            </div>

            <button
              onClick={() => onNavigate('miravalle')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-950 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap shadow-md hover:scale-105 active:scale-95"
            >
              <span>Ver Proyecto Miravalle</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Carrusel de Amenidades y Obras de Miravalle */}
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Amenidad {miravalleIndex + 1} de {AMENITIES_MIRAVALLE.length}: {AMENITIES_MIRAVALLE[miravalleIndex].title}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevMiravalle}
                  className="w-10 h-10 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 flex items-center justify-center transition-all shadow-xs active:scale-90 cursor-pointer"
                  aria-label="Amenidad anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextMiravalle}
                  className="w-10 h-10 rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 flex items-center justify-center transition-all shadow-xs active:scale-90 cursor-pointer"
                  aria-label="Amenidad siguiente"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Slide de Amenidad Miravalle */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={miravalleIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="flex flex-col lg:grid lg:grid-cols-12 gap-6 sm:gap-8 items-center p-5 sm:p-10"
                >
                  {/* Left Column: Image with status badge */}
                  <div className="lg:col-span-7 w-full">
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-md border border-slate-200">
                      <Image
                        src={AMENITIES_MIRAVALLE[miravalleIndex].image}
                        alt={AMENITIES_MIRAVALLE[miravalleIndex].title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#25D366] text-slate-950 shadow-md">
                          {AMENITIES_MIRAVALLE[miravalleIndex].tag}
                        </span>
                      </div>
                      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-white text-[11px] sm:text-xs font-medium">
                        Ciudadela Miravalle · Masterplan Urbanístico
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Narrative */}
                  <div className="lg:col-span-5 space-y-4 w-full">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                      INFRAESTRUCTURA DE URBANIZACIÓN
                    </span>

                    <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {AMENITIES_MIRAVALLE[miravalleIndex].title}
                    </h3>

                    <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
                      {AMENITIES_MIRAVALLE[miravalleIndex].description}
                    </p>

                    <div className="pt-2 sm:pt-3">
                      <button
                        onClick={() => onOpenVisitModal('Recorrido Ciudadela Miravalle')}
                        className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md inline-flex items-center justify-center gap-2 active:scale-95"
                      >
                        <CalendarCheck2 className="h-4 w-4" />
                        <span>Agendar Recorrido en Obra</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Dots Indicators */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
                {AMENITIES_MIRAVALLE.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setMiravalleIndex(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      miravalleIndex === i ? 'w-8 bg-emerald-700' : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Ir a amenidad ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Wave to Dark Section */}
        <WaveCreamToDarkSkyline className="mt-14" fillColor="#070B14" />
      </motion.section>

      {/* =========================================================================
          6. RESUMEN PÁGINA 4: "CONTACTO, ATENCIÓN & TESTIMONIOS" (con Carrusel)
          ========================================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full bg-[#070B14] text-white py-16 sm:py-24 overflow-hidden"
      >
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header strip */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/15">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 font-mono">
                  RESUMEN 04
                </span>
                <span>CONTACTO OFICIAL & TESTIMONIOS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]">
                Atención directa, notarial y{' '}
                <span className="font-serif italic font-normal text-amber-300">
                  sin intermediarios
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Comunícate directamente con nuestro equipo directivo, revisa la documentación jurídica y conoce las experiencias de familias que ya construyen su patrimonio.
              </p>
            </div>

            <button
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap shadow-md hover:scale-105 active:scale-95"
            >
              <span>Ver Canales de Contacto</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Carrusel de Testimonios Reales */}
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Testimonio {testimonialIndex + 1} de {TESTIMONIALS_DATA.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevTestimonial}
                  className="w-10 h-10 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all shadow-xs active:scale-90 cursor-pointer"
                  aria-label="Testimonio anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-10 h-10 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all shadow-xs active:scale-90 cursor-pointer"
                  aria-label="Testimonio siguiente"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="bg-slate-900/90 rounded-3xl border border-white/15 p-8 sm:p-10 shadow-2xl backdrop-blur-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 max-w-3xl"
                >
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(TESTIMONIALS_DATA[testimonialIndex].stars)].map((_, idx) => (
                      <Star key={idx} className="h-5 w-5 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-base sm:text-xl text-slate-200 italic leading-relaxed font-serif">
                    &ldquo;{TESTIMONIALS_DATA[testimonialIndex].text}&rdquo;
                  </p>

                  <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-base font-bold text-white">
                        {TESTIMONIALS_DATA[testimonialIndex].name}
                      </h4>
                      <span className="text-xs text-emerald-400 font-medium">
                        {TESTIMONIALS_DATA[testimonialIndex].role}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {TESTIMONIALS_DATA[testimonialIndex].location}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Action Capsule to WhatsApp & Office */}
          <div className="rounded-3xl bg-white/10 border border-white/15 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                ¿Deseas hablar directamente con un asesor notarial?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Respondemos consultas en minutos con planimetrías y cotizaciones personalizadas.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md inline-flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center"
              >
                <WhatsAppIcon size={18} className="text-slate-950 shrink-0" />
                <span>WhatsApp Oficial Inmediato</span>
              </a>

              <button
                onClick={() => onOpenVisitModal('Agendamiento desde Inicio')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md active:scale-95 text-center"
              >
                <span>Agendar Cita en Oficina</span>
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
