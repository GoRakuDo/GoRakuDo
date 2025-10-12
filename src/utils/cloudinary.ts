// Cloudinary設定
const CLOUDINARY_CLOUD_NAME = 'dbvd1cm7u';
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}`;

/**
 * Public IDからCloudinary URLを構築（最適化付き）
 */
export const buildCloudinaryUrl = (publicId: string, options?: { format?: string; quality?: string; width?: number }): string => {
 if (publicId.startsWith('http://') || publicId.startsWith('https://')) return publicId;
 const transformations = [`f_${options?.format || 'auto'}`, `q_${options?.quality || 'auto'}`];
 if (options?.width) transformations.push(`w_${options.width}`);
 return `${CLOUDINARY_BASE_URL}/image/upload/${transformations.join(',')}/${publicId}`;
};

/**
 * フルURLを返す（最適化なし）
 */
export const getCloudinaryUrl = (publicId: string): string =>
 publicId.startsWith('http') ? publicId : `${CLOUDINARY_BASE_URL}/image/upload/${publicId}`;

