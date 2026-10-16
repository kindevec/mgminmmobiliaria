'use client';

import React, { useState, useEffect, Suspense, lazy } from 'react';
import {
  KeyRound,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  Save,
  CheckCircle2,
  AlertTriangle,
  Lock,
  LogOut,
  Sliders,
  Loader2,
} from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import { useSiteSettings } from '@/src/lib/siteSettings';

const InteractiveMapPicker = lazy(() =>
  import('../common/InteractiveMapPicker').then((m) => ({ default: m.InteractiveMapPicker }))
);

interface AdminProfileViewProps {
  adminEmail: string;
  onLogout: () => void;
}

export function AdminProfileView({ adminEmail, onLogout }: AdminProfileViewProps) {
  const { settings, saveSettings } = useSiteSettings();

  // Institutional & Headquarters Location State
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [supportPhone, setSupportPhone] = useState(settings.supportPhone);
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail);
  const [hqTitle, setHqTitle] = useState(settings.hqTitle);
  const [hqAddress, setHqAddress] = useState(settings.hqAddress);
  const [hqLat, setHqLat] = useState(settings.hqLat);
  const [hqLng, setHqLng] = useState(settings.hqLng);
  const [businessHours, setBusinessHours] = useState(settings.businessHours);
  const [businessHoursWeekend, setBusinessHoursWeekend] = useState(settings.businessHoursWeekend);

  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Sync local state when remote settings load
  useEffect(() => {
    setCompanyName(settings.companyName);
    setSupportPhone(settings.supportPhone);
    setSupportEmail(settings.supportEmail);
    setHqTitle(settings.hqTitle);
    setHqAddress(settings.hqAddress);
    setHqLat(settings.hqLat);
    setHqLng(settings.hqLng);
    setBusinessHours(settings.businessHours);
    setBusinessHoursWeekend(settings.businessHoursWeekend);
  }, [settings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await saveSettings({
        companyName,
        supportPhone,
        supportEmail,
        hqTitle,
        hqAddress,
        hqLat,
        hqLng,
        businessHours,
        businessHoursWeekend,
      });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } finally {
      setIsSavingSettings(false);
    }
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
      {/* 1. Header de Identidad de Administrador */}
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
                {companyName} · Sesión de Control Activa
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

      {/* 2. Cuadrícula de Distribución: Ajustes de Empresa y Ubicación + Seguridad */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lado Izquierdo: Configuración Institucional y Ubicación de Sede (7 cols) */}
        <section className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                <Sliders className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Datos de Contacto y Sede MGM
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Se reflejan en tiempo real en toda la página web pública, botones de WhatsApp, pie de página y mapa de Contacto.
                </p>
              </div>
            </div>
          </div>

          {settingsSaved && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>¡Cambios guardados y sincronizados con la web pública!</span>
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
                    Teléfono / WhatsApp Oficial
                  </label>
                  <div className="relative">
                    <Phone className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={supportPhone}
                      onChange={(e) => setSupportPhone(e.target.value)}
                      placeholder="+593 99 284 9965"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Horario Lunes a Viernes
                  </label>
                  <div className="relative">
                    <Clock className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={businessHours}
                      onChange={(e) => setBusinessHours(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Horario Fin de Semana
                  </label>
                  <div className="relative">
                    <Clock className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={businessHoursWeekend}
                      onChange={(e) => setBusinessHoursWeekend(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Ubicación de la Sede Principal en Mapa */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  <span>Ubicación de la Sede MGM (Sección Contacto)</span>
                </h4>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  {hqLat.toFixed(4)}, {hqLng.toFixed(4)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Título de la Sede
                  </label>
                  <input
                    type="text"
                    required
                    value={hqTitle}
                    onChange={(e) => setHqTitle(e.target.value)}
                    placeholder="MGM Inmobiliaria · Miravalle"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 font-medium focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Dirección Pública de la Sede
                  </label>
                  <input
                    type="text"
                    required
                    value={hqAddress}
                    onChange={(e) => setHqAddress(e.target.value)}
                    placeholder="Vía Principal Ciudadela Miravalle, Azuay, Ecuador"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 font-medium focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-3 bg-slate-50/50 space-y-2">
                <p className="text-[11px] text-slate-500">
                  Busca la dirección o arrastra el pin verde para establecer el punto exacto que verán los clientes en el mapa de la pestaña <strong>Contacto</strong>:
                </p>
                <Suspense
                  fallback={
                    <div className="h-[260px] w-full rounded-2xl bg-slate-100 flex items-center justify-center text-xs text-slate-500 gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                      <span>Cargando mapa interactivo...</span>
                    </div>
                  }
                >
                  <InteractiveMapPicker
                    initialLat={hqLat}
                    initialLng={hqLng}
                    selectedLocality={hqAddress}
                    onLocationChange={(lat, lng, placeName) => {
                      setHqLat(lat);
                      setHqLng(lng);
                      if (placeName) {
                        setHqAddress(placeName);
                      }
                    }}
                  />
                </Suspense>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
              >
                {isSavingSettings ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{isSavingSettings ? 'Sincronizando...' : 'Guardar y Publicar en la Web'}</span>
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
                  Actualiza tu credencial de Supabase Auth.
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
