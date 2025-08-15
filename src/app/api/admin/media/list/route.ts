import { NextResponse } from 'next/server';
import { loadManifest } from '@/utils/manifest.server';

export async function GET() {
	const manifest = await loadManifest();
	// Provide an id (use src) for ordering
	return NextResponse.json(manifest.map(m => ({ id: m.src, ...m })));
}
