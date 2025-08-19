import fs from 'node:fs/promises';
import path from 'node:path';

function blobEnabled() {
  return (
    !!process.env.BLOB_MANIFEST_URL &&
    !!process.env.BLOB_MANIFEST_KEY &&
    (process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL)
  );
}

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

export async function loadManifest(): Promise<ImgItem[]> {
  try {
    const normalize = (arr: ImgItem[]): ImgItem[] =>
      (arr || []).map((it) => {
        if (!it) return it as any;
        const copy = { ...it } as ImgItem;
        if (copy.category === 'n_p') copy.category = 'portraits';
        if (typeof copy.src === 'string')
          copy.src = copy.src.replace('/optimized/n_p/', '/optimized/portraits/');
        if (typeof copy.original === 'string')
          copy.original = copy.original.replace('/n_p/', '/portraits/');
        return copy;
      });
    // Prefer Blob manifest when configured (production)
    if (blobEnabled()) {
      try {
        const url = process.env.BLOB_MANIFEST_URL as string;
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const data = (await res.json()) as ImgItem[];
          if (Array.isArray(data)) return normalize(data);
        }
      } catch {}
    }
    const p = path.join(process.cwd(), 'public', 'images.manifest.json');
    const buf = await fs.readFile(p, 'utf8');
    const data = JSON.parse(buf) as ImgItem[];
    if (!Array.isArray(data)) return [];
    // Remap any legacy n_p entries to portraits to ensure they show in the portraits gallery
    return normalize(data);
  } catch {
    return [];
  }
}
