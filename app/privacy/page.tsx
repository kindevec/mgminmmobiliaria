'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { PrivacyView } from '@/src/components/views/PrivacyView';
import { PropertyProvider } from '@/src/context/PropertyContext';
import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import type { PageView } from '@/src/data/navigation';

export default function PrivacyPage() {
  const router = useRouter();

  const handleNavigate = (page: PageView) => {
    if (page === 'privacy') return;
    if (page === 'home') {
      router.push('/');
    } else {
      router.push(`/#${page}`);
    }
  };

  return (
    <PropertyProvider>
      <div className="relative min-h-screen bg-slate-50 flex flex-col font-sans">
        <Header currentPage="privacy" onNavigate={handleNavigate} />
        <main className="flex-1 w-full">
          <PrivacyView onNavigate={handleNavigate} />
        </main>
        <Footer 
          currentPage="privacy" 
          onNavigate={handleNavigate} 
          onOpenVisitModal={() => handleNavigate('contact')} 
        />
      </div>
    </PropertyProvider>
  );
}
