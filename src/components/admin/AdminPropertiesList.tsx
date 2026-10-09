'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Search,
  Plus,
  SlidersHorizontal,
  ArrowUpDown,
  Edit2,
  Trash2,
  ExternalLink,
  MapPin,
  Building,
  CheckCircle2,
  Clock,
  Tag,
  AlertCircle,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import type { LotProperty } from '@/src/data/lots';
import { useProperties } from '@/src/context/PropertyContext';

interface AdminPropertiesListProps {
  properties?: LotProperty[];
  onOpenCreate: () => void;
  onOpenEdit: (lot: LotProperty) => void;
  onDelete?: (lot: LotProperty) => void;
  onToggleStatus?: (id: string) => void;
  onSetStatus?: (id: string, status: LotProperty['status']) => void;
  onSelectLotPreview?: (lot: LotProperty) => void;
}

export function AdminPropertiesList({
  properties: propList,
  onOpenCreate,
  onOpenEdit,
  onDelete: propDelete,
  onToggleStatus: propToggleStatus,
  onSetStatus: propSetStatus,
  onSelectLotPreview,
}: AdminPropertiesListProps) {
  const propertyContext = useProperties();
  const properties = propList || propertyContext.properties;
  const onDelete = propDelete || ((lot: LotProperty) => propertyContext.deleteProperty(lot.id));
  const onToggleStatus = propToggleStatus || propertyContext.toggleStatus;
  const onSetStatus = propSetStatus || propertyContext.setStatus;
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [filterType, setFilterType] = useState<string>('Todos');
  const [sortBy, setSortBy] = useState<'date-desc' | 'price-asc' | 'price-desc' | 'code-asc'>('date-desc');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredAndSorted = useMemo(() => {
    let result = properties.filter((p) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.code.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.zone.toLowerCase().includes(q) ||
        (p.address && p.address.toLowerCase().includes(q)) ||
        p.project.toLowerCase().includes(q);

      const matchesStatus =
        filterStatus === 'Todos' ||
        (filterStatus === 'Disponible' && p.status === 'Disponible') ||
        (filterStatus === 'Reservada' && (p.status === 'En Reserva' || (p.status as string) === 'Reservada')) ||
        (filterStatus === 'Vendida' && (p.status === 'Vendido' || (p.status as string) === 'Vendida')) ||
        (filterStatus === 'Inactiva' && p.status === 'Inactiva');

      const matchesType = filterType === 'Todos' || p.type === filterType;

      return matchesSearch && matchesStatus && matchesType;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceUSD - b.priceUSD;
      if (sortBy === 'price-desc') return b.priceUSD - a.priceUSD;
      if (sortBy === 'code-asc') return a.code.localeCompare(b.code);
      // default: date-desc (using createdAt or fallback to code reverse)
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (dateA !== dateB) return dateB - dateA;
      return b.code.localeCompare(a.code);
    });

    return result;
  }, [properties, search, filterStatus, filterType, sortBy]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: LotProperty['status']) => {
    switch (status) {
      case 'Disponible':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Disponible
          </span>
        );
      case 'En Reserva':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            Reservada
          </span>
        );
      case 'Vendido':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            Vendida
          </span>
        );
      case 'Inactiva':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            Inactiva
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header con Título y BOTÓN PRINCIPAL DESTACADO NUEVA PROPIEDAD */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Catálogo de Propiedades</span>
            <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
              {filteredAndSorted.length}/{properties.length}
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Gestión completa de inmuebles, estado comercial, características y documentación técnica.
          </p>
        </div>
      </div>

      {/* Barra de Filtros, Búsqueda y Ordenamiento */}
      <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Buscador */}
          <div className="md:col-span-5 relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por código, nombre, sector o proyecto..."
              className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none shadow-2xs"
            />
          </div>

          {/* Filtro por Estado */}
          <div className="md:col-span-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none shadow-2xs"
            >
              <option value="Todos">Todos los Estados</option>
              <option value="Disponible">Disponibles</option>
              <option value="Reservada">Reservadas</option>
              <option value="Vendida">Vendidas</option>
              <option value="Inactiva">Inactivas</option>
            </select>
          </div>

          {/* Filtro por Tipo */}
          <div className="md:col-span-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none shadow-2xs"
            >
              <option value="Todos">Todos los Tipos</option>
              <option value="Lote de Terreno">Terrenos / Lotes</option>
              <option value="Vivienda">Viviendas / Casas</option>
              <option value="Proyecto en Planos">En Planos</option>
            </select>
          </div>

          {/* Ordenar por */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none shadow-2xs"
            >
              <option value="date-desc">Más Recientes</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="code-asc">Código (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listado / Tabla de Propiedades */}
      {filteredAndSorted.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-50 border border-dashed border-slate-300 space-y-3">
          <Building className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No se encontraron propiedades</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Intenta cambiar los términos de búsqueda o los filtros seleccionados.
          </p>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-400 uppercase font-black text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Foto / Código</th>
                  <th className="py-3 px-4">Propiedad & Ubicación</th>
                  <th className="py-3 px-4">Tipo & Área</th>
                  <th className="py-3 px-4">Precio & Finanzas</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Registro</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAndSorted.map((p) => {
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Foto Principal + Código */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-11 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            {p.image ? (
                              <Image
                                src={p.image}
                                alt={p.name}
                                fill
                                sizes="56px"
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Building className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(p.code)}
                              className="font-mono font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                              title="Copiar código"
                            >
                              <span>{p.code}</span>
                              {copiedId === p.code ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3 text-slate-300 opacity-0 group-hover:opacity-100" />
                              )}
                            </button>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[90px]">
                              {p.project}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Nombre y Ubicación */}
                      <td className="py-3.5 px-4 max-w-[240px]">
                        <div className="font-bold text-slate-900 truncate" title={p.name}>
                          {p.name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate mt-0.5" title={p.zone}>
                          <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                          <span className="truncate">{p.zone}</span>
                        </div>
                        {p.address && (
                          <div className="text-[10px] text-slate-400 italic truncate mt-0.5">
                            {p.address}
                          </div>
                        )}
                      </td>

                      {/* Tipo e Inmueble */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{p.type}</div>
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                          {p.areaM2} m² · <span className="text-slate-400">{p.dimensions}</span>
                        </div>
                      </td>

                      {/* Precio */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-black text-slate-900 text-sm">
                          ${p.priceUSD.toLocaleString()} USD
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Entrada: ${p.minDownPaymentUSD.toLocaleString()} (~${p.estimatedMonthlyUSD}/m)
                        </div>
                      </td>

                      {/* Estado con Selector Rápido */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onToggleStatus(p.id)}
                            className="cursor-pointer"
                            title="Haz clic para alternar estado"
                          >
                            {getStatusBadge(p.status)}
                          </button>
                        </div>
                      </td>

                      {/* Fecha de Registro / Publicación */}
                      <td className="py-3.5 px-4 text-[11px] text-slate-500 font-mono whitespace-nowrap">
                        {p.createdAt
                          ? new Date(p.createdAt).toLocaleDateString('es-EC', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })
                          : 'Activo'}
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenEdit(p)}
                            className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 transition-all cursor-pointer"
                            title="Editar propiedad"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(p)}
                            className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer"
                            title="Eliminar propiedad"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
