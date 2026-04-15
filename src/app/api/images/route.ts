import { NextResponse } from 'next/server';
import { loadManifest } from '@/utils/manifest.server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await loadManifest();
    return NextResponse.json(data, {
      headers: {
        // Cache in the browser/CDN for 5 minutes; Cloudinary is the source of truth
        'Cache-Control': 's-maxage=300, stale-while-revalidate=60',
      },
    });
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
