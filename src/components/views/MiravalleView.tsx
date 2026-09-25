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
  Trees,
  ShieldCheck,
  Zap,
  Sparkles,
  Trophy,
  Car,
  Maximize2,
  ArrowRight,
  ArrowUpRight,
  DollarSign,
  FileText,
  FileCheck2,
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
      <section className="relative w-full bg-[#113d22] text-white overflow-hidden min-h-[500px] sm:min-h-[540px] lg:min-h-[580px] flex items-center justify-center select-none">
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

          {/* Indicadores de diapositiva */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15">
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
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center items-center text-center pt-24 sm:pt-28 lg:pt-32 pb-14 sm:pb-16 lg:pb-18 space-y-4 sm:space-y-6 select-text cursor-default">
          {/* Insignia arquitectónica animada en SVG */}
          <AnimatedInsignia className="mb-0 sm:mb-1" size={60} />

          <ScrollReveal direction="down" delay={0.05}>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#5be196] drop-shadow-xs">
              Proyecto Insignia MGM Inmobiliaria
            </span>
          </ScrollReveal>

          <ScrollReveal direction="down" delay={0.15}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-tight [text-wrap:balance] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              Ciudadela Miravalle:
              <br />
              <span className="text-[#5be196]">El hogar que tu familia merece.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.25}>
            <p className="text-sm sm:text-base lg:text-lg text-slate-100 leading-relaxed font-normal max-w-3xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
              Diseñada bajo rigurosos estándares urbanísticos: calzadas adoquinadas de 10 y 12 metros, redes subterráneas de electricidad, agua potable garantizada, complejo polideportivo y control de acceso 24 horas.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content Sections with Organic Spacing */}
      <div className="space-y-16 sm:space-y-24 pt-10 pb-4 sm:pb-6">

      {/* 2. AMENITIES CAROUSEL CON FLECHAS TIPO INICIO Y TARJETA MÁS COMPACTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="down" delay={0.1} className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 space-y-2 sm:space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight [text-wrap:balance]">
            Amenidades y obras diseñadas para perdurar
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            En Ciudadela Miravalle no compras solo tierra: adquieres un entorno seguro, ordenado y rodeado de naturaleza.
          </p>
        </ScrollReveal>

        {/* Carousel Visual Box: Ancho reducido (max-w-4xl) con flechas laterales estilo Inicio */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-8">
          {/* Botón Lateral Izquierdo (Estilo carrusel de Inicio) */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Amenidad anterior"
            className="catalog-arrow-btn absolute left-0 sm:-left-5 lg:-left-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-12 sm:h-12 rounded-full border border-slate-200/90 flex items-center justify-center transition-all duration-300 shadow-xl sm:shadow-2xl backdrop-blur-md cursor-pointer bg-white/95 hover:bg-[#113d22] text-slate-800 hover:text-white hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6 stroke-[2.2]" />
          </button>

          {/* Botón Lateral Derecho (Estilo carrusel de Inicio) */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Siguiente amenidad"
            className="catalog-arrow-btn absolute right-0 sm:-right-5 lg:-right-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-12 sm:h-12 rounded-full border border-slate-200/90 flex items-center justify-center transition-all duration-300 shadow-xl sm:shadow-2xl backdrop-blur-md cursor-pointer bg-white/95 hover:bg-[#113d22] text-slate-800 hover:text-white hover:scale-110 active:scale-95"
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6 stroke-[2.2]" />
          </button>

          {/* Tarjeta con ancho reducido y esquinas redondeadas */}
          <ScrollReveal direction="up" delay={0.18} className="relative w-full rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-xl">
            {/* Slide Content Viewer: Split Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px] sm:min-h-[420px]">
              <div className="md:col-span-6 relative aspect-[16/10] md:aspect-auto">
                <Image
                  src={currentAmenity.image}
                  alt={currentAmenity.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/60 via-transparent to-transparent pointer-events-none" />
              </div>

              <div className="md:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-3 sm:space-y-4">
                <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  {currentAmenity.title}
                </h3>

                <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed font-normal">
                  {currentAmenity.description}
                </p>

                {/* Slide Index Indicators */}
                <div className="flex items-center gap-2 pt-2 sm:pt-4">
                  {AMENITIES_MIRAVALLE.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        activeSlide === idx
                          ? 'w-8 bg-[#22A33D]'
                          : 'w-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                      aria-label={`Ir a amenidad ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. MASTERPLAN SPECS & URBAN PLANNING */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#FBFBFA] border border-slate-200/90 p-6 sm:p-8 lg:p-10 text-slate-900 shadow-xs">
          {/* Header centrado, sin texto previo */}
          <ScrollReveal direction="down" delay={0.1} className="mb-6 sm:mb-8 text-center max-w-3xl mx-auto space-y-2 pb-4 sm:pb-5 border-b border-slate-200/80">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight [text-wrap:balance]">
              Especificaciones técnicas del Master Plan
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              Normativa que garantiza la armonía arquitectónica, seguridad y plusvalía de tu inversión.
            </p>
          </ScrollReveal>

          {/* 3 Columnas compactas con texto puntual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 md:divide-x md:divide-slate-200/80">
            <ScrollReveal direction="left" delay={0.15} className="space-y-3 md:pr-4 lg:pr-6">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base sm:text-lg">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/70">
                  <Zap className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
                <h4>Servicios Básicos</h4>
              </div>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2 leading-snug">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                  <span>Red eléctrica subterránea y transformadores propios.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                  <span>Matriz de agua potable certificada y probada.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                  <span>Alcantarillado pluvial/sanitario y ductos para fibra óptica.</span>
                </li>
              </ul>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2} className="space-y-3 md:px-4 lg:px-6">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base sm:text-lg">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/15 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/70">
                  <Car className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
                <h4>Vías & Movilidad</h4>
              </div>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2 leading-snug">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                  <span>Avenidas de 10 y 12 m con adoquín de alto tonelaje.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                  <span>Aceras peatonales con arbolado y adoquín podotáctil.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                  <span>Bahías de parqueo para visitantes y amplios retornos.</span>
                </li>
              </ul>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.25} className="space-y-3 md:pl-4 lg:pl-6">
              <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base sm:text-lg">
                <div className="w-8 h-8 rounded-lg bg-[#113d22]/15 text-[#113d22] flex items-center justify-center shrink-0 border border-[#113d22]/20">
                  <ShieldCheck className="h-4.5 w-4.5 stroke-[2.2]" />
                </div>
                <h4>Seguridad & Entorno</h4>
              </div>
              <ul className="text-xs sm:text-sm text-slate-600 space-y-2 leading-snug">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                  <span>Garita de control y guardianía permanente 24/7.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                  <span>Cerramiento perimetral y cámaras de monitoreo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                  <span>Retiro vegetal y senderos con iluminación LED.</span>
                </li>
              </ul>
            </ScrollReveal>
          </div>

          {/* Botón de acción centrado sin texto de etapas */}
          <ScrollReveal direction="zoom" delay={0.15} className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-200/80 flex justify-center">
            <button
              onClick={() => onNavigate('properties')}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#113d22] hover:bg-[#F58220] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer text-center"
            >
              <span>Ver Lotes Disponibles en Miravalle</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. GALERÍA DE RENDERS & AVANCES DE OBRA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="down" delay={0.1} className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 space-y-2 sm:space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight [text-wrap:balance]">
            Galería de Renders y Obras en Terreno
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Comprueba el estándar de construcción y el avance en tiempo real de Ciudadela Miravalle.
          </p>
        </ScrollReveal>

        {/* Gallery Carousel Box: Ancho reducido (max-w-4xl) con flechas laterales estilo Inicio */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-8">
          {/* Botón Lateral Izquierdo (Estilo carrusel de Inicio) */}
          <button
            type="button"
            onClick={prevGallery}
            aria-label="Fotografía anterior"
            className="catalog-arrow-btn absolute left-0 sm:-left-5 lg:-left-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-12 sm:h-12 rounded-full border border-slate-200/90 flex items-center justify-center transition-all duration-300 shadow-xl sm:shadow-2xl backdrop-blur-md cursor-pointer bg-white/95 hover:bg-[#113d22] text-slate-800 hover:text-white hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6 stroke-[2.2]" />
          </button>

          {/* Botón Lateral Derecho (Estilo carrusel de Inicio) */}
          <button
            type="button"
            onClick={nextGallery}
            aria-label="Siguiente fotografía"
            className="catalog-arrow-btn absolute right-0 sm:-right-5 lg:-right-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-12 sm:h-12 rounded-full border border-slate-200/90 flex items-center justify-center transition-all duration-300 shadow-xl sm:shadow-2xl backdrop-blur-md cursor-pointer bg-white/95 hover:bg-[#113d22] text-slate-800 hover:text-white hover:scale-110 active:scale-95"
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6 stroke-[2.2]" />
          </button>

          {/* Tarjeta con ancho reducido y esquinas redondeadas */}
          <ScrollReveal direction="up" delay={0.18} className="relative w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/90 shadow-xl">
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
                <h3 className="text-xl sm:text-3xl font-black text-white">
                  {currentRender.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  {currentRender.description}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Thumbnail Selector Pills Centrados */}
          <ScrollReveal direction="up" delay={0.25} className="flex items-center justify-center gap-2 mt-4 overflow-x-auto pb-1">
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
        </div>
      </section>

      {/* 5. FACILIDADES DE ADQUISICIÓN DIRECTA EN MIRAVALLE (ESTÁNDAR KINDEV: CERO BOX-IN-BOX) */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="space-y-10 sm:space-y-14">
          {/* Header con jerarquía expresiva y micro-indicador (sin etiqueta superior) */}
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
            <ScrollReveal direction="down" delay={0.12}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight [text-wrap:balance]">
                Planes Flexibles en <span className="text-emerald-700">Ciudadela Miravalle</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.18}>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Facilidades de pago directo con la promotora para terrenos desde <span className="font-bold text-slate-900">180 m² hasta 320 m²</span>.
              </p>
            </ScrollReveal>
          </div>

          {/* Grid de planes: Tarjetas con diseño idéntico a Sección Nosotros alternando verdes y naranjas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {/* Card 1: Verde Suave Corporativo */}
            <ScrollReveal direction="left" delay={0.06}>
              <motion.div
                whileHover={{ y: -6 }}
                className="p-6 sm:p-7 rounded-[2rem] bg-[#eaf8ee] border border-[#22A33D]/25 text-[#113d22] flex flex-col justify-between min-h-[250px] sm:min-h-[270px] relative overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl group"
              >
                <div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-2 text-[#113d22]">
                    Sin Buró Crediticio
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                    Aprobación directa con la promotora en 24h, sin trámites bancarios ni garantes.
                  </p>
                </div>

                <div className="flex items-end justify-between mt-6 pt-2">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#113d22] text-white hover:bg-[#22A33D] flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm">
                    <ArrowUpRight className="w-5 h-5 stroke-[2.4] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <ShieldCheck className="w-12 h-12 sm:w-14 sm:h-14 stroke-[1.4] text-[#22A33D]/80 transition-transform duration-500 group-hover:scale-110" />
                </div>
              </motion.div>
            </ScrollReveal>

            {/* Card 2: Naranja Intenso Corporativo */}
            <ScrollReveal direction="up" delay={0.12}>
              <motion.div
                whileHover={{ y: -6 }}
                className="p-6 sm:p-7 rounded-[2rem] bg-gradient-to-br from-[#F58220] via-[#ea580c] to-[#d94e08] text-white flex flex-col justify-between min-h-[250px] sm:min-h-[270px] relative overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl group"
              >
                <div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-2 text-white">
                    Hasta 48 Meses
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-orange-100">
                    Cuotas mensuales fijas en dólares sin variaciones ni intereses sorpresa.
                  </p>
                </div>

                <div className="flex items-end justify-between mt-6 pt-2">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm">
                    <ArrowUpRight className="w-5 h-5 stroke-[2.4] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <DollarSign className="w-12 h-12 sm:w-14 sm:h-14 stroke-[1.4] text-white/80 transition-transform duration-500 group-hover:scale-110" />
                </div>
              </motion.div>
            </ScrollReveal>

            {/* Card 3: Verde Profundo Corporativo */}
            <ScrollReveal direction="up" delay={0.18}>
              <motion.div
                whileHover={{ y: -6 }}
                className="p-6 sm:p-7 rounded-[2rem] bg-gradient-to-br from-[#113d22] via-[#164929] to-[#22A33D] text-white flex flex-col justify-between min-h-[250px] sm:min-h-[270px] relative overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl group"
              >
                <div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-2 text-white">
                    Certeza Notarial
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
                    Minuta notariada desde el primer abono y linderos georreferenciados en obra.
                  </p>
                </div>

                <div className="flex items-end justify-between mt-6 pt-2">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm">
                    <ArrowUpRight className="w-5 h-5 stroke-[2.4] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <FileCheck2 className="w-12 h-12 sm:w-14 sm:h-14 stroke-[1.4] text-[#5be196] transition-transform duration-500 group-hover:scale-110" />
                </div>
              </motion.div>
            </ScrollReveal>

            {/* Card 4: Naranja Cálido Crema */}
            <ScrollReveal direction="right" delay={0.24}>
              <motion.div
                whileHover={{ y: -6 }}
                className="p-6 sm:p-7 rounded-[2rem] bg-gradient-to-br from-[#fffaf5] to-[#fff3e6] border border-orange-200/90 text-slate-900 flex flex-col justify-between min-h-[250px] sm:min-h-[270px] relative overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl group"
              >
                <div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-2 text-slate-900">
                    Bono de Contado
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                    Descuento preferencial inmediato del 10% y escrituración prioritaria.
                  </p>
                </div>

                <div className="flex items-end justify-between mt-6 pt-2">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#F58220] text-white hover:bg-[#ea580c] flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm">
                    <ArrowUpRight className="w-5 h-5 stroke-[2.4] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <Sparkles className="w-12 h-12 sm:w-14 sm:h-14 stroke-[1.4] text-[#F58220] transition-transform duration-500 group-hover:scale-110" />
                </div>
              </motion.div>
            </ScrollReveal>
          </div>

          {/* Bloque CTA ergonómico */}
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
          </ScrollReveal>
        </div>
      </section>

      {/* 6. VIP RECORRIDO EN VEHÍCULO CORPORATIVO CTA (With Photographic Landscape Background) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-0">
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
