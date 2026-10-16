'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Sliders,
  Save,
  Check,
  X,
  Upload,
  Move,
  ZoomIn,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Image as ImageIcon,
  Link as LinkIcon,
  Eye,
  Edit3,
  Home,
  Building2,
  ShieldCheck,
  Phone,
} from 'lucide-react';
import {
  type BannerPageId,
  type BannerSlideConfig,
  type SiteBannersConfig,
  DEFAULT_SITE_BANNERS,
  useSiteBanners,
  uploadBannerImage,
} from '@/src/lib/bannerStorage';

interface SectionMeta {
  id: BannerPageId;
  label: string;
  subtitle: string;
  badgeLabel: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  accentBadgeClass: string;
}

const BANNER_SECTIONS: SectionMeta[] = [
  {
    id: 'inicio',
    label: 'Ventana Inicio',
    subtitle: 'Carrusel Principal (3 Banners)',
    badgeLabel: '3 Banners',
    desc: 'Carrusel panorámico de 3 imágenes de portada que reciben al visitante en la página principal.',
    icon: Home,
    accentBadgeClass: 'bg-emerald-600 text-white',
  },
  {
    id: 'lotes',
    label: 'Ventana Lotes',
    subtitle: 'Portada de Propiedades (1 Imagen)',
    badgeLabel: '1 Banner Único',
    desc: 'Imagen de portada única para el catálogo de lotes urbanizados y propiedades disponibles.',
    icon: Building2,
    accentBadgeClass: 'bg-[#F58220] text-white',
  },
  {
    id: 'nosotros',
    label: 'Ventana Nosotros',
    subtitle: 'Portada Institucional (1 Imagen)',
    badgeLabel: '1 Banner Único',
    desc: 'Imagen de portada única para la sección institucional de solidez y respaldo jurídico notarial.',
    icon: ShieldCheck,
    accentBadgeClass: 'bg-teal-600 text-white',
  },
  {
    id: 'contacto',
    label: 'Ventana Contacto',
    subtitle: 'Portada de Atención (1 Imagen)',
    badgeLabel: '1 Banner Único',
    desc: 'Imagen de portada única para la página de contacto directo, ubicación y agendamiento.',
    icon: Phone,
    accentBadgeClass: 'bg-sky-600 text-white',
  },
];

export function AdminBannersView() {
  const { banners, saveBanners } = useSiteBanners();

  const [activeSection, setActiveSection] = useState<BannerPageId | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [draftBanners, setDraftBanners] = useState<SiteBannersConfig>(banners);

  const [isUploadingBg, setIsUploadingBg] = useState(false);
  const [isBgUrlModalOpen, setIsBgUrlModalOpen] = useState(false);
  const [bgUrlInput, setBgUrlInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Modo encuadre / zoom interactivo (Pan & Zoom)
  const [isEditingBg, setIsEditingBg] = useState(false);
  // Mostrar/ocultar edición de textos superpuestos
  const [showTextOverlay, setShowTextOverlay] = useState(true);
  const [isPanning, setIsPanning] = useState(false);

  const panStartRef = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // Sincronizar borrador cuando cambian los banners remotos
  useEffect(() => {
    setDraftBanners(banners);
  }, [banners]);

  // Obtener el slide actual según la ventana activa
  const getCurrentSlide = useCallback((): BannerSlideConfig => {
    if (!activeSection) return draftBanners.inicio[0];
    if (activeSection === 'inicio') {
      const safeIdx = Math.max(0, Math.min(2, activeSlideIndex));
      return draftBanners.inicio[safeIdx] || draftBanners.inicio[0];
    }
    return draftBanners[activeSection];
  }, [activeSection, activeSlideIndex, draftBanners]);

  const currentSlide = getCurrentSlide();

  // Actualizar el slide actual dentro del borrador
  const updateCurrentSlide = useCallback(
    (updates: Partial<BannerSlideConfig>) => {
      if (!activeSection) return;
      setDraftBanners((prev) => {
        if (activeSection === 'inicio') {
          const safeIdx = Math.max(0, Math.min(2, activeSlideIndex));
          const nextInicio: [BannerSlideConfig, BannerSlideConfig, BannerSlideConfig] = [
            { ...prev.inicio[0] },
            { ...prev.inicio[1] },
            { ...prev.inicio[2] },
          ];
          nextInicio[safeIdx] = { ...nextInicio[safeIdx], ...updates };
          return { ...prev, inicio: nextInicio };
        }
        return {
          ...prev,
          [activeSection]: {
            ...prev[activeSection],
            ...updates,
          },
        };
      });
    },
    [activeSection, activeSlideIndex]
  );

  const isDirty = JSON.stringify(draftBanners) !== JSON.stringify(banners);

  // Pan & Zoom handlers
  const handlePanStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isEditingBg) return;
      if ('touches' in e && e.touches.length !== 1) return;
      e.preventDefault();
      setIsPanning(true);

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      panStartRef.current = {
        x: clientX,
        y: clientY,
        posX: currentSlide.bgPositionX ?? 50,
        posY: currentSlide.bgPositionY ?? 50,
      };
    },
    [currentSlide.bgPositionX, currentSlide.bgPositionY, isEditingBg]
  );

  const handlePanMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isPanning || !panStartRef.current || !canvasRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const rect = canvasRef.current.getBoundingClientRect();
      const dx = clientX - panStartRef.current.x;
      const dy = clientY - panStartRef.current.y;

      const sensX = 100 / Math.max(rect.width, 1);
      const sensY = 100 / Math.max(rect.height, 1);

      const newX = Math.round(Math.max(0, Math.min(100, panStartRef.current.posX - dx * sensX)));
      const newY = Math.round(Math.max(0, Math.min(100, panStartRef.current.posY - dy * sensY)));

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        updateCurrentSlide({
          bgPositionX: newX,
          bgPositionY: newY,
        });
      });
    },
    [isPanning, updateCurrentSlide]
  );

  const handlePanEnd = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      panStartRef.current = null;
      cancelAnimationFrame(rafRef.current);
    }
  }, [isPanning]);

  useEffect(() => {
    if (!isPanning) return;
    const onUp = () => handlePanEnd();
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, [isPanning, handlePanEnd]);

  // Subir archivo de imagen desde PC / Celular
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeSection) return;

    const previewBlobUrl = URL.createObjectURL(file);
    updateCurrentSlide({ image: previewBlobUrl });

    try {
      setIsUploadingBg(true);
      const uploadedUrl = await uploadBannerImage(file, activeSection);
      const updatedDraft: SiteBannersConfig = (() => {
        if (activeSection === 'inicio') {
          const safeIdx = Math.max(0, Math.min(2, activeSlideIndex));
          const nextInicio: [BannerSlideConfig, BannerSlideConfig, BannerSlideConfig] = [
            { ...draftBanners.inicio[0] },
            { ...draftBanners.inicio[1] },
            { ...draftBanners.inicio[2] },
          ];
          nextInicio[safeIdx] = { ...nextInicio[safeIdx], image: uploadedUrl };
          return { ...draftBanners, inicio: nextInicio };
        }
        return {
          ...draftBanners,
          [activeSection]: {
            ...draftBanners[activeSection],
            image: uploadedUrl,
          },
        };
      })();

      setDraftBanners(updatedDraft);
      setBgUrlInput(uploadedUrl);
      // Guardado automático tras subir foto para que quede persistido de inmediato
      await saveBanners(updatedDraft);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir la imagen';
      alert(`No se pudo subir la imagen del banner: ${msg}`);
    } finally {
      setIsUploadingBg(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveBanners(draftBanners);
      setSaveSuccess(true);
      setIsEditingBg(false);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar cambios';
      alert(`Error al guardar: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetCurrentBanner = () => {
    if (!activeSection) return;
    if (activeSection === 'inicio') {
      const safeIdx = Math.max(0, Math.min(2, activeSlideIndex));
      updateCurrentSlide({ ...DEFAULT_SITE_BANNERS.inicio[safeIdx] });
    } else {
      updateCurrentSlide({ ...DEFAULT_SITE_BANNERS[activeSection] });
    }
  };

  const activeSectionMeta = BANNER_SECTIONS.find((s) => s.id === activeSection);
  const posX = currentSlide.bgPositionX ?? 50;
  const posY = currentSlide.bgPositionY ?? 50;
  const zoomPercent = Math.max(100, Math.min(250, currentSlide.bgZoom ?? 100));
  const zoomScale = zoomPercent / 100;

  // =========================================================================
  // VISTA 1: HUB DE LAS 4 VENTANAS DEL SITIO WEB
  // =========================================================================
  if (activeSection === null) {
    return (
      <div className="space-y-6 w-full animate-in fade-in duration-200">
        {/* Encabezado informativo */}
        <div className="bg-slate-50/80 p-5 sm:p-7 rounded-3xl border border-slate-200/90">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-emerald-600/10 text-emerald-800 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2.5 border border-emerald-600/20">
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gestor de Banners y Portadas</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Banners de Inicio de Cada Ventana
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              Selecciona cualquier ventana del sitio web para cambiar sus fotografías de portada, ajustar el encuadre con zoom o editar sus títulos. La ventana de <strong className="text-slate-700">Inicio cuenta con 3 banners</strong> para el carrusel principal y las demás ventanas (<strong className="text-slate-700">Lotes, Nosotros y Contacto</strong>) cuentan con <strong className="text-slate-700">1 imagen de banner única</strong> por página.
            </p>
          </div>
        </div>

        {/* Grilla de 4 tarjetas para cada ventana */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {BANNER_SECTIONS.map((sec) => {
            const IconComponent = sec.icon;
            const previewSlide =
              sec.id === 'inicio' ? draftBanners.inicio[0] : draftBanners[sec.id];

            return (
              <div
                key={sec.id}
                onClick={() => {
                  setActiveSection(sec.id);
                  setActiveSlideIndex(0);
                  setIsEditingBg(false);
                }}
                className="group relative bg-white rounded-3xl border-2 border-slate-200/90 hover:border-emerald-600 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
              >
                {/* Miniatura visual del banner */}
                <div className="relative aspect-16/10 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={previewSlide.image}
                    alt={sec.label}
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                    style={{
                      objectPosition: `${previewSlide.bgPositionX ?? 50}% ${previewSlide.bgPositionY ?? 50}%`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-black/35 to-black/40" />

                  {/* Etiqueta de ventana */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                    <span className="bg-black/75 backdrop-blur-md text-white text-[11px] font-black px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                      <IconComponent className="w-3.5 h-3.5 text-[#5be196]" />
                      <span>{sec.label.replace('Ventana ', '')}</span>
                    </span>
                  </div>

                  {/* Cantidad de banners permitidos */}
                  <div className="absolute top-3 right-3 z-10">
                    <span
                      className={`${sec.accentBadgeClass} text-[10px] font-black px-2.5 py-1 rounded-full shadow-md`}
                    >
                      {sec.badgeLabel}
                    </span>
                  </div>

                  {/* Miniaturas de las 3 imágenes si es Inicio */}
                  {sec.id === 'inicio' && (
                    <div className="absolute bottom-10 left-3 z-10 flex items-center gap-1.5">
                      {draftBanners.inicio.map((slide, idx) => (
                        <div
                          key={slide.id}
                          className="w-9 h-6 rounded-md overflow-hidden border border-white/50 shadow-sm bg-slate-900"
                          title={`Banner #${idx + 1}`}
                        >
                          <img
                            src={slide.image}
                            alt={`Miniatura ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Título superpuesto */}
                  <div className="absolute bottom-2.5 left-3 right-3 z-10">
                    <p className="text-white font-black text-xs sm:text-sm line-clamp-1 drop-shadow-md">
                      {previewSlide.titleLine1}{' '}
                      <span className="text-[#5be196]">{previewSlide.titleHighlight1}</span>
                    </p>
                  </div>
                </div>

                {/* Detalles inferiores */}
                <div className="p-4 sm:p-5 space-y-3 bg-white flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider block">
                      {sec.subtitle}
                    </span>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {sec.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                      <span>Personalizar Banner</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white rounded-lg text-[11px] font-bold transition-colors">
                      Editar
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VISTA 2: EDITOR VISUAL WYSIWYG PARA LA VENTANA SELECCIONADA
  // =========================================================================
  return (
    <div className="space-y-4 w-full animate-in fade-in duration-200">
      {/* Navegación superior entre ventanas */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            setActiveSection(null);
            setIsEditingBg(false);
          }}
          className="px-4 py-2 bg-white border border-slate-200 hover:border-emerald-600 text-slate-800 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-2xs cursor-pointer transition-all hover:bg-emerald-50/50"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-700" />
          <span>Volver a todas las ventanas</span>
        </button>

        {/* Selector rápido de ventana */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {BANNER_SECTIONS.map((sec) => {
            const IconComp = sec.icon;
            const isCurrent = sec.id === activeSection;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  setActiveSection(sec.id);
                  setActiveSlideIndex(0);
                  setIsEditingBg(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  isCurrent
                    ? 'bg-[#0d2e1a] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{sec.label.replace('Ventana ', '')}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isCurrent ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {sec.id === 'inicio' ? '3' : '1'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Barra de selección de Banner (3 opciones en Inicio / 1 única en las demás páginas) + Botón Guardar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/90">
        <div className="flex items-center gap-2 overflow-x-auto">
          {activeSection === 'inicio' ? (
            <>
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider pl-1 pr-1 shrink-0">
                3 Banners de Inicio:
              </span>
              {draftBanners.inicio.map((slide, idx) => {
                const isSelected = idx === activeSlideIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => {
                      setActiveSlideIndex(idx);
                      setIsEditingBg(false);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-[#0d2e1a] text-white shadow-sm ring-2 ring-emerald-500'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={`Banner ${idx + 1}`}
                      className="w-6 h-4 rounded object-cover border border-white/30"
                    />
                    <span>Banner #{idx + 1}</span>
                  </button>
                );
              })}
            </>
          ) : (
            <div className="flex items-center gap-2.5 pl-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                {activeSectionMeta?.label} — Imagen de Portada Única (1 Banner)
              </span>
            </div>
          )}
        </div>

        {/* Acciones de Guardar / Restaurar */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetCurrentBanner}
            className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            title="Restaurar este banner a su imagen y valores por defecto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restaurar Original</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isUploadingBg}
            className={`px-5 py-2 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
              saveSuccess
                ? 'bg-emerald-600'
                : isDirty
                ? 'bg-[#F58220] hover:bg-[#e07112]'
                : 'bg-[#0d2e1a] hover:bg-emerald-900'
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Guardando...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>¡Guardado!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* LIENZO INTERACTIVO WYSIWYG DEL BANNER */}
      <div
        ref={canvasRef}
        className={`relative w-full rounded-3xl overflow-hidden border-2 shadow-xl min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] bg-slate-950 transition-all select-none flex flex-col justify-center ${
          isEditingBg
            ? 'border-emerald-500 ' + (isPanning ? 'cursor-grabbing' : 'cursor-grab')
            : 'border-slate-200'
        }`}
        onMouseDown={isEditingBg ? handlePanStart : undefined}
        onMouseMove={isEditingBg ? handlePanMove : undefined}
        onMouseUp={isEditingBg ? handlePanEnd : undefined}
        onMouseLeave={isEditingBg ? handlePanEnd : undefined}
        onTouchStart={isEditingBg ? handlePanStart : undefined}
        onTouchMove={isEditingBg ? handlePanMove : undefined}
        onTouchEnd={isEditingBg ? handlePanEnd : undefined}
      >
        {/* Fotografía de fondo con soporte de encuadre X/Y y Zoom */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src={currentSlide.image}
            alt={currentSlide.alt}
            draggable={false}
            className="w-full h-full object-cover select-none pointer-events-none transition-none"
            style={{
              objectPosition: `${posX}% ${posY}%`,
              transform:
                zoomScale > 1
                  ? `scale(${zoomScale}) translate(${(50 - posX) * (1 - 1 / zoomScale)}%, ${(50 - posY) * (1 - 1 / zoomScale)}%)`
                  : undefined,
              transformOrigin: 'center center',
            }}
          />
        </div>

        {/* Degradados cinematográficos de MGM */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
            isEditingBg || !showTextOverlay ? 'opacity-30' : 'opacity-100'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 sm:via-black/50 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/35" />
        </div>

        {/* MODO ENCUADRE Y ZOOM (PAN & ZOOM) */}
        {isEditingBg ? (
          <>
            <div className="absolute inset-0 border-4 border-emerald-500/60 rounded-3xl pointer-events-none z-10 animate-pulse" />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center gap-2 bg-black/70 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 shadow-2xl text-center">
              <Move className="w-7 h-7 text-[#5be196] animate-bounce" />
              <span className="text-white font-bold text-xs sm:text-sm">
                Arrastra la imagen para ajustar el encuadre
              </span>
              <span className="text-[11px] text-emerald-300 font-mono">
                Encuadre X: {posX}% | Y: {posY}% | Zoom: {zoomPercent}%
              </span>
            </div>

            <div
              className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex flex-wrap items-center justify-center gap-4 bg-black/90 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/25 shadow-2xl w-[92%] sm:w-auto"
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2.5">
                <ZoomIn className="w-4 h-4 text-[#5be196] shrink-0" />
                <span className="text-[11px] text-white/80 font-bold uppercase tracking-wider">
                  Zoom:
                </span>
                <input
                  type="range"
                  min="100"
                  max="250"
                  step="5"
                  value={zoomPercent}
                  onChange={(e) => updateCurrentSlide({ bgZoom: Number(e.target.value) })}
                  className="w-28 sm:w-40 h-2 accent-emerald-500 cursor-pointer bg-white/20 rounded-lg"
                />
                <span className="text-xs font-mono text-[#5be196] font-bold min-w-[40px] text-center">
                  {zoomPercent}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateCurrentSlide({ bgPositionX: 50, bgPositionY: 50, bgZoom: 100 })
                  }
                  className="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Centrar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditingBg(false)}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Listo</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Barra flotante superior izquierda: Encuadre y Vista Limpia */}
            <div
              className="absolute top-4 left-4 z-30 flex flex-wrap items-center gap-2"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsEditingBg(true)}
                className="px-3.5 py-2 bg-black/80 hover:bg-black text-white font-bold text-xs rounded-2xl backdrop-blur-md shadow-lg flex items-center gap-2 cursor-pointer transition-all border border-white/20"
                title="Mover encuadre y ajustar zoom de la foto"
              >
                <Move className="w-3.5 h-3.5 text-[#5be196]" />
                <span>Encuadrar / Zoom</span>
              </button>

              <button
                type="button"
                onClick={() => setShowTextOverlay((prev) => !prev)}
                className="px-3.5 py-2 bg-black/80 hover:bg-black text-white font-bold text-xs rounded-2xl backdrop-blur-md shadow-lg flex items-center gap-1.5 cursor-pointer transition-all border border-white/20"
                title="Alternar entre edición de textos y vista limpia de la imagen"
              >
                {showTextOverlay ? (
                  <>
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Ver Solo Imagen</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3.5 h-3.5 text-[#5be196]" />
                    <span className="hidden sm:inline">Mostrar Textos</span>
                  </>
                )}
              </button>
            </div>

            {/* Barra flotante superior derecha: Subir Foto desde PC/Móvil o Pegar URL */}
            <div
              className="absolute top-4 right-4 z-30 flex items-center gap-2"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <label className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer transition-all border border-emerald-400/40">
                {isUploadingBg ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Upload className="w-4 h-4 text-white" />
                )}
                <span>{isUploadingBg ? 'Subiendo imagen...' : 'Subir Imagen'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploadingBg}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  setBgUrlInput(currentSlide.image);
                  setIsBgUrlModalOpen(true);
                }}
                className="px-3 py-2 bg-black/80 hover:bg-black text-white font-bold text-xs rounded-2xl backdrop-blur-md shadow-lg flex items-center gap-1.5 cursor-pointer transition-all border border-white/20"
                title="Pegar enlace URL directo de imagen"
              >
                <LinkIcon className="w-3.5 h-3.5 text-[#5be196]" />
                <span>URL</span>
              </button>
            </div>

            {/* Modal para pegar URL directa */}
            {isBgUrlModalOpen && (
              <div className="absolute inset-x-4 sm:inset-x-8 top-16 z-40 bg-white p-5 rounded-2xl shadow-2xl border border-slate-200 space-y-3 max-w-xl mx-auto">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">
                    Enlace URL de la imagen del banner
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsBgUrlModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="https://... o /inicio-banner.jpg"
                  value={bgUrlInput}
                  onChange={(e) => setBgUrlInput(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-none focus:ring-2 focus:ring-emerald-600 text-slate-800"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBgUrlModalOpen(false)}
                    className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (bgUrlInput.trim()) {
                        updateCurrentSlide({ image: bgUrlInput.trim() });
                        setIsBgUrlModalOpen(false);
                      }
                    }}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Aplicar Imagen
                  </button>
                </div>
              </div>
            )}

            {/* Textos editables sobre el banner */}
            {showTextOverlay && (
              <div className="relative z-20 w-full max-w-6xl mx-auto px-5 sm:px-10 lg:px-12 pt-16 pb-10">
                <div className="max-w-3xl space-y-3 text-left">
                  <div>
                    <label className="block text-white/70 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Título Principal (Línea Superior)
                    </label>
                    <input
                      type="text"
                      value={currentSlide.titleLine1}
                      onChange={(e) => updateCurrentSlide({ titleLine1: e.target.value })}
                      placeholder="Título principal..."
                      className="w-full bg-black/35 hover:bg-black/45 focus:bg-black/60 text-white font-black text-xl sm:text-3xl lg:text-4xl tracking-tight px-3.5 py-2 rounded-xl border border-white/20 outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-emerald-300/90 text-[10px] font-bold uppercase tracking-wider mb-1">
                        Texto Destacado Verde
                      </label>
                      <input
                        type="text"
                        value={currentSlide.titleHighlight1}
                        onChange={(e) => updateCurrentSlide({ titleHighlight1: e.target.value })}
                        placeholder="Ej: y el Hogar"
                        className="w-full bg-black/35 hover:bg-black/45 focus:bg-black/60 text-[#5be196] font-black text-base sm:text-xl px-3.5 py-2 rounded-xl border border-[#5be196]/40 outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-amber-300/90 text-[10px] font-bold uppercase tracking-wider mb-1">
                        Texto Destacado Naranja
                      </label>
                      <input
                        type="text"
                        value={currentSlide.titleHighlight2}
                        onChange={(e) => updateCurrentSlide({ titleHighlight2: e.target.value })}
                        placeholder="Ej: de tu Familia"
                        className="w-full bg-black/35 hover:bg-black/45 focus:bg-black/60 text-[#F58220] font-black text-base sm:text-xl px-3.5 py-2 rounded-xl border border-[#F58220]/40 outline-none focus:ring-2 focus:ring-amber-400 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 text-[10px] font-bold uppercase tracking-wider mb-1">
                      Descripción del Banner
                    </label>
                    <textarea
                      rows={2}
                      value={currentSlide.description}
                      onChange={(e) => updateCurrentSlide({ description: e.target.value })}
                      placeholder="Descripción del banner..."
                      className="w-full bg-black/35 hover:bg-black/45 focus:bg-black/60 text-slate-100 text-xs sm:text-sm p-3 rounded-xl border border-white/20 outline-none focus:ring-2 focus:ring-emerald-400 leading-relaxed backdrop-blur-sm resize-y"
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* RESUMEN RÁPIDO INFERIOR DE IMÁGENES DE LA SECCIÓN */}
      {activeSection === 'inicio' ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {draftBanners.inicio.map((slide, idx) => {
            const isSelected = idx === activeSlideIndex;
            return (
              <div
                key={slide.id}
                onClick={() => {
                  setActiveSlideIndex(idx);
                  setIsEditingBg(false);
                }}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                  <img
                    src={slide.image}
                    alt={`Banner #${idx + 1}`}
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: `${slide.bgPositionX ?? 50}% ${slide.bgPositionY ?? 50}%`,
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">
                      Banner de Inicio #{idx + 1}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                        Editando
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{slide.titleLine1}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-16 h-11 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
              <img
                src={currentSlide.image}
                alt={activeSectionMeta?.label}
                className="w-full h-full object-cover"
                style={{
                  objectPosition: `${posX}% ${posY}%`,
                }}
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-slate-800">
                Imagen activa en {activeSectionMeta?.label} (1 solo banner permitido en esta página)
              </p>
              <p className="text-[11px] text-slate-500 font-mono truncate">{currentSlide.image}</p>
            </div>
          </div>
          <label className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shrink-0 shadow-2xs">
            <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>Reemplazar Imagen</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploadingBg}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
}
