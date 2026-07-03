import { v2 as cloudinary } from 'cloudinary';
import type { ImgItem } from '../manifest.server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Map Gallery Categories → Cloudinary Asset Folder names
 * ─────────────────────────────────────────────────────────────────────────────
 * Diagnostic confirmed actual root-level folders are:
 *   "recents", "portraits", "weddings", "hero"
 * The "Home" shown in the Cloudinary sidebar is the ACCOUNT name, not a folder.
 */
const ASSET_FOLDERS: Record<string, string> = {
  home: 'recents',   // "home" gallery pulls from the "recents" folder
  portraits: 'portraits',
  weddings: 'weddings',
  hero: 'hero',
};

async function fetchAssetFolder(folder: string, category: string): Promise<ImgItem[]> {
  const items: ImgItem[] = [];
  let nextCursor: string | undefined;

  console.log(`[cloudinary-provider] Fetching from asset_folder: "${folder}" → category: "${category}"`);

  try {
    do {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await cloudinary.api.resources_by_asset_folder(folder, {
        max_results: 500,
        next_cursor: nextCursor,
        context: true,
        tags: true,
      });

      console.log(`[cloudinary-provider] "${folder}": found ${result.resources?.length ?? 0} images`);

      for (const r of result.resources ?? []) {
        const src = cloudinary.url(r.public_id, {
          width: 2000,
          crop: 'limit',
          quality: 'auto',
          fetch_format: 'auto',
          secure: true,
          version: r.version,
        });

        items.push({
          src,
          width: r.width,
          height: r.height,
          alt: (r.context?.custom?.alt as string) ?? r.display_name ?? '',
          tags: (r.tags as string[]) ?? [],
          category,
          original: r.secure_url,
        });
      }

      nextCursor = result.next_cursor;
    } while (nextCursor);
  } catch (err: any) {
    console.error(`[cloudinary-provider] Error fetching "${folder}":`, err?.error ?? err?.message ?? JSON.stringify(err));
  }

  return items;
}

export async function loadCloudinaryManifest(): Promise<ImgItem[]> {
  const entries = Object.entries(ASSET_FOLDERS);
  const results = await Promise.all(
    entries.map(([category, folder]) => fetchAssetFolder(folder, category))
  );

  const allImages = results.flat();
  console.log(`[cloudinary-provider] Total images loaded from Cloudinary: ${allImages.length}`);

  return allImages;
}
