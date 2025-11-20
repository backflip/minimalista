import http from "node:http";
import { createStaticFileHandler } from "./static.js";
import { createLiveReloadHandler } from "./livereload.js";
import { getRoutes, normalizePath } from "./route.js";

export class App {
  /**
   * @param {object} options
   * @param {string} options.staticDir
   * @param {string} options.routesDir
   * @param {number} [options.port=3000]
   * @param {string} [options.staticPath="public"]
   * @param {Array<Function>} [options.middlewares]
   * @param {(err: Error) => void} [options.onError=console.error]
   */
  constructor({
    staticDir,
    routesDir,
    port = 3000,
    staticPath = "public",
    middlewares = [],
    onError = console.error,
  }) {
    this.staticDir = staticDir;
    this.routesDir = routesDir;
    this.port = port;
    this.staticPath = staticPath;
    this.middlewares = middlewares;
    this.onError = onError;
  }

  async start() {
    this.routes = await getRoutes({
      routesDir: this.routesDir,
    });

    this.server = http.createServer(
      /**
       * @param {import('http').IncomingMessage} req
       * @param {import('http').ServerResponse} res
       */
      async (req, res) => {
        const onError = (err) => {
          this.onError(err);

          res.writeHead(404, { "Content-Type": "text/html" });
          res.end(`Fehler`);
        };

        // Middlewares
        let finished = false;

        try {
          for (const middleware of this.middlewares) {
            await new Promise((resolve) => {
              res.on("finish", () => {
                finished = true;

                resolve();
              });

              middleware(req, res, () => {
                resolve();
              });
            });

            if (finished) {
              break;
            }
          }
        } catch (err) {
          onError(err);

          return;
        }

        if (finished) {
          return;
        }

        const normalizedPath = normalizePath({ req });

        // Route `/api/_livereload`
        if (normalizedPath === "/api/_livereload") {
          return createLiveReloadHandler({
            watchDir: this.staticDir,
          })(req, res).catch(onError);
        }

        // Route: `/public
        if (normalizedPath.match(new RegExp(`^/${this.staticPath}`))) {
          return createStaticFileHandler({
            staticDir: this.staticDir,
            staticPath: this.staticPath,
          })(req, res).catch(onError);
        }

        // Page routes
        for (const route of this.routes) {
          if (route.matches(normalizedPath)) {
            return route.handler(req, res).catch(onError);
          }
        }

        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(`Not found`);
      }
    );

    this.server.on("error", (err) => {
      console.error(err);

      this.server.close();
    });

    this.server.listen(this.port, () => {
      console.log(
        `App is running on port ${this.port}: http://localhost:${this.port}`
      );
    });
  }
}
