import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

interface Service { id: string; title: string; desc: string; price?: string; order: number; visible?: boolean; }
const dataPath = path.join(process.cwd(), 'data', 'services.json');
async function load(): Promise<Service[]> { try { return JSON.parse(await fs.readFile(dataPath,'utf8')); } catch { return []; } }
async function save(list: Service[]) { await fs.mkdir(path.dirname(dataPath), { recursive: true }); await fs.writeFile(dataPath, JSON.stringify(list, null, 2)); }

export async function POST(req: Request) {
  try {
    const { order } = await req.json();
    if(!Array.isArray(order)) return NextResponse.json({ error:'order must be array' }, { status:400 });
    const list = await load();
    const map = new Map(list.map(s=> [s.id, s] as const));
    const reordered: Service[] = [];
    let i = 0;
    for (const id of order) { const s = map.get(id); if (s) { s.order = i++; reordered.push(s); } }
    // append missing
    for (const s of list) if(!reordered.includes(s)) { s.order = i++; reordered.push(s); }
    await save(reordered);
    return NextResponse.json({ ok:true });
  } catch { return NextResponse.json({ error:'Failed' }, { status:500 }); }
}
