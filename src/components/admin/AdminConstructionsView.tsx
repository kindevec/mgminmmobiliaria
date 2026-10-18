'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  HardHat,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Building2,
  MapPin,
  RotateCcw,
  X,
  Layers,
  Bed,
  Bath,
  Car,
  Image as ImageIcon,
  Save,
  Hammer,
  UploadCloud,
  Star,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useConstructions } from '@/src/lib/constructionStorage';
import { uploadOptimizedImage } from '@/src/lib/imageOptimizer';
import type { ConstructionProject } from '@/src/data/constructions';

export function AdminConstructionsView() {
  const {
    constructions,
    addConstruction,
    updateConstruction,
    deleteConstruction,
    resetToDefault,
    isLoading,
  } = useConstructions();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingProject, setEditingProject] = useState<ConstructionProject | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<ConstructionProject | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Estados para el sistema de subida de imágenes
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const showNotice = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Filtrado de la lista en admin
  const filteredConstructions = constructions.filter((p) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.code.toLowerCase().includes(term) ||
      p.location.toLowerCase().includes(term) ||
      p.canton.toLowerCase().includes(term) ||
      p.status.toLowerCase().includes(term)
    );
  });

  // Proyecto vacío para nuevo registro
  const emptyProject: ConstructionProject = {
    id: `const-${Date.now()}`,
    name: '',
    code: `CONST-${String(constructions.length + 1).padStart(2, '0')}`,
    status: 'En Construcción',
    location: '',
    canton: 'Cuenca',
    constructionArea: 180,
    lotArea: 250,
    levels: 2,
    bedrooms: 3,
    bathrooms: 3,
    parkingSpots: 2,
    description: '',
    features: ['Estructura sismorresistente', 'Acabados de primera', 'Pisos de porcelanato'],
    structureType: 'Pórticos de hormigón armado sismorresistente',
    mainImage: '',
    gallery: [],
    deliveryYear: `${new Date().getFullYear()}`,
    budgetRef: 'Proyecto Llave en Mano',
  };

  // Subida de imágenes de la construcción
  const handleFilesUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0 || !editingProject) return;
    setIsUploading(true);
    setUploadProgressText(`Optimizando y subiendo ${files.length} ${files.length === 1 ? 'imagen' : 'imágenes'}...`);

    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgressText(`Subiendo foto ${i + 1} de ${files.length}...`);
      try {
        const url = await uploadOptimizedImage(file, editingProject.code || 'const');
        newUrls.push(url);
      } catch (err) {
        console.warn('Fallback a FileReader por error en Supabase Storage:', err);
        // Fallback seguro usando DataURL para no perder la foto subida
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        });
        if (dataUrl) newUrls.push(dataUrl);
      }
    }

    if (newUrls.length > 0) {
      const currentGallery = Array.isArray(editingProject.gallery) ? [...editingProject.gallery] : [];
      // Combinar sin duplicados
      const combinedGallery = Array.from(new Set([...currentGallery, ...newUrls]));
      const currentMain = editingProject.mainImage || newUrls[0];

      setEditingProject({
        ...editingProject,
        mainImage: currentMain,
        gallery: combinedGallery,
      });
      showNotice(`¡${newUrls.length} ${newUrls.length === 1 ? 'imagen subida' : 'imágenes subidas'} con éxito!`);
    }

    setIsUploading(false);
    setUploadProgressText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Seleccionar cuál es la imagen principal
  const handleSetMainImage = (url: string) => {
    if (!editingProject) return;
    setEditingProject({
      ...editingProject,
      mainImage: url,
    });
    showNotice('Foto seleccionada como Imagen Principal');
  };

  // Eliminar una imagen de la galería
  const handleRemoveImage = (urlToRemove: string) => {
    if (!editingProject) return;
    const newGallery = editingProject.gallery.filter((u) => u !== urlToRemove);
    let newMain = editingProject.mainImage;
    if (newMain === urlToRemove) {
      newMain = newGallery[0] || '';
    }
    setEditingProject({
      ...editingProject,
      mainImage: newMain,
      gallery: newGallery,
    });
  };

  // Guardar proyecto (Crear o Editar)
  const handleSaveProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProject) return;

    if (!editingProject.name.trim()) {
      showNotice('El nombre de la construcción es obligatorio.', 'error');
      return;
    }

    // Validar que tenga al menos una imagen
    if (!editingProject.mainImage && (!editingProject.gallery || editingProject.gallery.length === 0)) {
      showNotice('Por favor sube al menos una imagen en el apartado de imágenes de la construcción.', 'error');
      return;
    }

    // Asegurar coherencia entre mainImage y gallery
    const finalGallery = Array.isArray(editingProject.gallery) && editingProject.gallery.length > 0
      ? editingProject.gallery
      : [editingProject.mainImage];

    const finalMain = editingProject.mainImage || finalGallery[0];

    const projectToSave = {
      ...editingProject,
      mainImage: finalMain,
      gallery: finalGallery.includes(finalMain) ? finalGallery : [finalMain, ...finalGallery],
    };

    if (isCreating) {
      await addConstruction(projectToSave);
      showNotice(`Obra "${projectToSave.name}" agregada y sincronizada.`);
    } else {
      await updateConstruction(projectToSave);
      showNotice(`Obra "${projectToSave.name}" actualizada con éxito.`);
    }

    setEditingProject(null);
    setIsCreating(false);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    const name = projectToDelete.name;
    await deleteConstruction(projectToDelete.id);
    setProjectToDelete(null);
    showNotice(`Obra "${name}" eliminada del catálogo público.`);
  };

  // Restablecer catálogo original
  const handleResetCatalog = async () => {
    if (window.confirm('¿Seguro que deseas restablecer las obras a las demostrativas originales de MGM? Se perderán las modificaciones personalizadas.')) {
      await resetToDefault();
      showNotice('Catálogo de construcciones restablecido a valores iniciales.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Alerta de notificación flotante */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border text-sm font-bold flex items-center justify-between shadow-lg transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-red-50 text-red-900 border-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="p-1 hover:bg-black/5 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Barra de Controles Superiores */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-[#113d22]">
              <HardHat className="w-5 h-5 text-[#F58220]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Nuestras Construcciones
              </h2>
              <p className="text-xs text-slate-500">
                {constructions.length} proyectos sincronizados con la página web pública
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar obra..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingProject({ ...emptyProject, id: `const-${Date.now()}` });
              setIsCreating(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#22A33D] hover:bg-[#1b8532] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Obra</span>
          </button>

          <button
            type="button"
            onClick={handleResetCatalog}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs transition-all cursor-pointer"
            title="Restablecer obras originales"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Listado de Obras en el Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConstructions.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Miniatura y Estado */}
              <div className="relative aspect-16/9 bg-slate-900 overflow-hidden">
                {project.mainImage ? (
                  <Image
                    src={project.mainImage}
                    alt={project.name}
                    fill
                    sizes="400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                    Sin imagen principal
                  </div>
                )}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-white/95 text-slate-900 shadow-sm border border-slate-200">
                    {project.status}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 text-white backdrop-blur-xs">
                    {project.code}
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-semibold text-white">
                  {project.gallery?.length || 0} fotos
                </div>
              </div>

              {/* Información */}
              <div className="p-4">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#F58220] shrink-0" />
                  <span className="truncate">{project.location}, {project.canton}</span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-1">
                  {project.name}
                </h3>

                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Métricas rápidas */}
                <div className="grid grid-cols-3 gap-1.5 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-700">
                  <div className="bg-slate-50 p-1.5 rounded-lg text-center">
                    <span className="text-[10px] text-slate-400 block">Const.</span>
                    <strong className="font-bold text-slate-900">{project.constructionArea} m²</strong>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg text-center">
                    <span className="text-[10px] text-slate-400 block">Terreno</span>
                    <strong className="font-bold text-slate-900">{project.lotArea} m²</strong>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg text-center">
                    <span className="text-[10px] text-slate-400 block">Cuartos</span>
                    <strong className="font-bold text-slate-900">{project.bedrooms} dorm.</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Botonera de Acciones (Editar / Eliminar) */}
            <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400 font-medium">
                Entrega: {project.deliveryYear}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProject(project);
                    setIsCreating(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Editar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProjectToDelete(project)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 border border-transparent hover:border-red-200 transition-all cursor-pointer"
                  title="Eliminar obra"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredConstructions.length === 0 && (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 text-slate-500">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="font-bold text-slate-700">No hay construcciones que coincidan con la búsqueda.</p>
        </div>
      )}

      {/* ========================================================
          MODAL: CREAR / EDITAR CONSTRUCCIÓN
          ======================================================== */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl my-8 overflow-hidden animate-in fade-in duration-200">
            <form onSubmit={handleSaveProject} className="flex flex-col max-h-[90vh]">
              {/* Cabecera del Modal */}
              <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-100 text-[#113d22]">
                    <Hammer className="w-5 h-5 text-[#F58220]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {isCreating ? 'Nueva Construcción' : `Editar: ${editingProject.name}`}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Se actualizará instantáneamente en el apartado público de Nuestras Construcciones
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingProject(null);
                    setIsCreating(false);
                  }}
                  className="p-2 hover:bg-slate-200 rounded-xl text-slate-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cuerpo del Formulario */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
                {/* 1. Datos Principales */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Nombre de la Construcción *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProject.name}
                      onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                      placeholder="Ej: Villa Campestre Challuabamba"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Código de Obra
                    </label>
                    <input
                      type="text"
                      value={editingProject.code}
                      onChange={(e) => setEditingProject({ ...editingProject, code: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* 2. Ubicación y Estado */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Estado de la Obra
                    </label>
                    <select
                      value={editingProject.status}
                      onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as ConstructionProject['status'] })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="Entregada">Entregada</option>
                      <option value="En Construcción">En Construcción</option>
                      <option value="En Planos">En Planos</option>
                      <option value="Llave en Mano">Llave en Mano</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Cantón
                    </label>
                    <input
                      type="text"
                      value={editingProject.canton}
                      onChange={(e) => setEditingProject({ ...editingProject, canton: e.target.value })}
                      placeholder="Ej: Cuenca, Paute, Santa Isabel..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Sector / Barrio
                    </label>
                    <input
                      type="text"
                      value={editingProject.location}
                      onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                      placeholder="Ej: Challuabamba Alta"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* 3. Ficha Técnica Numérica */}
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Ficha Técnica (Dimensiones y Distribución)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Const. (m²)</label>
                      <input
                        type="number"
                        min="0"
                        value={editingProject.constructionArea}
                        onChange={(e) => setEditingProject({ ...editingProject, constructionArea: Number(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Terreno (m²)</label>
                      <input
                        type="number"
                        min="0"
                        value={editingProject.lotArea}
                        onChange={(e) => setEditingProject({ ...editingProject, lotArea: Number(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Niveles</label>
                      <input
                        type="number"
                        min="1"
                        value={editingProject.levels}
                        onChange={(e) => setEditingProject({ ...editingProject, levels: Number(e.target.value) || 1 })}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Dormitorios</label>
                      <input
                        type="number"
                        min="0"
                        value={editingProject.bedrooms}
                        onChange={(e) => setEditingProject({ ...editingProject, bedrooms: Number(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Baños</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={editingProject.bathrooms}
                        onChange={(e) => setEditingProject({ ...editingProject, bathrooms: Number(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Parqueos</label>
                      <input
                        type="number"
                        min="0"
                        value={editingProject.parkingSpots}
                        onChange={(e) => setEditingProject({ ...editingProject, parkingSpots: Number(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Estructura y Año */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Sistema Estructural
                    </label>
                    <input
                      type="text"
                      value={editingProject.structureType}
                      onChange={(e) => setEditingProject({ ...editingProject, structureType: e.target.value })}
                      placeholder="Ej: Pórticos de hormigón sismorresistente"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Año de Entrega
                    </label>
                    <input
                      type="text"
                      value={editingProject.deliveryYear}
                      onChange={(e) => setEditingProject({ ...editingProject, deliveryYear: e.target.value })}
                      placeholder="Ej: 2024"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 font-medium"
                    />
                  </div>
                </div>

                {/* ========================================================
                    5. APARTADO DE IMÁGENES DE LA CONSTRUCCIÓN (SUBIDA DIRECTA)
                   ======================================================== */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-emerald-700" />
                        <span>Imágenes de la Construcción</span>
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Sube las fotos reales de la obra. Puedes seleccionar cuál será la foto principal (grande) y cuáles formarán la galería.
                      </p>
                    </div>

                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900">
                      {editingProject.gallery?.length || 0} fotos cargadas
                    </span>
                  </div>

                  {/* Input de archivo oculto */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) handleFilesUpload(e.target.files);
                    }}
                    className="hidden"
                  />

                  {/* Zona de Drop & Carga */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                      if (e.dataTransfer.files) handleFilesUpload(e.dataTransfer.files);
                    }}
                    onClick={() => {
                      if (!isUploading) fileInputRef.current?.click();
                    }}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                      isDragOver
                        ? 'border-emerald-600 bg-emerald-50 scale-[1.01]'
                        : 'border-slate-300 hover:border-emerald-500 bg-white hover:bg-emerald-50/30'
                    }`}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2 py-2">
                        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                        <span className="text-xs font-bold text-emerald-800">
                          {uploadProgressText || 'Subiendo y optimizando fotos...'}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-slate-800 block">
                            Haz clic aquí para seleccionar fotos o arrástralas
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            Admite formatos JPG, PNG, WebP (se convierten y optimizan automáticamente)
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Cuadrícula de Fotos Subidas con Gestión de Principal y Borrado */}
                  {editingProject.gallery && editingProject.gallery.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                        Fotos de la Obra (Haz clic en la estrella para definir la foto grande principal)
                      </span>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {editingProject.gallery.map((imgUrl, index) => {
                          const isMain = editingProject.mainImage === imgUrl;
                          return (
                            <div
                              key={index}
                              className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 bg-slate-900 group shadow-xs transition-all ${
                                isMain
                                  ? 'border-[#22A33D] ring-2 ring-emerald-500/40 scale-[1.02]'
                                  : 'border-slate-200 hover:border-slate-400'
                              }`}
                            >
                              <Image
                                src={imgUrl}
                                alt={`Foto ${index + 1}`}
                                fill
                                sizes="200px"
                                className="object-cover"
                                referrerPolicy="no-referrer"
                              />

                              {/* Degradado sobre la imagen al hover */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                              {/* Badge Superior: Principal o Botón para hacer principal */}
                              <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                                {isMain ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#22A33D] text-white text-[10px] font-bold shadow-md">
                                    <Star className="w-3 h-3 fill-white" />
                                    <span>Principal</span>
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleSetMainImage(imgUrl)}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 hover:bg-[#22A33D] text-white text-[10px] font-semibold transition-all cursor-pointer backdrop-blur-xs shadow-xs"
                                    title="Marcar como imagen principal grande"
                                  >
                                    <Star className="w-3 h-3" />
                                    <span>Hacer Principal</span>
                                  </button>
                                )}

                                {/* Botón Eliminar Foto */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(imgUrl)}
                                  className="p-1 rounded-md bg-black/70 hover:bg-red-600 text-white transition-all cursor-pointer backdrop-blur-xs"
                                  title="Eliminar esta foto"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Indicador de orden abajo */}
                              <div className="absolute bottom-1.5 left-2 text-[10px] font-semibold text-white/90 drop-shadow-sm">
                                #{index + 1}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <p className="text-[11px] text-slate-500 pt-1 leading-snug">
                        💡 La foto con el badge <strong className="text-emerald-700">"Principal"</strong> se mostrará en tamaño grande a la izquierda, y las demás aparecerán en las miniaturas interactivas de abajo.
                      </p>
                    </div>
                  )}
                </div>

                {/* 6. Descripción */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Descripción Arquitectónica
                  </label>
                  <textarea
                    rows={2}
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    placeholder="Detalles sobre el diseño, iluminación, estilo y funcionalidad..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs sm:text-sm font-medium"
                  />
                </div>

                {/* 7. Acabados y Características */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Características & Acabados de Primera (1 por línea)
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.features.join('\n')}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        features: e.target.value.split('\n').map((f) => f.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Pisos de porcelanato rectificado&#10;Mesones de cuarzo en cocina&#10;Grifería de alta gama"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-xs sm:text-sm font-medium"
                  />
                </div>
              </div>

              {/* Pie del Modal */}
              <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProject(null);
                    setIsCreating(false);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isLoading || isUploading}
                  className="px-6 py-2.5 rounded-xl bg-[#22A33D] hover:bg-[#1b8532] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isCreating ? 'Guardar Obra' : 'Actualizar Cambios'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: CONFIRMACIÓN DE ELIMINACIÓN
          ======================================================== */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 max-w-md w-full animate-in fade-in duration-200 text-left">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              ¿Eliminar "{projectToDelete.name}"?
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Esta acción eliminará el proyecto tanto del panel administrativo como del apartado público de <strong>Nuestras Construcciones</strong> de forma sincronizada e inmediata.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Sí, eliminar de construcciones</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
