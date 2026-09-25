'use client';

import React, { useState, useEffect } from 'react';
import { LogoMGM } from './LogoMGM';
import { CalendarCheck2, Lock } from 'lucide-react';
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

  const navLinks: { id: PageView; label: string; hash: string }[] = [
    { id: 'home', label: 'Inicio', hash: getPageCanonicalHash('home') },
    { id: 'properties', label: 'Lotes', hash: getPageCanonicalHash('properties') },
    { id: 'about', label: 'Nosotros', hash: getPageCanonicalHash('about') },
    { id: 'miravalle', label: 'Miravalle', hash: getPageCanonicalHash('miravalle') },
    { id: 'contact', label: 'Contacto', hash: getPageCanonicalHash('contact') },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-[#113d22] border-b border-white/10 shadow-2xl py-2.5 sm:py-3'
          : 'bg-transparent border-b border-transparent shadow-none py-3 sm:py-4.5'
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
            className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-xl p-1 transition-transform hover:scale-[1.02] active:scale-98 cursor-pointer drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
            aria-label="Ir a Inicio - Sociedad Civil MGM Inmobiliaria"
          >
            <div className="h-10 sm:h-12 lg:h-14 w-auto flex items-center">
              <LogoMGM
                className="h-10 sm:h-12 lg:h-13 w-auto"
                variant="compact"
                showSubtitle={true}
                isGhost={true}
              />
            </div>
          </a>
        </div>

        {/* Zona Central: Enlaces de Navegación con Alto Contraste y Fondo 100% Transparente */}
        <nav
          className="hidden md:flex items-center gap-1.5 lg:gap-2.5 xl:gap-3"
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
                className={`relative px-3.5 sm:px-4 py-1.5 text-sm lg:text-[15px] font-bold tracking-wide transition-all rounded-full cursor-pointer whitespace-nowrap ${
                  isActive
                    ? isScrolled
                      ? 'text-white bg-white/15 backdrop-blur-xs border border-white/20 shadow-xs'
                      : 'text-white bg-black/35 backdrop-blur-xs border border-white/30 shadow-md'
                    : isScrolled
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-white hover:text-white hover:bg-black/25 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]'
                }`}
              >
                <span className={!isScrolled ? 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]' : ''}>
                  {link.label}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 left-3 right-3 h-[2.5px] bg-[#25D366] rounded-full shadow-[0_0_8px_#25D366]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zona Derecha: Acciones Principales */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* CTA Agendar Visita en Desktop Grande */}
          {onOpenVisitModal && (
            <button
              onClick={() => onOpenVisitModal()}
              className="hidden xl:inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs sm:text-sm font-bold bg-[#F58220] hover:bg-[#e07316] text-white shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <CalendarCheck2 className="h-4 w-4" />
              <span>Agendar Visita</span>
            </button>
          )}

          {/* Botón WhatsApp - Ahora toma el lugar que tenía el Administrador */}
          <a
            href={getGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp Oficial"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm transition-all shadow-[0_2px_10px_rgba(0,0,0,0.35)] hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          >
            <WhatsAppIcon size={17} className="text-white shrink-0 drop-shadow-xs" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* Acceso CMS Admin - Ahora en el lugar donde estaba el botón hamburguesa */}
          <a
            href={getPageCanonicalHash('admin')}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('admin');
            }}
            title="Panel Administrativo CMS"
            className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              currentPage === 'admin'
                ? 'bg-white text-slate-900 shadow-xs'
                : isScrolled
                ? 'text-white/80 hover:text-white bg-white/10 hover:bg-white/20'
                : 'text-white bg-black/30 hover:bg-black/45 border border-white/25 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]'
            }`}
            aria-label="Panel CMS de Administración"
          >
            <Lock className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
