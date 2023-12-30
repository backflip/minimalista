import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { App } from "../lib/app.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = new App({
  rootDir: __dirname,
  staticDir: resolve(__dirname, "public"),
});

app.start();
