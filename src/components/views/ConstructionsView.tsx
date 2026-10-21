'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  HardHat,
  Search,
  RotateCcw,
  Sparkles,
  MapPin,
  Building2,
  Hammer,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';
import type { PageView } from '@/src/data/navigation';
import type { ConstructionProject } from '@/src/data/constructions';
import { useConstructions } from '@/src/lib/constructionStorage';
import { ConstructionCard } from '../ConstructionCard';
import { useSiteSettings } from '@/src/lib/siteSettings';
import { WhatsAppIcon } from '../SocialIcons';
import { ScrollReveal } from '../common/ScrollReveal';

interface ConstructionsViewProps {
  onNavigate: (page: PageView) => void;
}

const CONSTRUCTIONS_HERO_IMAGE = {
  url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=1920&q=80',
  alt: 'Nuestras Construcciones y Obras Civiles - Sociedad Civil MGM Inmobiliaria',
};

const STATUS_FILTERS = ['Todos', 'Entregada', 'En Construcción', 'En Planos'];
const CANTON_FILTERS = ['Todos', 'Cuenca', 'Paute', 'Santa Isabel'];

export function ConstructionsView({ onNavigate }: ConstructionsViewProps) {
  const { settings } = useSiteSettings();
  const { constructions } = useConstructions();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [selectedCanton, setSelectedCanton] = useState('Todos');

  // Filtrado de proyectos sincronizados
  const filteredProjects = useMemo(() => {
    return constructions.filter((project) => {
      // Búsqueda por texto
      const matchesSearch =
        searchTerm.trim() === '' ||
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.canton.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.code.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro por estado
      const matchesStatus =
        selectedStatus === 'Todos' || project.status === selectedStatus;

      // Filtro por cantón
      const matchesCanton =
        selectedCanton === 'Todos' || project.canton === selectedCanton;

      return matchesSearch && matchesStatus && matchesCanton;
    });
  }, [searchTerm, selectedStatus, selectedCanton]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('Todos');
    setSelectedCanton('Todos');
  };

  const handleConsultGeneral = () => {
    const cleanPhone = settings.supportPhone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('593')
      ? cleanPhone
      : cleanPhone.startsWith('0')
      ? `593${cleanPhone.substring(1)}`
      : `593${cleanPhone}`;

    const text = `Hola MGM Inmobiliaria, deseo solicitar una asesoría técnica y cotización para construir una vivienda en mi lote en el Austro. ¿Podríamos coordinar una reunión técnica?`;
    window.open(`https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* ========================================================
          1. BANNER HERO CINEMÁTICO — NUESTRAS CONSTRUCCIONES
          ======================================================== */}
      <section className="relative w-full bg-slate-900 text-white min-h-[440px] sm:min-h-[500px] lg:min-h-[min(70vh,560px)] flex flex-col justify-center select-none pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 overflow-hidden">
        {/* Fondo Panorámico: Croquis Arquitectónico Técnico Line Art Original (Luz/Blanco en la derecha) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Image
            src="/architectural-sketch-villa.webp"
            alt="Croquis y Boceto Arquitectónico Técnico - MGM Inmobiliaria"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center contrast-115 brightness-100 scale-105 transition-transform duration-10000 ease-out hover:scale-110"
            referrerPolicy="no-referrer"
          />

          {/* Shader negro cinematográfico que degrada de izquierda a derecha y se desvanece a transparente antes del 3/5 (~58%) */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 via-[32%] to-transparent to-[58%] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl lg:max-w-4xl text-left">
            <ScrollReveal direction="down" delay={0.1}>
              <h1 className="flex flex-col items-start font-black text-white leading-none tracking-tight drop-shadow-md">
                <span className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-widest mb-1.5 sm:mb-2">
                  Nuestras
                </span>
                <span className="text-3xl sm:text-5xl lg:text-[clamp(2.5rem,3.8vw,3.75rem)] text-[#5be196]">
                  Construcciones
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <p className="text-xs sm:text-sm lg:text-base text-slate-200 leading-relaxed font-normal mt-4 sm:mt-5 drop-shadow-xs max-w-lg text-justify [text-align-last:left]">
                Diseñamos y ejecutamos viviendas de vanguardia, villas residenciales y proyectos llave en mano con estricto rigor estructural, fiscalización pericial y escrituras notariales en todo el Austro.
              </p>
            </ScrollReveal>

            {/* Métricas destacadas en barra técnica */}
            <ScrollReveal direction="up" delay={0.3}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-10 pt-6 sm:pt-7 border-t border-white/20 max-w-2xl">
                <div>
                  <span className="block text-xl sm:text-2xl font-black text-[#5be196]">100%</span>
                  <span className="text-xs text-slate-300 font-medium">Sismorresistente Normado</span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl font-black text-[#F58220]">Llave en Mano</span>
                  <span className="text-xs text-slate-300 font-medium">Desde Planos hasta Entrega</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="block text-xl sm:text-2xl font-black text-white">Fiscalizado</span>
                  <span className="text-xs text-slate-300 font-medium">Garantía Pericial MGM</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. BARRA DE FILTROS & BÚSQUEDA RÁPIDA
          ======================================================== */}
      <section className="relative -mt-6 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Buscador de texto */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, sector (ej. Challuabamba, Paute) o código..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Filtros de Estado y Cantón */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Estado */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-bold text-slate-700 hidden sm:inline">Estado:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {STATUS_FILTERS.map((st) => (
                    <option key={st} value={st}>
                      {st === 'Todos' ? 'Todos los Estados' : st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cantón */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-bold text-slate-700 hidden sm:inline">Ubicación:</span>
                <select
                  value={selectedCanton}
                  onChange={(e) => setSelectedCanton(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {CANTON_FILTERS.map((canton) => (
                    <option key={canton} value={canton}>
                      {canton === 'Todos' ? 'Todos los Cantones' : canton}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botón de reseteo */}
              {(searchTerm || selectedStatus !== 'Todos' || selectedCanton !== 'Todos') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-1 transition-all cursor-pointer"
                  title="Restablecer filtros"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpiar</span>
                </button>
              )}
            </div>
          </div>

          {/* Conteo de resultados */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Mostrando <strong className="text-slate-800 font-bold">{filteredProjects.length}</strong> {filteredProjects.length === 1 ? 'proyecto de construcción' : 'proyectos de construcción'}
            </span>
            <span className="text-[#113d22] font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#F58220]" />
              <span>Obras ejecutadas y en desarrollo por MGM</span>
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. LISTADO DE CONSTRUCCIONES (CARDS CON FORMATO SOLICITADO)
          ======================================================== */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProjects.length > 0 ? (
          <div className="space-y-10 sm:space-y-14">
            {filteredProjects.map((project) => (
              <ConstructionCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-xl mx-auto">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">
              No se encontraron proyectos con esos criterios
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Intenta cambiar los filtros de estado, ubicación o término de búsqueda.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ver todas las construcciones</span>
            </button>
          </div>
        )}
      </section>

      {/* ========================================================
          4. BANNER CTA — ¿TIENES UN LOTE? CONSTRUYE CON MGM
          ======================================================== */}
      <section className="bg-gradient-to-r from-[#113d22] via-[#0d2e1a] to-slate-950 text-white py-14 sm:py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#5be196] text-xs font-bold uppercase tracking-wider mb-4">
            <Hammer className="w-4 h-4 text-[#F58220]" />
            <span>Servicio de Construcción Llave en Mano</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            ¿Tienes un lote o deseas adquirir uno y construir tu casa ideal?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
            Te asesoramos desde el anteproyecto arquitectónico, permisos municipales, cálculo estructural hasta la entrega de llaves con financiamiento directo.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
            <button
              type="button"
              onClick={handleConsultGeneral}
              className="px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-extrabold text-sm sm:text-base flex items-center gap-2.5 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
            >
              <WhatsAppIcon size={20} className="text-slate-950" />
              <span>Solicitar Asesoría de Construcción por WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigate('properties');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base border border-white/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Ver Lotes Disponibles para Construir</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
