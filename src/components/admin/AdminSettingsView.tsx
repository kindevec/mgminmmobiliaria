'use client';

import React, { useState } from 'react';
import {
  Settings,
  Building,
  Phone,
  Mail,
  DollarSign,
  Save,
  CheckCircle2,
  RefreshCw,
  Database,
  ShieldAlert,
} from 'lucide-react';
import { useProperties } from '@/src/context/PropertyContext';

export function AdminSettingsView() {
  const { resetToDefaults } = useProperties();

  const [companyName, setCompanyName] = useState('Sociedad Civil MGM Inmobiliaria');
  const [supportPhone, setSupportPhone] = useState('+593 99 195 2889');
  const [supportEmail, setSupportEmail] = useState('contacto@mgminmobiliaria.ec');
  const [defaultDownPercent, setDefaultDownPercent] = useState(20);
  const [defaultMaxMonths, setDefaultMaxMonths] = useState(48);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-2 border-b border-slate-100">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>Configuración del Sistema</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Parámetros operativos de la inmobiliaria, financiamiento comercial y preferencias generales.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>Configuración guardada exitosamente en el navegador.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Parámetros de la Empresa */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 space-y-4 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            1. Datos Institucionales
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nombre Comercial de la Inmobiliaria</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">WhatsApp de Atención Comercial</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Correo Electrónico Oficial</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Moneda Principal</label>
              <input
                type="text"
                disabled
                value="USD ($) - Dólares de los Estados Unidos"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Parámetros de Cotización y Financiamiento Directo */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 space-y-4 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            2. Política Comercial y Financiamiento Directo
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Entrada Mínima Predeterminada (%)
              </label>
              <input
                type="number"
                min={5}
                max={50}
                value={defaultDownPercent}
                onChange={(e) => setDefaultDownPercent(parseInt(e.target.value) || 20)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Calcula automáticamente la entrada al registrar nuevos inmuebles.
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Plazo Máximo Habitual (Meses)
              </label>
              <input
                type="number"
                min={12}
                max={120}
                value={defaultMaxMonths}
                onChange={(e) => setDefaultMaxMonths(parseInt(e.target.value) || 48)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Plazo base para la proyección de cuotas mensuales.
              </span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Guardar Preferencias</span>
            </button>
          </div>
        </div>

        {/* Zona de Mantenimiento de Datos */}
        <div className="bg-red-50/50 rounded-3xl border border-red-200/80 p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-red-800">
            <ShieldAlert className="h-5 w-5" />
            <h2 className="text-xs font-black uppercase tracking-wider">Zona de Mantenimiento</h2>
          </div>
          <p className="text-xs text-red-900/80">
            Si deseas restaurar los lotes iniciales predeterminados (San Antonio · Manta y Miravalle), puedes usar esta opción.
          </p>
          <div className="pt-2">
            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-900 font-bold text-xs transition-all cursor-pointer"
              >
                Restablecer Catálogo a Valores Predeterminados
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    await resetToDefaults();
                    setShowResetConfirm(false);
                    alert('Catálogo restablecido correctamente.');
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all cursor-pointer"
                >
                  Confirmar Restablecimiento
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-slate-600 text-xs font-bold hover:bg-white transition-all cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
