import express from 'express';
import { createLink, getLink } from '../domain/linkStore.js';
import { mockGeoLookupService } from '../domain/mockServices.js';
import type { GeoInfo } from '../domain/types.js';

const app = express();

const demoLink = createLink('https://example.com', 60 * 60 * 1000);
console.log(`Demo link ready: GET /links/${demoLink.shortCode}/geo?ip=1.2.3.4`);

const MAX_CACHE_SIZE = 500;
const TTL_MS = 60_000;

// FIX: keyed by IP alone (stable → cacheable) and bounded by size + TTL (can't grow unbounded).
const geoCache = new Map<string, { geo: GeoInfo; expiresAt: number }>();

function getCached(ip: string): GeoInfo | undefined {
  const entry = geoCache.get(ip);
  if (!entry) return undefined;
  if (entry.expiresAt < Date.now()) {
    geoCache.delete(ip); // FIX: lazy TTL eviction on read
    return undefined;
  }
  return entry.geo;
}

function setCached(ip: string, geo: GeoInfo): void {
  if (geoCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = geoCache.keys().next().value; // FIX: FIFO eviction — Map iterates in insertion order
    if (oldestKey !== undefined) geoCache.delete(oldestKey);
  }
  geoCache.set(ip, { geo, expiresAt: Date.now() + TTL_MS });
}

app.get('/links/:shortCode/geo', async (req, res) => {
  const link = getLink(req.params.shortCode);
  if (!link) return res.status(404).json({ error: 'not found' });

  const ip = (req.query.ip as string) ?? req.ip ?? 'unknown';
  const cached = getCached(ip);
  if (cached) return res.json({ geo: cached, cached: true });

  const geo = await mockGeoLookupService(ip);
  setCached(ip, geo);
  res.json({ geo, cached: false });
});

app.get('/memory', (_req, res) => {
  res.json({ ...process.memoryUsage(), cacheSize: geoCache.size });
});

app.listen(3000, () => console.log('scenario1 FIXED listening on :3000'));
