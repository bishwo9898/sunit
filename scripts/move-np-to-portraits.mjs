import fs from 'node:fs/promises';
import path from 'node:path';

const NP_DIR = path.join(process.cwd(), 'public', 'optimized', 'n_p');
const PORTRAITS_DIR = path.join(process.cwd(), 'public', 'optimized', 'portraits');
const MANIFEST = path.join(process.cwd(), 'public', 'images.manifest.json');

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function moveAll() {
  try {
    await ensureDir(PORTRAITS_DIR);
    const entries = await fs.readdir(NP_DIR, { withFileTypes: true }).catch(() => []);
    for (const e of entries) {
      if (!e.isFile()) continue;
      const src = path.join(NP_DIR, e.name);
      const dest = path.join(PORTRAITS_DIR, e.name);
      await fs.rename(src, dest).catch(async (err) => {
        if (err.code === 'EXDEV' || err.code === 'EEXIST') {
          const buf = await fs.readFile(src);
          await fs.writeFile(dest, buf);
          await fs.unlink(src);
        } else {
          throw err;
        }
      });
      console.log(`Moved: ${e.name}`);
    }
    // Clean up n_p folder if empty
    const remaining = await fs.readdir(NP_DIR).catch(() => []);
    if (remaining.length === 0) {
      await fs.rmdir(NP_DIR).catch(() => {});
      console.log('n_p is now empty and removed.');
    } else {
      console.log('n_p still contains entries:', remaining);
    }
  } catch (e) {
    console.error('Move phase error:', e);
  }
}

async function updateManifest() {
  try {
    const raw = await fs.readFile(MANIFEST, 'utf8').catch(() => '[]');
    /** @type {Array<any>} */
    const list = JSON.parse(raw || '[]');
    let changed = false;
    for (const item of list) {
      if (typeof item.src === 'string' && item.src.startsWith('/optimized/n_p/')) {
        item.src = item.src.replace('/optimized/n_p/', '/optimized/portraits/');
        changed = true;
      }
      if (item.category === 'n_p') {
        item.category = 'portraits';
        changed = true;
      }
      if (typeof item.original === 'string' && item.original.includes('/n_p/')) {
        item.original = item.original.replace('/n_p/', '/portraits/');
        changed = true;
      }
    }
    if (changed) {
      await fs.writeFile(MANIFEST, JSON.stringify(list, null, 2));
      console.log('Manifest updated to map n_p -> portraits');
    } else {
      console.log('No manifest changes needed.');
    }
  } catch (e) {
    console.error('Manifest phase error:', e);
  }
}

await moveAll();
await updateManifest();
