import fs from 'node:fs/promises';
import fssync from 'node:fs';
import path from 'node:path';
import { put } from '@vercel/blob';

export type ImgItem = {
  src: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
  alt?: string;
  tags?: string[];
  category?: string;
  original?: string;
  collections?: string[]; // e.g., ['home', 'portraits', 'weddings']
};

export function blobEnabled() {
  return (
    !!process.env.BLOB_MANIFEST_URL &&
    !!process.env.BLOB_MANIFEST_KEY &&
    // In Vercel, token can be provided via integration; locally require env
    (process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL)
  );
}

export function getBlobBaseUrl(): string | undefined {
  if (!blobEnabled()) return undefined;
  try {
    const raw = process.env.BLOB_MANIFEST_URL as string; // e.g., https://<bucket>.public.blob.vercel-storage.com/images.manifest.json
    const u = new URL(raw);
    // Remove filename from pathname
    u.pathname = u.pathname.replace(/[^/]+$/, '');
    // Ensure trailing slash
    if (!u.pathname.endsWith('/')) u.pathname += '/';
    return u.toString();
  } catch {
    return undefined;
  }
}

export async function readBlobJson<T = unknown>(key: string): Promise<T | null> {
  const base = getBlobBaseUrl();
  if (!base) return null;
  try {
    const url = base + key.replace(/^\//, '');
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function writeBlobJson(key: string, data: unknown): Promise<void> {
  if (!blobEnabled()) return;
  const json = JSON.stringify(data, null, 2);
  const k = key.replace(/^\//, '');
  await put(k, json, {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  } as any);
}

export async function loadManifest(): Promise<ImgItem[]> {
  try {
    // Prefer Blob in production when configured
    if (blobEnabled()) {
      try {
        const url = process.env.BLOB_MANIFEST_URL as string;
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const data = (await res.json()) as ImgItem[];
          if (Array.isArray(data)) return data;
        }
      } catch {}
    }
    const p = path.join(process.cwd(), 'public', 'images.manifest.json');
    let buf = await fs.readFile(p, 'utf8');
    let data: ImgItem[];
    try {
      data = JSON.parse(buf) as ImgItem[];
    } catch {
      // Fallback to backup if primary is corrupted
      const bak = p + '.bak';
      if (fssync.existsSync(bak)) {
        const bakBuf = await fs.readFile(bak, 'utf8');
        data = JSON.parse(bakBuf) as ImgItem[];
      } else {
        throw new Error('manifest parse failed');
      }
    }
    if (!Array.isArray(data)) return [];
    // Hard filter: remove deprecated "recents" images and legacy hero folder entries
  const filtered = data.filter(
      (it) =>
        it.category !== 'recents' &&
        !(it.src || '').includes('/optimized/recents/') &&
        !(it.src || '').includes('/optimized/hero/')
    );

    // De-duplicate by src; merge tags/collections/metadata conservatively
    const bySrc = new Map<string, ImgItem>();
    for (const it of filtered) {
      const src = it.src || '';
      if (!src) continue;
      const existing = bySrc.get(src);
      if (!existing) {
        bySrc.set(src, { ...it, tags: it.tags ? [...new Set(it.tags)] : undefined, collections: it.collections ? [...new Set(it.collections)] : undefined });
      } else {
        const merged: ImgItem = {
          ...existing,
          // Prefer the first non-empty alt/category; keep existing if already present
          alt: existing.alt && existing.alt.length ? existing.alt : it.alt,
          category: existing.category || it.category,
          // Prefer known width/height if missing
          width: existing.width || it.width,
          height: existing.height || it.height,
          blurDataURL: existing.blurDataURL || it.blurDataURL,
          // Union tags & collections
          tags: Array.from(
            new Set([...(existing.tags || []), ...(it.tags || [])])
          ),
          collections: Array.from(
            new Set([...(existing.collections || []), ...(it.collections || [])])
          ),
        };
        bySrc.set(src, merged);
      }
    }

    // Sanitize final list: ensure required fields and safe defaults
    const safe: ImgItem[] = Array.from(bySrc.values())
      .filter((m) => typeof m.src === 'string' && m.src.length > 0)
      .map((m) => ({
        src: m.src,
        width: typeof m.width === 'number' && m.width > 0 ? m.width : 1600,
        height: typeof m.height === 'number' && m.height > 0 ? m.height : 1200,
        blurDataURL: typeof m.blurDataURL === 'string' ? m.blurDataURL : undefined,
        alt: typeof m.alt === 'string' ? m.alt : '',
        tags: Array.isArray(m.tags) ? m.tags : [],
        category: typeof m.category === 'string' ? m.category : undefined,
        original: typeof m.original === 'string' ? m.original : undefined,
        collections: Array.isArray(m.collections) ? m.collections : [],
      }));

    return safe;
  } catch {
    return [];
  }
}

// Simple per-process write queue to avoid concurrent writes clobbering
let writeQueue: Promise<void> = Promise.resolve();

async function writeAtomic(jsonPath: string, content: string): Promise<void> {
  const tmpPath = jsonPath + '.tmp';
  const bakPath = jsonPath + '.bak';
  try {
    // Backup current file (best effort)
    if (fssync.existsSync(jsonPath)) {
      const current = await fs.readFile(jsonPath, 'utf8');
      await fs.writeFile(bakPath, current);
    }
  } catch {}
  // Write to temp then rename
  await fs.writeFile(tmpPath, content);
  await fs.rename(tmpPath, jsonPath);
}

export async function saveManifest(list: ImgItem[]): Promise<void> {
  const payload = JSON.stringify(list, null, 2);
  if (blobEnabled()) {
    // Write to Vercel Blob; key must be stable and public
    const key = process.env.BLOB_MANIFEST_KEY as string; // e.g., images.manifest.json
    // @vercel/blob automatically reads token from env in Vercel; locally set BLOB_READ_WRITE_TOKEN
    await put(key, payload, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    } as any);
    return;
  }
  const jsonPath = path.join(process.cwd(), 'public', 'images.manifest.json');
  // serialize writes
  writeQueue = writeQueue.then(() => writeAtomic(jsonPath, payload)).catch(() => {});
  await writeQueue;
}

export async function updateManifest(mutator: (list: ImgItem[]) => Promise<ImgItem[] | void> | (ImgItem[] | void)) {
  // Chain on the writeQueue to serialize read-modify-write cycles
  const run = async () => {
    const list = await loadManifest();
    const updated = (await mutator(list)) || list;
    await saveManifest(updated);
  };
  writeQueue = writeQueue.then(run).catch(() => {});
  await writeQueue;
}
