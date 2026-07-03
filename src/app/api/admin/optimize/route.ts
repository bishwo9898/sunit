import { NextResponse } from 'next/server';
import sharp from 'sharp';

export const dynamic = 'force-dynamic';

// Max file size for upload (e.g., 20MB)
const MAX_SIZE = 20 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (max 20MB)' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get dynamic settings from headers or query (using headers for simplicity in bulk)
    const quality = parseInt(req.headers.get('X-Target-Quality') || '80');
    const maxWidth = parseInt(req.headers.get('X-Max-Width') || '2560');

    // Initialize sharp with the buffer
    const image = sharp(buffer);
    const metadata = await image.metadata();

    // Optimization Pipeline:
    // 1. Rotate based on EXIF
    // 2. Resize to a sane max width if it's a massive original (saving disk space)
    // 3. Convert to WebP with specific optimization flags
    //    - effort: 6 (slower but better compression)
    //    - quality: dynamic (standard photo: 75-85)
    //    - lossless: false
    
    let pipeline = image.rotate();

    if (metadata.width && metadata.width > maxWidth) {
      pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true, fit: 'inside' });
    }

    const optimizedBuffer = await pipeline
      .webp({ 
        quality: quality, 
        effort: 6,
        smartSubsample: true 
      })
      .toBuffer();

    const optimizedMetadata = await sharp(optimizedBuffer).metadata();

    // Return the optimized image with appropriate headers
    return new NextResponse(new Uint8Array(optimizedBuffer), {
      headers: {
        'Content-Type': 'image/webp',
        'Content-Disposition': `attachment; filename="${file.name.replace(/\.[^/.]+$/, "")}.webp"`,
        'X-Original-Size': file.size.toString(),
        'X-Optimized-Size': optimizedBuffer.length.toString(),
        'X-Optimized-Width': (optimizedMetadata.width || 0).toString(),
        'X-Optimized-Height': (optimizedMetadata.height || 0).toString(),
      },
    });
  } catch (error: any) {
    console.error('[Optimize API Error]:', error);
    return NextResponse.json({ error: error.message || 'Optimization failed' }, { status: 500 });
  }
}
