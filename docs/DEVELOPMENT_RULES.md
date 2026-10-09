# DEVELOPMENT RULES — Sociedad Civil MGM Inmobiliaria

> **Estas reglas son obligatorias salvo que el propietario del proyecto autorice explícitamente una excepción.**

---

## 1. Regla Fundamental

**ANTES DE MODIFICAR EL CÓDIGO:**
1. Analizar la tarea con precisión.
2. Identificar los archivos afectados.
3. Revisar componentes relacionados y contratos de interfaz.
4. Revisar dependencias involucradas.
5. Revisar el contexto del proyecto en `docs/PROJECT_CONTEXT.md`.
6. Identificar posibles efectos secundarios o regresiones.
7. Proponer el enfoque antes de ejecutar si la modificación tiene impacto estructural.

*No comenzar modificando archivos arbitrariamente sin un mapa claro de impacto.*

---

## 2. Reglas de Modificación

### Regla 1 — No reconstruir innecesariamente
No reconstruyas una página, vista o componente completo cuando solo sea necesario modificar una sección o corregir un comportamiento puntual. Prioriza siempre cambios localizados y quirúrgicos.

### Regla 2 — Reutilización
Antes de crear componentes, funciones utilitarias, hooks o servicios nuevos, verifica en:
- `src/components/common/`
- `src/components/ui/`
- `src/lib/`
- `src/context/`

No dupliques lógica de formateo de moneda, cálculo de financiamiento o gestión de imágenes.

### Regla 3 — No romper funcionalidades existentes
Antes de alterar una función o componente, identifica qué vistas o módulos dependen de él. Mantén absoluta compatibilidad hacia atrás con los contratos de propiedades (`LotProperty`), clientes y citas.

### Regla 4 — No cambiar tecnologías sin autorización
Está prohibido reemplazar:
- Next.js / Vite
- Supabase
- Tailwind CSS
- TypeScript
- Esquema de estado (React Context)

sin autorización explícita del usuario.

### Regla 5 — Dependencias mínimas
No instales paquetes nuevos de `npm` si la tarea puede resolverse con el runtime nativo o dependencias ya instaladas en `package.json`. Si una librería externa es indispensable, justifica su necesidad y evalúa el peso en el bundle.

### Regla 6 — Estabilidad de Rutas y Navegación
No modifiques identificadores de hash ni URLs registradas en `src/data/navigation.ts` sin justificación expresa. La navegación pública y administrativa depende de estos slugs estables.

### Regla 7 — Integridad de Base de Datos y Tipos
No realices modificaciones destructivas sobre la tabla `properties` ni alteres campos requeridos en `DbPropertyRow` o `LotProperty`. Los cambios de esquema deben ser retrocompatibles con el fallback estático en `src/data/lots.ts`.

### Regla 8 — Seguridad Estricta
- Nunca expongas credenciales maestras, service role keys o tokens de servicio en el frontend.
- Utiliza variables de entorno con prefijo `NEXT_PUBLIC_` o `VITE_` únicamente para llaves anónimas autorizadas con RLS.
- No desactives controles de sesión ni flexibilices validaciones de entrada para acelerar pruebas.

### Regla 9 — Variables de Entorno
Todos los secretos y endpoints deben configurarse mediante variables de entorno en `.env.local` y documentarse en `.env.example`.

### Regla 10 — Consistencia UI / UX
- Mantén la identidad visual institucional de MGM (paleta verde esmeralda / dorado / tonos neutros, tipografía y transiciones suaves de `motion`).
- No sobrecargues vistas con exceso de tarjetas, animaciones pesadas o elementos que perjudiquen el rendimiento móvil (Core Web Vitals).

### Regla 11 — No parchear inconsistencias arquitectónicas
Cuando una nueva funcionalidad revele modelos duplicados, fuentes de verdad contradictorias, permisos insuficientes o inconsistencias entre frontend, base de datos y Storage, el agente o desarrollador **NO** deberá crear una nueva abstracción paralela ni implementar un parche temporal sin autorización.

**Protocolo obligatorio ante inconsistencias:**
1. **Detener** inmediatamente la implementación del cambio.
2. **Documentar** con precisión la inconsistencia encontrada (archivos, contratos, tablas o servicios en conflicto).
3. **Solicitar una decisión arquitectónica explícita** al propietario del proyecto antes de escribir o modificar código.

---

## 3. Reglas de Calidad y Código

- **Tipado estricto**: Mantener TypeScript sin tipos `any` injustificados.
- **Manejo de errores**: Proveer estados de carga (`loading`), estados vacíos (`empty`) y estados de error con recuperación visual.
- **Responsive first**: Asegurar que cada ajuste visual funcione en pantallas móviles (360px+), tablets y escritorio.
- **Separación de responsabilidades**: La lógica de negocio pesada debe residir en hooks o contextos, no mezclada en el markup de los componentes de presentación.

---

## 4. Reglas para Agentes de IA

Cuando recibas una nueva tarea en este proyecto:
1. **Comprende**: Lee la solicitud y delimita el objetivo.
2. **Inspecciona**: Revisa únicamente los archivos directamente involucrados.
3. **Consulta**: Revisa `docs/PROJECT_CONTEXT.md` y este archivo `docs/DEVELOPMENT_RULES.md`.
4. **Evalúa Inconsistencias**: Si detectas modelos duplicados, fuentes de verdad en conflicto o discrepancias de permisos/storage, **frena de inmediato**: no crees abstracciones paralelas ni parches temporales; documenta el conflicto y solicita la decisión arquitectónica.
5. **Delimita**: Determina con precisión quirúrgica qué líneas deben cambiar una vez despejada la arquitectura.
6. **Implementa**: Modifica exclusivamente lo necesario sin formatear archivos completos ni alterar código ajeno.
7. **Verifica**: Comprueba que la compilación y los flujos colindantes permanezcan intactos.
8. **Documenta**: Si el cambio altera rutas, modelos, dependencias o el estado de funcionalidades, actualiza la sección correspondiente y la `Última actualización` en `docs/PROJECT_CONTEXT.md`.

---

## 5. Control de Cambios

- **Fecha**: 2026-10-07
- **Cambios**:
  - Creación de las reglas de desarrollo oficiales para el proyecto Sociedad Civil MGM Inmobiliaria.
  - Incorporación de la **Regla 11 — No parchear inconsistencias arquitectónicas**: detención obligatoria ante modelos duplicados o fuentes de verdad contradictorias y solicitud de decisión arquitectónica previa.
