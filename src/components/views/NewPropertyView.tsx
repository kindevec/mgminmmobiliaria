'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
  ArrowLeft,
  Building,
  CheckCircle2,
  DollarSign,
  Maximize2,
  MapPin,
  Sparkles,
  Layers,
  Save,
  ImageIcon,
  ShieldCheck,
  Eye,
  Compass,
  FileCheck,
  Calendar,
  AlertCircle,
  X,
  Upload,
} from 'lucide-react';
import type { LotProperty } from '@/src/data/lots';
import type { PageView } from '@/src/data/navigation';
import { useProperties } from '@/src/context/PropertyContext';
import { uploadOptimizedImage } from '@/src/lib/imageOptimizer';

const InteractiveMapPicker = dynamic(
  () => import('@/src/components/common/InteractiveMapPicker').then((m) => m.InteractiveMapPicker),
  { ssr: false }
);

interface NewPropertyViewProps {
  onNavigate: (page: PageView) => void;
}

const PRESET_IMAGES = [
  {
    title: 'Lote Residencial Plano',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Villa Moderna Fachada',
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Terreno Esquinero Urbanizado',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Lote con Vista Panorámica',
    url: 'https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Villa Familiar con Jardín',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Lote Campestre / Quinta',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
  },
];

const AVAILABLE_SERVICES = [
  'Red eléctrica soterrada',
  'Agua potable garantizada',
  'Alcantarillado pluvial y sanitario',
  'Vías adoquinadas de alto tonelaje',
  'Bordillos y aceras podotáctiles',
  'Ductería soterrada para fibra óptica',
  'Alumbrado público LED',
  'Garita de seguridad y control 24/7',
];

export function NewPropertyView({ onNavigate }: NewPropertyViewProps) {
  const { addProperty } = useProperties();

  const [code, setCode] = useState(() => `MV-${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState('Lote Residencial Miravalle');
  const [project, setProject] = useState<LotProperty['project']>('Ciudadela Miravalle');
  const [type, setType] = useState<LotProperty['type']>('Lote de Terreno');
  const [category, setCategory] = useState<LotProperty['category']>('Residencial');
  const [areaM2, setAreaM2] = useState<number>(200);
  const [dimensions, setDimensions] = useState('10.0m × 20.0m');
  const [priceUSD, setPriceUSD] = useState<number>(28500);
  const [minDownPaymentUSD, setMinDownPaymentUSD] = useState<number>(5700);
  const [maxMonths, setMaxMonths] = useState<number>(48);
  const [topography, setTopography] = useState('100% Plano');
  const [status, setStatus] = useState<LotProperty['status']>('Disponible');
  const [locality, setLocality] = useState('Miravalle (Azuay)');
  const [coords, setCoords] = useState({ lat: -2.8685, lng: -78.9654 });
  const [zone, setZone] = useState('Etapa 1 · Sector Miravalle Central');
  const [orientation, setOrientation] = useState('Norte - Sur');
  const [registryStatus, setRegistryStatus] = useState('Escritura individual legalizada e inscrita');
  const [imagesList, setImagesList] = useState(PRESET_IMAGES);
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [description, setDescription] = useState(
    'Excelente lote residencial urbanizado con obras al 100% y financiamiento directo hasta 48 meses.'
  );
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Red eléctrica soterrada',
    'Agua potable garantizada',
    'Alcantarillado pluvial y sanitario',
    'Vías adoquinadas de alto tonelaje',
  ]);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePriceChange = (val: number) => {
    setPriceUSD(val);
    setMinDownPaymentUSD(Math.round(val * 0.2));
  };

  const estimatedMonthly = maxMonths > 0
    ? Math.round(Math.max(0, priceUSD - minDownPaymentUSD) / maxMonths)
    : 0;

  const toggleService = (srv: string) => {
    setSelectedServices((prev) =>
      prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]
    );
  };

  const handleRemoveImage = (urlToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = imagesList.filter((img) => img.url !== urlToRemove);
    setImagesList(updated);
    if (image === urlToRemove) {
      if (updated.length > 0) {
        setImage(updated[0].url);
      } else {
        setImage('');
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const publicUrl = await uploadOptimizedImage(file, code || 'new-prop');
      const newImg = {
        title: file.name.replace(/\.[^/.]+$/, ''),
        url: publicUrl,
      };
      setImagesList((prev) => [newImg, ...prev]);
      setImage(publicUrl);
      setCustomImageUrl('');
    } catch (err) {
      console.error('Error al optimizar/subir imagen WebP:', err);
      // Fallback a DataURL si no hay conexión
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          const newImg = {
            title: file.name.replace(/\.[^/.]+$/, ''),
            url: dataUrl,
          };
          setImagesList((prev) => [newImg, ...prev]);
          setImage(dataUrl);
          setCustomImageUrl('');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      e.target.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalImage = customImageUrl.trim() || image.trim();

    const data: Omit<LotProperty, 'id'> = {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      project,
      type,
      category,
      areaM2: Number(areaM2),
      dimensions: dimensions.trim(),
      priceUSD: Number(priceUSD),
      minDownPaymentUSD: Number(minDownPaymentUSD),
      estimatedMonthlyUSD: estimatedMonthly,
      maxMonths: Number(maxMonths),
      topography: topography.trim(),
      status,
      zone: zone.trim(),
      features: selectedServices,
      description: description.trim(),
      orientation: orientation.trim(),
      registryStatus: registryStatus.trim(),
      image: finalImage,
      gallery: [finalImage],
    };

    addProperty(data);
    setIsSuccess(true);
    setTimeout(() => {
      onNavigate('admin');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 pt-8 sm:pt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#113d22] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-[#22A33D]" />
            <span>Volver al Panel de Administración</span>
          </button>

          <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-3 py-1 rounded-full">
            NUEVA PUBLICACIÓN
          </span>
        </div>

        {/* Hero Header */}
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="h-4 w-4" />
                <span>Panel de Creación de Inmuebles · MGM Inmobiliaria</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                Publicar Nueva Propiedad
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl">
                Completa los parámetros técnicos, financieros y fotográficos del inmueble. El nuevo lote o vivienda se integrará inmediatamente al catálogo público en vivo.
              </p>
            </div>
            
            <div className="shrink-0 flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white font-mono text-xs font-bold border border-white/15">
                Código: {code.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {isSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-bold">¡Propiedad publicada con éxito! Redirigiendo al panel de administración...</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form Fields (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Identificación y Ubicación */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/90 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Building className="h-4 w-4 text-[#22A33D]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  1. Identificación y Proyecto
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Código Inmueble *
                  </label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Ej. MV-105"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Título Comercial *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Lote Residencial Esquinero Miravalle"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Localidad / Cantón</label>
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 bg-white focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Miravalle (Azuay)">Miravalle (Azuay)</option>
                    <option value="Cuenca">Cuenca</option>
                    <option value="Challuabamba">Challuabamba</option>
                    <option value="Paute">Paute</option>
                    <option value="Gualaceo">Gualaceo</option>
                    <option value="Yunguilla">Valle de Yunguilla</option>
                    <option value="Azogues">Azogues</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Proyecto</label>
                  <select
                    value={project}
                    onChange={(e) => setProject(e.target.value as LotProperty['project'])}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm text-slate-900 bg-white focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Ciudadela Miravalle">Ciudadela Miravalle</option>
                    <option value="Colinas del Valle">Colinas del Valle</option>
                    <option value="Residencial Los Álamos">Residencial Los Álamos</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tipo de Propiedad</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as LotProperty['type'])}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm text-slate-900 bg-white focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Lote de Terreno">Lote de Terreno</option>
                    <option value="Vivienda">Vivienda Terminada</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as LotProperty['category'])}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm text-slate-900 bg-white focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Residencial">Residencial</option>
                    <option value="Esquinero">Esquinero</option>
                    <option value="Campestre">Campestre</option>
                    <option value="Comercial">Comercial</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Valores Financieros y Dimensiones */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/90 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <DollarSign className="h-4 w-4 text-[#22A33D]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  2. Cotización y Dimensiones Métricas
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Precio Total (USD) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      required
                      min={1000}
                      step={500}
                      value={priceUSD}
                      onChange={(e) => handlePriceChange(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-300 pl-7 pr-3 py-2 text-sm font-mono font-black text-slate-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Entrada Mínima (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      value={minDownPaymentUSD}
                      onChange={(e) => setMinDownPaymentUSD(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-300 pl-7 pr-3 py-2 text-sm font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Plazo Máximo</label>
                  <select
                    value={maxMonths}
                    onChange={(e) => setMaxMonths(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white focus:border-emerald-600 focus:outline-none"
                  >
                    <option value={12}>12 meses</option>
                    <option value={24}>24 meses</option>
                    <option value={36}>36 meses</option>
                    <option value={48}>48 meses (Recomendado)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Estado Venta</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as LotProperty['status'])}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-900 bg-white focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="En Reserva">En Reserva</option>
                    <option value="Vendido">Vendido</option>
                  </select>
                </div>
              </div>

              {/* Calculated Monthly Plan Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white font-mono font-bold text-xs">
                    48M
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-950 block">Crédito Directo Estimado</span>
                    <span className="text-[11px] text-emerald-800">Saldo a financiar sin bancos ni trámites burocráticos</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg sm:text-xl font-black text-emerald-900 font-mono">
                    ${estimatedMonthly} <span className="text-xs font-semibold text-emerald-800">/mes</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Superficie Total (m²) *</label>
                  <input
                    type="number"
                    required
                    min={50}
                    value={areaM2}
                    onChange={(e) => setAreaM2(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Dimensiones (Frente × Fondo)</label>
                  <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="Ej. 10.0m × 20.0m"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Topografía</label>
                  <input
                    type="text"
                    value={topography}
                    onChange={(e) => setTopography(e.target.value)}
                    placeholder="Ej. 100% Plano"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Selección de Fotografía */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/90 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <ImageIcon className="h-4 w-4 text-[#22A33D]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  3. Fotografía Principal del Inmueble
                </h2>
              </div>

              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <span className="text-xs font-bold text-slate-700 block">Galería y Selección de Fotografía:</span>
                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-[#113d22] text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer w-fit">
                    <Upload className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Subir desde este dispositivo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {imagesList.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-500 text-xs">
                    No hay imágenes cargadas. Sube una imagen desde tu dispositivo o ingresa una URL abajo.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {imagesList.map((preset) => {
                      const isSelected = image === preset.url && !customImageUrl;
                      return (
                        <div
                          key={preset.url}
                          onClick={() => {
                            setImage(preset.url);
                            setCustomImageUrl('');
                          }}
                          className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all aspect-[4/3] group ${
                            isSelected
                              ? 'border-[#22A33D] shadow-md ring-2 ring-emerald-500/20'
                              : 'border-slate-200 hover:border-slate-400 opacity-85 hover:opacity-100'
                          }`}
                        >
                          <Image
                            src={preset.url}
                            alt={preset.title}
                            fill
                            unoptimized={preset.url.startsWith('data:')}
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5 pointer-events-none">
                            <span className="text-[11px] font-bold text-white leading-tight truncate">
                              {preset.title}
                            </span>
                          </div>

                          {/* Botón X para eliminar foto */}
                          <button
                            type="button"
                            onClick={(e) => handleRemoveImage(preset.url, e)}
                            title="Eliminar esta foto"
                            className="absolute top-2 left-2 z-20 bg-slate-900/80 hover:bg-rose-600 text-white p-1 rounded-full shadow-md transition-all active:scale-90 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>

                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-[#22A33D] text-white p-1 rounded-full shadow-md z-10 pointer-events-none">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  O ingresa URL personalizada de imagen (Unsplash, Firebase Storage, CDN):
                </label>
                <input
                  type="url"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* 4. Obras e Infraestructura */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/90 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <ShieldCheck className="h-4 w-4 text-[#22A33D]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  4. Obras e Infraestructura Incluidas
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {AVAILABLE_SERVICES.map((srv) => {
                  const isChecked = selectedServices.includes(srv);
                  return (
                    <label
                      key={srv}
                      className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-50/60 text-emerald-950 font-semibold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleService(srv)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                      />
                      <span className="text-xs">{srv}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 5. Descripción y Legal */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200/90 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <FileCheck className="h-4 w-4 text-[#22A33D]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  5. Memoria Descriptiva & Certeza Notarial
                </h2>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Descripción Comercial para Clientes
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe el lote, vistas panorámicas o cercanía a las áreas verdes..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Ubicación / Sector Interno
                  </label>
                  <input
                    type="text"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    placeholder="Etapa 1 · Sector Miravalle Central"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Estado Registral Notarial
                  </label>
                  <input
                    type="text"
                    value={registryStatus}
                    onChange={(e) => setRegistryStatus(e.target.value)}
                    placeholder="Escritura individual legalizada e inscrita"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Live Preview & Action Buttons (4 Cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Live Preview Card */}
            <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Eye className="h-4 w-4 text-emerald-600" />
                  <span>Vista Previa en Vivo</span>
                </div>
                <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {type}
                </span>
              </div>

              {/* Card Rendering */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="relative w-full h-[180px] bg-slate-950">
                  {(customImageUrl.trim() || image) ? (
                    <Image
                      src={customImageUrl.trim() || image}
                      alt={name}
                      fill
                      unoptimized={(customImageUrl.trim() || image).startsWith('data:')}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      Sin imagen seleccionada
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent pointer-events-none" />
                </div>
                <div className="p-3.5 bg-white space-y-2">
                  <h3 className="text-sm font-black text-slate-900 line-clamp-1">{name}</h3>
                  <div className="grid grid-cols-2 py-1.5 border-y border-slate-100 text-xs">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Superficie</span>
                      <p className="font-mono font-bold text-slate-900">{areaM2} m²</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Financiamiento</span>
                      <p className="font-mono font-bold text-slate-900">{maxMonths} meses</p>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Precio</span>
                      <span className="font-mono font-black text-slate-900 text-sm sm:text-base">${priceUSD.toLocaleString('es-EC')}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-bold text-emerald-700 uppercase block">Cuota</span>
                      <span className="font-mono font-black text-emerald-700 text-sm sm:text-base">${estimatedMonthly}/mes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ubicación y Pin Exacto en Mapa */}
            <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <MapPin className="h-4 w-4 text-[#22A33D]" />
                  <span>Ubicación Exacta en Mapa</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {locality}
                </span>
              </div>

              <InteractiveMapPicker
                selectedLocality={locality}
                initialLat={coords.lat}
                initialLng={coords.lng}
                onLocationChange={(lat, lng, placeName) => {
                  setCoords({ lat, lng });
                  if (placeName) {
                    setZone(placeName);
                  }
                }}
              />
            </div>

            {/* Action Card */}
            <div className="bg-white rounded-3xl p-5 shadow-md border border-slate-200 space-y-3">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Publicar Nueva Propiedad</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('admin')}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-center"
              >
                Cancelar y Regresar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
