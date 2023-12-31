import { parseBody } from "../../../lib/body.js";

/**
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 */
export default async function handler(req, res) {
  const body = await parseBody(req);

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ body }));
}
