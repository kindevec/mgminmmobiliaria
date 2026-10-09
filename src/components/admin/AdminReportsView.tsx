'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  Tag,
  FileText,
  Filter,
} from 'lucide-react';
import { useProperties } from '@/src/context/PropertyContext';
import { useAdminData } from '@/src/context/AdminDataContext';

export function AdminReportsView() {
  const { properties, metrics } = useProperties();
  const { clients, appointments, documents, activityLogs } = useAdminData();

  const [period, setPeriod] = useState<'all' | '30days' | '90days'>('all');
  const [filterType, setFilterType] = useState<string>('Todos');

  // Filtrado de propiedades para el reporte
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (filterType !== 'Todos' && p.type !== filterType) return false;
      return true;
    });
  }, [properties, filterType]);

  // Distribución por estado
  const statusStats = useMemo(() => {
    let disponibles = 0;
    let reservadas = 0;
    let vendidas = 0;
    let inactivas = 0;

    for (const p of filteredProperties) {
      if (p.status === 'Disponible') disponibles++;
      else if (p.status === 'En Reserva' || (p.status as string) === 'Reservada') reservadas++;
      else if (p.status === 'Vendido' || (p.status as string) === 'Vendida') vendidas++;
      else if (p.status === 'Inactiva') inactivas++;
    }

    const total = filteredProperties.length || 1;
    return {
      disponibles,
      reservadas,
      vendidas,
      inactivas,
      pDisp: Math.round((disponibles / total) * 100),
      pRes: Math.round((reservadas / total) * 100),
      pVen: Math.round((vendidas / total) * 100),
      pInac: Math.round((inactivas / total) * 100),
    };
  }, [filteredProperties]);

  // Métricas de actividad
  const activityMetrics = useMemo(() => {
    const realizadas = appointments.filter((a) => a.status === 'Realizada').length;
    const canceladas = appointments.filter((a) => a.status === 'Cancelada').length;

    return {
      totalProperties: properties.length,
      registeredClients: clients.length,
      appointmentsCompleted: realizadas,
      appointmentsCancelled: canceladas,
      totalDocuments: documents.length,
    };
  }, [properties, clients, appointments, documents]);

  // Exportar reporte de inventario a CSV (Nativo, sin dependencias pesadas)
  const handleExportPropertiesCSV = () => {
    const headers = ['Código', 'Nombre', 'Proyecto', 'Tipo', 'Área m²', 'Precio USD', 'Estado', 'Zona'];
    const rows = filteredProperties.map((p) => [
      `"${p.code}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.project}"`,
      `"${p.type}"`,
      p.areaM2,
      p.priceUSD,
      `"${p.status}"`,
      `"${p.zone.replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_propiedades_mgm_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Reportes & Estadísticas Inmobiliarias</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Métricas de cartera, distribución de estados y resumen operativo para toma de decisiones.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportPropertiesCSV}
          className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>Exportar a CSV</span>
        </button>
      </div>

      {/* Filtros de Reporte */}
      <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Filtros de visualización:</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
          >
            <option value="Todos">Todos los Inmuebles</option>
            <option value="Lote de Terreno">Terrenos / Lotes</option>
            <option value="Vivienda">Viviendas / Casas</option>
            <option value="Proyecto en Planos">En Planos</option>
          </select>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
          >
            <option value="all">Todo el Histórico</option>
            <option value="90days">Últimos 90 días</option>
            <option value="30days">Últimos 30 días</option>
          </select>
        </div>
      </div>

      {/* 1. Reporte de Propiedades: Tarjetas de Estado */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          1. Estado General de Propiedades
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-950">
            <span className="text-[11px] font-bold text-emerald-800 uppercase block">Disponibles</span>
            <span className="text-3xl font-black font-mono mt-1 block">{statusStats.disponibles}</span>
            <span className="text-[11px] text-emerald-700 font-medium">{statusStats.pDisp}% del catálogo</span>
          </div>

          <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 text-amber-950">
            <span className="text-[11px] font-bold text-amber-800 uppercase block">Reservadas</span>
            <span className="text-3xl font-black font-mono mt-1 block">{statusStats.reservadas}</span>
            <span className="text-[11px] text-amber-700 font-medium">{statusStats.pRes}% en trámite</span>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Vendidas</span>
            <span className="text-3xl font-black font-mono mt-1 block">{statusStats.vendidas}</span>
            <span className="text-[11px] text-emerald-400 font-medium">{statusStats.pVen}% cerradas</span>
          </div>

          <div className="p-5 rounded-3xl bg-red-50 border border-red-200 text-red-950">
            <span className="text-[11px] font-bold text-red-800 uppercase block">Inactivas / Pausadas</span>
            <span className="text-3xl font-black font-mono mt-1 block">{statusStats.inactivas}</span>
            <span className="text-[11px] text-red-700 font-medium">{statusStats.pInac}% fuera de venta</span>
          </div>
        </div>
      </div>

      {/* 2. Distribución Visual de Propiedades por Estado */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 space-y-4 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          2. Distribución Porcentual del Portafolio
        </h2>

        {/* Barra de progreso apilada */}
        <div className="w-full h-5 rounded-full overflow-hidden flex bg-slate-100 p-0.5 border border-slate-200">
          {statusStats.pDisp > 0 && (
            <div
              style={{ width: `${statusStats.pDisp}%` }}
              className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
              title={`Disponibles: ${statusStats.pDisp}%`}
            />
          )}
          {statusStats.pRes > 0 && (
            <div
              style={{ width: `${statusStats.pRes}%` }}
              className="h-full bg-amber-500 transition-all duration-500"
              title={`Reservadas: ${statusStats.pRes}%`}
            />
          )}
          {statusStats.pVen > 0 && (
            <div
              style={{ width: `${statusStats.pVen}%` }}
              className="h-full bg-slate-900 transition-all duration-500"
              title={`Vendidas: ${statusStats.pVen}%`}
            />
          )}
          {statusStats.pInac > 0 && (
            <div
              style={{ width: `${statusStats.pInac}%` }}
              className="h-full bg-red-400 rounded-r-full transition-all duration-500"
              title={`Inactivas: ${statusStats.pInac}%`}
            />
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-emerald-500 shrink-0" />
            <span className="text-slate-600">Disponibles ({statusStats.disponibles})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-amber-500 shrink-0" />
            <span className="text-slate-600">Reservadas ({statusStats.reservadas})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-slate-900 shrink-0" />
            <span className="text-slate-600">Vendidas ({statusStats.vendidas})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-red-400 shrink-0" />
            <span className="text-slate-600">Inactivas ({statusStats.inactivas})</span>
          </div>
        </div>
      </div>

      {/* 3. Reporte de Actividad Operativa */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          3. Reporte de Actividad del Negocio
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-white border border-slate-200">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Inmuebles Activos</span>
            <span className="text-xl font-black font-mono text-slate-900 mt-1 block">
              {activityMetrics.totalProperties}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Clientes Registrados</span>
            <span className="text-xl font-black font-mono text-slate-900 mt-1 block">
              {activityMetrics.registeredClients}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Visitas Realizadas</span>
            <span className="text-xl font-black font-mono text-emerald-700 mt-1 block">
              {activityMetrics.appointmentsCompleted}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Visitas Canceladas</span>
            <span className="text-xl font-black font-mono text-red-600 mt-1 block">
              {activityMetrics.appointmentsCancelled}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Documentos Subidos</span>
            <span className="text-xl font-black font-mono text-slate-900 mt-1 block">
              {activityMetrics.totalDocuments}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
