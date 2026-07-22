import type { GeoInfo } from './types.js';

const COUNTRIES: Array<{ country: string; city: string }> = [
  { country: 'US', city: 'New York' },
  { country: 'DE', city: 'Berlin' },
  { country: 'IN', city: 'Bangalore' },
  { country: 'BR', city: 'Sao Paulo' },
  { country: 'JP', city: 'Tokyo' },
  { country: 'GB', city: 'London' },
];

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

export function fakeGeoForIp(ip: string): GeoInfo {
  const idx = Math.abs(hashCode(ip)) % COUNTRIES.length;
  const { country, city } = COUNTRIES[idx];
  return { ip, country, city };
}

function randomDelay(minMs = 50, maxMs = 150): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, minMs + Math.random() * (maxMs - minMs)));
}

/** Stands in for a real third-party geo-IP API call: random latency, fake data. */
export async function mockGeoLookupService(ip: string): Promise<GeoInfo> {
  await randomDelay();
  return fakeGeoForIp(ip);
}
