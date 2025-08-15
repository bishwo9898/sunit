export type ImgItem = {
  src: string;
  width: number;
  height: number;
  blurDataURL?: string;
  alt: string;
  tags?: string[];
  category?: string;
  original?: string;
};

export async function fetchManifest(): Promise<ImgItem[]> {
  try {
  const res = await fetch('/api/images', { cache: 'no-store' });
    if (!res.ok) return [];
  const list = (await res.json()) as ImgItem[];
  // src may be a local path (/optimized/...) or an absolute Blob URL; both are valid for next/image
  return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}
