import { existsSync, mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

/**
 * Basic file system cache.
 * Usesful for offline mode, e.g.
 * Survives restarts.
 */
export class FileSystemCache {
  /**
   * @param {object} [options={}]
   * @param {string} [options.dir=".cache"] - directory to store files
   */
  constructor({ dir = ".cache" } = {}) {
    this.dir = dir;

    if (!existsSync(this.dir)) {
      mkdirSync(this.dir, { recursive: true });
    }
  }

  async get(key) {
    const filePath = resolve(this.dir, `${key}.json`);
    const value = (await import(filePath, { assert: { type: "json" } }))
      .default;

    return value;
  }

  async set(key, value) {
    const filePath = resolve(this.dir, `${key}.json`);

    await writeFile(filePath, JSON.stringify(value));
  }
}

export const fileSystemCache = new FileSystemCache();

/**
 * Basic in-memory cache using a map to store key-value pairs.
 * Each entry expires after `options.expiration`.
 */
export class InMemoryCache {
  /**
   * @param {object} [options={}]
   * @param {number} [options.expiration=1000 * 60 * 5] - expiration time in ms
   */
  constructor({ expiration = 1000 * 60 * 5 } = {}) {
    this.expiration = expiration;
    this.cache = new Map();
  }

  get(key) {
    const entry = this.cache.get(key);

    if (this.#isValid(entry)) {
      return entry.value;
    }

    if (entry) {
      this.cache.delete(key);
    }

    return null;
  }

  set(key, value) {
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  #isValid(entry) {
    if (!entry) {
      return false;
    }

    const isExpired = Date.now() - entry.timestamp > this.expiration;

    return !isExpired;
  }
}

export const inMemoryCache = new InMemoryCache();
