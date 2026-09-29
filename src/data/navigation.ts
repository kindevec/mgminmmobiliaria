export type PageView = 'home' | 'about' | 'properties' | 'contact' | 'admin' | 'property-detail' | 'privacy' | 'new_property';

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
    path: '/inicio',
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
    description: 'Agenda tu recorrido corporativo VIP guiado o comunícate directamente con nuestros asesores.',
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
  new_property: {
    id: 'new_property',
    hash: 'new_property',
    path: '/new_property',
    label: 'Nueva Propiedad',
    fullTitle: 'Publicar Nueva Propiedad | Panel CMS MGM Inmobiliaria',
    description: 'Formulario de registro y publicación en vivo de nuevos lotes o viviendas en el catálogo.',
    aliases: ['new_property', 'nueva-propiedad', 'crear-lote', 'nuevo-lote', 'new-property'],
  },
};

/**
 * Resuelve la vista correspondiente a partir de pathname o hash de URL
 */
export function resolvePageFromHash(rawHash: string): PageView {
  // Primero revisar si la ruta viene por pathname en HTML5 History (/new_property, /lotes, etc.)
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '').trim();
    if (pathname) {
      if (pathname.includes('/')) {
        const pParts = pathname.split('/');
        if (pParts[0] === 'lotes' || pParts[0] === 'lote' || pParts[0] === 'propiedad') {
          return 'property-detail';
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
 * Devuelve el path canónico oficial sin '#' (ej: '/inicio', '/lotes', '/new_property')
 */
export function getPageCanonicalHash(page: PageView): string {
  return PAGES_CONFIG[page]?.path || '/inicio';
}

