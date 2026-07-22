/**
 * Generic load generator for the memory-leak scenarios. Uses native fetch — no library needed.
 *
 * Usage:
 *   tsx src/load-test.ts <url> <count> [concurrency=10] [abortAfterMs=0] [memoryEvery=200] [method=GET]
 *
 * - `{i}` anywhere in <url> is replaced with the 0-based request index (e.g. to vary a query param).
 * - abortAfterMs > 0 aborts each request after that many ms — needed for the SSE endpoint in
 *   scenario 2, where a plain fetch would otherwise hang forever waiting for the response to end.
 * - Every `memoryEvery` completed requests, GETs `<origin>/memory` on the target server and prints it.
 */

const [, , urlArg, countArg, concurrencyArg, abortAfterMsArg, memoryEveryArg, methodArg] = process.argv;

if (!urlArg || !countArg) {
  console.error(
    'Usage: tsx src/load-test.ts <url> <count> [concurrency=10] [abortAfterMs=0] [memoryEvery=200] [method=GET]',
  );
  process.exit(1);
}

const count = Number(countArg);
const concurrency = Number(concurrencyArg ?? 10);
const abortAfterMs = Number(abortAfterMsArg ?? 0);
const memoryEvery = Number(memoryEveryArg ?? 200);
const method = methodArg ?? 'GET';
const origin = new URL(urlArg.replace('{i}', '0')).origin;

async function fireOne(i: number): Promise<void> {
  const url = urlArg.replace('{i}', String(i));
  const controller = abortAfterMs > 0 ? new AbortController() : undefined;
  const timer = controller ? setTimeout(() => controller.abort(), abortAfterMs) : undefined;
  try {
    const res = await fetch(url, { method, signal: controller?.signal });
    await res.arrayBuffer().catch(() => {});
  } catch {
    // expected when abortAfterMs cuts off a long-lived response (e.g. SSE)
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function printMemory(afterCount: number): Promise<void> {
  try {
    const res = await fetch(`${origin}/memory`);
    const mem = await res.json();
    console.log(`[after ${afterCount} requests]`, JSON.stringify(mem));
  } catch (err) {
    console.log(`[after ${afterCount} requests] failed to fetch /memory:`, (err as Error).message);
  }
}

async function main(): Promise<void> {
  console.log(
    `Firing ${count} requests at ${urlArg} (concurrency=${concurrency}, abortAfterMs=${abortAfterMs}, method=${method})`,
  );

  let completed = 0;
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < count) {
      const i = nextIndex++;
      await fireOne(i);
      completed++;
      if (completed % memoryEvery === 0) await printMemory(completed);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  await printMemory(completed);
  console.log('Done.');
}

main();
