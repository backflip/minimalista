import { isDevMode } from "../../../lib/dev.js";
import render from "../../lib/render.js";

/**
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 */
export default async function handler(req, res) {
  const html = render({
    title: "Info",
    content: `<a href="/">← Home</a>
    <h1>Info</h1>
    <ul>
      <li><a href="/info/my-slug">Info sub page</a></li>
      <li><a href="/info/my-slug-2">Info sub page 2</a></li>
    </ul>`,
  });

  res.setHeader("Cache-Control", isDevMode ? `no-cache` : `max-age=86400`);
  res.end(html);
}
