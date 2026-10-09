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
  Eye,
  Star,
  Copy,
  Check,
  AlertTriangle,
  ShieldCheck,
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
} from 'lucide-react';
import { useProperties } from '@/src/context/PropertyContext';
import { useAdminData } from '@/src/context/AdminDataContext';
import { AdminPropertyModal } from './AdminPropertyModal';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminPropertiesList } from './AdminPropertiesList';
import { AdminClientsView } from './AdminClientsView';
import { AdminAppointmentsView } from './AdminAppointmentsView';
import { AdminLegalFilesView } from './AdminLegalFilesView';
import { AdminDocumentsView } from './AdminDocumentsView';
import { AdminReportsView } from './AdminReportsView';
import { AdminSettingsView } from './AdminSettingsView';
import { AdminGlobalSearchModal } from './AdminGlobalSearchModal';
import { AdminNotificationsDropdown } from './AdminNotificationsDropdown';
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

  // Navigation tab state (default to 'overview' - Dashboard as requested in Section 1)
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

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
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Profile & Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Status updating feedback
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  // Admin user details
  const [adminEmail, setAdminEmail] = useState<string>('noemaliza01@gmail.com');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored =
        localStorage.getItem('mgm_admin_user_email') ||
        sessionStorage.getItem('mgm_admin_user_email');
      if (stored) setAdminEmail(stored);
    }
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
      window.location.hash = '';
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

  const handleSaveProperty = (data: Omit<LotProperty, 'id'>, id?: string) => {
    if (id) {
      updateProperty(id, data);
    } else {
      addProperty(data);
    }
  };

  const handleToggleStatusWithFeedback = async (id: string) => {
    setUpdatingStatusId(id);
    await toggleStatus(id);
    setTimeout(() => setUpdatingStatusId(null), 300);
  };

  const confirmDelete = () => {
    if (propertyToDelete) {
      deleteProperty(propertyToDelete.id);
      setPropertyToDelete(null);
    }
  };

  // Change Password Handler via Supabase Auth
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden.');
      return;
    }

    setPasswordLoading(true);

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setPasswordError(`Error de Supabase: ${error.message}`);
      } else {
        setPasswordSuccess('¡Contraseña actualizada con éxito en Supabase!');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: unknown) {
      setPasswordError(
        err instanceof Error ? err.message : 'Error al conectar con el servicio de autenticación.'
      );
    } finally {
      setPasswordLoading(false);
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

          {/* Sidebar Navigation Items with Clean Active Indicators */}
          <nav className="space-y-1" aria-label="Navegación del panel">
            {/* 1. Dashboard */}
            <button
              type="button"
              onClick={() => {
                if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                setEditingProperty(null);
                setIsCreatingProperty(false);
                setActiveTab('overview');
              }}
              className={`relative w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
              } rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                !editingProperty && !isCreatingProperty && activeTab === 'overview'
                  ? 'bg-white text-emerald-950 shadow-md font-black translate-x-0.5'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/10'
              }`}
              title="Dashboard"
            >
              <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                <LayoutDashboard
                  className={`h-4 w-4 shrink-0 ${
                    !editingProperty && !isCreatingProperty && activeTab === 'overview'
                      ? 'text-emerald-800'
                      : 'opacity-70'
                  }`}
                />
                {!isSidebarCollapsed && <span className="truncate">Dashboard</span>}
              </div>
            </button>

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
              title="Propiedades"
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

            {/* 3. Clientes */}
            <button
              type="button"
              onClick={() => {
                if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                setEditingProperty(null);
                setIsCreatingProperty(false);
                setActiveTab('clients');
              }}
              className={`relative w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
              } rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                !editingProperty && !isCreatingProperty && activeTab === 'clients'
                  ? 'bg-white text-emerald-950 shadow-md font-black translate-x-0.5'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/10'
              }`}
              title="Clientes"
            >
              <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                <Users
                  className={`h-4 w-4 shrink-0 ${
                    !editingProperty && !isCreatingProperty && activeTab === 'clients'
                      ? 'text-emerald-800'
                      : 'opacity-70'
                  }`}
                />
                {!isSidebarCollapsed && <span className="truncate">Clientes</span>}
              </div>
              {!isSidebarCollapsed && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    !editingProperty && !isCreatingProperty && activeTab === 'clients'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-emerald-900/60 text-emerald-300'
                  }`}
                >
                  {clients.length}
                </span>
              )}
            </button>

            {/* 4. Citas y visitas */}
            <button
              type="button"
              onClick={() => {
                if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                setEditingProperty(null);
                setIsCreatingProperty(false);
                setActiveTab('appointments');
              }}
              className={`relative w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
              } rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                !editingProperty && !isCreatingProperty && activeTab === 'appointments'
                  ? 'bg-white text-emerald-950 shadow-md font-black translate-x-0.5'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/10'
              }`}
              title="Citas y visitas"
            >
              <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                <Calendar
                  className={`h-4 w-4 shrink-0 ${
                    !editingProperty && !isCreatingProperty && activeTab === 'appointments'
                      ? 'text-emerald-800'
                      : 'opacity-70'
                  }`}
                />
                {!isSidebarCollapsed && <span className="truncate">Citas y visitas</span>}
              </div>
              {!isSidebarCollapsed && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    !editingProperty && !isCreatingProperty && activeTab === 'appointments'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-emerald-900/60 text-emerald-300'
                  }`}
                >
                  {appointments.length}
                </span>
              )}
            </button>

            {/* 5. Expedientes legales */}
            <button
              type="button"
              onClick={() => {
                if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                setEditingProperty(null);
                setIsCreatingProperty(false);
                setActiveTab('legalFiles');
              }}
              className={`relative w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
              } rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                !editingProperty && !isCreatingProperty && activeTab === 'legalFiles'
                  ? 'bg-white text-emerald-950 shadow-md font-black translate-x-0.5'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/10'
              }`}
              title="Expedientes legales"
            >
              <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                <FileCheck
                  className={`h-4 w-4 shrink-0 ${
                    !editingProperty && !isCreatingProperty && activeTab === 'legalFiles'
                      ? 'text-emerald-800'
                      : 'opacity-70'
                  }`}
                />
                {!isSidebarCollapsed && <span className="truncate">Expedientes legales</span>}
              </div>
            </button>

            {/* 6. Documentos */}
            <button
              type="button"
              onClick={() => {
                if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                setEditingProperty(null);
                setIsCreatingProperty(false);
                setActiveTab('documentsManager');
              }}
              className={`relative w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
              } rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                !editingProperty && !isCreatingProperty && activeTab === 'documentsManager'
                  ? 'bg-white text-emerald-950 shadow-md font-black translate-x-0.5'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/10'
              }`}
              title="Documentos"
            >
              <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                <FileText
                  className={`h-4 w-4 shrink-0 ${
                    !editingProperty && !isCreatingProperty && activeTab === 'documentsManager'
                      ? 'text-emerald-800'
                      : 'opacity-70'
                  }`}
                />
                {!isSidebarCollapsed && <span className="truncate">Documentos</span>}
              </div>
              {!isSidebarCollapsed && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    !editingProperty && !isCreatingProperty && activeTab === 'documentsManager'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-emerald-900/60 text-emerald-300'
                  }`}
                >
                  {documents.length}
                </span>
              )}
            </button>

            {/* 7. Reportes */}
            <button
              type="button"
              onClick={() => {
                if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                setEditingProperty(null);
                setIsCreatingProperty(false);
                setActiveTab('reports');
              }}
              className={`relative w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
              } rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                !editingProperty && !isCreatingProperty && activeTab === 'reports'
                  ? 'bg-white text-emerald-950 shadow-md font-black translate-x-0.5'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/10'
              }`}
              title="Reportes"
            >
              <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                <TrendingUp
                  className={`h-4 w-4 shrink-0 ${
                    !editingProperty && !isCreatingProperty && activeTab === 'reports'
                      ? 'text-emerald-800'
                      : 'opacity-70'
                  }`}
                />
                {!isSidebarCollapsed && <span className="truncate">Reportes</span>}
              </div>
            </button>

            {/* Separador visual */}
            <div className="py-1.5">
              <div className="border-t border-emerald-900/60" />
            </div>

            {/* Perfil */}
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
              title="Perfil"
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

            {/* Configuración */}
            <button
              type="button"
              onClick={() => {
                if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                setEditingProperty(null);
                setIsCreatingProperty(false);
                setActiveTab('settings');
              }}
              className={`relative w-full flex items-center ${
                isSidebarCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
              } rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                !editingProperty && !isCreatingProperty && activeTab === 'settings'
                  ? 'bg-white text-emerald-950 shadow-md font-black translate-x-0.5'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/10'
              }`}
              title="Configuración"
            >
              <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                <Settings
                  className={`h-4 w-4 shrink-0 ${
                    !editingProperty && !isCreatingProperty && activeTab === 'settings'
                      ? 'text-emerald-800'
                      : 'opacity-70'
                  }`}
                />
                {!isSidebarCollapsed && <span className="truncate">Configuración</span>}
              </div>
            </button>
          </nav>
        </div>

        {/* Sidebar Bottom Profile Card */}
        <div className="pt-4 border-t border-emerald-900/60 mt-4 space-y-2">
          {!isSidebarCollapsed ? (
            <div className="flex items-center justify-between text-[11px] text-emerald-400/80 px-2">
              <span className="truncate font-mono">Sociedad Civil MGM</span>
              <button
                type="button"
                onClick={onLogout}
                className="hover:text-rose-300 font-bold transition-colors cursor-pointer shrink-0 ml-2"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={onLogout}
                className="p-2 rounded-xl text-rose-300 hover:text-white hover:bg-rose-500/20 transition-colors cursor-pointer"
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
                    {activeTab === 'overview' && 'Dashboard General'}
                    {activeTab === 'inventory' && 'Propiedades en Cartera'}
                    {activeTab === 'clients' && 'Clientes e Interesados'}
                    {activeTab === 'appointments' && 'Agenda de Citas y Visitas'}
                    {activeTab === 'legalFiles' && 'Expedientes Legales Notariales'}
                    {activeTab === 'documentsManager' && 'Gestor Central de Documentos'}
                    {activeTab === 'reports' && 'Reportes & Métricas Operativas'}
                    {activeTab === 'profile' && 'Mi Perfil & Seguridad de Acceso'}
                    {activeTab === 'settings' && 'Configuración del Sistema'}
                    {activeTab === 'simulator' && 'Cotizador de Crédito Directo'}
                    {activeTab === 'system' && 'Supabase & Optimización de Medios'}
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">
                    {activeTab === 'overview' && 'Visión global, KPIs de venta y actividades comerciales en tiempo real'}
                    {activeTab === 'inventory' && `${properties.length} propiedades reales en catálogo activo`}
                    {activeTab === 'clients' && `${clients.length} clientes e interesados registrados`}
                    {activeTab === 'appointments' && `${appointments.length} citas programadas en agenda`}
                    {activeTab === 'legalFiles' && `${legalFiles.length} expedientes de propiedad bajo supervisión`}
                    {activeTab === 'documentsManager' && `${documents.length} archivos y fichas técnicas indexadas`}
                    {activeTab === 'reports' && 'Estadísticas ejecutivas del portafolio inmobiliario'}
                    {activeTab === 'profile' && 'Gestión de credenciales, seguridad de sesión y cambio de contraseña'}
                    {activeTab === 'settings' && 'Parámetros institucionales y financiamiento comercial'}
                    {activeTab === 'simulator' && 'Cálculo de entrada, cuotas mensuales y proyecciones'}
                    {activeTab === 'system' && 'Conexión a base de datos y optimizador de medios'}
                  </p>
                </div>

                {/* Right Controls: Búsqueda Global, Web Button, Notificaciones */}
                <div className="flex items-center gap-3">
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

                  {/* View Public Web Button */}
                  <button
                    type="button"
                    onClick={onViewCatalog}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                    title="Ver portal web público"
                  >
                    <Eye className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Ver Web</span>
                  </button>

                  {/* Notification Dropdown */}
                  <AdminNotificationsDropdown onNavigateTab={setActiveTab} />

                  {/* Botón de Citas (Visible en sección Clientes, al lado de notificaciones) */}
                  {activeTab === 'clients' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('appointments')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer animate-in fade-in"
                      title="Ver Agenda de Citas y Visitas"
                    >
                      <Calendar className="h-3.5 w-3.5 text-emerald-300" />
                      <span>Citas</span>
                    </button>
                  )}
                </div>
              </div>

            {/* ======================================================== */}
            {/* TAB CONTENT: DASHBOARD OVERVIEW (SECTION 1) */}
            {/* ======================================================== */}
            {activeTab === 'overview' && (
              <AdminDashboardOverview
                onNavigateTab={setActiveTab}
                onOpenCreateProperty={handleOpenCreate}
              />
            )}

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
            {/* TAB CONTENT: CLIENTES E INTERESADOS (SECTION 3) */}
            {/* ======================================================== */}
            {activeTab === 'clients' && <AdminClientsView />}

            {/* ======================================================== */}
            {/* TAB CONTENT: CITAS Y VISITAS (SECTION 4) */}
            {/* ======================================================== */}
            {activeTab === 'appointments' && <AdminAppointmentsView />}

            {/* ======================================================== */}
            {/* TAB CONTENT: EXPEDIENTES LEGALES (SECTION 5) */}
            {/* ======================================================== */}
            {activeTab === 'legalFiles' && <AdminLegalFilesView />}

            {/* ======================================================== */}
            {/* TAB CONTENT: GESTOR DE DOCUMENTOS (SECTION 6) */}
            {/* ======================================================== */}
            {activeTab === 'documentsManager' && <AdminDocumentsView />}

            {/* ======================================================== */}
            {/* TAB CONTENT: REPORTES (SECTION 7) */}
            {/* ======================================================== */}
            {activeTab === 'reports' && <AdminReportsView />}

            {/* ======================================================== */}
            {/* TAB CONTENT: CONFIGURACIÓN (SECTION 8) */}
            {/* ======================================================== */}
            {activeTab === 'settings' && <AdminSettingsView />}

            {/* ======================================================== */}
            {/* TAB CONTENT: COTIZADOR */}
            {/* ======================================================== */}
            {activeTab === 'simulator' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-200">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Simulador de Financiamiento</h3>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Inmueble</label>
                    <select
                      value={simLotId}
                      onChange={(e) => setSimLotId(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                    >
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.code} - {p.name} (${p.priceUSD.toLocaleString()} USD)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Entrada ({simDownPercent}%)</span>
                      <span className="font-mono font-bold">${simDownAmount.toLocaleString()} USD</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="60"
                      step="5"
                      value={simDownPercent}
                      onChange={(e) => setSimDownPercent(Number(e.target.value))}
                      className="w-full accent-emerald-600"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-100/70 border border-emerald-300">
                    <span className="text-[10px] font-bold uppercase text-emerald-800 block">Cuota Mensual Fija</span>
                    <div className="text-2xl font-black font-mono text-emerald-950">
                      ${simMonthly.toLocaleString()} <span className="text-xs font-normal">USD / mes</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">Mensaje para WhatsApp</span>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto">
                      {simQuoteMessage}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyQuote}
                    className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    {copiedSim ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    <span>{copiedSim ? '¡Copiado!' : 'Copiar Cotización para WhatsApp'}</span>
                  </button>
                </div>
              </div>
            )}


            {/* ======================================================== */}
            {/* TAB CONTENT: SUPABASE & TESTBENCH */}
            {/* ======================================================== */}
            {activeTab === 'system' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Supabase Cloud PostgreSQL 17</h3>
                    <p className="text-xs text-slate-500 font-mono">ospsnohsrhmqtnyfndhh.supabase.co</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                    🟢 Conectado & Sincronizado
                  </span>
                </div>

                {/* Batch File Compressor Tool */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Probador de Conversión a WebP en Vivo
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Prueba la compresión instantánea de cualquier imagen sin subirla a la base de datos.
                      </p>
                    </div>
                    <label className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all cursor-pointer">
                      <span>Probar Archivos</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleTestOptimizerUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {isConvertingBatch && (
                    <div className="text-center py-2 text-xs text-emerald-700 animate-pulse">
                      ⚡ Convirtiendo imágenes a WebP en tu navegador...
                    </div>
                  )}

                  {testedFiles.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      {testedFiles.map((tf, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                          <span className="truncate max-w-[150px] font-semibold text-slate-700">{tf.name}</span>
                          <span className="font-mono text-emerald-700 font-bold">
                            {tf.originalKB}KB ➔ {tf.webpKB}KB (-{tf.savings}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB CONTENT: MI PERFIL & SEGURIDAD (FULL PAGE VIEW) */}
            {/* ======================================================== */}
            {activeTab === 'profile' && (
              <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
                {/* Banner de Cabecera de Cuenta */}
                <div className="bg-gradient-to-r from-[#0d2e1a] via-[#124225] to-[#1a5b33] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full pointer-events-none blur-2xl" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-white font-black text-xl sm:text-2xl flex items-center justify-center shadow-inner">
                        {adminEmail.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                            Perfil de Administrador
                          </h3>
                          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Super Admin
                          </span>
                        </div>
                        <p className="text-sm text-emerald-200/90 font-mono mt-1">{adminEmail}</p>
                        <p className="text-xs text-emerald-300/70 mt-0.5">
                          Sociedad Civil MGM Inmobiliaria · Acceso Cifrado
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={onLogout}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Formulario y Detalles de Seguridad en Rejilla */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Formulario de Cambio de Contraseña */}
                  <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                      <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <KeyRound className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">
                          Cambiar Contraseña de Acceso
                        </h4>
                        <p className="text-xs text-slate-500">
                          Actualización criptográfica directa en Supabase Auth
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                      {passwordError && (
                        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2.5">
                          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                          <span>{passwordError}</span>
                        </div>
                      )}

                      {passwordSuccess && (
                        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2.5">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                          <span>{passwordSuccess}</span>
                        </div>
                      )}

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                          Nueva Contraseña
                        </label>
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Mínimo 6 caracteres..."
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1.5">
                          Confirmar Nueva Contraseña
                        </label>
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repite la contraseña..."
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={passwordLoading}
                          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                          <Lock className="h-3.5 w-3.5" />
                          <span>{passwordLoading ? 'Guardando en Supabase...' : 'Actualizar Contraseña'}</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Panel Lateral: Parámetros de Seguridad de Sesión */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-slate-50/80 rounded-3xl border border-slate-200 p-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-700" />
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                          Seguridad de Sesión
                        </h4>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="p-3 bg-white rounded-2xl border border-slate-200/80">
                          <span className="text-[11px] font-bold text-slate-400 block uppercase">
                            Proveedor de Identidad
                          </span>
                          <span className="font-semibold text-slate-800">
                            Supabase Cloud Auth (JWT 256-bit)
                          </span>
                        </div>

                        <div className="p-3 bg-white rounded-2xl border border-slate-200/80">
                          <span className="text-[11px] font-bold text-slate-400 block uppercase">
                            Protección de Canal
                          </span>
                          <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            TLS 1.3 / HTTPS Cifrado
                          </span>
                        </div>

                        <div className="p-3 bg-white rounded-2xl border border-slate-200/80">
                          <span className="text-[11px] font-bold text-slate-400 block uppercase">
                            Nivel de Privilegios
                          </span>
                          <span className="font-semibold text-slate-800">
                            Lectura y Escritura Total (CRUD Lotes)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-800 space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <span>Recomendación de Seguridad</span>
                      </p>
                      <p className="text-amber-700/90 leading-relaxed">
                        Usa una clave de al menos 8 caracteres con números y símbolos para mantener protegidos los datos y catálogos de MGM Inmobiliaria.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* MOBILE BOTTOM NAVIGATION BAR (Fixed at bottom on < lg) */}
      {/* ======================================================== */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d2e1a]/95 backdrop-blur-md border-t border-emerald-900/80 px-2 py-1.5 flex items-center justify-between overflow-x-auto no-scrollbar gap-1 shadow-2xl"
        aria-label="Navegación móvil del panel de administración"
      >
        <button
          type="button"
          onClick={() => {
            setEditingProperty(null);
            setIsCreatingProperty(false);
            setActiveTab('overview');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold shrink-0 transition-all cursor-pointer ${
            !editingProperty && !isCreatingProperty && activeTab === 'overview'
              ? 'text-white bg-white/15'
              : 'text-emerald-200/70 hover:text-white'
          }`}
        >
          <LayoutDashboard className="h-4 w-4 mb-0.5" />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setEditingProperty(null);
            setIsCreatingProperty(false);
            setActiveTab('inventory');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold shrink-0 transition-all cursor-pointer ${
            !editingProperty && !isCreatingProperty && activeTab === 'inventory'
              ? 'text-white bg-white/15'
              : 'text-emerald-200/70 hover:text-white'
          }`}
        >
          <Building2 className="h-4 w-4 mb-0.5" />
          <span>Propiedades</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setEditingProperty(null);
            setIsCreatingProperty(false);
            setActiveTab('clients');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold shrink-0 transition-all cursor-pointer ${
            !editingProperty && !isCreatingProperty && activeTab === 'clients'
              ? 'text-white bg-white/15'
              : 'text-emerald-200/70 hover:text-white'
          }`}
        >
          <Users className="h-4 w-4 mb-0.5" />
          <span>Clientes</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setEditingProperty(null);
            setIsCreatingProperty(false);
            setActiveTab('legalFiles');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold shrink-0 transition-all cursor-pointer ${
            !editingProperty && !isCreatingProperty && activeTab === 'legalFiles'
              ? 'text-white bg-white/15'
              : 'text-emerald-200/70 hover:text-white'
          }`}
        >
          <FileCheck className="h-4 w-4 mb-0.5" />
          <span>Legal</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setEditingProperty(null);
            setIsCreatingProperty(false);
            setActiveTab('documentsManager');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold shrink-0 transition-all cursor-pointer ${
            !editingProperty && !isCreatingProperty && activeTab === 'documentsManager'
              ? 'text-white bg-white/15'
              : 'text-emerald-200/70 hover:text-white'
          }`}
        >
          <FileText className="h-4 w-4 mb-0.5" />
          <span>Docs</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setEditingProperty(null);
            setIsCreatingProperty(false);
            setActiveTab('profile');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold shrink-0 transition-all cursor-pointer ${
            !editingProperty && !isCreatingProperty && activeTab === 'profile'
              ? 'text-white bg-white/15'
              : 'text-emerald-200/70 hover:text-white'
          }`}
          title="Credenciales y Perfil de Administrador"
        >
          <User className="h-4 w-4 mb-0.5" />
          <span>Perfil</span>
        </button>
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
