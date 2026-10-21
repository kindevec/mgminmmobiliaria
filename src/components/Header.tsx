'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LogoMGM } from './LogoMGM';
import { WhatsAppIcon } from './SocialIcons';
import { getGeneralWhatsAppUrl } from '@/src/data/lots';
import { useSiteSettings } from '@/src/lib/siteSettings';

import { type PageView, getPageCanonicalHash } from '@/src/data/navigation';
export type { PageView };

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

export function Header({
  currentPage,
  onNavigate,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  // Subscribe to siteSettings so the WhatsApp button updates in real time when changed in Admin
  useSiteSettings();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      setIsScrolled(scrollPosition > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isGreenHeader =
    isScrolled ||
    currentPage === 'property-detail' ||
    currentPage === 'admin' ||
    currentPage === 'privacy' ||
    currentPage === 'appraisals';

  const navLinks: { id: PageView; label: string; hash: string }[] = [
    { id: 'home', label: 'Inicio', hash: getPageCanonicalHash('home') },
    { id: 'properties', label: 'Lotes', hash: getPageCanonicalHash('properties') },
    { id: 'constructions', label: 'Construcciones', hash: getPageCanonicalHash('constructions') },
    { id: 'appraisals', label: 'Avalúos', hash: getPageCanonicalHash('appraisals') },
    { id: 'about', label: 'Nosotros', hash: getPageCanonicalHash('about') },
    { id: 'contact', label: 'Contacto', hash: getPageCanonicalHash('contact') },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isGreenHeader
          ? 'glass-dock-scrolled py-2.5 sm:py-3'
          : 'bg-gradient-to-b from-black/85 via-black/40 to-transparent py-3.5 sm:py-5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 w-full">
        {/* Zona Izquierda: Logotipo Oficial MGM Inmobiliaria */}
        <div className="flex items-center shrink-0">
          <a
            href={getPageCanonicalHash('home')}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
            className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-xl p-0.5 transition-transform hover:scale-[1.03] active:scale-95 cursor-pointer"
            aria-label="Ir a Inicio - Sociedad Civil MGM Inmobiliaria"
          >
            <div className="h-11 sm:h-12 lg:h-14 w-auto flex items-center">
              <LogoMGM
                className="h-11 sm:h-12 lg:h-14 w-auto drop-shadow-md"
                variant="compact"
                showSubtitle={true}
                isGhost={true}
              />
            </div>
          </a>
        </div>

        {/* Zona Central: Enlaces de Navegación limpios (sin encapsular) */}
        <nav
          className="hidden md:flex items-center gap-1 lg:gap-2"
          aria-label="Navegación principal"
        >
          {navLinks.map((link) => {
            const isActive =
              currentPage === link.id || (link.id === 'properties' && currentPage === 'property-detail');
            return (
              <a
                key={link.id}
                href={link.hash}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(link.id);
                }}
                className={`relative px-3 lg:px-3.5 py-1.5 text-xs lg:text-[13px] font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-white'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                <span className="relative z-10 block">
                  {link.label}
                </span>
                {/* Indicador de subrayado sutil activo */}
                {isActive && (
                  <motion.div
                    layoutId="header-active-line"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-emerald-400 to-[#5be196] rounded-full shadow-[0_0_10px_rgba(91,225,150,0.6)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zona Derecha: Acciones Principales con Estado 'En Línea' */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href={getGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Cotizar vía WhatsApp Oficial con Asesor"
            className="group relative inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-black text-xs sm:text-sm tracking-wide transition-all shadow-[0_4px_16px_rgba(37,211,102,0.35)] hover:shadow-[0_6px_22px_rgba(37,211,102,0.55)] hover:scale-105 active:scale-95 cursor-pointer overflow-hidden"
          >
            {/* Shimmer sweep effect */}
            <span className="absolute inset-0 w-1/2 h-full bg-white/25 -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />

            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-900 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-950" />
            </span>

            <WhatsAppIcon size={16} className="text-slate-950 shrink-0" />
            <span className="font-bold">Cotizar</span>
          </a>
        </div>
      </div>
    </header>
  );
}
