import express from 'express';
import { createLink, deleteLink } from '../domain/linkStore.js';

const app = express();
app.use(express.json());

let activeTimerCount = 0;

app.post('/links', (req, res) => {
  const originalUrl = req.body?.originalUrl ?? 'https://example.com';
  const ttlMs = Number(req.body?.ttlMs ?? 5000);
  const link = createLink(originalUrl, ttlMs);

  activeTimerCount++;
  setInterval(() => {
    // LEAK: never cleared — not when the link expires, not when it's deleted. The closure
    // also keeps the entire `link` object (and everything it references) alive forever.
    if (Date.now() > link.expiresAt) {
      console.log(`link ${link.shortCode} expired`);
    }
  }, 1000);

  res.json(link);
});

app.delete('/links/:shortCode', (req, res) => {
  const existed = deleteLink(req.params.shortCode);
  // LEAK: the interval created for this link in POST /links keeps running with no handle
  // kept around to clear it — deleting the link doesn't stop its timer.
  res.json({ deleted: existed });
});

app.get('/memory', (_req, res) => {
  res.json({ ...process.memoryUsage(), activeTimerCount });
});

app.listen(3000, () => console.log('scenario3 LEAKY listening on :3000'));
