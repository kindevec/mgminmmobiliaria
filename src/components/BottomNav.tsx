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

  // Corte superior debajo del cuadro naranja (#F58220) (54px total para caja de 44px -> 5px de espacio a cada lado)
  const tw = 27;                   // semi-ancho = 27px (ancho total = 54px)
  const sh = 5 * progress;         // hombro curvo hacia el borde superior
  const td = 24 * progress;        // profundidad del corte superior (se hunde hacia abajo)
  const rc = 8 * progress;         // radio de esquinas inferiores

  // Hendidura inferior para la barrita de nombres (82px total para barrita de 72px -> 5px a cada lado)
  // Con forma cápsula redondeada que replica la forma de la barrita misma
  const bw = 41;                   // semi-ancho = 41px (ancho total = 82px)
  const b_sh = 5 * progress;       // hombro curvo hacia el borde inferior
  const bd = 34.5 * progress;      // profundidad de la hendidura hacia arriba en la barra (con separación mínima superior)
  const b_rc = 13.5 * progress;    // radio redondeado cápsula que replica la forma de la barrita

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
 * Bisel superior que resalta el corte bajo el cuadro naranja (#F58220) descendiendo
 */
function getTopBorderPath(cx: number, w: number, progress: number = 1): string {
  const r = (n: number) => Math.round(n * 10) / 10;
  const tw = 27;
  const sh = 5 * progress;
  const td = 24 * progress;
  const rc = 8 * progress;

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
  const bw = 41;
  const b_sh = 5 * progress;
  const bd = 34.5 * progress;
  const b_rc = 13.5 * progress;

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
    height: 62,
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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-transparent drop-shadow-[0_-4px_30px_rgba(0,0,0,0.55)] pb-[max(env(safe-area-inset-bottom),10px)] pt-2 transition-all select-none overflow-visible"
      aria-label="Navegación móvil inferior"
    >
      {/* ========================================================
          BARRA CORTADA DINÁMICA: LA HENDIDURA SE HUNDE HACIA ABAJO
          - Centrada exactamente con el contenedor del icono activo.
          - Fondo verde hero (#5be196 a #3ecb7e / #22A33D).
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
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#047857" floodOpacity="0.4" />
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
              className="relative flex flex-col items-center justify-center py-0.5 px-1 rounded-2xl cursor-pointer min-w-[56px] sm:min-w-[62px] h-[44px] touch-manipulation group"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive ? (
                <>
                  {/* ========================================================
                      1. CUADRO NARANJA HERO (#F58220): ELEVADO (-top-[28px])
                      Centrado al 50% con 5px a los lados.
                      Comienza abajo en su columna (y=44) y se eleva hacia arriba (y=0).
                     ======================================================== */}
                  <motion.div
                    key={`square-${item.id}-${clickCount}`}
                    initial={clickCount > 0 ? { y: 44 } : false}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 1.25,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileTap={{ scale: 0.94 }}
                    style={{ left: '50%', x: '-50%' }}
                    className="absolute -top-[28px] w-11 h-11 rounded-2xl bg-gradient-to-b from-[#ffa352] via-[#F58220] to-[#d94e08] flex items-center justify-center text-black z-20 cursor-pointer shadow-[0_0_18px_#F58220,0_0_36px_rgba(245,130,32,0.6),0_0_50px_rgba(245,130,32,0.3)]"
                  >
                    <Icon className="w-5.5 h-5.5 stroke-[2.5] text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]" />
                  </motion.div>

                  {/* ========================================================
                      2. BARRITA DEL NOMBRE EN NARANJA HERO (#F58220)
                      - Abrazada perfectamente por la pestaña inferior de la barra.
                      - Centrada al 50% con 5px a los lados.
                      - Elevada más arriba dentro de la barra.
                     ======================================================== */}
                  <motion.div
                    key={`label-${item.id}-${clickCount}`}
                    initial={clickCount > 0 ? { y: -36 } : false}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 1.25,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ left: '50%', x: '-50%' }}
                    className="absolute bottom-[1.5px] w-[72px] h-[19px] rounded-full bg-gradient-to-r from-[#ffa352] via-[#F58220] to-[#ffa352] flex items-center justify-center z-20 shadow-[0_0_14px_rgba(245,130,32,0.7)]"
                  >
                    <span className="text-[8.5px] font-black uppercase tracking-wider text-black whitespace-nowrap px-1">
                      {item.label}
                    </span>
                  </motion.div>
                </>
              ) : (
                /* Ícono en reposo sobre la barra verde hero en negro con alto contraste */
                <div className="flex items-center justify-center w-10 h-10 text-slate-950/85 group-hover:text-black transition-colors">
                  <Icon className="w-5.5 h-5.5 stroke-[2.4]" />
                </div>
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
