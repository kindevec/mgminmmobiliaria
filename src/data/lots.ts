export interface LotProperty {
  id: string;
  code: string;
  name: string;
  project: 'Ciudadela Miravalle' | 'Mirador del Valle' | 'Colinas Verdes' | 'Residencial San Antonio';
  type: 'Lote de Terreno' | 'Vivienda' | 'Proyecto en Planos';
  category: 'Residencial' | 'Esquinero' | 'Comercial' | 'Campestre';
  areaM2: number;
  dimensions: string; // e.g. "13.0m × 20.0m"
  priceUSD: number;
  minDownPaymentUSD: number;
  estimatedMonthlyUSD: number;
  maxMonths: number;
  topography: string;
  status: 'Disponible' | 'En Reserva' | 'Vendido';
  zone: string;
  features: string[];
  description: string;
  orientation: string;
  registryStatus: string;
  image: string;
  gallery: string[];
  beds?: number;
  baths?: number;
  featured?: boolean;
}

export const LOTS_DATA: LotProperty[] = [
  {
    id: 'prop-mv-101',
    code: 'VM-101',
    name: 'Villa Miravalle Elegance',
    project: 'Ciudadela Miravalle',
    type: 'Vivienda',
    category: 'Residencial',
    areaM2: 280,
    dimensions: '14.0m × 20.0m',
    priceUSD: 78500,
    minDownPaymentUSD: 15700,
    estimatedMonthlyUSD: 1308,
    maxMonths: 48,
    topography: '100% Plano con Jardín Privado',
    status: 'Disponible',
    zone: 'Etapa 1 · Sector Miravalle Central',
    features: [
      '3 Dormitorios Master con baño privado',
      'Piscina privada y área BBQ pergolada',
      'Acometidas subterráneas de luz y fibra óptica',
      'Acabados en cuarzo y porcelanato importado',
      'Cochera techada para 2 vehículos',
    ],
    description:
      'Vivienda contemporánea de 2 plantas diseñada con amplios ventanales de piso a techo, iluminación natural bioclimática y jardín posterior con piscina privada.',
    orientation: 'Norte - Sur (iluminación solar constante)',
    registryStatus: 'Escritura individual legalizada e inscrita en el Registro de la Propiedad',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    ],
    beds: 3,
    baths: 3,
    featured: true,
  },
  {
    id: 'lote-mv-102',
    code: 'MV-102',
    name: 'Lote Miravalle A-02 (Frente a Parque)',
    project: 'Ciudadela Miravalle',
    type: 'Lote de Terreno',
    category: 'Residencial',
    areaM2: 260,
    dimensions: '13.0m × 20.0m',
    priceUSD: 23400,
    minDownPaymentUSD: 4680,
    estimatedMonthlyUSD: 390,
    maxMonths: 48,
    topography: '100% Plano',
    status: 'Disponible',
    zone: 'Etapa 1 · Sector Miravalle Central',
    features: [
      'Agua potable instalada y medidor independiente',
      'Energía eléctrica soterrada',
      'Alcantarillado pluvial y sanitario',
      'Frente a área verde y juegos infantiles',
      'Vía adoquinada de 10 metros de ancho',
    ],
    description:
      'Excelente lote residencial en primera etapa con vista directa a la plaza y jardines de Ciudadela Miravalle. Ideal para construir residencia familiar en entorno seguro.',
    orientation: 'Norte - Sur (óptima ventilación)',
    registryStatus: 'Escritura individual legalizada e inscrita en el Registro de la Propiedad',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    featured: true,
  },
  {
    id: 'prop-mv-108',
    code: 'MV-108',
    name: 'Lote Miravalle Esquinero B-08',
    project: 'Ciudadela Miravalle',
    type: 'Lote de Terreno',
    category: 'Esquinero',
    areaM2: 345,
    dimensions: '17.2m × 20.0m',
    priceUSD: 32775,
    minDownPaymentUSD: 6555,
    estimatedMonthlyUSD: 546,
    maxMonths: 48,
    topography: '100% Plano',
    status: 'Disponible',
    zone: 'Etapa 1 · Avenida Principal',
    features: [
      'Doble frente a vías adoquinadas',
      'Red matriz de servicios básicos subterráneos',
      'Facilidad para doble acceso vehicular',
      'Retiro frontal de 3 metros proyectado',
      'Postes de iluminación LED frente al predio',
    ],
    description:
      'Lote esquinero premium sobre la avenida de acceso de Ciudadela Miravalle. Permite diseño arquitectónico con fachadas amplias y doble cochera.',
    orientation: 'Este - Oeste (vista al amanecer)',
    registryStatus: 'Aprobación municipal definitiva y escrituras al día',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    ],
    featured: true,
  },
  {
    id: 'prop-mv-204',
    code: 'RC-204',
    name: 'Residencia Campestre Sol Naciente',
    project: 'Ciudadela Miravalle',
    type: 'Vivienda',
    category: 'Campestre',
    areaM2: 350,
    dimensions: '17.5m × 20.0m',
    priceUSD: 94000,
    minDownPaymentUSD: 18800,
    estimatedMonthlyUSD: 1566,
    maxMonths: 48,
    topography: 'Terraza suave con mirador',
    status: 'Disponible',
    zone: 'Etapa 2 · Balcón del Valle',
    features: [
      '4 Habitaciones luminosas con balcón',
      '3 Baños completos y 1 social',
      'Sala comedor integrada a porche exterior',
      'Redes soterradas de agua y energía',
      'Zona de asador rústico y pérgola',
    ],
    description:
      'Chalet de diseño contemporáneo campestre con acabados de primera calidad, amplias áreas verdes y vistas panorámicas hacia el valle de Ciudadela Miravalle.',
    orientation: 'Este - Norte',
    registryStatus: 'Título saneado y escrituración notarial inmediata',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    ],
    beds: 4,
    baths: 4,
    featured: true,
  },
  {
    id: 'lote-mv-215',
    code: 'MV-215',
    name: 'Lote Miravalle Panorámico C-15',
    project: 'Ciudadela Miravalle',
    type: 'Lote de Terreno',
    category: 'Residencial',
    areaM2: 280,
    dimensions: '14.0m × 20.0m',
    priceUSD: 25760,
    minDownPaymentUSD: 5152,
    estimatedMonthlyUSD: 429,
    maxMonths: 48,
    topography: 'Terraza suave con vista despejada',
    status: 'Disponible',
    zone: 'Etapa 2 · Balcón del Valle',
    features: [
      'Elevación natural con vista 180° permanente',
      'Todos los servicios básicos listos',
      'A solo 80 metros de la casa comunal',
      'Acometida subterránea de fibra óptica',
    ],
    description:
      'Terreno en sector alto de Miravalle que garantiza una vista panorámica permanente hacia los valles. Brisa fresca y máxima privacidad para tu proyecto arquitectónico.',
    orientation: 'Sur - Oeste',
    registryStatus: 'Libre de gravamen, listo para escrituración inmediata',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    ],
    featured: false,
  },
  {
    id: 'lote-mv-301',
    code: 'MV-301',
    name: 'Macrolote Comercial Miravalle Boulevard',
    project: 'Ciudadela Miravalle',
    type: 'Lote de Terreno',
    category: 'Comercial',
    areaM2: 420,
    dimensions: '21.0m × 20.0m',
    priceUSD: 46200,
    minDownPaymentUSD: 9240,
    estimatedMonthlyUSD: 770,
    maxMonths: 48,
    topography: '100% Plano',
    status: 'En Reserva',
    zone: 'Boulevard de Acceso y Servicios',
    features: [
      'Uso de suelo mixto (Comercial / Residencial)',
      'Apto para minimarket, farmacia, clínica o consultorios',
      'Bahía de parqueo frontal proyectada',
      'Transformador eléctrico de alta capacidad',
    ],
    description:
      'Ubicación estratégica en el portal de entrada de Ciudadela Miravalle con flujo vehicular garantizado de más de 300 familias residentes.',
    orientation: 'Norte (frente directo a la carretera)',
    registryStatus: 'Título saneado y delimitado por catastro cantonal',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    ],
    featured: false,
  },
  {
    id: 'prop-mv-305',
    code: 'PL-305',
    name: 'Casa Miravalle Proyecto en Planos Modena',
    project: 'Ciudadela Miravalle',
    type: 'Proyecto en Planos',
    category: 'Residencial',
    areaM2: 220,
    dimensions: '11.0m × 20.0m',
    priceUSD: 62900,
    minDownPaymentUSD: 12580,
    estimatedMonthlyUSD: 1048,
    maxMonths: 48,
    topography: '100% Plano',
    status: 'Disponible',
    zone: 'Etapa 2 · Pasaje Los Álamos',
    features: [
      'Plano arquitectónico aprobado por el Municipio',
      '3 Dormitorios, 2 baños y medio',
      'Personalización de acabados en pisos y cocina',
      'Entrega en 10 meses con llaves en mano',
    ],
    description:
      'Proyecto unifamiliar en planos con precio congelado en preventa. Elige el estilo de pisos, closets y mesones mientras pagas tu lote.',
    orientation: 'Norte - Sur',
    registryStatus: 'Planos aprobados y matriculados individualmente',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    ],
    beds: 3,
    baths: 3,
    featured: true,
  },
  {
    id: 'lote-mv-220',
    code: 'MV-220',
    name: 'Lote Miravalle Campestre D-04',
    project: 'Ciudadela Miravalle',
    type: 'Lote de Terreno',
    category: 'Campestre',
    areaM2: 520,
    dimensions: '20.0m × 26.0m',
    priceUSD: 44200,
    minDownPaymentUSD: 8840,
    estimatedMonthlyUSD: 737,
    maxMonths: 48,
    topography: 'Suave ondulación verde',
    status: 'Disponible',
    zone: 'Etapa 2 · Sendero Ecológico',
    features: [
      'Colindante con reserva de árboles nativos',
      'Espacio ideal para huerto o piscina privada',
      'Agua potable certificada y energía eléctrica',
      'Ambiente campestre y silencioso',
    ],
    description:
      'Lote amplio de más de 500 metros cuadrados para quienes buscan amplitud, aire puro y jardines extensos dentro de una urbanización controlada.',
    orientation: 'Norte - Este',
    registryStatus: 'Escrituras individuales listas para traspaso notarial',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    ],
    featured: false,
  },
  {
    id: 'lote-mv-114',
    code: 'MV-114',
    name: 'Lote Residencial Miravalle A-14',
    project: 'Ciudadela Miravalle',
    type: 'Lote de Terreno',
    category: 'Residencial',
    areaM2: 240,
    dimensions: '12.0m × 20.0m',
    priceUSD: 21600,
    minDownPaymentUSD: 4320,
    estimatedMonthlyUSD: 360,
    maxMonths: 48,
    topography: '100% Plano',
    status: 'Vendido',
    zone: 'Etapa 1 · Manzana A',
    features: [
      'Servicios básicos completamente habilitados',
      'Aceras y bordillos terminados',
      'Vecindario con construcciones activas',
    ],
    description:
      'Lote entregado con escrituras saneadas a cliente inversionista. Proyecto con construcción habitacional en curso.',
    orientation: 'Sur - Norte',
    registryStatus: 'Escriturado e inscrito en el Registro de la Propiedad',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    ],
    featured: false,
  },
];

export const AMENITIES_MIRAVALLE = [
  {
    title: 'Vías Adoquinadas & Aceras Podotáctiles',
    description:
      'Calzadas de 10 y 12 metros de ancho con adoquín vehicular de alto tránsito, bordillos de hormigón y aceras peatonales ajardinadas.',
    icon: 'Road',
    tag: 'Infraestructura Vial',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Redes Eléctricas & Servicios Subterráneos',
    description:
      'Agua potable certificada con presión constante, alcantarillado sanitario y pluvial separado, y ductería soterrada para energía y fibra óptica.',
    icon: 'Zap',
    tag: 'Tecnología & Confort',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Complejo Polideportivo & Canchas Iluminadas',
    description:
      'Canchas de uso múltiple (fútbol sintético, básquetbol, vóley) con graderíos cubiertos e iluminación LED para el deporte nocturno familiar.',
    icon: 'Trophy',
    tag: 'Deporte & Salud',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Parques Infantiles & Más de 8.000 m² de Áreas Verdes',
    description:
      'Juegos infantiles certificados, bancas de descanso, senderos ecológicos con árboles nativos y caminerías para ejercitarse.',
    icon: 'Trees',
    tag: 'Naturaleza & Bienestar',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Garita de Vigilancia 24/7 & Control Automatizado',
    description:
      'Pórtico de seguridad con guardia permanente, barreras automáticas con lector vehicular y circuito cerrado de cámaras CCTV en todo el perímetro.',
    icon: 'ShieldCheck',
    tag: 'Seguridad Integral',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Club House & Salón Comunal para Eventos',
    description:
      'Espacio climatizado de usos múltiples, terraza exterior con pérgola, batería sanitaria y zona de parrilla (BBQ) para celebraciones de los residentes.',
    icon: 'Building',
    tag: 'Comunidad & Eventos',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80',
  },
];

export const TESTIMONIALS_DATA = [
  {
    name: 'Ing. Fabricio Paredes & Familia',
    role: 'Propietario Lote Etapa 1 · Ciudadela Miravalle',
    text: 'Revisamos minuciosamente las escrituras en la notaría antes de dar el anticipo y todo estuvo perfectamente en regla. El crédito directo de MGM Inmobiliaria nos permitió empezar a construir de inmediato.',
    stars: 5,
    location: 'Quito, Ecuador',
  },
  {
    name: 'Dra. Marlene Caicedo',
    role: 'Compradora Lote Esquinero Comercial',
    text: 'Compré para inversión y en menos de 14 meses el valor del metro cuadrado ha subido más de un 20%. La entrega con calles adoquinadas y luz soterrada marca una enorme diferencia.',
    stars: 5,
    location: 'Valle de los Chillos',
  },
  {
    name: 'Lcdo. Roberto Zambrano',
    role: 'Propietario Residencia Miravalle',
    text: 'El acompañamiento del equipo de MGM Inmobiliaria fue impecable. La visita guiada en terreno nos dio la tranquilidad que ninguna otra inmobiliaria nos había brindado.',
    stars: 5,
    location: 'Ecuador',
  },
];

export const VISITOR_GUIDE = [
  {
    title: 'Calzado y Ropa Cómoda',
    detail: 'Te recomendamos calzado deportivo o botas de caminata ligera para recorrer los linderos y topografía de cada lote sin dificultad.',
  },
  {
    title: 'Cédula de Identidad',
    detail: 'Lleva tu documento de identidad para ingresar por la garita de seguridad de la urbanización y recibir tu carpeta técnica.',
  },
  {
    title: 'Transporte de la Empresa',
    detail: 'Si no cuentas con vehículo propio, disponemos de transporte ejecutivo gratuito desde nuestro punto de encuentro en la ciudad.',
  },
  {
    title: 'Asesor Legal y Técnico en Sitio',
    detail: 'Durante el recorrido podrás consultar planimetrías, mojones georreferenciados y la matriz de escrituras notariales en vivo.',
  },
];

export const WHATSAPP_PHONE = '593991952889';

export function getGeneralWhatsAppUrl() {
  const text = encodeURIComponent(
    'Hola MGM Inmobiliaria, deseo más información sobre sus proyectos de lotes y viviendas.'
  );
  return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
}

export function getLotWhatsAppUrl(lotName: string, lotCode: string, priceUSD?: number) {
  const priceText = priceUSD ? ` valorado en $${priceUSD.toLocaleString()} USD` : '';
  const text = encodeURIComponent(
    `Hola MGM Inmobiliaria, deseo información del lote ${lotCode} (${lotName})${priceText} y agendar una visita.`
  );
  return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
}

export function getMiravalleWhatsAppUrl() {
  const text = encodeURIComponent(
    'Hola MGM Inmobiliaria, deseo agendar un recorrido guiado a Ciudadela Miravalle en transporte de la empresa.'
  );
  return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
}

export function getCustomQuoteWhatsAppUrl(
  lotCode: string,
  price: number,
  downPayment: number,
  months: number,
  monthlyQuota: number
) {
  const text = encodeURIComponent(
    `Hola MGM Inmobiliaria, he simulado la cotización para el lote/propiedad ${lotCode}:\n` +
      `• Valor total: $${price.toLocaleString()} USD\n` +
      `• Entrada inicial: $${downPayment.toLocaleString()} USD\n` +
      `• Plazo: ${months} meses\n` +
      `• Cuota mensual proyectada: $${monthlyQuota.toLocaleString()} USD\n\n` +
      `Deseo coordinar la reserva y revisión de documentación.`
  );
  return `https://wa.me/${WHATSAPP_PHONE}?text=${text}`;
}
