# Código de referencia

El código vive en `templates/src/` como archivos reales. Se copia al proyecto y se adapta; no se reemplaza por otro patrón.

**Probado** con three 0.187 · R3F 9.8.2 · drei 10.7.9 · postprocessing 3.2.2 / 6.39.6 · gsap 3.15.1 · lenis 1.3.27 · zustand 5.1 · React 19.3: `tsc --strict` sin errores, `vite build` con el chunk DOM en 127 KB gzip y el chunk 3D en 277 KB gzip, y consola limpia en el navegador. La versión anterior del mismo código se probó además en celular, con reduced motion, StrictMode, la versión sin 3D y teclado.

## Mapa de archivos

| Archivo | Qué hace | Nivel |
|---|---|---|
| `content/site.ts` | Tipos `Section`, `Shot`, `SceneFx` y el contenido. `cameraPortrait` es obligatoria | 3 (el 2 usa una parte) |
| `scroll/rig.ts` | Estado continuo (`cam`, `fx`, `snap`, `requestFrame`). `camOf` y `fxOf` calculan el estado de cada sección | 2 y 3 |
| `scroll/smoothScroll.ts` | Lenis movido por `gsap.ticker`, `ignoreMobileResize`, `scrollToSection`, `pauseScroll` / `resumeScroll` | 1, 2 y 3 |
| `scroll/useStoryTimeline.ts` | El director: el único que escribe `rig`. Cámara en la entrada, `fx` en la estadía, saltos con reduced motion | 3 |
| `state/store.ts` | zustand para lo discreto. `initialTier()` mira WebGL2, ahorro de datos, memoria y núcleos | 2 y 3 |
| `three/Experience.tsx` | Canvas fijo, `PerformanceMonitor`, `FrameBridge`, fundido al primer frame, contexto perdido → `static`, efectos solo en el tier alto | 3 |
| `three/Effects.tsx` | Posprocesado (Bloom, viñeta, tone mapping) en su propio chunk, solo tier "high". Va dentro de `<Canvas>` | 3 |
| `three/CameraRig.tsx` | Lee `rig.cam` y amortigua con `damp3`. Con `rig.snap`, salta | 3 |
| `three/InlineStage.tsx` | Canvas contenido: se monta cerca y se pausa fuera de pantalla | 2 |
| `three/draco.ts` | `useModel` / `preloadModel` con el decodificador de Draco local | 2 y 3 |
| `three/scenes/FlowAlong.tsx` | Partículas instanciadas sobre una curva, con `glow()` para el Bloom | 2 y 3 |
| `three/scenes/RevealPlane.tsx` + `three/shaders/` | Shader propio manejado por `rig.fx.reveal` | 2 y 3 |
| `ui/Section.tsx` | Sección sticky, SplitText, fundido corto con reduced motion, póster en la versión sin 3D. La primera sección lleva el `h1` | 1, 2 y 3 |
| `App.tsx` | Capa DOM: `lazy(Experience)`, no la monta con `tier: "static"`, con `no3d` ni antes de `initialized` (así el chunk no se pide), enlace para saltar al contenido | 3 |
| `styles/structure.css` | `.stage` fijo con fundido, secciones por `--weight`, versión sin 3D, celular | 2 y 3 |

## Cómo se adapta

- **Nivel 1:** solo `smoothScroll.ts`, `Section.tsx` y el CSS. Sin `three/`, sin `rig`.
- **Nivel 2:** `InlineStage` en la sección que lo necesita. El progreso de esa sección se escribe en su propio `rig` con un ScrollTrigger (`scrub: true`) y la escena lo lee en `useFrame`: el mismo patrón que el nivel 3, en chico.
- **Nivel 3:** todo.
- **SceneFx:** las claves `reveal`, `explode` y `highlight` son de ejemplo. Cada sitio define las suyas.
- **Draco:** una vez por proyecto, `cp -r node_modules/three/examples/jsm/libs/draco public/draco`.
- **Shaders con `?raw`:** es de Vite. En Next se importan como string con un loader o se escriben en un `.ts`.
- **SSR (Next / Astro):** `Experience` va con `dynamic(..., { ssr: false })` o `client:only="react"`. `initUIFromBrowser()` ya corre dentro de un efecto.

## Navegación por teclado y modo presentación (opcional)

Sirve para mostrar el sitio en una charla o una demo:
- `P` activa o desactiva el modo presentación.
- `→` y `←` llaman a `scrollToSection(site.sections[section ± 1].id)`.
- `?presentacion` en la URL lo activa al cargar.

El salto entre secciones del modo presentación es narrativo (hasta 1.2 s).
