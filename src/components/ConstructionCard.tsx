'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Building2,
  LandPlot,
  Layers,
  Bed,
  Bath,
  Car,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Hammer,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import type { ConstructionProject } from '@/src/data/constructions';
import { useSiteSettings } from '@/src/lib/siteSettings';
import { WhatsAppIcon } from './SocialIcons';

interface ConstructionCardProps {
  project: ConstructionProject;
}

export function ConstructionCard({ project }: ConstructionCardProps) {
  const { settings } = useSiteSettings();
  const [selectedImage, setSelectedImage] = useState<string>(project.mainImage);

  // Selector de estilo de badge de estado
  const getStatusBadge = (status: ConstructionProject['status']) => {
    switch (status) {
      case 'Entregada':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'En Construcción':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'En Planos':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Llave en Mano':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const handleWhatsAppContact = () => {
    const cleanPhone = settings.supportPhone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('593')
      ? cleanPhone
      : cleanPhone.startsWith('0')
      ? `593${cleanPhone.substring(1)}`
      : `593${cleanPhone}`;

    const text = [
      `*CONSULTA DE PROYECTO DE CONSTRUCCIÓN — MGM INMOBILIARIA*`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🏗 *Proyecto:* ${project.name} (${project.code})`,
      `📍 *Ubicación:* ${project.location}, ${project.canton}`,
      `📐 *Área Construida:* ${project.constructionArea} m²`,
      `📌 *Estado:* ${project.status}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `Hola MGM Inmobiliaria, me interesa conocer más detalles sobre este proyecto de construcción o cotizar una edificación similar en mi lote. ¿Podrían brindarme información técnica y asesoría?`,
    ].join('\n');

    const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <article className="bg-white rounded-3xl shadow-lg border border-slate-200/90 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* ========================================================
            LADO IZQUIERDO: IMAGEN GRANDE Y ABAJO IMÁGENES PEQUEÑAS
            ======================================================== */}
        <div className="lg:col-span-6 p-4 sm:p-6 flex flex-col justify-between bg-slate-50/50 border-b lg:border-b-0 lg:border-r border-slate-200">
          <div>
            {/* Imagen Grande */}
            <div className="relative w-full aspect-16/10 sm:aspect-16/10 rounded-2xl overflow-hidden bg-slate-900 shadow-inner group/img">
              <Image
                src={selectedImage}
                alt={`${project.name} - Obra civil de MGM Inmobiliaria`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
                referrerPolicy="no-referrer"
              />
              
              {/* Degradado inferior */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

              {/* Badges superiores sobre la imagen */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-md backdrop-blur-md pointer-events-auto ${getStatusBadge(project.status)}`}>
                  {project.status}
                </span>

                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/60 text-white backdrop-blur-md border border-white/20">
                  {project.code}
                </span>
              </div>

              {/* Año / Modalidad sobre la imagen */}
              <div className="absolute bottom-3 left-3 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-black/60 text-white text-xs font-medium backdrop-blur-sm">
                  <Calendar className="w-3.5 h-3.5 text-[#5be196]" />
                  <span>Entrega: {project.deliveryYear}</span>
                </span>
              </div>
            </div>

            {/* Abajo: Las Imágenes Pequeñas (Thumbnails Interactivas) */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Galería de obra ({project.gallery.length} fotos)
                </span>
                <span className="text-[11px] text-slate-400">
                  Haz clic para ampliar
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {project.gallery.map((imgUrl, idx) => {
                  const isCurrent = selectedImage === imgUrl;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-[#22A33D] ring-2 ring-emerald-500/30 scale-[1.03] shadow-md'
                          : 'border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100'
                      }`}
                      title={`Ver foto ${idx + 1} de ${project.name}`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`${project.name} vista miniatura ${idx + 1}`}
                        fill
                        sizes="120px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Garantía Técnica MGM al pie de imagen */}
          <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#22A33D]" />
              <span>Garantía estructural y fiscalización pericial</span>
            </span>
            <span className="text-slate-400 text-[11px] font-semibold">
              MGM Obras
            </span>
          </div>
        </div>

        {/* ========================================================
            LADO DERECHO: LA FICHA Y DATOS DE LA CONSTRUCCIÓN
            ======================================================== */}
        <div className="lg:col-span-6 p-5 sm:p-7 flex flex-col justify-between">
          <div>
            {/* Cabecera de la ficha */}
            <div className="mb-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 mb-1">
                <MapPin className="w-4 h-4 text-[#F58220] shrink-0" />
                <span>{project.location}, {project.canton}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                {project.name}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* FICHA TÉCNICA (Grid de especificaciones) */}
            <div className="mb-5">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#113d22]" />
                <span>Ficha Técnica de Construcción</span>
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {/* Área Construida */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-center">
                  <span className="text-[10.5px] text-slate-500 font-semibold uppercase flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Construcción</span>
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {project.constructionArea} m²
                  </span>
                </div>

                {/* Área Terreno */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-center">
                  <span className="text-[10.5px] text-slate-500 font-semibold uppercase flex items-center gap-1">
                    <LandPlot className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Terreno</span>
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {project.lotArea} m²
                  </span>
                </div>

                {/* Niveles */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-center">
                  <span className="text-[10.5px] text-slate-500 font-semibold uppercase flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pisos / Niveles</span>
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {project.levels} {project.levels === 1 ? 'nivel' : 'niveles'}
                  </span>
                </div>

                {/* Dormitorios */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-center">
                  <span className="text-[10.5px] text-slate-500 font-semibold uppercase flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5 text-[#F58220]" />
                    <span>Dormitorios</span>
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {project.bedrooms} cuartos
                  </span>
                </div>

                {/* Baños */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-center">
                  <span className="text-[10.5px] text-slate-500 font-semibold uppercase flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5 text-[#F58220]" />
                    <span>Baños</span>
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {project.bathrooms} baños
                  </span>
                </div>

                {/* Estacionamientos */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-center">
                  <span className="text-[10.5px] text-slate-500 font-semibold uppercase flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-[#F58220]" />
                    <span>Parqueos</span>
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 mt-0.5">
                    {project.parkingSpots} autos
                  </span>
                </div>
              </div>

              {/* Sistema Estructural */}
              <div className="mt-2 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 flex items-center justify-between">
                <span className="font-semibold flex items-center gap-1.5">
                  <Hammer className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Estructura:</span>
                </span>
                <span className="font-medium text-emerald-900 text-right text-[11.5px]">
                  {project.structureType}
                </span>
              </div>
            </div>

            {/* Características y Acabados de Primera */}
            <div className="mb-6">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Detalles y Acabados
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {project.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#22A33D] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleWhatsAppContact}
                className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <WhatsAppIcon size={18} className="text-slate-950" />
                <span>Consultar por esta Construcción</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppContact}
                className="w-full sm:w-auto py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Cotizar Proyecto Similar</span>
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
            
            <p className="text-center sm:text-left text-[11px] text-slate-400 mt-2 flex items-center gap-1 justify-center sm:justify-start">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Contratos con fiscalización técnica, cronograma de obra y pólizas de ley.</span>
            </p>
          </div>
        </div>

      </div>
    </article>
  );
}
