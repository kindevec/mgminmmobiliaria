# Sociedad Civil MGM Inmobiliaria — Portal Web Oficial

Plataforma web institucional y comercial de alta conversión desarrollada para **Sociedad Civil MGM Inmobiliaria** (Ecuador). Especializada en la exhibición y cotización interactiva de lotes urbanizados con respaldo legal, servicios básicos garantizados y proyectos emblemáticos como **Ciudadela Miravalle**.

Desarrollado y desplegado por **Kindev S.A.S.**

---

## 🌐 Enlaces de Producción

* **Sitio Web Oficial (Firebase Hosting):** [sociedadmgminmobiliaria.web.app](https://sociedadmgminmobiliaria.web.app/)
* **Repositorio GitHub:** [github.com/kindevec/mgminmmobiliaria](https://github.com/kindevec/mgminmmobiliaria)

---

## 🚀 Tecnologías y Arquitectura

* **Framework:** [Next.js 15 (React 19)](https://nextjs.org/) con App Router y Static Site Generation (SSG).
* **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) + PostCSS + Iconografía con [Lucide React](https://lucide.dev/).
* **Animaciones:** [Motion](https://motion.dev/) (Framer Motion).
* **Despliegue & CDN:** Google Firebase Hosting con headers de seguridad y optimización de caché inmutable.
* **SEO & OpenGraph:** Metadatos completos JSON-LD (Schema.org / RealEstateAgent) y OpenGraph dinámico para previsualizaciones impecables en WhatsApp y redes sociales.

---

## 📁 Estructura del Proyecto

```text
MGM INMOBILIARIA/
├── app/                  # Next.js App Router (layout, page, opengraph-image, globals.css)
├── src/
│   ├── components/       # Componentes modulares (Header, Footer, BottomNav, PropertyCard, etc.)
│   │   ├── admin/        # Panel de administración CMS para inventario de lotes
│   │   └── views/        # Vistas de la aplicación (Home, Nosotros, Lotes, Miravalle, Contacto, Admin)
│   ├── context/          # State management (PropertyContext)
│   └── data/             # Catálogo de datos estáticos y tipados de lotes
├── docs/                 # Propuesta técnica comercial y prompts de arquitectura
├── public/               # Activos estáticos, isotipos y logotipos SVG/JPEG
├── firebase.json         # Configuración de hosting, rewrites y headers de seguridad
├── .firebaserc           # Alias de proyecto Firebase
└── next.config.ts        # Configuración de Next.js para Static Export
```

---

## 💻 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción estática
npm run build

# Desplegar en Firebase Hosting
firebase deploy --only hosting
```

---

© 2026 **Sociedad Civil MGM Inmobiliaria** · Desarrollado por [Kindev S.A.S.](https://kindevec.com)
