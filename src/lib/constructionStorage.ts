import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { CONSTRUCTIONS_DATA, type ConstructionProject } from '@/src/data/constructions';

const LOCAL_STORAGE_KEY = 'mgm_constructions_data_v1';
const SUPABASE_CONFIG_PATH = 'banners/constructions_config.json';
const BROADCAST_CHANNEL_NAME = 'mgm_constructions_broadcast';
const CUSTOM_EVENT_NAME = 'mgm_constructions_updated';

export function getLocalConstructions(): ConstructionProject[] {
  if (typeof window === 'undefined') return CONSTRUCTIONS_DATA;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length >= 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage read errors
  }
  return CONSTRUCTIONS_DATA;
}

let memoryCachedConstructions: ConstructionProject[] | null = null;
let inFlightConstructionsPromise: Promise<ConstructionProject[]> | null = null;

function notifyConstructionsUpdated(items: ConstructionProject[]) {
  memoryCachedConstructions = items;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore quota errors
  }
  try {
    window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_NAME, { detail: items }));
  } catch {
    // Ignore
  }
  try {
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      bc.postMessage({ type: 'CONSTRUCTIONS_UPDATED', payload: items });
      bc.close();
    }
  } catch {
    // Ignore
  }
}

export async function fetchConstructions(forceRefresh = false): Promise<ConstructionProject[]> {
  if (!forceRefresh && memoryCachedConstructions) {
    return memoryCachedConstructions;
  }
  if (!forceRefresh && inFlightConstructionsPromise) {
    return inFlightConstructionsPromise;
  }

  inFlightConstructionsPromise = (async () => {
    try {
      const { data: pubData } = supabase.storage
        .from('properties')
        .getPublicUrl(SUPABASE_CONFIG_PATH);

      if (pubData?.publicUrl) {
        const res = await fetch(`${pubData.publicUrl}?t=${Date.now()}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const remoteJson = await res.json();
          if (Array.isArray(remoteJson)) {
            memoryCachedConstructions = remoteJson;
            if (typeof window !== 'undefined') {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(remoteJson));
            }
            return remoteJson;
          }
        }
      }
    } catch {
      // Fallback a localStorage
    }

    const local = getLocalConstructions();
    memoryCachedConstructions = local;
    return local;
  })();

  const result = await inFlightConstructionsPromise;
  inFlightConstructionsPromise = null;
  return result;
}

export async function saveConstructionsRemote(items: ConstructionProject[]): Promise<{ success: boolean; error?: string }> {
  notifyConstructionsUpdated(items);

  try {
    const jsonBlob = new Blob([JSON.stringify(items, null, 2)], {
      type: 'application/json',
    });

    const { error: uploadError } = await supabase.storage
      .from('properties')
      .upload(SUPABASE_CONFIG_PATH, jsonBlob, {
        upsert: true,
        contentType: 'application/json',
      });

    if (uploadError) {
      return { success: true, error: uploadError.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error de sincronización con almacenamiento remoto';
    return { success: true, error: msg };
  }
}

export function useConstructions() {
  const [constructions, setConstructions] = useState<ConstructionProject[]>(() => {
    return memoryCachedConstructions || getLocalConstructions();
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetchConstructions().then((data) => {
      if (isMounted) {
        setConstructions(data);
      }
    });

    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<ConstructionProject[]>;
      if (customEvent.detail) {
        setConstructions(customEvent.detail);
      }
    };

    window.addEventListener(CUSTOM_EVENT_NAME, handleLocalUpdate);

    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      bc.onmessage = (msgEvent) => {
        if (msgEvent.data?.type === 'CONSTRUCTIONS_UPDATED' && Array.isArray(msgEvent.data.payload)) {
          setConstructions(msgEvent.data.payload);
        }
      };
    }

    return () => {
      isMounted = false;
      window.removeEventListener(CUSTOM_EVENT_NAME, handleLocalUpdate);
      if (bc) bc.close();
    };
  }, []);

  const addConstruction = useCallback(async (newProj: ConstructionProject) => {
    setIsLoading(true);
    const updated = [newProj, ...constructions];
    setConstructions(updated);
    const res = await saveConstructionsRemote(updated);
    setIsLoading(false);
    return res;
  }, [constructions]);

  const updateConstruction = useCallback(async (updatedProj: ConstructionProject) => {
    setIsLoading(true);
    const updated = constructions.map((c) => (c.id === updatedProj.id ? updatedProj : c));
    setConstructions(updated);
    const res = await saveConstructionsRemote(updated);
    setIsLoading(false);
    return res;
  }, [constructions]);

  const deleteConstruction = useCallback(async (id: string) => {
    setIsLoading(true);
    const updated = constructions.filter((c) => c.id !== id);
    setConstructions(updated);
    const res = await saveConstructionsRemote(updated);
    setIsLoading(false);
    return res;
  }, [constructions]);

  const resetToDefault = useCallback(async () => {
    setIsLoading(true);
    setConstructions(CONSTRUCTIONS_DATA);
    const res = await saveConstructionsRemote(CONSTRUCTIONS_DATA);
    setIsLoading(false);
    return res;
  }, []);

  return {
    constructions,
    addConstruction,
    updateConstruction,
    deleteConstruction,
    resetToDefault,
    isLoading,
  };
}
