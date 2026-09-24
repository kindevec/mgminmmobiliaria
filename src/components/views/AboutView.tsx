'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Building2,
  FileCheck2,
  Scale,
  Award,
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  MapPin,
  FileText,
  BadgeCheck,
  Users,
} from 'lucide-react';
import type { PageView } from '../Header';
import { getGeneralWhatsAppUrl } from '@/src/data/lots';
import { WhatsAppIcon } from '../SocialIcons';
import { WaveDarkToCream, WaveCreamToDark, TopographicContours } from '../WaveDividers';

interface AboutViewProps {
  onNavigate: (page: PageView) => void;
  onOpenVisitModal: (defaultInterest?: string) => void;
}

const COMMITMENT_GALLERY = [
  {
    title: 'Villas & Residencias Modelo',
    tag: '+10 Años de Trayectoria',
    caption: 'Compromiso de entrega notarial y acompañamiento legal permanente.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Avenidas Principales Adoquinadas',
    tag: 'Obras Viales 100% Concluidas',
    caption: 'Calzadas de 10 y 12 metros con bordillos y ductería subterránea.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Complejo Polideportivo & Parques',
    tag: '8.000 m² Áreas Verdes',
    caption: 'Canchas múltiples, iluminación LED y cerramiento perimetral de seguridad.',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Lotes Urbanizados Georreferenciados',
    tag: 'Escrituras Individuales',
    caption: 'Planos catastrales individuales aprobados y listos para escrituración.',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
  },
];

export function AboutView({ onNavigate, onOpenVisitModal }: AboutViewProps) {
  const [activeCommitmentIndex, setActiveCommitmentIndex] = useState(0);
  return (
    <div className="w-full overflow-hidden bg-white text-slate-900">
      {/* =========================================================================
          1. CINEMATIC HERO BANNER
          ========================================================================= */}
      <section className="relative w-full min-h-[560px] md:min-h-[640px] lg:min-h-[700px] flex flex-col justify-between overflow-hidden bg-slate-950 text-white">
        {/* Background Image with subtle zoom */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <Image
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2160&q=90"
            alt="Solidez Notarial y Urbanismo MGM Inmobiliaria"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.82]"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Gradient Contrast Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center pt-28 sm:pt-32 pb-8">
          <div className="max-w-4xl space-y-5">


            {/* High-Impact Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] [text-wrap:balance]">
              Solidez, transparencia y{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 font-serif italic font-normal">
                certeza jurídica
              </span>{' '}
              en cada metro cuadrado.
            </h1>

            {/* Narrative Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl leading-relaxed drop-shadow-sm">
              Somos una entidad inmobiliaria ecuatoriana constituida para transformar terrenos de alta vocación residencial en comunidades planificadas con obras concluidas, saneamiento legal definitivo y crédito directo.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onOpenVisitModal('Asesoría Notarial e Institucional')}
                className="px-6 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-[#25D366] text-slate-950 font-black text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-xl flex items-center gap-2 cursor-pointer"
              >
                <CalendarCheck2 className="h-4 w-4 stroke-[2.5]" />
                <span>Agendar Asesoría Notarial</span>
              </button>
              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm backdrop-blur-md border border-white/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <WhatsAppIcon size={16} />
                <span>Hablar con un Directivo</span>
              </a>
            </div>
          </div>
        </div>

        {/* Transition to Content */}
        <WaveDarkToCream fillColor="#FFFFFF" />
      </section>

      {/* =========================================================================
          2. SECCIÓN: COMPROMISO ÉTICO & NOTARIAL (Diseño de Estudio con Máscaras)
          ========================================================================= */}
      <section className="relative w-full bg-white text-slate-900 py-16 sm:py-24 overflow-hidden border-b border-slate-100">
        {/* Ambient Topographic & Architectural Mask over section canvas */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]">
            <TopographicContours className="text-emerald-900/15" />
          </div>
          <Image
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80"
            alt="Planimetría y Arquitectura"
            fill
            sizes="100vw"
            className="object-cover opacity-[0.035] brightness-90 [mask-image:radial-gradient(ellipse_at_top_right,black_20%,transparent_70%)]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -top-24 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Enlarged Featured Architectural Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 w-full flex justify-center"
            >
              <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] min-h-[380px] sm:min-h-[480px] lg:min-h-[560px] w-full rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border-4 sm:border-[6px] border-white bg-slate-900 ring-1 ring-slate-900/10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCommitmentIndex}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={COMMITMENT_GALLERY[activeCommitmentIndex].image}
                      alt={COMMITMENT_GALLERY[activeCommitmentIndex].title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover"
                      priority
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 text-white pointer-events-none">
                      <span className="text-[11px] font-mono font-bold text-amber-300 bg-black/60 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 inline-block mb-2 shadow-sm">
                        {COMMITMENT_GALLERY[activeCommitmentIndex].tag}
                      </span>
                      <h4 className="text-lg sm:text-2xl font-black text-white leading-tight">
                        {COMMITMENT_GALLERY[activeCommitmentIndex].title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-200 drop-shadow-sm font-medium mt-1 line-clamp-2 max-w-lg">
                        {COMMITMENT_GALLERY[activeCommitmentIndex].caption}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Right Column: Narrative, 3 Metrics & 4 Thumbnails */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 flex flex-col justify-center space-y-6 sm:space-y-8"
            >
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 block">
                  NUESTRO PROPÓSITO INSTITUCIONAL
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-black text-slate-900 tracking-tight leading-[1.12] [text-wrap:balance]">
                  Nuestro Compromiso Ético y{' '}
                  <span className="font-serif italic font-normal text-amber-900">
                    Notarial con el Ecuador
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  <strong className="text-slate-900 font-bold">Sociedad Civil MGM Inmobiliaria</strong> nació para erradicar la incertidumbre en la adquisición de tierras, desarrollando proyectos con levantamientos topográficos georreferenciados, obras concluidas y escrituras individuales protocolizadas ante Notario Público e inscritas en el Registro de la Propiedad.
                </p>
              </div>

              {/* 3 Metrics Badges Ribbon in a horizontal row */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 py-3 border-y border-slate-200/80">
                <div className="flex flex-col items-start gap-1.5 py-1">
                  <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-xs">
                    <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg lg:text-xl font-black text-slate-900 font-mono tracking-tight">
                      +10 Años
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight">
                      Trayectoria
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-1.5 py-1">
                  <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-xs">
                    <FileCheck2 className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg lg:text-xl font-black text-slate-900 font-mono tracking-tight">
                      100%
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight">
                      Escrituras
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-1.5 py-1">
                  <div className="h-9 w-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 shadow-xs">
                    <Award className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg lg:text-xl font-black text-slate-900 font-mono tracking-tight">
                      +300
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight">
                      Familias
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Interactive Gallery Thumbnails */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Explora Nuestras Obras y Entorno Real:
                </span>
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {COMMITMENT_GALLERY.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveCommitmentIndex(idx)}
                      className={`group relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2 bg-slate-900 ${
                        activeCommitmentIndex === idx
                          ? 'border-emerald-600 ring-2 ring-emerald-500/40 shadow-lg scale-105'
                          : 'border-white shadow-xs hover:shadow-md opacity-80 hover:opacity-100 hover:scale-102'
                      }`}
                      aria-label={`Ver imagen: ${item.title}`}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 25vw, 15vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div
                        className={`absolute inset-0 transition-opacity ${
                          activeCommitmentIndex === idx
                            ? 'bg-black/0'
                            : 'bg-black/25 group-hover:bg-black/0'
                        }`}
                      />
                      {activeCommitmentIndex === idx && (
                        <div className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-400 shadow-sm" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. PILARES FUNDACIONALES (Luminoso & Arquitectónico)
          ========================================================================= */}
      <section className="relative w-full bg-[#FBFBFA] text-slate-900 py-16 sm:py-24 overflow-hidden border-y border-slate-100">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block">
              VALORES FUNDACIONALES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight [text-wrap:balance]">
              Los Pilares que Sostienen Cada Proyecto
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Trabajamos bajo estándares rigurosos de honestidad contractual, solvencia técnica y responsabilidad social comunitaria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              whileHover={{ y: -6 }}
              className="p-8 rounded-3xl bg-white border border-slate-200/90 space-y-4 hover:border-emerald-500/40 transition-all shadow-md hover:shadow-xl"
            >
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Transparencia Notarial</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Toda la documentación legal de nuestras urbanizaciones está abierta y a disposición de los clientes antes de firmar cualquier compromiso económico.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              whileHover={{ y: -6 }}
              className="p-8 rounded-3xl bg-white border border-slate-200/90 space-y-4 hover:border-amber-500/40 transition-all shadow-md hover:shadow-xl"
            >
              <div className="h-14 w-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                <Award className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Cumplimiento de Obra</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                No vendemos ilusiones ni planos en papel: entregamos vías concluidas, alcantarillado instalado y obras de urbanismo palpables en el terreno.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -6 }}
              className="p-8 rounded-3xl bg-white border border-slate-200/90 space-y-4 hover:border-teal-500/40 transition-all shadow-md hover:shadow-xl"
            >
              <div className="h-14 w-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <Building2 className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Financiamiento Justo</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Crédito directo con la urbanizadora hasta 48 meses. Sin trámites bancarios complejos ni historial crediticio excluyente.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. PROCESO DE ADQUISICIÓN PASO A PASO (01 - 04 - Blanco Puro)
          ========================================================================= */}
      <section className="relative w-full bg-white text-slate-900 py-16 sm:py-24 overflow-hidden border-b border-slate-100">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-14 space-y-2"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
              ACOMPAÑAMIENTO INTEGRAL
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Ruta de Adquisición Segura en 4 Pasos
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Proceso transparente desde tu primer contacto hasta la protocolización definitiva.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0 }}
              className="p-6 rounded-3xl bg-[#FBFBFA] border border-slate-200/80 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 font-mono">
                  Paso 01
                </span>
                <MapPin className="h-4 w-4 text-emerald-700" />
              </div>
              <h4 className="text-base font-black text-slate-900">Elección & Visita en Terreno</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Recorremos el terreno contigo verificando linderos, estacas georreferenciadas, servicios y orientación solar.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="p-6 rounded-3xl bg-[#FBFBFA] border border-slate-200/80 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 font-mono">
                  Paso 02
                </span>
                <FileText className="h-4 w-4 text-emerald-700" />
              </div>
              <h4 className="text-base font-black text-slate-900">Reserva & Plan Directo</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bloqueamos el predio a tu nombre, congelamos el precio pactado y acordamos cuotas mensuales fijas sin bancos.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="p-6 rounded-3xl bg-[#FBFBFA] border border-slate-200/80 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 font-mono">
                  Paso 03
                </span>
                <Scale className="h-4 w-4 text-emerald-700" />
              </div>
              <h4 className="text-base font-black text-slate-900">Promesa Notarial & Posesión</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Suscripción formal de la promesa de compraventa con reconocimiento notarial e ingreso para posesión inmediata.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="p-6 rounded-3xl bg-[#FBFBFA] border border-slate-200/80 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 font-mono">
                  Paso 04
                </span>
                <BadgeCheck className="h-4 w-4 text-emerald-700" />
              </div>
              <h4 className="text-base font-black text-slate-900">Escritura Definitiva</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Protocolización de la escritura individual definitiva en Notaría e inscripción ante el Registro de la Propiedad.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. PANORAMIC BOTTOM CTA (Luminoso)
          ========================================================================= */}
      <section className="relative w-full bg-[#FBFBFA] text-slate-900 py-16 sm:py-20 overflow-hidden">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
            <div className="space-y-2 max-w-xl text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                ATENCIÓN PERSONALIZADA
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                ¿Deseas examinar la documentación jurídica?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Agendamos una reunión con nuestro equipo notarial para que revises planos catastrales, certificados de gravámenes y licencias de urbanismo con total transparencia.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onOpenVisitModal('Asesoría Jurídica y Notarial')}
                className="px-7 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-95"
              >
                Agendar Asesoría Legal
              </button>
              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer shadow-md active:scale-95"
              >
                <WhatsAppIcon size={18} className="text-slate-950" />
                <span>WhatsApp Oficial</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
