'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Building2,
  FileCheck2,
  Scale,
  Award,
  ArrowRight,
  ArrowUpRight,
  CalendarCheck2,
  CheckCircle2,
  MapPin,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import type { PageView } from '../Header';
import { getGeneralWhatsAppUrl } from '@/src/data/lots';
import { WhatsAppIcon } from '../SocialIcons';
import { WaveCreamToDark, TopographicContours } from '../WaveDividers';
import { ScrollReveal } from '../common/ScrollReveal';
import { AnimatedInsignia } from '../common/AnimatedInsignia';

interface AboutViewProps {
  onNavigate: (page: PageView) => void;
  onOpenVisitModal: (defaultInterest?: string) => void;
}

const ABOUT_HERO_IMAGE = {
  url: '/nosotros-banner.jpg',
  alt: 'Solidez Institucional, Transparencia y Certeza Notarial - Sociedad Civil MGM Inmobiliaria',
};

const ACQUISITION_BG_PROPERTIES = [
  {
    url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    alt: 'Suscripción notarial y firma de promesas de compraventa',
    className: 'sm:-translate-y-4',
  },
  {
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    alt: 'Certeza jurídica y legislación notarial inmobiliaria',
    className: 'sm:translate-y-6',
  },
  {
    url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    alt: 'Revisión planimétrica, linderos y levantamiento topográfico',
    className: 'sm:-translate-y-6',
  },
  {
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    alt: 'Entrega formal de posesión y títulos de propiedad',
    className: 'sm:translate-y-4',
  },
];

export function AboutView({ onNavigate, onOpenVisitModal }: AboutViewProps) {

  return (
    <div className="w-full overflow-hidden bg-white text-slate-900">
      {/* =========================================================================
          1. BANNER CINEMÁTICO — PANORÁMICO INTEGRAL (SIN PARTICIONES VERTICALES)
          ========================================================================= */}
      {/* =========================================================================
          1. BANNER CINEMÁTICO — FULL BLEED EDGE-TO-EDGE (TEXTO SOBRE IMAGEN, SIN BOXES)
          ========================================================================= */}
      <section className="group/hero relative w-full bg-slate-950 text-white overflow-hidden min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex flex-col justify-center select-none pt-24 sm:pt-28 pb-16 sm:pb-20">
        {/* Fotografía Institucional Panorámica de Ancho Completo */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={ABOUT_HERO_IMAGE.url}
            alt={ABOUT_HERO_IMAGE.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center transform transition-transform duration-1000 ease-out hover:scale-105"
            referrerPolicy="no-referrer"
          />

          {/* Degradados cinematográficos neutros para máxima legibilidad editorial del texto */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 sm:via-black/50 to-black/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/35 pointer-events-none" />
        </div>

        {/* CONTENIDO EDITORIAL: Directamente sobre la foto, sin cajas envolventes */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-3xl lg:max-w-4xl flex flex-col items-start text-left select-text cursor-default">
            <ScrollReveal direction="down" delay={0.05} duration={0.65}>
              <AnimatedInsignia className="scale-85 sm:scale-95" size={42} />
            </ScrollReveal>

            <ScrollReveal direction="down" delay={0.15} duration={0.7}>
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.12] tracking-tight mt-4 sm:mt-5 drop-shadow-md">
                <span className="block">Solidez, transparencia</span>
                <span className="block mt-1">
                  y <span className="text-[#5be196]">certeza jurídica</span>.
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.25} duration={0.65}>
              <p className="text-sm sm:text-base lg:text-xl text-slate-200 leading-relaxed font-normal max-w-2xl mt-4 sm:mt-6 drop-shadow-xs">
                Somos una entidad inmobiliaria ecuatoriana constituida para transformar terrenos de alta vocación residencial en comunidades planificadas con obras concluidas, saneamiento legal definitivo y crédito directo.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. SECCIÓN: COMPROMISO ÉTICO & NOTARIAL (Diseño de Estudio con Máscaras)
          ========================================================================= */}
      <section className="relative w-full bg-white text-slate-900 pt-12 sm:pt-16 pb-8 sm:pb-10 overflow-hidden border-b border-slate-100">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Enlarged asymmetric organic curved image container with floating badge */}
            <ScrollReveal
              direction="left"
              delay={0.15}
              className="lg:col-span-6 w-full flex justify-center items-center relative py-6"
            >
              <div className="relative w-full max-w-[580px] sm:max-w-[640px] lg:max-w-[660px]">
                {/* Main Arched/Organic Image Container - Taller vertical aspect */}
                <div className="relative w-full aspect-[4/4.8] sm:aspect-[4/4.6] min-h-[480px] sm:min-h-[560px] lg:min-h-[600px] rounded-[40px_160px_50px_160px] overflow-hidden shadow-2xl bg-slate-900 border-4 sm:border-[6px] border-white ring-1 ring-slate-900/10">
                  <Image
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80"
                    alt="Equipo MGM Inmobiliaria trabajando en proyectos y planificación urbana"
                    fill
                    sizes="(max-width: 768px) 100vw, 55vw"
                    className="object-cover object-center"
                    priority
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Bottom-Right Circular Badge with Warm Orange Petal Accent */}
                <div className="absolute -bottom-6 -right-2 sm:-right-4 z-20 flex items-center justify-center">
                  {/* Warm Orange curved petal / roof accent behind the circle */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#F58220] rounded-[50px_0px_50px_50px] -rotate-45 absolute -left-5 sm:-left-7 bottom-2 -z-10 shadow-md" />

                  {/* Circular off-white badge */}
                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#fbfbfa] border-4 border-white shadow-2xl flex flex-col items-center justify-center text-center p-3 sm:p-4 ring-1 ring-slate-100">
                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-orange-50 text-[#F58220] border border-orange-200/60 flex items-center justify-center mb-1.5 shadow-xs">
                      <Award className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none font-sans">
                      10+
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 font-semibold leading-tight mt-1 max-w-[95px] sm:max-w-[110px]">
                      Años de Trayectoria en el Sector
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right Column: Bold Headline, Paragraph, Two Features, Centered CTA Button */}
            <ScrollReveal
              direction="right"
              delay={0.15}
              className="lg:col-span-6 flex flex-col justify-center space-y-6 sm:space-y-7 pl-0 lg:pl-4"
            >
              {/* Bold Title - Centered with Orange Accent */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.14] [text-wrap:balance] text-center">
                Expertos en urbanismo, desarrollo y <span className="text-[#F58220]">certeza jurídica</span>
              </h2>

              {/* Descriptive Paragraph - Justified */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal text-justify">
                En <strong className="text-slate-900 font-bold">Sociedad Civil MGM Inmobiliaria</strong> transformamos terrenos en proyectos residenciales planificados con total certeza notarial. Erradicamos la incertidumbre en la adquisición de tierras, desarrollando obras con levantamientos topográficos georreferenciados y títulos individuales protocolizados ante Notario Público e inscritos en el Registro de la Propiedad.
              </p>

              {/* Two Features Side by Side Centered */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2">
                <div className="flex items-center justify-center gap-3.5 text-left">
                  <div className="h-11 w-11 rounded-xl bg-orange-50 border border-orange-200/80 flex items-center justify-center text-[#F58220] shrink-0 shadow-xs">
                    <FileCheck2 className="h-5 w-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                      100% Escrituras Notariales
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Protocolizadas e inscritas legalmente
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3.5 text-left">
                  <div className="h-11 w-11 rounded-xl bg-emerald-100/80 border border-emerald-200/70 flex items-center justify-center text-emerald-800 shrink-0 shadow-xs">
                    <ShieldCheck className="h-5 w-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                      +300 Familias Propietarias
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Garantía y respaldo patrimonial real
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button: Centered */}
              <div className="pt-4 flex justify-center w-full">
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#113d22] hover:bg-[#F58220] text-white text-sm font-semibold rounded-full shadow-lg shadow-emerald-950/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Conoce Más</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. PILARES FUNDACIONALES (Luminoso & Arquitectónico)
          ========================================================================= */}
      <section className="relative w-full bg-[#FBFBFA] text-slate-900 pt-8 sm:pt-10 pb-16 sm:pb-24 overflow-hidden border-y border-slate-100">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="down" delay={0.1} className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight [text-wrap:balance]">
              Los Pilares que Sostienen Cada Proyecto
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Trabajamos bajo estándares rigurosos de honestidad contractual, solvencia técnica y responsabilidad social comunitaria.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {/* Card 1: Soft Fresh Brand Green */}
            <ScrollReveal direction="left" delay={0.05}>
              <motion.div
                whileHover={{ y: -6 }}
                className="p-6 sm:p-7 rounded-[2rem] bg-[#eaf8ee] border border-[#22A33D]/25 text-[#113d22] flex flex-col justify-between min-h-[250px] sm:min-h-[270px] relative overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl group"
              >
                <div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-2 text-[#113d22]">
                    Transparencia Notarial
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                    Documentación legal abierta y a disposición de cada cliente antes de firmar cualquier compromiso económico.
                  </p>
                </div>

                <div className="flex items-end justify-between mt-6 pt-2">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#113d22] text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm">
                    <ArrowUpRight className="w-5 h-5 stroke-[2.4] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <FileText className="w-12 h-12 sm:w-14 sm:h-14 stroke-[1.4] text-[#22A33D]/80 transition-transform duration-500 group-hover:scale-110" />
                </div>
              </motion.div>
            </ScrollReveal>

            {/* Card 2: Deep Dark Forest Green (#113d22) */}
            <ScrollReveal direction="up" delay={0.12}>
              <motion.div
                whileHover={{ y: -6 }}
                className="p-6 sm:p-7 rounded-[2rem] bg-[#113d22] text-white flex flex-col justify-between min-h-[250px] sm:min-h-[270px] relative overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl group"
              >
                <div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-2 text-white">
                    Cumplimiento de Obra
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                    Vías concluidas, alcantarillado instalado y obras de urbanismo palpables y verificables en el terreno.
                  </p>
                </div>

                <div className="flex items-end justify-between mt-6 pt-2">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm">
                    <ArrowUpRight className="w-5 h-5 stroke-[2.4] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <Building2 className="w-12 h-12 sm:w-14 sm:h-14 stroke-[1.4] text-[#5be196] transition-transform duration-500 group-hover:scale-110" />
                </div>
              </motion.div>
            </ScrollReveal>

            {/* Card 3: Deep Green Gradient with #22A33D */}
            <ScrollReveal direction="up" delay={0.19}>
              <motion.div
                whileHover={{ y: -6 }}
                className="p-6 sm:p-7 rounded-[2rem] bg-gradient-to-br from-[#113d22] via-[#164929] to-[#22A33D] text-white flex flex-col justify-between min-h-[250px] sm:min-h-[270px] relative overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl group"
              >
                <div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-2 text-white">
                    Seguridad Jurídica
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
                    Títulos individuales protocolizados ante Notario Público e inscritos legalmente en el Registro de la Propiedad.
                  </p>
                </div>

                <div className="flex items-end justify-between mt-6 pt-2">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm">
                    <ArrowUpRight className="w-5 h-5 stroke-[2.4] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <ShieldCheck className="w-12 h-12 sm:w-14 sm:h-14 stroke-[1.4] text-[#5be196] transition-transform duration-500 group-hover:scale-110" />
                </div>
              </motion.div>
            </ScrollReveal>

            {/* Card 4: Warm Orange / Direct Financing Accent (#F58220) */}
            <ScrollReveal direction="right" delay={0.26}>
              <motion.div
                whileHover={{ y: -6 }}
                className="p-6 sm:p-7 rounded-[2rem] bg-gradient-to-br from-[#fffaf5] to-[#fff3e6] border border-orange-200/90 text-slate-900 flex flex-col justify-between min-h-[250px] sm:min-h-[270px] relative overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl group"
              >
                <div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-2 text-slate-900">
                    Financiamiento Directo
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-600">
                    Crédito directo con la urbanizadora hasta 48 meses en cuotas fijas. Sin trámites bancarios complejos ni historial crediticio excluyente.
                  </p>
                </div>

                <div className="flex items-end justify-between mt-6 pt-2">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#F58220] text-white hover:bg-[#ea580c] flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-sm">
                    <ArrowUpRight className="w-5 h-5 stroke-[2.4] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <FileCheck2 className="w-12 h-12 sm:w-14 sm:h-14 stroke-[1.4] text-[#F58220] transition-transform duration-500 group-hover:scale-110" />
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. PROCESO DE ADQUISICIÓN — DISEÑO CUADRO VERDE CLARO & PALETA CORPORATIVA MGM
          ========================================================================= */}
      <section className="relative w-full bg-slate-950 text-white py-16 sm:py-24 overflow-hidden border-b border-slate-800">
        {/* Fondo nítido de imágenes de propiedades sin difuminado ni degradados verdes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Mosaico de propiedades nítido sin difuminado */}
          <div className="absolute inset-0 opacity-85 sm:opacity-90">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 h-full w-full p-3 sm:p-6 scale-105">
              {ACQUISITION_BG_PROPERTIES.map((prop, idx) => (
                <div
                  key={idx}
                  className={`relative w-full h-full overflow-hidden rounded-3xl sm:rounded-[2.5rem] shadow-xl border border-white/15 ${prop.className}`}
                >
                  <Image
                    src={prop.url}
                    alt={prop.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover object-center filter saturate-105 brightness-100"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sombreado sutil neutro para legibilidad de textos sin opacar las fotos */}
          <div className="absolute inset-0 bg-slate-950/45 pointer-events-none" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column: Heading, Paragraph, Centered CTA Button */}
            <ScrollReveal
              direction="left"
              delay={0.15}
              className="lg:col-span-6 flex flex-col justify-center space-y-6 sm:space-y-8"
            >
              <div className="space-y-4 text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.14] [text-wrap:balance]">
                  Ruta de adquisición con <span className="text-[#F58220]">certeza notarial</span>
                </h2>
                <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Proceso transparente desde tu primer contacto hasta la protocolización definitiva. Cada etapa cuenta con respaldo notarial y verificación técnica directa.
                </p>
              </div>

              {/* Action Button: Warm Orange (#F58220) */}
              <div className="pt-2 flex justify-center lg:justify-start w-full">
                <button
                  type="button"
                  onClick={() => onOpenVisitModal('Ruta de Adquisición Segura')}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#F58220] hover:bg-[#ea580c] text-white text-sm font-bold rounded-full shadow-lg shadow-black/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Agendar Asesoría</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </ScrollReveal>

            {/* Right Column: Protocolo Notarial Solemne (Línea de Tiempo Editorial Humana, Sin Cajas Artificiales de IA) */}
            <ScrollReveal
              direction="right"
              delay={0.15}
              className="lg:col-span-6 w-full flex justify-center"
            >
              <div className="w-full max-w-[560px] space-y-5">
                {/* Cabecera Editorial Notarial */}
                <div className="flex items-center justify-between pb-3.5 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#5be196] animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5be196]">
                      Protocolo Notarial Continuo
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300">
                    4 Fases de Certeza Jurídica
                  </span>
                </div>

                {/* Línea de Tiempo Continua */}
                <div className="relative pl-7 sm:pl-9 space-y-6 before:absolute before:left-3 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-400 before:via-[#F58220] before:to-emerald-400">
                  {/* Hito 1 */}
                  <div className="relative group">
                    <div className="absolute -left-7 sm:-left-9 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-950 border-2 border-emerald-400 flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold text-emerald-400 shadow-md group-hover:scale-110 group-hover:bg-emerald-950 transition-all">
                      1
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                          Inspección In Situ
                        </span>
                        <span className="text-xs text-slate-400 font-medium">Hitos Georreferenciados UTM</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        Elección & Replanteo en Terreno
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mt-0.5">
                        Inspección física de hitos georreferenciados UTM, delimitación de linderos y verificación de servicios básicos in situ.
                      </p>
                    </div>
                  </div>

                  {/* Hito 2 */}
                  <div className="relative group">
                    <div className="absolute -left-7 sm:-left-9 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-950 border-2 border-[#F58220] flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold text-[#F58220] shadow-md group-hover:scale-110 group-hover:bg-orange-950 transition-all">
                      2
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-300 bg-orange-950/80 px-2 py-0.5 rounded border border-orange-500/30">
                          Crédito Directo 48M
                        </span>
                        <span className="text-xs text-slate-400 font-medium">Sin Bancos ni Intermediarios</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        Reserva & Cronograma sin Bancos
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mt-0.5">
                        Bloqueo formal del predio seleccionado y estructuración de cuotas fijas directas solo con tu documento de identidad.
                      </p>
                    </div>
                  </div>

                  {/* Hito 3 */}
                  <div className="relative group">
                    <div className="absolute -left-7 sm:-left-9 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-950 border-2 border-emerald-400 flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold text-emerald-400 shadow-md group-hover:scale-110 group-hover:bg-emerald-950 transition-all">
                      3
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                          Notaría Pública
                        </span>
                        <span className="text-xs text-slate-400 font-medium">Entrega Material del Predio</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        Promesa Notarial & Posesión Física
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mt-0.5">
                        Suscripción solemne de contrato de promesa ante Notario Público con entrega formal de posesión material de tu lote.
                      </p>
                    </div>
                  </div>

                  {/* Hito 4 */}
                  <div className="relative group">
                    <div className="absolute -left-7 sm:-left-9 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-950 border-2 border-emerald-400 flex items-center justify-center text-[10px] sm:text-xs font-mono font-bold text-emerald-400 shadow-md group-hover:scale-110 group-hover:bg-emerald-950 transition-all">
                      4
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                          Registro de la Propiedad
                        </span>
                        <span className="text-xs text-slate-400 font-medium">Título de Dominio Individual</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                        Protocolización & Escritura Definitiva
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mt-0.5">
                        Minuta solemne, protocolización en el protocolo notarial e inscripción registral definitiva a tu nombre.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. PANORAMIC BOTTOM CTA (Luminoso)
          ========================================================================= */}
      <section className="relative w-full bg-[#FBFBFA] text-slate-900 pt-10 sm:pt-14 pb-6 sm:pb-8 overflow-hidden">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="zoom" delay={0.15}>
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
              <div className="space-y-2 max-w-xl text-center sm:text-left">
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  ¿Deseas examinar la documentación jurídica?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Agendamos una reunión con nuestro equipo notarial para que revises planos catastrales, certificados de gravámenes y licencias de urbanismo con total transparencia.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#F58220] hover:bg-[#ea580c] text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer whitespace-normal sm:whitespace-nowrap text-center active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Contáctanos</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </button>
                <a
                  href={getGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs sm:text-sm transition-all whitespace-normal sm:whitespace-nowrap text-center cursor-pointer shadow-md active:scale-95"
                >
                  <WhatsAppIcon size={18} className="text-slate-950 shrink-0" />
                  <span>Cotizar</span>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
