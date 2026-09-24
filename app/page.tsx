'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header, type PageView } from '@/src/components/Header';
import { BottomNav } from '@/src/components/BottomNav';
import { Footer } from '@/src/components/Footer';
import { WhatsAppFAB } from '@/src/components/WhatsAppFAB';
import { VisitModal } from '@/src/components/VisitModal';
import { LotDetailsModal } from '@/src/components/LotDetailsModal';
import { InteractiveBackground } from '@/src/components/InteractiveBackground';
import { HomeView } from '@/src/components/views/HomeView';
import { AboutView } from '@/src/components/views/AboutView';
import { PropertiesView } from '@/src/components/views/PropertiesView';
import { MiravalleView } from '@/src/components/views/MiravalleView';
import { ContactView } from '@/src/components/views/ContactView';
import { AdminView } from '@/src/components/views/AdminView';
import { PropertyProvider } from '@/src/context/PropertyContext';
import { ScrollToTop } from '@/src/components/ScrollToTop';
import type { LotProperty } from '@/src/data/lots';

export default function HomePage() {
  return (
    <PropertyProvider>
      <HomePageContent />
    </PropertyProvider>
  );
}

function HomePageContent() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedLot, setSelectedLot] = useState<LotProperty | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [visitInterest, setVisitInterest] = useState('Ciudadela Miravalle');

  // Filter state passed from Home search bar
  const [filterLocation, setFilterLocation] = useState('Todas');
  const [filterType, setFilterType] = useState('Todos');
  const [filterMaxPrice, setFilterMaxPrice] = useState(100000);

  // Handle URL hash navigation
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') as PageView;
      const validPages: PageView[] = ['home', 'about', 'properties', 'miravalle', 'contact', 'admin'];
      if (validPages.includes(hash)) {
        setCurrentPage(hash);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col relative text-slate-800 antialiased font-sans selection:bg-emerald-600 selection:text-white">
      {/* ScrollToTop Ergonomic Behavior */}
      <ScrollToTop triggerKey={currentPage} />

      {/* Dynamic Ambient Interactive Background (Kindev Awwwards signature) */}
      <InteractiveBackground />

      {/* 1. Header (Desktop Sticky with backdrop-blur-md) */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenVisitModal={handleOpenVisitModal}
      />

      {/* 2. Main Content Container with Strict Anti-Overflow & Luminous Light Base */}
      <main className="flex-1 w-full overflow-x-hidden pb-24 md:pb-12 pt-0 bg-white">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full bg-white"
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

            {currentPage === 'miravalle' && (
              <MiravalleView
                onNavigate={handleNavigate}
                onOpenVisitModal={handleOpenVisitModal}
              />
            )}

            {currentPage === 'contact' && (
              <ContactView onOpenVisitModal={handleOpenVisitModal} />
            )}

            {currentPage === 'admin' && (
              <AdminView onNavigate={handleNavigate} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Corporate Footer with Kindev Official Backlink */}
      <Footer
        onNavigate={handleNavigate}
        onOpenVisitModal={() => handleOpenVisitModal()}
      />

      {/* 4. Mobile Ergonomic Bottom Navigation Bar (< 768px) */}
      <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />

      {/* 5. Persistent Smart WhatsApp FAB with Live Pulse & Tooltip */}
      <WhatsAppFAB />

      {/* 6. Interactive Modals */}
      <VisitModal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        defaultInterest={visitInterest}
      />

      <LotDetailsModal
        lot={selectedLot}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onOpenVisitModal={(code) => {
          setIsDetailsModalOpen(false);
          handleOpenVisitModal(code);
        }}
      />
    </div>
  );
}
