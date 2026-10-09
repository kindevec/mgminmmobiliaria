'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  KeyRound,
  Building,
  Phone,
  Mail,
  Percent,
  Calendar,
  Save,
  CheckCircle2,
  AlertTriangle,
  Lock,
  LogOut,
  Sliders,
} from 'lucide-react';
import { supabase } from '@/src/lib/supabase';

interface AdminProfileViewProps {
  adminEmail: string;
  onLogout: () => void;
}

export function AdminProfileView({ adminEmail, onLogout }: AdminProfileViewProps) {
  // Institutional & Commercial Settings State
  const [companyName, setCompanyName] = useState('Sociedad Civil MGM Inmobiliaria');
  const [supportPhone, setSupportPhone] = useState('+593 99 195 2889');
  const [supportEmail, setSupportEmail] = useState('contacto@mgminmobiliaria.ec');
  const [defaultDownPercent, setDefaultDownPercent] = useState(20);
  const [defaultMaxMonths, setDefaultMaxMonths] = useState(48);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mgm_admin_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.companyName) setCompanyName(parsed.companyName);
        if (parsed.supportPhone) setSupportPhone(parsed.supportPhone);
        if (parsed.supportEmail) setSupportEmail(parsed.supportEmail);
        if (parsed.defaultDownPercent) setDefaultDownPercent(parsed.defaultDownPercent);
        if (parsed.defaultMaxMonths) setDefaultMaxMonths(parsed.defaultMaxMonths);
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(
        'mgm_admin_settings',
        JSON.stringify({
          companyName,
          supportPhone,
          supportEmail,
          defaultDownPercent,
          defaultMaxMonths,
        })
      );
    } catch {
      // LocalStorage fallback
    }
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Password Update State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden.');
      return;
    }

    setPasswordLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setPasswordError(error.message);
      } else {
        setPasswordSuccess('¡Contraseña actualizada con éxito!');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: unknown) {
      setPasswordError(
        err instanceof Error ? err.message : 'Error al conectar con el servicio de autenticación.'
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl animate-in fade-in duration-200">
      {/* 1. Header de Identidad de Administrador (Sin box-in-box) */}
      <div className="bg-gradient-to-r from-[#0d2e1a] via-[#124225] to-[#1a5b33] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/5 rounded-full pointer-events-none blur-3xl" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 sm:h-18 sm:w-18 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-white font-black text-xl sm:text-2xl flex items-center justify-center shadow-inner shrink-0">
              {adminEmail.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white truncate">
                  Perfil de Administrador
                </h2>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                  Super Admin
                </span>
              </div>
              <p className="text-sm text-emerald-200/90 font-mono mt-0.5 truncate">{adminEmail}</p>
              <p className="text-xs text-emerald-300/70 mt-0.5">
                Sociedad Civil MGM Inmobiliaria · Sesión de Control Activa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Cuadrícula de Distribución Limpia: Ajustes de Empresa + Seguridad (Anti box-in-box) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lado Izquierdo: Configuración Institucional y Políticas Comerciales (7 cols) */}
        <section className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                <Sliders className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Parámetros de la Inmobiliaria
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Información corporativa y condiciones base de financiamiento.
                </p>
              </div>
            </div>
          </div>

          {settingsSaved && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Parámetros institucionales guardados correctamente.</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Nombre Comercial de la Inmobiliaria
                </label>
                <div className="relative">
                  <Building className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 font-medium focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    WhatsApp Comercial
                  </label>
                  <div className="relative">
                    <Phone className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={supportPhone}
                      onChange={(e) => setSupportPhone(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 font-mono focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Correo Electrónico Oficial
                  </label>
                  <div className="relative">
                    <Mail className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Separador sutil sin anidar cajas */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                Políticas de Financiamiento Directo
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Entrada Mínima Predeterminada (%)
                  </label>
                  <div className="relative">
                    <Percent className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="number"
                      min={5}
                      max={50}
                      value={defaultDownPercent}
                      onChange={(e) => setDefaultDownPercent(parseInt(e.target.value) || 20)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 font-mono focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Calcula la entrada inicial al cotizar lotes.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Plazo Máximo Habitual (Meses)
                  </label>
                  <div className="relative">
                    <Calendar className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="number"
                      min={12}
                      max={120}
                      value={defaultMaxMonths}
                      onChange={(e) => setDefaultMaxMonths(parseInt(e.target.value) || 48)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 font-mono focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Plazo de referencia en cuotas de crédito directo.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Save className="h-4 w-4" />
                <span>Guardar Parámetros</span>
              </button>
            </div>
          </form>
        </section>

        {/* Lado Derecho: Seguridad y Cambio de Contraseña (5 cols) */}
        <section className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                <KeyRound className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Cambiar Contraseña
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Actualiza tu credencial maestra de acceso.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {passwordError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2.5">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres..."
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la contraseña..."
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>{passwordLoading ? 'Guardando...' : 'Actualizar Contraseña'}</span>
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
