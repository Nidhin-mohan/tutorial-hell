# Scenario 4 — Stream / buffer leak

## The bug

`GET /links/:shortCode/export` returns all click events for a link as CSV. In `leaky.ts`, the
entire CSV is assembled as **one big string in memory** before a single byte is sent to the
client.

Marked in code:
- `src/scenario4-stream/leaky.ts:27-30` — `csv +=` in a loop over every row, building the full string first
- `src/scenario4-stream/leaky.ts:33` — `res.send(csv)` only happens after that string is complete

Unlike scenarios 1–3, this isn't a *permanent* leak — the string is eventually garbage collected
after each request finishes. The problem is **peak memory under concurrency**: N concurrent
exports of a large dataset means N full CSV strings alive in memory simultaneously, which can
spike RSS far higher than the traffic "should" require, and can OOM the process outright under
enough concurrent load.

## The fix

`fixed.ts` builds an async generator that yields one CSV row at a time and pipes it to the
response via `Readable.from(...)` + `stream/promises`' `pipeline(...)`. See `// FIX:` comment in
that file.

**A naive fix doesn't work — this was verified, not assumed.** The first version of this fix
replaced the string-building loop with a plain `for (...) res.write(row)` loop. Under the same
concurrent load, that measured *worse* than the leaky version (~2GB RSS vs. leaky's ~750MB),
because a synchronous `res.write()` loop ignores backpressure: it queues every chunk into the
socket's internal buffer regardless of whether the client is reading fast enough, and it blocks
the event loop for the whole loop just as much as building one string does. It just moves the
buffering from one big string into many small ones — no real improvement. `pipeline()` is what
actually fixes it: it only pulls the next row from the generator once the writable side signals
it's ready for more, so at any instant only a small, bounded amount of CSV is in memory.

One more real gap this surfaced: `pipeline()` rejects with `ERR_STREAM_PREMATURE_CLOSE` if the
client disconnects mid-stream (e.g. piping the response through `head`). Left uncaught, that's an
unhandled rejection that crashes the *entire* server — every other in-flight request too, not
just the disconnecting one — so the handler wraps the `await pipeline(...)` in try/catch.

## Repro steps

```bash
npm run scenario4:leaky
# seed a large dataset for one link first:
curl -X POST "http://localhost:3000/links/<shortCode>/seed?count=300000"
# then fire many concurrent exports of it:
npm run load-test -- "http://localhost:3000/links/<shortCode>/export" 30 15 0 5
```

Watch `/memory`'s `rss`/`heapUsed` during the burst — the leaky variant spikes dramatically
(measured: ~140MB baseline → ~750MB during a 15-concurrent burst against 300k seeded rows) while
15 concurrent full CSV strings are all alive at once. Switch to `npm run scenario4:fixed`,
re-seed, and repeat the same load: RSS stays close to its ~140MB baseline throughout, because no
request ever holds more than a small chunk's worth of CSV in memory at a time.

## How to detect this in general

- **clinic doctor** is the better tool here (over static heap snapshots): run
  `clinic doctor -- node --loader tsx src/scenario4-stream/leaky.ts`, fire the concurrent export
  burst, and look for sharp, traffic-correlated RSS spikes rather than a steady one-way climb —
  that shape (spike-and-recover, worse under concurrency) is the signature of a buffering
  problem rather than a true reference leak.
- **Heap snapshot diff** still helps to confirm *what* is large in the moment: take a snapshot
  mid-burst and look for large `string` retainers sized proportionally to the seeded row count.
- **Rule of thumb**: any handler that materializes a whole response body before sending it scales
  its memory footprint with (payload size × concurrent requests) — reach for `res.write`/streams
  once payload size is unbounded or user-controlled.

## npm scripts

```bash
npm run scenario4:leaky
npm run scenario4:fixed
```
