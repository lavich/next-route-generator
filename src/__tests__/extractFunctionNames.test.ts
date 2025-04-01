import { describe, expect, it } from "vitest";

import { extractFunctionNames } from "../extractFunctionNames";

describe("extractFunctionNames", () => {
  it("should extract function names from a file", () => {
    const fileContent = `
      export default function HomePage() {}
    `;

    const functionNames = extractFunctionNames(fileContent);
    expect(functionNames).toEqual("HomePage");
  });

  it("should extract function names from a file", () => {
    const fileContent = `
      const AboutPage = () => {}
      export default AboutPage;
    `;

    const functionNames = extractFunctionNames(fileContent);
    expect(functionNames).toEqual("AboutPage");
  });

  it("should extract function names with async", () => {
    const fileContent = `
      export default async function AsyncPage() {}
    `;

    const functionNames = extractFunctionNames(fileContent);
    expect(functionNames).toEqual("AsyncPage");
  });
});
