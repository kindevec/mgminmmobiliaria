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
import { WaveDarkToCream, WaveCreamToDark } from '../WaveDividers';
import { ScrollReveal } from '../common/ScrollReveal';
import { AnimatedInsignia } from '../common/AnimatedInsignia';

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
          1. BANNER CINEMÁTICO — PANORÁMICO INTEGRAL (SIN PARTICIONES VERTICALES)
          ========================================================================= */}
      <section className="relative w-full bg-[#113d22] text-white overflow-hidden min-h-[600px] sm:min-h-[660px] lg:min-h-[720px] flex items-center justify-center">
        {/* Fondo fotográfico panorámico continuo (100% de la pantalla) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden select-none"
          onMouseEnter={() => setHeroHovered(true)}
          onMouseLeave={() => setHeroHovered(false)}
        >
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
                sizes="100vw"
                className="object-cover object-center transform transition-transform duration-7000 ease-out hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}

          {/* Degradado corporativo idéntico al banner de Contacto — Luminoso, limpio y continuo */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#113d22]/85 via-black/55 to-[#113d22]/90 pointer-events-none" />

          {/* Flechas de navegación discretas a los costados */}
          <button
            type="button"
            onClick={prevHeroImage}
            aria-label="Imagen anterior"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-[#22A33D] text-white backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer opacity-70 hover:opacity-100"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={nextHeroImage}
            aria-label="Siguiente imagen"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-[#22A33D] text-white backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer opacity-70 hover:opacity-100"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Indicadores de diapositiva */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15">
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

        {/* Contenido Central: Título y Párrafo */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center items-center text-center pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 space-y-6 sm:space-y-8">
          {/* Insignia arquitectónica animada en SVG */}
          <AnimatedInsignia className="mb-0 sm:mb-1" size={76} />

          <ScrollReveal direction="down" delay={0.05}>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#5be196] drop-shadow-xs">
              Proyecto Insignia MGM Inmobiliaria
            </span>
          </ScrollReveal>

          <ScrollReveal direction="down" delay={0.15}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.08] tracking-tight [text-wrap:balance] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              Ciudadela Miravalle:
              <br />
              <span className="text-[#5be196]">El hogar que tu familia merece.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.25}>
            <p className="text-base sm:text-lg lg:text-xl text-slate-100 leading-relaxed font-normal max-w-3xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
              Diseñada bajo rigurosos estándares urbanísticos: calzadas adoquinadas de 10 y 12 metros, redes subterráneas de electricidad, agua potable garantizada, complejo polideportivo y control de acceso 24 horas.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content Sections with Organic Spacing */}
      <div className="space-y-16 sm:space-y-24 py-10">

      {/* 2. AMENITIES CAROUSEL WITH STRICT SIDE-FLANKED CONTROLS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="left" delay={0.1} className="max-w-2xl mb-8 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Amenidades y obras diseñadas para perdurar
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            En Ciudadela Miravalle no compras solo tierra: adquieres un entorno seguro, ordenado y rodeado de naturaleza.
          </p>
        </ScrollReveal>

        {/* Carousel Visual Box with SIDE-FLANKED controls */}
        <ScrollReveal direction="up" delay={0.18} className="relative w-full rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-xl">
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
        </ScrollReveal>
      </section>

      {/* 3. MASTERPLAN SPECS & URBAN PLANNING */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#FBFBFA] border border-slate-200/90 p-6 sm:p-8 lg:p-10 text-slate-900 shadow-xs">
          {/* Header con distribución horizontal eficiente (sin vacíos a la derecha) */}
          <ScrollReveal direction="down" delay={0.1} className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-slate-200/80">
            <div className="max-w-xl space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-0.5">
                <Building className="h-3.5 w-3.5 text-emerald-700" />
                <span>Normativa & Estándares Constructivos</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Especificaciones técnicas del Master Plan
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed">
              Construye tu vivienda bajo normativa técnica que protege la armonía arquitectónica, seguridad vial y la plusvalía de toda la comunidad.
            </p>
          </ScrollReveal>

          {/* 3 Columnas compactas y balanceadas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 md:divide-x md:divide-slate-200/80">
            <ScrollReveal direction="left" delay={0.15} className="space-y-3.5 md:pr-4 lg:pr-6">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base sm:text-lg">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/70">
                  <Zap className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
                <h4>Servicios Básicos</h4>
              </div>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5 leading-snug">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                  <span>Red eléctrica subterránea con transformadores propios.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                  <span>Red matriz de agua potable certificada y probada.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                  <span>Sistema de alcantarillado sanitario y pluvial separado.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                  <span>Ductería subterránea lista para conexión de fibra óptica.</span>
                </li>
              </ul>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2} className="space-y-3.5 md:px-4 lg:px-6">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base sm:text-lg">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/15 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/70">
                  <Car className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
                <h4>Vías & Movilidad</h4>
              </div>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5 leading-snug">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                  <span>Avenidas principales de 12 metros con parterre central.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                  <span>Calles secundarias de 10 metros con adoquín de alto tonelaje.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                  <span>Aceras peatonales con adoquín podotáctil y arbolado.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                  <span>Bahías de parqueo para visitantes y retornos amplios.</span>
                </li>
              </ul>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.25} className="space-y-3.5 md:pl-4 lg:pl-6">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base sm:text-lg">
                <div className="w-8 h-8 rounded-lg bg-[#113d22]/15 text-[#113d22] flex items-center justify-center shrink-0 border border-[#113d22]/20">
                  <ShieldCheck className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
                <h4>Seguridad & Entorno</h4>
              </div>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5 leading-snug">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                  <span>Garita de control vehicular y peatonal 24 horas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                  <span>Cerramiento perimetral de seguridad en todo el predio.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                  <span>Circuito de cámaras de monitoreo en accesos principales.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                  <span>Retiro vegetal y sendero ecológico con iluminación LED.</span>
                </li>
              </ul>
            </ScrollReveal>
          </div>

          {/* Barra inferior compacta de status y acción */}
          <ScrollReveal direction="zoom" delay={0.15} className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm font-semibold text-slate-700">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-200/60 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Etapa 1: 85% Vendida
              </span>
              <span className="text-slate-400 hidden sm:inline">·</span>
              <span className="text-slate-600">Etapa 2: Preventa con precios promocionales</span>
            </div>
            <button
              onClick={() => onNavigate('properties')}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-full bg-[#113d22] hover:bg-[#F58220] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer whitespace-normal sm:whitespace-nowrap text-center"
            >
              <span>Ver Lotes Disponibles en Miravalle</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. GALERÍA DE RENDERS & AVANCES DE OBRA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="left" delay={0.1} className="max-w-2xl mb-8 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Galería de Renders y Obras en Terreno
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Comprueba el estándar de construcción y el avance en tiempo real de Ciudadela Miravalle.
          </p>
        </ScrollReveal>

        {/* Gallery Carousel Box with SIDE-FLANKED controls */}
        <ScrollReveal direction="up" delay={0.18} className="relative w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/90 shadow-xl">
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
        </ScrollReveal>

        {/* Thumbnail Selector Pills */}
        <ScrollReveal direction="up" delay={0.25} className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
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
        </ScrollReveal>
      </section>

      {/* 5. FACILIDADES DE ADQUISICIÓN DIRECTA EN MIRAVALLE (ESTÁNDAR KINDEV: CERO BOX-IN-BOX) */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="space-y-10 sm:space-y-14">
          {/* Header con jerarquía expresiva y micro-indicador */}
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
            <ScrollReveal direction="down" delay={0.06}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Financiamiento Directo &amp; Legalidad Garantizada</span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="down" delay={0.12}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight [text-wrap:balance]">
                Planes Flexibles en <span className="text-emerald-700">Ciudadela Miravalle</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.18}>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Elige tu lote desde <span className="font-bold text-slate-900">180 m² hasta 320 m²</span> con facilidades de pago directo con la promotora. Sin requisitos bancarios, sin avales externos y con entrega de minuta notariada desde el primer abono.
              </p>
            </ScrollReveal>
          </div>

          {/* Grid de beneficios: Superficie abierta, nivel único, micro-interacciones suaves */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {/* Card 1: 0% */}
            <ScrollReveal direction="up" delay={0.08}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="group relative h-full rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-emerald-600/30 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl sm:text-5xl font-black text-emerald-700 font-mono tracking-tight">0%</span>
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 group-hover:scale-110 transition-transform duration-300">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mb-1.5">Sin Buró Crediticio</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Aprobación directa con MGM Inmobiliaria, sin historiales crediticios bancarios ni avalistas externos.
                    </p>
                  </div>
                </div>
                <div className="pt-4 mt-5 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Aprobación directa en 24h</span>
                </div>
              </motion.div>
            </ScrollReveal>

            {/* Card 2: 48 Meses */}
            <ScrollReveal direction="up" delay={0.16}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="group relative h-full rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline">
                      <span className="text-4xl sm:text-5xl font-black text-amber-600 font-mono tracking-tight">48</span>
                      <span className="ml-1.5 text-base sm:text-lg font-bold font-sans text-amber-700">Meses</span>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform duration-300">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mb-1.5">Pagos Fijos en USD</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Cuotas pactadas sin variaciones ni intereses sorpresa, en dólares americanos, adaptadas a tu flujo de ingresos.
                    </p>
                  </div>
                </div>
                <div className="pt-4 mt-5 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-amber-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Sin intereses bancarios</span>
                </div>
              </motion.div>
            </ScrollReveal>

            {/* Card 3: 100% */}
            <ScrollReveal direction="up" delay={0.24}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="group relative h-full rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-teal-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl sm:text-5xl font-black text-teal-700 font-mono tracking-tight">100%</span>
                    <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 group-hover:scale-110 transition-transform duration-300">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mb-1.5">Entrega Notariada</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Linderos georreferenciados con coordenadas UTM y entrega de clave catastral oficial respaldada.
                    </p>
                  </div>
                </div>
                <div className="pt-4 mt-5 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-teal-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Seguridad jurídica total</span>
                </div>
              </motion.div>
            </ScrollReveal>

            {/* Card 4: 10% Off */}
            <ScrollReveal direction="up" delay={0.32}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="group relative h-full rounded-2xl bg-white border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-emerald-600/30 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline">
                      <span className="text-4xl sm:text-5xl font-black text-emerald-700 font-mono tracking-tight">10%</span>
                      <span className="ml-1.5 text-base sm:text-lg font-bold font-sans text-emerald-700 uppercase">Off</span>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mb-1.5">Bono Pago de Contado</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Descuento preferencial inmediato y escrituración prioritaria por cancelación al contado.
                    </p>
                  </div>
                </div>
                <div className="pt-4 mt-5 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Escrituración prioritaria</span>
                </div>
              </motion.div>
            </ScrollReveal>
          </div>

          {/* Bloque CTA ergonómico y micro-garantías */}
          <ScrollReveal direction="up" delay={0.2} className="flex flex-col items-center justify-center gap-4 pt-2">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
              <button
                onClick={() => onOpenVisitModal('Ciudadela Miravalle')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-xl active:scale-95 cursor-pointer whitespace-nowrap text-center"
              >
                <CalendarCheck2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>Agendar Asesoría en Obra</span>
              </button>

              <a
                href={getMiravalleWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md hover:shadow-xl active:scale-95 whitespace-nowrap text-center cursor-pointer"
              >
                <WhatsAppIcon size={18} className="text-slate-950 shrink-0" />
                <span>Consultar Disponibilidad por WhatsApp</span>
              </a>
            </div>

            {/* Micro-puntos de confianza */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-700 pt-1 font-medium">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Minuta notariada desde la cuota 1
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Transporte institucional gratuito para visitas
              </span>
              <span className="hidden sm:inline text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Asesoría técnica y legal sin costo
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 6. VIP RECORRIDO EN VEHÍCULO CORPORATIVO CTA (With Photographic Landscape Background) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-4">
        <ScrollReveal direction="zoom" delay={0.15} className="rounded-3xl bg-slate-900 p-8 sm:p-14 text-white shadow-xl border border-slate-800 relative overflow-hidden">
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
        </ScrollReveal>
      </section>
      </div>
    </div>
  );
}
