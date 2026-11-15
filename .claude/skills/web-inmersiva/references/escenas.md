# Escenas 3D

## Criterio

- **Primero lo procedural:** primitivas, `InstancedMesh` y `TubeGeometry` sobre `CatmullRomCurve3`. Pesa poco, no tiene problemas de licencia y comparte un mismo lenguaje.
- **Un solo lenguaje de materiales** (por ejemplo `meshStandardMaterial` mate). Solo brilla lo que significa algo: un color mayor a 1 con `toneMapped={false}` supera el umbral del Bloom (`luminanceThreshold = 1`). Ver `glow()` en `templates/src/three/scenes/FlowAlong.tsx`.

## Patrones

- Más de 20 objetos iguales van en `InstancedMesh` (o `<Instances>`).
- Para revelar rutas se usa `setDrawRange` o el `dashOffset` de `<Line>`.
- `<Text>` de drei es decorativo: el texto real está en el HTML. Se le pasa `font` con un archivo local de `public/fonts/`, para no depender de la fuente por defecto.
- Todo lo que se mueve lee `rig.fx` en `useFrame` y se muta por ref.
- `OrbitControls`, `AxesHelper`, `GridHelper` y `CameraHelper` son de desarrollo: no llegan a producción (en un sitio de scroll, la cámara la maneja `rig`).
- `<Html>` de drei solo para etiquetas pegadas a un punto del espacio. El contenido de lectura va en la capa DOM.
- Escena inactiva (su `fx` en 0): `visible = false`.

## Shaders propios

Primero se prueba con un material de three o de drei. Un shader propio se justifica cuando el efecto cuenta algo: disolver, revelar o deformar una superficie. Ejemplo completo: `templates/src/three/scenes/RevealPlane.tsx` y `templates/src/three/shaders/`.

- `shaderMaterial` y `extend` a nivel de módulo: se compila una vez.
- Uniforms por ref en `useFrame`, nunca por props ni `useState`.
- En el fragment se usa matemática (`step`, `mix`, `smoothstep`, `clamp`) en lugar de `if/else`. Cada lectura de textura que se reutiliza va en una variable, y se usan los mínimos `varying` necesarios.
- `ShaderMaterial` ya declara la precisión. `precision mediump float;` hace falta solo en un `RawShaderMaterial`.
- El estado visible depende de `uReveal` (es decir, de `rig.fx`), no de `uTime`. Así, con reduced motion y `"demand"`, cada sección igual muestra su estado final.
- R3F descarta solo lo que se declara en JSX. Lo que se crea con `new` (`WebGLRenderTarget`, texturas sueltas) se libera con `.dispose()` en el cleanup de un `useEffect`.

## Modelos externos

1. **Fuentes:** Sketchfab, Poly Pizza o Blender. Cada modelo se registra en `public/models/CREDITS.md` (autor, licencia, URL) y se atribuye si la licencia lo pide.
2. **Optimización:**
   ```bash
   npx @gltf-transform/cli inspect modelo.glb
   npx @gltf-transform/cli optimize modelo.glb modelo.opt.glb --compress draco --texture-compress webp --texture-size 1024
   npx gltfjsx modelo.opt.glb --types
   ```
3. **Carga:** `useModel` de `templates/src/three/draco.ts`, que es `useGLTF` con el decodificador de Draco **local** (`/draco/`). Sin esa ruta, drei lo baja de gstatic.com y el sitio deja de andar sin red. `preloadModel` solo para la sección actual y la siguiente.
4. **Rutas de import:** `three/addons/...`, nunca `three/examples/jsm/...`.
5. **Descarte:** lo cacheado por `useGLTF` no lo descarta R3F, así que se libera a mano (`useGLTF.clear`) si se deja de usar.

## Luz y sombras

- Sombras en tiempo real solo si hacen falta (`shadows="percentage"`, shadow map de 1024 o 2048, nunca más). Si no, luz horneada.
- Pocas luces en tiempo real: para la luz ambiente conviene un environment map.
- `<Environment>` de drei va con `files` locales (`public/hdri/`), nunca con `preset`, porque los presets se descargan de un CDN.
- `r3f-perf` va solo en desarrollo.
