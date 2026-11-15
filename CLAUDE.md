# design-studio — Reglas del hub

Este repositorio no tiene código de producto. Junta las skills de diseño y frontend en un solo lugar y define cómo combinarlas. El código con el que se trabaja vive en `repository/<proyecto>`.

## Dónde se trabaja

- Todo cambio de código va dentro de `repository/<proyecto>` (por ejemplo `repository/SmartLot`). Nunca se crea código de producto en la raíz del hub.
- Cada proyecto tiene su propio git. Los commits se hacen dentro de `repository/<proyecto>` y solo si el usuario los pide. El hub ignora el contenido de `repository/`.
- Antes de tocar un proyecto se leen, si existen: `AGENTS.md`, `CLAUDE.md`, `DESIGN.md`, `PRODUCT.md` y `docs/decisions/`. **Las reglas del proyecto ganan sobre las de cualquier skill**: stack, tokens, convenciones, idioma del copy y qué se pregunta antes.
- Si el proyecto no tiene `PRODUCT.md`, se ofrece `/impeccable init` antes de una tarea de diseño grande (impeccable lo usa como contexto).
- Si `repository/` está vacío o hay más de un proyecto y no queda claro cuál es, se pregunta.
- Los scripts de las skills se corren desde la raíz del hub (sus rutas son relativas a ella), aunque se trabaje en `repository/<proyecto>`.
- Cómo meter un proyecto: ver `README.md`.

## Orquestación

Para cualquier tarea de diseño o frontend se usa el agente `design-director` (`.claude/agents/design-director.md`), o se siguen las mismas reglas desde la sesión principal. También se puede llamar a una skill por su nombre (`/impeccable`, `/web-inmersiva`…); en ese caso se usa esa sola, sin más ruteo.

### Tabla de ruteo

| Tarea | Skills (en orden) |
|---|---|
| Spec de una feature nueva o ambigua | `spec-driven-development` |
| Landing, marketing, página pública, hero | `design-taste-frontend` → `impeccable` (audit) |
| Sitio inmersivo, 3D, scroll narrativo (R3F, GSAP, Lenis) | `web-inmersiva` |
| Dashboard, admin, pantallas de app, formularios | `ui-ux-pro-max` → `impeccable` (audit) |
| Hace falta una referencia visual antes de codear | `imagegen-frontend-web` |
| Identidad, logo, brand board | `brandkit` |
| Pulido, microinteracciones, animación de UI | `emil-design-eng` |
| Revisión de animaciones existentes | `review-animations` |
| Crítica, auditoría, "se ve genérico", accesibilidad en código | `impeccable` |
| Accesibilidad real en el navegador (árbol a11y, foco, teclado, contraste) | `a11y-debugging` |
| Carga lenta, LCP, Core Web Vitals | `debug-optimize-lcp` → `vercel-react-best-practices` (si es React) |
| Rendimiento React / Next (código) | `vercel-react-best-practices` |
| Decisión de arquitectura o documentación | `documentation-and-adrs` |
| La sesión pierde calidad o cambia de tarea | `context-engineering` |

**Al cerrar cualquier tarea de UI:** una pasada de `impeccable` (audit) y, si es React, `vercel-react-best-practices`. Si el MCP `chrome-devtools` está conectado y hay dev server, una medición con `a11y-debugging` (y `debug-optimize-lcp` si se tocó el hero o la carga). Después, los tests y el lint que pida el proyecto.

### Dueños por responsabilidad

Cada responsabilidad tiene un solo dueño por tarea. Las demás skills pueden opinar, pero no reescriben lo que decidió el dueño.

| Responsabilidad | Dueño | Qué no se hace |
|---|---|---|
| Dirección de arte de páginas públicas | `design-taste-frontend` | En la fila de dashboards no se carga, aunque tenga `app-screens.md`. |
| Sistema visual de pantallas de app | `ui-ux-pro-max` (con su `search.py --design-system`) | No se usa para dirección de arte de landings. |
| 3D, scroll, motion narrativo | `web-inmersiva` | Ninguna otra skill cambia su stack, su arquitectura ni sus tiempos. |
| Micro-interacciones de componentes | `emil-design-eng` | `impeccable animate` no se usa dentro de filas ajenas. |
| Revisión de motion | `review-animations` | Revisa y marca: no escribe features. |
| Auditoría y pulido de código UI | `impeccable` | En filas ajenas solo `critique`, `audit`, `polish` y `harden`. `shape`, `craft`, `bolder`, `overdrive` y compañía solo cuando se la llama sola. |
| Medición en navegador (a11y, LCP) | `a11y-debugging`, `debug-optimize-lcp` | Miden y proponen; el arreglo respeta al dueño visual de la fila. |
| Rendimiento del código React | `vercel-react-best-practices` | No cambia decisiones visuales. |
| Imagen e identidad | `imagegen-frontend-web`, `brandkit` | Ver "Salida de las skills de imagen". |

**Orden de crítica en landings:** primero el inspector y el loop de `design-taste-frontend`, después los arreglos, y al final una sola pasada de `impeccable audit`. Se corrigen los P0 y P1; el resto se informa sin tocar.

**Salida de las skills de imagen:** Claude Code no genera imágenes por sí solo. `imagegen-frontend-web` y `brandkit` entregan los prompts listos (uno por sección o por lámina) en `repository/<proyecto>/docs/design/`. Si el conector de Canva está autorizado y el usuario lo pide, se generan con `generate-image`.

### Agentes de apoyo

`impeccable` delega en sus propios agentes (`impeccable-asset-producer`, `impeccable-documenter`, `impeccable-finish-reviewer`, `impeccable-manual-edit-applier`). Se usan solo cuando impeccable los pide; no entran en la tabla de ruteo.

### Conflictos entre skills

1. Lo que pida el usuario en ese momento.
2. Las reglas del proyecto en `repository/<proyecto>` (`AGENTS.md`, `DESIGN.md`…).
3. La tabla "Dueños por responsabilidad".
4. La skill principal de la fila de la tabla (la primera que figura).
5. Las demás skills de la fila.

Si dos skills se contradicen y nada de lo anterior decide, se elige una, se dice cuál y por qué, y se sigue.

## Mantenimiento

- Las skills son copias. `web-inmersiva` es propia (viene del perfil de claude.ai). El origen de las demás está en `skills-lock.json` (repo, ruta y commit). Para actualizarlas, ver "Actualizar skills" en `README.md`.
- Una skill nueva se agrega en `.claude/skills/`, en `skills-lock.json` y en la tabla de ruteo de este archivo y de `design-director.md`. Si se pisa con un dueño existente, se define en "Dueños por responsabilidad" antes de sumarla.
- El hook de impeccable vive en `.claude/settings.json` (versionado). `settings.local.json` queda para ajustes personales.
