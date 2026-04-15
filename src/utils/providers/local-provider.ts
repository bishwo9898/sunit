import type { ImgItem } from '../manifest.server';
import manifestData from '../../../public/images.manifest.json';

/**
 * Local image provider.
 * Uses a direct import of the manifest JSON to ensure it is bundled 
 * correctly by Next.js/Vercel in serverless environments.
 */
export async function loadLocalManifest(): Promise<ImgItem[]> {
  try {
    const data = manifestData as ImgItem[];
    
    if (!Array.isArray(data)) {
      console.error('[local-provider] Manifest content is not an array');
      return [];
    }
    
    return data;
  } catch (err: any) {
    console.error('[local-provider] Error loading bundled manifest:', err.message);
    return [];
  }
}
