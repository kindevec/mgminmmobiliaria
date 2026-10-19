'use client';

import React from 'react';
import { motion } from 'motion/react';
import { LogoMGM } from './LogoMGM';
import { Mail, MapPin, Clock, Phone } from 'lucide-react';
import {
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from './SocialIcons';
import type { PageView } from './Header';
import { getPageCanonicalHash } from '@/src/data/navigation';
import { getGeneralWhatsAppUrl } from '@/src/data/lots';
import { useSiteSettings, formatPhoneForTel } from '@/src/lib/siteSettings';

const kindevIcon = '/kindev_icon.webp';

interface FooterProps {
  currentPage?: PageView;
  onNavigate: (page: PageView) => void;
  onOpenLegalModal?: (tab: 'privacy' | 'terms' | 'cookies') => void;
}

function SocialIconsStrip({ size = 22 }: { size?: number }) {
  useSiteSettings();
  return (
    <div className="flex items-center gap-3">
      <motion.a
        href={getGeneralWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp MGM Inmobiliaria"
        whileHover={{ scale: 1.15, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="text-[#25D366] hover:text-[#20bd5a] transition-all cursor-pointer"
      >
        <WhatsAppIcon size={size} />
      </motion.a>

      <motion.a
        href="https://www.facebook.com/mgm.avaluos.5"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook MGM Inmobiliaria"
        whileHover={{ scale: 1.15, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="text-[#1877F2] hover:text-[#3b82f6] transition-all cursor-pointer"
      >
        <FacebookIcon size={size} />
      </motion.a>

      <motion.a
        href="https://www.instagram.com/mgminmobiliariaec/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram MGM Inmobiliaria"
        whileHover={{ scale: 1.15, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="text-[#E4405F] hover:text-[#f43f5e] transition-all cursor-pointer"
      >
        <InstagramIcon size={size} />
      </motion.a>

      <motion.a
        href="https://www.tiktok.com/@mgm_inmobiliaria"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TikTok MGM Inmobiliaria"
        whileHover={{ scale: 1.15, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="text-slate-300 hover:text-white transition-all cursor-pointer"
      >
        <TikTokIcon size={size} />
      </motion.a>
    </div>
  );
}

export function Footer({
  currentPage,
  onNavigate,
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { settings } = useSiteSettings();
  const telHref = `tel:${formatPhoneForTel(settings.supportPhone)}`;
  const mapsUrl = `https://www.google.com/maps?q=${settings.hqLat},${settings.hqLng}`;

  const handleNavClick = (page: PageView) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Omitir Footer completamente en la sección de Avalúos
  if (currentPage === 'appraisals') {
    return null;
  }

  // Footer exclusivo minimalista para la sección de Administración (solo logo, marca y Desarrollado por Kindev)
  if (currentPage === 'admin') {
    return (
      <footer
        id="main-footer"
        className="relative z-10 border-t border-white/10 py-5 px-4 sm:px-8 text-slate-200 bg-[#113d22] shadow-[0_-8px_30px_rgba(0,0,0,0.35)]"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo y Marca */}
          <div className="flex items-center">
            <LogoMGM className="h-9 sm:h-11 w-auto" variant="compact" showSubtitle={true} isGhost={true} />
          </div>

          {/* Desarrollado por KINDEV */}
          <div className="flex justify-center">
            <a 
              href="https://www.kindevsas.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:opacity-95 transition-all text-xs sm:text-sm flex items-center gap-2 group"
              title="Desarrollado por KINDEV"
              aria-label="Desarrollado por KINDEV"
            >
              <div className="relative inline-flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-full bg-[#22A33D]/30 blur-md opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 pointer-events-none" />
                <img 
                  src={kindevIcon} 
                  alt="KINDEV Logo" 
                  width="24" 
                  height="24" 
                  loading="lazy" 
                  decoding="async" 
                  className="relative z-10 w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow-[0_2px_8px_rgba(34,163,61,0.5)] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 ease-out inline-block"
                />
              </div>
              <span className="text-xs text-slate-300 group-hover:text-emerald-400 transition-colors font-semibold tracking-wide">
                Desarrollado por{" "}
                <span className="font-bold text-white group-hover:text-emerald-400 inline-block">
                  KINDEV
                </span>
              </span>
            </a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      id="main-footer"
      className="relative z-10 border-t border-white/10 pt-3.5 sm:pt-6 pb-20 md:pb-6 overflow-hidden text-slate-200 bg-[#113d22] shadow-[0_-8px_30px_rgba(0,0,0,0.35)]"
    >
      {/* Sutil resplandor ambiental en el fondo */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-[#5be196]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#F58220]/10 blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ========================================================
            LAYOUT COMPACTO: LOGO + MISIÓN + REDES Y CONTACTO MÍNIMO
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-8 mb-3 sm:mb-6 items-center">
          
          {/* ----------------------------------------------------
              COLUMNA 1: Logo Oficial, Misión & Redes Sociales
             ---------------------------------------------------- */}
          <div className="lg:col-span-6 flex flex-col gap-2 sm:gap-2.5 text-left">
            {/* Fila Cabecera: Logo a la izquierda, Redes a la derecha en móvil */}
            <div className="flex items-center justify-between lg:justify-start gap-4">
              <motion.a
                href={getPageCanonicalHash('home')}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('home');
                }}
                className="flex items-center cursor-pointer select-none"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogoMGM className="h-9 sm:h-11 w-auto" variant="full" showSubtitle={true} isGhost={true} />
              </motion.a>

              {/* Redes Sociales en Móvil */}
              <div className="lg:hidden">
                <SocialIconsStrip size={20} />
              </div>
            </div>

              {/* Redes Sociales en Escritorio */}
              <div className="hidden lg:block pt-0.5">
                <SocialIconsStrip size={24} />
              </div>

            {/* Misión y Respaldo Institucional (Solo Escritorio) */}
            <p className="hidden lg:block text-[11px] sm:text-[12px] text-slate-300 font-normal leading-relaxed max-w-md pt-1">
              Desarrollamos proyectos residenciales planificados con total solvencia técnica, obras civiles concluidas in situ y certeza notarial garantizada en el Registro de la Propiedad.
            </p>
          </div>

          {/* ----------------------------------------------------
              COLUMNA 2: Contacto Directo 2 Columnas (Reflejado desde Admin)
             ---------------------------------------------------- */}
          <div className="lg:col-span-6 flex flex-col gap-1.5 sm:gap-2 text-left">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#5be196] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5be196]" />
              <span>Atención Directa</span>
            </span>

            <div className="grid grid-cols-2 gap-x-2.5 sm:gap-x-4 gap-y-1.5 sm:gap-y-2 text-xs">
              {/* Teléfono & WhatsApp */}
              <a
                href={telHref}
                className="py-0.5 sm:py-1 flex items-center gap-2 sm:gap-2.5 transition-all group cursor-pointer min-w-0"
              >
                <Phone size={16} strokeWidth={2.2} className="text-[#25D366] shrink-0 sm:w-[18px] sm:h-[18px] group-hover:scale-110 transition-transform" />
                <div className="min-w-0">
                  <span className="block text-[8.5px] sm:text-[9px] uppercase font-bold text-slate-300 tracking-wider truncate">Llamadas / WA</span>
                  <span className="block text-[10.5px] sm:text-xs font-semibold text-white group-hover:text-[#5be196] truncate">
                    {settings.supportPhone}
                  </span>
                </div>
              </a>

              {/* Correo Electrónico */}
              <a
                href={`mailto:${settings.supportEmail}`}
                className="py-0.5 sm:py-1 flex items-center gap-2 sm:gap-2.5 transition-all group cursor-pointer min-w-0"
                title={settings.supportEmail}
              >
                <Mail size={16} strokeWidth={2.2} className="text-[#F58220] shrink-0 sm:w-[18px] sm:h-[18px] group-hover:scale-110 transition-transform" />
                <div className="min-w-0">
                  <span className="block text-[8.5px] sm:text-[9px] uppercase font-bold text-slate-300 tracking-wider truncate">Correo Oficial</span>
                  <span className="block text-[10.5px] sm:text-xs font-semibold text-white group-hover:text-[#F58220] truncate">
                    {settings.supportEmail}
                  </span>
                </div>
              </a>

              {/* Ubicación en Terreno */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-0.5 sm:py-1 flex items-center gap-2 sm:gap-2.5 transition-all group cursor-pointer min-w-0"
                title={settings.hqAddress}
              >
                <MapPin size={16} strokeWidth={2.2} className="text-[#5be196] shrink-0 sm:w-[18px] sm:h-[18px] group-hover:scale-110 transition-transform" />
                <div className="min-w-0">
                  <span className="block text-[8.5px] sm:text-[9px] uppercase font-bold text-slate-300 tracking-wider truncate">Ubicación</span>
                  <span className="block text-[10.5px] sm:text-xs font-semibold text-white group-hover:text-[#5be196] truncate">
                    {settings.hqTitle}
                  </span>
                </div>
              </a>

              {/* Horario de Atención */}
              <div className="py-0.5 sm:py-1 flex items-center gap-2 sm:gap-2.5 min-w-0">
                <Clock size={16} strokeWidth={2.2} className="text-[#F58220] shrink-0 sm:w-[18px] sm:h-[18px]" />
                <div className="min-w-0">
                  <span className="block text-[8.5px] sm:text-[9px] uppercase font-bold text-slate-300 tracking-wider truncate">Horario</span>
                  <span className="block text-[10.5px] sm:text-xs font-semibold text-white truncate">
                    {settings.businessHours}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            BARRA INFERIOR / SUB-FOOTER
           ======================================================== */}
        <div className="pt-2 sm:pt-3.5 border-t border-white/10 text-[10px] sm:text-xs text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 font-medium">
          {/* Copyright y Políticas Legales (Visible en escritorio, limpio en móvil) */}
          <div className="hidden sm:flex flex-wrap items-center gap-x-2.5 gap-y-1 text-slate-400">
            <span>&copy; {currentYear} Sociedad Civil MGM Inmobiliaria.</span>
            <span>&bull;</span>
            <span>RUC: 1792436274001</span>
            <span>&bull;</span>
            <a
              href="/privacy"
              className="hover:text-emerald-400 transition-colors underline underline-offset-2"
            >
              Políticas y Privacidad
            </a>
          </div>

          {/* Firma Oficial KINDEV */}
          <div className="flex justify-center w-full sm:w-auto">
            <a 
              href="https://www.kindevsas.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:opacity-95 transition-all text-[10.5px] sm:text-sm flex items-center gap-1.5 sm:gap-2 group"
              title="Desarrollado por KINDEV"
              aria-label="Desarrollado por KINDEV"
            >
              <div className="relative inline-flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-full bg-[#22A33D]/30 blur-md opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 pointer-events-none" />
                
                <img 
                  src={kindevIcon} 
                  alt="KINDEV Logo" 
                  width="24" 
                  height="24" 
                  loading="lazy" 
                  decoding="async" 
                  className="relative z-10 w-5 h-5 sm:w-7 sm:h-7 object-contain drop-shadow-[0_2px_8px_rgba(34,163,61,0.5)] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 ease-out inline-block"
                />
              </div>
              <span className="text-[10px] sm:text-xs text-slate-300 group-hover:text-emerald-400 transition-colors font-semibold tracking-wide">
                Desarrollado por{" "}
                <span className="font-bold text-white group-hover:text-emerald-400 inline-block">
                  KINDEV
                </span>
              </span>
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
}
