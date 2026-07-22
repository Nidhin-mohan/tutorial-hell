import express from 'express';
import { createLink, getClicks, getLink, seedClicks } from '../domain/linkStore.js';

const app = express();

const demoLink = createLink('https://example.com', 60 * 60 * 1000);
console.log(`Demo link ready: shortCode=${demoLink.shortCode}`);
console.log(`  1) POST /links/${demoLink.shortCode}/seed?count=300000`);
console.log(`  2) GET  /links/${demoLink.shortCode}/export (repeat with concurrency to see it spike)`);

app.post('/links/:shortCode/seed', (req, res) => {
  const link = getLink(req.params.shortCode);
  if (!link) return res.status(404).json({ error: 'not found' });
  const count = Number(req.query.count ?? 100_000);
  seedClicks(link.id, count);
  res.json({ seeded: count });
});

app.get('/links/:shortCode/export', (req, res) => {
  const link = getLink(req.params.shortCode);
  if (!link) return res.status(404).json({ error: 'not found' });

  const clicks = getClicks(link.id);

  // LEAK: the entire CSV is built as one big string in memory before a single byte goes out.
  // Peak memory scales with row count AND with how many exports are in flight concurrently.
  let csv = 'linkId,ip,timestamp,country,city\n';
  for (const click of clicks) {
    csv += `${click.linkId},${click.ip},${click.timestamp},${click.mockedGeo.country},${click.mockedGeo.city}\n`;
  }

  res.setHeader('Content-Type', 'text/csv');
  res.send(csv); // LEAK: nothing is written to the socket until `csv` is fully assembled
});

app.get('/memory', (_req, res) => {
  res.json({ ...process.memoryUsage(), bufferedRows: getClicks(demoLink.id).length });
});

app.listen(3000, () => console.log('scenario4 LEAKY listening on :3000'));
