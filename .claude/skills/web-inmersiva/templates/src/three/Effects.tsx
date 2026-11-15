// Posprocesado (chunk aparte, solo tier "high"). Va dentro de <Canvas>.
import { useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";

// Con DPR > 1 el multisampling cuesta mucho y casi no se nota: se usa solo en DPR 1.
export default function Effects() {
  const dpr = useThree((s) => s.viewport.dpr);
  return (
    <EffectComposer multisampling={dpr > 1 ? 0 : 4}>
      <Bloom mipmapBlur luminanceThreshold={1} intensity={0.8} />
      <Vignette darkness={0.4} offset={0.3} />
      <ToneMapping />
    </EffectComposer>
  );
}
