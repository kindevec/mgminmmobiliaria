'use client';

import React, { useState, useEffect } from 'react';
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
import { InvestmentCalculator } from '../InvestmentCalculator';
import { WaveDarkToCream, WaveCreamToDark } from '../WaveDividers';

interface MiravalleViewProps {
  onNavigate: (page: PageView) => void;
  onOpenVisitModal: (defaultInterest?: string) => void;
}

const MIRAVALLE_HERO_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85',
    alt: 'Terrenos y Topografía Urbanizada Miravalle',
  },
  {
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
    alt: 'Avenidas Principales Adoquinadas Miravalle',
  },
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    alt: 'Pórtico de Acceso y Villas Residenciales',
  },
  {
    url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1600&q=85',
    alt: 'Complejo Polideportivo y Áreas Recreativas',
  },
];

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
  // Banner Continuous Real Estate Slideshow
  const [heroImgIndex, setHeroImgIndex] = useState(0);
  const [heroHovered, setHeroHovered] = useState(false);

  useEffect(() => {
    if (heroHovered) return;
    const interval = setInterval(() => {
      setHeroImgIndex((prev) => (prev + 1) % MIRAVALLE_HERO_IMAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [heroHovered]);

  const nextHeroImage = () => {
    setHeroImgIndex((prev) => (prev + 1) % MIRAVALLE_HERO_IMAGES.length);
  };

  const prevHeroImage = () => {
    setHeroImgIndex((prev) => (prev - 1 < 0 ? MIRAVALLE_HERO_IMAGES.length - 1 : prev - 1));
  };

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
    <div className="w-full overflow-hidden bg-white text-slate-900">
      {/* =========================================================================
          1. BANNER CINEMÁTICO — 50/50 SLIDER (PALETA CORPORATIVA LOGO MGM)
          ========================================================================= */}
      <section className="relative w-full bg-[#113d22] text-white overflow-hidden">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-[640px] sm:min-h-[720px] lg:min-h-[800px] xl:min-h-[860px]">
          
          {/* LADO IZQUIERDO: 50% - Panel Verde MGM (#113d22) con Título y Párrafo (Sin botones ni iconos) */}
          <div className="bg-[#113d22] flex flex-col justify-center items-center text-center px-6 sm:px-10 md:px-12 lg:px-14 xl:px-18 pt-36 sm:pt-44 lg:pt-48 pb-14 sm:pb-18 lg:pb-22 z-10 space-y-6 sm:space-y-8 max-w-3xl mx-auto">
            
            {/* Título Principal con Acento Verde (#5be196) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.08] tracking-tight [text-wrap:balance] text-center mx-auto">
              Ciudadela Miravalle:
              <br />
              <span className="text-[#5be196]">El hogar que tu familia merece.</span>
            </h1>

            {/* Párrafo Descriptivo */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-200/90 leading-relaxed font-normal max-w-2xl text-center mx-auto">
              Diseñada bajo rigurosos estándares urbanísticos: calzadas adoquinadas de 10 y 12 metros, redes subterráneas de electricidad, agua potable garantizada, complejo polideportivo y control de acceso 24 horas.
            </p>

          </div>

          {/* LADO DERECHO: 50% - Carrusel Continuo Inmobiliario con Difuminación Perfecta */}
          <div
            className="relative w-full h-[460px] sm:h-[560px] lg:h-full min-h-[460px] sm:min-h-[560px] lg:min-h-full overflow-hidden group/hero-slider select-none bg-[#113d22]"
            onMouseEnter={() => setHeroHovered(true)}
            onMouseLeave={() => setHeroHovered(false)}
          >
            {/* Sombra suave inferior */}
            <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 z-10 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

            {/* Carrusel continuo de imágenes con máscara progresiva */}
            <div className="hero-mask-blend absolute inset-0 w-full h-full">
              {MIRAVALLE_HERO_IMAGES.map((img, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    heroImgIndex === idx ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    priority={idx === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center transform transition-transform duration-7000 ease-out hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>

            {/* Flechas de navegación a los costados: SOLO aparecen ambas simultáneamente al pasar el mouse por la imagen */}
            <button
              type="button"
              onClick={prevHeroImage}
              aria-label="Imagen anterior"
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/45 hover:bg-[#22A33D] text-white hover:text-white backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center opacity-0 group-hover/hero-slider:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer pointer-events-none group-hover/hero-slider:pointer-events-auto"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={nextHeroImage}
              aria-label="Imagen siguiente"
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/45 hover:bg-[#22A33D] text-white hover:text-white backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center opacity-0 group-hover/hero-slider:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer pointer-events-none group-hover/hero-slider:pointer-events-auto"
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Indicadores de diapositiva (visibles al interactuar con el carrusel) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 opacity-0 group-hover/hero-slider:opacity-100 transition-opacity duration-300">
              {MIRAVALLE_HERO_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroImgIndex(i)}
                  aria-label={`Ver imagen ${i + 1}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    heroImgIndex === i ? 'w-6 bg-[#5be196]' : 'w-2 bg-white/50 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections with Organic Spacing */}
      <div className="space-y-16 sm:space-y-24 py-10">

      {/* 2. AMENITIES CAROUSEL WITH STRICT SIDE-FLANKED CONTROLS */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-2xl mb-8 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Amenidades y obras diseñadas para perdurar
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            En Ciudadela Miravalle no compras solo tierra: adquieres un entorno seguro, ordenado y rodeado de naturaleza.
          </p>
        </div>

        {/* Carousel Visual Box with SIDE-FLANKED controls */}
        <div className="relative w-full rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-xl">
          {/* Side-Flanked Control: LEFT-4 */}
          <button
            onClick={prevSlide}
            aria-label="Amenidad anterior"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/90 hover:bg-emerald-600 text-slate-800 hover:text-white shadow-xl border border-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
          </button>

          {/* Side-Flanked Control: RIGHT-4 */}
          <button
            onClick={nextSlide}
            aria-label="Siguiente amenidad"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/90 hover:bg-emerald-600 text-slate-800 hover:text-white shadow-xl border border-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
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
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/70 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-6 left-6 text-xs font-mono font-bold text-white bg-black/60 px-3 py-1 rounded-md backdrop-blur-md border border-white/15">
                {currentAmenity.tag}
              </span>
            </div>

            <div className="md:col-span-6 p-8 sm:p-14 flex flex-col justify-center space-y-4">
              <span className="text-xs font-bold font-mono tracking-wider uppercase text-emerald-800">
                {currentAmenity.tag}
              </span>

              <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {currentAmenity.title}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
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
                        ? 'w-8 bg-emerald-700'
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Ir a amenidad ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 3. MASTERPLAN SPECS & URBAN PLANNING */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="rounded-3xl bg-[#FBFBFA] border border-slate-200/90 p-8 sm:p-14 text-slate-900 shadow-xs">
          <div className="max-w-2xl mb-12 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Especificaciones técnicas del Master Plan
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Construye tu vivienda bajo normativa que protege la armonía arquitectónica y la plusvalía de toda la comunidad.
            </p>
          </div>

          {/* Open 3-Column Specifications with Hairline Dividers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:divide-x md:divide-slate-200">
            <div className="space-y-4 md:pr-6">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <Zap className="h-6 w-6 text-amber-600 shrink-0" />
                <h4>Servicios Básicos</h4>
              </div>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>Red eléctrica subterránea con transformadores propios.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>Red matriz de agua potable certificada y probada.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>Sistema de alcantarillado sanitario y pluvial separado.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>Ductería subterránea lista para conexión de fibra óptica.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 md:px-6">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <Car className="h-6 w-6 text-emerald-700 shrink-0" />
                <h4>Vías & Movilidad</h4>
              </div>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>Avenidas principales de 12 metros con parterre central.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>Calles secundarias de 10 metros con adoquín de alto tonelaje.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>Aceras peatonales con adoquín podotáctil y arbolado.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>Bahías de parqueo para visitantes y retornos amplios.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 md:pl-6">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <ShieldCheck className="h-6 w-6 text-emerald-700 shrink-0" />
                <h4>Seguridad & Entorno</h4>
              </div>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>Garita de control vehicular y peatonal 24 horas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>Cerramiento perimetral de seguridad en todo el predio.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>Circuito de cámaras de monitoreo en accesos principales.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">•</span>
                  <span>Retiro vegetal y sendero ecológico con iluminación LED.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-600">
              Etapa 1: 85% Vendida · Etapa 2: Preventa con precios promocionales de inauguración
            </span>
            <button
              onClick={() => onNavigate('properties')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer whitespace-normal sm:whitespace-nowrap text-center"
            >
              <span>Ver Lotes Disponibles en Miravalle</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
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
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Galería de Renders y Obras en Terreno
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Comprueba el estándar de construcción y el avance en tiempo real de Ciudadela Miravalle.
          </p>
        </div>

        {/* Gallery Carousel Box with SIDE-FLANKED controls */}
        <div className="relative w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/90 shadow-xl">
          {/* Side-Flanked Control: LEFT-4 */}
          <button
            onClick={prevGallery}
            aria-label="Fotografía anterior"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/90 hover:bg-emerald-600 text-slate-800 hover:text-white shadow-xl border border-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
          </button>

          {/* Side-Flanked Control: RIGHT-4 */}
          <button
            onClick={nextGallery}
            aria-label="Siguiente fotografía"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/90 hover:bg-emerald-600 text-slate-800 hover:text-white shadow-xl border border-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
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

      {/* 5. FACILIDADES DE ADQUISICIÓN DIRECTA EN MIRAVALLE */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 rounded-3xl overflow-hidden bg-[#FBFBFA] text-slate-900 shadow-sm border border-slate-200/90"
      >
        <div className="relative z-10 max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight [text-wrap:balance]">
              Planes Flexibles en Ciudadela Miravalle
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Elige tu lote desde 180 m² hasta 320 m² con facilidades de pago directo.
              Sin requisitos bancarios y con entrega de minuta notariada desde el primer pago.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            <motion.div
              whileHover={{ y: -4 }}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2"
            >
              <div className="text-3xl font-black text-emerald-700 font-mono">0%</div>
              <h4 className="font-extrabold text-slate-900 text-sm">Sin Buró Crediticio</h4>
              <p className="text-xs text-slate-600">
                Aprobación directa con MGM Inmobiliaria, sin historiales crediticios ni avalistas externos.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2"
            >
              <div className="text-3xl font-black text-amber-600 font-mono">48 Meses</div>
              <h4 className="font-extrabold text-slate-900 text-sm">Pagos Fijos en USD</h4>
              <p className="text-xs text-slate-600">
                Cuotas pactadas sin variaciones, en dólares americanos, adaptadas a tu flujo de ingresos.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2"
            >
              <div className="text-3xl font-black text-teal-700 font-mono">100%</div>
              <h4 className="font-extrabold text-slate-900 text-sm">Entrega Notariada</h4>
              <p className="text-xs text-slate-600">
                Linderos georreferenciados con coordenadas UTM y entrega de clave catastral oficial.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -4 }}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2"
            >
              <div className="text-3xl font-black text-emerald-700 font-mono">10% Off</div>
              <h4 className="font-extrabold text-slate-900 text-sm">Bono Pago de Contado</h4>
              <p className="text-xs text-slate-600">
                Descuento preferencial inmediato y escrituración prioritaria por cancelación al contado.
              </p>
            </motion.div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onOpenVisitModal('Ciudadela Miravalle')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-xs sm:text-sm hover:bg-emerald-700 transition-all shadow-md active:scale-95 cursor-pointer whitespace-normal sm:whitespace-nowrap text-center"
            >
              <CalendarCheck2 className="h-4 w-4 shrink-0" />
              <span>Agendar Asesoría en Obra</span>
            </button>

            <a
              href={getMiravalleWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md active:scale-95 whitespace-normal sm:whitespace-nowrap text-center cursor-pointer"
            >
              <WhatsAppIcon size={18} className="text-slate-950 shrink-0" />
              <span>Consultar Disponibilidad por WhatsApp</span>
            </a>
          </div>
        </div>
      </motion.section>

      {/* 5.5 SIMULADOR FINANCIERO INTERACTIVO DIRECTO */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <InvestmentCalculator />
      </section>

      {/* 6. VIP RECORRIDO EN VEHÍCULO CORPORATIVO CTA (With Photographic Landscape Background) */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-4"
      >
        <div className="rounded-3xl bg-slate-900 p-8 sm:p-14 text-white shadow-xl border border-slate-800 relative overflow-hidden">
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
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Te llevamos a Ciudadela Miravalle en transporte corporativo
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Coordinamos la salida desde nuestras oficinas comerciales o un punto de encuentro céntrico.
              Recorre las etapas, pisa tu futuro lote y verifica linderos junto a un ingeniero civil
              y asesor jurídico de MGM Inmobiliaria, sin ningún compromiso ni costo.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => onOpenVisitModal('Recorrido VIP en Vehículo Corporativo - Miravalle')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer whitespace-normal sm:whitespace-nowrap text-center"
              >
                <Car className="h-4 w-4 text-emerald-800 shrink-0" />
                <span>Reservar Recorrido con Chofer</span>
              </button>

              <a
                href={getMiravalleWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs sm:text-sm transition-all whitespace-normal sm:whitespace-nowrap text-center cursor-pointer shadow-md"
              >
                <WhatsAppIcon size={18} className="text-slate-950 shrink-0" />
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
