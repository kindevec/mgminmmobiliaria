'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { WhatsAppIcon } from './SocialIcons';
import { getGeneralWhatsAppUrl } from '@/src/data/lots';

export function WhatsAppFAB() {
  const [isOpenTooltip, setIsOpenTooltip] = useState(true);

  return (
    <div className="fixed bottom-22 md:bottom-8 right-4 sm:right-6 z-40 flex items-end gap-2 group">
      {/* Tooltip badge */}
      {isOpenTooltip && (
        <div className="hidden sm:flex items-center gap-2.5 bg-slate-900/95 text-white text-xs font-medium py-2.5 px-3.5 rounded-2xl shadow-2xl border border-slate-700/60 max-w-xs backdrop-blur-md animate-in fade-in slide-in-from-right-2 duration-300">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366]"></span>
          </span>
          <span className="text-[12px] text-slate-100 font-medium">
            ¿Deseas asesoría en línea? ¡Escríbenos a WhatsApp!
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsOpenTooltip(false);
            }}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer ml-1"
            aria-label="Cerrar aviso"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button with Official WhatsApp Icon */}
      <a
        href={getGeneralWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:bg-[#20bd5a] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
        aria-label="Contactar a MGM Inmobiliaria por WhatsApp Oficial"
      >
        {/* Pulse radar wave */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-35 animate-ping pointer-events-none" />

        <WhatsAppIcon size={28} className="text-white drop-shadow-xs" />
      </a>
    </div>
  );
}
