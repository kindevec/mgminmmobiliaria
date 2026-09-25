import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#22A33D',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL || 'https://sociedadmgminmobiliaria.web.app'
  ),
  title: 'MGM Inmobiliaria | Lotes Urbanizados & Proyectos Residenciales en Ecuador',
  description:
    'Sociedad Civil MGM Inmobiliaria. Venta de lotes con escrituras legalizadas, servicios básicos, alta plusvalía y proyectos exclusivos como Ciudadela Miravalle en Ecuador.',
  applicationName: 'MGM Inmobiliaria',
  keywords: [
    'MGM Inmobiliaria',
    'Sociedad Civil MGM Inmobiliaria',
    'Lotes Ecuador',
    'Ciudadela Miravalle',
    'Terrenos urbanizados',
    'Bienes raíces Ecuador',
    'Lotes con escrituras',
    'Venta de terrenos',
  ],
  authors: [{ name: 'Sociedad Civil MGM Inmobiliaria' }],
  creator: 'Kindev S.A.S.',
  publisher: 'Sociedad Civil MGM Inmobiliaria',
  openGraph: {
    title: 'MGM Inmobiliaria | Lotes y Proyectos Residenciales en Ecuador',
    description:
      'Lotes urbanizados con escrituras al día, servicios soterrados y proyectos exclusivos como Ciudadela Miravalle. Invierte con respaldo legal.',
    type: 'website',
    locale: 'es_EC',
    siteName: 'Sociedad Civil MGM Inmobiliaria',
    images: [
      {
        url: '/og-image.jpg',
        width: 800,
        height: 800,
        alt: 'Sociedad Civil MGM Inmobiliaria - Logotipo Oficial',
        type: 'image/jpeg',
      },
      {
        url: '/og-image-square.jpg',
        width: 800,
        height: 800,
        alt: 'Sociedad Civil MGM Inmobiliaria - Logo Cuadrado',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'MGM Inmobiliaria | Lotes y Proyectos Residenciales en Ecuador',
    description:
      'Lotes urbanizados con escrituras al día, servicios soterrados y proyectos como Ciudadela Miravalle.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/logo-mgm.svg',
    shortcut: '/logo-mgm.svg',
    apple: '/logo-mgm.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Sociedad Civil MGM Inmobiliaria',
    description:
      'Empresa inmobiliaria líder en desarrollo y comercialización de lotes urbanizados y comunidades planificadas en Ecuador como Ciudadela Miravalle.',
    telephone: '+593991952889',
    url: 'https://wa.me/593991952889',
    image: 'https://sociedadmgminmobiliaria.web.app/opengraph-image',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'EC',
      addressRegion: 'Ecuador',
    },
    areaServed: 'EC',
    priceRange: '$$',
  };

  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-white text-slate-800 antialiased min-h-screen flex flex-col font-sans selection:bg-emerald-500 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
