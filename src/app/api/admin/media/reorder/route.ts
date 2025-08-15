import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { loadManifest, saveManifest } from '@/utils/manifest.server';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
	try {
		const { order } = await req.json();
		if (!Array.isArray(order)) return NextResponse.json({ error: 'order must be array' }, { status: 400 });
		const manifest = await loadManifest();
		const map = new Map(manifest.map(m => [m.src, m] as const));
		const reordered = order.map((id: string) => map.get(id)).filter(Boolean) as NonNullable<typeof map.get extends any ? any : never>[] as any;
		// Type-safe cast: filter(Boolean) ensures no undefined; assert as ImgItem[] below
		const cleaned = reordered as any[];
		// Append any not included to avoid accidental loss
		manifest.forEach(m => { if (!cleaned.includes(m)) cleaned.push(m); });
		await saveManifest(cleaned as any);
		return NextResponse.json({ ok: true });
	} catch {
		return NextResponse.json({ error: 'Failed to reorder' }, { status: 500 });
	}
}
