'use client';

import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, ArrowRight, Sparkles, Building2, CheckCircle2, Mail, Key, Loader2, ShieldCheck } from 'lucide-react';
import { LogoMGM } from '../LogoMGM';
import { supabase } from '@/src/lib/supabase';
import type { PageView } from '@/src/data/navigation';

interface AdminLoginProps {
  onSuccess: () => void;
  onNavigate?: (page: PageView) => void;
}

const DEFAULT_PIN = 'mgm2026';
const BACKUP_PIN = 'admin1234';

export function AdminLogin({ onSuccess, onNavigate }: AdminLoginProps) {
  const [authMode, setAuthMode] = useState<'supabase' | 'pin'>('supabase');
  const [email, setEmail] = useState('noemaliza01@gmail.com');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSupabaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message === 'Invalid login credentials' 
          ? 'Credenciales inválidas en Supabase. Verifica tu correo y contraseña.' 
          : `Error de autenticación: ${authError.message}`);
        setLoading(false);
        return;
      }

      if (data.user) {
        if (rememberMe) {
          localStorage.setItem('mgm_admin_authenticated', 'true');
          localStorage.setItem('mgm_admin_user_email', data.user.email || email);
        } else {
          sessionStorage.setItem('mgm_admin_authenticated', 'true');
          sessionStorage.setItem('mgm_admin_user_email', data.user.email || email);
        }
        setError('');
        onSuccess();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error inesperado al conectar con Supabase';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pin.trim();

    if (cleanPin === DEFAULT_PIN || cleanPin === BACKUP_PIN) {
      if (rememberMe) {
        localStorage.setItem('mgm_admin_authenticated', 'true');
        localStorage.setItem('mgm_admin_user_email', 'admin.pin@mgminmobiliaria.com');
      } else {
        sessionStorage.setItem('mgm_admin_authenticated', 'true');
        sessionStorage.setItem('mgm_admin_user_email', 'admin.pin@mgminmobiliaria.com');
      }
      setError('');
      onSuccess();
    } else {
      setError('PIN o clave maestra incorrecta. Código no autorizado.');
    }
  };

  return (
    <div className="min-h-[70dvh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200/90 relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-4 mb-6">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                if (onNavigate) {
                  onNavigate('home');
                } else {
                  window.location.hash = '';
                }
              }}
              className="cursor-pointer hover:scale-105 active:scale-95 transition-transform p-1 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              title="Ir a la pantalla principal"
            >
              <LogoMGM className="h-12 w-auto" variant="compact" showSubtitle={true} />
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 block">
              Backoffice Comercial & CMS
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Panel de Administrador
            </h1>
            <p className="text-xs text-slate-500">
              Gestión ejecutiva en tiempo real con respaldo Supabase Cloud.
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => { setAuthMode('supabase'); setError(''); }}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'supabase'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Supabase Auth</span>
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('pin'); setError(''); }}
            className={`py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'pin'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="h-3.5 w-3.5 text-slate-600" />
            <span>PIN Maestro</span>
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700 font-semibold animate-shake">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {authMode === 'supabase' ? (
          /* Form Supabase Auth (Email + Contraseña) */
          <form onSubmit={handleSupabaseSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Correo Electrónico Admin
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="noemaliza01@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Recordar sesión</span>
              </label>
              <span className="text-[11px] text-emerald-700 font-semibold">Supabase PostgreSQL 17</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-5 rounded-xl bg-slate-950 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verificando con Supabase...</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Entrar con Supabase Auth</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Form PIN Maestro */
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                PIN de Contingencia
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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono text-slate-900 focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Recordar sesión</span>
              </label>
              <span className="text-[11px] font-mono text-slate-500">PIN: mgm2026</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-5 rounded-xl bg-slate-950 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="h-4 w-4" />
              <span>Ingresar con PIN Maestro</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Sociedad Civil MGM Inmobiliaria · Acceso restringido para el equipo de ventas y gerencia.
          </p>
        </div>
      </div>
    </div>
  );
}
