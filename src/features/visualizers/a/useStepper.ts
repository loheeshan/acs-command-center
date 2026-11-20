import { useCallback, useEffect, useRef, useState } from "react";
import { useProgressStore } from "@/stores/progressStore";

/** Call once to record that the learner meaningfully used a visualizer. */
export function useMarkOnce(id: string) {
  const done = useRef(false);
  return useCallback(() => {
    if (done.current) return;
    done.current = true;
    useProgressStore.getState().markVisualizer(id);
  }, [id]);
}

export interface Stepper {
  step: number;
  total: number;
  playing: boolean;
  speed: number;
  atStart: boolean;
  atEnd: boolean;
  next: () => void;
  prev: () => void;
  reset: () => void;
  toggle: () => void;
  goTo: (n: number) => void;
  setSpeed: (ms: number) => void;
}

/**
 * Step index 0..total-1 over a precomputed trace. Auto-play advances on a timer.
 * Reaching the last step marks the visualizer as completed (once).
 */
export function useStepper(total: number, id: string): Stepper {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const mark = useMarkOnce(id);
  const last = Math.max(0, total - 1);
  const s = Math.min(step, last);

  useEffect(() => {
    if (total > 0 && s === last && step > 0) mark();
  }, [s, last, step, total, mark]);

  useEffect(() => {
    if (!playing) return;
    if (s >= last) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setStep((x) => Math.min(x + 1, last)), speed);
    return () => clearTimeout(t);
  }, [playing, s, last, speed]);

  return {
    step: s,
    total,
    playing,
    speed,
    atStart: s === 0,
    atEnd: s >= last,
    next: () => setStep((x) => Math.min(x + 1, last)),
    prev: () => setStep((x) => Math.max(x - 1, 0)),
    reset: () => {
      setPlaying(false);
      setStep(0);
    },
    toggle: () => {
      if (s >= last) {
        setStep(0);
        setPlaying(true);
      } else setPlaying((p) => !p);
    },
    goTo: (n: number) => setStep(Math.max(0, Math.min(n, last))),
    setSpeed,
  };
}
