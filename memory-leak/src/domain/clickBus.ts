import { EventEmitter } from 'node:events';

/**
 * Shared broadcast bus: click events are emitted under the link's shortCode as the event name.
 * Deliberately left at Node's default max-listeners (10) — in scenario 2's leaky variant this
 * means Node's own `MaxListenersExceededWarning` fires once >10 dead listeners pile up on the
 * same shortCode, which is itself a real diagnostic signal worth recognizing.
 */
export const clickBus = new EventEmitter();

export function totalListenerCount(): number {
  return clickBus.eventNames().reduce((sum, name) => sum + clickBus.listenerCount(name), 0);
}
