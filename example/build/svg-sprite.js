import SVGSpriter from "svg-sprite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateSvgSprite } from "../../lib/svg.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

await generateSvgSprite({
  SVGSpriter,
  srcDir: resolve(__dirname, "../public/media/icons"),
  distDir: resolve(__dirname, "../public/media/"),
  distFile: "sprite.svg",
});

export default {};
