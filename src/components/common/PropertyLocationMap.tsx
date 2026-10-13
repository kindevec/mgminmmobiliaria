'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, ExternalLink, Navigation, Layers, Compass, Loader2 } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getCoordinatesForProperty } from '@/src/data/lots';

interface PropertyLocationMapProps {
  lat?: number;
  lng?: number;
  coordinates?: { lat: number; lng: number };
  propertyName?: string;
  project?: string;
  zone?: string;
  address?: string;
  className?: string;
  heightClass?: string;
}

export function PropertyLocationMap({
  lat,
  lng,
  coordinates,
  propertyName = 'Propiedad MGM',
  project = '',
  zone = '',
  address = '',
  className = '',
  heightClass = 'h-[260px] sm:h-[320px]',
}: PropertyLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [mapType, setMapType] = useState<'streets' | 'satellite'>('satellite');
  const [isReady, setIsReady] = useState(false);

  // Compute resolved coordinates using property data or project fallback
  const resolvedCoords = getCoordinatesForProperty({
    lat,
    lng,
    coordinates,
    project,
    zone,
  });

  const displayLocation = address || zone || project || 'Ecuador';

  // Pin SVG anchored at tip
  const createPinIcon = () =>
    L.divIcon({
      className: 'exact-property-map-pin',
      html: `
        <div style="width: 32px; height: 44px; margin: 0; padding: 0; display: block; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5));">
          <svg viewBox="0 0 30 42" width="32" height="44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 42C15 42 29 25 29 15C29 6.71573 22.732 0 15 0C7.26801 0 1 6.71573 1 15C1 25 15 42 15 42Z" fill="#15803d" stroke="#ffffff" stroke-width="2.5"/>
            <circle cx="15" cy="15" r="5" fill="#ffffff"/>
          </svg>
        </div>
      `,
      iconSize: [32, 44],
      iconAnchor: [16, 44],
      popupAnchor: [0, -44],
    });

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [resolvedCoords.lat, resolvedCoords.lng],
      zoom: 16,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: false,
    });

    const tileUrl =
      mapType === 'satellite'
        ? 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
        : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

    const tileLayer = L.tileLayer(tileUrl, { maxZoom: 20 }).addTo(map);
    tileLayerRef.current = tileLayer;

    const marker = L.marker([resolvedCoords.lat, resolvedCoords.lng], {
      icon: createPinIcon(),
    }).addTo(map);

    const safeTitle = propertyName.replace(/"/g, '&quot;');
    const safeLoc = displayLocation.replace(/"/g, '&quot;');
    marker.bindPopup(`
      <div style="font-family: inherit; padding: 3px 2px; min-width: 170px;">
        <span style="display: block; font-weight: 800; font-size: 13px; color: #0f172a; line-height: 1.3;">${safeTitle}</span>
        <span style="display: block; font-size: 11px; color: #166534; font-weight: 600; margin-top: 2px;">${safeLoc}</span>
        <div style="margin-top: 6px; padding: 2px 6px; background: #f1f5f9; border-radius: 6px; font-size: 10px; font-family: monospace; color: #475569;">
          GPS: ${resolvedCoords.lat.toFixed(5)}, ${resolvedCoords.lng.toFixed(5)}
        </div>
      </div>
    `);

    mapInstanceRef.current = map;
    markerRef.current = marker;
    setIsReady(true);

    // Invalidate size on mount to avoid grey tiles inside modals/drawers
    const timer1 = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    const timer2 = setTimeout(() => {
      map.invalidateSize();
    }, 450);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Sync coords if lat/lng change
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView(
        [resolvedCoords.lat, resolvedCoords.lng],
        mapInstanceRef.current.getZoom() || 16
      );
      markerRef.current.setLatLng([resolvedCoords.lat, resolvedCoords.lng]);

      const safeTitle = propertyName.replace(/"/g, '&quot;');
      const safeLoc = displayLocation.replace(/"/g, '&quot;');
      markerRef.current.setPopupContent(`
        <div style="font-family: inherit; padding: 3px 2px; min-width: 170px;">
          <span style="display: block; font-weight: 800; font-size: 13px; color: #0f172a; line-height: 1.3;">${safeTitle}</span>
          <span style="display: block; font-size: 11px; color: #166534; font-weight: 600; margin-top: 2px;">${safeLoc}</span>
          <div style="margin-top: 6px; padding: 2px 6px; background: #f1f5f9; border-radius: 6px; font-size: 10px; font-family: monospace; color: #475569;">
            GPS: ${resolvedCoords.lat.toFixed(5)}, ${resolvedCoords.lng.toFixed(5)}
          </div>
        </div>
      `);
      mapInstanceRef.current.invalidateSize();
    }
  }, [resolvedCoords.lat, resolvedCoords.lng, propertyName, displayLocation]);

  // Switch between Streets and Satellite views
  const switchMapType = (type: 'streets' | 'satellite') => {
    setMapType(type);
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const tileUrl =
      type === 'satellite'
        ? 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
        : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

    tileLayerRef.current = L.tileLayer(tileUrl, { maxZoom: 20 }).addTo(mapInstanceRef.current);
  };

  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${resolvedCoords.lat},${resolvedCoords.lng}`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${resolvedCoords.lat},${resolvedCoords.lng}`;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>Ubicación Satelital y Google Maps</span>
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Georreferenciada con coordenadas satelitales en tiempo real
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
          <Compass className="h-3 w-3 text-emerald-600" />
          <span>{resolvedCoords.lat.toFixed(4)}, {resolvedCoords.lng.toFixed(4)}</span>
        </span>
      </div>

      {/* Map Container Frame */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 group">
        <div ref={mapContainerRef} className={`w-full ${heightClass} z-0`} />

        {/* Map Type Switcher Floating Controls */}
        <div className="absolute top-2.5 right-2.5 z-[400] flex bg-white/95 backdrop-blur-xs rounded-xl shadow-md border border-slate-200 p-0.5">
          <button
            type="button"
            onClick={() => switchMapType('streets')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              mapType === 'streets'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Calles
          </button>
          <button
            type="button"
            onClick={() => switchMapType('satellite')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              mapType === 'satellite'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Satélite
          </button>
        </div>

        {/* Floating Quick Action Overlay */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-[400] bg-white/95 backdrop-blur-xs text-slate-800 border border-slate-200/90 p-2 sm:p-2.5 rounded-xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <MapPin className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">
                {displayLocation}
              </p>
              <p className="text-[10px] text-slate-500 font-mono truncate">
                Lat: {resolvedCoords.lat.toFixed(5)} · Lng: {resolvedCoords.lng.toFixed(5)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition-colors cursor-pointer"
            >
              <Navigation className="h-3 w-3 text-emerald-600" />
              <span>Cómo llegar</span>
            </a>

            <a
              href={googleMapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] shadow-xs transition-colors cursor-pointer"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Abrir en Google Maps</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
