import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { App } from "../lib/app.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = new App({
  staticDir: resolve(__dirname, "public"),
  routesDir: resolve(__dirname, "routes"),
  // @ts-ignore string | number
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
    (req, res, next) => {
      if (req._country) {
        console.log({
          url: req.url,
          originalUrl: req._originalUrl,
          country: req._country,
        });
      }

      next();
    },
  ],
  onError: (err) => console.error("custom", err),
});

app.start();
