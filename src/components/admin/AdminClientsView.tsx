'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  Edit2,
  Trash2,
  ExternalLink,
  Building2,
  X,
  Save,
  MessageCircle,
} from 'lucide-react';
import { useAdminData } from '@/src/context/AdminDataContext';
import { useProperties } from '@/src/context/PropertyContext';
import { Client } from '@/src/data/adminTypes';

export function AdminClientsView() {
  const { clients, addClient, updateClient, deleteClient } = useAdminData();
  const { properties } = useProperties();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<Client['status']>('Nuevo');

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.notes && c.notes.toLowerCase().includes(q));

      const matchesStatus = filterStatus === 'Todos' || c.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [clients, search, filterStatus]);

  const handleOpenCreate = () => {
    setClientToEdit(null);
    setName('');
    setPhone('');
    setEmail('');
    setSelectedPropertyIds([]);
    setNotes('');
    setStatus('Nuevo');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setClientToEdit(client);
    setName(client.name);
    setPhone(client.phone);
    setEmail(client.email);
    setSelectedPropertyIds(client.interestedPropertyIds || []);
    setNotes(client.notes || '');
    setStatus(client.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const titles = properties
      .filter((p) => selectedPropertyIds.includes(p.id))
      .map((p) => `${p.code} - ${p.name}`);

    if (clientToEdit) {
      updateClient(clientToEdit.id, {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        interestedPropertyIds: selectedPropertyIds,
        interestedPropertyTitles: titles,
        notes: notes.trim(),
        status,
      });
    } else {
      addClient({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        interestedPropertyIds: selectedPropertyIds,
        interestedPropertyTitles: titles,
        notes: notes.trim(),
        status,
      });
    }

    setIsModalOpen(false);
  };

  const togglePropertyInterest = (propId: string) => {
    setSelectedPropertyIds((prev) =>
      prev.includes(propId) ? prev.filter((id) => id !== propId) : [...prev, propId]
    );
  };

  const getStatusBadge = (st: Client['status']) => {
    switch (st) {
      case 'Nuevo':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Nuevo</span>;
      case 'Contactado':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Contactado</span>;
      case 'En negociación':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">En negociación</span>;
      case 'Cerrado':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Cerrado</span>;
      case 'No interesado':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">No interesado</span>;
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
            <span>Clientes & Personas Interesadas</span>
            <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              {filteredClients.length} registrados
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro rápido de compradores potenciales y seguimiento comercial simplificado.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Registrar Interesado</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, teléfono o email..."
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
            <option value="Nuevo">Nuevos</option>
            <option value="Contactado">Contactados</option>
            <option value="En negociación">En negociación</option>
            <option value="Cerrado">Cerrados</option>
            <option value="No interesado">No interesados</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredClients.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-50 border border-dashed border-slate-300 space-y-2">
          <Users className="h-8 w-8 text-slate-300 mx-auto" />
          <h3 className="text-xs font-bold text-slate-700">No hay clientes en esta búsqueda</h3>
          <p className="text-[11px] text-slate-400">Puedes registrar un nuevo cliente con el botón superior.</p>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Cliente / Contacto</th>
                  <th className="py-3 px-4">Propiedades de Interés</th>
                  <th className="py-3 px-4">Observaciones</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClients.map((client) => {
                  const whatsappClean = client.phone.replace(/[^0-9]/g, '');
                  const whatsappLink = whatsappClean
                    ? `https://wa.me/593${whatsappClean.startsWith('0') ? whatsappClean.slice(1) : whatsappClean}`
                    : null;

                  return (
                    <tr key={client.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Nombre y Contacto */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{client.name}</div>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1 font-mono">
                            <Phone className="h-3 w-3 text-slate-400" />
                            {client.phone}
                          </span>
                          {client.email && (
                            <span className="flex items-center gap-1 truncate max-w-[140px]">
                              <Mail className="h-3 w-3 text-slate-400" />
                              {client.email}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Propiedades de Interés */}
                      <td className="py-3.5 px-4 max-w-[260px]">
                        {client.interestedPropertyIds && client.interestedPropertyIds.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {client.interestedPropertyIds.map((pId) => {
                              const found = properties.find((p) => p.id === pId);
                              return (
                                <span
                                  key={pId}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold"
                                >
                                  <Building2 className="h-2.5 w-2.5 text-emerald-600" />
                                  <span className="truncate max-w-[160px]">
                                    {found ? `${found.code} · ${found.name}` : pId}
                                  </span>
                                </span>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Interés general</span>
                        )}
                      </td>

                      {/* Observaciones */}
                      <td className="py-3.5 px-4 max-w-[220px]">
                        <p className="text-[11px] text-slate-600 line-clamp-2" title={client.notes}>
                          {client.notes || '—'}
                        </p>
                      </td>

                      {/* Estado */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(client.status)}
                      </td>

                      {/* Fecha */}
                      <td className="py-3.5 px-4 text-[11px] font-mono text-slate-500">
                        {new Date(client.createdAt).toLocaleDateString('es-EC', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {whatsappLink && (
                            <a
                              href={whatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-xl border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-all cursor-pointer"
                              title="Escribir por WhatsApp"
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(client)}
                            className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-slate-50 transition-all cursor-pointer"
                            title="Editar cliente"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`¿Eliminar al cliente ${client.name}?`)) {
                                deleteClient(client.id);
                              }
                            }}
                            className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                            title="Eliminar cliente"
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

      {/* Modal Crear / Editar Cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  {clientToEdit ? 'Editar Cliente Interesado' : 'Registrar Nuevo Interesado'}
                </h2>
                <p className="text-xs text-slate-400">
                  Formulario simple para prospección comercial de lotes y viviendas.
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
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Dra. Elena Ramos"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Teléfono / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0991234567"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Estado del Cliente</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Client['status'])}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 bg-white font-semibold focus:border-emerald-600 focus:outline-none"
                >
                  <option value="Nuevo">Nuevo</option>
                  <option value="Contactado">Contactado</option>
                  <option value="En negociación">En negociación</option>
                  <option value="Cerrado">Cerrado</option>
                  <option value="No interesado">No interesado</option>
                </select>
              </div>

              {/* Selector de Propiedades de Interés (Puede seleccionar varias) */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Propiedades de Interés (Selecciona una o varias)
                </label>
                <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-xl p-2 space-y-1 bg-slate-50/50">
                  {properties.map((prop) => {
                    const isSelected = selectedPropertyIds.includes(prop.id);
                    return (
                      <label
                        key={prop.id}
                        className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-emerald-100/70 text-emerald-950 font-bold'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => togglePropertyInterest(prop.id)}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="font-mono text-[11px] text-emerald-800">{prop.code}</span>
                        <span className="truncate">{prop.name} (${prop.priceUSD.toLocaleString()} USD)</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Observaciones / Requerimientos</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detalles de interés, forma de pago preferida, fecha estimada de compra..."
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
                  <span>Guardar Cliente</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
