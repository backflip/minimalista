import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { isDevMode } from "../../lib/dev.js";
import { renderLiveReloadInject } from "../../lib/livereload.js";
import { renderSvgSprite } from "../../lib/svg.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const publicDir = resolve(__dirname, "../public");
const svgSprite = renderSvgSprite({ publicDir });
const liveReloadInject = renderLiveReloadInject();

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
				<div hidden>${svgSprite}</div>
        ${isDevMode ? liveReloadInject : ``}
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
