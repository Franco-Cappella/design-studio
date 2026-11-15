import { useGLTF } from "@react-three/drei";

// drei baja el decodificador de Draco de gstatic.com si no se le pasa una ruta.
// Se copia una vez: cp -r node_modules/three/examples/jsm/libs/draco public/draco
export const DRACO_PATH = "/draco/";

export const useModel = (url: string) => useGLTF(url, DRACO_PATH);
export const preloadModel = (url: string) => useGLTF.preload(url, DRACO_PATH);
