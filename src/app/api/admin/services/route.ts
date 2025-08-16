import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { blobEnabled, readBlobJson, writeBlobJson } from '@/utils/manifest.server';

interface Service { id: string; title: string; desc: string; price?: string; order: number; visible?: boolean; }

const dataPath = path.join(process.cwd(), 'data', 'services.json');

async function load(): Promise<Service[]> {
	if (blobEnabled()) {
		return (await readBlobJson<Service[]>('services.json')) || [];
	}
	try { const buf = await fs.readFile(dataPath,'utf8'); const json = JSON.parse(buf); return Array.isArray(json)? json: []; } catch { return []; }
}
async function save(data: Service[]) {
	if (blobEnabled()) {
		await writeBlobJson('services.json', data);
		return;
	}
	await fs.mkdir(path.dirname(dataPath), { recursive: true }); await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
}

export async function GET() { const list = await load(); return NextResponse.json(list.sort((a,b)=> a.order - b.order)); }

export async function PUT(req: Request) { const { title } = await req.json(); if(!title) return NextResponse.json({ error:'Title required' }, { status:400 }); const list = await load(); const item: Service = { id: Date.now().toString(36), title, desc: '', order: list.length? Math.max(...list.map(l=> l.order))+1:0, visible: true }; list.push(item); await save(list); return NextResponse.json(item); }

export async function POST(req: Request) { const body = await req.json(); const list = await load(); const idx = list.findIndex(s=> s.id === body.id); if(idx===-1) return NextResponse.json({ error:'Not found' }, { status:404 }); Object.assign(list[idx], body); await save(list); return NextResponse.json({ ok:true }); }
