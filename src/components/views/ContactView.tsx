'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Navigation,
  ExternalLink,
  Building2,
  User,
  Layers,
  Send,
  MessageSquare,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { getGeneralWhatsAppUrl } from '@/src/data/lots';
import { useSiteBanners } from '@/src/lib/bannerStorage';
import {
  useSiteSettings,
  formatPhoneForWhatsApp,
  formatPhoneForTel,
} from '@/src/lib/siteSettings';
import { WhatsAppIcon, FacebookIcon, InstagramIcon, TikTokIcon } from '../SocialIcons';
import { ScrollReveal } from '../common/ScrollReveal';
import { AnimatedInsignia } from '../common/AnimatedInsignia';

interface ContactViewProps {
  onOpenLegalModal?: (tab: 'privacy' | 'terms' | 'cookies') => void;
}

const CONTACT_HERO_IMAGE = {
  url: '/contacto-banner.jpg',
  alt: 'Centro de Atención y Asesoría Notarial - Sociedad Civil MGM Inmobiliaria',
};

const sanitizeInput = (text: string) => {
  if (typeof text !== 'string') return '';
  return text
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim();
};

export function ContactView({ onOpenLegalModal }: ContactViewProps) {
  const { banners } = useSiteBanners();
  const { settings } = useSiteSettings();
  const contactBanner = banners.contacto;

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    categoria: 'Ciudadela Miravalle',
    mensaje: '',
    honeypot: '',
  });
  const [acceptedConsent, setAcceptedConsent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verificación de trampa Honeypot anti-spam
    if (formData.honeypot) {
      return;
    }

    const cleanNombre = sanitizeInput(formData.nombre);
    const cleanTelefono = sanitizeInput(formData.telefono);
    const cleanMensaje = sanitizeInput(formData.mensaje);

    if (cleanNombre.length < 3) {
      setErrorMsg('Por favor, ingresa un nombre válido (mínimo 3 caracteres).');
      return;
    }

    const phoneRegex = /^[0-9+-\s()]{7,15}$/;
    if (!phoneRegex.test(cleanTelefono)) {
      setErrorMsg('Por favor, ingresa un número de teléfono válido.');
      return;
    }

    if (!acceptedConsent) {
      setErrorMsg('Debes aceptar la Política de Privacidad y el tratamiento de datos para continuar.');
      return;
    }

    setIsSent(true);

    const waPhone = formatPhoneForWhatsApp(settings.supportPhone);
    const textoMsg = `Hola ${settings.companyName}, mi nombre es ${cleanNombre}. Mi número es ${cleanTelefono}. Me interesa: ${formData.categoria}. Consulta: ${cleanMensaje}`;
    const urlWa = `https://wa.me/${waPhone}?text=${encodeURIComponent(textoMsg)}`;

    setTimeout(() => {
      window.open(urlWa, '_blank');
    }, 350);
  };

  const gpsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${settings.hqLat},${settings.hqLng}`;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${settings.hqLat},${settings.hqLng}&hl=es&z=16&output=embed`;
  const telHref = `tel:${formatPhoneForTel(settings.supportPhone)}`;

  return (
    <div className="min-h-screen bg-[#FBFBFA] font-sans pb-16">
      {/* =========================================================================
          HERO BANNER DE CONTACTO — FULL BLEED EDGE-TO-EDGE
          ========================================================================= */}
      <section className="group/hero relative w-full bg-slate-950 text-white overflow-hidden min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex flex-col justify-center select-none pt-24 sm:pt-28 pb-16 sm:pb-20">
        {/* Fotografía de Contacto Panorámica de Ancho Completo */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={contactBanner.image || CONTACT_HERO_IMAGE.url}
            alt={contactBanner.alt || CONTACT_HERO_IMAGE.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover transform transition-transform duration-1000 ease-out hover:scale-105"
            style={{
              objectPosition: `${contactBanner.bgPositionX ?? 50}% ${contactBanner.bgPositionY ?? 50}%`,
              transform: (contactBanner.bgZoom ?? 100) > 100 ? `scale(${(contactBanner.bgZoom ?? 100) / 100})` : undefined,
              transformOrigin: 'center center',
            }}
            referrerPolicy="no-referrer"
          />

          {/* Degradados cinematográficos neutros para máxima legibilidad editorial del texto */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 sm:via-black/50 to-black/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/35 pointer-events-none" />
        </div>

        {/* CONTENIDO EDITORIAL */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-3xl lg:max-w-4xl flex flex-col items-start text-left select-text cursor-default">
            <ScrollReveal direction="down" delay={0.05} duration={0.65}>
              <AnimatedInsignia className="scale-85 sm:scale-95" size={42} />
            </ScrollReveal>

            <ScrollReveal direction="down" delay={0.15} duration={0.7}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mt-4 sm:mt-5 drop-shadow-md">
                {contactBanner.titleLine1}{' '}
                <span className="text-[#F58220] inline-block">
                  {contactBanner.titleHighlight1}
                </span>{' '}
                {contactBanner.titleHighlight2}
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.25} duration={0.65}>
              <p className="text-sm sm:text-base lg:text-xl text-slate-200 leading-relaxed font-normal max-w-2xl mt-4 sm:mt-6 drop-shadow-xs">
                {contactBanner.description}
              </p>
            </ScrollReveal>

            {/* Botón CTA: Cotizar directo */}
            <ScrollReveal direction="zoom" delay={0.35} duration={0.6}>
              <div className="pt-4">
                <a
                  href={getGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-[#25D366]/30 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
                >
                  <WhatsAppIcon size={20} className="text-slate-950" />
                  <span>Cotizar</span>
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN PRINCIPAL DE FORMULARIO Y DATOS DE CONTACTO
          ========================================================================= */}
      <section className="pt-10 sm:pt-14 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            {/* Columna Izquierda: Formulario Estilo Píldora Moderno */}
            <ScrollReveal direction="left" delay={0.1} className="flex flex-col">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-sans mb-1.5">
                  Envíanos un mensaje
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Completa los campos a continuación y te responderemos a la brevedad.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-2xl font-medium">
                  {errorMsg}
                </div>
              )}

              {isSent ? (
                <div className="p-8 bg-white rounded-3xl border border-emerald-200 shadow-md text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#22A33D] mx-auto flex items-center justify-center">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    ¡Mensaje pre-cargado en WhatsApp!
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto">
                    Se ha abierto la línea directa de WhatsApp con un asesor oficial de {settings.companyName}.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSent(false);
                      setFormData({
                        nombre: '',
                        telefono: '',
                        categoria: 'Ciudadela Miravalle',
                        mensaje: '',
                        honeypot: '',
                      });
                    }}
                    className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-[#F58220] transition-colors cursor-pointer"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Campo Trampa Honeypot */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="honeypot">Website</label>
                    <input
                      type="text"
                      id="honeypot"
                      name="honeypot"
                      value={formData.honeypot}
                      onChange={handleChange}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Input Nombre */}
                  <div className="relative flex items-center bg-transparent border-b-2 border-gray-300 hover:border-gray-400 focus-within:border-[#22A33D] transition-colors px-1 py-3">
                    <div className="text-[#22A33D] mr-3 flex-shrink-0">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      className="w-full bg-transparent text-sm text-slate-900 placeholder:text-gray-400 focus:outline-none"
                      placeholder="Nombre completo *"
                    />
                  </div>

                  {/* Input Teléfono / WhatsApp */}
                  <div className="relative flex items-center bg-transparent border-b-2 border-gray-300 hover:border-gray-400 focus-within:border-[#22A33D] transition-colors px-1 py-3">
                    <div className="text-[#22A33D] mr-3 flex-shrink-0">
                      <Phone size={18} />
                    </div>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                      maxLength={20}
                      className="w-full bg-transparent text-sm text-slate-900 placeholder:text-gray-400 focus:outline-none"
                      placeholder="Teléfono / WhatsApp *"
                    />
                  </div>

                  {/* Select Línea de Interés / Proyecto */}
                  <div className="relative flex items-center bg-transparent border-b-2 border-gray-300 hover:border-gray-400 focus-within:border-[#22A33D] transition-colors px-1 py-3">
                    <div className="text-[#22A33D] mr-3 flex-shrink-0">
                      <Layers size={18} />
                    </div>
                    <select
                      id="categoria"
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      className="w-full bg-transparent text-sm text-slate-900 focus:outline-none appearance-none cursor-pointer pr-8"
                    >
                      <option value="Ciudadela Miravalle">Ciudadela Miravalle (Lotes Residenciales) 🏡</option>
                      <option value="Lotes Comerciales">Lotes Comerciales & Esquineros 🏢</option>
                      <option value="Crédito Directo">Crédito Directo Propio (Sin banco) 💳</option>
                      <option value="Revisión Notarial">Revisión Notarial de Escrituras 📜</option>
                      <option value="Información General">Información General de Propiedades 📋</option>
                    </select>
                    <ChevronDown size={16} className="text-gray-400 pointer-events-none absolute right-1" />
                  </div>

                  {/* Textarea Mensaje */}
                  <div className="relative flex items-start bg-transparent border-b-2 border-gray-300 hover:border-gray-400 focus-within:border-[#22A33D] transition-colors px-1 py-3">
                    <div className="text-[#22A33D] mr-3 mt-1 flex-shrink-0">
                      <MessageSquare size={18} />
                    </div>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      required
                      maxLength={1000}
                      rows={3}
                      className="w-full bg-transparent text-sm text-slate-900 placeholder:text-gray-400 focus:outline-none resize-none"
                      placeholder="¿En qué podemos asesorarte? *"
                    />
                  </div>

                  {/* Consentimiento LOPDP / RGPD */}
                  <div className="pt-1 flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="consentimiento-privacidad"
                      checked={acceptedConsent}
                      onChange={(e) => {
                        setAcceptedConsent(e.target.checked);
                        if (errorMsg) setErrorMsg('');
                      }}
                      required
                      aria-required="true"
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-[#22A33D] focus:ring-[#22A33D] cursor-pointer"
                    />
                    <label htmlFor="consentimiento-privacidad" className="text-xs text-slate-600 leading-snug cursor-pointer select-none">
                      He leído y acepto la{' '}
                      <button
                        type="button"
                        onClick={() => onOpenLegalModal ? onOpenLegalModal('privacy') : null}
                        className="text-[#113d22] font-bold underline hover:text-[#22A33D] inline"
                      >
                        Política de Privacidad
                      </button>{' '}
                      y el tratamiento confidencial de mis datos personales para ser contactado.
                    </label>
                  </div>

                  {/* Botón de Envío Pill con hover naranja MGM */}
                  <button
                    type="submit"
                    className="w-full bg-[#113d22] hover:bg-[#F58220] text-white font-bold py-3.5 sm:py-4 rounded-full shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider cursor-pointer mt-1"
                  >
                    <span>Enviar Mensaje</span>
                    <Send size={15} />
                  </button>
                </form>
              )}

              {/* Canales de Contacto en Redes Sociales */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <span className="text-xs font-semibold text-slate-600">
                  O contáctanos directamente en redes:
                </span>
                <div className="flex items-center gap-5">
                  <a
                    href={getGeneralWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp MGM Inmobiliaria"
                    className="text-[#25D366] hover:text-[#20bd5a] hover:scale-115 transition-all cursor-pointer"
                  >
                    <WhatsAppIcon size={26} />
                  </a>

                  <a
                    href="https://www.facebook.com/mgm.avaluos.5"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook MGM Inmobiliaria"
                    className="text-[#1877F2] hover:text-[#1464cc] hover:scale-115 transition-all cursor-pointer"
                  >
                    <FacebookIcon size={26} />
                  </a>

                  <a
                    href="https://www.instagram.com/mgminmobiliariaec/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram MGM Inmobiliaria"
                    className="text-[#E4405F] hover:text-[#d02d4c] hover:scale-115 transition-all cursor-pointer"
                  >
                    <InstagramIcon size={26} />
                  </a>

                  <a
                    href="https://www.tiktok.com/@mgm_inmobiliaria"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok MGM Inmobiliaria"
                    className="text-slate-800 hover:text-black hover:scale-115 transition-all cursor-pointer"
                  >
                    <TikTokIcon size={26} />
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Columna Derecha: Barra de Dirección + Mapa + Información Sincronizada con Admin */}
            <ScrollReveal direction="right" delay={0.2} className="flex flex-col space-y-5">
              {/* Barra Independiente de Ubicación Encima del Mapa */}
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -2, boxShadow: '0 12px 30px -8px rgba(17,61,34,0.12)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="w-full bg-white rounded-2xl sm:rounded-full px-5 sm:px-6 py-3.5 sm:py-4 shadow-sm border border-gray-200/80 hover:border-[#22A33D]/40 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group cursor-default"
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 rounded-full bg-emerald-500/25 blur-md opacity-40 group-hover:opacity-100 transition-opacity duration-500 scale-150 pointer-events-none" />
                    <MapPin
                      size={26}
                      strokeWidth={2.2}
                      className="text-[#22A33D] relative z-10 filter drop-shadow-[0_0_6px_rgba(17,61,34,0.3)] group-hover:drop-shadow-[0_0_14px_rgba(34,163,61,0.9)] transition-all duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight group-hover:text-[#22A33D] transition-colors">
                      {settings.hqTitle}
                    </h3>
                    <p className="text-xs text-gray-600 leading-snug mt-0.5">
                      {settings.hqAddress}
                    </p>
                  </div>
                </div>

                <a
                  href={gpsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#F58220] hover:text-[#ea580c] transition-all mt-1 sm:mt-0 group/link shrink-0"
                >
                  <Navigation
                    size={14}
                    className="text-[#F58220] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200"
                  />
                  <span className="group-hover/link:underline">Cómo llegar en GPS</span>
                  <ExternalLink size={12} className="group-hover/link:opacity-80 transition-opacity" />
                </a>
              </motion.div>

              {/* Contenedor del Mapa Interactivo conectado a las coordenadas de la Sede del Admin */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 p-2 sm:p-3 relative group">
                <div className="relative w-full h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden shadow-inner">
                  <iframe
                    key={`${settings.hqLat}-${settings.hqLng}`}
                    src={mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Ubicación Exacta ${settings.hqTitle}`}
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Información de Contacto - Reflejada desde el Panel Administrativo */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
                }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2"
              >
                {/* Sede Principal */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.88, y: 20 },
                    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
                  }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/80 transition-colors group cursor-default"
                >
                  <div className="relative flex-shrink-0 mt-0.5">
                    <div className="absolute inset-0 rounded-full bg-[#22A33D]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150 pointer-events-none" />
                    <Building2
                      size={28}
                      strokeWidth={2.2}
                      className="text-[#22A33D] relative z-10 filter drop-shadow-[0_0_6px_rgba(17,61,34,0.3)] group-hover:drop-shadow-[0_0_14px_rgba(34,163,61,0.85)] transition-all duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-0.5">Sede Principal</h4>
                    <p className="text-xs text-[#22A33D] font-semibold mb-0.5">
                      {settings.companyName}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {settings.hqAddress}
                    </p>
                  </div>
                </motion.div>

                {/* Horario de Atención */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.88, y: 20 },
                    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
                  }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/80 transition-colors group cursor-default"
                >
                  <div className="relative flex-shrink-0 mt-0.5">
                    <div className="absolute inset-0 rounded-full bg-[#F58220]/25 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150 pointer-events-none" />
                    <Clock
                      size={28}
                      strokeWidth={2.2}
                      className="text-[#F58220] relative z-10 filter drop-shadow-[0_0_6px_rgba(245,130,32,0.35)] group-hover:drop-shadow-[0_0_14px_rgba(245,130,32,0.9)] transition-all duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-0.5">Horario de Atención</h4>
                    <p className="text-xs text-gray-700 font-medium leading-relaxed">
                      {settings.businessHours}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Atención personalizada y asesoría notarial
                    </p>
                  </div>
                </motion.div>

                {/* Teléfono Directo */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.88, y: 20 },
                    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
                  }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/80 transition-colors group cursor-default"
                >
                  <div className="relative flex-shrink-0 mt-0.5">
                    <div className="absolute inset-0 rounded-full bg-[#22A33D]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150 pointer-events-none" />
                    <Phone
                      size={28}
                      strokeWidth={2.2}
                      className="text-[#22A33D] relative z-10 filter drop-shadow-[0_0_6px_rgba(17,61,34,0.3)] group-hover:drop-shadow-[0_0_14px_rgba(34,163,61,0.85)] transition-all duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-0.5">Teléfono Directo</h4>
                    <a
                      href={telHref}
                      className="text-sm font-bold text-slate-900 hover:text-[#F58220] transition-colors block"
                    >
                      {settings.supportPhone}
                    </a>
                    <p className="text-[11px] text-gray-500">Llamadas y WhatsApp Oficial</p>
                  </div>
                </motion.div>

                {/* Correo Electrónico */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.88, y: 20 },
                    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
                  }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/80 transition-colors group cursor-default"
                >
                  <div className="relative flex-shrink-0 mt-0.5">
                    <div className="absolute inset-0 rounded-full bg-[#F58220]/25 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150 pointer-events-none" />
                    <Mail
                      size={28}
                      strokeWidth={2.2}
                      className="text-[#F58220] relative z-10 filter drop-shadow-[0_0_6px_rgba(245,130,32,0.35)] group-hover:drop-shadow-[0_0_14px_rgba(245,130,32,0.9)] transition-all duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-0.5">Correo Electrónico</h4>
                    <a
                      href={`mailto:${settings.supportEmail}`}
                      className="text-xs text-gray-600 hover:text-[#F58220] transition-colors break-all font-medium"
                    >
                      {settings.supportEmail}
                    </a>
                  </div>
                </motion.div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
