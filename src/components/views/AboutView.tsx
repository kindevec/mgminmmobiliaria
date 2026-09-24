'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
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
} from 'lucide-react';
import type { PageView } from '../Header';
import { getGeneralWhatsAppUrl } from '@/src/data/lots';
import { WhatsAppIcon } from '../SocialIcons';
import { WaveDarkToCream, WaveCreamToDark, TopographicContours } from '../WaveDividers';

interface AboutViewProps {
  onNavigate: (page: PageView) => void;
  onOpenVisitModal: (defaultInterest?: string) => void;
}

export function AboutView({ onNavigate, onOpenVisitModal }: AboutViewProps) {
  return (
    <div className="w-full overflow-hidden bg-slate-950">
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
            {/* Glassmorphic Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 backdrop-blur-md shadow-lg">
              <Building2 className="h-4 w-4 text-[#25D366] shrink-0" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                Perfil Corporativo & Solidez Notarial · Ecuador
              </span>
            </div>

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
        <WaveDarkToCream fillColor="#FAF7F2" />
      </section>

      {/* =========================================================================
          2. SECCIÓN: COMPROMISO ÉTICO & NOTARIAL
          ========================================================================= */}
      <section className="relative w-full bg-[#FAF7F2] text-slate-900 py-16 sm:py-24 overflow-hidden">
        <TopographicContours className="text-amber-800/10" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Narrative */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 block">
                  NUESTRO PROPÓSITO INSTITUCIONAL
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] [text-wrap:balance]">
                  Nuestro Compromiso Ético y{' '}
                  <span className="font-serif italic font-normal text-amber-900">
                    Notarial con el Ecuador
                  </span>
                </h2>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                En el mercado inmobiliario tradicional, la adquisición de terrenos suele generar incertidumbre por falta de permisos municipales, litigios limítrofes o promesas de servicios que nunca se ejecutan.
              </p>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                <strong>Sociedad Civil MGM Inmobiliaria</strong> nació para erradicar esa vulnerabilidad. Cada proyecto que desarrollamos cuenta con levantamientos topográficos georreferenciados, aprobación formal de urbanismo y escrituras individuales protocolizadas ante Notario Público e inscritas en el Registro de la Propiedad, libres de hipotecas o prohibiciones.
              </p>

              {/* Minimalist Feature List */}
              <div className="space-y-4 pt-4 border-t border-amber-900/15">
                <div className="flex items-start gap-3">
                  <FileCheck2 className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-800 font-semibold">
                    Escrituras individuales legalizadas listas para protocolización tras completar tu plan.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Scale className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-800 font-semibold">
                    Contratos solemnes bajo la Ley Notarial ecuatoriana y ordenanzas vigentes.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-800 font-semibold">
                    Obras viales, alcantarillado e iluminación concluidas previo a la posesión.
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right: Architectural Photo Frame with Clean Elevation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
              className="lg:col-span-6 relative flex justify-center"
            >
              <div className="relative aspect-[4/3] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                  alt="Compromiso Ético y Legal MGM"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-6 right-6 text-white pointer-events-none">
                  <span className="text-xs font-mono font-bold text-amber-300 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 inline-block mb-1">
                    +10 Años de Trayectoria
                  </span>
                  <p className="text-xs text-slate-200 drop-shadow-sm font-medium">
                    Compromiso de entrega notarial y acompañamiento legal permanente.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Transition to Pillars */}
        <WaveCreamToDark className="mt-14" fillColor="#080D18" />
      </section>

      {/* =========================================================================
          3. PILARES FUNDACIONALES
          ========================================================================= */}
      <section className="relative w-full bg-[#080D18] text-white py-16 sm:py-24 overflow-hidden">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block">
              VALORES FUNDACIONALES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight [text-wrap:balance]">
              Los Pilares que Sostienen Cada Proyecto
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
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
              className="p-8 rounded-3xl bg-slate-900/85 backdrop-blur-md border border-white/15 space-y-4 hover:border-emerald-400/40 transition-all shadow-xl"
            >
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-black text-white">Transparencia Notarial</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Toda la documentación legal de nuestras urbanizaciones está abierta y a disposición de los clientes antes de firmar cualquier compromiso económico.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              whileHover={{ y: -6 }}
              className="p-8 rounded-3xl bg-slate-900/85 backdrop-blur-md border border-white/15 space-y-4 hover:border-amber-400/40 transition-all shadow-xl"
            >
              <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <Award className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-black text-white">Cumplimiento de Obra</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                No vendemos ilusiones ni planos en papel: entregamos vías concluidas, alcantarillado instalado y obras de urbanismo palpables en el terreno.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -6 }}
              className="p-8 rounded-3xl bg-slate-900/85 backdrop-blur-md border border-white/15 space-y-4 hover:border-teal-400/40 transition-all shadow-xl"
            >
              <div className="h-14 w-14 rounded-2xl bg-teal-500/10 border border-teal-400/30 flex items-center justify-center text-teal-300">
                <Building2 className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-black text-white">Financiamiento Justo</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Crédito directo con la urbanizadora hasta 48 meses. Sin trámites bancarios complejos ni historial crediticio excluyente.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Transition to Process */}
        <WaveDarkToCream className="mt-14" fillColor="#FAF7F2" />
      </section>

      {/* =========================================================================
          4. PROCESO DE ADQUISICIÓN PASO A PASO (01 - 04)
          ========================================================================= */}
      <section className="relative w-full bg-[#FAF7F2] text-slate-900 py-16 sm:py-24 overflow-hidden">
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
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-3"
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
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-3"
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
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-3"
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
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md space-y-3"
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

        {/* Transition to Bottom CTA */}
        <WaveCreamToDark className="mt-14" fillColor="#070B14" />
      </section>

      {/* =========================================================================
          5. PANORAMIC BOTTOM CTA
          ========================================================================= */}
      <section className="relative w-full bg-[#070B14] text-white py-16 sm:py-20 overflow-hidden">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-slate-900/90 border border-white/20 p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
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
