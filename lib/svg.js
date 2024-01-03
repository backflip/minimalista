import { readFileSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

export function renderSvgSprite({ publicDir }) {
  const svgSprite = readFileSync(resolve(publicDir, "media/sprite.svg"));

  return svgSprite;
}

export function renderSvg({ name, width = undefined, height = undefined }) {
  return `<svg style="${width ? `width:${width}px;` : ``}${
    height ? `height:${height}px;` : ``
  }"><use xlink:href="#${name}" /></svg>`;
}

export async function generateSvgSprite({
  SVGSpriter,
  srcDir,
  distDir,
  distFile,
}) {
  const spriter = new SVGSpriter({
    dest: distDir,
    mode: {
      symbol: {
        // Remove `symbol/` dir
        sprite: `../${distFile}`,
      },
    },
    shape: {
      transform: [
        {
          svgo: {
            plugins: [
              { name: "preset-default" },
              {
                name: "removeAttrs",
                params: {
                  attrs: ["data.*", "style", "fill", "fill-rule", "clip-rule"],
                },
              },
              "removeXMLNS",
            ],
          },
        },
      ],
    },
  });

  // Add files
  const files = await readdir(srcDir, { recursive: true });

  for (const file of files) {
    const filePath = resolve(srcDir, file);
    const fileContent = await readFile(filePath);

    spriter.add(filePath, null, fileContent);
  }

  // Generate sprite
  /** @type {{ result: { symbol: { sprite: { path: import('node:fs').PathOrFileDescriptor; contents: Buffer } }}}} */
  const { result } = await spriter.compileAsync();

  // Write to file system
  await mkdir(distDir, { recursive: true });

  for (const mode of Object.values(result)) {
    for (const resource of Object.values(mode)) {
      // @ts-ignore PathOrFileDescripor|FileHandle mismatch
      await writeFile(resource.path, resource.contents);
    }
  }
}
