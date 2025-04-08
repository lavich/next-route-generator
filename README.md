# Next Route Generator

[![npm version](https://img.shields.io/npm/v/next-route-generator)](https://www.npmjs.com/package/next-route-generator)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Next Route Generator is a tool for automatically generating typed routes in Next.js projects. The package provides:

1. **A Next.js plugin** that analyzes your page structure and generates a typed object with routes.
2. **A `RouteGenerator` class** that allows you to easily create URLs based on the generated routes.

---

## Installation

Install the package via npm:

```bash
npm install next-route-generator
```

Or via yarn:

```bash
yarn add next-route-generator
```

---

## Usage

### 1. Plugin Configuration

Add the plugin to your `next.config.js`:

```typescript
import { NextRoutePlugin } from "next-route-generator/nextRoutePlugin";

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new NextRoutePlugin({
          input: "./app",
          output: "./src",
        }),
      );
    }
    return config;
  },
};
```

After running the build (`npm run build` or `next build`), a `pages.ts` file with typed routes will be created in the specified folder.

### 2. Using RouteGenerator

Import the generated routes and use `RouteGenerator` to create URLs:

```typescript
import { RouteGenerator } from "next-route-generator/routeGenerator";
import { pages } from "../src/pages"; // The generated file

// Create an instance of RouteGenerator
const routeGenerator = new RouteGenerator(pages, {
  basePath: "/my-app", // (optional) a base path that will be prepended to all generated routes
});

// Generate a URL for a static page
const homeUrl = routeGenerator.getRouteByPageName("HomePage"); // /my-app/home

// Generate a URL with dynamic parameters
const elementUrl = routeGenerator.getRouteByPageName("ElementPage", {
  params: { id: "123" },
  query: { foo: "bar" },
}); // /my-app/elements/123?foo=bar
```

### 3. Example of the Generated `routes.ts` file

After the plugin runs, a `routes.ts` file will be created with the following structure:

```typescript
import { Pages } from "next-route-generator/routeGenerator";

export const pages = {
  HomePage: {
    path: "/home",
  },
  ElementPage: {
    path: "/elements/[id]",
    params: ["id"],
  },
  ElementsPage: {
    path: "/elements",
  },
} as const satisfies Pages;
```

---

### API

#### `nextRoutePlugin`

A Next.js plugin that generates typed routes.

Parameters

- `directory` (string): Path to the folder containing your pages (e.g., `./pages` or `./app`).
- `output` (string): Folder to save the generated file (e.g., `./src/generated`).

---

#### `RouteGenerator`

A class for generating URLs based on the generated routes.

Constructor:

```typescript
constructor(
  private readonly pages: Pages,
  private options?: RouteGeneratorOptions,
)
```

- `pages` (`P extends Pages`): The typed pages object that contains all the routes.

- `options` (`RouteGeneratorOptions`, optional): Optional configuration object.

  - `basePath` (`string`, optional): A base path to prepend to all generated URLs.

Methods

- `getRouteByPageName<PageName>(pageName: PageName, options?: RouteOptions<PageName, Pages>): string`

Generates a URL for the specified page.

- pageName: The name of the page (key from the generated pages object).
- options: Route parameters (if any):
  - params: An object with dynamic route parameters.
  - query: An object with query parameters.

---

### Examples

Generating a URL without parameters

```typescript
const url = routeGenerator.getRouteByPageName("HomePage");
console.log(url); // /home
```

Generating a URL with dynamic parameters

```typescript
const url = routeGenerator.getRouteByPageName("ElementPage", {
  params: { id: "123" },
});
console.log(url); // /elements/123
```

Generating a URL with query parameters

```typescript
const url = routeGenerator.getRouteByPageName("ElementPage", {
  params: { id: "123" },
  query: { foo: "bar", baz: "qux" },
});
console.log(url); // /elements/123?foo=bar&baz=qux
```
