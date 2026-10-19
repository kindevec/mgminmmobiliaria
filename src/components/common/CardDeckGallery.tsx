'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CardDeckGalleryProps<T> {
  id?: string;
  items: T[];
  renderCard: (item: T, index: number, isActive: boolean) => React.ReactNode;
  autoPlayInterval?: number; // default 3000ms
  className?: string;
  cardClassName?: string;
}

export function CardDeckGallery<T>({
  id = 'galeria-tarjeta-naipes',
  items,
  renderCard,
  autoPlayInterval = 3000,
  className = '',
  cardClassName = '',
}: CardDeckGalleryProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const total = items.length;

  // Auto-play timer cada 3 segundos
  useEffect(() => {
    if (total <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [total, isHovered, autoPlayInterval]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  // Índices visibles en la baraja (tope, segundo, tercero)
  const topItem = items[currentIndex];
  const secondIndex = (currentIndex + 1) % total;
  const secondItem = items[secondIndex];
  const thirdIndex = (currentIndex + 2) % total;
  const thirdItem = items[thirdIndex];

  return (
    <div
      id={id}
      className={`relative w-full max-w-2xl mx-auto select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Contenedor de la baraja con perspectiva y altura adecuada */}
      <div className="relative w-full min-h-[380px] sm:min-h-[360px] pb-12 flex items-center justify-center">
        {/* Tarjeta de fondo 2 (base del naipe - 100% opaca) */}
        {total > 2 && (
          <div
            className={`absolute top-0 w-full transition-all duration-500 ease-out pointer-events-none transform translate-y-7 scale-[0.88] z-10 shadow-md ${cardClassName}`}
          >
            {renderCard(thirdItem, thirdIndex, false)}
          </div>
        )}

        {/* Tarjeta de fondo 1 (segundo naipe asomando el borde - 100% opaca) */}
        {total > 1 && (
          <div
            className={`absolute top-0 w-full transition-all duration-500 ease-out pointer-events-none transform translate-y-3.5 scale-[0.94] z-20 shadow-lg ${cardClassName}`}
          >
            {renderCard(secondItem, secondIndex, false)}
          </div>
        )}

        {/* Tarjeta frontal activa con animación de deslizamiento sin transparencia */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 1, x: 28, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 1, x: -28, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full z-30 shadow-2xl ${cardClassName}`}
          >
            {renderCard(topItem, currentIndex, true)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controles de navegación de la baraja: Botones Izq / Der y Paginación */}
      <div className="flex items-center justify-between px-2 pt-2 gap-4">
        {/* Botón Anterior */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Tarjeta anterior"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-[#113d22] border border-slate-200/90 shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Indicadores de naipes & contador */}
        <div className="flex items-center gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Ir a tarjeta ${idx + 1}`}
              className={`transition-all duration-300 rounded-full h-2 cursor-pointer ${
                currentIndex === idx
                  ? 'w-6 bg-[#113d22] shadow-xs'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
          <span className="text-xs font-mono font-bold text-slate-600 ml-1.5">
            {currentIndex + 1}/{total}
          </span>
        </div>

        {/* Botón Siguiente */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Siguiente tarjeta"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-[#113d22] border border-slate-200/90 shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
