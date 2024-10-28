export function normalizeQuerySpaces(query: string): string {
  return query.replace(/\s+/g, ' ').trim();
}
