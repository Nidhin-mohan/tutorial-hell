# Scenario 3 — Closure / timer leak

## The bug

`POST /links` creates a short link and starts a `setInterval` that periodically checks whether
it has expired. In `leaky.ts`, that interval is **never cleared** — not when the link naturally
expires, not when `DELETE /links/:shortCode` removes it.

Marked in code:
- `src/scenario3-timers/leaky.ts:15-21` — `setInterval(...)` with no stored handle, so it can never be cancelled
- `src/scenario3-timers/leaky.ts:26-30` — `DELETE` removes the link from the store but leaves its timer running

Every live timer also holds its closure's captured `link` object in memory forever, even after
the link is "deleted" from the store — the timer is an unreachable-looking-but-still-rooted
reference.

## The fix

`fixed.ts` stores each link's interval handle in a `Map<shortCode, Timeout>`, calls
`clearInterval` (a) from inside the interval once it detects real expiry, and (b) explicitly on
`DELETE`. See `// FIX:` comments in that file.

## Repro steps

```bash
npm run scenario3:leaky
# create 5000 links with the default 5s TTL — none of their timers are ever cleared
npm run load-test -- "http://localhost:3000/links" 5000 20 0 500 POST
```

Watch `/memory`'s `activeTimerCount` — it climbs to 5000 and stays there forever, even long
after every link has expired. Switch to `npm run scenario3:fixed` and repeat: `activeTimerCount`
rises then falls back toward 0 as each link's timer detects expiry and clears itself.

## How to detect this in general

- **Heap snapshot diff**: look for a growing count of `Timeout` (or the internal `TimersList`)
  objects between snapshots, then follow the retainer chain to the closure and the `Link` object
  it holds — that tells you *which* timer-creating code path is responsible.
- **clinic doctor**: an ever-growing active-handle count is visible in Node's own
  `process._getActiveHandles()` (what `clinic doctor` samples under the hood) even before you
  touch heap snapshots — a first-pass signal that something is scheduling and never cancelling.
- **Rule of thumb**: any `setInterval`/`setTimeout` created inside a per-request or per-entity
  handler needs a paired `clearInterval`/`clearTimeout` reachable from *every* code path that
  removes that entity (expiry, explicit delete, error path) — not just the happy path.

## npm scripts

```bash
npm run scenario3:leaky
npm run scenario3:fixed
```
