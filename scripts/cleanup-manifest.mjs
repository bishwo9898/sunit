import fs from 'node:fs/promises';
import fssync from 'node:fs';
import path from 'node:path';

const manifestPath = path.join(process.cwd(), 'public', 'images.manifest.json');
const recentsDir = path.join(process.cwd(), 'public', 'optimized', 'recents');

async function main() {
  try {
    const raw = await fs.readFile(manifestPath, 'utf8');
    let data = [];
    try {
      data = JSON.parse(raw);
      if (!Array.isArray(data)) data = [];
    } catch {
      data = [];
    }
    const before = data.length;
    const filtered = data.filter((it) => {
      const cat = it?.category || '';
      const src = String(it?.src || '');
      const orig = String(it?.original || '');
      if (cat === 'recents') return false;
      if (src.includes('/optimized/recents/')) return false;
      if (orig.includes('/recents/')) return false;
      return true;
    });
    // de-dupe by src
    const seen = new Set();
    const deduped = [];
    for (const it of filtered) {
      const key = it?.src || JSON.stringify(it);
      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push(it);
    }
    const after = deduped.length;
    await fs.writeFile(manifestPath, JSON.stringify(deduped, null, 2));
    console.log(`Cleaned manifest: ${before} -> ${after}`);
  } catch (err) {
    console.error('Failed to clean manifest:', err);
  }

  try {
    if (fssync.existsSync(recentsDir)) {
      await fs.rm(recentsDir, { recursive: true, force: true });
      console.log('Removed directory:', recentsDir);
    } else {
      console.log('No recents directory to remove:', recentsDir);
    }
  } catch (err) {
    console.error('Failed to remove recents dir:', err);
  }
}

main();
