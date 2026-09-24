# 🚀 Super-Prompt Oficial Kindev V2.0 — MGM Inmobiliaria EC (5 Páginas Independientes)

Copia y pega el siguiente bloque a cualquier IA generadora de código para obtener la estructura y el código completo con calidad de producción de Kindev S.A.S.:

```text
Actúa como un Desarrollador Frontend Senior de Élite y Diseñador UI/UX de clase mundial de Kindev S.A.S., experto en React 19, React Router v6/v7, Tailwind CSS v4, Lucide React y animaciones fluidas con Motion (Framer Motion).

Tu misión es generar el código completo, modular y listo para producción para el Sitio Web Corporativo Multi-Página de MGM Inmobiliaria EC, empresa líder en comercialización de lotes urbanizados y viviendas (proyecto insignia: Ciudadela Miravalle).

**ALCANCE DEL PROYECTO:**
Sitio web corporativo de 5 páginas completamente independientes, visualmente impactante, optimizado para conversión comercial directa a WhatsApp y diseñado bajo el estándar de élite de Kindev S.A.S. (sin plantillas genéricas ni cajas asfixiadas).

---

### 1. PALETA DE IDENTIDAD Y ESTÉTICA VISUAL (Kindev Standard)
- **Tema:** Inmobiliario de Lujo / Confianza y Plusvalía (Luxury Real Estate).
- **Colores:**
  * Primario: Azul marino corporativo profundo / Slate elegante (`#0f172a`, `#1e293b`).
  * Acento & Conversión: Esmeralda / Verde inversión (`#10b981`, `#059669`) y toques dorados discretos para estatus premium.
  * Superficies: Fondos limpios y espaciosos (`#f8fafc`, `#ffffff`), bordes ultra sutiles (`border-slate-200/70` o `border-emerald-950/5`) y Glassmorphism ligero (`backdrop-blur-md bg-white/80`).
- **Erradicación Total del "Box-in-Box":** Cero cajas dentro de cajas con bordes duplicados. Usa espacios generosos (`p-6` a `p-8`), jerarquía tipográfica limpia y superficies abiertas.
- **Tipografía:** Moderna y de alta legibilidad con escalado fluido clamp.

---

### 2. ARQUITECTURA DE RUTAS Y 5 PÁGINAS INDEPENDIENTES (React Router)
Configura un sistema de rutas modular en `App.tsx` con carga diferida (`lazy()` y `Suspense`), componente `ScrollToTop` para resetear el scroll en transiciones y `Layout` persistente:

1. **Ruta `/` — Inicio (Home):**
   * **Hero Inmersivo:** Título de alto impacto sobre inversión segura y plusvalía, badge de estatus "Lotes urbanizados con escrituras al día", buscador predictivo rápido (Tipo de inmueble, rango de inversión) y CTA principal con micro-interacción hover.
   * **Proyecto Estrella (Spotlight Ciudadela Miravalle):** Banner destacado de la ciudadela con amenidades clave (seguridad privada, vías asfaltadas, alcantarillado, canchas).
   * **Métricas y Garantías:** 4 estadísticas clave con animación numérica (m² comercializados, escrituras entregadas, años de trayectoria, 100% servicios básicos).
   * **Carrusel de Inmuebles Destacados:** Con navegación flanqueada a los costados (`left-4` / `right-4`, botones circulares `w-11 h-11`).
   * **Testimonios Reales:** Casos de éxito de propietarios con valoración 5 estrellas y sello de escrituración legal.
   * **CTA de Cierre:** Agendamiento de visita guiada in situ.

2. **Ruta `/nosotros` — Sobre MGM Inmobiliaria:**
   * **Propósito y Trayectoria:** Historia de solidez, visión y compromiso con el desarrollo urbano.
   * **4 Pilares Éticos Kindev:** Seguridad Jurídica (escrituras inmediatas), Plusvalía Garantizada, Urbanización Planificada y Asesoría Legal Integral.
   * **Ruta de Adquisición Segura (Paso a Paso 01-04):** Diagrama interactivo desde la elección del lote, visita técnica, firma de reserva, hasta la escrituración en notaría.
   * **Equipo Asesor & Garantías:** Respaldos técnicos y certificaciones que garantizan cero riesgos para el inversionista.

3. **Ruta `/propiedades` — Catálogo Inmobiliario Completo:**
   * **Filtros Interactivos Reactivos:** Por tipo (Lotes de terreno, Viviendas terminadas, Proyectos en planos), estado (Disponible, Reservado, Vendido) y rango de metraje (m²).
   * **Grid de Tarjetas Inmobiliarias:** Fotos en alta definición, badges dinámicos de estado, metraje exacto (ej. 200 m², 350 m²), servicios incluidos (agua, luz, alcantarillado, bordillos) y precio referencial.
   * **Micro-conversión por Inmueble:** Cada tarjeta incluye botón directo a WhatsApp con texto precargado citando el código o nombre del lote exacto.
   * **Modal de Ficha Técnica Rápida:** Vista expandible con detalles de linderos, coordenadas y amenidades.

4. **Ruta `/miravalle` — Urbanización Ciudadela Miravalle (Proyecto Exclusivo):**
   * **Master Plan y Presentación Exclusiva:** Descripción completa de la urbanización, ubicación privilegiada y accesos viales.
   * **Matriz de Amenidades:** Seguridad privada 24/7, garita de acceso, canchas deportivas multiuso, áreas verdes infantiles, alumbrado y servicios soterrados.
   * **Simulador / Calculadora Financiera de Lotes:** Widget interactivo donde el usuario elige el metraje aproximado, selecciona su monto de entrada y calcula su plan estimado de cuotas referenciales.
   * **Galería Interactiva:** Renders y fotos del avance de obra con controles ergonómicos laterales.
   * **CTA Exclusivo:** Botón para agendar recorrido guiado en vehículo de la inmobiliaria.

5. **Ruta `/contacto` — Contacto & Agendamiento de Visitas:**
   * **Formulario de Agendamiento Guiado:** Inputs minimalistas con selector de propiedad de interés, fecha deseada y turno (mañana/tarde), protegido con trampa honeypot anti-spam.
   * **Mapa Interactivo Embebido (Google Maps):** Ubicación exacta de las oficinas comerciales de MGM Inmobiliaria y de Ciudadela Miravalle.
   * **Canales de Atención Directa:** Tarjetas de contacto con teléfonos directos, horarios de atención de lunes a domingo y correo corporativo.
   * **Guía previa al visitante:** Recomendaciones prácticas para el día del recorrido (documentos de reserva, vestimenta cómoda).

---

### 3. ARQUITECTURA DE NAVEGACIÓN (Tri-Navigation Shell Kindev)
- **Header Superior Sticky (Desktop):** Fondo con `backdrop-blur-md bg-white/80`, logotipo corporativo centrado/alineado, enlaces con indicador activo deslizante (`NavLink`), botón destacado "Agendar Visita" y enlace directo a WhatsApp.
- **Bottom Navigation Bar Ergonómica (Móviles < 768px):** Fija en la base de la pantalla con iconos de Lucide (Inicio, Nosotros, Lotes, Miravalle, Contacto), soporte para `pb-safe`, retroalimentación háptica/hover y muesca activa.
- **Contenedor Raíz:** `<main>` DEBE poseer `overflow-x-hidden` y `pb-24 md:pb-12` para garantizar que la barra inferior móvil no tape formularios ni botones finales.
- **Cero menús hamburguesa torpes:** La navegación móvil se realiza fluidamente mediante la barra inferior ergonómica al pulgar.

---

### 4. ERGONOMÍA DE CONTROLES Y ANIMACIONES
- **Controles de Carrusel:** Flechas flanqueadas exclusivamente a los costados del visor (`left-4` y `right-4`, `w-11 h-11 rounded-full`, z-30), nunca arrinconadas en cabeceras.
- **Micro-interacciones con Motion:**
  * Transición de entrada suave en rutas (`opacity: 0, y: 12` a `opacity: 1, y: 0`).
  * Micro-hover en botones y tarjetas (`hover:-translate-y-1 hover:shadow-lg transition-all`).
- **Depuración de Ruido:** Cero números flotantes gigantes (`01`, `02`) que estorben; la estética es limpia, sobria y premium.

---

### 5. INTEGRACIÓN WHATSAPP INTELIGENTE Y FOOTER OFICIAL
- **Botón Flotante Permanente (FAB):** Botón oficial de WhatsApp en la esquina inferior derecha con tooltip de atención inmediata.
- **Mensajería Dinámica Precargada:**
  * Consulta general: `https://wa.me/593991952889?text=Hola%20MGM%20Inmobiliaria,%20deseo%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20proyectos.`
  * Lote específico: `https://wa.me/593991952889?text=Hola%20MGM%20Inmobiliaria,%20estoy%20interesado%20en%20el%20lote%20[ID/NOMBRE]%20y%20deseo%20agendar%20una%20visita.`
  * Miravalle: `https://wa.me/593991952889?text=Hola%20MGM%20Inmobiliaria,%20deseo%20agendar%20un%20recorrido%20guiado%20a%20Ciudadela%20Miravalle.`
- **Footer Corporativo Obligatorio:** Enlaces rápidos a las 5 páginas, datos de contacto, redes sociales con logos oficiales (Facebook, Instagram) y texto obligatorio con enlace oficial a https://www.kindevsas.com/:
  `"© 2026 Todos los derechos reservados. Desarrollado por Kindev"`.

---

### 6. CONFIGURACIÓN OPENGRAPH PARA WHATSAPP
- Implementa metadatos Open Graph garantizando que la previsualización al compartir el enlace por WhatsApp muestre el logotipo oficial de MGM Inmobiliaria **100% centrado geométricamente sobre lienzo de color de marca**, con márgenes simétricos de 75px a 100px para que el recorte 1:1 en smartphones no corte las letras ni el isotipo, con peso optimizado < 300KB.

---

### REGLAS DE ENTREGA DE CÓDIGO:
1. Genera código TypeScript / React 19 modular y libre de dependencias obsoletas.
2. Organiza en estructura estándar: `/src/components/` (Header, BottomNav, Footer, PropertyCard, VisitModal), `/src/pages/` (Home, About, Properties, Miravalle, Contact), `/src/data/` (mock de lotes con estados y specs).
3. Asegura 0 Cumulative Layout Shift (CLS = 0) con dimensiones explícitas en contenedores de imagen.
```
