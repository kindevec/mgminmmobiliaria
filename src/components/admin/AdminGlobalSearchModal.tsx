'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Building2,
  SlidersHorizontal,
  User,
  X,
  ArrowRight,
} from 'lucide-react';
import { useProperties } from '@/src/context/PropertyContext';
import type { LotProperty } from '@/src/data/lots';
import type { AdminTab } from './AdminDashboard';

interface AdminGlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: AdminTab) => void;
  onSelectProperty?: (lot: LotProperty) => void;
}

const ADMIN_SECTIONS: { id: AdminTab; title: string; subtitle: string; keywords: string }[] = [
  {
    id: 'inventory',
    title: 'Propiedades en Cartera',
    subtitle: 'Gestión de lotes, casas, quintas, precios y estados',
    keywords: 'propiedades lotes terrenos casas quintas inventario catalogo',
  },
  {
    id: 'banners',
    title: 'Banners y Portadas Web',
    subtitle: 'Imágenes de portada para Inicio, Lotes, Nosotros y Contacto',
    keywords: 'banners portadas hero imagenes inicio fotos carrusel',
  },
  {
    id: 'profile',
    title: 'Perfil & Configuración de Sede',
    subtitle: 'Teléfono WhatsApp, correo, ubicación de la sede en mapa y contraseña',
    keywords: 'perfil configuracion sede mapa direccion telefono whatsapp correo horarios contraseña',
  },
];

export function AdminGlobalSearchModal({
  isOpen,
  onClose,
  onNavigateTab,
  onSelectProperty,
}: AdminGlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const { properties } = useProperties();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
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
          p.project.toLowerCase().includes(q) ||
          p.status.toLowerCase().includes(q)
      )
      .slice(0, 6);

    const matchedSections = ADMIN_SECTIONS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q) ||
        s.keywords.includes(q)
    );

    const count = matchedProps.length + matchedSections.length;

    return {
      properties: matchedProps,
      sections: matchedSections,
      totalCount: count,
    };
  }, [query, properties]);

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
            placeholder="Buscar por código de lote, nombre, sector o sección del panel..."
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
              Escribe el código de una propiedad (ej: MT24-023), nombre, sector o configuración...
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

              {/* Secciones del Panel */}
              {results.sections.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                    <SlidersHorizontal className="h-3 w-3 text-emerald-700" />
                    <span>Secciones del Panel ({results.sections.length})</span>
                  </span>
                  <div className="space-y-1">
                    {results.sections.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          onNavigateTab(s.id);
                          onClose();
                        }}
                        className="w-full p-2.5 rounded-2xl border border-slate-200/80 hover:bg-emerald-50/50 hover:border-emerald-300 text-left transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          {s.id === 'inventory' && <Building2 className="h-4 w-4 text-emerald-700 shrink-0" />}
                          {s.id === 'banners' && <SlidersHorizontal className="h-4 w-4 text-emerald-700 shrink-0" />}
                          {s.id === 'profile' && <User className="h-4 w-4 text-emerald-700 shrink-0" />}
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-emerald-900">{s.title}</div>
                            <div className="text-[11px] text-slate-500">{s.subtitle}</div>
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-emerald-700" />
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
