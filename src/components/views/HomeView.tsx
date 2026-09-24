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
  KeyRound,
  Trees,
  Sparkles,
  CalendarCheck2,
  Layers,
  MapPin,
  Search,
  CheckCircle2,
} from 'lucide-react';
import type { PageView } from '../Header';
import {
  AMENITIES_MIRAVALLE,
  TESTIMONIALS_DATA,
  getGeneralWhatsAppUrl,
  type LotProperty,
} from '@/src/data/lots';
import { useProperties } from '@/src/context/PropertyContext';
import { PropertyCard } from '../PropertyCard';
import { WhatsAppIcon } from '../SocialIcons';
import {
  WaveDarkToCream,
  WaveCreamToDark,
  TopographicContours,
} from '../WaveDividers';

interface HomeViewProps {
  onNavigate: (page: PageView) => void;
  onOpenVisitModal: (defaultInterest?: string) => void;
  onSelectLot: (lot: LotProperty) => void;
  onFilterSearch?: (location: string, type: string, maxPrice: number) => void;
}

// 4 Pilares Fundacionales
const ABOUT_PILLARS = [
  {
    title: 'Certeza Jurídica & Notarial',
    subtitle: 'Escrituras Individuales Inmediatas',
    desc: 'Cada lote cuenta con aprobación municipal definitiva, levantamiento topográfico georreferenciado y protocolización solemne ante Notaría Pública, libre de gravámenes o prohibiciones.',
    icon: ShieldCheck,
    tag: '100% Legalizado',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Obras Civiles Concluidas',
    subtitle: 'Urbanismo Real y Palpable',
    desc: 'Calzadas adoquinadas de 10 a 12 metros, aceras con franjas peatonales, bordillos de hormigón y redes de alcantarillado pluvial y sanitario en pleno funcionamiento in situ.',
    icon: Building,
    tag: 'Obras Entregadas',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Crédito Directo hasta 48 Meses',
    subtitle: 'Sin Bancos ni Buró de Crédito',
    desc: 'Financiamiento directo otorgado por la urbanizadora. Cuotas mensuales fijas en dólares, mínimos requisitos (solo tu cédula) y aprobación sin trabas burocráticas para ecuatorianos y residentes en el exterior.',
    icon: CreditCard,
    tag: 'Crédito Propio',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Redes Eléctricas Soterradas',
    subtitle: 'Estética y Vanguardia Subterránea',
    desc: 'Acometidas eléctricas y ductería de telecomunicaciones bajo tierra, garantizando un horizonte despejado sin cables aéreos, mayor seguridad y plusvalía inmediata.',
    icon: KeyRound,
    tag: 'Tecnología Soterrada',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
  },
];

export function HomeView({
  onNavigate,
  onOpenVisitModal,
  onSelectLot,
  onFilterSearch,
}: HomeViewProps) {
  const { properties } = useProperties();

  // Search Bar inside Hero
  const [heroType, setHeroType] = useState('Todos');
  const [heroPrice, setHeroPrice] = useState('Todos');

  // Carousel 1: Pillars
  const [aboutIndex, setAboutIndex] = useState(0);

  // Carousel 2: Catalog
  const [catalogTab, setCatalogTab] = useState<'Todos' | 'Lote de Terreno' | 'Vivienda'>('Todos');
  const [catalogIndex, setCatalogIndex] = useState(0);

  // Carousel 3: Miravalle
  const [miravalleIndex, setMiravalleIndex] = useState(0);

  // Carousel 4: Testimonials
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Filtered properties for Catalog Summary Carousel
  const filteredCatalog = properties.filter((item) => {
    if (catalogTab === 'Todos') return true;
    return item.type === catalogTab;
  });

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

  const handleHeroSearch = () => {
    let parsedPrice = 120000;
    if (heroPrice === '25k') parsedPrice = 25000;
    if (heroPrice === '35k') parsedPrice = 35000;
    if (heroPrice === '50k') parsedPrice = 50000;

    if (onFilterSearch) {
      onFilterSearch('Todas', heroType, parsedPrice);
    }
    onNavigate('properties');
  };

  return (
    <div className="w-full overflow-hidden bg-white text-slate-900">
      {/* =========================================================================
          1. CINEMATIC HERO — Inversión Inmobiliaria & Búsqueda Predictiva
          ========================================================================= */}
      <section className="relative w-full min-h-[660px] md:min-h-[740px] lg:min-h-[800px] flex flex-col justify-between overflow-hidden bg-slate-950 text-white">
        {/* Background Photo with subtle zoom */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2160&q=90"
            alt="Sociedad Civil MGM Inmobiliaria - Urbanismo Planificado en Ecuador"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.82]"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Gradient Contrast Layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        {/* Main Hero Container */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center pt-28 sm:pt-32 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl space-y-6"
          >


            {/* Editorial Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] [text-wrap:balance]">
              Tierra firme, certeza jurídica y el{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 font-serif italic font-normal">
                patrimonio de tu familia.
              </span>
            </h1>

            {/* Informative Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl leading-relaxed drop-shadow-sm">
              Sociedad Civil MGM Inmobiliaria desarrolla comunidades residenciales con obras civiles concluidas, servicios básicos garantizados y crédito directo hasta 48 meses.
            </p>

            {/* Quick Filter Search Bar (Ergonomic, Architectural, Zero Box-in-Box) */}
            <div className="pt-2 max-w-3xl">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center divide-y sm:divide-y-0 sm:divide-x divide-white/10 gap-3 sm:gap-4">
                {/* Type Selector */}
                <div className="flex-1 py-1 sm:py-0 px-2 sm:px-3 flex items-center gap-3">
                  <Layers className="h-5 w-5 text-emerald-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Tipo de Inmueble
                    </label>
                    <select
                      value={heroType}
                      onChange={(e) => setHeroType(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-semibold text-white focus:outline-none cursor-pointer pt-0.5"
                    >
                      <option value="Todos" className="bg-slate-900 text-white">Todos los inmuebles</option>
                      <option value="Lote de Terreno" className="bg-slate-900 text-white">Lotes de Terreno</option>
                      <option value="Vivienda" className="bg-slate-900 text-white">Villas & Casas</option>
                    </select>
                  </div>
                </div>

                {/* Price Selector */}
                <div className="flex-1 pt-2 sm:pt-0 py-1 sm:py-0 px-2 sm:px-3 flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-amber-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Presupuesto Máximo
                    </label>
                    <select
                      value={heroPrice}
                      onChange={(e) => setHeroPrice(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-semibold text-white focus:outline-none cursor-pointer pt-0.5"
                    >
                      <option value="Todos" className="bg-slate-900 text-white">Sin límite</option>
                      <option value="25k" className="bg-slate-900 text-white">Hasta $25,000 USD</option>
                      <option value="35k" className="bg-slate-900 text-white">Hasta $35,000 USD</option>
                      <option value="50k" className="bg-slate-900 text-white">Hasta $50,000 USD</option>
                    </select>
                  </div>
                </div>

                {/* Search Action Button */}
                <div className="pt-2 sm:pt-0 sm:pl-2 shrink-0">
                  <button
                    onClick={handleHeroSearch}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-[#25D366] hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <Search className="h-4 w-4 stroke-[2.5]" />
                    <span>Explorar Disponibilidad</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenVisitModal('Consulta General MGM')}
                className="px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm backdrop-blur-md border border-white/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <CalendarCheck2 className="h-4 w-4 text-emerald-300" />
                <span>Agendar Asesoría Notarial en Sitio</span>
              </button>

              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <WhatsAppIcon size={16} className="text-[#25D366]" />
                <span>WhatsApp Asesor Directo</span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Transition into Pure White */}
        <WaveDarkToCream fillColor="#FFFFFF" />
      </section>

      {/* =========================================================================
          2. METRICS & TRUST RIBBON (Solidez en Cifras)
          ========================================================================= */}
      <section className="relative w-full bg-white text-slate-900 py-10 sm:py-14 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center">
            {/* Stat 1 */}
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-center justify-center shrink-0 shadow-xs text-amber-700">
                <Award className="h-6 w-6 stroke-[1.8]" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono block tracking-tight">
                  10+ Años
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500 uppercase tracking-wider block font-semibold">
                  Trayectoria Urbanística
                </span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-center justify-center shrink-0 shadow-xs text-emerald-700">
                <Building className="h-6 w-6 stroke-[1.8]" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono block tracking-tight">
                  +350 Lotes
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500 uppercase tracking-wider block font-semibold">
                  Urbanizados con Obras
                </span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-center justify-center shrink-0 shadow-xs text-teal-700">
                <ShieldCheck className="h-6 w-6 stroke-[1.8]" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-emerald-700 font-mono block tracking-tight">
                  100% Notarial
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500 uppercase tracking-wider block font-semibold">
                  Escrituras Individuales
                </span>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-center justify-center shrink-0 shadow-xs text-amber-700">
                <CreditCard className="h-6 w-6 stroke-[1.8]" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-amber-700 font-mono block tracking-tight">
                  Hasta 48 Meses
                </span>
                <span className="text-[11px] sm:text-xs text-slate-500 uppercase tracking-wider block font-semibold">
                  Crédito Directo Propio
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. SOLIDEZ JURÍDICA & PILARES URBANÍSTICOS (Carrusel con Flechas Flanqueadas)
          ========================================================================= */}
      <section className="relative w-full bg-[#FBFBFA] text-slate-900 py-16 sm:py-24 overflow-hidden border-b border-slate-100">
        <TopographicContours className="text-slate-900/5" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200">
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Solidez jurídica y urbanismo de{' '}
                <span className="font-serif italic font-normal text-emerald-800">
                  alta plusvalía
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                MGM Inmobiliaria transforma terrenos en ciudadelas planificadas con obras concluidas, garantizando que cada dólar invertido por tu familia esté legalmente blindado.
              </p>
            </div>

            <button
              onClick={() => onNavigate('about')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap shadow-md hover:scale-105 active:scale-95"
            >
              <span>Conoce Nuestra Historia</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Carrusel con Navegación Flanqueada (Regla 2 Kindev) */}
          <div className="relative">
            {/* Botón Lateral Izquierdo Flanqueado */}
            <button
              onClick={prevAbout}
              aria-label="Pilar anterior"
              className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white hover:bg-emerald-700 text-slate-800 hover:text-white shadow-xl border border-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
            </button>

            {/* Botón Lateral Derecho Flanqueado */}
            <button
              onClick={nextAbout}
              aria-label="Pilar siguiente"
              className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white hover:bg-emerald-700 text-slate-800 hover:text-white shadow-xl border border-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="h-6 w-6 stroke-[2.5]" />
            </button>

            {/* Contenedor del Slide Activo */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={aboutIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="flex flex-col lg:grid lg:grid-cols-12 items-stretch"
                >
                  {/* Left Column: Descriptive Content */}
                  <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 space-y-4 flex flex-col justify-center order-last lg:order-first">
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
                        <span>Conoce los detalles notariales y el proceso</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Visual Photo Full-Bleed (top, bottom, right margin) */}
                  <div className="lg:col-span-6 w-full relative min-h-[260px] sm:min-h-[320px] lg:min-h-[420px] order-first lg:order-last">
                    <Image
                      src={ABOUT_PILLARS[aboutIndex].image}
                      alt={ABOUT_PILLARS[aboutIndex].title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4 text-white text-[11px] sm:text-xs font-medium drop-shadow-md">
                      Sociedad Civil MGM Inmobiliaria · Obras y Certeza Notarial
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots Indicators - Clean Floating Dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {ABOUT_PILLARS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setAboutIndex(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    aboutIndex === i ? 'w-8 bg-emerald-700' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Ir a pilar ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. CATÁLOGO DE LOTES & VIVIENDAS (Grid & Carrusel Flanqueado - Blanco Puro)
          ========================================================================= */}
      <section className="relative w-full bg-white text-slate-900 py-16 sm:py-24 overflow-hidden border-b border-slate-100">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header strip */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200">
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Lotes y viviendas con{' '}
                <span className="font-serif italic font-normal text-emerald-700">
                  crédito directo
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                Revisa disponibilidad en tiempo real, metrajes exactos y facilidades de pago directo. Agenda tu visita técnica presencial en terreno sin intermediarios.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Type Filter Tabs */}
              <div className="inline-flex p-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600 border border-slate-200/80">
                {(['Todos', 'Lote de Terreno', 'Vivienda'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setCatalogTab(tab);
                      setCatalogIndex(0);
                    }}
                    className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                      catalogTab === tab
                        ? 'bg-emerald-700 text-white font-bold shadow-xs'
                        : 'hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {tab === 'Todos' ? 'Todos' : tab === 'Lote de Terreno' ? 'Lotes' : 'Villas'}
                  </button>
                ))}
              </div>

              <button
                onClick={() => onNavigate('properties')}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-slate-900 hover:bg-emerald-800 text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-md"
              >
                <span>Ver Todo el Inventario ({properties.length})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Carrusel de Propiedades Destacadas: Flanqueado en PC, Táctil en Móvil */}
          <div className="relative">
            {/* VISTA DESKTOP / TABLET (>= 768px): Cuadrícula paginada con flechas flanqueadas */}
            <div className="hidden md:block">
              {filteredCatalog.length > itemsPerPage && (
                <>
                  <button
                    onClick={prevCatalog}
                    aria-label="Propiedades anteriores"
                    className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white hover:bg-emerald-700 text-slate-800 hover:text-white shadow-xl border border-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  >
                    <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
                  </button>

                  <button
                    onClick={nextCatalog}
                    aria-label="Siguientes propiedades"
                    className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white hover:bg-emerald-700 text-slate-800 hover:text-white shadow-xl border border-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
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
                    dark={false}
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
                        catalogIndex === idx ? 'w-8 bg-emerald-700' : 'w-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                      aria-label={`Ir a página de catálogo ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* VISTA MÓVIL (< 768px): Rail táctil con snap horizontal nativo estilo App */}
            <div className="md:hidden">
              <div className="flex items-center justify-between mb-3 px-1 text-xs text-slate-600">
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <span>Desliza para ver más</span>
                  <span>→</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {filteredCatalog.length} disponibles
                </span>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none -mx-4 px-4">
                {filteredCatalog.map((lot) => (
                  <div key={lot.id} className="w-[84vw] max-w-[325px] shrink-0 snap-center">
                    <PropertyCard
                      lot={lot}
                      dark={false}
                      onSelectLot={onSelectLot}
                      onOpenVisitModal={onOpenVisitModal}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. PROYECTO INSIGNIA: CIUDADELA MIRAVALLE (Carrusel con Flechas Flanqueadas)
          ========================================================================= */}
      <section className="relative w-full bg-[#FBFBFA] text-slate-900 py-16 sm:py-24 overflow-hidden border-t border-slate-100">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header strip */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200">
            <div className="space-y-2">

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
              <span>Ver Masterplan Miravalle</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Carrusel de Amenidades con Flechas Flanqueadas a los Costados (Regla 2 Kindev) */}
          <div className="relative">
            {/* Botón Lateral Izquierdo */}
            <button
              onClick={prevMiravalle}
              aria-label="Amenidad anterior"
              className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white hover:bg-emerald-600 text-slate-800 hover:text-white shadow-xl border border-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
            </button>

            {/* Botón Lateral Derecho */}
            <button
              onClick={nextMiravalle}
              aria-label="Amenidad siguiente"
              className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white hover:bg-emerald-600 text-slate-800 hover:text-white shadow-xl border border-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="h-6 w-6 stroke-[2.5]" />
            </button>

            {/* Slide de Amenidad Miravalle */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={miravalleIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="flex flex-col lg:grid lg:grid-cols-12 items-stretch"
                >
                  {/* Left Column: Image Full-Bleed (top, bottom, left) */}
                  <div className="lg:col-span-7 w-full relative min-h-[260px] sm:min-h-[340px] lg:min-h-[420px]">
                    <Image
                      src={AMENITIES_MIRAVALLE[miravalleIndex].image}
                      alt={AMENITIES_MIRAVALLE[miravalleIndex].title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#25D366] text-slate-950 shadow-md">
                        {AMENITIES_MIRAVALLE[miravalleIndex].tag}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white text-[11px] sm:text-xs font-medium drop-shadow-md">
                      Ciudadela Miravalle · Masterplan Urbanístico
                    </div>
                  </div>

                  {/* Right Column: Narrative Content with ergonomic padding */}
                  <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 space-y-4 flex flex-col justify-center w-full">
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
            </div>

            {/* Dots Indicators - Clean Floating Dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
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

        {/* Section divider to Testimonials */}
      </section>

      {/* =========================================================================
          6. FAMILIAS PROPIETARIAS & TESTIMONIOS (Carrusel Flanqueado - Blanco Puro)
          ========================================================================= */}
      <section className="relative w-full bg-white text-slate-900 py-16 sm:py-24 overflow-hidden border-t border-slate-100">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header strip */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200">
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Confianza respaldada por{' '}
                <span className="font-serif italic font-normal text-emerald-800">
                  escrituras entregadas
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                Comunícate directamente con nuestro equipo directivo, revisa la documentación jurídica en notaría y conoce las experiencias de familias que ya construyen su patrimonio.
              </p>
            </div>

            <button
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap shadow-md hover:scale-105 active:scale-95"
            >
              <span>Canales de Contacto Directo</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Carrusel de Testimonios Reales con Flechas Flanqueadas a los Costados (Regla 2 Kindev) */}
          <div className="relative">
            {/* Botón Lateral Izquierdo */}
            <button
              onClick={prevTestimonial}
              aria-label="Testimonio anterior"
              className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white hover:bg-emerald-700 text-slate-800 hover:text-white shadow-xl border border-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
            </button>

            {/* Botón Lateral Derecho */}
            <button
              onClick={nextTestimonial}
              aria-label="Testimonio siguiente"
              className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white hover:bg-emerald-700 text-slate-800 hover:text-white shadow-xl border border-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="h-6 w-6 stroke-[2.5]" />
            </button>

            <div className="bg-[#FBFBFA] rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-lg">
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

                  <p className="text-base sm:text-xl text-slate-800 italic leading-relaxed font-serif">
                    &ldquo;{TESTIMONIALS_DATA[testimonialIndex].text}&rdquo;
                  </p>

                  <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {TESTIMONIALS_DATA[testimonialIndex].name}
                      </h4>
                      <span className="text-xs text-emerald-700 font-medium">
                        {TESTIMONIALS_DATA[testimonialIndex].role}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      {TESTIMONIALS_DATA[testimonialIndex].location}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Action Capsule to WhatsApp & Office */}
          <div className="rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50/40 to-slate-50 border border-emerald-200/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                ¿Deseas hablar directamente con un asesor notarial?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
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
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md active:scale-95 text-center"
              >
                <span>Agendar Cita en Oficina</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
