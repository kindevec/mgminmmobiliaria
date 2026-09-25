'use client';

import React, { useState, useEffect } from 'react';
import { LogoMGM } from './LogoMGM';
import { Menu, X, CalendarCheck2, Lock } from 'lucide-react';
import { WhatsAppIcon } from './SocialIcons';
import { getGeneralWhatsAppUrl } from '@/src/data/lots';

export type PageView = 'home' | 'about' | 'properties' | 'miravalle' | 'contact' | 'admin';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 30);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { id: PageView; label: string }[] = [
    { id: 'home', label: 'Inicio' },
    { id: 'properties', label: 'Lotes' },
    { id: 'about', label: 'Nosotros' },
    { id: 'miravalle', label: 'Miravalle' },
    { id: 'contact', label: 'Contacto' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-[#113d22]/95 backdrop-blur-md border-b border-white/10 shadow-lg py-2.5 sm:py-3'
          : 'bg-[#113d22]/70 backdrop-blur-sm border-b border-white/10 py-3 sm:py-4'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 w-full">
        {/* Zona Izquierda: Logotipo Oficial MGM Inmobiliaria */}
        <div className="flex items-center shrink-0">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-xl p-1 transition-transform hover:scale-[1.02] active:scale-98 cursor-pointer"
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
          </button>
        </div>

        {/* Zona Central: Enlaces de Navegación de Alta Legibilidad */}
        <nav
          className="hidden md:flex items-center gap-1.5 lg:gap-2.5 xl:gap-3"
          aria-label="Navegación principal"
        >
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`relative px-3.5 sm:px-4 py-1.5 text-sm lg:text-[15px] font-bold tracking-wide transition-all rounded-full cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-white/15 backdrop-blur-xs border border-white/20 shadow-xs'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-3 right-3 h-[2.5px] bg-[#22A33D] rounded-full shadow-xs" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zona Derecha: Acciones Principales y Menú Móvil */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Botón WhatsApp */}
          <a
            href={getGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp Oficial"
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          >
            <WhatsAppIcon size={17} className="text-white shrink-0 drop-shadow-xs" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          {/* CTA Agendar Visita en Desktop Grande */}
          {onOpenVisitModal && (
            <button
              onClick={() => onOpenVisitModal()}
              className="hidden xl:inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs sm:text-sm font-bold bg-[#F58220] hover:bg-[#e07316] text-white shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <CalendarCheck2 className="h-4 w-4" />
              <span>Agendar Visita</span>
            </button>
          )}

          {/* Acceso CMS Admin */}
          <button
            onClick={() => onNavigate('admin')}
            title="Panel Administrativo CMS"
            className={`h-9 w-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              currentPage === 'admin'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-white/70 hover:text-white hover:bg-white/15'
            }`}
            aria-label="Panel CMS de Administración"
          >
            <Lock className="h-3.5 w-3.5" />
          </button>

          {/* Toggle Menú Hamburguesa Móvil */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-10 w-10 md:hidden rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#113d22]/98 backdrop-blur-xl border-t border-white/10 px-6 py-4 space-y-2.5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 px-3 rounded-lg text-base font-bold transition-colors ${
                currentPage === link.id
                  ? 'text-[#5be196] bg-white/10 font-extrabold'
                  : 'text-white/90 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2.5 w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-md active:scale-98 transition-all"
            >
              <WhatsAppIcon size={18} className="text-white shrink-0" />
              <span>WhatsApp Oficial</span>
            </a>

            {onOpenVisitModal && (
              <button
                onClick={() => {
                  onOpenVisitModal();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#F58220] hover:bg-[#e07316] text-white font-bold text-sm shadow-md active:scale-98 transition-all cursor-pointer"
              >
                <CalendarCheck2 className="h-4 w-4" />
                <span>Agendar Visita</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
