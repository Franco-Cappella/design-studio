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
  const toggleNo3d = useUI((s) => s.toggleNo3d);
  const show3d = tier !== "static" && !no3d; // sin WebGL, ahorro de datos o contexto perdido → versión estática

  useEffect(() => { initUIFromBrowser(); return initSmoothScroll(); }, []);
  useStoryTimeline(main);

  return (
    <>
      <a className="skip" href="#contenido">Saltar al contenido</a>
      {show3d && <Suspense fallback={null}><Experience /></Suspense>}
      <header>
        <button type="button" onClick={toggleNo3d} aria-pressed={no3d}>Ver sin 3D</button>
      </header>
      <main id="contenido" ref={main} data-no3d={!show3d}>
        {site.sections.map((s, i) => <Section key={s.id} s={s} i={i} />)}
      </main>
    </>
  );
}
