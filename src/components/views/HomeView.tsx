'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import type { PageView } from '../Header';
import {
  TESTIMONIALS_DATA,
  getGeneralWhatsAppUrl,
  type LotProperty,
} from '@/src/data/lots';
import { useProperties } from '@/src/context/PropertyContext';
import { PropertyCard } from '../PropertyCard';
import { WhatsAppIcon } from '../SocialIcons';
import { ScrollReveal } from '../common/ScrollReveal';
import { AnimatedInsignia } from '../common/AnimatedInsignia';

interface HomeViewProps {
  onNavigate: (page: PageView) => void;
  onOpenVisitModal: (defaultInterest?: string) => void;
  onSelectLot: (lot: LotProperty) => void;
  onFilterSearch?: (location: string, type: string, maxPrice: number) => void;
}

// 1. Imágenes continuas de alta resolución para el Hero panorámico
const HERO_REAL_ESTATE_IMAGES = [
  {
    url: '/inicio-banner.jpg',
    alt: 'Residencia Arquitectónica Contemporánea de Lujo - MGM Inmobiliaria',
  },
  {
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85',
    alt: 'Residencia Moderna con Piscina y Áreas Verdes - MGM Inmobiliaria',
  },
  {
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85',
    alt: 'Arquitectura Residencial Contemporánea de Vanguardia con Fachada Iluminada',
  },
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85',
    alt: 'Fachada Residencial Contemporánea con Obras Civiles Concluidas',
  },
  {
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=85',
    alt: 'Villa Exclusiva con Vistas Panorámicas y Terrazas Iluminadas',
  },
  {
    url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=2000&q=85',
    alt: 'Residencia Exclusiva y Urbanización con Servicios Básicos Garantizados',
  },
  {
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=85',
    alt: 'Arquitectura de Lujo y Vialidad Planificada de Primer Orden',
  },
];

// 2. Franja de Confianza (Trust Strip)
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

// 4. Beneficios Urbanos & Infraestructura Real de MGM
const URBAN_BENEFIT_ITEMS = [
  {
    title: 'Vías Adoquinadas 10 a 12m',
    desc: 'Calzadas vehiculares amplias de alto tránsito con bordillos de hormigón y aceras peatonales.',
    icon: Building,
    tag: 'Vialidad & Acceso',
  },
  {
    title: 'Redes de Servicios Soterradas',
    desc: 'Agua potable presurizada, alcantarillado sanitario y ductería subterránea eléctrica y fibra óptica.',
    icon: KeyRound,
    tag: 'Servicios Básicos',
  },
  {
    title: '+8.000 m² de Áreas Verdes',
    desc: 'Parques recreativos familiares, caminerías arboladas y áreas de esparcimiento al aire libre.',
    icon: Trees,
    tag: 'Naturaleza & Bienestar',
  },
  {
    title: 'Complejo Deportivo Multiuso',
    desc: 'Canchas iluminadas para fútbol, básquetbol y actividades deportivas comunitarias.',
    icon: Sparkles,
    tag: 'Deporte & Salud',
  },
  {
    title: 'Garita & Seguridad Integral',
    desc: 'Comunidades planificadas con control perimetral y vigilancia para tranquilidad de tu familia.',
    icon: ShieldCheck,
    tag: 'Seguridad 24/7',
  },
  {
    title: 'Topografía Plana Calificada',
    desc: 'Lotes 100% delimitados y planos, aptos para cimentación y construcción habitacional inmediata.',
    icon: Award,
    tag: 'Certeza Constructiva',
  },
];

export function HomeView({
  onNavigate,
  onOpenVisitModal,
  onSelectLot,
  onFilterSearch,
}: HomeViewProps) {
  const { properties } = useProperties();

  // Estados del Hero Carrusel
  const [heroImgIndex, setHeroImgIndex] = useState(0);
  const [heroHovered, setHeroHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);


  // Cálculo de proyectos únicos verificados
  const projectCount = React.useMemo(() => {
    const unique = new Set(properties.map((p) => p.project).filter(Boolean));
    return unique.size || 6;
  }, [properties]);

  // Estados de Testimonios
  const [testimonials, setTestimonials] = useState(TESTIMONIALS_DATA);
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

  // Soporte de navegación y filtrado conectado
  const handleCatalogExplore = (typeFilter?: string) => {
    if (typeFilter && onFilterSearch) {
      onFilterSearch('', typeFilter, 0);
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
      setHeroImgIndex((prev) => (prev + 1 >= HERO_REAL_ESTATE_IMAGES.length ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [heroHovered]);

  const nextHeroImage = () => {
    setHeroImgIndex((prev) => (prev + 1 >= HERO_REAL_ESTATE_IMAGES.length ? 0 : prev + 1));
  };

  const prevHeroImage = () => {
    setHeroImgIndex((prev) => (prev - 1 < 0 ? HERO_REAL_ESTATE_IMAGES.length - 1 : prev - 1));
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

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.text.trim()) return;

    setTestimonials((prev) => [
      {
        name: newReview.name.trim(),
        role: newReview.role.trim() || 'Propietario Lote · Ciudadela Miravalle',
        text: newReview.text.trim(),
        stars: newReview.stars,
        location: newReview.location.trim() || 'Cuenca, Ecuador',
      },
      ...prev,
    ]);

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

  // Propiedades destacadas
  const displayedProperties = properties;

  const currentTestimonial = testimonials[activeTestimonialIdx] || testimonials[0];

  return (
    <div className="w-full overflow-hidden bg-white text-slate-900 selection:bg-emerald-600 selection:text-white">
      {/* =========================================================================
          1. HERO INMOBILIARIO AMPLIO CON FOTOGRAFÍA PANORÁMICA & DOS ACCIONES
          ========================================================================= */}
      <section className="group/hero relative w-full bg-[#0a2315] text-white overflow-hidden min-h-[620px] sm:min-h-[680px] lg:min-h-[720px] flex flex-col justify-center select-none pt-20 sm:pt-24 lg:pt-20 pb-12 sm:pb-16 lg:pb-12">
        {/* Sutil halo ambiental corporativo de fondo */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_20%_40%,rgba(21,128,61,0.22),transparent_70%)]" />

        <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center w-full">
            
            {/* =========================================================================
                ZONA IZQUIERDA: Identidad Editorial, Título, Párrafo y Botones de Acción
                ========================================================================= */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-start text-left space-y-5 sm:space-y-6 select-text cursor-default">
              {/* Eyebrow / Insignia editorial superior */}
              <ScrollReveal direction="down" delay={0.05} duration={0.65}>
                <div className="flex items-center gap-3">
                  <AnimatedInsignia className="scale-85 sm:scale-95" size={42} />
                  <div className="flex flex-col">
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.22em] uppercase text-[#F58220]">
                      Sociedad Civil MGM Inmobiliaria · Ecuador
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-wider uppercase text-emerald-400/80">
                      Certeza Notarial / Obra Civil / Crédito Directo
                    </span>
                  </div>
                </div>
              </ScrollReveal>

              {/* Título Principal de Estilo Editorial */}
              <ScrollReveal direction="down" delay={0.15} duration={0.7}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.08] tracking-tight [text-wrap:balance]">
                  Tierra Firme, Certeza Jurídica
                  <br />
                  <span className="text-[#5be196]">y el Hogar </span>
                  <span className="text-[#F58220]">de tu Familia</span>
                </h1>
              </ScrollReveal>

              {/* Párrafo Descriptivo con ancho controlado */}
              <ScrollReveal direction="up" delay={0.25} duration={0.65}>
                <p className="text-sm sm:text-base lg:text-lg text-emerald-50/85 leading-relaxed font-normal max-w-xl">
                  Desarrollamos comunidades residenciales y comerciales con obras civiles concluidas, servicios básicos garantizados in situ y crédito directo hasta 48 meses sin bancos ni buró de crédito.
                </p>
              </ScrollReveal>

              {/* Acciones Principales con flechas y contraste */}
              <ScrollReveal direction="zoom" delay={0.35} duration={0.6}>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 w-full max-w-md">
                  <button
                    type="button"
                    onClick={() => onNavigate('properties')}
                    className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-full bg-[#15803d] hover:bg-[#166534] text-white font-bold text-sm tracking-wide transition-all shadow-xl hover:shadow-[#15803d]/30 hover:scale-[1.02] active:scale-98 cursor-pointer border border-[#5be196]/40 text-center"
                  >
                    <span>Explorar Propiedades</span>
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenVisitModal('Visita Guiada en Terreno')}
                    className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-full bg-white/95 hover:bg-white text-slate-900 font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-98 cursor-pointer border border-white/50 text-center"
                  >
                    <Calendar className="h-4 w-4 text-[#113d22]" />
                    <span>Agendar Visita a Obra</span>
                  </button>
                </div>
              </ScrollReveal>
            </div>

            {/* =========================================================================
                ZONA DERECHA: Fotografía Inmobiliaria Protagonista (Nítida, sin blur)
                ========================================================================= */}
            <div className="lg:col-span-6 xl:col-span-7 w-full">
              <ScrollReveal direction="up" delay={0.2} duration={0.7}>
                <div
                  className="relative w-full h-[360px] sm:h-[440px] md:h-[500px] lg:h-[540px] xl:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.45)] bg-[#0f2e1c]"
                  onMouseEnter={() => setHeroHovered(true)}
                  onMouseLeave={() => setHeroHovered(false)}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* Diapositivas de fotografía arquitectónica de alta nitidez */}
                  {HERO_REAL_ESTATE_IMAGES.map((img, idx) => (
                    <div
                      key={idx}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        heroImgIndex === idx ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        priority={idx === 0}
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-center transform transition-transform duration-7000 ease-out hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}

                  {/* Sutil viñeta degradada perimetral para proteger la nitidez de la foto sin oscurecerla */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 pointer-events-none" />

                  {/* Pastilla flotante editorial de atributos (estilo referencia) */}
                  <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 pointer-events-none">
                    <div className="px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-md border border-white/15 flex flex-col">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-300 font-bold">
                        PROPIEDAD RESIDENCIAL
                      </span>
                      <span className="text-[11px] text-white font-medium">
                        Obras Concluidas &amp; Lotes Listos
                      </span>
                    </div>
                  </div>

                  {/* Barra inferior integrada: Paginador numérico estilo editorial ("01 / 06") y flechas */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 z-20 flex items-center justify-between">
                    {/* Contador de slides */}
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-mono font-medium shadow-md">
                      <span className="text-[#5be196] font-bold">
                        {String(heroImgIndex + 1).padStart(2, '0')}
                      </span>
                      <span className="text-white/40">/</span>
                      <span className="text-white/70">
                        {String(HERO_REAL_ESTATE_IMAGES.length).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Indicadores lineales y controles de flechas */}
                    <div className="flex items-center gap-2">
                      {/* Dots táctiles / clicables */}
                      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15">
                        {HERO_REAL_ESTATE_IMAGES.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setHeroImgIndex(i);
                            }}
                            aria-label={`Ver diapositiva ${i + 1}`}
                            className="p-1 flex items-center justify-center cursor-pointer"
                          >
                            <span
                              className={`h-1.5 rounded-full transition-all block ${
                                heroImgIndex === i ? 'w-5 bg-[#5be196]' : 'w-1.5 bg-white/40 hover:bg-white'
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      {/* Flechas compactas integradas */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            prevHeroImage();
                          }}
                          aria-label="Diapositiva anterior"
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-black/60 hover:bg-black/85 text-white/90 hover:text-white border border-white/25 hover:border-white/60 backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-md"
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            nextHeroImage();
                          }}
                          aria-label="Siguiente diapositiva"
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-black/60 hover:bg-black/85 text-white/90 hover:text-white border border-white/25 hover:border-white/60 backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-md"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          2. FRANJA COMPACTA DE CONFIANZA (TRUST STRIP)
          ========================================================================= */}
      <section className="relative w-full bg-[#0b2817] text-white py-10 sm:py-14 border-t border-emerald-500/15 border-b border-emerald-950/60 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          {/* Encabezado de la sección */}
          <div className="pb-4 border-b border-slate-200">
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
                  <span>Ver todas las propiedades ({properties.length})</span>
                </button>
              </div>
            ) : (
              displayedProperties.slice(0, 6).map((lot) => (
                <ScrollReveal key={lot.id} direction="up" delay={0.1}>
                  <div className="h-full">
                    <PropertyCard
                      lot={lot}
                      onSelectLot={onSelectLot}
                      onOpenVisitModal={onOpenVisitModal}
                    />
                  </div>
                </ScrollReveal>
              ))
            )}
          </div>

          {/* Botón inferior para explorar todo el catálogo */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => handleCatalogExplore()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-[#113d22] text-white text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Explorar las {properties.length} Propiedades Disponibles</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. BANDA DE MÉTRICAS CON DATOS REALES VERIFICADOS DE MGM
          ========================================================================= */}
      <section className="relative w-full bg-[#0d2f1a] text-white py-12 sm:py-16 border-y border-emerald-950/60 overflow-hidden">
        {/* Trazo topográfico decorativo sutil de fondo */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#5be196_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            {/* Métrica 1: Propiedades */}
            <ScrollReveal direction="up" delay={0.05} className="space-y-1">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono text-[#5be196] tracking-tight">
                {properties.length}+
              </div>
              <p className="text-sm sm:text-base font-bold text-white">Propiedades en Catálogo</p>
              <p className="text-[11px] sm:text-xs text-slate-300">Lotes y viviendas con disponibilidad en tiempo real</p>
            </ScrollReveal>

            {/* Métrica 2: Plazo Crédito */}
            <ScrollReveal direction="up" delay={0.15} className="space-y-1">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono text-[#F58220] tracking-tight">
                48
              </div>
              <p className="text-sm sm:text-base font-bold text-white">Meses Crédito Directo</p>
              <p className="text-[11px] sm:text-xs text-slate-300">Financiamiento directo con tu cédula sin buró</p>
            </ScrollReveal>

            {/* Métrica 3: Proyectos & Ciudadelas Reales */}
            <ScrollReveal direction="up" delay={0.25} className="space-y-1">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono text-white tracking-tight">
                {projectCount}+
              </div>
              <p className="text-sm sm:text-base font-bold text-white">Ciudadelas & Proyectos</p>
              <p className="text-[11px] sm:text-xs text-slate-300">Desarrollos urbanizados en Pichincha, Manabí y Azuay</p>
            </ScrollReveal>

            {/* Métrica 4: Certeza Notarial */}
            <ScrollReveal direction="up" delay={0.35} className="space-y-1">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono text-[#5be196] tracking-tight">
                100%
              </div>
              <p className="text-sm sm:text-base font-bold text-white">Certeza Notarial</p>
              <p className="text-[11px] sm:text-xs text-slate-300">Escrituras individuales y minutas legalizadas</p>
            </ScrollReveal>
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
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                  alt="Urbanización Planificada y Obras Civiles Concluidas - MGM Inmobiliaria"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transform transition-transform duration-700 ease-out hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

                {/* Badge Flotante Superior: Recorrido en Terreno */}
                <div className="absolute top-4 left-4 z-10">
                  <button
                    type="button"
                    onClick={() => onOpenVisitModal('Recorrido en Terreno')}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-[#22A33D] text-white text-xs font-bold backdrop-blur-md border border-white/25 transition-all shadow-md cursor-pointer"
                  >
                    <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Visitas Guiadas a Obra</span>
                  </button>
                </div>

                {/* Badge Flotante Inferior: Garantía de Obras */}
                <div className="absolute bottom-5 left-5 right-5 z-10 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-xl flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#15803d] tracking-wider block">
                      Infraestructura Real
                    </span>
                    <p className="text-sm font-black text-slate-900 leading-tight">
                      Vías adoquinadas, alcantarillado y servicios in situ
                    </p>
                  </div>
                  <div className="shrink-0">
                    <CheckCircle2 className="h-7 w-7 text-[#22A33D]" />
                  </div>
                </div>
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
          7. BENEFICIOS Y URBANISMO EN COMPOSICIÓN VISUAL CLARA
          ========================================================================= */}
      <section className="relative w-full bg-[#f4f7ee] text-slate-900 py-14 sm:py-20 border-b border-[#dce3d2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          <ScrollReveal direction="down" delay={0.1} className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#15803d]">
              Infraestructura & Urbanismo
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Beneficios Tangibles en Cada Urbanización
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Ciudadelas planificadas con obras civiles concluidas in situ, garantizando plusvalía, seguridad y bienestar familiar integral.
            </p>
          </ScrollReveal>

          {/* Grilla de 6 Beneficios Urbanos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {URBAN_BENEFIT_ITEMS.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <ScrollReveal
                  key={idx}
                  direction="up"
                  delay={0.06 * idx}
                  className="group bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-[#22A33D]/60 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-50 text-[#22A33D] group-hover:bg-[#22A33D] group-hover:text-white transition-colors">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50/80 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug group-hover:text-emerald-800 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Botones de Exploración al pie de Beneficios */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#113d22] hover:bg-[#1a8230] text-white text-xs sm:text-sm font-bold transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            >
              <WhatsAppIcon size={16} className="text-white shrink-0" />
              <span>Cotizar por WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={() => handleCatalogExplore()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 text-xs sm:text-sm font-bold transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
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
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
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
          <div className="relative rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-[#113d22] via-[#17522e] to-[#0d2f1a] text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-emerald-500/30 overflow-hidden">
            {/* Elemento gráfico de fondo */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#22A33D]/20 blur-3xl pointer-events-none" />

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
                  Agenda un recorrido presencial en obra con transporte corporativo gratuito de la empresa o solicita una cotización personalizada por WhatsApp con crédito directo hasta 48 meses.
                </p>
              </div>

              {/* Botones de Acción Inmobiliaria */}
              <div className="lg:col-span-4 flex flex-col gap-3 justify-center sm:max-w-md sm:mx-auto lg:max-w-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenVisitModal('Recorrido en Terreno')}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer border border-[#5be196]/30 text-center"
                  >
                    <Calendar className="h-4 w-4 shrink-0" />
                    <span>Agendar Visita a Obra</span>
                  </button>

                  <a
                    href={getGeneralWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-black text-xs sm:text-sm tracking-wide transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer text-center"
                  >
                    <WhatsAppIcon size={18} className="text-slate-950 shrink-0" />
                    <span>Hablar por WhatsApp</span>
                  </a>
                </div>

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
