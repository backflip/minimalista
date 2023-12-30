import { lstat, readdir } from "node:fs/promises";
import { basename, dirname, join, normalize } from "node:path";

export async function getRoutes({ routesDir }) {
  const routesFiles = await readdir(routesDir, { recursive: true });
  const routeHandlers = (
    await Promise.all(
      routesFiles.map(async (routeFile) => {
        const handlerPath = join(routesDir, routeFile);

        if ((await lstat(handlerPath)).isDirectory()) {
          return null;
        }

        const routePath = `/${routeFile
          .replace(/(?:index)?\.js$/, "")
          .replace(/\/$/, "")}`;
        const handler = (await import(handlerPath)).default;

        return {
          matches: (normalizedPath) => {
            return matchesRoute({ routePath, normalizedPath });
          },
          handler,
        };
      })
    )
  ).filter(Boolean);

  return routeHandlers;
}

export function matchesRoute({ routePath, normalizedPath }) {
  const hasSlug = routePath.match(/\[slug\]$/);
  const routePaths = [routePath, `${routePath}/`];

  if (!hasSlug) {
    return routePaths.includes(normalizedPath);
  }

  const pathPrefix = routePath.replace(`/[slug]`, "");

  return pathPrefix === dirname(normalizedPath);
}

export function normalizePath({ req }) {
  const requestUrl = new URL(req.url || "", `http://${req.headers.host}`);
  const normalizedPath = normalize(requestUrl.pathname);

  return normalizedPath;
}

export function getSlug({ req }) {
  const normalizedPath = normalizePath({ req });
  const slug = basename(normalizedPath);

  return slug;
}
