// Nivel 2: 3D acotado a una sección. Se monta cuando está cerca y se pausa fuera de pantalla.
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function InlineStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      setVisible(e.isIntersecting);
      if (e.isIntersecting) setMounted(true);
    }, { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // CSS: aspect-ratio o alto fijo → sin CLS
    <div ref={ref} className="inline-stage" aria-hidden="true">
      {mounted && (
        // "never" SOLO para pausar fuera de pantalla; nunca como modo principal.
        <Canvas frameloop={visible ? "always" : "never"} dpr={[1, 2]} camera={{ fov: 35 }}>
          {children}
        </Canvas>
      )}
    </div>
  );
}
