---
name: "web-inmersiva"
description: "Construir sitios web inmersivos (landing pages, portfolios, lanzamientos, relatos con scroll) con animaciones on-scroll y 3D usando React Three Fiber, GSAP y Lenis: guion, dirección de arte, rendimiento, accesibilidad y verificación. Usar cuando el pedido habla de scrollytelling, sitio inmersivo, 3D en la web, three.js, R3F, WebGL, ScrollTrigger, Lenis, parallax, cámara que se mueve con el scroll o un hero con un objeto 3D. No usar para dashboards, paneles de admin ni pantallas de app."
---

# Web inmersiva

Esta skill sirve para construir sitios donde el scroll y el movimiento cuentan algo: landing pages, lanzamientos de producto, portfolios, relatos con scroll (scrollytelling) y explicaciones interactivas. Define un solo stack, una sola arquitectura y un solo criterio de movimiento, para que nada se contradiga.

**Precedencia (de mayor a menor):**
1. Lo que pida el usuario en ese momento.
2. Las reglas del proyecto (`AGENTS.md`, `DESIGN.md`) y una skill específica del proyecto, si existe.
3. Las decisiones que ya tenga el repositorio (framework, estilos, librerías).
4. Esta skill.

Si otra skill genérica dice algo distinto, gana esta en 3D, scroll y motion narrativo. En la interfaz (botones, menús, formularios), si `emil-design-eng` está instalada, manda ella; la tabla B de la sección 9 es el resumen para cuando no está.

**Prioridades** (si dos chocan, gana la de más arriba):
1. Contenido verdadero
2. Legibilidad y accesibilidad
3. Rendimiento en dispositivos reales
4. Inmersión
5. Pulido visual

## Archivos de la skill

| Archivo | Cuándo se lee |
|---|---|
| `templates/src/` | Al armar la base del proyecto (fase 3 del flujo): código real, probado, que se copia y se adapta |
| `references/codigo.md` | Junto con los templates: mapa de archivos, qué usa cada nivel, SSR, modo presentación |
| `references/escenas.md` | Al construir escenas: patrones, shaders, modelos externos, Draco local, luz |
| `references/errores.md` | Antes de escribir código 3D o de scroll, y cuando algo no se ve o se siente raro |
| `references/verificacion.md` | Antes de decir "listo" y al publicar |

## 1. Brief (antes de cualquier código)

Se averigua esto, y si falta algo se pregunta todo junto en una sola tanda:

- **Tema y rubro:** qué es el producto, la historia o la persona. De su mundo (materiales, vocabulario, objetos) salen las decisiones visuales.
- **Audiencia y trabajo principal:** quién llega y qué tiene que entender o sentir después de una pasada.
- **Una sola acción principal (CTA):** registrarse, contactar, comprar, leer el paper. Puede haber una secundaria, más callada.
- **Fuente del contenido:** textos, datos, imágenes y marca reales. **Nunca se inventan métricas, testimonios, logos de clientes ni citas.** Si falta algo, se deja `TODO(contenido)` y se pregunta.
- **Dónde se va a ver:** celular o escritorio, conexión, proyector, SEO importante o no.
- **Proyecto existente o nuevo.**

## 2. Elegir la intensidad (el 3D se justifica, no se agrega por defecto)

| Nivel | Qué es | Cuándo | Arquitectura |
|---|---|---|---|
| **1. HTML + movimiento** | Tipografía cinética, revelados, SVG, gráficos y parallax en el DOM. Sin WebGL | La historia es de datos, texto o marca. Hay que priorizar velocidad y SEO. Es el default de una landing "de contenido" | GSAP + ScrollTrigger + Lenis sobre el DOM |
| **2. 3D acotado** | Un objeto o escena en el hero o en 1 o 2 secciones (un producto, un logo en volumen, un diagrama) | Hay un objeto central que gana con la profundidad. Es el default de una landing de producto | Canvas **contenido** dentro de su sección (`InlineStage`): solo se monta cuando está cerca y se pausa fuera de pantalla |
| **3. Mundo de scroll** | Un mundo 3D continuo detrás de todo el sitio: el scroll mueve la cámara y los estados | La metáfora es espacial (un lugar, un sistema, un recorrido) y el sitio es un relato | Canvas **fijo** + director de scroll + `rig` (sección 7) |

**Reglas:**
- Se elige un nivel principal y no se mezclan modos sin una razón.
- Si la historia es de números, conviene el nivel 1. Si el objeto es el producto, el 2. Si la metáfora es un lugar o un sistema, el 3.
- **El 3D nunca es el LCP:** el título y la CTA del hero son HTML y aparecen sin esperar a three.js.
- Si el usuario pide "algo inmersivo" sin más detalle, se propone el nivel con su motivo en una línea y se arranca.

## 3. Stack (cerrado por defecto)

| Tema | Decisión | Nota |
|---|---|---|
| Build | Vite + React 19 + TypeScript (SPA estática) | Si el proyecto ya usa Next.js o Astro, se respeta (ver SSR más abajo) |
| 3D | three `0.187` · @react-three/fiber `9.8` · @react-three/drei `10.7` | R3F 9.8 exige React `>=19 <19.4` |
| Postprocesado | @react-three/postprocessing `3.2` + postprocessing `6.39` | Solo en el tier alto |
| Animación | gsap `3.15` + @gsap/react `2.1` (ScrollTrigger, SplitText, CustomEase) | Todos los plugins de GSAP son gratis. No hace falta token ni registro privado |
| Smooth scroll | lenis `1.3`, movido por el ticker de GSAP | Touch nativo (`syncTouch: false`) |
| Suavizado 3D | maath `0.10` (`easing.damp3`) | |
| Estado | zustand `5` para lo discreto, un objeto mutable `rig` para lo continuo | |
| Estilos | CSS propio con tokens en variables CSS | Si el repositorio ya usa Tailwind, se usa Tailwind con los mismos tokens en `@theme` |
| Fuentes | autoalojadas (`@fontsource-variable/*`) | |
| Renderer | WebGL | Sin WebGPU (hay piezas de drei/postprocessing incompatibles) |

Versiones verificadas en noviembre de 2026. Al empezar se confirman con `npm view <paquete> version`. Si un mayor cambió, se lee el changelog antes de subir de versión.

**No se usa:**
- **Motion/Framer Motion:** GSAP cubre scroll y timelines, y CSS cubre la interfaz.
- **GSAP ScrollSmoother:** usamos Lenis, y nunca los dos juntos.
- **`<ScrollControls>` de drei:** el scroll es el del documento.
- **Assets desde CDN**, incluidos el decodificador de Draco, los HDRI de `preset` y las fuentes de `<Text>`.

Si el repositorio ya trae una de estas librerías, no se agrega otra en paralelo: se pregunta.

**SSR (Next.js / Astro):**
- Todo lo que toca `window`, `document`, `location` o `matchMedia` vive en módulos que solo se cargan en el cliente.
- **Next:** `dynamic(() => import("./three/Experience"), { ssr: false })` dentro de un componente `"use client"`.
- **Astro:** `client:only="react"`.
- El estado inicial que depende del navegador (WebGL, parámetros de la URL, reduced motion) se calcula en un `useEffect`, no al importar el módulo.

## 4. Flujo de trabajo (con un checkpoint con el usuario en cada fase)

1. **Brief y nivel** (secciones 1 y 2).
2. **Contrato:** el mapa de secciones (sección 5) y la biblia de estilo (sección 6). Se hacen **3 estudios de dirección** materialmente distintos y el usuario elige uno. Hasta entonces no se escribe código de escenas.
3. **Base del proyecto:** stack, estructura de carpetas y tokens. Se copian los archivos de `templates/src/` que use el nivel (ver `references/codigo.md`).
4. **Esqueleto HTML:** todas las secciones con su contenido real. El sitio tiene que leerse y funcionar completo **sin 3D y sin animación**, incluida la CTA.
5. **Director de scroll y escena gris:** cajas grises para validar tiempos, encuadres y reversibilidad.
6. **Escenas definitivas y pase de arte** (`references/escenas.md`).
7. **Efectos, tiers y respaldos.**
8. **Verificación y entrega** (`references/verificacion.md`).

Cada sección se termina de punta a punta antes de pulir la siguiente.

## 5. Guion: mapa de secciones

Se reduce el contenido a entre 5 y 8 momentos. Las landing pages y los relatos siguen el mismo esqueleto:

1. **Gancho:** la promesa o la tesis sorprendente.
2. **Problema:** la fricción o la creencia que se rechaza.
3. **Idea:** lo que cambia el camino.
4. **Mecanismo:** cómo funciona.
5. **Prueba:** la evidencia más fuerte (real y con fuente).
6. **Resultado:** el estado final transformado.
7. **Acción:** la CTA principal.

**Tabla de secciones (antes del código):**

| Campo | Regla |
|---|---|
| `id` | slug corto y estable |
| escena | qué existe en el mundo visual en ese momento |
| título | 3 a 8 palabras |
| cuerpo | 1 a 3 oraciones cortas |
| evidencia | dato o asset exacto de la fuente (o `TODO(contenido)`) |
| movimiento | un verbo claro (desciende, orbita, se arma, se separa) |
| `weight` | de 0.8 a 2.5 viewports de scroll |
| CTA | solo en la última sección, salvo que el brief pida otra cosa (el hero puede llevar la misma CTA) |

**Una sección = una idea = un encuadre de cámara.** Si necesita dos movimientos, se parte en dos. Se fusionan los argumentos repetidos: no cada párrafo merece una escena.

## 6. Dirección de arte

**Proceso:**
1. **Del rubro a la metáfora:** se busca en el mundo del tema (materiales, herramientas, normas visuales del rubro, vocabulario). De ahí sale una **metáfora de mundo** que pueda contener todas las secciones: un lugar, una máquina, un archivo, un sistema.
2. **Biblia de estilo:**
   - Tres adjetivos de clima.
   - La metáfora.
   - La paleta, de 4 a 6 colores con nombre: un campo dominante, la tinta y un acento con significado.
   - Una voz display y una de lectura.
   - El lenguaje de materiales.
   - La gramática de movimiento dominante (avanza, orbita, desciende, travelling lateral, se arma).
   - El ritmo.
   - **Tres clichés del rubro que se evitan.**
3. **3 estudios:** cada uno cambia el campo de color, el material, la luz, la relación tipográfica y la composición. Cambiar solo el acento no cuenta. Se muestran como capturas o como un mini prototipo. Si está instalada `imagegen-frontend-web`, puede dar las referencias visuales de cada estudio.
4. **Revisión contra lo genérico:** si una decisión es la que tomarías para cualquier sitio parecido, se cambia.

**Marcas de sitio generado por IA (evitarlas salvo que el brief las pida):**
- Fondo crema con serif y acento terracota.
- Negro con un único acento verde ácido.
- Tarjetas idénticas con sombra gris y gradientes decorativos.
- Una etiqueta en MAYÚSCULAS sobre cada título y una palabra del título en otro color.
- `·` entre metadatos, una flecha `→` en cada botón y monoespaciada para etiquetas chicas.
- Numeración 01/02/03 donde el contenido no es una secuencia.
- En 3D: el planeta azul brillante en el espacio y las partículas flotando "porque sí".

**Reglas fijas:**
- **Color con significado:** el acento marca estados o lo importante, no decora.
- **Tipografía:**
  - Una o dos familias, claramente distintas.
  - Cuerpo de 16 px como mínimo, interlineado de 1.5 a 1.7 y líneas de menos de 75 caracteres.
  - `tabular-nums` en las cifras.
- **Texto sobre 3D:** nunca va directo sobre una escena con contraste variable. Va sobre un panel con contraste de 4.5:1. En celular, el panel va abajo y el objeto se encuadra arriba.
- **Audacia en un solo lugar:** un momento memorable y el resto sobrio. Antes de terminar una vista, se saca un adorno.

## 7. Arquitectura (nivel 3; el nivel 2 usa una parte)

```
Scroll del documento (nativo, suavizado por Lenis)
        │  lenis.on("scroll", ScrollTrigger.update)  ← gsap.ticker mueve lenis.raf (UN loop)
        ▼
ScrollTrigger + useStoryTimeline  ──escribe──▶  rig (objeto mutable: cam, fx)
        │                                            │ lee en useFrame
        ▼                                            ▼
setSection() → zustand (discreto)            CameraRig + escenas R3F (Canvas, aria-hidden)
        ▼                                            ▼
UI: nav, CTA, modos                          EffectComposer (renderiza el frame)
```

**Reglas de oro:**
1. **Hay un solo director:** solo `useStoryTimeline` escribe `rig`. Las escenas solo lo leen.
2. **Hay un solo loop de scroll:** el `gsap.ticker` mueve Lenis. R3F no maneja el scroll ni crea `requestAnimationFrame`.
3. **El suavizado se aplica una sola vez:** `scrub: true` en lo que mueve `rig`, y el amortiguado solo en `damp3`.
4. **La capa DOM nunca importa `three` ni `@react-three/*`:** si lo hace, three.js entero entra al bundle principal (se midió: de 125 a 365 KB gzip). El 3D va en `lazy()` y se comunica con el DOM a través de `rig` (por ejemplo `rig.requestFrame`).
5. **El contenido vive en `content/`**, sin texto hardcodeado en los componentes.
6. **El HTML es el contenido real:** el Canvas es `aria-hidden` y decorativo.
7. **`useFrame` va con prioridad 0:** nunca se llama a `gl.render` a mano, porque EffectComposer renderiza.
8. **Contextos WebGL:** como máximo un Canvas fijo, o dos contenidos visibles a la vez. Si hacen falta más "ventanas 3D", se usa `<View>` de drei con un solo Canvas.
9. **El 3D entra con un fundido:** `.stage` arranca con opacidad 0 y se muestra cuando se dibujó el primer frame con las escenas cargadas.

```
src/
  content/   site.ts (secciones) · sources.ts
  scroll/    smoothScroll.ts · useStoryTimeline.ts · rig.ts
  state/     store.ts
  three/     Experience.tsx · Effects.tsx · CameraRig.tsx · InlineStage.tsx · draco.ts · palette.ts · scenes/*.tsx · shaders/
  ui/        Section.tsx · Nav.tsx · Cta.tsx
  styles/    tokens.css · base.css · structure.css
public/      models/ (+ CREDITS.md) · posters/ · textures/ · draco/ · hdri/ · fonts/
```

El código de todo esto está en `templates/src/` y se explica en `references/codigo.md`.

## 8. Presupuestos

| Métrica | Tier alto | Tier bajo |
|---|---|---|
| JS inicial (gzip, sin el chunk 3D) | ≤ 150 KB | igual |
| Chunk 3D (gzip) | ≤ 350 KB | igual |
| Assets 3D | ≤ 8 MB en total (≤ 2 MB para la primera escena) | igual |
| Draw calls | ≤ 150 | ≤ 80 |
| Triángulos | ≤ 500 k | ≤ 200 k |
| Texturas | ≤ 2048 px (1024 en celular) | ≤ 1024 px |
| FPS | 60 en notebook, ≥ 30 en un celular medio | ≥ 30 |
| Postprocesado | Bloom + viñeta + tone mapping | ninguno |

## 9. Movimiento: dos registros que no se mezclan

**A. Narrativo, ligado al scroll** (cámara, `fx`, revelado de títulos)
- La cámara y los `fx` usan `scrub: true`, sin duración propia. Viajan con `power2.inOut` en la entrada y quedan quietos en la estadía.
- Los revelados de contenido van de 0.6 a 1.0 s, con `power3.out` o `power4.out`, stagger de 0.08 a 0.12 s entre líneas y `toggleActions: "play none none reverse"`. Es contenido explicativo, por eso puede durar más que la interfaz.
- Un solo momento orquestado por sección. No se aplica el mismo fade-up a todo, porque es la marca de sitio genérico.
- El movimiento ambiental es sutil. Nunca se secuestra la rueda ni se fuerza un snapping. El scroll es siempre reversible.
- En un mismo ScrollTrigger se usa `scrub` **o** `toggleActions`, nunca los dos (si están ambos, gana `scrub`).
- **Scroll horizontal falso:** el tween horizontal va con `ease: "none"` (si no, el scroll y la posición se desfasan). Lo que se dispara dentro usa `containerAnimation: ese tween` con `start: "left center"`. Con `containerAnimation` no hay pin ni snap, y se anima un hijo, nunca el trigger.

**Efectos de texto (además de SplitText, y como mucho uno por sitio: es el momento audaz o no va):**
- **Peso de una fuente variable:** `font-variation-settings: "wght" var(--wght, 400)` y se anima `"--wght"` con GSAP (con `scrub` si va ligado al scroll). Lo rasteriza la CPU, así que hay que limitarlo a 10–20 elementos activos a la vez, con stagger.
- **Texto sobre una curva SVG:** se anima `attr: { startOffset: "100%" }` del `<textPath>` con `scrub` y `ease: "none"`. El `<svg>` lleva `role="img"`, un `<title>` y `aria-label` con el texto completo.
- **Scramble o máquina de escribir:** `ScrambleTextPlugin` o `TextPlugin` (gratis, igual que todos los plugins), nunca un loop hecho a mano. El texto final real va en un `<span class="sr-only">` y el animado lleva `aria-hidden="true"`, para que el lector de pantalla no lea letras sueltas. Nada de `aria-live="assertive"` en un efecto decorativo.
- Con reduced motion, ninguno de estos efectos se ejecuta: el texto aparece en su estado final.

**B. Interfaz** (botones, nav, menús, formularios; criterio de Emil Kowalski)

| Regla | Valor |
|---|---|
| ¿Animar? | Una acción por teclado, o algo que se usa todo el tiempo, va **sin animación** |
| Easing de entrada/salida | `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` (en GSAP: `CustomEase.create("uiOut", "0.23,1,0.32,1")`) |
| Movimiento en pantalla | `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` |
| Prohibido | `ease-in` en la interfaz, `transition: all` y aparecer desde `scale(0)` (se arranca de `scale(0.95)` con opacidad 0) |
| Duraciones | presionar 100–160 ms · tooltips 125–200 ms · menús o paneles 150–250 ms · siempre < 300 ms |
| Presionar | `:active { transform: scale(0.97) }` con `transition: transform 160ms var(--ease-out)` |
| Hover | solo dentro de `@media (hover: hover) and (pointer: fine)` |
| Asimetría | la salida es más rápida que la entrada |
| Propiedades | `transform`, `opacity` y `clip-path`, nunca `width`, `height`, `top`, `left` ni `margin`. El `blur` animado va por debajo de 20 px. `will-change` solo en lo que se está animando, no "por las dudas" |
| Seguir el puntero | `gsap.quickTo` (un tween reutilizado), nunca un `gsap.to` por evento |
| Animaciones en handlers | Si un tween se crea en un click o en `pointermove`, la función va envuelta en `contextSafe` de `useGSAP`; si no, no se revierte al desmontar |
| Popovers | `transform-origin` desde el disparador (los modales quedan centrados) |

**Reduced motion = menos y más suave, no cero:**
- Lenis queda sin suavizado (`respectReducedMotion`).
- La cámara salta por sección, con el Canvas en `"demand"`.
- No se parte el texto.
- Se mantienen los fundidos cortos de opacidad (0.3 s, sin desplazamiento). Está implementado en la rama `reduce` de `ui/Section.tsx`.

## 10. Versiones del sitio y accesibilidad

| Versión | Cómo | Qué cambia |
|---|---|---|
| Normal | — | 3D según el tier |
| Sin 3D | botón o `?sin3d` | Sin Canvas, flujo normal y pósters con `alt` |
| Reduced motion | preferencia del sistema | Ver la sección 9 |
| Estática | sin WebGL, ahorro de datos o contexto WebGL perdido | `tier: "static"`: `App` no monta el Canvas y se ve igual que la versión sin 3D |
| Presentación (opcional) | `P` o `?presentacion` | `←` `→` por sección |

**Checklist:**
- [ ] `lang` correcto, un `h1` (el del hero), un `h2` por sección y la jerarquía sin saltos.
- [ ] Enlace para saltar al contenido, `:focus-visible` visible y orden de tabulación igual al visual.
- [ ] Canvas con `aria-hidden` y cada figura descrita en el HTML.
- [ ] Contraste de 4.5:1 en el texto y de 3:1 en el foco y los íconos. El color nunca es el único portador de significado.
- [ ] Gráficos: SVG con `<title>` y una tabla equivalente.
- [ ] 3D interactivo (si existe): cada objeto clickeable tiene un equivalente en HTML con foco de teclado. El `.stage` sigue con `pointer-events: none`, salvo en la zona interactiva.
- [ ] Áreas táctiles de 44×44 px y viewport sin bloquear el zoom.
- [ ] El sitio se entiende y la CTA funciona con todo el movimiento apagado.

## 11. Landing pages: lo que no se negocia

- **Hero:**
  - Título, subtítulo y CTA en HTML, visibles en el primer render. No dependen de una animación de entrada ni del 3D.
  - El 3D aparece detrás o al costado cuando carga, con un fundido, y nunca empuja el layout (espacio reservado con `aspect-ratio`).
- **Una CTA principal:** se repite en el hero y al final, con la misma etiqueta en todo el flujo ("Pedir demo" → "Demo pedida").
- **Prueba real:**
  - Logos, testimonios y métricas solo si el usuario los da.
  - Si no hay, la sección de prueba se arma con la demostración del producto, no con relleno.
- **Formularios:**
  - Label visible y `autocomplete`.
  - El error va debajo del campo, en el tono del producto y diciendo cómo arreglarlo.
  - El botón muestra el estado de carga.
  - El éxito se confirma en el lugar.
- **SEO y compartir:** `<title>`, meta description, Open Graph con una imagen (una captura del mejor encuadre), favicon y HTML semántico. Si el SEO es crítico, se usa SSR o un prerender (sección 3).
- **Core Web Vitals:** LCP < 2.5 s, CLS < 0.1 e INP < 200 ms, medidos en perfil móvil.

## 12. Rendimiento y tiers

- **`tier` inicial** (`initialTier()` en `state/store.ts`):
  - `"static"` si no hay WebGL2 o el usuario activó el ahorro de datos.
  - `"low"` si el equipo tiene 2 GB de memoria o menos, o 2 núcleos o menos.
  - `"high"` en el resto.
- **Durante la visita:** `PerformanceMonitor` baja a `"low"` (DPR 1, sin postprocesado) cuando el FPS cae, y sube de nuevo cuando se recupera (`flipflops={3}`). Si se pierde el contexto WebGL, se pasa a `"static"`.
- **`gl` se configura una sola vez:** el antialias es fijo (`true`) y no depende del tier. En el tier alto, el EffectComposer usa `multisampling={4}` solo con DPR 1.
- **Descarga del 3D:** el chunk 3D se pide solo cuando `initialized` es verdadero (lo pone `initUIFromBrowser`) y el tier no es estático ni hay `?sin3d`. El postprocesado va en `three/Effects.tsx`, otro chunk, solo en tier alto.
- **DPR:** como máximo 2.
- **En `useFrame`:**
  - No se crean objetos de three ni se hace `setState`.
  - Se usa `delta` y `state.clock.elapsedTime`, no `getElapsedTime()`.
- **Escenas inactivas:** si su `fx` está en 0, `visible = false`.
- **Recálculo de ScrollTrigger:**
  - `ScrollTrigger.refresh()` solo después de cambios de layout reales (fuentes con `document.fonts.ready`, imágenes sin dimensiones).
  - `ScrollTrigger.config({ ignoreMobileResize: true })`, para que la barra del navegador del celular no dispare refreshes.
  - Los triggers se crean en el orden de la página, de arriba abajo. Si se crean de forma asíncrona o desordenada, cada uno lleva `refreshPriority` (la primera sección, el número más bajo).
- **Una sola instancia de Lenis:** se crea en `App` y nunca por componente. Con un modal o un menú a pantalla completa abierto, `pauseScroll()`, y al cerrar, `resumeScroll()`.
- **Rutas (SPA con varias páginas):** al salir de una ruta se desmonta su Canvas y `useGSAP` revierte sus ScrollTriggers. Ni el Canvas ni el loop siguen corriendo en segundo plano.
- **Bundle:** si `index-*.js` supera los 150 KB gzip, algo de la capa DOM importa three (regla de oro 4).
- **Warning conocido:** `THREE.Clock: This module has been deprecated` sale de adentro de R3F 9.8 y se ignora.

Antes de escribir código 3D o de scroll, se repasa `references/errores.md`.

## 13. Verificación y entrega

Nada se da por terminado sin el recorrido de `references/verificacion.md`: build y presupuestos, scroll hacia adelante y hacia atrás en celular y escritorio, las versiones del sitio, Core Web Vitals en perfil móvil, integridad del contenido, accesibilidad y una segunda mirada.

## 14. Skills de referencia (consultar sin contradecir esta)

| Skill | Para qué consultarla |
|---|---|
| `emil-design-eng`, `review-animations` (emilkowalski/skills) | Micro-interacciones de la interfaz y revisión fina del motion |
| `a11y-debugging`, `debug-optimize-lcp` (ChromeDevTools/chrome-devtools-mcp) | Accesibilidad real y LCP medidos en el navegador |
| greensock/gsap-skills (oficial) | API exacta de ScrollTrigger, SplitText, CustomEase y `gsap.utils` |
| CloudAI-X/threejs-skills | Detalles de R3F 9, rendimiento de three y pipeline de assets |
| MengTo/Skills: `scroll-world-storytelling` | Mapa de secciones, biblia de estilo y verificación de scrollytelling |

Si una no está instalada, se consulta en su repo.
