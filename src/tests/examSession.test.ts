import { beforeEach, describe, expect, it, vi } from "vitest";
import { useExamSessionStore } from "@/stores/examSessionStore";

describe("exam session timer", () => {
  beforeEach(() => useExamSessionStore.getState().end());
  it("stores an absolute deadline so remaining time survives a reload", () => {
    vi.setSystemTime(new Date("2026-11-25T10:00:00Z"));
    useExamSessionStore.getState().start("original-mock", 90);
    const saved = JSON.parse(localStorage.getItem("acs-exam-session")!);
    expect(saved.state.session.deadline).toBe(new Date("2026-11-25T11:30:00Z").getTime());
    vi.setSystemTime(new Date("2026-11-25T10:30:00Z"));
    // A "reload" re-reads the same deadline: remaining = deadline - now = 60 min
    expect(saved.state.session.deadline - Date.now()).toBe(60 * 60_000);
    vi.useRealTimers();
  });
  it("records answers including false/0 and submits once", () => {
    const s = useExamSessionStore.getState();
    s.start("p", null);
    s.answer("q1", false);
    s.answer("q2", 0);
    s.submit(true);
    const first = useExamSessionStore.getState().session!.submittedAt;
    useExamSessionStore.getState().submit(false);
    const sess = useExamSessionStore.getState().session!;
    expect(sess.answers).toEqual({ q1: false, q2: 0 });
    expect(sess.submittedAt).toBe(first);
    expect(sess.timedOut).toBe(true);
    expect(sess.deadline).toBeNull();
  });
});
