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
    const res = await fetch('/images.manifest.json', { cache: 'no-store' });
    if (!res.ok) return [];
    return (await res.json()) as ImgItem[];
  } catch {
    return [];
  }
}
