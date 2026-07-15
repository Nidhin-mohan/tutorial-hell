# Doubt resolved: built-ins are allowed, and "under the hood" belongs in-lesson

After Lesson 0002, the learner got secondhand advice from a friend claiming coding interviews forbid built-in `Map`/`Set`, and worried that leaning on built-ins wouldn't give the deep understanding expected of a senior dev.

**Resolved via live web research** (not parametric knowledge): built-in hash maps/sets are expected and encouraged in standard LeetCode-style interviews (mid-size/startup target — see [[MISSION.md]]). The only exception is a problem that explicitly asks you to implement a hash map from scratch (e.g. LeetCode 706 "Design HashMap") — a distinct problem type, not the norm. Sources: [Tech Interview Handbook — Hash Table](https://www.techinterviewhandbook.org/algorithms/hash-table/), [Interview Cake — Hash Map](https://www.interviewcake.com/concept/java/hash-map).

**Process gap this exposed:** Lesson 0002 deferred the "how does a hash map give O(1) under the hood" explanation to the external Namaste course instead of teaching it directly. Added a proper "Under the hood" section (hash function → bucket → collisions/chaining → amortized resize) to `reference/hashing-pattern.html` to close that gap.

Why this matters for future sessions:
- **Don't defer core mechanism explanations to the external course.** Teach the "why it works" (even briefly) directly in the lesson/reference card — that's what this learner means by "deep understanding," and it's cheap to include. Reserve the external course pointer for extra practice problems and alternate walkthroughs, not for core conceptual gaps.
- This learner explicitly cares about being able to *reason about and explain* a mechanism, not just call the API — factor this into every future pattern lesson (two pointers, sliding window, BFS/DFS, etc.): always include a short "why does this work / what's the underlying mechanism" note.
- Secondhand interview advice from friends/forums should be fact-checked against current sources before accepting — don't let unverified claims stall momentum.
