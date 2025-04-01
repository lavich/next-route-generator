import path from "path";
import { Compiler } from "webpack";
import { generatePagesType } from "./generatePagesType";
import packageJson from "../package.json";

const PLUGIN_NAME = packageJson.name;

interface nextRoutePluginOptions {
  input?: string;
  output?: string;
}

export class NextRoutePlugin {
  private options: nextRoutePluginOptions;
  isGenerated = false;

  constructor(options: nextRoutePluginOptions = {}) {
    this.options = { ...options };
  }

  getName() {
    return this.constructor.name;
  }

  apply(compiler: Compiler): void {
    compiler.hooks.beforeCompile.tap(PLUGIN_NAME, () => {
      if (this.isGenerated) return;
      this.isGenerated = true;
      console.log(" ○ ", `${this.getName()} is generating sync pages...`);
      generatePagesType(
        path.join(process.cwd(), this.options.input || "./pages"),
        path.join(process.cwd(), this.options.output || "/"),
      );
      console.log(
        "\x1b[32m%s\x1b[0m",
        " ✓ ",
        `${this.getName()} finished generating pages.`,
      );
    });
  }
}
