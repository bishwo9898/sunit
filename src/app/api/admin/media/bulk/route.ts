import { NextResponse } from 'next/server';
import { updateManifest } from '@/utils/manifest.server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { ids, add = [], remove = [] } = await req.json();
    if (!Array.isArray(ids) || (!Array.isArray(add) && !Array.isArray(remove))) {
      return NextResponse.json({ error: 'Bad payload' }, { status: 400 });
    }
    const addSet = new Set<string>(add.filter(Boolean));
    const removeSet = new Set<string>(remove.filter(Boolean));
    const norm = (p: string) => {
      try {
        const b = p.split('?')[0];
        const m = b.match(/([^/]+)$/);
        const name = m ? m[1] : b;
        return name.replace(/\.(webp|avif|jpe?g|png)$/i, '').toLowerCase();
      } catch {
        return p.toLowerCase();
      }
    };
    const idBases = new Set(ids.map((s: string) => norm(String(s))));
    await updateManifest(async (list) => {
      for (const it of list) {
        const base = norm(String(it.src || ''));
        if (!idBases.has(base) && !ids.includes(it.src)) continue;
        const current = new Set<string>(Array.isArray(it.collections) ? it.collections : []);
        for (const a of addSet) current.add(a);
        for (const r of removeSet) current.delete(r);
        it.collections = Array.from(current);
      }
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Bulk update failed' }, { status: 500 });
  }
}
