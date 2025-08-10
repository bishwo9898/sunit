import fs from 'node:fs/promises';
import path from 'node:path';

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
    const p = path.join(process.cwd(), 'public', 'images.manifest.json');
    const buf = await fs.readFile(p, 'utf8');
    const data = JSON.parse(buf) as ImgItem[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
