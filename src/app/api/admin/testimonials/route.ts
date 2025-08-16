import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { blobEnabled, readBlobJson, writeBlobJson } from '@/utils/manifest.server';

interface Testimonial { id: string; quote: string; name: string; stars?: number; visible?: boolean; }
const dataPath = path.join(process.cwd(), 'data', 'testimonials.json');
async function load(): Promise<Testimonial[]> {
	if (blobEnabled()) {
		return (await readBlobJson<Testimonial[]>('testimonials.json')) || [];
	}
	try { return JSON.parse(await fs.readFile(dataPath,'utf8')); } catch { return []; }
}
async function save(list: Testimonial[]) {
	if (blobEnabled()) {
		await writeBlobJson('testimonials.json', list);
		return;
	}
	await fs.mkdir(path.dirname(dataPath), { recursive: true }); await fs.writeFile(dataPath, JSON.stringify(list, null, 2));
}

export async function GET() { const list = await load(); return NextResponse.json(list); }
export async function PUT(req: Request) { const { quote } = await req.json(); if(!quote) return NextResponse.json({ error:'Quote required' }, { status:400 }); const list = await load(); const item: Testimonial = { id: Date.now().toString(36), quote, name: '— Client', stars:5, visible: true }; list.push(item); await save(list); return NextResponse.json(item); }
export async function POST(req: Request) { const body = await req.json(); const list = await load(); const idx = list.findIndex(t=> t.id === body.id); if(idx===-1) return NextResponse.json({ error:'Not found' }, { status:404 }); Object.assign(list[idx], body); await save(list); return NextResponse.json({ ok:true }); }
