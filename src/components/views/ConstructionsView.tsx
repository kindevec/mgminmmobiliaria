'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  X,
  MapPin,
  Building2,
  LandPlot,
  Layers,
  Bed,
  Bath,
  Car,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Eye,
  Hammer,
  FileText,
} from 'lucide-react';
import type { PageView } from '@/src/data/navigation';
import type { ConstructionProject } from '@/src/data/constructions';
import { useConstructions } from '@/src/lib/constructionStorage';
import { useSiteSettings } from '@/src/lib/siteSettings';
import { WhatsAppIcon } from '../SocialIcons';

interface ConstructionsViewProps {
  onNavigate?: (page: PageView) => void;
}

export function ConstructionsView({ onNavigate }: ConstructionsViewProps) {
  const { settings } = useSiteSettings();
  const { constructions } = useConstructions();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDir, setSlideDir] = useState(1);
  const [activeImg, setActiveImg] = useState('');
  const [lightbox, setLightbox] = useState(false);
  const [lbIdx, setLbIdx] = useState(0);
  const [lbZoom, setLbZoom] = useState(1);
  const [showDossierModal, setShowDossierModal] = useState(false);

  const total = constructions.length;
  const project: ConstructionProject | undefined = constructions[currentIndex] || constructions[0];

  const gallery = useMemo(() => {
    if (!project) return [];
    return Array.from(new Set([project.mainImage, ...(project.gallery || [])].filter(Boolean)));
  }, [project]);

  useEffect(() => {
    if (project) {
      setActiveImg(project.mainImage || gallery[0] || '');
    }
  }, [currentIndex, project]);

  // Lista compacta de las otras obras para la cinta inferior auxiliar
  const otherProjects = useMemo(() => {
    if (total <= 1) return [];
    return constructions
      .map((item, index) => ({ item, index }))
      .filter(({ index }) => index !== currentIndex);
  }, [constructions, currentIndex, total]);

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    setSlideDir(-1);
    setCurrentIndex((p) => (p === 0 ? total - 1 : p - 1));
  }, [total]);

  const goNext = useCallback(() => {
    if (total <= 1) return;
    setSlideDir(1);
    setCurrentIndex((p) => (p === total - 1 ? 0 : p + 1));
  }, [total]);

  const handleSelectIndex = (targetIdx: number) => {
    if (targetIdx === currentIndex) return;
    setSlideDir(targetIdx > currentIndex ? 1 : -1);
    setCurrentIndex(targetIdx);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightbox) {
        if (e.key === 'Escape') setLightbox(false);
        if (e.key === 'ArrowLeft') setLbIdx((p) => (p === 0 ? gallery.length - 1 : p - 1));
        if (e.key === 'ArrowRight') setLbIdx((p) => (p === gallery.length - 1 ? 0 : p + 1));
        return;
      }
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, goPrev, goNext, gallery.length]);

  const openLightbox = (idx: number) => {
    setLbIdx(idx);
    setLbZoom(1);
    setLightbox(true);
  };

  const contactWhatsApp = () => {
    if (!project) return;
    const phone = settings.supportPhone.replace(/\D/g, '');
    const intl = phone.startsWith('593') ? phone : phone.startsWith('0') ? `593${phone.substring(1)}` : `593${phone}`;
    const msg = [
      `*CONSULTA DE OBRA CIVIL Y CONSTRUCCIÓN — MGM INMOBILIARIA*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🏗 *Proyecto:* ${project.name} (${project.code})`,
      `📍 *Ubicación:* ${project.location}, ${project.canton}`,
      `📐 *Área Construcción:* ${project.constructionArea} m²`,
      `🏞 *Área Lote:* ${project.lotArea} m²`,
      `📌 *Estado:* ${project.status}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Hola MGM Inmobiliaria, me interesa conocer más sobre este proyecto arquitectónico o cotizar una edificación personalizada en mi lote. ¿Podríamos coordinar una reunión técnica?`,
    ].join('\n');
    window.open(`https://wa.me/${intl}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  const getExtendedDescription = (p: ConstructionProject) => {
    const base = p.description && p.description.length > 25 ? p.description : '';
    const narrativeSuffix =
      `Desarrollado bajo rigurosa planificación bioclimática y cálculo estructural sismorresistente. El diseño articula amplias transiciones espaciales con iluminación cenital, carpintería arquitectónica y acabados de primera línea respaldados por fiscalización pericial continua de MGM Inmobiliaria.`;
    
    if (!base) return narrativeSuffix;
    if (base.length > 180) return base;
    return `${base} ${narrativeSuffix}`;
  };

  if (!project) return null;

  const currentDisplayImage = activeImg || project.mainImage || gallery[0] || '';

  const SPECS = [
    { icon: Building2, label: 'Construcción', value: `${project.constructionArea} m²` },
    { icon: LandPlot, label: 'Terreno', value: `${project.lotArea} m²` },
    { icon: Layers, label: 'Niveles', value: `${project.levels} ${project.levels === 1 ? 'planta' : 'plantas'}` },
    { icon: Bed, label: 'Dormitorios', value: `${project.bedrooms} suites` },
    { icon: Bath, label: 'Baños', value: `${project.bathrooms} baños` },
    { icon: Car, label: 'Parqueos', value: `${project.parkingSpots} autos` },
  ];

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Entregada':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'En Construcción':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'En Planos':
        return 'bg-sky-100 text-sky-900 border-sky-300';
      case 'Llave en Mano':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="relative w-full h-full lg:max-h-screen overflow-y-auto lg:overflow-hidden bg-gradient-to-b from-slate-50 via-[#f3f7f4] to-white text-slate-900 flex flex-col justify-between pt-20 sm:pt-24 lg:pt-24 pb-24 lg:pb-3 px-0 select-none">

      {/* ═══════════════════════════════════════════════════════════════════════
          FONDO ANIMADO TÉCNICO ARQUITECTÓNICO (BLUEPRINT & CAD GEOMETRY)
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(16, 185, 129, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(16, 185, 129, 0.08) 1px, transparent 1px),
              linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px, 80px 80px, 16px 16px, 16px 16px',
            maskImage: 'radial-gradient(circle at 50% 50%, black 60%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 60%, transparent 100%)',
          }}
        />

        <motion.div
          animate={{ x: [0, 15, 0], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-24 left-16 text-[10px] font-mono text-emerald-800/40 tracking-widest hidden lg:block"
        >
          AXIS 01-A ━━━━━━━━━━━━━━ 12.80 m ━━━━━━━━━━━━━━ ⊕ ELEV. +3.20m
        </motion.div>

        <motion.div
          animate={{ y: [0, -12, 0], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-16 right-24 text-[10px] font-mono text-slate-400/50 tracking-wider hidden lg:block"
        >
          ⊕ SECCIÓN ESTRUCTURAL B-B · PERITAJE MGM INMOBILIARIA · ESCALA 1:50
        </motion.div>

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 160, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-emerald-500/10 pointer-events-none hidden md:block"
        >
          <div className="absolute inset-8 rounded-full border border-dashed border-emerald-600/10" />
          <div className="absolute inset-20 rounded-full border border-emerald-500/10" />
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          BOTONES DE NAVEGACIÓN A LOS COSTADOS DE TODA LA PANTALLA
          ═══════════════════════════════════════════════════════════════════════ */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="fixed lg:absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white text-slate-800 hover:text-emerald-700 shadow-xl shadow-slate-900/10 border border-slate-200/90 hover:border-emerald-500 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
            title="Construcción anterior (Flecha Izquierda)"
            aria-label="Construcción anterior"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={goNext}
            className="fixed lg:absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white text-slate-800 hover:text-emerald-700 shadow-xl shadow-slate-900/10 border border-slate-200/90 hover:border-emerald-500 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
            title="Siguiente construcción (Flecha Derecha)"
            aria-label="Siguiente construcción"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
          </button>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          ESCENARIO CENTRAL: SHOWROOM ARQUITECTÓNICO
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex-1 min-h-0 w-full max-w-7xl mx-auto flex flex-col justify-center lg:overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="w-full h-full min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-stretch lg:overflow-hidden">

          {/* ─────────────────────────────────────────────────────────────────
              LADO IZQUIERDO: SPOTLIGHT DE LA OBRA CON EFECTO EXPANSIVO
              ───────────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 h-full min-h-0 flex flex-col justify-center overflow-hidden">
            <AnimatePresence mode="wait" custom={slideDir}>
              <motion.div
                key={project.id}
                custom={slideDir}
                initial={{
                  scale: 0.85,
                  opacity: 0,
                  x: slideDir > 0 ? 60 : -60,
                  filter: 'blur(8px)',
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  x: 0,
                  filter: 'blur(0px)',
                  transition: {
                    scale: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                    x: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.35 },
                    filter: { duration: 0.35 },
                  },
                }}
                exit={{
                  scale: 1.06,
                  opacity: 0,
                  x: slideDir > 0 ? -50 : 50,
                  filter: 'blur(6px)',
                  transition: { duration: 0.3, ease: 'easeIn' },
                }}
                className="relative w-full h-full min-h-[300px] max-h-[calc(100vh-165px)] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-[0_20px_45px_rgba(15,23,42,0.12)] group/photo"
              >
                {/* Imagen principal en alta resolución */}
                <Image
                  src={currentDisplayImage}
                  alt={project.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover/photo:scale-102"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20 pointer-events-none" />

                {/* Botón Zoom HD */}
                <div className="absolute top-4 right-4 z-10">
                  <button
                    type="button"
                    onClick={() => {
                      const idx = gallery.indexOf(currentDisplayImage);
                      openLightbox(idx >= 0 ? idx : 0);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-emerald-600 hover:text-white text-slate-800 text-xs font-bold border border-slate-200 shadow-md backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    title="Ampliar plano/foto en alta resolución"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white" />
                    <span>Zoom HD</span>
                  </button>
                </div>

                {/* Controles de cambio de foto dentro de la imagen al hacer hover */}
                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const idx = gallery.indexOf(currentDisplayImage);
                        const prevIdx = idx <= 0 ? gallery.length - 1 : idx - 1;
                        setActiveImg(gallery[prevIdx]);
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-md"
                      title="Foto anterior de la galería"
                      aria-label="Foto anterior"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const idx = gallery.indexOf(currentDisplayImage);
                        const nextIdx = idx >= gallery.length - 1 ? 0 : idx + 1;
                        setActiveImg(gallery[nextIdx]);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-md"
                      title="Siguiente foto de la galería"
                      aria-label="Siguiente foto"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </>
                )}

                {/* Miniaturas flotantes sobremontadas con máscara de degradado (cero caja blanca) */}
                {gallery.length > 1 && (
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between gap-3 pointer-events-none">
                    <div className="flex items-center gap-2 pointer-events-auto p-1 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl overflow-x-auto max-w-[85%]">
                      {gallery.slice(0, 5).map((img, i) => {
                        const isCurrent = currentDisplayImage === img;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setActiveImg(img)}
                            className={`relative w-12 h-9 sm:w-15 sm:h-10 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer shrink-0 ${
                              isCurrent
                                ? 'ring-2 ring-emerald-400 scale-105 opacity-100 shadow-md'
                                : 'opacity-65 hover:opacity-100 hover:scale-102 ring-1 ring-white/20'
                            }`}
                            title={`Ver foto de referencia ${i + 1}`}
                          >
                            <Image
                              src={img}
                              alt=""
                              fill
                              sizes="70px"
                              className="object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </button>
                        );
                      })}
                      {gallery.length > 5 && (
                        <span className="text-[10px] text-white/80 font-bold px-2 whitespace-nowrap">
                          +{gallery.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ─────────────────────────────────────────────────────────────────
              LADO DERECHO: DOSSIER ARQUITECTÓNICO & ESPECIFICACIONES DE ÉLITE
              ───────────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 h-full min-h-0 flex flex-col justify-between py-1 overflow-hidden">
            
            <AnimatePresence mode="wait" custom={slideDir}>
              <motion.div
                key={project.id}
                custom={slideDir}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.28 }}
                className="flex-1 min-h-0 flex flex-col justify-between space-y-3 overflow-hidden"
              >
                {/* 1. Header del Proyecto: Título y Memoria */}
                <div className="space-y-1.5 shrink-0">
                  <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-slate-900 tracking-tight leading-tight">
                    {project.name}
                  </h1>

                  {/* Narrativa Arquitectónica con botón para leer memoria completa */}
                  <div className="space-y-1">
                    <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-2 sm:line-clamp-3">
                      {getExtendedDescription(project)}
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowDossierModal(true)}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Ver ficha y memoria arquitectónica completa</span>
                    </button>
                  </div>
                </div>

                {/* 2. MATRIZ DE ESPECIFICACIONES TÉCNICAS */}
                <div className="grid grid-cols-3 gap-2 shrink-0">
                  {SPECS.map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="p-2 sm:p-2.5 rounded-xl bg-white/90 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex items-center gap-1 text-slate-400 mb-1">
                        <Icon className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="text-[9.5px] font-bold text-slate-500 uppercase tracking-wider truncate">
                          {label}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight truncate">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 3. OTRAS OBRAS EN CATÁLOGO: TARJETAS RECTANGULARES EN VERTICAL */}
                {otherProjects.length > 0 && (
                  <div className="flex-1 min-h-0 flex flex-col justify-between space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider px-0.5 shrink-0">
                      <span className="flex items-center gap-1.5 text-slate-900 font-black text-xs sm:text-sm">
                        <Building2 className="w-4 h-4 text-emerald-700" />
                        <span>Otras Obras en Catálogo</span>
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold lowercase flex items-center gap-0.5">
                        <span>clic para alternar</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 flex-1 min-h-0">
                      {otherProjects.slice(0, 2).map(({ item, index }) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectIndex(index)}
                          className="group/card relative w-full h-full min-h-[175px] sm:min-h-[200px] lg:min-h-[225px] aspect-[3/4] rounded-2xl overflow-hidden border border-slate-200/90 hover:border-emerald-500 shadow-md hover:shadow-xl transition-all flex flex-col justify-between text-left cursor-pointer p-3 sm:p-3.5 bg-slate-950"
                          title={`Ver proyecto ${item.name}`}
                        >
                          <Image
                            src={item.mainImage}
                            alt={item.name}
                            fill
                            sizes="(max-width: 1024px) 50vw, 25vw"
                            className="object-cover group-hover/card:scale-105 transition-transform duration-700 ease-out opacity-85 group-hover:opacity-100"
                            referrerPolicy="no-referrer"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-black/20 pointer-events-none" />

                          {/* Encabezado de la tarjeta vertical */}
                          <div className="relative z-10 flex items-center justify-between">
                            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-600/90 text-white shadow-xs backdrop-blur-md">
                              {item.status}
                            </span>
                            <span className="text-[9px] font-mono font-bold text-white/90 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-md border border-white/10">
                              {item.constructionArea} m²
                            </span>
                          </div>

                          {/* Pie de la tarjeta vertical */}
                          <div className="relative z-10 space-y-0.5">
                            <h4 className="text-xs sm:text-sm font-black text-white group-hover/card:text-emerald-300 transition-colors line-clamp-2 leading-snug">
                              {item.name}
                            </h4>
                            <p className="text-[10px] text-slate-300 truncate">
                              {item.location} · {item.canton}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. ZONA DE ACCIÓN: BOTÓN COTIZAR WHATSAPP + DOSSIER */}
                <div className="pt-2 border-t border-slate-200/80 mt-auto flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={contactWhatsApp}
                    className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#1ebf57] hover:from-[#1ebf57] hover:to-[#17a84c] text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <WhatsAppIcon size={18} className="text-slate-950" />
                    <span>Cotizar Proyecto o Visitar Obra</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDossierModal(true)}
                    className="py-3 px-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-1.5"
                    title="Ver ficha técnica completa en pantalla"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span className="hidden sm:inline">Dossier</span>
                  </button>
                </div>

              </motion.div>
            </AnimatePresence>

          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          MODAL DE DOSSIER TÉCNICO ARQUITECTÓNICO COMPLETO
          ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showDossierModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={() => setShowDossierModal(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-slate-200 relative flex flex-col justify-between space-y-4"
            >
              {/* Header Modal */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3.5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Ficha Técnica · {project.code}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${getStatusBadgeStyle(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    {project.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#F58220]" />
                    <span>{project.location} · {project.canton}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDossierModal(false)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
                  title="Cerrar ficha (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contenido Técnico */}
              <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Memoria Descriptiva & Peritaje</span>
                  </h4>
                  <p className="text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 leading-relaxed">
                    {getExtendedDescription(project)}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">
                    Parámetros Constructivos
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SPECS.map(({ icon: Icon, label, value }) => (
                      <div key={label} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                        <div className="flex items-center gap-1 text-slate-400 mb-0.5">
                          <Icon className="w-3 h-3 text-emerald-700" />
                          <span className="text-[10px] font-bold uppercase">{label}</span>
                        </div>
                        <span className="text-xs sm:text-sm font-black text-slate-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {project.structureType && (
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70 text-xs text-emerald-950 flex items-start gap-2">
                    <Hammer className="w-4 h-4 text-[#F58220] shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-emerald-900 font-bold">Sistema Estructural:</strong>
                      <span className="text-slate-700">{project.structureType}</span>
                    </div>
                  </div>
                )}

                {project.features && project.features.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#F58220]" />
                      <span>Especificaciones & Acabados de Primera</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {project.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-800 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Modal con Acción */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowDossierModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDossierModal(false);
                    contactWhatsApp();
                  }}
                  className="flex-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#25D366] to-[#1ebf57] hover:from-[#1ebf57] hover:to-[#17a84c] text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <WhatsAppIcon size={16} className="text-slate-950" />
                  <span>Cotizar Proyecto o Agendar Visita</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════
          MODAL DE ZOOM / PANTALLA COMPLETA EN ALTA DEFINICIÓN
          ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6"
          >
            {/* Header de controles */}
            <div className="flex items-center justify-between text-white shrink-0 z-20">
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm font-bold text-white">
                  {project.name}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Foto {lbIdx + 1} de {gallery.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLbZoom((z) => Math.min(3, z + 0.5))}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  title="Acercar (+)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLbZoom((z) => Math.max(1, z - 0.5))}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  title="Alejar (-)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLbZoom(1)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  title="Restablecer tamaño"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setLightbox(false)}
                  className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold transition-all cursor-pointer"
                  title="Cerrar visor (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Área central con zoom */}
            <div className="relative flex-1 min-h-0 my-4 flex items-center justify-center overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  setLbIdx((p) => (p === 0 ? gallery.length - 1 : p - 1));
                  setLbZoom(1);
                }}
                className="absolute left-2 sm:left-4 z-20 p-3 rounded-2xl bg-black/60 hover:bg-emerald-500 hover:text-slate-950 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                title="Foto anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div
                className="relative w-full h-full max-w-5xl max-h-[80vh] flex items-center justify-center transition-transform duration-200"
                style={{ transform: `scale(${lbZoom})` }}
              >
                <Image
                  src={gallery[lbIdx] || currentDisplayImage}
                  alt={`${project.name} vista`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                  referrerPolicy="no-referrer"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setLbIdx((p) => (p === gallery.length - 1 ? 0 : p + 1));
                  setLbZoom(1);
                }}
                className="absolute right-2 sm:right-4 z-20 p-3 rounded-2xl bg-black/60 hover:bg-emerald-500 hover:text-slate-950 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                title="Siguiente foto"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Miniaturas en Lightbox */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 shrink-0 z-20">
              {gallery.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setLbIdx(i);
                    setLbZoom(1);
                  }}
                  className={`relative w-14 h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    lbIdx === i
                      ? 'border-emerald-400 scale-105 opacity-100 ring-2 ring-emerald-500/40'
                      : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  <Image src={t} alt="" fill sizes="56px" className="object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
