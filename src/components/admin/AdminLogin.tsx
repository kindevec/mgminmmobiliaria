'use client';

import React, { useState } from 'react';
import { Lock, ShieldAlert, ArrowRight, Mail, Loader2, ShieldCheck, Zap } from 'lucide-react';
import { LogoMGM } from '../LogoMGM';
import { supabase } from '@/src/lib/supabase';
import type { PageView } from '@/src/data/navigation';

interface AdminLoginProps {
  onSuccess: () => void;
  onNavigate?: (page: PageView) => void;
}

export function AdminLogin({ onSuccess, onNavigate }: AdminLoginProps) {
  const [email, setEmail] = useState('noemaliza01@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        setError(
          authError.message === 'Invalid login credentials'
            ? 'Credenciales inválidas en Supabase. Verifica tu correo y contraseña.'
            : `Error de autenticación: ${authError.message}`
        );
        setLoading(false);
        return;
      }

      if (data.user) {
        setError('');
        onSuccess();
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error inesperado al conectar con Supabase';
      setError(message);
    } finally {
      setLoading(false);
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
                  window.location.href = '/';
                }
              }}
              className="cursor-pointer hover:scale-105 active:scale-95 transition-transform p-1 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              title="Ir a la pantalla principal"
            >
              <LogoMGM className="h-12 w-auto" variant="compact" showSubtitle={true} />
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Supabase Cloud Auth</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Panel de Administrador
            </h1>
            <p className="text-xs text-slate-500">
              Gestión ejecutiva en tiempo real con respaldo Supabase Cloud.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700 font-semibold animate-shake">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Supabase Auth (Email + Contraseña) */}
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

          {/* Acceso Rápido Temporal para Pruebas (Sin PIN ni localStorage) */}
          <button
            type="button"
            onClick={() => {
              setError('');
              onSuccess();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5 text-emerald-600" />
            <span>Ingresar sin contraseña</span>
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 text-center space-y-2.5">
          <div>
            <button
              type="button"
              onClick={() => {
                if (onNavigate) {
                  onNavigate('home');
                } else {
                  window.location.href = '/';
                }
              }}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold hover:underline cursor-pointer inline-flex items-center gap-1.5 transition-colors"
            >
              <span>← Volver al sitio web principal</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Sociedad Civil MGM Inmobiliaria · Acceso restringido para el equipo de ventas y gerencia.
          </p>
        </div>
      </div>
    </div>
  );
}
