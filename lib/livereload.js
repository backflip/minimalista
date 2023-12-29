import { Watcher } from "./watch";

/**
 * Create event stream based on file watcher.
 *
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 * @param {object} options
 * @param {string} options.watchDir
 */
export default async function liveReloadHandler(req, res, { watchDir }) {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };

  res.writeHead(200, headers);

  new Watcher({
    dir: watchDir,
    onEmit: (event) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    },
  });

  return;
}

/**
 * Consume event stream in client and reload page on change.
 *
 * @param {object} [options]
 * @param {object} [options.apiEndpoint="/api/dev"]
 * @param {object} [options.reloadTimeout=100] - Give the server some time to restart before reloading
 * @returns {string}
 */
export function createLiveReloadInject({
  apiEndpoint = "/api/dev",
  reloadTimeout = 100,
} = {}) {
  return `<script>
    const subscription = new EventSource(${apiEndpoint});
    subscription.addEventListener('message', (event) => {
      const parsedEvent = JSON.parse(event.data);
      console.log(parsedEvent);
      location.reload();
    });
    subscription.addEventListener('error', (error) => {
      console.log(error);
      setTimeout(() => {
        location.reload()
      }, ${reloadTimeout}});
    });
  </script>`;
}
