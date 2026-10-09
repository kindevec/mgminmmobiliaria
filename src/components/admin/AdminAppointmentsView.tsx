'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  User,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit2,
  Trash2,
  Search,
  Filter,
  X,
  Save,
  MapPin,
  Check,
} from 'lucide-react';
import { useAdminData } from '@/src/context/AdminDataContext';
import { useProperties } from '@/src/context/PropertyContext';
import { Appointment } from '@/src/data/adminTypes';

export function AdminAppointmentsView() {
  const { appointments, addAppointment, updateAppointment, deleteAppointment, markAppointmentStatus, clients } =
    useAdminData();
  const { properties } = useProperties();

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null);

  // Form Fields
  const [clientId, setClientId] = useState('');
  const [clientName, setClientName] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<Appointment['status']>('Pendiente');

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((a) => {
        const q = search.toLowerCase().trim();
        const matchesSearch =
          !q ||
          a.clientName.toLowerCase().includes(q) ||
          a.propertyTitle.toLowerCase().includes(q) ||
          (a.notes && a.notes.toLowerCase().includes(q));

        const matchesStatus = filterStatus === 'Todos' || a.status === filterStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  }, [appointments, search, filterStatus]);

  // Agrupado por fecha para la vista estilo Agenda / Calendario
  const groupedByDate = useMemo(() => {
    const groups: Record<string, Appointment[]> = {};
    for (const app of filteredAppointments) {
      if (!groups[app.date]) groups[app.date] = [];
      groups[app.date].push(app);
    }
    return groups;
  }, [filteredAppointments]);

  const handleOpenCreate = () => {
    setAppointmentToEdit(null);
    setClientId(clients[0]?.id || '');
    setClientName(clients[0]?.name || '');
    setPropertyId(properties[0]?.id || '');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('10:30');
    setNotes('');
    setStatus('Pendiente');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (app: Appointment) => {
    setAppointmentToEdit(app);
    setClientId(app.clientId);
    setClientName(app.clientName);
    setPropertyId(app.propertyId);
    setDate(app.date);
    setTime(app.time);
    setNotes(app.notes || '');
    setStatus(app.status);
    setIsModalOpen(true);
  };

  const handleClientSelectChange = (id: string) => {
    setClientId(id);
    const found = clients.find((c) => c.id === id);
    if (found) setClientName(found.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedProp = properties.find((p) => p.id === propertyId);
    const propTitle = selectedProp ? `${selectedProp.code} - ${selectedProp.name}` : 'Inmueble MGM';
    const foundClient = clients.find((c) => c.id === clientId);
    const finalClientName = clientName.trim() || foundClient?.name || 'Cliente Interesado';

    if (appointmentToEdit) {
      updateAppointment(appointmentToEdit.id, {
        clientId,
        clientName: finalClientName,
        clientPhone: foundClient?.phone,
        propertyId,
        propertyTitle: propTitle,
        date,
        time,
        notes: notes.trim(),
        status,
      });
    } else {
      addAppointment({
        clientId,
        clientName: finalClientName,
        clientPhone: foundClient?.phone,
        propertyId,
        propertyTitle: propTitle,
        date,
        time,
        notes: notes.trim(),
        status,
      });
    }

    setIsModalOpen(false);
  };

  const getStatusBadge = (st: Appointment['status']) => {
    switch (st) {
      case 'Confirmada':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Confirmada</span>;
      case 'Pendiente':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Pendiente</span>;
      case 'Realizada':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Realizada</span>;
      case 'Cancelada':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">Cancelada</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">{st}</span>;
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Citas & Visitas de Terreno</span>
            <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              {filteredAppointments.length} agendadas
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Agenda de recorridos presenciales, inspecciones y citas notariales con clientes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Switch de Vistas */}
          <div className="p-1 rounded-2xl bg-slate-100 border border-slate-200/80 flex items-center text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-slate-950 shadow-xs' : 'hover:text-slate-950'
              }`}
            >
              Lista
            </button>
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === 'calendar' ? 'bg-white text-slate-950 shadow-xs' : 'hover:text-slate-950'
              }`}
            >
              Calendario
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Agendar Cita</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente o propiedad..."
            className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
          >
            <option value="Todos">Todos los Estados</option>
            <option value="Pendiente">Pendientes</option>
            <option value="Confirmada">Confirmadas</option>
            <option value="Realizada">Realizadas</option>
            <option value="Cancelada">Canceladas</option>
          </select>
        </div>
      </div>

      {/* Vista Lista */}
      {viewMode === 'list' && (
        <>
          {filteredAppointments.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-50 border border-dashed border-slate-300 space-y-2">
              <CalendarIcon className="h-8 w-8 text-slate-300 mx-auto" />
              <h3 className="text-xs font-bold text-slate-700">No se encontraron citas agendadas</h3>
              <p className="text-[11px] text-slate-400">Puedes programar una cita con el botón superior.</p>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Fecha & Hora</th>
                      <th className="py-3 px-4">Cliente</th>
                      <th className="py-3 px-4">Propiedad a Visitar</th>
                      <th className="py-3 px-4">Observaciones</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4 text-right">Acciones Rápidas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAppointments.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Fecha y Hora */}
                        <td className="py-3.5 px-4 font-mono">
                          <div className="font-bold text-slate-900">{app.date}</div>
                          <div className="text-[11px] font-bold text-emerald-700">{app.time} hrs</div>
                        </td>

                        {/* Cliente */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{app.clientName}</div>
                          {app.clientPhone && (
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{app.clientPhone}</div>
                          )}
                        </td>

                        {/* Propiedad */}
                        <td className="py-3.5 px-4 max-w-[240px]">
                          <span className="font-bold text-emerald-800 line-clamp-1" title={app.propertyTitle}>
                            {app.propertyTitle}
                          </span>
                        </td>

                        {/* Observaciones */}
                        <td className="py-3.5 px-4 max-w-[200px]">
                          <span className="text-[11px] text-slate-500 line-clamp-1">{app.notes || '—'}</span>
                        </td>

                        {/* Estado */}
                        <td className="py-3.5 px-4">
                          {getStatusBadge(app.status)}
                        </td>

                        {/* Acciones */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {app.status === 'Pendiente' && (
                              <button
                                type="button"
                                onClick={() => markAppointmentStatus(app.id, 'Confirmada')}
                                className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[10px] transition-all cursor-pointer"
                                title="Marcar como confirmada"
                              >
                                Confirmar
                              </button>
                            )}
                            {app.status !== 'Realizada' && app.status !== 'Cancelada' && (
                              <button
                                type="button"
                                onClick={() => markAppointmentStatus(app.id, 'Realizada')}
                                className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[10px] transition-all cursor-pointer"
                                title="Marcar como realizada"
                              >
                                Realizada
                              </button>
                            )}
                            {app.status !== 'Cancelada' && app.status !== 'Realizada' && (
                              <button
                                type="button"
                                onClick={() => markAppointmentStatus(app.id, 'Cancelada')}
                                className="px-2 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-bold text-[10px] transition-all cursor-pointer"
                                title="Cancelar cita"
                              >
                                Cancelar
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(app)}
                              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                              title="Editar cita"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm('¿Eliminar esta cita?')) deleteAppointment(app.id);
                              }}
                              className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                              title="Eliminar cita"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Vista Calendario / Timeline Agrupado por Día */}
      {viewMode === 'calendar' && (
        <div className="space-y-4">
          {Object.keys(groupedByDate).length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-50 border border-dashed border-slate-300 text-xs text-slate-400">
              No hay citas programadas para las fechas filtradas.
            </div>
          ) : (
            Object.entries(groupedByDate).map(([dayDate, dayApps]) => (
              <div key={dayDate} className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <CalendarIcon className="h-4 w-4 text-emerald-700" />
                  <span className="font-mono font-black text-slate-900 text-sm">{dayDate}</span>
                  <span className="text-[11px] font-bold text-slate-400 font-mono">
                    ({dayApps.length} {dayApps.length === 1 ? 'cita' : 'citas'})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {dayApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-emerald-50/20 hover:border-emerald-300 transition-all space-y-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-emerald-800 text-sm flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{app.time}</span>
                        </span>
                        {getStatusBadge(app.status)}
                      </div>

                      <div>
                        <div className="font-bold text-slate-900">{app.clientName}</div>
                        <div className="text-[11px] text-emerald-900 font-medium truncate mt-0.5">
                          {app.propertyTitle}
                        </div>
                      </div>

                      {app.notes && (
                        <p className="text-[11px] text-slate-500 italic line-clamp-2 bg-white/70 p-2 rounded-xl border border-slate-100">
                          {app.notes}
                        </p>
                      )}

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {app.status === 'Pendiente' && (
                            <button
                              type="button"
                              onClick={() => markAppointmentStatus(app.id, 'Confirmada')}
                              className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] cursor-pointer"
                            >
                              Confirmar
                            </button>
                          )}
                          {app.status === 'Confirmada' && (
                            <button
                              type="button"
                              onClick={() => markAppointmentStatus(app.id, 'Realizada')}
                              className="px-2 py-1 rounded-md bg-blue-100 text-blue-800 font-bold text-[10px] cursor-pointer"
                            >
                              Realizada
                            </button>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(app)}
                          className="text-[11px] font-bold text-slate-500 hover:text-emerald-700 cursor-pointer"
                        >
                          Editar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal Crear / Editar Cita */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  {appointmentToEdit ? 'Modificar Cita de Visita' : 'Agendar Nueva Visita de Terreno'}
                </h2>
                <p className="text-xs text-slate-400">
                  Coordina fecha, hora y cliente interesado con la propiedad en cartera.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              {/* Selector de Cliente */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Cliente / Interesado *</label>
                {clients.length > 0 ? (
                  <select
                    value={clientId}
                    onChange={(e) => handleClientSelectChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 bg-white font-semibold focus:border-emerald-600 focus:outline-none"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nombre del cliente interesado"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                )}
              </div>

              {/* Selector de Propiedad */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Propiedad a Visitar *</label>
                <select
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 bg-white font-semibold focus:border-emerald-600 focus:outline-none"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.name} ({p.project})
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha y Hora */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fecha de la Visita *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hora de la Cita *</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Estado */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Estado de la Cita</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Appointment['status'])}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 bg-white font-semibold focus:border-emerald-600 focus:outline-none"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Realizada">Realizada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>

              {/* Observaciones */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Observaciones / Lugar de Encuentro</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Encuentro en garita de entrada para recorrido por manzana 4..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>Guardar Cita</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
