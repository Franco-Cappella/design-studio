import { site, type SceneFx } from "../content/site";

const ZERO: SceneFx = { reveal: 0, explode: 0, highlight: 0 };
const flat = (s: { position: number[]; target: number[] }) => ({
  px: s.position[0], py: s.position[1], pz: s.position[2],
  tx: s.target[0], ty: s.target[1], tz: s.target[2],
});

export const camOf = (i: number, portrait = false) =>
  flat(portrait ? site.sections[i].cameraPortrait : site.sections[i].camera);

export const fxOf = (i: number): SceneFx =>
  site.sections.slice(0, i + 1).reduce<SceneFx>((acc, s) => ({ ...acc, ...s.fx }), { ...ZERO });

// Estado CONTINUO: GSAP lo escribe, useFrame lo lee. Nunca pasa por React.
// La capa DOM habla con el 3D solo a través de este objeto (regla de oro 4).
export const rig = {
  cam: camOf(0),
  fx: fxOf(0),
  snap: false,
  requestFrame: () => {},
};
