import fs from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import sharp from 'sharp';

const OUT_DIR = path.join(process.cwd(), 'public', 'optimized', 'portraits');
const MANIFEST_PATH = path.join(process.cwd(), 'public', 'images.manifest.json');

const TARGET_LONG_EDGE = Number(process.env.LONG_EDGE || 2400);
const QUALITY = Number(process.env.JPG_QUALITY || 82);

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const files = await fg('**/*.{jpg,jpeg,png,webp,tif,tiff}', { cwd: OUT_DIR, onlyFiles: true });

  // Load existing manifest if present
  let manifest = [];
  try {
    const raw = await fs.readFile(MANIFEST_PATH, 'utf8');
    manifest = JSON.parse(raw || '[]');
  } catch {}

  const bySrc = new Map(manifest.map((m) => [m.src, m]));

  for (const rel of files) {
    const inPath = path.join(OUT_DIR, rel);
    const parsed = path.parse(rel);
    const base = parsed.name.toLowerCase().replace(/[^a-z0-9-_]+/g, '-').replace(/-{2,}/g, '-').replace(/^-|-$|/g, '');
    const outFile = `${base}.jpg`;
    const outPath = path.join(OUT_DIR, outFile);

    try {
      const stat = await fs.stat(inPath);
      const img = sharp(inPath, { limitInputPixels: false });
      const meta = await img.metadata();
      const isLandscape = (meta.width || 0) >= (meta.height || 0);

      const pipeline = img
        .rotate()
        .resize({
          width: isLandscape ? TARGET_LONG_EDGE : undefined,
          height: !isLandscape ? TARGET_LONG_EDGE : undefined,
          withoutEnlargement: true,
          fit: 'inside',
        })
        .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true, chromaSubsampling: '4:4:4' });

      await pipeline.toFile(outPath);

      // Generate blurDataURL
      const finalMeta = await sharp(outPath).metadata();
      const tiny = await sharp(outPath)
        .resize({ width: isLandscape ? 24 : undefined, height: !isLandscape ? 24 : undefined, fit: 'inside' })
        .jpeg({ quality: 40 })
        .toBuffer();
      const blurDataURL = `data:image/jpeg;base64,${tiny.toString('base64')}`;

      const src = path.posix.join('/optimized', 'portraits', outFile);

      // Upsert manifest entry
      const existing = bySrc.get(src);
      const item = {
        original: path.posix.join('/optimized', 'portraits', rel).replace(/\\/g, '/'),
        src,
        width: finalMeta.width || 0,
        height: finalMeta.height || 0,
        blurDataURL,
        alt: existing?.alt || '',
        tags: existing?.tags || [],
        category: 'portraits',
      };
      bySrc.set(src, item);

      console.log(`Re-encoded: ${rel} (${Math.round(stat.size/1e6)}MB) -> ${outFile}`);

      // If the source file was a huge PNG, optionally remove it once JPEG written
      if (parsed.ext.toLowerCase() === '.png') {
        await fs.unlink(inPath).catch(() => {});
      }

    } catch (e) {
      console.error('FAIL:', inPath, e.message);
    }
  }

  const nextManifest = Array.from(bySrc.values());
  await fs.writeFile(MANIFEST_PATH, JSON.stringify(nextManifest, null, 2));
  console.log(`Manifest updated: ${MANIFEST_PATH} (${nextManifest.length} images)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
