'use client';

import React, { useState, useEffect } from 'react';
import { AdminLogin } from '../admin/AdminLogin';
import { AdminDashboard } from '../admin/AdminDashboard';
import type { LotProperty } from '@/src/data/lots';

interface AdminViewProps {
  onNavigateToCatalog?: () => void;
  onNavigate?: (page: 'home' | 'about' | 'properties' | 'miravalle' | 'contact' | 'admin') => void;
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

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('mgm_admin_authenticated');
    sessionStorage.removeItem('mgm_admin_authenticated');
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
      <div className="pt-24 min-h-screen">
        <AdminLogin onSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen">
      <AdminDashboard
        onLogout={handleLogout}
        onViewCatalog={goToCatalog}
        onSelectLotPreview={onSelectLotPreview}
      />
    </div>
  );
}
