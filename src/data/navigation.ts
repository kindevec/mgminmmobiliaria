export type PageView = 'home' | 'about' | 'properties' | 'constructions' | 'appraisals' | 'contact' | 'admin' | 'property-detail' | 'privacy';

export interface PageConfig {
  id: PageView;
  hash: string;
  path: string;
  label: string;
  fullTitle: string;
  description: string;
  aliases: string[];
}

export const PAGES_CONFIG: Record<PageView, PageConfig> = {
  home: {
    id: 'home',
    hash: 'inicio',
    path: '/',
    label: 'Inicio',
    fullTitle: 'Inicio | Sociedad Civil MGM Inmobiliaria · Lotes y Viviendas con Crédito Directo en Ecuador',
    description: 'Proyectos urbanizados planificados en Azuay, Ecuador con crédito directo hasta 48 meses y certeza notarial.',
    aliases: ['', 'inicio', 'home', 'index', 'principal'],
  },
  properties: {
    id: 'properties',
    hash: 'lotes',
    path: '/lotes',
    label: 'Lotes',
    fullTitle: 'Catálogo de Lotes & Viviendas Disponibles | MGM Inmobiliaria',
    description: 'Explora lotes residenciales, esquineros y comerciales en venta con financiamiento directo.',
    aliases: ['lotes', 'propiedades', 'properties', 'catalogo', 'terrenos', 'viviendas'],
  },
  constructions: {
    id: 'constructions',
    hash: 'construcciones',
    path: '/construcciones',
    label: 'Construcciones',
    fullTitle: 'Nuestras Construcciones & Obras Civiles | Sociedad Civil MGM Inmobiliaria',
    description: 'Conoce los proyectos de construcción, casas de diseño y obras ejecutadas por MGM Inmobiliaria en el Austro ecuatoriano.',
    aliases: ['construcciones', 'construccion', 'nuestras-construcciones', 'obras', 'proyectos-construccion', 'constructions'],
  },
  appraisals: {
    id: 'appraisals',
    hash: 'avaluos',
    path: '/avaluos',
    label: 'Avalúos',
    fullTitle: 'Avalúos Inmobiliarios & Peritajes Técnicos | Sociedad Civil MGM Inmobiliaria',
    description: 'Dictamen pericial, valoración comercial y peritaje técnico de inmuebles, lotes y construcciones en Azuay y Ecuador con rigor notarial y validez legal.',
    aliases: ['avaluos', 'avaluo', 'peritaje', 'peritajes', 'tasacion', 'tasaciones', 'appraisals'],
  },
  about: {
    id: 'about',
    hash: 'nosotros',
    path: '/nosotros',
    label: 'Nosotros',
    fullTitle: 'Nosotros & Respaldo Jurídico Notarial | Sociedad Civil MGM Inmobiliaria',
    description: 'Conoce nuestra solidez institucional, trayectoria urbanística y escrituras notariales inmediatas.',
    aliases: ['nosotros', 'about', 'empresa', 'quienes-somos', 'legal-info'],
  },
  contact: {
    id: 'contact',
    hash: 'contacto',
    path: '/contacto',
    label: 'Contacto',
    fullTitle: 'Contacto & Asesoría Directa | Sociedad Civil MGM Inmobiliaria',
    description: 'Comunícate directamente con nuestros asesores inmobiliarios.',
    aliases: ['contacto', 'contact', 'atencion', 'visita', 'agendar'],
  },
  admin: {
    id: 'admin',
    hash: 'admin',
    path: '/admin',
    label: 'Administración',
    fullTitle: 'Panel Administrativo de Inventario | MGM Inmobiliaria',
    description: 'Gestión interna de lotes, precios, disponibilidad y estados de reserva.',
    aliases: ['admin', 'administracion', 'panel', 'gestion'],
  },
  'property-detail': {
    id: 'property-detail',
    hash: 'lote',
    path: '/lote',
    label: 'Propiedad',
    fullTitle: 'Detalle de Propiedad | Sociedad Civil MGM Inmobiliaria',
    description: 'Ficha técnica oficial, fotografías de terreno, especificaciones y financiamiento directo sin bancos.',
    aliases: ['lote', 'propiedad', 'detalle', 'item'],
  },
  privacy: {
    id: 'privacy',
    hash: 'privacy',
    path: '/privacy',
    label: 'Privacidad & Términos',
    fullTitle: 'Políticas de Privacidad, Términos & Cookies | Sociedad Civil MGM Inmobiliaria',
    description: 'Marco legal oficial: política de protección de datos personales LOPDP, términos y condiciones contractuales y política de cookies.',
    aliases: ['privacy', 'privacidad', 'terminos', 'cookies', 'legal', 'politicas', 'politica-de-privacidad'],
  },
};

/**
 * Resuelve la vista correspondiente a partir de pathname o hash de URL
 */
export function resolvePageFromHash(rawHash: string): PageView {
  const clean = decodeURIComponent(rawHash || '')
    .replace(/^#\/?/, '')
    .toLowerCase()
    .trim();

  // 1. Si se provee un hash explícito, resolverlo con prioridad
  if (clean) {
    if (clean.includes('/')) {
      const prefix = clean.split('/')[0];
      if (prefix === 'lotes' || prefix === 'lote' || prefix === 'propiedad' || prefix === 'propiedades') {
        return 'property-detail';
      }
      if (prefix === 'admin' || prefix === 'panel' || prefix === 'administracion') {
        return 'admin';
      }
      for (const pageKey of Object.keys(PAGES_CONFIG) as PageView[]) {
        const config = PAGES_CONFIG[pageKey];
        if (config.hash === prefix || config.aliases.includes(prefix)) {
          return pageKey;
        }
      }
    }

    for (const pageKey of Object.keys(PAGES_CONFIG) as PageView[]) {
      const config = PAGES_CONFIG[pageKey];
      if (config.hash === clean || config.id === clean || config.aliases.includes(clean)) {
        return pageKey;
      }
    }
  }

  // 2. Si no hay hash o no coincidió, resolver la ruta vía HTML5 History pathname (/admin, /panel, /lotes, etc.)
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '').trim();
    if (pathname) {
      if (pathname.includes('/')) {
        const pParts = pathname.split('/');
        if (pParts[0] === 'lotes' || pParts[0] === 'lote' || pParts[0] === 'propiedad' || pParts[0] === 'propiedades') {
          return 'property-detail';
        }
        if (pParts[0] === 'admin' || pParts[0] === 'panel' || pParts[0] === 'administracion') {
          return 'admin';
        }
      }
      for (const pageKey of Object.keys(PAGES_CONFIG) as PageView[]) {
        const config = PAGES_CONFIG[pageKey];
        if (config.id === pathname || config.hash === pathname || config.aliases.includes(pathname)) {
          return pageKey;
        }
      }
    }
  }

  return 'home';
}

/**
 * Devuelve el path canónico oficial sin '#' (ej: '/inicio', '/lotes')
 */
export function getPageCanonicalHash(page: PageView): string {
  return PAGES_CONFIG[page]?.path || '/';
}
