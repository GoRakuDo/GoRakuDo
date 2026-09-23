/** Return an explicit image path; warn while legacy bare IDs are being removed. */
export function toLocalImage(idOrPath: string): string {
  if (idOrPath.startsWith('/') || idOrPath.startsWith('http')) return idOrPath;

  if (import.meta.env.DEV) {
    console.warn(`[toLocalImage] Bare image ID is unsupported: ${idOrPath}`);
  }

  return idOrPath;
}
