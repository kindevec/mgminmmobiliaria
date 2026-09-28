'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Home, Award, Layers, Trees, MessageSquare } from 'lucide-react';
import { getPageCanonicalHash } from '@/src/data/navigation';
import type { PageView } from './Header';

interface BottomNavProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

/**
 * Cuna cóncava superior sutil y elegante bajo el icono sobresaliente (#F58220).
 * Borde inferior 100% continuo y sólido (cero agujeros o cortes transparentes que dejen ver el fondo).
 */
function getBarPath(cx: number, w: number, h: number, progress: number = 1): string {
  const r = (n: number) => Math.round(n * 10) / 10;

  // Cuna cóncava suave y discreta debajo del botón sobresaliente (sin huecos agresivos)
  const tw = 24;               // semi-ancho del descanso central (48px)
  const sh = 10 * progress;    // transición curva suave (10px)
  const td = 6.5 * progress;   // profundidad muy sutil (6.5px) para no adelgazar en exceso la barra
  const rc = 5 * progress;     // radio de curvatura inferior

  return [
    `M 0,0`,
    // Borde superior hacia el hombro izquierdo de la cuna
    `L ${r(cx - tw - sh)},0`,
    // Transición suave hacia el descanso
    `C ${r(cx - tw - sh / 2)},0 ${r(cx - tw)},${r(sh / 2)} ${r(cx - tw)},${r(td - rc)}`,
    `C ${r(cx - tw)},${r(td)} ${r(cx - tw + rc / 2)},${r(td)} ${r(cx - tw + rc)},${r(td)}`,
    // Base suave horizontal
    `L ${r(cx + tw - rc)},${r(td)}`,
    // Curva derecha de subida
    `C ${r(cx + tw - rc / 2)},${r(td)} ${r(cx + tw)},${r(td)} ${r(cx + tw)},${r(td - rc)}`,
    `C ${r(cx + tw)},${r(sh / 2)} ${r(cx + tw + sh / 2)},0 ${r(cx + tw + sh)},0`,
    // Borde superior hacia la esquina derecha
    `L ${r(w)},0`,
    // Lateral derecho continuo
    `L ${r(w)},${r(h)}`,
    // Base inferior CONTINUA y sólida: erradica cortes y huecos por donde se filtraba el fondo
    `L 0,${r(h)}`,
    // Cierre hacia la esquina izquierda
    `Z`,
  ].join(' ');
}

/**
 * Bisel superior fino y sutil que resalta la cuna cóncava superior
 */
function getTopBorderPath(cx: number, w: number, progress: number = 1): string {
  const r = (n: number) => Math.round(n * 10) / 10;
  const tw = 24;
  const sh = 10 * progress;
  const td = 6.5 * progress;
  const rc = 5 * progress;

  return [
    `M 0,0.5`,
    `L ${r(cx - tw - sh)},0.5`,
    `C ${r(cx - tw - sh / 2)},0.5 ${r(cx - tw)},${r(sh / 2 + 0.5)} ${r(cx - tw)},${r(td - rc + 0.5)}`,
    `C ${r(cx - tw)},${r(td + 0.5)} ${r(cx - tw + rc / 2)},${r(td + 0.5)} ${r(cx - tw + rc)},${r(td + 0.5)}`,
    `L ${r(cx + tw - rc)},${r(td + 0.5)}`,
    `C ${r(cx + tw - rc / 2)},${r(td + 0.5)} ${r(cx + tw)},${r(td + 0.5)} ${r(cx + tw)},${r(td - rc + 0.5)}`,
    `C ${r(cx + tw)},${r(sh / 2 + 0.5)} ${r(cx + tw + sh / 2)},0.5 ${r(cx + tw + sh)},0.5`,
    `L ${r(w)},0.5`,
  ].join(' ');
}

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const navRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [clickCount, setClickCount] = useState(0);

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

  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 390,
    height: 48,
    activeX: 195,
  });

  useEffect(() => {
    const updateMetrics = () => {
      if (navRef.current) {
        const navRect = navRef.current.getBoundingClientRect();
        const currentItem = itemRefs.current[activeIndex];
        let cx = (activeIndex + 0.5) * (navRect.width / navItems.length);
        if (currentItem) {
          const itemRect = currentItem.getBoundingClientRect();
          if (itemRect.width > 0) {
            cx = itemRect.left - navRect.left + itemRect.width / 2;
          }
        }
        setDimensions({
          width: navRect.width,
          height: navRect.height || 48,
          activeX: cx,
        });
      }
    };

    updateMetrics();
    window.addEventListener('resize', updateMetrics);
    return () => window.removeEventListener('resize', updateMetrics);
  }, [activeIndex, navItems.length]);

  const targetX = dimensions.activeX > 0 ? dimensions.activeX : 195;

  return (
    <nav
      ref={navRef}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-transparent drop-shadow-[0_-4px_24px_rgba(0,0,0,0.35)] pb-[max(env(safe-area-inset-bottom),6px)] transition-all select-none overflow-visible"
      aria-label="Navegación móvil inferior"
    >
      {/* ========================================================
          BARRA CONTINUA CÓNCAVA: DISCRETA, COMPACTA Y SIN HUECOS
          - Fondo verde hero (#6ef7aa a #34bf74).
          - Cuna suave de 6.5px bajo el cuadro naranja sin cortar el fondo.
          - Base inferior 100% continua y sólida.
         ======================================================== */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-visible"
        width="100%"
        height="100%"
      >
        <defs>
          <linearGradient id="navBarGreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6ef7aa" />
            <stop offset="45%" stopColor="#5be196" />
            <stop offset="100%" stopColor="#34bf74" />
          </linearGradient>

          <filter id="cutoutInnerShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#047857" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Cuerpo de la barra verde hero */}
        <motion.path
          key={`bar-body-${activeIndex}-${clickCount}`}
          initial={
            clickCount > 0
              ? { d: getBarPath(targetX, dimensions.width, dimensions.height, 0) }
              : false
          }
          animate={{
            d: getBarPath(targetX, dimensions.width, dimensions.height, 1),
          }}
          transition={{
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
          fill="url(#navBarGreenGrad)"
          fillOpacity={0.98}
          filter="url(#cutoutInnerShadow)"
        />

        {/* Bisel superior sutil */}
        <motion.path
          key={`bar-top-${activeIndex}-${clickCount}`}
          initial={
            clickCount > 0
              ? { d: getTopBorderPath(targetX, dimensions.width, 0) }
              : false
          }
          animate={{
            d: getTopBorderPath(targetX, dimensions.width, 1),
          }}
          transition={{
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth={1}
          fill="none"
        />
      </svg>

      <div className="flex items-center justify-around px-2 h-[48px]">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive =
            currentPage === item.id ||
            (item.id === 'properties' && currentPage === 'property-detail');

          return (
            <a
              key={item.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              href={getPageCanonicalHash(item.id)}
              onClick={(e) => {
                e.preventDefault();
                const el = itemRefs.current[index];
                if (el && navRef.current) {
                  const navRect = navRef.current.getBoundingClientRect();
                  const itemRect = el.getBoundingClientRect();
                  if (itemRect.width > 0) {
                    const cx = itemRect.left - navRect.left + itemRect.width / 2;
                    setDimensions((prev) => ({ ...prev, activeX: cx }));
                  }
                }
                setClickCount((prev) => prev + 1);
                onNavigate(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="relative flex flex-col items-center justify-center py-0.5 px-1 rounded-2xl cursor-pointer min-w-[52px] sm:min-w-[60px] h-[46px] touch-manipulation group"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive ? (
                <>
                  {/* ========================================================
                      1. CUADRO NARANJA HERO (#F58220): SOBRESALE CON DISTINCIÓN
                      Compacto (40x40px), flotando elegantemente a -top-3.5
                     ======================================================== */}
                  <motion.div
                    key={`square-${item.id}-${clickCount}`}
                    initial={clickCount > 0 ? { scale: 0.85, y: 8 } : false}
                    animate={{ scale: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileTap={{ scale: 0.93 }}
                    style={{ left: '50%', x: '-50%' }}
                    className="absolute -top-3.5 w-10 h-10 rounded-2xl bg-gradient-to-b from-[#ffa352] via-[#F58220] to-[#d94e08] flex items-center justify-center text-black z-20 cursor-pointer shadow-[0_4px_14px_rgba(245,130,32,0.5),0_0_20px_rgba(245,130,32,0.25)] border border-white/25"
                  >
                    <Icon className="w-5 h-5 stroke-[2.5] text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]" />
                  </motion.div>

                  {/* ========================================================
                      2. ETIQUETA INFERIOR DISCRETA Y DE LUJO
                      Sutil sobre la barra sólida, sin romperla ni ahondar huecos
                     ======================================================== */}
                  <motion.div
                    key={`label-${item.id}-${clickCount}`}
                    initial={clickCount > 0 ? { opacity: 0, scale: 0.9 } : false}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.35,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ left: '50%', x: '-50%' }}
                    className="absolute bottom-1 z-20 pointer-events-none"
                  >
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-950 bg-black/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {item.label}
                    </span>
                  </motion.div>
                </>
              ) : (
                /* Ícono en reposo sobre la barra verde hero en negro con alto contraste */
                <div className="flex items-center justify-center w-9 h-9 text-slate-950/80 group-hover:text-black transition-colors">
                  <Icon className="w-5 h-5 stroke-[2.3]" />
                </div>
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
