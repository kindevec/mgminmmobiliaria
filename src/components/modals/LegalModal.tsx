'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, FileText, Cookie, Scale } from 'lucide-react';

export type LegalTab = 'privacy' | 'terms' | 'cookies';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

export function LegalModal({ isOpen, onClose, initialTab = 'privacy' }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-3xl max-h-[88vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
        >
          {/* Header */}
          <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-[#113d22]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 id="legal-modal-title" className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  Marco Legal & Protección de Datos
                </h2>
                <p className="text-xs text-slate-500">Sociedad Civil MGM Inmobiliaria · Ecuador</p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar ventana legal"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 bg-white px-5 sm:px-6 gap-2 sm:gap-4 overflow-x-auto text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`py-3 px-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'privacy'
                  ? 'border-[#22A33D] text-[#113d22]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Política de Privacidad</span>
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`py-3 px-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'terms'
                  ? 'border-[#22A33D] text-[#113d22]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Términos y Condiciones</span>
            </button>
            <button
              onClick={() => setActiveTab('cookies')}
              className={`py-3 px-2 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'cookies'
                  ? 'border-[#22A33D] text-[#113d22]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Cookie className="h-4 w-4" />
              <span>Política de Cookies</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {activeTab === 'privacy' && (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="text-base font-bold text-slate-900">Política de Privacidad y Tratamiento de Datos Personales</h3>
                  <p className="text-xs text-slate-500">Conforme a la Ley Orgánica de Protección de Datos Personales (LOPDP - Ecuador)</p>
                </div>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-900">1. Responsable del Tratamiento</h4>
                  <p>
                    <strong>Sociedad Civil MGM Inmobiliaria</strong>, con domicilio legal en Azuay, Ecuador, es el titular y responsable del tratamiento legítimo de los datos suministrados a través de este portal oficial.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-900">2. Finalidad y Principio de Minimización</h4>
                  <p>
                    Solo recabamos los datos estrictamente necesarios (nombre, teléfono y preferencias del lote o proyecto) con la exclusiva finalidad de:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Coordinar visitas a obras o citas con asesores autorizados.</li>
                    <li>Suministrar cotizaciones, tablas de amortización y especificaciones de lotes.</li>
                    <li>Atender solicitudes de revisión y formalización de escrituras notariales.</li>
                  </ul>
                  <p className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <strong>Garantía de Confidencialidad:</strong> No comercializamos, alquilamos ni transferimos sus datos de contacto a intermediarios ni a agencias de publicidad externas.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-900">3. Base Jurídica y Consentimiento</h4>
                  <p>
                    El tratamiento se sustenta en su consentimiento libre, explícito e informado brindado al enviar nuestros formularios de contacto o interactuar con nuestros canales de WhatsApp institucional.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-900">4. Ejercicio de Derechos (Acceso, Rectificación y Supresión)</h4>
                  <p>
                    Conforme a la ley, usted puede solicitar en cualquier momento la consulta, actualización o supresión de sus datos de nuestros registros escribiéndonos al correo oficial <strong className="text-slate-900">info@sociedadmgminmobiliaria.com</strong> o mediante nuestra línea directa.
                  </p>
                </section>
              </div>
            )}

            {activeTab === 'terms' && (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="text-base font-bold text-slate-900">Términos y Condiciones Generales</h3>
                  <p className="text-xs text-slate-500">Vigentes para la navegación y reserva de inmuebles</p>
                </div>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-900">1. Objeto y Alcance Informativo</h4>
                  <p>
                    La información de lotes, precios estimados, metrajes y cuotas expuestos en esta plataforma es de carácter referencial y orientativo de venta directa. Las condiciones definitivas se establecen formalmente en la respectiva Promesa de Compraventa o Escritura Pública celebrada ante Notario Público.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-900">2. Certeza Jurídica y Escrituración</h4>
                  <p>
                    Todos los lotes comercializados por Sociedad Civil MGM Inmobiliaria cuentan con respaldo legal, certificados de gravamen y procesos de independización predial vigentes. Toda entrega o transferencia de dominio se perfecciona bajo el marco legal de la República del Ecuador.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-900">3. Propiedad Intelectual</h4>
                  <p>
                    Las marcas, imágenes, renders, planos arquitectónicos y contenidos digitales pertenecen a Sociedad Civil MGM Inmobiliaria o a sus licenciantes. Queda prohibida su reproducción no autorizada con fines de comercialización ajena.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-900">4. Jurisdicción Aplicable</h4>
                  <p>
                    Para la resolución de cualquier divergencia derivada del uso de este sitio, las partes se someten a la legislación ecuatoriana y a los juzgados competentes de la provincia del Azuay.
                  </p>
                </section>
              </div>
            )}

            {activeTab === 'cookies' && (
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h3 className="text-base font-bold text-slate-900">Política de Cookies y Almacenamiento Local</h3>
                  <p className="text-xs text-slate-500">Transparencia en el uso de tecnologías de almacenamiento</p>
                </div>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-900">1. ¿Qué información almacenamos?</h4>
                  <p>
                    Este sitio web <strong>no utiliza cookies invasivas de rastreo publicitario de terceros</strong> ni comercializa perfiles de navegación.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-900">2. Cookies Técnicas y de Sesión</h4>
                  <p>
                    Únicamente se emplean identificadores de sesión y variables locales técnicas (como <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">localStorage</code>) para:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Mantener el estado de autenticación seguro en el panel administrativo.</li>
                    <li>Recordar la aceptación de políticas informativas y preferencias de navegación.</li>
                    <li>Garantizar el correcto funcionamiento de las animaciones y filtros del catálogo.</li>
                  </ul>
                </section>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-slate-900">3. Control desde el Navegador</h4>
                  <p>
                    Puede configurar su navegador para bloquear o advertirle sobre el almacenamiento de cookies técnicas, aunque ciertas funciones interactivas del catálogo podrían verse limitadas.
                  </p>
                </section>
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Actualizado 2026 · Cumplimiento LOPDP Ecuador</span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-[#22A33D] text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
