import express from 'express';
import { createLink, getLink } from '../domain/linkStore.js';
import { clickBus, totalListenerCount } from '../domain/clickBus.js';

const app = express();

const demoLink = createLink('https://example.com', 60 * 60 * 1000);
console.log(`Demo link ready: GET /links/${demoLink.shortCode}/live`);

// Simulated click traffic so connected clients have something to see.
setInterval(() => {
  const ip = `10.0.0.${Math.floor(Math.random() * 255)}`;
  clickBus.emit(demoLink.shortCode, { ip, timestamp: Date.now() });
}, 500);

app.get('/links/:shortCode/live', (req, res) => {
  const link = getLink(req.params.shortCode);
  if (!link) return res.status(404).end();

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const onClick = (event: unknown) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  // LEAK: a new listener is attached on every connection and never removed when the client
  // disconnects — the closure keeps `res` (and everything it references) alive forever too.
  clickBus.on(req.params.shortCode, onClick);
});

app.get('/memory', (_req, res) => {
  res.json({ ...process.memoryUsage(), listenerCount: totalListenerCount() });
});

app.listen(3000, () => console.log('scenario2 LEAKY listening on :3000'));
