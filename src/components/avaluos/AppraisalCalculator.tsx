'use client';

import React, { useState, useId, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calculator,
  Home,
  LandPlot,
  Building2,
  Store,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';
import { useSiteSettings } from '@/src/lib/siteSettings';
import { WhatsAppIcon } from '../SocialIcons';

// Tipos de propiedades disponibles
const PROPERTY_CATEGORIES = [
  { id: 'terreno', label: 'Terreno', icon: LandPlot, defaultLand: 300, defaultConst: 0 },
  { id: 'casa', label: 'Casa / Villa', icon: Home, defaultLand: 200, defaultConst: 160 },
  { id: 'departamento', label: 'Departamento', icon: Building2, defaultLand: 0, defaultConst: 95 },
  { id: 'comercial', label: 'Local Comercial', icon: Store, defaultLand: 150, defaultConst: 120 },
];

// Zonas y valores base referenciales en el Austro ecuatoriano ($/m²)
const ZONES_DATA = [
  { id: 'cuenca_urbana', label: 'Cuenca (Zona Urbana)', landBase: 240, factor: 1.15, extraTravel: 0 },
  { id: 'cuenca_periurbana', label: 'Cuenca Periferia (Challuabamba, Ricaurte)', landBase: 150, factor: 1.05, extraTravel: 0 },
  { id: 'paute_gualaceo', label: 'Paute / Gualaceo / Chordeleg', landBase: 95, factor: 0.95, extraTravel: 25 },
  { id: 'yunguilla', label: 'Valle de Yunguilla / Santa Isabel', landBase: 55, factor: 0.90, extraTravel: 35 },
  { id: 'azogues', label: 'Azogues / Cañar', landBase: 110, factor: 1.0, extraTravel: 20 },
  { id: 'otros', label: 'Otros Cantones / Zona Rural', landBase: 40, factor: 0.85, extraTravel: 40 },
];

// Calidades de acabados ($/m² de construcción)
const FINISH_QUALITIES = [
  { id: 'economico', label: 'Económico', costM2: 340, desc: 'Acabados básicos' },
  { id: 'estandar', label: 'Estándar', costM2: 460, desc: 'Porcelanato, funcional' },
  { id: 'primera', label: 'Primera / Lujo', costM2: 680, desc: 'Granito, automatización' },
];

// Antigüedad y depreciación
const AGE_OPTIONS = [
  { id: 'nuevo', label: '0 a 2 años (A estrenar)', factor: 1.0 },
  { id: 'reciente', label: '3 a 6 años', factor: 0.93 },
  { id: 'intermedio', label: '7 a 15 años', factor: 0.82 },
  { id: 'antiguo', label: '15+ años (Mantenida)', factor: 0.68 },
];

export function AppraisalCalculator() {
  const { settings } = useSiteSettings();
  const inputPrefix = useId();

  // Modo: 'property' (valor de mercado) | 'fee' (honorarios de avalúo)
  const [activeTab, setActiveTab] = useState<'property' | 'fee'>('property');

  // Parámetros de simulación
  const [category, setCategory] = useState('casa');
  const [zoneId, setZoneId] = useState('cuenca_urbana');
  const [landArea, setLandArea] = useState<number>(200);
  const [constArea, setConstArea] = useState<number>(150);
  const [finishQuality, setFinishQuality] = useState('estandar');
  const [ageId, setAgeId] = useState('nuevo');

  // Factores adicionales
  const [hasFullServices, setHasFullServices] = useState(true);
  const [hasPavedRoad, setHasPavedRoad] = useState(true);
  const [isFlatTerrain, setIsFlatTerrain] = useState(true);

  // Parámetros de honorario
  const [manualPropertyValue, setManualPropertyValue] = useState<number>(120000);
  const [appraisalPurpose, setAppraisalPurpose] = useState('Crédito Hipotecario (BIESS / Bancos / Cooperativas)');

  const handleSelectCategory = (catId: string) => {
    setCategory(catId);
    const cat = PROPERTY_CATEGORIES.find((c) => c.id === catId);
    if (cat) {
      setLandArea(cat.defaultLand);
      setConstArea(cat.defaultConst);
    }
  };

  const selectedZone = ZONES_DATA.find((z) => z.id === zoneId) || ZONES_DATA[0];
  const selectedFinish = FINISH_QUALITIES.find((f) => f.id === finishQuality) || FINISH_QUALITIES[1];
  const selectedAge = AGE_OPTIONS.find((a) => a.id === ageId) || AGE_OPTIONS[0];

  let landMultiplier = selectedZone.factor;
  if (hasFullServices) landMultiplier += 0.04;
  if (hasPavedRoad) landMultiplier += 0.03;
  if (isFlatTerrain) landMultiplier += 0.03;

  const effectiveLandArea = category === 'departamento' ? 0 : Math.max(0, landArea);
  const landUnitPrice = Math.round(selectedZone.landBase * landMultiplier);
  const estimatedLandValue = Math.round(effectiveLandArea * landUnitPrice);

  const effectiveConstArea = category === 'terreno' ? 0 : Math.max(0, constArea);
  const constUnitPrice = Math.round(selectedFinish.costM2 * selectedAge.factor);
  const estimatedConstValue = Math.round(effectiveConstArea * constUnitPrice);

  const totalEstimatedValue = estimatedLandValue + estimatedConstValue;
  const rangeMin = Math.round(totalEstimatedValue * 0.93);
  const rangeMax = Math.round(totalEstimatedValue * 1.07);

  const valueForFee = activeTab === 'property' ? totalEstimatedValue : manualPropertyValue;

  const calculateAppraisalFee = (val: number, travelExtra: number) => {
    let baseFee = 120;
    if (val <= 50000) {
      baseFee = 120;
    } else if (val <= 100000) {
      baseFee = 160;
    } else if (val <= 200000) {
      baseFee = 220;
    } else if (val <= 350000) {
      baseFee = 290;
    } else if (val <= 600000) {
      baseFee = 380;
    } else {
      baseFee = Math.round(380 + (val - 600000) * 0.0004);
    }
    return {
      min: baseFee + travelExtra,
      max: Math.round((baseFee + travelExtra) * 1.25),
    };
  };

  const appraisalFee = calculateAppraisalFee(valueForFee, selectedZone.extraTravel);

  const formatUSD = (val: number) =>
    new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  const handleReset = () => {
    handleSelectCategory('casa');
    setZoneId('cuenca_urbana');
    setFinishQuality('estandar');
    setAgeId('nuevo');
    setHasFullServices(true);
    setHasPavedRoad(true);
    setIsFlatTerrain(true);
  };

  const handleSendToWhatsApp = () => {
    const cleanPhone = settings.supportPhone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('593')
      ? cleanPhone
      : cleanPhone.startsWith('0')
      ? `593${cleanPhone.substring(1)}`
      : `593${cleanPhone}`;

    const catName = PROPERTY_CATEGORIES.find((c) => c.id === category)?.label || category;

    const messageLines = [
      `*SOLICITUD DE AVALÚO TÉCNICO OFICIAL — MGM INMOBILIARIA*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📊 *Resultado de la Calculadora de Avalúos:*`,
      `🏛 *Tipo:* ${catName}`,
      `📍 *Ubicación:* ${selectedZone.label}`,
      effectiveLandArea > 0 ? `📐 *Terreno:* ${effectiveLandArea} m²` : null,
      effectiveConstArea > 0 ? `🏗 *Construcción:* ${effectiveConstArea} m²` : null,
      effectiveConstArea > 0 ? `✨ *Acabados:* ${selectedFinish.label}` : null,
      effectiveConstArea > 0 ? `⏳ *Antigüedad:* ${selectedAge.label}` : null,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `💰 *Valor Comercial Referencial:* ${formatUSD(totalEstimatedValue)}`,
      `📈 *Rango Estimado:* ${formatUSD(rangeMin)} - ${formatUSD(rangeMax)}`,
      `📋 *Honorario Estimado de Peritaje:* ${formatUSD(appraisalFee.min)} - ${formatUSD(appraisalFee.max)} USD`,
      `🎯 *Finalidad requerida:* ${appraisalPurpose}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Hola MGM Inmobiliaria, he calculado mi inmueble en su web y requiero la visita técnica pericial oficial. ¿Qué fecha tienen disponible?`,
    ].filter(Boolean);

    const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(messageLines.join('\n'))}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Estado de apertura de dropdowns personalizados
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-custom-dropdown]')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div id="cotizador-avaluos" className="w-full flex-1 flex flex-col justify-start">
      {/* Barra Superior Minimalista sin cajas */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/60 shrink-0">
        <div className="flex items-center gap-3">
          <div className="py-1 pr-2 text-[#F58220]">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
              Calculadora de Avalúos
            </h1>
            <p className="text-xs text-slate-500 font-medium hidden sm:block mt-1">
              Valuación referencial de mercado y honorarios periciales en el Austro
            </p>
          </div>
        </div>

        {/* Selector de Pestañas: Botones fantasma sin box, contorno solo en hover/active */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('property')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
              activeTab === 'property'
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Valor Comercial</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fee')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
              activeTab === 'fee'
                ? 'border-[#F58220] text-orange-900 bg-orange-50/50'
                : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4 text-[#F58220]" />
            <span>Honorario Pericial</span>
          </button>
        </div>
      </div>

      {/* Cuerpo Principal de la Calculadora: Dividido de izq a der por una sola línea vertical limpia */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start relative">
        
        {/* Panel Izquierdo: Formulario con inputs y selectores estéticos con línea vertical divisoria a la derecha */}
        <div className="lg:col-span-7 space-y-6 lg:pr-10 lg:border-r lg:border-slate-200/80">
          {activeTab === 'property' ? (
            <div className="space-y-6">
              {/* 1. Categoría de Inmueble: Botones planos, contorno solo al pasar por encima o activo */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">1. Tipo de Inmueble</span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-slate-400 hover:text-emerald-700 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restablecer</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {PROPERTY_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectCategory(cat.id)}
                        className={`p-3 rounded-2xl text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                          isSelected
                            ? 'border-emerald-600 text-emerald-950 font-black shadow-xs bg-emerald-50/40'
                            : 'border-transparent hover:border-slate-300 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-[#113d22]' : 'text-slate-400'}`} />
                        <span className="text-xs font-semibold leading-none">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Ubicación: Selector con solo línea inferior y menú desplegable flotante con fade down */}
              <div className="relative" data-custom-dropdown>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  2. Sector / Cantón
                </label>
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'zone' ? null : 'zone')}
                  className="w-full flex items-center justify-between py-2.5 border-b-2 border-slate-300 hover:border-emerald-600 focus:border-emerald-600 transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm sm:text-base font-bold text-slate-900">
                      {selectedZone.label}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      (~${selectedZone.landBase}/m² base)
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openDropdown === 'zone' ? 'rotate-180 text-emerald-600' : 'group-hover:text-slate-700'}`} />
                </button>

                {/* Menú flotante redondeado con efecto fade down */}
                <AnimatePresence>
                  {openDropdown === 'zone' && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 4, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute left-0 right-0 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 mt-1 max-h-64 overflow-y-auto"
                    >
                      {ZONES_DATA.map((z) => (
                        <button
                          key={z.id}
                          type="button"
                          onClick={() => {
                            setZoneId(z.id);
                            setOpenDropdown(null);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm flex items-center justify-between transition-colors ${
                            zoneId === z.id
                              ? 'bg-emerald-50 text-emerald-900 font-bold'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span>{z.label}</span>
                          <span className="text-xs text-slate-400 font-medium">~${z.landBase}/m²</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. Dimensiones: Inputs con solo línea inferior */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {category !== 'departamento' && (
                  <div>
                    <label htmlFor={`${inputPrefix}-landArea`} className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Área Terreno (m²)
                    </label>
                    <div className="flex items-center gap-2 border-b-2 border-slate-300 focus-within:border-emerald-600 transition-colors py-1">
                      <LandPlot className="w-4 h-4 text-emerald-700 shrink-0" />
                      <input
                        id={`${inputPrefix}-landArea`}
                        type="number"
                        min="0"
                        value={landArea || ''}
                        onChange={(e) => setLandArea(Number(e.target.value) || 0)}
                        className="w-full bg-transparent text-slate-900 text-base sm:text-lg font-black focus:outline-hidden"
                        placeholder="Ej: 300"
                      />
                      <span className="text-xs font-bold text-slate-400 shrink-0">m²</span>
                    </div>
                  </div>
                )}

                {category !== 'terreno' && (
                  <div className={category === 'departamento' ? 'sm:col-span-2' : ''}>
                    <label htmlFor={`${inputPrefix}-constArea`} className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Área Construcción (m²)
                    </label>
                    <div className="flex items-center gap-2 border-b-2 border-slate-300 focus-within:border-emerald-600 transition-colors py-1">
                      <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <input
                        id={`${inputPrefix}-constArea`}
                        type="number"
                        min="0"
                        value={constArea || ''}
                        onChange={(e) => setConstArea(Number(e.target.value) || 0)}
                        className="w-full bg-transparent text-slate-900 text-base sm:text-lg font-black focus:outline-hidden"
                        placeholder="Ej: 160"
                      />
                      <span className="text-xs font-bold text-slate-400 shrink-0">m²</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Acabados y Antigüedad: Selectores flotantes redondeados con fade down */}
              {category !== 'terreno' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Selector Acabados */}
                  <div className="relative" data-custom-dropdown>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Nivel de Acabados
                    </label>
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === 'finish' ? null : 'finish')}
                      className="w-full flex items-center justify-between py-2.5 border-b-2 border-slate-300 hover:border-emerald-600 focus:border-emerald-600 transition-colors cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-bold text-slate-900">
                          {selectedFinish.label}
                        </span>
                        <span className="text-xs text-slate-400">
                          (~${selectedFinish.costM2}/m²)
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openDropdown === 'finish' ? 'rotate-180 text-emerald-600' : 'group-hover:text-slate-700'}`} />
                    </button>

                    <AnimatePresence>
                      {openDropdown === 'finish' && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 4, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.98 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="absolute left-0 right-0 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 mt-1 max-h-64 overflow-y-auto"
                        >
                          {FINISH_QUALITIES.map((q) => (
                            <button
                              key={q.id}
                              type="button"
                              onClick={() => {
                                setFinishQuality(q.id);
                                setOpenDropdown(null);
                              }}
                              className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm flex items-center justify-between transition-colors ${
                                finishQuality === q.id
                                  ? 'bg-emerald-50 text-emerald-900 font-bold'
                                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                              }`}
                            >
                              <div>
                                <span className="block font-bold">{q.label}</span>
                                <span className="text-[11px] text-slate-400">{q.desc}</span>
                              </div>
                              <span className="text-xs font-semibold text-slate-500">~${q.costM2}/m²</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Selector Antigüedad */}
                  <div className="relative" data-custom-dropdown>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Antigüedad Edificación
                    </label>
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === 'age' ? null : 'age')}
                      className="w-full flex items-center justify-between py-2.5 border-b-2 border-slate-300 hover:border-emerald-600 focus:border-emerald-600 transition-colors cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#F58220]" />
                        <span className="text-sm font-bold text-slate-900">
                          {selectedAge.label}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openDropdown === 'age' ? 'rotate-180 text-emerald-600' : 'group-hover:text-slate-700'}`} />
                    </button>

                    <AnimatePresence>
                      {openDropdown === 'age' && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 4, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.98 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="absolute left-0 sm:left-auto right-0 sm:min-w-[280px] z-50 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 mt-1 max-h-64 overflow-y-auto"
                        >
                          {AGE_OPTIONS.map((a) => (
                            <button
                              key={a.id}
                              type="button"
                              onClick={() => {
                                setAgeId(a.id);
                                setOpenDropdown(null);
                              }}
                              className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm transition-colors ${
                                ageId === a.id
                                  ? 'bg-emerald-50 text-emerald-900 font-bold'
                                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                              }`}
                            >
                              {a.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* 5. Factores del Terreno: Botones fantasma sin box */}
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Equipamiento & Entorno
                </span>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  {[
                    { label: 'Servicios Básicos', checked: hasFullServices, toggle: () => setHasFullServices(!hasFullServices) },
                    { label: 'Vía Pavimentada', checked: hasPavedRoad, toggle: () => setHasPavedRoad(!hasPavedRoad) },
                    { label: 'Topografía Plana', checked: isFlatTerrain, toggle: () => setIsFlatTerrain(!isFlatTerrain) },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={item.toggle}
                      className={`p-3 rounded-2xl text-center flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                        item.checked
                          ? 'border-emerald-600 text-emerald-950 font-bold bg-emerald-50/40'
                          : 'border-transparent hover:border-slate-300 text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${item.checked ? 'text-[#15803d]' : 'text-slate-300'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Modo 2: Cotizador Directo de Honorarios */
            <div className="space-y-6">
              <div>
                <label htmlFor={`${inputPrefix}-manualValue`} className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Valor Comercial de la Propiedad (USD)
                </label>
                <div className="flex items-center gap-2 border-b-2 border-slate-300 focus-within:border-emerald-600 transition-colors py-1">
                  <DollarSign className="w-5 h-5 text-emerald-600 shrink-0" />
                  <input
                    id={`${inputPrefix}-manualValue`}
                    type="number"
                    min="5000"
                    step="5000"
                    value={manualPropertyValue}
                    onChange={(e) => setManualPropertyValue(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full bg-transparent text-slate-900 text-xl sm:text-2xl font-black focus:outline-hidden"
                    placeholder="Ej: 120000"
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  {[65000, 110000, 180000, 260000].map((quickVal) => (
                    <button
                      key={quickVal}
                      type="button"
                      onClick={() => setManualPropertyValue(quickVal)}
                      className="text-xs px-3 py-1.5 rounded-xl border border-transparent hover:border-slate-300 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer transition-all"
                    >
                      ${quickVal / 1000}k
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector Finalidad con fade down */}
              <div className="relative" data-custom-dropdown>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Finalidad del Avalúo Pericial
                </label>
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'purpose' ? null : 'purpose')}
                  className="w-full flex items-center justify-between py-2.5 border-b-2 border-slate-300 hover:border-emerald-600 focus:border-emerald-600 transition-colors cursor-pointer text-left group"
                >
                  <span className="text-sm font-bold text-slate-900 truncate">
                    {appraisalPurpose}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${openDropdown === 'purpose' ? 'rotate-180 text-emerald-600' : 'group-hover:text-slate-700'}`} />
                </button>

                <AnimatePresence>
                  {openDropdown === 'purpose' && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 4, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute left-0 right-0 z-30 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 mt-1 overflow-hidden"
                    >
                      {[
                        'Crédito Hipotecario (BIESS / Bancos / Cooperativas)',
                        'Compraventa Comercial (Fijar precio justo)',
                        'Trámite Notarial / Partición de Herencia',
                        'Valoración Tributaria o Catastral',
                        'Peritaje Judicial o Litigio Civil',
                      ].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setAppraisalPurpose(item);
                            setOpenDropdown(null);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm transition-colors ${
                            appraisalPurpose === item
                              ? 'bg-emerald-50 text-emerald-900 font-bold'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Selector Zona Inspección con fade down */}
              <div className="relative" data-custom-dropdown>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Lugar de la Inspección Técnica In-Situ
                </label>
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === 'feeZone' ? null : 'feeZone')}
                  className="w-full flex items-center justify-between py-2.5 border-b-2 border-slate-300 hover:border-emerald-600 focus:border-emerald-600 transition-colors cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-bold text-slate-900">
                      {selectedZone.label}
                    </span>
                    <span className="text-xs text-slate-400">
                      {selectedZone.extraTravel > 0 ? `(+ viático $${selectedZone.extraTravel})` : '(Área urbana)'}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openDropdown === 'feeZone' ? 'rotate-180 text-emerald-600' : 'group-hover:text-slate-700'}`} />
                </button>

                <AnimatePresence>
                  {openDropdown === 'feeZone' && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 4, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute left-0 right-0 z-30 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 mt-1 overflow-hidden"
                    >
                      {ZONES_DATA.map((z) => (
                        <button
                          key={z.id}
                          type="button"
                          onClick={() => {
                            setZoneId(z.id);
                            setOpenDropdown(null);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm flex items-center justify-between transition-colors ${
                            zoneId === z.id
                              ? 'bg-emerald-50 text-emerald-900 font-bold'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span>{z.label}</span>
                          <span className="text-xs text-slate-400">
                            {z.extraTravel > 0 ? `+$${z.extraTravel}` : 'Urbano'}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-2 flex items-center gap-2 text-xs text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Informe pericial con firma acreditada para bancos, juzgados y notarías.</span>
              </div>
            </div>
          )}
        </div>

        {/* Panel Derecho: Resultados Abiertos sin boxes pesados */}
        <div className="lg:col-span-5 space-y-6 pt-2 lg:pt-0">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="font-black text-xs tracking-wider text-slate-900 uppercase">
                  Resultado en Tiempo Real
                </span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full text-emerald-800 bg-emerald-50 border border-emerald-200">
                Calculado
              </span>
            </div>

            {/* Resultado Principal */}
            {activeTab === 'property' && (
              <div className="space-y-3 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Valor Comercial Referencial
                </span>
                <div className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  {formatUSD(totalEstimatedValue)}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <span>Rango estimado de mercado:</span>
                  <strong className="text-slate-800 font-bold">
                    {formatUSD(rangeMin)} — {formatUSD(rangeMax)}
                  </strong>
                </div>

                {/* Subtotales en líneas minimalistas */}
                <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
                  {effectiveLandArea > 0 && (
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <LandPlot className="w-3.5 h-3.5 text-emerald-600" />
                        Terreno ({effectiveLandArea} m²):
                      </span>
                      <span className="font-bold text-slate-900">{formatUSD(estimatedLandValue)}</span>
                    </div>
                  )}
                  {effectiveConstArea > 0 && (
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#F58220]" />
                        Construcción ({effectiveConstArea} m²):
                      </span>
                      <span className="font-bold text-slate-900">{formatUSD(estimatedConstValue)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Honorario Pericial Oficial en líneas abiertas */}
            <div className="py-4 border-y border-slate-200 space-y-2 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#F58220]" />
                  Honorario Pericial Oficial:
                </span>
                <span className="font-black text-[#F58220] text-lg sm:text-xl">
                  {formatUSD(appraisalFee.min)} - {formatUSD(appraisalFee.max)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  Plazo de entrega pericial:
                </span>
                <span className="font-semibold text-slate-800">48 a 72 horas</span>
              </div>
            </div>

            <div className="text-xs text-slate-400 flex items-start gap-1.5 mb-6 leading-relaxed">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Cálculo estadístico referencial. El informe pericial con fe pública definitiva se emite tras la visita técnica in-situ.
              </span>
            </div>
          </div>

          {/* Botón WhatsApp: botón limpio con borde en hover */}
          <div>
            <button
              type="button"
              onClick={handleSendToWhatsApp}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <WhatsAppIcon size={20} className="text-white" />
              <span>Agendar Avalúo Oficial con estos Datos</span>
            </button>
            <p className="text-center text-xs text-slate-400 mt-2 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Conexión directa por WhatsApp con perito calificado</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
