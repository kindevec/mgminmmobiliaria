'use client';

import React, { useState, useEffect } from 'react';
import { LogoMGM } from './LogoMGM';
import { CalendarCheck2, Lock } from 'lucide-react';
import { WhatsAppIcon } from './SocialIcons';
import { getGeneralWhatsAppUrl } from '@/src/data/lots';

export type PageView = 'home' | 'about' | 'properties' | 'miravalle' | 'contact' | 'admin';

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onOpenVisitModal: (defaultInterest?: string) => void;
}

export function Header({
  currentPage,
  onNavigate,
  onOpenVisitModal,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll listener for dynamic ghost-to-solid transition
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 60);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ghost mode is active on all pages when user is at top because all pages now have the cinematic hero banner
  const isGhostMode = !isScrolled;

  const navLinks: { id: PageView; label: string }[] = [
    { id: 'home', label: 'Inicio' },
    { id: 'about', label: 'Nosotros' },
    { id: 'properties', label: 'Lotes' },
    { id: 'miravalle', label: 'Miravalle' },
    { id: 'contact', label: 'Contacto' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isGhostMode
          ? 'bg-transparent border-b border-transparent shadow-none py-1 sm:py-2'
          : 'bg-white/92 backdrop-blur-md border-b border-slate-200/80 shadow-sm py-0'
      }`}
    >
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark / Isotype */}
        <button
          onClick={() => onNavigate('home')}
          className="group flex items-center gap-2 sm:gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1 transition-transform cursor-pointer shrink-0"
          aria-label="Ir a Inicio - Sociedad Civil MGM Inmobiliaria"
        >
          <div className="h-9 sm:h-12 w-auto flex items-center">
            <LogoMGM
              className="h-8 sm:h-11 w-auto"
              variant="compact"
              showSubtitle={true}
              isGhost={isGhostMode}
            />
          </div>
        </button>

        {/* Zone 2: Navigation Links - Naked Words, NO container box, only active link gets framed ("enmarcado") */}
        <nav
          className="hidden md:flex items-center gap-1.5 lg:gap-3 transition-all duration-300"
          aria-label="Navegación principal"
        >
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`relative px-4 py-1.5 text-sm transition-all duration-200 rounded-full whitespace-nowrap cursor-pointer ${
                  isActive
                    ? isGhostMode
                      ? 'border-2 border-white/90 text-white font-bold bg-white/15 backdrop-blur-sm shadow-md'
                      : 'border-2 border-emerald-600 text-emerald-950 font-bold bg-emerald-50/90 shadow-xs'
                    : isGhostMode
                    ? 'text-white/80 hover:text-white font-medium hover:scale-105 border-2 border-transparent'
                    : 'text-slate-600 hover:text-slate-950 font-medium hover:scale-105 border-2 border-transparent'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Direct Official WhatsApp Icon Only */}
          <a
            href={getGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
              isGhostMode
                ? 'border border-emerald-400/50 bg-emerald-500/20 text-white backdrop-blur-md hover:bg-[#25D366] hover:text-slate-950 hover:border-[#25D366] shadow-sm hover:scale-105'
                : 'border border-[#25D366]/40 bg-[#25D366]/15 text-emerald-950 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] hover:shadow-sm hover:scale-105'
            }`}
            title="Contactar a MGM Inmobiliaria por WhatsApp Oficial"
            aria-label="WhatsApp Oficial MGM Inmobiliaria"
          >
            <WhatsAppIcon
              size={18}
              className={`shrink-0 transition-colors ${
                isGhostMode ? 'text-[#25D366]' : 'text-emerald-800'
              }`}
            />
          </a>

          {/* Primary CTA: Agendar Visita (Responsive text on mobile) */}
          <button
            onClick={() => onOpenVisitModal()}
            className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer whitespace-nowrap ${
              isGhostMode
                ? 'bg-[#25D366] text-slate-950 hover:bg-[#22bf5b] shadow-black/20'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800'
            }`}
          >
            <CalendarCheck2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Agendar Visita</span>
            <span className="sm:hidden">Visita</span>
          </button>

          {/* Admin CMS Access for advisors */}
          <button
            onClick={() => onNavigate('admin')}
            title="Panel Administrativo CMS"
            className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              currentPage === 'admin'
                ? 'bg-slate-900 text-white shadow-xs ring-2 ring-emerald-500'
                : isGhostMode
                ? 'text-white/80 hover:text-white hover:bg-white/20 border border-white/20'
                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
            }`}
            aria-label="Panel CMS de Administración"
          >
            <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
