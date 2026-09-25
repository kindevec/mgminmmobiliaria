'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Upload,
  CheckCircle2,
  DollarSign,
  Maximize2,
  MapPin,
  Sparkles,
  Layers,
  Save,
  ImageIcon,
} from 'lucide-react';
import type { LotProperty } from '@/src/data/lots';

interface AdminPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<LotProperty, 'id'>, id?: string) => void;
  propertyToEdit?: LotProperty | null;
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

export function AdminPropertyModal({
  isOpen,
  onClose,
  onSave,
  propertyToEdit,
}: AdminPropertyModalProps) {
  const isEditing = Boolean(propertyToEdit);

  // Form States initialized cleanly from propertyToEdit or defaults
  const [code, setCode] = useState(
    () => propertyToEdit?.code || `MV-${Math.floor(100 + Math.random() * 900)}`
  );
  const [name, setName] = useState(
    () => propertyToEdit?.name || 'Lote Residencial Miravalle'
  );
  const [project, setProject] = useState<LotProperty['project']>(
    () => propertyToEdit?.project || 'Ciudadela Miravalle'
  );
  const [type, setType] = useState<LotProperty['type']>(
    () => propertyToEdit?.type || 'Lote de Terreno'
  );
  const [category, setCategory] = useState<LotProperty['category']>(
    () => propertyToEdit?.category || 'Residencial'
  );
  const [areaM2, setAreaM2] = useState<number>(
    () => propertyToEdit?.areaM2 || 200
  );
  const [dimensions, setDimensions] = useState(
    () => propertyToEdit?.dimensions || '10.0m × 20.0m'
  );
  const [priceUSD, setPriceUSD] = useState<number>(
    () => propertyToEdit?.priceUSD || 28500
  );
  const [minDownPaymentUSD, setMinDownPaymentUSD] = useState<number>(
    () => propertyToEdit?.minDownPaymentUSD || 5700
  );
  const [maxMonths, setMaxMonths] = useState<number>(
    () => propertyToEdit?.maxMonths || 48
  );
  const [topography, setTopography] = useState(
    () => propertyToEdit?.topography || '100% Plano'
  );
  const [status, setStatus] = useState<LotProperty['status']>(
    () => propertyToEdit?.status || 'Disponible'
  );
  const [zone, setZone] = useState(
    () => propertyToEdit?.zone || 'Etapa 1 · Sector Miravalle Central'
  );
  const [orientation, setOrientation] = useState(
    () => propertyToEdit?.orientation || 'Norte - Sur'
  );
  const [registryStatus, setRegistryStatus] = useState(
    () => propertyToEdit?.registryStatus || 'Escritura individual legalizada e inscrita'
  );
  const [image, setImage] = useState(
    () => propertyToEdit?.image || PRESET_IMAGES[0].url
  );
  const [description, setDescription] = useState(
    () => propertyToEdit?.description || 'Excelente lote residencial urbanizado con obras al 100% y financiamiento directo hasta 48 meses.'
  );
  const [selectedServices, setSelectedServices] = useState<string[]>(
    () => propertyToEdit?.features || [
      'Red eléctrica soterrada',
      'Agua potable garantizada',
      'Alcantarillado pluvial y sanitario',
      'Vías adoquinadas de alto tonelaje',
    ]
  );

  // Keep down payment auto-synced at ~20% when price changes (unless customized)
  const handlePriceChange = (val: number) => {
    setPriceUSD(val);
    setMinDownPaymentUSD(Math.round(val * 0.2));
  };

  const estimatedMonthly = maxMonths > 0
    ? Math.round((Math.max(0, priceUSD - minDownPaymentUSD)) / maxMonths)
    : 0;

  if (!isOpen) return null;

  const toggleService = (srv: string) => {
    if (selectedServices.includes(srv)) {
      setSelectedServices(selectedServices.filter((s) => s !== srv));
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
      image: image.trim(),
      gallery: [image.trim()],
    };

    onSave(data, propertyToEdit?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92dvh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 p-5 sm:p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Panel CMS · MGM Inmobiliaria</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {isEditing ? `Editar Propiedad ${propertyToEdit?.code}` : 'Publicar Nueva Propiedad'}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Los cambios se guardan y se sincronizan en tiempo real con el catálogo web.
          </p>
        </div>

        {/* Form Body Scrollable */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Group 1: General Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
              1. Identificación y Proyecto
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm font-mono font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
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
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Proyecto</label>
                <select
                  value={project}
                  onChange={(e) => setProject(e.target.value as LotProperty['project'])}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                >
                  <option value="Ciudadela Miravalle">Ciudadela Miravalle</option>
                  <option value="Mirador del Valle">Mirador del Valle</option>
                  <option value="Colinas Verdes">Colinas Verdes</option>
                  <option value="Residencial San Antonio">Residencial San Antonio</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tipo</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as LotProperty['type'])}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                >
                  <option value="Lote de Terreno">Lote de Terreno</option>
                  <option value="Vivienda">Vivienda</option>
                  <option value="Proyecto en Planos">Proyecto en Planos</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Estado</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LotProperty['status'])}
                  className={`w-full rounded-xl border px-3 py-2 text-xs font-bold focus:outline-none ${
                    status === 'Disponible'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                      : status === 'En Reserva'
                      ? 'border-amber-500 bg-amber-50 text-amber-800'
                      : 'border-rose-500 bg-rose-50 text-rose-800'
                  }`}
                >
                  <option value="Disponible">🟢 Disponible</option>
                  <option value="En Reserva">🟡 En Reserva</option>
                  <option value="Vendido">🔴 Vendido</option>
                </select>
              </div>
            </div>
          </div>

          {/* Group 2: Dimensions & Pricing */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
              2. Metraje, Dimensiones y Financiamiento Directo
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Área (m²) *
                </label>
                <input
                  type="number"
                  required
                  min={50}
                  value={areaM2}
                  onChange={(e) => setAreaM2(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Dimensiones
                </label>
                <input
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="10.0m × 20.0m"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Precio Total (USD) *
                </label>
                <input
                  type="number"
                  required
                  step={500}
                  value={priceUSD}
                  onChange={(e) => handlePriceChange(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm font-mono font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Entrada Sugerida ($)
                </label>
                <input
                  type="number"
                  value={minDownPaymentUSD}
                  onChange={(e) => setMinDownPaymentUSD(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Plazo Máximo</label>
                <select
                  value={maxMonths}
                  onChange={(e) => setMaxMonths(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                >
                  <option value={12}>12 meses</option>
                  <option value={24}>24 meses</option>
                  <option value={36}>36 meses</option>
                  <option value={48}>48 meses</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Topografía</label>
                <input
                  type="text"
                  value={topography}
                  onChange={(e) => setTopography(e.target.value)}
                  placeholder="100% Plano"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="col-span-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Cuota mensual proyectada
                  </span>
                  <span className="text-base font-black font-mono text-emerald-800">
                    ~${estimatedMonthly} <span className="text-xs font-normal text-slate-500">USD/mes</span>
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">Sin intereses abusivos</span>
              </div>
            </div>
          </div>

          {/* Group 3: Image & Presets */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
              3. Imagen Principal (URL o Biblioteca Rápida HD)
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                URL de Fotografía Directa
              </label>
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            {/* Quick preset chips for rapid mobile updating */}
            <div>
              <span className="text-[11px] text-slate-500 block mb-1.5 font-medium">
                Selección Rápida desde Terreno (Toca para asignar foto HD):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImage(preset.url)}
                    className={`relative rounded-xl overflow-hidden border p-1 text-left transition-all cursor-pointer ${
                      image === preset.url
                        ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-slate-100">
                      <Image
                        src={preset.url}
                        alt={preset.title}
                        fill
                        sizes="160px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700 block truncate mt-1">
                      {preset.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Group 4: Services Checkboxes */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
              4. Obras e Infraestructura Incluidas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {AVAILABLE_SERVICES.map((srv) => {
                const isChecked = selectedServices.includes(srv);
                return (
                  <label
                    key={srv}
                    className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${
                      isChecked
                        ? 'border-emerald-500 bg-emerald-50/60 text-emerald-950 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleService(srv)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>{srv}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Group 5: Description & Legal */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
              5. Descripción y Situación Jurídica
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Descripción para Clientes
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe el lote, orientación, vistas o cercanía a las áreas verdes..."
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Ubicación / Sector
                </label>
                <input
                  type="text"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  placeholder="Etapa 1 · Sector Miravalle Central"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
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
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>{isEditing ? 'Guardar Cambios' : 'Publicar Inmueble'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
