'use client';

import React, { useState, useMemo } from 'react';
import {
  FileCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Edit2,
  Save,
  X,
  Upload,
  AlertTriangle,
} from 'lucide-react';
import { useAdminData } from '@/src/context/AdminDataContext';
import { useProperties } from '@/src/context/PropertyContext';
import { LegalFile } from '@/src/data/adminTypes';

export function AdminLegalFilesView() {
  const { legalFiles, updateLegalFile, toggleLegalDocStatus } = useAdminData();
  const { properties } = useProperties();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [expandedFileId, setExpandedFileId] = useState<string | null>(null);

  // Modal para editar observaciones / estado general
  const [selectedFile, setSelectedFile] = useState<LegalFile | null>(null);
  const [modalNotes, setModalNotes] = useState('');
  const [modalStatus, setModalStatus] = useState<LegalFile['status']>('Pendiente');

  const filteredFiles = useMemo(() => {
    return legalFiles.filter((f) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        f.propertyCode.toLowerCase().includes(q) ||
        f.propertyTitle.toLowerCase().includes(q) ||
        (f.notes && f.notes.toLowerCase().includes(q));

      const matchesStatus = filterStatus === 'Todos' || f.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [legalFiles, search, filterStatus]);

  const toggleExpand = (id: string) => {
    setExpandedFileId((prev) => (prev === id ? null : id));
  };

  const handleOpenEdit = (file: LegalFile) => {
    setSelectedFile(file);
    setModalNotes(file.notes || '');
    setModalStatus(file.status);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    updateLegalFile(selectedFile.id, {
      notes: modalNotes.trim(),
      status: modalStatus,
    });
    setSelectedFile(null);
  };

  const getStatusBadge = (st: LegalFile['status']) => {
    switch (st) {
      case 'Completo':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            Completo
          </span>
        );
      case 'En revisión':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 text-blue-600" />
            En revisión
          </span>
        );
      case 'Pendiente':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
            <Clock className="h-3 w-3 text-amber-600" />
            Pendiente
          </span>
        );
      case 'Con observaciones':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 text-red-600" />
            Con observaciones
          </span>
        );
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
            <span>Expedientes Legales por Propiedad</span>
            <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              {filteredFiles.length} expedientes
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Control notarial, verificación de escrituras, certificados de gravamen y planimetría de cada inmueble.
          </p>
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
            placeholder="Buscar por código de propiedad o nombre..."
            className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div className="w-full sm:w-56">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
          >
            <option value="Todos">Todos los Estados</option>
            <option value="Completo">Completos</option>
            <option value="En revisión">En revisión</option>
            <option value="Pendiente">Pendientes</option>
            <option value="Con observaciones">Con observaciones</option>
          </select>
        </div>
      </div>

      {/* List of Legal Files */}
      {filteredFiles.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-50 border border-dashed border-slate-300 text-xs text-slate-400">
          No se encontraron expedientes legales en este filtro.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFiles.map((file) => {
            const isExpanded = expandedFileId === file.id;
            const pendingDocsCount = file.requiredDocs.filter((d) => d.required && !d.received).length;
            const receivedDocsCount = file.requiredDocs.filter((d) => d.received).length;
            const totalDocsCount = file.requiredDocs.length;
            const associatedProp = properties.find((p) => p.id === file.propertyId);

            return (
              <div
                key={file.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all overflow-hidden"
              >
                {/* Main Card Header */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-slate-900 text-sm">{file.propertyCode}</span>
                      <span className="text-slate-300">·</span>
                      <span className="font-bold text-slate-800 text-sm">{file.propertyTitle}</span>
                      {getStatusBadge(file.status)}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                      {/* Indicador visual de documentos pendientes */}
                      {pendingDocsCount > 0 ? (
                        <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
                          <AlertCircle className="h-3 w-3" />
                          <span>{pendingDocsCount} documentos pendientes</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Expediente 100% completo</span>
                        </span>
                      )}

                      <span className="font-mono">
                        {receivedDocsCount} de {totalDocsCount} recibidos
                      </span>

                      {associatedProp?.pdfUrl && (
                        <a
                          href={associatedProp.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-emerald-800 hover:underline flex items-center gap-1 ml-1"
                        >
                          <FileText className="h-3 w-3" />
                          <span>Ver Ficha Técnica PDF</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(file)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>Observaciones</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleExpand(file.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Requisitos</span>
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Subsección expandida con Checklist de Documentos Requeridos */}
                {isExpanded && (
                  <div className="px-4 pb-5 pt-2 sm:px-5 border-t border-slate-100 bg-slate-50/50 space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                        Documentos Legales Requeridos
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Marca los documentos recibidos para actualizar el expediente automáticamente
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {file.requiredDocs.map((req) => (
                        <div
                          key={req.id}
                          className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                            req.received
                              ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950 font-semibold'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <label className="flex items-center gap-2.5 cursor-pointer truncate flex-1">
                            <input
                              type="checkbox"
                              checked={req.received}
                              onChange={(e) => toggleLegalDocStatus(file.id, req.id, e.target.checked)}
                              className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                            />
                            <span className="truncate">{req.name}</span>
                          </label>

                          {req.fileUrl ? (
                            <a
                              href={req.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold text-emerald-800 hover:underline flex items-center gap-1 shrink-0"
                            >
                              <FileText className="h-3 w-3" />
                              <span>Ver</span>
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic shrink-0">
                              {req.received ? 'Recibido en físico' : 'Pendiente'}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {file.notes && (
                      <div className="p-3 rounded-2xl bg-white border border-slate-200 text-xs">
                        <span className="font-bold text-slate-700 block mb-0.5">Observaciones legales:</span>
                        <p className="text-slate-600 text-[11px]">{file.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Editar Estado y Observaciones */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Expediente {selectedFile.propertyCode}
                </h2>
                <p className="text-xs text-slate-400">Actualizar estado notarial y notas del abogado.</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Estado del Expediente</label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value as LegalFile['status'])}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 bg-white font-semibold focus:border-emerald-600 focus:outline-none"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En revisión">En revisión</option>
                  <option value="Completo">Completo</option>
                  <option value="Con observaciones">Con observaciones</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Observaciones Notariales / Jurídicas</label>
                <textarea
                  rows={3}
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Detalles sobre escrituras, permisos o gravámenes pendientes..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>Guardar Expediente</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
