'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { LOTS_DATA, type LotProperty } from '@/src/data/lots';

const STORAGE_KEY = 'mgm_inmobiliaria_inventory_v2';

interface PropertyMetrics {
  totalCount: number;
  availableCount: number;
  reservedCount: number;
  soldCount: number;
  totalActiveValueUSD: number;
  totalInventoryValueUSD: number;
}

interface PropertyContextType {
  properties: LotProperty[];
  metrics: PropertyMetrics;
  isLoaded: boolean;
  addProperty: (newLot: Omit<LotProperty, 'id'>) => LotProperty;
  updateProperty: (id: string, updates: Partial<LotProperty>) => void;
  deleteProperty: (id: string) => void;
  toggleStatus: (id: string) => void;
  setStatus: (id: string, status: 'Disponible' | 'En Reserva' | 'Vendido') => void;
  resetToDefaults: () => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<LotProperty[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(LOTS_DATA));
      } catch {
        // Fallback
      }
    }
    return LOTS_DATA;
  });
  const [isLoaded] = useState(true);

  // 2. Persist to LocalStorage whenever properties change
  const saveProperties = (updated: LotProperty[]) => {
    setProperties(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving properties to localStorage', e);
    }
  };

  // Add Property
  const addProperty = (newLot: Omit<LotProperty, 'id'>): LotProperty => {
    const id = `prop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const fullLot: LotProperty = {
      ...newLot,
      id,
    };
    const updated = [fullLot, ...properties];
    saveProperties(updated);
    return fullLot;
  };

  // Update Property
  const updateProperty = (id: string, updates: Partial<LotProperty>) => {
    const updated = properties.map((p) => {
      if (p.id === id) {
        return { ...p, ...updates };
      }
      return p;
    });
    saveProperties(updated);
  };

  // Delete Property
  const deleteProperty = (id: string) => {
    const updated = properties.filter((p) => p.id !== id);
    saveProperties(updated);
  };

  // One-Touch Status Toggle: cycles through Disponible -> En Reserva -> Vendido -> Disponible
  const toggleStatus = (id: string) => {
    const statusCycle: Record<'Disponible' | 'En Reserva' | 'Vendido', 'Disponible' | 'En Reserva' | 'Vendido'> = {
      Disponible: 'En Reserva',
      'En Reserva': 'Vendido',
      Vendido: 'Disponible',
    };

    const updated = properties.map((p) => {
      if (p.id === id) {
        const nextStatus = statusCycle[p.status] || 'Disponible';
        return { ...p, status: nextStatus };
      }
      return p;
    });
    saveProperties(updated);
  };

  // Set explicit status
  const setStatus = (id: string, status: 'Disponible' | 'En Reserva' | 'Vendido') => {
    const updated = properties.map((p) => {
      if (p.id === id) {
        return { ...p, status };
      }
      return p;
    });
    saveProperties(updated);
  };

  // Reset to original dataset
  const resetToDefaults = () => {
    saveProperties(LOTS_DATA);
  };

  // Compute live real-time metrics
  const metrics: PropertyMetrics = useMemo(() => {
    let availableCount = 0;
    let reservedCount = 0;
    let soldCount = 0;
    let totalActiveValueUSD = 0;
    let totalInventoryValueUSD = 0;

    for (const p of properties) {
      totalInventoryValueUSD += p.priceUSD || 0;
      if (p.status === 'Disponible') {
        availableCount++;
        totalActiveValueUSD += p.priceUSD || 0;
      } else if (p.status === 'En Reserva') {
        reservedCount++;
        totalActiveValueUSD += p.priceUSD || 0;
      } else if (p.status === 'Vendido') {
        soldCount++;
      }
    }

    return {
      totalCount: properties.length,
      availableCount,
      reservedCount,
      soldCount,
      totalActiveValueUSD,
      totalInventoryValueUSD,
    };
  }, [properties]);

  return (
    <PropertyContext.Provider
      value={{
        properties,
        metrics,
        isLoaded,
        addProperty,
        updateProperty,
        deleteProperty,
        toggleStatus,
        setStatus,
        resetToDefaults,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
}
