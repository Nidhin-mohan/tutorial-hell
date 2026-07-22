# Scenario 2 — Event listener leak

## The bug

`GET /links/:shortCode/live` is an SSE endpoint: each connected client subscribes to a shared
`EventEmitter` (`clickBus`) to receive live click events for one link. In `leaky.ts`, a new
listener is attached on every connection and **never removed when the client disconnects**.

Marked in code:
- `src/scenario2-listeners/leaky.ts:31` — `clickBus.on(...)` with no matching `off`/`removeListener`

Each dead listener also keeps its closure alive — including the `res` object it references —
so this is a listener leak *and* a socket/response-object leak bundled together.

## The fix

`fixed.ts` adds one line: `res.on('close', () => clickBus.off(shortCode, onClick))`. The listener
is removed the instant the client goes away. See `// FIX:` in that file.

## Repro steps

```bash
npm run scenario2:leaky
# open ~2000 short-lived SSE connections (each aborted after 200ms, simulating a client that disconnects)
npm run load-test -- "http://localhost:3000/links/<shortCode>/live" 2000 50 200 100
```

Watch `/memory`'s `listenerCount` — it climbs toward 2000 and never drops in the leaky variant.
Switch to `npm run scenario2:fixed` and repeat: `listenerCount` stays near the current number of
open connections (close to 0 once the burst finishes, since `abortAfterMs=200` closes them fast).

## How to detect this in general

- **Node's own warning is the first hint**: past 10 listeners on the same event name, Node logs
  `MaxListenersExceededWarning: Possible EventEmitter memory leak detected`. In production this
  often shows up in logs *before* anyone opens a profiler — the leaky variant here will print it
  organically once enough connections pile up on the same `shortCode`. Don't silence it with
  `setMaxListeners()` before you've understood why it's firing.
- **Heap snapshot diff**: compare snapshots before/after the load burst; look for a large `Size
  Delta` on `EventEmitter` / closure objects, then check the retainer path back to `clickBus`.
- **clinic doctor**: memory climbs with connection count and doesn't recover after connections
  close — a shape distinct from a normal request/response memory sawtooth.

## npm scripts

```bash
npm run scenario2:leaky
npm run scenario2:fixed
```
