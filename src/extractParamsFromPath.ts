export function extractParamsFromPath(path: string): string[] {
  const paramRegex = /\[\.*(\w+)]/g;
  const matches = [];
  let match;
  while ((match = paramRegex.exec(path)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}
