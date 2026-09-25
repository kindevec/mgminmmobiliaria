'use client';

import React, { useState } from 'react';
import {
  X,
  CalendarCheck2,
  Clock,
  Phone,
  User,
  ShieldCheck,
  Building,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { WHATSAPP_PHONE } from '@/src/data/lots';
import { WhatsAppIcon } from './SocialIcons';

interface VisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultInterest?: string;
}

export function VisitModal({
  isOpen,
  onClose,
  defaultInterest = 'Ciudadela Miravalle',
}: VisitModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [customInterest, setCustomInterest] = useState<string | null>(null);
  const projectInterest = customInterest !== null ? customInterest : defaultInterest;
  const [visitType, setVisitType] = useState<'presencial' | 'virtual'>('presencial');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('09:00 - 12:00 (Mañana)');
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // bot detected

    if (!name.trim() || !phone.trim() || !date) {
      setErrorMsg('Por favor completa los campos obligatorios: Nombre, Celular y Fecha.');
      return;
    }
    setErrorMsg('');

    setIsSubmitted(true);

    // Format WhatsApp message
    const msg = encodeURIComponent(
      `Hola MGM Inmobiliaria, deseo confirmar mi cita para agendar una visita:\n\n` +
        `• Nombre: ${name.trim()}\n` +
        `• Teléfono: ${phone.trim()}\n` +
        `• Proyecto/Lote: ${projectInterest}\n` +
        `• Modalidad: ${visitType === 'presencial' ? 'Visita en Terreno / Obra' : 'Asesoría Virtual'}\n` +
        `• Fecha propuesta: ${date}\n` +
        `• Horario: ${timeSlot}\n` +
        (notes ? `• Observaciones: ${notes}\n\n` : '\n') +
        `Por favor confírmenme la disponibilidad del asesor.`
    );

    setTimeout(() => {
      window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${msg}`, '_blank');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[94dvh] sm:max-h-[90dvh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 p-4 sm:p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all cursor-pointer"
            aria-label="Cerrar modal de visita"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 text-[#25D366] text-xs font-bold uppercase tracking-wider mb-1">
            <CalendarCheck2 className="h-4 w-4" />
            <span>Atención Directa & Recorrido Guiado</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white">
            Agendar Recorrido en Terreno
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Visita las obras en persona con un asesor técnico de Sociedad Civil MGM Inmobiliaria.
          </p>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="h-16 w-16 bg-emerald-100 text-[#25D366] rounded-full mx-auto flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                ¡Solicitud Registrada con Éxito!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Hemos preparado tu confirmación en WhatsApp. Nuestro equipo verificará la agenda y te asignará un asesor en terreno.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cerrar Ventana
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field */}
              <input
                type="text"
                name="_gotcha"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Mode Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                  Modalidad del Recorrido
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVisitType('presencial')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      visitType === 'presencial'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    🚗 Presencial en Obra
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisitType('virtual')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      visitType === 'virtual'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    💻 Asesoría Virtual
                  </button>
                </div>
              </div>

              {/* Property of interest */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                  Proyecto o Lote de Interés
                </label>
                <input
                  type="text"
                  value={projectInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  placeholder="Ej. Ciudadela Miravalle / Lote M-14"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Carlos Morales"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                    Número Celular / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. 099 123 4567"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                    Fecha Preferida *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                    Horario de Preferencia
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all bg-white"
                  >
                    <option value="09:00 - 12:00 (Mañana)">09:00 - 12:00 (Mañana)</option>
                    <option value="14:00 - 17:00 (Tarde)">14:00 - 17:00 (Tarde)</option>
                    <option value="Fines de semana (Previa cita)">
                      Fines de semana (Previa cita)
                    </option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                  Observaciones o Consultas Previas (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="¿Deseas información sobre financiamiento directo o transporte para la visita?"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-base sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              {/* Submit CTA with Official WhatsApp Icon */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer text-center"
                >
                  <WhatsAppIcon size={18} className="text-slate-950 shrink-0" />
                  <span>Confirmar & Agendar por WhatsApp Oficial</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
