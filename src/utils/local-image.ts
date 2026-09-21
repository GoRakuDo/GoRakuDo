/** Cloudinary public ID または既存パスをローカル画像パスに変換 */
export function toLocalImage(idOrPath: string): string {
  if (idOrPath.startsWith('/') || idOrPath.startsWith('http')) return idOrPath;
  return `/images/cloudinary/${idOrPath}.webp`;
}
