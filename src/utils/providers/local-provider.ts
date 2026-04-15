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
    // In Vercel serverless functions, we use path.join(process.cwd(), ...) 
    // to ensure the file is resolved correctly from the deployment root.
    const manifestPath = path.join(process.cwd(), 'public', 'images.manifest.json');
    const content = await fs.readFile(manifestPath, 'utf8');
    const data = JSON.parse(content) as ImgItem[];
    
    if (!Array.isArray(data)) {
      console.error('[local-provider] Manifest is not an array');
      return [];
    }
    
    return data;
  } catch (err) {
    console.error('[local-provider] Failed to read images.manifest.json:', err);
    return [];
  }
}
