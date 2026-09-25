'use client';

import React, { useState, useEffect } from 'react';
import { LogoMGM } from './LogoMGM';
import { Menu } from 'lucide-react';
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
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 40);
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
          ? 'bg-[#113d22]/95 backdrop-blur-md border-b border-white/10 shadow-lg py-2'
          : 'bg-transparent py-3 sm:py-4'
      }`}
    >
      <div className="relative w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Lado Izquierdo: Logotipo Oficial MGM Inmobiliaria alineado a la letra A de "Tierra" */}
        <div className="flex items-center shrink-0 pl-6 sm:pl-32 md:pl-[12rem] lg:pl-[17.5rem] xl:pl-[23.5rem] 2xl:pl-[27rem] z-10">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none cursor-pointer group"
            aria-label="Sociedad Civil MGM Inmobiliaria"
          >
            <div className="h-12 sm:h-14 lg:h-16 w-auto flex items-center">
              <LogoMGM
                className="h-11 sm:h-13 lg:h-15 w-auto"
                variant="compact"
                showSubtitle={true}
                isGhost={true}
              />
            </div>
          </button>
        </div>

        {/* Zona Central / Derecha: Enlaces de Navegación reubicados un poco más a la izquierda */}
        <nav
          className="hidden md:flex absolute left-[49%] lg:left-[52%] xl:left-[54%] -translate-x-1/2 items-center gap-4 lg:gap-6 xl:gap-7"
          aria-label="Navegación principal"
        >
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`relative py-1 text-base lg:text-[17px] font-bold tracking-wide transition-colors cursor-pointer ${
                  isActive
                    ? 'text-white'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-[2.5px] bg-[#22A33D] rounded-full shadow-xs" />
                )}
              </button>
            );
          })}

          {/* Botón de WhatsApp al lado de Contacto */}
          <a
            href={getGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp Oficial"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm lg:text-base transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 cursor-pointer ml-1"
          >
            <WhatsAppIcon size={18} className="text-white shrink-0 drop-shadow-xs" />
            <span>WhatsApp</span>
          </a>
        </nav>

        {/* Zona Derecha: Menú Hamburguesa en móvil (se retiró el botón de agendar cita) */}
        <div className="flex md:hidden items-center gap-3 shrink-0 z-10">
          {/* Menú Hamburguesa (3 rayitas) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#113d22]/98 border-t border-white/10 px-6 py-4 space-y-3 mt-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onNavigate(link.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 text-base font-bold transition-colors ${
                currentPage === link.id
                  ? 'text-[#22A33D]'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}

          {/* WhatsApp en menú móvil */}
          <a
            href={getGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 pt-3 pb-1 text-base font-bold text-[#25D366] hover:text-[#20ba59] border-t border-white/10 transition-colors"
          >
            <WhatsAppIcon size={20} className="text-[#25D366] shrink-0" />
            <span>WhatsApp Oficial</span>
          </a>
        </div>
      )}
    </header>
  );
}
