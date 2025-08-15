import { NextResponse } from 'next/server';
import { loadManifest, saveManifest } from '@/utils/manifest.server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

export async function POST() {
  try {
    const list = await loadManifest();
    const next = list.slice();
    shuffle(next);
    await saveManifest(next);
    return NextResponse.json({ ok: true, count: next.length });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to randomize' }, { status: 500 });
  }
}
