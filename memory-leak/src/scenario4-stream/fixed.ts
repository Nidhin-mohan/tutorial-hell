import express from 'express';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createLink, getClicks, getLink, seedClicks } from '../domain/linkStore.js';

const app = express();

const demoLink = createLink('https://example.com', 60 * 60 * 1000);
console.log(`Demo link ready: shortCode=${demoLink.shortCode}`);
console.log(`  1) POST /links/${demoLink.shortCode}/seed?count=300000`);
console.log(`  2) GET  /links/${demoLink.shortCode}/export (repeat with concurrency — memory stays flat)`);

app.post('/links/:shortCode/seed', (req, res) => {
  const link = getLink(req.params.shortCode);
  if (!link) return res.status(404).json({ error: 'not found' });
  const count = Number(req.query.count ?? 100_000);
  seedClicks(link.id, count);
  res.json({ seeded: count });
});

async function* csvRows(linkId: string): AsyncGenerator<string> {
  yield 'linkId,ip,timestamp,country,city\n';
  for (const click of getClicks(linkId)) {
    yield `${click.linkId},${click.ip},${click.timestamp},${click.mockedGeo.country},${click.mockedGeo.city}\n`;
  }
}

app.get('/links/:shortCode/export', async (req, res) => {
  const link = getLink(req.params.shortCode);
  if (!link) return res.status(404).json({ error: 'not found' });

  res.setHeader('Content-Type', 'text/csv');
  try {
    // FIX: Readable.from + pipeline respects backpressure — it only pulls the next row once
    // the response is ready for more data, instead of writing 300k chunks synchronously and
    // letting them all queue up in the socket's internal buffer regardless of what the client
    // has actually consumed (a naive `for (...) res.write(...)` loop still does that — it just
    // moves the buffering from one big string into many small ones, which is no better).
    await pipeline(Readable.from(csvRows(link.id)), res);
  } catch {
    // client disconnected mid-stream (e.g. `curl | head`) — pipeline rejects with
    // ERR_STREAM_PREMATURE_CLOSE; left uncaught this crashes the whole process for every
    // other in-flight request, not just this one, so it must be swallowed here.
  }
});

app.get('/memory', (_req, res) => {
  res.json({ ...process.memoryUsage(), bufferedRows: getClicks(demoLink.id).length });
});

app.listen(3000, () => console.log('scenario4 FIXED listening on :3000'));
