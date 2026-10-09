'use client';

import React, { useState, useEffect } from 'react';
import { AdminLogin } from '../admin/AdminLogin';
import { AdminDashboard } from '../admin/AdminDashboard';
import type { LotProperty } from '@/src/data/lots';
import { supabase } from '@/src/lib/supabase';

import type { PageView } from '@/src/data/navigation';

interface AdminViewProps {
  onNavigateToCatalog?: () => void;
  onNavigate?: (page: PageView) => void;
  onSelectLotPreview?: (lot: LotProperty) => void;
}

export function AdminView({
  onNavigateToCatalog,
  onNavigate,
  onSelectLotPreview,
}: AdminViewProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('mgm_admin_authenticated');
      const session = sessionStorage.getItem('mgm_admin_authenticated');
      return local === 'true' || session === 'true';
    }
    return false;
  });

  useEffect(() => {
    // Escuchar cambios de sesión reales de Supabase Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignorar errores de red
    }
    localStorage.removeItem('mgm_admin_authenticated');
    localStorage.removeItem('mgm_admin_user_email');
    sessionStorage.removeItem('mgm_admin_authenticated');
    sessionStorage.removeItem('mgm_admin_user_email');
    setIsAuthenticated(false);
  };

  const goToCatalog = () => {
    if (onNavigateToCatalog) {
      onNavigateToCatalog();
    } else if (onNavigate) {
      onNavigate('properties');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-24 min-h-screen bg-slate-50">
        <AdminLogin onSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12 min-h-screen bg-slate-100/80">
      <AdminDashboard
        onLogout={handleLogout}
        onViewCatalog={goToCatalog}
        onSelectLotPreview={onSelectLotPreview}
        onNavigate={onNavigate}
      />
    </div>
  );
}
