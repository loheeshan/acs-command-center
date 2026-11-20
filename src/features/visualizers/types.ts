import type { ComponentType, LazyExoticComponent } from "react";
import type { TopicId } from "@/content/types";

export interface VisualizerDef {
  /** Must match ids referenced by lessons (see docs/content-guidelines.md). */
  id: string;
  title: string;
  description: string;
  topic: TopicId;
  /** Is this a step-through simulation of real semantics, or a live tool that runs real code / real CSS? */
  kind: "simulation" | "live";
  component: LazyExoticComponent<ComponentType>;
}
