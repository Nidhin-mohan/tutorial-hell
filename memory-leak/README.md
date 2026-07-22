# Memory Leak Learning Lab

A self-contained Node.js + TypeScript + Express lab for practicing **diagnosing memory leaks in
production Node apps**. Not a real product — every "database" is a `Map`/array, every
"third-party API" is a mocked async function with a random delay. The only thing that's real is
the memory bug and its fix.

Domain (kept deliberately simple — the point is the bug, not the app): a URL shortener with click
analytics. `Link { id, shortCode, originalUrl, createdAt, expiresAt }`,
`ClickEvent { linkId, ip, timestamp, mockedGeo }`.

## Setup

```bash
cd memory-leak
npm install
```

Only one variant runs at a time (`leaky` or `fixed`), both on port 3000. Every app exposes
`GET /memory` returning `process.memoryUsage()` plus a scenario-specific counter, so growth is
directly observable without any extra tooling.

## The four scenarios

| # | Folder | Bug shape | Watch on `/memory` |
|---|--------|-----------|---------------------|
| 1 | [`scenario1-cache`](src/scenario1-cache/README.md) | Unbounded cache — timestamp-keyed cache with 0% hit rate that grows forever | `cacheSize` climbs forever (leaky) vs. plateaus at 500 (fixed) |
| 2 | [`scenario2-listeners`](src/scenario2-listeners/README.md) | Event listener leak — SSE clients subscribe and are never unsubscribed | `listenerCount` climbs forever (leaky) vs. tracks live connections (fixed) |
| 3 | [`scenario3-timers`](src/scenario3-timers/README.md) | Closure/timer leak — per-link `setInterval` never cleared | `activeTimerCount` only ever grows (leaky) vs. falls back to 0 (fixed) |
| 4 | [`scenario4-stream`](src/scenario4-stream/README.md) | Buffer leak — full CSV built in memory before sending | `rss`/`heapUsed` spike under concurrency (leaky) vs. stay flat (fixed) |

Each scenario's README has exact repro commands, which line(s) cause the leak (marked
`// LEAK:` in code), and what the fix changes (marked `// FIX:`).

## Running a scenario

```bash
npm run scenario1:leaky      # or scenario1:fixed / scenario2:leaky / etc.
```

In another terminal, drive load against it:

```bash
npm run load-test -- <url> <count> [concurrency=10] [abortAfterMs=0] [memoryEvery=200] [method=GET]
```

`{i}` in `<url>` is replaced with the request index — useful for varying query params (e.g.
`?ip=10.0.{i}.1` in scenario 1 so requests don't all collapse to one cache key). See each
scenario's README for the exact command to run.

## Detecting leaks in general (not just in this lab)

- **Heap snapshot diff** — the standard technique: snapshot before exercising the suspect code
  path, snapshot after, compare in Chrome DevTools' Comparison view, and look for large positive
  `Size Delta`s. [Node.js official guide](https://nodejs.org/learn/diagnostics/memory/using-heap-snapshot) · [Chrome DevTools docs](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots)
- **`clinic doctor`** — point it at a running process (`clinic doctor -- node app.js`), drive
  load, and read the memory graph shape: a steady one-way climb suggests a true leak (scenarios
  1–3), sharp traffic-correlated spikes suggest a buffering problem (scenario 4). [Clinic.js docs](https://clinicjs.org/documentation/doctor/04-reading-a-profile/)
- Full source list and notes in the workspace's [`RESOURCES.md`](../RESOURCES.md).

## Structure

```
memory-leak/
  src/
    domain/                 shared mocked domain logic (identical across leaky/fixed)
    scenario1-cache/         leaky.ts, fixed.ts, README.md
    scenario2-listeners/      "
    scenario3-timers/         "
    scenario4-stream/         "
    load-test.ts             shared load generator (native fetch)
  package.json
  tsconfig.json
```
