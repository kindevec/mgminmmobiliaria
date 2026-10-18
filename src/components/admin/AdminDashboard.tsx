'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Search,
  LogOut,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  User,
  SlidersHorizontal,
  Globe,
  HardHat,
} from 'lucide-react';
import { useProperties } from '@/src/context/PropertyContext';
import { AdminPropertyModal } from './AdminPropertyModal';
import { AdminPropertiesList } from './AdminPropertiesList';
import { AdminProfileView } from './AdminProfileView';
import { AdminBannersView } from './AdminBannersView';
import { AdminConstructionsView } from './AdminConstructionsView';
import { AdminGlobalSearchModal } from './AdminGlobalSearchModal';
import type { LotProperty } from '@/src/data/lots';
import type { PageView } from '@/src/data/navigation';
import { supabase } from '@/src/lib/supabase';
import { LogoMGM } from '../LogoMGM';

export type AdminTab = 'inventory' | 'constructions' | 'banners' | 'profile';

interface AdminDashboardProps {
  onLogout: () => void;
  onViewCatalog: () => void;
  onSelectLotPreview?: (lot: LotProperty) => void;
  onNavigate?: (page: PageView) => void;
}

export function AdminDashboard({
  onLogout,
  onNavigate,
}: AdminDashboardProps) {
  const {
    properties,
    addProperty,
    updateProperty,
    deleteProperty,
  } = useProperties();

  // Navigation tab state (default to 'inventory' - Propiedades)
  const [activeTab, setActiveTab] = useState<AdminTab>('inventory');

  // Global search modal state
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Full-page property editor & creator states
  const [editingProperty, setEditingProperty] = useState<LotProperty | null>(null);
  const [isCreatingProperty, setIsCreatingProperty] = useState(false);

  // Collapsible sidebar state (collapses on New Property, expands on icon click)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<LotProperty | null>(null);
  const [propertyToDelete, setPropertyToDelete] = useState<LotProperty | null>(null);

  // Admin user details
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('mgm_admin_user_email') ||
        sessionStorage.getItem('mgm_admin_user_email') ||
        'noemaliza01@gmail.com'
      );
    }
    return 'noemaliza01@gmail.com';
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setAdminEmail(user.email);
    });
  }, []);

  const handleGoHome = () => {
    setEditingProperty(null);
    setIsCreatingProperty(false);
    setIsSidebarCollapsed(false);
    if (onNavigate) {
      onNavigate('home');
    } else {
      window.location.href = '/';
    }
  };

  const handleOpenCreate = () => {
    setEditingProperty(null);
    setIsCreatingProperty(true);
    setIsSidebarCollapsed(true);
  };

  const handleOpenEdit = (lot: LotProperty) => {
    setEditingProperty(lot);
  };

  const handleSaveProperty = async (data: Omit<LotProperty, 'id'>, id?: string) => {
    try {
      if (id) {
        await updateProperty(id, data);
      } else {
        await addProperty(data);
      }
      setIsCreatingProperty(false);
      setEditingProperty(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar en Supabase';
      alert(`No se pudo guardar la propiedad: ${msg}`);
      throw err;
    }
  };

  const confirmDelete = async () => {
    if (propertyToDelete) {
      try {
        await deleteProperty(propertyToDelete.id);
        setPropertyToDelete(null);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error al eliminar';
        alert(`No se pudo eliminar la propiedad: ${msg}`);
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* ======================================================== */}
      {/* LEFT SIDEBAR (Collapsible to icons-only on New Property / Toggle) */}
      {/* ======================================================== */}
      <aside
        className={`hidden lg:flex lg:fixed lg:top-0 lg:bottom-0 lg:left-0 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:w-20 p-3' : 'lg:w-64 p-5 sm:p-6'
        } bg-[#0d2e1a] text-emerald-100/90 flex-col justify-between shrink-0 select-none border-r border-emerald-900/60 z-30 overflow-y-auto overflow-x-hidden`}
      >
        <div>
          {/* Brand Header */}
          {isSidebarCollapsed ? (
            <div className="w-full flex flex-col items-center gap-2.5 pb-6 pt-1">
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(false)}
                className="h-10 w-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center p-1.5 border border-white/15 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Expandir menú lateral a la derecha"
              >
                <LogoMGM variant="symbol" isGhost={true} className="h-full w-auto" />
              </button>
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(false)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/20 text-emerald-300 hover:text-white transition-colors cursor-pointer"
                title="Expandir menú a la derecha"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between pb-8 pt-2 px-1">
              <button
                type="button"
                onClick={handleGoHome}
                className="flex items-center gap-3 text-left cursor-pointer group transition-transform hover:scale-[1.02] active:scale-95 min-w-0"
                title="Ir a la pantalla principal"
              >
                <div className="h-10 w-10 rounded-2xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center p-1.5 border border-white/15 shadow-sm transition-colors shrink-0">
                  <LogoMGM variant="symbol" isGhost={true} className="h-full w-auto" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-black tracking-tight text-white leading-tight group-hover:text-emerald-300 transition-colors truncate">
                    MGM Inmobiliaria
                  </h2>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase tracking-wider block truncate">
                    Admin Suite 2026
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(true)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-emerald-300 hover:text-white transition-all cursor-pointer shrink-0 ml-1"
                title="Colapsar menú lateral"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          )}

          <nav className="space-y-1" aria-label="Navegación del panel">
            {/* 1. Perfil & Configuración */}
            <button
              type="button"
              onClick={() => {
                if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                setEditingProperty(null);
                setIsCreatingProperty(false);
                setActiveTab('profile');
              }}
              className={`relative w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
              } rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                !editingProperty && !isCreatingProperty && activeTab === 'profile'
                  ? 'bg-white text-emerald-950 shadow-md font-black translate-x-0.5'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/10'
              }`}
              title="Perfil de Administrador y Configuración"
            >
              <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                <User
                  className={`h-4 w-4 shrink-0 ${
                    !editingProperty && !isCreatingProperty && activeTab === 'profile'
                      ? 'text-emerald-800'
                      : 'opacity-70'
                  }`}
                />
                {!isSidebarCollapsed && <span className="truncate">Perfil</span>}
              </div>
            </button>

            <div className="py-2">
              <div className="border-t border-emerald-900/60" />
            </div>

            {/* 2. Propiedades */}
            <button
              type="button"
              onClick={() => {
                if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                setEditingProperty(null);
                setIsCreatingProperty(false);
                setActiveTab('inventory');
              }}
              className={`relative w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
              } rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                !editingProperty && !isCreatingProperty && activeTab === 'inventory'
                  ? 'bg-white text-emerald-950 shadow-md font-black translate-x-0.5'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/10'
              }`}
              title="Catálogo de Propiedades"
            >
              <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                <Building2
                  className={`h-4 w-4 shrink-0 ${
                    !editingProperty && !isCreatingProperty && activeTab === 'inventory'
                      ? 'text-emerald-800'
                      : 'opacity-70'
                  }`}
                />
                {!isSidebarCollapsed && <span className="truncate">Propiedades</span>}
              </div>
              {!isSidebarCollapsed && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    !editingProperty && !isCreatingProperty && activeTab === 'inventory'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-emerald-900/60 text-emerald-300'
                  }`}
                >
                  {properties.length}
                </span>
              )}
            </button>

            {/* 3. Nueva Propiedad */}
            <button
              type="button"
              onClick={handleOpenCreate}
              className={`relative w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center p-3' : 'justify-start gap-3 px-3.5 py-2.5'
              } rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                isCreatingProperty
                  ? 'bg-white text-emerald-950 shadow-md font-black translate-x-0.5'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/10'
              }`}
              title="Registrar Nueva Propiedad"
            >
              <Plus
                className={`h-4 w-4 shrink-0 ${
                  isCreatingProperty ? 'text-emerald-800' : 'opacity-70'
                }`}
              />
              {!isSidebarCollapsed && <span className="truncate">Nueva Propiedad</span>}
            </button>

            {/* 3.1. Nuestras Construcciones */}
            <button
              type="button"
              onClick={() => {
                if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                setEditingProperty(null);
                setIsCreatingProperty(false);
                setActiveTab('constructions');
              }}
              className={`relative w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
              } rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                !editingProperty && !isCreatingProperty && activeTab === 'constructions'
                  ? 'bg-white text-emerald-950 shadow-md font-black translate-x-0.5'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/10'
              }`}
              title="Gestión de Nuestras Construcciones"
            >
              <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                <HardHat
                  className={`h-4 w-4 shrink-0 ${
                    !editingProperty && !isCreatingProperty && activeTab === 'constructions'
                      ? 'text-emerald-800'
                      : 'opacity-70'
                  }`}
                />
                {!isSidebarCollapsed && <span className="truncate">Construcciones</span>}
              </div>
            </button>

            {/* 4. Banners */}
            <button
              type="button"
              onClick={() => {
                if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                setEditingProperty(null);
                setIsCreatingProperty(false);
                setActiveTab('banners');
              }}
              className={`relative w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
              } rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                !editingProperty && !isCreatingProperty && activeTab === 'banners'
                  ? 'bg-white text-emerald-950 shadow-md font-black translate-x-0.5'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/10'
              }`}
              title="Editar Banners de Inicio de Cada Ventana"
            >
              <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                <SlidersHorizontal
                  className={`h-4 w-4 shrink-0 ${
                    !editingProperty && !isCreatingProperty && activeTab === 'banners'
                      ? 'text-emerald-800'
                      : 'opacity-70'
                  }`}
                />
                {!isSidebarCollapsed && <span className="truncate">Banners</span>}
              </div>
              {!isSidebarCollapsed && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    !editingProperty && !isCreatingProperty && activeTab === 'banners'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-emerald-900/60 text-emerald-300'
                  }`}
                >
                  4
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Sidebar Bottom Profile Card */}
        <div className="pt-4 border-t border-emerald-900/60 mt-4 space-y-2">
          {!isSidebarCollapsed ? (
            <div className="px-2">
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-950/25 transition-all cursor-pointer active:scale-95 border border-rose-500/30"
                title="Cerrar Sesión"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={onLogout}
                className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all cursor-pointer active:scale-95 border border-rose-500/30"
                title="Cerrar Sesión"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MOBILE TOP BAR (Only on < lg screens) */}
      {/* ======================================================== */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0d2e1a] border-b border-emerald-900/60 sticky top-0 z-30 shrink-0">
        <button
          type="button"
          onClick={handleGoHome}
          className="flex items-center gap-2.5 text-left cursor-pointer group active:scale-95"
          title="Ir a la pantalla principal"
        >
          <div className="h-8 w-8 rounded-xl bg-white/10 group-hover:bg-white/20 flex items-center justify-center p-1 border border-white/15 transition-colors">
            <LogoMGM variant="symbol" isGhost={true} className="h-full w-auto" />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs font-black tracking-tight text-white leading-tight group-hover:text-emerald-300 transition-colors">
              MGM Inmobiliaria
            </h2>
            <span className="text-[9px] font-mono text-emerald-400 font-semibold uppercase">
              Admin Panel
            </span>
          </div>
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingProperty(null);
              setIsCreatingProperty(false);
              setActiveTab('profile');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              !editingProperty && !isCreatingProperty && activeTab === 'profile'
                ? 'bg-white text-emerald-950 border-white'
                : 'bg-white/10 text-white border-white/10 hover:bg-white/20'
            }`}
            title="Ver Perfil y Configuración"
          >
            <div className="h-5 w-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
              {adminEmail.slice(0, 2).toUpperCase()}
            </div>
            <span className="text-[11px]">Perfil</span>
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="p-1.5 rounded-lg text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 transition-colors cursor-pointer"
            title="Cerrar Sesión"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MAIN CANVAS (PURE WHITE, CLEAN & MODERN) */}
      {/* ======================================================== */}
      <main
        className={`flex-1 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        } transition-all duration-300 ease-in-out p-4 sm:p-6 lg:p-8 flex flex-col justify-between overflow-x-clip bg-white min-h-screen pb-24 lg:pb-8`}
      >
        {editingProperty || isCreatingProperty ? (
          <AdminPropertyModal
            key={editingProperty?.id || 'create-new-property'}
            isPageView={true}
            onClose={() => {
              setEditingProperty(null);
              setIsCreatingProperty(false);
              setIsSidebarCollapsed(false);
            }}
            onSave={(data, id) => {
              handleSaveProperty(data, id);
              setEditingProperty(null);
              setIsCreatingProperty(false);
              setIsSidebarCollapsed(false);
            }}
            onDelete={(id) => {
              deleteProperty(id);
              setEditingProperty(null);
              setIsCreatingProperty(false);
              setIsSidebarCollapsed(false);
            }}
            propertyToEdit={editingProperty}
          />
        ) : (
          <div className="space-y-6">
            {/* TOP HEADER BAR with Global Search and Web View */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {activeTab === 'inventory' && 'Propiedades en Cartera'}
                  {activeTab === 'constructions' && 'Nuestras Construcciones'}
                  {activeTab === 'banners' && 'Banners y Portadas Web'}
                  {activeTab === 'profile' && 'Perfil & Configuración'}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                  {activeTab === 'inventory' && `${properties.length} propiedades registradas en el catálogo`}
                  {activeTab === 'constructions' && 'Gestión y edición sincronizada de obras civiles y viviendas entregadas/en construcción'}
                  {activeTab === 'banners' && 'Edición de los 3 banners de Inicio y portada única de Lotes, Nosotros y Contacto'}
                  {activeTab === 'profile' && 'Gestión de cuenta de administrador, datos de contacto y ubicación de la sede'}
                </p>
              </div>

              {/* Right Controls: Búsqueda Global & Web Button */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleGoHome}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-600 hover:text-slate-900 transition-all cursor-pointer shadow-2xs font-semibold group"
                  title="Ver sitio web público"
                >
                  <Globe className="h-3.5 w-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Ver Sitio Web</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSearchModalOpen(true)}
                  className="flex items-center gap-2 pl-3.5 pr-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-2xs group"
                  title="Buscar en el panel"
                >
                  <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-700 transition-colors" />
                  <span className="hidden sm:inline">Buscar en el panel...</span>
                  <span className="sm:hidden">Buscar...</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT: PROPIEDADES */}
            {activeTab === 'inventory' && (
              <AdminPropertiesList
                onOpenCreate={handleOpenCreate}
                onOpenEdit={handleOpenEdit}
              />
            )}

            {/* TAB CONTENT: NUESTRAS CONSTRUCCIONES */}
            {activeTab === 'constructions' && <AdminConstructionsView />}

            {/* TAB CONTENT: BANNERS DE CADA VENTANA */}
            {activeTab === 'banners' && <AdminBannersView />}

            {/* TAB CONTENT: PERFIL & CONFIGURACIÓN UNIFICADO */}
            {activeTab === 'profile' && (
              <AdminProfileView
                adminEmail={adminEmail}
                onLogout={onLogout}
              />
            )}
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* MOBILE BOTTOM NAVIGATION BAR (Fixed at bottom on < lg) */}
      {/* ======================================================== */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d2e1a]/95 backdrop-blur-md border-t border-emerald-900/80 px-3 pt-2 shadow-2xl"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))' }}
        aria-label="Navegación móvil del panel de administración"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 items-center gap-1">
          {/* 1. Propiedades */}
          <button
            type="button"
            onClick={() => {
              setEditingProperty(null);
              setIsCreatingProperty(false);
              setActiveTab('inventory');
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer min-h-[50px] ${
              !editingProperty && !isCreatingProperty && activeTab === 'inventory'
                ? 'text-white bg-white/15 font-black shadow-xs'
                : 'text-emerald-200/70 hover:text-white hover:bg-white/5 font-semibold'
            }`}
          >
            <Building2
              className={`h-4 w-4 mb-1 ${
                !editingProperty && !isCreatingProperty && activeTab === 'inventory'
                  ? 'text-emerald-300'
                  : 'text-emerald-400/80'
              }`}
            />
            <span className="text-[10px] tracking-tight leading-none">Lotes</span>
          </button>

          {/* 2. Obras / Construcciones */}
          <button
            type="button"
            onClick={() => {
              setEditingProperty(null);
              setIsCreatingProperty(false);
              setActiveTab('constructions');
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer min-h-[50px] ${
              !editingProperty && !isCreatingProperty && activeTab === 'constructions'
                ? 'text-white bg-white/15 font-black shadow-xs'
                : 'text-emerald-200/70 hover:text-white hover:bg-white/5 font-semibold'
            }`}
            title="Nuestras Construcciones"
          >
            <HardHat
              className={`h-4 w-4 mb-1 ${
                !editingProperty && !isCreatingProperty && activeTab === 'constructions'
                  ? 'text-emerald-300'
                  : 'text-emerald-400/80'
              }`}
            />
            <span className="text-[10px] tracking-tight leading-none">Obras</span>
          </button>

          {/* 3. Nueva Propiedad */}
          <button
            type="button"
            onClick={handleOpenCreate}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer min-h-[50px] ${
              isCreatingProperty
                ? 'text-white bg-white/15 font-black shadow-xs'
                : 'text-emerald-200/70 hover:text-white hover:bg-white/5 font-semibold'
            }`}
            title="Publicar Nueva Propiedad"
          >
            <Plus
              className={`h-4 w-4 mb-1 ${
                isCreatingProperty ? 'text-emerald-300' : 'text-emerald-400/80'
              }`}
            />
            <span className="text-[10px] tracking-tight leading-none">Nueva</span>
          </button>

          {/* 4. Banners */}
          <button
            type="button"
            onClick={() => {
              setEditingProperty(null);
              setIsCreatingProperty(false);
              setActiveTab('banners');
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer min-h-[50px] ${
              !editingProperty && !isCreatingProperty && activeTab === 'banners'
                ? 'text-white bg-white/15 font-black shadow-xs'
                : 'text-emerald-200/70 hover:text-white hover:bg-white/5 font-semibold'
            }`}
            title="Editar Banners de Inicio"
          >
            <SlidersHorizontal
              className={`h-4 w-4 mb-1 ${
                !editingProperty && !isCreatingProperty && activeTab === 'banners'
                  ? 'text-emerald-300'
                  : 'text-emerald-400/80'
              }`}
            />
            <span className="text-[10px] tracking-tight leading-none">Banners</span>
          </button>

          {/* 4. Perfil */}
          <button
            type="button"
            onClick={() => {
              setEditingProperty(null);
              setIsCreatingProperty(false);
              setActiveTab('profile');
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all cursor-pointer min-h-[50px] ${
              !editingProperty && !isCreatingProperty && activeTab === 'profile'
                ? 'text-white bg-white/15 font-black shadow-xs'
                : 'text-emerald-200/70 hover:text-white hover:bg-white/5 font-semibold'
            }`}
            title="Perfil y Configuración"
          >
            <User
              className={`h-5 w-5 mb-1 ${
                !editingProperty && !isCreatingProperty && activeTab === 'profile'
                  ? 'text-emerald-300'
                  : 'text-emerald-400/80'
              }`}
            />
            <span className="text-[11px] tracking-tight leading-none">Perfil</span>
          </button>
        </div>
      </nav>

      {/* ======================================================== */}
      {/* MODAL: BÚSQUEDA GLOBAL */}
      {/* ======================================================== */}
      <AdminGlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onNavigateTab={setActiveTab}
        onSelectProperty={(lot) => {
          handleOpenEdit(lot);
          setIsSearchModalOpen(false);
        }}
      />

      {/* ======================================================== */}
      {/* MODAL: EDIT / CREATE PROPERTY */}
      {/* ======================================================== */}
      <AdminPropertyModal
        key={propertyToEdit?.id || (isModalOpen ? 'open-new' : 'closed')}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPropertyToEdit(null);
        }}
        onSave={handleSaveProperty}
        onDelete={(id) => {
          deleteProperty(id);
          setIsModalOpen(false);
          setPropertyToEdit(null);
        }}
        propertyToEdit={propertyToEdit}
      />

      {/* ======================================================== */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ======================================================== */}
      {propertyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="h-12 w-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900">¿Eliminar Inmueble?</h3>
              <p className="text-xs text-slate-500">
                Estás a punto de eliminar definitivamente el lote{' '}
                <strong className="text-slate-900">{propertyToDelete.code}</strong> (
                {propertyToDelete.name}). Esta acción no se puede revertir.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPropertyToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
