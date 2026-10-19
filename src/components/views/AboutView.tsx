'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Building2,
  FileCheck2,
  Award,
  ArrowRight,
  ArrowUpRight,
  FileText,
  FileDown,
} from 'lucide-react';
import type { PageView } from '../Header';
import { getGeneralWhatsAppUrl } from '@/src/data/lots';
import { useSiteBanners } from '@/src/lib/bannerStorage';
import { useSiteSettings } from '@/src/lib/siteSettings';
import { WhatsAppIcon } from '../SocialIcons';
import { TopographicContours } from '../WaveDividers';
import { ScrollReveal } from '../common/ScrollReveal';
import { AnimatedInsignia } from '../common/AnimatedInsignia';
import { CardDeckGallery } from '../common/CardDeckGallery';

interface AboutViewProps {
  onNavigate: (page: PageView) => void;
}

const ABOUT_HERO_IMAGE = {
  url: '/nosotros-banner.jpg',
  alt: 'Solidez Institucional, Transparencia y Certeza Notarial - Sociedad Civil MGM Inmobiliaria',
};

const ACQUISITION_BG_PROPERTIES = [
  {
    url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Protocolo de legalización y firma de instrumentos notariales',
    className: 'sm:-translate-y-4',
  },
  {
    url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    alt: 'Revisión técnica de planos y linderos arquitectónicos',
    className: 'sm:translate-y-6',
  },
  {
    url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
    alt: 'Acuerdo de adjudicación y formalización de compraventa',
    className: 'sm:-translate-y-6',
  },
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Entrega física de predio urbanizado con escrituras',
    className: 'sm:translate-y-4',
  },
];

export function AboutView({ onNavigate }: AboutViewProps) {
  const { banners } = useSiteBanners();
  useSiteSettings();
  const aboutBanner = banners.nosotros;
  const posX = aboutBanner.bgPositionX ?? 50;
  const posY = aboutBanner.bgPositionY ?? 50;
  const zoom = (aboutBanner.bgZoom ?? 100) / 100;

  return (
    <div className="w-full overflow-hidden bg-white text-slate-900">
      {/* =========================================================================
          1. BANNER CINEMÁTICO — FULL BLEED EDGE-TO-EDGE (TEXTO SOBRE IMAGEN, SIN BOXES)
          ========================================================================= */}
      <section className="group/hero relative w-full bg-slate-950 text-white overflow-hidden min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex flex-col justify-center select-none pt-24 sm:pt-28 pb-16 sm:pb-20">
        {/* Fotografía Institucional Panorámica de Ancho Completo */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={aboutBanner.image || ABOUT_HERO_IMAGE.url}
            alt={aboutBanner.alt || ABOUT_HERO_IMAGE.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover transform transition-transform duration-1000 ease-out hover:scale-105"
            style={{
              objectPosition: `${posX}% ${posY}%`,
              transform: zoom > 1 ? `scale(${zoom})` : undefined,
              transformOrigin: 'center center',
            }}
            referrerPolicy="no-referrer"
          />

          {/* Degradados cinematográficos neutros para máxima legibilidad editorial del texto */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 sm:via-black/50 to-black/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/35 pointer-events-none" />
        </div>

        {/* CONTENIDO EDITORIAL: Directamente sobre la foto, sin cajas envolventes */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-3xl lg:max-w-4xl flex flex-col items-start text-left select-text cursor-default">
            <ScrollReveal direction="down" delay={0.15} duration={0.7}>
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.12] tracking-tight drop-shadow-md">
                <span className="block">{aboutBanner.titleLine1}</span>
                {(aboutBanner.titleHighlight1 || aboutBanner.titleHighlight2) && (
                  <span className="block mt-1">
                    <span className="text-[#5be196]">{aboutBanner.titleHighlight1}</span>{' '}
                    {aboutBanner.titleHighlight2 && (
                      <span className="text-[#F58220]">{aboutBanner.titleHighlight2}</span>
                    )}
                  </span>
                )}
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.25} duration={0.65}>
              <p className="text-sm sm:text-base lg:text-xl text-slate-200 leading-relaxed font-normal max-w-2xl mt-4 sm:mt-6 drop-shadow-xs">
                {aboutBanner.description}
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

              {/* Dossier Institucional Oficial */}
              <div className="w-full">
                <a
                  href="/docs/MGM_Inmobiliaria_Dossier_Institucional_Completo.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-orange-50/80 via-white to-emerald-50/80 border border-orange-200/80 hover:border-[#F58220] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3.5 w-full sm:w-auto">
                    <div className="h-11 w-11 rounded-xl bg-[#F58220] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <FileDown className="h-5 w-5 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#F58220]">Documento Oficial</span>
                        <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">PDF</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug group-hover:text-[#F58220] transition-colors">
                        Dossier Institucional MGM Inmobiliaria
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Respaldo jurídico, garantías notariales y trayectoria empresarial
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#113d22] group-hover:text-[#F58220] transition-colors shrink-0 self-end sm:self-center">
                    <span>Ver Dossier</span>
                    <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                  </div>
                </a>
              </div>

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

          {/* VISTA MÓVIL: Galería Tarjeta Naipes (Valores & Pilares MGM) */}
          <div className="block md:hidden">
            <CardDeckGallery
              id="galeria-tarjeta-naipes"
              items={[
                {
                  title: 'Transparencia Notarial',
                  desc: 'Documentación legal abierta y a disposición de cada cliente antes de firmar cualquier compromiso económico.',
                  cardStyle: 'bg-[#eaf8ee] border border-[#22A33D]/25 text-[#113d22]',
                  titleColor: 'text-[#113d22]',
                  descColor: 'text-slate-600',
                  icon: FileText,
                  iconColor: 'text-[#22A33D]/80',
                },
                {
                  title: 'Cumplimiento de Obra',
                  desc: 'Vías concluidas, alcantarillado instalado y obras de urbanismo palpables y verificables en el terreno.',
                  cardStyle: 'bg-[#113d22] text-white border border-white/10',
                  titleColor: 'text-white',
                  descColor: 'text-slate-300',
                  icon: Building2,
                  iconColor: 'text-[#5be196]',
                },
                {
                  title: 'Seguridad Jurídica',
                  desc: 'Títulos individuales protocolizados ante Notario Público e inscritos legalmente en el Registro de la Propiedad.',
                  cardStyle: 'bg-gradient-to-br from-[#113d22] via-[#164929] to-[#22A33D] text-white border border-white/15',
                  titleColor: 'text-white',
                  descColor: 'text-slate-200',
                  icon: ShieldCheck,
                  iconColor: 'text-[#5be196]',
                },
                {
                  title: 'Financiamiento Directo',
                  desc: 'Crédito directo con la urbanizadora hasta 48 meses en cuotas fijas. Sin trámites bancarios complejos ni historial crediticio excluyente.',
                  cardStyle: 'bg-[#fff8f0] border border-orange-200/90 text-slate-900',
                  titleColor: 'text-slate-900',
                  descColor: 'text-slate-600',
                  icon: FileCheck2,
                  iconColor: 'text-[#F58220]',
                },
              ]}
              autoPlayInterval={3000}
              renderCard={(item) => {
                const IconComp = item.icon;
                return (
                  <div
                    className={`p-7 rounded-[2.5rem] ${item.cardStyle} flex flex-col justify-between min-h-[300px] relative overflow-hidden shadow-xl`}
                  >
                    <div>
                      <h3 className={`text-xl font-black tracking-tight mb-3 ${item.titleColor}`}>
                        {item.title}
                      </h3>
                      <p className={`text-xs leading-relaxed ${item.descColor}`}>
                        {item.desc}
                      </p>
                    </div>

                    <div className="flex items-end justify-end mt-6 pt-2">
                      <IconComp className={`w-14 h-14 stroke-[1.4] ${item.iconColor}`} />
                    </div>
                  </div>
                );
              }}
            />
          </div>

          {/* VISTA ESCRITORIO: Grid completa 4 columnas original */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {[
              {
                title: 'Transparencia Notarial',
                desc: 'Documentación legal abierta y a disposición de cada cliente antes de firmar cualquier compromiso económico.',
                cardStyle: 'bg-[#eaf8ee] border border-[#22A33D]/25 text-[#113d22]',
                titleColor: 'text-[#113d22]',
                descColor: 'text-slate-600',
                icon: FileText,
                iconColor: 'text-[#22A33D]/80',
              },
              {
                title: 'Cumplimiento de Obra',
                desc: 'Vías concluidas, alcantarillado instalado y obras de urbanismo palpables y verificables en el terreno.',
                cardStyle: 'bg-[#113d22] text-white border border-white/10',
                titleColor: 'text-white',
                descColor: 'text-slate-300',
                icon: Building2,
                iconColor: 'text-[#5be196]',
              },
              {
                title: 'Seguridad Jurídica',
                desc: 'Títulos individuales protocolizados ante Notario Público e inscritos legalmente en el Registro de la Propiedad.',
                cardStyle: 'bg-gradient-to-br from-[#113d22] via-[#164929] to-[#22A33D] text-white border border-white/15',
                titleColor: 'text-white',
                descColor: 'text-slate-200',
                icon: ShieldCheck,
                iconColor: 'text-[#5be196]',
              },
              {
                title: 'Financiamiento Directo',
                desc: 'Crédito directo con la urbanizadora hasta 48 meses en cuotas fijas. Sin trámites bancarios complejos ni historial crediticio excluyente.',
                cardStyle: 'bg-gradient-to-br from-[#fffaf5] to-[#fff3e6] border border-orange-200/90 text-slate-900',
                titleColor: 'text-slate-900',
                descColor: 'text-slate-600',
                icon: FileCheck2,
                iconColor: 'text-[#F58220]',
              },
            ].map((pilar, idx) => {
              const IconComp = pilar.icon;
              return (
                <ScrollReveal key={idx} direction="up" delay={idx * 0.1}>
                  <div
                    className={`p-7 sm:p-9 rounded-[2.5rem] ${pilar.cardStyle} flex flex-col justify-between h-full min-h-[290px] sm:min-h-[310px] relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group`}
                  >
                    <div>
                      <h3 className={`text-xl sm:text-2xl font-black tracking-tight mb-3 ${pilar.titleColor}`}>
                        {pilar.title}
                      </h3>
                      <p className={`text-xs sm:text-sm leading-relaxed ${pilar.descColor}`}>
                        {pilar.desc}
                      </p>
                    </div>

                    <div className="flex items-end justify-end mt-6 pt-2">
                      <IconComp className={`w-14 h-14 sm:w-16 sm:h-16 stroke-[1.4] ${pilar.iconColor} group-hover:scale-110 transition-transform duration-500`} />
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. PROCESO DE ADQUISICIÓN
          ========================================================================= */}
      <section className="relative w-full bg-slate-950 text-white py-16 sm:py-24 overflow-hidden border-b border-slate-800">
        {/* Fondo nítido de imágenes de propiedades */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
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

              {/* Action Button: Direct WhatsApp */}
              <div className="pt-2 flex justify-center lg:justify-start w-full">
                <a
                  href={getGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#F58220] hover:bg-[#ea580c] text-white text-sm font-bold rounded-full shadow-lg shadow-black/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <WhatsAppIcon size={18} className="text-white shrink-0" />
                  <span>Solicitar Asesoría</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </a>
              </div>
            </ScrollReveal>

            {/* Right Column: Protocolo Notarial Solemne */}
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
                  Conversa directamente con nuestro equipo notarial para que revises planos catastrales, certificados de gravámenes y licencias de urbanismo con total transparencia.
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
