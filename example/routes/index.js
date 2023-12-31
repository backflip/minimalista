import { isDevMode } from "../../lib/dev.js";
import render from "../lib/render.js";

/**
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 */
export default async function handler(req, res) {
  const html = render({
    title: "Index",
    content: `<h1>Info</h1>
    <ul>
      <li><a href="/info">Info overview page</a></li>
    </ul>
    <h2>Client-side component</h2>
    <my-component></my-component>`,
  });

  res.setHeader("Cache-Control", isDevMode ? `no-cache` : `max-age=86400`);
  res.end(html);
}
