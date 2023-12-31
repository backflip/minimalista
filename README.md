# Minimalista

Minimalistic Node.js web framework. No dependencies, based on Node.js standard library.

## Install

```bash
npm install backflip/minimalista
```

## Use

See [example](./example).

```js
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { App } from "backflip/minimalista/lib/app.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = new App({
  staticDir: resolve(__dirname, "public"),
  routesDir: resolve(__dirname, "routes"),
});

app.start();
```
