export interface LotProperty {
  id: string;
  code: string;
  name: string;
  project: 'Ciudadela Miravalle' | 'Mirador del Valle' | 'Colinas Verdes' | 'Residencial San Antonio' | 'San Antonio · Manta' | 'Jerusalén · Malchinguí';
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
  pdfUrl?: string;
  pdfTitle?: string;
  documents?: {
    title: string;
    url: string;
    size?: string;
    description?: string;
  }[];
}

export const LOTS_DATA: LotProperty[] = [
  {
    id: 'prop-mt-023',
    code: 'MT24-023',
    name: 'Casa con Local Comercial en Manta',
    project: 'San Antonio · Manta',
    type: 'Vivienda',
    category: 'Comercial',
    areaM2: 333.59,
    dimensions: '12.00m × 26.56m',
    priceUSD: 151990,
    minDownPaymentUSD: 30398,
    estimatedMonthlyUSD: 2533,
    maxMonths: 48,
    topography: '100% Plano y Regular',
    status: 'Disponible',
    zone: 'San Antonio · Eloy Alfaro · Manta, Manabí',
    features: [
      '4 Dormitorios amplios',
      '4 Baños completos',
      '4 Parqueaderos cubiertos',
      'Local comercial independiente con infraestructura lista',
      'Área de terreno: 333.59 m² | Construcción: 357.58 m²',
      'Cisterna con bomba y portón eléctrico',
      'Cocina con mesones, sala, comedor y estudio',
      'Balcón con vista panorámica y terraza',
      'Lavandería y área BBQ',
      'A solo 2 cuadras de la Vía Interbarrial',
    ],
    description:
      'Imponente residencia de 2 plantas de hormigón armado y estructura metálica ubicada en el sector comercial y residencial San Antonio de Manta, a solo 2 cuadras de la Vía Interbarrial. Cuenta con garaje para 4 vehículos, local comercial operativo con acceso independiente y todos los servicios básicos habilitados. Documentación con escrituras y gravámenes al día.',
    orientation: 'Sector comercial y residencial de alta plusvalía',
    registryStatus: 'Escritura pública, certificado de gravámenes, catastro actualizado e impuestos al día',
    image: '/properties/MT24-023/foto-6.webp',
    gallery: [
      '/properties/MT24-023/foto-6.webp',
      '/properties/MT24-023/foto-10.webp',
      '/properties/MT24-023/foto-11.webp',
      '/properties/MT24-023/foto-9.webp',
      '/properties/MT24-023/foto-7.webp',
      '/properties/MT24-023/foto-2.webp',
      '/properties/MT24-023/foto-3.webp',
      '/properties/MT24-023/foto-5.webp',
      '/properties/MT24-023/foto-8.webp',
      '/properties/MT24-023/foto-13.webp',
      '/properties/MT24-023/foto-12.webp',
      '/properties/MT24-023/foto-4.webp',
      '/properties/MT24-023/foto-1.webp',
    ],
    beds: 4,
    baths: 4,
    featured: true,
    pdfUrl: '/properties/MT24-023/ficha-tecnica-MT24-023.pdf',
    pdfTitle: 'Ficha Técnica Oficial MT24-023 (PDF)',
    documents: [
      {
        title: 'Ficha Técnica Oficial de Inmueble MT24-023',
        url: '/properties/MT24-023/ficha-tecnica-MT24-023.pdf',
        size: '199 KB',
        description: 'Levantamiento de especificaciones técnicas, avalúo y datos de construcción.',
      },
      {
        title: 'Dossier Institucional MGM Inmobiliaria',
        url: '/docs/MGM_Inmobiliaria_Dossier_Institucional_Completo.pdf',
        size: '36 KB',
        description: 'Respaldo jurídico, garantías notariales y trayectoria empresarial.',
      },
    ],
  },
  {
    id: 'lote-c24-279',
    code: 'C24-279',
    name: 'Terreno de Remate en Malchinguí',
    project: 'Jerusalén · Malchinguí',
    type: 'Lote de Terreno',
    category: 'Residencial',
    areaM2: 600,
    dimensions: '24.00m × 25.00m',
    priceUSD: 27990,
    minDownPaymentUSD: 5598,
    estimatedMonthlyUSD: 466,
    maxMonths: 48,
    topography: '100% Plano y Regular',
    status: 'Disponible',
    zone: 'Jerusalén · Malchinguí · Pedro Moncayo, Pichincha',
    features: [
      'Área total: 600.00 m² (24.00m × 25.00m)',
      'Agua potable certificada en el sector',
      'Energía eléctrica y alumbrado público',
      'Red de alcantarillado habilitada',
      'Acceso por vías de lastre amplias',
      'Uso de suelo residencial y comercial (COS/CUS 70%)',
      'Permiso de construcción hasta 3 pisos',
      'Entorno natural cercano a hosterías y quintas campestres',
      'Cerca de la Quinta del Oso',
      'Precio de remate exclusivo',
    ],
    description:
      'Lote de terreno de 600 m² con linderos claramente delimitados por calles, ubicado en el apacible sector Jerusalén de Malchinguí, Pedro Moncayo. Topografía completamente plana y regular con acceso a servicios básicos. Excelente oportunidad de inversión y desarrollo habitacional campestre con toda la documentación municipal y legal al día.',
    orientation: 'Entorno campestre, vías amplias y vistas panorámicas',
    registryStatus: 'Escritura pública, certificado de gravámenes y catastro al día. Documentación completa',
    image: '/properties/C24-279/foto-1.webp',
    gallery: [
      '/properties/C24-279/foto-1.webp',
      '/properties/C24-279/foto-2.webp',
      '/properties/C24-279/foto-3.webp',
      '/properties/C24-279/foto-5.webp',
      '/properties/C24-279/foto-6.webp',
      '/properties/C24-279/foto-7.webp',
      '/properties/C24-279/foto-8.webp',
      '/properties/C24-279/foto-9.webp',
      '/properties/C24-279/foto-10.webp',
      '/properties/C24-279/foto-4.webp',
      '/properties/C24-279/afiche-publicidad.webp',
    ],
    featured: true,
    pdfUrl: '/properties/C24-279/ficha-tecnica-C24-279.pdf',
    pdfTitle: 'Ficha Técnica Oficial C24-279 (PDF)',
    documents: [
      {
        title: 'Ficha Técnica de Terreno en Remate C24-279',
        url: '/properties/C24-279/ficha-tecnica-C24-279.pdf',
        size: '191 KB',
        description: 'Levantamiento de linderos, uso de suelo residencial/comercial y servicios.',
      },
      {
        title: 'Dossier Institucional MGM Inmobiliaria',
        url: '/docs/MGM_Inmobiliaria_Dossier_Institucional_Completo.pdf',
        size: '36 KB',
        description: 'Respaldo jurídico, garantías notariales y trayectoria empresarial.',
      },
    ],
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
    text: 'Escrituras individuales listas en notaría. El crédito directo nos permitió iniciar obra sin depender de bancos.',
    stars: 5,
    location: 'Quito, Ecuador',
  },
  {
    name: 'Dra. Marlene Caicedo',
    role: 'Compradora Lote Esquinero Comercial',
    text: 'Excelente plusvalía en poco tiempo. Las vías adoquinadas y el soterramiento marcan una gran diferencia.',
    stars: 5,
    location: 'Valle de los Chillos',
  },
  {
    name: 'Lcdo. Roberto Zambrano',
    role: 'Propietario Residencia Miravalle',
    text: 'Acompañamiento legal impecable. La visita guiada en terreno nos dio total certeza jurídica.',
    stars: 5,
    location: 'Ecuador',
  },
  {
    name: 'Familia Rodríguez',
    role: 'Propietarios Proyecto Modena',
    text: 'Aprobación directa inmediata solo con cédula. Ver las obras terminadas fue decisivo para nuestra familia.',
    stars: 5,
    location: 'Guayaquil, Ecuador',
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
