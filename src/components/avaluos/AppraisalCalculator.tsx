'use client';

import React, { useState, useId } from 'react';
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

  return (
    <div id="cotizador-avaluos" className="w-full h-full max-h-full flex flex-col justify-between overflow-hidden">
      {/* Barra Superior Compacta */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2 sm:mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 text-[#113d22] flex items-center justify-center">
            <Calculator className="w-4 h-4 text-[#F58220]" />
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-none">
              Calculadora de Avalúos
            </h1>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block mt-0.5">
              Valuación referencial de mercado y honorarios periciales en el Austro
            </p>
          </div>
        </div>

        {/* Selector de Pestañas Compacto */}
        <div className="inline-flex p-1 bg-slate-200/90 rounded-xl border border-slate-300/80 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('property')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'property'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Valor Comercial</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fee')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'fee'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-[#F58220]" />
            <span>Honorario Pericial</span>
          </button>
        </div>
      </div>

      {/* Tarjeta Principal Dashboard (Ajustada al viewport) */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden flex flex-col lg:grid lg:grid-cols-12">
        
        {/* Panel Izquierdo: Formulario y Parámetros */}
        <div className="lg:col-span-7 p-3 sm:p-5 overflow-y-auto flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200">
          {activeTab === 'property' ? (
            <div className="space-y-3 sm:space-y-3.5">
              {/* 1. Categoría */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800">1. Tipo de Inmueble</span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-[11px] text-slate-400 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restablecer</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PROPERTY_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleSelectCategory(cat.id)}
                        className={`p-2 rounded-xl border text-center flex flex-row sm:flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 font-bold shadow-2xs ring-1 ring-emerald-500/20'
                            : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-[#113d22]' : 'text-slate-500'}`} />
                        <span className="text-xs leading-none">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Ubicación */}
              <div>
                <label htmlFor={`${inputPrefix}-zone`} className="block text-xs font-bold text-slate-800 mb-1">
                  2. Sector / Cantón
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <select
                    id={`${inputPrefix}-zone`}
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
                  >
                    {ZONES_DATA.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.label} (~${z.landBase}/m² base)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Dimensiones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {category !== 'departamento' && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor={`${inputPrefix}-landArea`} className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <LandPlot className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Área Terreno (m²)</span>
                      </label>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                        {landArea} m²
                      </span>
                    </div>
                    <input
                      id={`${inputPrefix}-landArea`}
                      type="number"
                      min="0"
                      value={landArea || ''}
                      onChange={(e) => setLandArea(Number(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs sm:text-sm font-semibold focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                      placeholder="Ej: 300"
                    />
                  </div>
                )}

                {category !== 'terreno' && (
                  <div className={category === 'departamento' ? 'sm:col-span-2' : ''}>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor={`${inputPrefix}-constArea`} className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Área Construcción (m²)</span>
                      </label>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                        {constArea} m²
                      </span>
                    </div>
                    <input
                      id={`${inputPrefix}-constArea`}
                      type="number"
                      min="0"
                      value={constArea || ''}
                      onChange={(e) => setConstArea(Number(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs sm:text-sm font-semibold focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                      placeholder="Ej: 160"
                    />
                  </div>
                )}
              </div>

              {/* 4. Acabados y Antigüedad */}
              {category !== 'terreno' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor={`${inputPrefix}-quality`} className="block text-xs font-bold text-slate-800 mb-1">
                      Nivel de Acabados
                    </label>
                    <select
                      id={`${inputPrefix}-quality`}
                      value={finishQuality}
                      onChange={(e) => setFinishQuality(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
                    >
                      {FINISH_QUALITIES.map((q) => (
                        <option key={q.id} value={q.id}>
                          {q.label} (~${q.costM2}/m²)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor={`${inputPrefix}-age`} className="block text-xs font-bold text-slate-800 mb-1">
                      Antigüedad Edificación
                    </label>
                    <select
                      id={`${inputPrefix}-age`}
                      value={ageId}
                      onChange={(e) => setAgeId(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
                    >
                      {AGE_OPTIONS.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* 5. Factores del Terreno */}
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Equipamiento & Entorno
                </span>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <label className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-200 bg-slate-50/70 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={hasFullServices}
                      onChange={(e) => setHasFullServices(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                    />
                    <span className="font-medium text-slate-700 truncate">Servicios</span>
                  </label>
                  <label className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-200 bg-slate-50/70 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={hasPavedRoad}
                      onChange={(e) => setHasPavedRoad(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                    />
                    <span className="font-medium text-slate-700 truncate">Vía asfalto</span>
                  </label>
                  <label className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-200 bg-slate-50/70 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isFlatTerrain}
                      onChange={(e) => setIsFlatTerrain(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                    />
                    <span className="font-medium text-slate-700 truncate">Topografía</span>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            /* Modo 2: Cotizador Directo de Honorarios */
            <div className="space-y-3.5">
              <div>
                <label htmlFor={`${inputPrefix}-manualValue`} className="block text-xs font-bold text-slate-800 mb-1">
                  Valor Comercial de la Propiedad (USD)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    id={`${inputPrefix}-manualValue`}
                    type="number"
                    min="5000"
                    step="5000"
                    value={manualPropertyValue}
                    onChange={(e) => setManualPropertyValue(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-base font-bold focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="Ej: 120000"
                  />
                </div>
                <div className="flex gap-1.5 mt-1.5">
                  {[65000, 110000, 180000, 260000].map((quickVal) => (
                    <button
                      key={quickVal}
                      type="button"
                      onClick={() => setManualPropertyValue(quickVal)}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
                    >
                      ${quickVal / 1000}k
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor={`${inputPrefix}-purpose`} className="block text-xs font-bold text-slate-800 mb-1">
                  Finalidad del Avalúo Pericial
                </label>
                <select
                  id={`${inputPrefix}-purpose`}
                  value={appraisalPurpose}
                  onChange={(e) => setAppraisalPurpose(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
                >
                  <option value="Crédito Hipotecario (BIESS / Bancos / Cooperativas)">Crédito Hipotecario (BIESS / Bancos / Cooperativas)</option>
                  <option value="Compraventa Comercial (Fijar precio justo)">Compraventa Comercial (Fijar precio justo)</option>
                  <option value="Trámite Notarial / Partición de Herencia">Trámite Notarial / Partición de Herencia</option>
                  <option value="Valoración Tributaria o Catastral">Valoración Tributaria o Catastral</option>
                  <option value="Peritaje Judicial o Litigio Civil">Peritaje Judicial o Litigio Civil</option>
                </select>
              </div>

              <div>
                <label htmlFor={`${inputPrefix}-feeZone`} className="block text-xs font-bold text-slate-800 mb-1">
                  Lugar de la Inspección Técnica In-Situ
                </label>
                <select
                  id={`${inputPrefix}-feeZone`}
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs sm:text-sm font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
                >
                  {ZONES_DATA.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.label} {z.extraTravel > 0 ? `(+ viático $${z.extraTravel})` : '(Área urbana)'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-[11px] text-emerald-950 space-y-1">
                <div className="font-bold flex items-center gap-1 text-emerald-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Acreditación Oficial de Peritaje</span>
                </div>
                <p className="text-emerald-800 leading-snug">
                  Informe pericial con firma autorizada para bancos, superintendencias, juzgados y notarías de todo el Ecuador.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Panel Derecho: Resultados en Tiempo Real y Acción */}
        <div className="lg:col-span-5 p-4 sm:p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#5be196]" />
                <span className="font-bold text-xs tracking-wider text-white uppercase">
                  Resultado
                </span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-white/10 text-emerald-300 border border-emerald-500/30">
                En vivo
              </span>
            </div>

            {/* Resultado Principal */}
            {activeTab === 'property' && (
              <div className="space-y-2 mb-3">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                  Valor Comercial Referencial
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[#5be196] tracking-tight">
                  {formatUSD(totalEstimatedValue)}
                </div>
                <div className="text-xs text-slate-300 flex items-center gap-1">
                  <span>Rango:</span>
                  <strong className="text-white font-semibold">
                    {formatUSD(rangeMin)} — {formatUSD(rangeMax)}
                  </strong>
                </div>

                {/* Subtotales */}
                <div className="bg-white/5 rounded-xl p-2.5 border border-white/10 space-y-1 text-xs mt-2">
                  {effectiveLandArea > 0 && (
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="flex items-center gap-1">
                        <LandPlot className="w-3 h-3 text-emerald-400" />
                        Terreno ({effectiveLandArea} m²):
                      </span>
                      <span className="font-bold text-white">{formatUSD(estimatedLandValue)}</span>
                    </div>
                  )}
                  {effectiveConstArea > 0 && (
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-[#F58220]" />
                        Construcción ({effectiveConstArea} m²):
                      </span>
                      <span className="font-bold text-white">{formatUSD(estimatedConstValue)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Costo del Peritaje Técnico */}
            <div className="bg-white/5 rounded-xl p-3 border border-white/10 space-y-2 mb-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <FileText className="w-3 h-3 text-[#F58220]" />
                  Honorario Pericial Oficial:
                </span>
                <span className="font-bold text-[#F58220] text-sm">
                  {formatUSD(appraisalFee.min)} - {formatUSD(appraisalFee.max)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-300 border-t border-white/10 pt-1.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  Plazo de entrega:
                </span>
                <span className="font-semibold text-white">48 a 72 horas</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 flex items-start gap-1 mb-3 leading-snug">
              <AlertCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Cálculo estadístico de mercado. El informe pericial con valor legal definitivo se emite tras la visita técnica in-situ.
              </span>
            </div>
          </div>

          {/* Botón WhatsApp */}
          <div>
            <button
              type="button"
              onClick={handleSendToWhatsApp}
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <WhatsAppIcon size={18} className="text-slate-950" />
              <span>Agendar Avalúo Oficial con estos Datos</span>
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-1.5 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Conexión directa por WhatsApp con perito acreditado</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
