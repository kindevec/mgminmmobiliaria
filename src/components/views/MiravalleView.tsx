'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  CalendarCheck2,
  PhoneCall,
  CheckCircle2,
  Trees,
  ShieldCheck,
  Zap,
  Sparkles,
  Trophy,
  Building,
  Car,
  Maximize2,
  ArrowRight,
  DollarSign,
  FileText,
} from 'lucide-react';
import type { PageView } from '../Header';
import { AMENITIES_MIRAVALLE, getMiravalleWhatsAppUrl } from '@/src/data/lots';
import { WhatsAppIcon } from '../SocialIcons';

import { WaveDarkToCream, WaveCreamToDark } from '../WaveDividers';

interface MiravalleViewProps {
  onNavigate: (page: PageView) => void;
  onOpenVisitModal: (defaultInterest?: string) => void;
}

const GALLERY_RENDERS = [
  {
    title: 'Avenida Principal & Parterre Central',
    category: 'Avance de Obra Real',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    description: 'Calzadas adoquinadas de 12 metros concluidas con bordillos de hormigón y ductos soterrados.',
  },
  {
    title: 'Pórtico de Acceso & Garita 24/7',
    category: 'Render Arquitectónico',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    description: 'Control automatizado con lectura de placas y caseta blindada de guardianía permanente.',
  },
  {
    title: 'Complejo Polideportivo & Áreas Recreativas',
    category: 'Avance de Obras',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
    description: 'Canchas de uso múltiple con cerramiento perimetral e iluminación nocturna LED.',
  },
  {
    title: 'Villas Residenciales Modelo',
    category: 'Modelo de Construcción',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    description: 'Casas independientes con 3 dormitorios, jardín posterior y dos parqueaderos.',
  },
];

export function MiravalleView({
  onNavigate,
  onOpenVisitModal,
}: MiravalleViewProps) {
  // Carousel state for amenities
  const [activeSlide, setActiveSlide] = useState(0);

  // Gallery state for renders & obra
  const [activeGallery, setActiveGallery] = useState(0);

  const prevSlide = () => {
    setActiveSlide((curr) =>
      curr === 0 ? AMENITIES_MIRAVALLE.length - 1 : curr - 1
    );
  };

  const nextSlide = () => {
    setActiveSlide((curr) =>
      curr === AMENITIES_MIRAVALLE.length - 1 ? 0 : curr + 1
    );
  };

  const prevGallery = () => {
    setActiveGallery((curr) =>
      curr === GALLERY_RENDERS.length - 1 ? 0 : curr - 1
    );
  };

  const nextGallery = () => {
    setActiveGallery((curr) =>
      curr === GALLERY_RENDERS.length - 1 ? 0 : curr + 1
    );
  };

  const currentAmenity = AMENITIES_MIRAVALLE[activeSlide];
  const currentRender = GALLERY_RENDERS[activeGallery];

  return (
    <div className="w-full overflow-hidden bg-slate-950">
      {/* 1. CINEMATIC FULL-WIDTH HERO OF CIUDADELA MIRAVALLE */}
      <section className="relative w-full min-h-[640px] md:min-h-[720px] lg:min-h-[780px] flex flex-col justify-between overflow-hidden bg-slate-950 text-white">
        {/* Cinematic Backdrop Image with Slow Ken Burns Zoom Effect */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2160&q=90"
            alt="Terrenos y Topografía Urbanizada Miravalle"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.85]"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Multi-layer Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/35 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center pt-28 sm:pt-32 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
                <Trees className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                  Proyecto Insignia · Urbanización Residencial Modelo
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] [text-wrap:balance]">
                Ciudadela Miravalle:{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 font-serif italic font-normal">
                  El hogar que tu familia merece.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl drop-shadow-sm">
                Diseñada bajo rigurosos estándares urbanísticos: calzadas adoquinadas de 10 y 12 metros, redes subterráneas de electricidad, agua potable garantizada, complejo polideportivo y control de acceso 24 horas.
              </p>

              {/* Metrics Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-t border-white/20">
                <div>
                  <span className="font-mono text-2xl sm:text-3xl font-black text-white block">
                    +300
                  </span>
                  <span className="text-xs text-slate-300 font-medium">Lotes Planificados</span>
                </div>
                <div>
                  <span className="font-mono text-2xl sm:text-3xl font-black text-emerald-400 block">
                    8.000 m²
                  </span>
                  <span className="text-xs text-slate-300 font-medium">Parques y Canchas</span>
                </div>
                <div>
                  <span className="font-mono text-2xl sm:text-3xl font-black text-amber-400 block">
                    100%
                  </span>
                  <span className="text-xs text-slate-300 font-medium">Redes Soterradas</span>
                </div>
                <div>
                  <span className="font-mono text-2xl sm:text-3xl font-black text-white block">
                    48 Meses
                  </span>
                  <span className="text-xs text-slate-300 font-medium">Crédito Directo</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onOpenVisitModal('Ciudadela Miravalle')}
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-[#25D366] text-slate-950 font-black text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-xl flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                  <CalendarCheck2 className="h-4 w-4 stroke-[2.5]" />
                  <span>Agendar Recorrido a Miravalle</span>
                </button>

                <a
                  href={getMiravalleWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm backdrop-blur-md border border-white/20 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer whitespace-nowrap"
                >
                  <WhatsAppIcon size={18} />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Visual Photo Mask */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative aspect-[4/3] w-full max-w-md rounded-[70px_24px_90px_24px] overflow-hidden shadow-2xl bg-slate-900 border-2 border-white/30">
                <Image
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
                  alt="Ciudadela Miravalle Urbanismo"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-6 right-6 text-white pointer-events-none">
                  <span className="text-xs font-bold font-mono text-[#25D366] bg-black/60 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md inline-block mb-1">
                    Etapa 1 & 2 con Entregas Activas
                  </span>
                  <p className="text-xs text-slate-200 font-medium drop-shadow-sm">
                    Vías adoquinadas, aceras y acometidas subterráneas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Wave to Content */}
        <WaveDarkToCream fillColor="#080D18" />
      </section>

      {/* Main Content Sections with Organic Spacing */}
      <div className="space-y-16 sm:space-y-24 py-10">

      {/* 2. AMENITIES CAROUSEL WITH STRICT SIDE-FLANKED CONTROLS */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 rounded-3xl overflow-hidden bg-slate-950 text-white shadow-2xl border border-white/10"
      >
        {/* Sports Park High-Res Photo Background */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1920&q=80"
            alt="Complejo Deportivo y Áreas Verdes"
            fill
            sizes="100vw"
            className="object-cover opacity-20 brightness-75 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-950/80" />
        </div>

        <div className="relative z-10">
          <div className="max-w-2xl mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
              Infraestructura & Bienestar
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Amenidades y obras diseñadas para perdurar
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              En Ciudadela Miravalle no compras solo tierra: adquieres un entorno seguro, ordenado y rodeado de naturaleza.
            </p>
          </div>

          {/* Carousel Visual Box with SIDE-FLANKED controls */}
          <div className="relative w-full rounded-3xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/15 shadow-xl">
            {/* Side-Flanked Control: LEFT-4 */}
            <button
              onClick={prevSlide}
              aria-label="Amenidad anterior"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-emerald-600 text-white shadow-xl border border-white/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
            >
              <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
            </button>

            {/* Side-Flanked Control: RIGHT-4 */}
            <button
              onClick={nextSlide}
              aria-label="Siguiente amenidad"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-emerald-600 text-white shadow-xl border border-white/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
            >
              <ChevronRight className="h-6 w-6 stroke-[2.5]" />
            </button>

            {/* Slide Content Viewer: Split Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px]">
              <div className="md:col-span-6 relative aspect-[16/10] md:aspect-auto">
                <Image
                  src={currentAmenity.image}
                  alt={currentAmenity.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-6 left-6 text-xs font-mono font-bold text-white bg-black/60 px-3 py-1 rounded-md backdrop-blur-md border border-white/15">
                  {currentAmenity.tag}
                </span>
              </div>

              <div className="md:col-span-6 p-8 sm:p-14 flex flex-col justify-center space-y-4">
                <span className="text-xs font-bold font-mono tracking-wider uppercase text-emerald-400">
                  {currentAmenity.tag}
                </span>

                <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {currentAmenity.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {currentAmenity.description}
                </p>

                {/* Slide Index Indicators */}
                <div className="flex items-center gap-2 pt-4">
                  {AMENITIES_MIRAVALLE.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        activeSlide === idx
                          ? 'w-8 bg-emerald-400'
                          : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Ir a amenidad ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 3. MASTERPLAN SPECS & URBAN PLANNING (With Cinematic Drone Backdrop) */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 rounded-3xl overflow-hidden bg-slate-950 text-white shadow-2xl border border-white/10"
      >
        {/* Quality Drone Aerial Background of Miravalle */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80"
            alt="Masterplan y Especificaciones Técnicas"
            fill
            sizes="100vw"
            className="object-cover opacity-20 brightness-75 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-950/80" />
        </div>

        <div className="relative z-10">
          <div className="max-w-2xl mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
              Diseño Urbanístico Aprobado
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Especificaciones técnicas del Master Plan
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Construye tu vivienda bajo normativa que protege la armonía arquitectónica y la plusvalía de toda la comunidad.
            </p>
          </div>

          {/* Open 3-Column Specifications with Hairline Dividers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:divide-x md:divide-white/15">
            <div className="space-y-4 md:pr-6">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Zap className="h-6 w-6 text-amber-400 shrink-0" />
                <h4>Servicios Básicos</h4>
              </div>
              <ul className="text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Red eléctrica subterránea con transformadores propios.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Red matriz de agua potable certificada y probada.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Sistema de alcantarillado sanitario y pluvial separado.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Ductería subterránea lista para conexión de fibra óptica.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 md:px-6">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Car className="h-6 w-6 text-emerald-400 shrink-0" />
                <h4>Vías & Movilidad</h4>
              </div>
              <ul className="text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Avenidas principales de 12 metros con parterre central.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Calles secundarias de 10 metros con adoquín de alto tonelaje.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Aceras peatonales con adoquín podotáctil y arbolado.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Bahías de parqueo para visitantes y retornos amplios.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 md:pl-6">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
                <h4>Seguridad & Entorno</h4>
              </div>
              <ul className="text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Garita de control vehicular y peatonal 24 horas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Cerramiento perimetral de seguridad en todo el predio.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Circuito de cámaras de monitoreo en accesos principales.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Retiro vegetal y sendero ecológico con iluminación LED.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-300">
              Etapa 1: 85% Vendida · Etapa 2: Preventa con precios promocionales de inauguración
            </span>
            <button
              onClick={() => onNavigate('properties')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-[#25D366] text-slate-950 font-black text-xs sm:text-sm hover:brightness-110 shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Ver Lotes Disponibles en Miravalle</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.section>

      {/* 4. GALERÍA DE RENDERS & AVANCES DE OBRA */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-2xl mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
            Avance Técnico & Arquitectura
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Galería de Renders y Obras en Terreno
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Comprueba el estándar de construcción y el avance en tiempo real de Ciudadela Miravalle.
          </p>
        </div>

        {/* Gallery Carousel Box with SIDE-FLANKED controls */}
        <div className="relative w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
          {/* Side-Flanked Control: LEFT-4 */}
          <button
            onClick={prevGallery}
            aria-label="Fotografía anterior"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-emerald-600 text-white shadow-xl border border-white/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
          </button>

          {/* Side-Flanked Control: RIGHT-4 */}
          <button
            onClick={nextGallery}
            aria-label="Siguiente fotografía"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-emerald-600 text-white shadow-xl border border-white/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <ChevronRight className="h-6 w-6 stroke-[2.5]" />
          </button>

          {/* Slide Content */}
          <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full">
            <Image
              src={currentRender.image}
              alt={currentRender.title}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

            <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-10 sm:right-10 text-white space-y-1 pointer-events-none">
              <span className="inline-block px-2.5 py-1 rounded-md bg-[#25D366] text-slate-950 text-[10px] font-mono font-black uppercase">
                {currentRender.category}
              </span>
              <h3 className="text-xl sm:text-3xl font-black text-white">
                {currentRender.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                {currentRender.description}
              </p>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector Pills */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          {GALLERY_RENDERS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveGallery(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeGallery === idx
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
      </motion.section>

      {/* 5. FACILIDADES DE ADQUISICIÓN DIRECTA EN MIRAVALLE (Reemplazo del Cotizador con Foto Panorámica) */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 rounded-3xl overflow-hidden bg-slate-950 text-white shadow-2xl border border-white/15"
      >
        {/* Quality Architectural Blueprint / Residential Background */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85"
            alt="Adquisición Directa en Ciudadela Miravalle"
            fill
            sizes="100vw"
            className="object-cover opacity-25 brightness-75 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/75" />
          <div className="absolute inset-0 bg-radial from-emerald-500/15 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#25D366] block">
              ADQUISICIÓN DIRECTA & CRÉDITO PROPIO
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight [text-wrap:balance]">
              Planes Flexibles en Ciudadela Miravalle
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Elige tu lote desde 180 m² hasta 320 m² con facilidades de pago directo.
              Sin requisitos bancarios y con entrega de minuta notariada desde el primer pago.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            <motion.div
              whileHover={{ y: -4 }}
              className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2"
            >
              <div className="text-3xl font-black text-[#25D366] font-mono">0%</div>
              <h4 className="font-extrabold text-white text-sm">Sin Buró Crediticio</h4>
              <p className="text-xs text-slate-300">
                Aprobación directa con MGM Inmobiliaria, sin historiales crediticios ni avalistas externos.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2"
            >
              <div className="text-3xl font-black text-amber-400 font-mono">48 Meses</div>
              <h4 className="font-extrabold text-white text-sm">Pagos Fijos en USD</h4>
              <p className="text-xs text-slate-300">
                Cuotas pactadas sin variaciones, en dólares americanos, adaptadas a tu flujo de ingresos.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2"
            >
              <div className="text-3xl font-black text-teal-400 font-mono">100%</div>
              <h4 className="font-extrabold text-white text-sm">Entrega Notariada</h4>
              <p className="text-xs text-slate-300">
                Linderos georreferenciados con coordenadas UTM y entrega de clave catastral oficial.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2"
            >
              <div className="text-3xl font-black text-emerald-400 font-mono">10% Off</div>
              <h4 className="font-extrabold text-white text-sm">Bono Pago de Contado</h4>
              <p className="text-xs text-slate-300">
                Descuento preferencial inmediato y escrituración prioritaria por cancelación al contado.
              </p>
            </motion.div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onOpenVisitModal('Ciudadela Miravalle')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-slate-950 font-black text-xs sm:text-sm hover:bg-slate-100 transition-all shadow-lg active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <CalendarCheck2 className="h-4 w-4" />
              <span>Agendar Asesoría en Obra</span>
            </button>

            <a
              href={getMiravalleWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs sm:text-sm transition-all shadow-lg active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <WhatsAppIcon size={18} className="text-slate-950" />
              <span>Consultar Disponibilidad por WhatsApp</span>
            </a>
          </div>
        </div>
      </motion.section>

      {/* 6. VIP RECORRIDO EN VEHÍCULO CORPORATIVO CTA (With Photographic Landscape Background) */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-4"
      >
        <div className="rounded-3xl bg-slate-950 p-8 sm:p-14 text-white shadow-2xl border border-white/15 relative overflow-hidden">
          {/* Panoramic Luxury Transport / Road Backdrop */}
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80"
              alt="Vehículo Corporativo MGM Inmobiliaria"
              fill
              sizes="100vw"
              className="object-cover opacity-25 brightness-75 scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          </div>

          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#25D366] block">
              Servicio Exclusivo de Acompañamiento VIP
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Te llevamos a Ciudadela Miravalle en transporte corporativo
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Coordinamos la salida desde nuestras oficinas comerciales o un punto de encuentro céntrico.
              Recorre las etapas, pisa tu futuro lote y verifica linderos junto a un ingeniero civil
              y asesor jurídico de MGM Inmobiliaria, sin ningún compromiso ni costo.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onOpenVisitModal('Recorrido VIP en Vehículo Corporativo - Miravalle')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                <Car className="h-4 w-4 text-emerald-800" />
                <span>Reservar Recorrido con Chofer</span>
              </button>

              <a
                href={getMiravalleWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer shadow-md"
              >
                <WhatsAppIcon size={18} className="text-slate-950" />
                <span>Coordinar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </motion.section>
      </div>
    </div>
  );
}
