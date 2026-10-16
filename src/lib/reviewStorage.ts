import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { TESTIMONIALS_DATA } from '@/src/data/lots';

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  location: string;
  text: string;
  stars: number;
  createdAt: string;
  approved?: boolean;
}

const LOCAL_STORAGE_KEY = 'mgm_reviews_list_v1';
const SUPABASE_REVIEWS_PATH = 'reviews/customer_reviews.json';
const BROADCAST_CHANNEL_NAME = 'mgm_reviews_broadcast';
const CUSTOM_EVENT_NAME = 'mgm_reviews_updated';

// Semilla inicial basada en los testimonios predeterminados
export const INITIAL_REVIEWS: ReviewItem[] = TESTIMONIALS_DATA.map((t, idx) => ({
  id: `review-default-${idx + 1}`,
  name: t.name,
  role: t.role,
  location: t.location,
  text: t.text,
  stars: t.stars,
  createdAt: new Date(Date.now() - (idx + 1) * 86400000 * 5).toISOString(),
  approved: true,
}));

export function getLocalReviews(): ReviewItem[] {
  if (typeof window === 'undefined') return INITIAL_REVIEWS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return INITIAL_REVIEWS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // Ignore error
  }
  return INITIAL_REVIEWS;
}

function notifyReviewsUpdated(reviews: ReviewItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reviews));
  } catch {
    // Ignore error
  }
  try {
    window.dispatchEvent(new CustomEvent(CUSTOM_EVENT_NAME, { detail: reviews }));
  } catch {
    // Ignore error
  }
  try {
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      bc.postMessage({ type: 'REVIEWS_UPDATED', payload: reviews });
      bc.close();
    }
  } catch {
    // Ignore error
  }
}

let inFlightReviewsPromise: Promise<ReviewItem[]> | null = null;
let memoryCachedReviews: ReviewItem[] | null = null;

export async function fetchStoredReviews(forceRefresh = false): Promise<ReviewItem[]> {
  if (!forceRefresh && memoryCachedReviews) {
    return memoryCachedReviews;
  }
  if (!forceRefresh && inFlightReviewsPromise) {
    return inFlightReviewsPromise;
  }

  inFlightReviewsPromise = (async () => {
    try {
      const { data: pubData } = supabase.storage
        .from('properties')
        .getPublicUrl(SUPABASE_REVIEWS_PATH);

      if (pubData?.publicUrl) {
        const res = await fetch(`${pubData.publicUrl}?t=${Date.now()}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json) && json.length > 0) {
            memoryCachedReviews = json;
            if (typeof window !== 'undefined') {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json));
            }
            return json;
          }
        }
      }
    } catch {
      // Fallback a localStorage / inicial
    } finally {
      inFlightReviewsPromise = null;
    }

    const local = getLocalReviews();
    memoryCachedReviews = local;
    return local;
  })();

  return inFlightReviewsPromise;
}

export async function saveReviewsList(reviews: ReviewItem[]): Promise<ReviewItem[]> {
  memoryCachedReviews = reviews;
  notifyReviewsUpdated(reviews);

  try {
    const jsonBlob = new Blob([JSON.stringify(reviews, null, 2)], {
      type: 'application/json',
    });

    const { error } = await supabase.storage
      .from('properties')
      .upload(SUPABASE_REVIEWS_PATH, jsonBlob, {
        contentType: 'application/json',
        cacheControl: '0',
        upsert: true,
      });

    if (error) {
      console.warn('Advertencia al sincronizar reseñas en Supabase Storage:', error.message);
    }
  } catch (err) {
    console.warn('Error al subir reseñas a almacenamiento en la nube:', err);
  }

  return reviews;
}

export async function addStoredReview(
  newReviewData: Omit<ReviewItem, 'id' | 'createdAt'>
): Promise<ReviewItem[]> {
  const currentReviews = await fetchStoredReviews();
  const created: ReviewItem = {
    ...newReviewData,
    id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    approved: true,
  };

  const updatedReviews = [created, ...currentReviews];
  return saveReviewsList(updatedReviews);
}

export function useStoredReviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>(() => getLocalReviews());
  const [loading, setLoading] = useState<boolean>(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchStoredReviews(true);
      setReviews(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    const handleCustomEvent = (e: Event) => {
      const custom = e as CustomEvent<ReviewItem[]>;
      if (custom.detail) {
        setReviews(custom.detail);
      }
    };
    window.addEventListener(CUSTOM_EVENT_NAME, handleCustomEvent);

    let bc: BroadcastChannel | null = null;
    try {
      if ('BroadcastChannel' in window) {
        bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        bc.onmessage = (event) => {
          if (event.data?.type === 'REVIEWS_UPDATED' && event.data.payload) {
            setReviews(event.data.payload);
          }
        };
      }
    } catch {
      // Ignore
    }

    return () => {
      window.removeEventListener(CUSTOM_EVENT_NAME, handleCustomEvent);
      if (bc) bc.close();
    };
  }, [refresh]);

  return { reviews, loading, refresh, addReview: addStoredReview };
}
