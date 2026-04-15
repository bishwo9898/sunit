import { v2 as cloudinary } from 'cloudinary';
import type { ImgItem } from '../manifest.server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

// Map Cloudinary asset folder names → gallery category names
const ASSET_FOLDERS: Record<string, string> = {
  home:      'home',
  portraits: 'portraits',
  weddings:  'weddings',
};

async function fetchAssetFolder(folder: string, category: string): Promise<ImgItem[]> {
  const items: ImgItem[] = [];
  let nextCursor: string | undefined;

  do {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await cloudinary.api.resources_by_asset_folder(folder, {
      max_results: 500,
      next_cursor: nextCursor,
    });

    for (const r of result.resources ?? []) {
      const src = cloudinary.url(r.public_id, {
        width:        2400,
        crop:         'limit',
        quality:      'auto',
        fetch_format: 'auto',
        secure:       true,
        version:      r.version,
      });

      items.push({
        src,
        width:    r.width,
        height:   r.height,
        alt:      (r.context?.custom?.alt as string) ?? r.display_name ?? '',
        tags:     (r.tags as string[]) ?? [],
        category,
        original: r.secure_url,
      });
    }

    nextCursor = result.next_cursor;
  } while (nextCursor);

  return items;
}

export async function loadCloudinaryManifest(): Promise<ImgItem[]> {
  const entries = Object.entries(ASSET_FOLDERS);
  const results = await Promise.all(
    entries.map(([folder, category]) => fetchAssetFolder(folder, category))
  );
  return results.flat();
}
