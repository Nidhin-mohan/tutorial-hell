# Teaching Notes

## Learner profile
- Professional JavaScript developer, ~3 years experience. Comfortable with JS syntax, array methods, objects, async, etc.
- **Effectively a DSA beginner** — clarified "don't know anything related to DSA." Treat as starting from zero on algorithms/complexity.
- Goal: pass mid-size/startup coding interviews (LeetCode easy → medium), **3-6 month timeline** (revised 2026-07-15), target 15-20 LPA.

## Key constraint: avoid overwhelm
- Owns the **Namaste DSA** course but finds it overwhelming — 280+ FANG-level questions with no clear "where do I start."
- **Our value-add is curation and sequencing, not more content.** Each lesson points to the relevant Namaste DSA section and a *small* set of practice problems (2-4), in pattern order. Never dump big problem lists.
- Watch for overwhelm signals; keep scope tight; one win per lesson.

## Teaching approach that fits this learner
- **Anchor every new concept in JavaScript they already know.** Show it as JS first, generalise after.
- Lean on their strength: they read/write JS fluently. Bottleneck is *which* approach and *why*, not syntax.
- Build pattern vocabulary explicitly (hashing, two pointers, sliding window, BFS/DFS, recursion). Name the pattern every time.
- Always attach Big-O to a solution and make them say it out loud — interviews test communication.

## Workspace conventions
- **Root `index.html` IS the tracker** (merged 2026-07-15 — it absorbed the standalone `dsa-tracker.html` Fable produced). It is the front door: week strip, 9-phase curriculum, progress, revision queue. Lessons hang off phases; they are the depth layer, not the entry point.
- **To register a new lesson or reference card:** edit that phase's `learn` field in the `PHASES` array. The "Lessons & reference cards" section at the bottom is *derived* from those fields — do not maintain a second list. `learn:null` renders "no lesson written yet," so the page shows its own writing queue.
- **Problem ids in `PHASES` are localStorage keys and are frozen.** Never renumber them to keep phases tidy — saved progress would silently reattach to the wrong problem. Insert new phases with a fresh id namespace instead (binary search uses `pbs*` precisely because taking `p6*` would have collided with LinkedList). On-screen phase numbers come from array order, so *reordering* phases is free; *renaming ids* is not.
- Progress lives in localStorage under `dsaTracker.v1`. Before any change that touches ids or file location, tell the user to hit "Copy backup" first.

## Preferences
- Dislikes large, undifferentiated problem sets / FANG-firehose. Wants a focused, paced path.
- **Prefers DARK MODE / reading-friendly pages.** All lessons & reference cards must default to a dark theme (dark bg, light text). Reference card keeps a light print stylesheet via @media print.
- **Wants "why it works," not just API calls.** Cares about senior-level depth (e.g. how a hash map achieves O(1) under the hood), not just knowing which method to call. Always include a short mechanism explanation directly in the lesson/reference card — don't defer it to the external Namaste course. See [[learning-records/0002-builtin-data-structures-are-allowed]].

## Roadmap = the 16 phases in `index.html`, re-aligned to Namaste DSA's real module order (2026-07-19)
**This replaces the old 9-phase invented-order curriculum.** That curriculum and Namaste DSA's actual course had drifted into two different plans (different problems, different order) — this was discovered during a `Learn/prep` check-in and named as part of what was blocking Nidhin from starting at all (see `Learn/prep/.prep/assessments/0002-dsa-avoidance-pattern.md`). The `PHASES` array now mirrors Namaste's own module sequence 1:1, scoped to easy-medium breadth, and matches `Learn/prep/.prep/ROADMAP.md`'s "DSA foundations + intermediate" milestone exactly. **Keep it that way** — if this tracker's phases and prep's ROADMAP.md ever diverge again, that's the same failure mode recurring; reconcile immediately rather than letting both exist.

| # | Phase (id) | Lesson |
|---|-------|--------|
| 1 | Time & Space Complexity (`t0`) | ✅ Lesson 0001 + Big-O cheatsheet |
| 2 | Arrays - Easy/Medium (`ar`) | ⬜ |
| 3 | Recursion - Easy/Medium (`rc`) | ⬜ |
| 4 | Searching & Sorting - Easy/Medium (`ss`) | ⬜ |
| 5 | Linked List - Easy/Medium (`ll`) | ⬜ |
| 6 | Strings - Easy/Medium (`st`) | ⬜ |
| 7 | Stack and Queues (`sq`) | ⬜ |
| 8 | Two Pointers & Sliding Window (`tp`) | ✅ Lesson 0002 (Two Sum) + hashing-pattern card — moved here from the old phase 2, since Akshay teaches Two Sum in this module, not a standalone "HashMap" one |
| 9 | Binary Search Algorithm (`bs`) | ⬜ |
| 10 | Binary Tree (`bt`) | ⬜ |
| 11 | Binary Search Tree (`bst`) | ⬜ |
| 12 | Heap / Priority Queue (`hp`) | ⬜ |
| 13 | Backtracking (`bk`) | ⬜ |
| 14 | Greedy Algorithm (`gr`) | ⬜ |
| 15 | Dynamic Programming - Easy (`dp`) | ⬜ |
| 16 | Graphs - intro (`gp`) | ⬜ **← where the curriculum stops; MST/Bellman-Ford/Floyd-Warshall/Tries stay out of scope for this target** |

- **First real target: phase 1 (`t0`), then phase 2 (`ar`) problem 1 — Single Number, LC 136.** Attempt-first (see MISSION.md / the tracker's own rules section) — timebox a solo try before watching anything.
- **Sorting was dropped on purpose.** JS `.sort()` is allowed in these interviews; hand-rolling merge/quick sort is out of scope at this difficulty bar. If a "how does sort work" question ever comes up, that's a reference card, not a phase.
- Every phase has a pattern note already written in `PHASES[].note`. A lesson expands that note; the note is the spec.
- Problem ids were regenerated with the re-sequencing (old `p1a`-style ids retired) — safe because zero real progress existed under the old ids (self-reported 2026-07-19). Don't repeat this kind of silent regeneration once real progress exists; frozen-id discipline (see below) applies from here forward.
