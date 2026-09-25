'use client';

import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, ArrowRight, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import { LogoMGM } from '../LogoMGM';

interface AdminLoginProps {
  onSuccess: () => void;
}

const DEFAULT_PIN = 'mgm2026';
const BACKUP_PIN = 'admin1234';

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pin.trim();

    if (cleanPin === DEFAULT_PIN || cleanPin === BACKUP_PIN) {
      if (rememberMe) {
        localStorage.setItem('mgm_admin_authenticated', 'true');
      } else {
        sessionStorage.setItem('mgm_admin_authenticated', 'true');
      }
      setError('');
      onSuccess();
    } else {
      setError('PIN o contraseña incorrecta. Ingresa el código autorizado.');
    }
  };

  return (
    <div className="min-h-[70dvh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200/90 relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center">
            <LogoMGM className="h-12 w-auto" variant="compact" showSubtitle={true} />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 block">
              Backoffice Comercial & CMS
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Acceso Administrativo
            </h1>
            <p className="text-xs text-slate-500">
              Gestión en tiempo real de inventario, precios y estados de propiedades.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700 font-semibold animate-shake">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              PIN / Contraseña de Acceso
            </label>
            <div className="relative">
              <KeyRound className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Ingresa PIN autorizado..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Mantener sesión activa</span>
            </label>
            <span className="text-[11px] font-mono text-slate-600">PIN: mgm2026</span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-5 rounded-xl bg-slate-950 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="h-4 w-4" />
            <span>Ingresar al Panel CMS</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Sociedad Civil MGM Inmobiliaria · Acceso restringido para el equipo de ventas y gerencia.
          </p>
        </div>
      </div>
    </div>
  );
}
