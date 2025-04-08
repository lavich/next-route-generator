import * as fs from "fs";
import path from "node:path";
import type { Pages } from "./types";
import packageJson from "../package.json";
import { extractParamsFromPath } from "./extractParamsFromPath";
import { extractFunctionNames } from "./extractFunctionNames";
import type { Dirent } from "node:fs";

export function generatePagesType(directory: string, output = directory): void {
  const pages = generatePages(directory);
  const typeDefinition = `import type { Pages } from "${packageJson.name}/routeGenerator";\n
export const pages = ${JSON.stringify(pages, null, 2)} as const satisfies Pages;\n`;
  fs.writeFileSync(path.join(output, "pages.ts"), typeDefinition);
}

const isPageFile = (item: Dirent) =>
  item.isFile() && /(page)\.(tsx|jsx)$/i.test(item.name);

export function generatePages(directory: string): Pages {
  try {
    fs.accessSync(directory);
  } catch (err) {
    throw new Error(`Directory ${directory} does not exist.`);
  }

  function readDirectory(dir: string): Pages {
    const pages: Pages = {};
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        Object.assign(pages, readDirectory(fullPath));
      } else if (isPageFile(item)) {
        const fileContent = fs.readFileSync(fullPath, "utf8");
        const functionName = extractFunctionNames(fileContent);
        if (!functionName) continue;
        const relativePath = fullPath
          .replace(directory, "/")
          .replace(/\/page\.(tsx|jsx)$/, "")
          .replace(/\\/g, "/")
          .replace(/\/\//g, "/");

        const params = extractParamsFromPath(relativePath);
        pages[functionName] = {
          path: relativePath,
          params: params.length > 0 ? params : undefined,
        };
      }
    }

    return pages;
  }

  return readDirectory(directory);
}
