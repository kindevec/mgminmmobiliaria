'use client';

import React from 'react';
import { motion } from 'motion/react';
import { LogoMGM } from './LogoMGM';
import { Mail, MapPin, Clock, ArrowUpRight, Phone } from 'lucide-react';
import {
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from './SocialIcons';
import type { PageView } from './Header';
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
      className="relative z-10 border-t border-slate-800/80 pt-5 sm:pt-8 pb-24 md:pb-8 overflow-hidden text-slate-300 bg-slate-950 shadow-[0_-8px_30px_rgba(0,0,0,0.35)]"
    >
      {/* Sutil resplandor ambiental en el fondo */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-[#22A33D]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#F58220]/5 blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ========================================================
            GRID DE 4 COLUMNAS BALANCEADO (ESTILO CASA KINTI)
           ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8 mb-4 sm:mb-7 items-start">
          
          {/* ----------------------------------------------------
              COLUMNA 1: Logo Oficial, Misión & Redes Sociales
             ---------------------------------------------------- */}
          <div className="col-span-1 flex flex-col gap-2 sm:gap-3 text-left">
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <motion.div
                onClick={() => handleNavClick('home')}
                className="flex items-center cursor-pointer select-none shrink-0"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="bg-white/95 px-3 py-1.5 rounded-xl inline-block shadow-sm">
                  <LogoMGM className="h-8 sm:h-9 w-auto" variant="full" showSubtitle={true} />
                </div>
              </motion.div>

              {/* En móvil: redes sociales compactas en la misma fila */}
              <div className="flex sm:hidden items-center gap-1.5 shrink-0">
                <a
                  href={getGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp MGM Inmobiliaria"
                  className="w-7 h-7 rounded-lg bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shadow-xs"
                >
                  <WhatsAppIcon size={14} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook MGM Inmobiliaria"
                  className="w-7 h-7 rounded-lg bg-[#1877F2]/20 text-[#1877F2] flex items-center justify-center shadow-xs"
                >
                  <FacebookIcon size={14} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram MGM Inmobiliaria"
                  className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-purple-500/20 text-rose-400 flex items-center justify-center shadow-xs"
                >
                  <InstagramIcon size={14} />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok MGM Inmobiliaria"
                  className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center shadow-xs"
                >
                  <TikTokIcon size={14} />
                </a>
              </div>
            </div>

            {/* Misión inmobiliaria */}
            <p className="text-[11px] sm:text-[12.5px] text-slate-400 font-medium leading-snug sm:leading-relaxed max-w-sm text-left">
              Sociedad Civil MGM Inmobiliaria. Desarrolladores de comunidades urbanizadas planificadas en Ecuador. Brindamos solidez jurídica notarial y crédito directo sin intermediarios.
            </p>

            {/* Redes Sociales Oficiales en PC / Tablet */}
            <div className="hidden sm:block pt-1">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Síguenos en Redes
              </span>
              <div className="flex items-center gap-2">
                <motion.a
                  href={getGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Oficial"
                  whileHover={{ scale: 1.12, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white flex items-center justify-center border border-[#25D366]/30 shadow-sm transition-all"
                >
                  <WhatsAppIcon size={17} />
                </motion.a>

                <motion.a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Oficial"
                  whileHover={{ scale: 1.12, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-lg bg-[#1877F2]/15 hover:bg-[#1877F2] text-[#1877F2] hover:text-white flex items-center justify-center border border-[#1877F2]/30 shadow-sm transition-all"
                >
                  <FacebookIcon size={16} />
                </motion.a>

                <motion.a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Oficial"
                  whileHover={{ scale: 1.12, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-purple-500/20 hover:from-amber-500 hover:via-rose-500 hover:to-purple-500 text-rose-400 hover:text-white flex items-center justify-center border border-rose-500/30 shadow-sm transition-all"
                >
                  <InstagramIcon size={16} />
                </motion.a>

                <motion.a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok Oficial"
                  whileHover={{ scale: 1.12, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-black text-slate-200 hover:text-[#00f2fe] flex items-center justify-center border border-white/20 shadow-sm transition-all"
                >
                  <TikTokIcon size={16} />
                </motion.a>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------
              COLUMNA 2: Secciones / Navegación
             ---------------------------------------------------- */}
          <div className="col-span-1 space-y-1.5 sm:space-y-2.5 text-left">
            <h4 className="font-sans text-xs sm:text-base font-bold uppercase tracking-wider text-white pb-0.5 sm:pb-1 border-b border-slate-800">
              Secciones
            </h4>
            <ul className="space-y-1 sm:space-y-2 text-[11px] sm:text-[13px] font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('home')}
                  className="text-slate-400 hover:text-[#22A33D] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1 sm:gap-1.5 py-0.5 cursor-pointer"
                >
                  <span className="text-[#22A33D] text-[9px] sm:text-[10px]">✦</span>
                  <span>Inicio</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('about')}
                  className="text-slate-400 hover:text-[#22A33D] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1 sm:gap-1.5 py-0.5 cursor-pointer"
                >
                  <span className="text-[#F58220] text-[9px] sm:text-[10px]">✦</span>
                  <span>Nosotros &amp; Ley</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('properties')}
                  className="text-slate-400 hover:text-[#22A33D] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1 sm:gap-1.5 py-0.5 cursor-pointer"
                >
                  <span className="text-[#22A33D] text-[9px] sm:text-[10px]">✦</span>
                  <span>Catálogo de Lotes</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('miravalle')}
                  className="text-slate-400 hover:text-[#22A33D] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1 sm:gap-1.5 py-0.5 cursor-pointer"
                >
                  <span className="text-[#F58220] text-[9px] sm:text-[10px]">✦</span>
                  <span>Ciudadela Miravalle</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavClick('contact')}
                  className="text-slate-400 hover:text-[#22A33D] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1 sm:gap-1.5 py-0.5 cursor-pointer"
                >
                  <span className="text-[#22A33D] text-[9px] sm:text-[10px]">✦</span>
                  <span>Contacto</span>
                </button>
              </li>
              <li className="pt-0.5">
                <button
                  type="button"
                  onClick={onOpenVisitModal}
                  className="text-[#22A33D] hover:text-[#5be196] font-semibold hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1 py-0.5 cursor-pointer"
                >
                  <span>Agendar Visita</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </li>
            </ul>
          </div>

          {/* ----------------------------------------------------
              COLUMNA 3: Proyectos & Garantías Destacadas
             ---------------------------------------------------- */}
          <div className="col-span-1 space-y-1.5 sm:space-y-2.5 text-left">
            <h4 className="font-sans text-xs sm:text-base font-bold uppercase tracking-wider text-white pb-0.5 sm:pb-1 border-b border-slate-800">
              Proyectos &amp; Respaldo
            </h4>
            <ul className="space-y-1 sm:space-y-2 text-[11px] sm:text-[13px] text-slate-400 font-medium">
              <li className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-[#22A33D] text-[9px] sm:text-[10px]">✦</span>
                <button
                  type="button"
                  onClick={() => handleNavClick('miravalle')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Ciudadela Miravalle
                </button>
              </li>
              <li className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-[#F58220] text-[9px] sm:text-[10px]">✦</span>
                <button
                  type="button"
                  onClick={() => handleNavClick('properties')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Lotes Comerciales &amp; Esquineros
                </button>
              </li>
              <li className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-[#22A33D] text-[9px] sm:text-[10px]">✦</span>
                <button
                  type="button"
                  onClick={() => handleNavClick('about')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Crédito Directo hasta 48 Meses
                </button>
              </li>
              <li className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-[#F58220] text-[9px] sm:text-[10px]">✦</span>
                <span>Escrituras Notariales Inmediatas</span>
              </li>
              <li className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-[#22A33D] text-[9px] sm:text-[10px]">✦</span>
                <span>Levantamientos UTM Georreferenciados</span>
              </li>
            </ul>
          </div>

          {/* ----------------------------------------------------
              COLUMNA 4: Contacto & Canales de Atención
             ---------------------------------------------------- */}
          <div className="col-span-1 space-y-1.5 sm:space-y-2.5 text-left">
            <h4 className="font-sans text-xs sm:text-base font-bold uppercase tracking-wider text-white pb-0.5 sm:pb-1 border-b border-slate-800">
              Contacto
            </h4>

            <div className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-[12.5px] font-medium">
              {/* Ubicación */}
              <motion.div
                whileHover={{ x: 3 }}
                className="flex items-start gap-2 sm:gap-2.5 group cursor-default select-none"
              >
                <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#22A33D]/20 text-[#22A33D] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.4]" />
                </div>
                <div className="leading-snug pt-0.5">
                  <a
                    href="https://maps.google.com/?q=Ciudadela+Miravalle+Ecuador"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-white transition-colors block font-medium hover:underline"
                    title="Abrir ubicación en Google Maps"
                  >
                    Ciudadela Miravalle · Azuay, Ecuador
                  </a>
                </div>
              </motion.div>

              {/* Teléfono y WhatsApp */}
              <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
                <motion.div
                  whileHover={{ x: 3 }}
                  className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer"
                >
                  <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0 shadow-xs">
                    <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.4]" />
                  </div>
                  <a
                    href="tel:+593984887434"
                    className="text-slate-300 group-hover:text-white transition-colors font-semibold"
                  >
                    +593 98 488 7434
                  </a>
                </motion.div>

                {/* Email */}
                <motion.div
                  whileHover={{ x: 3 }}
                  className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer"
                >
                  <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#F58220]/20 text-[#F58220] flex items-center justify-center shrink-0 shadow-xs">
                    <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.4]" />
                  </div>
                  <a
                    href="mailto:info@mgminmobiliaria.ec"
                    className="text-slate-300 group-hover:text-white transition-colors truncate max-w-[220px] font-semibold"
                  >
                    info@mgminmobiliaria.ec
                  </a>
                </motion.div>
              </div>

              {/* Horarios de Atención */}
              <motion.div
                whileHover={{ x: 3 }}
                className="flex items-center gap-2 sm:gap-2.5 group cursor-default select-none"
              >
                <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-[#F58220]/20 text-[#F58220] flex items-center justify-center shrink-0 shadow-xs">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.4]" />
                </div>
                <div className="leading-snug text-slate-300 select-none">
                  <span>Lun - Sáb: 8:30 AM - 6:00 PM</span>
                </div>
              </motion.div>
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
