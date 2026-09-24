'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CalendarCheck2,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import {
  WHATSAPP_PHONE,
  getGeneralWhatsAppUrl,
  getMiravalleWhatsAppUrl,
} from '@/src/data/lots';
import {
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from '../SocialIcons';
import { WaveDarkToCream, WaveCreamToDark } from '../WaveDividers';

interface ContactViewProps {
  onOpenVisitModal: (defaultInterest?: string) => void;
}

export function ContactView({ onOpenVisitModal }: ContactViewProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('Ciudadela Miravalle');
  const [visitDate, setVisitDate] = useState('');
  const [visitShift, setVisitShift] = useState('Mañana (09:00 - 12:00)');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // bot detected

    if (!name.trim() || !phone.trim()) {
      return;
    }

    setIsSubmitted(true);

    const encoded = encodeURIComponent(
      `Hola MGM Inmobiliaria, he solicitado agendamiento desde la web:\n\n` +
        `• Nombre: ${name.trim()}\n` +
        `• Teléfono: ${phone.trim()}\n` +
        (email.trim() ? `• Email: ${email.trim()}\n` : '') +
        `• Proyecto de interés: ${interest}\n` +
        (visitDate ? `• Fecha solicitada: ${visitDate}\n` : '') +
        `• Turno preferido: ${visitShift}\n` +
        (message.trim() ? `• Mensaje: ${message.trim()}\n\n` : '\n') +
        `Deseo coordinar el recorrido y transporte con un asesor de MGM Inmobiliaria.`
    );

    setTimeout(() => {
      window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`, '_blank');
    }, 400);
  };

  return (
    <div className="w-full overflow-hidden bg-slate-950">
      {/* 1. CINEMATIC FULL-WIDTH HERO BANNER */}
      <section className="relative w-full min-h-[560px] md:min-h-[640px] lg:min-h-[700px] flex flex-col justify-between overflow-hidden bg-slate-950 text-white">
        {/* Cinematic Backdrop Image with Slow Ken Burns Zoom Effect */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2160&q=90"
            alt="Atención Inmediata MGM Inmobiliaria"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.85]"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Multi-layer Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/35 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center pt-28 sm:pt-32 pb-8">
          <div className="max-w-4xl space-y-5">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
              <span className="h-2 w-2 rounded-full bg-[#25D366] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#25D366]">
                Atención Inmediata & Canales Oficiales
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] [text-wrap:balance]">
              Contáctanos y agenda tu{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 font-serif italic font-normal">
                asesoría personalizada.
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl leading-relaxed drop-shadow-sm">
              Estamos disponibles para responder tus preguntas técnicas, mostrarte la documentación jurídica notarial y coordinar un recorrido guiado en terreno.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2.5 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                <WhatsAppIcon size={18} className="text-slate-950" />
                <span>WhatsApp Oficial Inmediato</span>
              </a>

              <button
                onClick={() => onOpenVisitModal('Agendamiento Directo desde Contacto')}
                className="px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm backdrop-blur-md border border-white/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <CalendarCheck2 className="h-4 w-4" />
                <span>Agendar Cita en Oficina</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Wave to Cream Section */}
        <WaveDarkToCream fillColor="#FAF7F2" />
      </section>

      {/* Main Content Sections with Organic Background */}
      <div className="bg-[#FAF7F2] text-slate-900 py-12 sm:py-20 space-y-16 sm:space-y-24">

      {/* Main Grid: Form + Direct Contact Information (Open Layout, ZERO Box-in-Box) */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Form (7 cols) - Clean and open */}
          <div className="lg:col-span-7 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-black text-slate-900">
                Envíanos un mensaje directo
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Te contactaremos a la brevedad por llamada telefónica o WhatsApp.
              </p>
            </div>

            {isSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="h-16 w-16 bg-emerald-100 text-emerald-700 rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  ¡Gracias por comunicarte con MGM Inmobiliaria!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Tu consulta ha sido pre-cargada en WhatsApp para brindarte atención
                  inmediata con un asesor asignado.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setMessage('');
                  }}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot for bot protection */}
                <input
                  type="text"
                  name="_gotcha"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                      Nombre y Apellido *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Andrés Salazar"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                      Celular / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej. 099 123 4567"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                      Correo Electrónico (Opcional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                      Proyecto o Lote de Interés
                    </label>
                    <select
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
                    >
                      <option value="Ciudadela Miravalle">Ciudadela Miravalle (Lotes Residenciales)</option>
                      <option value="Lotes Comerciales">Lotes Comerciales & Esquineros</option>
                      <option value="Crédito Directo">Consulta de Crédito Directo Propio</option>
                      <option value="Revisión de Escrituras">Revisión Notarial de Escrituras</option>
                    </select>
                  </div>
                </div>

                {/* Date & Shift Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                      Fecha Estimada de Visita
                    </label>
                    <input
                      type="date"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                      Turno Preferido
                    </label>
                    <select
                      value={visitShift}
                      onChange={(e) => setVisitShift(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
                    >
                      <option value="Mañana (09:00 - 12:00)">Mañana (09:00 - 12:00)</option>
                      <option value="Tarde (14:00 - 17:00)">Tarde (14:00 - 17:00)</option>
                      <option value="Fin de Semana (Previa Reserva)">Fin de Semana (Previa Reserva)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                    Mensaje o Consulta Específica
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Cuéntanos si deseas transporte corporativo desde la oficina, qué metraje buscas o si quieres examinar las escrituras..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-sm shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <WhatsAppIcon size={20} className="text-slate-950" />
                    <span>Enviar Consulta al WhatsApp Oficial</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Direct Details (5 cols) - Unboxed, pure typography & official social icons */}
          <div className="lg:col-span-5 space-y-8 lg:pl-6 lg:border-l lg:border-slate-200">
            {/* Direct Line Callout */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Línea Directa de Atención
              </span>
              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-2xl sm:text-3xl font-black text-slate-900 hover:text-emerald-700 transition-colors flex items-center gap-2"
              >
                <span>+593 99 195 2889</span>
              </a>
              <p className="text-xs text-slate-500">
                Atención directa sin intermediarios con asesores autorizados de Sociedad Civil MGM Inmobiliaria.
              </p>
            </div>

            {/* Official Social Media Networks */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Redes Sociales Oficiales
              </span>
              <div className="flex items-center gap-3">
                {/* Official WhatsApp */}
                <a
                  href={getGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Oficial"
                  className="h-11 w-11 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all"
                  title="WhatsApp Oficial"
                >
                  <WhatsAppIcon size={22} />
                </a>

                {/* Official Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Oficial"
                  className="h-11 w-11 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all"
                  title="Facebook Oficial"
                >
                  <FacebookIcon size={20} />
                </a>

                {/* Official Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Oficial"
                  className="h-11 w-11 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all"
                  title="Instagram Oficial"
                >
                  <InstagramIcon size={20} />
                </a>

                {/* Official TikTok */}
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok Oficial"
                  className="h-11 w-11 rounded-xl bg-black text-white flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all"
                  title="TikTok Oficial"
                >
                  <TikTokIcon size={20} />
                </a>
              </div>
            </div>

            {/* Schedule & Office Information */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 pt-2 border-t border-slate-200">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Horarios de Atención</span>
                  <span>
                    Lunes a Viernes: 08:30 – 18:00
                    <br />
                    Sábados: 09:00 – 16:00
                    <br />
                    Domingos: Recorridos en obra con reserva previa
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Ubicación de Proyectos</span>
                  <span>Ecuador · Ciudadela Miravalle y Valles Residenciales en expansión</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Garantía Jurídica Notarial</span>
                  <span>Cada lote cuenta con plano catastral y ficha registral individual para verificación.</span>
                </div>
              </div>
            </div>

            {/* Quick Action Button for In-Person Visit */}
            <div className="pt-2">
              <button
                onClick={() => onOpenVisitModal('Ciudadela Miravalle')}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap"
              >
                <CalendarCheck2 className="h-4 w-4" />
                <span>Agendar Visita en Terreno con Transporte</span>
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 2. GOOGLE MAPS INTERACTIVE EMBED (Real Location of Ciudadela Miravalle & Offices) */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
                Localización Satelital & Acceso Vial
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Ubicación Exacta de Ciudadela Miravalle y Oficinas
              </h2>
            </div>
            <a
              href="https://maps.google.com/?q=Ciudadela+Miravalle+Ecuador"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <span>Abrir en Google Maps App</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-xl border border-slate-200 relative bg-slate-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127672.48425265487!2d-78.5833!3d-0.2298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d59a4002422c9f%3A0x44b44695079a76f5!2sQuito%2C%20Ecuador!5e0!3m2!1ses!2sec!4v1700000000000!5m2!1ses!2sec"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de Ubicación Ciudadela Miravalle - MGM Inmobiliaria"
              className="w-full h-full"
            />
            {/* Overlay badge with location details */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-slate-200/80 pointer-events-none max-w-xs">
              <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase block">
                Proyecto Insignia
              </span>
              <span className="text-xs font-bold text-slate-900 block">
                Ciudadela Miravalle · Etapas 1 & 2
              </span>
              <span className="text-[11px] text-slate-500">
                A 15 min de vías arteriales, centros comerciales y transporte público.
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 3. GUÍA PRÁCTICA PARA EL DÍA DE LA VISITA with Panoramic Background */}
      <motion.section
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-4"
      >
        <div className="rounded-3xl bg-slate-950 p-8 sm:p-12 text-white border border-white/15 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80"
              alt="Terrenos y Topografía"
              fill
              sizes="100vw"
              className="object-cover opacity-20 brightness-75 scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          </div>

          <div className="max-w-2xl space-y-1 relative z-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#25D366] block">
              Recomendaciones para el Cliente
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Guía previa para el día de tu visita a obra
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Queremos que tu experiencia técnica en el terreno sea cómoda, transparente y segura.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2 relative z-10">
            <div className="space-y-1.5 border-l-2 border-[#25D366] pl-4 bg-white/5 p-4 rounded-r-xl backdrop-blur-sm">
              <span className="text-xs font-bold text-[#25D366] uppercase tracking-wider block">
                01 · Calzado Cómodo
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Recomendamos zapatos deportivos o botas para caminar sobre el terreno natural y comprobar los linderos.
              </p>
            </div>

            <div className="space-y-1.5 border-l-2 border-amber-400 pl-4 bg-white/5 p-4 rounded-r-xl backdrop-blur-sm">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                02 · Identificación Personal
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Trae tu cédula o pasaporte original si deseas congelar la reserva inmediata del lote elegido.
              </p>
            </div>

            <div className="space-y-1.5 border-l-2 border-teal-400 pl-4 bg-white/5 p-4 rounded-r-xl backdrop-blur-sm">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                03 · Transporte Corporativo
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Si no dispones de vehículo propio, te recogemos en nuestras oficinas centrales previa coordinación.
              </p>
            </div>

            <div className="space-y-1.5 border-l-2 border-emerald-400 pl-4 bg-white/5 p-4 rounded-r-xl backdrop-blur-sm">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                04 · Asesoría Legal Notarial
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tendrás acceso a planos catastrales, licencias de subdivisión y certificados de gravamen vigentes.
              </p>
            </div>
          </div>
        </div>
      </motion.section>
      </div>
    </div>
  );
}
