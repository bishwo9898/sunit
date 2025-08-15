import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { loadManifest, saveManifest } from '@/utils/manifest.server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
	try {
		const { id, alt, category, tags, collections } = await req.json();
		if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
		const manifest = await loadManifest();
		const idx = manifest.findIndex(m => m.src === id);
		if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
		if (typeof alt === 'string') manifest[idx].alt = alt;
		if (typeof category === 'string') manifest[idx].category = category || undefined;
		if (Array.isArray(tags)) manifest[idx].tags = tags;
		if (Array.isArray(collections)) manifest[idx].collections = collections;
		await saveManifest(manifest);
		return NextResponse.json({ ok: true });
	} catch (e) {
		return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
	}
}
