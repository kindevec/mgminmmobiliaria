'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ShieldCheck,
  FileCheck,
  CreditCard,
  Building,
  HardHat,
  HandCoins,
  Award,
  Star,
  ChevronRight,
  ChevronLeft,
  KeyRound,
  Headphones,
  Users,
  Grid,
  SlidersHorizontal,
  Ruler,
  MapPin,
} from 'lucide-react';
import type { PageView } from '../Header';
import {
  AMENITIES_MIRAVALLE,
  TESTIMONIALS_DATA,
  getGeneralWhatsAppUrl,
  getLotWhatsAppUrl,
  type LotProperty,
} from '@/src/data/lots';
import { useProperties } from '@/src/context/PropertyContext';
import { PropertyCard } from '../PropertyCard';
import { NatureContainerCard } from '../NatureContainerCard';
import { WhatsAppIcon } from '../SocialIcons';
import { TopographicContours } from '../WaveDividers';
import { ScrollReveal } from '../common/ScrollReveal';
import { AnimatedInsignia } from '../common/AnimatedInsignia';

interface HomeViewProps {
  onNavigate: (page: PageView) => void;
  onOpenVisitModal: (defaultInterest?: string) => void;
  onSelectLot: (lot: LotProperty) => void;
  onFilterSearch?: (location: string, type: string, maxPrice: number) => void;
}

// 4 Pilares del Banner (provenientes de los contenedores: solo ícono y título)
const HERO_CONTAINER_FEATURES = [
  {
    title: 'Certeza Notarial',
    icon: ShieldCheck,
  },
  {
    title: 'Obras Civiles',
    icon: Building,
  },
  {
    title: 'Crédito Directo',
    icon: CreditCard,
  },
  {
    title: 'Asesoría 24/7',
    icon: Headphones,
  },
];

// Imágenes continuas de alta calidad relacionadas al sector inmobiliario para el carrusel
const HERO_REAL_ESTATE_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85',
    alt: 'Sala Contemporánea y Arquitectura de Vanguardia - Sociedad Civil MGM Inmobiliaria',
  },
  {
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
    alt: 'Residencia Moderna con Piscina y Áreas Verdes - MGM Inmobiliaria',
  },
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    alt: 'Fachada Residencial Contemporánea con Obras Civiles Concluidas',
  },
  {
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85',
    alt: 'Villa Exclusiva con Vistas Panorámicas y Terrazas Iluminadas',
  },
  {
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
    alt: 'Casas y Terrenos Residenciales con Servicios Básicos Garantizados',
  },
  {
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85',
    alt: 'Urbanización Planificada y Vialidad de Primer Orden',
  },
];

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
}: HomeViewProps) {
  const { properties } = useProperties();

  // Carousel 1: Pillars
  const [aboutIndex, setAboutIndex] = useState(0);


  // Carousel 3: Miravalle
  const [miravalleIndex, setMiravalleIndex] = useState(0);

  // Banner Continuous Real Estate Slideshow
  const [heroImgIndex, setHeroImgIndex] = useState(0);
  const [heroHovered, setHeroHovered] = useState(false);

  useEffect(() => {
    if (heroHovered) return;
    const interval = setInterval(() => {
      setHeroImgIndex((prev) => (prev + 1) % HERO_REAL_ESTATE_IMAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [heroHovered]);

  const nextHeroImage = () => {
    setHeroImgIndex((prev) => (prev + 1) % HERO_REAL_ESTATE_IMAGES.length);
  };

  const prevHeroImage = () => {
    setHeroImgIndex((prev) => (prev - 1 < 0 ? HERO_REAL_ESTATE_IMAGES.length - 1 : prev - 1));
  };

  const catalogScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkCatalogScroll = () => {
    if (catalogScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = catalogScrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollCatalog = (direction: 'left' | 'right') => {
    if (catalogScrollRef.current) {
      const scrollAmount = catalogScrollRef.current.clientWidth > 768 ? 400 : 320;
      catalogScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkCatalogScroll, 320);
    }
  };

  useEffect(() => {
    checkCatalogScroll();
  }, [properties]);

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

  return (
    <div className="w-full overflow-hidden bg-white text-slate-900">
      {/* =========================================================================
          1. BANNER CINEMÁTICO — PANORÁMICO INTEGRAL (SIN PARTICIONES VERTICALES)
          ========================================================================= */}
      <section className="relative w-full bg-[#113d22] text-white overflow-hidden min-h-[700px] sm:min-h-[780px] lg:min-h-[860px] flex items-center justify-center">
        {/* Fondo fotográfico panorámico continuo (100% de la pantalla) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden select-none"
          onMouseEnter={() => setHeroHovered(true)}
          onMouseLeave={() => setHeroHovered(false)}
        >
          {HERO_REAL_ESTATE_IMAGES.map((img, idx) => (
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

          {/* Flechas de navegación discretas a los costados para explorar las fotos */}
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
            {HERO_REAL_ESTATE_IMAGES.map((_, i) => (
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

        {/* Contenido Central: Título, Párrafo, Pilares y Acciones */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center items-center text-center pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 space-y-6 sm:space-y-8">
          {/* Insignia arquitectónica animada en SVG */}
          <AnimatedInsignia className="mb-0 sm:mb-1" size={76} />

          {/* Título Principal */}
          <ScrollReveal direction="down" delay={0.05} duration={0.7}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.06] tracking-tight [text-wrap:balance] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              Tierra Firme, Certeza Jurídica
              <br />
              <span className="text-[#5be196]">y Patrimonio </span>
              <span className="text-[#F58220]">de tu Familia</span>
            </h1>
          </ScrollReveal>

          {/* Párrafo Descriptivo */}
          <ScrollReveal direction="up" delay={0.15} duration={0.65}>
            <p className="text-base sm:text-lg lg:text-xl text-slate-100 leading-relaxed font-normal max-w-3xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
              Sociedad Civil MGM Inmobiliaria desarrolla comunidades residenciales con obras civiles concluidas, servicios básicos garantizados y crédito directo hasta 48 meses sin bancos ni buró de crédito.
            </p>
          </ScrollReveal>

          {/* 4 Pilares del Banner */}
          <ScrollReveal direction="up" delay={0.25} duration={0.65} className="w-full max-w-4xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full pt-2">
              {HERO_CONTAINER_FEATURES.map((item, idx) => {
                const Icon = item.icon;
                const isOrange = idx === 2; // Crédito Directo
                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 text-center sm:text-left p-3 sm:p-3.5 rounded-2xl bg-black/30 backdrop-blur-xs border border-white/10 transition-transform duration-200 hover:scale-105 shadow-sm"
                  >
                    <Icon className={`w-6 h-6 sm:w-7 sm:h-7 shrink-0 stroke-[2.2] ${isOrange ? 'text-[#F58220]' : 'text-[#5be196]'}`} />
                    <span className="text-xs sm:text-sm lg:text-base font-bold tracking-wide text-white leading-snug drop-shadow-xs">
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>

          {/* Botones de Acción Inmobiliaria */}
          <ScrollReveal direction="zoom" delay={0.35} duration={0.6}>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1 sm:pt-2">
              <button
                onClick={() => onNavigate('properties')}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-full bg-[#22A33D] hover:bg-[#1a8230] text-white font-bold text-sm sm:text-base tracking-wide transition-all shadow-lg hover:shadow-[#22A33D]/30 hover:scale-105 active:scale-95 cursor-pointer border border-[#5be196]/30"
              >
                <span>Explorar Proyectos</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </button>
              <button
                onClick={() => onOpenVisitModal()}
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-white/15 hover:bg-[#F58220] hover:border-[#F58220] text-white font-medium text-sm sm:text-base border border-white/30 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
              >
                <span>Agendar Visita</span>
              </button>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* =========================================================================
          2. SECCIÓN: PROYECTOS CONCLUIDOS & ARTE DEL URBANISMO (DISEÑO REFERENCIA)
          ========================================================================= */}
      <section className="relative w-full bg-[#f2f7f4] text-slate-900 py-20 sm:py-28 lg:py-32 overflow-hidden border-b border-slate-200/60">
        {/* Topographic Background SVG provided by user */}
        <svg
          viewBox="0 0 800 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06] text-[#113d22]"
        >
          <path d="M-50,200 C150,150 250,350 450,280 C650,210 750,420 900,380" stroke="currentColor" strokeWidth="1.2" />
          <path d="M-50,250 C160,200 270,400 470,330 C670,260 760,470 900,430" stroke="currentColor" strokeWidth="1.2" />
          <path d="M-50,300 C170,250 290,450 490,380 C690,310 770,520 900,480" stroke="currentColor" strokeWidth="1.2" />
          <path d="M-50,350 C180,300 310,500 510,430 C710,360 780,570 900,530" stroke="currentColor" strokeWidth="1.2" />
          <ellipse cx="620" cy="280" rx="180" ry="140" stroke="currentColor" strokeWidth="1.2" />
          <ellipse cx="620" cy="280" rx="220" ry="170" stroke="currentColor" strokeWidth="1.2" />
          <ellipse cx="620" cy="280" rx="260" ry="200" stroke="currentColor" strokeWidth="1.2" />
        </svg>

        <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          {/* Encabezado visible únicamente en móviles (< lg) */}
          <ScrollReveal direction="up" delay={0.1} className="lg:hidden text-center max-w-2xl mx-auto space-y-3 mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-[1.15] [text-wrap:balance]">
              Descubre la Solidez y <br />
              <span className="text-[#22A33D]">Urbanismo</span> a Través de Nuestros Proyectos
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Sociedad Civil MGM Inmobiliaria transforma predios estratégicos en ciudadelas residenciales planificadas con obras concluidas, servicios básicos garantizados y certeza jurídica notarial.
            </p>
          </ScrollReveal>

          {/* Grilla Arquitectónica de 3 Columnas: Mismo ancho en todas las tarjetas y boxes redondeados sin cortar la imagen */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Columna Izquierda: 1 Tarjeta Lateral a la altura de la palabra "Urbanismo" (Pilar 0) */}
            <ScrollReveal direction="left" delay={0.15} className="lg:col-span-3 flex justify-center lg:justify-end lg:mt-14 xl:mt-16 w-full">
              <div
                onClick={() => onNavigate('properties')}
                className="group relative w-full max-w-[280px] sm:max-w-[300px] h-[330px] sm:h-[360px] lg:h-[370px] xl:h-[390px] rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-slate-900 mx-auto lg:mx-0"
              >
                <Image
                  src={ABOUT_PILLARS[0].image}
                  alt={ABOUT_PILLARS[0].title}
                  fill
                  sizes="(max-width: 640px) 100vw, 300px"
                  className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-108"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent pointer-events-none" />
                {/* Box blanco redondeado con separación lateral ubicado más abajo en vertical con fuente más grande */}
                <div className="absolute bottom-1.5 sm:bottom-2 left-3 right-3 sm:left-3.5 sm:right-3.5 z-10 bg-white/95 backdrop-blur-md px-4 py-3 sm:py-3.5 rounded-2xl shadow-xl border border-white/80 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl text-center">
                  <h4 className="text-base sm:text-lg lg:text-xl font-black text-[#22A33D] leading-snug tracking-tight">
                    {ABOUT_PILLARS[0].title}
                  </h4>
                </div>
              </div>
            </ScrollReveal>

            {/* Columna Central: Título y Párrafo Arriba + 2 Tarjetas Abajo */}
            <div className="md:col-span-2 lg:col-span-6 flex flex-col items-center">
              {/* Título y Párrafo Centrado (visible en lg+) con Urbanismo alineado */}
              <ScrollReveal direction="down" delay={0.1} className="hidden lg:flex flex-col items-center text-center space-y-4 px-4 max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem] font-black text-slate-900 tracking-tight leading-[1.15] [text-wrap:balance]">
                  Descubre la Solidez y <br className="hidden lg:block" />
                  <span className="text-[#22A33D]">Urbanismo</span> a Través de <span className="text-[#F58220]">Nuestros Proyectos</span>
                </h2>
                <p className="text-base lg:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
                  Sociedad Civil MGM Inmobiliaria transforma predios estratégicos en ciudadelas residenciales planificadas con obras concluidas, servicios básicos garantizados y certeza jurídica notarial.
                </p>
              </ScrollReveal>

              {/* Sub-grilla de 2 Tarjetas Abajo del Texto (Con el mismo ancho de las laterales y separación del texto) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 justify-center max-w-2xl mx-auto w-full mt-10 sm:mt-12 lg:mt-16 xl:mt-20">
                {/* Pilar 1 */}
                <ScrollReveal direction="up" delay={0.15} className="flex justify-center">
                  <div
                    onClick={() => onNavigate('properties')}
                    className="group relative w-full max-w-[280px] sm:max-w-[300px] h-[280px] sm:h-[300px] lg:h-[310px] xl:h-[330px] rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-slate-900"
                  >
                    <Image
                      src={ABOUT_PILLARS[1].image}
                      alt={ABOUT_PILLARS[1].title}
                      fill
                      sizes="(max-width: 640px) 100vw, 300px"
                      className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-108"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent pointer-events-none" />
                    {/* Box blanco redondeado con separación lateral ubicado más abajo en vertical con fuente más grande */}
                    <div className="absolute bottom-1.5 sm:bottom-2 left-3 right-3 sm:left-3.5 sm:right-3.5 z-10 bg-white/95 backdrop-blur-md px-4 py-3 sm:py-3.5 rounded-2xl shadow-xl border border-white/80 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl text-center">
                      <h4 className="text-base sm:text-lg lg:text-xl font-black text-[#22A33D] leading-snug tracking-tight">
                        {ABOUT_PILLARS[1].title}
                      </h4>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Pilar 2 - Crédito Directo en Naranja MGM */}
                <ScrollReveal direction="up" delay={0.25} className="flex justify-center">
                  <div
                    onClick={() => onNavigate('properties')}
                    className="group relative w-full max-w-[280px] sm:max-w-[300px] h-[280px] sm:h-[300px] lg:h-[310px] xl:h-[320px] rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-slate-900"
                  >
                    <Image
                      src={ABOUT_PILLARS[2].image}
                      alt={ABOUT_PILLARS[2].title}
                      fill
                      sizes="(max-width: 640px) 100vw, 300px"
                      className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-108"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent pointer-events-none" />
                    {/* Box blanco redondeado con título en naranja corporativo */}
                    <div className="absolute bottom-1.5 sm:bottom-2 left-3 right-3 sm:left-3.5 sm:right-3.5 z-10 bg-white/95 backdrop-blur-md px-4 py-3 sm:py-3.5 rounded-2xl shadow-xl border border-white/80 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl text-center">
                      <h4 className="text-base sm:text-lg lg:text-xl font-black text-[#F58220] leading-snug tracking-tight">
                        {ABOUT_PILLARS[2].title}
                      </h4>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>

            {/* Columna Derecha: 1 Tarjeta Lateral a la altura de la palabra "Urbanismo" (Pilar 3) */}
            <ScrollReveal direction="right" delay={0.15} className="lg:col-span-3 flex justify-center lg:justify-start lg:mt-14 xl:mt-16 w-full">
              <div
                onClick={() => onNavigate('properties')}
                className="group relative w-full max-w-[280px] sm:max-w-[300px] h-[330px] sm:h-[360px] lg:h-[370px] xl:h-[390px] rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-slate-900 mx-auto lg:mx-0"
              >
                <Image
                  src={ABOUT_PILLARS[3].image}
                  alt={ABOUT_PILLARS[3].title}
                  fill
                  sizes="(max-width: 640px) 100vw, 300px"
                  className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-108"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent pointer-events-none" />
                {/* Box blanco redondeado con separación lateral ubicado más abajo en vertical con fuente más grande */}
                <div className="absolute bottom-1.5 sm:bottom-2 left-3 right-3 sm:left-3.5 sm:right-3.5 z-10 bg-white/95 backdrop-blur-md px-4 py-3 sm:py-3.5 rounded-2xl shadow-xl border border-white/80 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl text-center">
                  <h4 className="text-base sm:text-lg lg:text-xl font-black text-[#22A33D] leading-snug tracking-tight">
                    {ABOUT_PILLARS[3].title}
                  </h4>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. CATÁLOGO DE LOTES & VIVIENDAS — SLIDER ARQUITECTÓNICO FORMAL
          ========================================================================= */}
      <section className="relative w-full bg-[#fbfbfa] text-slate-900 py-16 sm:py-24 overflow-hidden border-b border-slate-100">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          
          {/* Encabezado: Título + Filtros por Pestañas + Controles de Navegación */}
          <ScrollReveal direction="left" delay={0.1} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#22A33D] block">
                INVENTARIO DISPONIBLE & EN ENTREGA
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Lotes y viviendas con{' '}
                <span className="font-serif italic font-normal text-[#F58220]">
                  crédito directo
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                Revisa disponibilidad en tiempo real, metrajes exactos y facilidades de pago directo hasta 48 meses.
              </p>
            </div>

            {/* Botón Ver Todo */}
            <button
              onClick={() => onNavigate('properties')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-[#113d22] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shadow-xs hover:shadow-md hover:scale-102 active:scale-98 shrink-0 self-start sm:self-end"
            >
              <span>Ver Todo ({properties.length})</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </ScrollReveal>

          {/* SLIDER HORIZONTAL CON BOTONES DE NAVEGACIÓN A LOS LADOS */}
          <ScrollReveal direction="up" delay={0.2} className="relative group/carousel">
            {/* Botón Lateral Izquierdo */}
            <button
              onClick={() => scrollCatalog('left')}
              disabled={!canScrollLeft}
              aria-label="Desplazar a la izquierda"
              className={`absolute -left-3 sm:-left-5 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-slate-200/90 flex items-center justify-center transition-all duration-200 shadow-xl backdrop-blur-md cursor-pointer ${
                canScrollLeft
                  ? 'bg-white/95 hover:bg-[#113d22] text-slate-800 hover:text-white hover:scale-110 active:scale-95'
                  : 'bg-white/50 text-slate-300 opacity-0 pointer-events-none'
              }`}
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.2]" />
            </button>

            {/* Botón Lateral Derecho */}
            <button
              onClick={() => scrollCatalog('right')}
              disabled={!canScrollRight}
              aria-label="Desplazar a la derecha"
              className={`absolute -right-3 sm:-right-5 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-slate-200/90 flex items-center justify-center transition-all duration-200 shadow-xl backdrop-blur-md cursor-pointer ${
                canScrollRight
                  ? 'bg-white/95 hover:bg-[#113d22] text-slate-800 hover:text-white hover:scale-110 active:scale-95'
                  : 'bg-white/50 text-slate-300 opacity-0 pointer-events-none'
              }`}
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 stroke-[2.2]" />
            </button>

            {/* Carrusel */}
            <div
              ref={catalogScrollRef}
              onScroll={checkCatalogScroll}
              className="flex gap-5 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-1 scrollbar-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {properties.map((lot) => (
                <div
                  key={lot.id}
                  className="min-w-[290px] sm:min-w-[330px] md:min-w-[350px] lg:min-w-[370px] max-w-[390px] snap-start shrink-0 bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group select-none"
                >
                  {/* Imagen y Badges */}
                  <div
                    onClick={() => onSelectLot(lot)}
                    className="relative w-full h-[220px] sm:h-[240px] overflow-hidden bg-slate-950 cursor-pointer"
                  >
                    <Image
                      src={lot.image}
                      alt={lot.name}
                      fill
                      sizes="(max-width: 640px) 300px, 400px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent pointer-events-none" />

                    {/* Badges superiores */}
                    <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
                      <span className="text-xs font-mono font-black text-white bg-slate-950/85 px-3 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-xs">
                        {lot.code}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide backdrop-blur-md shadow-xs ${
                          lot.status === 'Disponible'
                            ? 'bg-emerald-950/85 text-emerald-300 border border-emerald-500/30'
                            : lot.status === 'En Reserva'
                            ? 'bg-amber-950/85 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-900/85 text-slate-300 border border-white/20'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            lot.status === 'Disponible'
                              ? 'bg-[#25D366]'
                              : lot.status === 'En Reserva'
                              ? 'bg-amber-400'
                              : 'bg-slate-400'
                          }`}
                        />
                        {lot.status}
                      </span>
                    </div>

                    {/* Proyecto & Tipo */}
                    <div className="absolute bottom-3 left-3.5 right-3.5 z-10 flex items-center justify-between text-white text-[11px] font-medium drop-shadow-md">
                      <span className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                        <MapPin className="h-3 w-3 text-[#5be196]" />
                        {lot.project}
                      </span>
                      <span className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                        {lot.type}
                      </span>
                    </div>
                  </div>

                  {/* Cuerpo Formal con Especificaciones */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3
                        onClick={() => onSelectLot(lot)}
                        className="text-base sm:text-lg font-black text-slate-900 leading-snug tracking-tight group-hover:text-[#22A33D] transition-colors cursor-pointer line-clamp-1"
                        title={lot.name}
                      >
                        {lot.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1">
                        {lot.zone} · {lot.topography}
                      </p>

                      {/* Ficha métrica compacta */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                          <Ruler className="h-4 w-4 text-[#22A33D] shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Superficie</span>
                            <span className="text-xs font-bold text-slate-800 truncate block">{lot.areaM2} m²</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
                          <CreditCard className="h-4 w-4 text-[#F58220] shrink-0" />
                          <div className="min-w-0">
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Financiamiento</span>
                            <span className="text-xs font-bold text-slate-800 truncate block">Hasta {lot.maxMonths} meses</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Precios y Botones */}
                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Precio de Lista
                          </span>
                          <span className="text-xl font-black text-slate-900 font-mono tracking-tight">
                            ${lot.priceUSD.toLocaleString('es-EC')}
                            <span className="text-xs font-semibold text-slate-500 font-sans ml-1">USD</span>
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#22A33D] block">
                            Cuota Mensual
                          </span>
                          <span className="text-sm sm:text-base font-black text-[#22A33D] font-mono">
                            ${lot.estimatedMonthlyUSD}
                            <span className="text-xs font-semibold text-slate-500 font-sans">/mes</span>
                          </span>
                        </div>
                      </div>

                      {/* Botones de Acción */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => onSelectLot(lot)}
                          className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-[#113d22] text-white font-bold text-xs transition-all hover:scale-102 active:scale-95 cursor-pointer text-center shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <span>Ver Ficha</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>

                        <a
                          href={getLotWhatsAppUrl(lot.name, lot.code, lot.priceUSD)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs transition-all hover:scale-102 active:scale-95 cursor-pointer text-center shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <WhatsAppIcon size={14} className="text-white shrink-0" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* =========================================================================
          4. CARRUSEL 3: PROYECTO INSIGNIA CIUDADELA MIRAVALLE — DISEÑO CONTENEDOR
          ========================================================================= */}
      <section className="relative w-full bg-white text-slate-900 py-16 sm:py-24 overflow-hidden border-t border-slate-100">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header strip */}
          <ScrollReveal direction="right" delay={0.1} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Ciudadela Miravalle:{' '}
                <span className="font-serif italic font-normal text-[#22A33D]">
                  Infraestructura viva.
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-700 max-w-2xl leading-relaxed">
                Más de 300 lotes planificados, calzadas adoquinadas de alto tránsito, 8.000 m² de áreas deportivas y recreativas, y redes eléctricas soterradas.
              </p>
            </div>

            <button
              onClick={() => onNavigate('miravalle')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-950 hover:bg-[#22A33D] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-normal sm:whitespace-nowrap text-center shadow-md hover:scale-105 active:scale-95"
            >
              <span>Ver Masterplan Miravalle</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>
          </ScrollReveal>

          {/* Carrusel de Amenidades con Contenedor Imagen 2 */}
          <ScrollReveal direction="zoom" delay={0.2} className="relative">
            {/* Botón Lateral Izquierdo */}
            <button
              onClick={prevMiravalle}
              aria-label="Amenidad anterior"
              className="absolute -left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white hover:bg-[#22A33D] text-slate-800 hover:text-white shadow-xl border border-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
            </button>

            {/* Botón Lateral Derecho */}
            <button
              onClick={nextMiravalle}
              aria-label="Amenidad siguiente"
              className="absolute -right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white hover:bg-[#22A33D] text-slate-800 hover:text-white shadow-xl border border-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="h-6 w-6 stroke-[2.5]" />
            </button>

            {/* Slide de Amenidad Miravalle */}
            <AnimatePresence mode="wait">
              <motion.div
                key={miravalleIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <NatureContainerCard
                  image={AMENITIES_MIRAVALLE[miravalleIndex].image}
                  imageAlt={AMENITIES_MIRAVALLE[miravalleIndex].title}
                  badgeTopLeft={AMENITIES_MIRAVALLE[miravalleIndex].tag}
                  tagRight="Ciudadela Miravalle · Masterplan 🌿"
                  title={AMENITIES_MIRAVALLE[miravalleIndex].title}
                  description={AMENITIES_MIRAVALLE[miravalleIndex].description}
                  primaryButtonText="Agendar Recorrido en Obra"
                  onPrimaryClick={() => onOpenVisitModal('Recorrido Ciudadela Miravalle')}
                  secondaryLinkText="Ver Masterplan Miravalle"
                  onSecondaryClick={() => onNavigate('miravalle')}
                />
              </motion.div>
            </AnimatePresence>

            {/* Dots Indicators */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {AMENITIES_MIRAVALLE.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setMiravalleIndex(i)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    miravalleIndex === i ? 'w-8 bg-[#22A33D]' : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Ir a amenidad ${i + 1}`}
                />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          5. CARRUSEL 4: FAMILIAS PROPIETARIAS & TESTIMONIOS (Diseño Suave Crema)
          ========================================================================= */}
      <section className="relative w-full bg-[#fbfbfa] text-slate-900 py-16 sm:py-24 overflow-hidden border-t border-slate-100">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header strip */}
          <ScrollReveal direction="down" delay={0.1} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200">
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Confianza respaldada por{' '}
                <span className="font-serif italic font-normal text-[#22A33D]">
                  escrituras entregadas
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                Comunícate directamente con nuestro equipo directivo, revisa la documentación jurídica en notaría y conoce las experiencias de familias que ya construyen su patrimonio.
              </p>
            </div>

            <button
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-[#22A33D] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-normal sm:whitespace-nowrap text-center shadow-md hover:scale-105 active:scale-95"
            >
              <span>Canales de Contacto Directo</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>
          </ScrollReveal>

          {/* Grilla 2x2 de Testimonios Reales (Diseño Ribbon acorde a la Paleta MGM) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 sm:gap-y-16 mt-8">
            {TESTIMONIALS_DATA.slice(0, 4).map((item, idx) => (
              <ScrollReveal
                key={idx}
                direction={idx % 2 === 0 ? 'left' : 'right'}
                delay={0.1 + (idx * 0.08)}
              >
                <div
                  className="bg-[#f4f7ee] rounded-br-[2.5rem] rounded-tr-[2.5rem] rounded-bl-[2.5rem] rounded-tl-lg border border-[#dce3d2] shadow-xl relative mt-8 sm:mt-10 p-6 sm:p-8 pt-18 sm:pt-22 min-h-[220px] transition-all hover:shadow-2xl"
                >
                  {/* Ribbon Superior Verde MGM (#113d22 con detalles #5be196 y pliegue lateral) */}
                  <div className="absolute top-0 -left-3 sm:-left-4 bg-[#113d22] text-white py-3.5 sm:py-4 px-6 sm:px-8 rounded-tr-full rounded-br-full shadow-lg z-10 w-[90%] sm:w-[82%] border-y border-r border-[#22A33D]/30">
                    {/* Pliegue 3D lateral inferior */}
                    <div
                      className="absolute top-full left-0 w-3 sm:w-4 h-3 sm:h-4 bg-[#0a2313]"
                      style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
                    />
                    <h4 className="font-bold text-base sm:text-lg leading-tight line-clamp-1 text-white">
                      {item.name}
                    </h4>
                    <span className="text-xs sm:text-sm font-semibold text-[#5be196] line-clamp-1 block mt-0.5">
                      {item.role}
                    </span>
                  </div>

                  {/* Área de Contenido con borde lateral verde corporativo #22A33D */}
                  <div className="pl-4 border-l-2 border-[#22A33D] h-full flex flex-col justify-start space-y-2.5">
                    <div className="flex text-[#F58220] gap-1">
                      {[...Array(item.stars)].map((_, starIdx) => (
                        <Star key={starIdx} className="h-4 w-4 sm:h-5 sm:w-5 fill-[#F58220] text-[#F58220]" />
                      ))}
                    </div>
                    <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-serif italic">
                      &ldquo;{item.text}&rdquo;
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Quick Action Capsule to WhatsApp & Office */}
          <ScrollReveal direction="zoom" delay={0.15}>
            <div className="rounded-[2rem] bg-gradient-to-r from-[#eef8f0] via-[#fff7ed] to-slate-50 border border-[#22A33D]/25 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
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
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#22A33D] hover:bg-[#1a8230] text-white font-black text-xs sm:text-sm transition-all shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center"
                >
                  <WhatsAppIcon size={18} className="text-white shrink-0" />
                  <span>WhatsApp Oficial Inmediato</span>
                </a>

                <button
                  onClick={() => onOpenVisitModal('Agendamiento desde Inicio')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-slate-900 hover:bg-[#F58220] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md active:scale-95 text-center"
                >
                  <span>Agendar Cita en Oficina</span>
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
