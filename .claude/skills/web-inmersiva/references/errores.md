# Errores conocidos (no repetir)

| Error | Por qué falla | Correcto |
|---|---|---|
| `frameloop="never"` como modo principal, con `gl.render` en `useFrame` | `useFrame` no corre sin `advance()` y no se ve nada | `"always"`, o `"demand"` con `invalidate()`. `"never"` solo para pausar fuera de pantalla |
| Reduced motion con `"never"` | El canvas queda en blanco | `"demand"` y `rig.requestFrame()` |
| `useFrame(fn, 1)` | Apaga el render automático y la pantalla queda negra | Prioridad 0 |
| Un `requestAnimationFrame` propio para Lenis | Dos loops generan jitter | Solo `gsap.ticker` |
| Varios `gsap.to()` con scrub sobre las mismas propiedades | Se pisan al crearse | `fromTo` con `immediateRender: false` |
| `scrub: 1` más `damp3` más Lenis | Triple suavizado, se siente "de goma" | `scrub: true` y `damp3` |
| Importar R3F en la capa DOM | three entra al bundle principal | `rig.requestFrame` con `FrameBridge` |
| `new SplitText` con máscaras y `aria` a mano | Es la API vieja | `SplitText.create` con `mask`, `autoSplit` y `onSplit` |
| `text-wrap: balance` en un título animado | Interfiere con SplitText | No usarlo ahí |
| `xPercent` con píxeles en un scroll horizontal | Mezcla unidades | `x: () => -(track.scrollWidth - innerWidth)` con `invalidateOnRefresh` |
| Sin `cameraPortrait` | En celular el panel tapa el objeto | Una cámara para vertical en cada sección |
| `window`, `document` o `matchMedia` al importar en Next o Astro | Rompe en el servidor | Módulo solo de cliente y `initUIFromBrowser()` en un efecto |
| Hero que espera el 3D o una animación para mostrar el título | LCP malo y la CTA no aparece | Hero en HTML desde el primer render |
| Métricas, testimonios o logos inventados | Engañan al visitante | `TODO(contenido)` y preguntar |
| Lenis y ScrollSmoother juntos, o Motion "para una cosa" | Dos sistemas compitiendo | Solo Lenis + GSAP |
| `frameloop="never"` + `advance()` desde el loop de Lenis | Patrón de otras guías: duplica el loop y rompe el render de EffectComposer | `gsap.ticker` mueve Lenis y R3F renderiza solo |
| `scrollTrigger` en un tween hijo de un timeline | ScrollTrigger solo funciona en animaciones de nivel superior | Ponerlo en el timeline o en un tween suelto |
| `markers: true` en producción | Quedan marcas en pantalla | Solo en desarrollo |
| `shaderMaterial` creado dentro del componente | Recompila el shader en cada render | Definirlo y hacer `extend` a nivel de módulo |
| Uniforms por props o `useState` | Un re-render de React por frame | Mutar por ref en `useFrame` |
| `<Environment preset="...">` | Descarga el HDRI de un CDN | `files` con un HDRI local |
| `useGLTF(url)` sin ruta de Draco | drei baja el decodificador de gstatic.com: sin red, el modelo no carga | `useModel(url)` de `three/draco.ts`, con `public/draco/` |
| `gl={{ antialias: tier !== "high" }}` | `gl` se lee una sola vez al crear el contexto: el antialias queda fijo con el tier inicial | `antialias: true` fijo y `multisampling` en el EffectComposer (solo con DPR 1) |
| Sin `ScrollTrigger.config({ ignoreMobileResize: true })` | La barra del navegador del celular dispara refreshes y la cámara salta | Configurarlo en `initSmoothScroll` |
| Sin escuchar `webglcontextlost` | En celular el contexto se pierde y el canvas queda negro | Pasar a `tier: "static"` (ya está en `Experience.tsx`) |
| Todo el motion adentro de `(prefers-reduced-motion: no-preference)` | Con reduced motion no queda ni el fundido corto que pide la regla | Rama `reduce` con un `autoAlpha` corto, sin desplazamiento |
| El 3D aparece de golpe a mitad de la lectura | Salto visual cuando termina de cargar el chunk | `.stage` con opacidad 0 y fundido al primer frame (`FirstFrame`) |
| Montar el 3D en el primer render y decidir tier y `?sin3d` en `useEffect` | El chunk 3D se pide en el primer render aunque después el tier sea estático o venga `?sin3d`. La descarga no se deshace | `initialized` en el store: `App` monta `Experience` solo después de `initUIFromBrowser()` |
| Postprocesado importado de forma estática en `Experience.tsx` | La gama baja descarga y parsea unos 86 KB de posprocesado que no usa | `three/Effects.tsx` con `lazy()`, solo en tier "high" |
| Layout sin 3D mientras no se sabe el tier | Salto de layout al inicializar en visitantes con 3D | `data-no3d={initialized && !show3d}`: el default es el layout con 3D |
