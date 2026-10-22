'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Building,
  Star,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  KeyRound,
  Headphones,
  Users,
  PenLine,
  X,
  Calendar,
  Sparkles,
  Trees,
  Award,
  Droplets,
  Leaf,
  Trophy,
  Compass,
  Search,
  MapPin,
  SlidersHorizontal,
} from 'lucide-react';
import type { PageView } from '../Header';
import {
  TESTIMONIALS_DATA,
  getGeneralWhatsAppUrl,
  type LotProperty,
} from '@/src/data/lots';
import { useProperties } from '@/src/context/PropertyContext';
import { useSiteBanners } from '@/src/lib/bannerStorage';
import { useSiteSettings } from '@/src/lib/siteSettings';
import { useStoredReviews } from '@/src/lib/reviewStorage';
import { PropertyCard } from '../PropertyCard';
import { WhatsAppIcon } from '../SocialIcons';
import { ScrollReveal } from '../common/ScrollReveal';
import { CardDeckGallery } from '../common/CardDeckGallery';
import { AnimatedInsignia } from '../common/AnimatedInsignia';

interface HomeViewProps {
  onNavigate: (page: PageView) => void;
  onSelectLot: (lot: LotProperty) => void;
  onFilterSearch?: (location: string, type: string) => void;
}

// 1. Franja de Confianza (Trust Strip)
const TRUST_ITEMS = [
  {
    title: 'Certeza Notarial',
    subtitle: 'Escrituras individuales y minutas solemnes ante Notaría Pública',
    icon: ShieldCheck,
    isAccent: false,
  },
  {
    title: 'Obras Civiles Concluidas',
    subtitle: 'Vías adoquinadas, aceras y redes de alcantarillado in situ',
    icon: Building,
    isAccent: false,
  },
  {
    title: 'Crédito Directo hasta 48M',
    subtitle: 'Financiamiento propio con tu cédula, sin bancos ni buró',
    icon: CreditCard,
    isAccent: true,
  },
  {
    title: 'Asesoría & Recorridos 24/7',
    subtitle: 'Acompañamiento legal, técnico y visitas guiadas con transporte',
    icon: Headphones,
    isAccent: false,
  },
];

// 3. Pasos Reales del Proceso de Adquisición (Sección Editorial)
const PURCHASE_PROCESS_STEPS = [
  {
    step: '01',
    title: 'Asesoría y Selección',
    desc: 'Evaluamos tu presupuesto y te presentamos opciones con metrajes y planos topográficos exactos.',
    icon: Users,
  },
  {
    step: '02',
    title: 'Recorrido en Terreno',
    desc: 'Te trasladamos en transporte corporativo gratuito para inspeccionar obras, vías y servicios in situ.',
    icon: Calendar,
  },
  {
    step: '03',
    title: 'Crédito Directo con Cédula',
    desc: 'Financiamiento hasta 48 meses sin intermediación bancaria, con aprobación inmediata.',
    icon: CreditCard,
  },
  {
    step: '04',
    title: 'Escrituración Notarial',
    desc: 'Minuta solemne y escrituras legalizadas ante notaría pública con entrega formal de tu lote.',
    icon: ShieldCheck,
  },
];

// 4. Beneficios Urbanos & Infraestructura Real de MGM (Especificaciones de Ingeniería Civil con Color y Vida)
const URBAN_BENEFIT_ITEMS = [
  {
    title: 'Vías Adoquinadas 10 a 12m',
    desc: 'Calzadas vehiculares de alto tráfico con bordillos de hormigón armado, cunetas y aceras peatonales integradas.',
    icon: Building,
    badge: 'OBRA VIAL CUMPLIDA',
    buttonText: 'Ver Especificaciones & Vías',
    bgClass: 'bg-[#113d22]', // Verde Corporativo Profundo MGM
    badgeColor: 'text-[#5be196] bg-black/30 border-[#5be196]/30',
    buttonBg: 'bg-black/30 hover:bg-black/50 text-white border border-white/20',
    image: '/benefit-road.png',
    imageAlt: 'Vías adoquinadas de alto tránsito',
    imageScale: 'scale-105',
  },
  {
    title: 'Red Eléctrica & Agua Subterránea',
    desc: 'Distribución técnica soterrada sin cableado aéreo visible: agua potable presurizada y acometidas de energía certificadas.',
    icon: Droplets,
    badge: '100% SUBTERRÁNEO',
    buttonText: 'Consultar Servicios In Situ',
    bgClass: 'bg-[#F58220]', // Naranja MGM Oficial
    badgeColor: 'text-amber-950 bg-black/15 border-black/20',
    buttonBg: 'bg-black/20 hover:bg-black/35 text-white border border-white/25',
    image: '/benefit-services.png',
    imageAlt: 'Generador y acometidas eléctricas subterráneas',
    imageScale: 'scale-95',
  },
  {
    title: '+8.000 m² de Áreas Verdes & Parques',
    desc: 'Espacios recreativos integrados a la trama urbana con caminerías ecológicas, parques biosaludables y reforestación nativa.',
    icon: Leaf,
    badge: 'PULMÓN VERDE',
    buttonText: 'Explorar Senderos & Parques',
    bgClass: 'bg-[#166534]', // Verde Bosque Intenso MGM
    badgeColor: 'text-emerald-200 bg-black/30 border-emerald-400/30',
    buttonBg: 'bg-black/30 hover:bg-black/50 text-white border border-white/20',
    image: '/benefit-park.png',
    imageAlt: 'Parques y árboles en áreas comunales',
    imageScale: 'scale-110',
  },
  {
    title: 'Topografía Plana & Garita 24/7',
    desc: 'Lotes nivelados certificados para cimentación inmediata, pórtico monumental con control de acceso y monitoreo permanente.',
    icon: ShieldCheck,
    badge: 'SEGURIDAD & SUELO FIRME',
    buttonText: 'Cotizar Lote Urbanizado',
    bgClass: 'bg-[#0d2f1a]', // Verde Esmeralda Nocturno MGM
    badgeColor: 'text-[#5be196] bg-black/40 border-[#5be196]/30',
    buttonBg: 'bg-black/30 hover:bg-black/50 text-white border border-white/20',
    image: '/house-isolated.webp',
    imageAlt: 'Vivienda modelo y topografía plana calificada',
    imageScale: 'scale-110',
  },
];

export function HomeView({
  onNavigate,
  onSelectLot,
  onFilterSearch,
}: HomeViewProps) {
  useSiteSettings();
  const { properties } = useProperties();
  const { banners } = useSiteBanners();

  const homeSlides = banners.inicio;

  // Filtrar solo propiedades activas (excluir 'Inactiva' / Borrador)
  const activeProperties = React.useMemo(
    () => properties.filter((p) => p.status !== 'Inactiva'),
    [properties]
  );

  // Estados del Hero Carrusel
  const [heroImgIndex, setHeroImgIndex] = useState(0);
  const [heroHovered, setHeroHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const activeHeroSlide = homeSlides[heroImgIndex] || homeSlides[0];


  // Cálculo de proyectos únicos verificados
  const projectCount = React.useMemo(() => {
    const unique = new Set(activeProperties.map((p) => p.project).filter(Boolean));
    return unique.size || 6;
  }, [activeProperties]);

  // Reseñas persistentes con respaldo en la nube y almacenamiento local
  const { reviews: storedReviews, addReview } = useStoredReviews();
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    role: '',
    location: '',
    text: '',
    stars: 5,
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Lista activa de testimonios con fallback a los predeterminados
  const testimonials = storedReviews && storedReviews.length > 0 ? storedReviews : TESTIMONIALS_DATA;

  // Soporte de navegación y filtrado conectado
  const handleCatalogExplore = (typeFilter?: string) => {
    if (typeFilter && onFilterSearch) {
      onFilterSearch('', typeFilter);
    } else {
      onNavigate('properties');
    }
  };

  // Cierre accesible con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isReviewModalOpen) {
        setIsReviewModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReviewModalOpen]);

  // Rotación suave del Hero cada 6 segundos (respetando prefers-reduced-motion)
  useEffect(() => {
    if (heroHovered) return;
    const mediaQuery = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    if (mediaQuery?.matches) return;
    const interval = setInterval(() => {
      setHeroImgIndex((prev) => (prev + 1 >= homeSlides.length ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [heroHovered, homeSlides.length]);

  const nextHeroImage = () => {
    setHeroImgIndex((prev) => (prev + 1 >= homeSlides.length ? 0 : prev + 1));
  };

  const prevHeroImage = () => {
    setHeroImgIndex((prev) => (prev - 1 < 0 ? homeSlides.length - 1 : prev - 1));
  };

  // Gesto táctil Swipe para dispositivos móviles
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        nextHeroImage();
      } else {
        prevHeroImage();
      }
    }
    setTouchStartX(null);
  };

  const nextTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev + 1 >= testimonials.length ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setActiveTestimonialIdx((prev) => (prev - 1 < 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.text.trim()) return;

    await addReview({
      name: newReview.name.trim(),
      role: newReview.role.trim() || 'Propietario Lote · Ciudadela Miravalle',
      text: newReview.text.trim(),
      stars: newReview.stars,
      location: newReview.location.trim() || 'Cuenca, Ecuador',
    });

    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setIsReviewModalOpen(false);
      setActiveTestimonialIdx(0);
      setNewReview({
        name: '',
        role: '',
        location: '',
        text: '',
        stars: 5,
      });
    }, 1200);
  };

  // Pestaña de filtrado dinámico en Propiedades Destacadas
  const [activeCatalogTab, setActiveCatalogTab] = useState<'all' | 'miravalle' | 'credit'>('all');

  // Propiedades destacadas primero (conectado al switch 'Destacar en Inicio' del Admin Panel)
  const displayedProperties = React.useMemo(() => {
    const featuredList = activeProperties.filter((p) => p.featured);
    const others = activeProperties.filter((p) => !p.featured);
    let combined = [...featuredList, ...others];

    if (activeCatalogTab === 'miravalle') {
      combined = combined.filter((p) => p.project?.toLowerCase().includes('miravalle'));
    } else if (activeCatalogTab === 'credit') {
      combined = combined.filter((p) => (p.maxMonths || 0) >= 36);
    }

    return combined;
  }, [activeProperties, activeCatalogTab]);

  const currentTestimonial = testimonials[activeTestimonialIdx] || testimonials[0];

  return (
    <div className="w-full overflow-hidden bg-white text-slate-900 selection:bg-emerald-600 selection:text-white">
      {/* =========================================================================
          1. HERO INMOBILIARIO PANORÁMICO EDGE-TO-EDGE (FULL BLEED, TEXTO SOBRE IMAGEN)
          ========================================================================= */}
      <section
        className="group/hero relative w-full bg-slate-950 text-white overflow-hidden min-h-[540px] sm:min-h-[620px] lg:min-h-[min(80vh,820px)] flex flex-col justify-center select-none pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16"
        onMouseEnter={() => setHeroHovered(true)}
        onMouseLeave={() => setHeroHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Fotografía Inmobiliaria Panorámica Protagonista: Ocupa todo el ancho y alto de pantalla (edge-to-edge) */}
        <div className="absolute inset-0 w-full h-full">
          {homeSlides.map((img, idx) => {
            const shouldRenderImage =
              idx === 0 ||
              idx === heroImgIndex ||
              (heroImgIndex > 0 && idx === (heroImgIndex + 1) % homeSlides.length);
            const posX = img.bgPositionX ?? 50;
            const posY = img.bgPositionY ?? 50;
            const zoom = (img.bgZoom ?? 100) / 100;

            return (
              <div
                key={img.id || idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  heroImgIndex === idx ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
                }`}
              >
                {shouldRenderImage && (
                  <Image
                    src={img.image}
                    alt={img.alt}
                    fill
                    priority={idx === 0}
                    sizes="100vw"
                    className="object-cover transform transition-transform duration-7000 ease-out hover:scale-105"
                    style={{
                      objectPosition: `${posX}% ${posY}%`,
                      transform: zoom > 1 ? `scale(${zoom})` : undefined,
                      transformOrigin: 'center center',
                    }}
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
            );
          })}

          {/* Degradados cinematográficos neutros para máxima legibilidad editorial del texto directamente sobre la foto */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 sm:via-black/50 to-black/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/35 pointer-events-none" />
        </div>

        {/* CONTENIDO EDITORIAL: Directamente sobre la foto, sin estar encerrado en ningún box */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Logotipo Vectorial Animado MGM (Centrado en X y posicionado más arriba) */}
          <div className="w-full flex justify-center -mt-6 sm:-mt-10 lg:-mt-12 mb-3 sm:mb-5">
            <ScrollReveal direction="down" delay={0.05} duration={0.65} className="flex justify-center">
              <AnimatedInsignia className="scale-110 sm:scale-125 lg:scale-135" size={88} />
            </ScrollReveal>
          </div>

          <div className="max-w-3xl lg:max-w-4xl flex flex-col items-start text-left select-text cursor-default">

            {/* Título Principal de Estilo Editorial (máx 2 líneas) */}
            <ScrollReveal direction="down" delay={0.15} duration={0.7}>
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-[clamp(2.5rem,3.8vw,3.75rem)] font-black text-white leading-[1.12] tracking-tight drop-shadow-md">
                <span className="block">{activeHeroSlide.titleLine1}</span>
                {(activeHeroSlide.titleHighlight1 || activeHeroSlide.titleHighlight2) && (
                  <span className="block mt-1">
                    <span className="text-[#5be196]">{activeHeroSlide.titleHighlight1} </span>
                    <span className="text-[#F58220]">{activeHeroSlide.titleHighlight2}</span>
                  </span>
                )}
              </h1>
            </ScrollReveal>

            {/* Párrafo Descriptivo con tipografía limpia */}
            <ScrollReveal direction="up" delay={0.2} duration={0.65}>
              <p className="text-sm sm:text-base lg:text-xl text-slate-200 leading-relaxed font-normal max-w-2xl mt-4 sm:mt-6 drop-shadow-xs">
                {activeHeroSlide.description}
              </p>
            </ScrollReveal>
          </div>
        </div>

        {/* Flechas laterales del Hero a la izquierda y derecha */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevHeroImage();
          }}
          aria-label="Diapositiva anterior"
          className="absolute left-3 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-black/45 hover:bg-black/75 text-white/90 hover:text-white border border-white/20 hover:border-white/50 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xl"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextHeroImage();
          }}
          aria-label="Siguiente diapositiva"
          className="absolute right-3 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-black/45 hover:bg-black/75 text-white/90 hover:text-white border border-white/20 hover:border-white/50 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xl"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Indicadores lineales (dots) centrados discretamente abajo */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 shadow-lg">
          {homeSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setHeroImgIndex(i);
              }}
              aria-label={`Ver diapositiva ${i + 1}`}
              className="min-w-[20px] min-h-[20px] p-1 flex items-center justify-center cursor-pointer"
            >
              <span
                className={`h-1.5 rounded-full transition-all block ${
                  heroImgIndex === i ? 'w-6 bg-[#5be196]' : 'w-1.5 bg-white/40 hover:bg-white'
                }`}
              />
            </button>
          ))}
        </div>
      </section>

      {/* =========================================================================
          2. FRANJA COMPACTA DE CONFIANZA (TRUST STRIP) — FUSIÓN SUAVE DESDE EL GIRO
          ========================================================================= */}
      <section className="relative w-full bg-gradient-to-b from-slate-950 via-[#062414] to-[#092b18] text-white py-10 sm:py-14 border-b border-emerald-950/60 shadow-inner overflow-hidden">
        {/* Difuminado continuo: el color oscuro del borde inferior del giro se prolonga e integra gradualmente al verde institucional */}
        <div className="absolute inset-x-0 top-0 h-24 sm:h-32 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent pointer-events-none z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {TRUST_ITEMS.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <ScrollReveal
                  key={idx}
                  direction="up"
                  delay={0.08 * idx}
                  className="flex items-start gap-3.5 p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-emerald-400/40 hover:bg-white/[0.08] transition-all"
                >
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      item.isAccent
                        ? 'bg-[#F58220]/20 text-[#F58220] border border-[#F58220]/30'
                        : 'bg-emerald-900/60 text-[#5be196] border border-emerald-500/20'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h2
                      className={`text-sm sm:text-base font-black tracking-tight ${
                        item.isAccent ? 'text-[#F58220]' : 'text-white'
                      }`}
                    >
                      {item.title}
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {item.subtitle}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. PROPIEDADES DESTACADAS (FEATURED PROPERTIES)
          ========================================================================= */}
      <section className="relative w-full bg-[#f8faf8] text-slate-900 py-14 sm:py-20 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          {/* Encabezado de la sección con Selector de Categorías */}
          <div className="pb-4 border-b border-slate-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <ScrollReveal direction="left" delay={0.1} className="space-y-1.5 max-w-xl">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#15803d]">
                Catálogo Seleccionado
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Propiedades y Lotes Destacados
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Disponibilidad verificada con entrega inmediata, metrajes exactos y planes de financiamiento propio hasta 48 meses.
              </p>
            </ScrollReveal>

            {/* Pestañas de Filtro Rápido */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/60 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setActiveCatalogTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCatalogTab === 'all'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos los Destacados
              </button>
              <button
                type="button"
                onClick={() => setActiveCatalogTab('miravalle')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCatalogTab === 'miravalle'
                    ? 'bg-[#113d22] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ciudadela Miravalle
              </button>
              <button
                type="button"
                onClick={() => setActiveCatalogTab('credit')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCatalogTab === 'credit'
                    ? 'bg-[#F58220] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Crédito Directo
              </button>
            </div>
          </div>

          {/* Grilla Responsiva de Tarjetas de Propiedades (Equilibrada en 3 Columnas) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {displayedProperties.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 p-6">
                <p className="text-sm font-medium">No hay propiedades destacadas disponibles en este momento.</p>
                <button
                  type="button"
                  onClick={() => handleCatalogExplore()}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#15803d] hover:underline cursor-pointer"
                >
                  <span>Ver todas las propiedades ({activeProperties.length})</span>
                </button>
              </div>
            ) : (
              displayedProperties.slice(0, 6).map((lot) => (
                <ScrollReveal key={lot.id} direction="up" delay={0.1}>
                  <div className="h-full">
                    <PropertyCard
                      lot={lot}
                      onSelectLot={onSelectLot}
                    />
                  </div>
                </ScrollReveal>
              ))
            )}
          </div>

          {/* Botón inferior para explorar todo el catálogo */}
          <div className="relative z-30 text-center pt-2 pb-6 sm:pb-8">
            <button
              type="button"
              onClick={() => handleCatalogExplore()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-[#113d22] text-white text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Explorar las {activeProperties.length} Propiedades Disponibles</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. BANDA DE MÉTRICAS COMPACTA CON CASA EN DESBORDE EDITORIAL
          ========================================================================= */}
      <section className="relative w-full bg-[#0d2f1a] text-white mt-10 sm:mt-16 lg:mt-20 py-4 sm:py-5 lg:py-6 border-y border-emerald-950/60 overflow-visible z-20">
        {/* Trazo topográfico decorativo sutil de fondo */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#5be196_1px,transparent_1px)] [background-size:16px_16px] overflow-hidden" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
            
            {/* Columna Izquierda: Casa protagónica que sobresale ampliamente de la franja */}
            <div className="lg:col-span-6 relative flex justify-center items-center pointer-events-none">
              <ScrollReveal direction="right" delay={0.1} className="relative w-full flex justify-center pointer-events-none">
                <div className="relative w-full max-w-[340px] sm:max-w-[440px] md:max-w-[500px] lg:max-w-[560px] -mt-16 sm:-mt-24 md:-mt-32 lg:-mt-36 -mb-4 sm:-mb-6 lg:-mb-8 transition-transform duration-500 hover:scale-[1.04]">
                  {/* Sombra de proyección cinematográfica en la base */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[90%] h-10 bg-black/70 blur-xl rounded-full pointer-events-none" />
                  {/* Puntos de infraestructura con líneas que señalan a la vivienda y alto contraste dinámico */}
                  <div className="absolute top-[28%] left-[2%] sm:left-[6%] z-30 flex flex-col items-start pointer-events-none select-none animate-float-subtle">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/90 dark:bg-black/85 backdrop-blur-sm text-slate-900 dark:text-white border border-slate-300/60 dark:border-white/20 text-[10px] sm:text-xs font-bold tracking-wide shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Vías Adoquinadas 10-12m</span>
                    </div>
                    {/* Línea que señala a la vía y acceso */}
                    <svg className="w-20 sm:w-24 h-10 overflow-visible mt-0.5 text-slate-700 dark:text-white" viewBox="0 0 96 40" fill="none">
                      <path d="M 12 0 L 55 0 L 88 32" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                      <circle cx="88" cy="32" r="2.5" fill="currentColor" />
                    </svg>
                  </div>

                  <div className="absolute top-[34%] right-[2%] sm:right-[6%] z-30 flex flex-col items-end pointer-events-none select-none animate-float-subtle" style={{ animationDelay: '-2s' }}>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/90 dark:bg-black/85 backdrop-blur-sm text-slate-900 dark:text-white border border-slate-300/60 dark:border-white/20 text-[10px] sm:text-xs font-bold tracking-wide shadow-sm">
                      <span>Red Eléctrica &amp; Agua</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F58220] animate-pulse" />
                    </div>
                    {/* Línea que señala a la cubierta / servicios */}
                    <svg className="w-20 sm:w-24 h-10 overflow-visible mt-0.5 text-slate-700 dark:text-white" viewBox="0 0 96 40" fill="none">
                      <path d="M 84 0 L 40 0 L 8 32" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                      <circle cx="8" cy="32" r="2.5" fill="currentColor" />
                    </svg>
                  </div>

                  <div className="absolute bottom-[8%] left-[6%] sm:left-[10%] z-30 flex flex-col items-start pointer-events-none select-none animate-float-subtle" style={{ animationDelay: '-1s' }}>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/90 dark:bg-black/85 backdrop-blur-sm text-slate-900 dark:text-white border border-slate-300/60 dark:border-white/20 text-[10px] sm:text-xs font-bold tracking-wide shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                      <span>Topografía Plana</span>
                    </div>
                    {/* Línea que señala a la rasante / cimentación */}
                    <svg className="w-16 sm:w-20 h-8 overflow-visible mt-0.5 text-slate-700 dark:text-white" viewBox="0 0 80 32" fill="none">
                      <path d="M 10 0 L 35 0 L 68 24" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                      <circle cx="68" cy="24" r="2.5" fill="currentColor" />
                    </svg>
                  </div>
                  {/* Imagen de la casa con fondo transparente de alto impacto */}
                  <img
                    src="/house-isolated.webp"
                    alt="Propiedad residencial modelo en urbanización MGM"
                    width={600}
                    height={313}
                    decoding="async"
                    className="relative z-10 w-full h-auto object-contain drop-shadow-[0_24px_36px_rgba(0,0,0,0.7)] pointer-events-none select-none"
                    loading="lazy"
                  />
                </div>
              </ScrollReveal>
            </div>

            {/* Columna Derecha: Las 4 métricas en formato 2x2 */}
            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                {/* Métrica 1: Propiedades */}
                <ScrollReveal direction="up" delay={0.05} className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black font-mono text-[#5be196] tracking-tight shrink-0">
                    {activeProperties.length}+
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white truncate">
                    Propiedades en Catálogo
                  </span>
                </ScrollReveal>

                {/* Métrica 2: Plazo Crédito */}
                <ScrollReveal direction="up" delay={0.15} className="flex items-center gap-2.5">
                  <span className="text-xl sm:text-2xl font-black font-mono text-[#F58220] tracking-tight shrink-0">
                    48
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white truncate">
                    Meses Crédito Directo
                  </span>
                </ScrollReveal>

                {/* Métrica 3: Proyectos & Ciudadelas Reales */}
                <ScrollReveal direction="up" delay={0.25} className="flex items-center gap-2.5">
                  <span className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight shrink-0">
                    {projectCount}+
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white truncate">
                    Ciudadelas & Proyectos
                  </span>
                </ScrollReveal>

                {/* Métrica 4: Certeza Notarial */}
                <ScrollReveal direction="up" delay={0.35} className="flex items-center gap-2.5">
                  <span className="text-xl sm:text-2xl font-black font-mono text-[#5be196] tracking-tight shrink-0">
                    100%
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white truncate">
                    Certeza Notarial
                  </span>
                </ScrollReveal>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          6. SECCIÓN EDITORIAL EN DOS COLUMNAS (URBANISMO CON RESPALDO TANGIBLE)
          ========================================================================= */}
      <section className="relative w-full bg-white text-slate-900 py-16 sm:py-24 border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Columna Izquierda: Fotografía Editorial de Alto Nivel con Badges Integrados */}
            <ScrollReveal direction="left" delay={0.1} className="lg:col-span-6 relative">
              <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-950">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=75&fm=webp"
                  alt="Urbanización Planificada y Obras Civiles Concluidas - MGM Inmobiliaria"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transform transition-transform duration-700 ease-out hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />


              </div>
            </ScrollReveal>

            {/* Columna Derecha: Contenido Editorial y Pilares de Compra */}
            <ScrollReveal direction="right" delay={0.2} className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#15803d]">
                  Sobre Sociedad Civil MGM Inmobiliaria
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight [text-wrap:balance]">
                  Elevando el Estándar del Urbanismo en el Ecuador
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  En MGM Inmobiliaria no comercializamos promesas sobre planos sin sustento. Cada proyecto nace de una planificación seria con obras civiles tangibles, servicios básicos garantizados in situ y certeza jurídica notarial desde el primer momento.
                </p>
              </div>

              {/* Proceso de Compra Transparente en 4 Pasos */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 block">
                  Proceso de Adquisición Transparente
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {PURCHASE_PROCESS_STEPS.map((stepItem) => {
                    const StepIcon = stepItem.icon;
                    return (
                      <div
                        key={stepItem.step}
                        className="p-3.5 rounded-2xl bg-[#f8faf8] border border-slate-200/80 space-y-1.5 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-emerald-100/70 text-[#113d22]">
                              <StepIcon className="h-3.5 w-3.5" />
                            </div>
                            <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                              {stepItem.title}
                            </h3>
                          </div>
                          <span className="text-[10px] font-mono font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                            {stepItem.step}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                          {stepItem.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Botón de Acción Editorial */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-950 hover:bg-[#22A33D] text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Conocer Nuestra Trayectoria</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. BENEFICIOS Y URBANISMO: CARDS CUADRADAS CON COLORES MGM E IMÁGENES SIN FONDO
          ========================================================================= */}
      <section className="relative w-full bg-[#f8faf8] text-slate-900 py-16 sm:py-24 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
          
          {/* Header con píldora superior centrada idéntica al banner de referencia con colores MGM */}
          <ScrollReveal direction="down" delay={0.1} className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-xs mb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#5be196]" />
                <span className="w-2 h-2 rounded-full bg-[#F58220]" />
                <span className="w-2 h-2 rounded-full bg-[#113d22]" />
              </span>
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.18em] text-slate-800">
                SERVICIOS &amp; BENEFICIOS URBANOS MGM
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight [text-wrap:balance]">
              Infraestructura Urbana Concluida In Situ
            </h2>
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Ciudadelas planificadas con obras civiles terminadas, garantizando plusvalía inmediata, seguridad jurídica y calidad constructiva.
            </p>
          </ScrollReveal>

          {/* Fila Única Completa: Las 4 Tarjetas Visibles en 1 Sola Línea sin Cortarse */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
            {URBAN_BENEFIT_ITEMS.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <ScrollReveal key={idx} direction="up" delay={idx * 0.08}>
                  <div
                    className={`group relative ${item.bgClass} text-white rounded-[1.75rem] sm:rounded-3xl p-5 lg:p-4.5 xl:p-5 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden aspect-square h-full`}
                  >
                    {/* 1. Header Superior Izquierdo: Badge + Título + Descripción */}
                    <div className="relative z-10 shrink-0 space-y-1.5">
                      <div>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${item.badgeColor}`}>
                          <IconComp className="w-3 h-3" />
                          <span>{item.badge}</span>
                        </span>
                      </div>

                      {/* Título protagonista en tipografía destacada */}
                      <h3 className="text-base sm:text-lg font-black text-white leading-tight tracking-tight max-w-[92%] line-clamp-2">
                        {item.title}
                      </h3>

                      {/* Descripción legible bajo el título */}
                      <p className="text-[11px] sm:text-xs text-white/90 leading-relaxed font-normal max-w-[75%] line-clamp-2">
                        {item.desc}
                      </p>
                    </div>

                    {/* 2. Imagen en la Esquina Inferior Derecha (debajo del texto como en la referencia) */}
                    <div className="absolute right-0 bottom-0 w-[56%] h-[56%] flex items-end justify-end pointer-events-none overflow-hidden rounded-tl-2xl">
                      {/* Glow ambiental bajo la imagen */}
                      <div className="absolute inset-0 bg-white/10 rounded-full blur-xl pointer-events-none transform scale-75" />
                      
                      <img
                        src={item.image}
                        alt={item.imageAlt}
                        className={`relative max-h-full max-w-full object-contain object-bottom-right drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover:scale-105 p-1.5 sm:p-2 ${item.imageScale || ''}`}
                        loading="lazy"
                      />
                    </div>

                    {/* 3. Botón Flotante Inferior Izquierdo: Estilo píldora frosted glass como en la referencia */}
                    <div className="relative z-10 mt-auto pt-4 shrink-0 flex items-center justify-start">
                      <a
                        href={getGeneralWhatsAppUrl(`Hola, deseo más información técnica sobre: ${item.title}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] sm:text-xs font-bold tracking-wide backdrop-blur-md transition-all bg-white/20 hover:bg-white/35 text-white border border-white/25 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer max-w-[65%]"
                      >
                        <span className="truncate">{item.buttonText}</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-1" />
                      </a>
                    </div>

                    {/* Efecto de luz angular sutil de fondo */}
                    <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-white/5 pointer-events-none blur-xl" />
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Botones de Exploración al pie */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#113d22] hover:bg-[#1a8230] text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            >
              <WhatsAppIcon size={16} className="text-white shrink-0" />
              <span>Cotizar Proyectos</span>
            </a>
            <button
              type="button"
              onClick={() => handleCatalogExplore()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 text-xs sm:text-sm font-bold transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Explorar Catálogo de Lotes</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          8. TESTIMONIOS REALES Y APROBADOS (DISEÑO EDITORIAL OSCURO / LUXURY)
          ========================================================================= */}
      <section className="relative w-full bg-[#0a1c12] text-white py-16 sm:py-24 border-b border-emerald-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Lado Izquierdo: Cita Testimonial y Control de Diapositiva */}
            <ScrollReveal direction="left" delay={0.1} className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#F58220]">
                  Testimonios Reales
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  La Confianza de Familias Propietarias
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  Experiencias reales de compradores que ya consolidaron su patrimonio con escrituras entregadas y crédito directo.
                </p>
              </div>

              {/* Tarjeta de Testimonio Activo */}
              <div className="relative p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
                {/* Estrellas */}
                <div className="flex items-center gap-1.5 text-[#F58220]">
                  {[...Array(currentTestimonial.stars)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#F58220] text-[#F58220]" />
                  ))}
                  <span className="text-xs font-mono font-bold text-white ml-1">
                    {currentTestimonial.stars}.0 / 5.0
                  </span>
                </div>

                {/* Cita Textual */}
                <blockquote className="text-base sm:text-lg text-slate-100 font-serif italic leading-relaxed min-h-[70px]">
                  &ldquo;{currentTestimonial.text}&rdquo;
                </blockquote>

                {/* Autor y Ubicación */}
                <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-white">
                      {currentTestimonial.name}
                    </h3>
                    <p className="text-xs text-[#5be196] font-medium">
                      {currentTestimonial.role}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Comprador Verificado · {currentTestimonial.location}
                    </p>
                  </div>

                  {/* Flechas de Navegación de Testimonios y Contador */}
                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                    <span className="text-xs font-mono font-medium text-slate-400 select-none">
                      {activeTestimonialIdx + 1}/{testimonials.length}
                    </span>
                    <button
                      type="button"
                      onClick={prevTestimonial}
                      aria-label="Testimonio anterior"
                      className="p-2 rounded-full bg-white/10 hover:bg-[#22A33D] text-white transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={nextTestimonial}
                      aria-label="Testimonio siguiente"
                      className="p-2 rounded-full bg-white/10 hover:bg-[#22A33D] text-white transition-colors cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Botón para Abrir Modal de Reseña */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <PenLine className="h-4 w-4" />
                  <span>Añadir Reseña de Propietario</span>
                </button>
              </div>
            </ScrollReveal>

            {/* Lado Derecho: Fotografía de Arquitectura Interior Cálida (Única y Distintiva) */}
            <ScrollReveal direction="right" delay={0.2} className="lg:col-span-6 relative">
              <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[440px] rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-slate-900">
                <Image
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=75&fm=webp"
                  alt="Entrega de Vivienda y Satisfacción Familiar - MGM Inmobiliaria"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                {/* Insignia Flotante en la Imagen */}
                <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 right-4 sm:right-5 z-10 p-3.5 sm:p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#22A33D] text-white shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                      100% de Propietarios Satisfechos
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-slate-300">
                      Escrituras legalizadas, minutas sin gravámenes y entrega formal.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. CTA FINAL CLARO (VISITA A OBRA, CONTACTO WHATSAPP O CATÁLOGO)
          ========================================================================= */}
      <section className="relative w-full py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="relative rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-slate-800 overflow-hidden">
            {/* Elemento gráfico de fondo */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-slate-800/40 blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Texto y Llamado a la Acción */}
              <div className="lg:col-span-8 space-y-3 sm:space-y-4">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#F58220] bg-black/30 px-3 py-1 rounded-full border border-[#F58220]/30 inline-block">
                  Atención Inmediata & Asesoría
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight [text-wrap:balance]">
                  ¿Listo para consolidar el patrimonio de tu familia?
                </h2>
                <p className="text-xs sm:text-base text-slate-200 leading-relaxed font-normal max-w-2xl">
                  Solicita una cotización personalizada con crédito directo hasta 48 meses sin bancos ni buró de crédito para el lote o proyecto de tu elección.
                </p>
              </div>

              {/* Botones de Acción Inmobiliaria */}
              <div className="lg:col-span-4 flex flex-col gap-3 justify-center sm:max-w-md sm:mx-auto lg:max-w-none">
                <a
                  href={getGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-black text-sm tracking-wide transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer text-center"
                >
                  <WhatsAppIcon size={20} className="text-slate-950 shrink-0" />
                  <span>Cotizar</span>
                </a>

                <button
                  type="button"
                  onClick={() => onNavigate('properties')}
                  className="w-full inline-flex items-center justify-center gap-2 pt-1 text-xs text-slate-200 hover:text-white font-semibold transition-colors cursor-pointer hover:underline text-center"
                >
                  <span>Explorar Catálogo Completo</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* =========================================================================
          MODAL PARA AÑADIR RESEÑA (PRESERVA TODA LA FUNCIONALIDAD EXISTENTE)
          ========================================================================= */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div
            onClick={() => setIsReviewModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden"
            >
              {/* Header del Modal */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-50 text-[#22A33D]">
                    <Star className="h-5 w-5 fill-[#22A33D]" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-900 leading-tight">
                      Añadir tu Reseña
                    </h3>
                    <p className="text-xs text-slate-500">
                      Comparte tu experiencia como propietario en MGM
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {reviewSubmitted ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h4 className="font-black text-xl text-slate-900">¡Muchas Gracias!</h4>
                  <p className="text-sm text-slate-600 max-w-xs mx-auto">
                    Tu reseña ha sido registrada exitosamente y ya se visualiza en la lista de opiniones.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleAddReview} className="space-y-4 pt-4">
                  {/* Calificación en estrellas interactiva */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Calificación General:
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview((prev) => ({ ...prev, stars: star }))}
                          aria-label={`Calificar con ${star} de 5 estrellas`}
                          className="p-1 hover:scale-115 active:scale-95 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`h-7 w-7 transition-colors ${
                              star <= newReview.stars
                                ? 'fill-[#F58220] text-[#F58220]'
                                : 'text-slate-300 hover:text-slate-400'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-slate-700 ml-2">
                        {newReview.stars} de 5 estrellas
                      </span>
                    </div>
                  </div>

                  {/* Nombre */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Tu Nombre y Apellido *
                    </label>
                    <input
                      type="text"
                      required
                      value={newReview.name}
                      onChange={(e) => setNewReview((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Ej. Ing. Carlos Mendoza & Familia"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Proyecto / Rol */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Proyecto / Tipo de Lote
                      </label>
                      <input
                        type="text"
                        value={newReview.role}
                        onChange={(e) => setNewReview((prev) => ({ ...prev, role: e.target.value }))}
                        placeholder="Ej. Propietario Lote Etapa 1"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
                      />
                    </div>

                    {/* Ciudad */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Ciudad / Ubicación
                      </label>
                      <input
                        type="text"
                        value={newReview.location}
                        onChange={(e) => setNewReview((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="Ej. Cuenca, Ecuador"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Comentario */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Tu Opinión o Testimonio *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={newReview.text}
                      onChange={(e) => setNewReview((prev) => ({ ...prev, text: e.target.value }))}
                      placeholder="Cuéntanos sobre las obras, el financiamiento o la entrega de tus escrituras notariales..."
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Botones de acción */}
                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIsReviewModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      Publicar Reseña
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
