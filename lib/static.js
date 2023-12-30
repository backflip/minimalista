import { createReadStream } from "node:fs";
import { extname, join, normalize } from "node:path";
import { pipeline } from "node:stream";
import { createBrotliCompress } from "node:zlib";
import { isDevMode } from "./dev.js";

/**
 * Serve static files from file system.
 * Cache for a year unless in dev mode.
 * Compress with Brotli if supported by client.
 *
 * @param {object} options
 * @param {string} options.staticDir
 * @param {string} options.staticPath
 * @returns {(req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse) => Promise<void>}
 */
export function createStaticFileHandler({ staticDir, staticPath }) {
  return async (req, res) => {
    const requestUrl = new URL(req.url || "", `http://${req.headers.host}`);
    const normalizedPath = normalize(requestUrl.pathname).replace(
      new RegExp(`^/${staticPath}`),
      ""
    );
    const relativePath = join(staticDir, normalizedPath);
    const extension = extname(relativePath);

    const acceptEncoding = req.headers["accept-encoding"]?.toString() || "";

    const onError = (err) => {
      if (err) {
        console.error(err);

        res.end();
      }
    };

    const raw = createReadStream(relativePath);

    let contentType = "";

    switch (extension) {
      case ".css":
        contentType = "text/css";
        break;
      case ".js":
        contentType = "application/javascript";
        break;
    }

    res.setHeader("Vary", "Accept-Encoding");
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", isDevMode ? `no-cache` : `max-age=31536000`);

    if (/\bbr\b/.test(acceptEncoding)) {
      res.setHeader("Content-Encoding", "br");

      pipeline(raw, createBrotliCompress(), res, onError);

      return;
    }

    pipeline(raw, res, onError);
  };
}
