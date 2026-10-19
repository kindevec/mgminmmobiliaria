'use client';

import React from 'react';
import { Home, Award, Layers, MessageSquare, Calculator, HardHat } from 'lucide-react';
import { getPageCanonicalHash } from '@/src/data/navigation';
import type { PageView } from './Header';

interface BottomNavProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const navItems = [
    {
      id: 'home' as PageView,
      label: 'Inicio',
      icon: Home,
    },
    {
      id: 'properties' as PageView,
      label: 'Lotes',
      icon: Layers,
    },
    {
      id: 'constructions' as PageView,
      label: 'Obras',
      icon: HardHat,
    },
    {
      id: 'appraisals' as PageView,
      label: 'Avalúos',
      icon: Calculator,
    },
    {
      id: 'about' as PageView,
      label: 'Nosotros',
      icon: Award,
    },
    {
      id: 'contact' as PageView,
      label: 'Contacto',
      icon: MessageSquare,
    },
  ];

  const activeIndex = Math.max(
    0,
    navItems.findIndex(
      (item) =>
        currentPage === item.id ||
        (item.id === 'properties' && currentPage === 'property-detail')
    )
  );

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 w-full select-none pointer-events-auto bg-[#0d2818]/95 backdrop-blur-md border-t border-emerald-500/25 shadow-[0_-8px_30px_rgba(4,40,16,0.6)] pb-[max(env(safe-area-inset-bottom,0px),8px)] pt-1.5"
      aria-label="Navegación móvil inferior"
    >
      <div className="relative flex items-center justify-around px-1.5 w-full max-w-lg mx-auto">
        {/* Top Active Indicator Line en Naranja MGM con brillo */}
        <div
          className="absolute -top-1.5 h-[2.5px] bg-[#F58220] transition-all duration-400 ease-in-out shadow-[0_0_12px_rgba(245,130,32,0.95)] rounded-full"
          style={{
            left: `${(activeIndex * 100) / navItems.length + 100 / (navItems.length * 2)}%`,
            width: '42px',
            transform: 'translateX(-50%)',
          }}
        />

        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive =
            currentPage === item.id ||
            (item.id === 'properties' && currentPage === 'property-detail');

          const distance = Math.abs(activeIndex - index);
          const spotlightOpacity = isActive ? 1 : Math.max(0, 1 - distance * 0.6);

          return (
            <a
              key={item.id}
              href={getPageCanonicalHash(item.id)}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="relative flex flex-col items-center justify-center flex-1 py-1 px-0.5 rounded-lg transition-all duration-300 touch-manipulation group"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Spotlight Conical Glow en colores MGM */}
              <div
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-20 bg-gradient-to-b from-[#F58220]/35 via-[#5be196]/15 to-transparent blur-lg rounded-full pointer-events-none transition-opacity duration-400"
                style={{
                  opacity: spotlightOpacity,
                  transitionDelay: isActive ? '0.1s' : '0s',
                }}
              />

              {/* Icon con color activo de marca MGM */}
              <Icon
                className={`w-5 h-5 transition-colors duration-200 ${
                  isActive
                    ? 'text-[#F58220] drop-shadow-[0_0_10px_rgba(245,130,32,0.7)]'
                    : 'text-emerald-200/60 group-hover:text-emerald-100'
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />

              {/* Label en colores MGM */}
              <span
                className={`text-[9.5px] tracking-tight leading-tight mt-1 transition-colors duration-200 ${
                  isActive ? 'text-[#5be196] font-black' : 'text-emerald-100/65 group-hover:text-emerald-100'
                }`}
              >
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
