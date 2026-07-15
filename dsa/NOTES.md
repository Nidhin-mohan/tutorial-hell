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

## Roadmap = the 9 phases in `index.html`
The old roadmap sketch and Fable's tracker curriculum were two versions of the same plan. They are now one list — the `PHASES` array is the single source of truth. Lesson-writing status:

| # | Phase | Lesson |
|---|-------|--------|
| 1 | Arrays + Big-O | ✅ Lesson 0001 + Big-O cheatsheet |
| 2 | HashMap pattern | ✅ Lesson 0002 + hashing-pattern card. Practice assigned: LC 1, 217, 242. |
| 3 | Two Pointer | ⬜ **← NEXT to write** |
| 4 | Sliding Window | ⬜ |
| 5 | Strings + mixed revision | ⬜ |
| 6 | Binary Search | ⬜ |
| 7 | LinkedList basics | ⬜ |
| 8 | Recursion + Tree traversals | ⬜ |
| 9 | Easy DP + mock week | ⬜ |

- **Binary search was re-added 2026-07-15.** It was in the original roadmap (step 7), absent from Fable's tracker, and it shows up often in easy/medium filter rounds — the 3-6 month timeline affords it. Placed at phase 6 so phase 5's deliberate revision beat stays a consolidation rest point.
- **Sorting was dropped on purpose.** JS `.sort()` is allowed in these interviews; hand-rolling merge/quick sort is out of scope at this difficulty bar. If a "how does sort work" question ever comes up, that's a reference card, not a phase.
- Every phase has a pattern note already written in `PHASES[].note`. A lesson expands that note; the note is the spec.
