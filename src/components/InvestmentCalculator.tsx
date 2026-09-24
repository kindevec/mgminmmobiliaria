'use client';

import React, { useState, useId } from 'react';
import { Calculator, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useProperties } from '@/src/context/PropertyContext';
import { getCustomQuoteWhatsAppUrl } from '@/src/data/lots';
import { WhatsAppIcon } from './SocialIcons';

export function InvestmentCalculator() {
  const { properties } = useProperties();
  const availableOrAll = properties.length > 0 ? properties : [];

  const [selectedLotCode, setSelectedLotCode] = useState(
    availableOrAll[0]?.code || 'MV-101'
  );
  const currentLot = availableOrAll.find((l) => l.code === selectedLotCode) || availableOrAll[0] || {
    code: 'MV-101',
    name: 'Lote Residencial Miravalle',
    priceUSD: 28500,
    areaM2: 200,
  };

  const [price, setPrice] = useState(currentLot.priceUSD);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [months, setMonths] = useState(36);

  const priceInputId = useId();
  const downPaymentInputId = useId();

  const handleLotChange = (code: string) => {
    setSelectedLotCode(code);
    const lot = availableOrAll.find((l) => l.code === code);
    if (lot) {
      setPrice(lot.priceUSD);
    }
  };

  const downPaymentAmount = Math.round((price * downPaymentPercent) / 100);
  const financedAmount = Math.max(0, price - downPaymentAmount);
  const monthlyQuota = months > 0 ? Math.round(financedAmount / months) : 0;

  const quoteWhatsAppUrl = getCustomQuoteWhatsAppUrl(
    currentLot.code,
    price,
    downPaymentAmount,
    months,
    monthlyQuota
  );

  return (
    <div className="w-full bg-white text-slate-900 rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200/90 shadow-xl relative overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="max-w-3xl mb-10 space-y-2 relative z-10">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <Calculator className="h-4 w-4" />
          <span>Simulador Financiero Directo · MGM Inmobiliaria</span>
        </div>
        <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Calcula tu inversión y cuotas a tu medida
        </h3>
        <p className="text-xs sm:text-sm text-slate-600">
          Sin intermediarios bancarios, sin trámites complejos y con aprobación inmediata para ecuatorianos y residentes en el exterior.
        </p>
      </div>

      {/* Open Split Studio: Controls on Left, Live Financial Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10 items-start">
        {/* Controls Column (7 cols) - Clean, borderless rows */}
        <div className="lg:col-span-7 space-y-6">
          {/* Lot Selector */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Lote o Vivienda de Referencia
            </label>
            <select
              value={selectedLotCode}
              onChange={(e) => handleLotChange(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer shadow-xs"
            >
              {availableOrAll.map((lot) => (
                <option key={lot.code} value={lot.code} className="bg-white text-slate-900">
                  {lot.code} · {lot.name} ({lot.areaM2} m² - ${lot.priceUSD.toLocaleString()} USD)
                </option>
              ))}
            </select>
          </div>

          {/* Valor del Terreno Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor={priceInputId} className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Valor Total del Inmueble (USD)
              </label>
              <span className="font-mono text-lg font-black text-emerald-700">
                ${price.toLocaleString()} USD
              </span>
            </div>
            <input
              id={priceInputId}
              type="range"
              min={15000}
              max={65000}
              step={500}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>$15,000 USD</span>
              <span>$40,000 USD</span>
              <span>$65,000 USD</span>
            </div>
          </div>

          {/* Porcentaje de Entrada Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor={downPaymentInputId} className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Entrada Inicial Sugerida ({downPaymentPercent}%)
              </label>
              <span className="font-mono text-lg font-black text-slate-900">
                ${downPaymentAmount.toLocaleString()} USD
              </span>
            </div>
            <input
              id={downPaymentInputId}
              type="range"
              min={15}
              max={50}
              step={5}
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>15% (Mínimo recomendado)</span>
              <span>30%</span>
              <span>50%</span>
            </div>
          </div>

          {/* Plazo en Meses */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Plazo de Financiamiento Directo
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {[12, 24, 36, 48].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setMonths(term)}
                  className={`py-3 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    months === term
                      ? 'bg-slate-900 text-white font-black shadow-md scale-102'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {term} Meses
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Output Readout Column (5 cols) - Minimalist Studio Display */}
        <div className="lg:col-span-5 bg-[#FBFBFA] border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-3 pb-6 border-b border-slate-200 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Precio convenido:</span>
              <span className="font-mono font-semibold text-slate-900">
                ${price.toLocaleString()} USD
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Entrada inicial ({downPaymentPercent}%):</span>
              <span className="font-mono font-semibold text-slate-900">
                ${downPaymentAmount.toLocaleString()} USD
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Monto a financiar:</span>
              <span className="font-mono font-semibold text-emerald-700">
                ${financedAmount.toLocaleString()} USD
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Plazo elegido:</span>
              <span className="font-mono font-semibold text-slate-900">
                {months} meses ({Math.round(months / 12)} años)
              </span>
            </div>
          </div>

          {/* Big Monthly Readout */}
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Cuota Mensual Fija Estimada
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black font-mono text-slate-900">
                ${monthlyQuota.toLocaleString()}
              </span>
              <span className="text-sm font-medium text-slate-500">USD / mes</span>
            </div>
            <p className="text-xs text-slate-500 pt-1">
              Sin intereses sorpresa ni gastos de comisiones bancarias.
            </p>
          </div>

          <div className="space-y-2 pt-1 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Posesión inmediata para iniciar obras o cerramiento</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Escritura notarial individualizada al cancelar</span>
            </div>
          </div>

          {/* Official WhatsApp Button */}
          <div className="pt-2">
            <a
              href={quoteWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-sm shadow-md hover:scale-102 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <WhatsAppIcon size={20} className="text-slate-950" />
              <span>Solicitar Plan en WhatsApp Oficial</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
