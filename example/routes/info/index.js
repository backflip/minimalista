import { isDevMode } from "../../../lib/dev.js";
import { renderSvg } from "../../../lib/svg.js";
import render from "../../lib/render.js";
import html from "../../public/scripts/html.js";

/**
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 */
export default async function handler(req, res) {
  const content = render({
    title: "Info",
    content: html`<a href="/" class="back"
        >${renderSvg({
          name: "home",
          width: 16,
          height: 16,
        })}
        Home</a
      >
      <h1>Info</h1>
      <h2 class="menu">
        ${renderSvg({
          name: "menu",
          width: 32,
          height: 32,
        })}
        Menu
      </h2>
      <ul>
        <li><a href="/info/my-slug">Info sub page</a></li>
        <li><a href="/info/my-slug-2">Info sub page 2</a></li>
      </ul>`,
  });

  res.setHeader("Cache-Control", isDevMode ? `no-cache` : `max-age=86400`);
  res.end(content);
}
