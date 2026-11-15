import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";
import { site } from "../content/site";
import { useUI } from "../state/store";
import { camOf, fxOf, rig } from "./rig";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// El director: el ÚNICO que escribe rig.
// Sección i>0 — ENTRADA ("top bottom"→"top top"): la cámara viaja de i-1 a i.
//               ESTADÍA ("top top"→"bottom bottom"): se animan los fx que cambian en i.
// fromTo con valores explícitos + immediateRender:false → reversible y sin depender del orden.
export function useStoryTimeline(scope: RefObject<HTMLElement | null>) {
  const setSection = useUI((s) => s.setSection);
  const no3d = useUI((s) => s.no3d);

  useGSAP(() => {
    const els = gsap.utils.toArray<HTMLElement>("[data-section]");
    els.forEach((el, i) => ScrollTrigger.create({
      trigger: el, start: "top center", end: "bottom center",
      onToggle: (self) => { if (self.isActive) setSection(i); },
    }));

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
      Object.assign(rig.fx, fxOf(0));

      if (reduce) {
        els.forEach((el, i) => ScrollTrigger.create({
          trigger: el, start: "top center", end: "bottom center",
          onToggle: (self) => {
            if (!self.isActive) return;
            Object.assign(rig.cam, cam(i)); Object.assign(rig.fx, fxOf(i)); rig.requestFrame();
          },
        }));
        return;
      }

      els.forEach((el, i) => {
        if (i === 0) return;
        gsap.fromTo(rig.cam, cam(i - 1), {
          ...cam(i), ease: "power2.inOut", immediateRender: false,
          scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: true },
        });
        const before = fxOf(i - 1), after = fxOf(i);
        const keys = (Object.keys(site.sections[i].fx) as (keyof typeof after)[]).filter((k) => before[k] !== after[k]);
        if (!keys.length) return;
        gsap.fromTo(rig.fx,
          Object.fromEntries(keys.map((k) => [k, before[k]])),
          {
            ...Object.fromEntries(keys.map((k) => [k, after[k]])), ease: "none", immediateRender: false,
            scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: true },
          });
      });
    });
  }, { scope, dependencies: [no3d], revertOnUpdate: true }); // la versión sin 3D cambia el layout
}
