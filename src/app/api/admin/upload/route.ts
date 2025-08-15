import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import fssync from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { loadManifest, saveManifest, blobEnabled } from '@/utils/manifest.server';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';

async function ensureDir(p: string) {
	await fs.mkdir(p, { recursive: true });
}

export async function POST(req: Request) {
	try {
		const form = await req.formData();
		const files = form.getAll('files').filter(f => f instanceof File) as File[];
		if (!files.length) return NextResponse.json({ error: 'No files' }, { status: 400 });
	const publicDir = path.join(process.cwd(), 'public');
		// Decide target output folder based on admin context (portraits | weddings).
		let target = String(form.get('target') || 'portraits');
		if (target !== 'portraits' && target !== 'weddings' && target !== 'home') target = 'portraits';
			const imagesDir = path.join(publicDir, 'optimized', target === 'home' ? 'portraits' : target);
			// Optional comma-separated list of collections, e.g. "home"
			const collectionsRaw = String(form.get('collections') || '').trim();
			const initialCollections = collectionsRaw
				? collectionsRaw.split(',').map(s => s.trim()).filter(Boolean)
				: [];
		const allowDuplicate = String(form.get('allowDuplicate') || '') === '1';
		await ensureDir(imagesDir);
		const manifest = await loadManifest();
		const existingSrcs = new Set(manifest.map(m => m.src));
		const existingOriginals = new Set(
			manifest
				.map(m => m.original || m.src)
		);
		const normalizeBase = (p: string) => {
			try {
				const clean = p.split('?')[0];
				const name = clean.split('/').pop() || clean;
				return name.toLowerCase().replace(/\.(webp|avif|jpg|jpeg|png)$/i, '');
			} catch { return p.toLowerCase(); }
		};
		const existingNameHashes = new Set(
			manifest.map(m => normalizeBase(String(m.src || '')))
		);
		let duplicateDetected = false;

		for (const file of files) {
			const arrayBuffer = await file.arrayBuffer();
			const buf = Buffer.from(arrayBuffer);
			const image = sharp(buf, { failOn: 'none' });
			const meta = await image.metadata();
			const base = file.name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9-_]+/gi,'-').toLowerCase();
			const id = `${Date.now()}-${base}`; // unique prefix for safe replace semantics
			// Lightweight duplicate detection by normalized base name
			if (!allowDuplicate) {
				const likelyDup = existingNameHashes.has(base) || Array.from(existingNameHashes).some(h => h.endsWith(`-${base}`));
				if (likelyDup) {
					duplicateDetected = true;
					continue; // skip adding until user confirms
				}
			}
			// Produce resized master (max 2400px longest side)
			const resized = image.clone().resize({ width: meta.width && meta.height && meta.width >= meta.height ? 2400 : undefined, height: meta.width && meta.height && meta.height > meta.width ? 2400 : undefined, fit: 'inside', withoutEnlargement: true });
			const webpBuf = await resized.clone().webp({ quality: 86 }).toBuffer();
			const avifBuf = await resized.clone().avif({ quality: 50 }).toBuffer();
			const blurBuf = await resized.clone().resize(24).webp({ quality: 40 }).toBuffer();
			const folder = target === 'home' ? 'portraits' : target; // physical storage still in a category folder
			const webpName = `/optimized/${folder}/${id}.webp`;
			const avifName = `/optimized/${folder}/${id}.avif`;
			let srcUrl = webpName;
			if (blobEnabled()) {
				const baseKey = `optimized/${folder}/${id}`; // without extension
				// Upload to Blob with stable keys (no random suffix)
				const webpBlob = await put(`${baseKey}.webp`, webpBuf, { access: 'public', addRandomSuffix: false, contentType: 'image/webp' } as any);
				await put(`${baseKey}.avif`, avifBuf, { access: 'public', addRandomSuffix: false, contentType: 'image/avif' } as any);
				srcUrl = webpBlob.url; // absolute URL
			} else {
				await fs.writeFile(path.join(publicDir, webpName), webpBuf);
				await fs.writeFile(path.join(publicDir, avifName), avifBuf);
			}
			const item = {
				src: srcUrl,
				width: meta.width || 0,
				height: meta.height || 0,
				blurDataURL: `data:image/webp;base64,${blurBuf.toString('base64')}`,
				alt: '',
				original: srcUrl,
				category: target === 'home' ? undefined : target,
			collections: target === 'home' ? Array.from(new Set([...(initialCollections||[]), 'home'])) : (initialCollections.length ? initialCollections : undefined),
			};
			manifest.push(item);
		}
		if (duplicateDetected && !allowDuplicate) {
			return NextResponse.json({ error: 'duplicate', message: 'One or more images appear to already exist. Upload anyway?' }, { status: 409 });
		}
		await saveManifest(manifest);
		return NextResponse.json({ ok: true, count: files.length });
	} catch (e: any) {
		const msg = (e && (e.message || e.toString())) || 'Upload failed';
		return NextResponse.json({ error: msg }, { status: 500 });
	}
}
