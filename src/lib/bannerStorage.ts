import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { uploadOptimizedImage } from './imageOptimizer';

export type BannerPageId = 'inicio' | 'lotes' | 'nosotros' | 'contacto';

export interface BannerSlideConfig {
  id: string;
  image: string;
  alt: string;
  titleLine1: string;
  titleHighlight1: string;
  titleHighlight2: string;
  description: string;
  bgPositionX: number;
  bgPositionY: number;
  bgZoom: number;
}

export interface SiteBannersConfig {
  inicio: [BannerSlideConfig, BannerSlideConfig, BannerSlideConfig];
  lotes: BannerSlideConfig;
  nosotros: BannerSlideConfig;
  contacto: BannerSlideConfig;
  updatedAt?: string;
}

const LOCAL_STORAGE_KEY = 'mgm_site_banners_v1';
const SUPABASE_CONFIG_PATH = 'banners/site_banners_config.json';
const BROADCAST_CHANNEL_NAME = 'mgm_banners_broadcast';
const CUSTOM_EVENT_NAME = 'mgm_banners_updated';

export const DEFAULT_SITE_BANNERS: SiteBannersConfig = {
  inicio: [
    {
      id: 'inicio-1',
      image: '/inicio-banner.webp',
      alt: 'Residencia Arquitectónica Contemporánea de Lujo - MGM Inmobiliaria',
      titleLine1: 'Tierra Firme, Certeza Jurídica',
      titleHighlight1: 'y el Hogar',
      titleHighlight2: 'de tu Familia',
      description:
        'Desarrollamos comunidades residenciales y comerciales con obras civiles concluidas, servicios básicos garantizados in situ y crédito directo hasta 48 meses sin bancos ni buró de crédito.',
      bgPositionX: 50,
      bgPositionY: 50,
      bgZoom: 100,
    },
    {
      id: 'inicio-2',
      image:
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1280&q=75&fm=webp',
      alt: 'Residencia Moderna con Piscina y Áreas Verdes - MGM Inmobiliaria',
      titleLine1: 'Tierra Firme, Certeza Jurídica',
      titleHighlight1: 'y el Hogar',
      titleHighlight2: 'de tu Familia',
      description:
        'Desarrollamos comunidades residenciales y comerciales con obras civiles concluidas, servicios básicos garantizados in situ y crédito directo hasta 48 meses sin bancos ni buró de crédito.',
      bgPositionX: 50,
      bgPositionY: 50,
      bgZoom: 100,
    },
    {
      id: 'inicio-3',
      image:
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1280&q=75&fm=webp',
      alt: 'Arquitectura Residencial Contemporánea de Vanguardia con Fachada Iluminada',
      titleLine1: 'Tierra Firme, Certeza Jurídica',
      titleHighlight1: 'y el Hogar',
      titleHighlight2: 'de tu Familia',
      description:
        'Desarrollamos comunidades residenciales y comerciales con obras civiles concluidas, servicios básicos garantizados in situ y crédito directo hasta 48 meses sin bancos ni buró de crédito.',
      bgPositionX: 50,
      bgPositionY: 50,
      bgZoom: 100,
    },
  ],
  lotes: {
    id: 'lotes-1',
    image: '/lotes-banner.jpg',
    alt: 'Lotes Urbanizados y Terrenos con Certeza Notarial - Sociedad Civil MGM Inmobiliaria',
    titleLine1: 'Lotes urbanizados y proyectos',
    titleHighlight1: 'con escrituras inmediatas',
    titleHighlight2: '& crédito directo.',
    description:
      'Propiedades legalizadas con vías concluidas, alcantarillado, acometidas soterradas y crédito directo de hasta 48 meses. Elige tu terreno con planos topográficos y asesoría técnica directa.',
    bgPositionX: 50,
    bgPositionY: 50,
    bgZoom: 100,
  },
  nosotros: {
    id: 'nosotros-1',
    image: '/nosotros-banner.jpg',
    alt: 'Solidez Institucional, Transparencia y Certeza Notarial - Sociedad Civil MGM Inmobiliaria',
    titleLine1: 'Solidez, transparencia',
    titleHighlight1: 'y certeza jurídica.',
    titleHighlight2: '',
    description:
      'Somos una entidad inmobiliaria ecuatoriana constituida para transformar terrenos de alta vocación residencial en comunidades planificadas con obras concluidas, saneamiento legal definitivo y crédito directo.',
    bgPositionX: 50,
    bgPositionY: 50,
    bgZoom: 100,
  },
  contacto: {
    id: 'contacto-1',
    image: '/contacto-banner.jpg',
    alt: 'Centro de Atención y Asesoría Notarial - Sociedad Civil MGM Inmobiliaria',
    titleLine1: 'Ponte en',
    titleHighlight1: 'Contacto',
    titleHighlight2: 'con MGM',
    description:
      'Estamos listos para atenderte. Comunícate con nuestro equipo técnico, legal y comercial para cotizaciones de lotes, planes de financiamiento y asesoría notarial personalizada.',
    bgPositionX: 50,
    bgPositionY: 50,
    bgZoom: 100,
  },
};

function normalizeSlide(
  raw: Partial<BannerSlideConfig> | undefined,
  fallback: BannerSlideConfig
): BannerSlideConfig {
  if (!raw) return { ...fallback };
  const posX = Number(raw.bgPositionX);
  const posY = Number(raw.bgPositionY);
  const zoom = Number(raw.bgZoom);

  return {
    id: raw.id || fallback.id,
    image: raw.image && raw.image.trim() ? raw.image.trim() : fallback.image,
    alt: raw.alt && raw.alt.trim() ? raw.alt.trim() : fallback.alt,
    titleLine1: raw.titleLine1 !== undefined ? raw.titleLine1 : fallback.titleLine1,
    titleHighlight1:
      raw.titleHighlight1 !== undefined ? raw.titleHighlight1 : fallback.titleHighlight1,
    titleHighlight2:
      raw.titleHighlight2 !== undefined ? raw.titleHighlight2 : fallback.titleHighlight2,
    description: raw.description !== undefined ? raw.description : fallback.description,
    bgPositionX: Number.isFinite(posX) ? Math.max(0, Math.min(100, posX)) : fallback.bgPositionX,
    bgPositionY: Number.isFinite(posY) ? Math.max(0, Math.min(100, posY)) : fallback.bgPositionY,
    bgZoom: Number.isFinite(zoom) ? Math.max(100, Math.min(250, zoom)) : fallback.bgZoom,
  };
}

export function normalizeBannersConfig(raw: unknown): SiteBannersConfig {
  if (!raw || typeof raw !== 'object') {
    return structuredClone(DEFAULT_SITE_BANNERS);
  }
  const obj = raw as Record<string, any>;
  const rawInicio = Array.isArray(obj.inicio) ? obj.inicio : [];

  return {
    inicio: [
      normalizeSlide(rawInicio[0], DEFAULT_SITE_BANNERS.inicio[0]),
      normalizeSlide(rawInicio[1], DEFAULT_SITE_BANNERS.inicio[1]),
      normalizeSlide(rawInicio[2], DEFAULT_SITE_BANNERS.inicio[2]),
    ],
    lotes: normalizeSlide(obj.lotes, DEFAULT_SITE_BANNERS.lotes),
    nosotros: normalizeSlide(obj.nosotros, DEFAULT_SITE_BANNERS.nosotros),
    contacto: normalizeSlide(obj.contacto, DEFAULT_SITE_BANNERS.contacto),
    updatedAt: typeof obj.updatedAt === 'string' ? obj.updatedAt : undefined,
  };
}

export function getLocalBannersConfig(): SiteBannersConfig {
  if (typeof window === 'undefined') return DEFAULT_SITE_BANNERS;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return normalizeBannersConfig(JSON.parse(saved));
    }
  } catch {
    // Ignore storage read errors
  }
  return DEFAULT_SITE_BANNERS;
}

let memoryCachedBanners: SiteBannersConfig | null = null;
let inFlightBannersPromise: Promise<SiteBannersConfig> | null = null;

function notifyBannersUpdated(config: SiteBannersConfig) {
  memoryCachedBanners = config;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Ignore quota errors
  }
  try {
    window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_NAME, { detail: config }));
  } catch {
    // Ignore
  }
  try {
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      bc.postMessage({ type: 'BANNERS_UPDATED', payload: config });
      bc.close();
    }
  } catch {
    // Ignore
  }
}

export async function fetchSiteBanners(forceRefresh = false): Promise<SiteBannersConfig> {
  if (!forceRefresh && memoryCachedBanners) {
    return memoryCachedBanners;
  }
  if (!forceRefresh && inFlightBannersPromise) {
    return inFlightBannersPromise;
  }

  inFlightBannersPromise = (async () => {
    try {
      const { data: pubData } = supabase.storage
        .from('properties')
        .getPublicUrl(SUPABASE_CONFIG_PATH);

      if (pubData?.publicUrl) {
        const res = await fetch(`${pubData.publicUrl}?t=${Date.now()}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const json = await res.json();
          const normalized = normalizeBannersConfig(json);
          memoryCachedBanners = normalized;
          if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(normalized));
          }
          return normalized;
        }
      }
    } catch {
      // Fallback to localStorage / default
    } finally {
      inFlightBannersPromise = null;
    }
    const local = getLocalBannersConfig();
    memoryCachedBanners = local;
    return local;
  })();

  return inFlightBannersPromise;
}

export async function saveSiteBanners(config: SiteBannersConfig): Promise<SiteBannersConfig> {
  const payload: SiteBannersConfig = {
    ...normalizeBannersConfig(config),
    updatedAt: new Date().toISOString(),
  };

  // 1. Actualizar local y notificar vistas de inmediato
  notifyBannersUpdated(payload);

  // 2. Sincronizar en Supabase Storage (bucket 'properties')
  const jsonBlob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });

  const { error } = await supabase.storage
    .from('properties')
    .upload(SUPABASE_CONFIG_PATH, jsonBlob, {
      contentType: 'application/json',
      cacheControl: '0',
      upsert: true,
    });

  if (error) {
    console.warn('Advertencia al sincronizar banners en Supabase Storage:', error.message);
  }

  return payload;
}

export async function uploadBannerImage(file: File, pageId: BannerPageId): Promise<string> {
  return uploadOptimizedImage(file, `BANNER_${pageId.toUpperCase()}`, {
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 0.82,
  });
}

export function useSiteBanners() {
  const [banners, setBanners] = useState<SiteBannersConfig>(() => getLocalBannersConfig());
  const [loading, setLoading] = useState<boolean>(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const remote = await fetchSiteBanners();
      setBanners(remote);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    const handleCustomEvent = (e: Event) => {
      const custom = e as CustomEvent<SiteBannersConfig>;
      if (custom.detail) {
        setBanners(normalizeBannersConfig(custom.detail));
      } else {
        setBanners(getLocalBannersConfig());
      }
    };

    window.addEventListener(CUSTOM_EVENT_NAME, handleCustomEvent);

    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        bc.onmessage = (event) => {
          if (event.data?.type === 'BANNERS_UPDATED' && event.data?.payload) {
            setBanners(normalizeBannersConfig(event.data.payload));
          }
        };
      } catch {
        // Ignore
      }
    }

    return () => {
      window.removeEventListener(CUSTOM_EVENT_NAME, handleCustomEvent);
      if (bc) bc.close();
    };
  }, [refresh]);

  return {
    banners,
    loading,
    refresh,
    saveBanners: saveSiteBanners,
  };
}
