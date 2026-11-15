// Contenido del sitio: todo el texto vive acá, nunca en los componentes.
export type Vec3 = [number, number, number];
export type Shot = { position: Vec3; target: Vec3 };
export type SceneFx = { reveal: number; explode: number; highlight: number }; // claves propias de cada sitio, 0..1

export type Section = {
  id: string;
  title: string;
  body: string[];
  weight: number;            // alto en viewports = cuánto scroll dura (0.8 a 2.5)
  camera: Shot;
  cameraPortrait: Shot;      // OBLIGATORIO: en vertical, más lejos y con el objeto más arriba
  fx: Partial<SceneFx>;      // solo lo que CAMBIA en esta sección (estado final)
  figure: { poster: string; alt: string }; // respaldo sin 3D + descripción accesible
};

export const site: { title: string; sections: Section[] } = {
  title: "TODO(contenido)",
  sections: [
    {
      id: "gancho",
      title: "TODO(contenido)",
      body: ["TODO(contenido)"],
      weight: 1.2,
      camera: { position: [0, 1, 8], target: [0, 0, 0] },
      cameraPortrait: { position: [0, 1.6, 11], target: [0, 0.6, 0] },
      fx: {},
      figure: { poster: "/posters/gancho.webp", alt: "TODO(contenido)" },
    },
    {
      id: "mecanismo",
      title: "TODO(contenido)",
      body: ["TODO(contenido)"],
      weight: 1.8,
      camera: { position: [4, 2, 5], target: [0, 0, 0] },
      cameraPortrait: { position: [5, 3, 8], target: [0, 0.8, 0] },
      fx: { reveal: 1 },
      figure: { poster: "/posters/mecanismo.webp", alt: "TODO(contenido)" },
    },
  ],
};
