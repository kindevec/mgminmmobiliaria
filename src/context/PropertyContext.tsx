'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { LOTS_DATA, type LotProperty } from '@/src/data/lots';
import { supabase, mapRowToProperty, mapPropertyToRow, type DbPropertyRow } from '@/src/lib/supabase';
import { deletePropertyStorageFiles } from '@/src/lib/imageOptimizer';

const STORAGE_KEY = 'mgm_inmobiliaria_inventory_v8';

interface PropertyMetrics {
  totalCount: number;
  availableCount: number;
  reservedCount: number;
  soldCount: number;
  inactiveCount: number;
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
  setStatus: (id: string, status: LotProperty['status']) => Promise<void>;
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

  // Add Property (Supabase DB first + Local Sync)
  const addProperty = async (newLot: Omit<LotProperty, 'id'>): Promise<LotProperty> => {
    const id = `prop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const fullLot: LotProperty = {
      ...newLot,
      id,
    };

    const dbRow = mapPropertyToRow(fullLot);
    const { error } = await supabase.from('properties').insert(dbRow);
    if (error) {
      console.error('Error insertando propiedad en Supabase:', error);
      throw new Error(`Error en Supabase: ${error.message || 'No se pudo guardar la propiedad'}`);
    }

    const updated = [fullLot, ...properties];
    saveProperties(updated);
    return fullLot;
  };

  // Update Property (Supabase DB first + Local Sync)
  const updateProperty = async (id: string, updates: Partial<LotProperty>) => {
    const dbRowUpdates = mapPropertyToRow(updates);
    const { error } = await supabase.from('properties').update(dbRowUpdates).eq('id', id);
    if (error) {
      console.error('Error actualizando propiedad en Supabase:', error);
      throw new Error(`Error en Supabase: ${error.message || 'No se pudo actualizar la propiedad'}`);
    }

    const updated = properties.map((p) => {
      if (p.id === id) {
        return { ...p, ...updates };
      }
      return p;
    });
    saveProperties(updated);
  };

  // Delete Property (Supabase DB first + Storage Cleanup + Local Sync)
  const deleteProperty = async (id: string) => {
    const toDelete = properties.find((p) => p.id === id);
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) {
      console.error('Error eliminando propiedad en Supabase:', error);
      throw new Error(`Error en Supabase: ${error.message || 'No se pudo eliminar la propiedad'}`);
    }

    // Limpieza de archivos multimedia en Storage tras confirmación de eliminación en DB
    if (toDelete) {
      await deletePropertyStorageFiles(toDelete);
    }

    const updated = properties.filter((p) => p.id !== id);
    saveProperties(updated);
  };

  // Set explicit status (Supabase DB first + Local Sync)
  const setStatus = async (id: string, status: LotProperty['status']) => {
    const { error } = await supabase.from('properties').update({ status }).eq('id', id);
    if (error) {
      console.error('Error actualizando estado en Supabase:', error);
      throw new Error(`Error en Supabase: ${error.message || 'No se pudo actualizar el estado'}`);
    }

    const updated = properties.map((p) => {
      if (p.id === id) {
        return { ...p, status };
      }
      return p;
    });
    saveProperties(updated);
  };

  // One-Touch Status Toggle: cycles through Disponible -> En Reserva -> Vendido -> Inactiva -> Disponible
  const toggleStatus = async (id: string) => {
    const statusCycle: Record<LotProperty['status'], LotProperty['status']> = {
      Disponible: 'En Reserva',
      'En Reserva': 'Vendido',
      Vendido: 'Inactiva',
      Inactiva: 'Disponible',
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
    let inactiveCount = 0;
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
      } else if (p.status === 'Inactiva') {
        inactiveCount++;
      }
    }

    return {
      totalCount: properties.length,
      availableCount,
      reservedCount,
      soldCount,
      inactiveCount,
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
