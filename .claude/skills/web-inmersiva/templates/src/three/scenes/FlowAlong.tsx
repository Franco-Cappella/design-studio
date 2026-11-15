// Partículas que recorren una ruta. `points` tiene que ser una constante de módulo.
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { CatmullRomCurve3, Color, InstancedMesh, Object3D, Vector3 } from "three";
import type { Vec3 } from "../../content/site";

// Un color mayor a 1 con toneMapped={false} supera el umbral del Bloom (luminanceThreshold = 1).
export const glow = (hex: string, k = 3) => new Color(hex).multiplyScalar(k);

export function FlowAlong({ points, count = 40, speed = 0.08, color, visibility }: {
  points: Vec3[]; count?: number; speed?: number; color: Color; visibility: () => number;
}) {
  const mesh = useRef<InstancedMesh>(null);
  const curve = useMemo(() => new CatmullRomCurve3(points.map((p) => new Vector3(...p))), [points]);
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
