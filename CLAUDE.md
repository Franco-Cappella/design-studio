# design-studio — Reglas del hub

Este repositorio no tiene código de producto. Junta las skills de diseño y frontend en un solo lugar y define cómo combinarlas. El código con el que se trabaja vive en `repository/<proyecto>`.

## Dónde se trabaja

- Todo cambio de código va dentro de `repository/<proyecto>` (por ejemplo `repository/SmartLot`). Nunca se crea código de producto en la raíz del hub.
- Cada proyecto tiene su propio git. Los commits se hacen dentro de `repository/<proyecto>` y solo si el usuario los pide. El hub ignora el contenido de `repository/`.
- Antes de tocar un proyecto se leen, si existen: `AGENTS.md`, `CLAUDE.md`, `DESIGN.md`, `PRODUCT.md` y `docs/decisions/`. **Las reglas del proyecto ganan sobre las de cualquier skill**: stack, tokens, convenciones, idioma del copy y qué se pregunta antes.
- Si `repository/` está vacío o hay más de un proyecto y no queda claro cuál es, se pregunta.
- Cómo meter un proyecto: ver `README.md`.

## Orquestación

Para cualquier tarea de diseño o frontend se usa el agente `design-director` (`.claude/agents/design-director.md`), o se siguen las mismas reglas desde la sesión principal. También se puede llamar a una skill por su nombre (`/impeccable`, `/web-inmersiva`…); en ese caso se usa esa sola, sin más ruteo.

### Tabla de ruteo

| Tarea | Skills (en orden) |
|---|---|
| Spec de una feature nueva o ambigua | `spec-driven-development` |
| Landing, marketing, página pública, hero | `design-taste-frontend` → `frontend-design` → `impeccable` (audit) |
| Sitio inmersivo, 3D, scroll narrativo (R3F, GSAP, Lenis) | `web-inmersiva` (manda) + `frontend-lead` (reglas de motion/3D/perf) |
| Dashboard, admin, pantallas de app, formularios | `ui-ux-pro-max` → `impeccable` |
| Hace falta una referencia visual antes de codear | `imagegen-frontend-web` (o `imagegen-frontend-mobile`) → `image-to-code` |
| Identidad, logo, brand board | `brandkit` |
| Pulido, microinteracciones, animación de UI | `emil-design-eng` |
| Crítica, auditoría, "se ve genérico", accesibilidad | `impeccable` |
| Rendimiento React / Next | `vercel-react-best-practices` |
| Decisión de arquitectura o documentación | `documentation-and-adrs` |
| La sesión pierde calidad o cambia de tarea | `context-engineering` |

**Al cerrar cualquier tarea de UI:** una pasada de `impeccable` (audit) y, si es React, `vercel-react-best-practices`. Después, los tests y el lint que pida el proyecto.

### Skills opt-in (solo si se nombran)

`design-taste-frontend-v1`, `design-taste-frontend-v2-experimental`, `gpt-taste`, `stitch-design-taste`, `high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui`. No se eligen solas: el usuario las pide por nombre o elige ese estilo.

### Conflictos entre skills

1. Lo que pida el usuario en ese momento.
2. Las reglas del proyecto en `repository/<proyecto>` (`AGENTS.md`, `DESIGN.md`…).
3. La skill principal de la fila de la tabla (la primera que figura).
4. Las demás skills de la fila.

Si dos skills se contradicen y nada de lo anterior decide, se elige una, se dice cuál y por qué, y se sigue.

## Mantenimiento

- Las skills son copias. `web-inmersiva` viene del perfil de claude.ai. Las demás vienen de `SmartLot/.claude/skills`. Si se actualizan allá, se vuelven a copiar acá.
- Una skill nueva se agrega en `.claude/skills/` y en la tabla de ruteo de este archivo y de `design-director.md`.
