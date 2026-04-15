/**
 * Image source router
 * ─────────────────────────────────────────────────────────────────────────────
 * Controls which backend serves all gallery & hero images across the site.
 *
 * To switch sources, set IMAGE_SOURCE in .env.local:
 *
 *   IMAGE_SOURCE=local        → scans public/optimized/* (default)
 *   IMAGE_SOURCE=cloudinary   → fetches from Cloudinary asset folders
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type ImgItem = {
  src: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
  alt?: string;
  tags?: string[];
  category?: string;
  original?: string;
};

/** Active image source. Change IMAGE_SOURCE in .env.local to switch. */
const SOURCE = (process.env.IMAGE_SOURCE ?? 'local') as 'local' | 'cloudinary';

export async function loadManifest(): Promise<ImgItem[]> {
  try {
    if (SOURCE === 'cloudinary') {
      const { loadCloudinaryManifest } = await import('./providers/cloudinary-provider');
      return await loadCloudinaryManifest();
    }

    // Default: local public/optimized/* folders
    const { loadLocalManifest } = await import('./providers/local-provider');
    return await loadLocalManifest();
  } catch (err) {
    console.error(`[manifest.server] Failed to load images from "${SOURCE}":`, err);
    return [];
  }
}
