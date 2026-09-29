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

const kindevIcon = '/kindev_icon.webp';

interface FooterProps {
  currentPage?: PageView;
  onNavigate: (page: PageView) => void;
  onOpenVisitModal: () => void;
  onOpenLegalModal?: (tab: 'privacy' | 'terms' | 'cookies') => void;
}

function SocialIconsStrip({ size = 22 }: { size?: number }) {
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
        href="https://facebook.com"
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
        href="https://instagram.com"
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
        href="https://tiktok.com"
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
  onOpenVisitModal,
  onOpenLegalModal,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (page: PageView) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            <LogoMGM className="h-8 sm:h-9 w-auto" variant="compact" showSubtitle={true} isGhost={true} />
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
              <span className="text-xs text-slate-400 group-hover:text-emerald-400 transition-colors font-semibold tracking-wide">
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
                <LogoMGM className="h-7 sm:h-9 w-auto" variant="full" showSubtitle={true} isGhost={true} />
              </motion.a>

              {/* Redes Sociales en Móvil (Ubicadas a la derecha del Logo para eliminar el vacío y ganar espacio vertical) */}
              <div className="lg:hidden">
                <SocialIconsStrip size={20} />
              </div>
            </div>

            {/* Misión inmobiliaria */}
            <p className="text-[11px] sm:text-[12px] text-slate-300 font-normal leading-relaxed max-w-md">
              Sociedad Civil MGM Inmobiliaria. Desarrolladores de comunidades urbanizadas planificadas en Azuay, Ecuador. Solidez jurídica notarial y crédito directo sin intermediarios.
            </p>

            {/* Redes Sociales en Escritorio */}
            <div className="hidden lg:block pt-0.5">
              <SocialIconsStrip size={24} />
            </div>
          </div>

          {/* ----------------------------------------------------
              COLUMNA 2: Contacto Directo 2 Columnas (Sin espacios vacíos)
             ---------------------------------------------------- */}
          <div className="lg:col-span-6 flex flex-col gap-1.5 sm:gap-2 text-left">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#5be196] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5be196]" />
              <span>Atención Directa</span>
            </span>

            <div className="grid grid-cols-2 gap-x-2.5 sm:gap-x-4 gap-y-1.5 sm:gap-y-2 text-xs">
              {/* Teléfono & WhatsApp */}
              <a
                href="tel:+593984887434"
                className="py-0.5 sm:py-1 flex items-center gap-2 sm:gap-2.5 transition-all group cursor-pointer min-w-0"
              >
                <Phone size={16} strokeWidth={2.2} className="text-[#25D366] shrink-0 sm:w-[18px] sm:h-[18px] group-hover:scale-110 transition-transform" />
                <div className="min-w-0">
                  <span className="block text-[8.5px] sm:text-[9px] uppercase font-bold text-slate-300 tracking-wider truncate">Llamadas / WA</span>
                  <span className="block text-[10.5px] sm:text-xs font-semibold text-white group-hover:text-[#5be196] truncate">
                    +593 98 488 7434
                  </span>
                </div>
              </a>

              {/* Correo Electrónico */}
              <a
                href="mailto:info@mgminmobiliaria.ec"
                className="py-0.5 sm:py-1 flex items-center gap-2 sm:gap-2.5 transition-all group cursor-pointer min-w-0"
                title="info@mgminmobiliaria.ec"
              >
                <Mail size={16} strokeWidth={2.2} className="text-[#F58220] shrink-0 sm:w-[18px] sm:h-[18px] group-hover:scale-110 transition-transform" />
                <div className="min-w-0">
                  <span className="block text-[8.5px] sm:text-[9px] uppercase font-bold text-slate-300 tracking-wider truncate">Correo Notarial</span>
                  <span className="block text-[10.5px] sm:text-xs font-semibold text-white group-hover:text-[#F58220] truncate">
                    info@mgminmobiliaria.ec
                  </span>
                </div>
              </a>

              {/* Ubicación en Terreno */}
              <a
                href="https://maps.google.com/?q=Ciudadela+Miravalle+Ecuador"
                target="_blank"
                rel="noopener noreferrer"
                className="py-0.5 sm:py-1 flex items-center gap-2 sm:gap-2.5 transition-all group cursor-pointer min-w-0"
                title="Ciudadela Miravalle · Azuay"
              >
                <MapPin size={16} strokeWidth={2.2} className="text-[#5be196] shrink-0 sm:w-[18px] sm:h-[18px] group-hover:scale-110 transition-transform" />
                <div className="min-w-0">
                  <span className="block text-[8.5px] sm:text-[9px] uppercase font-bold text-slate-300 tracking-wider truncate">Ubicación</span>
                  <span className="block text-[10.5px] sm:text-xs font-semibold text-white group-hover:text-[#5be196] truncate">
                    Ciudadela Miravalle
                  </span>
                </div>
              </a>

              {/* Horario de Atención */}
              <div className="py-0.5 sm:py-1 flex items-center gap-2 sm:gap-2.5 min-w-0">
                <Clock size={16} strokeWidth={2.2} className="text-[#F58220] shrink-0 sm:w-[18px] sm:h-[18px]" />
                <div className="min-w-0">
                  <span className="block text-[8.5px] sm:text-[9px] uppercase font-bold text-slate-300 tracking-wider truncate">Horario</span>
                  <span className="block text-[10.5px] sm:text-xs font-semibold text-white truncate">
                    Lun-Sáb: 8:30-18:00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            BARRA INFERIOR / SUB-FOOTER
           ======================================================== */}
        <div className="pt-2 sm:pt-3.5 border-t border-white/10 text-[10px] sm:text-xs text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4 font-medium">
          
          {/* Izquierda: Copyright y Enlaces Legales */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2.5 gap-y-0.5 text-center sm:text-left">
            <p>
              © {currentYear} Sociedad Civil MGM Inmobiliaria.
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">•</span>
              <a
                href="/privacy"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('privacy');
                }}
                className="text-slate-400 hover:text-[#22A33D] transition-colors underline-offset-4 hover:underline cursor-pointer"
              >
                Políticas, Términos & Cookies (/privacy)
              </a>
            </div>
          </div>

          {/* Derecha: Firma Oficial KINDEV */}
          <div className="flex justify-center">
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
              <span className="text-[10px] sm:text-xs text-slate-400 group-hover:text-emerald-400 transition-colors font-semibold tracking-wide">
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
