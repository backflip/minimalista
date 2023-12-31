import http from "node:http";
import { createStaticFileHandler } from "./static.js";
import { createLiveReloadHandler } from "./livereload.js";
import { getRoutes, normalizePath } from "./route.js";

export class App {
  constructor({ staticDir, routesDir, port = 3000, staticPath = "public" }) {
    this.staticDir = staticDir;
    this.routesDir = routesDir;
    this.port = port;
    this.staticPath = staticPath;
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
          console.error(err);

          res.writeHead(404, { "Content-Type": "text/html" });
          res.end(`Fehler`);
        };

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
