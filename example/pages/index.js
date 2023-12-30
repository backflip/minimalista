import render from "../lib/render.js";

/**
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 */
export default async function handler(req, res) {
  const html = render({
    title: "Hello World",
    content: `<p>Hello World</p>`,
  });

  res.end(html);
}
