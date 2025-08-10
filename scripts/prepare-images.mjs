import fs from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import sharp from 'sharp';

// Configure input/output
const INPUT_DIRS = [
  'public/hero',
  'public/recents',
  'public/portraits',
  'public/weddings',
];
const OUTPUT_ROOT = 'public/optimized';
const MANIFEST_PATH = 'public/images.manifest.json';

// Safety: allow larger source files by default; can still be overridden via env
const MAX_INPUT_BYTES = Number(process.env.MAX_INPUT_BYTES || 150_000_000); // ~150MB default
const LONG_EDGE_HERO = Number(process.env.LONG_EDGE_HERO || 3840);
const LONG_EDGE_DEFAULT = Number(process.env.LONG_EDGE || 2400);

await fs.mkdir(OUTPUT_ROOT, { recursive: true });

/** @type {Array<{src:string,width:number,height:number,blurDataURL:string,alt:string,tags:string[],category:string,original:string}>} */
const manifest = [];

for (const dir of INPUT_DIRS) {
  const category = path.basename(dir);
  const pattern = '**/*.{jpg,jpeg,png,webp,tif,tiff}';
  const files = await fg(pattern, { cwd: dir, onlyFiles: true });
  if (files.length === 0) continue;

  const outDir = path.join(OUTPUT_ROOT, category);
  await fs.mkdir(outDir, { recursive: true });

  for (const rel of files) {
    const inPath = path.join(dir, rel);
    const stat = await fs.stat(inPath);
    if (stat.size > MAX_INPUT_BYTES) {
      console.log(`SKIP (too large for quick pass): ${inPath} (${Math.round(stat.size/1e6)}MB)`);
      continue;
    }

    const base = path.parse(rel).name
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-|-$|/g, '');
    const outFile = `${base}.jpg`;
    const outPath = path.join(outDir, outFile);

    try {
      const img = sharp(inPath, { limitInputPixels: false });
      const meta = await img.metadata();

    const isLandscape = (meta.width || 0) >= (meta.height || 0);
    const targetEdge = category === 'hero' ? LONG_EDGE_HERO : LONG_EDGE_DEFAULT;
  const pipeline = img
        .rotate()
        .resize({
      width: isLandscape ? targetEdge : undefined,
      height: !isLandscape ? targetEdge : undefined,
          withoutEnlargement: true,
          fit: 'inside',
        })
        .jpeg({ quality: 82, progressive: true, mozjpeg: true, chromaSubsampling: '4:4:4' });

  await pipeline.toFile(outPath);

  const finalMeta = await sharp(outPath).metadata();
  const tiny = await sharp(outPath)
        .resize({ width: isLandscape ? 24 : undefined, height: !isLandscape ? 24 : undefined, fit: 'inside' })
        .jpeg({ quality: 40 })
        .toBuffer();
      const blurDataURL = `data:image/jpeg;base64,${tiny.toString('base64')}`;

      manifest.push({
        original: path.posix.join('/', dir.replace(/^public\//, ''), rel).replace(/\\/g, '/'),
        src: path.posix.join('/optimized', category, outFile),
        width: finalMeta.width || 0,
        height: finalMeta.height || 0,
        blurDataURL,
        alt: '',
        tags: [],
        category,
      });
      console.log(`OK: ${inPath} -> ${outPath}`);
    } catch (err) {
      console.error(`FAIL: ${inPath}`, err);
    }
  }
}

await fs.mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
console.log(`Manifest written: ${MANIFEST_PATH} (${manifest.length} images)`);
