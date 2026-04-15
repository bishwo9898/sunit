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

/** Active image source. Defaults to local. */
const rawSource = process.env.IMAGE_SOURCE?.toLowerCase().trim();
const SOURCE = (rawSource === 'cloudinary' ? 'cloudinary' : 'local');

export async function loadManifest(): Promise<ImgItem[]> {
  console.log(`[manifest.server] Loading images from source: "${SOURCE}"`);
  try {
    if (SOURCE === 'cloudinary') {
      const { loadCloudinaryManifest } = await import('./providers/cloudinary-provider');
      return await loadCloudinaryManifest();
    }

    // Default: local public/images.manifest.json
    const { loadLocalManifest } = await import('./providers/local-provider');
    const items = await loadLocalManifest();
    console.log(`[manifest.server] Local provider returned ${items.length} images`);
    return items;
  } catch (err) {
    console.error(`[manifest.server] Failed to load images from "${SOURCE}":`, err);
    return [];
  }
}
