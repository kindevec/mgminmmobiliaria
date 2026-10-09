import { createClient } from '@supabase/supabase-js';
import type { LotProperty } from '@/src/data/lots';

const supabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  'https://ospsnohsrhmqtnyfndhh.supabase.co';

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zcHNub2hzcmhtcXRueWZuZGhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMjM2OTAsImV4cCI6MjEwNjg5OTY5MH0.ax29LOrsEmRy-6MaeJtwMAVhLZ-14jIqqBGh4aAOvTM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DbPropertyRow {
  id: string;
  code: string;
  name: string;
  project: string;
  type: string;
  category: string;
  area_m2: number;
  dimensions: string;
  price_usd: number;
  min_down_payment_usd: number;
  estimated_monthly_usd: number;
  max_months: number;
  topography: string;
  status: 'Disponible' | 'En Reserva' | 'Vendido';
  zone: string;
  features: string[];
  description: string;
  orientation?: string | null;
  registry_status?: string | null;
  image: string;
  gallery: string[];
  beds?: number | null;
  baths?: number | null;
  featured?: boolean;
  pdf_url?: string | null;
  pdf_title?: string | null;
  documents?: {
    title: string;
    url: string;
    size?: string;
    description?: string;
  }[];
  created_at?: string;
  updated_at?: string;
}

export function mapRowToProperty(row: DbPropertyRow): LotProperty {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    project: row.project as LotProperty['project'],
    type: row.type as LotProperty['type'],
    category: row.category as LotProperty['category'],
    areaM2: Number(row.area_m2),
    dimensions: row.dimensions,
    priceUSD: Number(row.price_usd),
    minDownPaymentUSD: Number(row.min_down_payment_usd),
    estimatedMonthlyUSD: Number(row.estimated_monthly_usd),
    maxMonths: Number(row.max_months || 48),
    topography: row.topography,
    status: row.status,
    zone: row.zone,
    features: Array.isArray(row.features) ? row.features : [],
    description: row.description,
    orientation: row.orientation || '',
    registryStatus: row.registry_status || '',
    image: row.image,
    gallery: Array.isArray(row.gallery) && row.gallery.length > 0 ? row.gallery : [row.image],
    beds: row.beds !== null && row.beds !== undefined ? Number(row.beds) : undefined,
    baths: row.baths !== null && row.baths !== undefined ? Number(row.baths) : undefined,
    featured: Boolean(row.featured),
    pdfUrl: row.pdf_url || undefined,
    pdfTitle: row.pdf_title || undefined,
    documents: Array.isArray(row.documents) ? row.documents : [],
  };
}

export function mapPropertyToRow(prop: Partial<LotProperty>): Partial<DbPropertyRow> {
  const row: Partial<DbPropertyRow> = {};
  if (prop.id !== undefined) row.id = prop.id;
  if (prop.code !== undefined) row.code = prop.code;
  if (prop.name !== undefined) row.name = prop.name;
  if (prop.project !== undefined) row.project = prop.project;
  if (prop.type !== undefined) row.type = prop.type;
  if (prop.category !== undefined) row.category = prop.category;
  if (prop.areaM2 !== undefined) row.area_m2 = Number(prop.areaM2);
  if (prop.dimensions !== undefined) row.dimensions = prop.dimensions;
  if (prop.priceUSD !== undefined) row.price_usd = Number(prop.priceUSD);
  if (prop.minDownPaymentUSD !== undefined) row.min_down_payment_usd = Number(prop.minDownPaymentUSD);
  if (prop.estimatedMonthlyUSD !== undefined) row.estimated_monthly_usd = Number(prop.estimatedMonthlyUSD);
  if (prop.maxMonths !== undefined) row.max_months = Number(prop.maxMonths);
  if (prop.topography !== undefined) row.topography = prop.topography;
  if (prop.status !== undefined) row.status = prop.status;
  if (prop.zone !== undefined) row.zone = prop.zone;
  if (prop.features !== undefined) row.features = prop.features;
  if (prop.description !== undefined) row.description = prop.description;
  if (prop.orientation !== undefined) row.orientation = prop.orientation;
  if (prop.registryStatus !== undefined) row.registry_status = prop.registryStatus;
  if (prop.image !== undefined) row.image = prop.image;
  if (prop.gallery !== undefined) row.gallery = prop.gallery;
  if (prop.beds !== undefined) row.beds = prop.beds;
  if (prop.baths !== undefined) row.baths = prop.baths;
  if (prop.featured !== undefined) row.featured = prop.featured;
  if (prop.pdfUrl !== undefined) row.pdf_url = prop.pdfUrl;
  if (prop.pdfTitle !== undefined) row.pdf_title = prop.pdfTitle;
  if (prop.documents !== undefined) row.documents = prop.documents;
  return row;
}
