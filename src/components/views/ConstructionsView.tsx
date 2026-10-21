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

  // Lista de las siguientes construcciones para la previsualización en el espacio derecho
  const upcomingProjects = useMemo(() => {
    if (total <= 1) return [];
    const list: { item: ConstructionProject; index: number }[] = [];
    for (let i = 1; i < total; i++) {
      const targetIdx = (currentIndex + i) % total;
      list.push({ item: constructions[targetIdx], index: targetIdx });
    }
    return list.slice(0, 2); // Tomamos las próximas 2 para un encaje ergonómico exacto sin scroll
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
    <div className="relative w-full h-full max-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-[#f3f7f4] to-white text-slate-900 flex flex-col justify-between pt-16 sm:pt-20 pb-20 md:pb-3 px-3 sm:px-6 lg:px-12 select-none">

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
          BOTONES DE NAVEGACIÓN A LOS EXTREMOS DE LA PANTALLA
          ═══════════════════════════════════════════════════════════════════════ */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white text-slate-800 hover:text-emerald-700 shadow-xl shadow-slate-900/10 border border-slate-200/90 hover:border-emerald-500 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
            title="Construcción anterior (Flecha Izquierda)"
            aria-label="Construcción anterior"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white text-slate-800 hover:text-emerald-700 shadow-xl shadow-slate-900/10 border border-slate-200/90 hover:border-emerald-500 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
            title="Siguiente construcción (Flecha Derecha)"
            aria-label="Siguiente construcción"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
          </button>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          ESCENARIO CENTRAL: SLIDER CLARO + EXPANDING HERO TRANSITION
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex-1 min-h-0 w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto flex flex-col justify-center overflow-hidden px-3 sm:px-6">
        <div className="w-full h-full min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-stretch overflow-hidden">

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
                className="relative w-full h-full min-h-[300px] max-h-[calc(100vh-140px)] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-[0_20px_45px_rgba(15,23,42,0.12)] group/photo"
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

                {/* Badges superiores: Estado y Código */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                  <div className="flex items-center gap-2 pointer-events-auto">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm backdrop-blur-md ${getStatusBadgeStyle(project.status)}`}>
                      {project.status}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-white/90 text-slate-800 border border-slate-200/80 shadow-sm backdrop-blur-md">
                      {project.code}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const idx = gallery.indexOf(currentDisplayImage);
                      openLightbox(idx >= 0 ? idx : 0);
                    }}
                    className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-emerald-600 hover:text-white text-slate-800 text-xs font-bold border border-slate-200 shadow-md backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    title="Ampliar plano/foto en alta resolución"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white" />
                    <span>Zoom HD</span>
                  </button>
                </div>

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

                    <span className="text-[11px] text-white/90 font-bold hidden sm:inline-block px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                      {gallery.length} fotos de obra
                    </span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ─────────────────────────────────────────────────────────────────
              LADO DERECHO: DOSSIER ARQUITECTÓNICO + PREVIEWS DE PRÓXIMAS OBRAS
              EXPANDIDO AL 100% PARA ELIMINAR CUALQUIER ESPACIO VACÍO
              ───────────────────────────────────────────────────────────────── */}
          <div className="lg:col-span-5 h-full min-h-0 flex flex-col justify-between py-0.5 overflow-hidden">
            
            <AnimatePresence mode="wait" custom={slideDir}>
              <motion.div
                key={project.id}
                custom={slideDir}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 shrink-0"
              >
                {/* Sector y Ubicación: Tipografía editorial pura sin contenedor de caja */}
                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-800">
                  <MapPin className="w-3.5 h-3.5 text-[#F58220] shrink-0" />
                  <span>{project.location} · {project.canton}</span>
                </div>

                {/* Título de la Construcción */}
                <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-slate-900 tracking-tight leading-tight">
                  {project.name}
                </h1>

                {/* Narrativa Arquitectónica Enriquecida */}
                <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-3">
                  {getExtendedDescription(project)}
                </p>

                {/* MATRIZ DE CARACTERÍSTICAS TÉCNICAS (Líneas arquitectónicas limpias, cero cajas) */}
                <div className="pt-0.5">
                  <div className="grid grid-cols-3 gap-y-1.5 gap-x-3 pb-2 border-b border-slate-200/80">
                    {SPECS.map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex flex-col">
                        <div className="flex items-center gap-1 mb-0.5">
                          <Icon className="w-3 h-3 text-emerald-700" />
                          <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider truncate">
                            {label}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight truncate">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {project.structureType && (
                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-600">
                      <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 text-[9.5px]">
                        <Hammer className="w-3 h-3 text-[#F58220]" />
                        <span>Sistema:</span>
                      </span>
                      <span className="font-semibold text-slate-800 truncate max-w-[75%]">
                        {project.structureType}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* ═════════════════════════════════════════════════════════════════
                CUADRANTE INFERIOR DERECHO: PRÓXIMAS OBRAS EN EL SLIDER
                SIN CONTENEDOR ENVOLVENTE (CERO BOX-IN-BOX), MÁSCARAS DE SOBREMONTAJE
                ═════════════════════════════════════════════════════════════════ */}
            {upcomingProjects.length > 0 ? (
              <div className="flex-1 min-h-0 my-2 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F58220] animate-pulse" />
                    <span className="text-[10.5px] font-black tracking-widest uppercase text-slate-400">
                      Próximas Obras en el Slider
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                    <span>Clic para explorar</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>

                {/* Grid directo de tarjetas: flotan directamente en el plano arquitectónico */}
                <div className={`grid gap-3 flex-1 min-h-0 ${upcomingProjects.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {upcomingProjects.map(({ item, index }) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.025, y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectIndex(index)}
                      className="group relative h-full min-h-[145px] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-emerald-900/20 transition-all duration-300 cursor-pointer bg-slate-950 flex flex-col justify-between border border-slate-300/40 hover:border-emerald-500/80"
                      title={`Expandir y ver ${item.name}`}
                    >
                      <Image
                        src={item.mainImage}
                        alt={item.name}
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                        referrerPolicy="no-referrer"
                      />
                      {/* Máscara de diseño con degradado de sobremontaje */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: 'linear-gradient(to top, rgba(2, 6, 23, 0.96) 0%, rgba(2, 6, 23, 0.55) 45%, rgba(2, 6, 23, 0.1) 75%, transparent 100%)',
                        }}
                      />

                      {/* Elementos sobremontados directamente sobre la máscara */}
                      <div className="relative p-2.5 sm:p-3 flex flex-col justify-between h-full z-10 pointer-events-none">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full backdrop-blur-md border shadow-xs ${getStatusBadgeStyle(item.status)}`}>
                            {item.status}
                          </span>
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-black/60 text-emerald-300 border border-white/15 backdrop-blur-md">
                            {item.code}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-xs sm:text-sm font-black text-white leading-tight line-clamp-1 group-hover:text-emerald-300 transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-slate-300 flex items-center gap-1 truncate">
                            <MapPin className="w-2.5 h-2.5 text-[#F58220] shrink-0" />
                            <span>{item.location}</span>
                          </p>
                          <div className="pt-1 flex items-center justify-between border-t border-white/15">
                            <span className="text-[9.5px] font-mono font-bold text-slate-300">
                              {item.constructionArea} m² · {item.bedrooms} hab
                            </span>
                            <span className="text-[9.5px] font-bold text-emerald-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                              <span>Explorar</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              /* Fallback en caso de 1 sola construcción: acabados de primera para llenar el cuadrante */
              <div className="flex-1 min-h-0 my-2 p-3 rounded-2xl flex flex-col justify-center">
                <span className="block text-[10.5px] font-black tracking-wider uppercase text-slate-400 mb-2">
                  Detalles y Acabados de Primera
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {project.features?.slice(0, 4).map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────────
                ZONA DE ACCIÓN: BOTÓN COTIZAR WHATSAPP + CONTADOR NUMÉRICO
                ───────────────────────────────────────────────────────────────── */}
            <div className="pt-1.5 border-t border-slate-200/80 mt-auto flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={contactWhatsApp}
                className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#1ebf57] hover:from-[#1ebf57] hover:to-[#17a84c] text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <WhatsAppIcon size={18} className="text-slate-950" />
                <span>Cotizar Proyecto o Visitar Obra</span>
              </button>

              {/* Contador numérico de obra tipográfico integrado (sin caja gris) */}
              {total > 1 && (
                <div className="flex items-center gap-1.5 px-3 py-2 text-slate-700">
                  <span className="text-sm font-black text-emerald-800 font-mono">
                    {String(currentIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-slate-300 font-mono">/</span>
                  <span className="text-xs font-bold text-slate-400 font-mono">
                    {String(total).padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

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
