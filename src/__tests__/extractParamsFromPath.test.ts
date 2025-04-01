import { describe, expect, it } from "vitest";

import { extractParamsFromPath } from "../extractParamsFromPath";

describe("extractParamsFromPath", () => {
  it("should extract parameters from a path", () => {
    const path = "/products/[id]/[slug]";
    const params = extractParamsFromPath(path);
    expect(params).toEqual(["id", "slug"]);
  });

  it("should extract parameters from a path", () => {
    const path = "/products/[...slug]";
    const params = extractParamsFromPath(path);
    expect(params).toEqual(["slug"]);
  });

  it("should return an empty array if there are no parameters", () => {
    const path = "/about";
    const params = extractParamsFromPath(path);
    expect(params).toEqual([]);
  });
});
