'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from '@/src/components/Header';
import { BottomNav } from '@/src/components/BottomNav';
import { Footer } from '@/src/components/Footer';
import { WhatsAppFAB } from '@/src/components/WhatsAppFAB';
import { VisitModal } from '@/src/components/VisitModal';
import { LegalModal, type LegalTab } from '@/src/components/modals/LegalModal';
import { PropertyDetailView } from '@/src/components/views/PropertyDetailView';
import { InteractiveBackground } from '@/src/components/InteractiveBackground';
import { HomeView } from '@/src/components/views/HomeView';
import { AboutView } from '@/src/components/views/AboutView';
import { PropertiesView } from '@/src/components/views/PropertiesView';
import { ContactView } from '@/src/components/views/ContactView';
import { AdminView } from '@/src/components/views/AdminView';
import { PrivacyView } from '@/src/components/views/PrivacyView';
import { NewPropertyView } from '@/src/components/views/NewPropertyView';
import { PropertyProvider, useProperties } from '@/src/context/PropertyContext';
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
  const [currentPage, setCurrentPage] = useState<PageView>(() => {
    if (typeof window !== 'undefined') {
      return resolvePageFromHash(window.location.hash);
    }
    return 'home';
  });
  const [selectedLot, setSelectedLot] = useState<LotProperty | null>(null);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [visitInterest, setVisitInterest] = useState('Ciudadela Miravalle');
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTab>('privacy');

  // Filter state passed from Home search bar
  const [filterLocation, setFilterLocation] = useState('Todas');
  const [filterType, setFilterType] = useState('Todos');
  const [filterMaxPrice, setFilterMaxPrice] = useState(100000);

  // Sincronización robusta bidireccional con el hash de la URL (Back / Forward nativo)
  useEffect(() => {
    const handleUrlSync = () => {
      const rawHash = window.location.hash;
      const targetPage = resolvePageFromHash(rawHash);
      const pageConfig = PAGES_CONFIG[targetPage];

      // 1. Actualizar el título de la página en la pestaña e historial del navegador
      if (typeof document !== 'undefined' && pageConfig?.fullTitle) {
        document.title = pageConfig.fullTitle;
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
            properties.find(
              (l) => l.code.toLowerCase() === lotIdentifier || l.id.toLowerCase() === lotIdentifier
            ) ||
            LOTS_DATA.find(
              (l) => l.code.toLowerCase() === lotIdentifier || l.id.toLowerCase() === lotIdentifier
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
  }, [properties]);

  const handleNavigate = (page: PageView) => {
    const targetHash = PAGES_CONFIG[page]?.hash || 'inicio';
    const currentHash = decodeURIComponent(window.location.hash)
      .replace(/^#\/?/, '')
      .toLowerCase()
      .trim();

    // 1. Cerrar modales abiertos
    setIsVisitModalOpen(false);

    // 2. Inmediatamente cambiar la vista en React sin depender de eventos asíncronos del navegador
    setCurrentPage(page);

    // 3. Actualizar título de la página en la pestaña
    if (typeof document !== 'undefined') {
      document.title = PAGES_CONFIG[page]?.fullTitle || 'MGM Inmobiliaria';
    }

    // 4. Gestión de scroll: si ya está en 'properties', desplaza al catálogo; si navega desde otra vista, inicia en el top para permitir la animación suave al catálogo
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

    // 5. Actualizar la URL limpia sin '#' usando HTML5 History API
    const targetPath = PAGES_CONFIG[page]?.path || '/';
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath !== targetPath || window.location.hash) {
        window.history.pushState({ page }, '', targetPath);
      }
    }
  };

  const handleHeroFilterSearch = (location: string, type: string, maxPrice: number) => {
    setFilterLocation(location);
    setFilterType(type);
    setFilterMaxPrice(maxPrice);
    handleNavigate('properties');
  };

  const handleOpenVisitModal = (defaultInterest?: string) => {
    if (defaultInterest) {
      setVisitInterest(defaultInterest);
    }
    setIsVisitModalOpen(true);
  };

  const handleSelectLot = (lot: LotProperty) => {
    setSelectedLot(lot);
    setCurrentPage('property-detail');
    if (typeof document !== 'undefined') {
      document.title = `${lot.code} - ${lot.name} | MGM Inmobiliaria`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof window !== 'undefined') {
      window.history.pushState({ page: 'property-detail', code: lot.code }, '', `/lote/${encodeURIComponent(lot.code.toLowerCase())}`);
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

      {/* Dynamic Ambient Interactive Background (Kindev Awwwards signature) */}
      <InteractiveBackground />

      {/* 1. Header (Solo en vistas públicas) */}
      {currentPage !== 'admin' && currentPage !== 'new_property' && (
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenVisitModal={handleOpenVisitModal}
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
            {currentPage === 'home' && (
              <HomeView
                onNavigate={handleNavigate}
                onOpenVisitModal={handleOpenVisitModal}
                onSelectLot={handleSelectLot}
                onFilterSearch={handleHeroFilterSearch}
              />
            )}

            {currentPage === 'about' && (
              <AboutView
                onNavigate={handleNavigate}
                onOpenVisitModal={handleOpenVisitModal}
              />
            )}

            {currentPage === 'properties' && (
              <PropertiesView
                onSelectLot={handleSelectLot}
                onOpenVisitModal={handleOpenVisitModal}
                initialLocation={filterLocation}
                initialType={filterType}
                initialMaxPrice={filterMaxPrice}
              />
            )}

            {currentPage === 'contact' && (
              <ContactView
                onOpenVisitModal={handleOpenVisitModal}
                onOpenLegalModal={handleOpenLegalModal}
              />
            )}

            {currentPage === 'admin' && (
              <AdminView onNavigate={handleNavigate} />
            )}

            {currentPage === 'new_property' && (
              <NewPropertyView onNavigate={handleNavigate} />
            )}

            {currentPage === 'privacy' && (
              <PrivacyView onNavigate={handleNavigate} />
            )}

            {currentPage === 'property-detail' && (
              <PropertyDetailView
                lot={selectedLot || properties[0] || LOTS_DATA[0]}
                allLots={properties.length > 0 ? properties : LOTS_DATA}
                onNavigate={handleNavigate}
                onSelectLot={handleSelectLot}
                onOpenVisitModal={handleOpenVisitModal}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Corporate Footer with Kindev Official Backlink (Solo en vistas públicas) */}
      {currentPage !== 'admin' && currentPage !== 'new_property' && (
        <Footer
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenVisitModal={() => handleOpenVisitModal()}
          onOpenLegalModal={handleOpenLegalModal}
        />
      )}

      {/* 4. Mobile Ergonomic Bottom Navigation Bar (< 768px - Solo en vistas públicas) */}
      {currentPage !== 'admin' && currentPage !== 'new_property' && (
        <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />
      )}

      {/* 5. Persistent Smart WhatsApp FAB (Solo en vistas públicas) */}
      {currentPage !== 'admin' && currentPage !== 'new_property' && (
        <WhatsAppFAB />
      )}

      {/* 6. Interactive Modals */}
      <VisitModal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        defaultInterest={visitInterest}
      />

      {/* 7. Blindaje Legal (Privacidad, Términos, Cookies) */}
      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalModalTab}
      />
    </div>
  );
}
