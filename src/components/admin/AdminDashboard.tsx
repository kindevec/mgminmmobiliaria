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
  Sparkles,
  ChevronRight,
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
} from 'lucide-react';
import { useProperties } from '@/src/context/PropertyContext';
import { AdminPropertyModal } from './AdminPropertyModal';
import type { LotProperty } from '@/src/data/lots';
import { getLotWhatsAppUrl } from '@/src/data/lots';
import { WhatsAppIcon } from '../SocialIcons';
import type { PageView } from '@/src/data/navigation';
import { supabase } from '@/src/lib/supabase';
import { convertImageToWebP } from '@/src/lib/imageOptimizer';
import { LogoMGM } from '../LogoMGM';

type AdminTab = 'inventory' | 'overview' | 'simulator' | 'documents' | 'system';

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

  // Navigation tab state (default to 'inventory' to match the uploaded reference design)
  const [activeTab, setActiveTab] = useState<AdminTab>('inventory');

  // Filters & Search
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');

  // Interactive selected row (for the prominent highlighted card row like in the reference)
  const [selectedRowId, setSelectedRowId] = useState<string>(properties[0]?.id || '');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<LotProperty | null>(null);
  const [propertyToDelete, setPropertyToDelete] = useState<LotProperty | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Profile & Password Modal
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
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

  const handleOpenCreate = () => {
    if (onNavigate) {
      onNavigate('new_property');
    } else {
      setPropertyToEdit(null);
      setIsModalOpen(true);
    }
  };

  const handleOpenEdit = (lot: LotProperty) => {
    setPropertyToEdit(lot);
    setIsModalOpen(true);
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
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
      {/* ======================================================== */}
      {/* MAIN CONTAINER: FLOATING SAAS DASHBOARD CARD */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl sm:rounded-4xl shadow-2xl shadow-slate-300/50 border border-slate-200/90 overflow-hidden flex flex-col lg:flex-row min-h-[780px]">
        
        {/* ======================================================== */}
        {/* LEFT SIDEBAR (MGM BRANDED DEEP FOREST GREEN) */}
        {/* ======================================================== */}
        <aside className="w-full lg:w-64 bg-[#0d2e1a] text-emerald-100/90 flex flex-col justify-between shrink-0 p-5 sm:p-6 select-none border-b lg:border-b-0 lg:border-r border-emerald-900/60">
          <div>
            {/* Brand Header */}
            <div className="flex items-center gap-3 pb-8 pt-2 px-2">
              <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center p-1.5 border border-white/15 shadow-sm">
                <LogoMGM variant="icon" isGhost={true} className="h-full w-auto" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-black tracking-tight text-white leading-tight">
                  MGM Inmobiliaria
                </h2>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase tracking-wider block">
                  Admin Suite 2026
                </span>
              </div>
            </div>

            {/* Sidebar Navigation Items with Clean Active Indicators */}
            <nav className="space-y-1.5" aria-label="Navegación del panel">
              {/* Dashboard / Resumen */}
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`relative w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-white text-emerald-950 shadow-md font-black translate-x-1'
                    : 'text-emerald-100/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <LayoutDashboard className={`h-4 w-4 ${activeTab === 'overview' ? 'text-emerald-800' : 'opacity-70'}`} />
                <span>Dashboard</span>
              </button>

              {/* Propiedades / Catálogo (Primary focus matching the uploaded design) */}
              <button
                type="button"
                onClick={() => setActiveTab('inventory')}
                className={`relative w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'inventory'
                    ? 'bg-white text-emerald-950 shadow-md font-black translate-x-1'
                    : 'text-emerald-100/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Building2 className={`h-4 w-4 ${activeTab === 'inventory' ? 'text-emerald-800' : 'opacity-70'}`} />
                  <span>Propiedades</span>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    activeTab === 'inventory'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-emerald-900/60 text-emerald-300'
                  }`}
                >
                  {properties.length}
                </span>
              </button>

              {/* Estadísticas & Cotizador */}
              <button
                type="button"
                onClick={() => setActiveTab('simulator')}
                className={`relative w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'simulator'
                    ? 'bg-white text-emerald-950 shadow-md font-black translate-x-1'
                    : 'text-emerald-100/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Calculator className={`h-4 w-4 ${activeTab === 'simulator' ? 'text-emerald-800' : 'opacity-70'}`} />
                <span>Cotizador Crédito</span>
              </button>

              {/* Nueva Propiedad */}
              <button
                type="button"
                onClick={handleOpenCreate}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold text-emerald-100/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4 opacity-70" />
                <span>Nueva Propiedad</span>
              </button>

              {/* Documentos & Legal */}
              <button
                type="button"
                onClick={() => setActiveTab('documents')}
                className={`relative w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'documents'
                    ? 'bg-white text-emerald-950 shadow-md font-black translate-x-1'
                    : 'text-emerald-100/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <FileCheck className={`h-4 w-4 ${activeTab === 'documents' ? 'text-emerald-800' : 'opacity-70'}`} />
                <span>Expedientes Legal</span>
              </button>

              {/* Infraestructura Supabase */}
              <button
                type="button"
                onClick={() => setActiveTab('system')}
                className={`relative w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'system'
                    ? 'bg-white text-emerald-950 shadow-md font-black translate-x-1'
                    : 'text-emerald-100/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Database className={`h-4 w-4 ${activeTab === 'system' ? 'text-emerald-800' : 'opacity-70'}`} />
                <span>Supabase & Medios</span>
              </button>
            </nav>
          </div>

          {/* Sidebar Bottom Profile Card */}
          <div className="pt-6 border-t border-emerald-900/60 mt-6 space-y-3">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="w-full p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left flex items-center gap-3 cursor-pointer group"
              title="Ver Perfil y Cambiar Contraseña"
            >
              <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                {adminEmail.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">{adminEmail}</div>
                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span>Mi Perfil & Seguridad</span>
                  <ChevronRight className="h-2.5 w-2.5 opacity-60" />
                </div>
              </div>
            </button>

            <div className="flex items-center justify-between text-[11px] text-emerald-400/80 px-1">
              <span>Sociedad Civil MGM</span>
              <button
                type="button"
                onClick={onLogout}
                className="hover:text-rose-300 font-semibold transition-colors cursor-pointer"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </aside>

        {/* ======================================================== */}
        {/* MAIN CANVAS (PURE WHITE, CLEAN & MODERN) */}
        {/* ======================================================== */}
        <main className="flex-1 p-5 sm:p-8 flex flex-col justify-between overflow-x-hidden bg-white">
          <div className="space-y-6">
            
            {/* TOP HEADER BAR (Matching reference layout with Search, Bell, Profile) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {activeTab === 'inventory' && 'Propiedades en Cartera'}
                  {activeTab === 'overview' && 'Resumen Ejecutivo & KPIs'}
                  {activeTab === 'simulator' && 'Cotizador de Crédito Directo'}
                  {activeTab === 'documents' && 'Expedientes Notariales & Planos'}
                  {activeTab === 'system' && 'Supabase & Optimización de Medios'}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">
                  {properties.length} propiedades reales en catálogo activo
                </p>
              </div>

              {/* Right Controls: Search, Web Button, Bell, Avatar */}
              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="relative w-48 sm:w-60">
                  <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar inmueble..."
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none transition-all"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* View Public Web Button */}
                <button
                  type="button"
                  onClick={onViewCatalog}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
                  title="Ver portal web público"
                >
                  <Eye className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Ver Web</span>
                </button>

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className="h-9 w-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                    title="2 Propiedades en seguimiento"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </button>
                </div>

                {/* Avatar with click to open Profile & Password */}
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer"
                  title="Haz clic para ver perfil y cambiar contraseña"
                >
                  <div className="h-7 w-7 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                    {adminEmail.slice(0, 2).toUpperCase()}
                  </div>
                  <Settings className="h-3.5 w-3.5 text-slate-400 hover:text-slate-700" />
                </button>
              </div>
            </div>

            {/* ======================================================== */}
            {/* TAB CONTENT: PROPIEDADES (INVENTORY - MATCHING IMAGE) */}
            {/* ======================================================== */}
            {activeTab === 'inventory' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                
                {/* Horizontal Filter Tabs (Directly matching 'All orders, Dispatch, Pending, Completed') */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-6 text-xs font-bold border-b border-slate-100 sm:border-0 pb-2 sm:pb-0">
                    {(['Todos', 'Disponible', 'En Reserva', 'Vendido'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setFilterStatus(st)}
                        className={`relative pb-1.5 transition-all cursor-pointer ${
                          filterStatus === st
                            ? 'text-slate-900 border-b-2 border-emerald-700 font-black'
                            : 'text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        {st === 'Todos' ? 'Todas las propiedades' : st}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleOpenCreate}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Nuevo Inmueble</span>
                    </button>
                  </div>
                </div>

                {/* Data Table with Rows matching reference design */}
                <div className="overflow-x-auto">
                  <div className="min-w-[700px] space-y-2">
                    
                    {/* Table Header Row */}
                    <div className="grid grid-cols-12 px-4 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <div className="col-span-2">Código / ID</div>
                      <div className="col-span-3">Inmueble</div>
                      <div className="col-span-3">Ubicación / Proyecto</div>
                      <div className="col-span-1 text-right">Precio</div>
                      <div className="col-span-2 text-center">Estado</div>
                      <div className="col-span-1 text-right">Acción</div>
                    </div>

                    {/* Table Data Rows */}
                    {filtered.map((lot) => {
                      const isSelected = selectedRowId === lot.id;
                      const isAvail = lot.status === 'Disponible';
                      const isRes = lot.status === 'En Reserva';

                      return (
                        <div
                          key={lot.id}
                          onClick={() => setSelectedRowId(lot.id)}
                          className={`grid grid-cols-12 items-center px-4 py-3 rounded-2xl transition-all cursor-pointer select-none ${
                            isSelected
                              ? 'bg-[#113d22] text-white shadow-xl shadow-emerald-950/20 translate-y-[-1px]'
                              : 'bg-white hover:bg-slate-50/80 text-slate-700 border border-slate-100 shadow-2xs'
                          }`}
                        >
                          {/* Code ID */}
                          <div className="col-span-2 font-mono font-bold text-xs flex items-center gap-2">
                            <span className={isSelected ? 'text-emerald-300' : 'text-slate-400'}>#</span>
                            <span className={isSelected ? 'text-white' : 'text-slate-800'}>{lot.code}</span>
                          </div>

                          {/* Image & Title */}
                          <div className="col-span-3 flex items-center gap-3 min-w-0 pr-2">
                            <div className="relative h-9 w-9 rounded-full overflow-hidden bg-slate-900 shrink-0 border border-black/10">
                              <Image
                                src={lot.image}
                                alt={lot.name}
                                fill
                                sizes="36px"
                                className="object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className={`font-bold text-xs truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                {lot.name}
                              </div>
                              <div className={`text-[10px] truncate ${isSelected ? 'text-emerald-200/80' : 'text-slate-400'}`}>
                                {lot.areaM2} m² · {lot.dimensions}
                              </div>
                            </div>
                          </div>

                          {/* Location */}
                          <div className={`col-span-3 text-xs truncate pr-3 ${isSelected ? 'text-emerald-100/90' : 'text-slate-500'}`}>
                            {lot.project} · {lot.zone}
                          </div>

                          {/* Price */}
                          <div className={`col-span-1 text-right font-mono font-black text-xs ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            ${lot.priceUSD.toLocaleString()}
                          </div>

                          {/* Status with Color Dot */}
                          <div className="col-span-2 flex items-center justify-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStatusWithFeedback(lot.id);
                              }}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-white/20 text-white hover:bg-white/30 border border-white/20'
                                  : isAvail
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                                  : isRes
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                              }`}
                              title="Haz clic para alternar estado"
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  isAvail ? 'bg-emerald-500' : isRes ? 'bg-amber-500' : 'bg-slate-500'
                                }`}
                              />
                              <span>{lot.status}</span>
                            </button>
                          </div>

                          {/* Actions */}
                          <div className="col-span-1 flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEdit(lot);
                              }}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                isSelected
                                  ? 'text-white hover:bg-white/20'
                                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                              }`}
                              title="Editar Inmueble"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>

                            <a
                              href={getLotWhatsAppUrl(lot.code, lot.name, lot.priceUSD)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                isSelected
                                  ? 'text-emerald-300 hover:bg-white/20'
                                  : 'text-emerald-700 hover:bg-emerald-50'
                              }`}
                              title="Cotizar por WhatsApp"
                            >
                              <WhatsAppIcon size={14} />
                            </a>
                          </div>
                        </div>
                      );
                    })}

                    {filtered.length === 0 && (
                      <div className="text-center py-12 text-slate-400 text-xs">
                        No se encontraron inmuebles con este filtro.
                      </div>
                    )}
                  </div>
                </div>

                {/* Table Footer with Pagination matching reference design */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Mostrando {filtered.length} de {properties.length} inmuebles</span>
                  <div className="flex items-center gap-1 font-mono font-bold">
                    <button type="button" className="px-2 py-1 text-slate-300 cursor-not-allowed">‹</button>
                    <span className="px-2 py-1 bg-slate-900 text-white rounded-lg text-[11px]">1</span>
                    <button type="button" className="px-2 py-1 text-slate-300 cursor-not-allowed">›</button>
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB CONTENT: DASHBOARD & KPIS */}
            {/* ======================================================== */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Total Inventario
                    </span>
                    <span className="text-2xl font-black font-mono text-slate-900 mt-1 block">
                      ${(metrics.totalInventoryValueUSD / 1000).toFixed(0)}k USD
                    </span>
                    <span className="text-[11px] text-slate-500">{properties.length} propiedades reales</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                      Disponibles
                    </span>
                    <span className="text-2xl font-black font-mono text-emerald-950 mt-1 block">
                      {metrics.availableCount}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      ${(metrics.totalActiveValueUSD / 1000).toFixed(0)}k USD activos
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                      En Reserva
                    </span>
                    <span className="text-2xl font-black font-mono text-amber-950 mt-1 block">
                      {metrics.reservedCount}
                    </span>
                    <span className="text-[11px] text-amber-700">Trámite notarial</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Tasa de Venta
                    </span>
                    <span className="text-2xl font-black font-mono text-white mt-1 block">
                      {properties.length > 0
                        ? Math.round((metrics.soldCount / properties.length) * 100)
                        : 0}%
                    </span>
                    <span className="text-[11px] text-emerald-400">Escriturados</span>
                  </div>
                </div>
              </div>
            )}

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
            {/* TAB CONTENT: EXPEDIENTES & LEGAL */}
            {/* ======================================================== */}
            {activeTab === 'documents' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Código</th>
                        <th className="py-3 px-4">Inmueble</th>
                        <th className="py-3 px-4">Estado Notarial</th>
                        <th className="py-3 px-4">Plano / Ficha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {properties.map((p) => (
                        <tr key={p.id}>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.code}</td>
                          <td className="py-3 px-4 font-bold text-slate-800">{p.name}</td>
                          <td className="py-3 px-4 text-emerald-700 font-semibold">{p.registryStatus || 'Escritura Pública'}</td>
                          <td className="py-3 px-4">
                            {p.pdfUrl ? (
                              <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold hover:underline flex items-center gap-1">
                                <FileText className="h-3.5 w-3.5" />
                                <span>Ver PDF</span>
                              </a>
                            ) : (
                              <span className="text-slate-400 italic">Sin PDF</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

          </div>
        </main>
      </div>

      {/* ======================================================== */}
      {/* MODAL: PROFILE & PASSWORD CHANGE */}
      {/* ======================================================== */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 relative">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="h-12 w-12 rounded-2xl bg-emerald-700 text-white font-black text-sm flex items-center justify-center shadow-md">
                {adminEmail.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Perfil de Administrador</h3>
                <p className="text-xs text-slate-500 font-mono">{adminEmail}</p>
                <span className="inline-block mt-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Super Administrador MGM
                </span>
              </div>
            </div>

            {/* Password Change Form */}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <KeyRound className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Cambiar Contraseña de Acceso</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Se actualizará directamente en Supabase Auth para tus próximos inicios de sesión.
                </p>
              </div>

              {passwordError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la contraseña..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 py-2.5 rounded-xl bg-slate-950 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-60"
                >
                  {passwordLoading ? 'Guardando...' : 'Guardar Contraseña'}
                </button>
              </div>
            </form>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-400">¿Deseas salir del panel?</span>
              <button
                type="button"
                onClick={onLogout}
                className="text-rose-600 hover:text-rose-700 font-bold transition-colors cursor-pointer"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

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
