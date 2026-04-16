import fs from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import sharp from 'sharp';

const PUBLIC_DIR = 'public';
const OPTIMIZED_DIR = path.join(PUBLIC_DIR, 'optimized');
const MANIFEST_PATH = path.join(PUBLIC_DIR, 'images.manifest.json');

// Load existing manifest
let manifest = [];
try {
    const data = await fs.readFile(MANIFEST_PATH, 'utf-8');
    manifest = JSON.parse(data);
} catch {
    console.log('No existing manifest found. Creating new one.');
}

// Create a set of existing src paths for quick lookup
const existing = new Set(manifest.map((item) => item.src));

// Find all images inside optimized folder
const files = await fg('**/*.{jpg,jpeg,png,webp}', {
    cwd: OPTIMIZED_DIR,
    onlyFiles: true,
});

let addedCount = 0;

for (const rel of files) {
    const fullPath = path.join(OPTIMIZED_DIR, rel);
    const srcPath = path.posix.join('/optimized', rel.replace(/\\/g, '/'));

    // Skip if already in manifest
    if (existing.has(srcPath)) continue;

    try {
        const meta = await sharp(fullPath).metadata();

        const category = rel.split('/')[0]; // hero, portraits, etc.

        manifest.push({
            src: srcPath,
            width: meta.width || 0,
            height: meta.height || 0,
            alt: '',
            tags: [],
            category: category === 'hero' ? 'home' : category,
            original: srcPath,
        });

        addedCount++;
        console.log(`Added: ${srcPath}`);
    } catch (err) {
        console.error(`Failed: ${srcPath}`, err);
    }
}

// Write updated manifest
await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

console.log(`Done. ${addedCount} new images added.`);