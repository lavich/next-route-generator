import { describe, expect, it } from "vitest";

import { Pages } from "../types";
import { RouteGenerator } from "../routeGenerator";

const pages = {
  PageName: { path: "/home/about" },
  PageId: { path: "/home/[param1]/[param2]", params: ["param1", "param2"] },
} as const satisfies Pages;

const router = new RouteGenerator(pages);

describe("getRoute Function", () => {
  it("should return correct path for a simple page without query", () => {
    expect(router.getRouteByPageName("PageName")).toBe("/home/about");
  });

  it("should return correct path for a simple page with query", () => {
    expect(
      router.getRouteByPageName("PageName", { query: { foo: "bar" } }),
    ).toBe("/home/about?foo=bar");
  });

  it("should return correct path for a page with params and query", () => {
    expect(
      router.getRouteByPageName("PageId", {
        params: { param1: "test1", param2: "rest" },
        query: { foo: "bar" },
      }),
    ).toBe("/home/test1/rest?foo=bar");
  });

  it("should return correct path when query parameters contain arrays", () => {
    expect(
      router.getRouteByPageName("PageId", {
        params: { param1: "test1", param2: "rest" },
        query: { foo: ["bar", "baz"] },
      }),
    ).toBe("/home/test1/rest?foo=bar&foo=baz");
  });

  it("should throw error if page is incorrect", () => {
    // @ts-expect-error
    expect(() => router.getRouteByPageName("PageUnknown")).toThrowError(
      "Unknown path: PageUnknown",
    );
  });

  it("should throw error if required params are missing", () => {
    expect(() =>
      // @ts-expect-error Missing param2
      router.getRouteByPageName("PageId", { params: { param1: "test1" } }),
    ).toThrowError("Missing parameter: param2");
  });

  it("should throw error if extra params are provided", () => {
    expect(
      // @ts-expect-error
      router.getRouteByPageName("PageId", {
        params: { param1: "test1", param2: "test2", param3: "extra" },
      }),
    ).toBe("/home/test1/test2");
  });

  it("should ignore extra query parameters on simple pages", () => {
    expect(
      // @ts-expect-error
      router.getRouteByPageName("PageName", { query3: { foo: "bar" } }),
    ).toBe("/home/about");
  });

  it("should handle empty query parameters gracefully", () => {
    expect(router.getRouteByPageName("PageName", { query: {} })).toBe(
      "/home/about",
    );
  });

  it("should handle pages with params but no query", () => {
    expect(
      router.getRouteByPageName("PageId", {
        params: { param1: "only", param2: "params" },
      }),
    ).toBe("/home/only/params");
  });

  it("should throw error if params are partially provided", () => {
    expect(() =>
      // @ts-expect-error
      router.getRouteByPageName("PageId", { params: { param1: "partial" } }),
    ).toThrowError("Missing parameter: param2");
  });

  it("should throw error if params are partially provided", () => {
    // @ts-expect-error
    expect(router.getRouteByPageName("PageId")).toBe("/home/[param1]/[param2]");
  });
});
