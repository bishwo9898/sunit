import { NextResponse } from 'next/server';
import { loadManifest } from '@/utils/manifest.server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const data = await loadManifest();
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
