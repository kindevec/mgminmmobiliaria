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
  onNavigate: (page: PageView) => void;
  onOpenVisitModal: () => void;
}

export function Footer({ onNavigate, onOpenVisitModal }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleNavClick = (page: PageView) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="main-footer"
      className="relative z-10 border-t border-slate-800/80 pt-4 sm:pt-6 pb-20 md:pb-6 overflow-hidden text-slate-300 bg-slate-950 shadow-[0_-8px_30px_rgba(0,0,0,0.35)]"
    >
      {/* Sutil resplandor ambiental en el fondo */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-[#22A33D]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#F58220]/5 blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ========================================================
            LAYOUT COMPACTO: LOGO + MISIÓN + REDES Y CONTACTO MÍNIMO
           ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-4 sm:mb-6 items-center">
          
          {/* ----------------------------------------------------
              COLUMNA 1: Logo Oficial, Misión & Redes Sociales
             ---------------------------------------------------- */}
          <div className="lg:col-span-6 flex flex-col gap-2.5 text-left">
            <div className="flex items-center">
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
                <div className="bg-white/95 px-3 py-1.5 rounded-xl inline-block shadow-sm">
                  <LogoMGM className="h-7 sm:h-8 w-auto" variant="full" showSubtitle={true} />
                </div>
              </motion.a>
            </div>

            {/* Misión inmobiliaria */}
            <p className="text-[11.5px] sm:text-[12px] text-slate-400 font-normal leading-relaxed max-w-md">
              Sociedad Civil MGM Inmobiliaria. Desarrolladores de comunidades urbanizadas planificadas en Azuay, Ecuador. Solidez jurídica notarial y crédito directo sin intermediarios.
            </p>

            {/* Redes Sociales Oficiales — Directos sin contenedor */}
            <div className="flex items-center gap-4 pt-1">
              <motion.a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp MGM Inmobiliaria"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="text-[#25D366] hover:text-[#20bd5a] transition-all cursor-pointer"
              >
                <WhatsAppIcon size={24} />
              </motion.a>

              <motion.a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook MGM Inmobiliaria"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="text-[#1877F2] hover:text-[#3b82f6] transition-all cursor-pointer"
              >
                <FacebookIcon size={24} />
              </motion.a>

              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram MGM Inmobiliaria"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="text-[#E4405F] hover:text-[#f43f5e] transition-all cursor-pointer"
              >
                <InstagramIcon size={24} />
              </motion.a>

              <motion.a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok MGM Inmobiliaria"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <TikTokIcon size={24} />
              </motion.a>
            </div>
          </div>

          {/* ----------------------------------------------------
              COLUMNA 2: Contacto Directo Ultra-Compacto & Ordenado (2x2)
             ---------------------------------------------------- */}
          <div className="lg:col-span-6 flex flex-col gap-2 text-left">
            <span className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22A33D]" />
              <span>Atención Directa</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* Teléfono & WhatsApp */}
              <a
                href="tel:+593984887434"
                className="p-2 sm:p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-[#25D366]/40 flex items-center gap-3 transition-all group cursor-pointer"
              >
                <Phone size={18} strokeWidth={2.2} className="text-[#25D366] shrink-0 group-hover:scale-110 transition-transform" />
                <div className="min-w-0">
                  <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">Llamadas / WhatsApp</span>
                  <span className="block text-[11.5px] sm:text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                    +593 98 488 7434
                  </span>
                </div>
              </a>

              {/* Correo Electrónico */}
              <a
                href="mailto:info@mgminmobiliaria.ec"
                className="p-2 sm:p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-[#F58220]/40 flex items-center gap-3 transition-all group cursor-pointer"
              >
                <Mail size={18} strokeWidth={2.2} className="text-[#F58220] shrink-0 group-hover:scale-110 transition-transform" />
                <div className="min-w-0">
                  <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">Correo Notarial</span>
                  <span className="block text-[11.5px] sm:text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                    info@mgminmobiliaria.ec
                  </span>
                </div>
              </a>

              {/* Ubicación en Terreno */}
              <a
                href="https://maps.google.com/?q=Ciudadela+Miravalle+Ecuador"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-[#22A33D]/40 flex items-center gap-3 transition-all group cursor-pointer"
              >
                <MapPin size={18} strokeWidth={2.2} className="text-[#22A33D] shrink-0 group-hover:scale-110 transition-transform" />
                <div className="min-w-0">
                  <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">Ubicación</span>
                  <span className="block text-[11.5px] sm:text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                    Ciudadela Miravalle · Azuay
                  </span>
                </div>
              </a>

              {/* Horario de Atención */}
              <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/90 flex items-center gap-3">
                <Clock size={18} strokeWidth={2.2} className="text-[#F58220] shrink-0" />
                <div className="min-w-0">
                  <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">Horario de Atención</span>
                  <span className="block text-[11.5px] sm:text-xs font-semibold text-slate-300 truncate">
                    Lun - Sáb: 8:30 - 18:00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            BARRA INFERIOR / SUB-FOOTER (EXACTA A CASA KINTI)
           ======================================================== */}
        <div className="pt-2.5 sm:pt-4 border-t border-slate-800/80 text-[10.5px] sm:text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 font-medium">
          
          {/* Izquierda: Copyright y Enlaces Legales */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-center sm:text-left">
            <p>
              © {currentYear} Sociedad Civil MGM Inmobiliaria. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleNavClick('contact')}
                className="text-slate-400 hover:text-[#22A33D] transition-colors underline-offset-4 hover:underline cursor-pointer"
              >
                Privacidad
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => handleNavClick('contact')}
                className="text-slate-400 hover:text-[#22A33D] transition-colors underline-offset-4 hover:underline cursor-pointer"
              >
                Términos
              </button>
            </div>
          </div>

          {/* Derecha: Firma Oficial KINDEV (EXACTAMENTE IGUAL A CASA KINTI) */}
          <div className="flex justify-center">
            <a 
              href="https://www.kindevsas.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:opacity-95 transition-all text-[11px] sm:text-sm flex items-center gap-1.5 sm:gap-2 group"
              title="Desarrollado por KINDEV"
              aria-label="Desarrollado por KINDEV"
            >
              <div className="relative inline-flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-full bg-[#22A33D]/30 blur-md opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500 pointer-events-none" />
                
                <img 
                  src={kindevIcon} 
                  alt="KINDEV Logo" 
                  width="28" 
                  height="28" 
                  loading="lazy" 
                  decoding="async" 
                  className="relative z-10 w-6 h-6 sm:w-7.5 sm:h-7.5 object-contain drop-shadow-[0_2px_8px_rgba(34,163,61,0.5)] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 ease-out inline-block"
                />
              </div>
              <span className="text-[10.5px] sm:text-xs text-slate-400 group-hover:text-emerald-400 transition-colors font-semibold tracking-wide">
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
