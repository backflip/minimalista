/**
 * Parse POST request body.
 *
 * @param {import('node:http').IncomingMessage} req
 * @returns {Promise<{ [key: string]: string | string[] }>}
 */
export async function parseBody(req) {
  const isJson = req.headers["content-type"].match(/^application\/json/);

  const body = await new Promise((resolve) => {
    let data = [];

    req
      .on("data", (chunk) => {
        data.push(chunk);
      })
      .on("end", () => {
        const str = Buffer.concat(data).toString();

        if (isJson) {
          const obj = JSON.parse(str);

          return resolve(obj);
        }

        const searchParams = new URLSearchParams(str);
        const obj = {};

        for (const key of searchParams.keys()) {
          const values = searchParams.getAll(key);

          obj[key] = values.length > 1 ? values : values[0];
        }

        return resolve(obj);
      });
  });

  return body;
}
