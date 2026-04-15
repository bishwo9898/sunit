import fs from 'node:fs/promises';
import path from 'node:path';
import type { ImgItem } from '../manifest.server';

/**
 * Local image provider for local development or static hosting.
 * Reads image metadata from a pre-generated manifest file.
 * This is the most reliable way to serve local images on Vercel.
 */
export async function loadLocalManifest(): Promise<ImgItem[]> {
  try {
    const manifestPath = path.join(process.cwd(), 'public', 'images.manifest.json');
    console.log(`[local-provider] Attempting to read manifest from: ${manifestPath}`);
    
    try {
      await fs.access(manifestPath);
    } catch {
      console.error(`[local-provider] Manifest file NOT found at: ${manifestPath}`);
      return [];
    }

    const content = await fs.readFile(manifestPath, 'utf8');
    const data = JSON.parse(content) as ImgItem[];
    
    if (!Array.isArray(data)) {
      console.error('[local-provider] Manifest content is not an array');
      return [];
    }
    
    return data;
  } catch (err: any) {
    console.error('[local-provider] Error in loadLocalManifest:', err.message);
    return [];
  }
}
