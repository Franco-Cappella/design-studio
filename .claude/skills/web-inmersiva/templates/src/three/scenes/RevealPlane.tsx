// Shader propio: solo si el efecto es la idea de la sección.
import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame, type ThreeElement } from "@react-three/fiber";
import { useRef } from "react";
import { Color } from "three";
import { rig } from "../../scroll/rig";
import fragment from "../shaders/reveal.frag?raw"; // GLSL en archivos aparte (Vite: ?raw)
import vertex from "../shaders/reveal.vert?raw";

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
    m.uReveal = rig.fx.reveal;          // el estado visible depende de rig, no del tiempo
  });
  return (
    <mesh>
      <planeGeometry args={[4, 4, 64, 64]} />
      <revealMaterial ref={mat} transparent />
    </mesh>
  );
}
