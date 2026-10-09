'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import {
  LayoutDashboard,
  Building2,
  Plus,
  FileText,
  Calculator,
  Database,
  Search,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  Download,
  RefreshCw,
  Edit2,
  Trash2,
  ExternalLink,
  LogOut,
  Star,
  Copy,
  Check,
  AlertTriangle,
  MapPin,
  ChevronRight,
  ChevronLeft,
  X,
  FileCheck,
  Upload,
  Zap,
  Bell,
  Settings,
  User,
  KeyRound,
  Lock,
  ChevronDown,
  Calendar,
  Share2,
  ArrowRight,
  SlidersHorizontal,
  Users,
  BarChart3,
  Globe,
} from 'lucide-react';
import { useProperties } from '@/src/context/PropertyContext';
import { useAdminData } from '@/src/context/AdminDataContext';
import { AdminPropertyModal } from './AdminPropertyModal';
import { AdminPropertiesList } from './AdminPropertiesList';
import { AdminProfileView } from './AdminProfileView';
import { AdminGlobalSearchModal } from './AdminGlobalSearchModal';
import type { LotProperty } from '@/src/data/lots';
import { getLotWhatsAppUrl } from '@/src/data/lots';
import { WhatsAppIcon } from '../SocialIcons';
import type { PageView } from '@/src/data/navigation';
import { supabase } from '@/src/lib/supabase';
import { convertImageToWebP } from '@/src/lib/imageOptimizer';
import { LogoMGM } from '../LogoMGM';

export type AdminTab =
  | 'overview'
  | 'inventory'
  | 'clients'
  | 'appointments'
  | 'legalFiles'
  | 'documentsManager'
  | 'reports'
  | 'profile'
  | 'settings'
  | 'simulator'
  | 'system';

interface AdminDashboardProps {
  onLogout: () => void;
  onViewCatalog: () => void;
  onSelectLotPreview?: (lot: LotProperty) => void;
  onNavigate?: (page: PageView) => void;
}

export function AdminDashboard({
  onLogout,
  onViewCatalog,
  onSelectLotPreview,
  onNavigate,
}: AdminDashboardProps) {
  const {
    properties,
    metrics,
    addProperty,
    updateProperty,
    deleteProperty,
    toggleStatus,
    setStatus,
    resetToDefaults,
  } = useProperties();

  const { clients, appointments, legalFiles, documents } = useAdminData();

  // Navigation tab state (default to 'inventory' - Propiedades)
  const [activeTab, setActiveTab] = useState<AdminTab>('inventory');

  // Global search modal state
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');

  // Interactive selected row (for the prominent highlighted card row like in the reference)
  const [selectedRowId, setSelectedRowId] = useState<string>(properties[0]?.id || '');

  // Full-page property editor & creator states
  const [editingProperty, setEditingProperty] = useState<LotProperty | null>(null);
  const [isCreatingProperty, setIsCreatingProperty] = useState(false);

  // Collapsible sidebar state (collapses on New Property, expands on icon click)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<LotProperty | null>(null);
  const [propertyToDelete, setPropertyToDelete] = useState<LotProperty | null>(null);

  // Status updating feedback
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

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

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Commercial Simulator State
  const [simLotId, setSimLotId] = useState<string>(properties[0]?.id || '');
  const [simDownPercent, setSimDownPercent] = useState<number>(30);
  const [simMonths, setSimMonths] = useState<number>(48);
  const [copiedSim, setCopiedSim] = useState(false);

  // Interactive Optimizer Tool State
  const [testedFiles, setTestedFiles] = useState<
    { name: string; originalKB: number; webpKB: number; savings: number; previewUrl: string }[]
  >([]);
  const [isConvertingBatch, setIsConvertingBatch] = useState(false);

  const handleTestOptimizerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsConvertingBatch(true);
    const results: {
      name: string;
      originalKB: number;
      webpKB: number;
      savings: number;
      previewUrl: string;
    }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const originalKB = Math.round(file.size / 1024);
      let webpKB = originalKB;
      let previewUrl = '';

      if (file.type.startsWith('image/')) {
        const optimized = await convertImageToWebP(file);
        webpKB = Math.round(optimized.size / 1024);
        previewUrl = URL.createObjectURL(optimized);
      } else {
        previewUrl = URL.createObjectURL(file);
      }

      const savings = originalKB > 0 ? Math.round(((originalKB - webpKB) / originalKB) * 100) : 0;
      results.push({
        name: file.name,
        originalKB,
        webpKB,
        savings: Math.max(0, savings),
        previewUrl,
      });
    }

    setTestedFiles((prev) => [...results, ...prev]);
    setIsConvertingBatch(false);
  };

  // Filtered properties
  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.code.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.zone.toLowerCase().includes(q) ||
        p.project.toLowerCase().includes(q);

      const matchesStatus = filterStatus === 'Todos' || p.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [properties, search, filterStatus]);

  // Selected Lot for Simulator
  const selectedSimLot = useMemo(() => {
    return properties.find((p) => p.id === simLotId) || properties[0] || null;
  }, [properties, simLotId]);

  const simPrice = selectedSimLot ? selectedSimLot.priceUSD : 0;
  const simDownAmount = Math.round((simPrice * simDownPercent) / 100);
  const simBalance = simPrice - simDownAmount;
  const simMonthly = simMonths > 0 ? Math.round(simBalance / simMonths) : 0;

  const simQuoteMessage = selectedSimLot
    ? `*PROPUESTA DE FINANCIAMIENTO DIRECTO · MGM INMOBILIARIA*\n\n` +
      `Estimado cliente, compartimos la cotización oficial para el inmueble:\n` +
      `📌 *Inmueble:* ${selectedSimLot.name} (${selectedSimLot.code})\n` +
      `📍 *Proyecto:* ${selectedSimLot.project}\n` +
      `📐 *Área:* ${selectedSimLot.areaM2} m² (${selectedSimLot.dimensions})\n` +
      `💰 *Precio de Venta:* $${simPrice.toLocaleString()} USD\n\n` +
      `*Plan de Crédito Directo (Sin Interés Bancario):*\n` +
      `✅ *Entrada (${simDownPercent}%):* $${simDownAmount.toLocaleString()} USD\n` +
      `✅ *Saldo a Financiar:* $${simBalance.toLocaleString()} USD\n` +
      `✅ *Plazo:* ${simMonths} meses\n` +
      `💵 *Cuota Mensual Fija:* $${simMonthly.toLocaleString()} USD / mes\n\n` +
      `📋 *Garantía Jurídica:* Escrituras individuales notariales inmediatas.\n` +
      `¿Desea coordinar una visita guiada al terreno?`
    : '';

  const handleCopyQuote = async () => {
    try {
      await navigator.clipboard.writeText(simQuoteMessage);
      setCopiedSim(true);
      setTimeout(() => setCopiedSim(false), 2500);
    } catch {
      // Fallback
    }
  };

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

  const handleToggleStatusWithFeedback = async (id: string) => {
    setUpdatingStatusId(id);
    try {
      await toggleStatus(id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar estado';
      alert(`No se pudo actualizar el estado: ${msg}`);
    } finally {
      setTimeout(() => setUpdatingStatusId(null), 300);
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
            {/* 1. Perfil & Configuración (Al principio de la barra lateral) */}
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

            {/* Separador visual sutil */}
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
              {!isSidebarCollapsed && <span className="truncate"> Nueva Propiedad</span>}
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
            title="Ver Perfil y Contraseña"
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
        } transition-all duration-300 ease-in-out p-4 sm:p-6 lg:p-8 flex flex-col justify-between overflow-x-hidden bg-white min-h-screen pb-24 lg:pb-8`}
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
              
              {/* TOP HEADER BAR with Global Search, Web View, and Notifications */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {activeTab === 'inventory' && 'Propiedades en Cartera'}
                    {activeTab === 'profile' && 'Perfil & Configuración'}
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">
                    {activeTab === 'inventory' && `${properties.length} propiedades reales en catálogo activo`}
                    {activeTab === 'profile' && 'Gestión de cuenta de administrador y parámetros de la inmobiliaria'}
                  </p>
                </div>

                {/* Right Controls: Búsqueda Global, Web Button, Notificaciones */}
                <div className="flex items-center gap-2.5">
                  {/* Botón para regresar al sitio web público */}
                  <button
                    type="button"
                    onClick={handleGoHome}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-600 hover:text-slate-900 transition-all cursor-pointer shadow-2xs font-semibold group"
                    title="Ver sitio web público"
                  >
                    <Globe className="h-3.5 w-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span className="hidden sm:inline">Ver Sitio Web</span>
                  </button>

                  {/* Búsqueda Global Trigger */}
                  <button
                    type="button"
                    onClick={() => setIsSearchModalOpen(true)}
                    className="flex items-center gap-2 pl-3.5 pr-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-2xs group"
                    title="Búsqueda global (Ctrl + K)"
                  >
                    <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-700 transition-colors" />
                    <span className="hidden sm:inline">Buscar en el panel...</span>
                    <span className="sm:hidden">Buscar...</span>
                    <kbd className="hidden sm:inline-block text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded-md font-mono text-slate-400">
                      ⌘K
                    </kbd>
                  </button>
                </div>
              </div>



            {/* ======================================================== */}
            {/* TAB CONTENT: PROPIEDADES (SECTION 2) */}
            {/* ======================================================== */}
            {activeTab === 'inventory' && (
              <AdminPropertiesList
                onOpenCreate={handleOpenCreate}
                onOpenEdit={handleOpenEdit}
              />
            )}



            {/* ======================================================== */}
            {/* TAB CONTENT: PERFIL & CONFIGURACIÓN UNIFICADO */}
            {/* ======================================================== */}
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
        <div className="max-w-md mx-auto grid grid-cols-3 items-center gap-2">
          {/* 1. Propiedades */}
          <button
            type="button"
            onClick={() => {
              setEditingProperty(null);
              setIsCreatingProperty(false);
              setActiveTab('inventory');
            }}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all cursor-pointer min-h-[50px] ${
              !editingProperty && !isCreatingProperty && activeTab === 'inventory'
                ? 'text-white bg-white/15 font-black shadow-xs'
                : 'text-emerald-200/70 hover:text-white hover:bg-white/5 font-semibold'
            }`}
          >
            <Building2
              className={`h-5 w-5 mb-1 ${
                !editingProperty && !isCreatingProperty && activeTab === 'inventory'
                  ? 'text-emerald-300'
                  : 'text-emerald-400/80'
              }`}
            />
            <span className="text-[11px] tracking-tight leading-none">Propiedades</span>
          </button>

          {/* 2. Nueva Propiedad */}
          <button
            type="button"
            onClick={handleOpenCreate}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all cursor-pointer min-h-[50px] ${
              isCreatingProperty
                ? 'text-white bg-white/15 font-black shadow-xs'
                : 'text-emerald-200/70 hover:text-white hover:bg-white/5 font-semibold'
            }`}
            title="Publicar Nueva Propiedad"
          >
            <Plus
              className={`h-5 w-5 mb-1 ${
                isCreatingProperty ? 'text-emerald-300' : 'text-emerald-400/80'
              }`}
            />
            <span className="text-[11px] tracking-tight leading-none">Nueva</span>
          </button>

          {/* 3. Perfil */}
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
