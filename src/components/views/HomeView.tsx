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

// 4.1 Ingeniería Civil & Urbanismo (Renders 3D Isométricos en Alta Definición con Animación Flotante)
const CIVIL_ENGINEERING_ITEMS = [
  {
    title: 'Vías',
    titleSecond: 'Adoquinadas',
    subtitle: 'Calzadas vehiculares amplias de alto tránsito (10m a 12m) con adoquín de alta resistencia',
    image: '/benefit-civil-road.png',
    imageAlt: 'Render 3D isométrico de vías adoquinadas con poste y acera',
    animationDelay: '0s',
    specLabel: 'Resistencia:',
    specValue: '400 kg/cm²',
    whatsappMsg: 'Hola, deseo especificaciones técnicas de las vías adoquinadas en sus urbanizaciones.',
  },
  {
    title: 'Redes Soterradas',
    subtitle: 'Distribución técnica subterránea sin cableado aéreo visible: agua, alcantarillado y fibra óptica',
    image: '/benefit-civil-services.png',
    imageAlt: 'Render 3D isométrico de redes soterradas con zanja técnica y tuberías',
    animationDelay: '-1.5s',
    whatsappMsg: 'Hola, deseo información técnica sobre las redes subterráneas de agua, alcantarillado y fibra óptica.',
  },
  {
    isHighlightNumber: true,
    number: '+8.000m²',
    title: 'Áreas Verdes',
    subtitle: 'Espacios recreativos integrados con caminerías ecológicas y parques familiares',
    image: '/benefit-civil-park.png',
    imageAlt: 'Render 3D isométrico de áreas verdes con caminería y arbolado nativo',
    animationDelay: '-3s',
    whatsappMsg: 'Hola, deseo conocer más sobre las áreas verdes y caminerías ecológicas.',
  },
  {
    title: 'Topografía Plana',
    subtitle: 'Lotes con rasantes niveladas aptos para cimentación inmediata, sin sobrecostos',
    image: '/benefit-civil-topography.png',
    imageAlt: 'Render 3D isométrico de topografía plana con curvas de nivel y nivelación técnica',
    animationDelay: '-4.5s',
    whatsappMsg: 'Hola, deseo información sobre lotes con topografía plana para cimentación inmediata.',
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

  // Rotación suave del Hero cada 3 segundos
  useEffect(() => {
    const mediaQuery = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    if (mediaQuery?.matches) return;
    const interval = setInterval(() => {
      setHeroImgIndex((prev) => (prev + 1 >= homeSlides.length ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [homeSlides.length]);

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

  // Propiedades destacadas primero (conectado al switch 'Destacar en Inicio' del Admin Panel)
  const displayedProperties = React.useMemo(() => {
    const featuredList = activeProperties.filter((p) => p.featured);
    const others = activeProperties.filter((p) => !p.featured);
    return [...featuredList, ...others];
  }, [activeProperties]);

  const currentTestimonial = testimonials[activeTestimonialIdx] || testimonials[0];

  return (
    <div className="relative w-full overflow-hidden bg-[#faf8f5] text-slate-900 selection:bg-emerald-600 selection:text-white">
      {/* =========================================================================
          TEXTURA TOPOGRÁFICA OLIVO CLARO CONTINUA (CAPA MAESTRA SIN CORTES NI COSTURAS)
          ========================================================================= */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
        style={{
          backgroundImage: "url('/topographic-olive-pattern.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        aria-hidden="true"
      />
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
      <section className="relative w-full bg-transparent text-slate-900 py-14 sm:py-20 border-b border-stone-200/60">
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
          5.1 INGENIERÍA CIVIL & URBANISMO (ESTILO EDITORIAL MINIMALISTA CON ISOMÉTRICOS 3D)
          ========================================================================= */}
      <section className="relative w-full bg-transparent text-slate-900 py-16 sm:py-24 border-b border-stone-200/60 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          
          {/* Header con Título Editorial en Serif Idéntico a la Referencia */}
          <ScrollReveal direction="down" delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal text-slate-900 tracking-tight">
              Ingeniería Civil &amp; Urbanismo
            </h2>
          </ScrollReveal>

          {/* Grilla 2x2 de Tarjetas Limpias con Ilustración 3D Isométrica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {CIVIL_ENGINEERING_ITEMS.map((card, idx) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 0.08}>
                <a
                  href={getGeneralWhatsAppUrl(card.whatsappMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-[#fcfbf9] hover:bg-white rounded-[2rem] sm:rounded-[2.25rem] p-7 sm:p-8 lg:p-9 border border-stone-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-xl hover:border-stone-300 transition-all duration-300 flex flex-col justify-between min-h-[220px] sm:min-h-[240px] cursor-pointer overflow-hidden h-full"
                >
                  {/* Fila Superior: Contenido Textual a la izquierda | Ilustración Isométrica 3D a la derecha */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 max-w-[58%] sm:max-w-[62%]">
                      {card.isHighlightNumber ? (
                        <div>
                          <div className="text-3xl sm:text-4xl font-serif text-slate-900 tracking-tight leading-none mb-1">
                            {card.number}
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                            {card.title}
                          </h3>
                        </div>
                      ) : card.titleSecond ? (
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                          {card.title}
                          <br />
                          {card.titleSecond}
                        </h3>
                      ) : (
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                          {card.title}
                        </h3>
                      )}
                      
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pt-0.5">
                        {card.subtitle}
                      </p>
                    </div>

                    {/* Render Isométrico 3D de Alta Definición con Flotación Suave */}
                    <div className="shrink-0 w-32 sm:w-44 lg:w-52 h-28 sm:h-36 lg:h-44 flex items-center justify-end -mt-2 -mr-2">
                      <div
                        className="w-full h-full flex items-center justify-center animate-float-subtle will-change-transform drop-shadow-[0_12px_24px_rgba(0,0,0,0.08)] group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-500"
                        style={{ animationDelay: card.animationDelay }}
                      >
                        <img
                          src={card.image}
                          alt={card.imageAlt}
                          className="w-full h-full object-contain select-none pointer-events-none"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Fila Inferior: Especificación Técnica (si existe) + Botón Circular '>' en la Esquina */}
                  <div className="pt-6 mt-auto flex items-end justify-between gap-3">
                    {card.specLabel && card.specValue ? (
                      <div className="text-xs sm:text-sm text-slate-600 font-normal">
                        {card.specLabel}{' '}
                        <span className="font-bold text-slate-900">{card.specValue}</span>
                      </div>
                    ) : (
                      <div className="grow" />
                    )}

                    {/* Botón Circular '>' en tono cálido sutil */}
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#ece8de]/80 group-hover:bg-[#113d22] text-slate-700 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs shrink-0 group-hover:scale-110 ml-auto">
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>

                </a>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          6. SECCIÓN COMBINADA: SERVICIOS URBANOS & RESPALDO EDITORIAL (ESTILO REFERENCIA)
          ========================================================================= */}
      <section className="relative w-full bg-transparent text-slate-900 py-16 sm:py-24 border-b border-stone-200/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          
          {/* Header Superior Izquierdo al estilo de la referencia */}
          <ScrollReveal direction="down" delay={0.1} className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base font-black text-[#d97706] tracking-tight">+ —</span>
              <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#d97706]">
                NUESTROS SERVICIOS URBANOS
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight [text-wrap:balance]">
              Infraestructura Urbana Concluida <br className="hidden sm:inline" />
              <span className="text-[#d97706]">y Certeza Inmobiliaria In Situ</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-2xl pt-1">
              Ciudadelas planificadas con obras civiles terminadas, garantizando plusvalía inmediata, seguridad jurídica y calidad constructiva.
            </p>
          </ScrollReveal>

          {/* Fila de 4 Tarjetas Cuadradas/Rectangulares Superiores (Los cuadrados encima del rectángulo) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
            {URBAN_BENEFIT_ITEMS.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <ScrollReveal key={idx} direction="up" delay={idx * 0.08}>
                  <a
                    href={getGeneralWhatsAppUrl('Hola, deseo más información técnica sobre: ' + item.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative bg-white/80 hover:bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-slate-200/90 hover:border-[#d97706]/40 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center justify-between min-h-[220px] sm:min-h-[240px] cursor-pointer h-full"
                  >
                    {/* Icono Centrado Superior con tono dorado/ámbar de la referencia */}
                    <div className="p-3 rounded-2xl bg-amber-50/70 group-hover:bg-amber-100/80 text-[#d97706] transition-transform duration-300 group-hover:scale-110 shrink-0 border border-amber-200/40">
                      <IconComp className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.75]" />
                    </div>

                    {/* Título en tipografía negrita destacada */}
                    <div className="my-auto py-2">
                      <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug group-hover:text-[#113d22] transition-colors">
                        {item.title}
                      </h3>
                      {/* Descripción breve centrada */}
                      <p className="text-xs text-slate-500 leading-relaxed font-normal mt-2 line-clamp-3">
                        {item.desc}
                      </p>
                    </div>

                    {/* Indicador de acción sutil al pie */}
                    <div className="pt-2 text-[11px] font-bold text-[#d97706] group-hover:text-[#b45309] inline-flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <span>Consultar detalles</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </a>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Gran Rectángulo Inferior: Sobre MGM + 4 Pasos + Fotografía con Curva Dorada */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="rounded-3xl sm:rounded-[2.5rem] border border-slate-300/70 bg-[#e4eaf0] overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                
                {/* Columna Izquierda: Contenido Editorial, Pilares y Botones */}
                <div className="lg:col-span-7 p-6 sm:p-8 lg:p-12 space-y-6 flex flex-col justify-between">
                  
                  {/* Encabezado Editorial */}
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#15803d] flex items-center gap-1.5">
                      <span className="w-2 h-0.5 bg-[#d97706] rounded-full" />
                      Sobre Sociedad Civil MGM Inmobiliaria
                    </span>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight [text-wrap:balance]">
                      Elevando el Estándar del Urbanismo en el Ecuador
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pt-1">
                      En MGM Inmobiliaria no comercializamos promesas sobre planos sin sustento. Cada proyecto nace de una planificación seria con obras civiles tangibles, servicios básicos garantizados in situ y certeza jurídica notarial desde el primer momento.
                    </p>
                  </div>

                  {/* 4 Pasos del Proceso de Adquisición Transparente */}
                  <div className="space-y-2.5 pt-1">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                      Proceso de Adquisición Transparente
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PURCHASE_PROCESS_STEPS.map((stepItem) => {
                        const StepIcon = stepItem.icon;
                        return (
                          <div
                            key={stepItem.step}
                            className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/90 space-y-1.5 hover:border-emerald-300 hover:bg-white transition-all shadow-2xs"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-emerald-100/70 text-[#113d22]">
                                  <StepIcon className="h-3.5 w-3.5" />
                                </div>
                                <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                                  {stepItem.title}
                                </h4>
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

                  {/* Botones de Acción al pie del contenedor */}
                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onNavigate('about')}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-950 hover:bg-[#22A33D] text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <span>Conocer Nuestra Trayectoria</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <a
                      href={getGeneralWhatsAppUrl('Hola, deseo asesoría sobre los proyectos de MGM Inmobiliaria')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <WhatsAppIcon size={16} className="text-[#25D366]" />
                      <span>Contactar un Asesor</span>
                    </a>
                  </div>

                </div>

                {/* Columna Derecha: Fotografía Editorial con Curva Dorada de Separación (Estilo Referencia) */}
                <div className="lg:col-span-5 relative min-h-[340px] sm:min-h-[420px] lg:min-h-full overflow-hidden bg-slate-950">
                  <Image
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                    alt="Urbanización Planificada y Obras Civiles Concluidas - MGM Inmobiliaria"
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover object-center transform transition-transform duration-700 ease-out hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent lg:hidden pointer-events-none" />

                  {/* Separador Curvo Dorado Estilo Referencia (Visible en Desktop) */}
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="absolute -left-[1px] top-0 h-full w-14 lg:w-20 pointer-events-none hidden lg:block z-10"
                  >
                    <path d="M 0,0 L 40,0 Q -15,50 40,100 L 0,100 Z" className="fill-[#e4eaf0]" />
                    <path d="M 40,0 Q -15,50 40,100" fill="none" stroke="#d97706" strokeWidth="6" />
                  </svg>
                </div>

              </div>
            </div>
          </ScrollReveal>

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
