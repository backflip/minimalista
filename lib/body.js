/**
 * Get POST request body.
 *
 * @param {import('node:http').IncomingMessage} req
 * @returns {Promise<Buffer>}
 */
export async function getBody(req) {
  const body = await new Promise((resolve) => {
    let data = [];

    req
      .on("data", (chunk) => {
        data.push(chunk);
      })
      .on("end", () => {
        return resolve(Buffer.concat(data));
      });
  });

  return body;
}

/**
 * Parse POST request body.
 *
 * @param {import('node:http').IncomingMessage} req
 * @returns {Promise<{ [key: string]: string | string[] }>}
 */
export async function parseBody(req) {
  const isJson = req.headers["content-type"].match(/^application\/json/);
  const body = await getBody(req);

  const str = body.toString();

  if (isJson) {
    return JSON.parse(str);
  }

  const searchParams = new URLSearchParams(str);
  const obj = {};

  for (const key of searchParams.keys()) {
    const values = searchParams.getAll(key);

    obj[key] = values.length > 1 ? values : values[0];
  }

  // @ts-ignore Empty object
  return obj;
}
