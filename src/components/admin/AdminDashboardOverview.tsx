'use client';

import React from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  Calendar,
  Users,
  FileCheck,
  FileText,
  ArrowUpRight,
  Plus,
  ArrowRight,
  ShieldCheck,
  Tag,
  AlertCircle,
  BarChart3,
} from 'lucide-react';
import { useProperties } from '@/src/context/PropertyContext';
import { useAdminData } from '@/src/context/AdminDataContext';
import type { LotProperty } from '@/src/data/lots';

interface AdminDashboardOverviewProps {
  onNavigateTab: (tab: any) => void;
  onOpenCreateProperty: () => void;
}

export function AdminDashboardOverview({
  onNavigateTab,
  onOpenCreateProperty,
}: AdminDashboardOverviewProps) {
  const { properties, metrics } = useProperties();
  const { clients, appointments, activityLogs, legalFiles, markAppointmentStatus } = useAdminData();

  // Próximas citas (ordenadas por fecha y hora ascendente)
  const upcomingAppointments = React.useMemo(() => {
    return [...appointments]
      .filter((a) => a.status !== 'Cancelada')
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
      .slice(0, 5);
  }, [appointments]);

  // Expedientes con documentos pendientes
  const pendingLegalCount = React.useMemo(() => {
    return legalFiles.filter((f) => f.status !== 'Completo').length;
  }, [legalFiles]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Panel de Control Inmobiliario · MGM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Resumen General del Negocio
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Supervisa el inventario de lotes y viviendas, clientes interesados, visitas en agenda y el estado jurídico de los expedientes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenCreateProperty}
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-linear-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Publicar Inmueble</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('reports')}
              className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <BarChart3 className="h-4 w-4 text-emerald-300" />
              <span>Reportes</span>
            </button>
          </div>
        </div>

        {/* Decorative background glows */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Botón de Acceso Rápido Móvil (Reportes) */}
      <div className="sm:hidden">
        <button
          type="button"
          onClick={() => onNavigateTab('reports')}
          className="w-full p-3.5 rounded-2xl bg-white border border-emerald-200/90 shadow-xs hover:shadow-md transition-all flex items-center justify-between text-left active:scale-98 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <span className="font-black text-xs text-slate-900 block">Reportes del Negocio</span>
              <span className="text-[10px] text-emerald-700 font-semibold block">Métricas de cartera, ventas y actividad</span>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-emerald-700 shrink-0" />
        </button>
      </div>

      {/* 4 Métricas Principales de Propiedades */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Propiedades */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Building2 className="h-5 w-5" />
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Propiedades
          </span>
          <span className="text-3xl font-black font-mono text-slate-900 mt-1 block">
            {properties.length}
          </span>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Valor cartera: <span className="font-bold text-slate-700 font-mono">${(metrics.totalInventoryValueUSD / 1000).toFixed(0)}k USD</span>
          </div>
        </div>

        {/* Disponibles */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="p-5 rounded-3xl bg-white border border-emerald-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              Listas
            </span>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
            Disponibles
          </span>
          <span className="text-3xl font-black font-mono text-emerald-950 mt-1 block">
            {metrics.availableCount}
          </span>
          <div className="mt-2 text-[11px] text-emerald-700 font-semibold font-mono">
            ${(metrics.totalActiveValueUSD / 1000).toFixed(0)}k USD listos para venta
          </div>
        </div>

        {/* En Reserva */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="p-5 rounded-3xl bg-white border border-amber-200/80 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="h-5 w-5" />
            </div>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
              En trámite
            </span>
          </div>
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
            En Reserva
          </span>
          <span className="text-3xl font-black font-mono text-amber-950 mt-1 block">
            {metrics.reservedCount}
          </span>
          <div className="mt-2 text-[11px] text-amber-700 font-medium">
            Proceso de promesa / notaría
          </div>
        </div>

        {/* Vendidas */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="p-5 rounded-3xl bg-white border border-slate-800/20 shadow-xs hover:border-slate-800/40 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <Tag className="h-5 w-5" />
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-full">
              Escrituradas
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
            Propiedades Vendidas
          </span>
          <span className="text-3xl font-black font-mono text-slate-900 mt-1 block">
            {metrics.soldCount}
          </span>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            {properties.length > 0 ? Math.round((metrics.soldCount / properties.length) * 100) : 0}% efectividad comercial
          </div>
        </div>
      </div>

      {/* Grid Principal: Próximas Citas + Actividad Reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Próximas Citas (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">Próximas Citas y Visitas</h2>
                <p className="text-[11px] text-slate-400">Recorridos presenciales y asesorías agendadas</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('appointments')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todas</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 text-xs">
              No hay citas pendientes agendadas en este momento.
            </div>
          ) : (
            <div className="space-y-2.5">
              {upcomingAppointments.map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{app.clientName}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          app.status === 'Confirmada'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'Realizada'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2">
                      <span className="font-bold text-emerald-800 truncate max-w-[220px]">
                        {app.propertyTitle}
                      </span>
                    </div>
                    {app.notes && (
                      <p className="text-[11px] text-slate-400 italic line-clamp-1">{app.notes}</p>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-800">{app.date}</div>
                      <div className="text-[11px] font-mono font-bold text-emerald-700">{app.time} hrs</div>
                    </div>
                    {app.status === 'Pendiente' && (
                      <button
                        type="button"
                        onClick={() => markAppointmentStatus(app.id, 'Confirmada')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[10px] transition-all cursor-pointer"
                      >
                        Confirmar
                      </button>
                    )}
                    {app.status === 'Confirmada' && (
                      <button
                        type="button"
                        onClick={() => markAppointmentStatus(app.id, 'Realizada')}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[10px] transition-all cursor-pointer"
                      >
                        Completar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Columna Derecha: Actividad Reciente + Alerta de Expedientes (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Alerta de Expedientes Incompletos si existen */}
          {pendingLegalCount > 0 && (
            <div
              onClick={() => onNavigateTab('legalFiles')}
              className="p-4 rounded-3xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3 cursor-pointer hover:bg-amber-100/60 transition-all shadow-xs"
            >
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <span className="font-black block text-amber-900">
                  {pendingLegalCount} expedientes legales requieren atención
                </span>
                <span className="text-[11px] text-amber-800 leading-tight block mt-0.5">
                  Hay propiedades con escrituras o certificados pendientes de validación.
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-amber-700 shrink-0 self-center" />
            </div>
          )}

          {/* Registro de Actividad Reciente */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900">Actividad Reciente</h2>
                  <p className="text-[11px] text-slate-400">Últimos movimientos registrados</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {activityLogs.slice(0, 5).map((log) => {
                const getBadge = () => {
                  switch (log.type) {
                    case 'property':
                      return <Building2 className="h-3.5 w-3.5 text-emerald-700" />;
                    case 'client':
                      return <Users className="h-3.5 w-3.5 text-blue-700" />;
                    case 'appointment':
                      return <Calendar className="h-3.5 w-3.5 text-purple-700" />;
                    case 'legal':
                      return <FileCheck className="h-3.5 w-3.5 text-amber-700" />;
                    case 'document':
                      return <FileText className="h-3.5 w-3.5 text-teal-700" />;
                    default:
                      return <Clock className="h-3.5 w-3.5 text-slate-500" />;
                  }
                };

                return (
                  <div key={log.id} className="flex items-start gap-3 text-xs">
                    <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                      {getBadge()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-800 truncate">{log.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{log.description}</div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {new Date(log.timestamp).toLocaleDateString('es-EC', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
