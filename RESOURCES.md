# Node.js Memory Leaks — Resources

## Knowledge

- [Using Heap Snapshot — Node.js Learn (official)](https://nodejs.org/learn/diagnostics/memory/using-heap-snapshot)
  Official Node.js docs on the snapshot-diff workflow: snapshot before, exercise the suspect code path, snapshot after, compare. Use for: the canonical diagnostic method taught in Lesson 1.
- [Record heap snapshots — Chrome DevTools docs](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots)
  Official Chrome DevTools guide to the Memory panel: taking snapshots, the Comparison view, reading "Size Delta". Use for: the hands-on tool-driving part of any heap-diffing exercise.
- [Fix memory problems — Chrome DevTools docs](https://developer.chrome.com/docs/devtools/memory-problems)
  Broader companion doc covering the three DevTools memory tools (Allocation timeline, Heap snapshot, Allocation sampling) and when to reach for each. Use for: choosing a tool once a leak is suspected.
- [Clinic.js documentation (NearForm)](https://clinicjs.org/documentation/doctor/04-reading-a-profile/)
  Official docs for `clinic doctor` (overview triage: CPU/event-loop/memory) and `clinic heapprofiler` (flamegraph of allocating call sites). Use for: the CLI alternative to DevTools, better suited to "point it at a running process and get a verdict" workflows.
- [How to find production memory leaks in Node.js applications? — Aleksandar Mirilovic (Medium)](https://medium.com/@amirilovic/how-to-find-production-memory-leaks-in-node-js-applications-a1b363b4884f)
  Practitioner walkthrough of diagnosing a real leak in a live service, not just a toy example. Use for: bridging the lab's mocked scenarios to what production triage actually looks like.

## Gaps
- No source yet on production-safe heap snapshotting (i.e., taking a snapshot from a live
  container without an `--inspect` port exposed, or via `heapdump`/signal-triggered dumps). Worth
  finding before the lab pushes toward "how would you do this against the Docker service in
  prod?"
- No source yet on interpreting flame graphs specifically from `clinic heapprofiler` output —
  the docs page covers `doctor`, not the heap profiler's flamegraph in depth.

## Wisdom (Communities)
- Not yet explored — no community preference stated. Revisit once the lab scenarios are done and
  the user has a real leak (or the original incident) to bring to a wider audience for a second
  opinion.
