# Mission: Diagnosing Node.js Memory Leaks in Production

## Why
A real Node.js/Express service you maintain broke during `tsc` build on a test server, and the
only fix applied in staging was bumping the memory limit to 3GB — a band-aid, not a diagnosis.
Production hasn't hit it (Docker, compiled JS, different constraints), but that's luck, not
understanding. You want the actual diagnostic skill — recognizing leak patterns, reading heap
growth, using the right tools — so that next time (this service or any other), you can find the
root cause instead of throwing more RAM at it.

## Success looks like
- Given a Node/Express service with a suspected leak, you can attach `--inspect`, take heap
  snapshots before/after load, and read the comparison view to find what's growing.
- You can recognize the 4 common leak shapes by symptom: unbounded cache, dangling event
  listeners, uncleared timers/closures, unbounded buffering — and name which one you're looking
  at from a code review or a memory graph shape.
- You can explain, concretely, why "increase the memory limit" fixed the symptom but not the
  cause — and what evidence would tell you it's safe to stop looking.
- You're comfortable running a basic load test against a live service and watching
  `process.memoryUsage()` (or an APM heap graph) to confirm growth is real vs. GC noise.

## Constraints
- Learning is hands-on / lab-first: build and break things, don't just read theory.
- Skills must be portable — not tied to this one incident or this one codebase.
- Follows this repo's existing branch-per-topic workflow (see `n+1_permomance_test` branch for
  precedent) — this topic lives on the `memory-leaks` branch.

## Out of scope
- The original incident's actual root cause (`tsc` compiler OOM during build) is a *build-time*
  memory issue, not an *application runtime* heap leak — different mechanism, not covered by this
  lab. Worth a separate investigation later if it recurs.
- Production APM/monitoring tool setup (Datadog, New Relic, etc.) — this lab uses local tooling
  (`--inspect`, Chrome DevTools, clinic.js) only.
