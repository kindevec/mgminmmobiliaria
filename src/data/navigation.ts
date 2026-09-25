export type PageView = 'home' | 'about' | 'properties' | 'miravalle' | 'contact' | 'admin' | 'property-detail';

export interface PageConfig {
  id: PageView;
  hash: string;
  label: string;
  fullTitle: string;
  description: string;
  aliases: string[];
}

export const PAGES_CONFIG: Record<PageView, PageConfig> = {
  home: {
    id: 'home',
    hash: 'inicio',
    label: 'Inicio',
    fullTitle: 'Inicio | Sociedad Civil MGM Inmobiliaria · Lotes y Viviendas con Crédito Directo en Ecuador',
    description: 'Proyectos urbanizados planificados en Azuay, Ecuador con crédito directo hasta 48 meses y certeza notarial.',
    aliases: ['', 'inicio', 'home', 'index', 'principal'],
  },
  properties: {
    id: 'properties',
    hash: 'lotes',
    label: 'Lotes',
    fullTitle: 'Catálogo de Lotes & Viviendas Disponibles | MGM Inmobiliaria',
    description: 'Explora lotes residenciales, esquineros y comerciales en venta con financiamiento directo.',
    aliases: ['lotes', 'propiedades', 'properties', 'catalogo', 'terrenos', 'viviendas'],
  },
  about: {
    id: 'about',
    hash: 'nosotros',
    label: 'Nosotros',
    fullTitle: 'Nosotros & Respaldo Jurídico Notarial | Sociedad Civil MGM Inmobiliaria',
    description: 'Conoce nuestra solidez institucional, trayectoria urbanística y escrituras notariales inmediatas.',
    aliases: ['nosotros', 'about', 'empresa', 'quienes-somos', 'legal'],
  },
  miravalle: {
    id: 'miravalle',
    hash: 'miravalle',
    label: 'Miravalle',
    fullTitle: 'Ciudadela Miravalle | Urbanización Planificada en Azuay | MGM Inmobiliaria',
    description: 'Macroproyecto residencial exclusivo con obras de primer nivel, áreas verdes y alta plusvalía.',
    aliases: ['miravalle', 'ciudadela-miravalle', 'ciudadela', 'urbanizacion-miravalle'],
  },
  contact: {
    id: 'contact',
    hash: 'contacto',
    label: 'Contacto',
    fullTitle: 'Contacto & Asesoría Directa | Sociedad Civil MGM Inmobiliaria',
    description: 'Agenda tu recorrido corporativo VIP guiado o comunícate directamente con nuestros asesores.',
    aliases: ['contacto', 'contact', 'atencion', 'visita', 'agendar'],
  },
  admin: {
    id: 'admin',
    hash: 'admin',
    label: 'Administración',
    fullTitle: 'Panel Administrativo de Inventario | MGM Inmobiliaria',
    description: 'Gestión interna de lotes, precios, disponibilidad y estados de reserva.',
    aliases: ['admin', 'administracion', 'panel', 'gestion'],
  },
  'property-detail': {
    id: 'property-detail',
    hash: 'lote',
    label: 'Propiedad',
    fullTitle: 'Detalle de Propiedad | Sociedad Civil MGM Inmobiliaria',
    description: 'Ficha técnica oficial, fotografías de terreno, especificaciones y financiamiento directo sin bancos.',
    aliases: ['lote', 'propiedad', 'detalle', 'item'],
  },
};

/**
 * Resuelve la vista correspondiente a partir de un hash de URL
 */
export function resolvePageFromHash(rawHash: string): PageView {
  const clean = decodeURIComponent(rawHash || '')
    .replace(/^#\/?/, '')
    .toLowerCase()
    .trim();

  // En caso de hashes anidados como lotes/VM-101 o lote/MV-102
  if (clean.includes('/')) {
    const prefix = clean.split('/')[0];
    if (prefix === 'lotes' || prefix === 'lote' || prefix === 'propiedad' || prefix === 'propiedades') {
      return 'property-detail';
    }
    for (const pageKey of Object.keys(PAGES_CONFIG) as PageView[]) {
      const config = PAGES_CONFIG[pageKey];
      if (config.hash === prefix || config.aliases.includes(prefix)) {
        return pageKey;
      }
    }
  }

  // Coincidencia directa o por alias
  for (const pageKey of Object.keys(PAGES_CONFIG) as PageView[]) {
    const config = PAGES_CONFIG[pageKey];
    if (config.hash === clean || config.aliases.includes(clean)) {
      return pageKey;
    }
  }

  return 'home';
}

/**
 * Devuelve el hash canónico oficial con '#' (ej: '#inicio', '#lotes')
 */
export function getPageCanonicalHash(page: PageView): string {
  return '#' + (PAGES_CONFIG[page]?.hash || 'inicio');
}
