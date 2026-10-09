'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { LOTS_DATA, type LotProperty } from '@/src/data/lots';
import { supabase, mapRowToProperty, mapPropertyToRow, type DbPropertyRow } from '@/src/lib/supabase';
import { deletePropertyStorageFiles } from '@/src/lib/imageOptimizer';

const STORAGE_KEY = 'mgm_inmobiliaria_inventory_v7';

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
  addProperty: (newLot: Omit<LotProperty, 'id'>) => Promise<LotProperty>;
  updateProperty: (id: string, updates: Partial<LotProperty>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  toggleStatus: (id: string) => Promise<void>;
  setStatus: (id: string, status: 'Disponible' | 'En Reserva' | 'Vendido') => Promise<void>;
  resetToDefaults: () => Promise<void>;
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
      } catch {
        // Fallback
      }
    }
    return LOTS_DATA;
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Fetch live data from Supabase on mount and listen to realtime changes
  useEffect(() => {
    let isMounted = true;

    async function fetchProperties() {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .order('code', { ascending: true });

        if (!error && data && data.length > 0 && isMounted) {
          const mapped = (data as DbPropertyRow[]).map(mapRowToProperty);
          setProperties(mapped);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
          } catch (e) {
            console.error('LocalStorage sync error:', e);
          }
        }
      } catch (err) {
        console.warn('Supabase fetch fallback to local cache:', err);
      } finally {
        if (isMounted) setIsLoaded(true);
      }
    }

    fetchProperties();

    // Supabase Realtime Channel
    const channel = supabase
      .channel('public:properties')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'properties' },
        () => {
          fetchProperties();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // 2. Persist to LocalStorage whenever properties change
  const saveProperties = (updated: LotProperty[]) => {
    setProperties(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving properties to localStorage', e);
    }
  };

  // Add Property (Optimistic + Supabase DB)
  const addProperty = async (newLot: Omit<LotProperty, 'id'>): Promise<LotProperty> => {
    const id = `prop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const fullLot: LotProperty = {
      ...newLot,
      id,
    };
    const updated = [fullLot, ...properties];
    saveProperties(updated);

    try {
      const dbRow = mapPropertyToRow(fullLot);
      const { error } = await supabase.from('properties').insert(dbRow);
      if (error) console.error('Supabase insert error:', error);
    } catch (err) {
      console.error('Supabase addProperty network error:', err);
    }

    return fullLot;
  };

  // Update Property (Optimistic + Supabase DB)
  const updateProperty = async (id: string, updates: Partial<LotProperty>) => {
    const updated = properties.map((p) => {
      if (p.id === id) {
        return { ...p, ...updates };
      }
      return p;
    });
    saveProperties(updated);

    try {
      const dbRowUpdates = mapPropertyToRow(updates);
      const { error } = await supabase.from('properties').update(dbRowUpdates).eq('id', id);
      if (error) console.error('Supabase update error:', error);
    } catch (err) {
      console.error('Supabase updateProperty network error:', err);
    }
  };

  // Delete Property (Optimistic + Supabase DB + Storage Cleanup)
  const deleteProperty = async (id: string) => {
    const toDelete = properties.find((p) => p.id === id);
    const updated = properties.filter((p) => p.id !== id);
    saveProperties(updated);

    try {
      // 1. Eliminar archivos multimedia (fotos WebP y PDFs) de Supabase Storage
      if (toDelete) {
        await deletePropertyStorageFiles(toDelete);
      }
      // 2. Eliminar registro en base de datos PostgreSQL
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) console.error('Supabase delete error:', error);
    } catch (err) {
      console.error('Supabase deleteProperty network error:', err);
    }
  };

  // Set explicit status
  const setStatus = async (id: string, status: 'Disponible' | 'En Reserva' | 'Vendido') => {
    const updated = properties.map((p) => {
      if (p.id === id) {
        return { ...p, status };
      }
      return p;
    });
    saveProperties(updated);

    try {
      const { error } = await supabase.from('properties').update({ status }).eq('id', id);
      if (error) console.error('Supabase setStatus error:', error);
    } catch (err) {
      console.error('Supabase setStatus network error:', err);
    }
  };

  // One-Touch Status Toggle: cycles through Disponible -> En Reserva -> Vendido -> Disponible
  const toggleStatus = async (id: string) => {
    const statusCycle: Record<'Disponible' | 'En Reserva' | 'Vendido', 'Disponible' | 'En Reserva' | 'Vendido'> = {
      Disponible: 'En Reserva',
      'En Reserva': 'Vendido',
      Vendido: 'Disponible',
    };

    const current = properties.find((p) => p.id === id);
    if (!current) return;
    const nextStatus = statusCycle[current.status] || 'Disponible';
    await setStatus(id, nextStatus);
  };

  // Reset to original dataset
  const resetToDefaults = async () => {
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
