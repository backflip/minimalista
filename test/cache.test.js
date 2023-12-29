import assert from "node:assert";
import test from "node:test";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { InMemoryCache, FileSystemCache } from "../lib/cache.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("InMemoryCache returns cached value", async (t) => {
  const cache = new InMemoryCache();

  const key = "keyDefaultExpiration";
  const value = new Date().getTime();

  cache.set(key, value);

  await new Promise((resolve) => setTimeout(resolve, 100));

  const cachedValue = cache.get(key);

  assert.strictEqual(cachedValue, value);
});

test("InMemoryCache accepts custom expiration", async (t) => {
  const cache = new InMemoryCache({ expiration: 50 });

  const key = "keyCustomExpiration";
  const value = new Date().getTime();

  cache.set(key, value);

  await new Promise((resolve) => setTimeout(resolve, 100));

  const cachedValue = cache.get(key);

  assert.equal(cachedValue, null);
});

test("FileSystemCache returns cached value", async (t) => {
  const cache = new FileSystemCache({ dir: resolve(__dirname, ".cache") });
  const value = new Date().getTime();

  await cache.set("key", value);

  const cachedValue = await cache.get("key");

  assert.strictEqual(cachedValue, value);
});
