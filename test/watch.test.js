import assert from "node:assert";
import test from "node:test";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, writeFile } from "node:fs/promises";

import { Watcher } from "../lib/watch.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("Watcher emits events", async (t) => {
  const dir = resolve(__dirname, ".tmp");
  const events = [];

  const fileName1 = "file1.txt";
  const fileName2 = "file2.txt";

  await mkdir(dir, { recursive: true });

  const watcher = new Watcher({
    dir,
    onEmit: (event) => {
      events.push(event);
    },
  });

  await writeFile(resolve(dir, fileName1), "");
  await writeFile(resolve(dir, fileName2), "");

  await new Promise((resolve) => setTimeout(resolve, 100));

  watcher.close();

  assert.equal(!!events.find((event) => event.filename === fileName1), true);
  assert.equal(!!events.find((event) => event.filename === fileName2), true);
});
