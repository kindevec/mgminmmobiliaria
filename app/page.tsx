'use client';

import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from '@/src/components/Header';
import { BottomNav } from '@/src/components/BottomNav';
import { Footer } from '@/src/components/Footer';
import { WhatsAppFAB } from '@/src/components/WhatsAppFAB';
import type { LegalTab } from '@/src/components/modals/LegalModal';
import { InteractiveBackground } from '@/src/components/InteractiveBackground';
import { PropertyProvider, useProperties } from '@/src/context/PropertyContext';

const HomeView = lazy(() => import('@/src/components/views/HomeView').then((m) => ({ default: m.HomeView })));
const LegalModal = lazy(() => import('@/src/components/modals/LegalModal').then((m) => ({ default: m.LegalModal })));
const PropertyDetailView = lazy(() => import('@/src/components/views/PropertyDetailView').then((m) => ({ default: m.PropertyDetailView })));
const AboutView = lazy(() => import('@/src/components/views/AboutView').then((m) => ({ default: m.AboutView })));
const PropertiesView = lazy(() => import('@/src/components/views/PropertiesView').then((m) => ({ default: m.PropertiesView })));
const ContactView = lazy(() => import('@/src/components/views/ContactView').then((m) => ({ default: m.ContactView })));
const AdminView = lazy(() => import('@/src/components/views/AdminView').then((m) => ({ default: m.AdminView })));
const PrivacyView = lazy(() => import('@/src/components/views/PrivacyView').then((m) => ({ default: m.PrivacyView })));

import { ScrollToTop } from '@/src/components/ScrollToTop';
import { LOTS_DATA, type LotProperty } from '@/src/data/lots';
import {
  type PageView,
  PAGES_CONFIG,
  resolvePageFromHash,
} from '@/src/data/navigation';

export default function HomePage() {
  return (
    <PropertyProvider>
      <HomePageContent />
    </PropertyProvider>
  );
}

function HomePageContent() {
  const { properties } = useProperties();

  // Propiedades públicas activas (excluyendo 'Inactiva' / Borrador)
  const activeProperties = useMemo(
    () => properties.filter((p) => p.status !== 'Inactiva'),
    [properties]
  );

  const [currentPage, setCurrentPage] = useState<PageView>(() => {
    if (typeof window !== 'undefined') {
      return resolvePageFromHash(window.location.hash);
    }
    return 'home';
  });
  const [selectedLot, setSelectedLot] = useState<LotProperty | null>(null);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTab>('privacy');

  // Filter state passed from Home search bar
  const [filterLocation, setFilterLocation] = useState('Todas');
  const [filterType, setFilterType] = useState('Todos');

  // Sincronización robusta bidireccional con el hash de la URL (Back / Forward nativo)
  useEffect(() => {
    const handleUrlSync = () => {
      const rawHash = window.location.hash;
      const targetPage = resolvePageFromHash(rawHash);
      const pageConfig = PAGES_CONFIG[targetPage];

      // 1. Actualizar título, descripción, canonical y directivas de robots por ruta
      if (typeof document !== 'undefined' && pageConfig?.fullTitle) {
        document.title = pageConfig.fullTitle;
        const descMeta = document.querySelector('meta[name="description"]');
        if (descMeta && pageConfig.description) {
          descMeta.setAttribute('content', pageConfig.description);
        }
        const canonicalLink = document.querySelector('link[rel="canonical"]');
        if (canonicalLink && pageConfig.path) {
          canonicalLink.setAttribute('href', `https://www.mgminmobiliariaec.com${pageConfig.path}`);
        }
        const robotsMeta = document.querySelector('meta[name="robots"]');
        if (robotsMeta) {
          const isPrivate = targetPage === 'admin';
          robotsMeta.setAttribute(
            'content',
            isPrivate
              ? 'noindex, nofollow'
              : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
          );
        }
      }

      // 2. Comprobar si el hash o el pathname incluye un lote específico (ej. /lote/vm-101 o #lote/vm-101)
      const cleanHash = decodeURIComponent(rawHash).replace(/^#\/?/, '').trim();
      const pathname = typeof window !== 'undefined' ? window.location.pathname.replace(/^\/+|\/+$/g, '').trim() : '';
      const urlTarget = cleanHash || pathname;
      if (urlTarget.includes('/')) {
        const parts = urlTarget.split('/');
        const lotIdentifier = parts[1]?.toLowerCase();
        if (lotIdentifier) {
          const matchedLot =
            activeProperties.find(
              (l) => l.code.toLowerCase() === lotIdentifier || l.id.toLowerCase() === lotIdentifier
            ) ||
            LOTS_DATA.find(
              (l) =>
                l.status !== 'Inactiva' &&
                (l.code.toLowerCase() === lotIdentifier || l.id.toLowerCase() === lotIdentifier)
            );
          if (matchedLot) {
            setSelectedLot(matchedLot);
            if (typeof document !== 'undefined') {
              document.title = `${matchedLot.code} - ${matchedLot.name} | MGM Inmobiliaria`;
            }
          }
        }
      }

      // 3. Cambiar vista si es diferente y realizar scroll hacia arriba
      setCurrentPage((prev) => {
        if (prev !== targetPage) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return targetPage;
      });

      // 4. Normalizar URL si se ingresó con hash a una ruta canónica (ej. /#admin -> /admin)
      if (typeof window !== 'undefined' && window.location.hash) {
        const canonical = pageConfig?.path;
        if (canonical && canonical !== window.location.pathname && !urlTarget.includes('/')) {
          window.history.replaceState({ page: targetPage }, '', canonical);
        }
      }
    };

    // Sincronizar en carga inicial
    handleUrlSync();

    // Escuchar tanto hashchange como popstate para retroceder y avanzar con total fidelidad
    window.addEventListener('hashchange', handleUrlSync);
    window.addEventListener('popstate', handleUrlSync);

    return () => {
      window.removeEventListener('hashchange', handleUrlSync);
      window.removeEventListener('popstate', handleUrlSync);
    };
  }, [activeProperties]);

  const handleNavigate = (page: PageView) => {
    // 1. Inmediatamente cambiar la vista en React sin depender de eventos asíncronos del navegador
    setCurrentPage(page);

    // 2. Actualizar título de la página en la pestaña
    if (typeof document !== 'undefined') {
      document.title = PAGES_CONFIG[page]?.fullTitle || 'MGM Inmobiliaria';
    }

    // 3. Gestión de scroll
    if (page === 'properties') {
      if (currentPage === 'properties') {
        const catalogEl = document.getElementById('catalog-search-section');
        if (catalogEl) {
          catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 4. Actualizar la URL limpia sin '#' usando HTML5 History API
    const targetPath = PAGES_CONFIG[page]?.path || '/';
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath !== targetPath || window.location.hash) {
        window.history.pushState({ page }, '', targetPath);
      }
    }
  };

  const handleHeroFilterSearch = (location: string, type: string) => {
    setFilterLocation(location);
    setFilterType(type);
    handleNavigate('properties');
  };

  const handleSelectLot = (lot: LotProperty) => {
    setSelectedLot(lot);
    setCurrentPage('property-detail');
    if (typeof document !== 'undefined') {
      document.title = `${lot.code} - ${lot.name} | MGM Inmobiliaria`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof window !== 'undefined') {
      window.history.pushState(
        { page: 'property-detail', code: lot.code },
        '',
        `/lote/${encodeURIComponent(lot.code.toLowerCase())}`
      );
    }
  };

  const handleOpenLegalModal = (tab: LegalTab = 'privacy') => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col relative text-slate-800 antialiased font-sans selection:bg-emerald-600 selection:text-white">
      {/* ScrollToTop Ergonomic Behavior */}
      <ScrollToTop triggerKey={currentPage} />

      {/* Dynamic Ambient Interactive Background */}
      <InteractiveBackground />

      {/* 1. Header (Solo en vistas públicas) */}
      {currentPage !== 'admin' && (
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
      )}

      {/* 2. Main Content Container with Strict Anti-Overflow */}
      <main className={`flex-1 w-full overflow-x-clip ${currentPage === 'admin' ? 'p-0 pb-0' : 'pb-24 md:pb-12 pt-0'}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full"
          >
            <Suspense fallback={<div className="min-h-[60vh] w-full" />}>
              {currentPage === 'home' && (
                <HomeView
                  onNavigate={handleNavigate}
                  onSelectLot={handleSelectLot}
                  onFilterSearch={handleHeroFilterSearch}
                />
              )}

              {currentPage === 'about' && (
                <AboutView
                  onNavigate={handleNavigate}
                />
              )}

              {currentPage === 'properties' && (
                <PropertiesView
                  onSelectLot={handleSelectLot}
                  initialLocation={filterLocation}
                  initialType={filterType}
                />
              )}

              {currentPage === 'contact' && (
                <ContactView
                  onOpenLegalModal={handleOpenLegalModal}
                />
              )}

              {currentPage === 'admin' && (
                <AdminView onNavigate={handleNavigate} />
              )}

              {currentPage === 'privacy' && (
                <PrivacyView onNavigate={handleNavigate} />
              )}

              {currentPage === 'property-detail' && (
                <PropertyDetailView
                  lot={
                    selectedLot && selectedLot.status !== 'Inactiva'
                      ? selectedLot
                      : activeProperties[0] || LOTS_DATA[0]
                  }
                  allLots={activeProperties.length > 0 ? activeProperties : LOTS_DATA}
                  onNavigate={handleNavigate}
                  onSelectLot={handleSelectLot}
                />
              )}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Corporate Footer with Kindev Official Backlink (Solo en vistas públicas) */}
      {currentPage !== 'admin' && (
        <Footer
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenLegalModal={handleOpenLegalModal}
        />
      )}

      {/* 4. Mobile Ergonomic Bottom Navigation Bar (< 768px - Solo en vistas públicas) */}
      {currentPage !== 'admin' && (
        <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />
      )}

      {/* 5. Persistent Smart WhatsApp FAB (Solo en vistas públicas) */}
      {currentPage !== 'admin' && (
        <WhatsAppFAB />
      )}

      {/* 6. Blindaje Legal (Privacidad, Términos, Cookies) */}
      <Suspense fallback={null}>
        {isLegalModalOpen && (
          <LegalModal
            isOpen={isLegalModalOpen}
            onClose={() => setIsLegalModalOpen(false)}
            initialTab={legalModalTab}
          />
        )}
      </Suspense>
    </div>
  );
}
