import { getSlug } from "../../../lib/route.js";

/**
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 */
export default async function handler(req, res) {
  const slug = getSlug({ req });

  res.end(`Info ${slug}`);
}
