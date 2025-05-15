export function normalizeCategory(category: string): string {
  return category
    .toLowerCase()                  // Convert to lowercase
    .replace(/\s+/g, '-')            // Replace spaces with hyphens
    .replace(/[^a-z0-9\-]/g, '')     // Remove non-alphanumeric characters except hyphens
}

