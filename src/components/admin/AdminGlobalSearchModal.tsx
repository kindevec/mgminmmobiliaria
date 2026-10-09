'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Building2,
  Users,
  Calendar,
  FileCheck,
  FileText,
  X,
  ArrowRight,
} from 'lucide-react';
import { useProperties } from '@/src/context/PropertyContext';
import { useAdminData } from '@/src/context/AdminDataContext';

import type { LotProperty } from '@/src/data/lots';

interface AdminGlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: any) => void;
  onSelectProperty?: (lot: LotProperty) => void;
}

export function AdminGlobalSearchModal({
  isOpen,
  onClose,
  onNavigateTab,
  onSelectProperty,
}: AdminGlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const { properties } = useProperties();
  const { clients, appointments, legalFiles, documents } = useAdminData();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return null;

    const matchedProps = properties
      .filter(
        (p) =>
          p.code.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.zone.toLowerCase().includes(q) ||
          p.project.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const matchedClients = clients
      .filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q))
      .slice(0, 4);

    const matchedAppointments = appointments
      .filter((a) => a.clientName.toLowerCase().includes(q) || a.propertyTitle.toLowerCase().includes(q))
      .slice(0, 4);

    const matchedLegal = legalFiles
      .filter((l) => l.propertyCode.toLowerCase().includes(q) || l.propertyTitle.toLowerCase().includes(q))
      .slice(0, 4);

    const matchedDocs = documents
      .filter((d) => d.name.toLowerCase().includes(q) || (d.propertyCode && d.propertyCode.toLowerCase().includes(q)))
      .slice(0, 4);

    const count =
      matchedProps.length +
      matchedClients.length +
      matchedAppointments.length +
      matchedLegal.length +
      matchedDocs.length;

    return {
      properties: matchedProps,
      clients: matchedClients,
      appointments: matchedAppointments,
      legalFiles: matchedLegal,
      documents: matchedDocs,
      totalCount: count,
    };
  }, [query, properties, clients, appointments, legalFiles, documents]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="h-5 w-5 text-emerald-700 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en Propiedades, Clientes, Citas, Expedientes, Documentos..."
            className="w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {!query.trim() && (
            <div className="p-8 text-center text-slate-400 text-xs">
              Escribe el nombre de un cliente, código de lote (ej: MT24-023), sector o documento...
            </div>
          )}

          {query.trim() && results && results.totalCount === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              No se encontraron coincidencias para &ldquo;{query}&rdquo;.
            </div>
          )}

          {results && results.totalCount > 0 && (
            <>
              {/* Propiedades */}
              {results.properties.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Building2 className="h-3 w-3 text-emerald-700" />
                    <span>Propiedades ({results.properties.length})</span>
                  </span>
                  <div className="space-y-1">
                    {results.properties.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          if (onSelectProperty) {
                            onSelectProperty(p);
                          } else {
                            onNavigateTab('inventory');
                          }
                          onClose();
                        }}
                        className="w-full p-2.5 rounded-2xl border border-slate-200/80 hover:bg-emerald-50/50 hover:border-emerald-300 text-left transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-emerald-900">
                            {p.code} - {p.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {p.project} · ${p.priceUSD.toLocaleString()} USD · {p.status}
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-emerald-700" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clientes */}
              {results.clients.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Users className="h-3 w-3 text-blue-700" />
                    <span>Clientes ({results.clients.length})</span>
                  </span>
                  <div className="space-y-1">
                    {results.clients.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          onNavigateTab('clients');
                          onClose();
                        }}
                        className="w-full p-2.5 rounded-2xl border border-slate-200/80 hover:bg-blue-50/50 hover:border-blue-300 text-left transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-blue-900">{c.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {c.phone} · {c.email || 'Sin correo'} · {c.status}
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-blue-700" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Citas */}
              {results.appointments.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-purple-700" />
                    <span>Citas y Visitas ({results.appointments.length})</span>
                  </span>
                  <div className="space-y-1">
                    {results.appointments.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => {
                          onNavigateTab('appointments');
                          onClose();
                        }}
                        className="w-full p-2.5 rounded-2xl border border-slate-200/80 hover:bg-purple-50/50 hover:border-purple-300 text-left transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-purple-900">
                            {a.clientName} - {a.date} ({a.time} hrs)
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {a.propertyTitle} · {a.status}
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-purple-700" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Expedientes */}
              {results.legalFiles.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                    <FileCheck className="h-3 w-3 text-amber-700" />
                    <span>Expedientes Legales ({results.legalFiles.length})</span>
                  </span>
                  <div className="space-y-1">
                    {results.legalFiles.map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => {
                          onNavigateTab('legalFiles');
                          onClose();
                        }}
                        className="w-full p-2.5 rounded-2xl border border-slate-200/80 hover:bg-amber-50/50 hover:border-amber-300 text-left transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-amber-900">
                            Expediente {l.propertyCode} - {l.propertyTitle}
                          </div>
                          <div className="text-[11px] text-slate-500">Estado: {l.status}</div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-amber-700" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Documentos */}
              {results.documents.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                    <FileText className="h-3 w-3 text-teal-700" />
                    <span>Documentos ({results.documents.length})</span>
                  </span>
                  <div className="space-y-1">
                    {results.documents.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          onNavigateTab('documentsManager');
                          onClose();
                        }}
                        className="w-full p-2.5 rounded-2xl border border-slate-200/80 hover:bg-teal-50/50 hover:border-teal-300 text-left transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-teal-900">{d.name}</div>
                          <div className="text-[11px] text-slate-500">
                            Tipo: {d.type} · {d.propertyCode || 'General'}
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-teal-700" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
