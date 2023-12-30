import { isDevMode } from "../../lib/dev.js";
import { createLiveReloadInject } from "../../lib/livereload.js";

export default function render({
  title,
  content,
  lang = "en",
  assetVersion = "1",
}) {
  return `<!DOCTYPE html>
    <html lang="${lang}">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title}</title>
        <link rel="stylesheet" href="/public/styles.css?v=${assetVersion}">
      </head>
      <body>
        ${content}
        ${isDevMode ? createLiveReloadInject() : ``}
      </body>
    </html>`;
}
