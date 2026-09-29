'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  FileText, 
  Cookie, 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  Building2, 
  Mail, 
  PhoneCall, 
  Scale
} from 'lucide-react';
import type { PageView } from '@/src/data/navigation';

interface PrivacyViewProps {
  onNavigate: (page: PageView) => void;
  defaultSection?: 'privacy' | 'terms' | 'cookies';
}

export function PrivacyView({ onNavigate, defaultSection = 'privacy' }: PrivacyViewProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'cookies'>(defaultSection);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 pt-8 sm:pt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb / Back button */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#113d22] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-[#22A33D]" />
            <span>Volver al Inicio</span>
          </button>

          <span className="text-[11px] font-medium text-slate-500 bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-3 py-1 rounded-full">
            Actualizado · Septiembre 2026
          </span>
        </div>

        {/* Hero Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-slate-200/80 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 sm:p-4 rounded-2xl bg-emerald-100/70 text-[#113d22] shrink-0">
              <Scale className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Marco Legal, Privacidad & Términos
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Sociedad Civil MGM Inmobiliaria · Cumplimiento de la Ley Orgánica de Protección de Datos Personales (LOPDP Ecuador) y normativa de comercio inmobiliario.
              </p>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="mt-8 flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto text-xs sm:text-sm font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('privacy')}
              className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'privacy'
                  ? 'border-[#22A33D] text-[#113d22]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Política de Privacidad</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('terms')}
              className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'terms'
                  ? 'border-[#22A33D] text-[#113d22]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Términos y Condiciones</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cookies')}
              className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'cookies'
                  ? 'border-[#22A33D] text-[#113d22]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Cookie className="h-4 w-4" />
              <span>Política de Cookies</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-slate-200/80">
          {activeTab === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div className="border-b border-slate-100 pb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#22A33D]">Sección 1</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Política de Privacidad y Protección de Datos Personales
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  En cumplimiento riguroso con la Ley Orgánica de Protección de Datos Personales de la República del Ecuador (LOPDP).
                </p>
              </div>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#22A33D]" />
                  1. Identidad y Responsable del Tratamiento
                </h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  <strong>Sociedad Civil MGM Inmobiliaria</strong>, entidad debidamente constituida conforme a las leyes ecuatorianas con operaciones en la provincia del Azuay, es la titular y responsable directa del tratamiento lícito, leal y transparente de los datos personales suministrados voluntariamente por los usuarios en este portal web.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-[#22A33D]" />
                  2. Finalidad y Principio de Minimización de Datos
                </h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  Recabamos exclusivamente los datos necesarios y pertinentes (nombre completo, número de teléfono WhatsApp y preferencias de compra o inversión) para las siguientes finalidades precisas:
                </p>
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <h4 className="font-bold text-xs text-slate-900 mb-1">Coordinación de Visitas</h4>
                    <p className="text-xs text-slate-600">Agendar recorridos guiados y citas directas con nuestros asesores en obras urbanizadas.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <h4 className="font-bold text-xs text-slate-900 mb-1">Simulación Financiera</h4>
                    <p className="text-xs text-slate-600">Elaborar cotizaciones formales, tablas de cuotas directas sin intermediación bancaria y planos de lotes.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <h4 className="font-bold text-xs text-slate-900 mb-1">Certeza Notarial</h4>
                    <p className="text-xs text-slate-600">Verificar documentación jurídica y preparar minutas para escrituración ante Notario Público.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <h4 className="font-bold text-xs text-slate-900 mb-1">Blindaje Anti-Spam</h4>
                    <p className="text-xs text-slate-600">Garantizamos que sus datos no son cedidos, alquilados ni transferidos a redes comerciales externas.</p>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#22A33D]" />
                  3. Base Jurídica del Tratamiento
                </h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  El tratamiento de sus datos se fundamenta en su <strong>consentimiento libre, informado, previo y expreso</strong> al enviar nuestros formularios de contacto, agendar citas de visita o solicitar información vía WhatsApp. Usted puede revocar dicho consentimiento en cualquier momento.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#22A33D]" />
                  4. Derechos ARCO y Revocatoria
                </h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  Usted tiene derecho a solicitar el acceso, actualización, rectificación o eliminación definitiva de sus datos personales. Para ejercer estos derechos, puede comunicarse mediante nuestros canales oficiales:
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href="mailto:info@sociedadmgminmobiliaria.com"
                    className="inline-flex items-center gap-2 text-xs font-bold text-[#113d22] bg-emerald-50 hover:bg-emerald-100/80 px-4 py-2.5 rounded-xl border border-emerald-200 transition-colors"
                  >
                    <Mail className="h-4 w-4 text-[#22A33D]" />
                    <span>info@sociedadmgminmobiliaria.com</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => onNavigate('contact')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    <PhoneCall className="h-4 w-4 text-slate-600" />
                    <span>Formulario de Atención al Cliente</span>
                  </button>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'terms' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div className="border-b border-slate-100 pb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#22A33D]">Sección 2</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Términos y Condiciones Generales de Comercialización
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Condiciones de uso de la plataforma, alcance de cotizaciones y reservas inmobiliarias.
                </p>
              </div>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">1. Naturaleza Referencial de la Información</h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  Los precios, metrajes, planos y proyecciones de cuotas mostrados en el catálogo web tienen carácter informativo y orientativo de venta directa. Las condiciones comerciales y contractuales definitivas se estipulan y perfeccionan de manera oficial en la respectiva <strong>Promesa de Compraventa</strong> o <strong>Escritura Pública</strong> suscrita ante Notario Público.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">2. Certeza Notarial y Seguridad Jurídica</h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  Todos los proyectos urbanísticos y lotes desarrollados por Sociedad Civil MGM Inmobiliaria cuentan con títulos de dominio saneados, certificaciones del Registro de la Propiedad y aprobación de proyectos de parcelación conforme a las ordenanzas municipales correspondientes.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">3. Financiamiento Directo y Condiciones de Pago</h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  Nuestra modalidad de crédito directo de hasta 48 meses se otorga sin requerir aprobación bancaria tradicional, bajo acuerdos directos entre la desarrolladora y el comprador. Las tablas de amortización presentadas en cotizaciones son transparentes y libres de comisiones ocultas.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">4. Propiedad Intelectual</h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  Los logotipos, renders arquitectónicos, fotografías de obras, textos y código fuente de esta plataforma son propiedad exclusiva de Sociedad Civil MGM Inmobiliaria o de sus respectivos licenciantes. Queda prohibida su reproducción o utilización no autorizada con fines lucrativos ajenos.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">5. Jurisdicción y Ley Aplicable</h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  Para dirimir cualquier controversia legal referente a este sitio web o las operaciones inmobiliarias derivadas, las partes se someten expresamente a la jurisdicción de los jueces competentes de la ciudad de Cuenca, provincia del Azuay, República del Ecuador.
                </p>
              </section>
            </motion.div>
          )}

          {activeTab === 'cookies' && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div className="border-b border-slate-100 pb-5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#22A33D]">Sección 3</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Política de Cookies y Almacenamiento Local
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Transparencia absoluta: qué almacenamos en su dispositivo y por qué.
                </p>
              </div>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">1. ¿Qué información almacena este sitio web?</h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  Sociedad Civil MGM Inmobiliaria adopta una política de <strong>cero rastreo intrusivo</strong>. Nuestro portal <strong>NO emplea cookies publicitarias de terceros ni vende perfiles de comportamiento a intermediarios de anuncios</strong>.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">2. Cookies Técnicas y Almacenamiento de Sesión</h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  Utilizamos exclusivamente mecanismos de almacenamiento local (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs text-slate-800 font-mono">localStorage</code> y cookies de sesión esenciales) para:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                  <li><strong>Navegación e Historial:</strong> Sincronizar el catálogo de lotes, filtros por metraje y vistas interactivas sin recargar la página.</li>
                  <li><strong>Panel Administrativo:</strong> Mantener la sesión cifrada y autenticada para los administradores del inventario.</li>
                  <li><strong>Preferencias del Usuario:</strong> Recordar que usted ya visualizó este aviso legal para no mostrar notificaciones redundantes.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">3. Control y Desactivación</h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  Usted puede borrar en cualquier momento los datos locales o restringir las cookies desde el panel de preferencias de su navegador (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge). Tenga en cuenta que deshabilitar cookies técnicas esenciales podría afectar ciertas funciones interactivas del simulador de lotes.
                </p>
              </section>
            </motion.div>
          )}
        </div>

        {/* Bottom Back Button */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-[#113d22] text-white text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver a la Página Principal</span>
          </button>
        </div>
      </div>
    </div>
  );
}
