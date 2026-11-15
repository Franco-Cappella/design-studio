import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef, type CSSProperties } from "react";
import type { Section as SectionData } from "../content/site";
import { useUI } from "../state/store";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export function Section({ s, i }: { s: SectionData; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const no3d = useUI((st) => st.no3d);
  const Heading = i === 0 ? "h1" : "h2"; // el hero lleva el único h1 de la página

  useGSAP(() => {
    const root = ref.current;
    if (!root) return;
    const title = root.querySelector("h1, h2");
    const reveals = root.querySelectorAll("[data-reveal]");

    const mm = gsap.matchMedia();
    mm.add({
      motion: "(prefers-reduced-motion: no-preference)",
      reduce: "(prefers-reduced-motion: reduce)",
    }, (ctx) => {
      const { reduce } = ctx.conditions as Record<string, boolean>;

      // Reduced motion = menos y más suave, no cero: un fundido corto, sin desplazamiento y sin partir el texto.
      if (reduce) {
        gsap.from([title, ...reveals], {
          autoAlpha: 0, duration: 0.3, ease: "none",
          scrollTrigger: { trigger: root, start: "top 60%", toggleActions: "play none none reverse" },
        });
        return;
      }

      if (title) SplitText.create(title, {
        type: "lines", mask: "lines", autoSplit: true,          // aria: "auto" por defecto
        onSplit: (self) => gsap.from(self.lines, {               // devolver el tween → se resincroniza al re-partir
          yPercent: 110, duration: 0.9, ease: "power4.out", stagger: 0.09,
          scrollTrigger: { trigger: root, start: "top 60%", toggleActions: "play none none reverse" },
        }),
      });
      gsap.from(reveals, {
        autoAlpha: 0, y: 24, duration: 0.8, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: root, start: "top 50%", toggleActions: "play none none reverse" },
      });
    });
  }, { scope: ref, dependencies: [no3d], revertOnUpdate: true });

  return (
    <section ref={ref} id={s.id} data-section={i} className="section"
      style={{ "--weight": s.weight } as CSSProperties} aria-labelledby={`${s.id}-title`}>
      <div className="section__sticky">
        <article className="panel">
          <Heading id={`${s.id}-title`}>{s.title}</Heading>
          {s.body.map((p, k) => <p key={k} data-reveal>{p}</p>)}
        </article>
        {no3d && (
          <figure>
            <img src={s.figure.poster} alt={s.figure.alt} width={1600} height={900} loading="lazy" />
          </figure>
        )}
      </div>
    </section>
  );
}
