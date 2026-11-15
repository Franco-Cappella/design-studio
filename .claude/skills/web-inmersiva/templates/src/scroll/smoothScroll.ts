import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
let lenis: Lenis | null = null;

// UN loop: gsap.ticker → lenis.raf; cada scroll de Lenis → ScrollTrigger.update.
// Lenis respeta prefers-reduced-motion por defecto (respectReducedMotion: true).
export function initSmoothScroll() {
  // En celular, la barra del navegador cambia el alto al aparecer y desaparecer.
  // Sin esto, cada cambio dispara un refresh y la cámara salta.
  ScrollTrigger.config({ ignoreMobileResize: true });

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

// Modales o menús a pantalla completa: frenar Lenis mientras están abiertos.
export const pauseScroll = () => lenis?.stop();
export const resumeScroll = () => lenis?.start();
