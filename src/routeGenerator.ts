import type { Pages } from "./types";

export type { Pages };

type ExtractParams<T> = T extends { params: readonly string[] }
  ? Record<T["params"][number], string>
  : undefined;

type RouteOptions<PageName extends keyof Pages, P extends Pages> =
  ExtractParams<P[PageName]> extends undefined
    ? { query: Record<string, string | string[]> }
    : {
        params: ExtractParams<P[PageName]>;
        query?: Record<string, string | string[]>;
      };

type PageNames<P extends Pages> = keyof P & string;

type RouteGeneratorOptions = {
  basePath?: string;
};

export class RouteGenerator<P extends Pages> {
  constructor(
    private readonly pages: P,
    private options?: RouteGeneratorOptions,
  ) {}

  getRouteByPageName<PageName extends PageNames<P>>(
    pageName: ExtractParams<P[PageName]> extends Record<string, unknown>
      ? PageName
      : never,
    options: RouteOptions<PageName, P>,
  ): string;

  getRouteByPageName<PageName extends PageNames<P>>(
    pageName: ExtractParams<P[PageName]> extends undefined ? PageName : never,
    options?: RouteOptions<PageName, P>,
  ): string;

  getRouteByPageName<PageName extends PageNames<P>>(
    page: PageName,
    options?: RouteOptions<PageName, P>,
  ): string {
    const pageConfig = this.pages[page];
    if (!pageConfig) {
      throw new Error(`Unknown path: ${page}`);
    }
    let path: string = pageConfig.path;

    if ("params" in pageConfig && options && "params" in options) {
      pageConfig.params?.forEach((param) => {
        if (!options.params || !(param in options.params)) {
          throw new Error(`Missing parameter: ${param}`);
        }
        path = path.replace(`[${param}]`, options.params[param]);
      });
    }

    if (options?.query) {
      const queryParams: string[] = [];
      Object.entries(options.query).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.push(`${key}=${v}`));
        } else {
          queryParams.push(`${key}=${value}`);
        }
      });

      if (queryParams.length > 0) {
        path += `?${queryParams.join("&")}`;
      }
    }

    if (this.options?.basePath) {
      path = this.options.basePath + "/" + path;
      path.replace(/\/\//g, "/");
    }

    return path;
  }
}
