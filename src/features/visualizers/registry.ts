import type { VisualizerDef } from "./types";

const parts = import.meta.glob<{ visualizers: VisualizerDef[] }>("./registry-*.ts", { eager: true });

export const VISUALIZERS: VisualizerDef[] = Object.values(parts).flatMap((p) => p.visualizers ?? []);
export const visualizerById = (id: string) => VISUALIZERS.find((v) => v.id === id);
