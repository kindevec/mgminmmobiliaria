'use client';

import React from 'react';
import { LogoMGM } from './LogoMGM';
import { Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import {
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from './SocialIcons';
import type { PageView } from './Header';
import { getGeneralWhatsAppUrl } from '@/src/data/lots';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onOpenVisitModal: () => void;
}

export function Footer({ onNavigate, onOpenVisitModal }: FooterProps) {
  const currentYear = 2026;

  return (
    <footer className="w-full bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-slate-800/70">
          {/* Col 1: Brand & Philosophy */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white/95 p-3 rounded-2xl inline-block shadow-md">
              <LogoMGM className="h-10 w-auto" variant="full" showSubtitle={true} />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Sociedad Civil MGM Inmobiliaria. Desarrolladores de comunidades
              urbanizadas planificadas en Ecuador. Brindamos solidez jurídica,
              escrituras notariales individuales y crédito directo sin bancos.
            </p>

            {/* Official Social Media Icons Bar */}
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
                Canales Oficiales
              </span>
              <div className="flex items-center gap-2.5">
                {/* Official WhatsApp */}
                <a
                  href={getGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Oficial de MGM Inmobiliaria"
                  className="h-10 w-10 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white flex items-center justify-center transition-all duration-200 border border-[#25D366]/30 hover:scale-105 active:scale-95"
                >
                  <WhatsAppIcon size={20} />
                </a>

                {/* Official Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Oficial de MGM Inmobiliaria"
                  className="h-10 w-10 rounded-xl bg-[#1877F2]/15 hover:bg-[#1877F2] text-[#1877F2] hover:text-white flex items-center justify-center transition-all duration-200 border border-[#1877F2]/30 hover:scale-105 active:scale-95"
                >
                  <FacebookIcon size={18} />
                </a>

                {/* Official Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Oficial de MGM Inmobiliaria"
                  className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-purple-500/20 hover:from-amber-500 hover:via-rose-500 hover:to-purple-500 text-rose-400 hover:text-white flex items-center justify-center transition-all duration-200 border border-rose-500/30 hover:scale-105 active:scale-95"
                >
                  <InstagramIcon size={18} />
                </a>

                {/* Official TikTok */}
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok Oficial de MGM Inmobiliaria"
                  className="h-10 w-10 rounded-xl bg-white/10 hover:bg-black text-slate-200 hover:text-[#00f2fe] flex items-center justify-center transition-all duration-200 border border-white/20 hover:border-[#00f2fe]/50 hover:scale-105 active:scale-95"
                >
                  <TikTokIcon size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase">
              Navegación
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Nosotros & Ley
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('properties');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Catálogo Lotes
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('miravalle');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Ciudadela Miravalle
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Contacto
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenVisitModal}
                  className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <span>Agendar Visita</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Proyectos & Soluciones */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase">
              Proyectos Destacados
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="border-l-2 border-emerald-500 pl-3">
                <button
                  onClick={() => {
                    onNavigate('miravalle');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="font-semibold text-white hover:text-emerald-400 text-left cursor-pointer"
                >
                  Ciudadela Miravalle
                </button>
                <p className="text-xs text-slate-400 mt-0.5">
                  Urbanización con vías de adoquín, servicios soterrados y canchas deportivas.
                </p>
              </li>
              <li className="border-l-2 border-amber-500 pl-3">
                <button
                  onClick={() => {
                    onNavigate('properties');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="font-semibold text-white hover:text-amber-400 text-left cursor-pointer"
                >
                  Lotes Esquineros & Comerciales
                </button>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ubicaciones estratégicas de alta plusvalía y doble frente.
                </p>
              </li>
              <li className="border-l-2 border-slate-700 pl-3">
                <span className="font-semibold text-slate-200">
                  Crédito Directo hasta 48 Meses
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Financiamiento sin intermediación bancaria para ecuatorianos y migrantes.
                </p>
              </li>
            </ul>
          </div>

          {/* Col 4: Atención & Contacto Directo */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase">
              Atención Directa
            </h4>
            <div className="space-y-3 text-sm">
              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:text-emerald-400 transition-colors group"
              >
                <div className="h-8 w-8 rounded-lg bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0 mt-0.5">
                  <WhatsAppIcon size={18} />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">WhatsApp Oficial</span>
                  <span className="font-mono font-semibold text-white group-hover:text-emerald-400">
                    +593 99 195 2889
                  </span>
                </div>
              </a>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-400 block">Horario de Atención</span>
                  <span className="text-slate-300 text-xs">
                    Lunes a Sábado: 08:30 – 18:00
                    <br />
                    Domingos: Recorridos con cita previa
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-400 block">Ubicación</span>
                  <span className="text-slate-300 text-xs">
                    Oficinas Centrales & Obras en Sitio · Ecuador
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Kindev Official Backlink */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {currentYear} Sociedad Civil MGM Inmobiliaria. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-1.5">
            <span>Desarrollado por</span>
            <a
              href="https://www.kindevsas.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-semibold underline decoration-emerald-500/40 hover:decoration-emerald-400 transition-colors inline-flex items-center gap-1"
            >
              Kindev
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
