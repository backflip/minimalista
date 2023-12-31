import { isDevMode } from "../../../lib/dev.js";
import { getSlug } from "../../../lib/route.js";
import render from "../../lib/render.js";

/**
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 */
export default async function handler(req, res) {
  const slug = getSlug({ req });
  const html = render({
    title: "Info ${slug}",
    content: `<a href="/info">← Info</a>
    <h1>Info ${slug}</h1>`,
  });

  res.setHeader("Cache-Control", isDevMode ? `no-cache` : `max-age=86400`);
  res.end(html);
}
