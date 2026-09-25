'use client';

import React, { useState, useEffect, useId } from 'react';
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
    }, 2800);
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
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice || 120000);
  const [minArea, setMinArea] = useState<number>(0);

  // Mobile drawer filter toggle
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

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
    const matchesPrice = lot.priceUSD <= maxPrice;
    const matchesArea = lot.areaM2 >= minArea;

    return matchesSearch && matchesType && matchesCategory && matchesStatus && matchesPrice && matchesArea;
  });

  const hasAnyFilterActive =
    searchQuery.trim().length > 0 ||
    selectedTypes.length > 0 ||
    selectedCategories.length > 0 ||
    selectedStatuses.length > 0 ||
    maxPrice < 120000 ||
    minArea > 0;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTypes([]);
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setMaxPrice(120000);
    setMinArea(0);
  };

  const getTypeCount = (type: string) => properties.filter((p) => p.type === type).length;
  const getStatusCount = (status: string) => properties.filter((p) => p.status === status).length;
  const getCategoryCount = (category: string) => properties.filter((p) => p.category === category).length;

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

        {/* Contenido Central: Título y Párrafo */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center items-center text-center pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 space-y-6 sm:space-y-8">
          {/* Insignia arquitectónica animada en SVG */}
          <AnimatedInsignia className="mb-0 sm:mb-1" size={76} />

          <ScrollReveal direction="down" delay={0.05}>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#5be196] drop-shadow-xs">
              Catálogo Oficial de Propiedades
            </span>
          </ScrollReveal>

          <ScrollReveal direction="down" delay={0.15}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.08] tracking-tight [text-wrap:balance] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              Lotes urbanizados y proyectos con
              <br />
              <span className="text-[#5be196]">escrituras inmediatas</span>{' '}
              <span className="text-[#F58220]">&amp; crédito directo</span>.
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.25}>
            <p className="text-base sm:text-lg lg:text-xl text-slate-100 leading-relaxed font-normal max-w-3xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
              Propiedades legalizadas con vías concluidas, alcantarillado, acometidas soterradas y crédito directo de hasta 48 meses. Elige tu terreno y agenda tu visita guiada en obra.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          2. SECCIÓN: "FILTRO MODERNO & CATÁLOGO DE PROPIEDADES (Blanco Puro)"
          ========================================================================= */}
      <section className="relative w-full bg-white text-slate-900 py-10 sm:py-16 overflow-hidden">
        <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* BARRA SUPERIOR: SOLO BARRA DE BÚSQUEDA CON BOTÓN LIMPIAR */}
          <ScrollReveal direction="down" delay={0.1} className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-full border border-slate-200/90 p-2 sm:p-2.5 shadow-md flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por código de lote (ej: MV-102), sector, metraje..."
                className="w-full bg-transparent pl-11 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
                  title="Borrar texto"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-[#22A33D]" />
                <span>Filtros</span>
                {(selectedTypes.length + selectedStatuses.length + selectedCategories.length + (maxPrice < 120000 ? 1 : 0) + (minArea > 0 ? 1 : 0)) > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#22A33D] text-white text-[10px] font-bold flex items-center justify-center">
                    {selectedTypes.length + selectedStatuses.length + selectedCategories.length + (maxPrice < 120000 ? 1 : 0) + (minArea > 0 ? 1 : 0)}
                  </span>
                )}
              </button>

              {/* Botón Limpiar */}
              {hasAnyFilterActive && (
                <button
                  type="button"
                  onClick={resetFilters}
                  title="Limpiar todos los filtros"
                  className="px-4 sm:px-5 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs active:scale-95"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Limpiar</span>
                </button>
              )}
            </div>
          </ScrollReveal>

          {/* MAIN CONTAINER: SIDEBAR A LA IZQUIERDA + PROPIEDADES A LA DERECHA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
            
            {/* LADO IZQUIERDO: PANEL DE FILTROS SIN CONTENEDOR (DIRECTO SOBRE EL FONDO) */}
            <aside className={`lg:col-span-4 xl:col-span-3 space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
              <ScrollReveal direction="left" delay={0.15} className="space-y-6 sticky top-24 pr-1">
                
                {/* Header Opciones de Filtro con botón Limpiar idéntico al de la barra de búsqueda */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    Opciones de Filtro
                  </h3>
                  {hasAnyFilterActive && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      title="Limpiar todos los filtros"
                      className="px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs active:scale-95"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Limpiar</span>
                    </button>
                  )}
                </div>

                {/* 1. Por Categoría / Tipo */}
                <div className="space-y-3 pb-5 border-b border-slate-200/70">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Por Categoría
                  </h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Lotes de Terreno', value: 'Lote de Terreno' },
                      { label: 'Villas & Casas', value: 'Vivienda' },
                      { label: 'Proyectos en Planos', value: 'Proyecto en Planos' },
                    ].map((item) => {
                      const isChecked = selectedTypes.includes(item.value);
                      return (
                        <label
                          key={item.value}
                          onClick={() => toggleType(item.value)}
                          className="flex items-center gap-3 py-1 cursor-pointer group select-none"
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-[#22A33D] border-[#22A33D] text-white shadow-xs'
                              : 'border-slate-300 bg-white group-hover:border-slate-400'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className={`text-xs sm:text-sm transition-colors ${
                            isChecked ? 'font-bold text-slate-900' : 'text-slate-600 group-hover:text-slate-900'
                          }`}>
                            {item.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Disponibilidad */}
                <div className="space-y-3 pb-5 border-b border-slate-200/70">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Disponibilidad
                  </h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Disponibles', value: 'Disponible', dot: 'bg-[#25D366]' },
                      { label: 'En Reserva', value: 'En Reserva', dot: 'bg-amber-400' },
                      { label: 'Vendidos', value: 'Vendido', dot: 'bg-slate-300' },
                    ].map((item) => {
                      const isChecked = selectedStatuses.includes(item.value);
                      return (
                        <label
                          key={item.value}
                          onClick={() => toggleStatus(item.value)}
                          className="flex items-center gap-3 py-1 cursor-pointer group select-none"
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-[#22A33D] border-[#22A33D] text-white shadow-xs'
                              : 'border-slate-300 bg-white group-hover:border-slate-400'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-700">
                            <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                            <span className={isChecked ? 'font-bold text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}>
                              {item.label}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Precio */}
                <div className="space-y-3 pb-5 border-b border-slate-200/70">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Presupuesto Máximo
                    </h4>
                    <span className="font-mono text-xs font-bold text-[#F58220] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                      ${maxPrice.toLocaleString()} USD
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono flex justify-between">
                    <span>$20,000</span>
                    <span>$120,000</span>
                  </div>
                  <input
                    type="range"
                    min={20000}
                    max={120000}
                    step={2500}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#F58220]"
                  />
                </div>

                {/* 4. Categoría del Terreno */}
                <div className="space-y-3 pb-5 border-b border-slate-200/70">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Categoría del Terreno
                  </h4>
                  <div className="space-y-2">
                    {['Residencial', 'Esquinero', 'Comercial', 'Campestre'].map((cat) => {
                      const isChecked = selectedCategories.includes(cat);
                      return (
                        <label
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className="flex items-center gap-3 py-1 cursor-pointer group select-none"
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-[#22A33D] border-[#22A33D] text-white shadow-xs'
                              : 'border-slate-300 bg-white group-hover:border-slate-400'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className={`text-xs sm:text-sm transition-colors ${
                            isChecked ? 'font-bold text-slate-900' : 'text-slate-600 group-hover:text-slate-900'
                          }`}>
                            {cat}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Área Mínima de Terreno (m²) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Área Mínima
                    </h4>
                    <span className="font-mono text-xs font-bold text-[#22A33D]">
                      {minArea > 0 ? `${minArea} m²` : 'Cualquiera'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={500}
                    step={20}
                    value={minArea}
                    onChange={(e) => setMinArea(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#22A33D]"
                  />
                </div>
              </ScrollReveal>
            </aside>

            {/* LADO DERECHO: CONTADOR Y GRID DE PROPIEDADES */}
            <main className="lg:col-span-8 xl:col-span-9 space-y-6">
              
              {/* Results Count & Removable Active Chips */}
              <ScrollReveal direction="right" delay={0.1} className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 pb-1 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#22A33D]" />
                  <span>
                    Mostrando <strong className="text-slate-950 font-bold">{filteredLots.length}</strong> de{' '}
                    {properties.length} propiedades
                  </span>
                </div>

                {/* Removable chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedTypes.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-semibold">
                      Tipo: {t}
                      <button type="button" onClick={() => toggleType(t)} className="hover:text-rose-600 cursor-pointer ml-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedStatuses.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-semibold">
                      Estado: {s}
                      <button type="button" onClick={() => toggleStatus(s)} className="hover:text-rose-600 cursor-pointer ml-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {selectedCategories.map((c) => (
                    <span key={c} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-semibold">
                      Cat: {c}
                      <button type="button" onClick={() => toggleCategory(c)} className="hover:text-rose-600 cursor-pointer ml-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {maxPrice < 120000 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 text-[#ea580c] border border-orange-200 text-[11px] font-semibold">
                      ${maxPrice.toLocaleString()} USD
                      <button type="button" onClick={() => setMaxPrice(120000)} className="hover:text-rose-600 cursor-pointer ml-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {minArea > 0 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-[11px] font-semibold">
                      Área ≥ {minArea} m²
                      <button type="button" onClick={() => setMinArea(0)} className="hover:text-rose-600 cursor-pointer ml-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              </ScrollReveal>

              {/* Grid or Empty State - Tarjetas más anchas en 2 columnas */}
              {filteredLots.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-7 lg:gap-8">
                  {filteredLots.map((lot, idx) => (
                    <ScrollReveal
                      key={lot.id}
                      direction="up"
                      delay={(idx % 4) * 0.08}
                      duration={0.55}
                    >
                      <PropertyCard
                        lot={lot}
                        dark={false}
                        onSelectLot={onSelectLot}
                        onOpenVisitModal={onOpenVisitModal}
                      />
                    </ScrollReveal>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 p-8 shadow-sm max-w-xl mx-auto space-y-4">
                  <div className="h-16 w-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <Search className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900">
                      No hay propiedades con estos filtros
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                      Prueba desmarcando algunas opciones o borrando la búsqueda.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-950 text-white font-bold text-xs hover:bg-[#22A33D] transition-all cursor-pointer shadow-md active:scale-95"
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
