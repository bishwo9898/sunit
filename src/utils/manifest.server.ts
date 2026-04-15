import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

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

// Map Cloudinary folder names → gallery category names used by the site
const FOLDER_TO_CATEGORY: Record<string, string> = {
  home:      'home',
  portraits: 'portraits',
  weddings:  'weddings',
};

/**
 * Fetch all resources from a Cloudinary folder, paginating through all results.
 */
async function fetchFolder(folder: string): Promise<ImgItem[]> {
  const items: ImgItem[] = [];
  let nextCursor: string | undefined;

  do {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await cloudinary.api.resources({
      type:        'upload',
      prefix:      `${folder}/`,
      resource_type: 'image',
      max_results: 500,
      next_cursor:  nextCursor,
    });

    const category = FOLDER_TO_CATEGORY[folder] ?? folder;

    for (const r of result.resources ?? []) {
      // Build a delivery URL at a sensible max-width for the gallery
      const src = cloudinary.url(r.public_id, {
        width:   2400,
        crop:    'limit',
        quality: 'auto',
        fetch_format: 'auto',
        secure:  true,
      });

      // Tiny blur placeholder (32px wide, low quality)
      const blurDataURL = cloudinary.url(r.public_id, {
        width:        24,
        crop:         'scale',
        quality:      30,
        fetch_format: 'jpg',
        secure:       true,
        effect:       'blur:200',
      });

      items.push({
        src,
        width:       r.width,
        height:      r.height,
        blurDataURL: `data:image/jpeg;base64,`, // placeholder; Cloudinary URLs work without base64
        alt:         (r.context?.custom?.alt as string) ?? '',
        tags:        (r.tags as string[]) ?? [],
        category,
        original:    src,
      });
    }

    nextCursor = result.next_cursor;
  } while (nextCursor);

  return items;
}

/**
 * Load all images from Cloudinary across all configured folders.
 * Results are cached for the lifetime of the server (Next.js static render)
 * or re-fetched on each dynamic request.
 */
export async function loadManifest(): Promise<ImgItem[]> {
  try {
    const folders = Object.keys(FOLDER_TO_CATEGORY);
    const results = await Promise.all(folders.map(fetchFolder));
    return results.flat();
  } catch (err) {
    console.error('[manifest.server] Cloudinary fetch failed:', err);
    return [];
  }
}
