'use client';

import React, { useState, useEffect, useRef, useId } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
  X,
  Check,
  ChevronDown,
  Layers,
  MapPin,
  Home,
  Tag,
  DollarSign,
  Maximize2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useProperties } from '@/src/context/PropertyContext';
import type { LotProperty } from '@/src/data/lots';
import { PropertyCard } from '../PropertyCard';
import { ScrollReveal } from '../common/ScrollReveal';
import { AnimatedInsignia } from '../common/AnimatedInsignia';
import { HeroNavArrows } from '../HeroNavArrows';

const PROPERTIES_HERO_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85',
    alt: 'Terrenos y Topografía Urbanizada - MGM Inmobiliaria',
  },
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    alt: 'Lotes Residenciales con Obras Concluidas',
  },
  {
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
    alt: 'Comunidades Planificadas con Certeza Notarial',
  },
  {
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85',
    alt: 'Villas y Terrenos con Escrituras Individuales',
  },
];

interface PropertiesViewProps {
  onSelectLot: (lot: LotProperty) => void;
  onOpenVisitModal: (lotCode: string) => void;
  initialType?: string;
  initialLocation?: string;
  initialMaxPrice?: number;
}

interface MobileCarouselSectionProps {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeText: string;
  lots: LotProperty[];
  onSelectLot: (lot: LotProperty) => void;
  onOpenVisitModal: (lotCode: string) => void;
}

function MobileCarouselSection({
  title,
  subtitle,
  icon: Icon,
  badgeText,
  lots,
  onSelectLot,
  onOpenVisitModal,
}: MobileCarouselSectionProps) {
  if (lots.length === 0) return null;

  return (
    <div className="space-y-2.5 pt-1">
      <div className="flex items-center justify-between px-1">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#22A33D]">
            <Icon className="h-3.5 w-3.5 text-[#22A33D] shrink-0" />
            <span>{title}</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium leading-tight">{subtitle}</p>
        </div>
        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-full shrink-0">
          {badgeText}
        </span>
      </div>

      <div className="flex gap-3.5 overflow-x-auto pb-3 pt-1 -mx-2 px-2 snap-x snap-mandatory scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x">
        {lots.map((lot) => (
          <div key={lot.id} className="w-[84vw] sm:w-[350px] max-w-[370px] shrink-0 snap-start">
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
  );
}

export function PropertiesView({
  onSelectLot,
  onOpenVisitModal,
  initialType,
  initialLocation,
  initialMaxPrice,
}: PropertiesViewProps) {
  const { properties } = useProperties();

  // Banner Continuous Real Estate Slideshow
  const [heroImgIndex, setHeroImgIndex] = useState(0);
  const [heroHovered, setHeroHovered] = useState(false);

  useEffect(() => {
    if (heroHovered) return;
    const interval = setInterval(() => {
      setHeroImgIndex((prev) => (prev + 1) % PROPERTIES_HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroHovered]);

  const nextHeroImage = () => {
    setHeroImgIndex((prev) => (prev + 1) % PROPERTIES_HERO_IMAGES.length);
  };

  const prevHeroImage = () => {
    setHeroImgIndex((prev) => (prev - 1 < 0 ? PROPERTIES_HERO_IMAGES.length - 1 : prev - 1));
  };

  const [searchQuery, setSearchQuery] = useState(
    initialLocation && initialLocation !== 'Todas' ? initialLocation : ''
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>(
    initialType && initialType !== 'Todos' ? [initialType] : []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [mobilePage, setMobilePage] = useState<number>(1);
  const MOBILE_PAGE_SIZE = 5;
  const searchBarRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const catalogSectionRef = useRef<HTMLElement>(null);

  const scrollToSearchBar = () => {
    if (searchBarRef.current) {
      const yOffset = -75;
      const y = searchBarRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };



  useEffect(() => {
    setMobilePage(1);
  }, [searchQuery, selectedTypes, selectedCategories, selectedStatuses]);

  const toggleType = (val: string) => {
    setSelectedTypes((prev) =>
      prev.includes(val) ? prev.filter((t) => t !== val) : [...prev, val]
    );
  };

  const toggleStatus = (val: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]
    );
  };

  const toggleCategory = (val: string) => {
    setSelectedCategories((prev) =>
      prev.includes(val) ? prev.filter((c) => c !== val) : [...prev, val]
    );
  };

  const filteredLots = properties.filter((lot) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      lot.code.toLowerCase().includes(q) ||
      lot.name.toLowerCase().includes(q) ||
      lot.zone.toLowerCase().includes(q) ||
      lot.topography.toLowerCase().includes(q) ||
      lot.project.toLowerCase().includes(q);

    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(lot.type);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(lot.category);
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(lot.status);

    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  const totalMobilePages = Math.max(1, Math.ceil(filteredLots.length / MOBILE_PAGE_SIZE));

  const hasAnyFilterActive =
    searchQuery.trim().length > 0 ||
    selectedTypes.length > 0 ||
    selectedCategories.length > 0 ||
    selectedStatuses.length > 0;

  const activeFiltersCount =
    (searchQuery.trim().length > 0 ? 1 : 0) +
    (selectedTypes.length > 0 ? 1 : 0) +
    (selectedCategories.length > 0 ? 1 : 0) +
    (selectedStatuses.length > 0 ? 1 : 0);

  const villasLots = properties.filter((p) => p.type === 'Vivienda');
  const residentialLots = properties.filter(
    (p) => p.type === 'Lote de Terreno' && p.category === 'Residencial'
  );
  const cornerLots = properties.filter(
    (p) => p.category === 'Esquinero' || p.category === 'Campestre' || p.category === 'Comercial'
  );
  const directCreditLots = properties.filter(
    (p) => p.status === 'Disponible' && (p.priceUSD <= 38000 || p.type === 'Lote de Terreno')
  );

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTypes([]);
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setMobilePage(1);
  };

  const getTypeCount = (type: string) => properties.filter((p) => p.type === type).length;
  const getStatusCount = (status: string) => properties.filter((p) => p.status === status).length;
  const getCategoryCount = (category: string) => properties.filter((p) => p.category === category).length;

  return (
    <div className="w-full bg-white text-slate-900">
      {/* =========================================================================
          1. BANNER CINEMÁTICO — PANORÁMICO INTEGRAL (SIN PARTICIONES VERTICALES)
          ========================================================================= */}
      <section ref={heroRef} className="group/hero relative w-full bg-[#113d22] text-white overflow-hidden min-h-[500px] sm:min-h-[540px] lg:min-h-[580px] flex items-center justify-center select-none">
        {/* Fondo fotográfico panorámico continuo (100% de la pantalla) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden select-none"
          onMouseEnter={() => setHeroHovered(true)}
          onMouseLeave={() => setHeroHovered(false)}
        >
          {PROPERTIES_HERO_IMAGES.map((img, idx) => (
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
            {PROPERTIES_HERO_IMAGES.map((_, i) => (
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

        {/* Controles de navegación manual translúcidos con materialización al hover */}
        <HeroNavArrows onPrev={prevHeroImage} onNext={nextHeroImage} />

        {/* Contenido Central: Título y Párrafo */}
        <div className="relative z-10 max-w-4xl mx-auto px-8 sm:px-10 lg:px-8 w-full flex flex-col justify-center items-center text-center pt-24 sm:pt-28 lg:pt-32 pb-14 sm:pb-16 lg:pb-18 space-y-4 sm:space-y-6 select-text cursor-default">
          {/* Insignia arquitectónica animada en SVG */}
          <AnimatedInsignia className="mb-0 sm:mb-1" size={60} />

          <ScrollReveal direction="down" delay={0.05}>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#5be196] drop-shadow-xs">
              Catálogo Oficial de Propiedades
            </span>
          </ScrollReveal>

          <ScrollReveal direction="down" delay={0.15}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-tight [text-wrap:balance] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              Lotes urbanizados y proyectos con
              <br />
              <span className="text-[#5be196]">escrituras inmediatas</span>{' '}
              <span className="text-[#F58220]">&amp; crédito directo</span>.
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.25}>
            <p className="text-sm sm:text-base lg:text-lg text-slate-100 leading-relaxed font-normal max-w-3xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
              Propiedades legalizadas con vías concluidas, alcantarillado, acometidas soterradas y crédito directo de hasta 48 meses. Elige tu terreno y agenda tu visita guiada en obra.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          2. SECCIÓN: "FILTRO MODERNO & CATÁLOGO DE PROPIEDADES (Blanco Puro)"
          ========================================================================= */}
      <section className="relative w-full bg-white text-slate-900 pt-4 sm:pt-10 pb-6 sm:pb-8 overflow-hidden">
        <div className="relative z-10 mx-auto max-w-[1440px] px-1 sm:px-4 lg:px-8 space-y-3.5 sm:space-y-6">
          
          {/* BARRA SUPERIOR: SOLO BARRA DE BÚSQUEDA */}
          <div ref={searchBarRef} className="scroll-mt-20 sm:scroll-mt-24" />
          <ScrollReveal direction="down" delay={0.1} className="w-full">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-full border border-slate-200/90 p-1 sm:p-2.5 shadow-xs hover:shadow-md transition-shadow flex items-center gap-2 sm:gap-3">
              <div className="relative flex-1">
                <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por código (ej: MV-102), sector, metraje..."
                  className="w-full bg-transparent pl-8 sm:pl-11 pr-8 sm:pr-10 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
                    title="Borrar texto"
                  >
                    <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* =========================================================================
              VISTA MÓVIL (< lg): BARRA DE FILTROS HORIZONTAL + CARRUSELES POR CATEGORÍA
              - Cero box-in-box.
              - Cards ocupan todo el ancho (w-[84vw] en carrusel, w-full en filtrado).
              - Menú de filtros horizontal que despliega verticalmente.
              ========================================================================= */}
          <div className="block lg:hidden space-y-4 pt-1">
            {/* 1. Barra Horizontal de Filtros y Chips de 1 Toque */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 -mx-1 px-1">
              {/* Botón Principal de Filtros */}
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
                className={`shrink-0 h-9 px-3.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95 border ${
                  isMobileFiltersOpen || hasAnyFilterActive
                    ? 'bg-[#113d22] text-white border-[#22A33D]'
                    : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <SlidersHorizontal className={`h-3.5 w-3.5 ${hasAnyFilterActive ? 'text-[#5be196]' : 'text-[#22A33D]'}`} />
                <span>Filtros</span>
                {activeFiltersCount > 0 && (
                  <span className="w-4.5 h-4.5 rounded-full bg-[#F58220] text-white text-[10px] font-black flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${isMobileFiltersOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Chips Rápidos Horizontales */}
              <button
                type="button"
                onClick={resetFilters}
                className={`shrink-0 h-9 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  !hasAnyFilterActive
                    ? 'bg-[#22A33D] text-white border-[#22A33D] font-bold shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Todos ({properties.length})
              </button>

              <button
                type="button"
                onClick={() => toggleType('Lote de Terreno')}
                className={`shrink-0 h-9 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  selectedTypes.includes('Lote de Terreno')
                    ? 'bg-[#22A33D] text-white border-[#22A33D] font-bold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Lotes
              </button>

              <button
                type="button"
                onClick={() => toggleType('Vivienda')}
                className={`shrink-0 h-9 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  selectedTypes.includes('Vivienda')
                    ? 'bg-[#22A33D] text-white border-[#22A33D] font-bold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Villas MGM
              </button>

              <button
                type="button"
                onClick={() => toggleCategory('Esquinero')}
                className={`shrink-0 h-9 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  selectedCategories.includes('Esquinero')
                    ? 'bg-[#22A33D] text-white border-[#22A33D] font-bold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Esquineros
              </button>

              <button
                type="button"
                onClick={() => toggleStatus('Disponible')}
                className={`shrink-0 h-9 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
                  selectedStatuses.includes('Disponible')
                    ? 'bg-[#22A33D] text-white border-[#22A33D] font-bold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                <span>Disponibles</span>
              </button>

              {hasAnyFilterActive && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="shrink-0 h-9 px-3 rounded-full text-xs font-bold transition-all cursor-pointer bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Limpiar</span>
                </button>
              )}
            </div>

            {/* 2. Menú Desplegable Vertical de Filtros Completos (Limpio, sin box-in-box) */}
            <AnimatePresence>
              {isMobileFiltersOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 pb-4 space-y-4 border-y border-slate-200/90 bg-white">
                    {/* Fila 1: Tipo de Inmueble */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        Tipo de Inmueble
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { label: 'Lotes de Terreno', value: 'Lote de Terreno' },
                          { label: 'Villas & Casas', value: 'Vivienda' },
                          { label: 'Proyectos en Planos', value: 'Proyecto en Planos' },
                        ].map((item) => {
                          const isSelected = selectedTypes.includes(item.value);
                          return (
                            <button
                              key={item.value}
                              type="button"
                              onClick={() => toggleType(item.value)}
                              className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#22A33D] text-white font-bold shadow-xs'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Fila 2: Disponibilidad y Topografía */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                          Disponibilidad
                        </span>
                        <div className="flex flex-col gap-1.5">
                          {[
                            { label: 'Disponibles', value: 'Disponible', dot: 'bg-[#25D366]' },
                            { label: 'En Reserva', value: 'En Reserva', dot: 'bg-amber-400' },
                            { label: 'Vendidos', value: 'Vendido', dot: 'bg-slate-300' },
                          ].map((item) => {
                            const isSelected = selectedStatuses.includes(item.value);
                            return (
                              <button
                                key={item.value}
                                type="button"
                                onClick={() => toggleStatus(item.value)}
                                className={`py-1.5 px-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#22A33D] text-white font-bold shadow-xs'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                                <span className="truncate">{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                          Topografía / Tipo
                        </span>
                        <div className="flex flex-col gap-1.5">
                          {[
                            { label: 'Residencial', value: 'Residencial' },
                            { label: 'Esquinero', value: 'Esquinero' },
                            { label: 'Campestre', value: 'Campestre' },
                            { label: 'Comercial', value: 'Comercial' },
                          ].map((cat) => {
                            const isSelected = selectedCategories.includes(cat.value);
                            return (
                              <button
                                key={cat.value}
                                type="button"
                                onClick={() => toggleCategory(cat.value)}
                                className={`py-1.5 px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer truncate ${
                                  isSelected
                                    ? 'bg-[#22A33D] text-white font-bold shadow-xs'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                              >
                                {cat.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>



                    {/* Acciones */}
                    <div className="flex items-center gap-2 pt-2">
                      {hasAnyFilterActive && (
                        <button
                          type="button"
                          onClick={resetFilters}
                          className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Restablecer</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsMobileFiltersOpen(false)}
                        className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-[#113d22] text-white hover:bg-[#22A33D] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <span>Ver {filteredLots.length} propiedades</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 3. Contenido de Propiedades en Móvil */}
            {hasAnyFilterActive ? (
              /* Vista con Filtros Activos: Cards a ancho completo */
              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between text-xs text-slate-600 pb-1 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#22A33D]" />
                    <span>
                      <strong className="text-slate-900 font-bold">{filteredLots.length}</strong> de {properties.length} opciones
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-[#F58220] font-bold text-[11px] hover:underline cursor-pointer"
                  >
                    Ver por categorías
                  </button>
                </div>

                {filteredLots.length > 0 ? (
                  <div className="space-y-4">
                    {filteredLots.map((lot) => (
                      <div key={lot.id} className="w-full">
                        <PropertyCard
                          lot={lot}
                          dark={false}
                          onSelectLot={onSelectLot}
                          onOpenVisitModal={onOpenVisitModal}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
                    <Search className="h-8 w-8 mx-auto text-slate-400" />
                    <h3 className="text-base font-bold text-slate-900">No hay propiedades con estos filtros</h3>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="px-4 py-2 rounded-full bg-[#113d22] text-white text-xs font-bold"
                    >
                      Restablecer filtros
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Vista por Defecto: Varios Carruseles Horizontales por Categoría */
              <div className="space-y-7 pt-1">
                <MobileCarouselSection
                  title="Villas & Casas Terminadas"
                  subtitle="Viviendas listas para entrega con jardín privado y acabados premium"
                  icon={Home}
                  badgeText={`${villasLots.length} viviendas`}
                  lots={villasLots}
                  onSelectLot={onSelectLot}
                  onOpenVisitModal={onOpenVisitModal}
                />

                <MobileCarouselSection
                  title="Lotes Residenciales Centrales"
                  subtitle="Terrenos 100% planos con vías adoquinadas y obras concluidas"
                  icon={Layers}
                  badgeText={`${residentialLots.length} lotes`}
                  lots={residentialLots}
                  onSelectLot={onSelectLot}
                  onOpenVisitModal={onOpenVisitModal}
                />

                <MobileCarouselSection
                  title="Lotes Esquineros & Campestres"
                  subtitle="Doble frente, mayor superficie y vistas panorámicas a la naturaleza"
                  icon={MapPin}
                  badgeText={`${cornerLots.length} opciones`}
                  lots={cornerLots}
                  onSelectLot={onSelectLot}
                  onOpenVisitModal={onOpenVisitModal}
                />

                <MobileCarouselSection
                  title="Opciones con Crédito Directo MGM"
                  subtitle="Financiamiento ágil hasta 48 meses directamente con la urbanizadora"
                  icon={Sparkles}
                  badgeText={`${directCreditLots.length} lotes`}
                  lots={directCreditLots}
                  onSelectLot={onSelectLot}
                  onOpenVisitModal={onOpenVisitModal}
                />
              </div>
            )}
          </div>

          {/* MAIN CONTAINER: SIDEBAR A LA IZQUIERDA (SOLO DESKTOP lg+) + PROPIEDADES A LA DERECHA */}
          <div className="hidden lg:flex gap-7 items-start pt-1">
            
            {/* LADO IZQUIERDO: BARRA DE FILTROS EN PC */}
            <aside className="w-[250px] xl:w-[270px] shrink-0 sticky top-24 max-h-[calc(100vh-4.5rem)] overflow-y-auto scrollbar-thin space-y-5">
              <ScrollReveal direction="left" delay={0.15} className="space-y-3 sm:space-y-5 pr-0.5 sm:pr-1">
                
                {/* Header Opciones de Filtro */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 sm:pb-2.5 border-b border-slate-200/80">
                  <h3 className="text-xs sm:text-base font-bold text-slate-900 tracking-tight flex items-center justify-center sm:justify-start gap-1">
                    <SlidersHorizontal className="h-3 w-3 sm:h-4 sm:w-4 text-[#22A33D] shrink-0" />
                    <span>Filtros</span>
                  </h3>
                  {hasAnyFilterActive && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      title="Limpiar todos los filtros"
                      className="px-2 sm:px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 shrink-0 cursor-pointer shadow-2xs active:scale-95 w-full sm:w-auto"
                    >
                      <RotateCcw className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      <span>Limpiar</span>
                    </button>
                  )}
                </div>

                {/* 1. Por Categoría / Tipo */}
                <div className="space-y-1.5 sm:space-y-2.5 pb-2.5 sm:pb-4 border-b border-slate-200/70">
                  <h4 className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-800 text-center sm:text-left">
                    Categoría
                  </h4>
                  <div className="space-y-1 sm:space-y-1.5">
                    {[
                      { labelDesktop: 'Lotes de Terreno', labelMobile: 'Lotes', value: 'Lote de Terreno' },
                      { labelDesktop: 'Villas & Casas', labelMobile: 'Villas', value: 'Vivienda' },
                      { labelDesktop: 'Proyectos Planos', labelMobile: 'Planos', value: 'Proyecto en Planos' },
                    ].map((item) => {
                      const isChecked = selectedTypes.includes(item.value);
                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => toggleType(item.value)}
                          className={`w-full py-1.5 px-1.5 sm:px-2 rounded-lg text-[10px] sm:text-xs font-semibold transition-all text-center sm:text-left flex items-center justify-center sm:justify-start gap-1 sm:gap-2 cursor-pointer ${
                            isChecked
                              ? 'bg-[#22A33D] text-white shadow-xs font-bold'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 sm:border-transparent'
                          }`}
                        >
                          <div className={`hidden sm:flex w-3.5 h-3.5 rounded border items-center justify-center shrink-0 ${
                            isChecked ? 'bg-white text-[#22A33D] border-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span className="truncate">
                            <span className="hidden sm:inline">{item.labelDesktop}</span>
                            <span className="sm:hidden">{item.labelMobile}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Disponibilidad */}
                <div className="space-y-1.5 sm:space-y-2.5 pb-2.5 sm:pb-4 border-b border-slate-200/70">
                  <h4 className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-800 text-center sm:text-left">
                    Estado
                  </h4>
                  <div className="space-y-1 sm:space-y-1.5">
                    {[
                      { labelDesktop: 'Disponibles', labelMobile: 'Disponibles', value: 'Disponible', dot: 'bg-[#25D366]' },
                      { labelDesktop: 'En Reserva', labelMobile: 'Reserva', value: 'En Reserva', dot: 'bg-amber-400' },
                      { labelDesktop: 'Vendidos', labelMobile: 'Vendidos', value: 'Vendido', dot: 'bg-slate-300' },
                    ].map((item) => {
                      const isChecked = selectedStatuses.includes(item.value);
                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => toggleStatus(item.value)}
                          className={`w-full py-1.5 px-1.5 sm:px-2 rounded-lg text-[10px] sm:text-xs font-semibold transition-all text-center sm:text-left flex items-center justify-center sm:justify-start gap-1.5 cursor-pointer ${
                            isChecked
                              ? 'bg-[#22A33D] text-white shadow-xs font-bold'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 sm:border-transparent'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${item.dot}`} />
                          <span className="truncate">
                            <span className="hidden sm:inline">{item.labelDesktop}</span>
                            <span className="sm:hidden">{item.labelMobile}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Categoría del Terreno */}
                <div className="space-y-1.5 sm:space-y-2.5 pb-2.5 sm:pb-4 border-b border-slate-200/70">
                  <h4 className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-800 text-center sm:text-left">
                    Tipo
                  </h4>
                  <div className="space-y-1 sm:space-y-1.5">
                    {[
                      { labelDesktop: 'Residencial', labelMobile: 'Residencial', value: 'Residencial' },
                      { labelDesktop: 'Esquinero', labelMobile: 'Esquinero', value: 'Esquinero' },
                      { labelDesktop: 'Comercial', labelMobile: 'Comercial', value: 'Comercial' },
                      { labelDesktop: 'Campestre', labelMobile: 'Campestre', value: 'Campestre' },
                    ].map((cat) => {
                      const isChecked = selectedCategories.includes(cat.value);
                      return (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => toggleCategory(cat.value)}
                          className={`w-full py-1.5 px-1.5 sm:px-2 rounded-lg text-[10px] sm:text-xs font-semibold transition-all text-center sm:text-left flex items-center justify-center sm:justify-start gap-1 cursor-pointer ${
                            isChecked
                              ? 'bg-[#22A33D] text-white shadow-xs font-bold'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 sm:border-transparent'
                          }`}
                        >
                          <span className="truncate">
                            <span className="hidden sm:inline">{cat.labelDesktop}</span>
                            <span className="sm:hidden">{cat.labelMobile}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>
            </aside>

            {/* LADO DERECHO: CONTADOR Y GRID DE PROPIEDADES (2 POR FILA EN MÓVIL) */}
            <main className="flex-1 min-w-0 space-y-3 sm:space-y-5">
              
              {/* Results Count & Removable Active Chips */}
              <ScrollReveal direction="right" delay={0.1} className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-3 text-[10px] sm:text-xs text-slate-600 pb-1 border-b border-slate-100">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#22A33D]" />
                  <span>
                    <strong className="text-slate-950 font-bold">{filteredLots.length}</strong> de{' '}
                    {properties.length}
                  </span>
                </div>

                {/* Removable chips */}
                <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                  {selectedTypes.map((t) => (
                    <span key={t} className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[9px] sm:text-[11px] font-semibold">
                      {t}
                      <button type="button" onClick={() => toggleType(t)} className="hover:text-rose-600 cursor-pointer ml-0.5">
                        <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedStatuses.map((s) => (
                    <span key={s} className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[9px] sm:text-[11px] font-semibold">
                      {s}
                      <button type="button" onClick={() => toggleStatus(s)} className="hover:text-rose-600 cursor-pointer ml-0.5">
                        <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedCategories.map((c) => (
                    <span key={c} className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[9px] sm:text-[11px] font-semibold">
                      {c}
                      <button type="button" onClick={() => toggleCategory(c)} className="hover:text-rose-600 cursor-pointer ml-0.5">
                        <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </ScrollReveal>

              {/* Grid or Empty State - 3 POR FILA EN PC (AMPLIAS, SIN APRETAR) */}
              {filteredLots.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
                    {filteredLots.map((lot, idx) => {
                      const isVisibleOnMobile =
                        idx >= (mobilePage - 1) * MOBILE_PAGE_SIZE &&
                        idx < mobilePage * MOBILE_PAGE_SIZE;

                      return (
                        <ScrollReveal
                          key={lot.id}
                          direction="up"
                          delay={(idx % 3) * 0.08}
                          duration={0.45}
                          className={`w-full ${isVisibleOnMobile ? 'block' : 'hidden sm:block'}`}
                        >
                          <PropertyCard
                            lot={lot}
                            dark={false}
                            onSelectLot={onSelectLot}
                            onOpenVisitModal={onOpenVisitModal}
                          />
                        </ScrollReveal>
                      );
                    })}
                  </div>

                  {/* Flechas de navegación solo en móvil después de la 5ª tarjeta */}
                  {totalMobilePages > 1 && (
                    <div className="sm:hidden pt-3 pb-3 flex items-center justify-center gap-2.5 w-full">
                      <button
                        type="button"
                        onClick={() => {
                          setMobilePage((p) => Math.max(1, p - 1));
                          scrollToSearchBar();
                        }}
                        disabled={mobilePage === 1}
                        aria-label="Página anterior"
                        className="h-10 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-30 disabled:pointer-events-none disabled:shadow-none bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                      >
                        <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                        <span>Anterior</span>
                      </button>

                      <div className="flex items-center justify-center px-3.5 h-10 rounded-xl bg-slate-100 border border-slate-200/90 font-mono text-xs font-bold text-slate-800">
                        <span className="text-[#22A33D] font-black">{mobilePage}</span>
                        <span className="text-slate-400 mx-1">/</span>
                        <span>{totalMobilePages}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setMobilePage((p) => Math.min(totalMobilePages, p + 1));
                          scrollToSearchBar();
                        }}
                        disabled={mobilePage === totalMobilePages}
                        aria-label="Página siguiente"
                        className="h-10 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-30 disabled:pointer-events-none disabled:shadow-none bg-[#113d22] text-white hover:bg-[#F58220]"
                      >
                        <span>Siguiente</span>
                        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 sm:py-20 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm max-w-xl mx-auto space-y-4">
                  <div className="h-14 w-14 sm:h-16 sm:w-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <Search className="h-7 w-7 sm:h-8 sm:w-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      No hay propiedades con estos filtros
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                      Prueba desmarcando algunas opciones o borrando la búsqueda.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-slate-950 text-white font-bold text-xs hover:bg-[#22A33D] transition-all cursor-pointer shadow-md active:scale-95"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Restablecer Filtros</span>
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}
