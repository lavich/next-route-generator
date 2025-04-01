export function extractFunctionNames(fileContent: string): string | undefined {
  const functionDeclarationRegex =
    /export\s+default\s+(?:async\s+)?function\s+(\w+)/;
  const variableExportRegex = /export\s+default\s+(\w+)/;

  const functionMatch = functionDeclarationRegex.exec(fileContent);
  if (functionMatch) {
    return functionMatch[1];
  }

  const variableMatch = variableExportRegex.exec(fileContent);
  if (variableMatch) {
    return variableMatch[1];
  }
}
