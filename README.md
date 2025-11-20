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
import { App } from "@responsive.ch/minimalista/lib/app.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = new App({
  staticDir: resolve(__dirname, "public"),
  routesDir: resolve(__dirname, "routes"),
  port: process.env.PORT || 3000,
  middlewares: [
    // Move country from `req.url` to `req._country`
    (req, res, next) => {
      const regExp = /^\/(ch|de|at)/;
      const [, country] = req.url.match(regExp) || [];

      if (country) {
        req._country = country;
        req._originalUrl = req.url;
        req.url = req.url.replace(regExp, "");
      }

      next();
    },
  ],
  onError: (err) => console.error(err),
});

app.start();
```
