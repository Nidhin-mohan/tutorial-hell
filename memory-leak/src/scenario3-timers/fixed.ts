import express from 'express';
import { createLink, deleteLink } from '../domain/linkStore.js';

const app = express();
app.use(express.json());

let activeTimerCount = 0;
// FIX: keep the interval handle per link so it can be cancelled later.
const timers = new Map<string, NodeJS.Timeout>();

app.post('/links', (req, res) => {
  const originalUrl = req.body?.originalUrl ?? 'https://example.com';
  const ttlMs = Number(req.body?.ttlMs ?? 5000);
  const link = createLink(originalUrl, ttlMs);

  activeTimerCount++;
  const handle = setInterval(() => {
    if (Date.now() > link.expiresAt) {
      // FIX: stop checking once the link has actually expired — timer clears itself.
      clearInterval(handle);
      timers.delete(link.shortCode);
      activeTimerCount--;
    }
  }, 1000);
  timers.set(link.shortCode, handle);

  res.json(link);
});

app.delete('/links/:shortCode', (req, res) => {
  const handle = timers.get(req.params.shortCode);
  if (handle) {
    // FIX: also stop the timer on explicit delete, not just on natural expiry.
    clearInterval(handle);
    timers.delete(req.params.shortCode);
    activeTimerCount--;
  }
  const existed = deleteLink(req.params.shortCode);
  res.json({ deleted: existed });
});

app.get('/memory', (_req, res) => {
  res.json({ ...process.memoryUsage(), activeTimerCount });
});

app.listen(3000, () => console.log('scenario3 FIXED listening on :3000'));
