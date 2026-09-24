'use client';

import React, { useState, useId } from 'react';
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
} from 'lucide-react';
import { useProperties } from '@/src/context/PropertyContext';
import type { LotProperty } from '@/src/data/lots';
import { PropertyCard } from '../PropertyCard';
import { WaveDarkToCream } from '../WaveDividers';

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

  const [searchQuery, setSearchQuery] = useState(
    initialLocation && initialLocation !== 'Todas' ? initialLocation : ''
  );
  const [selectedType, setSelectedType] = useState<string>(
    initialType && initialType !== 'Todos' ? initialType : 'Todos'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice || 120000);
  const [minArea, setMinArea] = useState<number>(0);

  // Toggle for Advanced Filter Drawer
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const maxPriceInputId = useId();
  const minAreaInputId = useId();

  const propertyTypes = [
    { label: 'Todos', value: 'Todos', icon: Layers },
    { label: 'Lotes de Terreno', value: 'Lote de Terreno', icon: MapPin },
    { label: 'Villas & Casas', value: 'Vivienda', icon: Home },
    { label: 'En Planos', value: 'Proyecto en Planos', icon: Tag },
  ];

  const categories = ['Todos', 'Residencial', 'Esquinero', 'Comercial', 'Campestre'];

  const statusOptions = [
    { label: 'Todos', value: 'Todos', dotColor: 'bg-slate-400' },
    { label: 'Disponibles', value: 'Disponible', dotColor: 'bg-[#25D366]' },
    { label: 'En Reserva', value: 'En Reserva', dotColor: 'bg-amber-400' },
    { label: 'Vendidos', value: 'Vendido', dotColor: 'bg-slate-300' },
  ];

  const pricePresets = [
    { label: 'Cualquiera', value: 120000 },
    { label: 'Hasta $25k', value: 25000 },
    { label: 'Hasta $35k', value: 35000 },
    { label: 'Hasta $50k', value: 50000 },
    { label: 'Hasta $80k', value: 80000 },
  ];

  const areaPresets = [
    { label: 'Cualquiera', value: 0 },
    { label: '120+ m²', value: 120 },
    { label: '180+ m²', value: 180 },
    { label: '250+ m²', value: 250 },
    { label: '350+ m²', value: 350 },
  ];

  const filteredLots = properties.filter((lot) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      lot.code.toLowerCase().includes(q) ||
      lot.name.toLowerCase().includes(q) ||
      lot.zone.toLowerCase().includes(q) ||
      lot.topography.toLowerCase().includes(q) ||
      lot.project.toLowerCase().includes(q);

    const matchesType = selectedType === 'Todos' || lot.type === selectedType;
    const matchesCategory = selectedCategory === 'Todos' || lot.category === selectedCategory;
    const matchesStatus = selectedStatus === 'Todos' || lot.status === selectedStatus;
    const matchesPrice = lot.priceUSD <= maxPrice;
    const matchesArea = lot.areaM2 >= minArea;

    return matchesSearch && matchesType && matchesCategory && matchesStatus && matchesPrice && matchesArea;
  });

  // Calculate count of active advanced filters
  const advancedActiveCount =
    (selectedCategory !== 'Todos' ? 1 : 0) +
    (selectedStatus !== 'Todos' ? 1 : 0) +
    (maxPrice < 120000 ? 1 : 0) +
    (minArea > 0 ? 1 : 0);

  const hasAnyFilterActive =
    searchQuery.trim().length > 0 ||
    selectedType !== 'Todos' ||
    selectedCategory !== 'Todos' ||
    selectedStatus !== 'Todos' ||
    maxPrice < 120000 ||
    minArea > 0;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('Todos');
    setSelectedCategory('Todos');
    setSelectedStatus('Todos');
    setMaxPrice(120000);
    setMinArea(0);
  };

  return (
    <div className="w-full overflow-hidden bg-slate-950">
      {/* =========================================================================
          1. CINEMATIC FULL-WIDTH HERO BANNER
          ========================================================================= */}
      <section className="relative w-full min-h-[500px] md:min-h-[580px] lg:min-h-[640px] flex flex-col justify-between overflow-hidden bg-slate-950 text-white">
        {/* Cinematic Background with Slow Ken Burns Zoom Effect */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2160&q=90"
            alt="Catálogo Inmobiliario MGM Inmobiliaria"
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
          <div className="max-w-4xl space-y-5">
            {/* Glassmorphic Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
              <Sparkles className="h-4 w-4 text-[#25D366] shrink-0" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#25D366]">
                Catálogo Oficial · Sociedad Civil MGM Inmobiliaria
              </span>
            </div>

            {/* High-Impact Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] [text-wrap:balance]">
              Lotes urbanizados y proyectos con{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 font-serif italic font-normal">
                escrituras inmediatas.
              </span>
            </h1>

            {/* Narrative Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl leading-relaxed drop-shadow-sm">
              Propiedades legalizadas con vías concluidas, alcantarillado, acometidas soterradas y crédito directo de hasta 48 meses. Elige tu terreno y agenda tu visita guiada en obra.
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#25D366]" />
                <span className="font-bold text-white">{properties.length} Propiedades</span> en inventario
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>100% Sin intermediación bancaria</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span>Escritura notarial legal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Wave to Cream Section */}
        <WaveDarkToCream fillColor="#FAF7F2" />
      </section>

      {/* =========================================================================
          2. WARM CREAM SECTION: "FILTRO MODERNO & CATÁLOGO DE PROPIEDADES"
          ========================================================================= */}
      <section className="relative w-full bg-[#FAF7F2] text-slate-900 py-10 sm:py-16 overflow-hidden">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* =====================================================================
              REFINED LUXURY FILTER PANEL (KINDEV SIGNATURE - ZERO BOX-IN-BOX)
              ===================================================================== */}
          <div className="space-y-4">
            
            {/* Segmented Top Type Tabs (Apple-style sleek control) */}
            <div className="flex justify-start sm:justify-start overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="inline-flex p-1.5 rounded-full bg-slate-900/5 backdrop-blur-md border border-slate-900/10 shadow-inner">
                {propertyTypes.map((t) => {
                  const Icon = t.icon;
                  const isActive = selectedType === t.value;
                  return (
                    <button
                      key={t.value}
                      onClick={() => setSelectedType(t.value)}
                      className={`relative px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                        isActive
                          ? 'bg-slate-950 text-white shadow-md'
                          : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? 'text-[#25D366]' : 'text-slate-400'}`} />
                      <span>{t.label}</span>
                      {isActive && (
                        <span className="ml-1 text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-white/20 text-white">
                          {filteredLots.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Interactive Filter Bar: Search + Status Chips + Filter Trigger */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-full border border-slate-200/90 p-2 sm:p-2.5 shadow-lg shadow-slate-200/50 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              
              {/* Search Input Field */}
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por lote (MV-102), sector, metraje..."
                  className="w-full bg-transparent pl-11 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
                    title="Borrar búsqueda"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Status Quick Chips (Inline Desktop) */}
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 border-x border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                  Estado:
                </span>
                {statusOptions.map((st) => {
                  const isStActive = selectedStatus === st.value;
                  return (
                    <button
                      key={st.value}
                      onClick={() => setSelectedStatus(st.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isStActive
                          ? 'bg-emerald-50 text-emerald-950 border border-emerald-300 font-bold shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${st.dotColor}`} />
                      <span>{st.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Advanced Filter Toggle & Reset Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className={`flex-1 sm:flex-none px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 ${
                    showAdvanced || advancedActiveCount > 0
                      ? 'bg-emerald-700 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Filtros</span>
                  {advancedActiveCount > 0 && (
                    <span className="h-5 w-5 rounded-full bg-white text-emerald-900 font-mono text-[10px] font-black flex items-center justify-center">
                      {advancedActiveCount}
                    </span>
                  )}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      showAdvanced ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Reset Quick Button (If filters are active) */}
                {hasAnyFilterActive && (
                  <button
                    onClick={resetFilters}
                    title="Restablecer todos los filtros"
                    className="px-3 py-2.5 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all flex items-center justify-center gap-1 shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Limpiar</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Quick Status Rail (< lg) */}
            <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                Estado:
              </span>
              {statusOptions.map((st) => {
                const isStActive = selectedStatus === st.value;
                return (
                  <button
                    key={st.value}
                    onClick={() => setSelectedStatus(st.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      isStActive
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'bg-white/90 text-slate-700 border border-slate-200/80 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${st.dotColor}`} />
                    <span>{st.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Collapsible Advanced Filters Tray (Smooth Animation) */}
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                      
                      {/* Control 1: Category Selector */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                          <Tag className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Categoría del Predio</span>
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {categories.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setSelectedCategory(cat)}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                                selectedCategory === cat
                                  ? 'bg-slate-950 text-white font-bold shadow-xs'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Control 2: Maximum Price Slider & Presets */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label htmlFor={maxPriceInputId} className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Presupuesto Máximo</span>
                          </label>
                          <span className="font-mono text-sm font-black text-emerald-800">
                            ${maxPrice.toLocaleString()} USD
                          </span>
                        </div>

                        <input
                          id={maxPriceInputId}
                          type="range"
                          min={20000}
                          max={120000}
                          step={2500}
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        />

                        {/* Quick Presets */}
                        <div className="flex flex-wrap gap-1.5">
                          {pricePresets.map((p) => (
                            <button
                              key={p.label}
                              onClick={() => setMaxPrice(p.value)}
                              className={`px-2.5 py-1 text-[11px] rounded-full transition-all cursor-pointer font-medium ${
                                maxPrice === p.value
                                  ? 'bg-emerald-600 text-white font-bold'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Control 3: Minimum Area Slider & Presets */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label htmlFor={minAreaInputId} className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                            <Maximize2 className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Área Mínima de Terreno</span>
                          </label>
                          <span className="font-mono text-sm font-black text-emerald-800">
                            {minArea > 0 ? `${minArea} m²` : 'Cualquiera'}
                          </span>
                        </div>

                        <input
                          id={minAreaInputId}
                          type="range"
                          min={0}
                          max={500}
                          step={20}
                          value={minArea}
                          onChange={(e) => setMinArea(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                        />

                        {/* Quick Presets */}
                        <div className="flex flex-wrap gap-1.5">
                          {areaPresets.map((a) => (
                            <button
                              key={a.label}
                              onClick={() => setMinArea(a.value)}
                              className={`px-2.5 py-1 text-[11px] rounded-full transition-all cursor-pointer font-medium ${
                                minArea === a.value
                                  ? 'bg-emerald-600 text-white font-bold'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {a.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Mobile Status Filter (visible on small screens where header chips are hidden) */}
                    <div className="lg:hidden pt-4 border-t border-slate-100 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                        Estado de Disponibilidad
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {statusOptions.map((st) => (
                          <button
                            key={st.value}
                            onClick={() => setSelectedStatus(st.value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                              selectedStatus === st.value
                                ? 'bg-slate-950 text-white font-bold shadow-xs'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span className={`h-2 w-2 rounded-full ${st.dotColor}`} />
                            <span>{st.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Drawer Actions */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">
                        Ajusta los filtros para refinar tu búsqueda en tiempo real
                      </span>
                      <button
                        onClick={resetFilters}
                        className="text-rose-600 hover:text-rose-700 font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Restablecer Todo</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Count & Active Tag Chips */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#25D366]" />
                <span>
                  Mostrando <strong className="text-slate-950 font-bold">{filteredLots.length}</strong> de{' '}
                  {properties.length} propiedades disponibles
                </span>
              </div>

              {/* Removable Active Tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedType !== 'Todos' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[11px] font-semibold">
                    Tipo: {selectedType}
                    <button
                      onClick={() => setSelectedType('Todos')}
                      className="hover:text-rose-600 cursor-pointer ml-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {selectedCategory !== 'Todos' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[11px] font-semibold">
                    Categoría: {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory('Todos')}
                      className="hover:text-rose-600 cursor-pointer ml-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {selectedStatus !== 'Todos' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[11px] font-semibold">
                    Estado: {selectedStatus}
                    <button
                      onClick={() => setSelectedStatus('Todos')}
                      className="hover:text-rose-600 cursor-pointer ml-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {maxPrice < 120000 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-semibold">
                    Máx: ${maxPrice.toLocaleString()}
                    <button
                      onClick={() => setMaxPrice(120000)}
                      className="hover:text-rose-600 cursor-pointer ml-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}

                {minArea > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 text-[11px] font-semibold">
                    Área ≥ {minArea} m²
                    <button
                      onClick={() => setMinArea(0)}
                      className="hover:text-rose-600 cursor-pointer ml-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* =====================================================================
              PROPERTIES GRID OR CLEAN EMPTY STATE
              ===================================================================== */}
          {filteredLots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredLots.map((lot) => (
                <PropertyCard
                  key={lot.id}
                  lot={lot}
                  dark={false}
                  onSelectLot={onSelectLot}
                  onOpenVisitModal={onOpenVisitModal}
                />
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
                  Prueba ampliando el presupuesto, seleccionando &ldquo;Todos&rdquo; o borrando la búsqueda.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-950 text-white font-bold text-xs hover:bg-emerald-700 transition-all cursor-pointer shadow-md active:scale-95"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Restablecer Todos los Filtros</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
