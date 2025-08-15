import { NextResponse } from 'next/server';
import { loadManifest, saveManifest } from '@/utils/manifest.server';

// Force dynamic execution to ensure fresh FS reads in all runtimes
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'Bad payload' }, { status: 400 });
    }
    const idSet = new Set<string>(ids.map((s: unknown) => String(s)));
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
    const baseSet = new Set<string>(Array.from(idSet).map(norm));

    const manifest = await loadManifest();
    let changed = 0;
    for (const it of manifest) {
      const src = String(it.src || '');
      const match = idSet.has(src) || baseSet.has(norm(src));
      if (!match) continue;
      const current = new Set<string>(Array.isArray(it.collections) ? it.collections : []);
      if (current.delete('home')) {
        it.collections = Array.from(current);
        changed++;
      }
    }
    if (changed > 0) {
      await saveManifest(manifest);
    }
    return NextResponse.json({ ok: true, changed });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to remove from Home' }, { status: 500 });
  }
}
