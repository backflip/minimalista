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
        <link rel="stylesheet" href="/public/styles/main.css?v=${assetVersion}">
      </head>
      <body>
        ${content}
        ${isDevMode ? createLiveReloadInject() : ``}
        <script type="importmap">
          {
            "imports": {
              "component": "/public/scripts/component.js?v=${assetVersion}"
            }
          }
        </script>
        <script src="/public/scripts/main.js?v=${assetVersion}" type="module"></script>
      </body>
    </html>`;
}
