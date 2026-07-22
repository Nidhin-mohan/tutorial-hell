import type { ClickEvent, Link } from './types.js';
import { fakeGeoForIp } from './mockServices.js';

const links = new Map<string, Link>();
const clicksByLinkId = new Map<string, ClickEvent[]>();
let idCounter = 0;

export function createLink(originalUrl: string, ttlMs = 5 * 60 * 1000): Link {
  const id = String(++idCounter);
  const shortCode = Math.random().toString(36).slice(2, 8);
  const now = Date.now();
  const link: Link = { id, shortCode, originalUrl, createdAt: now, expiresAt: now + ttlMs };
  links.set(shortCode, link);
  return link;
}

export function getLink(shortCode: string): Link | undefined {
  return links.get(shortCode);
}

export function deleteLink(shortCode: string): boolean {
  return links.delete(shortCode);
}

export function linkCount(): number {
  return links.size;
}

export function recordClick(linkId: string, ip: string): ClickEvent {
  const event: ClickEvent = { linkId, ip, timestamp: Date.now(), mockedGeo: fakeGeoForIp(ip) };
  const events = clicksByLinkId.get(linkId) ?? [];
  events.push(event);
  clicksByLinkId.set(linkId, events);
  return event;
}

/** Bulk-adds fake click events without the per-click mock delay, so exports can be tested at scale. */
export function seedClicks(linkId: string, count: number): void {
  const events = clicksByLinkId.get(linkId) ?? [];
  for (let i = 0; i < count; i++) {
    const ip = `10.${i % 256}.${(i >> 8) % 256}.${(i >> 16) % 256}`;
    events.push({ linkId, ip, timestamp: Date.now(), mockedGeo: fakeGeoForIp(ip) });
  }
  clicksByLinkId.set(linkId, events);
}

export function getClicks(linkId: string): ClickEvent[] {
  return clicksByLinkId.get(linkId) ?? [];
}
