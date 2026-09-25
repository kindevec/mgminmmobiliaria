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
 * 1. Corte superior: Con 5px de espacio a los lados del cuadro del icono (ancho 58px para caja de 48px).
 *    Animable verticalmente de 0 a 1 (se hunde hacia abajo).
 * 2. Corte inferior: Espejo exacto al contrario con 5px de espacio a los lados de la barrita del nombre (ancho 86px para barra de 76px).
 *    Animable verticalmente de 0 a 1 (se hunde hacia arriba).
 */
function getBarPath(cx: number, w: number, h: number, progress: number = 1): string {
  const r = (n: number) => Math.round(n * 10) / 10;

  // Corte superior debajo del cuadro verde (#5be196) (58px total para caja de 48px -> 5px de espacio a cada lado)
  const tw = 29;                   // semi-ancho = 29px (ancho total = 58px)
  const sh = 6 * progress;         // hombro curvo hacia el borde superior
  const td = 30 * progress;        // profundidad del corte superior (se hunde hacia abajo)
  const rc = 10 * progress;        // radio de esquinas inferiores

  // Hendidura inferior para la barrita de nombres (86px total para barrita de 76px -> 5px a cada lado)
  // Con forma cápsula redondeada que replica la forma de la barrita misma
  const bw = 43;                   // semi-ancho = 43px (ancho total = 86px)
  const b_sh = 6 * progress;       // hombro curvo hacia el borde inferior
  const bd = 32 * progress;        // profundidad de la hendidura hacia arriba en la barra
  const b_rc = 16 * progress;      // radio redondeado cápsula que replica la forma de la barrita

  return [
    `M 0,0`,
    // Borde superior hacia el corte del cuadro
    `L ${r(cx - tw - sh)},0`,
    `C ${r(cx - tw - sh / 2)},0 ${r(cx - tw)},${r(sh / 2)} ${r(cx - tw)},${r(sh)}`,
    // Pared vertical izquierda del corte
    `L ${r(cx - tw)},${r(td - rc)}`,
    // Esquina inferior izquierda redondeada
    `C ${r(cx - tw)},${r(td)} ${r(cx - tw + rc / 2)},${r(td)} ${r(cx - tw + rc)},${r(td)}`,
    // Base horizontal del corte bajo el cuadro
    `L ${r(cx + tw - rc)},${r(td)}`,
    // Esquina inferior derecha redondeada
    `C ${r(cx + tw - rc / 2)},${r(td)} ${r(cx + tw)},${r(td)} ${r(cx + tw)},${r(td - rc)}`,
    // Pared vertical derecha del corte
    `L ${r(cx + tw)},${r(sh)}`,
    // Hombro derecho hacia el borde superior
    `C ${r(cx + tw)},${r(sh / 2)} ${r(cx + tw + sh / 2)},0 ${r(cx + tw + sh)},0`,
    // Borde superior hacia la esquina derecha
    `L ${r(w)},0`,
    // Borde lateral derecho
    `L ${r(w)},${r(h)}`,
    // Borde inferior hasta la hendidura inferior
    `L ${r(cx + bw + b_sh)},${r(h)}`,
    // Hombro curvo hacia la hendidura
    `C ${r(cx + bw + b_sh * 0.45)},${r(h)} ${r(cx + bw)},${r(h - b_sh * 0.45)} ${r(cx + bw)},${r(h - b_sh)}`,
    // Pared vertical derecha de la hendidura (hacia arriba)
    `L ${r(cx + bw)},${r(h - bd + b_rc)}`,
    // Esquina superior derecha ampliamente redondeada (forma cápsula como la barrita)
    `C ${r(cx + bw)},${r(h - bd + b_rc * 0.45)} ${r(cx + bw - b_rc * 0.45)},${r(h - bd)} ${r(cx + bw - b_rc)},${r(h - bd)}`,
    // Techo horizontal de la hendidura
    `L ${r(cx - bw + b_rc)},${r(h - bd)}`,
    // Esquina superior izquierda ampliamente redondeada (forma cápsula como la barrita)
    `C ${r(cx - bw + b_rc * 0.45)},${r(h - bd)} ${r(cx - bw)},${r(h - bd + b_rc * 0.45)} ${r(cx - bw)},${r(h - bd + b_rc)}`,
    // Pared vertical izquierda de la hendidura (hacia abajo)
    `L ${r(cx - bw)},${r(h - b_sh)}`,
    // Hombro curvo hacia el borde inferior de la barra
    `C ${r(cx - bw)},${r(h - b_sh * 0.45)} ${r(cx - bw - b_sh * 0.45)},${r(h)} ${r(cx - bw - b_sh)},${r(h)}`,
    // Cierre hacia la esquina izquierda
    `L 0,${r(h)} Z`,
  ].join(' ');
}

/**
 * Bisel superior que resalta el corte bajo el cuadro verde (#5be196) descendiendo
 */
function getTopBorderPath(cx: number, w: number, progress: number = 1): string {
  const r = (n: number) => Math.round(n * 10) / 10;
  const tw = 29;
  const sh = 6 * progress;
  const td = 30 * progress;
  const rc = 10 * progress;

  return [
    `M 0,0.5`,
    `L ${r(cx - tw - sh)},0.5`,
    `C ${r(cx - tw - sh / 2)},0.5 ${r(cx - tw)},${r(sh / 2 + 0.5)} ${r(cx - tw)},${r(sh + 0.5)}`,
    `L ${r(cx - tw)},${r(td - rc + 0.5)}`,
    `C ${r(cx - tw)},${r(td + 0.5)} ${r(cx - tw + rc / 2)},${r(td + 0.5)} ${r(cx - tw + rc)},${r(td + 0.5)}`,
    `L ${r(cx + tw - rc)},${r(td + 0.5)}`,
    `C ${r(cx + tw - rc / 2)},${r(td + 0.5)} ${r(cx + tw)},${r(td + 0.5)} ${r(cx + tw)},${r(td - rc + 0.5)}`,
    `L ${r(cx + tw)},${r(sh + 0.5)}`,
    `C ${r(cx + tw)},${r(sh / 2 + 0.5)} ${r(cx + tw + sh / 2)},0.5 ${r(cx + tw + sh)},0.5`,
    `L ${r(w)},0.5`,
  ].join(' ');
}

/**
 * Bisel inferior que resalta la hendidura de la barrita con forma redondeada cápsula
 */
function getBottomBorderPath(cx: number, w: number, h: number, progress: number = 1): string {
  const r = (n: number) => Math.round(n * 10) / 10;
  const bw = 43;
  const b_sh = 6 * progress;
  const bd = 32 * progress;
  const b_rc = 16 * progress;

  return [
    `M ${r(w)},${r(h - 0.5)}`,
    `L ${r(cx + bw + b_sh)},${r(h - 0.5)}`,
    `C ${r(cx + bw + b_sh * 0.45)},${r(h - 0.5)} ${r(cx + bw)},${r(h - b_sh * 0.45 - 0.5)} ${r(cx + bw)},${r(h - b_sh - 0.5)}`,
    `L ${r(cx + bw)},${r(h - bd + b_rc - 0.5)}`,
    `C ${r(cx + bw)},${r(h - bd + b_rc * 0.45 - 0.5)} ${r(cx + bw - b_rc * 0.45)},${r(h - bd - 0.5)} ${r(cx + bw - b_rc)},${r(h - bd - 0.5)}`,
    `L ${r(cx - bw + b_rc)},${r(h - bd - 0.5)}`,
    `C ${r(cx - bw + b_rc * 0.45)},${r(h - bd - 0.5)} ${r(cx - bw)},${r(h - bd + b_rc * 0.45 - 0.5)} ${r(cx - bw)},${r(h - bd + b_rc - 0.5)}`,
    `L ${r(cx - bw)},${r(h - b_sh - 0.5)}`,
    `C ${r(cx - bw)},${r(h - b_sh * 0.45 - 0.5)} ${r(cx - bw - b_sh * 0.45)},${r(h - 0.5)} ${r(cx - bw - b_sh)},${r(h - 0.5)}`,
    `L 0,${r(h - 0.5)}`,
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
    height: 74,
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
          height: navRect.height,
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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-transparent drop-shadow-[0_-4px_30px_rgba(0,0,0,0.55)] pb-[max(env(safe-area-inset-bottom),18px)] pt-3 transition-all select-none overflow-visible"
      aria-label="Navegación móvil inferior"
    >
      {/* ========================================================
          BARRA CORTADA DINÁMICA: LA HENDIDURA SE HUNDE HACIA ABAJO
          - Centrada exactamente con el contenedor del icono activo.
          - Fondo naranja corporativo (#F58220 a #d94e08).
         ======================================================== */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-visible"
        width="100%"
        height="100%"
      >
        <defs>
          <linearGradient id="navBarGreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F58220" />
            <stop offset="100%" stopColor="#d94e08" />
          </linearGradient>

          <filter id="cutoutInnerShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#7c2d12" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Cuerpo de la barra naranja */}
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
            duration: 1.25,
            ease: [0.16, 1, 0.3, 1],
          }}
          fill="url(#navBarGreenGrad)"
          fillOpacity={0.98}
          filter="url(#cutoutInnerShadow)"
        />

        {/* Bisel superior bien visible que se hunde lentamente hacia abajo */}
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
            duration: 1.25,
            ease: [0.16, 1, 0.3, 1],
          }}
          stroke="rgba(255, 255, 255, 0.22)"
          strokeWidth={1.3}
          fill="none"
        />

        {/* Bisel inferior de la abertura que se hunde lentamente hacia arriba */}
        <motion.path
          key={`bar-bottom-${activeIndex}-${clickCount}`}
          initial={
            clickCount > 0
              ? { d: getBottomBorderPath(targetX, dimensions.width, dimensions.height, 0) }
              : false
          }
          animate={{
            d: getBottomBorderPath(targetX, dimensions.width, dimensions.height, 1),
          }}
          transition={{
            duration: 1.25,
            ease: [0.16, 1, 0.3, 1],
          }}
          stroke="rgba(255, 255, 255, 0.26)"
          strokeWidth={1.3}
          fill="none"
        />
      </svg>

      <div className="flex items-center justify-around px-2">
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
              className="relative flex flex-col items-center justify-center py-1 px-1 rounded-2xl cursor-pointer min-w-[58px] sm:min-w-[64px] h-[52px] touch-manipulation group"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive ? (
                <>
                  {/* ========================================================
                      1. CUADRO VERDE MENTA HERO (#5be196): ELEVADO (-top-[36px])
                      Centrado al 50% con 5px a los lados.
                      Comienza abajo en su columna (y=54) y se eleva hacia arriba (y=0).
                     ======================================================== */}
                  <motion.div
                    key={`square-${item.id}-${clickCount}`}
                    initial={clickCount > 0 ? { y: 54 } : false}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 1.25,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileTap={{ scale: 0.94 }}
                    style={{ left: '50%', x: '-50%' }}
                    className="absolute -top-[36px] w-12 h-12 rounded-2xl bg-gradient-to-b from-[#7ef5b1] via-[#5be196] to-[#22A33D] flex items-center justify-center text-slate-950 z-20 cursor-pointer shadow-[0_0_20px_#5be196,0_0_40px_rgba(91,225,150,0.65),0_0_60px_rgba(91,225,150,0.35)]"
                  >
                    <Icon className="w-6 h-6 stroke-[2.5] text-slate-950 drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)]" />
                  </motion.div>

                  {/* ========================================================
                      2. BARRITA DEL NOMBRE EN VERDE HERO (#5be196)
                      - Abrazada perfectamente por la pestaña inferior de la barra.
                      - Centrada al 50% con 5px a los lados.
                      - Animación fluida.
                     ======================================================== */}
                  <motion.div
                    key={`label-${item.id}-${clickCount}`}
                    initial={clickCount > 0 ? { y: -54 } : false}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 1.25,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ left: '50%', x: '-50%' }}
                    className="absolute -bottom-[10px] w-[76px] h-[20px] rounded-full bg-gradient-to-r from-[#7ef5b1] via-[#5be196] to-[#7ef5b1] flex items-center justify-center z-20 shadow-[0_0_16px_rgba(91,225,150,0.75)]"
                  >
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-950 whitespace-nowrap px-1">
                      {item.label}
                    </span>
                  </motion.div>
                </>
              ) : (
                /* Ícono en reposo sobre la barra naranja (negro sólido con alto contraste) */
                <div className="flex items-center justify-center w-11 h-11 text-slate-950/80 group-hover:text-black transition-colors">
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
