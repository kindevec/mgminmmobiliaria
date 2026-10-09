'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  FileText,
  Trash2,
  Star,
  Plus,
  Loader2,
  ExternalLink,
  Info,
  ArrowLeft,
} from 'lucide-react';
import type { LotProperty } from '@/src/data/lots';
import { useProperties } from '@/src/context/PropertyContext';
import {
  convertImageToWebP,
  uploadOptimizedImage,
  uploadPropertyDocument,
} from '@/src/lib/imageOptimizer';

interface AdminPropertyModalProps {
  isOpen?: boolean;
  isPageView?: boolean;
  onClose: () => void;
  onSave: (data: Omit<LotProperty, 'id'>, id?: string) => Promise<void> | void;
  onDelete?: (id: string) => void;
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
  'Agua potable garantizada',
  'Energía eléctrica y alumbrado público',
  'Alcantarillado pluvial y sanitario',
  'Internet / Fibra óptica',
  'Vías de acceso adoquinadas o asfaltadas',
  'Transporte público cercano',
  'Garita de seguridad y control 24/7',
  'Alumbrado público LED',
  'Bordillos y aceras podotáctiles',
  'Cisterna con bomba y portón eléctrico',
  'Uso de suelo residencial y comercial (COS 70%)',
  'Otros servicios complementarios',
];

const PROJECT_OPTIONS: LotProperty['project'][] = [
  'San Antonio · Manta',
  'Jerusalén · Malchinguí',
  'Ciudadela Miravalle',
  'Mirador del Valle',
  'Colinas Verdes',
  'Residencial San Antonio',
];

export function AdminPropertyModal({
  isOpen,
  isPageView = false,
  onClose,
  onSave,
  onDelete,
  propertyToEdit,
}: AdminPropertyModalProps) {
  const isEditing = Boolean(propertyToEdit);
  const { deleteProperty } = useProperties();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form States
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [project, setProject] = useState<LotProperty['project']>('San Antonio · Manta');
  const [type, setType] = useState<LotProperty['type']>('Lote de Terreno');
  const [category, setCategory] = useState<LotProperty['category']>('Residencial');
  const [areaM2, setAreaM2] = useState<number>(200);
  const [dimensions, setDimensions] = useState('10.0m × 20.0m');
  const [priceUSD, setPriceUSD] = useState<number>(28500);
  const [minDownPaymentUSD, setMinDownPaymentUSD] = useState<number>(5700);
  const [maxMonths, setMaxMonths] = useState<number>(48);
  const [topography, setTopography] = useState('100% Plano y Regular');
  const [status, setStatus] = useState<LotProperty['status']>('Disponible');
  const [zone, setZone] = useState('');
  const [address, setAddress] = useState('');
  const [orientation, setOrientation] = useState('');
  const [registryStatus, setRegistryStatus] = useState('');
  const [image, setImage] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [beds, setBeds] = useState<number | undefined>(undefined);
  const [baths, setBaths] = useState<number | undefined>(undefined);
  const [parkingSpaces, setParkingSpaces] = useState<number | undefined>(undefined);
  const [floors, setFloors] = useState<number | undefined>(undefined);
  const [ageYears, setAgeYears] = useState<number | undefined>(undefined);

  // Specific Terrain Fields
  const [terrainFront, setTerrainFront] = useState<number | undefined>(undefined);
  const [terrainDepth, setTerrainDepth] = useState<number | undefined>(undefined);
  const [terrainType, setTerrainType] = useState('Plano');
  const [landUse, setLandUse] = useState('Residencial (COS 70%)');
  const [accessibility, setAccessibility] = useState('Vía adoquinada de primer orden');
  const [additionalTerrainInfo, setAdditionalTerrainInfo] = useState('');

  const [featured, setFeatured] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [pdfTitle, setPdfTitle] = useState<string>('');
  const [documents, setDocuments] = useState<
    { title: string; url: string; size?: string; description?: string }[]
  >([]);

  // Upload progress states
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const docFileInputRef = useRef<HTMLInputElement>(null);

  const isEffectiveOpen = isOpen || isPageView;

  // Sync state whenever propertyToEdit changes or modal opens
  useEffect(() => {
    if (isEffectiveOpen) {
      if (propertyToEdit) {
        setCode(propertyToEdit.code);
        setName(propertyToEdit.name);
        setProject(propertyToEdit.project);
        setType(propertyToEdit.type);
        setCategory(propertyToEdit.category);
        setAreaM2(propertyToEdit.areaM2);
        setDimensions(propertyToEdit.dimensions);
        setPriceUSD(propertyToEdit.priceUSD);
        setMinDownPaymentUSD(propertyToEdit.minDownPaymentUSD);
        setMaxMonths(propertyToEdit.maxMonths || 48);
        setTopography(propertyToEdit.topography);
        setStatus(propertyToEdit.status);
        setZone(propertyToEdit.zone);
        setAddress(propertyToEdit.address || '');
        setOrientation(propertyToEdit.orientation || '');
        setRegistryStatus(propertyToEdit.registryStatus || '');
        setImage(propertyToEdit.image);
        setGallery(
          Array.isArray(propertyToEdit.gallery) && propertyToEdit.gallery.length > 0
            ? propertyToEdit.gallery
            : [propertyToEdit.image]
        );
        setDescription(propertyToEdit.description);
        setSelectedServices(propertyToEdit.features || propertyToEdit.services || []);
        setBeds(propertyToEdit.beds);
        setBaths(propertyToEdit.baths);
        setParkingSpaces(propertyToEdit.parkingSpaces);
        setFloors(propertyToEdit.floors);
        setAgeYears(propertyToEdit.ageYears);
        setTerrainFront(propertyToEdit.terrainFront);
        setTerrainDepth(propertyToEdit.terrainDepth);
        setTerrainType(propertyToEdit.terrainType || 'Plano');
        setLandUse(propertyToEdit.landUse || 'Residencial (COS 70%)');
        setAccessibility(propertyToEdit.accessibility || 'Vía adoquinada de primer orden');
        setAdditionalTerrainInfo(propertyToEdit.additionalTerrainInfo || '');
        setFeatured(Boolean(propertyToEdit.featured));
        setPdfUrl(propertyToEdit.pdfUrl || '');
        setPdfTitle(propertyToEdit.pdfTitle || '');
        setDocuments(propertyToEdit.documents || []);
      } else {
        // Reset to initial new property template
        const randCode = `PROP-${Math.floor(100 + Math.random() * 900)}`;
        setCode(randCode);
        setName('Nuevo Inmueble MGM');
        setProject('San Antonio · Manta');
        setType('Lote de Terreno');
        setCategory('Residencial');
        setAreaM2(300);
        setDimensions('12.0m × 25.0m');
        setPriceUSD(35000);
        setMinDownPaymentUSD(7000);
        setMaxMonths(48);
        setTopography('100% Plano y Regular');
        setStatus('Disponible');
        setZone('Sector Urbano de Alta Plusvalía');
        setAddress('');
        setOrientation('Vías de primer orden y entorno residencial');
        setRegistryStatus('Escritura pública, certificado de gravámenes al día');
        setImage(PRESET_IMAGES[0].url);
        setGallery([PRESET_IMAGES[0].url]);
        setDescription('Excelente oportunidad de inversión con financiamiento directo y documentos en regla.');
        setSelectedServices([
          'Agua potable garantizada',
          'Energía eléctrica y alumbrado público',
          'Alcantarillado pluvial y sanitario',
          'Vías de acceso adoquinadas o asfaltadas',
        ]);
        setBeds(undefined);
        setBaths(undefined);
        setParkingSpaces(undefined);
        setFloors(undefined);
        setAgeYears(undefined);
        setTerrainFront(12);
        setTerrainDepth(25);
        setTerrainType('Plano');
        setLandUse('Residencial (COS 70%)');
        setAccessibility('Vía adoquinada de primer orden');
        setAdditionalTerrainInfo('');
        setFeatured(true);
        setPdfUrl('');
        setPdfTitle('');
        setDocuments([]);
      }
    }
  }, [isEffectiveOpen, propertyToEdit]);

  const handlePriceChange = (val: number) => {
    setPriceUSD(val);
    setMinDownPaymentUSD(Math.round(val * 0.2));
  };

  const estimatedMonthly =
    maxMonths > 0 ? Math.round(Math.max(0, priceUSD - minDownPaymentUSD) / maxMonths) : 0;

  const toggleService = (srv: string) => {
    if (selectedServices.includes(srv)) {
      setSelectedServices(selectedServices.filter((s) => s !== srv));
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  // Image upload handler with automatic WebP conversion
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    setUploadMessage('Optimizando a formato WebP y subiendo...');

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadMessage(`Comprimiendo a WebP foto ${i + 1} de ${files.length}...`);
        const url = await uploadOptimizedImage(file, code || 'prop');
        uploadedUrls.push(url);
      }

      if (uploadedUrls.length > 0) {
        // Append to gallery
        const newGallery = [...gallery, ...uploadedUrls].filter(Boolean);
        setGallery(newGallery);
        if (!image || image === PRESET_IMAGES[0].url) {
          setImage(uploadedUrls[0]);
        }
      }
      setUploadMessage('¡Imágenes WebP subidas con éxito!');
    } catch (err) {
      console.error('Error al subir imágenes:', err);
      const msg = err instanceof Error ? err.message : 'Hubo un error al optimizar o subir la imagen.';
      alert(msg);
    } finally {
      setIsUploadingImage(false);
      setTimeout(() => setUploadMessage(''), 3000);
      if (imageFileInputRef.current) imageFileInputRef.current.value = '';
    }
  };

  // Document PDF upload handler
  const handleDocFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingDoc(true);
    setUploadMessage('Subiendo documento oficial...');

    try {
      const uploadedDoc = await uploadPropertyDocument(file, code || 'prop');
      const newDocs = [...documents, uploadedDoc];
      setDocuments(newDocs);

      if (!pdfUrl) {
        setPdfUrl(uploadedDoc.url);
        setPdfTitle(uploadedDoc.title);
      }
      setUploadMessage('¡Documento PDF subido con éxito!');
    } catch (err) {
      console.error('Error al subir documento:', err);
      const msg = err instanceof Error ? err.message : 'Hubo un error al subir el documento PDF.';
      alert(msg);
    } finally {
      setIsUploadingDoc(false);
      setTimeout(() => setUploadMessage(''), 3000);
      if (docFileInputRef.current) docFileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (photoUrl: string) => {
    const updated = gallery.filter((p) => p !== photoUrl);
    setGallery(updated);
    if (image === photoUrl && updated.length > 0) {
      setImage(updated[0]);
    }
  };

  const handleRemoveDoc = (index: number) => {
    const updated = documents.filter((_, i) => i !== index);
    setDocuments(updated);
    if (updated.length === 0) {
      setPdfUrl('');
      setPdfTitle('');
    } else {
      setPdfUrl(updated[0].url);
      setPdfTitle(updated[0].title);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalImage = image.trim() || gallery[0] || PRESET_IMAGES[0].url;
    const finalGallery = gallery.length > 0 ? gallery : [finalImage];

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
      address: address.trim() || undefined,
      features: selectedServices,
      services: selectedServices,
      description: description.trim(),
      orientation: orientation.trim(),
      registryStatus: registryStatus.trim(),
      image: finalImage,
      gallery: finalGallery,
      beds: beds ? Number(beds) : undefined,
      baths: baths ? Number(baths) : undefined,
      parkingSpaces: parkingSpaces ? Number(parkingSpaces) : undefined,
      floors: floors ? Number(floors) : undefined,
      ageYears: ageYears ? Number(ageYears) : undefined,
      terrainFront: terrainFront ? Number(terrainFront) : undefined,
      terrainDepth: terrainDepth ? Number(terrainDepth) : undefined,
      terrainType: terrainType ? terrainType.trim() : undefined,
      landUse: landUse ? landUse.trim() : undefined,
      accessibility: accessibility ? accessibility.trim() : undefined,
      additionalTerrainInfo: additionalTerrainInfo ? additionalTerrainInfo.trim() : undefined,
      featured,
      pdfUrl: pdfUrl.trim() || undefined,
      pdfTitle: pdfTitle.trim() || (pdfUrl ? `Ficha Técnica ${code}` : undefined),
      documents,
    };

    try {
      await onSave(data, propertyToEdit?.id);
      onClose();
    } catch {
      // Si la persistencia falló, el error ya fue alertado por handleSaveProperty
      // Se mantiene el modal abierto para no perder la información ingresada
    }
  };

  if (!isOpen && !isPageView) return null;

  const modalBody = (
    <div
      className={
        isPageView
          ? 'w-full space-y-6 text-slate-800'
          : 'relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 max-h-[92dvh] overflow-hidden flex flex-col'
      }
    >
      {/* Header */}
      {isPageView ? (
        <div className="pb-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Volver a Propiedades</span>
              </button>
              <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                {isEditing ? `EDITANDO: ${propertyToEdit?.code}` : 'NUEVO INMUEBLE'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {isEditing
                ? `Editar Propiedad ${propertyToEdit?.code} - ${propertyToEdit?.name}`
                : 'Publicar Nuevo Inmueble Real'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Sincronización en tiempo real y optimización automática WebP.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isUploadingImage || isUploadingDoc}
              className="px-5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-950 p-5 sm:p-7 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Panel CMS Directo · Catálogo Inmobiliario</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {isEditing ? `Editar Propiedad ${propertyToEdit?.code}` : 'Publicar Nuevo Inmueble Real'}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Sincronización en tiempo real y optimización automática WebP.
          </p>
        </div>
      )}

      {/* Upload feedback banner */}
      {uploadMessage && (
        <div
          className={`bg-emerald-500 text-slate-950 ${
            isPageView ? 'px-4 py-2.5 rounded-2xl' : 'px-5 py-2.5'
          } text-xs font-bold flex items-center justify-between shrink-0 transition-all`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{uploadMessage}</span>
          </div>
          {(isUploadingImage || isUploadingDoc) && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
      )}

      {/* Form Body Scrollable if modal, natural without padding if page */}
      <form
        onSubmit={handleSubmit}
        className={`${
          isPageView ? 'space-y-6' : 'p-6 sm:p-8 overflow-y-auto max-h-[calc(92dvh-150px)] space-y-6 flex-1'
        } text-slate-800`}
      >
          {/* Group 1: Identificación y Proyecto */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1 flex items-center justify-between">
              <span>1. Identificación y Ubicación</span>
              <span className="text-[10px] text-emerald-600 font-semibold lowercase">
                * Campos requeridos
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Código Único (Ej: MT24-023)
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="MT24-023"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nombre Comercial del Inmueble
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Casa con Local Comercial en Manta"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Proyecto / Desarrollo
                </label>
                <select
                  value={project}
                  onChange={(e) => setProject(e.target.value as LotProperty['project'])}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 bg-white focus:border-emerald-600 focus:outline-none"
                >
                  {PROJECT_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tipo de Bien</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as LotProperty['type'])}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 bg-white focus:border-emerald-600 focus:outline-none"
                >
                  <option value="Lote de Terreno">Lote de Terreno</option>
                  <option value="Vivienda">Vivienda / Casa</option>
                  <option value="Proyecto en Planos">Proyecto en Planos</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as LotProperty['category'])}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 bg-white focus:border-emerald-600 focus:outline-none"
                >
                  <option value="Residencial">Residencial</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Esquinero">Esquinero</option>
                  <option value="Campestre">Campestre</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Sector / Ubicación Geográfica
                </label>
                <input
                  type="text"
                  required
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  placeholder="Ej: Sector Miravalle Central · Azuay"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Dirección Exacta / Vía de Acceso
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ej: Av. Principal y Calle Las Retamas"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Group 2: Dimensiones, Finanzas y Características */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
              2. Precios, Dimensiones y Estado
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Área Total (m²)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={areaM2}
                  onChange={(e) => setAreaM2(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Dimensiones</label>
                <input
                  type="text"
                  required
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="12.00m × 26.56m"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Precio Total (USD)</label>
                <input
                  type="number"
                  required
                  value={priceUSD}
                  onChange={(e) => handlePriceChange(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Entrada Mínima (USD)</label>
                <input
                  type="number"
                  required
                  value={minDownPaymentUSD}
                  onChange={(e) => setMinDownPaymentUSD(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Plazo Máx (Meses)</label>
                <input
                  type="number"
                  value={maxMonths}
                  onChange={(e) => setMaxMonths(parseInt(e.target.value) || 48)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Estado del Inmueble</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LotProperty['status'])}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 bg-white focus:border-emerald-600 focus:outline-none font-semibold"
                >
                  <option value="Disponible">Disponible</option>
                  <option value="En Reserva">Reservada</option>
                  <option value="Vendido">Vendida</option>
                  <option value="Inactiva">Inactiva</option>
                </select>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between col-span-2 sm:col-span-1">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Cuota mensual proyectada
                  </span>
                  <span className="text-base font-black font-mono text-emerald-800">
                    ~${estimatedMonthly}{' '}
                    <span className="text-xs font-normal text-slate-500">USD/mes</span>
                  </span>
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-emerald-700">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Destacar</span>
                </label>
              </div>
            </div>

            {/* Características de Vivienda / Edificación (Solo si es Vivienda o Proyecto en Planos) */}
            {type !== 'Lote de Terreno' && (
              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
                  Características de la Vivienda / Edificación
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Habitaciones</label>
                    <input
                      type="number"
                      value={beds || ''}
                      onChange={(e) => setBeds(e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="Ej: 3"
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Baños</label>
                    <input
                      type="number"
                      value={baths || ''}
                      onChange={(e) => setBaths(e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="Ej: 2"
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Parqueaderos</label>
                    <input
                      type="number"
                      value={parkingSpaces || ''}
                      onChange={(e) => setParkingSpaces(e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="Ej: 2"
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Pisos / Plantas</label>
                    <input
                      type="number"
                      value={floors || ''}
                      onChange={(e) => setFloors(e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="Ej: 2"
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Antigüedad (Años)</label>
                    <input
                      type="number"
                      value={ageYears || ''}
                      onChange={(e) => setAgeYears(e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="0 para estreno"
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Información Especial para Terrenos (SOLO SI ES LOTE DE TERRENO) */}
            {type === 'Lote de Terreno' && (
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Información Especial para Terrenos</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Exclusivo Terreno
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-emerald-950 block mb-1">Área Total</label>
                    <div className="px-3 py-2 rounded-xl bg-white border border-emerald-200 text-xs font-mono font-bold text-emerald-900">
                      {areaM2} m²
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-emerald-950 block mb-1">Frente (Metros)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={terrainFront || ''}
                      onChange={(e) => setTerrainFront(e.target.value ? parseFloat(e.target.value) : undefined)}
                      placeholder="Ej: 12.0"
                      className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-emerald-950 block mb-1">Fondo (Metros)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={terrainDepth || ''}
                      onChange={(e) => setTerrainDepth(e.target.value ? parseFloat(e.target.value) : undefined)}
                      placeholder="Ej: 25.0"
                      className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-emerald-950 block mb-1">Tipo de Terreno</label>
                    <select
                      value={terrainType}
                      onChange={(e) => setTerrainType(e.target.value)}
                      className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="Plano">100% Plano</option>
                      <option value="Semi-plano">Semi-plano</option>
                      <option value="Inclinado">Inclinado con vista</option>
                      <option value="Irregular">Irregular</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-emerald-950 block mb-1">Uso de Suelo</label>
                    <input
                      type="text"
                      value={landUse}
                      onChange={(e) => setLandUse(e.target.value)}
                      placeholder="Residencial, Comercial, Mixto..."
                      className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-emerald-950 block mb-1">Accesibilidad / Vía</label>
                    <input
                      type="text"
                      value={accessibility}
                      onChange={(e) => setAccessibility(e.target.value)}
                      placeholder="Vía adoquinada, asfaltada, etc."
                      className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-emerald-950 block mb-1">Información Adicional de Terreno</label>
                  <input
                    type="text"
                    value={additionalTerrainInfo}
                    onChange={(e) => setAdditionalTerrainInfo(e.target.value)}
                    placeholder="Linderos, punto de acometida, nivel de rasante..."
                    className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Group 3: Fotografías y Galería con Auto-WebP */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                3. Fotografías y Galería (Conversión WebP Automática)
              </h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                Auto-WebP 82% Ultra-Ahorro
              </span>
            </div>

            <div className="p-4 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/30 flex flex-col items-center justify-center text-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Subir fotos desde dispositivo (Móvil / PC)
                </p>
                <p className="text-[11px] text-slate-500">
                  Se optimizarán automáticamente a formato WebP de alto rendimiento.
                </p>
              </div>

              <input
                ref={imageFileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />

              <button
                type="button"
                disabled={isUploadingImage}
                onClick={() => imageFileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isUploadingImage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Optimizando a WebP...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Seleccionar Imágenes</span>
                  </>
                )}
              </button>
            </div>

            {/* Gallery Grid Preview */}
            {gallery.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                  Galería cargada ({gallery.length} fotos) · Toca la estrella para elegir foto de portada:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {gallery.map((photo, idx) => {
                    const isCover = photo === image;
                    return (
                      <div
                        key={idx}
                        className={`relative aspect-square rounded-xl overflow-hidden border group bg-slate-100 ${
                          isCover ? 'ring-2 ring-emerald-500 border-emerald-500' : 'border-slate-200'
                        }`}
                      >
                        <Image
                          src={photo}
                          alt={`Foto ${idx + 1}`}
                          fill
                          sizes="120px"
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setImage(photo)}
                            title="Fijar como Portada Principal"
                            className={`p-1.5 rounded-lg text-white transition-all ${
                              isCover ? 'bg-emerald-600' : 'bg-black/60 hover:bg-emerald-600'
                            }`}
                          >
                            <Star className="h-3.5 w-3.5 fill-current" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(photo)}
                            title="Eliminar foto"
                            className="p-1.5 rounded-lg bg-black/60 hover:bg-red-600 text-white transition-all"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {isCover && (
                          <div className="absolute bottom-1 left-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                            Portada
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                URL de Portada Principal Manual (o selecciona de la galería):
              </label>
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://... o /properties/MT24-023/foto-1.webp"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Group 4: Documentos Oficiales y Fichas Técnicas (PDF) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                4. Ficha Técnica Oficial y Documentos (PDF)
              </h3>
              <span className="text-[10px] text-slate-500 font-semibold">
                Soporte de Respaldo Jurídico
              </span>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Subir Ficha Técnica en PDF
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Aparecerá en los botones oficiales de descarga en el detalle de la propiedad.
                  </p>
                </div>
              </div>

              <input
                ref={docFileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleDocFileChange}
                className="hidden"
              />

              <button
                type="button"
                disabled={isUploadingDoc}
                onClick={() => docFileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
              >
                {isUploadingDoc ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Subiendo PDF...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-3.5 w-3.5" />
                    <span>Subir Ficha PDF</span>
                  </>
                )}
              </button>
            </div>

            {/* Documents List */}
            {documents.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-600 block">
                  Documentos vinculados ({documents.length}):
                </span>
                {documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="h-4 w-4 text-emerald-700 shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-slate-800 block truncate">{doc.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {doc.size || 'PDF'} · {doc.url.substring(0, 45)}...
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-all"
                        title="Ver PDF"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc(idx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        title="Eliminar documento"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Group 5: Obras y Servicios */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
              5. Obras e Infraestructura Incluidas
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

          {/* Group 6: Descripción y Respaldo Legal */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">
              6. Reseña Comercial, Sector y Respaldo Legal
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Descripción Completa para Clientes
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe la propiedad, distribución, vistas, ventajas comerciales y facilidades de acceso..."
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Ubicación Exacta / Sector
                </label>
                <input
                  type="text"
                  required
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  placeholder="San Antonio · Eloy Alfaro · Manta, Manabí"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Estado Registral / Notarial
                </label>
                <input
                  type="text"
                  value={registryStatus}
                  onChange={(e) => setRegistryStatus(e.target.value)}
                  placeholder="Escritura pública, catastro actualizado e impuestos al día"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Entorno / Orientación
              </label>
              <input
                type="text"
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                placeholder="Sector comercial y residencial de alta plusvalía"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className={`${isPageView ? 'pt-6 border-t border-slate-100' : 'pt-4 border-t border-slate-200 sticky bottom-0 bg-white py-2 z-10'} flex flex-wrap items-center justify-end gap-3`}>
            {isEditing && propertyToEdit && (
              <>
                {showDeleteConfirm ? (
                  <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl animate-in fade-in">
                    <span className="text-xs font-bold text-rose-800">¿Eliminar esta propiedad?</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (onDelete && propertyToEdit?.id) {
                          onDelete(propertyToEdit.id);
                        } else if (propertyToEdit?.id) {
                          deleteProperty(propertyToEdit.id);
                        }
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      Sí, Eliminar
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all cursor-pointer"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700 transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Eliminar esta propiedad de forma permanente"
                  >
                    <Trash2 className="h-4 w-4 text-rose-600" />
                    <span>Eliminar</span>
                  </button>
                )}
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUploadingImage || isUploadingDoc}
              className="px-6 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isEditing ? 'Guardar Cambios' : 'Publicar Inmueble'}</span>
            </button>
          </div>
        </form>
      </div>
  );

  if (isPageView) {
    return modalBody;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      {modalBody}
    </div>
  );
}
