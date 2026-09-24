'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Plus,
  Search,
  RotateCcw,
  Edit2,
  Trash2,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Building,
  TrendingUp,
  Tag,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Smartphone,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { useProperties } from '@/src/context/PropertyContext';
import { AdminPropertyModal } from './AdminPropertyModal';
import type { LotProperty } from '@/src/data/lots';
import { getLotWhatsAppUrl } from '@/src/data/lots';
import { WhatsAppIcon } from '../SocialIcons';

interface AdminDashboardProps {
  onLogout: () => void;
  onViewCatalog: () => void;
  onSelectLotPreview?: (lot: LotProperty) => void;
}

export function AdminDashboard({
  onLogout,
  onViewCatalog,
  onSelectLotPreview,
}: AdminDashboardProps) {
  const {
    properties,
    metrics,
    addProperty,
    updateProperty,
    deleteProperty,
    toggleStatus,
    setStatus,
    resetToDefaults,
  } = useProperties();

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [filterType, setFilterType] = useState<string>('Todos');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<LotProperty | null>(null);

  // Delete confirmation modal state
  const [propertyToDelete, setPropertyToDelete] = useState<LotProperty | null>(null);

  // Reset confirmation modal state
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Filtered properties
  const filtered = properties.filter((p) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.code.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.zone.toLowerCase().includes(q) ||
      p.project.toLowerCase().includes(q);

    const matchesStatus = filterStatus === 'Todos' || p.status === filterStatus;
    const matchesType = filterType === 'Todos' || p.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleOpenCreate = () => {
    setPropertyToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lot: LotProperty) => {
    setPropertyToEdit(lot);
    setIsModalOpen(true);
  };

  const handleSaveProperty = (data: Omit<LotProperty, 'id'>, id?: string) => {
    if (id) {
      updateProperty(id, data);
    } else {
      addProperty(data);
    }
  };

  const confirmDelete = () => {
    if (propertyToDelete) {
      deleteProperty(propertyToDelete.id);
      setPropertyToDelete(null);
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Top Admin Header Bar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                PANEL DE ADMINISTRACIÓN · EDICIÓN DE CATÁLOGO
              </span>
              <span className="text-xs text-slate-500">Sociedad Civil MGM Inmobiliaria</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Edición y Gestión del Catálogo
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Portal informativo: edita precios, metrajes, descripciones, fotos y estado de disponibilidad de los lotes y villas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onViewCatalog}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Eye className="h-3.5 w-3.5 text-emerald-700" />
              <span>Ver Web Pública</span>
            </button>

            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Nueva Propiedad</span>
            </button>

            <button
              onClick={onLogout}
              title="Cerrar sesión de administrador"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </section>

      {/* Real-time Metric Counter Cards (Unboxed Canvas) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Inmuebles
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 mt-1 block">
              {metrics.totalCount}
            </span>
            <span className="text-[11px] text-slate-500">En catálogo activo</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
              Disponibles
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-900 mt-1 block">
              {metrics.availableCount}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold">Listos para venta</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
              En Reserva
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-900 mt-1 block">
              {metrics.reservedCount}
            </span>
            <span className="text-[11px] text-amber-700 font-semibold">Proceso notarial</span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 shadow-2xs">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
              Vendidos
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-rose-900 mt-1 block">
              {metrics.soldCount}
            </span>
            <span className="text-[11px] text-rose-700 font-semibold">Escriturados</span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-slate-950 text-white shadow-md">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Valor Activo
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-white mt-1 block truncate">
              ${(metrics.totalActiveValueUSD / 1000).toFixed(0)}k <span className="text-xs text-slate-400 font-normal">USD</span>
            </span>
            <span className="text-[11px] text-emerald-400">Disp. + Reservas</span>
          </div>
        </div>
      </section>

      {/* Control Bar: Search & Quick Filters */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por código (MV-101), sector o título..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Status Selector Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-xs font-bold text-slate-400 uppercase shrink-0 mr-1">
                Estado:
              </span>
              {(['Todos', 'Disponible', 'En Reserva', 'Vendido'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    filterStatus === st
                      ? st === 'Disponible'
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : st === 'En Reserva'
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : st === 'Vendido'
                        ? 'bg-rose-700 text-white shadow-2xs'
                        : 'bg-slate-950 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-bar: Type selector & Total Count */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="font-semibold text-slate-600">Tipo:</span>
              {(['Todos', 'Lote de Terreno', 'Vivienda', 'Proyecto en Planos'] as const).map((tp) => (
                <button
                  key={tp}
                  onClick={() => setFilterType(tp)}
                  className={`px-2 py-0.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                    filterType === tp
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tp === 'Lote de Terreno' ? 'Lotes' : tp === 'Proyecto en Planos' ? 'Planos' : tp}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span>
                Mostrando <strong>{filtered.length}</strong> de {properties.length} propiedades
              </span>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors"
                title="Restaurar a datos originales de fábrica"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Restaurar BD</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Property List / Grid (Ergonomic for both Mobile & Desktop) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {filtered.map((lot) => {
            const isAvailable = lot.status === 'Disponible';
            const isReserved = lot.status === 'En Reserva';
            const isSold = lot.status === 'Vendido';

            return (
              <div
                key={lot.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Visual Thumbnail & Basic Specs */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative h-18 w-24 sm:h-20 sm:w-28 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                    <Image
                      src={lot.image}
                      alt={lot.name}
                      fill
                      sizes="120px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-1 left-1 text-[9px] font-mono font-bold bg-black/70 text-white px-1.5 py-0.5 rounded">
                      {lot.code}
                    </span>
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-slate-500">
                        {lot.project}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[11px] text-slate-500">{lot.type}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      {lot.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <span className="font-mono font-bold text-slate-900">
                        {lot.areaM2} m²
                      </span>
                      <span>·</span>
                      <span className="font-mono">{lot.dimensions}</span>
                      <span>·</span>
                      <span className="truncate max-w-[180px] text-slate-500">{lot.zone}</span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Commercial Values */}
                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Precio de Venta
                    </span>
                    <span className="text-lg sm:text-xl font-black font-mono text-slate-900 block">
                      ${lot.priceUSD.toLocaleString()}{' '}
                      <span className="text-xs font-normal text-slate-400">USD</span>
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold block">
                      Entrada ~${lot.minDownPaymentUSD.toLocaleString()}
                    </span>
                  </div>

                  {/* ONE-TOUCH STATUS TOGGLE BUTTON (Kindev Signature) */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Estado (1-Toque)
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleStatus(lot.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-black tracking-wide transition-all active:scale-90 shadow-2xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                        isAvailable
                          ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                          : isReserved
                          ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                          : 'bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300'
                      }`}
                      title="Haz clic para alternar entre Disponible -> En Reserva -> Vendido"
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isAvailable
                            ? 'bg-emerald-600'
                            : isReserved
                            ? 'bg-amber-600'
                            : 'bg-rose-600'
                        }`}
                      />
                      <span>{lot.status}</span>
                      <span className="text-[9px] opacity-70 font-normal ml-0.5">↻</span>
                    </button>
                  </div>

                  {/* Operations Toolbar */}
                  <div className="flex items-center gap-1.5">
                    {/* Direct WhatsApp test link */}
                    <a
                      href={getLotWhatsAppUrl(lot.code, lot.name, lot.priceUSD)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-9 w-9 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-slate-950 flex items-center justify-center transition-all cursor-pointer"
                      title="Ver mensaje de WhatsApp precargado"
                    >
                      <WhatsAppIcon size={16} />
                    </a>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleOpenEdit(lot)}
                      className="h-9 w-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer"
                      title="Editar características o precio"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => setPropertyToDelete(lot)}
                      className="h-9 w-9 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center justify-center transition-all cursor-pointer"
                      title="Eliminar propiedad"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <Search className="h-10 w-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">
                No hay propiedades que coincidan con la búsqueda
              </h3>
              <p className="text-xs text-slate-400">
                Prueba buscando por otro término o restablece los filtros.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setFilterStatus('Todos');
                  setFilterType('Todos');
                }}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Limpiar Filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Edit / Create Modal */}
      <AdminPropertyModal
        key={propertyToEdit?.id || (isModalOpen ? 'open-new' : 'closed')}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPropertyToEdit(null);
        }}
        onSave={handleSaveProperty}
        propertyToEdit={propertyToEdit}
      />

      {/* Delete Confirmation Modal */}
      {propertyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="h-12 w-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900">¿Eliminar Propiedad?</h3>
              <p className="text-xs text-slate-500">
                Estás a punto de eliminar permanentemente el lote{' '}
                <strong className="text-slate-900">{propertyToDelete.code}</strong> (
                {propertyToDelete.name}). Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setPropertyToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900">¿Restaurar Catálogo Oficial?</h3>
              <p className="text-xs text-slate-500">
                Esto reemplazará los cambios actuales y restaurará el inventario oficial predeterminado de Ciudadela Miravalle.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  resetToDefaults();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-950 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Restaurar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
