'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Search, MapPin, Crosshair, ExternalLink, Loader2, Building2 } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface InteractiveMapPickerProps {
  initialLat?: number;
  initialLng?: number;
  selectedLocality?: string;
  onLocationChange?: (lat: number, lng: number, placeName?: string) => void;
  className?: string;
}

const DEFAULT_LAT = -2.8685;
const DEFAULT_LNG = -78.9654;

export function InteractiveMapPicker({
  initialLat = DEFAULT_LAT,
  initialLng = DEFAULT_LNG,
  selectedLocality,
  onLocationChange,
  className = '',
}: InteractiveMapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng,
  });
  const [detectedPlace, setDetectedPlace] = useState<string>('Miravalle, Azuay');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');
  const [searchResults, setSearchResults] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);

  // Pin SVG mathematically anchored at tip (15, 42)
  const createPinIcon = () =>
    L.divIcon({
      className: 'exact-map-pin',
      html: `
        <div style="width: 30px; height: 42px; margin: 0; padding: 0; display: block; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.5));">
          <svg viewBox="0 0 30 42" width="30" height="42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 42C15 42 29 25 29 15C29 6.71573 22.732 0 15 0C7.26801 0 1 6.71573 1 15C1 25 15 42 15 42Z" fill="#16a34a" stroke="#ffffff" stroke-width="2.2"/>
            <circle cx="15" cy="15" r="5" fill="#ffffff"/>
          </svg>
        </div>
      `,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
      popupAnchor: [0, -42],
    });

  // Reverse geocoding in real time to detect buildings, businesses, and streets
  const detectLocationDetails = async (lat: number, lng: number) => {
    setIsDetecting(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await res.json();
      if (data && data.display_name) {
        const addr = data.address || {};
        const primary =
          addr.building ||
          addr.amenity ||
          addr.shop ||
          addr.commercial ||
          addr.office ||
          addr.leisure ||
          addr.tourism ||
          addr.road ||
          addr.suburb ||
          addr.neighbourhood ||
          data.display_name.split(',')[0];

        const secondary = addr.city || addr.town || addr.county || addr.state || 'Ecuador';
        const formatted = `${primary}, ${secondary}`;
        setDetectedPlace(formatted);

        if (markerRef.current) {
          markerRef.current
            .bindPopup(
              `<div style="font-family: inherit; font-size: 12px; font-weight: bold; color: #0f172a; line-height: 1.3;">
                <span style="color: #16a34a; font-size: 10px; text-transform: uppercase; display: block; margin-bottom: 2px;">📍 Ubicación Exacta</span>
                ${formatted}
              </div>`
            )
            .openPopup();
        }

        onLocationChange?.(lat, lng, formatted);
        return;
      }
    } catch {
      // Ignore geocoding failure silently
    } finally {
      setIsDetecting(false);
    }

    onLocationChange?.(lat, lng);
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [coords.lat, coords.lng],
      zoom: 16,
      zoomControl: true,
      attributionControl: false,
    });

    const tileUrl =
      mapType === 'satellite'
        ? 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
        : 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

    const tileLayer = L.tileLayer(tileUrl, { maxZoom: 20 }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Draggable Marker
    const marker = L.marker([coords.lat, coords.lng], {
      icon: createPinIcon(),
      draggable: true,
    }).addTo(map);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      const updatedLat = Number(pos.lat.toFixed(6));
      const updatedLng = Number(pos.lng.toFixed(6));
      setCoords({ lat: updatedLat, lng: updatedLng });
      detectLocationDetails(updatedLat, updatedLng);
    });

    // Move marker on any map click (including buildings or businesses)
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const updatedLat = Number(lat.toFixed(6));
      const updatedLng = Number(lng.toFixed(6));
      marker.setLatLng([updatedLat, updatedLng]);
      setCoords({ lat: updatedLat, lng: updatedLng });
      detectLocationDetails(updatedLat, updatedLng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update tile layer when switching map type
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

  // Jump to specific coords
  const moveToCoords = (lat: number, lng: number, zoom = 16) => {
    const updatedLat = Number(lat.toFixed(6));
    const updatedLng = Number(lng.toFixed(6));
    setCoords({ lat: updatedLat, lng: updatedLng });
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 1 });
    }
    detectLocationDetails(updatedLat, updatedLng);
  };

  // Search locality / address using Nominatim (no <form> tag to prevent page reload)
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults([]);
    try {
      const queryWithCountry = searchQuery.toLowerCase().includes('ecuador')
        ? searchQuery.trim()
        : `${searchQuery.trim()}, Ecuador`;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          queryWithCountry
        )}&limit=5`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        setSearchResults(data);
        const first = data[0];
        const lat = parseFloat(first.lat);
        const lng = parseFloat(first.lon);
        moveToCoords(lat, lng, 16);
      }
    } catch (err) {
      console.error('Error al geocodificar:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search Input Bar (DIV, NOT FORM to avoid nested form submission) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSearch();
                }
              }}
              placeholder="Buscar ciudad, cantón, barrio o edificio (ej. Quevedo, Cuenca)..."
              className="w-full rounded-xl border border-slate-300 pl-8 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none bg-white shadow-xs"
            />
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSearch();
            }}
            disabled={isSearching}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer shadow-xs whitespace-nowrap"
          >
            {isSearching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
            <span>Buscar</span>
          </button>
        </div>

        {/* Search Results Dropdown (if multiple found) */}
        {searchResults.length > 1 && (
          <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-md space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase px-2 block">Selecciona ubicación:</span>
            {searchResults.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  moveToCoords(parseFloat(item.lat), parseFloat(item.lon), 16);
                  setSearchResults([]);
                }}
                className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors truncate block cursor-pointer"
              >
                📍 {item.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map View Frame */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-300 shadow-sm bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-[280px] sm:h-[320px] z-0" />

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
            Mapa
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

        {/* Floating Instruction Banner with Real-time Building / Place Detection */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-[400] bg-slate-950/90 backdrop-blur-xs text-white px-3 py-2 rounded-xl text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-1 shadow-lg pointer-events-none">
          <div className="flex items-center gap-1.5 min-w-0">
            {isDetecting ? (
              <Loader2 className="h-3.5 w-3.5 text-emerald-400 animate-spin shrink-0" />
            ) : (
              <Building2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            )}
            <span className="truncate font-semibold text-white">
              {isDetecting ? 'Detectando edificio o negocio...' : detectedPlace}
            </span>
          </div>
          <span className="font-mono font-bold text-emerald-400 text-[10px] shrink-0">
            {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
          </span>
        </div>
      </div>

      {/* Real-time Place Detection & Google Maps Link */}
      <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-emerald-950">
            <Building2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span className="font-bold">Lugar o Edificio Detectado:</span>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 hover:text-emerald-900 font-bold inline-flex items-center gap-1 hover:underline text-[11px] shrink-0"
          >
            <span>Ver en Google Maps</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <p className="text-xs text-emerald-900 font-medium leading-snug">
          {detectedPlace}
        </p>
        <div className="text-[10px] text-emerald-700 font-mono">
          Coordenadas exactas fijadas: {coords.lat}, {coords.lng}
        </div>
      </div>
    </div>
  );
}
