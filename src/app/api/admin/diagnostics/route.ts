import { NextResponse } from 'next/server';
import { blobEnabled } from '@/utils/manifest.server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const hasUrl = !!process.env.BLOB_MANIFEST_URL;
    const hasKey = !!process.env.BLOB_MANIFEST_KEY;
    const hasToken = !!process.env.BLOB_READ_WRITE_TOKEN || !!process.env.VERCEL;
    return NextResponse.json({
      ok: true,
      blobEnabled: blobEnabled(),
      checks: { hasUrl, hasKey, hasToken, onVercel: !!process.env.VERCEL },
    });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
