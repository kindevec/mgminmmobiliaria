'use client';

import React, { useState } from 'react';
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
  CalendarCheck2,
  CheckCircle2,
} from 'lucide-react';
import { WHATSAPP_PHONE } from '@/src/data/lots';
import { WhatsAppIcon } from '../SocialIcons';

interface ContactViewProps {
  onOpenVisitModal: (defaultInterest?: string) => void;
}

const sanitizeInput = (text: string) => {
  if (typeof text !== 'string') return '';
  return text
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim();
};

export function ContactView({ onOpenVisitModal }: ContactViewProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    categoria: 'Ciudadela Miravalle',
    mensaje: '',
    honeypot: '',
  });
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

    setIsSent(true);

    const textoMsg = `Hola Sociedad Civil MGM Inmobiliaria, mi nombre es ${cleanNombre}. Mi número es ${cleanTelefono}. Me interesa: ${formData.categoria}. Consulta: ${cleanMensaje}`;
    const urlWa = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(textoMsg)}`;

    setTimeout(() => {
      window.open(urlWa, '_blank');
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] font-sans pb-16">
      {/* =========================================================================
          HERO BANNER DE CONTACTO (ESTILO AOVET ADAPTADO A PALETA MGM)
          ========================================================================= */}
      <section className="relative flex flex-col justify-center bg-gray-900 pt-20 pb-24 md:pb-36 overflow-hidden h-[540px] sm:h-[620px] md:h-[680px] lg:h-[720px] min-h-[540px] md:min-h-[620px] lg:min-h-[700px]">
        {/* Background image + dark corporate overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=85')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#113d22]/85 via-black/55 to-[#113d22]/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col justify-center pt-24 sm:pt-16 md:pt-14 pb-16 sm:pb-24">
          {/* Insignia arquitectónica animada en SVG (Paleta Logo MGM: Naranja #F58220 y Verde #22A33D) */}
          <div className="mb-4 sm:mb-6 flex justify-center w-full translate-y-3 sm:-translate-y-4 md:-translate-y-6">
            <motion.svg
              width="80"
              height="90"
              viewBox="0 0 80 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              initial="hidden"
              animate="visible"
            >
              {/* Techo exterior - Naranja MGM (#F58220) */}
              <motion.path
                d="M10 52 L40 20 L70 52"
                stroke="#F58220"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={{
                  hidden: { pathLength: 0, opacity: 0 },
                  visible: {
                    pathLength: 1,
                    opacity: 1,
                    transition: { duration: 1.4, ease: 'easeInOut' },
                  },
                }}
              />
              {/* Techo interior - Verde MGM (#22A33D) */}
              <motion.path
                d="M22 60 L40 40 L58 60"
                stroke="#22A33D"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={{
                  hidden: { pathLength: 0, opacity: 0 },
                  visible: {
                    pathLength: 1,
                    opacity: 1,
                    transition: { duration: 1.2, delay: 0.3, ease: 'easeInOut' },
                  },
                }}
              />
              {/* Línea base - Naranja MGM (#F58220) */}
              <motion.path
                d="M16 72 L64 72"
                stroke="#F58220"
                strokeWidth="3"
                strokeLinecap="round"
                variants={{
                  hidden: { pathLength: 0, opacity: 0 },
                  visible: {
                    pathLength: 1,
                    opacity: 1,
                    transition: { duration: 0.8, delay: 0.8, ease: 'easeOut' },
                  },
                }}
              />
            </motion.svg>
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } } }}
            className="w-full"
          >
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 35, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: 'spring', stiffness: 110, damping: 12, duration: 0.8 },
                },
              }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-sans text-center leading-[1.12] tracking-tight mb-4 sm:mb-6 antialiased cursor-default select-none mx-auto max-w-5xl translate-y-2 sm:-translate-y-4 md:-translate-y-6 drop-shadow-2xl"
            >
              <span className="text-white">Ponte en </span>
              <motion.span className="text-[#F58220] inline-block drop-shadow-[0_4px_20px_rgba(245,130,32,0.65)] [text-shadow:_0_2px_14px_rgba(245,130,32,0.85)]">
                Contacto
              </motion.span>
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
              className="text-base sm:text-lg md:text-xl text-white/95 font-medium max-w-2xl mx-auto text-center mb-8 sm:mb-10 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] [text-shadow:_0_1px_8px_rgba(0,0,0,0.85)] translate-y-2 sm:-translate-y-4 md:-translate-y-6"
            >
              Estamos listos para atenderte. Comunícate con nuestro equipo técnico, legal y comercial
              para agendamiento de visitas, cotizaciones de lotes y asesoría notarial personalizada.
            </motion.p>

            {/* Botones CTA estilo AOVET: Verde WhatsApp + Naranja Llamada */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 12, stiffness: 100 } },
              }}
              className="flex flex-wrap gap-3 sm:gap-4 justify-center items-center w-full sm:w-auto mx-auto translate-y-1 sm:-translate-y-2 md:-translate-y-4"
            >
              <a
                href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
                  'Hola Sociedad Civil MGM Inmobiliaria, deseo información y asesoría sobre los lotes disponibles.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:py-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <WhatsAppIcon size={20} className="text-slate-950" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`tel:+${WHATSAPP_PHONE}`}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:py-4 rounded-full bg-[#F58220] hover:bg-[#ea580c] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-orange-600/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Phone size={18} />
                <span>Llamar a Asesor</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          SECCIÓN PRINCIPAL DE FORMULARIO Y DATOS DE CONTACTO (ESTILO AOVET)
          ========================================================================= */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            {/* Columna Izquierda: Formulario Estilo Píldora Moderno */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col"
            >
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
                    Se ha abierto la línea directa de WhatsApp con un asesor oficial de Sociedad Civil MGM Inmobiliaria.
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

                  {/* Input Nombre (Pill) */}
                  <div className="relative flex items-center bg-white rounded-full border border-gray-200 shadow-sm px-4 sm:px-5 py-3 sm:py-3.5 focus-within:ring-2 focus-within:ring-[#22A33D] focus-within:border-transparent transition-all">
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
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-gray-400 focus:outline-none"
                      placeholder="Nombre completo *"
                    />
                  </div>

                  {/* Input Teléfono / WhatsApp (Pill) */}
                  <div className="relative flex items-center bg-white rounded-full border border-gray-200 shadow-sm px-4 sm:px-5 py-3 sm:py-3.5 focus-within:ring-2 focus-within:ring-[#22A33D] focus-within:border-transparent transition-all">
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
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-gray-400 focus:outline-none"
                      placeholder="Teléfono / WhatsApp *"
                    />
                  </div>

                  {/* Select Línea de Interés / Proyecto (Pill) */}
                  <div className="relative flex items-center bg-white rounded-full border border-gray-200 shadow-sm px-4 sm:px-5 py-3 sm:py-3.5 focus-within:ring-2 focus-within:ring-[#22A33D] focus-within:border-transparent transition-all">
                    <div className="text-[#22A33D] mr-3 flex-shrink-0">
                      <Layers size={18} />
                    </div>
                    <select
                      id="categoria"
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-900 focus:outline-none appearance-none cursor-pointer pr-4"
                    >
                      <option value="Ciudadela Miravalle">Ciudadela Miravalle (Lotes Residenciales) 🏡</option>
                      <option value="Lotes Comerciales">Lotes Comerciales & Esquineros 🏢</option>
                      <option value="Crédito Directo">Crédito Directo Propio (Sin banco) 💳</option>
                      <option value="Revisión Notarial">Revisión Notarial de Escrituras 📜</option>
                      <option value="Visita a Obra">Visita Guiada en Terreno con Transporte 🚗</option>
                    </select>
                  </div>

                  {/* Textarea Mensaje (Rounded 3xl Pill) */}
                  <div className="relative flex items-start bg-white rounded-3xl border border-gray-200 shadow-sm px-4 sm:px-5 py-3.5 focus-within:ring-2 focus-within:ring-[#22A33D] focus-within:border-transparent transition-all">
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
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-gray-400 focus:outline-none resize-none"
                      placeholder="¿En qué podemos asesorarte? *"
                    />
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
            </motion.div>

            {/* Columna Derecha: Barra de Dirección + Mapa + Información con Animaciones e Iconos Iluminados */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col space-y-5"
            >
              {/* Barra Independiente de Ubicación Encima del Mapa con Animación */}
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
                    {/* Efecto de Iluminación Ambiental y Pulso Suave */}
                    <div className="absolute inset-0 rounded-full bg-emerald-500/25 blur-md opacity-40 group-hover:opacity-100 transition-opacity duration-500 scale-150 pointer-events-none" />
                    <MapPin
                      size={26}
                      strokeWidth={2.2}
                      className="text-[#22A33D] relative z-10 filter drop-shadow-[0_0_6px_rgba(17,61,34,0.3)] group-hover:drop-shadow-[0_0_14px_rgba(34,163,61,0.9)] transition-all duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight group-hover:text-[#22A33D] transition-colors">
                      MGM Inmobiliaria · Miravalle
                    </h3>
                    <p className="text-xs text-gray-600 leading-snug mt-0.5">
                      Vía Principal Ciudadela Miravalle, Azuay, Ecuador
                    </p>
                  </div>
                </div>

                <a
                  href="https://maps.google.com/?q=Ciudadela+Miravalle+Ecuador"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#F58220] hover:text-[#ea580c] transition-all mt-1 sm:mt-0 group/link"
                >
                  <Navigation
                    size={14}
                    className="text-[#F58220] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200"
                  />
                  <span className="group-hover/link:underline">Cómo llegar en GPS</span>
                  <ExternalLink size={12} className="group-hover/link:opacity-80 transition-opacity" />
                </a>
              </motion.div>

              {/* Contenedor del Mapa Interactivo (Limpio) */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 p-2 sm:p-3 relative group">
                <div className="relative w-full h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden shadow-inner">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127672.48425265487!2d-78.5833!3d-0.2298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d59a4002422c9f%3A0x44b44695079a76f5!2sQuito%2C%20Ecuador!5e0!3m2!1ses!2sec!4v1700000000000!5m2!1ses!2sec"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación Exacta Ciudadela Miravalle"
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Información de Contacto - Alternancia Verde & Naranja MGM con Efecto Glow */}
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
                {/* Sede Principal (Verde MGM #22A33D) */}
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
                      Sociedad Civil MGM Inmobiliaria
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Ciudadela Miravalle<br />Azuay, Ecuador.
                    </p>
                  </div>
                </motion.div>

                {/* Horario de Atención (Naranja Cálido MGM #F58220) */}
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
                      Lunes a Viernes: 8:30 – 18:00
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Sábados: 9:00 – 14:00 (Domingos previa cita)
                    </p>
                  </div>
                </motion.div>

                {/* Teléfono Directo (Verde MGM #22A33D) */}
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
                      href="tel:+593984887434"
                      className="text-sm font-bold text-slate-900 hover:text-[#F58220] transition-colors block"
                    >
                      098 488 7434
                    </a>
                    <p className="text-[11px] text-gray-500">+593 99 924 7434</p>
                  </div>
                </motion.div>

                {/* Correo Electrónico (Naranja Cálido MGM #F58220) */}
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
                      href="mailto:info@mgminmobiliaria.ec"
                      className="text-xs text-gray-600 hover:text-[#F58220] transition-colors break-all font-medium"
                    >
                      info@mgminmobiliaria.ec
                    </a>
                  </div>
                </motion.div>
              </motion.div>

              {/* Botón Acción Rápida: Modal de Visita Presencial (Naranja Corporativo MGM) */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onOpenVisitModal('Ciudadela Miravalle')}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-full bg-[#F58220] hover:bg-[#ea580c] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-orange-500/25 transition-all cursor-pointer whitespace-nowrap active:scale-95"
                >
                  <CalendarCheck2 className="h-4 w-4" />
                  <span>Agendar Visita en Terreno con Transporte</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
