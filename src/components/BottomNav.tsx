'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Home, Award, Layers, Trees, MessageSquare } from 'lucide-react';
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
      id: 'about' as PageView,
      label: 'Nosotros',
      icon: Award,
    },
    {
      id: 'properties' as PageView,
      label: 'Lotes',
      icon: Layers,
    },
    {
      id: 'miravalle' as PageView,
      label: 'Miravalle',
      icon: Trees,
    },
    {
      id: 'contact' as PageView,
      label: 'Contacto',
      icon: MessageSquare,
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(env(safe-area-inset-bottom),10px)] pt-1.5 transition-all"
      aria-label="Navegación móvil inferior"
    >
      <div className="flex items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 cursor-pointer min-w-[62px] active:scale-95 ${
                isActive
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {/* Active Ambient Glow Pill */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className="absolute inset-0 bg-emerald-50 rounded-2xl -z-10 border border-emerald-200/70"
                />
              )}

              {/* Active Top Accent Line */}
              {isActive && (
                <motion.span
                  layoutId="bottomNavTopBar"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute -top-1.5 h-1 w-7 bg-gradient-to-r from-emerald-600 via-[#25D366] to-teal-500 rounded-full shadow-[0_0_8px_rgba(37,211,102,0.4)]"
                />
              )}

              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-emerald-700 scale-110'
                    : 'text-slate-500'
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-transform ${
                    isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'
                  }`}
                />
              </div>

              <span
                className={`text-[10.5px] tracking-tight transition-all mt-0.5 ${
                  isActive ? 'font-black text-emerald-800' : 'font-medium text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
