import { create } from "zustand";

export type Tier = "high" | "low" | "static";

type UI = {
  section: number; tier: Tier; no3d: boolean; presenting: boolean;
  initialized: boolean; // false hasta que corre initUIFromBrowser: App no monta el 3D antes
  setSection: (i: number) => void; setTier: (t: Tier) => void;
  toggleNo3d: () => void; togglePresenting: () => void;
};

export const useUI = create<UI>((set) => ({
  section: 0, tier: "high", no3d: false, presenting: false, initialized: false,
  setSection: (section) => set({ section }),
  setTier: (tier) => set({ tier }),
  toggleNo3d: () => set((s) => ({ no3d: !s.no3d })),
  togglePresenting: () => set((s) => ({ presenting: !s.presenting })),
}));

type NavigatorHints = Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };

// Tier de arranque: sin WebGL o con ahorro de datos → "static"; equipo modesto → "low".
// PerformanceMonitor ajusta después según el FPS real.
export function initialTier(): Tier {
  let webgl = false;
  try { webgl = !!document.createElement("canvas").getContext("webgl2"); } catch { /* sin WebGL */ }
  if (!webgl) return "static";
  const nav = navigator as NavigatorHints;
  if (nav.connection?.saveData) return "static";
  const lowMemory = (nav.deviceMemory ?? 8) <= 2;
  const fewCores = (navigator.hardwareConcurrency ?? 8) <= 2;
  return lowMemory || fewCores ? "low" : "high";
}

// Llamar UNA vez en un useEffect de App (seguro con SSR).
// Hasta que corre, initialized es false y App no monta el 3D: así el chunk 3D no se pide
// con tier estático ni con ?sin3d (antes se pedía en el primer render, aunque después no se usara).
export function initUIFromBrowser() {
  const q = new URLSearchParams(location.search);
  useUI.setState({
    tier: initialTier(), no3d: q.has("sin3d"), presenting: q.has("presentacion"), initialized: true,
  });
}
