'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  FileText,
  Upload,
  Search,
  Filter,
  ExternalLink,
  Download,
  Trash2,
  Building2,
  Plus,
  X,
  Save,
  CheckCircle2,
  Loader2,
  FileCheck,
} from 'lucide-react';
import { useAdminData } from '@/src/context/AdminDataContext';
import { useProperties } from '@/src/context/PropertyContext';
import { uploadPropertyDocument } from '@/src/lib/imageOptimizer';
import { SystemDocument, DocumentType } from '@/src/data/adminTypes';

const DOCUMENT_TYPES: DocumentType[] = [
  'Escritura',
  'Contrato',
  'Plano',
  'Cédula',
  'Certificado',
  'Ficha Técnica',
  'Otro',
];

export function AdminDocumentsView() {
  const { documents, addDocument, deleteDocument } = useAdminData();
  const { properties } = useProperties();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('Todos');
  const [filterProperty, setFilterProperty] = useState<string>('Todos');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<DocumentType>('Ficha Técnica');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [docUrl, setDocUrl] = useState('');
  const [docSize, setDocSize] = useState('1.2 MB');
  const [docStatus, setDocStatus] = useState<SystemDocument['status']>('Vigente');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDocs = useMemo(() => {
    return documents.filter((d) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        (d.propertyCode && d.propertyCode.toLowerCase().includes(q)) ||
        (d.propertyTitle && d.propertyTitle.toLowerCase().includes(q));

      const matchesType = filterType === 'Todos' || d.type === filterType;
      const matchesProperty =
        filterProperty === 'Todos' || d.propertyId === filterProperty || d.propertyCode === filterProperty;

      return matchesSearch && matchesType && matchesProperty;
    });
  }, [documents, search, filterType, filterProperty]);

  const handleOpenUpload = () => {
    setDocName('');
    setDocType('Ficha Técnica');
    setSelectedPropertyId(properties[0]?.id || '');
    setDocUrl('');
    setDocSize('');
    setDocStatus('Vigente');
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const prop = properties.find((p) => p.id === selectedPropertyId);
      const code = prop?.code || 'mgm-doc';
      const uploadedDoc = await uploadPropertyDocument(file, code);

      setDocUrl(uploadedDoc.url);
      if (!docName) {
        setDocName(uploadedDoc.title || file.name.replace(/\.[^/.]+$/, ''));
      }
      setDocSize(uploadedDoc.size || `${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    } catch {
      alert('Error al subir documento a almacenamiento.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docUrl.trim()) {
      alert('Por favor sube un archivo o ingresa una URL válida.');
      return;
    }

    const prop = properties.find((p) => p.id === selectedPropertyId);

    addDocument({
      name: docName.trim(),
      type: docType,
      propertyId: prop?.id,
      propertyCode: prop?.code || 'GENERAL',
      propertyTitle: prop?.name || 'Documento Institucional',
      url: docUrl.trim(),
      size: docSize || 'PDF',
      status: docStatus,
    });

    setIsModalOpen(false);
  };

  const getTypeBadge = (type: DocumentType) => {
    switch (type) {
      case 'Escritura':
        return <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-bold text-[10px]">Escritura</span>;
      case 'Contrato':
        return <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold text-[10px]">Contrato</span>;
      case 'Plano':
        return <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 font-bold text-[10px]">Plano</span>;
      case 'Ficha Técnica':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">Ficha Técnica</span>;
      case 'Certificado':
        return <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">Certificado</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">{type}</span>;
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Gestor Central de Documentos</span>
            <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              {filteredDocs.length} archivos
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Archivos notariales, fichas técnicas, planos de lotización y contratos vinculados a propiedades.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenUpload}
          className="px-4 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Upload className="h-4 w-4" />
          <span>Subir Documento</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-6 relative">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre de documento o código de propiedad..."
            className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
          >
            <option value="Todos">Todos los Tipos</option>
            {DOCUMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={filterProperty}
            onChange={(e) => setFilterProperty(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-600 focus:outline-none"
          >
            <option value="Todos">Todas las Propiedades</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} - {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Table */}
      {filteredDocs.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-50 border border-dashed border-slate-300 space-y-2">
          <FileText className="h-8 w-8 text-slate-300 mx-auto" />
          <h3 className="text-xs font-bold text-slate-700">No se encontraron documentos</h3>
          <p className="text-[11px] text-slate-400">Puedes cargar un nuevo archivo con el botón superior.</p>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Documento</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Propiedad Relacionada</th>
                  <th className="py-3 px-4">Fecha de Subida</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Nombre y Tamaño */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="truncate max-w-[240px]">
                          <span className="font-bold text-slate-900 block truncate" title={doc.name}>
                            {doc.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{doc.size || 'PDF'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Tipo */}
                    <td className="py-3.5 px-4">
                      {getTypeBadge(doc.type)}
                    </td>

                    {/* Propiedad Relacionada */}
                    <td className="py-3.5 px-4 max-w-[200px]">
                      {doc.propertyCode ? (
                        <div className="truncate">
                          <span className="font-mono font-bold text-emerald-800">{doc.propertyCode}</span>
                          <span className="text-slate-500 text-[11px] block truncate">{doc.propertyTitle}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">General</span>
                      )}
                    </td>

                    {/* Fecha de Subida */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(doc.uploadedAt).toLocaleDateString('es-EC', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Estado */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {doc.status}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 transition-all cursor-pointer"
                          title="Ver Documento"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <a
                          href={doc.url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 transition-all cursor-pointer"
                          title="Descargar"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`¿Eliminar ${doc.name}?`)) deleteDocument(doc.id);
                          }}
                          className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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

      {/* Modal Subir / Indexar Documento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">Subir o Vincular Documento</h2>
                <p className="text-xs text-slate-400">
                  Almacenamiento seguro e indexación en el expediente de la propiedad.
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
                <label className="font-bold text-slate-700 block mb-1">Nombre Descriptivo del Documento *</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="Ej: Escritura Notariada Lote 12"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipo de Documento</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value as DocumentType)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 bg-white font-semibold focus:border-emerald-600 focus:outline-none"
                  >
                    {DOCUMENT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Propiedad Asociada</label>
                  <select
                    value={selectedPropertyId}
                    onChange={(e) => setSelectedPropertyId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 bg-white font-semibold focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="">Documento General / Sin vincular</option>
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.code} - {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Botón de carga física o URL directa */}
              <div className="p-3.5 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/30 space-y-2">
                <span className="font-bold text-slate-700 block">Archivo PDF / Documento</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf,image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Subiendo archivo...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-3.5 w-3.5" />
                        <span>Seleccionar archivo local</span>
                      </>
                    )}
                  </button>
                  {docUrl && (
                    <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Cargado con éxito ({docSize})</span>
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-medium block mb-0.5">
                    O escribe la URL directa:
                  </label>
                  <input
                    type="text"
                    value={docUrl}
                    onChange={(e) => setDocUrl(e.target.value)}
                    placeholder="https://... o /properties/MT24-023/documento.pdf"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-mono text-slate-800 text-[11px] focus:outline-none"
                  />
                </div>
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
                  disabled={!docUrl}
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>Indexar Documento</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
