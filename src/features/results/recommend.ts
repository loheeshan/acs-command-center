import { LESSONS, questionById } from "@/content";
import type { Lesson, TopicId } from "@/content/types";
import { MODULES } from "@/content/modules";
import type { AttemptRecord } from "@/stores/progressStore";

/** Lessons linked to the questions answered incorrectly, most-missed first. */
export function recommendedLessons(attempts: AttemptRecord[], weakTopics: TopicId[] = [], limit = 6): { lesson: Lesson; misses: number }[] {
  const counts = new Map<string, number>();
  for (const a of attempts) for (const r of a.results) {
    if (r.correct === false || (r.selfAssessed && r.marksAwarded < r.marksAvailable * 0.5 && r.correct !== null)) {
      const lid = questionById(r.questionId)?.lessonId;
      if (lid) counts.set(lid, (counts.get(lid) ?? 0) + 1);
    }
  }
  const out = [...counts.entries()]
    .map(([id, misses]) => ({ lesson: LESSONS.find((l) => l.id === id)!, misses }))
    .filter((x) => x.lesson)
    .sort((a, b) => b.misses - a.misses);
  for (const t of weakTopics) {
    const modIds = MODULES.filter((m) => m.topic === t).map((m) => m.id);
    for (const l of LESSONS.filter((x) => modIds.includes(x.moduleId) && x.examCritical)) if (!out.some((o) => o.lesson.id === l.id)) out.push({ lesson: l, misses: 0 });
  }
  return out.slice(0, limit);
}
