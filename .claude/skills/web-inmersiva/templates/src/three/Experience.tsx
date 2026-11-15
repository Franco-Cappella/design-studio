// Chunk 3D: se carga con lazy() (en Next/Astro, solo en el cliente).
// App no lo monta si tier === "static", no3d o todavía no se inicializó (initialized).
import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { rig } from "../scroll/rig";
import { useUI } from "../state/store";
import { CameraRig } from "./CameraRig";
import { palette } from "./palette";

// Posprocesado en su propio chunk: solo en tier "high". En gama baja no se descarga ni se parsea.
const Effects = lazy(() => import("./Effects"));

// La capa DOM pide frames (reduced motion, "demand") sin importar R3F.
function FrameBridge() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    rig.requestFrame = () => invalidate();
    return () => { rig.requestFrame = () => {}; };
  }, [invalidate]);
  return null;
}

// Avisa una sola vez, cuando ya se dibujó el primer frame con las escenas cargadas.
function FirstFrame({ onReady }: { onReady: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    onReady();
  });
  return null;
}

export default function Experience() {
  const tier = useUI((s) => s.tier);
  const setTier = useUI((s) => s.setTier);
  const [ready, setReady] = useState(false);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches; // módulo solo de cliente

  return (
    <div className="stage" data-ready={ready} aria-hidden="true">
      <Canvas
        dpr={tier === "high" ? [1, 2] : 1}
        frameloop={reduce ? "demand" : "always"}
        camera={{ fov: 40, near: 0.1, far: 100 }}
        // `gl` se lee una sola vez, al crear el contexto: no depende del tier.
        // El antialias nativo cubre el tier bajo; en el alto, Effects usa multisampling solo con DPR 1.
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          // En celular el contexto WebGL se puede perder: se pasa a la versión estática.
          gl.domElement.addEventListener("webglcontextlost", (e) => { e.preventDefault(); setTier("static"); }, { once: true });
        }}
      >
        <color attach="background" args={[palette.field]} />
        <hemisphereLight args={["#ffffff", palette.shade, 1.2]} />
        <directionalLight position={[5, 10, 4]} intensity={1.6} />
        <PerformanceMonitor onDecline={() => setTier("low")} onIncline={() => setTier("high")}
          flipflops={3} onFallback={() => setTier("low")} />
        <Suspense fallback={null}>
          {/* escenas */}
          <FirstFrame onReady={() => setReady(true)} />
        </Suspense>
        <CameraRig />
        <FrameBridge />
        {tier === "high" && <Suspense fallback={null}><Effects /></Suspense>}
      </Canvas>
    </div>
  );
}
