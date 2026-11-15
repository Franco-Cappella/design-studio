// Capa DOM: NUNCA importa three ni @react-three/* (regla de oro 4).
import { lazy, Suspense, useEffect, useRef } from "react";
import "lenis/dist/lenis.css";
import { site } from "./content/site";
import { initSmoothScroll } from "./scroll/smoothScroll";
import { useStoryTimeline } from "./scroll/useStoryTimeline";
import { initUIFromBrowser, useUI } from "./state/store";
import { Section } from "./ui/Section";
import "./styles/structure.css";

const Experience = lazy(() => import("./three/Experience"));

export default function App() {
  const main = useRef<HTMLElement>(null);
  const tier = useUI((s) => s.tier);
  const no3d = useUI((s) => s.no3d);
  const initialized = useUI((s) => s.initialized);
  const toggleNo3d = useUI((s) => s.toggleNo3d);
  // Antes de initialized no se monta el 3D: lazy() pide el chunk recién cuando se renderiza Experience.
  // Sin WebGL, ahorro de datos, ?sin3d o contexto perdido → versión estática, y el chunk nunca se pide.
  const show3d = initialized && tier !== "static" && !no3d;

  useEffect(() => { initUIFromBrowser(); return initSmoothScroll(); }, []);
  useStoryTimeline(main);

  return (
    <>
      <a className="skip" href="#contenido">Saltar al contenido</a>
      {show3d && <Suspense fallback={null}><Experience /></Suspense>}
      <header>
        <button type="button" onClick={toggleNo3d} aria-pressed={no3d}>Ver sin 3D</button>
      </header>
      {/* Por defecto el layout es el de 3D. Pasa al layout sin 3D solo cuando ya se sabe que no hay 3D. */}
      <main id="contenido" ref={main} data-no3d={initialized && !show3d}>
        {site.sections.map((s, i) => <Section key={s.id} s={s} i={i} />)}
      </main>
    </>
  );
}
