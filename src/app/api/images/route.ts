import { NextResponse } from 'next/server';
import { loadManifest } from '@/utils/manifest.server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await loadManifest();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
