import express from 'express';
import { createLink, getLink } from '../domain/linkStore.js';
import { mockGeoLookupService } from '../domain/mockServices.js';
import type { GeoInfo } from '../domain/types.js';

const app = express();

const demoLink = createLink('https://example.com', 60 * 60 * 1000);
console.log(`Demo link ready: GET /links/${demoLink.shortCode}/geo?ip=1.2.3.4`);

const geoCache = new Map<string, GeoInfo>();

app.get('/links/:shortCode/geo', async (req, res) => {
  const link = getLink(req.params.shortCode);
  if (!link) return res.status(404).json({ error: 'not found' });

  const ip = (req.query.ip as string) ?? req.ip ?? 'unknown';
  // LEAK: Date.now() in the cache key means no two requests ever share a key — 0% hit rate,
  // and every single request adds a permanent entry that nothing ever removes.
  const cacheKey = `${ip}-${Date.now()}`;

  if (geoCache.has(cacheKey)) {
    return res.json({ geo: geoCache.get(cacheKey), cached: true });
  }

  const geo = await mockGeoLookupService(ip);
  geoCache.set(cacheKey, geo); // LEAK: unbounded — no max size, no TTL, no eviction
  res.json({ geo, cached: false });
});

app.get('/memory', (_req, res) => {
  res.json({ ...process.memoryUsage(), cacheSize: geoCache.size });
});

app.listen(3000, () => console.log('scenario1 LEAKY listening on :3000'));
