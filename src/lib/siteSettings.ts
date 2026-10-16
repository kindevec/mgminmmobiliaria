import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';

export interface SiteSettingsConfig {
  companyName: string;
  supportPhone: string;
  supportEmail: string;
  hqTitle: string;
  hqAddress: string;
  hqLat: number;
  hqLng: number;
  businessHours: string;
  businessHoursWeekend: string;
  updatedAt?: string;
}

const LOCAL_STORAGE_KEY = 'mgm_admin_settings';
const SUPABASE_SETTINGS_PATH = 'banners/site_settings_config.json';
const BROADCAST_CHANNEL_NAME = 'mgm_settings_broadcast';
const CUSTOM_EVENT_NAME = 'mgm_settings_updated';

export const DEFAULT_SITE_SETTINGS: SiteSettingsConfig = {
  companyName: 'Sociedad Civil MGM Inmobiliaria',
  supportPhone: '+593 99 284 9965',
  supportEmail: 'noemaliza01@gmail.com',
  hqTitle: 'MGM Inmobiliaria · Miravalle',
  hqAddress: 'Vía Principal Ciudadela Miravalle, Azuay, Ecuador',
  hqLat: -2.8685,
  hqLng: -78.9654,
  businessHours: 'Lunes a Viernes: 8:30 – 18:00',
  businessHoursWeekend: 'Sábados: 9:00 – 14:00 (Domingos previa cita)',
};

export function formatPhoneForWhatsApp(rawPhone: string): string {
  const digits = (rawPhone || '').replace(/\D/g, '');
  if (!digits) return '593992849965';
  if (digits.startsWith('0') && digits.length === 10) {
    return `593${digits.slice(1)}`;
  }
  if (digits.length === 9) {
    return `593${digits}`;
  }
  return digits;
}

export function formatPhoneForTel(rawPhone: string): string {
  return `+${formatPhoneForWhatsApp(rawPhone)}`;
}

export function normalizeSiteSettings(raw: unknown): SiteSettingsConfig {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_SITE_SETTINGS };
  }
  const obj = raw as Record<string, unknown>;
  const lat = Number(obj.hqLat);
  const lng = Number(obj.hqLng);

  return {
    companyName:
      typeof obj.companyName === 'string' && obj.companyName.trim()
        ? obj.companyName.trim()
        : DEFAULT_SITE_SETTINGS.companyName,
    supportPhone:
      typeof obj.supportPhone === 'string' && obj.supportPhone.trim()
        ? obj.supportPhone.trim()
        : DEFAULT_SITE_SETTINGS.supportPhone,
    supportEmail:
      typeof obj.supportEmail === 'string' && obj.supportEmail.trim()
        ? obj.supportEmail.trim()
        : DEFAULT_SITE_SETTINGS.supportEmail,
    hqTitle:
      typeof obj.hqTitle === 'string' && obj.hqTitle.trim()
        ? obj.hqTitle.trim()
        : DEFAULT_SITE_SETTINGS.hqTitle,
    hqAddress:
      typeof obj.hqAddress === 'string' && obj.hqAddress.trim()
        ? obj.hqAddress.trim()
        : DEFAULT_SITE_SETTINGS.hqAddress,
    hqLat: Number.isFinite(lat) && lat !== 0 ? lat : DEFAULT_SITE_SETTINGS.hqLat,
    hqLng: Number.isFinite(lng) && lng !== 0 ? lng : DEFAULT_SITE_SETTINGS.hqLng,
    businessHours:
      typeof obj.businessHours === 'string' && obj.businessHours.trim()
        ? obj.businessHours.trim()
        : DEFAULT_SITE_SETTINGS.businessHours,
    businessHoursWeekend:
      typeof obj.businessHoursWeekend === 'string' && obj.businessHoursWeekend.trim()
        ? obj.businessHoursWeekend.trim()
        : DEFAULT_SITE_SETTINGS.businessHoursWeekend,
    updatedAt: typeof obj.updatedAt === 'string' ? obj.updatedAt : undefined,
  };
}

export function getLocalSiteSettings(): SiteSettingsConfig {
  if (typeof window === 'undefined') return DEFAULT_SITE_SETTINGS;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return normalizeSiteSettings(JSON.parse(saved));
    }
  } catch {
    // Ignore storage read errors
  }
  return DEFAULT_SITE_SETTINGS;
}

function notifySettingsUpdated(config: SiteSettingsConfig) {
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
      bc.postMessage({ type: 'SETTINGS_UPDATED', payload: config });
      bc.close();
    }
  } catch {
    // Ignore
  }
}

let inFlightSettingsFetch: Promise<SiteSettingsConfig> | null = null;

export async function fetchSiteSettings(): Promise<SiteSettingsConfig> {
  if (inFlightSettingsFetch) return inFlightSettingsFetch;

  inFlightSettingsFetch = (async () => {
    try {
      const { data: pubData } = supabase.storage
        .from('properties')
        .getPublicUrl(SUPABASE_SETTINGS_PATH);

      if (pubData?.publicUrl) {
        const res = await fetch(`${pubData.publicUrl}?t=${Date.now()}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const json = await res.json();
          const normalized = normalizeSiteSettings(json);
          if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(normalized));
          }
          return normalized;
        }
      }
    } catch {
      // Fallback to localStorage / default
    } finally {
      inFlightSettingsFetch = null;
    }
    return getLocalSiteSettings();
  })();

  return inFlightSettingsFetch;
}

export async function saveSiteSettings(
  config: Partial<SiteSettingsConfig>
): Promise<SiteSettingsConfig> {
  const current = getLocalSiteSettings();
  const payload: SiteSettingsConfig = {
    ...normalizeSiteSettings({ ...current, ...config }),
    updatedAt: new Date().toISOString(),
  };

  // 1. Actualizar local y notificar a toda la web de inmediato
  notifySettingsUpdated(payload);

  // 2. Sincronizar en Supabase Storage (bucket 'properties')
  try {
    const jsonBlob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });

    await supabase.storage
      .from('properties')
      .upload(SUPABASE_SETTINGS_PATH, jsonBlob, {
        contentType: 'application/json',
        cacheControl: '0',
        upsert: true,
      });
  } catch {
    // Fallback local ya aplicado
  }

  return payload;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettingsConfig>(() => getLocalSiteSettings());
  const [loading, setLoading] = useState<boolean>(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const remote = await fetchSiteSettings();
      setSettings(remote);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    const handleCustomEvent = (e: Event) => {
      const custom = e as CustomEvent<SiteSettingsConfig>;
      if (custom.detail) {
        setSettings(normalizeSiteSettings(custom.detail));
      } else {
        setSettings(getLocalSiteSettings());
      }
    };

    window.addEventListener(CUSTOM_EVENT_NAME, handleCustomEvent);

    let bc: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        bc.onmessage = (event) => {
          if (event.data?.type === 'SETTINGS_UPDATED' && event.data?.payload) {
            setSettings(normalizeSiteSettings(event.data.payload));
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
    settings,
    loading,
    refresh,
    saveSettings: saveSiteSettings,
    whatsappDigits: formatPhoneForWhatsApp(settings.supportPhone),
    telHref: `tel:${formatPhoneForTel(settings.supportPhone)}`,
  };
}
