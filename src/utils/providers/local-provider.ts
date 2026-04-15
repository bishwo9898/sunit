import fs from 'node:fs/promises';
import path from 'node:path';
import type { ImgItem } from '../manifest.server';

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.webp', '.png']);

// Maps public/optimized/<folder> → gallery category name
// Edit this if you rename or add folders.
const FOLDER_TO_CATEGORY: Record<string, string> = {
  home:      'home',
  hero:      'home',     // legacy: treat hero folder as home category
  recents:   'home',     // legacy: treat recents as home too
  portraits: 'portraits',
  weddings:  'weddings',
};

/**
 * Scan public/optimized/<folder> and return ImgItem entries.
 * Uses sharp for width/height metadata if available, otherwise falls back
 * to 0 (Next.js Image will still work with fill or layout="responsive").
 */
async function scanFolder(
  folderPath: string,
  category: string,
  publicUrl: string,
): Promise<ImgItem[]> {
  let files: string[];
  try {
    files = await fs.readdir(folderPath);
  } catch {
    return [];
  }

  const items: ImgItem[] = [];

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!IMAGE_EXTENSIONS.has(ext)) continue;

    const filePath = path.join(folderPath, file);
    const src = `${publicUrl}/${file}`;

    let width = 0;
    let height = 0;

    try {
      // Dynamically import sharp (optional — skip if not available)
      const sharp = (await import('sharp')).default;
      const meta = await sharp(filePath).metadata();
      width = meta.width ?? 0;
      height = meta.height ?? 0;
    } catch {
      // sharp unavailable or failed — dimensions will be unknown
    }

    items.push({
      src,
      width:    width || undefined,
      height:   height || undefined,
      alt:      '',
      tags:     [],
      category,
      original: src,
    });
  }

  return items;
}

export async function loadLocalManifest(): Promise<ImgItem[]> {
  const optimizedRoot = path.join(process.cwd(), 'public', 'optimized');
  const allItems: ImgItem[] = [];

  for (const [folder, category] of Object.entries(FOLDER_TO_CATEGORY)) {
    const folderPath = path.join(optimizedRoot, folder);
    const publicUrl = `/optimized/${folder}`;
    const items = await scanFolder(folderPath, category, publicUrl);
    allItems.push(...items);
  }

  return allItems;
}
