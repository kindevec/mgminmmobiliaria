'use client';

import React, { useState, useEffect } from 'react';
import { LogoMGM } from './LogoMGM';
import { WhatsAppIcon } from './SocialIcons';
import { getGeneralWhatsAppUrl } from '@/src/data/lots';

import { type PageView, getPageCanonicalHash } from '@/src/data/navigation';
export type { PageView };

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onOpenVisitModal?: (defaultInterest?: string) => void;
}

export function Header({
  currentPage,
  onNavigate,
  onOpenVisitModal,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

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
    isScrolled || currentPage === 'property-detail' || currentPage === 'admin' || currentPage === 'new_property' || currentPage === 'privacy';

  const navLinks: { id: PageView; label: string; hash: string }[] = [
    { id: 'home', label: 'Inicio', hash: getPageCanonicalHash('home') },
    { id: 'properties', label: 'Lotes', hash: getPageCanonicalHash('properties') },
    { id: 'about', label: 'Nosotros', hash: getPageCanonicalHash('about') },
    { id: 'contact', label: 'Contacto', hash: getPageCanonicalHash('contact') },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isGreenHeader
          ? 'bg-[#113d22] border-b border-white/10 shadow-2xl py-2.5 sm:py-2.5'
          : 'bg-gradient-to-b from-black/80 via-black/35 to-transparent py-3 sm:py-4.5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 w-full">
        {/* Zona Izquierda: Logotipo Oficial MGM Inmobiliaria con contraste */}
        <div className="flex items-center shrink-0">
          <a
            href={getPageCanonicalHash('home')}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
            className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-xl p-0.5 transition-transform hover:scale-[1.02] active:scale-98 cursor-pointer"
            aria-label="Ir a Inicio - Sociedad Civil MGM Inmobiliaria"
          >
            <div className="h-10 sm:h-11 lg:h-12 w-auto flex items-center">
              <LogoMGM
                className="h-10 sm:h-11 lg:h-12 w-auto"
                variant="compact"
                showSubtitle={true}
                isGhost={true}
              />
            </div>
          </a>
        </div>

        {/* Zona Central: Enlaces de Navegación con Alto Contraste y Fondo 100% Transparente */}
        <nav
          className="hidden md:flex items-center gap-1.5 lg:gap-2.5"
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
                className={`relative px-3.5 py-1.5 text-xs sm:text-sm lg:text-[14px] font-medium tracking-wide transition-all rounded-full cursor-pointer whitespace-nowrap ${
                  isActive
                    ? isGreenHeader
                      ? 'text-white bg-white/15 backdrop-blur-xs border border-white/20 shadow-xs'
                      : 'text-white bg-black/35 backdrop-blur-xs border border-white/30 shadow-md'
                    : isGreenHeader
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-white hover:text-white hover:bg-black/25'
                }`}
              >
                <span>
                  {link.label}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 left-2.5 right-2.5 h-[2px] bg-[#25D366] rounded-full shadow-[0_0_6px_#25D366]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zona Derecha: Acciones Principales */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Botón WhatsApp */}
          <a
            href={getGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Cotizar vía WhatsApp Oficial"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm transition-all shadow-[0_2px_10px_rgba(0,0,0,0.35)] hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          >
            <WhatsAppIcon size={16} className="text-white shrink-0 drop-shadow-xs" />
            <span className="hidden sm:inline">Cotizar</span>
          </a>
        </div>
      </div>
    </header>
  );
}
