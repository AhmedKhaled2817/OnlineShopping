export interface ProductImageSource {
  thumbnail?: string | null;
  images?: (string | null | undefined)[] | null;
  category?: {
    image?: string | null;
  } | null;
}

export const FALLBACK_PRODUCT_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="700" viewBox="0 0 800 700"%3E%3Crect width="800" height="700" fill="%23141414"/%3E%3Crect x="86" y="78" width="628" height="544" rx="42" fill="%231f1f1f" stroke="%23333333" stroke-width="4"/%3E%3Cpath d="M240 442h320l-88-110-72 82-48-58-112 86Z" fill="%23d4af37" opacity=".8"/%3E%3Ccircle cx="315" cy="258" r="46" fill="%23f0d56a"/%3E%3Ctext x="400" y="545" text-anchor="middle" font-family="Arial" font-size="38" font-weight="700" fill="%23ffffff"%3ESHOPPING MALL%3C/text%3E%3C/svg%3E';

export function getProductImage(product: ProductImageSource): string {
  const sources = [
    product.thumbnail,
    ...(product.images ?? []),
    product.category?.image,
  ];

  return sources.find(isUsableProductImage) ?? FALLBACK_PRODUCT_IMAGE;
}

export function setFallbackProductImage(event: Event): void {
  const image = event.target as HTMLImageElement;
  image.src = FALLBACK_PRODUCT_IMAGE;
}

function isUsableProductImage(src: string | null | undefined): src is string {
  return !!src && !src.includes('alta.ge');
}
