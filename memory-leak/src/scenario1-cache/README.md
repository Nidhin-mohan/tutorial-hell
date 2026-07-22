# Scenario 1 — Unbounded cache

## The bug

`GET /links/:shortCode/geo` looks up (mocked) geo info for an IP and caches the result so the
next lookup for the same IP is free. In `leaky.ts`, the cache key includes `Date.now()`, so:

1. No two requests ever produce the same key → **0% cache hit rate** (the cache does nothing useful).
2. Every request adds one more permanent entry that nothing ever removes → **unbounded growth**.

Marked in code:
- `src/scenario1-cache/leaky.ts:18-20` — `Date.now()` in the cache key
- `src/scenario1-cache/leaky.ts:27` — `geoCache.set(...)` with no cap, no TTL, no eviction

## The fix

`fixed.ts` keys the cache by IP alone (stable → actually cacheable) and bounds it with a max
size (FIFO eviction) and a TTL (lazy eviction on read). See `// FIX:` comments in that file.

## Repro steps

```bash
npm run scenario1:leaky
# in another terminal, vary ?ip= so requests don't all collapse to one IP:
npm run load-test -- "http://localhost:3000/links/<shortCode>/geo?ip=10.0.{i}.1" 3000 20 0 200
```

Watch the printed `/memory` lines: `cacheSize` climbs in lockstep with request count and never
stops, and `heapUsed`/`rss` climb with it. Swap to `npm run scenario1:fixed` and repeat the same
command — `cacheSize` plateaus at 500 (`MAX_CACHE_SIZE`) and memory stays flat.

Reliably visible well within ~3,000 requests on default Node heap settings — no `--max-old-space-size` tuning needed.

## How to detect this in general

- **Heap snapshot diff** ([Node.js Learn guide](https://nodejs.org/learn/diagnostics/memory/using-heap-snapshot)): run with `node --inspect src/scenario1-cache/leaky.ts` (or `tsx --inspect`), open `chrome://inspect` → Memory tab, take a snapshot, run the load test, take a second snapshot, switch to **Comparison** view. A `Map` (or its internal entries) with a huge positive `# New` / `Size Delta` is your leak — see [Chrome DevTools: Record heap snapshots](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots).
- **clinic doctor**: `clinic doctor -- node --loader tsx src/scenario1-cache/leaky.ts`, then hit it with the load test — Doctor's memory graph will show a steady climb with no plateau, which is the visual signature of an unbounded cache (as opposed to a sawtooth from normal GC).

## npm scripts

```bash
npm run scenario1:leaky
npm run scenario1:fixed
```
