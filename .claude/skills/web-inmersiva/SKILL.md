---
name: "web-inmersiva"
description: "Construir sitios web inmersivos (landing pages, portfolios, lanzamientos, relatos con scroll) con animaciones on-scroll y 3D usando React Three Fiber, GSAP y Lenis: guion, dirección de arte, rendimiento, accesibilidad y verificación."
---

# Web inmersiva

Esta skill sirve para construir sitios donde el scroll y el movimiento cuentan algo: landing pages, lanzamientos de producto, portfolios, relatos con scroll (scrollytelling) y explicaciones interactivas. Define un solo stack, una sola arquitectura y un solo criterio de movimiento, para que nada se contradiga.

**Precedencia (de mayor a menor):**
1. Lo que pida el usuario en ese momento.
2. Las reglas del proyecto (`AGENTS.md`, `DESIGN.md`) y una skill específica del proyecto, si existe.
3. Las decisiones que ya tenga el repositorio (framework, estilos, librerías).
4. Esta skill.

Si otra skill genérica dice algo distinto, gana esta.

**Prioridades** (si dos chocan, gana la de más arriba):
1. Contenido verdadero
2. Legibilidad y accesibilidad
3. Rendimiento en dispositivos reales
4. Inmersión
5. Pulido visual

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
| **2. 3D acotado** | Un objeto o escena en el hero o en 1 o 2 secciones (un producto, un logo en volumen, un diagrama) | Hay un objeto central que gana con la profundidad. Es el default de una landing de producto | Canvas **contenido** dentro de su sección. Solo se monta cuando está cerca y se pausa fuera de pantalla (sección 8.2) |
| **3. Mundo de scroll** | Un mundo 3D continuo detrás de todo el sitio: el scroll mueve la cámara y los estados | La metáfora es espacial (un lugar, un sistema, un recorrido) y el sitio es un relato | Canvas **fijo** + director de scroll + `rig` (secciones 7 y 8.1) |

**Reglas:**
- Se elige un nivel principal y no se mezclan modos sin una razón.
- Si la historia es de números, conviene el nivel 1. Si el objeto es el producto, el 2. Si la metáfora es un lugar o un sistema, el 3.
- **El 3D nunca es el LCP:** el título y la CTA del hero son HTML y aparecen sin esperar a three.js.
- Si el usuario pide "algo inmersivo" sin más detalle, se propone el nivel con su motivo en una línea y se arranca.

## 3. Stack (cerrado por defecto)

| Tema | Decisión | Nota |
|---|---|---|
| Build | Vite + React 19 + TypeScript (SPA estática) | Si el proyecto ya usa Next.js o Astro, se respeta (ver SSR más abajo) |
| 3D | three `0.186` · @react-three/fiber `9.8` · @react-three/drei `10.7` | R3F 9.8 exige React `>=19 <19.4` |
| Postprocesado | @react-three/postprocessing `3.2` + postprocessing `6.39` | Solo en el tier alto |
| Animación | gsap `3.15` + @gsap/react `2.1` (ScrollTrigger, SplitText, CustomEase) | Todos los plugins de GSAP son gratis. No hace falta token ni registro privado |
| Smooth scroll | lenis `1.3`, movido por el ticker de GSAP | Touch nativo (`syncTouch: false`) |
| Suavizado 3D | maath `0.10` (`easing.damp3`) | |
| Estado | zustand `5` para lo discreto, un objeto mutable `rig` para lo continuo | |
| Estilos | CSS propio con tokens en variables CSS | Si el repositorio ya usa Tailwind, se usa Tailwind con los mismos tokens en `@theme` |
| Fuentes | autoalojadas (`@fontsource-variable/*`) | |
| Renderer | WebGL | Sin WebGPU (hay piezas de drei/postprocessing incompatibles) |

**No se usa:**
- **Motion/Framer Motion:** GSAP cubre scroll y timelines, y CSS cubre la interfaz.
- **GSAP ScrollSmoother:** usamos Lenis, y nunca los dos juntos.
- **`<ScrollControls>` de drei:** el scroll es el del documento.
- **Assets desde CDN.**

Si el repositorio ya trae una de estas librerías, no se agrega otra en paralelo: se pregunta.

Verificar versiones con `npm view <paquete> version` al empezar. Si un mayor cambió, se lee el changelog antes de subir de versión.

**SSR (Next.js / Astro):**
- Todo lo que toca `window`, `document`, `location` o `matchMedia` vive en módulos que solo se cargan en el cliente.
- **Next:** `dynamic(() => import("./three/Experience"), { ssr: false })` dentro de un componente `"use client"`.
- **Astro:** `client:only="react"`.
- El estado inicial que depende del navegador (WebGL, parámetros de la URL, reduced motion) se calcula en un `useEffect`, no al importar el módulo.

## 4. Flujo de trabajo (con un checkpoint con el usuario en cada fase)

1. **Brief y nivel** (secciones 1 y 2).
2. **Contrato:** el mapa de secciones (sección 5) y la biblia de estilo (sección 6). Se hacen **3 estudios de dirección** materialmente distintos y el usuario elige uno. Hasta entonces no se escribe código de escenas.
3. **Base del proyecto:** stack, estructura de carpetas y tokens.
4. **Esqueleto HTML:** todas las secciones con su contenido real. El sitio tiene que leerse y funcionar completo **sin 3D y sin animación**, incluida la CTA.
5. **Director de scroll y escena gris:** cajas grises para validar tiempos, encuadres y reversibilidad.
6. **Escenas definitivas y pase de arte.**
7. **Efectos, tiers y respaldos.**
8. **Verificación** (sección 15) y **entrega** (sección 16).

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
3. **3 estudios:** cada uno cambia el campo de color, el material, la luz, la relación tipográfica y la composición. Cambiar solo el acento no cuenta. Se muestran como capturas o como un mini prototipo.
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

```
src/
  content/   site.ts (secciones) · sources.ts
  scroll/    smoothScroll.ts · useStoryTimeline.ts · rig.ts
  state/     store.ts
  three/     Experience.tsx · CameraRig.tsx · palette.ts · scenes/*.tsx
  ui/        Section.tsx · Nav.tsx · Cta.tsx
  styles/    tokens.css · base.css
public/      models/ (+ CREDITS.md) · posters/ · textures/
```

## 8. Código de referencia (probado con estas versiones)

Este código se probó en un proyecto real con este stack: typecheck, build, escritorio, celular, reduced motion, StrictMode, versión sin 3D y navegación por teclado. Se adapta, no se reemplaza por otro patrón.

### 8.1 Nivel 3: mundo de scroll

**`content/site.ts`**
```ts
export type Vec3 = [number, number, number];
export type Shot = { position: Vec3; target: Vec3 };
export type SceneFx = { reveal: number; explode: number; highlight: number }; // claves propias de cada sitio, 0..1

export type Section = {
  id: string;
  title: string;
  body: string[];
  weight: number;            // alto en viewports = cuánto scroll dura
  camera: Shot;
  cameraPortrait: Shot;      // OBLIGATORIO: en vertical, más lejos y con el objeto más arriba
  fx: Partial<SceneFx>;      // solo lo que CAMBIA en esta sección (estado final)
  figure: { poster: string; alt: string }; // respaldo sin 3D + descripción accesible
};
```

**`scroll/rig.ts`**
```ts
import { site, type SceneFx } from "../content/site";
const ZERO: SceneFx = { reveal: 0, explode: 0, highlight: 0 };
const flat = (s: { position: number[]; target: number[] }) =>
  ({ px: s.position[0], py: s.position[1], pz: s.position[2], tx: s.target[0], ty: s.target[1], tz: s.target[2] });

export const camOf = (i: number, portrait = false) =>
  flat(portrait ? site.sections[i].cameraPortrait : site.sections[i].camera);
export const fxOf = (i: number): SceneFx =>
  site.sections.slice(0, i + 1).reduce((acc, s) => ({ ...acc, ...s.fx }), { ...ZERO });

// Estado CONTINUO: GSAP lo escribe, useFrame lo lee. Nunca pasa por React.
export const rig = { cam: camOf(0), fx: fxOf(0), snap: false, requestFrame: () => {} };
```

**`state/store.ts`**
```ts
import { create } from "zustand";
export type Tier = "high" | "low" | "static";
export const useUI = create<{
  section: number; tier: Tier; no3d: boolean; presenting: boolean;
  setSection: (i: number) => void; setTier: (t: Tier) => void; toggleNo3d: () => void; togglePresenting: () => void;
}>((set) => ({
  section: 0, tier: "high", no3d: false, presenting: false,
  setSection: (section) => set({ section }),
  setTier: (tier) => set({ tier }),
  toggleNo3d: () => set((s) => ({ no3d: !s.no3d })),
  togglePresenting: () => set((s) => ({ presenting: !s.presenting })),
}));

// Llamar UNA vez en un useEffect de App (seguro con SSR):
export function initUIFromBrowser() {
  let webgl = false;
  try { webgl = !!document.createElement("canvas").getContext("webgl2"); } catch { /* sin WebGL */ }
  const q = new URLSearchParams(location.search);
  useUI.setState({ tier: webgl ? "high" : "static", no3d: q.has("sin3d"), presenting: q.has("presentacion") });
}
```

**`scroll/smoothScroll.ts`**
```ts
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
let lenis: Lenis | null = null;

// UN loop: gsap.ticker → lenis.raf; cada scroll de Lenis → ScrollTrigger.update.
// Lenis respeta prefers-reduced-motion por defecto (respectReducedMotion: true).
export function initSmoothScroll() {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true }); // autoRaf false por defecto; touch nativo
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => lenis?.raf(time * 1000); // ticker en segundos, Lenis en ms
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => { gsap.ticker.remove(tick); lenis?.destroy(); lenis = null; };
}
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.2 }); else el.scrollIntoView();
}
```
En `App`: `useEffect(() => { initUIFromBrowser(); return initSmoothScroll(); }, [])`, e importar `lenis/dist/lenis.css` una vez.

**`scroll/useStoryTimeline.ts` (el director)**
```ts
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";
import { site } from "../content/site";
import { useUI } from "../state/store";
import { camOf, fxOf, rig } from "./rig";
gsap.registerPlugin(useGSAP, ScrollTrigger);

// Sección i>0 — ENTRADA ("top bottom"→"top top"): la cámara viaja de i-1 a i.
//               ESTADÍA ("top top"→"bottom bottom"): se animan los fx que cambian en i.
// fromTo con valores explícitos + immediateRender:false → reversible y sin depender del orden.
export function useStoryTimeline(scope: RefObject<HTMLElement | null>) {
  const setSection = useUI((s) => s.setSection);
  const no3d = useUI((s) => s.no3d);

  useGSAP(() => {
    const els = gsap.utils.toArray<HTMLElement>("[data-section]");
    els.forEach((el, i) => ScrollTrigger.create({ trigger: el, start: "top center", end: "bottom center",
      onToggle: (self) => self.isActive && setSection(i) }));

    const mm = gsap.matchMedia();
    mm.add({
      motion: "(prefers-reduced-motion: no-preference)",
      reduce: "(prefers-reduced-motion: reduce)",
      portrait: "(orientation: portrait)",
    }, (ctx) => {
      const { reduce, portrait } = ctx.conditions as Record<string, boolean>;
      const cam = (i: number) => camOf(i, portrait);
      rig.snap = reduce;
      Object.assign(rig.cam, cam(0));

      if (reduce) {
        els.forEach((el, i) => ScrollTrigger.create({ trigger: el, start: "top center", end: "bottom center",
          onToggle: (self) => {
            if (!self.isActive) return;
            Object.assign(rig.cam, cam(i)); Object.assign(rig.fx, fxOf(i)); rig.requestFrame();
          } }));
        return;
      }
      els.forEach((el, i) => {
        if (i === 0) return;
        gsap.fromTo(rig.cam, cam(i - 1), { ...cam(i), ease: "power2.inOut", immediateRender: false,
          scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: true } });
        const before = fxOf(i - 1), after = fxOf(i);
        const keys = (Object.keys(site.sections[i].fx) as (keyof typeof after)[]).filter((k) => before[k] !== after[k]);
        if (!keys.length) return;
        gsap.fromTo(rig.fx, Object.fromEntries(keys.map((k) => [k, before[k]])),
          { ...Object.fromEntries(keys.map((k) => [k, after[k]])), ease: "none", immediateRender: false,
            scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: true } });
      });
    });
  }, { scope, dependencies: [no3d], revertOnUpdate: true }); // la versión sin 3D cambia el layout
}
```

**`three/CameraRig.tsx`**
```tsx
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useMemo } from "react";
import { Vector3 } from "three";
import { rig } from "../scroll/rig";

export function CameraRig() {
  const goal = useMemo(() => new Vector3(), []);
  const target = useMemo(() => new Vector3(), []);
  const look = useMemo(() => new Vector3(), []);
  useFrame((state, delta) => {
    const c = rig.cam;
    goal.set(c.px, c.py, c.pz); target.set(c.tx, c.ty, c.tz);
    if (rig.snap) { state.camera.position.copy(goal); look.copy(target); }
    else {
      goal.x += state.pointer.x * 0.3; goal.y += state.pointer.y * 0.2; // parallax sutil
      easing.damp3(state.camera.position, goal, 0.35, delta);
      easing.damp3(look, target, 0.35, delta);
    }
    state.camera.lookAt(look);
  });
  return null;
}
```

**`three/Experience.tsx` (con `lazy()`; en SSR, solo en el cliente)**
```tsx
import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { Suspense, useEffect } from "react";
import { rig } from "../scroll/rig";
import { useUI } from "../state/store";
import { CameraRig } from "./CameraRig";
import { palette } from "./palette";

function FrameBridge() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => { rig.requestFrame = () => invalidate(); return () => { rig.requestFrame = () => {}; }; }, [invalidate]);
  return null;
}

export default function Experience() {
  const tier = useUI((s) => s.tier);
  const setTier = useUI((s) => s.setTier);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches; // módulo solo de cliente
  return (
    <div className="stage" aria-hidden="true">
      <Canvas dpr={tier === "high" ? [1, 2] : 1} frameloop={reduce ? "demand" : "always"}
        camera={{ fov: 40, near: 0.1, far: 100 }} gl={{ antialias: tier !== "high", powerPreference: "high-performance" }}>
        <color attach="background" args={[palette.field]} />
        <hemisphereLight args={["#ffffff", palette.shade, 1.2]} />
        <directionalLight position={[5, 10, 4]} intensity={1.6} />
        <PerformanceMonitor onDecline={() => setTier("low")} onIncline={() => setTier("high")}
          flipflops={3} onFallback={() => setTier("low")} />
        <Suspense fallback={null}>{/* escenas */}</Suspense>
        <CameraRig />
        <FrameBridge />
        {tier === "high" && (
          <EffectComposer multisampling={0}>
            <Bloom mipmapBlur luminanceThreshold={1} intensity={0.8} />
            <Vignette darkness={0.4} offset={0.3} />
            <ToneMapping />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
```

**`ui/Section.tsx` (texto con SplitText)**
```tsx
useGSAP(() => {
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    SplitText.create(ref.current!.querySelector("h2")!, {
      type: "lines", mask: "lines", autoSplit: true,          // aria:"auto" por defecto
      onSplit: (self) => gsap.from(self.lines, {               // devolver el tween → se resincroniza al re-partir
        yPercent: 110, duration: 0.9, ease: "power4.out", stagger: 0.09,
        scrollTrigger: { trigger: ref.current, start: "top 60%", toggleActions: "play none none reverse" },
      }),
    });
    gsap.from(ref.current!.querySelectorAll("[data-reveal]"), {
      autoAlpha: 0, y: 24, duration: 0.8, ease: "power3.out", stagger: 0.08,
      scrollTrigger: { trigger: ref.current, start: "top 50%", toggleActions: "play none none reverse" },
    });
  });
}, { scope: ref, dependencies: [no3d], revertOnUpdate: true });
```
```tsx
<section ref={ref} id={s.id} data-section={i} className="section"
  style={{ "--weight": s.weight } as React.CSSProperties} aria-labelledby={`${s.id}-title`}>
  <div className="section__sticky">
    <article className="panel">
      <h2 id={`${s.id}-title`}>{s.title}</h2>
      {s.body.map((p, k) => <p key={k} data-reveal>{p}</p>)}
    </article>
    {no3d && <figure><img src={s.figure.poster} alt={s.figure.alt} width={1600} height={900} loading="lazy" /></figure>}
  </div>
</section>
```

**CSS estructural**
```css
.stage { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
main, header, nav { position: relative; z-index: 10; }
.section { height: calc(var(--weight) * 100svh); }
.section__sticky { position: sticky; top: 0; height: 100svh; display: grid; align-items: center; padding: 6vw; }
main[data-no3d="true"] .section { height: auto; }
main[data-no3d="true"] .section__sticky { position: static; height: auto; }
@media (max-width: 640px) { .section__sticky { align-items: end; padding: 1rem; } }
```

### 8.2 Nivel 2: 3D acotado en una sección

- La escena va en un módulo `lazy()`. El Canvas **se monta cuando la sección está cerca** y **se pausa cuando sale de pantalla**.
- El progreso del scroll de esa sección se escribe en su propio `rig` con un ScrollTrigger (`scrub: true`) y la escena lo lee en `useFrame`. Es el mismo patrón que el nivel 3, en chico.

```tsx
function InlineStage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      setVisible(e.isIntersecting);
      if (e.isIntersecting) setMounted(true);
    }, { rootMargin: "300px" });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="inline-stage" aria-hidden="true"> {/* CSS: aspect-ratio o alto fijo → sin CLS */}
      {mounted && (
        <Canvas frameloop={visible ? "always" : "never"} dpr={[1, 2]} camera={{ fov: 35 }}>
          {children}
        </Canvas>
      )}
    </div>
  );
}
```
`frameloop="never"` se usa **solo** para pausar un canvas que está fuera de pantalla. Como modo de render principal, nunca (sección 14).

### 8.3 Navegación por teclado y modo presentación (opcional)

Sirve para mostrar el sitio en una charla o una demo:
- `P` activa o desactiva el modo presentación.
- `→` y `←` llaman a `scrollToSection(site.sections[section ± 1].id)`.
- `?presentacion` en la URL lo activa al cargar.

## 9. Escenas 3D

- **Primero lo procedural:** primitivas, `InstancedMesh` y `TubeGeometry` sobre `CatmullRomCurve3`. Pesa poco, no tiene problemas de licencia y comparte un mismo lenguaje.
- **Un solo lenguaje de materiales** (por ejemplo `meshStandardMaterial` mate). Solo brilla lo que significa algo: un color mayor a 1 con `toneMapped={false}` supera el umbral del Bloom (`luminanceThreshold = 1`).
- **Patrones:**
  - Más de 20 objetos iguales van en `InstancedMesh` (o `<Instances>`).
  - Para revelar rutas se usa `setDrawRange` o el `dashOffset` de `<Line>`.
  - `<Text>` de drei es decorativo: el texto real está en el HTML.
  - Todo lo que se mueve lee `rig.fx` en `useFrame` y se muta por ref.
  - `OrbitControls`, `AxesHelper`, `GridHelper` y `CameraHelper` son de desarrollo: no llegan a producción (en un sitio de scroll, la cámara la maneja `rig`).
  - `<Html>` de drei solo para etiquetas pegadas a un punto del espacio. El contenido de lectura va en la capa DOM.

**Partículas sobre una ruta (patrón):**
```tsx
export const glow = (hex: string, k = 3) => new Color(hex).multiplyScalar(k);
export function FlowAlong({ points, count = 40, speed = 0.08, color, visibility }:
  { points: Vec3[]; count?: number; speed?: number; color: Color; visibility: () => number }) {
  const mesh = useRef<InstancedMesh>(null);
  const curve = useMemo(() => new CatmullRomCurve3(points.map((p) => new Vector3(...p))), [points]); // points = constante de módulo
  const dummy = useMemo(() => new Object3D(), []);
  useFrame((state) => {
    const m = mesh.current; if (!m) return;
    const v = visibility(); m.visible = v > 0.001; if (!m.visible) return;
    const t = state.clock.elapsedTime * speed;
    for (let i = 0; i < count; i++) {
      curve.getPointAt((i / count + t) % 1, dummy.position);
      dummy.scale.setScalar(v); dummy.updateMatrix(); m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[0.06, 8, 8]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </instancedMesh>
  );
}
```

**Shaders propios (solo si el efecto es la idea de la sección):**

Primero se prueba con un material de three o de drei. Un shader propio se justifica cuando el efecto cuenta algo: disolver, revelar o deformar una superficie.

```tsx
import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { useRef } from "react";
import { Color } from "three";
import { rig } from "../../scroll/rig";
import fragment from "./shaders/reveal.frag?raw"; // GLSL en archivos aparte (Vite: ?raw)
import vertex from "./shaders/reveal.vert?raw";

// A nivel de módulo: se compila una vez. Nunca dentro del componente.
const RevealMaterial = shaderMaterial({ uTime: 0, uReveal: 0, uColor: new Color("#ffffff") }, vertex, fragment);
extend({ RevealMaterial });
declare module "@react-three/fiber" {
  interface ThreeElements { revealMaterial: ThreeElement<typeof RevealMaterial> }
}

export function RevealPlane() {
  const mat = useRef<InstanceType<typeof RevealMaterial>>(null);
  useFrame((state) => {
    const m = mat.current; if (!m) return;
    m.uTime = state.clock.elapsedTime; // uniforms por ref, nunca por props ni useState
    m.uReveal = rig.fx.reveal;          // el estado narrativo viene de rig, como en el resto de las escenas
  });
  return (
    <mesh>
      <planeGeometry args={[4, 4, 64, 64]} />
      <revealMaterial ref={mat} transparent />
    </mesh>
  );
}
```
- En el fragment se usa matemática (`step`, `mix`, `smoothstep`, `clamp`) en lugar de `if/else`. Hay que guardar en una variable cada lectura de textura que se reutilice y usar los mínimos `varying` necesarios.
- `ShaderMaterial` ya declara la precisión. `precision mediump float;` hace falta solo en un `RawShaderMaterial`.
- El estado visible depende de `uReveal` (es decir, de `rig.fx`), no de `uTime`. Así, con reduced motion y `"demand"`, cada sección igual muestra su estado final.
- R3F descarta solo lo que se declara en JSX. Lo que se crea con `new` (`WebGLRenderTarget`, texturas sueltas) se libera con `.dispose()` en el cleanup de un `useEffect`.

**Modelos externos:**
1. **Fuentes:** Sketchfab, Poly Pizza o Blender. Cada modelo se registra en `public/models/CREDITS.md` (autor, licencia, URL) y se atribuye si la licencia lo pide.
2. **Optimización:**
   ```bash
   npx @gltf-transform/cli inspect modelo.glb
   npx @gltf-transform/cli optimize modelo.glb modelo.opt.glb --compress draco --texture-compress webp --texture-size 1024
   npx gltfjsx modelo.opt.glb --types
   ```
3. **Carga:** `useGLTF` (con Draco incluido, caché y suspense). `useGLTF.preload` solo para la sección actual y la siguiente.
4. **Rutas de import:** `three/addons/...`, nunca `three/examples/jsm/...`.
5. **Descarte:** lo cacheado por `useGLTF` no lo descarta R3F, así que se libera a mano si se deja de usar.

**Presupuestos:**

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

Sombras en tiempo real solo si hacen falta (`shadows="percentage"`, shadow map de 1024 o 2048, nunca más); si no, luz horneada. Pocas luces en tiempo real: para la luz ambiente conviene un environment map. `<Environment>` de drei va con `files` locales (`public/hdri/`), nunca con `preset`, porque los presets se descargan de un CDN. `r3f-perf` va solo en desarrollo.

## 10. Movimiento: dos registros que no se mezclan

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

El salto entre secciones del modo presentación es narrativo (hasta 1.2 s). La tabla B aplica al resto de la interfaz.

**Reduced motion = menos y más suave, no cero:**
- Lenis queda sin suavizado (`respectReducedMotion`).
- La cámara salta por sección, con el Canvas en `"demand"`.
- No se parte el texto.
- Se mantienen los fundidos cortos de opacidad.

## 11. Versiones del sitio y accesibilidad

| Versión | Cómo | Qué cambia |
|---|---|---|
| Normal | — | 3D según el tier |
| Sin 3D | botón o `?sin3d` | Sin Canvas, flujo normal y pósters con `alt` |
| Reduced motion | preferencia del sistema | Ver la sección 10 |
| Sin WebGL | detectado | `tier: "static"`, igual que la versión sin 3D |
| Presentación (opcional) | `P` o `?presentacion` | `←` `→` por sección |

**Checklist:**
- [ ] `lang` correcto, un `h1`, un `h2` por sección y la jerarquía sin saltos.
- [ ] Enlace para saltar al contenido, `:focus-visible` visible y orden de tabulación igual al visual.
- [ ] Canvas con `aria-hidden` y cada figura descrita en el HTML.
- [ ] Contraste de 4.5:1 en el texto y de 3:1 en el foco y los íconos. El color nunca es el único portador de significado.
- [ ] Gráficos: SVG con `<title>` y una tabla equivalente.
- [ ] 3D interactivo (si existe): cada objeto clickeable tiene un equivalente en HTML con foco de teclado. El `.stage` sigue con `pointer-events: none`, salvo en la zona interactiva.
- [ ] Áreas táctiles de 44×44 px y viewport sin bloquear el zoom.
- [ ] El sitio se entiende y la CTA funciona con todo el movimiento apagado.

## 12. Landing pages: lo que no se negocia

- **Hero:**
  - Título, subtítulo y CTA en HTML, visibles en el primer render. No dependen de una animación de entrada ni del 3D.
  - El 3D aparece detrás o al costado cuando carga, y nunca empuja el layout (espacio reservado con `aspect-ratio`).
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
- **Core Web Vitals:** LCP < 2.5 s, CLS < 0.1 e INP < 200 ms, medidos con Lighthouse en perfil móvil.

## 13. Rendimiento y tiers

- **`tier`:**
  - `"high"` si hay WebGL2, `"static"` si no.
  - `PerformanceMonitor` baja a `"low"` (DPR 1, sin postprocesado) cuando el FPS cae, y sube de nuevo cuando se recupera (`flipflops={3}`).
- **DPR:** como máximo 2.
- **En `useFrame`:**
  - No se crean objetos de three ni se hace `setState`.
  - Se usa `delta` y `state.clock.elapsedTime`, no `getElapsedTime()`.
- **Escenas inactivas:** si su `fx` está en 0, `visible = false`.
- **Recálculo de ScrollTrigger:** `ScrollTrigger.refresh()` solo después de cambios de layout reales (fuentes con `document.fonts.ready`, imágenes sin dimensiones). Los triggers se crean en el orden de la página, de arriba abajo. Si se crean de forma asíncrona o desordenada, cada uno lleva `refreshPriority` (la primera sección, el número más bajo).
- **Una sola instancia de Lenis:** se crea en `App` y nunca por componente. Con un modal o un menú a pantalla completa abierto, `lenis.stop()`, y al cerrar, `lenis.start()`.
- **Rutas (SPA con varias páginas):** al salir de una ruta se desmonta su Canvas y `useGSAP` revierte sus ScrollTriggers. Ni el Canvas ni el loop siguen corriendo en segundo plano.
- **Bundle:** si `index-*.js` supera los 150 KB gzip, algo de la capa DOM importa three (regla de oro 4).
- **Warning conocido:** `THREE.Clock: This module has been deprecated` sale de adentro de R3F 9.8 y se ignora.

## 14. Errores conocidos (no repetir)

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
| `frameloop="never"` + `advance()` desde el loop de Lenis | Patrón de otras guías: duplica el loop y rompe el render de EffectComposer | `gsap.ticker` mueve Lenis y R3F renderiza solo (sección 7) |
| `scrollTrigger` en un tween hijo de un timeline | ScrollTrigger solo funciona en animaciones de nivel superior | Ponerlo en el timeline o en un tween suelto |
| `markers: true` en producción | Quedan marcas en pantalla | Solo en desarrollo |
| `shaderMaterial` creado dentro del componente | Recompila el shader en cada render | Definirlo y hacer `extend` a nivel de módulo |
| Uniforms por props o `useState` | Un re-render de React por frame | Mutar por ref en `useFrame` |
| `<Environment preset="...">` | Descarga el HDRI de un CDN | `files` con un HDRI local |

## 15. Verificación (antes de decir "listo")

1. `npm run build`: sin errores de tipos y con los chunks dentro del presupuesto.
2. Preview y Playwright:
   - Viewports de 390×844 (táctil), 768, 1440×900 y reduced motion.
   - Scroll hacia adelante, **hacia atrás** y con un tirón rápido: cada sección restaura su estado.
   - Consola limpia (solo el warning conocido).
   - Chromium headless con WebGL: `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`.
   - Para Lenis se usa `page.mouse.wheel`; en táctil, `scrollTo` nativo.
   - Se revisan las capturas a ojo: encuadre, contraste y que el panel no tape el objeto.
3. Versiones: sin 3D, sin WebGL, reduced motion y presentación (si existe).
4. Lighthouse en móvil: Core Web Vitals dentro de los objetivos (sección 12).
5. Integridad: cada dato coincide con la fuente que dio el usuario y la CTA funciona.
6. Accesibilidad: recorrido con teclado, contraste y lector de pantalla en al menos una sección.
7. Una segunda pasada con otra mirada (otro agente u otro día), contra las secciones 11 y 12.

## 16. Entrega

- [ ] Build estático. `base` en `vite.config.ts` según dónde se publique (`"./"` para servirlo desde una carpeta cualquiera).
- [ ] Hosting estático (Vercel, Netlify, GitHub Pages, Cloudflare Pages) o el que ya use el proyecto. `file://` no sirve para módulos ES.
- [ ] Todo autoalojado (fuentes, modelos, pósters). Se prueba una vez con la red apagada si se va a mostrar en vivo.
- [ ] Meta, Open Graph, favicon y página 404 si el hosting lo necesita.
- [ ] Si se va a presentar en vivo: un ensayo en la máquina y la pantalla reales, la versión sin 3D como respaldo y un video del recorrido.

## 17. Skills de referencia (consultar sin contradecir esta)

En el hub `design-studio` está instalada `review-animations`, para revisar el motion al cerrar. Las demás no están instaladas: si hace falta, se consultan en su repo.

| Skill | Para qué consultarla |
|---|---|
| greensock/gsap-skills (oficial) | API exacta de ScrollTrigger, SplitText, CustomEase y `gsap.utils` |
| CloudAI-X/threejs-skills | Detalles de R3F 9, rendimiento de three y pipeline de assets |
| frontend-design (Anthropic) | Proceso de dirección de arte y cómo evitar el diseño genérico |
| MengTo/Skills: `scroll-world-storytelling` | Mapa de secciones, biblia de estilo y verificación de scrollytelling |
| emilkowalski/skills: `emil-design-eng`, `review-animations` | Revisión fina de las micro-interacciones (tabla B de la sección 10) |