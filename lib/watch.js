import { watch } from "node:fs/promises";

/**
 * Watch a directory for changes and emit events.
 * Useful for live reloading, e.g.
 */
export class Watcher {
  constructor({ dir, onEmit }) {
    this.dir = dir;
    this.onEmit = onEmit;

    this.ac = new AbortController();

    this.watcher = watch(this.dir, {
      recursive: true,
      signal: this.ac.signal,
    });

    this.watch();
  }

  async watch() {
    try {
      for await (const event of this.watcher) {
        this.onEmit(event);
      }
    } catch (err) {
      if (err.name === "AbortError") {
        return;
      }

      throw err;
    }
  }

  close() {
    this.ac.abort();
  }
}
